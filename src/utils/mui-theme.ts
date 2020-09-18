import { createMuiTheme } from '@material-ui/core';
import { colors, fontFamily } from './style-config';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
  },
  typography: {
    fontFamily: fontFamily,
  },
});
