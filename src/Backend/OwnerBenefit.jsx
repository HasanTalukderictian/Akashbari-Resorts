// import React, { useState, useEffect } from 'react';
// import Header from './Header';
// import Footer from './Footer';
// import Sidebar from './Sidebar';

// const OwnerBenefit = ({ theme }) => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [deleteConfirm, setDeleteConfirm] = useState(null);
//     const [authError, setAuthError] = useState(null);
//     const itemsPerPage = 6;
    
//     const [benefits, setBenefits] = useState([]);
//     const [formData, setFormData] = useState({ id: '', title: '', desc: '' });
//     const [isEditing, setIsEditing] = useState(false);

//     const API_BASE = import.meta.env.VITE_BASE_URL;

//     const getAuthHeaders = () => {
//         const token = localStorage.getItem('token');
//         return {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//             'Role': localStorage.getItem('Role') || 'admin'
//         };
//     };

//     const checkAuth = () => {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             setAuthError("Please login to access this page");
//             setTimeout(() => window.location.href = '/login', 2000);
//             return false;
//         }
//         return true;
//     };

//     const fetchBenefits = async () => {
//         if (!checkAuth()) return;
        
//         try {
//             setLoading(true);
//             setAuthError(null);
            
//             const headers = getAuthHeaders();
//             const response = await fetch(`${API_BASE}/get-property-benifit`, {
//                 method: 'GET',
//                 headers: headers
//             });
            
//             if (response.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 setAuthError("Session expired. Please login again.");
//                 setTimeout(() => window.location.href = '/login', 2000);
//                 return;
//             }
            
//             const result = await response.json();
            
//             if (result.status && result.data && Array.isArray(result.data.data)) {
//                 setBenefits(result.data.data);
//             } else {
//                 setBenefits([]);
//             }
//         } catch (error) {
//             console.error("Fetch error:", error);
//             setBenefits([]);
//             setAuthError("Failed to fetch benefits. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchBenefits();
//     }, []);

//     const handleSave = async (e) => {
//         e.preventDefault();
        
//         if (!checkAuth()) return;
        
//         const url = isEditing 
//             ? `${API_BASE}/edit-property-benifit/${formData.id}` 
//             : `${API_BASE}/add-property-benifit`;

//         try {
//             setLoading(true);
//             const headers = getAuthHeaders();
            
//             const response = await fetch(url, {
//                 method: 'POST',
//                 headers: headers,
//                 body: JSON.stringify({
//                     title: formData.title,
//                     desc: formData.desc
//                 }),
//             });

//             if (response.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 setAuthError("Session expired. Please login again.");
//                 setTimeout(() => window.location.href = '/login', 2000);
//                 return;
//             }

//             const result = await response.json();

//             if (result.status) {
//                 await fetchBenefits(); 
//                 closeModal();
//             } else {
//                 alert(result.message || result.error || "Error saving data");
//             }
//         } catch (error) {
//             console.error("Save error:", error);
//             alert(error.message || "Network error. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!checkAuth()) return;
        
//         try {
//             setLoading(true);
//             const headers = getAuthHeaders();
            
//             const response = await fetch(`${API_BASE}/delete-property-benifit/${id}`, {
//                 method: 'DELETE',
//                 headers: headers
//             });
            
//             if (response.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 setAuthError("Session expired. Please login again.");
//                 setTimeout(() => window.location.href = '/login', 2000);
//                 return;
//             }
            
//             const result = await response.json();
//             if (result.status) {
//                 await fetchBenefits();
//                 setDeleteConfirm(null);
//             } else {
//                 alert(result.message || "Error deleting benefit");
//             }
//         } catch (error) {
//             console.error("Delete error:", error);
//             alert("Failed to delete benefit. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const openModal = (item = null) => {
//         if (item) {
//             setFormData({ id: item.id, title: item.title, desc: item.desc });
//             setIsEditing(true);
//         } else {
//             setFormData({ id: '', title: '', desc: '' });
//             setIsEditing(false);
//         }
//         setShowModal(true);
//     };

//     const closeModal = () => {
//         setShowModal(false);
//         setFormData({ id: '', title: '', desc: '' });
//         setIsEditing(false);
//     };

//     const filteredBenefits = benefits.filter(item =>
//         item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.desc?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = filteredBenefits.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(filteredBenefits.length / itemsPerPage);
//     const totalBenefits = benefits.length;

//     const currentTheme = theme || {
//         isDarkMode,
//         bg: isDarkMode ? '#0a0a1a' : '#f0f4ff',
//         card: isDarkMode ? '#141428' : '#ffffff',
//         cardHover: isDarkMode ? '#1e1e3a' : '#f8faff',
//         text: isDarkMode ? '#e8edf5' : '#1a2332',
//         textLight: isDarkMode ? '#8a8aa8' : '#64748b',
//         border: isDarkMode ? '#2a2a4a' : '#e2e8f0',
//         primary: '#6d2e1f',
//         primaryLight: '#8b3a28',
//         primaryGradient: 'linear-gradient(135deg, #6d2e1f 0%, #a0522d 50%, #cd853f 100%)',
//         danger: '#ef4444',
//         success: '#10b981',
//         warning: '#f59e0b',
//         shadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(109, 46, 31, 0.12)'
//     };

