import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import WholeCup from './components/WholeCup';
import { MuiThemeProvider, createMuiTheme, Theme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';



// Create a theme instance.
const theme: Theme = createMuiTheme({
  palette: {
    primary: red,
  },
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline/>
    <WholeCup />
  </MuiThemeProvider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker(); 