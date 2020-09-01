import React from 'react'
import './Reset.scss'
import './App.scss'
import PageTitle from './components/PageTitle'
import FilterableProductTable from './components/FilterableProductTable'

function App() {
  return (
    <div className="container">
      <PageTitle>Product</PageTitle>
      <FilterableProductTable />
    </div>
  )
}

export default App
