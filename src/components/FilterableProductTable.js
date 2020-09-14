import React from 'react';
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

function TopBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange,
}) {
  const handleFilterTextChange = (e) => {
    onFilterTextChange(e.target.value);
  };
  const handleInStockOnlyChange = (e) => {
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
            width="75%"
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
              type="checkbox"
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

function ProductTable({ filterText, inStockOnly, products, onDeleteClick }) {
  const handleDeleteClick = (e) => {
    onDeleteClick(e.currentTarget.dataset.id, e.currentTarget.dataset.index);
  };

  /**
   * @param {Array} product
   */
  const isFilterTextValid = (product) => {
    const capsName = product.name.toUpperCase();
    const capsFilterText = filterText.toUpperCase();
    return capsName.indexOf(capsFilterText) !== -1;
  };

  /**
   * @param {Array} product
   */
  const isInStockOnlyValid = (product) => {
    return inStockOnly ? product.stocked : !undefined;
  };

  const useStyles = makeStyles({ textDarkgray: { color: 'darkgray' } });
  const classes = useStyles();
  const getTableCellStyle = (product) =>
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
