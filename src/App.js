import React from 'react';
import './App.scss';
import FilterableProductTable from './components/FilterableProductTable';
import Container from '@material-ui/core/Container';

function App() {
  return (
    <Container>
      <h1>Product</h1>
      <FilterableProductTable />
    </Container>
  );
}

export default App;
