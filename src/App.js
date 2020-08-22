import React from 'react';
import './App.css';

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
  // TODO: mapを使う
  const rows = [];

  props.products.forEach((product) => {
    if (product.name.indexOf(props.filterText) === -1) {
      return;
    }

    if (props.inStockOnly && !product.stocked) {
      return;
    }

    rows.push(
      <tr key={product.id} className={product.stocked ? 'normal' : 'warn'}>
        <td>{product.name}</td>
        <td>{product.price}</td>
      </tr>
    );
  });

  return (
    <table>
      <thead>
        <tr>
          <th>商品名</th>
          <th>価格</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filterText: '', inStockOnly: false };
  }

  componentDidMount() {
    // componentDidMount()
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
          products={this.props.products}
        />
      </div>
    );
  }
}

const products = [
  {
    id: 1,
    category: 'Sporting Goods',
    price: '$49.99',
    stocked: true,
    name: 'Football',
  },
  {
    id: 2,
    category: 'Sporting Goods',
    price: '$9.99',
    stocked: true,
    name: 'Baseball',
  },
  {
    id: 3,
    category: 'Sporting Goods',
    price: '$29.99',
    stocked: false,
    name: 'Basketball',
  },
  {
    id: 4,
    category: 'Electronics',
    price: '$99.99',
    stocked: true,
    name: 'iPod Touch',
  },
  {
    id: 5,
    category: 'Electronics',
    price: '$399.99',
    stocked: false,
    name: 'iPhone 5',
  },
  {
    id: 6,
    category: 'Electronics',
    price: '$199.99',
    stocked: true,
    name: 'Nexus 7',
  },
];

function App() {
  return <FilterableProductTable products={products} />;
}

export default App;
