import React from 'react';
import '../assets/css/Backend/Login.css';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-glass-card">
        <h2 className="login-title">Login</h2>
        
        <form className="login-form">
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="" required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="" required />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember Me
            </label>
          
          </div>

          <button type="submit" className="login-btn">Log in</button>
        </form>

        
      </div>
    </div>
  );
};

export default Login;