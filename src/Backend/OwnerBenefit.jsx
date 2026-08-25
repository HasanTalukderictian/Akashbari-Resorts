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

//     // Get authentication headers
//     const getAuthHeaders = () => {
//         const token = localStorage.getItem('token');
//         return {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//             'Role': localStorage.getItem('Role') || 'admin'
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

//     // Filter and Pagination
//     const filteredBenefits = benefits.filter(item =>
//         item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.desc?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = filteredBenefits.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(filteredBenefits.length / itemsPerPage);

//     // Statistics
//     const totalBenefits = benefits.length;

//     const currentTheme = theme || {
//         isDarkMode,
//         bg: isDarkMode ? '#0f0f1a' : '#f8f9fc',
//         card: isDarkMode ? '#1a1a2e' : '#ffffff',
//         text: isDarkMode ? '#e9ecef' : '#2c3e50',
//         textLight: isDarkMode ? '#a0a0a0' : '#6c757d',
//         border: isDarkMode ? '#2d2d3d' : '#e9ecef',
//         primary: '#5e2e10',
//         primaryGradient: 'linear-gradient(135deg, #5e2e10 0%, #8B4513 100%)',
//         danger: '#ef4444',
//         success: '#10b981',
//         warning: '#f59e0b'
//     };

//     const styles = {
//         container: {
//             backgroundColor: currentTheme.bg,
//             minHeight: '100vh',
//             transition: 'all 0.3s ease'
//         },
//         mainContent: {
//             flex: 1,
//             overflowY: 'auto',
//             padding: '30px'
//         },
//         pageHeader: {
//             marginBottom: '30px'
//         },
//         pageTitle: {
//             fontSize: '28px',
//             fontWeight: '700',
//             background: currentTheme.primaryGradient,
//             WebkitBackgroundClip: 'text',
//             WebkitTextFillColor: 'transparent',
//             marginBottom: '8px'
//         },
//         pageSubtitle: {
//             color: currentTheme.textLight,
//             fontSize: '14px'
//         },
//         alert: {
//             padding: '12px 20px',
//             backgroundColor: 'rgba(94, 46, 16, 0.15)',
//             color: '#5e2e10',
//             borderRadius: '8px',
//             marginBottom: '20px',
//             fontWeight: '500'
//         },
//         statCards: {
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
//             gap: '20px',
//             marginBottom: '30px'
//         },
//         statCard: {
//             backgroundColor: currentTheme.card,
//             borderRadius: '16px',
//             padding: '20px',
//             border: `1px solid ${currentTheme.border}`,
//             transition: 'all 0.3s ease',
//             cursor: 'pointer'
//         },
//         statIcon: {
//             width: '50px',
//             height: '50px',
//             borderRadius: '12px',
//             background: currentTheme.primaryGradient,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             fontSize: '24px',
//             marginBottom: '16px'
//         },
//         statValue: {
//             fontSize: '28px',
//             fontWeight: '700',
//             color: currentTheme.text,
//             marginBottom: '4px'
//         },
//         statLabel: {
//             fontSize: '13px',
//             color: currentTheme.textLight,
//             fontWeight: '500'
//         },
//         toolbar: {
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginBottom: '24px',
//             flexWrap: 'wrap',
//             gap: '16px'
//         },
//         searchBox: {
//             padding: '12px 20px',
//             borderRadius: '12px',
//             border: `1px solid ${currentTheme.border}`,
//             backgroundColor: currentTheme.card,
//             color: currentTheme.text,
//             width: '300px',
//             fontSize: '14px',
//             outline: 'none',
//             transition: 'all 0.3s'
//         },
//         addBtn: {
//             background: currentTheme.primaryGradient,
//             color: 'white',
//             border: 'none',
//             padding: '12px 28px',
//             borderRadius: '12px',
//             cursor: 'pointer',
//             fontSize: '14px',
//             fontWeight: '600',
//             transition: 'all 0.3s',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             boxShadow: '0 4px 15px rgba(94, 46, 16, 0.3)'
//         },
//         benefitsGrid: {
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
//             gap: '24px',
//             marginBottom: '30px'
//         },
//         benefitCard: {
//             backgroundColor: currentTheme.card,
//             borderRadius: '20px',
//             overflow: 'hidden',
//             border: `1px solid ${currentTheme.border}`,
//             transition: 'all 0.3s ease',
//             position: 'relative'
//         },
//         cardHeader: {
//             padding: '20px',
//             background: currentTheme.primaryGradient,
//             color: 'white'
//         },
//         benefitTitle: {
//             fontSize: '18px',
//             fontWeight: '700',
//             marginBottom: '0',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '10px'
//         },
//         cardBody: {
//             padding: '20px'
//         },
//         benefitDesc: {
//             fontSize: '14px',
//             color: currentTheme.textLight,
//             lineHeight: '1.6',
//             marginBottom: '16px'
//         },
//         cardActions: {
//             display: 'flex',
//             gap: '10px',
//             paddingTop: '16px',
//             borderTop: `1px solid ${currentTheme.border}`
//         },
//         actionBtn: {
//             flex: 1,
//             padding: '8px',
//             borderRadius: '10px',
//             border: 'none',
//             cursor: 'pointer',
//             transition: 'all 0.3s',
//             fontSize: '13px',
//             fontWeight: '500',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             gap: '6px'
//         },
//         editBtn: {
//             backgroundColor: `${currentTheme.primary}15`,
//             color: currentTheme.primary
//         },
//         deleteBtn: {
//             backgroundColor: `${currentTheme.danger}20`,
//             color: currentTheme.danger
//         },
//         pagination: {
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             gap: '8px',
//             marginTop: '20px'
//         },
//         pageBtn: {
//             width: '40px',
//             height: '40px',
//             borderRadius: '10px',
//             border: `1px solid ${currentTheme.border}`,
//             backgroundColor: currentTheme.card,
//             color: currentTheme.text,
//             cursor: 'pointer',
//             transition: 'all 0.3s',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center'
//         },
//         activePage: {
//             background: currentTheme.primaryGradient,
//             color: 'white',
//             border: 'none'
//         },
//         emptyState: {
//             textAlign: 'center',
//             padding: '60px',
//             color: currentTheme.textLight
//         },
//         loadingSpinner: {
//             textAlign: 'center',
//             padding: '60px',
//             color: currentTheme.textLight
//         },
//         modalOverlay: {
//             position: 'fixed',
//             inset: 0,
//             backgroundColor: 'rgba(0,0,0,0.8)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             zIndex: 2000,
//             backdropFilter: 'blur(8px)'
//         },
//         modal: {
//             backgroundColor: currentTheme.card,
//             borderRadius: '24px',
//             width: '500px',
//             maxWidth: '90%',
//             maxHeight: '90vh',
//             overflowY: 'auto'
//         },
//         modalHeader: {
//             padding: '24px',
//             borderBottom: `1px solid ${currentTheme.border}`,
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             position: 'sticky',
//             top: 0,
//             backgroundColor: currentTheme.card,
//             zIndex: 1
//         },
//         modalBody: {
//             padding: '24px'
//         },
//         modalFooter: {
//             padding: '20px 24px',
//             borderTop: `1px solid ${currentTheme.border}`,
//             display: 'flex',
//             justifyContent: 'flex-end',
//             gap: '12px'
//         },
//         input: {
//             width: '100%',
//             padding: '10px 14px',
//             borderRadius: '10px',
//             border: `1px solid ${currentTheme.border}`,
//             backgroundColor: currentTheme.bg,
//             color: currentTheme.text,
//             fontSize: '14px',
//             outline: 'none',
//             transition: 'all 0.3s'
//         },
//         textarea: {
//             width: '100%',
//             padding: '10px 14px',
//             borderRadius: '10px',
//             border: `1px solid ${currentTheme.border}`,
//             backgroundColor: currentTheme.bg,
//             color: currentTheme.text,
//             fontSize: '14px',
//             outline: 'none',
//             resize: 'vertical',
//             minHeight: '100px'
//         },
//         label: {
//             display: 'block',
//             marginBottom: '8px',
//             fontWeight: '600',
//             fontSize: '13px',
//             color: currentTheme.text
//         },
//         buttonDisabled: {
//             opacity: 0.7,
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
//                         from { transform: translateY(30px); opacity: 0; }
//                         to { transform: translateY(0); opacity: 1; }
//                     }
//                     @keyframes slideInRight {
//                         from { transform: translateX(100px); opacity: 0; }
//                         to { transform: translateX(0); opacity: 1; }
//                     }
//                     .stat-card:hover {
//                         transform: translateY(-4px);
//                         box-shadow: 0 8px 25px rgba(94, 46, 16, 0.15);
//                     }
//                     .benefit-card:hover {
//                         transform: translateY(-6px);
//                         box-shadow: 0 12px 35px rgba(0,0,0,0.2);
//                     }
//                     button:hover {
//                         transform: translateY(-2px);
//                     }
//                     .search-box:focus {
//                         border-color: #5e2e10;
//                         box-shadow: 0 0 0 3px rgba(94, 46, 16, 0.1);
//                     }
//                     .benefit-card {
//                         animation: slideUp 0.3s ease;
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
//                         {/* Header Section */}
//                         <div style={styles.pageHeader}>
//                             <h1 style={styles.pageTitle}>Owner Benefits</h1>
//                             <p style={styles.pageSubtitle}>Manage property owner benefits and incentives</p>
//                         </div>