//     const styles = {
//         container: {
//             backgroundColor: currentTheme.bg,
//             minHeight: '100vh',
//             transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
//         },
//         mainContent: {
//             flex: 1,
//             overflowY: 'auto',
//             padding: '32px 36px'
//         },
//         pageHeader: {
//             marginBottom: '32px',
//             position: 'relative'
//         },
//         pageTitle: {
//             fontSize: '32px',
//             fontWeight: '800',
//             background: currentTheme.primaryGradient,
//             WebkitBackgroundClip: 'text',
//             WebkitTextFillColor: 'transparent',
//             marginBottom: '4px',
//             letterSpacing: '-0.5px'
//         },
//         pageSubtitle: {
//             color: currentTheme.textLight,
//             fontSize: '15px',
//             fontWeight: '400'
//         },
//         alert: {
//             padding: '14px 24px',
//             backgroundColor: 'rgba(109, 46, 31, 0.08)',
//             border: '1px solid rgba(109, 46, 31, 0.15)',
//             color: '#6d2e1f',
//             borderRadius: '12px',
//             marginBottom: '24px',
//             fontWeight: '500',
//             backdropFilter: 'blur(8px)'
//         },
//         statCards: {
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//             gap: '20px',
//             marginBottom: '32px'
//         },
//         statCard: {
//             backgroundColor: currentTheme.card,
//             borderRadius: '20px',
//             padding: '24px 22px',
//             border: `1px solid ${currentTheme.border}`,
//             transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
//             cursor: 'pointer',
//             position: 'relative',
//             overflow: 'hidden'
//         },
//         statCardGradient: {
//             position: 'absolute',
//             top: '-50%',
//             right: '-50%',
//             width: '100%',
//             height: '100%',
//             background: currentTheme.primaryGradient,
//             opacity: 0.05,
//             borderRadius: '50%'
//         },
//         statIcon: {
//             width: '48px',
//             height: '48px',
//             borderRadius: '14px',
//             background: currentTheme.primaryGradient,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             fontSize: '22px',
//             marginBottom: '14px',
//             color: 'white',
//             boxShadow: '0 4px 16px rgba(109, 46, 31, 0.3)'
//         },
//         statValue: {
//             fontSize: '30px',
//             fontWeight: '800',
//             color: currentTheme.text,
//             marginBottom: '2px',
//             letterSpacing: '-0.5px'
//         },
//         statLabel: {
//             fontSize: '13px',
//             color: currentTheme.textLight,
//             fontWeight: '500',
//             textTransform: 'uppercase',
//             letterSpacing: '0.5px'
//         },
//         toolbar: {
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginBottom: '28px',
//             flexWrap: 'wrap',
//             gap: '16px'
//         },
//         searchBox: {
//             padding: '12px 20px 12px 44px',
//             borderRadius: '14px',
//             border: `2px solid ${currentTheme.border}`,
//             backgroundColor: currentTheme.card,
//             color: currentTheme.text,
//             width: '320px',
//             fontSize: '14px',
//             outline: 'none',
//             transition: 'all 0.3s ease',
//             backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Ccircle cx=\'11\' cy=\'11\' r=\'8\'/%3E%3Cline x1=\'21\' y1=\'21\' x2=\'16.65\' y2=\'16.65\'/%3E%3C/svg%3E")',
//             backgroundPosition: '16px center',
//             backgroundRepeat: 'no-repeat',
//             backgroundSize: '18px'
//         },
//         addBtn: {
//             background: currentTheme.primaryGradient,
//             color: 'white',
//             border: 'none',
//             padding: '12px 32px',
//             borderRadius: '14px',
//             cursor: 'pointer',
//             fontSize: '14px',
//             fontWeight: '600',
//             transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '10px',
//             boxShadow: '0 4px 20px rgba(109, 46, 31, 0.35)',
//             position: 'relative',
//             overflow: 'hidden'
//         },
//         benefitsGrid: {
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
//             gap: '24px',
//             marginBottom: '30px'
//         },
//         benefitCard: {
//             backgroundColor: currentTheme.card,
//             borderRadius: '24px',
//             overflow: 'hidden',
//             border: `1px solid ${currentTheme.border}`,
//             transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
//             position: 'relative',
//             boxShadow: currentTheme.shadow
//         },
//         cardHeader: {
//             padding: '20px 24px',
//             background: currentTheme.primaryGradient,
//             color: 'white',
//             position: 'relative',
//             overflow: 'hidden'
//         },
//         cardHeaderDecoration: {
//             position: 'absolute',
//             top: '-30px',
//             right: '-30px',
//             width: '80px',
//             height: '80px',
//             borderRadius: '50%',
//             background: 'rgba(255,255,255,0.1)'
//         },
//         benefitTitle: {
//             fontSize: '18px',
//             fontWeight: '700',
//             marginBottom: '0',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '12px',
//             position: 'relative',
//             zIndex: 1
//         },
//         benefitBadge: {
//             background: 'rgba(255,255,255,0.2)',
//             padding: '2px 12px',
//             borderRadius: '20px',
//             fontSize: '11px',
//             fontWeight: '600',
//             textTransform: 'uppercase',
//             letterSpacing: '0.5px'
//         },
//         cardBody: {
//             padding: '22px 24px'
//         },
//         benefitDesc: {
//             fontSize: '14px',
//             color: currentTheme.textLight,
//             lineHeight: '1.7',
//             marginBottom: '18px',
//             minHeight: '60px'
//         },
//         cardFooter: {
//             display: 'flex',
//             gap: '10px',
//             paddingTop: '16px',
//             borderTop: `1px solid ${currentTheme.border}`
//         },
//         actionBtn: {
//             flex: 1,
//             padding: '10px 16px',
//             borderRadius: '12px',
//             border: 'none',
//             cursor: 'pointer',
//             transition: 'all 0.3s ease',
//             fontSize: '13px',
//             fontWeight: '600',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             gap: '8px'
//         },
//         editBtn: {
//             background: 'rgba(109, 46, 31, 0.1)',
//             color: currentTheme.primary,
//             border: '1px solid rgba(109, 46, 31, 0.15)'
//         },
//         deleteBtn: {
//             background: 'rgba(239, 68, 68, 0.1)',
//             color: currentTheme.danger,
//             border: '1px solid rgba(239, 68, 68, 0.15)'
//         },
//         pagination: {
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             gap: '6px',
//             marginTop: '8px'
//         },
//         pageBtn: {
//             width: '42px',
//             height: '42px',
//             borderRadius: '12px',
//             border: `1px solid ${currentTheme.border}`,
//             backgroundColor: currentTheme.card,
//             color: currentTheme.text,
//             cursor: 'pointer',
//             transition: 'all 0.3s ease',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             fontWeight: '600',
//             fontSize: '14px'
//         },
//         activePage: {
//             background: currentTheme.primaryGradient,
//             color: 'white',
//             border: 'none',
//             boxShadow: '0 4px 16px rgba(109, 46, 31, 0.3)'
//         },
//         emptyState: {
//             textAlign: 'center',
//             padding: '80px 20px',
//             color: currentTheme.textLight
//         },
//         loadingSpinner: {
//             textAlign: 'center',
//             padding: '80px 20px',
//             color: currentTheme.textLight
//         },
//         modalOverlay: {
//             position: 'fixed',
//             inset: 0,
//             backgroundColor: 'rgba(0,0,0,0.7)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             zIndex: 2000,
//             backdropFilter: 'blur(12px)',
//             animation: 'fadeIn 0.3s ease'
//         },
//         modal: {
//             backgroundColor: currentTheme.card,
//             borderRadius: '28px',
//             width: '520px',
//             maxWidth: '92%',
//             maxHeight: '90vh',
//             overflowY: 'auto',
//             boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
//             animation: 'slideUp 0.3s ease'
//         },
//         modalHeader: {
//             padding: '24px 28px',
//             borderBottom: `1px solid ${currentTheme.border}`,
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             position: 'sticky',
//             top: 0,
//             backgroundColor: currentTheme.card,
//             zIndex: 1,
//             borderRadius: '28px 28px 0 0'
//         },
//         modalBody: {
//             padding: '28px'
//         },
//         modalFooter: {
//             padding: '20px 28px',
//             borderTop: `1px solid ${currentTheme.border}`,
//             display: 'flex',
//             justifyContent: 'flex-end',
//             gap: '12px',
//             borderRadius: '0 0 28px 28px'
//         },
//         input: {
//             width: '100%',
//             padding: '12px 16px',
//             borderRadius: '12px',
//             border: `2px solid ${currentTheme.border}`,
//             backgroundColor: currentTheme.bg,
//             color: currentTheme.text,
//             fontSize: '14px',
//             outline: 'none',
//             transition: 'all 0.3s ease'
//         },
//         textarea: {
//             width: '100%',
//             padding: '12px 16px',
//             borderRadius: '12px',
//             border: `2px solid ${currentTheme.border}`,
//             backgroundColor: currentTheme.bg,
//             color: currentTheme.text,
//             fontSize: '14px',
//             outline: 'none',
//             resize: 'vertical',
//             minHeight: '100px',
//             transition: 'all 0.3s ease'
//         },
//         label: {
//             display: 'block',
//             marginBottom: '8px',
//             fontWeight: '600',
//             fontSize: '13px',
//             color: currentTheme.text,
//             letterSpacing: '0.3px'
//         },
//         buttonDisabled: {
//             opacity: 0.6,
//             cursor: 'not-allowed'
//         }
//     };

//     return (
//         <div style={styles.container}>
//             <style>
//                 {`
//                     @keyframes fadeIn {
//                         from { opacity: 0; }
//                         to { opacity: 1; }
//                     }
//                     @keyframes slideUp {
//                         from { transform: translateY(30px) scale(0.98); opacity: 0; }
//                         to { transform: translateY(0) scale(1); opacity: 1; }
//                     }
//                     @keyframes slideInRight {
//                         from { transform: translateX(100px); opacity: 0; }
//                         to { transform: translateX(0); opacity: 1; }
//                     }
//                     @keyframes pulse {
//                         0%, 100% { transform: scale(1); }
//                         50% { transform: scale(1.05); }
//                     }
//                     .stat-card:hover {
//                         transform: translateY(-6px) scale(1.01);
//                         box-shadow: 0 12px 40px rgba(109, 46, 31, 0.15);
//                     }
//                     .benefit-card:hover {
//                         transform: translateY(-8px);
//                         box-shadow: 0 16px 48px rgba(0,0,0,0.15);
//                     }
//                     .benefit-card:hover .card-header-decoration {
//                         transform: scale(1.5);
//                         opacity: 0.3;
//                     }
//                     button:hover:not(:disabled) {
//                         transform: translateY(-2px);
//                     }
//                     .search-box:focus {
//                         border-color: #6d2e1f;
//                         box-shadow: 0 0 0 4px rgba(109, 46, 31, 0.1);
//                         width: 380px;
//                     }
//                     .benefit-card {
//                         animation: slideUp 0.4s ease forwards;
//                     }
//                     .benefit-card:nth-child(2) { animation-delay: 0.05s; }
//                     .benefit-card:nth-child(3) { animation-delay: 0.1s; }
//                     .benefit-card:nth-child(4) { animation-delay: 0.15s; }
//                     .benefit-card:nth-child(5) { animation-delay: 0.2s; }
//                     .benefit-card:nth-child(6) { animation-delay: 0.25s; }
//                     .stat-card:nth-child(1) { animation: slideUp 0.4s ease; }
//                     .stat-card:nth-child(2) { animation: slideUp 0.4s ease 0.1s; }
//                     .stat-card:nth-child(3) { animation: slideUp 0.4s ease 0.2s; }
//                     .stat-card {
//                         animation-fill-mode: both;
//                     }
//                     .add-btn::before {
//                         content: '';
//                         position: absolute;
//                         top: -50%;
//                         left: -50%;
//                         width: 200%;
//                         height: 200%;
//                         background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
//                         transform: rotate(45deg) translateX(-100%);
//                         transition: transform 0.6s ease;
//                     }
//                     .add-btn:hover::before {
//                         transform: rotate(45deg) translateX(100%);
//                     }
//                     .page-btn:hover:not(:disabled) {
//                         background: ${currentTheme.primary};
//                         color: white;
//                         border-color: ${currentTheme.primary};
//                     }
//                     .action-btn-edit:hover {
//                         background: rgba(109, 46, 31, 0.2) !important;
//                         transform: translateY(-2px);
//                     }
//                     .action-btn-delete:hover {
//                         background: rgba(239, 68, 68, 0.2) !important;
//                         transform: translateY(-2px);
//                     }
//                     ::-webkit-scrollbar {
//                         width: 6px;
//                     }
//                     ::-webkit-scrollbar-track {
//                         background: ${currentTheme.bg};
//                     }
//                     ::-webkit-scrollbar-thumb {
//                         background: ${currentTheme.primary};
//                         border-radius: 10px;
//                     }
//                     ::-webkit-scrollbar-thumb:hover {
//                         background: ${currentTheme.primaryLight};
//                     }
//                 `}
//             </style>

