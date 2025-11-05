import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function PointOfSale() {
  return (
    <Box>
      <Typography variant="h4">Point of Sale</Typography>
      <Typography sx={{ mt: 2 }}>Interfaz de venta rápida (modo empleado)</Typography>
    </Box>
  );
}