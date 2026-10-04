import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from './Common/Header';
import Footer from './Common/Footer';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const CATEGORIES = ['Suite Tips', 'Weekend Getaway', 'Suite Review', 'Business Travel', 'Spa & Wellness', 'Room Guide'];

// Backend er rules er sathe mil rakha hoyeche
const LIMITS = {
  title: { min: 5, max: 150 },
  excerpt: { min: 30, max: 300 },
  introduction: { min: 200, max: 5000 },
  conclusion: { max: 3000 },
  sectionTitle: { max: 150 },
  sectionContent: { max: 5000 },
  maxSections: 10,
};
const IMAGE = { maxBytes: 3 * 1024 * 1024, minW: 800, minH: 450, types: ['image/jpeg', 'image/png', 'image/webp'] };

const validateImage = (file) =>
  new Promise((resolve, reject) => {
    if (!IMAGE.types.includes(file.type)) return reject('Only JPG, PNG or WEBP images are allowed');
    if (file.size > IMAGE.maxBytes) return reject('Image must be 3MB or smaller');

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      if (img.width < IMAGE.minW || img.height < IMAGE.minH) {
        return reject(`Image is too small (${img.width}x${img.height}). Minimum is ${IMAGE.minW}x${IMAGE.minH} px`);
      }
      resolve(true);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject('This file is not a valid image');
    };
    img.src = url;
  });

