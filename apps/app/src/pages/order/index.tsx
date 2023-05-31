import { ICreateCloth } from '@e-pressing/interfaces';
import { Add } from '@mui/icons-material';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import InputCard from '../../components/inputCard';

export interface IOrderProps {
  children?: JSX.Element;
}
export type Error =
  | { field: 'description'; error: string }
  | { field: 'cloths'; fake_id: number; error: string };

function useNewOrder() {
  const [newItems, setNewItems] = useState<
    { fake_id: number; value: ICreateCloth }[]
  >([]);

  const [errors, setErrors] = useState<Error[]>();

  const addClothHandler = () => {
    setNewItems((newItems) => [
      ...newItems,
      {
        fake_id: newItems.length + 1,
        value: {
          cloth_color: '',
          cloth_name: '',
          quantity: 1,
          remarks: '',
          washing_price: 100,
        },
      },
    ]);
  };

  const removeClothHandler = (fake_id: number) => {
    setNewItems((newItems) => newItems.filter((_) => _.fake_id === fake_id));
  };

  const updateClothHandler = (
    fake_id: number,
    updatedCloth: Partial<ICreateCloth>
  ) => {
    setNewItems((newItems) =>
      newItems.map((cloth) =>
        cloth.fake_id === fake_id ? { ...cloth, ...updatedCloth } : cloth
      )
    );
  };

  const sumbitNewOrderHandler = () => {
    if (newItems.length === 0) {
      const newError: Error = {
        field: 'cloths',
        fake_id: 0,
        error: 'There must be at least 1 cloths in the order',
      };
      setErrors((errors) => (errors ? [...errors, newError] : [newError]));
    } else {
      newItems.forEach(({ fake_id, value: cloth }) => {
        Object.keys(cloth).forEach((key) =>
          !cloth[key as keyof ICreateCloth]
            ? setErrors((errors) =>
                errors
                  ? [...errors]
                  : [
                      {
                        fake_id,
                        field: 'cloths',
                        error: `cloth's ${key} is required !`,
                      },
                    ]
              )
            : {}
        );
      });
    }

    if (errors?.length === 0) return newItems.map((_) => _.value);
  };

  return {
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
    newItems,
    dispatchers: { addClothHandler, updateClothHandler },
  } = useNewOrder();
  return (
    <Box height={'100%'}>
      <Typography variant="h3">New record</Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
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
            <Tooltip title="add new Cloth">
              <Add color="secondary" />
            </Tooltip>
          </IconButton>
        </Box>
        {newItems.map(({ fake_id, value }) => (
          <InputCard
            {...value}
            key={fake_id}
            textFieldId={fake_id}
            onChangeHandler={updateClothHandler}
          />
        ))}
      </Box>
    </Box>
  );
}
