import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
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

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

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
    const [authError, setAuthError] = useState(null);
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
        primary: '#5e2e10',
        primaryGradient: 'linear-gradient(135deg, #5e2e10 0%, #8B4513 100%)',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6'
    };

    const [activeView, setActiveView] = useState('dashboard');

    // Get authentication headers
    const getAuthHeaders = useCallback(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('Role') || 'admin';
        
        return {
            'Authorization': `Bearer ${token}`,
            'Role': role,
            'Content-Type': 'application/json'
        };
    }, []);

    // Check if user is authenticated
    const checkAuth = useCallback(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setAuthError("Please login to access dashboard");
            setTimeout(() => navigate('/login'), 2000);
            return false;
        }
        return true;
    }, [navigate]);

    // Handle API errors
    const handleApiError = useCallback((error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('Role');
            setAuthError("Session expired. Please login again.");
            setTimeout(() => navigate('/login'), 2000);
            return true;
        }
        return false;
    }, [navigate]);

    // Fetch dashboard statistics with authentication
    const fetchDashboardStats = async () => {
        if (!checkAuth()) return;
        
        setLoading(true);
        setAuthError(null);
        
        try {
            const headers = getAuthHeaders();
            
            // Fetch all counts from different endpoints with auth headers
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
                axios.get(`${API_BASE_URL}/users`, { headers }).catch((err) => {
                    if (err.response?.status === 401) handleApiError(err);
                    return { data: { data: { total: 0 } } };
                }),
                axios.get(`${API_BASE_URL}/events/all`, { headers }).catch((err) => {
                    if (err.response?.status === 401) handleApiError(err);
                    return { data: { data: { total: 0 } } };
                }),
                axios.get(`${API_BASE_URL}/gallery`, { headers }).catch((err) => {
                    if (err.response?.status === 401) handleApiError(err);
                    return { data: { length: 0 } };
                }),
                axios.get(`${API_BASE_URL}/blogs`, { headers }).catch((err) => {
                    if (err.response?.status === 401) handleApiError(err);
                    return { data: { data: { total: 0 } } };
                }),
                axios.get(`${API_BASE_URL}/get-testimonials`, { headers }).catch((err) => {
                    if (err.response?.status === 401) handleApiError(err);
                    return { data: { data: { total: 0 } } };
                }),
                axios.get(`${API_BASE_URL}/notices`, { headers }).catch((err) => {
                    if (err.response?.status === 401) handleApiError(err);
                    return { data: { data: { total: 0 } } };
                }),
                axios.get(`${API_BASE_URL}/luxury-items`, { headers }).catch((err) => {
                    if (err.response?.status === 401) handleApiError(err);
                    return { data: { data: { total: 0 } } };
                }),
                axios.get(`${API_BASE_URL}/get-investment-benefits`, { headers }).catch((err) => {
                    if (err.response?.status === 401) handleApiError(err);
                    return { data: { data: { total: 0 } } };
                })
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
                { id: 3, action: 'New gallery image added', time: '3 hours ago', icon: '🖼️', color: '#5e2e10' },
                { id: 4, action: 'New testimonial received', time: '5 hours ago', icon: '⭐', color: '#f59e0b' },
                { id: 5, action: 'Event booking completed', time: '1 day ago', icon: '📅', color: '#ef4444' }
            ]);

        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            if (!handleApiError(error)) {
                setAuthError("Failed to fetch dashboard data. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (checkAuth()) {
            fetchDashboardStats();
            const interval = setInterval(fetchDashboardStats, 60000); // Refresh every minute
            return () => clearInterval(interval);
        }
    }, []);

    useEffect(() => {
        const path = location.pathname.replace('/', '');
        if (path && path !== 'dashboard') {
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
        purpleIcon: { backgroundColor: '#5e2e10', color: 'white', padding: '8px', borderRadius: '8px', marginRight: '10px' },
        statCard: {
            backgroundColor: theme.card,
            borderRadius: '16px',
            padding: '20px',
            border: `1px solid ${theme.border}`,
            transition: 'all 0.3s ease',
            cursor: 'default'
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
        },
        alert: {
            padding: '12px 20px',
            backgroundColor: 'rgba(94, 46, 16, 0.15)',
            color: '#5e2e10',
            borderRadius: '8px',
            marginBottom: '20px',
            fontWeight: '500'
        }
    };

    const statCards = [
        { key: 'totalUsers', label: 'Total Users', icon: '👥', bg: 'linear-gradient(135deg, #5e2e10 0%, #8B4513 100%)' },
        { key: 'totalEvents', label: 'Total Events', icon: '📅', bg: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)' },
        { key: 'totalGallery', label: 'Gallery Images', icon: '🖼️', bg: 'linear-gradient(135deg, #5e2e10 0%, #8B4513 100%)' },
        { key: 'totalBlogs', label: 'Blog Posts', icon: '📝', bg: 'linear-gradient(135deg, #f59e0b 0%, #78350f 100%)' },
        { key: 'totalTestimonials', label: 'Testimonials', icon: '⭐', bg: 'linear-gradient(135deg, #ef4444 0%, #7f1d1d 100%)' },
        { key: 'totalNotices', label: 'Notices', icon: '📢', bg: 'linear-gradient(135deg, #06b6d4 0%, #164e63 100%)' },
        { key: 'totalLuxuryItems', label: 'Luxury Items', icon: '💎', bg: 'linear-gradient(135deg, #ec4899 0%, #831843 100%)' },
        { key: 'totalInvestmentBenifit', label: 'Investment Benefits', icon: '💰', bg: 'linear-gradient(135deg, #5e2e10 0%, #8B4513 100%)' }
    ];

    const renderContent = () => {
        if (authError) {
            return (
                <div style={styles.alert}>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {authError}
                </div>
            );
        }

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
                                    <div className="stat-card" style={styles.statCard}>
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
                                        <h5 className="fw-bold mb-0">⚡ Quick Actions</h5>
                                        <p className="small mb-0 mt-1" style={{ color: theme.textLight }}>Quick access to important features</p>
                                    </div>
                                    <div className="card-body">
                                        <div className="row g-3">
                                            <div className="col-12 mb-2">
                                                <div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{
                                                    background: `linear-gradient(135deg, ${theme.primary}15 0%, ${theme.primary}05 100%)`,
                                                    border: `1px solid ${theme.primary}30`
                                                }}>
                                                    <div>
                                                        <span style={{ fontSize: '14px', color: theme.textLight }}>Today's Views</span>
                                                        <h4 className="mb-0 fw-bold" style={{ color: theme.primary }}>1,234</h4>
                                                    </div>
                                                    <div>
                                                        <span style={{ fontSize: '14px', color: theme.textLight }}>Total Clicks</span>
                                                        <h4 className="mb-0 fw-bold" style={{ color: theme.primary }}>5.6K</h4>
                                                    </div>
                                                    <div style={{ fontSize: '32px' }}>📊</div>
                                                </div>
                                            </div>
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
                        box-shadow: 0 8px 25px rgba(94, 46, 16, 0.15);
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