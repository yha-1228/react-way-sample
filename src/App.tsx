import React from 'react';
import './Reset.scss';
import './App.scss';
import Heading from './components/Heading';
import FilterableProductTable from './components/FilterableProductTable';
import { theme } from './mui-theme';
import { ThemeProvider } from '@material-ui/core';
import Container from '@material-ui/core/Container';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="main">
        <Container>
          <Heading>Product</Heading>
          <FilterableProductTable />
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
