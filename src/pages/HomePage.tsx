import React from 'react';
import { Helmet } from 'react-helmet-async';
import Container from '@material-ui/core/Container';
import Heading from '../components/Heading';
import Main from '../components/Main';
import ProductTableApp from '../ProductList';

export default function HomePage() {
  return (
    <div>
      <Helmet>
        <title>Demo | Products</title>
      </Helmet>

      <Main>
        <Container>
          <Heading>Product List</Heading>
          <ProductTableApp />
        </Container>
      </Main>
    </div>
  );
}
