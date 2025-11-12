import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PointOfSale from './pages/PointOfSale';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
// Reports page removed per request
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Store from './pages/Store';

function App() {
  return (
    <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
      
      <Route path="/" element={<Layout />}>
        <Route path="store" element={
          <PrivateRoute>
            <Store />
          </PrivateRoute>
        } />
        <Route index element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="pos" element={
          <PrivateRoute>
            <PointOfSale />
          </PrivateRoute>
        } />
        
        <Route path="products" element={
          <PrivateRoute>
            <Products />
          </PrivateRoute>
        } />
        
        <Route path="orders" element={
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        } />
        
        <Route path="customers" element={
          <PrivateRoute roles={["admin"]}>
            <Customers />
          </PrivateRoute>
        } />
        
        {/* Reports route removed */}
        
        <Route path="profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;