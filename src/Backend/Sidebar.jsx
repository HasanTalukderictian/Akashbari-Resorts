import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaBuilding } from "react-icons/fa";

const Sidebar = ({ theme, isCollapsed, styles = {} }) => {
    // Sub-menu open/close state
    const [isLandingOpen, setIsLandingOpen] = useState(false);
    const [isClubOpen, setIsClubOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'bi bi-speedometer2', path: '/dashboard' },
        { id: 'users', label: 'Users', icon: 'bi bi-people-fill', path: '/users' },
        { id: 'gallery', label: 'Gallery', icon: 'bi bi-images', path: '/admin-gallery' },
        { id: 'query', label: 'Package Query', icon: 'bi bi-images', path: '/package-query' },
        { id: 'project', label: 'Project View', icon: 'bi bi-images', path: '/admin-project-view' },
        { id: 'blog', label: 'Blog Page', icon: 'bi bi-newspaper', path: '/admin-blog' },
        { id: 'notice', label: 'Notice', icon: 'bi bi-megaphone-fill', path: '/admin-notice' },
        { id: 'statistics', label: 'Price statistics', icon: 'bi bi-graph-up', path: '/admin-stat' },
        { id: 'affilites', label: 'Affiliates', icon: 'bi bi-share-fill', path: '/admin-affilites' },
        { id: 'sister', label: 'Sister Concers', icon: 'bi bi-people-fill', path: '/admin-sister' },
        { id: 'events', label: 'Events', icon: 'bi bi-calendar-event', path: '/admin-events' },
        { id: 'teams', label: 'Teams', icon: 'bi bi-people-fill', path: '/admin-team' },
    ];

    // Club এর সাব-মেনু আইটেম
    const clubSubItems = [
        { id: 'club-info', label: 'Club Info', icon: 'bi bi-info-circle', path: '/admin-club' },
        { id: 'club-gallery', label: 'Club Gallery', icon: 'bi bi-images', path: '/admin-club-gallery' },
        { id: 'club-rules', label: 'Club Rules', icon: 'bi bi-file-text-fill', path: '/admin-club-rules' },
        { id: 'club-facilities', label: 'Facilities', icon: 'bi bi-building', path: '/admin-club-facilities' },
        { id: 'club-committee', label: 'Committee', icon: 'bi bi-person-badge', path: '/admin-club-committee' },
        { id: 'club-notice', label: 'Club Notice', icon: 'bi bi-megaphone-fill', path: '/admin-club-notice' },
    ];

    const landingSubItems = [
        { id: 'content', label: 'Contents', icon: 'bi bi-files', path: '/content' },
        { id: 'welcome', label: 'Welcome Section', icon: 'bi bi-emoji-smile', path: '/welcome' },
        { id: 'video', label: 'Video Section', icon: 'bi bi-play-btn', path: '/video' },
        { id: 'owner', label: 'Owner Section', icon: 'bi bi-person-badge', path: '/owner-section' },
        { id: 'benefit', label: 'Owner Benefit', icon: 'bi bi-gem', path: '/owner-benefit' },
        { id: 'investment', label: 'Investment Package', icon: 'bi bi-piggy-bank', path: '/admin-investment' },
        { id: 'investmentbenefit', label: 'Investment Benefit', icon: 'bi bi-bar-chart-steps', path: '/admin-investmentbenefit' },
        { id: 'luxury', label: 'Luxury Section', icon: 'bi bi-diamond', path: '/admin-luxury' },
        { id: 'testo', label: 'Testo Section', icon: 'bi bi-chat-quote', path: '/admin-testo' },
        { id: 'client', label: 'Happy Client', icon: 'bi bi-emoji-laughing', path: '/admin-client' },
        { id: 'achievement', label: 'Achievement', icon: 'bi bi-trophy-fill', path: '/admin-achievement' },
        { id: 'investrecord', label: 'Invest Record', icon: 'bi bi-cash-stack', path: '/admin-investrecord' }
    ];

    // Check if any sub-menu item is active
    const isAnySubItemActive = (subItems) => {
        return subItems.some(subItem => location.pathname === subItem.path);
    };

    // Auto-open submenu if any sub-item is active and sidebar is not collapsed
    
    useEffect(() => {
        if (!isCollapsed) {
            if (isAnySubItemActive(landingSubItems)) {
                setIsLandingOpen(true);
            }
            if (isAnySubItemActive(clubSubItems)) {
                setIsClubOpen(true);
            }
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
        background: isActive ? 'linear-gradient(135deg, #5e2e10 0%, #8B4513 100%)' : 'transparent',
        borderRadius: '8px',
        marginBottom: '5px',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        padding: isCollapsed ? '12px 0' : '12px 20px',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        boxShadow: isActive ? '0 4px 15px rgba(94, 46, 16, 0.3)' : 'none',
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
                        style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #5e2e10 0%, #8B4513 100%)', boxShadow: '0 4px 10px rgba(94, 46, 16, 0.3)' }}>
                        <span className="text-white fw-bold">D</span>
                    </div>
                ) : (
                    <h3 style={{ color: '#5e2e10', fontWeight: '800', letterSpacing: '1px', margin: 0 }}>
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
                    style={{ border: '2px solid #5e2e10', padding: '2px' }} />
                {!isCollapsed && (
                    <div className="ms-3 overflow-hidden">
                        <p className="m-0 fw-bold small text-truncate" style={{ color: theme?.text }}>Welcome</p>
                        <span className="text-muted" style={{ fontSize: '11px' }}>Premium Admin</span>
                    </div>
                )}
            </div>

            {/* Menu Items */}
            <div className="px-2">
                {/* Dashboard & Users */}
                {menuItems.slice(0, 2).map((item) => (
                    <NavLink key={item.id} to={item.path} style={({ isActive }) => navLinkStyle(isActive)}>
                        <i className={`${item.icon} ${isCollapsed ? 'fs-4' : 'fs-5 me-3'}`}></i>
                        {!isCollapsed && <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</span>}
                    </NavLink>
                ))}

                {/* Landing Page Mother Menu */}
                <div className="w-100">
                    <div
                        onClick={() => !isCollapsed && setIsLandingOpen(!isLandingOpen)}
                        style={navLinkStyle(isAnySubItemActive(landingSubItems))}
                    >
                        <i className={`bi bi-browser-safari ${isCollapsed ? 'fs-4' : 'fs-5 me-3'}`}></i>
                        {!isCollapsed && (
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <span style={{ fontSize: '14px', fontWeight: '500' }}>Landing Page</span>
                                <i className={`bi bi-chevron-${isLandingOpen ? 'down' : 'right'}`} style={{ fontSize: '12px' }}></i>
                            </div>
                        )}
                    </div>

                    {/* Landing Page Sub-items */}
                    {!isCollapsed && isLandingOpen && (
                        <div className="ms-3 ps-2 border-start" style={{ borderColor: '#5e2e10 !important' }}>
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
                                >
                                    <i className={`${sub.icon} me-3`}></i>
                                    <span>{sub.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>

                {/* Gallery to Sister (মেনু আইটেম) */}
                {menuItems.slice(2).map((item) => (
                    <NavLink key={item.id} to={item.path} style={({ isActive }) => navLinkStyle(isActive)}>
                        <i className={`${item.icon} ${isCollapsed ? 'fs-4' : 'fs-5 me-3'}`}></i>
                        {!isCollapsed && <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</span>}
                    </NavLink>
                ))}

                {/* Club Mother Menu - নতুন যোগ করা */}
                <div className="w-100 mt-2">
                    <div
                        onClick={() => !isCollapsed && setIsClubOpen(!isClubOpen)}
                        style={navLinkStyle(isAnySubItemActive(clubSubItems))}
                    >
                        <i className={`bi bi-building ${isCollapsed ? 'fs-4' : 'fs-5 me-3'}`}></i>
                        {!isCollapsed && (
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <span style={{ fontSize: '14px', fontWeight: '500' }}>Club</span>
                                <i className={`bi bi-chevron-${isClubOpen ? 'down' : 'right'}`} style={{ fontSize: '12px' }}></i>
                            </div>
                        )}
                    </div>

                    {/* Club Sub-items */}
                    {!isCollapsed && isClubOpen && (
                        <div className="ms-3 ps-2 border-start" style={{ borderColor: '#5e2e10 !important' }}>
                            {clubSubItems.map((sub) => (
                                <NavLink
                                    key={sub.id}
                                    to={sub.path}
                                    style={({ isActive }) => ({
                                        ...navLinkStyle(isActive),
                                        padding: '10px 15px',
                                        marginBottom: '2px',
                                        fontSize: '13px'
                                    })}
                                >
                                    <i className={`${sub.icon} me-3`}></i>
                                    <span>{sub.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>

                {/* Events & Teams (যদি আলাদা রাখতে চান) */}
                <NavLink to="/admin-events" style={({ isActive }) => navLinkStyle(isActive)}>
                    <i className={`bi bi-calendar-event ${isCollapsed ? 'fs-4' : 'fs-5 me-3'}`}></i>
                    {!isCollapsed && <span style={{ fontSize: '14px', fontWeight: '500' }}>Events</span>}
                </NavLink>

                <NavLink to="/admin-team" style={({ isActive }) => navLinkStyle(isActive)}>
                    <i className={`bi bi-people-fill ${isCollapsed ? 'fs-4' : 'fs-5 me-3'}`}></i>
                    {!isCollapsed && <span style={{ fontSize: '14px', fontWeight: '500' }}>Teams</span>}
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;