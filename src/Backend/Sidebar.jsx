import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = ({ theme, isCollapsed, styles = {} }) => {
    // Sub-menu open/close state
    const [isLandingOpen, setIsLandingOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'house-door', path: '/dashboard' },
        { id: 'users', label: 'Users', icon: 'people', path: '/users' },
        // Landing Page section defined separately below for sub-menu logic
        { id: 'settings', label: 'Settings', icon: 'sliders', path: '/settings' },
        { id: 'profile', label: 'Profile', icon: 'person-badge', path: '/profile' }
    ];

    const landingSubItems = [
        { id: 'content', label: 'Contents', icon: 'bi bi-files', path: '/content' },
        { id: 'welcome', label: 'Welcome Section', icon: 'bi bi-emoji-smile', path: '/welcome' },
        { id: 'video', label: 'Video Section', icon: 'bi bi-play-btn', path: '/video' },
        { id: 'owner', label: 'Owner Section', icon: 'bi bi-people', path: '/owner-section' },
        { id: 'benefit', label: 'Owner Benefit', icon: 'bi bi-star', path: '/owner-benefit' },
        { id: 'investment', label: 'Investment Package', icon: 'bi bi-coin', path: '/admin-investment' },
        { id: 'investmentbenefit', label: 'Investment Benefit', icon: 'bi bi-bar-chart-steps', path: '/admin-investmentbenefit' },
        { id: 'events', label: 'Events', icon: 'bi bi-calendar2-week', path: '/admin-events' },
        { id: 'luxury', label: 'Luxury Section', icon: 'bi bi-diamond', path: '/admin-luxury' },
          { id: 'testo', label: 'Testo Section', icon: 'bi bi-diamond', path: '/admin-testo' },
    ];

    // Check if any sub-menu item is active
    const isAnySubItemActive = () => {
        return landingSubItems.some(subItem => location.pathname === subItem.path);
    };

    // Auto-open submenu if any sub-item is active and sidebar is not collapsed
    useEffect(() => {
        if (!isCollapsed && isAnySubItemActive()) {
            setIsLandingOpen(true);
        }
    }, [location.pathname, isCollapsed]);

    const sidebarBg = {
        width: isCollapsed ? '80px' : '260px',
        backgroundColor: theme?.card || '#fff',
        height: '100vh',
        transition: 'width 0.3s ease',
        borderRight: `1px solid ${theme?.border || '#eee'}`,
        overflowY: 'auto',
        overflowX: 'hidden'
    };

    const navLinkStyle = (isActive) => ({
        ...(styles?.navLink || {}),
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
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        border: 'none',
        width: '100%'
    });

    return (
        <div className="d-none d-md-block shadow-sm" style={styles?.sidebar || sidebarBg}>
            
            {/* Logo Section */}
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

            {/* User Card */}
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

            {/* Menu Items */}
            <div className="px-2">
                {/* Dashboard & Users */}
                {menuItems.slice(0, 2).map((item) => (
                    <NavLink key={item.id} to={item.path} style={({ isActive }) => navLinkStyle(isActive)}>
                        <i className={`bi bi-${item.icon} ${isCollapsed ? 'fs-4' : 'fs-5 me-3'}`}></i> 
                        {!isCollapsed && <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</span>}
                    </NavLink>
                ))}

                {/* Landing Page Mother Menu */}
                <div className="w-100">
                    <div 
                        onClick={() => !isCollapsed && setIsLandingOpen(!isLandingOpen)}
                        style={navLinkStyle(isAnySubItemActive())}
                    >
                        <i className={`bi bi-browser-safari ${isCollapsed ? 'fs-4' : 'fs-5 me-3'}`}></i>
                        {!isCollapsed && (
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <span style={{ fontSize: '14px', fontWeight: '500' }}>Landing Page</span>
                                <i className={`bi bi-chevron-${isLandingOpen ? 'down' : 'right'}`} style={{ fontSize: '12px' }}></i>
                            </div>
                        )}
                    </div>

                    {/* Sub-items rendering - Keep submenu open when collapsed changes */}
                    {!isCollapsed && isLandingOpen && (
                        <div className="ms-3 ps-2 border-start" style={{ borderColor: '#b66dff !important' }}>
                            {landingSubItems.map((sub) => (
                                <NavLink 
                                    key={sub.id} 
                                    to={sub.path} 
                                    style={({ isActive }) => ({
                                        ...navLinkStyle(isActive),
                                        padding: '10px 15px',
                                        marginBottom: '2px',
                                        fontSize: '13px'
                                    })}
                                    onClick={() => {
                                        // Keep submenu open when clicking sub-items
                                        // No need to close it
                                    }}
                                >
                                    <i className={`${sub.icon} me-3`}></i>
                                    <span>{sub.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>

                {/* Settings & Profile */}
                {menuItems.slice(2).map((item) => (
                    <NavLink key={item.id} to={item.path} style={({ isActive }) => navLinkStyle(isActive)}>
                        <i className={`bi bi-${item.icon} ${isCollapsed ? 'fs-4' : 'fs-5 me-3'}`}></i> 
                        {!isCollapsed && <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</span>}
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;