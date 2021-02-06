import React from 'react';
import classnames from 'classnames';
import { Products, Product } from '../types/index';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/styles';

type ProductTableProps = {
  bulkCheckboxIndeterminate: boolean;
  bulkCheckboxChecked: boolean;
  filter: { name: string; inStockOnly: boolean };
  products: Products;
  onCheckboxChange: (event: React.ChangeEvent<any>, id: string) => void;
  onBlukCheckboxChange: (event: React.ChangeEvent<any>) => void;
};

const useStyles = makeStyles({
  root: {
    '& th, & td': {
      fontSize: '16px',
    },
  },
  textDarkgray: {
    color: 'darkgray',
  },
});

export default function ProductTable(props: ProductTableProps) {
  const {
    bulkCheckboxIndeterminate,
    bulkCheckboxChecked,
    filter,
    products,
    onCheckboxChange,
    onBlukCheckboxChange,
  } = props;

  const classes = useStyles();

  const isNameValid = (product: Product) => {
    if (filter.name === undefined) return;

    const name = product.name.toUpperCase();
    const filterName = filter.name.toUpperCase().trim();
    return name.indexOf(filterName) !== -1;
  };

  const isInStockOnlyValid = (product: Product) => {
    return filter.inStockOnly ? product.stocked : product;
  };

  const handleCheckboxChange = (event: React.ChangeEvent<any>, id: string) => {
    onCheckboxChange(event, id);
  };

  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">
              <Checkbox
                color="primary"
                checked={bulkCheckboxChecked}
                indeterminate={bulkCheckboxIndeterminate}
                onChange={onBlukCheckboxChange}
              />
            </TableCell>
            <TableCell align="right">ID</TableCell>
            <TableCell align="left">Brand</TableCell>
            <TableCell align="left">Category</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products
            .filter(isNameValid)
            .filter(isInStockOnlyValid)
            .map((product) => (
              <TableRow key={product.id}>
                <TableCell align="center">
                  <Checkbox
                    color="primary"
                    checked={product.checked}
                    onChange={(event) => handleCheckboxChange(event, product.id)}
                  />
                </TableCell>
                <TableCell align="right">{product.id}</TableCell>
                <TableCell align="left">{product.brand}</TableCell>
                <TableCell align="left">{product.category}</TableCell>
                <TableCell align="left">{product.name}</TableCell>
                <TableCell align="right">{product.price}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
