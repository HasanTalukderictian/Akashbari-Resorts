import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

// ⚠️ path আপনার folder অনুযায়ী ঠিক করুন (src/Config/api.js)
import { API_BASE_URL, BACKEND_URL } from '../Config/api';

const EMPTY_FORM = { name: '', image: null };
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE_MB = 2;

// Offline placeholder (বাইরের কোনো site লাগে না)
const PLACEHOLDER =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="100%" height="100%" fill="#e5e5e5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="#888">No Image</text></svg>'
    );

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

const getImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER;
    if (/^(https?:|data:|blob:)/i.test(imagePath)) return imagePath;
    const cleanPath = imagePath.replace(/\\/g, '/').replace(/^\/+/, '').replace(/^(public|storage)\//, '');
    return `${BACKEND_URL}/storage/${cleanPath}`;
};

const handleImgError = (e) => {
    if (e.currentTarget.src !== PLACEHOLDER) e.currentTarget.src = PLACEHOLDER;
};

const Modal = ({ theme, title, onClose, children, footer }) => (
    <div
        style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '20px', animation: 'fadeIn .2s ease'
        }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
    >
        <div style={{
            backgroundColor: theme.card, color: theme.text,
            border: `1px solid ${theme.border}`, borderRadius: '16px',
            width: '100%', maxWidth: '480px', maxHeight: '90vh',
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
                <div style={{ padding: '16px 22px', borderTop: `1px solid ${theme.border}` }}>{footer}</div>
            )}
        </div>
    </div>
);

