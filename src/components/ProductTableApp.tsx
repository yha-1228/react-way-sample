import React from 'react';
import { Product, Products } from '../interfaces/index';
import TopBar from './TopBar';
import ProductTable from './ProductTable';
import axios from 'axios';
import _ from 'lodash';

type ProductTableAppProps = {};

type ProductTableAppState = {
  error: null | string;
  isLoaded: boolean;
  products: Products;
  filter: { name: string; inStockOnly: boolean };
  multipleCheckbox: { checked: boolean; indeterminate: boolean };
};

class ProductTableApp extends React.Component<ProductTableAppProps, ProductTableAppState> {
  url: string;

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      products: [],
      filter: { name: '', inStockOnly: false },
      multipleCheckbox: { checked: false, indeterminate: false },
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleInStockOnlyChange = this.handleInStockOnlyChange.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleMultipleCheckboxChange = this.handleMultipleCheckboxChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.url = 'https://5e6736691937020016fed762.mockapi.io/products';
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
    const deleteBy = (id: string) => axios.delete(`${this.url}/${id}`);
    const products = this.state.products.filter((product) => product.checked);
    const ids = products.map((product) => product.id);

    const deleteAll = async () => {
      console.log(await Promise.all(ids.map(deleteBy)));
      const isNotDeleted = (product: Product) => !ids.includes(product.id);
      const products: Products = [...this.state.products].filter(isNotDeleted);
      this.setState({ products: products });
    };

    deleteAll();

    this.setState({ multipleCheckbox: { checked: false, indeterminate: false } });
  }

  handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>, id: string) {
    const checked = event.currentTarget.checked;

    const products: Products = [...this.state.products];
    if (!products) return;

    const product = products.find((product) => product.id === id);
    if (!product) return;

    product.checked = checked;

    this.setState({ products: products });

    const noChecked = products.every((product) => product.checked === false);
    const someChecked = products.some((product) => product.checked === true);
    const everyChecked = products.every((product) => product.checked === true);

    if (noChecked) {
      this.setState({
        multipleCheckbox: { checked: false, indeterminate: false },
      });
      return;
    }

    if (someChecked && !everyChecked) {
      this.setState({
        multipleCheckbox: { checked: true, indeterminate: true },
      });
      return;
    }

    if (everyChecked) {
      this.setState({
        multipleCheckbox: { checked: true, indeterminate: false },
      });
      return;
    }
  }

  handleMultipleCheckboxChange() {
    if (!this.state.multipleCheckbox.checked) {
      const products: Products = [...this.state.products].map((product) => ({
        ...product,
        checked: true,
      }));

      this.setState({
        products: products,
        multipleCheckbox: { checked: true, indeterminate: false },
      });

      return;
    }

    if (this.state.multipleCheckbox.checked) {
      const products: Products = [...this.state.products].map((product) => ({
        ...product,
        checked: false,
      }));

      this.setState({
        products: products,
        multipleCheckbox: { checked: false, indeterminate: false },
      });

      return;
    }
  }

  componentDidMount() {
    this.loadProducts(this.url);
  }

  loadProducts(url: string) {
    axios
      .get(url)
      .then((result) => {
        const products = result.data.map((product: Product) => ({
          ...product,
          checked: false,
        }));
        this.setState({ isLoaded: true, products: products });
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
          filter={this.state.filter}
          products={this.state.products}
          onNameChange={this.handleNameChange}
          onInStockOnlyChange={this.handleInStockOnlyChange}
          onDeleteClick={this.handleDeleteClick}
        />
        {!this.state.isLoaded ? (
          <div>Loading...</div>
        ) : (
          <ProductTable
            multipleCheckboxIndeterminate={this.state.multipleCheckbox.indeterminate}
            multipleCheckboxChecked={this.state.multipleCheckbox.checked}
            filter={this.state.filter}
            products={this.state.products}
            onMultipleCheckboxChange={this.handleMultipleCheckboxChange}
            onCheckboxChange={this.handleCheckboxChange}
          />
        )}
      </div>
    );
  }
}

export default ProductTableApp;