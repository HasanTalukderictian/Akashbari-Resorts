import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/Backend/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      email: email,
      password: password
    });

    console.log('API Response:', response.data); // এই লাইন যোগ করুন

    if (response.data.status === 'success') {
      const token = response.data.token;
      const role = response.data.role || 'admin';
      
      localStorage.setItem('token', token);
      localStorage.setItem('Role', role);
      
      console.log('Saved Token:', localStorage.getItem('token'));
      console.log('Saved Role:', localStorage.getItem('Role'));
      
      navigate('/dashboard');
    } else {
      setError(response.data.message || 'Login failed');
    }
  } catch (err) {
    console.error('Login Error:', err);
    setError(err.response?.data?.message || 'Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-container">
      <div className="login-glass-card">
        <h2 className="login-title">Admin Login</h2>
        
        {error && <p style={{ color: 'red', textAlign: 'center', fontSize: '14px' }}>{error}</p>}
        
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="admin@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter password" 
              className='border'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember Me
            </label>
          </div>

          <button 
            type="submit" 
            className="login-btn" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;