//                         {/* Auth Error Display */}
//                         {authError && (
//                             <div style={styles.alert}>
//                                 <i className="bi bi-exclamation-triangle-fill me-2"></i>
//                                 {authError}
//                             </div>
//                         )}

//                         {/* Statistics Cards */}
//                         <div style={styles.statCards}>
//                             <div className="stat-card" style={styles.statCard}>
//                                 <div style={styles.statIcon}>🎁</div>
//                                 <div style={styles.statValue}>{totalBenefits}</div>
//                                 <div style={styles.statLabel}>Total Benefits</div>
//                             </div>
//                             <div className="stat-card" style={styles.statCard}>
//                                 <div style={styles.statIcon}>⭐</div>
//                                 <div style={styles.statValue}>Premium</div>
//                                 <div style={styles.statLabel}>Quality</div>
//                             </div>
//                             <div className="stat-card" style={styles.statCard}>
//                                 <div style={styles.statIcon}>💎</div>
//                                 <div style={styles.statValue}>Exclusive</div>
//                                 <div style={styles.statLabel}>Offers</div>
//                             </div>
//                         </div>

//                         {/* Toolbar */}
//                         <div style={styles.toolbar}>
//                             <input
//                                 type="text"
//                                 placeholder="🔍 Search by title or description..."
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
//                                 onClick={() => openModal()}
//                                 disabled={loading}
//                             >
//                                 <i className="bi bi-plus-circle"></i> Add New Benefit
//                             </button>
//                         </div>