//             <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
//                 <Sidebar theme={currentTheme} isCollapsed={isCollapsed} />

//                 <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
//                     <Header 
//                         theme={currentTheme}
//                         isDarkMode={isDarkMode}
//                         toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
//                         toggleSidebar={() => setIsCollapsed(!isCollapsed)}
//                     />

//                     <div style={styles.mainContent}>
//                         <div style={styles.pageHeader}>
//                             <h1 style={styles.pageTitle}>
//                                 ✨ Owner Benefits
//                             </h1>
//                             <p style={styles.pageSubtitle}>
//                                 Manage and organize property owner benefits & incentives
//                             </p>
//                         </div>

//                         {authError && (
//                             <div style={styles.alert}>
//                                 <i className="bi bi-exclamation-triangle-fill me-2"></i>
//                                 {authError}
//                             </div>
//                         )}

//                         <div style={styles.statCards}>
//                             <div className="stat-card" style={styles.statCard}>
//                                 <div style={styles.statCardGradient}></div>
//                                 <div style={styles.statIcon}>🎁</div>
//                                 <div style={styles.statValue}>{totalBenefits}</div>
//                                 <div style={styles.statLabel}>Total Benefits</div>
//                             </div>
//                             <div className="stat-card" style={styles.statCard}>
//                                 <div style={styles.statCardGradient}></div>
//                                 <div style={styles.statIcon}>⭐</div>
//                                 <div style={styles.statValue}>Premium</div>
//                                 <div style={styles.statLabel}>Quality Tier</div>
//                             </div>
//                             <div className="stat-card" style={styles.statCard}>
//                                 <div style={styles.statCardGradient}></div>
//                                 <div style={styles.statIcon}>💎</div>
//                                 <div style={styles.statValue}>Exclusive</div>
//                                 <div style={styles.statLabel}>Special Offers</div>
//                             </div>
//                         </div>

//                         <div style={styles.toolbar}>
//                             <input
//                                 type="text"
//                                 placeholder="Search benefits..."
//                                 style={styles.searchBox}
//                                 className="search-box"
//                                 value={searchTerm}
//                                 onChange={(e) => {
//                                     setSearchTerm(e.target.value);
//                                     setCurrentPage(1);
//                                 }}
//                             />
//                             <button 
//                                 style={styles.addBtn}
//                                 className="add-btn"
//                                 onClick={() => openModal()}
//                                 disabled={loading}
//                             >
//                                 <i className="bi bi-plus-circle"></i> 
//                                 Add New Benefit
//                             </button>
//                         </div>

//                         {loading && benefits.length === 0 ? (
//                             <div style={styles.loadingSpinner}>
//                                 <div className="spinner-border text-primary" role="status" style={{ width: '48px', height: '48px' }}>
//                                     <span className="visually-hidden">Loading...</span>
//                                 </div>
//                                 <p style={{ marginTop: '20px', fontWeight: '500' }}>Loading benefits...</p>
//                             </div>
//                         ) : currentItems.length > 0 ? (
//                             <>
//                                 <div style={styles.benefitsGrid}>
//                                     {currentItems.map((item) => (
//                                         <div key={item.id} className="benefit-card" style={styles.benefitCard}>
//                                             <div style={styles.cardHeader}>
//                                                 <div style={styles.cardHeaderDecoration} className="card-header-decoration"></div>
//                                                 <div style={styles.benefitTitle}>
//                                                     <i className="bi bi-gift-fill"></i>
//                                                     {item.title}
//                                                     <span style={styles.benefitBadge}>Active</span>
//                                                 </div>
//                                             </div>
//                                             <div style={styles.cardBody}>
//                                                 <p style={styles.benefitDesc}>
//                                                     {item.desc}
//                                                 </p>
//                                                 <div style={styles.cardFooter}>
//                                                     <button 
//                                                         style={{...styles.actionBtn, ...styles.editBtn}}
//                                                         className="action-btn-edit"
//                                                         onClick={() => openModal(item)}
//                                                         disabled={loading}
//                                                     >
//                                                         <i className="bi bi-pencil"></i> Edit
//                                                     </button>
//                                                     <button 
//                                                         style={{...styles.actionBtn, ...styles.deleteBtn}}
//                                                         className="action-btn-delete"
//                                                         onClick={() => setDeleteConfirm(item)}
//                                                         disabled={loading}
//                                                     >
//                                                         <i className="bi bi-trash"></i> Delete
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>

//                                 {totalPages > 1 && (
//                                     <div style={styles.pagination}>
//                                         <button
//                                             style={{...styles.pageBtn, ...(currentPage === 1 && { opacity: 0.4, cursor: 'not-allowed' })}}
//                                             className="page-btn"
//                                             onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                                             disabled={currentPage === 1}
//                                         >
//                                             ←
//                                         </button>
//                                         {[...Array(Math.min(totalPages, 5))].map((_, i) => {
//                                             let pageNum;
//                                             if (totalPages <= 5) {
//                                                 pageNum = i + 1;
//                                             } else if (currentPage <= 3) {
//                                                 pageNum = i + 1;
//                                             } else if (currentPage >= totalPages - 2) {
//                                                 pageNum = totalPages - 4 + i;
//                                             } else {
//                                                 pageNum = currentPage - 2 + i;
//                                             }
//                                             return (
//                                                 <button
//                                                     key={i}
//                                                     className="page-btn"
//                                                     style={{
//                                                         ...styles.pageBtn,
//                                                         ...(currentPage === pageNum && styles.activePage)
//                                                     }}
//                                                     onClick={() => setCurrentPage(pageNum)}
//                                                 >
//                                                     {pageNum}
//                                                 </button>
//                                             );
//                                         })}
//                                         <button
//                                             style={{...styles.pageBtn, ...(currentPage === totalPages && { opacity: 0.4, cursor: 'not-allowed' })}}
//                                             className="page-btn"
//                                             onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                                             disabled={currentPage === totalPages}
//                                         >
//                                             →
//                                         </button>
//                                     </div>
//                                 )}
//                             </>
//                         ) : (
//                             <div style={styles.emptyState}>
//                                 <div style={{ fontSize: '72px', marginBottom: '20px' }}>🎁</div>
//                                 <h4 style={{ fontWeight: '700', color: currentTheme.text }}>No Benefits Found</h4>
//                                 <p style={{ color: currentTheme.textLight, marginBottom: '24px' }}>
//                                     {searchTerm ? `No results found for "${searchTerm}"` : 'Start by adding your first benefit'}
//                                 </p>
//                                 {!searchTerm && (
//                                     <button style={styles.addBtn} onClick={() => openModal()}>
//                                         <i className="bi bi-plus-circle"></i> Add New Benefit
//                                     </button>
//                                 )}
//                             </div>
//                         )}
//                     </div>

//                     <Footer theme={currentTheme} />
//                 </div>
//             </div>

