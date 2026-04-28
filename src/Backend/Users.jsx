import React, { useState } from 'react';
import Header from './Header'; 
import Sidebar from './Sidebar'; 
import Footer from './Footer';

const Users = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    // মোডাল এবং ফর্ম স্টেট
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'User' });

    // ১. থিম লজিক
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

    const users = [
        { id: 1, name: 'Hasan Talukder', email: 'hasan@akashbari.com', role: 'Developer', status: 'Active' },
        { id: 2, name: 'David Grey', email: 'david@gmail.com', role: 'Manager', status: 'Pending' },
        { id: 3, name: 'Stella Johnson', email: 'stella@live.com', role: 'Editor', status: 'Inactive' },
        { id: 4, name: 'Marina John', email: 'marina@yahoo.com', role: 'User', status: 'Active' }
    ];

    // ২. স্টাইলস
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
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', display: showModal ? 'flex' : 'none',
            justifyContent: 'center', alignItems: 'center', zIndex: 9999,
            backdropFilter: 'blur(5px)'
        },
        modalBox: {
            backgroundColor: theme.card, color: theme.text,
            width: '400px', padding: '25px', borderRadius: '15px',
            border: `1px solid ${theme.border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        },
        input: {
            width: '100%', padding: '10px', marginBottom: '15px',
            borderRadius: '8px', border: `1px solid ${theme.border}`,
            backgroundColor: theme.isDarkMode ? '#1a1a2e' : '#fff', color: theme.text, outline: 'none'
        },
        badge: (status) => ({
            fontSize: '11px', padding: '4px 10px', borderRadius: '20px',
            background: status === 'Active' ? 'rgba(7, 205, 174, 0.1)' : 
                       status === 'Pending' ? 'rgba(254, 112, 150, 0.1)' : 'rgba(156, 163, 175, 0.1)',
            color: status === 'Active' ? '#07cdae' : 
                   status === 'Pending' ? '#fe7096' : '#9ca3af',
            fontWeight: '600'
        })
    };

    return (
        <div style={styles.container} className="container-fluid p-0">
            
            {/* --- ADD NEW USER MODAL --- */}
            <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                <div style={styles.modalBox} onClick={e => e.stopPropagation()} className="animate__animated animate__zoomIn animate__faster">
                    <h5 className="fw-bold mb-4">Add New User</h5>
                    
                    <label className="small mb-1">Full Name</label>
                    <input style={styles.input} type="text" placeholder="Enter Name" onChange={e => setFormData({...formData, name: e.target.value})} />
                    
                    <label className="small mb-1">Email Address</label>
                    <input style={styles.input} type="email" placeholder="Enter Email" onChange={e => setFormData({...formData, email: e.target.value})} />
                    
                    <label className="small mb-1">Role</label>
                    <select style={styles.input} onChange={e => setFormData({...formData, role: e.target.value})}>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>

                    <div className="d-flex gap-2 mt-2">
                        <button className="btn btn-light flex-grow-1" onClick={() => setShowModal(false)}>Cancel</button>
                        <button className="btn btn-primary flex-grow-1" style={{ background: 'linear-gradient(to right, #da8cff, #9a55ff)', border: 'none' }}>Save User</button>
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
                                        {/* মোডাল ওপেন বাটন */}
                                        <button 
                                            onClick={() => setShowModal(true)}
                                            className="btn btn-primary btn-sm px-3" 
                                            style={{ background: 'linear-gradient(to right, #da8cff, #9a55ff)', border: 'none' }}
                                        >
                                            <i className="bi bi-person-plus-fill me-2"></i>Add User
                                        </button>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle" style={{ color: theme.text }}>
                                            <thead style={{ backgroundColor: theme.isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
                                                <tr>
                                                    <th className="py-3 border-0 ps-3">User info</th>
                                                    <th className="py-3 border-0">Email</th>
                                                    <th className="py-3 border-0">Role</th>
                                                    <th className="py-3 border-0">Status</th>
                                                    <th className="py-3 border-0 text-end pe-3">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map((user) => (
                                                    <tr key={user.id} style={{ borderColor: theme.border }}>
                                                        <td className="py-3 ps-3">
                                                            <div className="d-flex align-items-center">
                                                                <img src={`https://i.pravatar.cc/150?u=${user.id}`} alt="profile" 
                                                                     className="rounded-circle me-3" width="35" height="35" />
                                                                <span className="fw-medium">{user.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 opacity-75">{user.email}</td>
                                                        <td className="py-3">
                                                            <span className="badge border text-muted fw-normal">{user.role}</span>
                                                        </td>
                                                        <td className="py-3">
                                                            <span style={styles.badge(user.status)}>{user.status}</span>
                                                        </td>
                                                        <td className="py-3 text-end pe-3">
                                                            <button className="btn btn-link p-0 me-2 text-primary"><i className="bi bi-pencil-square"></i></button>
                                                            <button className="btn btn-link p-0 text-danger"><i className="bi bi-trash3"></i></button>
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