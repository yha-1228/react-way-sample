import React, { useEffect, useState } from 'react'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Product, Products } from '../types/index'
import TopBar from './Header'
import ProductTable from './ProductTable'
import { PRODUCTS_URL } from '../constants'
import { wait } from '../functions'

type ProductListState = {
  error: null | string
  isLoaded: boolean
  products: Products
  filter: { name: string; inStockOnly: boolean }
  bulkCheckbox: { checked: boolean; indeterminate: boolean }
  isDeleteLoading: boolean
}

const initialState = {
  error: null,
  isLoaded: false,
  products: [],
  filter: { name: '', inStockOnly: false },
  bulkCheckbox: { checked: false, indeterminate: false },
  isDeleteLoading: false,
}

export default function Bk() {
  const [state, setState] = useState<ProductListState>(initialState)

  const handleNameChange = (name: string) => {
    setState({ ...state, filter: { ...state.filter, name: name } })
  }

  const handleInStockOnlyChange = (inStockOnly: boolean) => {
    setState({ ...state, filter: { ...state.filter, inStockOnly: inStockOnly } })
  }

  const handleDeleteClick = () => {
    setState({ ...state, isDeleteLoading: true })

    const checkedProducts = state.products.filter((product) => product.checked)
    const checkedIds = checkedProducts.map((product) => product.id)

    Promise.all(
      checkedIds.map((checkedId) =>
        fetch(`${PRODUCTS_URL}/${checkedId}`, { method: 'DELETE' }).then((res) => res.json())
      )
    ).then(() => {
      const isNotDeleted = (product: Product) => !checkedIds.includes(product.id)
      setState({
        ...state,
        products: [...state.products].filter(isNotDeleted),
        bulkCheckbox: { checked: false, indeterminate: false },
        isDeleteLoading: false,
      })
    })
  }

  const isSomeChecked = (products: Products) => products.some((product) => product.checked)

  const isEveryChecked = (products: Products) => products.every((product) => product.checked)

  const handleCheckboxChange = (event: React.ChangeEvent<any>, id: string) => {
    const products = [...state.products].map((product) => ({
      ...product,
      checked: product.id === id ? event.target.checked : product.checked,
    }))

    setState({
      ...state,
      products: products,
      bulkCheckbox: {
        checked: isSomeChecked(products),
        indeterminate: isSomeChecked(products) && !isEveryChecked(products),
      },
    })
  }

  const handleBulkCheckboxChange = (event: React.ChangeEvent<any>) => {
    setState({
      ...state,
      products: [...state.products].map((product) => ({
        ...product,
        checked: event.target.checked,
      })),
      bulkCheckbox: { checked: event.target.checked, indeterminate: false },
    })
  }

  const loadProducts = (url: string) => {
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('error')
        }
        return res.json()
      })
      .then(
        async (result) => {
          await wait(1500)
          const products = result.map((product: Product) => ({ ...product, checked: false }))
          setState({ ...state, isLoaded: true, products: products })
        },
        (error) => {
          setState({ ...state, isLoaded: true, error: 'Error!' })
          console.log(error.message)
        }
      )
  }

  useEffect(() => {
    loadProducts(PRODUCTS_URL)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  )
}