//                         {/* Benefits Grid */}
//                         {loading && benefits.length === 0 ? (
//                             <div style={styles.loadingSpinner}>
//                                 <div className="spinner-border text-primary" role="status">
//                                     <span className="visually-hidden">Loading...</span>
//                                 </div>
//                                 <p style={{ marginTop: '16px' }}>Loading benefits...</p>
//                             </div>
//                         ) : currentItems.length > 0 ? (
//                             <>
//                                 <div style={styles.benefitsGrid}>
//                                     {currentItems.map((item) => (
//                                         <div key={item.id} className="benefit-card" style={styles.benefitCard}>
//                                             <div style={styles.cardHeader}>
//                                                 <div style={styles.benefitTitle}>
//                                                     <i className="bi bi-gift-fill"></i>
//                                                     {item.title}
//                                                 </div>
//                                             </div>
//                                             <div style={styles.cardBody}>
//                                                 <p style={styles.benefitDesc}>
//                                                     {item.desc}
//                                                 </p>
//                                                 <div style={styles.cardActions}>
//                                                     <button 
//                                                         style={{...styles.actionBtn, ...styles.editBtn}}
//                                                         onClick={() => openModal(item)}
//                                                         disabled={loading}
//                                                     >
//                                                         <i className="bi bi-pencil"></i> Edit
//                                                     </button>
//                                                     <button 
//                                                         style={{...styles.actionBtn, ...styles.deleteBtn}}
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

//                                 {/* Pagination */}
//                                 {totalPages > 1 && (
//                                     <div style={styles.pagination}>
//                                         <button
//                                             style={{...styles.pageBtn, ...(currentPage === 1 && { opacity: 0.5, cursor: 'not-allowed' })}}
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
//                                             style={{...styles.pageBtn, ...(currentPage === totalPages && { opacity: 0.5, cursor: 'not-allowed' })}}
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
//                                 <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎁</div>
//                                 <h4>No Benefits Found</h4>
//                                 <p style={{ color: currentTheme.textLight, marginBottom: '20px' }}>
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

