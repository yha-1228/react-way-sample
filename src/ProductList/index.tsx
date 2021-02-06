import React, { useEffect, useState } from 'react';
import { Product, Products } from '../types/index';
import TopBar from './Header';
import ProductTable from './ProductTable';
import { PRODUCTS_URL } from '../constants';
import CircularProgress from '@material-ui/core/CircularProgress';
import { wait } from '../functions';
import Box from '@material-ui/core/Box';

type ProductListState = {
  error: null | string;
  isLoaded: boolean;
  products: Products;
  filter: { name: string; inStockOnly: boolean };
  bulkCheckbox: { checked: boolean; indeterminate: boolean };
  isDeleteLoading: boolean;
};

const initialState = {
  error: null,
  isLoaded: false,
  products: [],
  filter: { name: '', inStockOnly: false },
  bulkCheckbox: { checked: false, indeterminate: false },
  isDeleteLoading: false,
};

export function ProductListFunc() {
  const [state, setState] = useState<ProductListState>(initialState);

  const handleNameChange = (name: string) => {
    setState({
      ...state,
      filter: { name: name, inStockOnly: state.filter.inStockOnly },
    });
  };

  const handleInStockOnlyChange = (inStockOnly: boolean) => {
    setState({
      ...state,
      filter: { name: state.filter.name, inStockOnly: inStockOnly },
    });
  };

  const handleDeleteClick = () => {
    setState({ ...state, isDeleteLoading: true });

    const checkedProducts = state.products.filter((product) => product.checked);
    const checkedIds = checkedProducts.map((product) => product.id);

    (async () => {
      await Promise.all(
        checkedIds.map((checkedId) =>
          fetch(`${PRODUCTS_URL}/${checkedId}`, {
            method: 'DELETE',
            headers: { 'Content-type': 'application/json' },
          }).then((res) => res.json())
        )
      );

      await wait(500);

      const isNotDeleted = (product: Product) => !checkedIds.includes(product.id);
      setState({
        ...state,
        products: [...state.products].filter(isNotDeleted),
        bulkCheckbox: { checked: false, indeterminate: false },
        isDeleteLoading: false,
      });
    })();
  };

  const handleCheckboxChange = (event: React.ChangeEvent<any>, id: string) => {
    const checked = event.target.checked;
    const products: Products = [...state.products];
    const product = products.find((product) => product.id === id) as Product;

    product.checked = checked;

    const someChecked = products.some((product) => product.checked);
    const everyChecked = products.every((product) => product.checked);

    setState({
      ...state,
      products: products,
      bulkCheckbox: { checked: someChecked, indeterminate: someChecked && !everyChecked },
    });
  };

  const handleMultipleCheckboxChange = (event: React.ChangeEvent<any>) => {
    setState({
      ...state,
      products: [...state.products].map((product) => ({
        ...product,
        checked: event.target.checked,
      })),
      bulkCheckbox: { checked: event.target.checked, indeterminate: false },
    });
  };

  const loadProducts = (url: string) => {
    fetch(url)
      .then((res) => res.json())
      .then(
        (result) => {
          const products = result.map((product: Product) => ({ ...product, checked: false }));
          setState({ ...state, isLoaded: true, products: products });
        },
        (error) => {
          setState({ ...state, isLoaded: true, error: 'Error!' });
          console.log(error.message);
        }
      );
  };

  useEffect(() => {
    loadProducts(PRODUCTS_URL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <TopBar
        filter={state.filter}
        products={state.products}
        onNameChange={handleNameChange}
        onInStockOnlyChange={handleInStockOnlyChange}
        onDeleteClick={handleDeleteClick}
        isDeleteLoading={state.isDeleteLoading}
      />
      {!state.isLoaded ? (
        <Box textAlign="center" pt="40px">
          <CircularProgress color="primary" />
          <Box component="p" fontWeight="bold" fontSize="18px">
            Loading...
          </Box>
        </Box>
      ) : (
        <ProductTable
          multipleCheckboxIndeterminate={state.bulkCheckbox.indeterminate}
          multipleCheckboxChecked={state.bulkCheckbox.checked}
          filter={state.filter}
          products={state.products}
          onMultipleCheckboxChange={handleMultipleCheckboxChange}
          onCheckboxChange={handleCheckboxChange}
        />
      )}
    </>
  );
}
