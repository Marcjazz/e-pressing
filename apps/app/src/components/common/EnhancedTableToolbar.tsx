import { ClothStatus } from '@e-pressing/interfaces';
import {
  Button, Chip, Toolbar,
  Typography,
  alpha
} from '@mui/material';
import { theme } from '../../theme';

interface EnhancedTableToolbarProps {
  numSelected: number;
  order_number: string;
  status: ClothStatus;
  handleDelivery: () => void;
}
export function EnhancedTableToolbar({
  numSelected, order_number, status, handleDelivery,
}: EnhancedTableToolbarProps) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(
            theme.palette.primary.main,
            theme.palette.action.activatedOpacity
          ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: 1 }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {order_number}
        </Typography>
      )}
      <Chip
        label={status}
        color={status === 'PENDING'
          ? 'warning'
          : status === 'REMOVED'
            ? 'success'
            : 'info'} />
      {status !== 'REMOVED' && (
        <Button
          sx={{
            marginLeft: theme.spacing(2),
          }}
          onClick={handleDelivery}
          variant="contained"
          size="small"
          disabled={numSelected === 0}
        >
          {status === 'PENDING' ? 'update to washed' : 'update to revomed'}
        </Button>
      )}
    </Toolbar>
  );
}
