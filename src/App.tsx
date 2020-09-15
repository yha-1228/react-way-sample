import React from 'react';
import './App.scss';
import FilterableProductTable from './components/FilterableProductTable';
import { theme } from './mui-theme';
import { ThemeProvider } from '@material-ui/core';
import Container from '@material-ui/core/Container';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <h1>Product</h1>
        <FilterableProductTable />
      </Container>
    </ThemeProvider>
  );
}

export default App;
