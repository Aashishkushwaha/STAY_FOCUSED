import React, { useState } from "react";
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
  clearAudioBuffer,
} from "../../utils";

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
  },
}));

export default function SettingsModal({ settings, open, setOpen }) {
  const {
    header,
    checkboxes,
    volume,
    timers,
    buttons,
    sounds,
    goal,
  } = settings;
  const [settingsState, setSettingsState] = useState(
    getFromLocalStorage(`${APP_NAME}_settings`) || initialSettingsState
  );
  let audioFile = document.querySelector(`audio[src="${settingsState.sound}"]`);

  const buttonHandlers = [];
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
    afterDelay(
      setSettingsState(getFromLocalStorage(`${APP_NAME}_settings`)),
      1000
    );
  };

  const onChange = (e, type) => {
    if (type === "checkbox") {
      alert(e.target.checked);
      setSettingsState({ ...settingsState, [e.target.name]: e.target.checked });
    } else if (type === "number") {
      setSettingsState({
        ...settingsState,
        [e.target.name]: parseInt(e.target.value),
      });
    } else if (type === "text") {
      setSettingsState({
        ...settingsState,
        [e.target.name]: e.target.value,
      });
    }
  };

  const onSaveClick = () => {
    saveToLocalStorage(`${APP_NAME}_settings`, settingsState);
    setOpen(false);
  };

  const onResetClick = () => {
    setSettingsState(initialSettingsState);
    saveToLocalStorage(`${APP_NAME}_settings`, initialSettingsState);
    setOpen(false);
  };

  const onSoundTestClick = () => {
    clearAudioBuffer();

    if (audioFile) {
      audioFile.volume = settingsState.volume / 100;
      audioFile.play();
    }
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
            placeholder="Placeholder"
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
            <Typography variant="body1">
              {`${timers.header} ${timers.subheader}`}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  type="number"
                  id="outlined-number"
                  fullWidth
                  label={timers.pomodoro.label}
                  name={timers.pomodoro.name}
                  onChange={(e) => onChange(e, "number")}
                  margin="dense"
                  variant="outlined"
                  value={settingsState.pomodoroTimer}
                  helperText={`(max ${timers.pomodoro.max} min.)`}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    inputProps: {
                      max: timers.pomodoro.max,
                      min: timers.pomodoro.min,
                    },
                  }}
                  placeholder="Placeholder"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  type="number"
                  id="outlined-number"
                  fullWidth
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
                  placeholder="Placeholder"
                  helperText={`(max ${timers.shortbreak.max} min.)`}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  type="number"
                  id="outlined-number"
                  fullWidth
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
                  helperText={`(max ${timers.longbreak.max} min.)`}
                  placeholder="Placeholder"
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
