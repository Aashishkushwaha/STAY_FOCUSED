import React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  DialogTitle,
  makeStyles,
  Checkbox,
  FormControlLabel,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Grid,
} from "@material-ui/core";
import {
  initialSettingsState,
  saveToLocalStorage,
  APP_NAME,
  getFromLocalStorage,
  afterDelay,
  audioFile,
  clearAudioBuffer,
  playSound,
} from "../../utils";
import {
  browserNotificationsEnabled,
  getUserPermissionForNotifications,
} from "../../utils";
import { showToast } from "../../App";

const useStyles = makeStyles((theme) => ({
  container: {},
  checkBox: {
    margin: ".2rem .4rem",
    padding: ".5rem",
    "&:checked": {
      color: `${theme.palette.primary.main} !important`,
    },
  },
  formControl: {
    margin: ".6rem 0 .4rem",
    width: "100%",
    "& .MuiFormHelperText-contained": {
      margin: "4px",
      marginBottom: "0px",
    },
    "& input:invalid": {
      color: "tomato",
    },
    "& input:invalid + *": {
      borderColor: "tomato",
      "& > * > *": {
        color: "tomato",
      },
    },
  },
  timerContainerHeader: {
    marginBottom: ".6rem !important",
  },
  timerItemContainer: {
    padding: "0px 8px !important",
    marginTop: ".25rem !important",
  },
}));

const validateData = (data, settings) => {
  if (
    data.pomodoroGoal < settings.goal.min ||
    data.pomodoroGoal > settings.goal.max ||
    data.pomodoroTimer < settings.timers.pomodoro.min ||
    data.pomodoroTimer > settings.timers.pomodoro.max ||
    data.shortBreakTimer < settings.timers.shortbreak.min ||
    data.shortBreakTimer > settings.timers.shortbreak.max ||
    data.longBreakTimer < settings.timers.longbreak.min ||
    data.longBreakTimer > settings.timers.longbreak.max
  ) {
    return 0;
  } else return 1;
};

