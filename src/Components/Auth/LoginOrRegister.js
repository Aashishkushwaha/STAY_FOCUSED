import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  makeStyles,
} from "@material-ui/core";
import axios from "axios";
import {
  saveToLocalStorage,
  showToast,
  APP_NAME,
  API_BASE_URL,
} from "../../utils";
import LoadingScreen from "../LoadingScreen";

const useStyles = makeStyles(() => ({
  root: {
    top: "50%",
    left: "50%",
    position: "absolute",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "28rem",
  },
  heading: {
    fontSize: "1.4rem",
    textAlign: "center",
    fontWeight: "700",
    color: "#000",
    textTransform: "capitalize",
  },
  textField: {
    margin: "0.35rem auto",
  },
  button: {
    margin: ".5rem 0",
  },
  toggleLink: {
    margin: ".5rem 0",
    textAlign: "center",
    "& span": {
      fontWeight: "700",
    },
    "& a": {
      textTransform: "capitalize",
    },
  },
}));

const Login = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const currentPage = pathname.split("/")[1];

  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const resetFormFields = () => {
    setUserData({ username: "", password: "" });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        data: { token = "", message },
      } = await axios.post(`${API_BASE_URL}/auth/${currentPage}`, userData);

      if (currentPage === "login")
        saveToLocalStorage(`${APP_NAME}_token`, token);

      resetFormFields();
      showToast(message, { variant: "success" });
      setTimeout(() => {
        navigate(`/${currentPage === "login" ? "app" : "login"}`);
      }, 1000);
    } catch (err) {
      const { message } = err.response.data;
      showToast(message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={classes.root}>
      <LoadingScreen visible={loading} />
      <CardContent>
        <form onSubmit={submitHandler}>
          <Typography className={classes.heading} gutterBottom>
            {currentPage}
          </Typography>
          <TextField
            className={classes.textField}
            fullWidth
            value={userData.username}
            onChange={(e) =>
              setUserData({ ...userData, username: e.target.value })
            }
            variant="outlined"
            required
            type="email"
            label="Username"
            placeholder="Username"
          />
          <TextField
            className={classes.textField}
            fullWidth
            value={userData.password}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            variant="outlined"
            required
            label="Password"
            type="password"
            placeholder="Password"
          />
          <Button
            fullWidth
            type="submit"
            className={classes.button}
            color="primary"
            variant="contained"
            size="medium"
          >
            {currentPage}
          </Button>
        </form>
        <Typography className={classes.toggleLink} variant="body2">
          <span>
            {currentPage === "login" ? "New user ? " : "Already a member ? "}
            <Link to={`/${currentPage === "login" ? "register" : "login"}`}>
              {currentPage === "login" ? "register" : "login"}
            </Link>
          </span>
          <br />
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Login;
