import { Container } from '@material-ui/core';
import React from 'react';
import Heading from '../components/Heading';
import Main from '../components/Main';
import ProductTableApp from '../components/ProductTableApp';

export default function HomePage() {
  return (
    <div>
      <Main>
        <Container>
          <Heading>Product List</Heading>
          <ProductTableApp />
        </Container>
      </Main>
    </div>
  );
}
