import React, { useEffect, useReducer } from 'react'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import TopBar from './Header'
import ProductTable from './ProductTable'
import { PRODUCTS_URL } from '../constants'
import { wait } from '../functions'
import reducer, { initialState } from './modules'

export default function ProductList() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const handleNameChange = (name: string) => {
    dispatch({ type: 'CHANGE_NAME', payload: { name } })
  }

  const handleInStockOnlyChange = (inStockOnly: boolean) => {
    dispatch({ type: 'TOGGLE_IN_STOCK_ONLY', payload: { inStockOnly } })
  }

  const handleDeleteClick = () => {}

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
