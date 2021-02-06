import React, { Component } from 'react';
import { Product, Products } from '../types/index';
import TopBar from './Header';
import ProductTable from './Table';
import { PRODUCTS_URL, wait } from '../constants';
import CircularProgress from '@material-ui/core/CircularProgress';

type ProductTableAppProps = {};

type ProductTableAppState = {
  error: null | string;
  isLoaded: boolean;
  products: Products;
  filter: { name: string; inStockOnly: boolean };
  bulkCheckbox: { checked: boolean; indeterminate: boolean };
  isDeleteLoading: boolean;
};

class ProductTableApp extends Component<ProductTableAppProps, ProductTableAppState> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      products: [],
      filter: { name: '', inStockOnly: false },
      bulkCheckbox: { checked: false, indeterminate: false },
      isDeleteLoading: false,
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleInStockOnlyChange = this.handleInStockOnlyChange.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleMultipleCheckboxChange = this.handleMultipleCheckboxChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  handleNameChange(name: string) {
    this.setState({
      filter: {
        name: name,
        inStockOnly: this.state.filter.inStockOnly,
      },
    });
  }

  handleInStockOnlyChange(inStockOnly: boolean) {
    this.setState({
      filter: {
        name: this.state.filter.name,
        inStockOnly: inStockOnly,
      },
    });
  }

  handleDeleteClick() {
    this.setState({ isDeleteLoading: true });

    const checkedProducts = this.state.products.filter((product) => product.checked);
    const checkedIds = checkedProducts.map((product) => product.id);

    (async () => {
      await Promise.all(
        checkedIds.map((checkedId) =>
          fetch(`${PRODUCTS_URL}/${checkedId}`, {
            method: 'DELETE',
            headers: { 'Content-type': 'application/json' },
          }).then((res) => res.json())
        )
      );

      await wait(500);

      const isNotDeleted = (product: Product) => !checkedIds.includes(product.id);
      this.setState({
        products: [...this.state.products].filter(isNotDeleted),
        isDeleteLoading: false,
      });
    })();

    this.setState({ bulkCheckbox: { checked: false, indeterminate: false } });
  }

  handleCheckboxChange(event: React.ChangeEvent<any>, id: string) {
    const checked = event.target.checked;
    const products: Products = [...this.state.products];
    const product = products.find((product) => product.id === id) as Product;

    product.checked = checked;

    const someChecked = products.some((product) => product.checked);
    const everyChecked = products.every((product) => product.checked);

    this.setState({
      products: products,
      bulkCheckbox: { checked: someChecked, indeterminate: someChecked && !everyChecked },
    });
  }

  handleMultipleCheckboxChange(event: React.ChangeEvent<any>) {
    this.setState({
      products: [...this.state.products].map((product) => ({
        ...product,
        checked: event.target.checked,
      })),
      bulkCheckbox: { checked: event.target.checked, indeterminate: false },
    });
  }

  componentDidMount() {
    this.loadProducts(PRODUCTS_URL);
  }

  loadProducts(url: string) {
    fetch(url)
      .then((res) => res.json())
      .then(
        (result) => {
          const products = result.map((product: Product) => ({ ...product, checked: false }));
          this.setState({ isLoaded: true, products: products });
        },
        (error) => {
          this.setState({ isLoaded: true, error: 'Error!' });
          console.log(error.message);
        }
      );
  }

  render() {
    return (
      <>
        <TopBar
          filter={this.state.filter}
          products={this.state.products}
          onNameChange={this.handleNameChange}
          onInStockOnlyChange={this.handleInStockOnlyChange}
          onDeleteClick={this.handleDeleteClick}
          isDeleteLoading={this.state.isDeleteLoading}
        />
        {!this.state.isLoaded ? (
          <div>
            <CircularProgress color="primary" />
          </div>
        ) : (
          <ProductTable
            multipleCheckboxIndeterminate={this.state.bulkCheckbox.indeterminate}
            multipleCheckboxChecked={this.state.bulkCheckbox.checked}
            filter={this.state.filter}
            products={this.state.products}
            onMultipleCheckboxChange={this.handleMultipleCheckboxChange}
            onCheckboxChange={this.handleCheckboxChange}
          />
        )}
      </>
    );
  }
}

export default ProductTableApp;