const Achievement = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [imagePreview, setImagePreview] = useState(null);
    const [fileKey, setFileKey] = useState(0); // file input reset করার জন্য
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#0a0a0a' : '#f5f5f5',
        card: isDarkMode ? '#141414' : '#ffffff',
        text: isDarkMode ? '#f5f5f5' : '#111111',
        textLight: isDarkMode ? '#a3a3a3' : '#6b6b6b',
        border: isDarkMode ? '#2b2b2b' : '#dcdcdc'
    };
    const accent = theme.text;
    const accentOn = theme.card;

    const fieldStyle = {
        width: '100%', padding: '10px 14px', borderRadius: '10px',
        border: `1px solid ${theme.border}`, backgroundColor: theme.bg,
        color: theme.text, fontSize: '14px', outline: 'none'
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
        console.error(fallback, err);
        if (!handleAuthError(err)) showToast(getErrorMessage(err, fallback), 'error');
    };

    // ---------- Fetch ----------
    const fetchAchievements = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/get-achievement');
            setAchievements(data?.status === true && Array.isArray(data.data) ? data.data : []);
        } catch (err) {
            showError(err, 'Failed to fetch achievements.');
            setAchievements([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAchievements(); }, []);

    // ---------- Form ----------
    const handleInputChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!ALLOWED_TYPES.includes(file.type)) {
            e.target.value = '';
            return showToast('Only JPG, PNG, GIF and WEBP files are allowed', 'error');
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            e.target.value = '';
            return showToast(`File size should be less than ${MAX_SIZE_MB}MB`, 'error');
        }
        setFormData((prev) => ({ ...prev, image: file }));
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const resetForm = () => {
        setFormData(EMPTY_FORM);
        setImagePreview(null);
        setIsEditing(false);
        setCurrentId(null);
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
        setIsEditing(true);
        setCurrentId(item.id);
        setFormData({ name: item.name || '', image: null });
        setImagePreview(item.image ? getImageUrl(item.image) : null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hasToken()) return;

        const name = formData.name.trim();
        if (!name) return showToast('Please enter name', 'error');
        if (!isEditing && !formData.image) return showToast('Please select an image', 'error');

        const payload = new FormData();
        payload.append('name', name);
        if (formData.image) payload.append('image', formData.image);

        setSaving(true);
        try {
            const url = isEditing ? `/edit-achievement/${currentId}` : '/add-achievement';
            // FormData দিলে axios নিজেই multipart + boundary বসায়
            const { data } = await api.post(url, payload);

            if (data?.status === true) {
                showToast(data.message || (isEditing ? 'Achievement updated successfully' : 'Achievement added successfully'));
                setShowModal(false);
                resetForm();
                fetchAchievements();
            } else {
                showToast(data?.message || 'Something went wrong', 'error');
            }
        } catch (err) {
            showError(err, 'Failed to save achievement');
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteConfirm || !hasToken()) return;
        setDeleting(true);
        try {
            const { data } = await api.delete(`/del-achievement/${deleteConfirm.id}`);
            if (data?.status === true) {
                showToast(data.message || 'Achievement deleted successfully');
                setDeleteConfirm(null);
                fetchAchievements();
            } else {
                showToast(data?.message || 'Failed to delete', 'error');
            }
        } catch (err) {
            setDeleteConfirm(null);
            showError(err, 'Failed to delete achievement');
        } finally {
            setDeleting(false);
        }
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="achievement" />

                <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="flex-grow-1">
                    <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '24px' }}>
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                                <div>
                                    <h2 style={{ color: theme.text, margin: 0 }}>Achievement Gallery</h2>
                                    <p style={{ color: theme.textLight, margin: '4px 0 0' }}>
                                        Manage awards and milestones · {achievements.length} total
                                    </p>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-dark" onClick={fetchAchievements} disabled={loading} title="Refresh">
                                        <i className="bi bi-arrow-clockwise"></i>
                                    </button>
                                    <button
                                        onClick={handleAddClick}
                                        style={{ backgroundColor: accent, color: accentOn, border: 'none', padding: '10px 22px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                                    >
                                        <i className="bi bi-plus-circle me-2"></i>Add New Achievement
                                    </button>
                                </div>
                            </div>

                            {loading && achievements.length === 0 ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border" style={{ color: accent }} role="status"></div>
                                    <p className="mt-3" style={{ color: theme.textLight }}>Loading achievements...</p>
                                </div>
                            ) : achievements.length === 0 ? (
                                <div className="text-center py-5" style={{ color: theme.textLight }}>
                                    <i className="bi bi-trophy display-4 d-block mb-3" style={{ opacity: 0.4 }}></i>
                                    No achievements found. Click "Add New Achievement" to get started.
                                </div>
                            ) : (
                                <div className="row g-3" style={{ opacity: loading ? 0.6 : 1 }}>
                                    {achievements.map(item => (
                                        <div className="col-sm-6 col-lg-4" key={item.id}>
                                            <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', overflow: 'hidden', height: '100%' }}>
                                                <img
                                                    src={getImageUrl(item.image)}
                                                    alt={item.name}
                                                    loading="lazy"
                                                    style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
                                                    onError={handleImgError}
                                                />
                                                <div style={{ padding: '16px', textAlign: 'center' }}>
                                                    <div style={{ color: theme.text, fontWeight: 700, marginBottom: '12px', wordBreak: 'break-word' }}>{item.name}</div>
                                                    <div className="d-flex gap-2 justify-content-center">
                                                        <button className="btn btn-sm btn-outline-dark" onClick={() => handleEditClick(item)}>
                                                            <i className="bi bi-pencil me-1"></i>Edit
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-dark" onClick={() => setDeleteConfirm(item)}>
                                                            <i className="bi bi-trash me-1"></i>Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <Footer theme={theme} />
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <form onSubmit={handleSubmit}>
                    <Modal
                        theme={theme}
                        title={isEditing ? 'Edit Achievement' : 'Add New Achievement'}
                        onClose={closeModal}
                        footer={
                            <button type="submit" disabled={saving} style={{ width: '100%', backgroundColor: accent, color: accentOn, border: 'none', padding: '11px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                                {saving
                                    ? <><span className="spinner-border spinner-border-sm me-2"></span>Processing...</>
                                    : (isEditing ? 'Update Achievement' : 'Add Achievement')}
                            </button>
                        }
                    >
                        <div className="mb-3">
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} style={fieldStyle} placeholder="Enter achievement name" maxLength={255} required />
                        </div>
                        <div>
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Image {!isEditing && '*'}</label>
                            <input
                                key={fileKey}
                                type="file"
                                name="image"
                                onChange={handleImageChange}
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                style={fieldStyle}
                            />
                            <div style={{ marginTop: '6px', color: theme.textLight, fontSize: '12px' }}>
                                JPG, PNG, GIF or WEBP · Max {MAX_SIZE_MB}MB
                                {isEditing && ' · Current image will be kept if no new image is selected'}
                            </div>
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    onError={handleImgError}
                                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '10px', marginTop: '10px', border: `1px solid ${theme.border}` }}
                                />
                            )}
                        </div>
                    </Modal>
                </form>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 2000, padding: '20px', animation: 'fadeIn .2s ease'
                    }}
                    onClick={(e) => e.target === e.currentTarget && !deleting && setDeleteConfirm(null)}
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
                        <h5 style={{ margin: '0 0 8px', fontWeight: 600 }}>Delete this achievement?</h5>
                        <p style={{ margin: '0 0 22px', color: theme.textLight, fontSize: '14px' }}>
                            "<strong>{deleteConfirm.name}</strong>" will be permanently removed. This can't be undone.
                        </p>
                        <div className="d-flex gap-2">
                            <button onClick={() => setDeleteConfirm(null)} disabled={deleting} className="btn btn-outline-dark flex-fill">Cancel</button>
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
                .form-control, .form-select { background-color: ${theme.bg} !important; color: ${theme.text} !important; border-color: ${theme.border} !important; }
            `}</style>
        </div>
    );
};

export default Achievement;