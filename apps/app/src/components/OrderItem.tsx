import { ICloth } from '@e-pressing/interfaces';
import { Checkbox, TableCell, TableRow, Typography } from '@mui/material';
import { MouseEvent } from 'react';

export interface IOrderItemProps extends ICloth {
  children?: JSX.Element;
  labelId: string;
  isItemSelected: boolean;
  handleClick: (event: MouseEvent<unknown>, cloth_id: string) => void;
}

export default function OrderItem({
  cloth_id,
  cloth_name,
  quantity,
  status,
  washing_price,

  labelId,
  handleClick,
  isItemSelected,
}: IOrderItemProps) {
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
      <TableCell align="left" padding="none">
        <Typography
         variant='subtitle1'
          sx={{
            textTransform: 'capitalize',
            color:
              status === 'PENDING'
                ? '#ed6c02'
                : status === 'REMOVED'
                ? '#00ba88'
                : '#3498db',
          }}
        >
          {status.toLowerCase()}
        </Typography>
      </TableCell>
      <TableCell align="right">{washing_price}</TableCell>
      <TableCell align="right">{quantity}</TableCell>
      <TableCell align="right">{washing_price * quantity}</TableCell>
    </TableRow>
  );
}
