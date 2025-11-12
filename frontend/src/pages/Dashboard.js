import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import api from '../services/api';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  return (
    <Box>
      <Typography variant="h4">Dashboard</Typography>
      <Typography sx={{ mt: 1 }} color="text.secondary">Resumen rápido de ventas</Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Orders</Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>{orders.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Total Revenue</Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>${totalRevenue.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Recent Orders</Typography>
              <List>
                {orders.slice(0,5).map(o => (
                  <ListItem key={o.id} disableGutters>
                    <ListItemText primary={`${o.invoiceNumber || o.id} - $${o.total}`} secondary={`Status: ${o.status}`} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}