import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

// ⚠️ path আপনার folder অনুযায়ী ঠিক করুন (src/Config/api.js)
import { API_BASE_URL } from '../Config/api';

const EMPTY_FORM = { faq_question: '', faq_answe: '' };
const ITEMS_PER_PAGE = 10;

// ---------- Axios instance: প্রতিটা request এ token + JSON header ----------
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { Accept: 'application/json' }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers.Role = localStorage.getItem('Role') || 'admin';
    return config;
});

// API যে আকারেই data দিক, একটা array বানাও
const extractFaqArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.data)) return data.data.data; // paginated
    if (Array.isArray(data?.faqs)) return data.faqs;
    return [];
};

// Error থেকে পড়ার মতো message বের করো
const getErrorMessage = (err, fallback) => {
    const body = err.response?.data;
    if (body?.errors) {
        const first = Object.values(body.errors)[0];
        return Array.isArray(first) ? first[0] : String(first);
    }
    if (typeof body === 'object' && body?.message) return body.message;
    if (err.response?.status >= 500) return `Server error (${err.response.status}). Please try again.`;
    if (!err.response) return 'Network error. Please check your connection.';
    return fallback;
};

const Modal = ({ theme, title, icon, iconColor, onClose, children, footer }) => (
    <div
        style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(20,20,30,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1050, padding: '20px', animation: 'fadeIn .2s ease'
        }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
    >
        <div style={{
            backgroundColor: theme.card, borderRadius: '18px', width: '100%', maxWidth: '600px',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            boxShadow: '0 24px 60px rgba(0,0,0,0.35)', animation: 'slideIn .25s ease'
        }}>
            <div style={{
                padding: '18px 22px', borderBottom: `1px solid ${theme.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <h5 style={{ color: theme.text, margin: 0, fontWeight: 600 }}>
                    <i className={`bi ${icon} me-2`} style={{ color: iconColor }}></i>{title}
                </h5>
                <button type="button" onClick={onClose} style={{
                    background: 'transparent', border: 'none', fontSize: '22px',
                    color: theme.text, opacity: 0.6, cursor: 'pointer'
                }}>✕</button>
            </div>
            <div style={{ padding: '22px', overflowY: 'auto' }}>{children}</div>
            {footer && (
                <div style={{
                    padding: '16px 22px', borderTop: `1px solid ${theme.border}`,
                    display: 'flex', justifyContent: 'flex-end', gap: '10px'
                }}>{footer}</div>
            )}
        </div>
    </div>
);

const FqaSettings = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [deletingFaq, setDeletingFaq] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);

    const [currentPage, setCurrentPage] = useState(1);

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#15172b' : '#f5f3f7',
        card: isDarkMode ? '#1d2140' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#333a4d',
        border: isDarkMode ? '#2c2f4d' : '#e7e5ee',
        accent: '#6c5ce7'
    };
    const accent = theme.accent || theme.text;

    const fieldStyle = {
        backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}`,
        borderRadius: '10px', padding: '10px 14px', width: '100%', fontSize: '14px'
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    // ---------- Login check / session expired ----------
    const hasToken = () => {
        if (!localStorage.getItem('token')) {
            setError('Please login to access this page');
            setTimeout(() => { window.location.href = '/login'; }, 2000);
            return false;
        }
        return true;
    };

    // 401/403 হলে true ফেরত দেয়
    const handleAuthError = (err) => {
        const status = err.response?.status;
        if (status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('Role');
            setError('Session expired. Please login again.');
            setTimeout(() => { window.location.href = '/login'; }, 2000);
            return true;
        }
        if (status === 403) {
            setError('This account does not have admin access.');
            return true;
        }
        return false;
    };

    useEffect(() => {
        if (!success) return;
        const t = setTimeout(() => setSuccess(''), 3000);
        return () => clearTimeout(t);
    }, [success]);

    const fetchFaqs = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/faqs');
            setFaqs(extractFaqArray(res.data));
        } catch (err) {
            console.error('Error fetching FAQs:', err);
            if (!handleAuthError(err)) setError(getErrorMessage(err, 'Failed to fetch FAQs'));
            setFaqs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchFaqs(); }, []);

    // Delete এর পর page ফাঁকা হলে আগের page এ যাও
    const totalPages = Math.max(1, Math.ceil(faqs.length / ITEMS_PER_PAGE));
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [totalPages, currentPage]);

    const closeModal = () => { setShowModal(false); setEditingFaq(null); setFormData(EMPTY_FORM); };

    const openAddModal = () => { setEditingFaq(null); setFormData(EMPTY_FORM); setShowModal(true); };

    const openEditModal = (faq) => {
        setEditingFaq(faq);
        setFormData({ faq_question: faq.faq_question || '', faq_answe: faq.faq_answe || '' });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hasToken()) return;

        const payload = {
            faq_question: formData.faq_question.trim(),
            faq_answe: formData.faq_answe.trim()
        };
        if (!payload.faq_question || !payload.faq_answe) {
            setError('Question and answer are required');
            return;
        }

        setSaving(true);
        setError(null);
        try {
            if (editingFaq) {
                await api.put(`/faqs/${editingFaq.id}`, payload);
            } else {
                await api.post('/faqs', payload);
            }
            closeModal();
            setSuccess(editingFaq ? 'FAQ updated successfully!' : 'FAQ added successfully!');
            if (!editingFaq) setCurrentPage(1);
            await fetchFaqs();
        } catch (err) {
            console.error('Error saving FAQ:', err);
            if (!handleAuthError(err)) setError(getErrorMessage(err, 'Failed to save FAQ'));
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!deletingFaq || !hasToken()) return;
        setSaving(true);
        setError(null);
        try {
            await api.delete(`/faqs/${deletingFaq.id}`);
            setDeletingFaq(null);
            setSuccess('FAQ deleted successfully!');
            await fetchFaqs();
        } catch (err) {
            console.error('Error deleting FAQ:', err);
            setDeletingFaq(null);
            if (!handleAuthError(err)) setError(getErrorMessage(err, 'Failed to delete FAQ'));
        } finally {
            setSaving(false);
        }
    };

    const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = faqs.slice(indexOfFirstItem, indexOfFirstItem + ITEMS_PER_PAGE);

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="faq" />

                <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="flex-grow-1">
                    <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '24px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                <div>
                                    <h2 style={{ color: theme.text }}>FAQ Management</h2>
                                    <p style={{ color: theme.text, opacity: 0.65 }}>
                                        Manage frequently asked questions · {faqs.length} total
                                    </p>
                                </div>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn"
                                        style={{ border: `1px solid ${theme.border}`, color: theme.text }}
                                        onClick={fetchFaqs}
                                        disabled={loading}
                                        title="Refresh"
                                    >
                                        <i className="bi bi-arrow-clockwise"></i>
                                    </button>
                                    <button className="btn" style={{ backgroundColor: accent, color: '#fff' }} onClick={openAddModal}>
                                        <i className="bi bi-plus-circle me-2"></i>Add New FAQ
                                    </button>
                                </div>
                            </div>

                            {success && (
                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                    <i className="bi bi-check-circle-fill me-2"></i>{success}
                                    <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                                </div>
                            )}

                            <div className="table-responsive">
                                <table className="table table-hover" style={{ backgroundColor: theme.card, borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 14px rgba(0,0,0,0.06)' }}>
                                    <thead style={{ color: theme.text, borderBottom: `2px solid ${theme.border}` }}>
                                        <tr>
                                            {['#', 'Question', 'Answer', 'Actions'].map(h => (
                                                <th key={h} style={{ padding: '14px 16px' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading && faqs.length === 0 ? (
                                            <tr><td colSpan="4" className="text-center py-5">
                                                <div className="spinner-border" style={{ color: accent }} role="status"></div>
                                                <p className="mt-2" style={{ color: theme.text }}>Loading FAQs...</p>
                                            </td></tr>
                                        ) : currentItems.length === 0 ? (
                                            <tr><td colSpan="4" className="text-center py-5" style={{ color: theme.text }}>
                                                <i className="bi bi-question-circle display-4 d-block mb-3" style={{ opacity: 0.4 }}></i>
                                                <h5>No FAQs found</h5>
                                                <p style={{ opacity: 0.65 }}>Click "Add New FAQ" to create one.</p>
                                            </td></tr>
                                        ) : currentItems.map((faq, i) => (
                                            <tr key={faq.id || i} style={{ color: theme.text, borderBottom: `1px solid ${theme.border}`, opacity: loading ? 0.6 : 1 }}>
                                                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{indexOfFirstItem + i + 1}</td>
                                                <td style={{ padding: '12px 16px' }}><strong>{faq.faq_question || 'N/A'}</strong></td>
                                                <td style={{ padding: '12px 16px', opacity: 0.85 }}>
                                                    {faq.faq_answe?.length > 100 ? `${faq.faq_answe.substring(0, 100)}...` : (faq.faq_answe || 'N/A')}
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <div className="btn-group btn-group-sm">
                                                        <button className="btn btn-outline-primary" onClick={() => openEditModal(faq)} title="Edit FAQ"><i className="bi bi-pencil"></i></button>
                                                        <button className="btn btn-outline-danger" onClick={() => setDeletingFaq(faq)} title="Delete FAQ"><i className="bi bi-trash"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center align-items-center gap-2 py-4 flex-wrap">
                                    <button
                                        className="btn btn-sm"
                                        style={{ border: `1px solid ${theme.border}`, color: theme.text, opacity: currentPage === 1 ? 0.5 : 1 }}
                                        onClick={() => setCurrentPage(p => p - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                                        <button
                                            key={num}
                                            className="btn btn-sm"
                                            style={{
                                                border: `1px solid ${theme.border}`,
                                                backgroundColor: currentPage === num ? accent : 'transparent',
                                                color: currentPage === num ? '#fff' : theme.text
                                            }}
                                            onClick={() => setCurrentPage(num)}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                    <button
                                        className="btn btn-sm"
                                        style={{ border: `1px solid ${theme.border}`, color: theme.text, opacity: currentPage === totalPages ? 0.5 : 1 }}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                        <Footer theme={theme} />
                    </div>
                </div>
            </div>

            {showModal && (
                <form onSubmit={handleSubmit}>
                    <Modal
                        theme={theme}
                        title={editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                        icon={editingFaq ? 'bi-pencil-square' : 'bi-plus-circle'}
                        iconColor={accent}
                        onClose={closeModal}
                        footer={<>
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving
                                    ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                                    : <><i className="bi bi-save me-2"></i>{editingFaq ? 'Update' : 'Save'}</>}
                            </button>
                        </>}
                    >
                        <div className="mb-3">
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>
                                Question <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                maxLength={500}
                                value={formData.faq_question}
                                onChange={(e) => setFormData({ ...formData, faq_question: e.target.value })}
                                style={fieldStyle}
                                placeholder="Enter the FAQ question"
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>
                                Answer <span className="text-danger">*</span>
                            </label>
                            <textarea
                                required
                                rows="4"
                                value={formData.faq_answe}
                                onChange={(e) => setFormData({ ...formData, faq_answe: e.target.value })}
                                style={{ ...fieldStyle, minHeight: '100px' }}
                                placeholder="Enter the FAQ answer"
                            />
                        </div>
                    </Modal>
                </form>
            )}

            {deletingFaq && (
                <div
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1050, padding: '20px', animation: 'fadeIn .2s ease'
                    }}
                    onClick={(e) => e.target === e.currentTarget && !saving && setDeletingFaq(null)}
                >
                    <div style={{
                        backgroundColor: theme.isDarkMode ? '#000' : '#fff',
                        color: theme.isDarkMode ? '#fff' : '#000',
                        border: `1px solid ${theme.isDarkMode ? '#333' : '#000'}`,
                        borderRadius: '14px', width: '100%', maxWidth: '380px',
                        padding: '28px 26px', textAlign: 'center',
                        animation: 'slideIn .2s ease'
                    }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            border: `1.5px solid ${theme.isDarkMode ? '#fff' : '#000'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px', fontSize: '22px'
                        }}>
                            <i className="bi bi-trash"></i>
                        </div>
                        <h5 style={{ margin: '0 0 8px', fontWeight: 600 }}>Delete this FAQ?</h5>
                        <p style={{ margin: '0 0 22px', opacity: 0.7, fontSize: '14px' }}>
                            "{deletingFaq.faq_question}" will be permanently removed. This can't be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => setDeletingFaq(null)}
                                disabled={saving}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 600, fontSize: '14px',
                                    backgroundColor: 'transparent',
                                    color: theme.isDarkMode ? '#fff' : '#000',
                                    border: `1px solid ${theme.isDarkMode ? '#fff' : '#000'}`,
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={saving}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 600, fontSize: '14px',
                                    backgroundColor: theme.isDarkMode ? '#fff' : '#000',
                                    color: theme.isDarkMode ? '#000' : '#fff',
                                    border: `1px solid ${theme.isDarkMode ? '#fff' : '#000'}`,
                                    cursor: 'pointer'
                                }}
                            >
                                {saving ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideIn { from { transform: translateY(-24px) scale(0.96); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
                .form-control, .form-select {
                    background-color: ${theme.bg} !important;
                    color: ${theme.text} !important;
                    border-color: ${theme.border} !important;
                }
                .table tbody tr:hover { background-color: ${accent}0d !important; }
                .btn-group .btn { border-radius: 6px; padding: 4px 10px; margin: 0 2px; }
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: ${theme.bg}; }
                ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: ${accent}; }
            `}</style>
        </div>
    );
};

export default FqaSettings;