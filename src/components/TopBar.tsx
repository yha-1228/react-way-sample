import React from 'react';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/styles';

type TopBarProps = {
  filterText: string;
  inStockOnly: boolean;
  onFilterTextChange: (filterText: string) => void;
  onInStockOnlyChange: (checked: boolean) => void;
};

export default function TopBar({
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
