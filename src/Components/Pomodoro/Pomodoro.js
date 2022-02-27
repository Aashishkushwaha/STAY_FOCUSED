import React, { useState, useEffect, useCallback } from "react";
import {
  Tab,
  Tabs,
  Grid,
  Paper,
  Button,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { playSound, showBrowserNotification } from "../../utils";
import { showToast } from "../../App";

const useStyles = makeStyles(() => ({
  root: {
    margin: "1rem 0",
    padding: "1rem 1.5rem",
    minHeight: "80vh",
    position: "relative",
  },
  heading: {
    fontSize: "1.4rem",
    fontWeight: "400",
  },
  tabsRoot: {
    width: "90%",
    maxWidth: "600px",
    margin: "0.5rem auto",
  },
  button: {
    margin: "0 .5rem",
  },
  goalsLabel: {
    position: "absolute",
    left: "1.5rem",
    bottom: "1.5rem",
  },
  timer: {
    margin: "9rem auto",
    fontSize: "clamp(2rem, 25vw, 8rem)",
    textAlign: "center",
  },
}));

const Pomodoro = ({ header = "Pomodoro", settings }) => {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [turn, setTurn] = useState("timer");
  const [timerId, setTimerId] = useState(null);
  const [timerCompletedCount, setTimerCompletedCountCount] = useState(0);
  const [timerStatus, setTimerStatus] = useState("paused");
  const [minutes, setMinutes] = useState(settings?.pomodoroTimer);
  const [shortBreaksCompleted, setShortBreaksCompleted] = useState(0);
  const [longTaskCompleted, setLongTaskCompleted] = useState(false);

  const autoStart = settings?.autoStart;

  const handleTabChange = (event, newValue, sameTab) => {
    const intializeTimer = (turn, minutes) => {
      pauseTimer();
      setSeconds(0);
      setTurn(turn);
      setMinutes(minutes);
    };

    setCurrentTab(newValue);
    if (currentTab !== newValue || sameTab) {
      switch (newValue) {
        case 0:
          return intializeTimer("timer", settings?.pomodoroTimer);
        case 1:
          return intializeTimer("shortbreak", settings?.shortBreakTimer);
        case 2:
          return intializeTimer("longbreak", settings?.longBreakTimer);
        default:
          break;
      }
    }
  };

  const tick = () => {
    setSeconds((seconds) => seconds - 1);
  };

  useEffect(() => {
    settings?.timerIndication &&
      (document.title = `${minutes}:${seconds} | Stay Focused`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  const pauseTimer = useCallback(() => {
    setTimerStatus("paused");
    if (timerId) clearInterval(timerId);
  }, [timerId]);

  const startTimer = useCallback(() => {
    pauseTimer();
    setTimerStatus("running");
    let timer = setInterval(tick, 1000);
    setTimerId(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pauseTimer]);

  const resetTimer = useCallback(() => {
    document.title = "Stay Focused | Pomodoro";
    switch (turn) {
      case "timer":
        if (
          shortBreaksCompleted % 2 === 0 &&
          shortBreaksCompleted &&
          !longTaskCompleted
        ) {
          setCurrentTab(2);
          setTurn("longbreak");
          setMinutes(settings?.longBreakTimer);
        } else {
          setCurrentTab(1);
          setTurn("shortbreak");
          setMinutes(settings?.shortBreakTimer);
          if (longTaskCompleted) setLongTaskCompleted(false);
        }
        if (autoStart) startTimer();
        setTimerCompletedCountCount((timer) => timer + 1);
        setTimerStatus("completed");
        setSeconds(0);
        break;
      case "shortbreak":
        setSeconds(0);
        setTurn("timer");
        setCurrentTab(0);
        setTimerStatus("completed");
        setMinutes(settings?.pomodoroTimer);
        setShortBreaksCompleted((breaks) => breaks + 1);
        if (autoStart) startTimer();
        break;
      case "longbreak":
        setSeconds(0);
        setCurrentTab(0);
        setTurn("timer");
        setLongTaskCompleted(true);
        setTimerStatus("completed");
        setMinutes(settings?.pomodoroTimer);
        if (autoStart) startTimer();
        break;
      default:
        break;
    }
  }, [
    turn,
    autoStart,
    startTimer,
    longTaskCompleted,
    shortBreaksCompleted,
    settings?.longBreakTimer,
    settings?.shortBreakTimer,
    settings?.pomodoroTimer,
  ]);

  const resetSkipClickHandler = () => {
    if (turn === "shortbreak") setShortBreaksCompleted((breaks) => breaks + 1);
    handleTabChange(null, 0, true);
  };

  useEffect(() => {
    if (seconds === -1) {
      if (minutes > 0) {
        setMinutes((minutes) => minutes - 1);
        setSeconds(59);
      } else {
        const msg = `${turn.charAt(0).toUpperCase() + turn.slice(1)} got over.`;
        showToast(msg, {
          variant: "info",
        });
        settings?.browserNotification && showBrowserNotification(msg);
        playSound();
        clearInterval(timerId);
        resetTimer();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, seconds, minutes, timerId, resetTimer]);

  useEffect(() => {
    pauseTimer();
    if (turn === "timer") setMinutes(settings?.pomodoroTimer);
    else if (turn === "shortbreak") setMinutes(settings?.shortBreakTimer);
    else setMinutes(settings?.longBreakTimer);
    setSeconds(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  return (
    <Paper className={classes.root}>
      <p className={classes.heading}>{header}</p>
      <Paper elevation={0} className={classes.tabsRoot}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Timer" />
          <Tab label="Short Break" />
          <Tab label="Long Break" />
        </Tabs>
      </Paper>
      <Grid>
        <Typography
          variant="h1"
          component="h1"
          className={`${classes.timer} pomodoro__screen`}
        >
          {minutes < 10 ? `0${minutes}` : minutes} :{" "}
          {seconds < 10 ? `0${seconds}` : seconds}
        </Typography>
        <Grid container justifyContent="center">
          <Button
            className={classes.button}
            onClick={timerStatus === "running" ? pauseTimer : startTimer}
            variant="contained"
            color="primary"
          >
            {timerStatus === "running" ? "Pause" : "Start"}
          </Button>
          <Button
            className={classes.button}
            onClick={resetSkipClickHandler}
            variant="outlined"
          >
            {turn === "timer" ? "Reset" : "Skip"}
          </Button>
        </Grid>
      </Grid>
      <Typography variant="body2" className={classes.goalsLabel}>
        Pomodoro Completed (Today) : {timerCompletedCount} /{" "}
        {settings?.pomodoroGoal}
      </Typography>
    </Paper>
  );
};

export default Pomodoro;
