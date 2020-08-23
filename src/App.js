import React from 'react';
import './App.css';
import Axios from 'axios';
import classNames from 'classnames';

function SearchBar(props) {
  return (
    <form>
      <input
        type="text"
        placeholder="Search..."
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
  // TODO: 検索フィルター適用

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {props.products
          .filter((product) =>
            props.inStockOnly ? product.stocked : !undefined
          )
          .map((product) => (
            <tr
              key={product.id}
              className={classNames({ warn: !product.stocked })}
            >
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
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
