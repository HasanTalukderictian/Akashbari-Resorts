import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Header from './Common/Header';
import Footer from './Common/Footer';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const Register = () => {
  const brandColor = '#5e2e10';
  const navigate = useNavigate();
  const location = useLocation();

  // Register howar pore kothay jabe (jemon /write-blog)
  const redirectTo = location.state?.from || '/';

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    // Already login thakle register page e thakar dorkar nai
    if (localStorage.getItem('visitor_token')) navigate('/', { replace: true });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // Client side validation
  const validate = () => {
    const newErrors = {};
    if (form.name.trim().length < 3) newErrors.name = 'Name must be at least 3 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Enter a valid email address';
    if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (form.password !== form.password_confirmation)
      newErrors.password_confirmation = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/visitor/register`, form);

      // Laravel response: { status: true, token: '...', user: {...} }
      if (res.data.token) {
        localStorage.setItem('visitor_token', res.data.token);
        localStorage.setItem('visitor_data', JSON.stringify(res.data.user));
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err.response?.status === 422) {
        // Laravel validation errors: { errors: { email: ['...'] } }
        const apiErrors = err.response.data.errors || {};
        const mapped = {};
        Object.keys(apiErrors).forEach((key) => (mapped[key] = apiErrors[key][0]));
        setErrors(mapped);
      } else {
        setServerError(
          err.response?.data?.message || 'Unable to connect to server. Please try again later.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) => `form-control py-2 ${errors[field] ? 'is-invalid' : ''}`;

  return (
    <>
      <Header />

      <section className="py-5" style={{ minHeight: '70vh', backgroundColor: '#faf7f4' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-5">
              <div className="bg-white shadow-sm rounded-4 p-4 p-md-5">
                <h2 className="mb-1" style={{ color: brandColor, fontWeight: 700 }}>
                  Create your account
                </h2>
                <p className="text-muted mb-4">
                  Register to write and share your own blog posts.
                </p>

                {serverError && (
                  <div className="alert alert-danger py-2" role="alert">
                    {serverError}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold">
                      Full name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className={inputClass('name')}
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={inputClass('email')}
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold">
                      Password
                    </label>
                    <div className="input-group has-validation">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        className={inputClass('password')}
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                      {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password_confirmation" className="form-label fw-semibold">
                      Confirm password
                    </label>
                    <input
                      id="password_confirmation"
                      name="password_confirmation"
                      type={showPassword ? 'text' : 'password'}
                      className={inputClass('password_confirmation')}
                      value={form.password_confirmation}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    {errors.password_confirmation && (
                      <div className="invalid-feedback">{errors.password_confirmation}</div>
                    )}
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
                        Creating account...
                      </>
                    ) : (
                      'Create account'
                    )}
                  </button>
                </form>

                <p className="text-center text-muted mt-4 mb-0">
                  Already have an account?{' '}
                  <Link
                    to="/visitor-login"
                    state={{ from: redirectTo }}
                    style={{ color: brandColor, fontWeight: 600 }}
                  >
                    Log in
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

export default Register;