//             {/* Add/Edit Modal */}
//             {showModal && (
//                 <div style={styles.modalOverlay} onClick={closeModal}>
//                     <div style={styles.modal} onClick={e => e.stopPropagation()}>
//                         <div style={styles.modalHeader}>
//                             <h5 style={{ margin: 0, fontWeight: '600' }}>
//                                 {isEditing ? '✏️ Edit Benefit' : '✨ Add New Benefit'}
//                             </h5>
//                             <button 
//                                 onClick={closeModal}
//                                 style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: currentTheme.text }}
//                             >
//                                 ×
//                             </button>
//                         </div>
//                         <form onSubmit={handleSave}>
//                             <div style={styles.modalBody}>
//                                 <div className="mb-3">
//                                     <label style={styles.label}>Benefit Title *</label>
//                                     <input 
//                                         type="text" 
//                                         style={styles.input}
//                                         value={formData.title}
//                                         required
//                                         onChange={(e) => setFormData({...formData, title: e.target.value})}
//                                         placeholder="Enter benefit title"
//                                         disabled={loading}
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
//                                     />
//                                 </div>
//                             </div>
//                             <div style={styles.modalFooter}>
//                                 <button 
//                                     type="button" 
//                                     onClick={closeModal}
//                                     style={{...styles.actionBtn, backgroundColor: currentTheme.border, color: currentTheme.text, padding: '10px 24px'}}
//                                     disabled={loading}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button 
//                                     type="submit" 
//                                     style={{...styles.addBtn, padding: '10px 32px', ...(loading && styles.buttonDisabled)}}
//                                     disabled={loading}
//                                 >
//                                     {loading ? (
//                                         <>
//                                             <span className="spinner-border spinner-border-sm me-2"></span>
//                                             {isEditing ? 'Updating...' : 'Saving...'}
//                                         </>
//                                     ) : (
//                                         isEditing ? 'Update Benefit' : 'Save Benefit'
//                                     )}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* Delete Confirmation Modal */}
//             {deleteConfirm && (
//                 <div style={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
//                     <div style={{...styles.modal, width: '400px'}} onClick={e => e.stopPropagation()}>
//                         <div style={styles.modalHeader}>
//                             <h5 style={{ margin: 0, fontWeight: '600' }}>Confirm Delete</h5>
//                             <button onClick={() => setDeleteConfirm(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
//                         </div>
//                         <div style={styles.modalBody}>
//                             <div style={{ textAlign: 'center' }}>
//                                 <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
//                                 <p>Are you sure you want to delete <strong>{deleteConfirm.title}</strong>?</p>
//                                 <p style={{ fontSize: '13px', color: currentTheme.textLight }}>This action cannot be undone.</p>
//                             </div>
//                         </div>
//                         <div style={styles.modalFooter}>
//                             <button 
//                                 onClick={() => setDeleteConfirm(null)} 
//                                 style={{...styles.actionBtn, backgroundColor: currentTheme.border, color: currentTheme.text, padding: '10px 24px'}}
//                                 disabled={loading}
//                             >
//                                 Cancel
//                             </button>
//                             <button 
//                                 onClick={() => handleDelete(deleteConfirm.id)} 
//                                 style={{...styles.deleteBtn, padding: '10px 24px', border: 'none', borderRadius: '10px', ...(loading && styles.buttonDisabled)}}
//                                 disabled={loading}
//                             >
//                                 {loading ? 'Deleting...' : 'Delete'}
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

