import { Error, IClient, ICreateCloth, Item } from '@e-pressing/interfaces';
import { Add } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Fab,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import OrderForm from '../components/OrderForm';
import { useMongoDB } from '../providers/mongoDB';
import { createNewOrder } from '../services/orders.service';

interface IOrderFormPageProps {
  children?: JSX.Element;
}

function useNewOrder() {
  const { db } = useMongoDB();
  const navigate = useNavigate();
  const [client, setClient] = useState<IClient>({
    client_fullname: '',
    client_phone_number: '',
  });
  const [receptionDate, setReceptionDate] = useState<string>('');
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
        ...newItems,
        {
          item_id: `item-${newItems.length + 1}`,
          value: {
            cloth_name: '',
            quantity: 1,
            washing_price: 100,
          },
        },
      ]);
  };

  const removeClothHandler = (fake_id: string) => {
    if (newItems.length > 1)
      setNewItems((newItems) => newItems.filter((_) => _.item_id !== fake_id));
    else toast.error('Order must have at least one cloth item');
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
    validtedFields('item');
  };

  const updateClientHandler = (data: Partial<IClient>) => {
    setClient((client) => ({ ...client, ...data }));
    const clientErrors = validateClientFieds(data);
    const newErrors: Error[] = [];
    clientErrors.forEach((err) =>
      errors.find((_) => _.item_id === err.item_id) ? null : newErrors.push(err)
    );
    setErrors([
      ...errors.filter((_) =>
        Object.keys(data).find((key) => key !== _.item_id)
      ),
      ...newErrors,
    ]);
  };

  const receptionDateHandler = (date: string) => {
    setReceptionDate(date);
    setErrors(errors.filter((_) => _.item_id === 'reception_date'));
  };

  const validateClientFieds = (client: Partial<IClient>) => {
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
    return newErrors;
  };

  const validtedFields = (scope: 'all' | 'item' = 'all') => {
    setErrors([]);
    const newErrors: Error[] = [];

    if (scope === 'all') {
      newErrors.push(...validateClientFieds(client));
      if (!receptionDate)
        newErrors.push({
          field: 'reception_date',
          item_id: 'reception_date',
          error: 'This field is required !',
        });
    }
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sumbitNewOrderHandler = () => {
    const errors = validtedFields();
    if (errors.length === 0) {
      if (!db) {
        toast.error('No active session was found, please sign in !!!');
        return navigate('/');
      }
      setIsSubmitting(true);
      createNewOrder(db, {
        ...client,
        reception_date: receptionDate,
        cloths: newItems.map((_) => _.value),
      })
        .then((orderNumber) => {
          toast.success('Order submitted successfully !!!');
          navigate(`/orders/${orderNumber.toLowerCase()}`);
        })
        .catch((error) => toast.error(error.toString()))
        .finally(() => setIsSubmitting(false));
    }
  };

  return {
    errors,
    client,
    newItems,
    isSubmitting,
    receptionDate,
    dispatchers: {
      addClothHandler,
      removeClothHandler,
      updateClothHandler,
      updateClientHandler,
      receptionDateHandler,
      sumbitNewOrderHandler,
    },
  };
}
export default function OrderFormPage(props: IOrderFormPageProps) {
  const {
    errors,
    newItems,
    isSubmitting,
    receptionDate,
    client: { client_fullname, client_phone_number },
    dispatchers: {
      addClothHandler,
      removeClothHandler,
      updateClothHandler,
      updateClientHandler,
      receptionDateHandler,
      sumbitNewOrderHandler,
    },
  } = useNewOrder();
  const fullnameeError = errors.find(
    (_) => _.field === 'client_fullname'
  )?.error;
  const clientPhoneNumberError = errors.find(
    (_) => _.field === 'client_phone_number'
  )?.error;
  const receptionDateError = errors.find(
    (_) => _.field === 'reception_date'
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
          <Button
            size="medium"
            variant="contained"
            disabled={isSubmitting}
            onClick={sumbitNewOrderHandler}
          >
            {isSubmitting && <CircularProgress size="small" />}
            submit
          </Button>
        </Box>
        <TextField
          id={`client_fullname`}
          name={`client_fullname`}
          label="Client fullname"
          size="small"
          fullWidth
          variant="standard"
          value={client_fullname}
          helperText={fullnameeError}
          error={Boolean(fullnameeError)}
          disabled={isSubmitting}
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
          value={client_phone_number}
          helperText={clientPhoneNumberError}
          error={Boolean(clientPhoneNumberError)}
          disabled={isSubmitting}
          onChange={(e) =>
            updateClientHandler({
              client_phone_number: e.target.value.slice(0, 9),
            })
          }
        />
        <TextField
          id={`reception_date`}
          name={`reception_date`}
          label="Reception date"
          size="small"
          fullWidth
          variant="standard"
          type="date"
          value={
            receptionDate
              ? receptionDate
              : new Date(Date.now() + 3 * 24 * 3600 * 1000).toLocaleDateString()
          }
          helperText={receptionDateError}
          error={Boolean(receptionDateError)}
          disabled={isSubmitting}
          onChange={(e) => {
            const date = e.target.value;
            if (new Date(date) > new Date()) receptionDateHandler(date);
          }}
        />
        {newItems.map(({ item_id: fake_id, value }) => (
          <OrderForm
            {...value}
            key={fake_id}
            errors={errors}
            textFieldId={fake_id}
            disabled={isSubmitting}
            onChangeHandler={updateClothHandler}
            removeClothHandler={removeClothHandler}
          />
        ))}
        <Fab
          color="secondary"
          size="medium"
          sx={{ justifySelf: 'end', position: 'fixed', bottom: 45 }}
          onClick={addClothHandler}
        >
          <Tooltip title="add new item">
            <Add />
          </Tooltip>
        </Fab>
      </Box>
    </Box>
  );
}
