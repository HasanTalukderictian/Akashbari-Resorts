import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ theme, isCollapsed, styles }) => {
    
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'house-door', path: '/dashboard' },
        { id: 'users', label: 'Users', icon: 'people', path: '/users' },
        { id: 'tasks', label: 'Tasks', icon: 'list-check', path: '/tasks' },
        { id: 'analytics', label: 'Analytics', icon: 'pie-chart', path: '/analytics' },
        { id: 'messages', label: 'Messages', icon: 'envelope', path: '/messages' },
        { id: 'settings', label: 'Settings', icon: 'sliders', path: '/settings' },
        { id: 'profile', label: 'Profile', icon: 'person-badge', path: '/profile' }
    ];

    return (
        <div className="d-none d-md-block shadow-sm" style={styles.sidebar}>
            {/* --- লোগো সেকশন --- */}
            <div className="p-4 mb-2 text-center">
                {isCollapsed ? (
                    <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto" 
                         style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #da8cff 0%, #9a55ff 100%)', boxShadow: '0 4px 10px rgba(182, 109, 255, 0.3)' }}>
                        <span className="text-white fw-bold">D</span>
                    </div>
                ) : (
                    <h3 style={{ color: '#b66dff', fontWeight: '800', letterSpacing: '1px', margin: 0 }}>
                        DASHBOARD
                    </h3>
                )}
            </div>

            {/* --- ইউজার কার্ড --- */}
            <div className="mx-3 mb-4 p-2 d-flex align-items-center rounded-3" 
                 style={{ backgroundColor: theme.isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
                <img src="https://i.pravatar.cc/40?img=12" 
                     className="rounded-circle shadow-sm" 
                     alt="user" 
                     style={{ border: '2px solid #b66dff', padding: '2px' }} />
                {!isCollapsed && (
                    <div className="ms-3 overflow-hidden">
                        <p className="m-0 fw-bold small text-truncate" style={{ color: theme.text }}>Hasan Talukder</p>
                        <span className="text-muted" style={{ fontSize: '11px' }}>Premium Admin</span>
                    </div>
                )}
            </div>

            {/* --- মেনু আইটেমসমূহ --- */}
            <div className="px-2">
                {menuItems.map((item) => (
                    <NavLink 
                        key={item.id} 
                        to={item.path}
                        className="nav-link-custom"
                        style={({ isActive }) => ({
                            ...styles.navLink,
                            color: isActive ? '#fff' : theme.sidebarText,
                            background: isActive ? 'linear-gradient(to right, #da8cff, #9a55ff)' : 'transparent',
                            borderRadius: '8px',
                            marginBottom: '5px',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            padding: isCollapsed ? '12px 0' : '12px 20px',
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                            boxShadow: isActive ? '0 4px 15px rgba(154, 85, 255, 0.3)' : 'none',
                            transition: 'all 0.3s ease'
                        })}
                    >
                        <i className={`bi bi-${item.icon} ${isCollapsed ? 'fs-4' : 'fs-5 me-3'}`}></i> 
                        {!isCollapsed && <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</span>}
                    </NavLink>
                ))}
            </div>

            {/* --- প্রমো কার্ড (শুধুমাত্র বড় থাকলে দেখাবে) --- */}
            
            {/* {!isCollapsed && (
                <div className="mt-5 mx-3 p-3 rounded-4 text-white text-center" 
                     style={{ background: 'linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b)', fontSize: '12px' }}>
                    <p className="m-0">Need Help?</p>
                    <button className="btn btn-sm btn-light mt-2 py-1 px-3 fw-bold" style={{ fontSize: '10px', borderRadius: '20px' }}>Contact Support</button>
                </div>
            )} */}

        </div>
    );
};

export default Sidebar;