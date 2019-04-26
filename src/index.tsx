import * as React from "react";
import * as ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";
import HalfACup from "./components/HalfACup";
import {
    MuiThemeProvider,
    createMuiTheme,
    Theme
} from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";
import { BrowserRouter } from "react-router-dom";

// Create a theme instance.
const theme: Theme = createMuiTheme({
    palette: {
        primary: red,
        secondary: {
            main: "#FFFFFF"
        }
    }
});

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
            <HalfACup />
        </BrowserRouter>
    </MuiThemeProvider>,
    document.getElementById("root") as HTMLElement
);
registerServiceWorker();
