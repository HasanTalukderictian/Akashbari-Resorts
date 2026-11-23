import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Common/Header';
import Footer from './Common/Footer';
import { API_BASE_URL } from '../../Config/api';

import background_image from '../Background/background.jfif';

const brandColor = '#5e2e10';
const brandDark = '#3d1f0a';
const brandTint = '#f6eee9';

// API থেকে category না এলে এগুলো দেখাবে
const FALLBACK_CATEGORIES = [
  'Property Ownership',
  'Cottage / Suite Ownership',
  'Land Share',
  'Yearly Profit Plan',
  'Membership Investment',
];

const AMOUNT_RANGES = [
  'Below ৳5 Lakh',
  '৳5 Lakh – ৳10 Lakh',
  '৳10 Lakh – ৳25 Lakh',
  '৳25 Lakh – ৳50 Lakh',
  'Above ৳50 Lakh',
];

const CONTACT_TIMES = ['Morning (9am – 12pm)', 'Afternoon (12pm – 5pm)', 'Evening (5pm – 9pm)', 'Any time'];

const BENEFITS = [
  { icon: 'bi-house-heart', title: 'Become a Property Owner', text: 'Own a share of a premium eco-resort.' },
  { icon: 'bi-graph-up-arrow', title: 'Yearly Profit', text: 'Earn a return on your investment every year.' },
  { icon: 'bi-gem', title: 'Free Membership', text: 'Enjoy exclusive member benefits and stays.' },
  { icon: 'bi-people', title: 'Social Networking', text: 'Connect with a community of fellow investors.' },
];

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  address: '',
  profession: '',
  category: '',
  amount_range: '',
  preferred_time: '',
  message: '',
  agree: false,
};

// API এর package object থেকে নাম বের করা (field এর নাম যাই হোক)
const pickTitle = (item) =>
  (typeof item === 'string' ? item : item?.title || item?.name || item?.package_name || item?.heading || '').trim();

const validate = (f) => {
  const errors = {};
  if (!f.name.trim()) errors.name = 'Please enter your full name';
  if (!f.phone.trim()) errors.phone = 'Please enter your phone number';
  else if (!/^(\+?880|0)?1[3-9]\d{8}$/.test(f.phone.replace(/[\s-]/g, '')))
    errors.phone = 'Enter a valid Bangladeshi mobile number';
  if (f.email.trim() && !/^\S+@\S+\.\S+$/.test(f.email.trim())) errors.email = 'Enter a valid email address';
  if (!f.category) errors.category = 'Please select an investment category';
  if (!f.agree) errors.agree = 'Please accept to continue';
  return errors;
};

/* ---------- Field (component এর বাইরে — তাই টাইপ করার সময় cursor হারায় না) ---------- */
const Field = ({ name, label, required, error, children }) => (
  <div className="inv-field">
    <label htmlFor={`inv-${name}`}>
      {label} {required && <span className="inv-req">*</span>}
    </label>
    {children}
    {error && <small className="inv-error">{error}</small>}
  </div>
);

