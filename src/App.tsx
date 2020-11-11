import React from 'react';
import GlobalStyle from './utils/GlobalStyle';
import Heading from './components/Heading';
import Main from './components/Main';
import ProductTableApp from './components/ProductTableApp';
import './App.css';
import { theme } from './utils/mui-theme';
import { ThemeProvider } from '@material-ui/core';
import Container from '@material-ui/core/Container';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Main>
        <Container>
          <Heading>Product List</Heading>
          <ProductTableApp />
        </Container>
      </Main>
    </ThemeProvider>
  );
}

export default App;