const OwnerBenefit = ({ theme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [authError, setAuthError] = useState(null);
    const itemsPerPage = 6;
    
    const [benefits, setBenefits] = useState([]);
    const [formData, setFormData] = useState({ id: '', title: '', desc: '' });
    const [isEditing, setIsEditing] = useState(false);

    const API_BASE = import.meta.env.VITE_BASE_URL;

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Role': localStorage.getItem('Role') || 'admin'
        };
    };

    const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setAuthError("Please login to access this page");
            setTimeout(() => window.location.href = '/login', 2000);
            return false;
        }
        return true;
    };

    const fetchBenefits = async () => {
        if (!checkAuth()) return;
        
        try {
            setLoading(true);
            setAuthError(null);
            
            const headers = getAuthHeaders();
            const response = await fetch(`${API_BASE}/get-property-benifit`, {
                method: 'GET',
                headers: headers
            });
            
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                setAuthError("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }
            
            const result = await response.json();
            
            if (result.status && result.data && Array.isArray(result.data.data)) {
                setBenefits(result.data.data);
            } else {
                setBenefits([]);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setBenefits([]);
            setAuthError("Failed to fetch benefits. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBenefits();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!checkAuth()) return;
        
        const url = isEditing 
            ? `${API_BASE}/edit-property-benifit/${formData.id}` 
            : `${API_BASE}/add-property-benifit`;

        try {
            setLoading(true);
            const headers = getAuthHeaders();
            
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    title: formData.title,
                    desc: formData.desc
                }),
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                setAuthError("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }

            const result = await response.json();

            if (result.status) {
                await fetchBenefits(); 
                closeModal();
            } else {
                alert(result.message || result.error || "Error saving data");
            }
        } catch (error) {
            console.error("Save error:", error);
            alert(error.message || "Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!checkAuth()) return;
        
        try {
            setLoading(true);
            const headers = getAuthHeaders();
            
            const response = await fetch(`${API_BASE}/delete-property-benifit/${id}`, {
                method: 'DELETE',
                headers: headers
            });
            
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                setAuthError("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }
            
            const result = await response.json();
            if (result.status) {
                await fetchBenefits();
                setDeleteConfirm(null);
            } else {
                alert(result.message || "Error deleting benefit");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete benefit. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const openModal = (item = null) => {
        if (item) {
            setFormData({ id: item.id, title: item.title, desc: item.desc });
            setIsEditing(true);
        } else {
            setFormData({ id: '', title: '', desc: '' });
            setIsEditing(false);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({ id: '', title: '', desc: '' });
        setIsEditing(false);
    };

    const filteredBenefits = benefits.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.desc?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBenefits.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBenefits.length / itemsPerPage);
    const totalBenefits = benefits.length;

    const currentTheme = theme || {
        isDarkMode,
        bg: isDarkMode ? '#0a0a1a' : '#f0f4ff',
        card: isDarkMode ? '#141428' : '#ffffff',
        cardHover: isDarkMode ? '#1e1e3a' : '#f8faff',
        text: isDarkMode ? '#e8edf5' : '#1a2332',
        textLight: isDarkMode ? '#8a8aa8' : '#64748b',
        border: isDarkMode ? '#2a2a4a' : '#e2e8f0',
        primary: '#6d2e1f',
        primaryLight: '#8b3a28',
        primaryGradient: 'linear-gradient(135deg, #6d2e1f 0%, #a0522d 50%, #cd853f 100%)',
        danger: '#ef4444',
        success: '#10b981',
        warning: '#f59e0b',
        shadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(109, 46, 31, 0.12)'
    };

    const styles = {
        container: {
            backgroundColor: currentTheme.bg,
            minHeight: '100vh',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        },
        mainContent: {
            flex: 1,
            overflowY: 'auto',
            padding: '32px 36px'
        },
        pageHeader: {
            marginBottom: '32px',
            position: 'relative'
        },
        pageTitle: {
            fontSize: '32px',
            fontWeight: '800',
            background: currentTheme.primaryGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '4px',
            letterSpacing: '-0.5px'
        },
        pageSubtitle: {
            color: currentTheme.textLight,
            fontSize: '15px',
            fontWeight: '400'
        },
        alert: {
            padding: '14px 24px',
            backgroundColor: 'rgba(109, 46, 31, 0.08)',
            border: '1px solid rgba(109, 46, 31, 0.15)',
            color: '#6d2e1f',
            borderRadius: '12px',
            marginBottom: '24px',
            fontWeight: '500',
            backdropFilter: 'blur(8px)'
        },
        statCards: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
        },
        statCard: {
            backgroundColor: currentTheme.card,
            borderRadius: '20px',
            padding: '24px 22px',
            border: `1px solid ${currentTheme.border}`,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
        },
        statCardGradient: {
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '100%',
            height: '100%',
            background: currentTheme.primaryGradient,
            opacity: 0.05,
            borderRadius: '50%'
        },
        statIcon: {
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: currentTheme.primaryGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            marginBottom: '14px',
            color: 'white',
            boxShadow: '0 4px 16px rgba(109, 46, 31, 0.3)'
        },
        statValue: {
            fontSize: '30px',
            fontWeight: '800',
            color: currentTheme.text,
            marginBottom: '2px',
            letterSpacing: '-0.5px'
        },
        statLabel: {
            fontSize: '13px',
            color: currentTheme.textLight,
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },
        toolbar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '16px'
        },
        searchBox: {
            padding: '12px 20px 12px 44px',
            borderRadius: '14px',
            border: `2px solid ${currentTheme.border}`,
            backgroundColor: currentTheme.card,
            color: currentTheme.text,
            width: '320px',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s ease',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Ccircle cx=\'11\' cy=\'11\' r=\'8\'/%3E%3Cline x1=\'21\' y1=\'21\' x2=\'16.65\' y2=\'16.65\'/%3E%3C/svg%3E")',
            backgroundPosition: '16px center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '18px'
        },
        addBtn: {
            background: currentTheme.primaryGradient,
            color: 'white',
            border: 'none',
            padding: '12px 32px',
            borderRadius: '14px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 20px rgba(109, 46, 31, 0.35)',
            position: 'relative',
            overflow: 'hidden'
        },
        benefitsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px',
            marginBottom: '30px'
        },
        benefitCard: {
            backgroundColor: currentTheme.card,
            borderRadius: '24px',
            overflow: 'hidden',
            border: `1px solid ${currentTheme.border}`,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            boxShadow: currentTheme.shadow
        },
        cardHeader: {
            padding: '20px 24px',
            background: currentTheme.primaryGradient,
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
        },
        cardHeaderDecoration: {
            position: 'absolute',
            top: '-30px',
            right: '-30px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)'
        },
        benefitTitle: {
            fontSize: '18px',
            fontWeight: '700',
            marginBottom: '0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            position: 'relative',
            zIndex: 1
        },
        benefitBadge: {
            background: 'rgba(255,255,255,0.2)',
            padding: '2px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },
        cardBody: {
            padding: '22px 24px'
        },
        benefitDesc: {
            fontSize: '14px',
            color: currentTheme.textLight,
            lineHeight: '1.7',
            marginBottom: '18px',
            minHeight: '60px'
        },
        cardFooter: {
            display: 'flex',
            gap: '10px',
            paddingTop: '16px',
            borderTop: `1px solid ${currentTheme.border}`
        },
        actionBtn: {
            flex: 1,
            padding: '10px 16px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
        },
        editBtn: {
            background: 'rgba(109, 46, 31, 0.1)',
            color: currentTheme.primary,
            border: '1px solid rgba(109, 46, 31, 0.15)'
        },
        deleteBtn: {
            background: 'rgba(239, 68, 68, 0.1)',
            color: currentTheme.danger,
            border: '1px solid rgba(239, 68, 68, 0.15)'
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '6px',
            marginTop: '8px'
        },
        pageBtn: {
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            border: `1px solid ${currentTheme.border}`,
            backgroundColor: currentTheme.card,
            color: currentTheme.text,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            fontSize: '14px'
        },
        activePage: {
            background: currentTheme.primaryGradient,
            color: 'white',
            border: 'none',
            boxShadow: '0 4px 16px rgba(109, 46, 31, 0.3)'
        },
        emptyState: {
            textAlign: 'center',
            padding: '80px 20px',
            color: currentTheme.textLight
        },
        loadingSpinner: {
            textAlign: 'center',
            padding: '80px 20px',
            color: currentTheme.textLight
        },
        modalOverlay: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(12px)',
            animation: 'fadeIn 0.3s ease'
        },
        modal: {
            backgroundColor: currentTheme.card,
            borderRadius: '28px',
            width: '520px',
            maxWidth: '92%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            animation: 'slideUp 0.3s ease'
        },
        modalHeader: {
            padding: '24px 28px',
            borderBottom: `1px solid ${currentTheme.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            backgroundColor: currentTheme.card,
            zIndex: 1,
            borderRadius: '28px 28px 0 0'
        },
        modalBody: {
            padding: '28px'
        },
        modalFooter: {
            padding: '20px 28px',
            borderTop: `1px solid ${currentTheme.border}`,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            borderRadius: '0 0 28px 28px'
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            border: `2px solid ${currentTheme.border}`,
            backgroundColor: currentTheme.bg,
            color: currentTheme.text,
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s ease'
        },
        textarea: {
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            border: `2px solid ${currentTheme.border}`,
            backgroundColor: currentTheme.bg,
            color: currentTheme.text,
            fontSize: '14px',
            outline: 'none',
            resize: 'vertical',
            minHeight: '100px',
            transition: 'all 0.3s ease'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            fontSize: '13px',
            color: currentTheme.text,
            letterSpacing: '0.3px'
        },
        buttonDisabled: {
            opacity: 0.6,
            cursor: 'not-allowed'
        }
    };

    return (
        <div style={styles.container}>
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from { transform: translateY(30px) scale(0.98); opacity: 0; }
                        to { transform: translateY(0) scale(1); opacity: 1; }
                    }
                    @keyframes slideInRight {
                        from { transform: translateX(100px); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }
                    .stat-card:hover {
                        transform: translateY(-6px) scale(1.01);
                        box-shadow: 0 12px 40px rgba(109, 46, 31, 0.15);
                    }
                    .benefit-card:hover {
                        transform: translateY(-8px);
                        box-shadow: 0 16px 48px rgba(0,0,0,0.15);
                    }
                    .benefit-card:hover .card-header-decoration {
                        transform: scale(1.5);
                        opacity: 0.3;
                    }
                    button:hover:not(:disabled) {
                        transform: translateY(-2px);
                    }
                    .search-box:focus {
                        border-color: #6d2e1f;
                        box-shadow: 0 0 0 4px rgba(109, 46, 31, 0.1);
                        width: 380px;
                    }
                    .benefit-card {
                        animation: slideUp 0.4s ease forwards;
                    }
                    .benefit-card:nth-child(2) { animation-delay: 0.05s; }
                    .benefit-card:nth-child(3) { animation-delay: 0.1s; }
                    .benefit-card:nth-child(4) { animation-delay: 0.15s; }
                    .benefit-card:nth-child(5) { animation-delay: 0.2s; }
                    .benefit-card:nth-child(6) { animation-delay: 0.25s; }
                    .stat-card:nth-child(1) { animation: slideUp 0.4s ease; }
                    .stat-card:nth-child(2) { animation: slideUp 0.4s ease 0.1s; }
                    .stat-card:nth-child(3) { animation: slideUp 0.4s ease 0.2s; }
                    .stat-card {
                        animation-fill-mode: both;
                    }
                    .add-btn::before {
                        content: '';
                        position: absolute;
                        top: -50%;
                        left: -50%;
                        width: 200%;
                        height: 200%;
                        background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
                        transform: rotate(45deg) translateX(-100%);
                        transition: transform 0.6s ease;
                    }
                    .add-btn:hover::before {
                        transform: rotate(45deg) translateX(100%);
                    }
                    .page-btn:hover:not(:disabled) {
                        background: ${currentTheme.primary};
                        color: white;
                        border-color: ${currentTheme.primary};
                    }
                    .action-btn-edit:hover {
                        background: rgba(109, 46, 31, 0.2) !important;
                        transform: translateY(-2px);
                    }
                    .action-btn-delete:hover {
                        background: rgba(239, 68, 68, 0.2) !important;
                        transform: translateY(-2px);
                    }
                    ::-webkit-scrollbar {
                        width: 6px;
                    }
                    ::-webkit-scrollbar-track {
                        background: ${currentTheme.bg};
                    }
                    ::-webkit-scrollbar-thumb {
                        background: ${currentTheme.primary};
                        border-radius: 10px;
                    }
                    ::-webkit-scrollbar-thumb:hover {
                        background: ${currentTheme.primaryLight};
                    }
                `}
            </style>

            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
                <Sidebar theme={currentTheme} isCollapsed={isCollapsed} />

                <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                    <Header 
                        theme={currentTheme}
                        isDarkMode={isDarkMode}
                        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
                    />

                    <div style={styles.mainContent}>
                        <div style={styles.pageHeader}>
                            <h1 style={styles.pageTitle}>
                                ✨ Owner Benefits
                            </h1>
                            <p style={styles.pageSubtitle}>
                                Manage and organize property owner benefits & incentives
                            </p>
                        </div>

                        {authError && (
                            <div style={styles.alert}>
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                {authError}
                            </div>
                        )}

                        <div style={styles.statCards}>
                            <div className="stat-card" style={styles.statCard}>
                                <div style={styles.statCardGradient}></div>
                                <div style={styles.statIcon}>🎁</div>
                                <div style={styles.statValue}>{totalBenefits}</div>
                                <div style={styles.statLabel}>Total Benefits</div>
                            </div>
                            <div className="stat-card" style={styles.statCard}>
                                <div style={styles.statCardGradient}></div>
                                <div style={styles.statIcon}>⭐</div>
                                <div style={styles.statValue}>Premium</div>
                                <div style={styles.statLabel}>Quality Tier</div>
                            </div>
                            <div className="stat-card" style={styles.statCard}>
                                <div style={styles.statCardGradient}></div>
                                <div style={styles.statIcon}>💎</div>
                                <div style={styles.statValue}>Exclusive</div>
                                <div style={styles.statLabel}>Special Offers</div>
                            </div>
                        </div>

                        <div style={styles.toolbar}>
                            <input
                                type="text"
                                placeholder="Search benefits..."
                                style={styles.searchBox}
                                className="search-box"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            <button 
                                style={styles.addBtn}
                                className="add-btn"
                                onClick={() => openModal()}
                                disabled={loading}
                            >
                                <i className="bi bi-plus-circle"></i> 
                                Add New Benefit
                            </button>
                        </div>

                        {loading && benefits.length === 0 ? (
                            <div style={styles.loadingSpinner}>
                                <div className="spinner-border text-primary" role="status" style={{ width: '48px', height: '48px' }}>
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p style={{ marginTop: '20px', fontWeight: '500' }}>Loading benefits...</p>
                            </div>
                        ) : currentItems.length > 0 ? (
                            <>
                                <div style={styles.benefitsGrid}>
                                    {currentItems.map((item) => (
                                        <div key={item.id} className="benefit-card" style={styles.benefitCard}>
                                            <div style={styles.cardHeader}>
                                                <div style={styles.cardHeaderDecoration} className="card-header-decoration"></div>
                                                <div style={styles.benefitTitle}>
                                                    <i className="bi bi-gift-fill"></i>
                                                    {item.title}
                                                    <span style={styles.benefitBadge}>Active</span>
                                                </div>
                                            </div>
                                            <div style={styles.cardBody}>
                                                <p style={styles.benefitDesc}>
                                                    {item.desc}
                                                </p>
                                                <div style={styles.cardFooter}>
                                                    <button 
                                                        style={{...styles.actionBtn, ...styles.editBtn}}
                                                        className="action-btn-edit"
                                                        onClick={() => openModal(item)}
                                                        disabled={loading}
                                                    >
                                                        <i className="bi bi-pencil"></i> Edit
                                                    </button>
                                                    <button 
                                                        style={{...styles.actionBtn, ...styles.deleteBtn}}
                                                        className="action-btn-delete"
                                                        onClick={() => setDeleteConfirm(item)}
                                                        disabled={loading}
                                                    >
                                                        <i className="bi bi-trash"></i> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div style={styles.pagination}>
                                        <button
                                            style={{...styles.pageBtn, ...(currentPage === 1 && { opacity: 0.4, cursor: 'not-allowed' })}}
                                            className="page-btn"
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            ←
                                        </button>
                                        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }
                                            return (
                                                <button
                                                    key={i}
                                                    className="page-btn"
                                                    style={{
                                                        ...styles.pageBtn,
                                                        ...(currentPage === pageNum && styles.activePage)
                                                    }}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        <button
                                            style={{...styles.pageBtn, ...(currentPage === totalPages && { opacity: 0.4, cursor: 'not-allowed' })}}
                                            className="page-btn"
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            →
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={styles.emptyState}>
                                <div style={{ fontSize: '72px', marginBottom: '20px' }}>🎁</div>
                                <h4 style={{ fontWeight: '700', color: currentTheme.text }}>No Benefits Found</h4>
                                <p style={{ color: currentTheme.textLight, marginBottom: '24px' }}>
                                    {searchTerm ? `No results found for "${searchTerm}"` : 'Start by adding your first benefit'}
                                </p>
                                {!searchTerm && (
                                    <button style={styles.addBtn} onClick={() => openModal()}>
                                        <i className="bi bi-plus-circle"></i> Add New Benefit
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <Footer theme={currentTheme} />
                </div>
            </div>

            {showModal && (
                <div style={styles.modalOverlay} onClick={closeModal}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h5 style={{ margin: 0, fontWeight: '700', fontSize: '18px' }}>
                                {isEditing ? '✏️ Edit Benefit' : '✨ Add New Benefit'}
                            </h5>
                            <button 
                                onClick={closeModal}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    fontSize: '28px', 
                                    cursor: 'pointer', 
                                    color: currentTheme.text,
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = currentTheme.border}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div style={styles.modalBody}>
                                <div className="mb-4">
                                    <label style={styles.label}>Benefit Title *</label>
                                    <input 
                                        type="text" 
                                        style={styles.input}
                                        value={formData.title}
                                        required
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        placeholder="Enter benefit title"
                                        disabled={loading}
                                        onFocus={(e) => e.currentTarget.style.borderColor = currentTheme.primary}
                                        onBlur={(e) => e.currentTarget.style.borderColor = currentTheme.border}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label style={styles.label}>Description *</label>
                                    <textarea 
                                        style={styles.textarea}
                                        value={formData.desc}
                                        required
                                        onChange={(e) => setFormData({...formData, desc: e.target.value})}
                                        placeholder="Enter benefit description"
                                        disabled={loading}
                                        onFocus={(e) => e.currentTarget.style.borderColor = currentTheme.primary}
                                        onBlur={(e) => e.currentTarget.style.borderColor = currentTheme.border}
                                    />
                                </div>
                            </div>
                            <div style={styles.modalFooter}>
                                <button 
                                    type="button" 
                                    onClick={closeModal}
                                    style={{
                                        padding: '10px 28px',
                                        borderRadius: '12px',
                                        border: `1px solid ${currentTheme.border}`,
                                        backgroundColor: 'transparent',
                                        color: currentTheme.text,
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    disabled={loading}
                                    onMouseEnter={(e) => e.currentTarget.style.background = currentTheme.border}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    style={{...styles.addBtn, padding: '10px 36px', ...(loading && styles.buttonDisabled)}}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            {isEditing ? 'Updating...' : 'Saving...'}
                                        </>
                                    ) : (
                                        <>
                                            <i className={`bi ${isEditing ? 'bi-pencil' : 'bi-plus-circle'}`}></i>
                                            {isEditing ? 'Update Benefit' : 'Save Benefit'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div style={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
                    <div style={{...styles.modal, width: '420px'}} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h5 style={{ margin: 0, fontWeight: '700', fontSize: '18px' }}>⚠️ Confirm Delete</h5>
                            <button 
                                onClick={() => setDeleteConfirm(null)} 
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    fontSize: '28px', 
                                    cursor: 'pointer', 
                                    color: currentTheme.text,
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = currentTheme.border}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                ×
                            </button>
                        </div>
                        <div style={styles.modalBody}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '56px', marginBottom: '16px' }}>🗑️</div>
                                <p style={{ fontSize: '16px', fontWeight: '500', color: currentTheme.text }}>
                                    Are you sure you want to delete <br />
                                    <strong style={{ color: currentTheme.primary }}>"{deleteConfirm.title}"</strong>?
                                </p>
                                <p style={{ fontSize: '13px', color: currentTheme.textLight, marginTop: '8px' }}>
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div style={styles.modalFooter}>
                            <button 
                                onClick={() => setDeleteConfirm(null)} 
                                style={{
                                    padding: '10px 28px',
                                    borderRadius: '12px',
                                    border: `1px solid ${currentTheme.border}`,
                                    backgroundColor: 'transparent',
                                    color: currentTheme.text,
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    transition: 'all 0.3s ease'
                                }}
                                disabled={loading}
                                onMouseEnter={(e) => e.currentTarget.style.background = currentTheme.border}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => handleDelete(deleteConfirm.id)} 
                                style={{
                                    padding: '10px 32px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    backgroundColor: currentTheme.danger,
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)',
                                    ...(loading && styles.buttonDisabled)
                                }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete Permanently'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerBenefit;