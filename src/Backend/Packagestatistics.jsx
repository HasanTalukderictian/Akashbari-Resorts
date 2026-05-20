import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const Packagestatistics = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState('packages');
    const [selectedPackage, setSelectedPackage] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [editingPackage, setEditingPackage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [authError, setAuthError] = useState(null);

    // Package Data State
    const [packageData, setPackageData] = useState({
        current: [],
        history: {
            months: [],
            datasets: []
        }
    });

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        discount: '',
        color: '#9a55ff'
    });

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2',
        sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b',
        primary: '#9a55ff',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444'
    };

    // Get authentication headers
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Role': localStorage.getItem('Role') || 'admin',
            'Content-Type': 'application/json'
        };
    };

    // Check authentication
    const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setAuthError("Please login to access this page");
            setTimeout(() => window.location.href = '/login', 2000);
            return false;
        }
        return true;
    };

    // Show toast notification
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('bn-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price).replace('BDT', '৳');
    };

    // Fetch all packages with authentication
    const fetchPackages = async () => {
        if (!checkAuth()) return;
        
        setLoading(true);
        setAuthError(null);
        try {
            const headers = getAuthHeaders();
            const response = await axios.get(`${API_BASE_URL}/packages`, { headers });
            
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                setAuthError("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }

            if (response.data.success === true) {
                setPackageData(prev => ({
                    ...prev,
                    current: response.data.data
                }));
            }
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                setAuthError("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
            } else {
                showToast('Failed to load packages', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch price history with authentication
    const fetchPriceHistory = async (packageId = null) => {
        if (!checkAuth()) return;
        
        setLoading(true);
        try {
            const headers = getAuthHeaders();
            let url = `${API_BASE_URL}/packages/history`;
            if (packageId && packageId !== 'all') {
                url = `${API_BASE_URL}/packages/${packageId}/history`;
            }
            const response = await axios.get(url, { headers });
            
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                setAuthError("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }
            
            if (response.data.status === true) {
                setPackageData(prev => ({ ...prev, history: response.data.data }));
            }
        } catch (error) {
            console.error('Error fetching price history:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                setAuthError("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    // Add new package with authentication
    const addPackage = async () => {
        if (!checkAuth()) return;
        
        if (!formData.name || !formData.price) {
            showToast('Please fill all required fields', 'error');
            return;
        }

        setLoading(true);
        try {
            const headers = getAuthHeaders();
            const response = await axios.post(`${API_BASE_URL}/packages`, {
                name: formData.name,
                price: parseInt(formData.price),
                discount: parseInt(formData.discount) || 0,
                color: formData.color
            }, { headers });

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                showToast("Session expired. Please login again.", 'error');
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }

            if (response.data.success === true) {
                showToast('Package added successfully!', 'success');
                setShowModal(false);
                setFormData({ name: '', price: '', discount: '', color: '#9a55ff' });
                await fetchPackages();
            } else {
                showToast(response.data.message || 'Failed to add package', 'error');
            }
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                showToast("Session expired. Please login again.", 'error');
                setTimeout(() => window.location.href = '/login', 2000);
            } else {
                showToast(error.response?.data?.message || 'Failed to add package', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    // Update package with authentication
    const updatePackage = async () => {
        if (!checkAuth()) return;
        
        if (!formData.name || !formData.price) {
            showToast('Please fill all required fields', 'error');
            return;
        }

        setLoading(true);
        try {
            const headers = getAuthHeaders();
            const response = await axios.put(`${API_BASE_URL}/packages/${editingPackage.id}`, {
                name: formData.name,
                price: parseInt(formData.price),
                discount: parseInt(formData.discount) || 0,
                color: formData.color
            }, { headers });

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                showToast("Session expired. Please login again.", 'error');
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }

            if (response.data.success === true) {
                showToast('Package updated successfully!', 'success');
                setShowModal(false);
                setEditingPackage(null);
                setFormData({ name: '', price: '', discount: '', color: '#9a55ff' });
                await fetchPackages();
            } else {
                showToast(response.data.message || 'Failed to update package', 'error');
            }
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                showToast("Session expired. Please login again.", 'error');
                setTimeout(() => window.location.href = '/login', 2000);
            } else {
                showToast(error.response?.data?.message || 'Failed to update package', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    // Delete package with authentication
    const deletePackage = async (id) => {
        if (!checkAuth()) return;
        if (!window.confirm('Are you sure you want to delete this package?')) return;

        setLoading(true);
        try {
            const headers = getAuthHeaders();
            const response = await axios.delete(`${API_BASE_URL}/packages/${id}`, { headers });

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                showToast("Session expired. Please login again.", 'error');
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }

            if (response.data.success === true) {
                showToast('Package deleted successfully!', 'success');
                await fetchPackages();
            } else {
                showToast(response.data.message || 'Delete failed', 'error');
            }
        } catch (error) {
            console.error('Error deleting package:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                showToast("Session expired. Please login again.", 'error');
                setTimeout(() => window.location.href = '/login', 2000);
            } else {
                showToast(error.response?.data?.message || 'Failed to delete package', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    // Open Add Modal
    const openAddModal = () => {
        setModalMode('add');
        setFormData({ name: '', price: '', discount: '', color: '#9a55ff' });
        setShowModal(true);
    };

    // Open Edit Modal
    const openEditModal = (pkg) => {
        setModalMode('edit');
        setEditingPackage(pkg);
        setFormData({
            name: pkg.name,
            price: pkg.price,
            discount: pkg.discount,
            color: pkg.color
        });
        setShowModal(true);
    };

    // Handle Form Submit
    const handleSubmit = () => {
        if (modalMode === 'add') {
            addPackage();
        } else {
            updatePackage();
        }
    };

    useEffect(() => {
        fetchPackages();
        fetchPriceHistory();
    }, []);

    useEffect(() => {
        if (activeTab === 'history') {
            fetchPriceHistory(selectedPackage === 'all' ? null : selectedPackage);
        }
    }, [activeTab, selectedPackage]);

    // Prepare chart data
    const getChartData = () => {
        if (!packageData.history || !packageData.history.months) {
            return { labels: [], datasets: [] };
        }

        const labels = packageData.history.months;
        const datasets = packageData.history.datasets || [];
        
        return { labels, datasets };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: { size: 12 },
                    usePointStyle: true,
                    boxWidth: 10
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        label += formatPrice(context.raw);
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    callback: function(value) {
                        return formatPrice(value);
                    }
                }
            }
        }
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const styles = {
        container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
        mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
        contentScroll: { flex: '1 0 auto', padding: '24px' },
        footerWrapper: { flexShrink: 0 },
        alert: {
            padding: '12px 20px',
            backgroundColor: 'rgba(254, 112, 150, 0.15)',
            color: '#fe7096',
            borderRadius: '8px',
            marginBottom: '20px',
            fontWeight: '500'
        },
        tabButton: (isActive) => ({
            padding: '10px 24px',
            backgroundColor: isActive ? theme.primary : 'transparent',
            color: isActive ? '#fff' : theme.text,
            border: `1px solid ${isActive ? theme.primary : theme.border}`,
            borderRadius: '30px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.3s ease'
        }),
        card: {
            backgroundColor: theme.card,
            borderRadius: '16px',
            padding: '20px',
            border: `1px solid ${theme.border}`,
            transition: 'all 0.3s ease'
        },
        input: {
            width: '100%',
            padding: '10px 14px',
            borderRadius: '10px',
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.bg,
            color: theme.text,
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s ease'
        },
        primaryBtn: {
            background: theme.primary,
            color: '#fff',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '10px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        secondaryBtn: {
            background: 'transparent',
            color: theme.text,
            border: `1px solid ${theme.border}`,
            padding: '10px 24px',
            borderRadius: '10px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        toast: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '10px',
            color: 'white',
            zIndex: 2000,
            animation: 'slideInRight 0.3s ease'
        }
    };

    return (
        <div style={styles.container} className="container-fluid p-0">
            <style>
                {`
                    .package-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 8px 25px rgba(154, 85, 255, 0.15);
                    }
                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0,0,0,0.7);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 2000;
                        animation: fadeIn 0.3s ease;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideInRight {
                        from { transform: translateX(100px); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    .modal-content {
                        background: ${theme.card};
                        border-radius: 20px;
                        width: 500px;
                        max-width: 90%;
                        padding: 28px;
                        animation: slideUp 0.3s ease;
                    }
                    @keyframes slideUp {
                        from {
                            transform: translateY(50px);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }
                    .form-input:focus {
                        border-color: ${theme.primary};
                        box-shadow: 0 0 0 3px ${theme.primary}20;
                    }
                    .btn-primary:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px ${theme.primary}40;
                    }
                    .btn-secondary:hover {
                        background: ${theme.border};
                        transform: translateY(-2px);
                    }
                `}
            </style>

            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="users" />

                <div style={styles.mainArea} className="flex-grow-1">
                    <Header 
                        theme={theme} 
                        isDarkMode={isDarkMode} 
                        toggleDarkMode={toggleDarkMode} 
                        toggleSidebar={toggleSidebar} 
                    />

                    <div style={styles.contentContainer}>
                        <div style={styles.contentScroll}>
                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                                <div>
                                    <h2 style={{ color: theme.text, fontWeight: '700' }}>
                                        <i className="bi bi-graph-up" style={{ color: theme.primary, marginRight: '10px' }}></i>
                                        Package Management
                                    </h2>
                                    <p style={{ color: theme.textLight }}>Manage your package pricing, discounts, and view historical trends</p>
                                </div>
                                <button 
                                    onClick={openAddModal}
                                    style={styles.primaryBtn}
                                    className="btn-primary"
                                    disabled={loading}
                                >
                                    <i className="bi bi-plus-circle me-2"></i>Add New Package
                                </button>
                            </div>

                            {/* Auth Error Display */}
                            {authError && (
                                <div style={styles.alert}>
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {authError}
                                </div>
                            )}

                            {/* Tabs */}
                            <div className="d-flex gap-3 mb-4 flex-wrap">
                                <button style={styles.tabButton(activeTab === 'packages')} onClick={() => setActiveTab('packages')}>
                                    <i className="bi bi-box-seam me-2"></i>Packages
                                </button>
                                <button style={styles.tabButton(activeTab === 'history')} onClick={() => setActiveTab('history')}>
                                    <i className="bi bi-graph-up me-2"></i>Price History
                                </button>
                                <button style={styles.tabButton(activeTab === 'insights')} onClick={() => setActiveTab('insights')}>
                                    <i className="bi bi-lightbulb me-2"></i>Insights
                                </button>
                            </div>

                            {activeTab === 'packages' && (
                                <>
                                    {loading && packageData.current.length === 0 ? (
                                        <div className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <p className="mt-3">Loading packages...</p>
                                        </div>
                                    ) : packageData.current.length === 0 ? (
                                        <div style={styles.card} className="text-center py-5">
                                            <i className="bi bi-box-seam" style={{ fontSize: '48px', color: theme.textLight }}></i>
                                            <h4 className="mt-3">No Packages Found</h4>
                                            <p>Click the "Add New Package" button to create your first package.</p>
                                        </div>
                                    ) : (
                                        <div className="row g-4">
                                            {packageData.current.map((pkg) => (
                                                <div className="col-md-6 col-lg-3" key={pkg.id}>
                                                    <div className="package-card" style={styles.card}>
                                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                                            <div style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: pkg.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <i className="bi bi-gem" style={{ color: pkg.color, fontSize: '22px' }}></i>
                                                            </div>
                                                            <div className="dropdown">
                                                                <button className="btn btn-sm" style={{ color: theme.text, fontSize: '20px' }} data-bs-toggle="dropdown">⋯</button>
                                                                <ul className="dropdown-menu">
                                                                    <li><button className="dropdown-item" onClick={() => openEditModal(pkg)} disabled={loading}>✏️ Edit</button></li>
                                                                    <li><button className="dropdown-item text-danger" onClick={() => deletePackage(pkg.id)} disabled={loading}>🗑️ Delete</button></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <h6 style={{ color: theme.text, fontWeight: '600', marginBottom: '8px', fontSize: '16px' }}>{pkg.name}</h6>
                                                        <div className="mb-2">
                                                            <span style={{ fontSize: '22px', fontWeight: '700', color: pkg.color }}>{formatPrice(pkg.final_price || pkg.price - (pkg.price * pkg.discount / 100))}</span>
                                                            {pkg.discount > 0 && (
                                                                <span style={{ fontSize: '13px', color: theme.textLight, textDecoration: 'line-through', marginLeft: '10px' }}>
                                                                    {formatPrice(pkg.price)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {pkg.discount > 0 && (
                                                            <span className="badge mt-2" style={{ backgroundColor: theme.success, color: '#fff', padding: '5px 12px' }}>
                                                                Save {formatPrice(pkg.price * pkg.discount / 100)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === 'history' && (
                                <>
                                    {/* Filter Buttons */}
                                    <div className="d-flex gap-2 mb-4 flex-wrap">
                                        <button 
                                            className={`btn ${selectedPackage === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`} 
                                            onClick={() => setSelectedPackage('all')}
                                            disabled={loading}
                                        >
                                            All Packages
                                        </button>
                                        {packageData.current.map((pkg) => (
                                            <button 
                                                key={pkg.id}
                                                className={`btn ${selectedPackage === pkg.slug || selectedPackage === pkg.id.toString() ? 'btn-primary' : 'btn-outline-secondary'}`} 
                                                onClick={() => setSelectedPackage(pkg.slug || pkg.id.toString())}
                                                disabled={loading}
                                            >
                                                {pkg.name}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Chart */}
                                    <div style={{...styles.card, height: '500px'}}>
                                        {loading ? (
                                            <div className="text-center py-5">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <Line data={getChartData()} options={chartOptions} />
                                        )}
                                    </div>
                                </>
                            )}

                            {activeTab === 'insights' && (
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div style={styles.card}>
                                            <h5 className="mb-3"><i className="bi bi-trending-up me-2" style={{ color: theme.success }}></i>Price Trends</h5>
                                            {packageData.current.map((pkg, index) => (
                                                <div className="mb-3" key={pkg.id}>
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span>{pkg.name}</span>
                                                        <span style={{ color: theme.success }}>+{Math.floor(Math.random() * 30) + 5}% ↑</span>
                                                    </div>
                                                    <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                                                        <div className="progress-bar" style={{ width: `${Math.floor(Math.random() * 30) + 5}%`, backgroundColor: pkg.color }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div style={styles.card}>
                                            <h5 className="mb-3"><i className="bi bi-star me-2" style={{ color: theme.warning }}></i>Recommendations</h5>
                                            {packageData.current.filter(p => p.discount > 0).length > 0 && (
                                                <div className="mb-3 p-3 rounded" style={{ backgroundColor: theme.bg }}>
                                                    <i className="bi bi-lightbulb me-2" style={{ color: theme.warning }}></i>
                                                    <strong>Best Value:</strong> {packageData.current.find(p => p.discount > 0)?.name} with {packageData.current.find(p => p.discount > 0)?.discount}% discount
                                                </div>
                                            )}
                                            <div className="mb-3 p-3 rounded" style={{ backgroundColor: theme.bg }}>
                                                <i className="bi bi-graph-up me-2" style={{ color: theme.success }}></i>
                                                <strong>Total Packages:</strong> {packageData.current.length} active packages
                                            </div>
                                            <div className="p-3 rounded" style={{ backgroundColor: theme.bg }}>
                                                <i className="bi bi-bar-chart me-2" style={{ color: theme.primary }}></i>
                                                <strong>Average Price:</strong> {formatPrice(packageData.current.reduce((sum, p) => sum + p.price, 0) / (packageData.current.length || 1))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={styles.footerWrapper}>
                            <Footer theme={theme} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {toast.show && (
                <div style={{
                    ...styles.toast,
                    backgroundColor: toast.type === 'success' ? theme.success : theme.danger
                }}>
                    {toast.message}
                </div>
            )}

            {/* Unified Modal for Add/Edit */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 style={{ color: theme.text, margin: 0 }}>
                                {modalMode === 'add' ? (
                                    <><i className="bi bi-plus-circle me-2" style={{ color: theme.primary }}></i>Add New Package</>
                                ) : (
                                    <><i className="bi bi-pencil-square me-2" style={{ color: theme.warning }}></i>Edit Package</>
                                )}
                            </h4>
                            <button 
                                onClick={() => setShowModal(false)}
                                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: theme.text }}
                            >
                                ×
                            </button>
                        </div>

                        <div className="mb-3">
                            <label style={{ color: theme.text, display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Package Name <span style={{ color: theme.danger }}>*</span>
                            </label>
                            <input 
                                type="text" 
                                className="form-input"
                                style={styles.input} 
                                placeholder="Enter package name"
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                disabled={loading}
                            />
                        </div>

                        <div className="mb-3">
                            <label style={{ color: theme.text, display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Price (৳) <span style={{ color: theme.danger }}>*</span>
                            </label>
                            <input 
                                type="number" 
                                className="form-input"
                                style={styles.input} 
                                placeholder="Enter price"
                                value={formData.price} 
                                onChange={(e) => setFormData({...formData, price: e.target.value})} 
                                disabled={loading}
                            />
                        </div>

                        <div className="mb-3">
                            <label style={{ color: theme.text, display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Discount (%) 
                            </label>
                            <input 
                                type="number" 
                                className="form-input"
                                style={styles.input} 
                                placeholder="Enter discount percentage"
                                value={formData.discount} 
                                onChange={(e) => setFormData({...formData, discount: e.target.value})} 
                                disabled={loading}
                            />
                            {formData.price && formData.discount && (
                                <small style={{ color: theme.success, marginTop: '5px', display: 'block' }}>
                                    Final Price: {formatPrice(parseInt(formData.price) - (parseInt(formData.price) * parseInt(formData.discount) / 100))}
                                </small>
                            )}
                        </div>

                        <div className="mb-4">
                            <label style={{ color: theme.text, display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Package Color
                            </label>
                            <div className="d-flex align-items-center gap-3">
                                <input 
                                    type="color" 
                                    style={{ width: '50px', height: '50px', borderRadius: '10px', border: `1px solid ${theme.border}`, cursor: 'pointer' }}
                                    value={formData.color} 
                                    onChange={(e) => setFormData({...formData, color: e.target.value})} 
                                    disabled={loading}
                                />
                                <div style={{ 
                                    padding: '8px 16px', 
                                    backgroundColor: formData.color + '20', 
                                    borderRadius: '8px',
                                    color: formData.color,
                                    fontWeight: '500'
                                }}>
                                    Preview Color
                                </div>
                            </div>
                        </div>

                        <div className="d-flex gap-3">
                            <button 
                                onClick={handleSubmit} 
                                style={{ flex: 1, ...styles.primaryBtn }}
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Processing...</>
                                ) : (
                                    modalMode === 'add' ? (
                                        <><i className="bi bi-check-circle me-2"></i>Add Package</>
                                    ) : (
                                        <><i className="bi bi-save me-2"></i>Update Package</>
                                    )
                                )}
                            </button>
                            <button 
                                onClick={() => setShowModal(false)} 
                                style={{ flex: 1, ...styles.secondaryBtn }}
                                className="btn-secondary"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Packagestatistics;