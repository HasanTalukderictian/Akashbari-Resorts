import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/Backend/Login.css';

const Login = () => {
  // ১. স্টেট ডিক্লেয়ারেশন
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ২. লগইন ফাংশন
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email: email,
        password: password
      });

      if (response.data.status === 'success') {
        // টোকেন সেভ করা
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('Role', response.role);
        // ড্যাশবোর্ডে পাঠানো
        navigate('/dashboard');
      }
    } catch (err) {
      // ভুল ইমেইল/পাসওয়ার্ডের এরর মেসেজ দেখানো
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-glass-card">
        <h2 className="login-title">Login</h2>
        
        {/* এরর মেসেজ দেখানোর জন্য */}
        {error && <p style={{ color: 'red', textAlign: 'center', fontSize: '14px' }}>{error}</p>}
        
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="" 
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