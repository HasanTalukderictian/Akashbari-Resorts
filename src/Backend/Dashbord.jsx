// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import Footer from './Footer';
// import Users from './Users';
// import OwnerSection from './Ownersection';
// import OwnerBenefit from './OwnerBenefit';
// import Investment from './Investment';

// // Dummy components for illustration if not imported
// const Welcome = () => <div className="card p-4 border-0 shadow-sm"><h4>Welcome Section</h4></div>;
// const VideoSection = () => <div className="card p-4 border-0 shadow-sm"><h4>Video Section</h4></div>;

// const Dashbord = () => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(false);
//     const location = useLocation();
//     const navigate = useNavigate();

//     const theme = {
//         isDarkMode: isDarkMode,
//         bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
//         card: isDarkMode ? '#16213e' : '#ffffff',
//         text: isDarkMode ? '#e9ecef' : '#3e4b5b',
//         border: isDarkMode ? '#2d3436' : '#ebedf2',
//         sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b',
//         gridColor: isDarkMode ? '#2d3436' : '#f5f5f5'
//     };

//     const [activeView, setActiveView] = useState('dashboard');

//     useEffect(() => {
//         const path = location.pathname.replace('/', '');
//         if (path) {
//             setActiveView(path);
//         } else {
//             setActiveView('dashboard');
//         }
//     }, [location]);

//     const toggleSidebar = () => setIsCollapsed(!isCollapsed);
//     const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

//     const styles = {
//         container: { backgroundColor: theme.bg, minHeight: '100vh', color: theme.text, transition: 'all 0.3s ease' },
//         sidebar: {
//             width: isCollapsed ? '80px' : '260px',
//             backgroundColor: theme.card,
//             height: '100vh',
//             position: 'sticky',
//             top: 0,
//             transition: 'width 0.3s ease',
//             borderRight: `1px solid ${theme.border}`,
//             zIndex: 1000,
//             overflowX: 'hidden'
//         },
//         mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
//         contentScroll: {
//             flexGrow: 1,
//             overflowY: 'auto',
//             padding: '24px',
//             display: 'flex',          // Flex ব্যবহার করা হয়েছে
//             flexDirection: 'column'   // কলাম ডিরেকশন
//         },
//         purpleIcon: { backgroundColor: '#b66dff', color: 'white', padding: '8px', borderRadius: '5px', marginRight: '10px' },
//     };

//     const renderContent = () => {
//         switch (activeView) {
//             case 'users':
//                 return <Users theme={theme} />;
//             case 'welcome':
//                 return <Welcome />;
//             case 'owner':
//                return <OwnerSection theme={theme ? theme : {}} />;
//                case 'benefit':
//                return <OwnerBenefit theme={theme ? theme : {}} />;
//                case 'investment':
//                return <Investment theme={theme ? theme : {}} />;
//             case 'dashboard':
//             default:
//                 return (
//                     <div className="animate__animated animate__fadeIn">
//                         <div className="row g-4 mb-4">
//                             {['sales', 'orders', 'visitors'].map((type) => (
//                                 <div className="col-md-4" key={type}>
//                                     <div className="card p-4 h-100 shadow-sm" style={{
//                                         background: type === 'sales' ? 'linear-gradient(to right, #ffbf96, #fe7096)' :
//                                             type === 'orders' ? 'linear-gradient(to right, #90caf9, #047edf)' :
//                                                 'linear-gradient(to right, #84d9d2, #07cdae)',
//                                         color: 'white', border: 'none', borderRadius: '12px'
//                                     }}>
//                                         <h5 className="fw-normal text-capitalize">{type}</h5>
//                                         <h2 className="my-3">
//                                             {type === 'sales' ? '$ 15,000' : type === 'orders' ? '45,633' : '95,574'}
//                                         </h2>
//                                         <p className="m-0 small">Increased by 5%</p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="card p-4 border-0 shadow-sm" style={{ backgroundColor: theme.card, color: theme.text }}>
//                             <h5>Welcome Back, Hasan!</h5>
//                             <p className="text-muted mb-0">System performance is stable at 98%.</p>
//                         </div>
//                     </div>
//                 );
//         }
//     };

//     return (
//         <div style={styles.container} className="container-fluid p-0">
//             <div className="d-flex">
//                 <Sidebar
//                     theme={theme}
//                     isCollapsed={isCollapsed}
//                     activeView={activeView}
//                     styles={styles}
//                 />

//                 <div style={styles.mainArea} className="flex-grow-1">
//                     <Header
//                         theme={theme}
//                         isDarkMode={isDarkMode}
//                         toggleDarkMode={toggleDarkMode}
//                         toggleSidebar={toggleSidebar}
//                     />

