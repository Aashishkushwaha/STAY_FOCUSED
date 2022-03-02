import React, { useState, useEffect } from "react";
import themes from "./theme";
import Header from "./Components/Header";
import TodoList from "./Components/Todo/TodoList";
import ThemeToggler from "./Components/ThemeToggler";
import Pomodoro from "./Components/Pomodoro/Pomodoro";
import { ThemeProvider, Grid } from "@material-ui/core";
import SettingsModal from "./Components/Settings/SettingsModal";
import SettingsButton from "./Components/Settings/SettingsButton";
import { ToastContainer } from "react-toastify";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import {
  APP_NAME,
  SCHEMA_URL,
  getFromLocalStorage,
  initAudio,
  initialSettingsState,
  showToast,
  saveToLocalStorage,
  API_BASE_URL,
} from "./utils";
import axios from "axios";
import { useLocation } from "react-router-dom";
import LoginOrRegister from "./Components/Auth/LoginOrRegister";
import LogoutButton from "./Components/LogoutButton";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [theme, changeTheme] = useState(
    getFromLocalStorage(`${APP_NAME}_selected_theme`) || "light"
  );
  const token = getFromLocalStorage(`${APP_NAME}_token`);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [todos, setTodos] = useState({
    header: "My Tasks",
    // items: getFromLocalStorage(`${APP_NAME}_todos_items`) || [],
    items: [],
  });

  const [schema, setSchema] = useState("");
  const [openSettings, setOpenSettings] = useState(false);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        if (token && pathname === "/app") {
          setLoading(true);
          const {
            data: { todos },
          } = await axios.get(`${API_BASE_URL}/todos`, {
            headers: {
              authorization: `Bearer ${token}`,
            },
          });
          setTodos((oldValue) => ({ ...oldValue, items: todos }));
        }
      } catch (err) {
        showToast("Session expired", { variant: "error" });
        saveToLocalStorage(`${APP_NAME}_token`, "");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const mainContent = (
    <>
      <SettingsButton data={{ open: openSettings, setOpen: setOpenSettings }} />
      <LogoutButton setTodos={setTodos} />
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
          <TodoList data={{ loading, todos, setTodos }} />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <Pomodoro settings={settings} />
        </Grid>
      </Grid>
    </>
  );

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
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginOrRegister />} />
          <Route path="/register" element={<LoginOrRegister />} />
          <Route
            path="/app"
            element={token ? mainContent : <Navigate to="/login" />}
          />
        </Routes>
      </ThemeProvider>
    </main>
  );
}

export default App;