export default function SettingsModal({
  settingsSchema,
  settingsState,
  setSettingsState,
  open,
  setOpen,
}) {
  const { header, checkboxes, volume, timers, buttons, sounds, goal } =
    settingsSchema;
  const buttonHandlers = [];
  const classes = useStyles();

  const handleClose = () => {
    clearAudioBuffer(audioFile);
    setOpen(false);
    afterDelay(
      setSettingsState(getFromLocalStorage(`${APP_NAME}_settings`)),
      1000
    );
  };

  const onChange = (e, type) => {
    if (type === "checkbox") {
      setSettingsState({ ...settingsState, [e.target.name]: e.target.checked });

      if (e.target.name === "browserNotification" && e.target.checked) {
        if (browserNotificationsEnabled() === "default") {
          getUserPermissionForNotifications();
        } else {
          if (browserNotificationsEnabled() === "granted") {
            console.log("show notification");
            // new Notification("Sample", {
            //   body: "This is the body.",
            // });

            if (document.visibilityState === "visible") {
              return;
            }
            var title = "Stay Focused";
            // var icon = "image-url";
            var body = "Message to be displayed";
            var notification = new Notification(title, { body });
            notification.onclick = () => {
              notification.close();
              window.parent.focus();
            };
          }
        }
      }
    } else if (type === "number") {
      let value = parseInt(e.target.value);
      if (e.target.name === "volume" && audioFile) {
        audioFile.volume = e.target.value / 100;
      }
      setSettingsState({
        ...settingsState,
        [e.target.name]: isNaN(value) ? "" : value,
      });
    } else if (type === "text") {
      if (e.target.name === "sound" && audioFile) {
        audioFile.src = `/sounds/${e.target.value}.mp3`;
      }
      setSettingsState({
        ...settingsState,
        [e.target.name]: e.target.value,
      });
    }
  };

  const onSaveClick = () => {
    clearAudioBuffer(audioFile);
    if (validateData(settingsState, settingsSchema)) {
      saveToLocalStorage(`${APP_NAME}_settings`, settingsState);
      setOpen(false);
      showToast("Settings saved successfully.", { variant: "success" });
    } else {
      showToast("Error, please provided correct data.", {
        variant: "error",
      });
      setSettingsState(getFromLocalStorage(`${APP_NAME}_settings`));
    }
  };

  const onResetClick = () => {
    clearAudioBuffer(audioFile);
    setSettingsState(initialSettingsState);
    saveToLocalStorage(`${APP_NAME}_settings`, initialSettingsState);
    setOpen(false);
  };

  const onSoundTestClick = () => {
    playSound(`/sounds/${settingsState.sound}.mp3`, settingsState.volume);
  };

  buttonHandlers.push(onSaveClick, onResetClick, onSoundTestClick);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle style={{ paddingBottom: "0" }} id="form-dialog-title">
          {header}
        </DialogTitle>
        <DialogContent style={{ paddingTop: "0" }}>
          {checkboxes.map((item) => {
            return (
              <div key={item.name}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={item.name}
                      className={classes.checkBox}
                      checked={settingsState[item.name]}
                      onChange={(e) => onChange(e, "checkbox")}
                      color="primary"
                    />
                  }
                  label={<span className={classes.label}>{item.label}</span>}
                  labelPlacement="end"
                />
              </div>
            );
          })}
          <TextField
            className={classes.formControl}
            type="number"
            id="outlined-number"
            label={goal.label}
            name={goal.name}
            variant="outlined"
            required
            onChange={(e) => onChange(e, "number")}
            value={settingsState.pomodoroGoal}
            InputProps={{
              inputProps: {
                max: goal.max,
                min: goal.min,
              },
            }}
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="goals target for today"
          />
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-controlled-open-select-label">
              {sounds.header}
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              name={sounds.name}
              value={settingsState.sound}
              onChange={(e) => onChange(e, "text")}
              label={sounds.header}
            >
              {sounds.options.map((option) => {
                return (
                  <MenuItem key={option.url} value={option.url}>
                    {option.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-controlled-open-select-label">
              {volume.header}
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              name={volume.name}
              value={settingsState.volume}
              onChange={(e) => onChange(e, "number")}
              label={volume.header}
            >
              {volume.options.map((option) => {
                return (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl variant="outlined" className={classes.formControl}>
            <Typography
              variant="body1"
              className={classes.timerContainerHeader}
            >
              {`${timers.header} ${timers.subheader}`}
            </Typography>
            <Grid container spacing={2}>
              <Grid className={classes.timerItemContainer} item xs={12} sm={4}>
                <TextField
                  type="number"
                  id="outlined-number"
                  fullWidth
                  required
                  label={timers.pomodoro.label}
                  name={timers.pomodoro.name}
                  onChange={(e) => onChange(e, "number")}
                  margin="dense"
                  variant="outlined"
                  value={settingsState.pomodoroTimer}
                  helperText={`(min ${timers.pomodoro.min} / max ${timers.pomodoro.max} min.)`}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    inputProps: {
                      max: timers.pomodoro.max,
                      min: timers.pomodoro.min,
                    },
                  }}
                  placeholder="Pomodoro Time"
                />
              </Grid>
              <Grid className={classes.timerItemContainer} item xs={12} sm={4}>
                <TextField
                  type="number"
                  id="outlined-number"
                  fullWidth
                  required
                  onChange={(e) => onChange(e, "number")}
                  label={timers.shortbreak.label}
                  name={timers.shortbreak.name}
                  margin="dense"
                  variant="outlined"
                  value={settingsState.shortBreakTimer}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    inputProps: {
                      max: timers.shortbreak.max,
                      min: timers.shortbreak.min,
                    },
                  }}
                  placeholder="Short Break Time"
                  helperText={`(min ${timers.shortbreak.min} / max ${timers.shortbreak.max} min.)`}
                />
              </Grid>
              <Grid className={classes.timerItemContainer} item xs={12} sm={4}>
                <TextField
                  type="number"
                  id="outlined-number"
                  fullWidth
                  required
                  onChange={(e) => onChange(e, "number")}
                  label={timers.longbreak.label}
                  name={timers.longbreak.name}
                  margin="dense"
                  variant="outlined"
                  value={settingsState.longBreakTimer}
                  InputProps={{
                    inputProps: {
                      max: timers.longbreak.max,
                      min: timers.longbreak.min,
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText={`(min ${timers.longbreak.min} / max ${timers.longbreak.max} min.)`}
                  placeholder="Long Break Time"
                />
              </Grid>
            </Grid>
          </FormControl>
        </DialogContent>
        <DialogActions>
          {buttons.map((button, index) => (
            <Button
              key={button}
              variant="outlined"
              onClick={buttonHandlers[index]}
              color="primary"
            >
              {button}
            </Button>
          ))}
        </DialogActions>
      </Dialog>
    </div>
  );
}
