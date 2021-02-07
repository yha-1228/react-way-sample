import React, { useEffect, useReducer } from 'react'
import reducer, { initialState } from './modules'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import TopBar from './Header'
import ProductTable from './ProductTable'
import { PRODUCTS_URL } from '../constants'
import { wait } from '../functions'
import { Product } from '../types'

export default function ProductList() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const handleNameChange = (name: string) => {
    dispatch({ type: 'CHANGE_NAME', payload: { name } })
  }

  const handleInStockOnlyChange = (inStockOnly: boolean) => {
    dispatch({ type: 'TOGGLE_IN_STOCK_ONLY', payload: { inStockOnly } })
  }

  const handleDeleteClick = () => {
    dispatch({ type: 'PENDING_DELETE' })

    const checkedIds = state.products
      .filter((product: Product) => product.checked)
      .map((product: Product) => product.id)

    Promise.all(
      checkedIds.map((id) =>
        fetch(`${PRODUCTS_URL}/${id}`, { method: 'DELETE' }).then((res) => res.json())
      )
    ).then(async () => {
      await wait(2000)
      loadProducts(PRODUCTS_URL)
    })
  }

  const handleCheckboxChange = (event: React.ChangeEvent<any>, id: string) => {
    dispatch({ type: 'CHANGE_CHECKBOX', payload: { event, id } })
  }

  const handleBulkCheckboxChange = (event: React.ChangeEvent<any>) => {
    dispatch({ type: 'CHANGE_BULK_CHECKBOX', payload: { event } })
  }

  const loadProducts = (url: string) => {
    fetch(url)
      .then((res) => res.json())
      .then(
        async (result) => {
          await wait(1500)
          dispatch({ type: 'FULFILLED', payload: { result } })
        },
        (error) => {
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
