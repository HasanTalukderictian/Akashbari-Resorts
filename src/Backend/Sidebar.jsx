import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ theme, isCollapsed, styles = {} }) => { // styles কে ডিফল্ট খালি অবজেক্ট দিন
    
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'house-door', path: '/dashboard' },
        { id: 'users', label: 'Users', icon: 'people', path: '/users' },
        { id: 'content', label: 'Contents', icon: 'list-check', path: '/content' },
        { id: 'analytics', label: 'Analytics', icon: 'pie-chart', path: '/analytics' },
        { id: 'messages', label: 'Messages', icon: 'envelope', path: '/messages' },
        { id: 'settings', label: 'Settings', icon: 'sliders', path: '/settings' },
        { id: 'profile', label: 'Profile', icon: 'person-badge', path: '/profile' }
    ];

    // ব্যাকআপ স্টাইল যদি styles প্রপস না পাঠানো হয়
    const sidebarBg = {
        width: isCollapsed ? '80px' : '260px',
        backgroundColor: theme?.card || '#fff',
        height: '100vh',
        transition: 'width 0.3s ease',
        borderRight: `1px solid ${theme?.border || '#eee'}`
    };

    return (
        // styles.sidebar না থাকলে sidebarBg ব্যবহার করবে
        <div className="d-none d-md-block shadow-sm" style={styles?.sidebar || sidebarBg}>
            
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
                 style={{ backgroundColor: theme?.isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
                <img src="https://i.pravatar.cc/40?img=12" 
                     className="rounded-circle shadow-sm" 
                     alt="user" 
                     style={{ border: '2px solid #b66dff', padding: '2px' }} />
                {!isCollapsed && (
                    <div className="ms-3 overflow-hidden">
                        <p className="m-0 fw-bold small text-truncate" style={{ color: theme?.text }}>Hasan Talukder</p>
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
                            ...(styles?.navLink || {}), // optional chaining ব্যবহার করা হয়েছে
                            color: isActive ? '#fff' : theme?.sidebarText,
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
        </div>
    );
};

export default Sidebar;