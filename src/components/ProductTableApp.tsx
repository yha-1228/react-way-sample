import React, { Component } from 'react';
import { Product, Products } from '../types/index';
import TopBar from './TopBar';
import ProductTable from './ProductTable';
import { PRODUCTS_URL, wait } from '../constants';

type ProductTableAppProps = {};

type ProductTableAppState = {
  error: null | string;
  isLoaded: boolean;
  products: Products;
  filter: { name: string; inStockOnly: boolean };
  multipleCheckbox: { checked: boolean; indeterminate: boolean };
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
      multipleCheckbox: { checked: false, indeterminate: false },
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

      await wait(2500);

      const isNotDeleted = (product: Product) => !checkedIds.includes(product.id);
      this.setState({
        products: [...this.state.products].filter(isNotDeleted),
        isDeleteLoading: false,
      });
    })();

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

    const noChecked = products.every((product) => !product.checked);
    const someChecked = products.some((product) => product.checked);
    const everyChecked = products.every((product) => product.checked);

    if (noChecked) {
      this.setState({ multipleCheckbox: { checked: false, indeterminate: false } });
      return;
    }

    if (someChecked && !everyChecked) {
      this.setState({ multipleCheckbox: { checked: true, indeterminate: true } });
      return;
    }

    if (everyChecked) {
      this.setState({ multipleCheckbox: { checked: true, indeterminate: false } });
      return;
    }
  }

  handleMultipleCheckboxChange() {
    if (!this.state.multipleCheckbox.checked) {
      this.setState({
        products: [...this.state.products].map((product) => ({ ...product, checked: true })),
        multipleCheckbox: { checked: true, indeterminate: false },
      });

      return;
    }

    if (this.state.multipleCheckbox.checked) {
      this.setState({
        products: [...this.state.products].map((product) => ({ ...product, checked: false })),
        multipleCheckbox: { checked: false, indeterminate: false },
      });

      return;
    }
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
          console.log(error);
        }
      );

    // axios
    //   .get(url)
    //   .then((result) => {
    //     const products = result.data.map((product: Product) => ({ ...product, checked: false }));
    //     this.setState({ isLoaded: true, products: products });
    //   })
    //   .catch((result) => {
    //     this.setState({ isLoaded: true, error: 'Error!' });
    //     console.log({ ...result.response });
    //   });
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
      </>
    );
  }
}

export default ProductTableApp;
