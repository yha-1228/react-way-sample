import React from 'react';
import GlobalStyle from './utils/GlobalStyle';
import './App.css';
import { theme } from './utils/mui-theme';
import { ThemeProvider } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
