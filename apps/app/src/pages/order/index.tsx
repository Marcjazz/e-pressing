import { ICreateCloth } from '@e-pressing/interfaces';
import { Add } from '@mui/icons-material';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import InputCard, { Error, Item } from '../../components/inputCard';

export interface IOrderProps {
  children?: JSX.Element;
}

function useNewOrder() {
  const [newItems, setNewItems] = useState<Item[]>([]);

  const [errors, setErrors] = useState<Error[]>([]);

  const addClothHandler = () => {
    const errors = validtedFields();
    if (errors.length === 0)
      setNewItems((newItems) => [
        {
          item_id: newItems.length + 1,
          value: {
            cloth_name: '',
            quantity: 1,
            washing_price: 100,
          },
        },
        ...newItems,
      ]);
  };

  const removeClothHandler = (fake_id: number) => {
    setNewItems((newItems) => newItems.filter((_) => _.item_id === fake_id));
  };

  const updateClothHandler = (
    fake_id: number,
    updatedCloth: Partial<ICreateCloth>
  ) => {
    setNewItems((newItems) =>
      newItems.map((cloth) => {
        return cloth.item_id === fake_id
          ? { item_id: fake_id, value: { ...cloth.value, ...updatedCloth } }
          : cloth;
      })
    );
    validtedFields();
  };

  const validtedFields = () => {
    setErrors([]);
    const newErrors: Error[] = [];
    newItems.forEach(({ item_id, value: cloth }) => {
      Object.keys(cloth).forEach((key) => {
        const clothKey = key as keyof ICreateCloth;
        if (!cloth[clothKey]) {
          const newError: Error = {
            item_id,
            field: clothKey,
            error: `This field is required !`,
          };
          newErrors.push(newError);
        }
      });
    });
    setErrors((errors) => (errors ? [...errors, ...newErrors] : newErrors));
    return newErrors;
  };

  const sumbitNewOrderHandler = () => {
    const errors = validtedFields();
    if (errors.length === 0) {
      console.log(newItems.map((_) => _.value));
    }
  };

  return {
    errors,
    newItems,
    dispatchers: {
      addClothHandler,
      removeClothHandler,
      updateClothHandler,
      sumbitNewOrderHandler,
    },
  };
}
export default function Order(props: IOrderProps) {
  const {
    errors,
    newItems,
    dispatchers: { addClothHandler, updateClothHandler, sumbitNewOrderHandler },
  } = useNewOrder();
  return (
    <Box height={'100%'}>
      <Typography variant="h3">New record</Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: 'auto auto 1fr',
          rowGap: 2,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            columnGap: 2,
            alignItems: 'center',
          }}
        >
          <Typography variant="subtitle2">
            {new Date().toUTCString()}
          </Typography>
          <IconButton onClick={addClothHandler}>
            <Tooltip title="add new item">
              <Add color="secondary" />
            </Tooltip>
          </IconButton>
        </Box>
        <Button
          size="small"
          variant="contained"
          onClick={sumbitNewOrderHandler}
        >
          submit
        </Button>
        {newItems.map(({ item_id: fake_id, value }) => (
          <InputCard
            {...value}
            key={fake_id}
            errors={errors}
            textFieldId={fake_id}
            onChangeHandler={updateClothHandler}
          />
        ))}
      </Box>
    </Box>
  );
}