//                     {/* SCROLLABLE AREA */}
//                     <div style={styles.contentScroll}>

//                         {/* কন্টেন্ট র্যাপার: flex-grow-1 ফুটারকে নিচে ঠেলে দেবে */}
//                         <div className="flex-grow-1">
//                             <h4 className="mb-4 text-capitalize d-flex align-items-center fw-bold">
//                                 <span style={styles.purpleIcon}>
//                                     <i className="bi bi-grid-fill"></i>
//                                 </span>
//                                 {activeView.replace('-', ' ')}
//                             </h4>
//                             {renderContent()}
//                         </div>

//                         {/* স্টিকি ফুটার */}
//                         <div className="mt-4">
//                             <Footer theme={theme} />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Dashbord;





import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Add this import
import Header from './Header';
import Sidebar from './Sidebar'; 
import Footer from './Footer';
import Users from './Users';
import BlogSection from './BlogSection';
import Investment from './Investment';
import InvestmentBenefit from './InvestmentBenefit';
import LuxurySection from './LuxurySection';
import Testominal from './Testominal';
import Events from './Events';
import GallerySection from './GallerySection';
import NoticeSection from './NoticeSection';
import OwnerBenefit from './OwnerBenefit';
import OwnerSection from './Ownersection';

const API_BASE_URL = 'http://localhost:8000/api';

