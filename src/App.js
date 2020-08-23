import React from 'react';
import './App.scss';
import Axios from 'axios';
import classNames from 'classnames';

function SearchBar(props) {
  return (
    <form>
      <input
        type="text"
        placeholder="Search name..."
        value={props.filterText}
        onChange={(e) => {
          props.onFilterTextChange(e.target.value);
        }}
      />
      <p>
        <input
          id="checkInStockOnly"
          type="checkbox"
          checked={props.inStockOnly}
          onChange={(e) => {
            props.onInStockOnlyChange(e.target.checked);
          }}
        />{' '}
        <label htmlFor="checkInStockOnly">Only show products in stock</label>
      </p>
    </form>
  );
}

function ProductTable(props) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Brand</th>
          <th>Category</th>
          <th>Name</th>
          <th>Price</th>
          <th>Summary</th>
        </tr>
      </thead>
      <tbody>
        {props.products
          // filterText
          .filter(
            (product) =>
              product.name
                .toUpperCase()
                .indexOf(props.filterText.toUpperCase()) !== -1
          )
          // inStockOnly
          .filter((product) =>
            props.inStockOnly ? product.stocked : !undefined
          )
          .map((product) => (
            <tr
              key={product.id}
              className={classNames({ warn: !product.stocked })}
            >
              <td>{product.id}</td>
              <td>{product.brand}</td>
              <td>{product.category}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.summary}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { products: [], filterText: '', inStockOnly: false };
  }

  componentDidMount() {
    Axios.get('https://5e6736691937020016fed762.mockapi.io/products')
      .then((response) => {
        this.setState({ products: response.data });
      })
      .catch((response) => {
        console.log(`responce => ${response}`);
      });
  }

  render() {
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          onFilterTextChange={(filterText) => {
            this.setState({ filterText: filterText });
          }}
          onInStockOnlyChange={(inStockOnly) => {
            this.setState({ inStockOnly: inStockOnly });
          }}
        />
        <ProductTable
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          products={this.state.products}
        />
      </div>
    );
  }
}

function App() {
  return <FilterableProductTable />;
}

export default App;
