import React from "react";
import dayjs from "dayjs";
import {
  Checkbox,
  makeStyles,
  IconButton,
  Menu,
  MenuItem,
  FormControlLabel,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import MoreIcon from "@material-ui/icons/MoreVert";

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
  menuIcons: {
    color: theme.palette.primary.main,
    transition: "color .1s",
    transform: "scale(.75)",
    marginRight: ".5rem",
  },
  label: {
    textOverflow: "ellipsis",
    display: "inline-block",
    overflow: "hidden",
    textDecoration: (completed) => completed && "line-through",
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
  const {
    completed,
    text,
    _id,
    toggleTodo,
    editHandler,
    removeTodo,
    createdAt,
  } = data;
  const classes = useStyles(completed);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    editHandler(_id, text);
    handleClose();
  };

  return (
    <div className={classes.container}>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              className={classes.checkBox}
              checked={completed}
              onChange={() => toggleTodo(_id)}
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
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <MoreIcon className={classes.deleteIcon} />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon className={classes.menuIcons} /> Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              removeTodo(_id);
            }}
          >
            <DeleteIcon className={classes.menuIcons} /> Delete
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default TodoItem;
