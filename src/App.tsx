import React from 'react';
import { theme } from './styles/theme';
import { ThemeProvider } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route path="/" exact>
              <HomePage />
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
