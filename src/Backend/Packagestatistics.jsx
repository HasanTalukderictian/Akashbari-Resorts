// import React, { useState, useEffect } from 'react';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import Footer from './Footer';
// import { Line } from 'react-chartjs-2';
// import axios from 'axios';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// } from 'chart.js';

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// const Packagestatistics = ({ theme: propsTheme }) => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(false);
//     const [activeTab, setActiveTab] = useState('packages');
//     const [selectedPackage, setSelectedPackage] = useState('all');
//     const [showModal, setShowModal] = useState(false);
//     const [modalMode, setModalMode] = useState('add');
//     const [editingPackage, setEditingPackage] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [toast, setToast] = useState({ show: false, message: '', type: '' });
//     const [authError, setAuthError] = useState(null);

//     // Package Data State
//     const [packageData, setPackageData] = useState({
//         current: [],
//         history: {
//             months: [],
//             datasets: []
//         }
//     });

//     // Form State
//     const [formData, setFormData] = useState({
//         name: '',
//         old_price: '',
//         price: '',
//         discount: '',
//         color: '#5e2e10'
//     });

//     const theme = propsTheme || {
//         isDarkMode,
//         bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
//         card: isDarkMode ? '#16213e' : '#ffffff',
//         text: isDarkMode ? '#e9ecef' : '#3e4b5b',
//         border: isDarkMode ? '#2d3436' : '#ebedf2',
//         sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b',
//         primary: '#5e2e10',
//         primaryGradient: 'linear-gradient(135deg, #5e2e10 0%, #8B4513 100%)',
//         success: '#10b981',
//         warning: '#f59e0b',
//         danger: '#ef4444'
//     };

//     // Get authentication headers
//     const getAuthHeaders = () => {
//         const token = localStorage.getItem('token');
//         return {
//             'Authorization': `Bearer ${token}`,
//             'Role': localStorage.getItem('Role') || 'admin',
//             'Content-Type': 'application/json'
//         };
//     };

//     // Check authentication
//     const checkAuth = () => {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             setAuthError("Please login to access this page");
//             setTimeout(() => window.location.href = '/login', 2000);
//             return false;
//         }
//         return true;
//     };

//     // Show toast notification
//     const showToast = (message, type = 'success') => {
//         setToast({ show: true, message, type });
//         setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
//     };

//     // Format price
//     const formatPrice = (price) => {
//         const numPrice = parseFloat(price) || 0;
//         return new Intl.NumberFormat('bn-BD', {
//             style: 'currency',
//             currency: 'BDT',
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 0
//         }).format(numPrice).replace('BDT', '৳');
//     };

//     // Calculate Final Price: New Price - Discount
//     const calculateFinalPrice = () => {
//         const price = parseFloat(formData.price) || 0;
//         const discount = parseFloat(formData.discount) || 0;
//         return price - discount;
//     };

//     // Get Final Price from API data
//     const getFinalPrice = (pkg) => {
//         // First check if final_price exists in API response
//         if (pkg.final_price !== undefined && pkg.final_price !== null) {
//             return parseFloat(pkg.final_price);
//         }
//         // If not, calculate from price and discount
//         const price = parseFloat(pkg.price) || 0;
//         const discount = parseFloat(pkg.discount) || 0;
//         return price - discount;
//     };

//     // Fetch all packages with authentication
//     const fetchPackages = async () => {
//         if (!checkAuth()) return;
        
//         setLoading(true);
//         setAuthError(null);
//         try {
//             const headers = getAuthHeaders();
//             const response = await axios.get(`${API_BASE_URL}/packages`, { headers });
            
//             if (response.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 setAuthError("Session expired. Please login again.");
//                 setTimeout(() => window.location.href = '/login', 2000);
//                 return;
//             }

//             if (response.data.success === true) {
//                 console.log('API Response Data:', response.data.data); // Debug log
//                 setPackageData(prev => ({
//                     ...prev,
//                     current: response.data.data
//                 }));
//             }
//         } catch (error) {
//             console.error(error);
//             if (error.response?.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 setAuthError("Session expired. Please login again.");
//                 setTimeout(() => window.location.href = '/login', 2000);
//             } else {
//                 showToast('Failed to load packages', 'error');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch price history with authentication
//     const fetchPriceHistory = async (packageId = null) => {
//         if (!checkAuth()) return;
        
//         setLoading(true);
//         try {
//             const headers = getAuthHeaders();
//             let url = `${API_BASE_URL}/packages/history`;
//             if (packageId && packageId !== 'all') {
//                 url = `${API_BASE_URL}/packages/${packageId}/history`;
//             }
//             const response = await axios.get(url, { headers });
            
//             if (response.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 setAuthError("Session expired. Please login again.");
//                 setTimeout(() => window.location.href = '/login', 2000);
//                 return;
//             }
            
//             if (response.data.status === true) {
//                 setPackageData(prev => ({ ...prev, history: response.data.data }));
//             }
//         } catch (error) {
//             console.error('Error fetching price history:', error);
//             if (error.response?.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 setAuthError("Session expired. Please login again.");
//                 setTimeout(() => window.location.href = '/login', 2000);
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Add new package with authentication
//     const addPackage = async () => {
//         if (!checkAuth()) return;
        
//         if (!formData.name || !formData.price) {
//             showToast('Please fill all required fields', 'error');
//             return;
//         }

//         const price = parseFloat(formData.price) || 0;
//         const oldPrice = parseFloat(formData.old_price) || 0;
//         const discount = parseFloat(formData.discount) || 0;
//         const finalPrice = price - discount; // Final Price = New Price - Discount

//         setLoading(true);
//         try {
//             const headers = getAuthHeaders();
//             const response = await axios.post(`${API_BASE_URL}/packages`, {
//                 name: formData.name,
//                 old_price: oldPrice,
//                 price: price,
//                 discount: discount,
//                 final_price: finalPrice,
//                 color: formData.color
//             }, { headers });

//             if (response.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 showToast("Session expired. Please login again.", 'error');
//                 setTimeout(() => window.location.href = '/login', 2000);
//                 return;
//             }

//             if (response.data.success === true) {
//                 showToast('Package added successfully!', 'success');
//                 setShowModal(false);
//                 setFormData({ name: '', old_price: '', price: '', discount: '', color: '#5e2e10' });
//                 await fetchPackages();
//             } else {
//                 showToast(response.data.message || 'Failed to add package', 'error');
//             }
//         } catch (error) {
//             console.error(error);
//             if (error.response?.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 showToast("Session expired. Please login again.", 'error');
//                 setTimeout(() => window.location.href = '/login', 2000);
//             } else {
//                 showToast(error.response?.data?.message || 'Failed to add package', 'error');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Update package with authentication
//     const updatePackage = async () => {
//         if (!checkAuth()) return;
        
//         if (!formData.name || !formData.price) {
//             showToast('Please fill all required fields', 'error');
//             return;
//         }

//         const price = parseFloat(formData.price) || 0;
//         const oldPrice = parseFloat(formData.old_price) || 0;
//         const discount = parseFloat(formData.discount) || 0;
//         const finalPrice = price - discount; // Final Price = New Price - Discount

