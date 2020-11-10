import React from 'react';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/styles';
import { Products } from '../types/index';

type TopBarProps = {
  filter: { name: string; inStockOnly: boolean };
  products: Products;
  onNameChange: (name: string) => void;
  onInStockOnlyChange: (checked: boolean) => void;
  onDeleteClick: () => void;
  isDeleteLoading: boolean;
};

export default function TopBar({
  filter,
  products,
  onNameChange,
  onInStockOnlyChange,
  onDeleteClick,
  isDeleteLoading,
}: TopBarProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name: string = e.target.value;
    onNameChange(name);
  };

  const handleInStockOnlyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInStockOnlyChange(e.target.checked);
  };

  const useStyles = makeStyles({ w300: { width: '300px' } });

  const classes = useStyles();

  const checkedProductCount = products.filter((product) => product.checked).length;

  return (
    <Box mb={2}>
      <form>
        <Box display="inline" pr={2}>
          <TextField
            className={classes.w300}
            color="primary"
            type="text"
            placeholder="Search name..."
            value={filter.name}
            onChange={handleNameChange}
          />
        </Box>
        <Box display="inline" pr={2}>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                id="checkInStockOnly"
                checked={filter.inStockOnly}
                onChange={handleInStockOnlyChange}
              />
            }
            label="Only show products in stock"
          />
        </Box>
        <span style={{ cursor: 'not-allowed' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onDeleteClick}
            disabled={!checkedProductCount || isDeleteLoading}
          >
            Delete{checkedProductCount ? ` (${checkedProductCount})` : ''}
          </Button>
        </span>
      </form>
    </Box>
  );
}
