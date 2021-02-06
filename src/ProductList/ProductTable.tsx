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
  multipleCheckboxIndeterminate: boolean;
  multipleCheckboxChecked: boolean;
  filter: { name: string; inStockOnly: boolean };
  products: Products;
  onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>, id: string) => void;
  onMultipleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const useStyles = makeStyles({
  lh26: { lineHeight: '26px' },
  textMiddleSize: { fontSize: '16px' },
  textDarkgray: { color: 'darkgray' },
});

export default function ProductTable({
  multipleCheckboxIndeterminate,
  multipleCheckboxChecked,
  filter,
  products,
  onCheckboxChange,
  onMultipleCheckboxChange,
}: ProductTableProps) {
  const isNameValid = (product: Product) => {
    if (filter.name === undefined) return;

    const name = product.name.toUpperCase();
    const filterName = filter.name.toUpperCase().trim();
    return name.indexOf(filterName) !== -1;
  };

  const isInStockOnlyValid = (product: Product) => {
    if (filter.inStockOnly === undefined) return;

    return filter.inStockOnly ? product.stocked : !undefined;
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    onCheckboxChange(event, id);
  };

  const classes = useStyles();

  const getTableCellStyle = (product: Product) => {
    return classnames(classes.lh26, classes.textMiddleSize, {
      [classes.textDarkgray]: !product.stocked,
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">
              <Checkbox
                color="primary"
                checked={multipleCheckboxChecked}
                indeterminate={multipleCheckboxIndeterminate}
                onChange={onMultipleCheckboxChange}
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
                <TableCell className={getTableCellStyle(product)} align="center">
                  <Checkbox
                    color="primary"
                    checked={product.checked}
                    onChange={(event) => handleCheckboxChange(event, product.id)}
                  />
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
