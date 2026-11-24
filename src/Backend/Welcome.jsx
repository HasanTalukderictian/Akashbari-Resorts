import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

// ⚠️ path আপনার folder অনুযায়ী ঠিক করুন (src/Config/api.js)
import { API_BASE_URL, BACKEND_URL } from '../Config/api';

const EMPTY_FORM = { title: '', description: '', image: null };
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE_MB = 2;

// ---------- Axios instance: প্রতিটা request এ token + JSON header ----------
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: false,
    headers: { Accept: 'application/json' }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers.Role = localStorage.getItem('Role') || 'admin';
    return config;
});

// Backend কখনো `success`, কখনো `status` দেয়, দুটোই ধরো
const isOk = (data) => data?.success === true || data?.status === true;

const getErrorMessage = (err, fallback) => {
    const body = err.response?.data;
    if (body?.errors) {
        const first = Object.values(body.errors)[0];
        return Array.isArray(first) ? first[0] : String(first);
    }
    if (body && typeof body === 'object' && body.message) return body.message;
    if (err.response?.status === 413) return 'Image is too large for the server.';
    if (err.response?.status >= 500) return `Server error (${err.response.status}). Please try again.`;
    if (!err.response) return 'Network error. Please check your connection.';
    return fallback;
};

const getImageUrl = (path) => {
    if (!path) return null;
    if (/^(https?:|data:|blob:)/i.test(path)) return path;
    const clean = path.replace(/\\/g, '/').replace(/^\/+/, '').replace(/^(public|storage)\//, '');
    return `${BACKEND_URL}/storage/${clean}`;
};

const Modal = ({ theme, title, onClose, children, footer, width }) => (
    <div
        style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000, padding: '20px', animation: 'fadeIn .2s ease'
        }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
    >
        <div style={{
            backgroundColor: theme.card, color: theme.text,
            border: `1px solid ${theme.border}`, borderRadius: '16px',
            width: '100%', maxWidth: width || '480px', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column', animation: 'slideUp .2s ease'
        }}>
            <div style={{
                padding: '18px 22px', borderBottom: `1px solid ${theme.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <h5 className="m-0 fw-bold">{title}</h5>
                <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '20px', color: theme.text, opacity: 0.6, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '22px', overflowY: 'auto' }}>{children}</div>
            {footer && (
                <div style={{ padding: '16px 22px', borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    {footer}
                </div>
            )}
        </div>
    </div>
);

const Welcome = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebar') === 'true');
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [fileKey, setFileKey] = useState(0);

    const [deletingItem, setDeletingItem] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#0a0a0a' : '#f5f5f5',
        card: isDarkMode ? '#141414' : '#ffffff',
        text: isDarkMode ? '#f5f5f5' : '#111111',
        textLight: isDarkMode ? '#a3a3a3' : '#6b6b6b',
        border: isDarkMode ? '#2b2b2b' : '#dcdcdc',
        inputBg: isDarkMode ? '#1a1a1a' : '#ffffff'
    };
    const accent = theme.text;
    const accentOn = theme.card;

    const toggleSidebar = () => {
        const next = !isCollapsed;
        setIsCollapsed(next);
        localStorage.setItem('sidebar', next);
    };

    const toggleDarkMode = () => {
        const next = !isDarkMode;
        setIsDarkMode(next);
        localStorage.setItem('darkMode', next);
    };

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3500);
    };

    // ---------- Login check / session expired ----------
    const hasToken = () => {
        if (!localStorage.getItem('token')) {
            showToast('Please login to access this page', 'error');
            setTimeout(() => { window.location.href = '/login'; }, 2000);
            return false;
        }
        return true;
    };

    const handleAuthError = (err) => {
        const status = err.response?.status;
        if (status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('Role');
            showToast('Session expired. Please login again.', 'error');
            setTimeout(() => { window.location.href = '/login'; }, 2000);
            return true;
        }
        if (status === 403) {
            showToast('This account does not have admin access.', 'error');
            return true;
        }
        return false;
    };

    const showError = (err, fallback) => {
        console.error(fallback, err.response?.data || err.message);
        if (!handleAuthError(err)) showToast(getErrorMessage(err, fallback), 'error');
    };

    // ---------- Fetch ----------
    const fetchWelcomes = async () => {
        setLoading(true);
        setLoadError('');
        try {
            const { data } = await api.get('/get-welcomes');
            if (isOk(data) && Array.isArray(data.data)) {
                setBanners(data.data);
            } else {
                setBanners([]);
                if (data?.message) setLoadError(data.message);
            }
        } catch (err) {
            setLoadError(getErrorMessage(err, 'Failed to load data'));
            handleAuthError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWelcomes(); }, []);

    // ---------- Modal / Form ----------
    const resetForm = () => {
        setFormData(EMPTY_FORM);
        setImagePreview(null);
        setIsEditing(false);
        setEditId(null);
        setFileKey((k) => k + 1);
    };

    const closeModal = () => {
        if (saving) return;
        setShowModal(false);
        resetForm();
    };

    const handleAddClick = () => { resetForm(); setShowModal(true); };

    const handleEditClick = (item) => {
        resetForm();
        setFormData({ title: item.title || '', description: item.description || '', image: null });
        setImagePreview(getImageUrl(item.image));
        setIsEditing(true);
        setEditId(item.id);
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!ALLOWED_TYPES.includes(file.type)) {
            e.target.value = '';
            return showToast('Only JPG, PNG, GIF and WEBP files are allowed', 'error');
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            e.target.value = '';
            return showToast(`Image must be less than ${MAX_SIZE_MB}MB`, 'error');
        }
        setFormData((prev) => ({ ...prev, image: file }));
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hasToken()) return;

        const title = formData.title.trim();
        const description = formData.description.trim();
        if (!title || !description) return showToast('Please fill in all required fields!', 'error');

        const payload = new FormData();
        payload.append('title', title);
        payload.append('description', description);
        if (formData.image) payload.append('image', formData.image);

        setSaving(true);
        try {
            const url = isEditing && editId ? `/welcome/${editId}` : '/add-welcomes';
            // FormData দিলে axios নিজেই multipart + boundary বসায়
            const { data } = await api.post(url, payload);

            if (isOk(data)) {
                showToast(data.message || (isEditing ? 'Data successfully updated!' : 'Data successfully added!'));
                setShowModal(false);
                resetForm();
                fetchWelcomes();
            } else {
                showToast(data?.message || (isEditing ? 'Update failed!' : 'Add failed!'), 'error');
            }
        } catch (err) {
            showError(err, 'Something went wrong!');
        } finally {
            setSaving(false);
        }
    };

    // ---------- Delete ----------
    const confirmDelete = async () => {
        if (!deletingItem || !hasToken()) return;
        setDeleting(true);
        try {
            const { data } = await api.delete(`/del-welcomes/${deletingItem.id}`);
            // কিছু backend শুধু 200 দেয়, body তে success থাকে না → false না হলেই ok
            if (data?.success === false || data?.status === false) {
                showToast(data.message || 'Delete failed!', 'error');
                return;
            }
            setBanners((prev) => prev.filter((x) => x.id !== deletingItem.id));
            showToast(data?.message || 'Record deleted successfully');
            setDeletingItem(null);
        } catch (err) {
            setDeletingItem(null);
            showError(err, 'Delete failed!');
        } finally {
            setDeleting(false);
        }
    };

    const fieldStyle = { backgroundColor: theme.inputBg || theme.card, color: theme.text, border: `1px solid ${theme.border}` };

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh', display: 'flex' }}>
            <div style={{ width: isCollapsed ? '80px' : '260px', transition: 'width 0.3s ease', flexShrink: 0 }}>
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="welcome" />
            </div>

            <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0, height: '100vh' }}>
                <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

                <div className="flex-grow-1 overflow-auto d-flex flex-column">
                    <div className="p-4 flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                            <div>
                                <h4 style={{ color: theme.text }} className="fw-bold mb-1">Welcome Section</h4>
                                <span style={{ color: theme.textLight, fontSize: '14px' }}>{banners.length} records</span>
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-outline-dark" onClick={fetchWelcomes} disabled={loading} title="Refresh">
                                    <i className="bi bi-arrow-clockwise"></i>
                                </button>
                                <button
                                    className="btn px-4"
                                    onClick={handleAddClick}
                                    style={{ backgroundColor: accent, color: accentOn, border: 'none', fontWeight: 500, borderRadius: '8px' }}
                                >
                                    <i className="bi bi-plus-lg me-1"></i>Add Record
                                </button>
                            </div>
                        </div>

                        {loadError && (
                            <div className="alert d-flex align-items-center justify-content-between" style={{ border: '1px solid #b42318', backgroundColor: theme.card, color: theme.text }}>
                                <span><i className="bi bi-exclamation-triangle-fill me-2" style={{ color: '#b42318' }}></i>{loadError}</span>
                                <button className="btn btn-sm btn-outline-dark" onClick={fetchWelcomes}>Retry</button>
                            </div>
                        )}

                        <div className="table-responsive p-3" style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px' }}>
                            {loading && banners.length === 0 ? (
                                <div className="text-center p-5" style={{ color: theme.textLight }}>
                                    <div className="spinner-border mb-2" style={{ color: accent }} role="status"></div>
                                    <div>Loading data...</div>
                                </div>
                            ) : (
                                <table className="table align-middle mb-0" style={{ color: theme.text, opacity: loading ? 0.6 : 1 }}>
                                    <thead>
                                        <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                                            <th style={{ width: '100px', color: theme.text }}>Image</th>
                                            <th style={{ width: '200px', color: theme.text }}>Title</th>
                                            <th style={{ color: theme.text }}>Description</th>
                                            <th className="text-end" style={{ width: '180px', color: theme.text }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {banners.map(b => {
                                            const img = getImageUrl(b.image);
                                            return (
                                                <tr key={b.id} style={{ borderColor: theme.border }}>
                                                    <td>
                                                        {img ? (
                                                            <img
                                                                src={img}
                                                                alt="thumb"
                                                                loading="lazy"
                                                                style={{ width: '60px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: `1px solid ${theme.border}` }}
                                                                onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                                                            />
                                                        ) : <span style={{ color: theme.textLight, fontSize: '13px' }}>No Image</span>}
                                                    </td>
                                                    <td className="fw-bold" style={{ color: theme.text }}>{b.title}</td>
                                                    <td style={{ color: theme.textLight, fontSize: '0.9rem', maxWidth: '400px' }}>{b.description}</td>
                                                    <td className="text-end" style={{ whiteSpace: 'nowrap' }}>
                                                        <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleEditClick(b)}>
                                                            <i className="bi bi-pencil me-1"></i>Edit
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-dark" onClick={() => setDeletingItem(b)}>
                                                            <i className="bi bi-trash me-1"></i>Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {banners.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="text-center p-4" style={{ color: theme.textLight }}>No records found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    <Footer theme={theme} />
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <form onSubmit={handleSubmit}>
                    <Modal
                        theme={theme}
                        title={isEditing ? 'Edit Welcome Section' : 'Add Welcome Section'}
                        onClose={closeModal}
                        footer={<>
                            <button type="button" className="btn btn-outline-dark" onClick={closeModal} disabled={saving}>Cancel</button>
                            <button type="submit" className="btn px-4" disabled={saving} style={{ backgroundColor: accent, color: accentOn, border: 'none' }}>
                                {saving
                                    ? <><span className="spinner-border spinner-border-sm me-2"></span>{isEditing ? 'Updating...' : 'Saving...'}</>
                                    : (isEditing ? 'Update' : 'Submit')}
                            </button>
                        </>}
                    >
                        <div className="mb-3">
                            <label className="form-label fw-bold">Title <span className="text-danger">*</span></label>
                            <input type="text" name="title" className="form-control shadow-none" style={fieldStyle} value={formData.title} onChange={handleChange} maxLength={255} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Description <span className="text-danger">*</span></label>
                            <textarea name="description" className="form-control shadow-none" rows="3" style={fieldStyle} value={formData.description} onChange={handleChange} required></textarea>
                        </div>
                        <div>
                            <label className="form-label fw-bold">{isEditing ? 'Change Image (Optional)' : 'Upload Image'}</label>
                            <input
                                key={fileKey}
                                type="file"
                                className="form-control shadow-none"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                style={fieldStyle}
                                onChange={handleImageChange}
                            />
                            <div style={{ color: theme.textLight, fontSize: '12px', marginTop: '6px' }}>
                                JPG, PNG, GIF or WEBP · Max {MAX_SIZE_MB}MB
                            </div>
                            {imagePreview && (
                                <div className="mt-3 text-center">
                                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px', objectFit: 'contain', border: `1px solid ${theme.border}` }} />
                                    {isEditing && !formData.image && (
                                        <p style={{ color: theme.textLight, fontSize: '13px' }} className="mt-1">Current image shown. Upload new to replace.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </Modal>
                </form>
            )}

            {/* Delete Confirmation Modal */}
            {deletingItem && (
                <div
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 2000, padding: '20px', animation: 'fadeIn .2s ease'
                    }}
                    onClick={(e) => e.target === e.currentTarget && !deleting && setDeletingItem(null)}
                >
                    <div style={{
                        backgroundColor: theme.card, color: theme.text,
                        border: `1px solid ${theme.border}`, borderRadius: '16px',
                        width: '100%', maxWidth: '380px', padding: '28px 26px', textAlign: 'center',
                        animation: 'slideUp .2s ease'
                    }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            border: `1.5px solid ${theme.text}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px', fontSize: '20px'
                        }}>
                            <i className="bi bi-trash"></i>
                        </div>
                        <h5 style={{ margin: '0 0 8px', fontWeight: 600 }}>Delete this record?</h5>
                        <p style={{ margin: '0 0 22px', color: theme.textLight, fontSize: '14px' }}>
                            "<strong>{deletingItem.title}</strong>" will be permanently removed. This can't be undone.
                        </p>
                        <div className="d-flex gap-2">
                            <button onClick={() => setDeletingItem(null)} disabled={deleting} className="btn btn-outline-dark flex-fill">Cancel</button>
                            <button onClick={confirmDelete} disabled={deleting} className="btn flex-fill" style={{ backgroundColor: accent, color: accentOn, border: 'none' }}>
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast.show && (
                <div style={{
                    position: 'fixed', bottom: '20px', right: '20px', zIndex: 2100,
                    padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 500,
                    backgroundColor: toast.type === 'error' ? '#b42318' : accent,
                    color: toast.type === 'error' ? '#fff' : accentOn,
                    display: 'flex', alignItems: 'center', gap: '8px', maxWidth: 'calc(100% - 40px)'
                }}>
                    <i className={`bi ${toast.type === 'error' ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'}`}></i>
                    {toast.message}
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .form-control:focus { border-color: ${accent} !important; box-shadow: 0 0 0 3px ${accent}1a !important; }
                .table tbody tr:hover { background-color: ${theme.isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'}; }
            `}</style>
        </div>
    );
};

export default Welcome;