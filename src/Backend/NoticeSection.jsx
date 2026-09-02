// import React, { useState, useEffect } from 'react';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import Footer from './Footer';
// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// const NoticeSection = ({ theme: propsTheme }) => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [editingNotice, setEditingNotice] = useState(null);
//     const [toast, setToast] = useState({ show: false, message: '', type: '' });
//     const [searchTerm, setSearchTerm] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [loading, setLoading] = useState(false);
//     const [notices, setNotices] = useState([]);
//     const [totalNoticesCount, setTotalNoticesCount] = useState(0);
//     const itemsPerPage = 8;

//     const [formData, setFormData] = useState({
//         text: '',
//         status: 'Active'
//     });

//     const theme = propsTheme || {
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
//         warning: '#f59e0b',
//         tableHeader: isDarkMode ? '#25253a' : '#f8f9fc'
//     };

//     // Get Auth Token from localStorage
//     const getAuthToken = () => {
//         const token = localStorage.getItem("token");
//         return token;
//     };

//     // Create axios instance with auth header
//     const axiosInstance = axios.create({
//         baseURL: API_BASE_URL,
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         }
//     });

//     // Add token to every request
//     axiosInstance.interceptors.request.use(
//         (config) => {
//             const token = getAuthToken();
//             if (token) {
//                 config.headers.Authorization = `Bearer ${token}`;
//             }
//             return config;
//         },
//         (error) => {
//             return Promise.reject(error);
//         }
//     );

//     const showToast = (message, type = 'success') => {
//         setToast({ show: true, message, type });
//         setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
//     };

//     // Fetch notices from API
//     const fetchNotices = async () => {
//         setLoading(true);
//         try {
//             const response = await axiosInstance.get('/notices', {
//                 params: {
//                     search: searchTerm,
//                     per_page: itemsPerPage,
//                     page: currentPage
//                 }
//             });
            
//             if (response.data.success) {
//                 setNotices(response.data.data.data);
//                 setTotalNoticesCount(response.data.data.total);
//             }
//         } catch (error) {
//             console.error('Error fetching notices:', error);
//             showToast('Failed to fetch notices', 'error');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Load notices on component mount and when dependencies change
//     useEffect(() => {
//         fetchNotices();
//     }, [searchTerm, currentPage]);

//     // Calculate statistics from fetched data
//     const totalNotices = totalNoticesCount;
//     const activeNotices = notices.filter(n => n.status === 'Active').length;
//     const inactiveNotices = notices.filter(n => n.status === 'Inactive').length;

