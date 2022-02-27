export const APP_NAME = "STAY_FOCUSED";

export const SCHEMA_URL = process.env.REACT_APP_SCHEMA_LOCAL_URL;

export const initialTheme = "light";

// audio urls changed due to saving in localstorage
export const initialSettingsState = {
  volume: 50,
  pomodoroGoal: 2,
  autoStart: false,
  pomodoroTimer: 20,
  longBreakTimer: 10,
  shortBreakTimer: 5,
  sound: "Alarm Tone",
  timerIndication: true,
  browserNotification: true,
};

export const browserNotificationsEnabled = () => {
  if (window?.Notification) return Notification.permission;
  else return "denied";
};

export const getUserPermissionForNotifications = () => {
  if (Notification.permission !== "denied") {
    Notification.requestPermission((permission) => {
      console.log(permission);
    });
  }
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

export const clearAudioBuffer = (audioFile) => {
  try {
    if (audioFile) {
      audioFile.currentTime = 0;
      audioFile.pause();
    }
  } catch (error) {
    console.error(error);
  }
};

export let audioFile = null;

export const initAudio = () => {
  audioFile = new Audio(`/sounds/${initialSettingsState.sound}.mp3`);
  audioFile.volume = initialSettingsState.volume / 100;
};

export const playSound = (sound, volume) => {
  clearAudioBuffer();
  const settings = getFromLocalStorage(`${APP_NAME}_settings`);
  if (audioFile) {
    audioFile.src = sound || `/sounds/${settings.sound}.mp3`;
    audioFile.volume = (volume || settings.volume) / 100;
    audioFile.play();
  }
};