//         setLoading(true);
//         try {
//             const headers = getAuthHeaders();
//             const response = await axios.put(`${API_BASE_URL}/packages/${editingPackage.id}`, {
//                 name: formData.name,
//                 old_price: oldPrice,
//                 price: price,
//                 discount: discount,
//                 final_price: finalPrice,
//                 color: formData.color
//             }, { headers });

//             if (response.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 showToast("Session expired. Please login again.", 'error');
//                 setTimeout(() => window.location.href = '/login', 2000);
//                 return;
//             }

//             if (response.data.success === true) {
//                 showToast('Package updated successfully!', 'success');
//                 setShowModal(false);
//                 setEditingPackage(null);
//                 setFormData({ name: '', old_price: '', price: '', discount: '', color: '#5e2e10' });
//                 await fetchPackages();
//             } else {
//                 showToast(response.data.message || 'Failed to update package', 'error');
//             }
//         } catch (error) {
//             console.error(error);
//             if (error.response?.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 showToast("Session expired. Please login again.", 'error');
//                 setTimeout(() => window.location.href = '/login', 2000);
//             } else {
//                 showToast(error.response?.data?.message || 'Failed to update package', 'error');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Delete package with authentication
//     const deletePackage = async (id) => {
//         if (!checkAuth()) return;
//         if (!window.confirm('Are you sure you want to delete this package?')) return;

//         setLoading(true);
//         try {
//             const headers = getAuthHeaders();
//             const response = await axios.delete(`${API_BASE_URL}/packages/${id}`, { headers });

//             if (response.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 showToast("Session expired. Please login again.", 'error');
//                 setTimeout(() => window.location.href = '/login', 2000);
//                 return;
//             }

//             if (response.data.success === true) {
//                 showToast('Package deleted successfully!', 'success');
//                 await fetchPackages();
//             } else {
//                 showToast(response.data.message || 'Delete failed', 'error');
//             }
//         } catch (error) {
//             console.error('Error deleting package:', error);
//             if (error.response?.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 showToast("Session expired. Please login again.", 'error');
//                 setTimeout(() => window.location.href = '/login', 2000);
//             } else {
//                 showToast(error.response?.data?.message || 'Failed to delete package', 'error');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Open Add Modal
//     const openAddModal = () => {
//         setModalMode('add');
//         setFormData({ name: '', old_price: '', price: '', discount: '', color: '#5e2e10' });
//         setShowModal(true);
//     };

//     // Open Edit Modal
//     const openEditModal = (pkg) => {
//         setModalMode('edit');
//         setEditingPackage(pkg);
//         setFormData({
//             name: pkg.name,
//             old_price: pkg.old_price || '',
//             price: pkg.price,
//             discount: pkg.discount || '',
//             color: pkg.color || '#5e2e10'
//         });
//         setShowModal(true);
//     };

//     // Handle Form Submit
//     const handleSubmit = () => {
//         if (modalMode === 'add') {
//             addPackage();
//         } else {
//             updatePackage();
//         }
//     };

//     useEffect(() => {
//         fetchPackages();
//         fetchPriceHistory();
//     }, []);

//     useEffect(() => {
//         if (activeTab === 'history') {
//             fetchPriceHistory(selectedPackage === 'all' ? null : selectedPackage);
//         }
//     }, [activeTab, selectedPackage]);

//     // Prepare chart data
//     const getChartData = () => {
//         if (!packageData.history || !packageData.history.months) {
//             return { labels: [], datasets: [] };
//         }

//         const labels = packageData.history.months;
//         const datasets = packageData.history.datasets || [];
        
//         return { labels, datasets };
//     };

//     const chartOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 position: 'top',
//                 labels: {
//                     font: { size: 12 },
//                     usePointStyle: true,
//                     boxWidth: 10
//                 }
//             },
//             tooltip: {
//                 callbacks: {
//                     label: function(context) {
//                         let label = context.dataset.label || '';
//                         if (label) label += ': ';
//                         label += formatPrice(context.raw);
//                         return label;
//                     }
//                 }
//             }
//         },
//         scales: {
//             y: {
//                 beginAtZero: false,
//                 ticks: {
//                     callback: function(value) {
//                         return formatPrice(value);
//                     }
//                 }
//             }
//         }
//     };

//     const toggleSidebar = () => setIsCollapsed(!isCollapsed);
//     const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

//     const styles = {
//         container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
//         mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
//         contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
//         contentScroll: { flex: '1 0 auto', padding: '24px' },
//         footerWrapper: { flexShrink: 0 },
//         alert: {
//             padding: '12px 20px',
//             backgroundColor: 'rgba(94, 46, 16, 0.15)',
//             color: '#5e2e10',
//             borderRadius: '8px',
//             marginBottom: '20px',
//             fontWeight: '500'
//         },
//         tabButton: (isActive) => ({
//             padding: '10px 24px',
//             backgroundColor: isActive ? theme.primary : 'transparent',
//             color: isActive ? '#fff' : theme.text,
//             border: `1px solid ${isActive ? theme.primary : theme.border}`,
//             borderRadius: '30px',
//             cursor: 'pointer',
//             fontWeight: '500',
//             transition: 'all 0.3s ease'
//         }),
//         card: {
//             backgroundColor: theme.card,
//             borderRadius: '16px',
//             padding: '20px',
//             border: `1px solid ${theme.border}`,
//             transition: 'all 0.3s ease'
//         },
//         input: {
//             width: '100%',
//             padding: '10px 14px',
//             borderRadius: '10px',
//             border: `1px solid ${theme.border}`,
//             backgroundColor: theme.bg,
//             color: theme.text,
//             fontSize: '14px',
//             outline: 'none',
//             transition: 'all 0.3s ease'
//         },
//         primaryBtn: {
//             background: theme.primaryGradient || theme.primary,
//             color: '#fff',
//             border: 'none',
//             padding: '10px 24px',
//             borderRadius: '10px',
//             fontWeight: '600',
//             cursor: 'pointer',
//             transition: 'all 0.3s ease',
//             boxShadow: '0 4px 15px rgba(94, 46, 16, 0.3)'
//         },
//         secondaryBtn: {
//             background: 'transparent',
//             color: theme.text,
//             border: `1px solid ${theme.border}`,
//             padding: '10px 24px',
//             borderRadius: '10px',
//             fontWeight: '600',
//             cursor: 'pointer',
//             transition: 'all 0.3s ease'
//         },
//         toast: {
//             position: 'fixed',
//             bottom: '20px',
//             right: '20px',
//             padding: '12px 20px',
//             borderRadius: '10px',
//             color: 'white',
//             zIndex: 2000,
//             animation: 'slideInRight 0.3s ease'
//         }
//     };

