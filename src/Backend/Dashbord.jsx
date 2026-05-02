import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Users from './Users';
import OwnerSection from './Ownersection';

// Dummy components for illustration if not imported
const Welcome = () => <div className="card p-4 border-0 shadow-sm"><h4>Welcome Section</h4></div>;
const VideoSection = () => <div className="card p-4 border-0 shadow-sm"><h4>Video Section</h4></div>;

const Dashbord = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const theme = {
        isDarkMode: isDarkMode,
        bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2',
        sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b',
        gridColor: isDarkMode ? '#2d3436' : '#f5f5f5'
    };

    const [activeView, setActiveView] = useState('dashboard');

    useEffect(() => {
        const path = location.pathname.replace('/', '');
        if (path) {
            setActiveView(path);
        } else {
            setActiveView('dashboard');
        }
    }, [location]);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const styles = {
        container: { backgroundColor: theme.bg, minHeight: '100vh', color: theme.text, transition: 'all 0.3s ease' },
        sidebar: {
            width: isCollapsed ? '80px' : '260px',
            backgroundColor: theme.card,
            height: '100vh',
            position: 'sticky',
            top: 0,
            transition: 'width 0.3s ease',
            borderRight: `1px solid ${theme.border}`,
            zIndex: 1000,
            overflowX: 'hidden'
        },
        mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        contentScroll: {
            flexGrow: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',          // Flex ব্যবহার করা হয়েছে
            flexDirection: 'column'   // কলাম ডিরেকশন
        },
        purpleIcon: { backgroundColor: '#b66dff', color: 'white', padding: '8px', borderRadius: '5px', marginRight: '10px' },
    };

    const renderContent = () => {
        switch (activeView) {
            case 'users':
                return <Users theme={theme} />;
            case 'welcome':
                return <Welcome />;
            case 'owner':
               return <OwnerSection theme={theme ? theme : {}} />;
            case 'dashboard':
            default:
                return (
                    <div className="animate__animated animate__fadeIn">
                        <div className="row g-4 mb-4">
                            {['sales', 'orders', 'visitors'].map((type) => (
                                <div className="col-md-4" key={type}>
                                    <div className="card p-4 h-100 shadow-sm" style={{
                                        background: type === 'sales' ? 'linear-gradient(to right, #ffbf96, #fe7096)' :
                                            type === 'orders' ? 'linear-gradient(to right, #90caf9, #047edf)' :
                                                'linear-gradient(to right, #84d9d2, #07cdae)',
                                        color: 'white', border: 'none', borderRadius: '12px'
                                    }}>
                                        <h5 className="fw-normal text-capitalize">{type}</h5>
                                        <h2 className="my-3">
                                            {type === 'sales' ? '$ 15,000' : type === 'orders' ? '45,633' : '95,574'}
                                        </h2>
                                        <p className="m-0 small">Increased by 5%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="card p-4 border-0 shadow-sm" style={{ backgroundColor: theme.card, color: theme.text }}>
                            <h5>Welcome Back, Hasan!</h5>
                            <p className="text-muted mb-0">System performance is stable at 98%.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div style={styles.container} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar
                    theme={theme}
                    isCollapsed={isCollapsed}
                    activeView={activeView}
                    styles={styles}
                />

                <div style={styles.mainArea} className="flex-grow-1">
                    <Header
                        theme={theme}
                        isDarkMode={isDarkMode}
                        toggleDarkMode={toggleDarkMode}
                        toggleSidebar={toggleSidebar}
                    />

                    {/* SCROLLABLE AREA */}
                    <div style={styles.contentScroll}>

                        {/* কন্টেন্ট র্যাপার: flex-grow-1 ফুটারকে নিচে ঠেলে দেবে */}
                        <div className="flex-grow-1">
                            <h4 className="mb-4 text-capitalize d-flex align-items-center fw-bold">
                                <span style={styles.purpleIcon}>
                                    <i className="bi bi-grid-fill"></i>
                                </span>
                                {activeView.replace('-', ' ')}
                            </h4>
                            {renderContent()}
                        </div>

                        {/* স্টিকি ফুটার */}
                        <div className="mt-4">
                            <Footer theme={theme} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashbord;