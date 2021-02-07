import React, { useEffect, useReducer } from 'react';
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

type Action = {
  type: string;
  payload?: any;
};

function reducer(state: ProductListState, action: Action) {
  switch (action.type) {
    case 'PENDING': {
      return { ...state, isLoaded: true };
    }
    case 'FULFILLED': {
      const { products } = action.payload;
      return { ...state, isLoaded: true, products };
    }
    case 'REJECTED': {
      const { error } = action.payload;
      return { ...state, isLoaded: true, error };
    }
    case 'CHANGE_CHECKBOX': {
      const { products, event, id } = action.payload;

      products.map((product: Product) => ({
        ...product,
        checked: product.id === id ? event.target.checked : product.checked,
      }));

      return {
        ...state,
        products,
        bulkCheckbox: {
          checked: isSomeChecked(products),
          indeterminate: isSomeChecked(products) && !isEveryChecked(products),
        },
      };
    }
    case 'CHANGE_BULK_CHECKBOX': {
      const { products, event } = action.payload;

      return {
        ...state,
        products: products.map((product: Product) => ({
          ...product,
          checked: event.target.checked,
        })),
        bulkCheckbox: { checked: event.target.checked, indeterminate: false },
      };
    }
    case 'PENDING_DELETE': {
      return { ...state, isDeleteLoading: true };
    }
    case 'FULFILLED_DELETE': {
      const { products } = action.payload;

      const checkedIds = products
        .filter((product: Product) => product.checked)
        .map((product: Product) => product.id);

      const isNotDeleted = (product: Product) => !checkedIds.includes(product.id);

      return {
        ...state,
        products: products.filter(isNotDeleted),
        bulkCheckbox: { checked: false, indeterminate: false },
        isDeleteLoading: false,
      };
    }
    case 'CHANGE_NAME': {
      const { name } = action.payload;
      return { ...state, filter: { ...state.filter, name: name } };
    }
    case 'TOGGLE_IN_STOCK_ONLY': {
      const { inStockOnly } = action.payload;
      return { ...state, filter: { ...state.filter, inStockOnly: inStockOnly } };
    }
    default: {
      return state;
    }
  }
}

export default function ProductList() {
  const [state, dispatch] = useReducer<ProductListState, Action>(reducer, initialState);

  const handleNameChange = (name: string) => {};

  const handleInStockOnlyChange = (inStockOnly: boolean) => {};

  const handleDeleteClick = async () => {};

  const handleCheckboxChange = (event: React.ChangeEvent<any>, id: string) => {};

  const handleBulkCheckboxChange = (event: React.ChangeEvent<any>) => {};

  const loadProducts = (url: string) => {
    fetch(url)
      .then((res) => res.json())
      .then(
        async (result) => {
          await wait(1500);
        },
        (error) => {
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

function isSomeChecked(products: Products) {
  return products.some((product) => product.checked);
}

function isEveryChecked(products: Products) {
  return products.every((product) => product.checked);
}