//     return (
//         <div style={styles.container} className="container-fluid p-0">
//             <style>
//                 {`
//                     .package-card:hover {
//                         transform: translateY(-4px);
//                         box-shadow: 0 8px 25px rgba(94, 46, 16, 0.15);
//                     }
//                     .modal-overlay {
//                         position: fixed;
//                         top: 0;
//                         left: 0;
//                         right: 0;
//                         bottom: 0;
//                         background: rgba(0,0,0,0.7);
//                         display: flex;
//                         align-items: center;
//                         justify-content: center;
//                         z-index: 2000;
//                         animation: fadeIn 0.3s ease;
//                     }
//                     @keyframes fadeIn {
//                         from { opacity: 0; }
//                         to { opacity: 1; }
//                     }
//                     @keyframes slideInRight {
//                         from { transform: translateX(100px); opacity: 0; }
//                         to { transform: translateX(0); opacity: 1; }
//                     }
//                     .modal-content {
//                         background: ${theme.card};
//                         border-radius: 20px;
//                         width: 550px;
//                         max-width: 92%;
//                         padding: 32px;
//                         animation: slideUp 0.3s ease;
//                         max-height: 90vh;
//                         overflow-y: auto;
//                     }
//                     @keyframes slideUp {
//                         from {
//                             transform: translateY(50px);
//                             opacity: 0;
//                         }
//                         to {
//                             transform: translateY(0);
//                             opacity: 1;
//                         }
//                     }
//                     .form-input:focus {
//                         border-color: ${theme.primary};
//                         box-shadow: 0 0 0 3px ${theme.primary}20;
//                     }
//                     .btn-primary:hover {
//                         transform: translateY(-2px);
//                         box-shadow: 0 5px 15px rgba(94, 46, 16, 0.4);
//                     }
//                     .btn-secondary:hover {
//                         background: ${theme.border};
//                         transform: translateY(-2px);
//                     }
//                     .form-label {
//                         font-weight: 600;
//                         margin-bottom: 6px;
//                         display: block;
//                         font-size: 13px;
//                     }
//                     .form-label .required {
//                         color: #ef4444;
//                         margin-left: 2px;
//                     }
//                     .price-preview {
//                         background: ${theme.bg};
//                         border-radius: 12px;
//                         padding: 16px;
//                         margin-top: 8px;
//                     }
//                     .price-preview-item {
//                         display: flex;
//                         justify-content: space-between;
//                         align-items: center;
//                         padding: 4px 0;
//                     }
//                     .form-group {
//                         margin-bottom: 18px;
//                     }
//                     .form-row {
//                         display: grid;
//                         grid-template-columns: 1fr 1fr;
//                         gap: 16px;
//                     }
//                     .final-price-display {
//                         background: ${theme.primary}10;
//                         border: 2px solid ${theme.primary};
//                         border-radius: 8px;
//                         padding: 8px 16px;
//                         text-align: center;
//                         font-weight: 700;
//                         font-size: 18px;
//                         color: ${theme.primary};
//                     }
//                     @media (max-width: 576px) {
//                         .form-row {
//                             grid-template-columns: 1fr;
//                             gap: 0;
//                         }
//                     }
//                 `}
//             </style>

//             <div className="d-flex">
//                 <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="users" />

//                 <div style={styles.mainArea} className="flex-grow-1">
//                     <Header 
//                         theme={theme} 
//                         isDarkMode={isDarkMode} 
//                         toggleDarkMode={toggleDarkMode} 
//                         toggleSidebar={toggleSidebar} 
//                     />

//                     <div style={styles.contentContainer}>
//                         <div style={styles.contentScroll}>
//                             {/* Header */}
//                             <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
//                                 <div>
//                                     <h2 style={{ color: theme.text, fontWeight: '700' }}>
//                                         <i className="bi bi-graph-up" style={{ color: theme.primary, marginRight: '10px' }}></i>
//                                         Package Management
//                                     </h2>
//                                     <p style={{ color: theme.textLight }}>Manage your package pricing, discounts, and view historical trends</p>
//                                 </div>
//                                 <button 
//                                     onClick={openAddModal}
//                                     style={styles.primaryBtn}
//                                     className="btn-primary"
//                                     disabled={loading}
//                                 >
//                                     <i className="bi bi-plus-circle me-2"></i>Add New Package
//                                 </button>
//                             </div>

//                             {/* Auth Error Display */}
//                             {authError && (
//                                 <div style={styles.alert}>
//                                     <i className="bi bi-exclamation-triangle-fill me-2"></i>
//                                     {authError}
//                                 </div>
//                             )}

//                             {/* Tabs */}
//                             <div className="d-flex gap-3 mb-4 flex-wrap">
//                                 <button style={styles.tabButton(activeTab === 'packages')} onClick={() => setActiveTab('packages')}>
//                                     <i className="bi bi-box-seam me-2"></i>Packages
//                                 </button>
//                                 <button style={styles.tabButton(activeTab === 'history')} onClick={() => setActiveTab('history')}>
//                                     <i className="bi bi-graph-up me-2"></i>Price History
//                                 </button>
//                                 <button style={styles.tabButton(activeTab === 'insights')} onClick={() => setActiveTab('insights')}>
//                                     <i className="bi bi-lightbulb me-2"></i>Insights
//                                 </button>
//                             </div>

//                             {activeTab === 'packages' && (
//                                 <>
//                                     {loading && packageData.current.length === 0 ? (
//                                         <div className="text-center py-5">
//                                             <div className="spinner-border text-primary" role="status">
//                                                 <span className="visually-hidden">Loading...</span>
//                                             </div>
//                                             <p className="mt-3">Loading packages...</p>
//                                         </div>
//                                     ) : packageData.current.length === 0 ? (
//                                         <div style={styles.card} className="text-center py-5">
//                                             <i className="bi bi-box-seam" style={{ fontSize: '48px', color: theme.textLight }}></i>
//                                             <h4 className="mt-3">No Packages Found</h4>
//                                             <p>Click the "Add New Package" button to create your first package.</p>
//                                         </div>
//                                     ) : (
//                                         <div className="row g-4">
//                                             {packageData.current.map((pkg) => {
//                                                 const finalPrice = getFinalPrice(pkg);
//                                                 return (
//                                                     <div className="col-md-6 col-lg-3" key={pkg.id}>
//                                                         <div className="package-card" style={styles.card}>
//                                                             <div className="d-flex justify-content-between align-items-start mb-3">
//                                                                 <div style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: pkg.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                                                                     <i className="bi bi-gem" style={{ color: pkg.color, fontSize: '22px' }}></i>
//                                                                 </div>
//                                                                 <div className="dropdown">
//                                                                     <button className="btn btn-sm" style={{ color: theme.text, fontSize: '20px' }} data-bs-toggle="dropdown">⋯</button>
//                                                                     <ul className="dropdown-menu">
//                                                                         <li><button className="dropdown-item" onClick={() => openEditModal(pkg)} disabled={loading}>✏️ Edit</button></li>
//                                                                         <li><button className="dropdown-item text-danger" onClick={() => deletePackage(pkg.id)} disabled={loading}>🗑️ Delete</button></li>
//                                                                     </ul>
//                                                                 </div>
//                                                             </div>
//                                                             <h6 style={{ color: theme.text, fontWeight: '600', marginBottom: '8px', fontSize: '16px' }}>{pkg.name}</h6>
//                                                             <div className="mb-2">
//                                                                 {/* Final Price from API */}
//                                                                 <span style={{ fontSize: '22px', fontWeight: '700', color: pkg.color }}>
//                                                                     {formatPrice(finalPrice)}
//                                                                 </span>
//                                                                 {/* New Price (with strike-through if discount exists) */}
//                                                                 {parseFloat(pkg.discount) > 0 && (
//                                                                     <span style={{ fontSize: '13px', color: theme.textLight, textDecoration: 'line-through', marginLeft: '10px' }}>
//                                                                         {formatPrice(pkg.price)}
//                                                                     </span>
//                                                                 )}
//                                                             </div>
//                                                             {/* Discount Badge */}
//                                                             {parseFloat(pkg.discount) > 0 && (
//                                                                 <span className="badge mt-2" style={{ backgroundColor: theme.success, color: '#fff', padding: '5px 12px' }}>
//                                                                     Save {formatPrice(pkg.discount)}
//                                                                 </span>
//                                                             )}
//                                                             {/* Old Price Display */}
//                                                             {parseFloat(pkg.old_price) > 0 && (
//                                                                 <div style={{ fontSize: '11px', color: theme.textLight, marginTop: '4px' }}>
//                                                                     Old Price: {formatPrice(pkg.old_price)}
//                                                                 </div>
//                                                             )}
//                                                             {/* Final Price Label */}
//                                                             <div style={{ fontSize: '10px', color: theme.primary, marginTop: '2px', fontWeight: '600' }}>
//                                                                 Final Price (API)
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 );
//                                             })}
//                                         </div>
//                                     )}
//                                 </>
//                             )}

