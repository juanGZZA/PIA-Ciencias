import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/slices/authSlice';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: '', sku: '', barcode: '' });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
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
    setEditingProduct(null);
    setForm({ name: '', description: '', price: '', stock: '', category: '', sku: '', barcode: '' });
    setError(null);
    setImageFiles([]);
    setImagePreviews([]);
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
      // include base64 images if any
      if (imagePreviews.length) {
        payload.images = imagePreviews; // already base64 strings
      }
      if (editingProduct) {
        const res = await updateProduct(editingProduct.id || editingProduct._id, payload);
        const updated = res.data;
        setProducts(prev => prev.map(p => (p.id === updated.id || p._id === updated.id ? updated : p)));
        setSuccess('Product updated');
      } else {
        const res = await createProduct(payload);
        const created = res.data;
        setProducts(prev => [created, ...prev]);
        setSuccess('Product created');
      }
      closeForm();
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Create failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      category: product.category || '',
      sku: product.sku || '',
      barcode: product.barcode || ''
    });
    setImagePreviews(product.images ? [...product.images] : []);
    setImageFiles([]);
    setError(null);
    setOpen(true);
  };

  const handleDelete = async (product) => {
    const ok = window.confirm(`Eliminar producto "${product.name}"?`);
    if (!ok) return;
    try {
      await deleteProduct(product.id || product._id);
      setProducts(prev => prev.filter(p => p.id !== product.id && p._id !== product.id));
      setSuccess('Product deleted');
    } catch (e) {
      setError('Delete failed');
    }
  };

  const handleFiles = (files) => {
    const arr = Array.from(files || []);
    setImageFiles(arr);
    const readers = arr.map(file => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    }));
    Promise.all(readers).then(results => setImagePreviews(results));
  };

  const removePreview = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Products</Typography>
        {user?.role === 'admin' && (
          <Button variant="contained" sx={{ mt: 2 }} onClick={openForm}>New Product</Button>
        )}
      </Stack>

  <Box sx={{ mt: 3, mb: 2, p: 3, borderRadius: 2, background: 'linear-gradient(135deg,#f5f7fa 0%,#e9efff 100%)' }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Gestiona tus productos</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>Agrega imágenes y detalles para que tu tienda luzca profesional.</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {products.map(p => (
          <Grid item xs={12} sm={6} md={4} key={p.id || p._id}>
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
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{p.description}</Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>Stock: {p.stock}</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <IconButton size="small" color="primary" onClick={() => handleEditOpen(p)} aria-label="edit">
                  <EditIcon />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDelete(p)} aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={closeForm} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProduct ? 'Edit Product' : 'New Product'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" margin="normal" value={form.name} onChange={handleChange('name')} />
          <TextField fullWidth label="Description" margin="normal" value={form.description} onChange={handleChange('description')} />
          <TextField fullWidth label="Price" margin="normal" value={form.price} onChange={handleChange('price')} type="number" inputProps={{ step: '0.01' }} />
          <TextField fullWidth label="Stock" margin="normal" value={form.stock} onChange={handleChange('stock')} type="number" inputProps={{ step: '1' }} />
          <TextField fullWidth label="Category" margin="normal" value={form.category} onChange={handleChange('category')} />
          <TextField fullWidth label="SKU" margin="normal" value={form.sku} onChange={handleChange('sku')} />
          <TextField fullWidth label="Barcode" margin="normal" value={form.barcode} onChange={handleChange('barcode')} />
          <Box sx={{ mt: 2 }}>
            <input
              id="product-images"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              style={{ display: 'block', marginTop: 8 }}
            />
            {imagePreviews.length > 0 && (
              <ImageList cols={4} rowHeight={80} sx={{ mt: 1 }}>
                {imagePreviews.map((src, idx) => (
                  <ImageListItem key={idx}>
                    <img src={src} alt={`preview-${idx}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <IconButton size="small" onClick={() => removePreview(idx)} sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(0,0,0,0.4)', color: '#fff' }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Box>
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeForm}>Cancel</Button>
          <Button onClick={handleCreate} disabled={loading} variant="contained">{editingProduct ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess(null)}>
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ width: '100%' }}>{success}</Alert>
      </Snackbar>
    </Box>
  );
}