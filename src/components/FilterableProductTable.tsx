import React from 'react';
import { Products } from './data';
import TopBar from './TopBar';
import ProductTable from './ProductTable';
import axios from 'axios';

type FilterableProductTableState = {
  error: null | string;
  isLoaded: boolean;
  products: Products;
  filterText: string;
  inStockOnly: boolean;
};

class FilterableProductTable extends React.Component<
  {},
  FilterableProductTableState
> {
  url: string;

  constructor(props: Readonly<{}>) {
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
    this.handleDeleteAllClick = this.handleDeleteAllClick.bind(this);
    this.url = 'https://5e6736691937020016fed762.mockapi.io/products';
  }

  handleFilterTextChange(filterText: string) {
    this.setState({ filterText: filterText });
  }

  handleInStockOnlyChange(inStockOnly: boolean) {
    this.setState({ inStockOnly: inStockOnly });
  }

  handleDeleteClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const id = event.currentTarget.dataset.id;
    axios.delete(`${this.url}/${id}`).then((result) => {
      console.log(`Deleted: id = ${result.data.id}`);
      const products = [...this.state.products].filter(
        (product) => product.id !== id
      );
      this.setState({ isLoaded: true, products: products });
    });
  }

  handleDeleteAllClick() {
    const deleteBy = (id: string) => {
      axios.delete(`${this.url}/${id}`).then((result) => {
        console.log(`Deleted: id = ${result.data.id}`);
      });
    };

    const ids = this.state.products.map((product) => product.id);
    ids.forEach((id) => {
      deleteBy(id);
    });
  }

  componentDidMount() {
    this.loadProducts(this.url);
  }

  loadProducts(url: string) {
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
      <div>
        <TopBar
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          onFilterTextChange={this.handleFilterTextChange}
          onInStockOnlyChange={this.handleInStockOnlyChange}
          onDeleteAllClick={this.handleDeleteAllClick}
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
      </div>
    );
  }
}

export default FilterableProductTable;
