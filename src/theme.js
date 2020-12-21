import { createMuiTheme } from "@material-ui/core/styles";

const light = createMuiTheme({
  palette: {
    primary: {
      main: "#0367ca"
    },
    secondary: {
      main: "#fff",
    },
  },
});

const dark = createMuiTheme({
  palette: {
    primary: {
      main: "#000",
    },
    secondary: {
      main: "#fff",
    },
  },
});

const themes = { light, dark };

export default themes;
