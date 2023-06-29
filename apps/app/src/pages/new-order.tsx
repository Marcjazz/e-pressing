import { Error, IClient, ICreateCloth, Item } from '@e-pressing/interfaces';
import { Add } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import InputCard from '../components/inputCard';
import { useMongoDB } from '../providers/mongoDB';
import { createNewOrder } from '../services/orders.service';

interface INewOrderProps {
  children?: JSX.Element;
}

function useNewOrder() {
  const { db } = useMongoDB();
  const navigate = useNavigate();
  const [client, setClient] = useState<IClient>({
    client_fullname: '',
    client_phone_number: '',
  });
  const [receptionDate, setReceptionDate] = useState(
    Date.now() + 3 * 24 * 3600 * 1000
  );
  const [newItems, setNewItems] = useState<Item[]>([
    {
      item_id: `item-1`,
      value: {
        cloth_name: '',
        quantity: 1,
        washing_price: 100,
      },
    },
  ]);

  const [errors, setErrors] = useState<Error[]>([]);

  const addClothHandler = () => {
    const errors = validtedFields();
    if (errors.length === 0)
      setNewItems((newItems) => [
        {
          item_id: `item-${newItems.length + 1}`,
          value: {
            cloth_name: '',
            quantity: 1,
            washing_price: 100,
          },
        },
        ...newItems,
      ]);
  };

  const removeClothHandler = (fake_id: string) => {
    setNewItems((newItems) => newItems.filter((_) => _.item_id === fake_id));
  };

  const updateClothHandler = (
    fake_id: string,
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

  const updateClientHandler = (data: Partial<IClient>) => {
    setClient((client) => ({ ...client, ...data }));
  };

  const validtedFields = () => {
    setErrors([]);
    const newErrors: Error[] = [];

    Object.keys(client).forEach((key) => {
      const clientKey = key as keyof IClient;
      if (!client[clientKey]) {
        const newError: Error = {
          field: clientKey,
          item_id: clientKey,
          error: `This field is required !`,
        };
        newErrors.push(newError);
      }
    });
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
      if (!db) {
        toast.error('Mongo database was not loaded successfully !!!');
        return navigate('/');
      }
      createNewOrder(db, {
        ...client,
        reception_date: receptionDate,
        cloths: newItems.map((_) => _.value),
      })
        .then(() => navigate('/-/orders'))
        .catch(toast.error);
    }
  };

  return {
    errors,
    client,
    newItems,
    receptionDate,
    dispatchers: {
      addClothHandler,
      setReceptionDate,
      removeClothHandler,
      updateClothHandler,
      updateClientHandler,
      sumbitNewOrderHandler,
    },
  };
}
export default function NewOrder(props: INewOrderProps) {
  const {
    errors,
    client,
    newItems,
    receptionDate,
    dispatchers: {
      addClothHandler,
      setReceptionDate,
      updateClothHandler,
      updateClientHandler,
      sumbitNewOrderHandler,
    },
  } = useNewOrder();
  const fullnameeError = errors.find(
    (_) => _.field === 'client_fullname'
  )?.error;
  const clientPhoneNumberError = errors.find(
    (_) => _.field === 'client_phone_number'
  )?.error;

  return (
    <Box
      sx={{
        width: '300px',
        minWidth: '50vw',
      }}
    >
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
        <TextField
          id={`client_fullname`}
          name={`client_fullname`}
          label="Client fullname"
          size="small"
          fullWidth
          variant="standard"
          value={client?.client_fullname}
          helperText={fullnameeError}
          error={Boolean(fullnameeError)}
          onChange={(e) =>
            updateClientHandler({ client_fullname: e.target.value })
          }
        />
        <TextField
          id={`client_phone_number`}
          name={`client_phone_number`}
          label="Client phone number"
          size="small"
          fullWidth
          variant="standard"
          value={client?.client_phone_number}
          helperText={clientPhoneNumberError}
          error={Boolean(clientPhoneNumberError)}
          onChange={(e) =>
            updateClientHandler({ client_phone_number: e.target.value })
          }
        />
        <TextField
          id={`reception_date`}
          name={`reception_date`}
          label="Reception date"
          size="small"
          fullWidth
          variant="standard"
          type="datetime-local"
          value={new Date(receptionDate)}
          helperText={clientPhoneNumberError}
          error={Boolean(clientPhoneNumberError)}
          onChange={(e) => setReceptionDate(new Date(e.target.value).getTime())}
        />
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
