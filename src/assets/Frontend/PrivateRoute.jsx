import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // চেক করা ইউজার লগইন করেছে কিনা
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('Role');
  
  // যদি token না থাকে অথবা role admin না হয়, তাহলে login পেজে রিডাইরেক্ট করবে
  if (!token || role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  
  // লগইন থাকলে children কম্পোনেন্ট রেন্ডার করবে
  return children;
};

export default PrivateRoute;