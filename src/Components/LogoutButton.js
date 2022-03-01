import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@material-ui/icons/ExitToAppTwoTone";
import { makeStyles } from "@material-ui/core/styles";
import { APP_NAME, saveToLocalStorage } from "../utils";
import { showToast } from "../App";

const useStyles = makeStyles((theme) => ({
  settingsWrapper: {
    width: 40,
    height: 40,
    zIndex: 1000,
    right: "6rem",
    top: "1.5rem",
    display: "flex",
    cursor: "pointer",
    position: "fixed",
    background: "#fff",
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      top: "1rem",
      width: 30,
      height: 30,
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
    [theme.breakpoints.down("xs")]: {
      fontSize: "2rem",
    },
  },
}));

const SettingsButton = ({ data }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const logout = () => {
    saveToLocalStorage(`${APP_NAME}_token`, "");
    showToast("Logged out successfully.", { variant: "success" });
    setTimeout(() => navigate("/login", { replace: true }), 500);
  };

  return (
    <div className={classes.settingsWrapper} onClick={logout}>
      <LogoutIcon color="primary" className={classes.icon} />
    </div>
  );
};

export default SettingsButton;