//             {showModal && (
//                 <div style={styles.modalOverlay} onClick={closeModal}>
//                     <div style={styles.modal} onClick={e => e.stopPropagation()}>
//                         <div style={styles.modalHeader}>
//                             <h5 style={{ margin: 0, fontWeight: '700', fontSize: '18px' }}>
//                                 {isEditing ? '✏️ Edit Benefit' : '✨ Add New Benefit'}
//                             </h5>
//                             <button 
//                                 onClick={closeModal}
//                                 style={{ 
//                                     background: 'none', 
//                                     border: 'none', 
//                                     fontSize: '28px', 
//                                     cursor: 'pointer', 
//                                     color: currentTheme.text,
//                                     width: '40px',
//                                     height: '40px',
//                                     borderRadius: '10px',
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     justifyContent: 'center',
//                                     transition: 'all 0.2s ease'
//                                 }}
//                                 onMouseEnter={(e) => e.currentTarget.style.background = currentTheme.border}
//                                 onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
//                             >
//                                 ×
//                             </button>
//                         </div>
//                         <form onSubmit={handleSave}>
//                             <div style={styles.modalBody}>
//                                 <div className="mb-4">
//                                     <label style={styles.label}>Benefit Title *</label>
//                                     <input 
//                                         type="text" 
//                                         style={styles.input}
//                                         value={formData.title}
//                                         required
//                                         onChange={(e) => setFormData({...formData, title: e.target.value})}
//                                         placeholder="Enter benefit title"
//                                         disabled={loading}
//                                         onFocus={(e) => e.currentTarget.style.borderColor = currentTheme.primary}
//                                         onBlur={(e) => e.currentTarget.style.borderColor = currentTheme.border}
//                                     />
//                                 </div>
//                                 <div className="mb-3">
//                                     <label style={styles.label}>Description *</label>
//                                     <textarea 
//                                         style={styles.textarea}
//                                         value={formData.desc}
//                                         required
//                                         onChange={(e) => setFormData({...formData, desc: e.target.value})}
//                                         placeholder="Enter benefit description"
//                                         disabled={loading}
//                                         onFocus={(e) => e.currentTarget.style.borderColor = currentTheme.primary}
//                                         onBlur={(e) => e.currentTarget.style.borderColor = currentTheme.border}
//                                     />
//                                 </div>
//                             </div>
//                             <div style={styles.modalFooter}>
//                                 <button 
//                                     type="button" 
//                                     onClick={closeModal}
//                                     style={{
//                                         padding: '10px 28px',
//                                         borderRadius: '12px',
//                                         border: `1px solid ${currentTheme.border}`,
//                                         backgroundColor: 'transparent',
//                                         color: currentTheme.text,
//                                         cursor: 'pointer',
//                                         fontWeight: '600',
//                                         fontSize: '14px',
//                                         transition: 'all 0.3s ease'
//                                     }}
//                                     disabled={loading}
//                                     onMouseEnter={(e) => e.currentTarget.style.background = currentTheme.border}
//                                     onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button 
//                                     type="submit" 
//                                     style={{...styles.addBtn, padding: '10px 36px', ...(loading && styles.buttonDisabled)}}
//                                     disabled={loading}
//                                 >
//                                     {loading ? (
//                                         <>
//                                             <span className="spinner-border spinner-border-sm me-2"></span>
//                                             {isEditing ? 'Updating...' : 'Saving...'}
//                                         </>
//                                     ) : (
//                                         <>
//                                             <i className={`bi ${isEditing ? 'bi-pencil' : 'bi-plus-circle'}`}></i>
//                                             {isEditing ? 'Update Benefit' : 'Save Benefit'}
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {deleteConfirm && (
//                 <div style={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
//                     <div style={{...styles.modal, width: '420px'}} onClick={e => e.stopPropagation()}>
//                         <div style={styles.modalHeader}>
//                             <h5 style={{ margin: 0, fontWeight: '700', fontSize: '18px' }}>⚠️ Confirm Delete</h5>
//                             <button 
//                                 onClick={() => setDeleteConfirm(null)} 
//                                 style={{ 
//                                     background: 'none', 
//                                     border: 'none', 
//                                     fontSize: '28px', 
//                                     cursor: 'pointer', 
//                                     color: currentTheme.text,
//                                     width: '40px',
//                                     height: '40px',
//                                     borderRadius: '10px',
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     justifyContent: 'center',
//                                     transition: 'all 0.2s ease'
//                                 }}
//                                 onMouseEnter={(e) => e.currentTarget.style.background = currentTheme.border}
//                                 onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
//                             >
//                                 ×
//                             </button>
//                         </div>
//                         <div style={styles.modalBody}>
//                             <div style={{ textAlign: 'center' }}>
//                                 <div style={{ fontSize: '56px', marginBottom: '16px' }}>🗑️</div>
//                                 <p style={{ fontSize: '16px', fontWeight: '500', color: currentTheme.text }}>
//                                     Are you sure you want to delete <br />
//                                     <strong style={{ color: currentTheme.primary }}>"{deleteConfirm.title}"</strong>?
//                                 </p>
//                                 <p style={{ fontSize: '13px', color: currentTheme.textLight, marginTop: '8px' }}>
//                                     This action cannot be undone.
//                                 </p>
//                             </div>
//                         </div>
//                         <div style={styles.modalFooter}>
//                             <button 
//                                 onClick={() => setDeleteConfirm(null)} 
//                                 style={{
//                                     padding: '10px 28px',
//                                     borderRadius: '12px',
//                                     border: `1px solid ${currentTheme.border}`,
//                                     backgroundColor: 'transparent',
//                                     color: currentTheme.text,
//                                     cursor: 'pointer',
//                                     fontWeight: '600',
//                                     fontSize: '14px',
//                                     transition: 'all 0.3s ease'
//                                 }}
//                                 disabled={loading}
//                                 onMouseEnter={(e) => e.currentTarget.style.background = currentTheme.border}
//                                 onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
//                             >
//                                 Cancel
//                             </button>
//                             <button 
//                                 onClick={() => handleDelete(deleteConfirm.id)} 
//                                 style={{
//                                     padding: '10px 32px',
//                                     borderRadius: '12px',
//                                     border: 'none',
//                                     backgroundColor: currentTheme.danger,
//                                     color: 'white',
//                                     cursor: 'pointer',
//                                     fontWeight: '600',
//                                     fontSize: '14px',
//                                     transition: 'all 0.3s ease',
//                                     boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)',
//                                     ...(loading && styles.buttonDisabled)
//                                 }}
//                                 disabled={loading}
//                             >
//                                 {loading ? (
//                                     <>
//                                         <span className="spinner-border spinner-border-sm me-2"></span>
//                                         Deleting...
//                                     </>
//                                 ) : (
//                                     'Delete Permanently'
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default OwnerBenefit;


// import React, { useState, useEffect } from 'react';
// import Header from './Header';
// import Footer from './Footer';
// import Sidebar from './Sidebar';

// const OwnerBenefit = ({ theme }) => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [deleteConfirm, setDeleteConfirm] = useState(null);
//     const [authError, setAuthError] = useState(null);
//     const itemsPerPage = 6;

//     const [benefits, setBenefits] = useState([]);
//     const [formData, setFormData] = useState({ id: '', title: '', desc: '' });
//     const [isEditing, setIsEditing] = useState(false);

//     const API_BASE = import.meta.env.VITE_BASE_URL;

//     const getAuthHeaders = () => {
//         const token = localStorage.getItem('token');
//         return {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//             'Role': localStorage.getItem('Role') || 'admin'
//         };
//     };

//     const checkAuth = () => {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             setAuthError("Please login to access this page");
//             setTimeout(() => window.location.href = '/login', 2000);
//             return false;
//         }
//         return true;
//     };

//     const fetchBenefits = async () => {
//         if (!checkAuth()) return;

//         try {
//             setLoading(true);
//             setAuthError(null);

//             const headers = getAuthHeaders();
//             const response = await fetch(`${API_BASE}/get-property-benifit`, {
//                 method: 'GET',
//                 headers: headers
//             });

//             if (response.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 setAuthError("Session expired. Please login again.");
//                 setTimeout(() => window.location.href = '/login', 2000);
//                 return;
//             }

//             const result = await response.json();

//             if (result.status && result.data && Array.isArray(result.data.data)) {
//                 setBenefits(result.data.data);
//             } else {
//                 setBenefits([]);
//             }
//         } catch (error) {
//             console.error("Fetch error:", error);
//             setBenefits([]);
//             setAuthError("Failed to fetch benefits. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchBenefits();
//     }, []);

//     const handleSave = async (e) => {
//         e.preventDefault();

//         if (!checkAuth()) return;

//         const url = isEditing
//             ? `${API_BASE}/edit-property-benifit/${formData.id}`
//             : `${API_BASE}/add-property-benifit`;

//         try {
//             setLoading(true);
//             const headers = getAuthHeaders();

//             const response = await fetch(url, {
//                 method: 'POST',
//                 headers: headers,
//                 body: JSON.stringify({
//                     title: formData.title,
//                     desc: formData.desc
//                 }),
//             });

//             if (response.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 setAuthError("Session expired. Please login again.");
//                 setTimeout(() => window.location.href = '/login', 2000);
//                 return;
//             }

//             const result = await response.json();

//             if (result.status) {
//                 await fetchBenefits();
//                 closeModal();
//             } else {
//                 alert(result.message || result.error || "Error saving data");
//             }
//         } catch (error) {
//             console.error("Save error:", error);
//             alert(error.message || "Network error. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!checkAuth()) return;

//         try {
//             setLoading(true);
//             const headers = getAuthHeaders();

//             const response = await fetch(`${API_BASE}/delete-property-benifit/${id}`, {
//                 method: 'DELETE',
//                 headers: headers
//             });

//             if (response.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 setAuthError("Session expired. Please login again.");
//                 setTimeout(() => window.location.href = '/login', 2000);
//                 return;
//             }

//             const result = await response.json();
//             if (result.status) {
//                 await fetchBenefits();
//                 setDeleteConfirm(null);
//             } else {
//                 alert(result.message || "Error deleting benefit");
//             }
//         } catch (error) {
//             console.error("Delete error:", error);
//             alert("Failed to delete benefit. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const openModal = (item = null) => {
//         if (item) {
//             setFormData({ id: item.id, title: item.title, desc: item.desc });
//             setIsEditing(true);
//         } else {
//             setFormData({ id: '', title: '', desc: '' });
//             setIsEditing(false);
//         }
//         setShowModal(true);
//     };

//     const closeModal = () => {
//         setShowModal(false);
//         setFormData({ id: '', title: '', desc: '' });
//         setIsEditing(false);
//     };

//     const filteredBenefits = benefits.filter(item =>
//         item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.desc?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = filteredBenefits.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(filteredBenefits.length / itemsPerPage);
//     const totalBenefits = benefits.length;

//     // ---- Editorial monochrome theme ----
//     const currentTheme = theme || {
//         isDarkMode,
//         bg: isDarkMode ? '#080808' : '#fdfdfc',
//         card: isDarkMode ? '#111111' : '#ffffff',
//         ink: isDarkMode ? '#f5f5f3' : '#0d0d0c',
//         muted: isDarkMode ? '#9c9c98' : '#6f6f6b',
//         line: isDarkMode ? '#262624' : '#e4e2dd',
//         lineStrong: isDarkMode ? '#3a3a37' : '#0d0d0c',
//         danger: '#8c2f24',
//     };

//     const serif = "'Playfair Display', Georgia, 'Times New Roman', serif";
//     const sans = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

//     const styles = {
//         container: {
//             backgroundColor: currentTheme.bg,
//             minHeight: '100vh',
//             fontFamily: sans,
//             transition: 'background-color 0.3s ease'
//         },
//         mainContent: {
//             flex: 1,
//             overflowY: 'auto',
//             padding: '44px 56px'
//         },
//         masthead: {
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'flex-end',
//             paddingBottom: '22px',
//             borderBottom: `2px solid ${currentTheme.lineStrong}`,
//             marginBottom: '20px',
//             flexWrap: 'wrap',
//             gap: '20px'
//         },
//         pageTitle: {
//             fontFamily: serif,
//             fontSize: '40px',
//             fontWeight: '700',
//             color: currentTheme.ink,
//             letterSpacing: '-0.5px',
//             lineHeight: 1.1,
//             margin: 0
//         },
//         pageSubtitle: {
//             color: currentTheme.muted,
//             fontSize: '14.5px',
//             marginTop: '8px',
//             fontStyle: 'italic',
//             fontFamily: serif
//         },
//         metrics: {
//             display: 'flex',
//             gap: '36px'
//         },
//         metricItem: {
//             textAlign: 'right'
//         },
//         metricValue: {
//             fontFamily: serif,
//             fontSize: '26px',
//             fontWeight: '700',
//             color: currentTheme.ink,
//             lineHeight: 1
//         },
//         metricLabel: {
//             fontSize: '12px',
//             color: currentTheme.muted,
//             marginTop: '4px'
//         },
//         alert: {
//             padding: '13px 18px',
//             backgroundColor: 'transparent',
//             borderLeft: `3px solid ${currentTheme.danger}`,
//             color: currentTheme.ink,
//             marginBottom: '24px',
//             fontSize: '14px'
//         },
//         toolbar: {
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginBottom: '8px',
//             flexWrap: 'wrap',
//             gap: '16px'
//         },
//         searchWrap: {
//             position: 'relative',
//             width: '280px'
//         },
//         searchBox: {
//             width: '100%',
//             padding: '9px 4px 9px 26px',
//             border: 'none',
//             borderBottom: `1.5px solid ${currentTheme.line}`,
//             backgroundColor: 'transparent',
//             color: currentTheme.ink,
//             fontSize: '14px',
//             outline: 'none',
//             transition: 'border-color 0.25s ease'
//         },
//         searchIcon: {
//             position: 'absolute',
//             left: 0,
//             top: '50%',
//             transform: 'translateY(-50%)',
//             color: currentTheme.muted,
//             fontSize: '13px',
//             pointerEvents: 'none'
//         },
//         addBtn: {
//             backgroundColor: currentTheme.ink,
//             color: currentTheme.bg,
//             border: `1.5px solid ${currentTheme.ink}`,
//             padding: '11px 26px',
//             borderRadius: '2px',
//             cursor: 'pointer',
//             fontSize: '13.5px',
//             fontWeight: '600',
//             letterSpacing: '0.2px',
//             transition: 'transform 0.15s ease, opacity 0.15s ease',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px'
//         },
//         list: {
//             marginTop: '18px',
//             borderTop: `1px solid ${currentTheme.line}`
//         },
//         row: {
//             display: 'flex',
//             gap: '28px',
//             padding: '26px 4px',
//             borderBottom: `1px solid ${currentTheme.line}`,
//             transition: 'background-color 0.2s ease',
//             alignItems: 'flex-start'
//         },
//         rowIndex: {
//             fontFamily: serif,
//             fontSize: '28px',
//             color: currentTheme.line,
//             fontWeight: '700',
//             minWidth: '52px',
//             transition: 'color 0.2s ease'
//         },
//         rowBody: {
//             flex: 1,
//             minWidth: 0
//         },
//         rowTop: {
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'flex-start',
//             gap: '16px'
//         },
//         rowTitle: {
//             fontFamily: serif,
//             fontSize: '20px',
//             fontWeight: '700',
//             color: currentTheme.ink,
//             margin: 0
//         },
//         rowDesc: {
//             fontSize: '14px',
//             color: currentTheme.muted,
//             lineHeight: '1.65',
//             marginTop: '8px',
//             maxWidth: '620px'
//         },
//         rowActions: {
//             display: 'flex',
//             gap: '18px',
//             flexShrink: 0
//         },
//         linkBtn: {
//             background: 'none',
//             border: 'none',
//             padding: 0,
//             fontSize: '13px',
//             fontWeight: '600',
//             cursor: 'pointer',
//             color: currentTheme.ink,
//             borderBottom: '1px solid transparent',
//             transition: 'border-color 0.2s ease',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '6px'
//         },
//         deleteLink: {
//             color: currentTheme.danger
//         },
//         pagination: {
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             gap: '22px',
//             marginTop: '36px'
//         },
//         pageNum: {
//             background: 'none',
//             border: 'none',
//             fontFamily: serif,
//             fontSize: '15px',
//             color: currentTheme.muted,
//             cursor: 'pointer',
//             padding: '4px 2px',
//             borderBottom: '1.5px solid transparent',
//             transition: 'all 0.2s ease'
//         },
//         pageNumActive: {
//             color: currentTheme.ink,
//             borderBottom: `1.5px solid ${currentTheme.ink}`
//         },
//         pageArrow: {
//             background: 'none',
//             border: 'none',
//             fontSize: '18px',
//             color: currentTheme.ink,
//             cursor: 'pointer',
//             transition: 'opacity 0.2s ease'
//         },
//         emptyState: {
//             textAlign: 'center',
//             padding: '90px 20px',
//             borderTop: `1px solid ${currentTheme.line}`,
//             borderBottom: `1px solid ${currentTheme.line}`
//         },
//         emptyTitle: {
//             fontFamily: serif,
//             fontSize: '26px',
//             fontWeight: '700',
//             color: currentTheme.ink
//         },
//         loadingState: {
//             textAlign: 'center',
//             padding: '90px 20px',
//             color: currentTheme.muted,
//             fontFamily: serif,
//             fontStyle: 'italic',
//             fontSize: '16px'
//         },
//         modalOverlay: {
//             position: 'fixed',
//             inset: 0,
//             backgroundColor: 'rgba(10,10,10,0.55)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             zIndex: 2000,
//             animation: 'fadeIn 0.2s ease'
//         },
//         modal: {
//             backgroundColor: currentTheme.card,
//             borderRadius: '2px',
//             width: '480px',
//             maxWidth: '92%',
//             maxHeight: '90vh',
//             overflowY: 'auto',
//             border: `1px solid ${currentTheme.lineStrong}`,
//             animation: 'slideUp 0.25s ease'
//         },
//         modalHeader: {
//             padding: '26px 30px 18px',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'flex-start',
//             position: 'sticky',
//             top: 0,
//             backgroundColor: currentTheme.card,
//             zIndex: 1
//         },
//         modalTitle: {
//             margin: 0,
//             fontFamily: serif,
//             fontWeight: '700',
//             fontSize: '22px',
//             color: currentTheme.ink
//         },
//         modalBody: {
//             padding: '4px 30px 26px'
//         },
//         modalFooter: {
//             padding: '20px 30px',
//             borderTop: `1px solid ${currentTheme.line}`,
//             display: 'flex',
//             justifyContent: 'flex-end',
//             gap: '14px'
//         },
//         input: {
//             width: '100%',
//             padding: '10px 2px',
//             border: 'none',
//             borderBottom: `1.5px solid ${currentTheme.line}`,
//             backgroundColor: 'transparent',
//             color: currentTheme.ink,
//             fontSize: '15px',
//             outline: 'none',
//             transition: 'border-color 0.2s ease'
//         },
//         textarea: {
//             width: '100%',
//             padding: '10px 2px',
//             border: 'none',
//             borderBottom: `1.5px solid ${currentTheme.line}`,
//             backgroundColor: 'transparent',
//             color: currentTheme.ink,
//             fontSize: '15px',
//             outline: 'none',
//             resize: 'vertical',
//             minHeight: '90px',
//             fontFamily: sans,
//             transition: 'border-color 0.2s ease'
//         },
//         label: {
//             display: 'block',
//             marginBottom: '8px',
//             fontWeight: '600',
//             fontSize: '12px',
//             color: currentTheme.muted
//         },
//         cancelBtn: {
//             padding: '9px 4px',
//             border: 'none',
//             backgroundColor: 'transparent',
//             color: currentTheme.muted,
//             cursor: 'pointer',
//             fontWeight: '600',
//             fontSize: '13.5px',
//             transition: 'color 0.2s ease'
//         },
//         deleteConfirmBtn: {
//             padding: '10px 26px',
//             borderRadius: '2px',
//             border: `1.5px solid ${currentTheme.danger}`,
//             backgroundColor: currentTheme.danger,
//             color: '#fdfdfc',
//             cursor: 'pointer',
//             fontWeight: '600',
//             fontSize: '13.5px',
//             transition: 'opacity 0.2s ease'
//         },
//         buttonDisabled: {
//             opacity: 0.5,
//             cursor: 'not-allowed'
//         }
//     };

//     return (
//         <div style={styles.container}>
//             <style>
//                 {`
//                     @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');

//                     @keyframes fadeIn {
//                         from { opacity: 0; }
//                         to { opacity: 1; }
//                     }
//                     @keyframes slideUp {
//                         from { transform: translateY(14px); opacity: 0; }
//                         to { transform: translateY(0); opacity: 1; }
//                     }
//                     .benefit-row {
//                         cursor: default;
//                     }
//                     .benefit-row:hover {
//                         background-color: ${currentTheme.isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)'};
//                     }
//                     .benefit-row:hover .row-index {
//                         color: ${currentTheme.ink} !important;
//                     }
//                     .link-btn:hover {
//                         border-bottom-color: currentColor !important;
//                     }
//                     .add-btn:hover:not(:disabled) {
//                         transform: translateY(-1px);
//                         opacity: 0.88;
//                     }
//                     .cancel-btn:hover:not(:disabled) {
//                         color: ${currentTheme.ink} !important;
//                     }
//                     .search-box:focus {
//                         border-bottom-color: ${currentTheme.ink} !important;
//                     }
//                     .page-arrow:hover:not(:disabled) {
//                         opacity: 0.6;
//                     }
//                     input:focus, textarea:focus {
//                         border-bottom-color: ${currentTheme.ink} !important;
//                     }
//                     ::-webkit-scrollbar {
//                         width: 6px;
//                     }
//                     ::-webkit-scrollbar-track {
//                         background: ${currentTheme.bg};
//                     }
//                     ::-webkit-scrollbar-thumb {
//                         background: ${currentTheme.line};
//                         border-radius: 10px;
//                     }
//                 `}
//             </style>

//             <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
//                 <Sidebar theme={currentTheme} isCollapsed={isCollapsed} />

//                 <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
//                     <Header
//                         theme={currentTheme}
//                         isDarkMode={isDarkMode}
//                         toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
//                         toggleSidebar={() => setIsCollapsed(!isCollapsed)}
//                     />

//                     <div style={styles.mainContent}>
//                         <div style={styles.masthead}>
//                             <div>
//                                 <h1 style={styles.pageTitle}>Owner Benefits</h1>
//                                 <p style={styles.pageSubtitle}>Incentives & privileges extended to property owners</p>
//                             </div>
//                             <div style={styles.metrics}>
//                                 <div style={styles.metricItem}>
//                                     <div style={styles.metricValue}>{totalBenefits}</div>
//                                     <div style={styles.metricLabel}>Total</div>
//                                 </div>
//                                 <div style={styles.metricItem}>
//                                     <div style={styles.metricValue}>Premium</div>
//                                     <div style={styles.metricLabel}>Tier</div>
//                                 </div>
//                                 <div style={styles.metricItem}>
//                                     <div style={styles.metricValue}>Exclusive</div>
//                                     <div style={styles.metricLabel}>Access</div>
//                                 </div>
//                             </div>
//                         </div>

//                         {authError && (
//                             <div style={styles.alert}>{authError}</div>
//                         )}

//                         <div style={styles.toolbar}>
//                             <div style={styles.searchWrap}>
//                                 <i className="bi bi-search" style={styles.searchIcon}></i>
//                                 <input
//                                     type="text"
//                                     placeholder="Search benefits"
//                                     style={styles.searchBox}
//                                     className="search-box"
//                                     value={searchTerm}
//                                     onChange={(e) => {
//                                         setSearchTerm(e.target.value);
//                                         setCurrentPage(1);
//                                     }}
//                                 />
//                             </div>
//                             <button
//                                 style={styles.addBtn}
//                                 className="add-btn"
//                                 onClick={() => openModal()}
//                                 disabled={loading}
//                             >
//                                 <i className="bi bi-plus"></i>
//                                 Add new benefit
//                             </button>
//                         </div>

//                         {loading && benefits.length === 0 ? (
//                             <div style={styles.loadingState}>Loading benefits…</div>
//                         ) : currentItems.length > 0 ? (
//                             <>
//                                 <div style={styles.list}>
//                                     {currentItems.map((item, i) => (
//                                         <div key={item.id} className="benefit-row" style={styles.row}>
//                                             <div className="row-index" style={styles.rowIndex}>
//                                                 {String(indexOfFirstItem + i + 1).padStart(2, '0')}
//                                             </div>
//                                             <div style={styles.rowBody}>
//                                                 <div style={styles.rowTop}>
//                                                     <h3 style={styles.rowTitle}>{item.title}</h3>
//                                                     <div style={styles.rowActions}>
//                                                         <button
//                                                             style={styles.linkBtn}
//                                                             className="link-btn"
//                                                             onClick={() => openModal(item)}
//                                                             disabled={loading}
//                                                         >
//                                                             <i className="bi bi-pencil"></i> Edit
//                                                         </button>
//                                                         <button
//                                                             style={{...styles.linkBtn, ...styles.deleteLink}}
//                                                             className="link-btn"
//                                                             onClick={() => setDeleteConfirm(item)}
//                                                             disabled={loading}
//                                                         >
//                                                             <i className="bi bi-trash"></i> Delete
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                                 <p style={styles.rowDesc}>{item.desc}</p>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>

//                                 {totalPages > 1 && (
//                                     <div style={styles.pagination}>
//                                         <button
//                                             style={styles.pageArrow}
//                                             className="page-arrow"
//                                             onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                                             disabled={currentPage === 1}
//                                         >
//                                             ←
//                                         </button>
//                                         {[...Array(Math.min(totalPages, 5))].map((_, i) => {
//                                             let pageNum;
//                                             if (totalPages <= 5) {
//                                                 pageNum = i + 1;
//                                             } else if (currentPage <= 3) {
//                                                 pageNum = i + 1;
//                                             } else if (currentPage >= totalPages - 2) {
//                                                 pageNum = totalPages - 4 + i;
//                                             } else {
//                                                 pageNum = currentPage - 2 + i;
//                                             }
//                                             return (
//                                                 <button
//                                                     key={i}
//                                                     style={{
//                                                         ...styles.pageNum,
//                                                         ...(currentPage === pageNum && styles.pageNumActive)
//                                                     }}
//                                                     onClick={() => setCurrentPage(pageNum)}
//                                                 >
//                                                     {pageNum}
//                                                 </button>
//                                             );
//                                         })}
//                                         <button
//                                             style={styles.pageArrow}
//                                             className="page-arrow"
//                                             onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                                             disabled={currentPage === totalPages}
//                                         >
//                                             →
//                                         </button>
//                                     </div>
//                                 )}
//                             </>
//                         ) : (
//                             <div style={styles.emptyState}>
//                                 <h4 style={styles.emptyTitle}>No benefits found</h4>
//                                 <p style={{ color: currentTheme.muted, marginTop: '10px', marginBottom: '22px' }}>
//                                     {searchTerm ? `Nothing matches "${searchTerm}"` : 'Start by adding the first benefit'}
//                                 </p>
//                                 {!searchTerm && (
//                                     <button style={styles.addBtn} className="add-btn" onClick={() => openModal()}>
//                                         <i className="bi bi-plus"></i> Add new benefit
//                                     </button>
//                                 )}
//                             </div>
//                         )}
//                     </div>

//                     <Footer theme={currentTheme} />
//                 </div>
//             </div>

//             {showModal && (
//                 <div style={styles.modalOverlay} onClick={closeModal}>
//                     <div style={styles.modal} onClick={e => e.stopPropagation()}>
//                         <div style={styles.modalHeader}>
//                             <h5 style={styles.modalTitle}>
//                                 {isEditing ? 'Edit benefit' : 'Add a new benefit'}
//                             </h5>
//                             <button
//                                 onClick={closeModal}
//                                 style={{
//                                     background: 'none',
//                                     border: 'none',
//                                     fontSize: '22px',
//                                     lineHeight: 1,
//                                     cursor: 'pointer',
//                                     color: currentTheme.muted
//                                 }}
//                             >
//                                 ×
//                             </button>
//                         </div>
//                         <form onSubmit={handleSave}>
//                             <div style={styles.modalBody}>
//                                 <div className="mb-4">
//                                     <label style={styles.label}>Benefit title</label>
//                                     <input
//                                         type="text"
//                                         style={styles.input}
//                                         value={formData.title}
//                                         required
//                                         onChange={(e) => setFormData({...formData, title: e.target.value})}
//                                         placeholder="e.g. Airport pickup service"
//                                         disabled={loading}
//                                     />
//                                 </div>
//                                 <div className="mb-3">
//                                     <label style={styles.label}>Description</label>
//                                     <textarea
//                                         style={styles.textarea}
//                                         value={formData.desc}
//                                         required
//                                         onChange={(e) => setFormData({...formData, desc: e.target.value})}
//                                         placeholder="Describe what this benefit includes"
//                                         disabled={loading}
//                                     />
//                                 </div>
//                             </div>
//                             <div style={styles.modalFooter}>
//                                 <button
//                                     type="button"
//                                     onClick={closeModal}
//                                     style={styles.cancelBtn}
//                                     className="cancel-btn"
//                                     disabled={loading}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     style={{...styles.addBtn, padding: '10px 28px', ...(loading && styles.buttonDisabled)}}
//                                     className="add-btn"
//                                     disabled={loading}
//                                 >
//                                     {loading ? (
//                                         <>
//                                             <span className="spinner-border spinner-border-sm me-2"></span>
//                                             {isEditing ? 'Updating…' : 'Saving…'}
//                                         </>
//                                     ) : (
//                                         isEditing ? 'Update benefit' : 'Save benefit'
//                                     )}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {deleteConfirm && (
//                 <div style={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
//                     <div style={{...styles.modal, width: '400px'}} onClick={e => e.stopPropagation()}>
//                         <div style={styles.modalHeader}>
//                             <h5 style={styles.modalTitle}>Confirm deletion</h5>
//                             <button
//                                 onClick={() => setDeleteConfirm(null)}
//                                 style={{
//                                     background: 'none',
//                                     border: 'none',
//                                     fontSize: '22px',
//                                     lineHeight: 1,
//                                     cursor: 'pointer',
//                                     color: currentTheme.muted
//                                 }}
//                             >
//                                 ×
//                             </button>
//                         </div>
//                         <div style={styles.modalBody}>
//                             <p style={{ fontSize: '15px', color: currentTheme.ink, lineHeight: 1.6 }}>
//                                 Remove <strong>"{deleteConfirm.title}"</strong> from the benefits list? This action cannot be undone.
//                             </p>
//                         </div>
//                         <div style={styles.modalFooter}>
//                             <button
//                                 onClick={() => setDeleteConfirm(null)}
//                                 style={styles.cancelBtn}
//                                 className="cancel-btn"
//                                 disabled={loading}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={() => handleDelete(deleteConfirm.id)}
//                                 style={{...styles.deleteConfirmBtn, ...(loading && styles.buttonDisabled)}}
//                                 disabled={loading}
//                             >
//                                 {loading ? (
//                                     <>
//                                         <span className="spinner-border spinner-border-sm me-2"></span>
//                                         Deleting…
//                                     </>
//                                 ) : (
//                                     'Delete permanently'
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default OwnerBenefit;



import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const ITEMS_PER_PAGE = 6;
const EMPTY_FORM = { id: '', title: '', desc: '' };

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
            width: '100%', maxWidth: width || '480px', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column', animation: 'slideUp .2s ease'
        }}>
            <div style={{
                padding: '18px 22px', borderBottom: `1px solid ${theme.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <h5 style={{ margin: 0, fontWeight: 600 }}>{title}</h5>
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '22px', color: theme.text, opacity: 0.6, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '22px', overflowY: 'auto' }}>{children}</div>
            {footer && (
                <div style={{ padding: '16px 22px', borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    {footer}
                </div>
            )}
        </div>
    </div>
);

const OwnerBenefit = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [benefits, setBenefits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const API_BASE = import.meta.env.VITE_BASE_URL;

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

    const getAuthHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
        Role: localStorage.getItem('Role') || 'admin'
    });

    const checkAuth = () => {
        if (!localStorage.getItem('token')) {
            setAuthError('Please login to access this page');
            setTimeout(() => { window.location.href = '/login'; }, 2000);
            return false;
        }
        return true;
    };

    const handleAuthFailure = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('Role');
        setAuthError('Session expired. Please login again.');
        setTimeout(() => { window.location.href = '/login'; }, 2000);
    };

    const fetchBenefits = async () => {
        if (!checkAuth()) return;
        setLoading(true);
        setAuthError(null);
        try {
            const res = await fetch(`${API_BASE}/get-property-benifit`, { headers: getAuthHeaders() });
            if (res.status === 401) return handleAuthFailure();
            const result = await res.json();
            setBenefits(result.status && Array.isArray(result.data?.data) ? result.data.data : []);
        } catch (err) {
            console.error('Fetch error:', err);
            setBenefits([]);
            setAuthError('Failed to fetch benefits. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBenefits(); }, []);

    const openModal = (item = null) => {
        if (item) {
            setFormData({ id: item.id, title: item.title, desc: item.desc });
            setIsEditing(true);
        } else {
            setFormData(EMPTY_FORM);
            setIsEditing(false);
        }
        setShowModal(true);
    };

    const closeModal = () => { setShowModal(false); setFormData(EMPTY_FORM); setIsEditing(false); };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!checkAuth()) return;
        setLoading(true);
        try {
            const url = isEditing ? `${API_BASE}/edit-property-benifit/${formData.id}` : `${API_BASE}/add-property-benifit`;
            const res = await fetch(url, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ title: formData.title, desc: formData.desc })
            });
            if (res.status === 401) return handleAuthFailure();
            const result = await res.json();
            if (result.status) {
                await fetchBenefits();
                closeModal();
            } else {
                alert(result.message || result.error || 'Error saving data');
            }
        } catch (err) {
            console.error('Save error:', err);
            alert(err.message || 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!checkAuth()) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/delete-property-benifit/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
            if (res.status === 401) return handleAuthFailure();
            const result = await res.json();
            if (result.status) {
                await fetchBenefits();
                setDeleteConfirm(null);
            } else {
                alert(result.message || 'Error deleting benefit');
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete benefit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filteredBenefits = benefits.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.desc?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalPages = Math.ceil(filteredBenefits.length / ITEMS_PER_PAGE);
    const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = filteredBenefits.slice(indexOfFirstItem, indexOfFirstItem + ITEMS_PER_PAGE);

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }}>
            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
                <Sidebar theme={theme} isCollapsed={isCollapsed} />

                <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                    <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />

                    <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
                        <div style={{ marginBottom: '26px' }}>
                            <h1 style={{ fontSize: '26px', fontWeight: 700, color: theme.text, margin: 0 }}>Owner Benefits</h1>
                            <p style={{ color: theme.textLight, margin: '4px 0 0' }}>Manage and organize property owner benefits & incentives</p>
                        </div>

                        {authError && (
                            <div className="alert" role="alert" style={{ border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text }}>
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>{authError}
                            </div>
                        )}

                        {/* Stats */}
                        <div className="row g-3 mb-4">
                            {[
                                { label: 'Total Benefits', value: benefits.length },
                                { label: 'Quality Tier', value: 'Premium' },
                                { label: 'Special Offers', value: 'Exclusive' }
                            ].map(stat => (
                                <div className="col-6 col-md-4" key={stat.label}>
                                    <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '18px' }}>
                                        <div style={{ fontSize: '22px', fontWeight: 700, color: theme.text }}>{stat.value}</div>
                                        <div style={{ fontSize: '13px', color: theme.textLight, fontWeight: 500 }}>{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Toolbar */}
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                            <input
                                type="text"
                                placeholder="Search benefits..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                style={{ ...fieldStyle, width: '300px', backgroundColor: theme.card }}
                            />
                            <button
                                onClick={() => openModal()}
                                disabled={loading}
                                style={{ backgroundColor: accent, color: accentOn, border: 'none', padding: '10px 22px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                            >
                                <i className="bi bi-plus-circle me-2"></i>Add New Benefit
                            </button>
                        </div>

                        {/* Benefits Grid */}
                        {loading && benefits.length === 0 ? (
                            <div className="text-center py-5">
                                <div className="spinner-border" style={{ color: accent }} role="status"></div>
                                <p className="mt-3" style={{ color: theme.textLight }}>Loading benefits...</p>
                            </div>
                        ) : currentItems.length > 0 ? (
                            <>
                                <div className="row g-3">
                                    {currentItems.map(item => (
                                        <div className="col-md-6 col-lg-4" key={item.id}>
                                            <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', overflow: 'hidden', height: '100%' }}>
                                                <div style={{ padding: '16px 18px', borderBottom: `1px solid ${theme.border}` }}>
                                                    <div className="d-flex align-items-center gap-2" style={{ color: theme.text, fontWeight: 700, fontSize: '16px' }}>
                                                        <i className="bi bi-gift-fill"></i>
                                                        {item.title}
                                                    </div>
                                                </div>
                                                <div style={{ padding: '18px' }}>
                                                    <p style={{ fontSize: '13px', color: theme.textLight, lineHeight: 1.6, minHeight: '50px' }}>
                                                        {item.desc}
                                                    </p>
                                                    <div className="d-flex gap-2" style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '12px' }}>
                                                        <button className="btn btn-sm btn-outline-dark flex-fill" onClick={() => openModal(item)} disabled={loading}>
                                                            <i className="bi bi-pencil"></i> Edit
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-dark flex-fill" onClick={() => setDeleteConfirm(item)} disabled={loading}>
                                                            <i className="bi bi-trash"></i> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-center gap-2 mt-4">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            style={{ width: '36px', height: '36px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text, opacity: currentPage === 1 ? 0.4 : 1, cursor: 'pointer' }}
                                        >
                                            ←
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                                            <button
                                                key={num}
                                                onClick={() => setCurrentPage(num)}
                                                style={{
                                                    width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer',
                                                    border: `1px solid ${theme.border}`,
                                                    backgroundColor: currentPage === num ? accent : theme.card,
                                                    color: currentPage === num ? accentOn : theme.text
                                                }}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            style={{ width: '36px', height: '36px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text, opacity: currentPage === totalPages ? 0.4 : 1, cursor: 'pointer' }}
                                        >
                                            →
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-5" style={{ color: theme.textLight }}>
                                <i className="bi bi-gift display-4 d-block mb-3" style={{ opacity: 0.4 }}></i>
                                <h5 style={{ color: theme.text }}>No Benefits Found</h5>
                                <p className="mb-3">{searchTerm ? `No results found for "${searchTerm}"` : 'Start by adding your first benefit'}</p>
                                {!searchTerm && (
                                    <button onClick={() => openModal()} style={{ backgroundColor: accent, color: accentOn, border: 'none', padding: '10px 22px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                                        <i className="bi bi-plus-circle me-2"></i>Add New Benefit
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <Footer theme={theme} />
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <form onSubmit={handleSave}>
                    <Modal
                        theme={theme}
                        title={isEditing ? 'Edit Benefit' : 'Add New Benefit'}
                        onClose={closeModal}
                        footer={<>
                            <button type="button" onClick={closeModal} disabled={loading} className="btn btn-outline-dark">Cancel</button>
                            <button type="submit" disabled={loading} style={{ backgroundColor: accent, color: accentOn, border: 'none', padding: '10px 28px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                                {loading
                                    ? (<><span className="spinner-border spinner-border-sm me-2"></span>{isEditing ? 'Updating...' : 'Saving...'}</>)
                                    : (<><i className={`bi ${isEditing ? 'bi-pencil' : 'bi-plus-circle'} me-1`}></i>{isEditing ? 'Update Benefit' : 'Save Benefit'}</>)}
                            </button>
                        </>}
                    >
                        <div className="mb-3">
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Benefit Title *</label>
                            <input type="text" style={fieldStyle} value={formData.title} required onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter benefit title" disabled={loading} />
                        </div>
                        <div>
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Description *</label>
                            <textarea style={{ ...fieldStyle, minHeight: '100px' }} value={formData.desc} required onChange={(e) => setFormData({ ...formData, desc: e.target.value })} placeholder="Enter benefit description" disabled={loading} />
                        </div>
                    </Modal>
                </form>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 2000, padding: '20px', animation: 'fadeIn .2s ease'
                    }}
                    onClick={(e) => e.target === e.currentTarget && !loading && setDeleteConfirm(null)}
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
                        <h5 style={{ margin: '0 0 8px', fontWeight: 600 }}>Delete this benefit?</h5>
                        <p style={{ margin: '0 0 22px', color: theme.textLight, fontSize: '14px' }}>
                            "<strong>{deleteConfirm.title}</strong>" will be permanently removed. This can't be undone.
                        </p>
                        <div className="d-flex gap-2">
                            <button onClick={() => setDeleteConfirm(null)} disabled={loading} className="btn btn-outline-dark flex-fill">Cancel</button>
                            <button onClick={() => handleDelete(deleteConfirm.id)} disabled={loading} className="btn flex-fill" style={{ backgroundColor: accent, color: accentOn, border: 'none' }}>
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: ${theme.bg}; }
                ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default OwnerBenefit;