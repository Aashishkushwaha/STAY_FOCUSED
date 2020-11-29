import React from "react";
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  header: {
    padding: ".8rem 1.2rem",
    color: "#fff",
    borderRadius: ".2rem",
    display: "flex",
    justifyContent: "space-between",
    "& > *": {
      fontSize: "1.5rem",
      fontWeight: 800
    }
  }
}))

function Header() {
  const classes = useStyles();

  return (
    <div className={classes.header}>
      <Typography component="h1">Stay Focused</Typography>
    </div>
  );
}

export default Header;
