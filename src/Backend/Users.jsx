import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Users = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    
    // Initial State definition
    const initialFormState = { name: '', email: '', role: 'User', password: '' };
    const [formData, setFormData] = useState(initialFormState);

    // API state
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

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

    // Fetch Users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://127.0.0.1:8000/api/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            setUsers(data.data || data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Create User logic
    const handleSubmit = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setShowModal(false);
                setFormData(initialFormState); // Clear form after success
                fetchUsers();
            } else {
                alert(data.message || 'Error');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        try {
            await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const styles = {
        container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
        mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        contentScroll: { flexGrow: 1, overflowY: 'auto', padding: '24px' },
        card: {
            backgroundColor: theme.card,
            color: theme.text,
            borderRadius: '15px',
            border: `1px solid ${theme.border}`,
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: showModal ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(5px)'
        },
        modalBox: {
            backgroundColor: theme.card,
            color: theme.text,
            width: '400px',
            padding: '25px',
            borderRadius: '15px',
            border: `1px solid ${theme.border}`,
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        },
        input: {
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.isDarkMode ? '#1a1a2e' : '#fff',
            color: theme.text,
            outline: 'none'
        },
        badge: (status) => ({
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: '20px',
            background: status === 'Active' ? 'rgba(7, 205, 174, 0.1)' : status === 'Pending' ? 'rgba(254, 112, 150, 0.1)' : 'rgba(156, 163, 175, 0.1)',
            color: status === 'Active' ? '#07cdae' : status === 'Pending' ? '#fe7096' : '#9ca3af',
            fontWeight: '600'
        })
    };

    return (
        <div style={styles.container} className="container-fluid p-0">

            {/* MODAL */}
            <div style={styles.modalOverlay} onClick={(e) => {
                // Only close if the background overlay is clicked
                if (e.target === e.currentTarget) {
                    setShowModal(false);
                    setFormData(initialFormState);
                }
            }}>
                <div style={styles.modalBox}>
                    <h5 className="fw-bold mb-4">Add New User</h5>

                    <label className="small mb-1">Full Name</label>
                    <input style={styles.input} value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <label className="small mb-1">Email Address</label>
                    <input style={styles.input} value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <label className="small mb-1">Password</label>
                    <input
                        type="password"
                        style={styles.input}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />

                    <label className="small mb-1">Role</label>
                    <select style={styles.input} value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>

                    <div className="d-flex gap-2 mt-2">
                        <button className="btn btn-light flex-grow-1" onClick={() => {
                            setShowModal(false);
                            setFormData(initialFormState); // Clear when cancel
                        }}>
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="btn btn-primary flex-grow-1"
                            style={{ background: 'linear-gradient(to right, #da8cff, #9a55ff)', border: 'none' }}
                        >
                            Save User
                        </button>
                    </div>
                </div>
            </div>

            <div className="d-flex">
                <Sidebar
                    theme={theme}
                    isCollapsed={isCollapsed}
                    activeView="users"
                    styles={{
                        sidebar: {
                            width: isCollapsed ? '80px' : '260px',
                            backgroundColor: theme.card,
                            height: '100vh',
                            transition: 'width 0.3s ease',
                            borderRight: `1px solid ${theme.border}`
                        }
                    }}
                />

                <div style={styles.mainArea} className="flex-grow-1">
                    <Header
                        theme={theme}
                        isDarkMode={isDarkMode}
                        toggleDarkMode={toggleDarkMode}
                        toggleSidebar={toggleSidebar}
                    />

                    <div style={styles.contentScroll}>
                        <div className="animate__animated animate__fadeIn">
                            <h4 className="mb-4 fw-bold">User Management</h4>

                            <div className="card shadow-sm border-0" style={styles.card}>
                                <div className="card-body p-4">

                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h5 className="m-0">System Users</h5>

                                        <button
                                            onClick={() => {
                                                setFormData(initialFormState); // Ensure clean state before opening
                                                setShowModal(true);
                                            }}
                                            className="btn btn-primary btn-sm px-3"
                                            style={{ background: 'linear-gradient(to right, #da8cff, #9a55ff)', border: 'none' }}
                                        >
                                            <i className="bi bi-person-plus-fill me-2"></i>
                                            Add User
                                        </button>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle" style={{ color: theme.text }}>
                                            <tbody>
                                                {loading ? (
                                                    <tr><td>Loading...</td></tr>
                                                ) : users.map((user) => (
                                                    <tr key={user.id}>
                                                        <td>{user.name}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.role}</td>
                                                        <td>
                                                            <span style={styles.badge(user.status || 'Active')}>
                                                                {user.status || 'Active'}
                                                            </span>
                                                        </td>
                                                        <td className="text-end">
                                                            <button
                                                                onClick={() => handleDelete(user.id)}
                                                                className="btn btn-link text-danger"
                                                            >
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

                        <div className="mt-auto pt-4">
                            <Footer theme={theme} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Users;