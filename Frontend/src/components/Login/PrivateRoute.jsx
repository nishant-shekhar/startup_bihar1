import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" />;

  // Optional: Restrict role-specific routes
  if (role === 'admin' && !localStorage.getItem('admin_id')) {
    return <Navigate to="/login" />;
  }

  if (role === 'user' && !localStorage.getItem('user_id')) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
