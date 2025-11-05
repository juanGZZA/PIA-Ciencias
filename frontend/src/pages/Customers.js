import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    let mounted = true;
    api.get('/users').then(res => {
      if (mounted) {
        const onlyCustomers = (res.data || []).filter(u => u.role === 'customer');
        setCustomers(onlyCustomers);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  return (
    <Box>
      <Typography variant="h4">Customers</Typography>
      <List>
        {customers.map(c => (
          <ListItem key={c._id}>{c.name} - {c.email}</ListItem>
        ))}
      </List>
    </Box>
  );
}