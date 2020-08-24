import React from 'react';
import Axios from 'axios';
import classNames from 'classnames';
import './Reset.scss';
import './App.scss';

function SearchBar(props) {
  const handleFilterTextChange = (e) => {
    props.onFilterTextChange(e.target.value);
  };
  const handleInStockOnlyChange = (e) => {
    props.onInStockOnlyChange(e.target.checked);
  };

  return (
    <form>
      <input
        type="text"
        placeholder="Search name..."
        value={props.filterText}
        onChange={handleFilterTextChange}
      />
      <p>
        <input
          id="checkInStockOnly"
          type="checkbox"
          checked={props.inStockOnly}
          onChange={handleInStockOnlyChange}
        />{' '}
        <label htmlFor="checkInStockOnly">Only show products in stock</label>
      </p>
    </form>
  );
}

function ProductTable(props) {
  /**
   * @param {Array} product
   */
  const isFilterTextValid = (product) => {
    const capsName = product.name.toUpperCase();
    const capsFilterText = props.filterText.toUpperCase();
    return capsName.indexOf(capsFilterText) !== -1;
  };

  /**
   * @param {Array} product
   */
  const isInStockOnlyValid = (product) => {
    return props.inStockOnly ? product.stocked : !undefined;
  };

  return (
    <table className="product-table">
      <thead>
        <tr className="table-row">
          <th className="table-cell text-right">ID</th>
          <th className="table-cell text-left">Brand</th>
          <th className="table-cell text-left">Category</th>
          <th className="table-cell text-left">Name</th>
          <th className="table-cell text-right">Price</th>
        </tr>
      </thead>
      <tbody>
        {props.products
          .filter(isFilterTextValid)
          .filter(isInStockOnlyValid)
          .map((product) => (
            <tr
              key={product.id}
              className={classNames('table-row', { warn: !product.stocked })}
            >
              <td className="table-cell text-right">{product.id}</td>
              <td className="table-cell text-left">{product.brand}</td>
              <td className="table-cell text-left">{product.category}</td>
              <td className="table-cell text-left">{product.name}</td>
              <td className="table-cell text-right">{product.price}</td>
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
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleInStockOnlyChange = this.handleInStockOnlyChange.bind(this);
  }

  /**
   * @param {String} filterText
   */
  handleFilterTextChange(filterText) {
    this.setState({ filterText: filterText });
  }

  /**
   * @param {Boolean} inStockOnly
   */
  handleInStockOnlyChange(inStockOnly) {
    this.setState({ inStockOnly: inStockOnly });
  }

  componentDidMount() {
    axios.get('https://5e6736691937020016fed762.mockapi.io/products')
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
          onFilterTextChange={this.handleFilterTextChange}
          onInStockOnlyChange={this.handleInStockOnlyChange}
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
