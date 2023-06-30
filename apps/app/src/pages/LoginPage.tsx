import { Box, Button, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRealmApp } from '../providers/realm';
import { Adb } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

export default function LogInPage() {
  const { logIn, user } = useRealmApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/-/orders');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function handleLogIn() {
    logIn(email, password)
      .then((user) => {
        if (user) toast.success(`Welcome back ${user?.profile.firstName} !!!`);
        else toast.error('Incorrect user email or password.');
      })
      .catch(toast.error);
  }

  return (
    <Box
      display="grid"
      height="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        sx={{
          boxShadow: {
            sx: 'none',
            sm: '1px 1px 1px 1px gray',
          },
        }}
        textAlign="center"
        display="grid"
        minWidth="350px"
        padding={5}
        gap={2}
      >
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          color="primary"
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            textDecoration: 'none',
            marginBottom: 1,
          }}
        >
          <Adb
            color="primary"
            sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
          />
          LOGO
        </Typography>
        <Typography variant="h2">LOG IN</Typography>
        <TextField
          label="Username"
          required
          fullWidth
          type="email"
          placeholder="username@example.com"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          variant="standard"
        />
        <TextField
          label="Password"
          required
          fullWidth
          variant="standard"
          placeholder="**********"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <Button color="primary" variant="contained" onClick={handleLogIn}>
          Log in
        </Button>
      </Box>
    </Box>
  );
}
