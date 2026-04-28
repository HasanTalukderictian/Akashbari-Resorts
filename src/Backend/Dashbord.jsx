import React, { useState } from 'react';
import Header from './Header'; 
import Sidebar from './Sidebar'; 
import Footer from './Footer'; // এটি যুক্ত করা হয়েছে এরর দূর করতে
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const Dashbord = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    // --- ১. থিম ডাটা ---
    const theme = {
        bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2',
        sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b',
        gridColor: isDarkMode ? '#2d3436' : '#f5f5f5'
    };

    // --- ২. স্টাইল অবজেক্ট ---
    const styles = {
        container: { backgroundColor: theme.bg, minHeight: '100vh', color: theme.text, transition: 'all 0.3s ease' },
        sidebar: { 
            width: isCollapsed ? '70px' : '260px', 
            backgroundColor: theme.card, 
            height: '100vh', 
            position: 'sticky', 
            top: 0, 
            transition: 'width 0.3s ease', 
            overflowY: 'auto', 
            whiteSpace: 'nowrap', 
            borderRight: `1px solid ${theme.border}`,
            zIndex: 1000
        },
        mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        contentScroll: { 
            flexGrow: 1, 
            overflowY: 'auto', 
            backgroundColor: theme.bg, 
            padding: '24px',
            display: 'flex',
            flexDirection: 'column' // ফুটারকে নিচে রাখার জন্য
        },
        navLink: (view) => ({
            color: activeView === view ? '#b66dff' : theme.sidebarText,
            padding: '12px 25px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: activeView === view ? 'bold' : 'normal',
            cursor: 'pointer',
            backgroundColor: activeView === view ? (isDarkMode ? '#1a1a2e' : '#f8f9fa') : 'transparent'
        }),
        statCard: (type) => {
            let gradient = type === 'sales' ? 'linear-gradient(to right, #ffbf96, #fe7096)' :
                type === 'orders' ? 'linear-gradient(to right, #90caf9, #047edf)' :
                    'linear-gradient(to right, #84d9d2, #07cdae)';
            return { background: gradient, border: 'none', borderRadius: '10px', color: 'white' };
        },
        purpleIcon: { backgroundColor: '#b66dff', color: 'white', padding: '8px', borderRadius: '5px', marginRight: '10px' }
    };

    // --- ৩. চার্ট ডাটা ---
    const barData = [
        { name: 'JAN', visits: 4000, sales: 2400 },
        { name: 'FEB', visits: 3000, sales: 1398 },
        { name: 'MAR', visits: 2000, sales: 9800 }
    ];

    const pieData = [
        { name: 'Search', value: 30, color: '#047edf' },
        { name: 'Direct', value: 30, color: '#07cdae' },
        { name: 'Bookmarks', value: 40, color: '#fe7096' }
    ];

    const handleLogout = () => {
    // লগআউট লজিক (উদাহরণস্বরূপ: টোকেন রিমুভ করা এবং লগইন পেজে পাঠানো)
    console.log("Logging out...");
    localStorage.removeItem('token'); // আপনার টোকেনের নাম অনুযায়ী পরিবর্তন করুন
    window.location.href = '/login'; // বা useNavigate ব্যবহার করতে পারেন
};

    // --- ৪. রেন্ডার কন্টেন্ট ফাংশন ---
    const renderContent = () => {
        switch (activeView) {
            case 'ui-elements':
                return <div className="animate__animated animate__fadeIn">UI Elements Content</div>;
            case 'tasks':
                return <div className="animate__animated animate__fadeIn">Tasks Content</div>;
            default:
                return (
                    <div className="animate__animated animate__fadeIn">
                        <div className="row g-4 mb-4">
                            {['sales', 'orders', 'visitors'].map((type) => (
                                <div className="col-md-4" key={type}>
                                    <div className="card p-4 shadow-sm h-100" style={styles.statCard(type)}>
                                        <h5 className="fw-normal text-capitalize">{type}</h5>
                                        <h2 className="my-3">
                                            {type === 'sales' ? '$ 15,000' : type === 'orders' ? '45,633' : '95,574'}
                                        </h2>
                                        <p className="m-0 small">Increased by 5%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* গ্রাফ এরিয়া চাইলে এখানে আপনার আগের কোড থেকে চার্ট বসাতে পারেন */}
                    </div>
                );
        }
    };

    return (
        <div style={styles.container} className="container-fluid p-0">
            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
                {/* সাইডবার */}
                <Sidebar 
                    theme={theme} 
                    isCollapsed={isCollapsed} 
                    activeView={activeView} 
                    setActiveView={setActiveView} 
                    styles={styles} 
                />
                
                <div style={styles.mainArea} className="flex-grow-1">
                    {/* হেডার */}
                  <Header 
        theme={theme} 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
        toggleSidebar={toggleSidebar} 
        onLogout={handleLogout} // <--- এই লাইনটি যোগ করুন
    />
                    {/* মেইন কন্টেন্ট এবং ফুটার */}
                    <div style={styles.contentScroll}>
                        <div className="flex-grow-1">
                            <h4 className="mb-4 text-capitalize d-flex align-items-center">
                                <span style={styles.purpleIcon}>
                                    <i className="bi bi-grid-fill"></i>
                                </span>
                                {activeView.replace('-', ' ')}
                            </h4>
                            {renderContent()}
                        </div>
                        
                        {/* ফুটার */}
                        <Footer theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashbord;