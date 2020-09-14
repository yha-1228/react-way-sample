// TODO: put実装

import React from 'react';
import axios from 'axios';
import classNames from 'classnames';
import './FilterableProductTable.scss';

function TopBar(props) {
  const handleFilterTextChange = (e) => {
    props.onFilterTextChange(e.target.value);
  };
  const handleInStockOnlyChange = (e) => {
    props.onInStockOnlyChange(e.target.checked);
  };

  return (
    <div className="top-bar">
      <form>
        <input
          type="text"
          placeholder="Search name..."
          value={props.filterText}
          onChange={handleFilterTextChange}
        />
        <input
          id="checkInStockOnly"
          type="checkbox"
          checked={props.inStockOnly}
          onChange={handleInStockOnlyChange}
        />{' '}
        <label htmlFor="checkInStockOnly">Only show products in stock</label>
      </form>
    </div>
  );
}

function ProductTable(props) {
  const handleDeleteClick = (e) => {
    props.onDeleteClick(
      e.currentTarget.dataset.id,
      e.currentTarget.dataset.index
    );
  };

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
          <th className="table-cell text-center"></th>
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
          .map((product, index) => (
            <tr
              key={product.id}
              className={classNames('table-row', { warn: !product.stocked })}
            >
              <td className="table-cell text-center">
                <button
                  className="button"
                  data-id={product.id}
                  data-index={index}
                  onClick={handleDeleteClick}
                >
                  DELETE
                </button>
              </td>
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
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      products: [],
      filterText: '',
      inStockOnly: false,
    };
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleInStockOnlyChange = this.handleInStockOnlyChange.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.url = 'https://5e6736691937020016fed762.mockapi.io/products';
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

  /**
   * @param {String} targetId
   * @param {Number} targetIndex
   */
  handleDeleteClick(targetId, targetIndex) {
    axios.delete(`${this.url}/${targetId}`).then((result) => {
      console.log(`Deleted: id = ${result.data.id}`);
      this.state.products.splice(targetIndex, 1);
      this.setState({ isLoaded: true, products: this.state.products });
    });
  }

  componentDidMount() {
    this.loadProducts(this.url);
  }

  loadProducts(url) {
    axios
      .get(url)
      .then((result) => {
        this.setState({ isLoaded: true, products: result.data });
      })
      .catch((result) => {
        this.setState({ isLoaded: true, error: 'Error!' });
        console.log({ ...result.response });
      });
  }

  render() {
    return (
      <>
        <TopBar
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          onFilterTextChange={this.handleFilterTextChange}
          onInStockOnlyChange={this.handleInStockOnlyChange}
        />
        {!this.state.isLoaded ? (
          <div>Loading...</div>
        ) : (
          <ProductTable
            filterText={this.state.filterText}
            inStockOnly={this.state.inStockOnly}
            products={this.state.products}
            onDeleteClick={this.handleDeleteClick}
          />
        )}
      </>
    );
  }
}

export default FilterableProductTable;