const Dashbord = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [dashboardStats, setDashboardStats] = useState({
        totalUsers: 0,
        totalEvents: 0,
        totalGallery: 0,
        totalBlogs: 0,
        totalTestimonials: 0,
        totalNotices: 0,
        totalLuxuryItems: 0,
        totalInvestmentBenifit: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const theme = {
        isDarkMode: isDarkMode,
        bg: isDarkMode ? '#0f0f1a' : '#f8f9fc',
        card: isDarkMode ? '#1a1a2e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#2c3e50',
        textLight: isDarkMode ? '#a0a0a0' : '#6c757d',
        border: isDarkMode ? '#2d2d3d' : '#e9ecef',
        sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b',
        gridColor: isDarkMode ? '#2d3436' : '#f5f5f5',
        primary: '#9a55ff',
        primaryGradient: 'linear-gradient(135deg, #9a55ff 0%, #c084fc 100%)',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6'
    };

    const [activeView, setActiveView] = useState('dashboard');

    // Fetch dashboard statistics
    const fetchDashboardStats = async () => {
        setLoading(true);
        try {
            // Fetch all counts from different endpoints
            const [
                usersRes,
                eventsRes,
                galleryRes,
                blogsRes,
                testimonialsRes,
                noticesRes,
                luxuryRes,
                investmentBenefitRes
            ] = await Promise.all([
                axios.get(`${API_BASE_URL}/users`).catch(() => ({ data: { data: { total: 0 } } })),
                axios.get(`${API_BASE_URL}/events/all`).catch(() => ({ data: { data: { total: 0 } } })),
                axios.get(`${API_BASE_URL}/gallery`).catch(() => ({ data: { length: 0 } })),
                axios.get(`${API_BASE_URL}/blogs`).catch(() => ({ data: { data: { total: 0 } } })),
                axios.get(`${API_BASE_URL}/get-testimonials`).catch(() => ({ data: { data: { total: 0 } } })),
                axios.get(`${API_BASE_URL}/notices`).catch(() => ({ data: { data: { total: 0 } } })),
                axios.get(`${API_BASE_URL}/luxury-items`).catch(() => ({ data: { data: { total: 0 } } })),
                axios.get(`${API_BASE_URL}/get-investment-benefits`).catch(() => ({ data: { data: { total: 0 } } }))
            ]);

            setDashboardStats({
                totalUsers: usersRes.data?.data?.total || usersRes.data?.data?.length || 0,
                totalEvents: eventsRes.data?.data?.total || eventsRes.data?.data?.length || 0,
                totalGallery: galleryRes.data?.length || 0,
                totalBlogs: blogsRes.data?.data?.total || blogsRes.data?.data?.length || 0,
                totalTestimonials: testimonialsRes.data?.data?.total || testimonialsRes.data?.data?.length || 0,
                totalNotices: noticesRes.data?.data?.total || noticesRes.data?.data?.length || 0,
                totalLuxuryItems: luxuryRes.data?.data?.total || luxuryRes.data?.data?.length || 0,
                totalInvestmentBenifit: investmentBenefitRes.data?.data?.total || investmentBenefitRes.data?.data?.length || 0
            });

            // Set recent activities
            setRecentActivities([
                { id: 1, action: 'New user registered', time: '2 minutes ago', icon: '👤', color: '#10b981' },
                { id: 2, action: 'New blog post published', time: '1 hour ago', icon: '📝', color: '#3b82f6' },
                { id: 3, action: 'New gallery image added', time: '3 hours ago', icon: '🖼️', color: '#9a55ff' },
                { id: 4, action: 'New testimonial received', time: '5 hours ago', icon: '⭐', color: '#f59e0b' },
                { id: 5, action: 'Event booking completed', time: '1 day ago', icon: '📅', color: '#ef4444' }
            ]);

        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
        const interval = setInterval(fetchDashboardStats, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

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
            display: 'flex',
            flexDirection: 'column'
        },
        purpleIcon: { backgroundColor: '#b66dff', color: 'white', padding: '8px', borderRadius: '8px', marginRight: '10px' },
        statCard: {
            backgroundColor: theme.card,
            borderRadius: '16px',
            padding: '20px',
            border: `1px solid ${theme.border}`,
            transition: 'all 0.3s ease',
            cursor: 'pointer'
        },
        statIcon: { fontSize: '32px', marginBottom: '12px' },
        statValue: { fontSize: '28px', fontWeight: '700', marginBottom: '4px' },
        statLabel: { fontSize: '13px', color: theme.textLight },
        activityItem: {
            display: 'flex',
            alignItems: 'center',
            padding: '12px',
            borderBottom: `1px solid ${theme.border}`,
            transition: 'all 0.3s ease'
        }
    };

    const statCards = [
        { key: 'totalUsers', label: 'Total Users', icon: '👥', color: '#3b82f6', bg: 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)' },
        { key: 'totalEvents', label: 'Total Events', icon: '📅', color: '#10b981', bg: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)' },
        { key: 'totalGallery', label: 'Gallery Images', icon: '🖼️', color: '#9a55ff', bg: 'linear-gradient(135deg, #9a55ff 0%, #581c87 100%)' },
        { key: 'totalBlogs', label: 'Blog Posts', icon: '📝', color: '#f59e0b', bg: 'linear-gradient(135deg, #f59e0b 0%, #78350f 100%)' },
        { key: 'totalTestimonials', label: 'Testimonials', icon: '⭐', color: '#ef4444', bg: 'linear-gradient(135deg, #ef4444 0%, #7f1d1d 100%)' },
        { key: 'totalNotices', label: 'Notices', icon: '📢', color: '#06b6d4', bg: 'linear-gradient(135deg, #06b6d4 0%, #164e63 100%)' },
        { key: 'totalLuxuryItems', label: 'Luxury Items', icon: '💎', color: '#ec4899', bg: 'linear-gradient(135deg, #ec4899 0%, #831843 100%)' },
        { key: 'totalInvestmentBenifit', label: 'Investment Benefits', icon: '💰', color: '#14b8a6', bg: 'linear-gradient(135deg, #14b8a6 0%, #134e4a 100%)' }
    ];

    const renderContent = () => {
        switch (activeView) {
            case 'users':
                return <Users theme={theme} />;
            case 'owner':
                return <OwnerSection theme={theme} />;
            case 'benefit':
                return <OwnerBenefit theme={theme} />;
            case 'investment':
                return <Investment theme={theme} />;
            case 'notices':
                return <NoticeSection theme={theme} />;
            case 'gallery':
                return <GallerySection theme={theme} />;
            case 'events':
                return <Events theme={theme} />;
            case 'testimonials':
                return <Testominal theme={theme} />;
            case 'luxury':
                return <LuxurySection theme={theme} />;
            case 'investment-benefits':
                return <InvestmentBenefit theme={theme} />;
            case 'blogs':
                return <BlogSection theme={theme} />;
            case 'dashboard':
            default:
                return (
                    <div className="animate__animated animate__fadeIn">
                        {/* Welcome Section */}
                        <div className="mb-4 p-4 rounded-4" style={{
                            background: theme.primaryGradient,
                            color: 'white'
                        }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h2 className="mb-2">Welcome to Akashbari Resort Dashboard</h2>
                                    <p className="mb-0 opacity-75">Manage your resort's content, users, and analytics all in one place</p>
                                </div>
                                <div style={{ fontSize: '48px' }}>
                                    🏠
                                </div>
                            </div>
                        </div>

                        {/* Statistics Grid */}
                        <div className="row g-4 mb-4">
                            {statCards.map((stat) => (
                                <div className="col-xl-3 col-lg-4 col-md-6" key={stat.key}>
                                    <div 
                                        className="stat-card"
                                        style={styles.statCard}
                                        onClick={() => {
                                            if (stat.key === 'totalUsers') setActiveView('users');
                                            else if (stat.key === 'totalEvents') setActiveView('events');
                                            else if (stat.key === 'totalGallery') setActiveView('gallery');
                                            else if (stat.key === 'totalBlogs') setActiveView('blogs');
                                            else if (stat.key === 'totalTestimonials') setActiveView('testimonials');
                                            else if (stat.key === 'totalNotices') setActiveView('notices');
                                            else if (stat.key === 'totalLuxuryItems') setActiveView('luxury');
                                            else if (stat.key === 'totalInvestmentBenifit') setActiveView('investment-benefits');
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <div style={styles.statValue}>
                                                    {loading ? '...' : dashboardStats[stat.key]}
                                                </div>
                                                <div style={styles.statLabel}>{stat.label}</div>
                                            </div>
                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '12px',
                                                background: stat.bg,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '24px'
                                            }}>
                                                {stat.icon}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="row g-4">
                            {/* Recent Activities */}
                            <div className="col-lg-6">
                                <div className="card border-0 shadow-sm rounded-4" style={{ backgroundColor: theme.card }}>
                                    <div className="card-header bg-transparent border-0 pt-4 px-4">
                                        <h5 className="fw-bold mb-0">Recent Activities</h5>
                                    </div>
                                    <div className="card-body p-0">
                                        {recentActivities.map((activity) => (
                                            <div key={activity.id} style={styles.activityItem}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '10px',
                                                    background: `${activity.color}20`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: '12px'
                                                }}>
                                                    <span style={{ fontSize: '20px' }}>{activity.icon}</span>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="fw-semibold">{activity.action}</div>
                                                    <div style={{ fontSize: '12px', color: theme.textLight }}>{activity.time}</div>
                                                </div>
                                                <div style={{ fontSize: '12px', color: activity.color }}>●</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="col-lg-6">
                                <div className="card border-0 shadow-sm rounded-4" style={{ backgroundColor: theme.card }}>
                                    <div className="card-header bg-transparent border-0 pt-4 px-4">
                                        <h5 className="fw-bold mb-0">Quick Actions</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="row g-3">
                                            {[
                                                { name: 'Add New Blog', icon: '📝', path: 'blogs', color: '#3b82f6' },
                                                { name: 'Upload Gallery Image', icon: '🖼️', path: 'gallery', color: '#9a55ff' },
                                                { name: 'Create Event', icon: '📅', path: 'events', color: '#10b981' },
                                                { name: 'Add Testimonial', icon: '⭐', path: 'testimonials', color: '#f59e0b' },
                                                { name: 'Post Notice', icon: '📢', path: 'notices', color: '#ef4444' },
                                                { name: 'Add Luxury Item', icon: '💎', path: 'luxury', color: '#ec4899' }
                                            ].map((action) => (
                                                <div className="col-md-6" key={action.name}>
                                                    <button
                                                        className="btn w-100 py-3 rounded-3"
                                                        style={{
                                                            backgroundColor: `${action.color}10`,
                                                            color: action.color,
                                                            border: `1px solid ${action.color}30`,
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        onClick={() => setActiveView(action.path)}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = action.color;
                                                            e.currentTarget.style.color = 'white';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = `${action.color}10`;
                                                            e.currentTarget.style.color = action.color;
                                                        }}
                                                    >
                                                        <span style={{ fontSize: '20px', marginRight: '8px' }}>{action.icon}</span>
                                                        {action.name}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div style={styles.container} className="container-fluid p-0">
            <style>
                {`
                    .stat-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 8px 25px rgba(154, 85, 255, 0.15);
                    }
                    .activity-item:hover {
                        background: ${theme.bg};
                        transform: translateX(5px);
                    }
                `}
            </style>
            <div className="d-flex">
                <Sidebar
                    theme={theme}
                    isCollapsed={isCollapsed}
                    activeView={activeView}
                    setActiveView={setActiveView}
                    styles={styles}
                />

                <div style={styles.mainArea} className="flex-grow-1">
                    <Header
                        theme={theme}
                        isDarkMode={isDarkMode}
                        toggleDarkMode={toggleDarkMode}
                        toggleSidebar={toggleSidebar}
                    />

                    <div style={styles.contentScroll}>
                        <div className="flex-grow-1">
                            <h4 className="mb-4 text-capitalize d-flex align-items-center fw-bold">
                                <span style={styles.purpleIcon}>
                                    <i className="bi bi-grid-fill"></i>
                                </span>
                                {activeView === 'dashboard' ? 'Dashboard Overview' : activeView.replace('-', ' ')}
                            </h4>
                            {renderContent()}
                        </div>

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