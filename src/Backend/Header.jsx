import React from 'react';

const Header = ({ theme, isDarkMode, toggleDarkMode, toggleSidebar, onLogout }) => {
    return (
        <nav className="navbar shadow-sm px-2 py-2" style={{ backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}`, height: '70px', flexShrink: 0 }}>
            <div className="d-flex align-items-center w-100 px-4">
                <i className="bi bi-list fs-4 me-4" style={{ cursor: 'pointer', color: theme.text }} onClick={toggleSidebar}></i>
                <div className="ms-auto d-flex align-items-center gap-4">
                    <div onClick={toggleDarkMode} style={{ cursor: 'pointer', fontSize: '1.2rem', color: isDarkMode ? '#f1c40f' : '#2c3e50' }}>
                        <i className={`bi bi-${isDarkMode ? 'sun-fill' : 'moon-stars-fill'}`}></i>
                    </div>
                    <div className="position-relative" style={{ cursor: 'pointer', color: theme.text }}>
                        <i className="bi bi-bell fs-5"></i>
                        <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{ fontSize: '5px' }}></span>
                    </div>
                    <img src="https://i.pravatar.cc/35?img=12" className="rounded-circle border" alt="user" style={{ borderColor: '#b66dff' }} />
                    
                    {/* Logout Icon with onLogout function */}
                    <i 
                        className="bi bi-power fs-5 ms-2" 
                        style={{ color: '#ff4757', cursor: 'pointer' }} 
                        onClick={onLogout}
                    ></i>
                </div>
            </div>
        </nav>
    );
};

export default Header;