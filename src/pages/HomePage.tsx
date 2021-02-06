import React from 'react';
import { Helmet } from 'react-helmet-async';
import Container from '@material-ui/core/Container';
import ProductList from '../ProductList';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Demo - Products</title>
      </Helmet>

      <Box pt="16px">
        <Container>
          <Typography component="h1" variant="h2">
            Product List
          </Typography>
          <ProductList />
        </Container>
      </Box>
    </>
  );
}
