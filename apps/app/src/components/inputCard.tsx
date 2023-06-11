import { Error, ICreateCloth } from '@e-pressing/interfaces';
import { Box, TextField, Typography } from '@mui/material';
import { theme } from '../theme';

interface InputCardProps extends ICreateCloth {
  errors: Error[];
  textFieldId: string;
  children?: JSX.Element;
  onChangeHandler: (id: string, updatedCloth: Partial<ICreateCloth>) => void;
}
export default function InputCard({
  errors,
  quantity,
  cloth_name,
  washing_price,

  textFieldId,
  onChangeHandler,
}: InputCardProps) {
  const textFieldError = errors.find(
    (_) => _.item_id === textFieldId && _.field === 'cloth_name'
  )?.error;
  return (
    <Box
      sx={{
        border: '1px solid gray',
        borderRadius: '10px',
        padding: theme.spacing(2),
        display: 'grid',
        gap: 1,
      }}
    >
      <TextField
        id={`cloth_name-${textFieldId}`}
        name={`cloth_name-${textFieldId}`}
        label="Cloth Description"
        size="small"
        fullWidth
        variant="standard"
        value={cloth_name}
        helperText={textFieldError}
        error={Boolean(textFieldError)}
        onChange={(e) =>
          onChangeHandler(textFieldId, { cloth_name: e.target.value })
        }
      />
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