//     // Handle Add/Edit Notice
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!formData.text) {
//             showToast('Please enter notice text', 'error');
//             return;
//         }

//         setLoading(true);
//         try {
//             if (editingNotice) {
//                 // Update existing notice
//                 const response = await axiosInstance.post(`/notices/${editingNotice.id}`, {
//                     text: formData.text,
//                     status: formData.status
//                 });
                
//                 if (response.data.success) {
//                     showToast('Notice updated successfully!', 'success');
//                     fetchNotices();
//                     closeModal();
//                 }
//             } else {
//                 // Create new notice
//                 const response = await axiosInstance.post('/notices', {
//                     text: formData.text,
//                     status: formData.status
//                 });
                
//                 if (response.data.success) {
//                     showToast('Notice added successfully!', 'success');
//                     fetchNotices();
//                     closeModal();
//                 }
//             }
//         } catch (error) {
//             console.error('Error saving notice:', error);
//             showToast(error.response?.data?.message || 'Failed to save notice', 'error');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle Delete
//     const handleDelete = async (id) => {
//         if (window.confirm('Are you sure you want to delete this notice?')) {
//             setLoading(true);
//             try {
//                 const response = await axiosInstance.delete(`/notices/${id}`);
//                 if (response.data.success) {
//                     showToast('Notice deleted successfully!', 'success');
//                     fetchNotices();
//                 }
//             } catch (error) {
//                 console.error('Error deleting notice:', error);
//                 showToast('Failed to delete notice', 'error');
//             } finally {
//                 setLoading(false);
//             }
//         }
//     };

//     // Handle Edit
//     const handleEdit = (notice) => {
//         setEditingNotice(notice);
//         setFormData({
//             text: notice.text,
//             status: notice.status
//         });
//         setShowModal(true);
//     };

//     const closeModal = () => {
//         setShowModal(false);
//         setEditingNotice(null);
//         setFormData({ text: '', status: 'Active' });
//     };

//     const toggleSidebar = () => setIsCollapsed(!isCollapsed);
//     const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

//     // Calculate pagination
//     const totalPages = Math.ceil(totalNotices / itemsPerPage);
//     const startIndex = (currentPage - 1) * itemsPerPage;

//     const styles = {
//         container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
//         mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
//         contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
//         contentScroll: { flex: '1 0 auto', padding: '30px' },
//         footerWrapper: { flexShrink: 0 },
//         pageTitle: {
//             fontSize: '28px',
//             fontWeight: '700',
//             background: theme.primaryGradient,
//             WebkitBackgroundClip: 'text',
//             WebkitTextFillColor: 'transparent',
//             marginBottom: '8px'
//         },
//         statsContainer: {
//             display: 'flex',
//             gap: '20px',
//             marginBottom: '30px',
//             flexWrap: 'wrap'
//         },
//         statCard: {
//             backgroundColor: theme.card,
//             borderRadius: '16px',
//             padding: '20px',
//             flex: '1',
//             minWidth: '150px',
//             border: `1px solid ${theme.border}`,
//             transition: 'all 0.3s ease'
//         },
//         statIcon: { fontSize: '32px', marginBottom: '12px' },
//         statValue: { fontSize: '28px', fontWeight: '700', color: theme.text, marginBottom: '4px' },
//         statLabel: { fontSize: '13px', color: theme.textLight, fontWeight: '500' },
//         toolbar: {
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginBottom: '24px',
//             flexWrap: 'wrap',
//             gap: '16px'
//         },
//         searchBox: {
//             padding: '10px 16px',
//             borderRadius: '10px',
//             border: `1px solid ${theme.border}`,
//             backgroundColor: theme.card,
//             color: theme.text,
//             width: '300px',
//             fontSize: '14px',
//             outline: 'none'
//         },
//         addBtn: {
//             background: theme.primaryGradient,
//             color: 'white',
//             border: 'none',
//             padding: '10px 24px',
//             borderRadius: '10px',
//             cursor: 'pointer',
//             fontSize: '14px',
//             fontWeight: '600',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             boxShadow: '0 4px 15px rgba(94, 46, 16, 0.3)'
//         },
//         table: {
//             width: '100%',
//             borderCollapse: 'collapse',
//             backgroundColor: theme.card,
//             borderRadius: '16px',
//             overflow: 'hidden',
//             boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
//         },
//         th: {
//             backgroundColor: theme.tableHeader,
//             padding: '16px',
//             textAlign: 'left',
//             color: theme.text,
//             fontWeight: '600',
//             fontSize: '14px',
//             borderBottom: `2px solid ${theme.border}`
//         },
//         td: {
//             padding: '16px',
//             color: theme.text,
//             borderBottom: `1px solid ${theme.border}`,
//             fontSize: '14px'
//         },
//         statusBadge: (status) => ({
//             display: 'inline-block',
//             padding: '4px 12px',
//             borderRadius: '20px',
//             fontSize: '12px',
//             fontWeight: '600',
//             backgroundColor: status === 'Active' ? '#d4edda' : '#fff3cd',
//             color: status === 'Active' ? '#155724' : '#856404'
//         }),
//         actionButtons: { display: 'flex', gap: '8px' },
//         editBtn: {
//             backgroundColor: '#5e2e10',
//             color: 'white',
//             border: 'none',
//             padding: '6px 12px',
//             borderRadius: '6px',
//             cursor: 'pointer',
//             fontSize: '12px',
//             transition: 'all 0.3s'
//         },
//         deleteBtn: {
//             backgroundColor: '#dc3545',
//             color: 'white',
//             border: 'none',
//             padding: '6px 12px',
//             borderRadius: '6px',
//             cursor: 'pointer',
//             fontSize: '12px',
//             transition: 'all 0.3s'
//         },
//         pagination: {
//             display: 'flex',
//             justifyContent: 'center',
//             gap: '8px',
//             marginTop: '24px'
//         },
//         pageBtn: {
//             width: '36px',
//             height: '36px',
//             borderRadius: '8px',
//             border: `1px solid ${theme.border}`,
//             backgroundColor: theme.card,
//             color: theme.text,
//             cursor: 'pointer',
//             transition: 'all 0.3s'
//         },
//         activePage: {
//             background: theme.primaryGradient,
//             color: 'white',
//             border: 'none'
//         },
//         modalOverlay: {
//             position: 'fixed',
//             inset: 0,
//             backgroundColor: 'rgba(0,0,0,0.8)',
//             display: showModal ? 'flex' : 'none',
//             justifyContent: 'center',
//             alignItems: 'center',
//             zIndex: 2000,
//             backdropFilter: 'blur(8px)'
//         },
//         modal: {
//             backgroundColor: theme.card,
//             borderRadius: '20px',
//             width: '500px',
//             maxWidth: '90%',
//             animation: 'slideUp 0.3s ease'
//         },
//         modalHeader: {
//             padding: '20px 24px',
//             borderBottom: `1px solid ${theme.border}`,
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center'
//         },
//         modalBody: { padding: '24px' },
//         input: {
//             width: '100%',
//             padding: '12px 16px',
//             borderRadius: '12px',
//             border: `1px solid ${theme.border}`,
//             backgroundColor: theme.bg,
//             color: theme.text,
//             fontSize: '14px',
//             outline: 'none'
//         },
//         textarea: {
//             width: '100%',
//             padding: '12px 16px',
//             borderRadius: '12px',
//             border: `1px solid ${theme.border}`,
//             backgroundColor: theme.bg,
//             color: theme.text,
//             fontSize: '14px',
//             outline: 'none',
//             minHeight: '100px',
//             resize: 'vertical'
//         },
//         select: {
//             width: '100%',
//             padding: '12px 16px',
//             borderRadius: '12px',
//             border: `1px solid ${theme.border}`,
//             backgroundColor: theme.bg,
//             color: theme.text,
//             fontSize: '14px',
//             outline: 'none'
//         },
//         toast: {
//             position: 'fixed',
//             bottom: '20px',
//             right: '20px',
//             padding: '12px 20px',
//             borderRadius: '10px',
//             color: 'white',
//             zIndex: 2000,
//             display: 'flex',
//             alignItems: 'center',
//             gap: '10px'
//         },
//         emptyState: { textAlign: 'center', padding: '60px', color: theme.textLight },
//         loadingSpinner: {
//             textAlign: 'center',
//             padding: '40px',
//             color: theme.textLight
//         }
//     };

//     return (
//         <div style={styles.container} className="container-fluid p-0">
//             <style>
//                 {`
//                     @keyframes slideUp {
//                         from { transform: translateY(50px); opacity: 0; }
//                         to { transform: translateY(0); opacity: 1; }
//                     }
//                     .stat-card:hover {
//                         transform: translateY(-4px);
//                         box-shadow: 0 8px 25px rgba(94, 46, 16, 0.15);
//                     }
//                     button:hover {
//                         transform: translateY(-2px);
//                     }
//                     .edit-btn:hover {
//                         background-color: #8B4513 !important;
//                     }
//                     .delete-btn:hover {
//                         background-color: #c82333 !important;
//                     }
//                     .search-box:focus {
//                         border-color: #5e2e10;
//                         box-shadow: 0 0 0 3px rgba(94, 46, 16, 0.1);
//                     }
//                 `}
//             </style>
//             <div className="d-flex">
//                 <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="notices" />

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
//                             <div style={{ marginBottom: '30px' }}>
//                                 <h1 style={styles.pageTitle}>Notice Management</h1>
//                                 <p style={{ color: theme.textLight }}>Manage and publish important notices</p>
//                             </div>

//                             {/* Statistics Cards */}
//                             <div style={styles.statsContainer}>
//                                 <div className="stat-card" style={styles.statCard}>
//                                     <div style={styles.statIcon}>📢</div>
//                                     <div style={styles.statValue}>{totalNotices}</div>
//                                     <div style={styles.statLabel}>Total Notices</div>
//                                 </div>
//                                 <div className="stat-card" style={styles.statCard}>
//                                     <div style={styles.statIcon}>✅</div>
//                                     <div style={styles.statValue}>{activeNotices}</div>
//                                     <div style={styles.statLabel}>Active Notices</div>
//                                 </div>
//                                 <div className="stat-card" style={styles.statCard}>
//                                     <div style={styles.statIcon}>⏸️</div>
//                                     <div style={styles.statValue}>{inactiveNotices}</div>
//                                     <div style={styles.statLabel}>Inactive Notices</div>
//                                 </div>
//                             </div>

//                             {/* Toolbar */}
//                             <div style={styles.toolbar}>
//                                 <input
//                                     type="text"
//                                     placeholder="🔍 Search notices..."
//                                     style={styles.searchBox}
//                                     className="search-box"
//                                     value={searchTerm}
//                                     onChange={(e) => {
//                                         setSearchTerm(e.target.value);
//                                         setCurrentPage(1);
//                                     }}
//                                 />
//                                 <button style={styles.addBtn} onClick={() => setShowModal(true)}>
//                                     + Add Notice
//                                 </button>
//                             </div>

//                             {/* Table */}
//                             {loading ? (
//                                 <div style={styles.loadingSpinner}>
//                                     <div className="spinner-border text-primary" role="status">
//                                         <span className="visually-hidden">Loading...</span>
//                                     </div>
//                                     <p style={{ marginTop: '16px' }}>Loading notices...</p>
//                                 </div>
//                             ) : notices.length > 0 ? (
//                                 <>
//                                     <div style={{ overflowX: 'auto' }}>
//                                         <table style={styles.table}>
//                                             <thead>
//                                                 <tr>
//                                                     <th style={styles.th}>ID</th>
//                                                     <th style={styles.th}>Notice Text</th>
//                                                     <th style={styles.th}>Status</th>
//                                                     <th style={styles.th}>Created At</th>
//                                                     <th style={styles.th}>Created By</th>
//                                                     <th style={styles.th}>Actions</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {notices.map((notice, index) => (
//                                                     <tr key={notice.id}>
//                                                         <td style={styles.td}>{startIndex + index + 1}</td>
//                                                         <td style={styles.td}>
//                                                             <div style={{ maxWidth: '400px' }}>
//                                                                 {notice.text}
//                                                             </div>
//                                                         </td>
//                                                         <td style={styles.td}>
//                                                             <span style={styles.statusBadge(notice.status)}>
//                                                                 {notice.status}
//                                                             </span>
//                                                         </td>
//                                                         <td style={styles.td}>
//                                                             {new Date(notice.created_at).toLocaleDateString()}
//                                                         </td>
//                                                         <td style={styles.td}>{notice.created_by}</td>
//                                                         <td style={styles.td}>
//                                                             <div style={styles.actionButtons}>
//                                                                 <button 
//                                                                     className="edit-btn"
//                                                                     style={styles.editBtn}
//                                                                     onClick={() => handleEdit(notice)}
//                                                                     onMouseEnter={(e) => {
//                                                                         e.target.style.backgroundColor = '#8B4513';
//                                                                         e.target.style.transform = 'translateY(-2px)';
//                                                                     }}
//                                                                     onMouseLeave={(e) => {
//                                                                         e.target.style.backgroundColor = '#5e2e10';
//                                                                         e.target.style.transform = 'translateY(0)';
//                                                                     }}
//                                                                 >
//                                                                     Edit
//                                                                 </button>
//                                                                 <button 
//                                                                     className="delete-btn"
//                                                                     style={styles.deleteBtn}
//                                                                     onClick={() => handleDelete(notice.id)}
//                                                                     onMouseEnter={(e) => {
//                                                                         e.target.style.backgroundColor = '#c82333';
//                                                                         e.target.style.transform = 'translateY(-2px)';
//                                                                     }}
//                                                                     onMouseLeave={(e) => {
//                                                                         e.target.style.backgroundColor = '#dc3545';
//                                                                         e.target.style.transform = 'translateY(0)';
//                                                                     }}
//                                                                 >
//                                                                     Delete
//                                                                 </button>
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </table>
//                                     </div>

//                                     {/* Pagination */}
//                                     {totalPages > 1 && (
//                                         <div style={styles.pagination}>
//                                             <button
//                                                 style={{...styles.pageBtn, ...(currentPage === 1 && { opacity: 0.5 })}
//                                                 }
//                                                 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                                                 disabled={currentPage === 1}
//                                             >
//                                                 ←
//                                             </button>
//                                             {[...Array(totalPages)].map((_, i) => (
//                                                 <button
//                                                     key={i}
//                                                     style={{
//                                                         ...styles.pageBtn,
//                                                         ...(currentPage === i + 1 && styles.activePage)
//                                                     }}
//                                                     onClick={() => setCurrentPage(i + 1)}
//                                                 >
//                                                     {i + 1}
//                                                 </button>
//                                             ))}
//                                             <button
//                                                 style={{...styles.pageBtn, ...(currentPage === totalPages && { opacity: 0.5 })}
//                                                 }
//                                                 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                                                 disabled={currentPage === totalPages}
//                                             >
//                                                 →
//                                             </button>
//                                         </div>
//                                     )}
//                                 </>
//                             ) : (
//                                 <div style={styles.emptyState}>
//                                     <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
//                                     <h4>No notices found</h4>
//                                     <p style={{ color: theme.textLight }}>
//                                         {searchTerm ? `No results for "${searchTerm}"` : 'Click "Add Notice" to create one'}
//                                     </p>
//                                 </div>
//                             )}
//                         </div>

//                         <div style={styles.footerWrapper}>
//                             <Footer theme={theme} />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Add/Edit Notice Modal */}
//             {showModal && (
//                 <div style={styles.modalOverlay} onClick={closeModal}>
//                     <div style={styles.modal} onClick={e => e.stopPropagation()}>
//                         <div style={styles.modalHeader}>
//                             <h5 style={{ margin: 0, fontWeight: '600' }}>
//                                 {editingNotice ? 'Edit Notice' : 'Add New Notice'}
//                             </h5>
//                             <button 
//                                 className={`btn-close ${isDarkMode ? 'btn-close-white' : ''}`} 
//                                 onClick={closeModal}
//                             ></button>
//                         </div>
//                         <div style={styles.modalBody}>
//                             <form onSubmit={handleSubmit}>
//                                 <div className="mb-3">
//                                     <label className="form-label fw-semibold mb-2">Notice Text *</label>
//                                     <textarea
//                                         className="form-control"
//                                         style={styles.textarea}
//                                         value={formData.text}
//                                         onChange={(e) => setFormData({...formData, text: e.target.value})}
//                                         placeholder="Enter notice text here..."
//                                         required
//                                     />
//                                 </div>
//                                 <div className="mb-4">
//                                     <label className="form-label fw-semibold mb-2">Status</label>
//                                     <select
//                                         className="form-select"
//                                         style={styles.select}
//                                         value={formData.status}
//                                         onChange={(e) => setFormData({...formData, status: e.target.value})}
//                                     >
//                                         <option value="Active">Active</option>
//                                         <option value="Inactive">Inactive</option>
//                                     </select>
//                                 </div>
//                                 <div className="d-flex gap-2">
//                                     <button 
//                                         type="submit" 
//                                         className="btn w-100"
//                                         style={{ background: theme.primaryGradient, color: 'white', border: 'none' }}
//                                         disabled={loading}
//                                         onMouseEnter={(e) => {
//                                             e.target.style.transform = 'translateY(-2px)';
//                                             e.target.style.boxShadow = '0 6px 20px rgba(94, 46, 16, 0.4)';
//                                         }}
//                                         onMouseLeave={(e) => {
//                                             e.target.style.transform = 'translateY(0)';
//                                             e.target.style.boxShadow = 'none';
//                                         }}
//                                     >
//                                         {loading ? 'Processing...' : (editingNotice ? 'Update Notice' : 'Save Notice')}
//                                     </button>
//                                     <button 
//                                         type="button" 
//                                         className="btn btn-secondary w-100"
//                                         onClick={closeModal}
//                                     >
//                                         Cancel
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Toast Notification */}
//             {toast.show && (
//                 <div style={{
//                     ...styles.toast,
//                     backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444'
//                 }}>
//                     {toast.type === 'success' ? '✅' : '❌'} {toast.message}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default NoticeSection;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const ITEMS_PER_PAGE = 8;
const EMPTY_FORM = { text: '', status: 'Active' };

