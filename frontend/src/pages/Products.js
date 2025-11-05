import React, { useEffect, useState } from 'react';
import { getProducts, createProduct } from '../services/api';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/slices/authSlice';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: '', sku: '', barcode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const user = useSelector(selectCurrentUser);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) fetchProducts();
    return () => { mounted = false; };
  }, []);

  const openForm = () => {
    setForm({ name: '', description: '', price: '', stock: '', category: '', sku: '', barcode: '' });
    setError(null);
    setOpen(true);
  };

  const closeForm = () => {
    setOpen(false);
  };

  const handleChange = (key) => (e) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleCreate = async () => {
    setError(null);
    if (!form.name) return setError('Name is required');
    const price = parseFloat(form.price || 0);
    const stock = parseInt(form.stock || 0, 10);
    if (isNaN(price) || price < 0) return setError('Price must be a non-negative number');
    if (isNaN(stock) || stock < 0) return setError('Stock must be a non-negative integer');
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price,
        stock,
        category: form.category,
        sku: form.sku,
        barcode: form.barcode
      };
      const res = await createProduct(payload);
      const created = res.data;
      setProducts(prev => [created, ...prev]);
      setSuccess('Product created');
      closeForm();
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Create failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4">Products</Typography>
      {user?.role === 'admin' && (
        <Button variant="contained" sx={{ mt: 2 }} onClick={openForm}>New Product</Button>
      )}
      <List>
        {products.map(p => (
          <ListItem key={p.id || p._id}>{p.name} - {p.price}</ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={closeForm} maxWidth="sm" fullWidth>
        <DialogTitle>New Product</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" margin="normal" value={form.name} onChange={handleChange('name')} />
          <TextField fullWidth label="Description" margin="normal" value={form.description} onChange={handleChange('description')} />
          <TextField fullWidth label="Price" margin="normal" value={form.price} onChange={handleChange('price')} type="number" inputProps={{ step: '0.01' }} />
          <TextField fullWidth label="Stock" margin="normal" value={form.stock} onChange={handleChange('stock')} type="number" inputProps={{ step: '1' }} />
          <TextField fullWidth label="Category" margin="normal" value={form.category} onChange={handleChange('category')} />
          <TextField fullWidth label="SKU" margin="normal" value={form.sku} onChange={handleChange('sku')} />
          <TextField fullWidth label="Barcode" margin="normal" value={form.barcode} onChange={handleChange('barcode')} />
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeForm}>Cancel</Button>
          <Button onClick={handleCreate} disabled={loading} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess(null)}>
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ width: '100%' }}>{success}</Alert>
      </Snackbar>
    </Box>
  );
}