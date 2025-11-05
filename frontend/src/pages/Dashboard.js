import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import api from '../services/api';
import { useSelector } from 'react-redux';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    let mounted = true;
    api.get('/orders').then(res => {
      if (mounted) {
        const data = res.data || [];
        if (user?.role === 'admin') setOrders(data);
        else setOrders(data.filter(o => o.customerId === user?.id));
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, [user]);

  return (
    <Box>
      <Typography variant="h4">Dashboard</Typography>
      <Typography sx={{ mt: 2 }}>Resumen de ventas</Typography>
      <Typography sx={{ mt: 1 }}>Orders count: {orders.length}</Typography>
      <List sx={{ mt: 2 }}>
        {orders.slice(0,5).map(o => (
          <ListItem key={o.id}>
            <ListItemText primary={`${o.invoiceNumber || o.id} - $${o.total}`} secondary={`Status: ${o.status}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}