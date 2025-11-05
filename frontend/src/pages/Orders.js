import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useSelector } from 'react-redux';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    let mounted = true;
    api.get('/orders').then(res => {
      if (mounted) {
        const data = res.data || [];
        if (user?.role === 'admin') {
          setOrders(data);
        } else {
          const myId = user?.id || user?._id;
          const mine = data.filter(o => o.customerId === myId);
          setOrders(mine);
        }
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, [user]);

  return (
    <Box>
      <Typography variant="h4">{user?.role === 'admin' ? 'Orders' : 'Historial'}</Typography>
      <List>
        {orders.map(o => (
          <ListItem key={o.id}>
            <ListItemText primary={`${o.invoiceNumber || o.id} - $${o.total}`} secondary={`Status: ${o.status} | Items: ${o.items?.length || 0}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}