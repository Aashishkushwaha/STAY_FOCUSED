export const APP_NAME = "STAY_FOCUSED";

export const SCHEMA_URL = process.env.REACT_APP_SCHEMA_LOCAL_URL;

export const initialTheme = "light";

export const initialSettingsState = {
  volume: 50,
  pomodoroGoal: 2,
  autoStart: false,
  pomodoroTimer: 20,
  longBreakTimer: 10,
  shortBreakTimer: 5,
  sound:
    "http://www.orangefreesounds.com/wp-content/uploads/2020/05/Alarm-ringtone.mp3?_=1",
  timerIndication: true,
  browserNotification: true,
};

export const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

export const afterDelay = (cb, delay) => {
  setTimeout(cb, delay);
};

export const clearAudioBuffer = () => {
  try {
    let audios = [...document.querySelectorAll("audio")];
    audios?.map((audio) => {
      audio.currentTime = 0;
      audio.pause();
      return null;
    });
  } catch (error) {
    console.error(error);
  }
};