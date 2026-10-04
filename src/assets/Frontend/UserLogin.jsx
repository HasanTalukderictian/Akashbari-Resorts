import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Header from './Common/Header';
import Footer from './Common/Footer';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const UserLogin = () => {
  const brandColor = '#5e2e10';
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (localStorage.getItem('visitor_token')) navigate('/', { replace: true });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const newErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Enter a valid email address';
    if (!form.password) newErrors.password = 'Enter your password';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/visitor/login`, form);
      localStorage.setItem('visitor_token', res.data.token);
      localStorage.setItem('visitor_data', JSON.stringify(res.data.user));
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err.response?.status === 422 || err.response?.status === 401) {
        setServerError(err.response.data.message || 'Email or password is incorrect');
      } else {
        setServerError('Unable to connect to server. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <section className="py-5" style={{ minHeight: '70vh', backgroundColor: '#faf7f4' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-5">
              <div className="bg-white shadow-sm rounded-4 p-4 p-md-5">
                <h2 className="mb-1" style={{ color: brandColor, fontWeight: 700 }}>
                  Log in
                </h2>
                <p className="text-muted mb-4">Log in to write and manage your blog posts.</p>

                {serverError && (
                  <div className="alert alert-danger py-2" role="alert">
                    {serverError}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`form-control py-2 ${errors.email ? 'is-invalid' : ''}`}
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">
                      Password
                    </label>
                    <div className="input-group has-validation">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control py-2 ${errors.password ? 'is-invalid' : ''}`}
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword((s) => !s)}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                      {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn w-100 py-2 rounded-pill fw-semibold"
                    style={{ backgroundColor: brandColor, color: 'white', border: 'none' }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                        Logging in...
                      </>
                    ) : (
                      'Log in'
                    )}
                  </button>
                </form>

                <p className="text-center text-muted mt-4 mb-0">
                  New here?{' '}
                  <Link
                    to="/register"
                    state={{ from: redirectTo }}
                    style={{ color: brandColor, fontWeight: 600 }}
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default UserLogin;