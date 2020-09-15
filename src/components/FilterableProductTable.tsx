import React from 'react';
import { Products, Product } from './data';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/styles';

type TopBarProps = {
  filterText: string;
  inStockOnly: boolean;
  onFilterTextChange: (filterText: string) => void;
  onInStockOnlyChange: (checked: boolean) => void;
};

function TopBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange,
}: TopBarProps) {
  const handleFilterTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterTextChange(e.target.value);
  };
  const handleInStockOnlyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInStockOnlyChange(e.target.checked);
  };

  const useStyles = makeStyles({ 'w-250': { width: '250px' } });
  const classes = useStyles();

  return (
    <Box mb={2}>
      <form>
        <Box display="inline" pr={2}>
          <TextField
            className={classes['w-250']}
            color="primary"
            type="text"
            placeholder="Search name..."
            value={filterText}
            onChange={handleFilterTextChange}
          />
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              id="checkInStockOnly"
              checked={inStockOnly}
              onChange={handleInStockOnlyChange}
            />
          }
          label="Only show products in stock"
        />
      </form>
    </Box>
  );
}

type ProductTableProps = {
  filterText: string;
  inStockOnly: boolean;
  products: Products;
  onDeleteClick: (id: string, index: number) => void;
};

function ProductTable({
  filterText,
  inStockOnly,
  products,
  onDeleteClick,
}: ProductTableProps) {
  const handleDeleteClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const id = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;
    // onDeleteClick(id, index);
  };

  const isFilterTextValid = (product: Product) => {
    const capsName = product.name.toUpperCase();
    const capsFilterText = filterText.toUpperCase();
    return capsName.indexOf(capsFilterText) !== -1;
  };

  const isInStockOnlyValid = (product: Product) => {
    return inStockOnly ? product.stocked : !undefined;
  };

  const useStyles = makeStyles({ textDarkgray: { color: 'darkgray' } });
  const classes = useStyles();
  const getTableCellStyle = (product: Product) =>
    !product.stocked ? classes.textDarkgray : '';

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow className="table-row">
            <TableCell align="center"></TableCell>
            <TableCell align="right">ID</TableCell>
            <TableCell align="left">Brand</TableCell>
            <TableCell align="left">Category</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products
            .filter(isFilterTextValid)
            .filter(isInStockOnlyValid)
            .map((product, index) => (
              <TableRow key={product.id}>
                <TableCell
                  className={getTableCellStyle(product)}
                  align="center"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    data-id={product.id}
                    data-index={index}
                    onClick={handleDeleteClick}
                  >
                    Delete
                  </Button>
                </TableCell>
                <TableCell className={getTableCellStyle(product)} align="right">
                  {product.id}
                </TableCell>
                <TableCell className={getTableCellStyle(product)} align="left">
                  {product.brand}
                </TableCell>
                <TableCell className={getTableCellStyle(product)} align="left">
                  {product.category}
                </TableCell>
                <TableCell className={getTableCellStyle(product)} align="left">
                  {product.name}
                </TableCell>
                <TableCell className={getTableCellStyle(product)} align="right">
                  {product.price}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

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
    this.url = 'https://5e6736691937020016fed762.mockapi.io/products';
  }

  handleFilterTextChange(filterText: string) {
    this.setState({ filterText: filterText });
  }

  handleInStockOnlyChange(inStockOnly: boolean) {
    this.setState({ inStockOnly: inStockOnly });
  }

  handleDeleteClick(id: string, index: number) {
    axios.delete(`${this.url}/${id}`).then((result) => {
      console.log(`Deleted: id = ${result.data.id}`);
      this.state.products.splice(index, 1);
      this.setState({ isLoaded: true, products: this.state.products });
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