//                             {activeTab === 'history' && (
//                                 <>
//                                     {/* Filter Buttons */}
//                                     <div className="d-flex gap-2 mb-4 flex-wrap">
//                                         <button 
//                                             className={`btn ${selectedPackage === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`} 
//                                             onClick={() => setSelectedPackage('all')}
//                                             disabled={loading}
//                                         >
//                                             All Packages
//                                         </button>
//                                         {packageData.current.map((pkg) => (
//                                             <button 
//                                                 key={pkg.id}
//                                                 className={`btn ${selectedPackage === pkg.slug || selectedPackage === pkg.id.toString() ? 'btn-primary' : 'btn-outline-secondary'}`} 
//                                                 onClick={() => setSelectedPackage(pkg.slug || pkg.id.toString())}
//                                                 disabled={loading}
//                                             >
//                                                 {pkg.name}
//                                             </button>
//                                         ))}
//                                     </div>

//                                     {/* Chart */}
//                                     <div style={{...styles.card, height: '500px'}}>
//                                         {loading ? (
//                                             <div className="text-center py-5">
//                                                 <div className="spinner-border text-primary" role="status">
//                                                     <span className="visually-hidden">Loading...</span>
//                                                 </div>
//                                             </div>
//                                         ) : (
//                                             <Line data={getChartData()} options={chartOptions} />
//                                         )}
//                                     </div>
//                                 </>
//                             )}

//                             {activeTab === 'insights' && (
//                                 <div className="row g-4">
//                                     <div className="col-md-6">
//                                         <div style={styles.card}>
//                                             <h5 className="mb-3"><i className="bi bi-trending-up me-2" style={{ color: theme.success }}></i>Price Trends</h5>
//                                             {packageData.current.map((pkg) => {
//                                                 const finalPrice = getFinalPrice(pkg);
//                                                 return (
//                                                     <div className="mb-3" key={pkg.id}>
//                                                         <div className="d-flex justify-content-between mb-2">
//                                                             <span>{pkg.name}</span>
//                                                             <span style={{ color: theme.success }}>
//                                                                 {parseFloat(pkg.discount) > 0 ? `-${formatPrice(pkg.discount)}` : 'No Discount'}
//                                                             </span>
//                                                         </div>
//                                                         <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
//                                                             <div className="progress-bar" style={{ 
//                                                                 width: `${Math.min((parseFloat(pkg.discount) / parseFloat(pkg.price)) * 100, 100)}%`, 
//                                                                 backgroundColor: pkg.color 
//                                                             }}></div>
//                                                         </div>
//                                                         <div className="d-flex justify-content-between mt-1">
//                                                             <span style={{ fontSize: '11px', color: theme.textLight }}>Final: {formatPrice(finalPrice)}</span>
//                                                             <span style={{ fontSize: '11px', color: theme.textLight }}>Discount: {formatPrice(pkg.discount)}</span>
//                                                         </div>
//                                                     </div>
//                                                 );
//                                             })}
//                                         </div>
//                                     </div>

//                                     <div className="col-md-6">
//                                         <div style={styles.card}>
//                                             <h5 className="mb-3"><i className="bi bi-star me-2" style={{ color: theme.warning }}></i>Recommendations</h5>
//                                             {packageData.current.filter(p => parseFloat(p.discount) > 0).length > 0 && (
//                                                 <div className="mb-3 p-3 rounded" style={{ backgroundColor: theme.bg }}>
//                                                     <i className="bi bi-lightbulb me-2" style={{ color: theme.warning }}></i>
//                                                     <strong>Best Value:</strong> {packageData.current.find(p => parseFloat(p.discount) > 0)?.name} with {formatPrice(packageData.current.find(p => parseFloat(p.discount) > 0)?.discount)} discount
//                                                 </div>
//                                             )}
//                                             <div className="mb-3 p-3 rounded" style={{ backgroundColor: theme.bg }}>
//                                                 <i className="bi bi-graph-up me-2" style={{ color: theme.success }}></i>
//                                                 <strong>Total Packages:</strong> {packageData.current.length} active packages
//                                             </div>
//                                             <div className="p-3 rounded" style={{ backgroundColor: theme.bg }}>
//                                                 <i className="bi bi-bar-chart me-2" style={{ color: theme.primary }}></i>
//                                                 <strong>Average Price:</strong> {formatPrice(packageData.current.reduce((sum, p) => sum + parseFloat(p.price), 0) / (packageData.current.length || 1))}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         <div style={styles.footerWrapper}>
//                             <Footer theme={theme} />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Toast Notification */}
//             {toast.show && (
//                 <div style={{
//                     ...styles.toast,
//                     backgroundColor: toast.type === 'success' ? theme.success : theme.danger
//                 }}>
//                     {toast.message}
//                 </div>
//             )}

//             {/* Unified Modal for Add/Edit */}
//             {showModal && (
//                 <div className="modal-overlay" onClick={() => setShowModal(false)}>
//                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                         <div className="d-flex justify-content-between align-items-center mb-4">
//                             <h4 style={{ color: theme.text, margin: 0 }}>
//                                 {modalMode === 'add' ? (
//                                     <><i className="bi bi-plus-circle me-2" style={{ color: theme.primary }}></i>Add New Package</>
//                                 ) : (
//                                     <><i className="bi bi-pencil-square me-2" style={{ color: theme.warning }}></i>Edit Package</>
//                                 )}
//                             </h4>
//                             <button 
//                                 onClick={() => setShowModal(false)}
//                                 style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: theme.text }}
//                             >
//                                 ×
//                             </button>
//                         </div>

