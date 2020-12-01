import React from "react";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  settingsWrapper: {
    width: 40,
    height: 40,
    zIndex: 1000,
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
      width: 30,
      height: 30
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
    [theme.breakpoints.down('xs')]: {
      fontSize: "2rem"
    }
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
      <SettingsIcon className={classes.icon}/>
    </div>
  );
};

export default SettingsButton;
