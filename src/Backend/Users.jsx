import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const EMPTY_FORM = { name: '', email: '', role: 'User', password: '' };

const Modal = ({ theme, title, onClose, children, footer, width }) => (
    <div
        style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '20px', animation: 'fadeIn .2s ease'
        }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
    >
        <div style={{
            backgroundColor: theme.card, color: theme.text,
            border: `1px solid ${theme.border}`, borderRadius: '16px',
            width: '100%', maxWidth: width || '400px', padding: '25px',
            animation: 'slideUp .2s ease'
        }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold m-0">{title}</h5>
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '20px', color: theme.text, opacity: 0.6, cursor: 'pointer' }}>✕</button>
            </div>
            {children}
            {footer && <div className="d-flex gap-2 mt-4">{footer}</div>}
        </div>
    </div>
);

const Users = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [authError, setAuthError] = useState(null);

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

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const getAuthHeaders = useCallback((extraHeaders = {}) => {
        let token = window.localStorage.getItem('token');
        if (!token) {
            console.warn('Warning: No token found in localStorage!');
            return { Accept: 'application/json', 'Content-Type': 'application/json', ...extraHeaders };
        }
        token = token.replace(/['"]+/g, '');
        if (token.startsWith('Bearer ')) token = token.replace('Bearer ', '');
        return {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.trim()}`,
            ...extraHeaders
        };
    }, []);

    const handleApiResponse = useCallback((res) => {
        if (res.status === 401 || res.status === 403) {
            setAuthError('Your session has expired. Please log in again.');
            return false;
        }
        return true;
    }, []);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setAuthError(null);
        try {
            const res = await fetch(`${BASE_URL}/users`, { headers: getAuthHeaders() });
            if (!handleApiResponse(res)) return;
            const data = await res.json();
            setUsers(data.data || data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setAuthError('Failed to fetch users. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [BASE_URL, getAuthHeaders, handleApiResponse]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const closeModal = () => { setShowModal(false); setFormData(EMPTY_FORM); };

    const handleSubmit = async () => {
        try {
            const res = await fetch(`${BASE_URL}/users`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(formData)
            });
            if (!handleApiResponse(res)) return;
            if (res.ok) {
                closeModal();
                fetchUsers();
            }
        } catch (err) {
            console.error('Failed to add user:', err);
        }
    };

    const confirmDelete = async () => {
        if (!deletingUser) return;
        setDeleting(true);
        try {
            const res = await fetch(`${BASE_URL}/users/${deletingUser.id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (!handleApiResponse(res)) return;
            if (res.ok) {
                setDeletingUser(null);
                fetchUsers();
            }
        } catch (err) {
            console.error('Failed to delete user:', err);
        } finally {
            setDeleting(false);
        }
    };

    const fieldStyle = {
        width: '100%', padding: '10px', marginBottom: '15px',
        borderRadius: '8px', border: `1px solid ${theme.border}`,
        backgroundColor: theme.bg, color: theme.text
    };

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="users" />

                <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="flex-grow-1">
                    <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '24px' }}>
                            <h4 className="mb-4 fw-bold" style={{ color: theme.text }}>User Management</h4>

                            {authError && (
                                <div className="alert" role="alert" style={{ border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text }}>
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>{authError}
                                </div>
                            )}

                            <div style={{ backgroundColor: theme.card, borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                <div className="p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h5 className="m-0" style={{ color: theme.text }}>System Users</h5>
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className="btn btn-sm px-3"
                                            style={{ backgroundColor: accent, color: accentOn, border: 'none' }}
                                        >
                                            <i className="bi bi-person-plus-fill me-2"></i>Add User
                                        </button>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table table-hover" style={{ color: theme.text, marginBottom: 0 }}>
                                            <thead>
                                                <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                                                    {['Name', 'Email', 'Role', 'Status', ''].map(h => (
                                                        <th key={h} style={{ color: theme.text }} className={h === '' ? 'text-end' : ''}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loading ? (
                                                    <tr><td colSpan="5" className="text-center py-4" style={{ color: theme.textLight }}>Loading...</td></tr>
                                                ) : users.length === 0 ? (
                                                    <tr><td colSpan="5" className="text-center py-4" style={{ color: theme.textLight }}>No users found.</td></tr>
                                                ) : users.map(user => (
                                                    <tr key={user.id || user.email} style={{ borderColor: theme.border }}>
                                                        <td style={{ color: theme.text }}>{user.name}</td>
                                                        <td style={{ color: theme.text }}>{user.email}</td>
                                                        <td style={{ color: theme.text }}>{user.role}</td>
                                                        <td>
                                                            <span style={{ border: `1px solid ${theme.text}`, color: theme.text, fontSize: '11px', padding: '4px 10px', borderRadius: '999px', fontWeight: 600 }}>
                                                                Active
                                                            </span>
                                                        </td>
                                                        <td className="text-end">
                                                            <button onClick={() => setDeletingUser(user)} className="btn btn-link p-0" style={{ color: theme.text }}>
                                                                <i className="bi bi-trash3"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Footer theme={theme} />
                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            {showModal && (
                <Modal
                    theme={theme}
                    title="Add New User"
                    onClose={closeModal}
                    footer={<>
                        <button className="btn btn-outline-dark flex-grow-1" onClick={closeModal}>Cancel</button>
                        <button onClick={handleSubmit} className="btn flex-grow-1" style={{ backgroundColor: accent, color: accentOn, border: 'none' }}>Save</button>
                    </>}
                >
                    <input style={fieldStyle} placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    <input style={fieldStyle} placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    <input type="password" style={fieldStyle} placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    <select style={fieldStyle} value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            {deletingUser && (
                <div
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 9999, padding: '20px', animation: 'fadeIn .2s ease'
                    }}
                    onClick={(e) => e.target === e.currentTarget && !deleting && setDeletingUser(null)}
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
                            <i className="bi bi-trash3"></i>
                        </div>
                        <h5 style={{ margin: '0 0 8px', fontWeight: 600 }}>Delete this user?</h5>
                        <p style={{ margin: '0 0 22px', color: theme.textLight, fontSize: '14px' }}>
                            "<strong>{deletingUser.name}</strong>" will be permanently removed. This can't be undone.
                        </p>
                        <div className="d-flex gap-2">
                            <button onClick={() => setDeletingUser(null)} disabled={deleting} className="btn btn-outline-dark flex-fill">Cancel</button>
                            <button onClick={confirmDelete} disabled={deleting} className="btn flex-fill" style={{ backgroundColor: accent, color: accentOn, border: 'none' }}>
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .form-control, .form-select { background-color: ${theme.bg} !important; color: ${theme.text} !important; border-color: ${theme.border} !important; }
                .table tbody tr:hover { background-color: ${theme.isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'} !important; }
            `}</style>
        </div>
    );
};

export default Users;