const WriteBlog = () => {
  const brandColor = '#5e2e10';
  const navigate = useNavigate();
  const fileInput = useRef(null);

  const [form, setForm] = useState({
    title: '',
    category: '',
    excerpt: '',
    introduction: '',
    conclusion: '',
  });
  const [sections, setSections] = useState([{ title: '', content: '' }]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Login na thakle login page e pathao
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (!localStorage.getItem('visitor_token')) {
      navigate('/visitor-login', { replace: true, state: { from: '/write-blog' } });
    }
  }, [navigate]);

  // Preview URL cleanup
  useEffect(() => () => imagePreview && URL.revokeObjectURL(imagePreview), [imagePreview]);

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const updateSection = (i, field, value) =>
    setSections((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  const addSection = () =>
    sections.length < LIMITS.maxSections && setSections((prev) => [...prev, { title: '', content: '' }]);
  const removeSection = (i) => setSections((prev) => prev.filter((_, idx) => idx !== i));

  const handleImage = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;

    try {
      await validateImage(file);
      setErrors((prev) => ({ ...prev, image: null }));
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } catch (msg) {
      setImageFile(null);
      setImagePreview(null);
      setErrors((prev) => ({ ...prev, image: msg }));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const validate = () => {
    const e = {};
    const t = form.title.trim();
    const ex = form.excerpt.trim();
    const intro = form.introduction.trim();

    if (t.length < LIMITS.title.min) e.title = `Title must be at least ${LIMITS.title.min} characters`;
    if (t.length > LIMITS.title.max) e.title = `Title must be under ${LIMITS.title.max} characters`;
    if (!form.category) e.category = 'Choose a category';
    if (ex.length < LIMITS.excerpt.min) e.excerpt = `Summary must be at least ${LIMITS.excerpt.min} characters`;
    if (ex.length > LIMITS.excerpt.max) e.excerpt = `Summary must be under ${LIMITS.excerpt.max} characters`;
    if (intro.length < LIMITS.introduction.min)
      e.introduction = `Introduction must be at least ${LIMITS.introduction.min} characters (now ${intro.length})`;
    if (!imageFile) e.image = e.image || 'Add a cover image';

    const half = sections.find((s) => (s.title.trim() && !s.content.trim()) || (!s.title.trim() && s.content.trim()));
    if (half) e.sections = 'Each section needs both a heading and text, or remove it';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError('');
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const token = localStorage.getItem('visitor_token');
    const cleanSections = sections
      .map((s) => ({ title: s.title.trim(), content: s.content.trim() }))
      .filter((s) => s.title && s.content);

    const fd = new FormData();
    fd.append('title', form.title.trim());
    fd.append('category', form.category);
    fd.append('excerpt', form.excerpt.trim());
    fd.append('introduction', form.introduction.trim());
    fd.append('conclusion', form.conclusion.trim());
    fd.append('sections', JSON.stringify(cleanSections));
    fd.append('image', imageFile);

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/visitor/blogs`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const status = err.response?.status;

      if (status === 401) {
        localStorage.removeItem('visitor_token');
        localStorage.removeItem('visitor_data');
        navigate('/visitor-login', { replace: true, state: { from: '/write-blog' } });
        return;
      }
      if (status === 422) {
        const apiErrors = err.response.data.errors || {};
        const mapped = {};
        Object.keys(apiErrors).forEach((k) => (mapped[k] = apiErrors[k][0]));
        // sections.0.title jatiyo error ke ekta message e
        if (Object.keys(mapped).some((k) => k.startsWith('sections.'))) {
          mapped.sections = 'Check your sections: each needs a heading and text';
        }
        setErrors(mapped);
        // Moderation error ('content') ba onno kono field bahire hole top e dekhao
        setServerError(mapped.content || err.response.data.message || 'Please fix the errors below');
      } else if (status === 429) {
        setServerError('You have submitted too many blogs recently. Please try again later.');
      } else {
        setServerError(err.response?.data?.message || 'Unable to connect to server. Please try again later.');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const cls = (field) => `form-control py-2 ${errors[field] ? 'is-invalid' : ''}`;
  const Counter = ({ value, max, min }) => (
    <div className="form-text text-end" style={{ color: min && value.trim().length < min ? '#b02a37' : undefined }}>
      {value.trim().length}/{max}
    </div>
  );

  // ---- Success screen ----
  if (submitted) {
    return (
      <>
        <Header />
        <section className="py-5" style={{ minHeight: '70vh', backgroundColor: '#faf7f4' }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-md-8 col-lg-6">
                <div className="bg-white shadow-sm rounded-4 p-4 p-md-5 text-center">
                  <h2 style={{ color: brandColor, fontWeight: 700 }}>Blog submitted</h2>
                  <p className="text-muted mb-4">
                    Thanks for sharing your story. Our team will review it, and it will appear on the blog page once approved.
                  </p>
                  <div className="d-flex gap-2 justify-content-center flex-wrap">
                    <Link to="/blog" className="btn rounded-pill px-4" style={{ backgroundColor: brandColor, color: 'white' }}>
                      Back to blog
                    </Link>
                    <button
                      className="btn btn-outline-dark rounded-pill px-4"
                      onClick={() => window.location.reload()}
                    >
                      Write another
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  // ---- Form ----
  return (
    <>
      <Header />

      <section className="py-5" style={{ backgroundColor: '#faf7f4' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-9 col-xl-8">
              <div className="bg-white shadow-sm rounded-4 p-4 p-md-5">
                <h2 className="mb-1" style={{ color: brandColor, fontWeight: 700 }}>
                  Write a blog
                </h2>
                <p className="text-muted mb-4">
                  Your post is reviewed by our team before it goes live.
                </p>

                {serverError && (
                  <div className="alert alert-danger py-2" role="alert">
                    {serverError}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  {/* Cover image */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Cover image</label>
                    <div
                      className="rounded-3 text-center p-3"
                      style={{
                        border: `2px dashed ${errors.image ? '#dc3545' : '#d9cfc7'}`,
                        backgroundColor: '#fcfaf8',
                        cursor: 'pointer',
                      }}
                      onClick={() => fileInput.current?.click()}
                    >
                      {imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            alt="Cover preview"
                            style={{ maxWidth: '100%', maxHeight: '220px', borderRadius: '10px', objectFit: 'cover' }}
                          />
                          <div className="mt-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-dark rounded-pill"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage();
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="py-4 text-muted">
                          <div className="fw-semibold">Click to upload a cover image</div>
                          <div className="small">JPG, PNG or WEBP, at least 800x450 px, up to 3MB</div>
                        </div>
                      )}
                      <input
                        ref={fileInput}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        style={{ display: 'none' }}
                        onChange={handleImage}
                      />
                    </div>
                    {errors.image && <div className="text-danger small mt-1">{errors.image}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="title" className="form-label fw-semibold">Title</label>
                    <input
                      id="title"
                      className={cls('title')}
                      value={form.title}
                      maxLength={LIMITS.title.max}
                      onChange={(e) => setField('title', e.target.value)}
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label fw-semibold">Category</label>
                    <select
                      id="category"
                      className={`form-select py-2 ${errors.category ? 'is-invalid' : ''}`}
                      value={form.category}
                      onChange={(e) => setField('category', e.target.value)}
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="excerpt" className="form-label fw-semibold">Short summary</label>
                    <textarea
                      id="excerpt"
                      rows="2"
                      className={cls('excerpt')}
                      value={form.excerpt}
                      maxLength={LIMITS.excerpt.max}
                      onChange={(e) => setField('excerpt', e.target.value)}
                    />
                    {errors.excerpt && <div className="invalid-feedback">{errors.excerpt}</div>}
                    <Counter value={form.excerpt} max={LIMITS.excerpt.max} min={LIMITS.excerpt.min} />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="introduction" className="form-label fw-semibold">Introduction</label>
                    <textarea
                      id="introduction"
                      rows="5"
                      className={cls('introduction')}
                      value={form.introduction}
                      maxLength={LIMITS.introduction.max}
                      onChange={(e) => setField('introduction', e.target.value)}
                    />
                    {errors.introduction && <div className="invalid-feedback">{errors.introduction}</div>}
                    <Counter value={form.introduction} max={LIMITS.introduction.max} min={LIMITS.introduction.min} />
                  </div>

                  {/* Sections */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Sections (optional)</label>
                    {sections.map((s, i) => (
                      <div key={i} className="border rounded-3 p-3 mb-3" style={{ backgroundColor: '#fcfaf8' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-semibold small">Section {i + 1}</span>
                          {sections.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-dark rounded-pill"
                              onClick={() => removeSection(i)}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <input
                          className="form-control mb-2"
                          placeholder="Heading"
                          value={s.title}
                          maxLength={LIMITS.sectionTitle.max}
                          onChange={(e) => updateSection(i, 'title', e.target.value)}
                        />
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Text"
                          value={s.content}
                          maxLength={LIMITS.sectionContent.max}
                          onChange={(e) => updateSection(i, 'content', e.target.value)}
                        />
                      </div>
                    ))}
                    {errors.sections && <div className="text-danger small mb-2">{errors.sections}</div>}
                    {sections.length < LIMITS.maxSections && (
                      <button type="button" className="btn btn-sm btn-outline-dark rounded-pill" onClick={addSection}>
                        Add a section
                      </button>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="conclusion" className="form-label fw-semibold">Conclusion (optional)</label>
                    <textarea
                      id="conclusion"
                      rows="3"
                      className={cls('conclusion')}
                      value={form.conclusion}
                      maxLength={LIMITS.conclusion.max}
                      onChange={(e) => setField('conclusion', e.target.value)}
                    />
                    {errors.conclusion && <div className="invalid-feedback">{errors.conclusion}</div>}
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
                        Submitting...
                      </>
                    ) : (
                      'Submit for review'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default WriteBlog;