import React, { useEffect, useState } from 'react';
import produce from 'immer';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Product, Products } from '../types/index';
import TopBar from './Header';
import ProductTable from './ProductTable';
import { PRODUCTS_URL } from '../constants';
import { wait } from '../functions';

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

export default function ProductList() {
  const [state, setState] = useState<ProductListState>(initialState);

  const handleNameChange = (name: string) => {
    setState(
      produce(state, (draftState) => {
        draftState.filter.name = name;
      })
    );
  };

  const handleInStockOnlyChange = (inStockOnly: boolean) => {
    setState(
      produce(state, (draftState) => {
        draftState.filter.inStockOnly = inStockOnly;
      })
    );
  };

  const handleDeleteClick = () => {
    setState(
      produce(state, (draftState) => {
        draftState.isDeleteLoading = true;
      })
    );

    const checkedProducts = state.products.filter((product) => product.checked);
    const checkedIds = checkedProducts.map((product) => product.id);

    Promise.all(
      checkedIds.map((checkedId) =>
        fetch(`${PRODUCTS_URL}/${checkedId}`, { method: 'DELETE' }).then((res) => res.json())
      )
    ).then(() => {
      const isNotDeleted = (product: Product) => !checkedIds.includes(product.id);
      setState(
        produce(state, (draftState) => {
          draftState.products = [...state.products].filter(isNotDeleted);
          draftState.bulkCheckbox = { checked: false, indeterminate: false };
          draftState.isDeleteLoading = false;
        })
      );
    });
  };

  const handleCheckboxChange = (event: React.ChangeEvent<any>, id: string) => {
    const checked = event.target.checked;
    const products = [...state.products];
    const product = products.find((product) => product.id === id) as Product;

    product.checked = checked;

    const someChecked = products.some((product) => product.checked);
    const everyChecked = products.every((product) => product.checked);

    setState({
      ...state,
      products: products,
      bulkCheckbox: { checked: someChecked, indeterminate: someChecked && !everyChecked },
    });

    // produce(state, (draftState) => {
    //   draftState.products = products;
    //   draftState.bulkCheckbox = {
    //     checked: someChecked,
    //     indeterminate: someChecked && !everyChecked,
    //   };
    // })
  };

  const handleBulkCheckboxChange = (event: React.ChangeEvent<any>) => {
    setState(
      produce(state, (draftState) => {
        draftState.products = [...state.products].map((product) => ({
          ...product,
          checked: event.target.checked,
        }));
        draftState.bulkCheckbox = { checked: event.target.checked, indeterminate: false };
      })
    );
  };

  const loadProducts = (url: string) => {
    fetch(url)
      .then((res) => res.json())
      .then(
        async (result) => {
          await wait(1500);

          const products = result.map((product: Product) => ({ ...product, checked: false }));

          setState(
            produce(state, (draftState) => {
              draftState.isLoaded = true;
              draftState.products = products;
            })
          );
        },
        (error) => {
          setState(
            produce(state, (draftState) => {
              draftState.isLoaded = true;
              draftState.error = error;
            })
          );
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
          bulkCheckboxIndeterminate={state.bulkCheckbox.indeterminate}
          bulkCheckboxChecked={state.bulkCheckbox.checked}
          filter={state.filter}
          products={state.products}
          onBlukCheckboxChange={handleBulkCheckboxChange}
          onCheckboxChange={handleCheckboxChange}
        />
      )}
    </>
  );
}