const getAuthToken = () => localStorage.getItem('token');

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
});
axiosInstance.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const Modal = ({ theme, title, onClose, children, footer }) => (
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
            border: `1px solid ${theme.border}`, borderRadius: '16px',
            width: '100%', maxWidth: '480px', animation: 'slideUp .25s ease'
        }}>
            <div style={{
                padding: '18px 22px', borderBottom: `1px solid ${theme.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <h5 style={{ margin: 0, fontWeight: 600 }}>{title}</h5>
                <button onClick={onClose} style={{
                    background: 'transparent', border: 'none', fontSize: '20px',
                    color: theme.text, opacity: 0.6, cursor: 'pointer'
                }}>✕</button>
            </div>
            <div style={{ padding: '22px' }}>{children}</div>
            {footer && (
                <div style={{ padding: '16px 22px', borderTop: `1px solid ${theme.border}`, display: 'flex', gap: '10px' }}>
                    {footer}
                </div>
            )}
        </div>
    </div>
);

const StatusBadge = ({ status, theme }) => (
    <span style={{
        padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
        border: `1px solid ${theme.text}`,
        backgroundColor: status === 'Active' ? theme.text : 'transparent',
        color: status === 'Active' ? theme.card : theme.text
    }}>
        {status}
    </span>
);

const NoticeSection = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [notices, setNotices] = useState([]);
    const [totalNoticesCount, setTotalNoticesCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);
    const [deletingNotice, setDeletingNotice] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);

    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#0a0a0a' : '#f5f5f5',
        card: isDarkMode ? '#141414' : '#ffffff',
        text: isDarkMode ? '#f5f5f5' : '#111111',
        textLight: isDarkMode ? '#a3a3a3' : '#6b6b6b',
        border: isDarkMode ? '#2b2b2b' : '#dcdcdc'
    };

    const fieldStyle = {
        width: '100%', padding: '11px 14px', borderRadius: '10px',
        border: `1px solid ${theme.border}`, backgroundColor: theme.bg,
        color: theme.text, fontSize: '14px', outline: 'none'
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const fetchNotices = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/notices', {
                params: { search: searchTerm, per_page: ITEMS_PER_PAGE, page: currentPage }
            });
            if (res.data.success) {
                setNotices(res.data.data.data);
                setTotalNoticesCount(res.data.data.total);
            }
        } catch (err) {
            console.error('Error fetching notices:', err);
            showToast('Failed to fetch notices', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNotices(); }, [searchTerm, currentPage]);

    const activeNotices = notices.filter(n => n.status === 'Active').length;
    const inactiveNotices = notices.filter(n => n.status === 'Inactive').length;

    const closeModal = () => { setShowModal(false); setEditingNotice(null); setFormData(EMPTY_FORM); };

    const openAddModal = () => { setEditingNotice(null); setFormData(EMPTY_FORM); setShowModal(true); };

    const handleEdit = (notice) => {
        setEditingNotice(notice);
        setFormData({ text: notice.text, status: notice.status });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.text) return showToast('Please enter notice text', 'error');

        setLoading(true);
        try {
            const url = editingNotice ? `/notices/${editingNotice.id}` : '/notices';
            const res = await axiosInstance.post(url, formData);
            if (res.data.success) {
                showToast(editingNotice ? 'Notice updated successfully!' : 'Notice added successfully!');
                fetchNotices();
                closeModal();
            }
        } catch (err) {
            console.error('Error saving notice:', err);
            showToast(err.response?.data?.message || 'Failed to save notice', 'error');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deletingNotice) return;
        setLoading(true);
        try {
            const res = await axiosInstance.delete(`/notices/${deletingNotice.id}`);
            if (res.data.success) {
                showToast('Notice deleted successfully!');
                fetchNotices();
            }
            setDeletingNotice(null);
        } catch (err) {
            console.error('Error deleting notice:', err);
            showToast('Failed to delete notice', 'error');
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(totalNoticesCount / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="notices" />

                <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="flex-grow-1">
                    <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '28px' }}>
                            <div style={{ marginBottom: '26px' }}>
                                <h1 style={{ fontSize: '26px', fontWeight: 700, color: theme.text, margin: 0 }}>Notice Management</h1>
                                <p style={{ color: theme.textLight, margin: '4px 0 0' }}>Manage and publish important notices</p>
                            </div>

                            {/* Stats */}
                            <div className="d-flex flex-wrap gap-3 mb-4">
                                {[
                                    { label: 'Total Notices', value: totalNoticesCount },
                                    { label: 'Active Notices', value: activeNotices },
                                    { label: 'Inactive Notices', value: inactiveNotices }
                                ].map(stat => (
                                    <div key={stat.label} style={{
                                        flex: 1, minWidth: '150px', backgroundColor: theme.card,
                                        border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '18px'
                                    }}>
                                        <div style={{ fontSize: '26px', fontWeight: 700, color: theme.text }}>{stat.value}</div>
                                        <div style={{ fontSize: '13px', color: theme.textLight, fontWeight: 500 }}>{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Toolbar */}
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                                <input
                                    type="text"
                                    placeholder="Search notices..."
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                    style={{ ...fieldStyle, width: '280px', backgroundColor: theme.card }}
                                />
                                <button
                                    onClick={openAddModal}
                                    style={{
                                        backgroundColor: theme.text, color: theme.card, border: 'none',
                                        padding: '10px 22px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer'
                                    }}
                                >
                                    + Add Notice
                                </button>
                            </div>

                            {/* Table */}
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border" style={{ color: theme.text }} role="status"></div>
                                    <p className="mt-3" style={{ color: theme.textLight }}>Loading notices...</p>
                                </div>
                            ) : notices.length > 0 ? (
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-hover" style={{ backgroundColor: theme.card, borderRadius: '14px', overflow: 'hidden', border: `1px solid ${theme.border}` }}>
                                            <thead style={{ color: theme.text, borderBottom: `2px solid ${theme.border}` }}>
                                                <tr>
                                                    {['#', 'Notice Text', 'Status', 'Created At', 'Created By', 'Actions'].map(h => (
                                                        <th key={h} style={{ padding: '14px 16px' }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {notices.map((notice, i) => (
                                                    <tr key={notice.id} style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>
                                                        <td style={{ padding: '14px 16px' }}>{startIndex + i + 1}</td>
                                                        <td style={{ padding: '14px 16px', maxWidth: '400px' }}>{notice.text}</td>
                                                        <td style={{ padding: '14px 16px' }}><StatusBadge status={notice.status} theme={theme} /></td>
                                                        <td style={{ padding: '14px 16px' }}>{new Date(notice.created_at).toLocaleDateString()}</td>
                                                        <td style={{ padding: '14px 16px' }}>{notice.created_by}</td>
                                                        <td style={{ padding: '14px 16px' }}>
                                                            <div className="d-flex gap-2">
                                                                <button
                                                                    onClick={() => handleEdit(notice)}
                                                                    style={{ border: `1px solid ${theme.text}`, backgroundColor: 'transparent', color: theme.text, padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeletingNotice(notice)}
                                                                    style={{ border: `1px solid ${theme.text}`, backgroundColor: theme.text, color: theme.card, padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
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
                                                        backgroundColor: currentPage === num ? theme.text : theme.card,
                                                        color: currentPage === num ? theme.card : theme.text
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
                                    <h5 style={{ color: theme.text }}>No notices found</h5>
                                    <p>{searchTerm ? `No results for "${searchTerm}"` : 'Click "Add Notice" to create one'}</p>
                                </div>
                            )}
                        </div>
                        <Footer theme={theme} />
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <form onSubmit={handleSubmit}>
                    <Modal
                        theme={theme}
                        title={editingNotice ? 'Edit Notice' : 'Add New Notice'}
                        onClose={closeModal}
                        footer={<>
                            <button type="button" onClick={closeModal} style={{ flex: 1, padding: '11px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', backgroundColor: 'transparent', color: theme.text, border: `1px solid ${theme.border}`, cursor: 'pointer' }}>
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} style={{ flex: 1, padding: '11px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', backgroundColor: theme.text, color: theme.card, border: 'none', cursor: 'pointer' }}>
                                {loading ? 'Processing...' : (editingNotice ? 'Update Notice' : 'Save Notice')}
                            </button>
                        </>}
                    >
                        <div className="mb-3">
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Notice Text *</label>
                            <textarea
                                required
                                rows="4"
                                value={formData.text}
                                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                style={{ ...fieldStyle, minHeight: '100px' }}
                                placeholder="Enter notice text here..."
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                style={fieldStyle}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </Modal>
                </form>
            )}

            {/* Delete Confirmation Modal */}
            {deletingNotice && (
                <div
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 2000, padding: '20px', animation: 'fadeIn .2s ease'
                    }}
                    onClick={(e) => e.target === e.currentTarget && !loading && setDeletingNotice(null)}
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
                            margin: '0 auto 16px', fontSize: '20px', fontWeight: 700
                        }}>
                            !
                        </div>
                        <h5 style={{ margin: '0 0 8px', fontWeight: 600 }}>Delete this notice?</h5>
                        <p style={{ margin: '0 0 22px', color: theme.textLight, fontSize: '14px' }}>
                            "{deletingNotice.text?.length > 60 ? `${deletingNotice.text.substring(0, 60)}...` : deletingNotice.text}" will be permanently removed. This can't be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => setDeletingNotice(null)}
                                disabled={loading}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '10px', fontWeight: 600, fontSize: '14px',
                                    backgroundColor: 'transparent', color: theme.text,
                                    border: `1px solid ${theme.border}`, cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={loading}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '10px', fontWeight: 600, fontSize: '14px',
                                    backgroundColor: theme.text, color: theme.card,
                                    border: 'none', cursor: 'pointer'
                                }}
                            >
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
                    backgroundColor: theme.text, color: theme.card
                }}>
                    {toast.message}
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .form-control, .form-select { background-color: ${theme.bg} !important; color: ${theme.text} !important; border-color: ${theme.border} !important; }
                .table tbody tr:hover { background-color: ${theme.isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'} !important; }
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: ${theme.bg}; }
                ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default NoticeSection;