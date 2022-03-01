import React, { useState } from "react";
import {
  Typography,
  Paper,
  makeStyles,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import TodoItem from "./TodoItem";
import { useNavigate } from "react-router-dom";
import {
  saveToLocalStorage,
  APP_NAME,
  showToast,
  getFromLocalStorage,
  API_BASE_URL,
} from "../../utils";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "1rem 0",
    padding: "1rem 1.5rem",
    minHeight: "80vh",
    position: "relative",
  },
  heading: {
    fontSize: "1.4rem",
    fontWeight: "400",
  },
  textField: {
    width: "100%",
    margin: "1rem 0",
    marginBottom: "0",
    "& .MuiFormHelperText-contained": {
      margin: "4px",
      marginBottom: "0px",
    },
  },
  pagination: {
    marginTop: "1rem",
    width: "100%",
    position: "absolute",
    bottom: "1.2rem",
    left: "50%",
    transform: "translateX(-50%)",
    "& ul": {
      display: "flex",
      justifyContent: "center",
    },
  },
  infoLabel: {
    margin: "1rem 0rem",
  },
  spinner: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

const TodoList = ({ data }) => {
  const classes = useStyles();
  const { todos, setTodos, loading } = data;
  const { header, items } = todos;
  const navigate = useNavigate();

  const TODOS_PER_PAGE = 7;
  const token = getFromLocalStorage(`${APP_NAME}_token`);

  const [taskName, setTaskName] = useState("");
  const [editableTodoId, setEditableTodoId] = useState(null);
  const [page, setPage] = useState(1);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const logout = () => {
    showToast("Session expired", { variant: "error" });
    saveToLocalStorage(`${APP_NAME}_token`, "");
    navigate("/login");
  };

  const editHandler = (id, text) => {
    setTaskName(text);
    setEditableTodoId(id);
  };

  const addTodo = async () => {
    if (taskName.trim() === "" || taskName.trim().length > 35) {
      return showToast("Enter task name... (max. 35 characters allowed)", {
        variant: "error",
      });
    }

    if (editableTodoId) return editTodo();

    try {
      const {
        data: { todo, message },
      } = await axios.post(
        `${API_BASE_URL}/todos`,
        { text: taskName },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      let newItems = [todo, ...items];

      setTaskName("");
      showToast(message, { variant: "success" });
      setTodos({ ...todos, items: newItems });
    } catch (err) {
      logout();
    }
  };

  const editTodo = async () => {
    let index = items.findIndex((item) => item._id === editableTodoId);
    let newItems = [...todos.items];

    if (index !== -1) {
      try {
        const {
          data: { message },
        } = await axios.put(
          `${API_BASE_URL}/todos`,
          { _id: editableTodoId, text: taskName },
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );

        showToast(message, { variant: "success" });
        newItems[index].text = taskName;
        setTodos({ ...todos, items: newItems });
        setTaskName("");
        setEditableTodoId(null);
      } catch (err) {
        logout();
      }
    }
  };

  const toggleTodo = async (id) => {
    let index = items.findIndex((item) => item._id === id);
    let newItems = [...todos.items];

    if (index !== -1) {
      try {
        const {
          data: { message },
        } = await axios.put(
          `${API_BASE_URL}/todos`,
          { _id: id, completed: !newItems[index].completed },
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );

        showToast(message, { variant: "success" });
        newItems[index].completed = !newItems[index].completed;
        setTodos({ ...todos, items: newItems });
      } catch (err) {
        logout();
      }
    }
  };

  const removeTodo = async (_id) => {
    let newItems = items.filter((item) => item._id !== _id);

    try {
      const {
        data: { message },
      } = await axios.delete(`${API_BASE_URL}/todos`, {
        headers: { authorization: `Bearer ${token}` },
        data: { _id },
      });

      showToast(message, { variant: "success" });
      setTodos({ ...todos, items: newItems });
    } catch (err) {
      logout();
    }
  };

  return (
    <Paper className={classes.container}>
      {header && <p className={classes.heading}>{header}</p>}
      <TextField
        required
        maxLength={50}
        value={taskName}
        variant="outlined"
        id="outlined-required"
        placeholder="Buy milk..."
        className={classes.textField}
        label="Required (max. 35 charatcters)"
        helperText="Press ' Enter ⏎ ' to add task"
        onChange={(e) => setTaskName(e.target.value)}
        onKeyPress={(e) => (e.key === "Enter" ? addTodo() : "")}
      />
      {loading && <CircularProgress className={classes.spinner} />}
      {items.length ? (
        <>
          {items
            ?.slice(
              (page - 1) * TODOS_PER_PAGE,
              (page - 1) * TODOS_PER_PAGE + TODOS_PER_PAGE
            )
            ?.map((item) => (
              <TodoItem
                key={item._id}
                data={{ ...item, editHandler, toggleTodo, removeTodo }}
              />
            ))}
          <div className={classes.pagination}>
            <Pagination
              size="small"
              page={page}
              color="primary"
              onChange={handleChange}
              count={Math.ceil(items.length / TODOS_PER_PAGE)}
            />
          </div>
        </>
      ) : (
        <Typography className={classes.infoLabel} variant="body1">
          Add your tasks here...
        </Typography>
      )}
    </Paper>
  );
};

export default TodoList;
