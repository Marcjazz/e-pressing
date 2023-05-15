import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Scrollbars from 'rc-scrollbars';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { Outlet, useNavigate } from 'react-router';
import { theme } from '../theme';

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const pages = [
    { route: 'dashboard', name: formatMessage({ id: 'dashboard' }) },
    { route: 'record', name: formatMessage({ id: 'recordOrder' }) },
    { route: 'serve', name: formatMessage({ id: 'serveOrder' }) },
  ];
  const settings = [
    { route: 'accounts', name: formatMessage({ id: 'manageAccounts' }) },
    { route: 'logout', name: formatMessage({ id: 'logout' }) },
  ];

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
      }}
    >
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              LOGO
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map(({ name, route }, i) => (
                  <MenuItem
                    key={i}
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate(route);
                    }}
                  >
                    <Typography textAlign="center">{name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              LOGO
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map(({ name, route }, i) => (
                <Button
                  key={i}
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(route);
                  }}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {name}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map(({ name, route }, i) => (
                  <MenuItem
                    key={i}
                    onClick={() => {
                      handleCloseUserMenu();
                      navigate(route);
                    }}
                  >
                    <Typography textAlign="center">{name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box
        sx={{
          height: '100%',
          display: 'grid',
          justifyContent: 'center',
          padding: theme.spacing(5),
          gridTemplateRows: 'auto 1fr',
          rowGap: theme.spacing(4.375),
        }}
      >
        <Scrollbars autoHide autoHeight>
          <Outlet />
        </Scrollbars>
      </Box>
    </Box>
  );
}
export default ResponsiveAppBar;
