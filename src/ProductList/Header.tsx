import React from 'react';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { createStyles, makeStyles } from '@material-ui/styles';
import { Products } from '../types/index';
import { Theme } from '@material-ui/core';

type TopBarProps = {
  filter: { name: string; inStockOnly: boolean };
  products: Products;
  onNameChange: (name: string) => void;
  onInStockOnlyChange: (checked: boolean) => void;
  onDeleteClick: () => void;
  isDeleteLoading: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textField: {
      width: '240px',
    },
    textTransformNone: {
      textTransform: 'none',
    },
  })
);

export default function TopBar(props: TopBarProps) {
  const {
    filter,
    products,
    onNameChange,
    onInStockOnlyChange,
    onDeleteClick,
    isDeleteLoading,
  } = props;

  const handleNameChange = (e: React.ChangeEvent<any>) => {
    onNameChange(e.target.value);
  };

  const handleInStockOnlyChange = (e: React.ChangeEvent<any>) => {
    onInStockOnlyChange(e.target.checked);
  };

  const checkedProductCount = products.filter((product) => product.checked).length;

  const classes = useStyles();

  return (
    <Box mb={2}>
      <form>
        <Box display="inline-block">
          <TextField
            className={classes.textField}
            color="primary"
            type="text"
            placeholder="Search name..."
            value={filter.name}
            onChange={handleNameChange}
          />
        </Box>

        <Box display="inline-block">
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
            className={classes.textTransformNone}
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
