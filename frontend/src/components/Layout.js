import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logout } from '../redux/slices/authSlice';
import { persistor } from '../redux/store';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const role = user?.role;

  const handleLogout = async () => {
    // remove legacy tokens
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // purge persisted redux state so user is fully logged out
      if (persistor && typeof persistor.purge === 'function') {
        await persistor.purge();
      } else {
        localStorage.removeItem('persist:root');
      }
    } catch (e) {
      // ignore
    }
    dispatch(logout());
    navigate('/login');
  };
  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Mi Tienda
          </Typography>
          {/* Role-aware navigation */}
          {role === 'admin' && <Button color="inherit" component={Link} to="/" sx={{ mx: 0.5 }}>Dashboard</Button>}
          {(role === 'employee') && <Button color="inherit" component={Link} to="/pos" sx={{ mx: 0.5 }}>POS</Button>}
          {/* Customers / store users see the public store and a 'Historial' link */}
          {(role === 'customer' || role === 'store') ? (
            <>
              <Button color="inherit" component={Link} to="/store" sx={{ mx: 0.5 }}>Tienda</Button>
              <Button color="inherit" component={Link} to="/orders" sx={{ mx: 0.5 }}>Historial</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/products" sx={{ mx: 0.5 }}>Products</Button>
              <Button color="inherit" component={Link} to="/orders" sx={{ mx: 0.5 }}>Orders</Button>
            </>
          )}
          {role === 'admin' && <Button color="inherit" component={Link} to="/customers" sx={{ mx: 0.5 }}>Customers</Button>}

          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            {user && (
              <>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 34, height: 34, mr: 1 }}>{(user.name || user.email || 'U').charAt(0).toUpperCase()}</Avatar>
                <Box sx={{ mr: 2, textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ lineHeight: 1 }}>{user?.name || user?.email}</Typography>
                  <Chip label={user?.role || 'guest'} size="small" sx={{ mt: 0.5 }} />
                </Box>
              </>
            )}
            <Button color="inherit" component={Link} to="/profile" sx={{ mx: 0.5 }}>Profile</Button>
            {user && (
              <Button color="inherit" onClick={handleLogout} sx={{ mx: 0.5, borderLeft: '1px solid rgba(255,255,255,0.12)', pl: 2 }}>Logout</Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 3 }}>
        <Outlet />
      </Container>
    </div>
  );
}