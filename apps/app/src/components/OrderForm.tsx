import { Error, ICreateCloth } from '@e-pressing/interfaces';
import { Delete } from '@mui/icons-material';
import { Box, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { theme } from '../theme';

interface IOrderFormProps extends ICreateCloth {
  errors: Error[];
  disabled: boolean;
  textFieldId: string;
  children?: JSX.Element;
  removeClothHandler: (id: string) => void;
  onChangeHandler: (id: string, updatedCloth: Partial<ICreateCloth>) => void;
}
export default function OrderForm({
  errors,
  quantity,
  cloth_name,
  washing_price,

  disabled,
  textFieldId,
  onChangeHandler,
  removeClothHandler,
}: IOrderFormProps) {
  const textFieldError = errors.find(
    (_) => _.item_id === textFieldId && _.field === 'cloth_name'
  )?.error;
  const [isFocus, setIsFocus] = useState(false);

  return (
    <Box
      sx={{
        border: `${isFocus ? '2px solid #007aff' : '1px solid gray'}`,
        borderRadius: '10px',
        padding: theme.spacing(2),
        display: 'grid',
        gap: 1,
      }}
      onBlur={() => setIsFocus(false)}
      onFocus={() => setIsFocus(true)}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
        <TextField
          id={`cloth_name-${textFieldId}`}
          name={`cloth_name-${textFieldId}`}
          label="Cloth Description"
          size="small"
          fullWidth
          variant="standard"
          value={cloth_name}
          disabled={disabled}
          helperText={textFieldError}
          error={Boolean(textFieldError)}
          onChange={(e) =>
            onChangeHandler(textFieldId, { cloth_name: e.target.value })
          }
        />
        <IconButton
          color="error"
          size="medium"
          onClick={() => removeClothHandler(textFieldId)}
          sx={{ justifySelf: 'end' }}
        >
          <Tooltip title="delete item">
            <Delete />
          </Tooltip>
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          columnGap: 1,
        }}
      >
        <TextField
          id={`washing_price-${textFieldId}`}
          name={`washing_price-${textFieldId}`}
          label="Washing price"
          size="small"
          variant="standard"
          type="number"
          value={washing_price}
          disabled={disabled}
          onChange={(e) =>
            onChangeHandler(textFieldId, {
              washing_price: Number(e.target.value),
            })
          }
        />
        <TextField
          id={`quantity-${textFieldId}`}
          name={`quantity-${textFieldId}`}
          label="Quantity"
          size="small"
          variant="standard"
          type="number"
          value={quantity}
          disabled={disabled}
          onChange={(e) =>
            onChangeHandler(textFieldId, { quantity: Number(e.target.value) })
          }
        />
      </Box>
      <Box sx={{ display: 'grid', gridAutoFlow: 'column', columnGap: 1 }}>
        <Typography variant="subtitle2">
          Total: {washing_price * quantity} XAF
        </Typography>
      </Box>
    </Box>
  );
}
