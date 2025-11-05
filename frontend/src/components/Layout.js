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
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            POS System
          </Typography>
          {/* Role-aware navigation */}
          {role === 'admin' && <Button color="inherit" component={Link} to="/">Dashboard</Button>}
          {(role === 'employee') && <Button color="inherit" component={Link} to="/pos">POS</Button>}
          {/* Customers / store users see the public store and a 'Historial' link */}
          {(role === 'customer' || role === 'store') ? (
            <>
              <Button color="inherit" component={Link} to="/store">Tienda</Button>
              <Button color="inherit" component={Link} to="/orders">Historial</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/products">Products</Button>
              <Button color="inherit" component={Link} to="/orders">Orders</Button>
            </>
          )}
          {role === 'admin' && <Button color="inherit" component={Link} to="/customers">Customers</Button>}
          {role === 'admin' && <Button color="inherit" component={Link} to="/reports">Reports</Button>}
          <Button color="inherit" component={Link} to="/profile">Profile</Button>
          {user && (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 3 }}>
        <Outlet />
      </Container>
    </div>
  );
}