//                         {/* Package Name */}
//                         <div className="form-group">
//                             <label className="form-label" style={{ color: theme.text }}>
//                                 Package Name <span className="required">*</span>
//                             </label>
//                             <input 
//                                 type="text" 
//                                 className="form-input"
//                                 style={styles.input} 
//                                 placeholder="Enter package name (e.g., Premium Package)"
//                                 value={formData.name} 
//                                 onChange={(e) => setFormData({...formData, name: e.target.value})} 
//                                 disabled={loading}
//                             />
//                         </div>

//                         {/* Price Row: Old Price & New Price */}
//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label className="form-label" style={{ color: theme.text }}>
//                                     Old Price <span style={{ color: theme.textLight, fontSize: '12px' }}>(Optional)</span>
//                                 </label>
//                                 <input 
//                                     type="number" 
//                                     className="form-input"
//                                     style={styles.input} 
//                                     placeholder="0"
//                                     value={formData.old_price} 
//                                     onChange={(e) => setFormData({...formData, old_price: e.target.value})} 
//                                     disabled={loading}
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <label className="form-label" style={{ color: theme.text }}>
//                                     New Price <span className="required">*</span>
//                                 </label>
//                                 <input 
//                                     type="number" 
//                                     className="form-input"
//                                     style={styles.input} 
//                                     placeholder="Enter price"
//                                     value={formData.price} 
//                                     onChange={(e) => setFormData({...formData, price: e.target.value})} 
//                                     disabled={loading}
//                                 />
//                             </div>
//                         </div>

//                         {/* Discount */}
//                         <div className="form-group">
//                             <label className="form-label" style={{ color: theme.text }}>
//                                 Discount (Amount) <span style={{ color: theme.textLight, fontSize: '12px' }}>(Optional)</span>
//                             </label>
//                             <input 
//                                 type="number" 
//                                 className="form-input"
//                                 style={styles.input} 
//                                 placeholder="Enter discount amount"
//                                 value={formData.discount} 
//                                 onChange={(e) => setFormData({...formData, discount: e.target.value})} 
//                                 disabled={loading}
//                                 min="0"
//                             />
//                         </div>

//                         {/* Color Picker */}
//                         <div className="form-group">
//                             <label className="form-label" style={{ color: theme.text }}>
//                                 Package Color
//                             </label>
//                             <div className="d-flex align-items-center gap-3">
//                                 <input 
//                                     type="color" 
//                                     style={{ width: '50px', height: '50px', borderRadius: '10px', border: `1px solid ${theme.border}`, cursor: 'pointer', padding: '2px' }}
//                                     value={formData.color} 
//                                     onChange={(e) => setFormData({...formData, color: e.target.value})} 
//                                     disabled={loading}
//                                 />
//                                 <div style={{ 
//                                     padding: '8px 16px', 
//                                     backgroundColor: formData.color + '20', 
//                                     borderRadius: '8px',
//                                     color: formData.color,
//                                     fontWeight: '500',
//                                     fontSize: '14px'
//                                 }}>
//                                     Color Preview
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Price Preview */}
//                         {formData.price && (
//                             <div className="price-preview">
//                                 <div className="price-preview-item">
//                                     <span style={{ color: theme.text, fontSize: '13px' }}>Old Price</span>
//                                     <span style={{ color: theme.textLight, textDecoration: 'line-through', fontSize: '14px' }}>
//                                         {formatPrice(parseFloat(formData.old_price) || 0)}
//                                     </span>
//                                 </div>
//                                 <div className="price-preview-item">
//                                     <span style={{ color: theme.text, fontSize: '13px' }}>New Price</span>
//                                     <span style={{ color: theme.text, fontSize: '14px', fontWeight: '600' }}>
//                                         {formatPrice(parseFloat(formData.price) || 0)}
//                                     </span>
//                                 </div>
//                                 {formData.discount && parseFloat(formData.discount) > 0 && (
//                                     <>
//                                         <div className="price-preview-item">
//                                             <span style={{ color: theme.text, fontSize: '13px' }}>Discount</span>
//                                             <span style={{ color: theme.success, fontSize: '14px', fontWeight: '600' }}>
//                                                 -{formatPrice(parseFloat(formData.discount))}
//                                             </span>
//                                         </div>
//                                         <div className="price-preview-item" style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '8px', marginTop: '4px' }}>
//                                             <span style={{ color: theme.text, fontSize: '14px', fontWeight: '700' }}>Final Price</span>
//                                             <span className="final-price-display" style={{ fontSize: '20px' }}>
//                                                 {formatPrice(calculateFinalPrice())}
//                                             </span>
//                                         </div>
//                                     </>
//                                 )}
//                                 {(!formData.discount || parseFloat(formData.discount) === 0) && (
//                                     <div className="price-preview-item" style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '8px', marginTop: '4px' }}>
//                                         <span style={{ color: theme.text, fontSize: '14px', fontWeight: '700' }}>Final Price</span>
//                                         <span className="final-price-display" style={{ fontSize: '20px' }}>
//                                             {formatPrice(parseFloat(formData.price) || 0)}
//                                         </span>
//                                     </div>
//                                 )}
//                                 {formData.old_price && parseFloat(formData.old_price) > 0 && parseFloat(formData.price) < parseFloat(formData.old_price) && (
//                                     <div className="price-preview-item" style={{ marginTop: '4px' }}>
//                                         <span style={{ color: theme.success, fontSize: '12px' }}>
//                                             <i className="bi bi-arrow-down"></i> You saved {formatPrice(parseFloat(formData.old_price) - parseFloat(formData.price))}
//                                         </span>
//                                     </div>
//                                 )}
//                             </div>
//                         )}

//                         {/* Action Buttons */}
//                         <div className="d-flex gap-3 mt-4">
//                             <button 
//                                 onClick={handleSubmit} 
//                                 style={{ flex: 1, ...styles.primaryBtn }}
//                                 className="btn-primary"
//                                 disabled={loading}
//                             >
//                                 {loading ? (
//                                     <><span className="spinner-border spinner-border-sm me-2"></span>Processing...</>
//                                 ) : (
//                                     modalMode === 'add' ? (
//                                         <><i className="bi bi-check-circle me-2"></i>Add Package</>
//                                     ) : (
//                                         <><i className="bi bi-save me-2"></i>Update Package</>
//                                     )
//                                 )}
//                             </button>
//                             <button 
//                                 onClick={() => setShowModal(false)} 
//                                 style={{ flex: 1, ...styles.secondaryBtn }}
//                                 className="btn-secondary"
//                                 disabled={loading}
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Packagestatistics;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const EMPTY_FORM = { name: '', old_price: '', price: '', discount: '', color: '#111111' };

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    Role: localStorage.getItem('Role') || 'admin',
    'Content-Type': 'application/json'
});

const formatPrice = (price) =>
    new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT', minimumFractionDigits: 0, maximumFractionDigits: 0 })
        .format(parseFloat(price) || 0).replace('BDT', '৳');

const getFinalPrice = (pkg) => {
    if (pkg.final_price !== undefined && pkg.final_price !== null) return parseFloat(pkg.final_price);
    return (parseFloat(pkg.price) || 0) - (parseFloat(pkg.discount) || 0);
};

