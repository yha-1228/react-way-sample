import { createMuiTheme } from '@material-ui/core';
import { colors, fontFamily } from './style-config';

export const theme = createMuiTheme({
  palette: {
    background: {
      default: colors.background,
      paper: colors.paper,
    },
    text: {
      primary: colors.foreground,
    },
    primary: {
      main: colors.primary,
    },
  },
  typography: {
    fontFamily: fontFamily,
  },
});
