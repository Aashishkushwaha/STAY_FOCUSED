import { createMuiTheme } from "@material-ui/core/styles";

const light = createMuiTheme({
  palette: {
    primary: {
      // main: "#4f63d7",
      // main: "#004953",
      main: "#01796f",
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
