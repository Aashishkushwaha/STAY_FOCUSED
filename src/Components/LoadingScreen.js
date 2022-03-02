import { Modal, CircularProgress } from "@material-ui/core";

const LoadingScreen = ({ visible }) => {
  return (
    <Modal
      open={visible}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {visible && (
        <CircularProgress
          color="secondary"
          style={{
            outline: "none",
            fontSize: "2rem",
            height: "3rem",
            width: "3rem",
          }}
        />
      )}
    </Modal>
  );
};

export default LoadingScreen;
