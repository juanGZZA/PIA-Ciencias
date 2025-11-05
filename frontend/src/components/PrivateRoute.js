import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/slices/authSlice';

export default function PrivateRoute({ children, roles }) {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (roles && roles.length > 0) {
    const role = user?.role;
    if (!role || !roles.includes(role)) {
      if (role === 'customer') return <Navigate to="/store" replace />;
      return <Navigate to="/" replace />;
    }
  }
  return children;
}