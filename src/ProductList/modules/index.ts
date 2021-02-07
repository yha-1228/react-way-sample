import { Product, Products } from '../../types'

export type ProductListState = {
  error: null | string
  isLoaded: boolean
  products: Products
  filter: { name: string; inStockOnly: boolean }
  bulkCheckbox: { checked: boolean; indeterminate: boolean }
  isDeleteLoading: boolean
}

export const initialState = {
  error: null,
  isLoaded: false,
  products: [],
  filter: { name: '', inStockOnly: false },
  bulkCheckbox: { checked: false, indeterminate: false },
  isDeleteLoading: false,
}

export type Action = {
  type: string
  payload?: any
}

export default function reducer(state: ProductListState, action: Action): ProductListState {
  switch (action.type) {
    case 'FULFILLED': {
      const { result } = action.payload
      const products = result.map((product: Product) => ({ ...product, checked: false }))
      return { ...initialState, isLoaded: true, products }
    }

    case 'REJECTED': {
      const { error } = action.payload
      return { ...state, isLoaded: true, error }
    }

    case 'CHANGE_CHECKBOX': {
      const { event, id } = action.payload

      const products = state.products.map((product: Product) =>
        product.id === id ? { ...product, checked: event.target.checked } : product
      )

      return {
        ...state,
        products,
        bulkCheckbox: {
          checked: isSomeChecked(products),
          indeterminate: isSomeChecked(products) && !isEveryChecked(products),
        },
      }
    }

    case 'CHANGE_BULK_CHECKBOX': {
      const { event } = action.payload

      return {
        ...state,
        products: state.products.map((product: Product) => ({
          ...product,
          checked: event.target.checked,
        })),
        bulkCheckbox: { checked: event.target.checked, indeterminate: false },
      }
    }

    case 'PENDING_DELETE': {
      return { ...state, isDeleteLoading: true }
    }

    case 'FULFILLED_DELETE': {
      const checkedIds = state.products
        .filter((product: Product) => product.checked)
        .map((product: Product) => product.id)

      const isNotDeleted = (product: Product) => !checkedIds.includes(product.id)

      return {
        ...state,
        products: state.products.filter(isNotDeleted),
        bulkCheckbox: { checked: false, indeterminate: false },
        isDeleteLoading: false,
      }
    }

    case 'CHANGE_NAME': {
      const { name } = action.payload
      return { ...state, filter: { ...state.filter, name: name } }
    }

    case 'TOGGLE_IN_STOCK_ONLY': {
      const { inStockOnly } = action.payload
      return { ...state, filter: { ...state.filter, inStockOnly: inStockOnly } }
    }

    default: {
      return state
    }
  }
}

function isSomeChecked(products: Products) {
  return products.some((product) => product.checked)
}

function isEveryChecked(products: Products) {
  return products.every((product) => product.checked)
}
