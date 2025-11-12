import React, { useEffect, useState } from 'react';
import { getProducts, createOrder } from '../services/api';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity, clearCart } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

export default function Store() {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    getProducts().then(res => {
      if (mounted) setProducts(res.data || []);
    }).catch(() => {});
    return () => { mounted = false };
  }, []);

  const handleAdd = (product, qty) => {
    dispatch(addToCart({ product, quantity: qty }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart({ productId }));
  };

  const handleQtyChange = (productId, qty) => {
    const q = parseInt(qty || 0, 10);
    if (isNaN(q) || q < 0) return;
    dispatch(updateQuantity({ productId, quantity: q }));
  };

  const handleBuy = async () => {
    if (!cart.items.length) return;
    const items = cart.items.map(i => ({ product: i.product.id || i.product._id, quantity: i.quantity, price: i.product.price }));
    const subtotal = cart.total;
    const orderPayload = {
      customerId: user?.id || user?._id,
      items,
      subtotal,
      tax: 0,
      total: subtotal,
      paymentMethod: 'card'
    };
    try {
      await createOrder(orderPayload);
      dispatch(clearCart());
      navigate('/orders');
    } catch (e) {
      console.error(e);
      alert('Purchase failed');
    }
  };

  return (
    <Box>
      <Typography variant="h4">Store</Typography>
      <Typography sx={{ mt: 1 }}>Bienvenido a la tienda. Agrega productos al carrito desde aquí.</Typography>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {products.map(p => (
              <Grid item xs={12} sm={6} md={6} key={p.id || p._id}>
                  <Card sx={{ transition: 'transform 0.15s ease, box-shadow 0.15s ease', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 8px 20px rgba(0,0,0,0.12)' } }}>
                    {p.images && p.images.length ? (
                      <CardMedia component="img" height="160" image={p.images[0]} alt={p.name} />
                    ) : (
                      <Box sx={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
                        <Typography color="text.secondary">No image</Typography>
                      </Box>
                    )}
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">{p.name}</Typography>
                        <Chip label={`$${p.price}`} color="primary" />
                      </Stack>
                      <Typography color="text.secondary" sx={{ mt: 1 }}>{p.description}</Typography>
                      <TextField label="Quantity" type="number" size="small" sx={{ mt: 1 }} defaultValue={1} inputProps={{ min: 1 }} id={`qty-${p.id}`} />
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => {
                        const el = document.getElementById(`qty-${p.id}`);
                        const qty = el ? parseInt(el.value || '1', 10) : 1;
                        handleAdd(p, qty);
                      }}>Add to cart</Button>
                    </CardActions>
                  </Card>
                </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h6">Cart</Typography>
          <Divider sx={{ mb: 1 }} />
          <List>
            {cart.items.map(i => (
              <ListItem key={i.product.id || i.product._id} secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemove(i.product.id || i.product._id)}>
                  <DeleteIcon />
                </IconButton>
              }>
                <ListItemText primary={`${i.product.name} x ${i.quantity}`} secondary={`$${i.product.price} each`} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ mt: 2 }}>
            <Typography>Subtotal: ${cart.total.toFixed(2)}</Typography>
            <Button variant="contained" sx={{ mt: 1 }} onClick={handleBuy} disabled={!cart.items.length}>Buy</Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
