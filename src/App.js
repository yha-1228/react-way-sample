import React from 'react';
import Axios from 'axios';
import classNames from 'classnames';
import './Reset.scss';
import './App.scss';

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
  const isFilterTextValid = (product) => {
    const capsName = product.name.toUpperCase();
    const capsFilterText = props.filterText.toUpperCase();
    return capsName.indexOf(capsFilterText) !== -1;
  };

  const isInStockOnlyValid = (product) => {
    return props.inStockOnly ? product.stocked : !undefined;
  };

  return (
    <table>
      <thead>
        <tr className="table-row">
          <th className="table-cell">ID</th>
          <th className="table-cell">Brand</th>
          <th className="table-cell">Category</th>
          <th className="table-cell">Name</th>
          <th className="table-cell">Price</th>
        </tr>
      </thead>
      <tbody>
        {props.products
          .filter((product) => isFilterTextValid(product))
          .filter((product) => isInStockOnlyValid(product))
          .map((product) => (
            <tr
              key={product.id}
              className={classNames('table-row', { warn: !product.stocked })}
            >
              <td className="table-cell">{product.id}</td>
              <td className="table-cell">{product.brand}</td>
              <td className="table-cell">{product.category}</td>
              <td className="table-cell">{product.name}</td>
              <td className="table-cell">{product.price}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

class FilterableProductTable extends React.Component {
  // TODO: add loading
  // TODO: add error
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
  return (
    <div className="container">
      <FilterableProductTable />
    </div>
  );
}

export default App;
