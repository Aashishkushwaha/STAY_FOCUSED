import React, { useState, useEffect } from "react";
import themes from "./theme";
import Header from "./Components/Header";
import TodoList from "./Components/Todo/TodoList";
import ThemeToggler from "./Components/ThemeToggler";
import Pomodoro from "./Components/Pomodoro/Pomodoro";
import { ThemeProvider, Grid } from "@material-ui/core";
import SettingsModal from "./Components/Settings/SettingsModal";
import SettingsButton from "./Components/Settings/SettingsButton";
import { ToastContainer, toast } from "react-toastify";
import {
  APP_NAME,
  SCHEMA_URL,
  getFromLocalStorage,
  initAudio,
  initialSettingsState,
  audioFile,
  clearAudioBuffer,
} from "./utils";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [theme, changeTheme] = useState(
    getFromLocalStorage(`${APP_NAME}_selected_theme`) || "light"
  );

  const [todos, setTodos] = useState({
    header: "My Tasks",
    items: getFromLocalStorage(`${APP_NAME}_todos_items`) || [],
  });

  const [schema, setSchema] = useState("");
  const [openSettings, setOpenSettings] = useState(false);
  const [settings, setSettings] = useState(
    getFromLocalStorage(`${APP_NAME}_settings`) || initialSettingsState
  );

  useEffect(() => {
    async function fetchData(URL) {
      let response = await (await fetch(URL)).json();
      initAudio();
      setSchema(response);
    }

    fetchData(SCHEMA_URL);
  }, []);

  return (
    <main>
      <ThemeProvider theme={themes[theme]}>
        <ToastContainer
          position="bottom-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
        />
        <Header />
        <ThemeToggler data={{ theme, changeTheme }} />
        <SettingsButton
          data={{ open: openSettings, setOpen: setOpenSettings }}
        />
        {schema?.settings && (
          <SettingsModal
            settingsSchema={schema?.settings}
            settingsState={settings}
            setSettingsState={setSettings}
            open={openSettings}
            setOpen={setOpenSettings}
          />
        )}
        <Grid className="main__container" container spacing={2}>
          <Grid item xs={12} md={5} lg={4}>
            <TodoList data={{ todos, setTodos }} />
          </Grid>
          <Grid item xs={12} md={7} lg={8}>
            <Pomodoro settings={settings} />
          </Grid>
        </Grid>
      </ThemeProvider>
    </main>
  );
}

export const showToast = (msg, { variant } = "info") => {
  audioFile &&
    setTimeout(() => {
      clearAudioBuffer(audioFile);
    }, 4000);
  switch (variant) {
    case "success":
      toast.success(msg);
      break;
    case "error":
      toast.error(msg);
      break;
    case "info":
    default:
      toast.info(msg);
      break;
  }
};

export default App;