const InvestmentForm = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Investment package থেকে category
  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${API_BASE_URL}/get-investment`, { signal: controller.signal })
      .then((res) => {
        const raw = res.data?.data?.data || res.data?.data || res.data;
        const list = Array.isArray(raw) ? [...new Set(raw.map(pickTitle).filter(Boolean))] : [];
        if (list.length) setCategories(list);
      })
      .catch(() => { /* fallback তালিকাই থাকবে */ });
    return () => controller.abort();
  }, []);

  const setField = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      document.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const { agree, ...payload } = form;
      Object.keys(payload).forEach((k) => { payload[k] = payload[k].trim(); });

      const res = await axios.post(`${API_BASE_URL}/investment-applications`, payload);
      if (res.data?.status === true) {
        setSubmitted(true);
        setForm(EMPTY_FORM);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setServerError(res.data?.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 422 && err.response.data?.errors) {
        const apiErrors = {};
        Object.entries(err.response.data.errors).forEach(([k, v]) => { apiErrors[k] = Array.isArray(v) ? v[0] : v; });
        setErrors(apiErrors);
      } else if (status === 429) {
        setServerError('Too many attempts. Please wait a minute and try again.');
      } else {
        setServerError('Could not submit your application. Please try again or call us.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <main className="inv-page">
        {/* ---------- Banner (background image + কালো shadow) ---------- */}
        <section className="inv-hero">
          <div className="container inv-hero-content">
            <span className="inv-eyebrow">Invest With Akashbari Hotels & Resorts </span>
            <h1>Investment Application</h1>
            <span className="inv-hero-line" />
            <p>Fill in the form below and our investment team will contact you within 24 hours.</p>
          </div>
        </section>

        <section className="inv-body">
          <div className="container">
            <div className="inv-layout">
              {/* ---------- Left: Benefits ---------- */}
              <aside className="inv-aside">
                <h2>Why invest with us?</h2>
                <p className="inv-aside-sub">
                  Be part of a growing luxury eco-resort and enjoy long-term benefits.
                </p>

                <ul className="inv-benefits">
                  {BENEFITS.map((b) => (
                    <li key={b.title}>
                      <span className="inv-benefit-icon"><i className={`bi ${b.icon}`}></i></span>
                      <div>
                        <strong>{b.title}</strong>
                        <span>{b.text}</span>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="inv-contact">
                  <span>Need help? Call us</span>
                  <a href="tel:+8801701294455"><i className="bi bi-telephone"></i> +8801701294455</a>
                </div>
              </aside>

              {/* ---------- Right: Form ---------- */}
              <div className="inv-card">
                {submitted ? (
                  <div className="inv-success">
                    <div className="inv-success-icon"><i className="bi bi-check-lg"></i></div>
                    <h3>Thank you!</h3>
                    <p>
                      Your investment application has been received. Our team will contact you soon.
                    </p>
                    <button type="button" className="inv-btn" onClick={() => setSubmitted(false)}>
                      Submit another application
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="inv-card-head">
                      <h3>Your Details</h3>
                      <p>Fields marked with <span className="inv-req">*</span> are required.</p>
                    </div>

                    {serverError && (
                      <div className="inv-alert" role="alert">
                        <i className="bi bi-exclamation-circle"></i> {serverError}
                      </div>
                    )}

                    <div className="inv-grid">
                      <Field name="name" label="Full Name" required error={errors.name}>
                        <input id="inv-name" name="name" type="text" placeholder="Your full name"
                          value={form.name} onChange={setField('name')} className={errors.name ? 'has-error' : ''}
                          autoComplete="name" maxLength={255} />
                      </Field>

                      <Field name="phone" label="Phone Number" required error={errors.phone}>
                        <input id="inv-phone" name="phone" type="tel" placeholder="01XXXXXXXXX"
                          value={form.phone} onChange={setField('phone')} className={errors.phone ? 'has-error' : ''}
                          autoComplete="tel" maxLength={20} />
                      </Field>

                      <Field name="email" label="Email Address" error={errors.email}>
                        <input id="inv-email" name="email" type="email" placeholder="name@example.com"
                          value={form.email} onChange={setField('email')} className={errors.email ? 'has-error' : ''}
                          autoComplete="email" maxLength={255} />
                      </Field>

                      <Field name="profession" label="Profession" error={errors.profession}>
                        <input id="inv-profession" name="profession" type="text" placeholder="e.g. Business, Service"
                          value={form.profession} onChange={setField('profession')} maxLength={255} />
                      </Field>

                      <div className="inv-span-2">
                        <Field name="address" label="Address" error={errors.address}>
                          <input id="inv-address" name="address" type="text" placeholder="Your present address"
                            value={form.address} onChange={setField('address')} autoComplete="street-address" maxLength={500} />
                        </Field>
                      </div>

                      <div className="inv-span-2">
                        <Field name="category" label="Investment Category" required error={errors.category}>
                          <div className="inv-select">
                            <select id="inv-category" name="category" value={form.category}
                              onChange={setField('category')} className={errors.category ? 'has-error' : ''}>
                              <option value="">Select an investment category</option>
                              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                        </Field>
                      </div>

                      <Field name="amount_range" label="Investment Amount" error={errors.amount_range}>
                        <div className="inv-select">
                          <select id="inv-amount_range" name="amount_range" value={form.amount_range} onChange={setField('amount_range')}>
                            <option value="">Select amount range</option>
                            {AMOUNT_RANGES.map((a) => <option key={a} value={a}>{a}</option>)}
                          </select>
                        </div>
                      </Field>

                      <Field name="preferred_time" label="Best Time to Call" error={errors.preferred_time}>
                        <div className="inv-select">
                          <select id="inv-preferred_time" name="preferred_time" value={form.preferred_time} onChange={setField('preferred_time')}>
                            <option value="">Select a time</option>
                            {CONTACT_TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </Field>

                      <div className="inv-span-2">
                        <Field name="message" label="Message" error={errors.message}>
                          <textarea id="inv-message" name="message" rows="4"
                            placeholder="Anything you would like us to know (optional)"
                            value={form.message} onChange={setField('message')} maxLength={2000} />
                        </Field>
                      </div>
                    </div>

                    <label className={`inv-check ${errors.agree ? 'has-error' : ''}`}>
                      <input type="checkbox" name="agree" checked={form.agree} onChange={setField('agree')} />
                      <span>I agree to be contacted by Akashbari about this investment.</span>
                    </label>
                    {errors.agree && <small className="inv-error">{errors.agree}</small>}

                    <button type="submit" className="inv-btn inv-btn-block" disabled={submitting}>
                      {submitting ? (
                        <><span className="spinner-border spinner-border-sm me-2" /> Submitting...</>
                      ) : (
                        <>Submit Application <i className="bi bi-arrow-right ms-1"></i></>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        .inv-page { background: ${brandTint}; }

        /* ---------- Hero: background image + কালো shadow ---------- */
        .inv-hero {
          position: relative;
          color: #fff;
          text-align: center;
          padding: 100px 0 140px;
          background-image: url("${background_image}");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          overflow: hidden;
        }
        /* কালো shadow (overlay) — নিচের দিকে একটু বেশি গাঢ় */
        .inv-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.55) 0%,
            rgba(0, 0, 0, 0.65) 60%,
            rgba(0, 0, 0, 0.75) 100%
          );
          z-index: 0;
        }
        .inv-hero-content {
          position: relative;
          z-index: 1;
        }
        .inv-eyebrow {
          display: inline-block;
          font-size: 0.72rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          opacity: 0.9;
        }
        .inv-hero h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.9rem, 4.5vw, 3rem);
          font-weight: 500;
          margin: 10px 0 0;
          text-shadow: 0 4px 18px rgba(0, 0, 0, 0.45);
        }
        .inv-hero-line {
          display: block;
          width: 64px;
          height: 3px;
          background: #fff;
          margin: 18px auto;
        }
        .inv-hero p {
          max-width: 560px;
          margin: 0 auto;
          opacity: 0.92;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
        }

        /* ---------- Layout ---------- */
        .inv-body { padding: 0 0 80px; position: relative; z-index: 2; }
        .inv-layout {
          display: grid;
          grid-template-columns: 0.85fr 1.4fr;
          gap: 24px;
          margin-top: -70px;
          align-items: start;
        }

        /* ---------- Left panel ---------- */
        .inv-aside {
          background: ${brandDark};
          color: #fff;
          border-radius: 18px;
          padding: 32px 28px;
          box-shadow: 0 18px 40px rgba(61, 31, 10, 0.25);
          position: sticky;
          top: 100px;
        }
        .inv-aside h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.6rem;
          font-weight: 500;
          margin: 0 0 8px;
        }
        .inv-aside-sub { opacity: 0.8; font-size: 0.92rem; margin-bottom: 24px; }
        .inv-benefits { list-style: none; padding: 0; margin: 0 0 26px; }
        .inv-benefits li { display: flex; gap: 14px; margin-bottom: 18px; }
        .inv-benefits strong { display: block; font-size: 0.95rem; }
        .inv-benefits span { font-size: 0.85rem; opacity: 0.75; }
        .inv-benefit-icon {
          width: 40px; height: 40px; flex-shrink: 0;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          font-size: 18px;
          opacity: 1 !important;
        }
        .inv-contact {
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          padding-top: 18px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .inv-contact span { font-size: 0.8rem; opacity: 0.7; }
        .inv-contact a {
          color: #fff; text-decoration: none; font-weight: 600; font-size: 1.05rem;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .inv-contact a:hover { text-decoration: underline; }

        /* ---------- Form card ---------- */
        .inv-card {
          background: #fff;
          border-radius: 18px;
          padding: 34px 32px;
          box-shadow: 0 18px 40px rgba(94, 46, 16, 0.12);
        }
        .inv-card-head h3 {
          font-family: 'Playfair Display', Georgia, serif;
          color: ${brandColor};
          font-size: 1.5rem;
          margin: 0 0 4px;
        }
        .inv-card-head p { color: #777; font-size: 0.85rem; margin-bottom: 22px; }

        .inv-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px 18px;
        }
        .inv-span-2 { grid-column: span 2; }

        .inv-field { display: flex; flex-direction: column; }
        .inv-field label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 6px;
        }
        .inv-req { color: #c0392b; }

        .inv-field input,
        .inv-field select,
        .inv-field textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #e4d9d1;
          border-radius: 10px;
          background: #fcfaf8;
          font-size: 0.95rem;
          color: #222;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          font-family: inherit;
        }
        .inv-field textarea { resize: vertical; min-height: 110px; }
        .inv-field input:focus,
        .inv-field select:focus,
        .inv-field textarea:focus {
          border-color: ${brandColor};
          background: #fff;
          box-shadow: 0 0 0 4px rgba(94, 46, 16, 0.12);
        }
        .inv-field .has-error { border-color: #c0392b; background: #fff8f7; }

        .inv-select { position: relative; }
        .inv-select select { appearance: none; padding-right: 40px; cursor: pointer; }
        .inv-select::after {
          content: '';
          position: absolute;
          right: 16px; top: 50%;
          width: 8px; height: 8px;
          border-right: 2px solid ${brandColor};
          border-bottom: 2px solid ${brandColor};
          transform: translateY(-70%) rotate(45deg);
          pointer-events: none;
        }

        .inv-error { color: #c0392b; font-size: 0.78rem; margin-top: 5px; }

        .inv-alert {
          display: flex; align-items: center; gap: 8px;
          background: #fff4f2;
          border: 1px solid #f3c4bc;
          color: #a93226;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.88rem;
          margin-bottom: 18px;
        }

        .inv-check {
          display: flex; align-items: flex-start; gap: 10px;
          margin: 20px 0 4px;
          font-size: 0.88rem;
          color: #444;
          cursor: pointer;
        }
        .inv-check input { width: 18px; height: 18px; margin-top: 2px; accent-color: ${brandColor}; flex-shrink: 0; }
        .inv-check.has-error span { color: #c0392b; }

        .inv-btn {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 14px 28px;
          border: none;
          border-radius: 999px;
          background: ${brandColor};
          color: #fff;
          font-weight: 600;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .inv-btn:hover:not(:disabled) {
          background: ${brandDark};
          transform: translateY(-2px);
          box-shadow: 0 10px 22px rgba(94, 46, 16, 0.28);
        }
        .inv-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .inv-btn-block { width: 100%; margin-top: 18px; }

        /* ---------- Success ---------- */
        .inv-success { text-align: center; padding: 30px 10px; }
        .inv-success-icon {
          width: 72px; height: 72px;
          margin: 0 auto 18px;
          border-radius: 50%;
          background: ${brandTint};
          color: ${brandColor};
          display: flex; align-items: center; justify-content: center;
          font-size: 34px;
        }
        .inv-success h3 {
          font-family: 'Playfair Display', Georgia, serif;
          color: ${brandColor};
          font-size: 1.8rem;
        }
        .inv-success p { color: #555; max-width: 380px; margin: 8px auto 24px; }

        /* ---------- Responsive ---------- */
        @media (max-width: 991px) {
          .inv-layout { grid-template-columns: 1fr; }
          .inv-aside { position: static; order: 2; }
          .inv-card { order: 1; }
        }
        @media (max-width: 576px) {
          .inv-hero { padding: 64px 0 110px; }
          .inv-card { padding: 24px 18px; border-radius: 14px; }
          .inv-aside { padding: 26px 20px; border-radius: 14px; }
          .inv-grid { grid-template-columns: 1fr; }
          .inv-span-2 { grid-column: span 1; }
          .inv-body { padding-bottom: 56px; }
        }
      `}</style>
    </>
  );
};

export default InvestmentForm;