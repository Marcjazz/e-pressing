import { ICreateCloth } from '@e-pressing/interfaces';
import { Add } from '@mui/icons-material';
import { Box, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';

export interface IOrderProps {
  children?: JSX.Element;
}
export type Error =
  | { field: 'description'; error: string }
  | { field: 'cloths'; fake_id: number; error: string };

function useNewOrder() {
  const [newOrder, setNewOrder] = useState<{
    cloths: { fake_id: number; value: ICreateCloth }[];
    description: string;
  }>({
    cloths: [],
    description: '',
  });

  const [errors, setErrors] = useState<Error[]>();

  const descriptionHandler = (description: string) => {
    setNewOrder((newOrder) => ({ ...newOrder, description }));
  };

  const addClothHandler = () => {
    setNewOrder((newOrder) => ({
      ...newOrder,
      cloths: [
        ...newOrder.cloths,
        {
          fake_id: newOrder.cloths.length + 1,
          value: {
            cloth_color: '',
            cloth_name: '',
            quantity: 1,
            remarks: '',
            washing_price: 100,
          },
        },
      ],
    }));
  };

  const removeClothHandler = (fake_id: number) => {
    setNewOrder((newOrder) => ({
      ...newOrder,
      cloths: newOrder.cloths.filter((_) => _.fake_id === fake_id),
    }));
  };

  const updateClothHandler = (
    fake_id: number,
    updatedCloth: Partial<ICreateCloth>
  ) => {
    setNewOrder((newOrder) => ({
      ...newOrder,
      cloths: newOrder.cloths.map((cloth) =>
        cloth.fake_id === fake_id ? { ...cloth, ...updatedCloth } : cloth
      ),
    }));
  };

  const sumbitNewOrderHandler = () => {
    const { cloths, description } = newOrder;
    if (!description) {
      const newError: Error = {
        field: 'description',
        error: 'Description is required !',
      };
      setErrors((errors) => (errors ? [...errors, newError] : [newError]));
    }
    if (description.length > 255) {
      const newError: Error = {
        field: 'description',
        error: 'Description is too long. Please make it sort',
      };
      setErrors((errors) => (errors ? [...errors, newError] : [newError]));
    }
    if (cloths.length === 0) {
      const newError: Error = {
        field: 'cloths',
        fake_id: 0,
        error: 'There must be at least 1 cloths in the order',
      };
      setErrors((errors) => (errors ? [...errors, newError] : [newError]));
    } else {
      cloths.forEach(({ fake_id, value: cloth }) => {
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

    if (errors?.length === 0)
      return { description, cloths: cloths.map((_) => _.value) };
  };

  return {
    newOrder,
    dispatchers: {
      addClothHandler,
      removeClothHandler,
      updateClothHandler,
      sumbitNewOrderHandler,
      descriptionHandler,
    },
  };
}
export default function Order({ children = <>Hello world</> }: IOrderProps) {
  const {
    newOrder: { cloths, description },
    dispatchers: { descriptionHandler, addClothHandler, updateClothHandler },
  } = useNewOrder();
  return (
    <Box>
      <Typography variant="h3">Enregistrer une commande</Typography>
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
          }}
        >
          <TextField
            id="description"
            name="description"
            label="Description"
            size="small"
            variant="outlined"
            fullWidth
            value={description}
            onChange={(e) => descriptionHandler(e.target.value)}
          />
          <IconButton onClick={addClothHandler}>
            <Tooltip title="add new Cloth">
              <Add color="secondary" />
            </Tooltip>
          </IconButton>
        </Box>
        {cloths.map(
          ({
            fake_id,
            value: { cloth_color, cloth_name, quantity, washing_price },
          }) => (
            <Box
              key={fake_id}
              sx={{ display: 'grid', gridAutoFlow: 'column', columnGap: 2 }}
            >
              <TextField
                id={`cloth_name-${fake_id}`}
                name={`cloth_name-${fake_id}`}
                label="Cloth Description"
                size="small"
                variant="outlined"
                value={cloth_name}
                sx={{ width: '50vw' }}
                onChange={(e) => updateClothHandler(fake_id, { cloth_name })}
              />
              <Box
                sx={{ display: 'grid', gridAutoFlow: 'column', columnGap: 1 }}
              >
                <TextField
                  id={`quantity-${fake_id}`}
                  name={`quantity-${fake_id}`}
                  label="Quantity"
                  size="small"
                  variant="outlined"
                  type="number"
                  value={quantity}
                  onChange={(e) => updateClothHandler(fake_id, { quantity })}
                />
                <TextField
                  id={`cloth_color-${fake_id}`}
                  name={`cloth_color-${fake_id}`}
                  label="Cloth color"
                  size="small"
                  variant="outlined"
                  value={cloth_color}
                  onChange={(e) => updateClothHandler(fake_id, { cloth_color })}
                />
                <TextField
                  id={`washing_price-${fake_id}`}
                  name={`washing_price-${fake_id}`}
                  label="Washing price"
                  size="small"
                  variant="outlined"
                  type="number"
                  value={washing_price}
                  onChange={(e) =>
                    updateClothHandler(fake_id, { washing_price })
                  }
                />
                <TextField
                  id={`partial_total-${fake_id}`}
                  name={`partial_total-${fake_id}`}
                  label="Partial total"
                  size="small"
                  variant="outlined"
                  type="number"
                  disabled
                  value={quantity * washing_price}
                />
              </Box>
            </Box>
          )
        )}
      </Box>
    </Box>
  );
}
