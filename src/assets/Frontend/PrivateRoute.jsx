import React from 'react';
import { Navigate } from 'react-router-dom';

// "Super Admin" / "super-admin" / "Admin" → super_admin / admin
const normalizeRole = (role) =>
  String(role || '').toLowerCase().trim().replace(/[\s-]+/g, '_');

// এই role গুলো admin panel এ ঢুকতে পারবে
const PANEL_ROLES = ['super_admin', 'admin'];

const PrivateRoute = ({ children }) => {
  // চেক করা ইউজার লগইন করেছে কিনা
  const token = localStorage.getItem('token');
  const role = normalizeRole(localStorage.getItem('Role'));

  // token না থাকলে অথবা role super_admin / admin না হলে login পেজে
  if (!token || !PANEL_ROLES.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  // লগইন থাকলে children কম্পোনেন্ট রেন্ডার করবে
  return children;
};

export default PrivateRoute;