import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Users = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const initialFormState = { name: '', email: '', role: 'User', password: '' };
    const [formData, setFormData] = useState(initialFormState);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState(null);

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2',
        sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b'
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    // Helper to dynamically pull the latest token headers
    // Users.js এর ভেতরের এই ফাংশনটি রিপ্লেস করুন
  const getAuthHeaders = useCallback((extraHeaders = {}) => {
    // সরাসরি এই মুহূর্তে লোকালস্টোরেজ থেকে লেটেস্ট টোকেনটি রিড করা হচ্ছে
    let token = window.localStorage.getItem('token'); 
    
    console.log("Current Token from LocalStorage:", token); // এটি কনসোলে চেক করুন

    if (!token) {
        console.warn("Warning: No token found in localStorage!");
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...extraHeaders
        };
    }

    // যদি কোনো কারণে টোকেনটি অবজেক্ট বা স্ট্রিং আকারে কোটেশনের ভেতরে থাকে, তা ক্লিন করা
    token = token.replace(/['"]+/g, ''); 

    if (token.startsWith('Bearer ')) {
        token = token.replace('Bearer ', '');
    }

    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.trim()}`,
        ...extraHeaders
    };
}, []);
    // Centralized authentication error check
    const handleApiResponse = useCallback((res) => {
        if (res.status === 401 || res.status === 403) {
            setAuthError("Your session has expired. Please log in again.");
            // Optional: localStorage.removeItem('token'); window.location.href = '/login';
            return false;
        }
        return true;
    }, []);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setAuthError(null);

            const res = await fetch(`${BASE_URL}/users`, {
                headers: getAuthHeaders()
            });

            if (!handleApiResponse(res)) return;

            const data = await res.json();

            // Handle Laravel pagination response
            // Laravel returns { current_page, data, first_page_url, from, last_page, etc. }
            setUsers(data.data || data); // data.data contains the actual users array

        } catch (err) {
            console.error("Failed to fetch users:", err);
            setAuthError("Failed to fetch users. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [BASE_URL, getAuthHeaders, handleApiResponse]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSubmit = async () => {
        try {
            const res = await fetch(`${BASE_URL}/users`, {
                method: 'POST',
                headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(formData)
            });

            if (!handleApiResponse(res)) return;

            if (res.ok) {
                setShowModal(false);
                setFormData(initialFormState);
                fetchUsers();
            }
        } catch (err) {
            console.error("Failed to add user:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        try {
            const res = await fetch(`${BASE_URL}/users/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!handleApiResponse(res)) return;

            if (res.ok) {
                fetchUsers();
            }
        } catch (err) {
            console.error("Failed to delete user:", err);
        }
    };

    const styles = {
        container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
        mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
        contentScroll: { flex: '1 0 auto', padding: '24px' },
        footerWrapper: { flexShrink: 0 },
        card: {
            backgroundColor: theme.card,
            color: theme.text,
            borderRadius: '15px',
            border: `1px solid ${theme.border}`,
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
        },
        modalOverlay: {
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: showModal ? 'flex' : 'none',
            justifyContent: 'center', alignItems: 'center',
            zIndex: 9999, backdropFilter: 'blur(5px)'
        },
        modalBox: {
            backgroundColor: theme.card, color: theme.text,
            width: '400px', padding: '25px', borderRadius: '15px',
            border: `1px solid ${theme.border}`
        },
        input: {
            width: '100%', padding: '10px', marginBottom: '15px',
            borderRadius: '8px', border: `1px solid ${theme.border}`,
            backgroundColor: theme.isDarkMode ? '#1a1a2e' : '#fff', color: theme.text
        },
        badge: (status) => ({
            fontSize: '11px', padding: '4px 10px', borderRadius: '20px',
            background: status === 'Active' ? 'rgba(7, 205, 174, 0.1)' : 'rgba(254, 112, 150, 0.1)',
            color: status === 'Active' ? '#07cdae' : '#fe7096', fontWeight: '600'
        }),
        alert: {
            padding: '12px 20px', backgroundColor: 'rgba(254, 112, 150, 0.15)',
            color: '#fe7096', borderRadius: '8px', marginBottom: '20px', fontWeight: '500'
        }
    };

    return (
        <div style={styles.container} className="container-fluid p-0">
            {showModal && (
                <div style={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                    <div style={styles.modalBox}>
                        <h5 className="fw-bold mb-4">Add New User</h5>
                        <input style={styles.input} placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        <input style={styles.input} placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        <input type="password" style={styles.input} placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                        <select style={styles.input} value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                        </select>
                        <div className="d-flex gap-2">
                            <button className="btn btn-light flex-grow-1" onClick={() => setShowModal(false)}>Cancel</button>
                            <button onClick={handleSubmit} className="btn btn-primary flex-grow-1" style={{ background: 'linear-gradient(to right, #da8cff, #9a55ff)', border: 'none' }}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="users" />

                <div style={styles.mainArea} className="flex-grow-1">
                    <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

                    <div style={styles.contentContainer}>
                        <div style={styles.contentScroll}>
                            <div className="animate__animated animate__fadeIn">
                                <h4 className="mb-4 fw-bold" style={{ color: theme.text }}>User Management</h4>

                                {authError && (
                                    <div style={styles.alert}>
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        {authError}
                                    </div>
                                )}

                                <div className="card shadow-sm border-0" style={styles.card}>
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <h5 className="m-0">System Users</h5>
                                            <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm px-3" style={{ background: 'linear-gradient(to right, #da8cff, #9a55ff)', border: 'none' }}>
                                                <i className="bi bi-person-plus-fill me-2"></i>Add User
                                            </button>
                                        </div>
                                        <div className="table-responsive">
                                            <table className={`table table-hover ${isDarkMode ? 'table-dark' : ''}`} style={{ color: theme.text }}>
                                                <thead>
                                                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                                                        <th style={{ color: theme.text }}>Name</th>
                                                        <th style={{ color: theme.text }}>Email</th>
                                                        <th style={{ color: theme.text }}>Role</th>
                                                        <th style={{ color: theme.text }}>Status</th>
                                                        <th className="text-end" style={{ color: theme.text }}>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {loading ? (
                                                        <tr><td colSpan="5" className="text-center py-4" style={{ color: theme.text }}>Loading...</td></tr>
                                                    ) : users.length === 0 ? (
                                                        <tr><td colSpan="5" className="text-center py-4" style={{ color: theme.text }}>No users found.</td></tr>
                                                    ) : (
                                                        users.map((user) => (
                                                            <tr key={user.id || user.email} style={{ borderColor: theme.border }}>
                                                                <td style={{ color: theme.text }}>{user.name}</td>
                                                                <td style={{ color: theme.text }}>{user.email}</td>
                                                                <td style={{ color: theme.text }}>{user.role}</td>
                                                                <td><span style={styles.badge('Active')}>Active</span></td>
                                                                <td className="text-end">
                                                                    <button onClick={() => handleDelete(user.id)} className="btn btn-link text-danger p-0">
                                                                        <i className="bi bi-trash3"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={styles.footerWrapper}>
                            <Footer theme={theme} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Users;