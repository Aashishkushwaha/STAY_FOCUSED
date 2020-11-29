import React from "react";
import { Paper, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    margin: "1rem 0",
    padding: "1rem 1.5rem",
    minHeight: "80vh",
    position: "relative",
  },
}));

const Pomodoro = ({ header = "Pomodoro" }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography variant="h5">{header}</Typography>
    </Paper>
  );
};

export default Pomodoro;
