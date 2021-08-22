import React from "react";
import ReactDOM from "react-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DayjsUtils from "@date-io/dayjs";
import { App } from "./App";

const theme = createTheme();

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <MuiPickersUtilsProvider utils={DayjsUtils}>
      <CssBaseline />
      <App />
    </MuiPickersUtilsProvider>
  </ThemeProvider>,
  document.querySelector("#root")
);
