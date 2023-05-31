import { ICloth } from '@e-pressing/interfaces';
import { Checkbox, TableCell, TableRow } from '@mui/material';
import { MouseEvent } from 'react';

export interface IOrderCardItemProps extends ICloth {
  children?: JSX.Element;
  labelId: string;
  isItemSelected: boolean;
  handleClick: (event: MouseEvent<unknown>, cloth_id: string) => void;
}

export default function OrderCardItem({
  cloth_id,
  cloth_name,
  quantity,
  status,
  washing_price,

  labelId,
  handleClick,
  isItemSelected,
}: IOrderCardItemProps) {
  return (
    <TableRow
      hover
      onClick={(event) => handleClick(event, cloth_id)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={labelId}
      selected={isItemSelected}
      sx={{ cursor: 'pointer' }}
    >
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={isItemSelected}
          inputProps={{
            'aria-labelledby': labelId,
          }}
        />
      </TableCell>
      <TableCell component="th" id={labelId} scope="row" padding="none">
        {cloth_name}
      </TableCell>
      <TableCell align="right">{washing_price}</TableCell>
      <TableCell align="right">{quantity}</TableCell>
      <TableCell align="right">{washing_price * quantity}</TableCell>
    </TableRow>
  );
}
