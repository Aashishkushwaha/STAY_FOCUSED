import React from "react";
import ReactDOM from "react-dom";
import { config } from "dotenv";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import themes from "./theme";
import {
  APP_NAME,
  getFromLocalStorage,
  saveToLocalStorage,
  initialSettingsState,
} from "./utils";


window.onload = function () {
  config();
  if (!getFromLocalStorage(`${APP_NAME}_settings`)) {
    saveToLocalStorage(`${APP_NAME}_settings`, initialSettingsState);
  }
  if (!getFromLocalStorage(`${APP_NAME}_selected_theme`)) {
    saveToLocalStorage(`${APP_NAME}_selected_theme`, "light");
  }
};

document.body.style.backgroundColor =
  themes[
    getFromLocalStorage(`${APP_NAME}_selected_theme`) || "light"
  ].palette.primary.main;

ReactDOM.render(<App />, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
