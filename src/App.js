import React from 'react';
import './App.css';
import Axios from 'axios';

function SearchBar(props) {
  return (
    <form>
      <input
        type="text"
        placeholder="検索..."
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
        <label htmlFor="checkInStockOnly">在庫ありの商品だけ表示</label>
      </p>
    </form>
  );
}

function ProductTable(props) {
  return (
    <table>
      <thead>
        <tr>
          <th>商品名</th>
          <th>価格</th>
        </tr>
      </thead>
      <tbody>
        {props.products.map((product) => (
          <tr key={product.id}>
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
