import React from 'react';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/styles';
import { Products } from './data';

type TopBarProps = {
  filterText: string;
  inStockOnly: boolean;
  products: Products;
  onFilterTextChange: (filterText: string) => void;
  onInStockOnlyChange: (checked: boolean) => void;
  onDeleteClick: () => void;
};

export default function TopBar({
  filterText,
  inStockOnly,
  products,
  onFilterTextChange,
  onInStockOnlyChange,
  onDeleteClick,
}: TopBarProps) {
  const handleFilterTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filterText: string = e.target.value;
    onFilterTextChange(filterText);
  };

  const handleInStockOnlyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInStockOnlyChange(e.target.checked);
  };

  const useStyles = makeStyles({ 'w-250': { width: '250px' } });
  const classes = useStyles();

  const checkedProductCount = products.filter((product) => product.checked)
    .length;

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
        <Box display="inline" pr={2}>
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
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={onDeleteClick}
          disabled={!checkedProductCount}
        >
          Delete{checkedProductCount ? ` (${checkedProductCount})` : ''}
        </Button>
      </form>
    </Box>
  );
}
