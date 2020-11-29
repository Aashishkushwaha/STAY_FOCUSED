import React, { useEffect } from "react";
import LightModeIcon from "@material-ui/icons/Brightness7";
import DarkModeIcon from "@material-ui/icons/Brightness4";
import { makeStyles } from "@material-ui/core/styles";
import { APP_NAME, saveToLocalStorage } from "../utils";
import themes from "../theme";

const useStyles = makeStyles((theme) => ({
  toggleWrapper: {
    width: 40,
    height: 40,
    right: "2rem",
    display: "flex",
    bottom: "1.2rem",
    cursor: "pointer",
    position: "fixed",
    borderRadius: "50%",
    alignItems: "center",
    background: "#fff",
    justifyContent: "center",
    zIndex: 10000,
    [theme.breakpoints.down('xs')]: {
      width: 35,
      height: 35
    },

    "&:hover": {
      boxShadow: "0 0 .3rem 2px #fff",

      "& > *": {
        transform: "scale(1.1)",
      },
    },
  },
  icon: {
    transition: "transform .1s",
    backfaceVisibility: "hidden",
  },
}));

const ThemeToggler = ({ data }) => {
  const classes = useStyles();
  const { theme, changeTheme } = data;

  const toggleTheme = () => {
    let newTheme = theme === "light" ? "dark" : "light";
    saveToLocalStorage(`${APP_NAME}_selected_theme`, newTheme);
    document.body.style.backgroundColor = themes[newTheme].palette.primary.main;
    changeTheme(newTheme);
  };

  useEffect(() => {
    // saveToLocalStorage(`${APP_NAME}_selected-theme`, theme);
    // document.body.style.backgroundColor = themes[theme].palette.primary.main;
  }, [theme]);

  return (
    <div className={classes.toggleWrapper} onClick={toggleTheme}>
      {theme === "light" ? (
        <DarkModeIcon className={classes.icon} />
      ) : (
        <LightModeIcon className={classes.icon} />
      )}
    </div>
  );
};

export default ThemeToggler;
