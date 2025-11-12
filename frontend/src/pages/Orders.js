import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
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
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {orders.map(o => (
          <Grid item xs={12} md={6} key={o.id}>
            <Card>
              <CardContent>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Typography variant="subtitle1">{o.invoiceNumber || o.id}</Typography>
                    <Typography variant="body2" color="text.secondary">Items: {o.items?.length || 0}</Typography>
                  </Grid>
                  <Grid item>
                    <Chip label={o.status} color={o.status === 'pending' ? 'warning' : 'success'} />
                  </Grid>
                </Grid>
                <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                  <Grid item>
                    <Typography variant="h6">${o.total}</Typography>
                  </Grid>
                  <Grid item>
                    <Button size="small">View</Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}