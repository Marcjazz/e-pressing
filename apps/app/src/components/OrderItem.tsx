import { ClothStatus, ICloth } from '@e-pressing/interfaces';
import { Done, DoneAll, Schedule } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  ListItemText,
  Tooltip,
  Typography,
  capitalize,
} from '@mui/material';
import { useState } from 'react';

export interface IOrderItemProps extends ICloth {
  children?: JSX.Element;
  selected: string[];
  handleSelect: (clothId: string) => void;
  handleExpandedNumber: (expanded: boolean) => void;
  handleStatusChange: (clothId: string, newStatus: ClothStatus) => void;
}

export default function OrderItem({
  cloth_id,
  cloth_name,
  quantity,
  status,
  washing_price,

  selected,
  handleSelect,
  handleStatusChange,
  handleExpandedNumber,
}: IOrderItemProps) {
  const [expanded, setExpanded] = useState(false);
  const newStatus = status === 'PENDING' ? 'WASHED' : 'REMOVED';

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title={status}>
          {status === 'PENDING' ? (
            <Schedule fontSize="medium" sx={{ color: '#ed6c02' }} />
          ) : status === 'WASHED' ? (
            <Done fontSize="medium" sx={{ color: '#3498db' }} />
          ) : (
            <DoneAll fontSize="medium" sx={{ color: '#00ba88' }} />
          )}
        </Tooltip>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            width: '100%',
          }}
        >
          <Typography
            onClick={() => {
              setExpanded(!expanded);
              handleExpandedNumber(!expanded);
            }}
            variant="subtitle1"
            fontWeight="bold"
            padding={1}
          >
            {`${capitalize(cloth_name).slice(0, 25)}...`}
          </Typography>
          {!expanded && (
            <Checkbox
              sx={{ justifySelf: 'end' }}
              onClick={() => handleSelect(cloth_id)}
              color="primary"
              checked={selected.includes(cloth_id)}
              inputProps={{
                'aria-labelledby': cloth_id,
              }}
            />
          )}
        </Box>
      </Box>
      <Divider />
      <Collapse
        timeout="auto"
        unmountOnExit
        in={expanded}
        orientation="vertical"
      >
        <ListItemText primary={'Description'} secondary={cloth_name} />
        <Box sx={{ display: 'flex' }}>
          <ListItemText primary={'Washing price'} secondary={washing_price} />
          <ListItemText primary={'Quantity'} secondary={quantity} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'end' }}>
          <ListItemText primary={'Status'} secondary={status} />
          <Button
            size="small"
            variant="contained"
            sx={{ height: 'fit-content' }}
            color={status === 'WASHED' ? 'success' : 'primary'}
            onClick={() => handleStatusChange(cloth_id, newStatus)}
          >
            {newStatus === 'REMOVED' ? 'GiVE OUT' : newStatus}
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
}