const Modal = ({ theme, title, onClose, children, footer, width }) => (
    <div
        style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000, padding: '20px', animation: 'fadeIn .2s ease'
        }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
    >
        <div style={{
            backgroundColor: theme.card, color: theme.text,
            border: `1px solid ${theme.border}`, borderRadius: '18px',
            width: '100%', maxWidth: width || '520px', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column', animation: 'slideUp .25s ease'
        }}>
            <div style={{
                padding: '18px 24px', borderBottom: `1px solid ${theme.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <h5 style={{ margin: 0, fontWeight: 600 }}>{title}</h5>
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '22px', color: theme.text, opacity: 0.6, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '24px', overflowY: 'auto' }}>{children}</div>
            {footer && (
                <div style={{ padding: '16px 24px', borderTop: `1px solid ${theme.border}`, display: 'flex', gap: '10px' }}>
                    {footer}
                </div>
            )}
        </div>
    </div>
);

const Packagestatistics = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState('packages');
    const [selectedPackage, setSelectedPackage] = useState('all');
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const [packageData, setPackageData] = useState({ current: [], history: { months: [], datasets: [] } });

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [editingPackage, setEditingPackage] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [deletingPackage, setDeletingPackage] = useState(null);

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#0a0a0a' : '#f5f5f5',
        card: isDarkMode ? '#141414' : '#ffffff',
        text: isDarkMode ? '#f5f5f5' : '#111111',
        textLight: isDarkMode ? '#a3a3a3' : '#6b6b6b',
        border: isDarkMode ? '#2b2b2b' : '#dcdcdc'
    };
    const accent = theme.text;
    const accentOn = theme.card;

    const fieldStyle = {
        width: '100%', padding: '10px 14px', borderRadius: '10px',
        border: `1px solid ${theme.border}`, backgroundColor: theme.bg,
        color: theme.text, fontSize: '14px', outline: 'none'
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const checkAuth = () => {
        if (!localStorage.getItem('token')) {
            setAuthError('Please login to access this page');
            setTimeout(() => { window.location.href = '/login'; }, 2000);
            return false;
        }
        return true;
    };

    const handleAuthFailure = (setter = setAuthError) => {
        localStorage.removeItem('token');
        localStorage.removeItem('Role');
        setter('Session expired. Please login again.');
        setTimeout(() => { window.location.href = '/login'; }, 2000);
    };

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const fetchPackages = async () => {
        if (!checkAuth()) return;
        setLoading(true);
        setAuthError(null);
        try {
            const res = await axios.get(`${API_BASE_URL}/packages`, { headers: getAuthHeaders() });
            if (res.data.success === true) {
                setPackageData(prev => ({ ...prev, current: res.data.data }));
            }
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) handleAuthFailure();
            else showToast('Failed to load packages', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchPriceHistory = async (packageId = null) => {
        if (!checkAuth()) return;
        setLoading(true);
        try {
            const url = packageId && packageId !== 'all'
                ? `${API_BASE_URL}/packages/${packageId}/history`
                : `${API_BASE_URL}/packages/history`;
            const res = await axios.get(url, { headers: getAuthHeaders() });
            if (res.data.status === true) {
                setPackageData(prev => ({ ...prev, history: res.data.data }));
            }
        } catch (err) {
            console.error('Error fetching price history:', err);
            if (err.response?.status === 401) handleAuthFailure();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPackages(); fetchPriceHistory(); }, []);
    useEffect(() => {
        if (activeTab === 'history') fetchPriceHistory(selectedPackage === 'all' ? null : selectedPackage);
    }, [activeTab, selectedPackage]);

    const openAddModal = () => { setModalMode('add'); setFormData(EMPTY_FORM); setShowModal(true); };

    const openEditModal = (pkg) => {
        setModalMode('edit');
        setEditingPackage(pkg);
        setFormData({
            name: pkg.name, old_price: pkg.old_price || '', price: pkg.price,
            discount: pkg.discount || '', color: pkg.color || '#111111'
        });
        setShowModal(true);
    };

    const closeModal = () => { setShowModal(false); setEditingPackage(null); setFormData(EMPTY_FORM); };

    const handleSubmit = async () => {
        if (!checkAuth()) return;
        if (!formData.name || !formData.price) return showToast('Please fill all required fields', 'error');

        const price = parseFloat(formData.price) || 0;
        const old_price = parseFloat(formData.old_price) || 0;
        const discount = parseFloat(formData.discount) || 0;
        const payload = { name: formData.name, old_price, price, discount, final_price: price - discount, color: formData.color };

        setLoading(true);
        try {
            const res = modalMode === 'add'
                ? await axios.post(`${API_BASE_URL}/packages`, payload, { headers: getAuthHeaders() })
                : await axios.put(`${API_BASE_URL}/packages/${editingPackage.id}`, payload, { headers: getAuthHeaders() });

            if (res.data.success === true) {
                showToast(modalMode === 'add' ? 'Package added successfully!' : 'Package updated successfully!');
                closeModal();
                fetchPackages();
            } else {
                showToast(res.data.message || 'Request failed', 'error');
            }
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) handleAuthFailure((m) => showToast(m, 'error'));
            else showToast(err.response?.data?.message || 'Request failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deletingPackage || !checkAuth()) return;
        setLoading(true);
        try {
            const res = await axios.delete(`${API_BASE_URL}/packages/${deletingPackage.id}`, { headers: getAuthHeaders() });
            if (res.data.success === true) {
                showToast('Package deleted successfully!');
                fetchPackages();
            } else {
                showToast(res.data.message || 'Delete failed', 'error');
            }
            setDeletingPackage(null);
        } catch (err) {
            console.error('Error deleting package:', err);
            if (err.response?.status === 401) handleAuthFailure((m) => showToast(m, 'error'));
            else showToast(err.response?.data?.message || 'Failed to delete package', 'error');
        } finally {
            setLoading(false);
        }
    };

    const calculateFinalPrice = () => (parseFloat(formData.price) || 0) - (parseFloat(formData.discount) || 0);

    const getChartData = () => ({
        labels: packageData.history?.months || [],
        datasets: (packageData.history?.datasets || []).map(ds => ({
            ...ds, borderColor: accent, backgroundColor: `${accent}20`
        }))
    });

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { font: { size: 12 }, usePointStyle: true, boxWidth: 10, color: theme.text } },
            tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label || ''}: ${formatPrice(ctx.raw)}` } }
        },
        scales: {
            x: { ticks: { color: theme.textLight }, grid: { color: theme.border } },
            y: { beginAtZero: false, ticks: { callback: (v) => formatPrice(v), color: theme.textLight }, grid: { color: theme.border } }
        }
    };

    const tabs = [
        { key: 'packages', label: 'Packages', icon: 'bi-box-seam' },
        { key: 'history', label: 'Price History', icon: 'bi-graph-up' },
        { key: 'insights', label: 'Insights', icon: 'bi-lightbulb' }
    ];

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="users" />

                <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="flex-grow-1">
                    <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '24px' }}>
                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                                <div>
                                    <h2 style={{ color: theme.text, fontWeight: 700 }}>
                                        <i className="bi bi-graph-up me-2"></i>Package Management
                                    </h2>
                                    <p style={{ color: theme.textLight, margin: 0 }}>Manage your package pricing, discounts, and view historical trends</p>
                                </div>
                                <button
                                    onClick={openAddModal}
                                    disabled={loading}
                                    style={{ backgroundColor: accent, color: accentOn, border: 'none', padding: '10px 22px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                                >
                                    <i className="bi bi-plus-circle me-2"></i>Add New Package
                                </button>
                            </div>

                            {authError && (
                                <div className="alert" role="alert" style={{ border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text }}>
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>{authError}
                                </div>
                            )}

                            {/* Tabs */}
                            <div className="d-flex gap-2 mb-4 flex-wrap">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        style={{
                                            padding: '9px 20px', borderRadius: '999px', cursor: 'pointer', fontWeight: 500, fontSize: '14px',
                                            backgroundColor: activeTab === tab.key ? accent : 'transparent',
                                            color: activeTab === tab.key ? accentOn : theme.text,
                                            border: `1px solid ${activeTab === tab.key ? accent : theme.border}`
                                        }}
                                    >
                                        <i className={`bi ${tab.icon} me-2`}></i>{tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Packages Tab */}
                            {activeTab === 'packages' && (
                                loading && packageData.current.length === 0 ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border" style={{ color: accent }} role="status"></div>
                                        <p className="mt-3" style={{ color: theme.textLight }}>Loading packages...</p>
                                    </div>
                                ) : packageData.current.length === 0 ? (
                                    <div className="text-center py-5" style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px' }}>
                                        <i className="bi bi-box-seam display-4 d-block mb-3" style={{ opacity: 0.4 }}></i>
                                        <h5 style={{ color: theme.text }}>No Packages Found</h5>
                                        <p style={{ color: theme.textLight }}>Click "Add New Package" to create your first package.</p>
                                    </div>
                                ) : (
                                    <div className="row g-3">
                                        {packageData.current.map(pkg => {
                                            const finalPrice = getFinalPrice(pkg);
                                            return (
                                                <div className="col-6 col-md-4 col-lg-3" key={pkg.id}>
                                                    <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '18px' }}>
                                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                                            <div style={{ width: '42px', height: '42px', borderRadius: '10px', border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <i className="bi bi-gem" style={{ color: theme.text, fontSize: '18px' }}></i>
                                                            </div>
                                                            <div className="d-flex gap-2">
                                                                <button onClick={() => openEditModal(pkg)} disabled={loading} style={{ background: 'transparent', border: 'none', color: theme.text, opacity: 0.7, cursor: 'pointer' }} title="Edit">
                                                                    <i className="bi bi-pencil"></i>
                                                                </button>
                                                                <button onClick={() => setDeletingPackage(pkg)} disabled={loading} style={{ background: 'transparent', border: 'none', color: theme.text, opacity: 0.7, cursor: 'pointer' }} title="Delete">
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <h6 style={{ color: theme.text, fontWeight: 600, marginBottom: '8px', fontSize: '15px' }}>{pkg.name}</h6>
                                                        <div className="mb-2">
                                                            <span style={{ fontSize: '20px', fontWeight: 700, color: theme.text }}>{formatPrice(finalPrice)}</span>
                                                            {parseFloat(pkg.discount) > 0 && (
                                                                <span style={{ fontSize: '12px', color: theme.textLight, textDecoration: 'line-through', marginLeft: '8px' }}>
                                                                    {formatPrice(pkg.price)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {parseFloat(pkg.discount) > 0 && (
                                                            <span style={{ border: `1px solid ${theme.text}`, color: theme.text, padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>
                                                                Save {formatPrice(pkg.discount)}
                                                            </span>
                                                        )}
                                                        {parseFloat(pkg.old_price) > 0 && (
                                                            <div style={{ fontSize: '11px', color: theme.textLight, marginTop: '6px' }}>
                                                                Old Price: {formatPrice(pkg.old_price)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )
                            )}

                            {/* History Tab */}
                            {activeTab === 'history' && (
                                <>
                                    <div className="d-flex gap-2 mb-4 flex-wrap">
                                        <button
                                            onClick={() => setSelectedPackage('all')}
                                            disabled={loading}
                                            style={{
                                                padding: '8px 18px', borderRadius: '999px', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                                                backgroundColor: selectedPackage === 'all' ? accent : 'transparent',
                                                color: selectedPackage === 'all' ? accentOn : theme.text,
                                                border: `1px solid ${theme.border}`
                                            }}
                                        >
                                            All Packages
                                        </button>
                                        {packageData.current.map(pkg => {
                                            const key = pkg.slug || pkg.id.toString();
                                            const isActive = selectedPackage === key;
                                            return (
                                                <button
                                                    key={pkg.id}
                                                    onClick={() => setSelectedPackage(key)}
                                                    disabled={loading}
                                                    style={{
                                                        padding: '8px 18px', borderRadius: '999px', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                                                        backgroundColor: isActive ? accent : 'transparent',
                                                        color: isActive ? accentOn : theme.text,
                                                        border: `1px solid ${theme.border}`
                                                    }}
                                                >
                                                    {pkg.name}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '20px', height: '460px' }}>
                                        {loading ? (
                                            <div className="text-center py-5">
                                                <div className="spinner-border" style={{ color: accent }} role="status"></div>
                                            </div>
                                        ) : (
                                            <Line data={getChartData()} options={chartOptions} />
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Insights Tab */}
                            {activeTab === 'insights' && (
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '20px' }}>
                                            <h5 className="mb-3" style={{ color: theme.text }}><i className="bi bi-graph-up-arrow me-2"></i>Price Trends</h5>
                                            {packageData.current.map(pkg => (
                                                <div className="mb-3" key={pkg.id}>
                                                    <div className="d-flex justify-content-between mb-2" style={{ color: theme.text }}>
                                                        <span>{pkg.name}</span>
                                                        <span>{parseFloat(pkg.discount) > 0 ? `-${formatPrice(pkg.discount)}` : 'No Discount'}</span>
                                                    </div>
                                                    <div style={{ height: '8px', borderRadius: '4px', backgroundColor: theme.border }}>
                                                        <div style={{
                                                            height: '100%', borderRadius: '4px', backgroundColor: accent,
                                                            width: `${Math.min((parseFloat(pkg.discount) / parseFloat(pkg.price)) * 100 || 0, 100)}%`
                                                        }}></div>
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-1" style={{ fontSize: '11px', color: theme.textLight }}>
                                                        <span>Final: {formatPrice(getFinalPrice(pkg))}</span>
                                                        <span>Discount: {formatPrice(pkg.discount)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '20px' }}>
                                            <h5 className="mb-3" style={{ color: theme.text }}><i className="bi bi-star me-2"></i>Recommendations</h5>
                                            {packageData.current.filter(p => parseFloat(p.discount) > 0).length > 0 && (
                                                <div className="mb-3 p-3 rounded" style={{ backgroundColor: theme.bg, color: theme.text }}>
                                                    <i className="bi bi-lightbulb me-2"></i>
                                                    <strong>Best Value:</strong> {packageData.current.find(p => parseFloat(p.discount) > 0)?.name} with {formatPrice(packageData.current.find(p => parseFloat(p.discount) > 0)?.discount)} discount
                                                </div>
                                            )}
                                            <div className="mb-3 p-3 rounded" style={{ backgroundColor: theme.bg, color: theme.text }}>
                                                <i className="bi bi-graph-up me-2"></i>
                                                <strong>Total Packages:</strong> {packageData.current.length} active packages
                                            </div>
                                            <div className="p-3 rounded" style={{ backgroundColor: theme.bg, color: theme.text }}>
                                                <i className="bi bi-bar-chart me-2"></i>
                                                <strong>Average Price:</strong> {formatPrice(packageData.current.reduce((sum, p) => sum + parseFloat(p.price), 0) / (packageData.current.length || 1))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <Footer theme={theme} />
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <Modal
                    theme={theme}
                    title={modalMode === 'add' ? 'Add New Package' : 'Edit Package'}
                    onClose={closeModal}
                    footer={<>
                        <button onClick={handleSubmit} disabled={loading} className="flex-fill btn" style={{ backgroundColor: accent, color: accentOn, border: 'none' }}>
                            {loading ? (<><span className="spinner-border spinner-border-sm me-2"></span>Processing...</>) : (modalMode === 'add' ? 'Add Package' : 'Update Package')}
                        </button>
                        <button onClick={closeModal} disabled={loading} className="flex-fill btn btn-outline-dark">Cancel</button>
                    </>}
                >
                    <div className="mb-3">
                        <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>
                            Package Name <span className="text-danger">*</span>
                        </label>
                        <input style={fieldStyle} placeholder="Enter package name (e.g., Premium Package)" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={loading} />
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-6">
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Old Price <span style={{ color: theme.textLight, fontWeight: 400, fontSize: '12px' }}>(Optional)</span></label>
                            <input type="number" style={fieldStyle} placeholder="0" value={formData.old_price} onChange={(e) => setFormData({ ...formData, old_price: e.target.value })} disabled={loading} />
                        </div>
                        <div className="col-6">
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>New Price <span className="text-danger">*</span></label>
                            <input type="number" style={fieldStyle} placeholder="Enter price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} disabled={loading} />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Discount (Amount) <span style={{ color: theme.textLight, fontWeight: 400, fontSize: '12px' }}>(Optional)</span></label>
                        <input type="number" min="0" style={fieldStyle} placeholder="Enter discount amount" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} disabled={loading} />
                    </div>

                    <div className="mb-3">
                        <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Package Color</label>
                        <div className="d-flex align-items-center gap-3">
                            <input type="color" style={{ width: '46px', height: '46px', borderRadius: '10px', border: `1px solid ${theme.border}`, cursor: 'pointer', padding: '2px' }} value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} disabled={loading} />
                            <div style={{ padding: '8px 16px', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.text, fontWeight: 500, fontSize: '14px' }}>
                                Color Preview
                            </div>
                        </div>
                    </div>

                    {formData.price && (
                        <div style={{ backgroundColor: theme.bg, borderRadius: '12px', padding: '16px' }}>
                            <div className="d-flex justify-content-between py-1">
                                <span style={{ fontSize: '13px', color: theme.text }}>Old Price</span>
                                <span style={{ color: theme.textLight, textDecoration: 'line-through', fontSize: '14px' }}>{formatPrice(formData.old_price)}</span>
                            </div>
                            <div className="d-flex justify-content-between py-1">
                                <span style={{ fontSize: '13px', color: theme.text }}>New Price</span>
                                <span style={{ color: theme.text, fontSize: '14px', fontWeight: 600 }}>{formatPrice(formData.price)}</span>
                            </div>
                            {parseFloat(formData.discount) > 0 ? (
                                <>
                                    <div className="d-flex justify-content-between py-1">
                                        <span style={{ fontSize: '13px', color: theme.text }}>Discount</span>
                                        <span style={{ color: theme.text, fontSize: '14px', fontWeight: 600 }}>-{formatPrice(formData.discount)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center pt-2 mt-1" style={{ borderTop: `1px solid ${theme.border}` }}>
                                        <span style={{ fontSize: '14px', fontWeight: 700, color: theme.text }}>Final Price</span>
                                        <span style={{ border: `2px solid ${theme.text}`, borderRadius: '8px', padding: '6px 14px', fontWeight: 700, fontSize: '18px', color: theme.text }}>
                                            {formatPrice(calculateFinalPrice())}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="d-flex justify-content-between align-items-center pt-2 mt-1" style={{ borderTop: `1px solid ${theme.border}` }}>
                                    <span style={{ fontSize: '14px', fontWeight: 700, color: theme.text }}>Final Price</span>
                                    <span style={{ border: `2px solid ${theme.text}`, borderRadius: '8px', padding: '6px 14px', fontWeight: 700, fontSize: '18px', color: theme.text }}>
                                        {formatPrice(formData.price)}
                                    </span>
                                </div>
                            )}
                            {formData.old_price && parseFloat(formData.old_price) > parseFloat(formData.price) && (
                                <div className="pt-2" style={{ fontSize: '12px', color: theme.text }}>
                                    <i className="bi bi-arrow-down me-1"></i>
                                    You saved {formatPrice(parseFloat(formData.old_price) - parseFloat(formData.price))}
                                </div>
                            )}
                        </div>
                    )}
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            {deletingPackage && (
                <div
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 2000, padding: '20px', animation: 'fadeIn .2s ease'
                    }}
                    onClick={(e) => e.target === e.currentTarget && !loading && setDeletingPackage(null)}
                >
                    <div style={{
                        backgroundColor: theme.card, color: theme.text,
                        border: `1px solid ${theme.border}`, borderRadius: '16px',
                        width: '100%', maxWidth: '380px', padding: '28px 26px', textAlign: 'center',
                        animation: 'slideUp .2s ease'
                    }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            border: `1.5px solid ${theme.text}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px', fontSize: '20px'
                        }}>
                            <i className="bi bi-trash"></i>
                        </div>
                        <h5 style={{ margin: '0 0 8px', fontWeight: 600 }}>Delete this package?</h5>
                        <p style={{ margin: '0 0 22px', color: theme.textLight, fontSize: '14px' }}>
                            "<strong>{deletingPackage.name}</strong>" will be permanently removed. This can't be undone.
                        </p>
                        <div className="d-flex gap-2">
                            <button onClick={() => setDeletingPackage(null)} disabled={loading} className="btn btn-outline-dark flex-fill">Cancel</button>
                            <button onClick={confirmDelete} disabled={loading} className="btn flex-fill" style={{ backgroundColor: accent, color: accentOn, border: 'none' }}>
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast.show && (
                <div style={{
                    position: 'fixed', bottom: '20px', right: '20px', zIndex: 2000,
                    padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 500,
                    backgroundColor: accent, color: accentOn
                }}>
                    {toast.message}
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .form-control, .form-select { background-color: ${theme.bg} !important; color: ${theme.text} !important; border-color: ${theme.border} !important; }
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: ${theme.bg}; }
                ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default Packagestatistics;