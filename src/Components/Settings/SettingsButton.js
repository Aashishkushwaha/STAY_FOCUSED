import React from "react";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  settingsWrapper: {
    width: 40,
    height: 40,
    right: "2rem",
    top: "1.5rem",
    display: "flex",
    cursor: "pointer",
    position: "fixed",
    background: "#fff",
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down('xs')]: {
      top: "1rem",
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

const SettingsButton = ({ data }) => {
  const classes = useStyles();
  const { open, setOpen } = data;

  const toggleTheme = () => {
    setOpen(!open);
  };

  return (
    <div className={classes.settingsWrapper} onClick={toggleTheme}>
      <SettingsIcon />
    </div>
  );
};

export default SettingsButton;
