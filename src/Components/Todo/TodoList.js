import React, { useState } from "react";
import { Typography, Paper, makeStyles, TextField } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import TodoItem from "./TodoItem";
import { saveToLocalStorage, APP_NAME } from "../../utils";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "1rem 0",
    padding: "1rem 1.5rem",
    minHeight: "80vh",
    position: "relative",
  },
  heading: {
    fontSize: "1.4rem",
    fontWeight: "400"
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
}));

const TodoList = ({ data }) => {
  const classes = useStyles();
  const { todos, setTodos } = data;
  const { header, items } = todos;

  let TODOS_PER_PAGE = 7;

  const [taskName, setTaskName] = useState("");
  const [page, setPage] = React.useState(1);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (event, value) => {
    setPage(value);
  };

  const addTodo = () => {
    if (taskName.trim() === "" || taskName.trim().length > 35) {
      return enqueueSnackbar(
        "Enter task name... (max. 35 characters allowed)",
        {
          variant: "error",
        }
      );
    }

    let newTodoItem = {
      id: items?.length + 1,
      text: taskName,
      createdAt: new Date(),
      isCompleted: false,
    };

    let newItems = [newTodoItem, ...items];

    setTaskName("");
    setTodos({ ...todos, items: newItems });
    saveToLocalStorage(`${APP_NAME}_todos_items`, newItems);
  };

  const toggleTodo = (id) => {
    let index = items.findIndex((item) => item.id === id);
    let newItems = [...todos.items];

    if (index !== -1) {
      newItems[index].isCompleted = !newItems[index].isCompleted;
      setTodos({ ...todos, items: newItems });
      saveToLocalStorage(`${APP_NAME}_todos_items`, newItems);
    }
  };

  const removeTodo = (id) => {
    let newItems = items.filter((item) => item.id !== id);

    setTodos({ ...todos, items: newItems });
    saveToLocalStorage(`${APP_NAME}_todos_items`, newItems);
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
      {items.length ? (
        <>
          {items
            ?.slice(
              (page - 1) * TODOS_PER_PAGE,
              (page - 1) * TODOS_PER_PAGE + TODOS_PER_PAGE
            )
            ?.map((item) => (
              <TodoItem
                key={item.id}
                data={{ ...item, toggleTodo, removeTodo }}
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
