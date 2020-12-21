import React from "react";
import dayjs from "dayjs";
import {
  Checkbox,
  makeStyles,
  IconButton,
  FormControlLabel,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    margin: ".2rem 0",
    alignItems: "center",
    paddingLeft: ".8rem",
    justifyContent: "space-between",
    "&:nth-child(even)": {
      background: "#f1f1f1",
    },
  },
  checkBox: {
    margin: ".2rem .4rem",
    padding: ".5rem",
    "&:checked": {
      color: `${theme.palette.primary.main} !important`,
    },
  },
  deleteButton: {
    marginRight: ".5rem",
    "&:hover *": {
      color: "red",
    },
  },
  deleteIcon: {
    color: theme.palette.primary.main,
    transition: "color .1s",
  },
  label: {
    textOverflow: "ellipsis",
    display: "inline-block",
    overflow: "hidden",
    textDecoration: (isCompleted) => isCompleted && "line-through",
  },
  completed: {
    textDecoration: "strike-through",
  },
  timeStamp: {
    margin: "-.9rem 0 0 2.6rem",
    display: "block",
    paddingBottom: ".8rem",
    color: "#222",
    fontSize: ".9rem",
  },
}));

const getModifiedDate = (date) => {
  return dayjs(date).format("DD/MM/YYYY hh:mm a");
};

const TodoItem = ({ data }) => {
  const { isCompleted, text, id, toggleTodo, removeTodo, createdAt } = data;
  const classes = useStyles(isCompleted);

  return (
    <div className={classes.container}>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              className={classes.checkBox}
              checked={isCompleted}
              onChange={() => toggleTodo(id)}
              color="primary"
            />
          }
          label={<span className={classes.label}>{text}</span>}
          labelPlacement="end"
        />
        <label className={classes.timeStamp}>
          {getModifiedDate(createdAt)}
        </label>
      </div>
      <div>
        <IconButton
          onClick={() => removeTodo(id)}
          className={classes.deleteButton}
          aria-label="delete"
        >
          <DeleteIcon className={classes.deleteIcon} />
        </IconButton>
      </div>
    </div>
  );
};

export default TodoItem;
