// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Header from './Header';
// import Footer from './Footer';
// import Sidebar from './Sidebar';

// const VideoSection = () => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(false);
//     const [activeView, setActiveView] = useState('video');
//     const [banners, setBanners] = useState([]);
//     const [showModal, setShowModal] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [deleteConfirm, setDeleteConfirm] = useState(null);
//     const [toast, setToast] = useState({ show: false, message: '', type: '' });
//     const [authError, setAuthError] = useState(null);
//     const itemsPerPage = 6;

//     const BASE_URL = import.meta.env.VITE_BASE_URL;

//     const [formData, setFormData] = useState({
//         title: '',
//         videoUrl: '',
//         description: ''
//     });

//     const theme = {
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

//     // Extract YouTube video ID
//     const getYoutubeId = (url) => {
//         if (!url) return null;
//         const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//         const match = url.match(regExp);
//         return (match && match[2].length === 11) ? match[2] : null;
//     };

//     // Get embed URL
//     const getEmbedUrl = (url) => {
//         const videoId = getYoutubeId(url);
//         if (videoId) {
//             return `https://www.youtube.com/embed/${videoId}`;
//         }
//         return url;
//     };

//     // ✅ Fetch Videos with Authentication
//     const fetchVideos = async () => {
//         if (!checkAuth()) return;
        
//         setLoading(true);
//         setAuthError(null);
        
//         try {
//             const headers = getAuthHeaders();
//             const res = await axios.get(`${BASE_URL}/get-videos`, { headers });
            
//             if (res.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 setAuthError("Session expired. Please login again.");
//                 setTimeout(() => window.location.href = '/login', 2000);
//                 return;
//             }
            
//             if (res.data) {
//                 setBanners(Array.isArray(res.data) ? res.data : res.data.data || []);
//             }
//         } catch (err) {
//             console.error("Fetch error:", err);
//             if (err.response?.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 setAuthError("Session expired. Please login again.");
//                 setTimeout(() => window.location.href = '/login', 2000);
//             } else {
//                 showToast('Failed to fetch videos', 'error');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchVideos();
//     }, []);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     // ✅ Add Video with Authentication
//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         if (!checkAuth()) return;
        
//         setLoading(true);
//         try {
//             const headers = getAuthHeaders();
//             const res = await axios.post(`${BASE_URL}/add-videos`, {
//                 title: formData.title,
//                 description: formData.description,
//                 video_url: formData.videoUrl 
//             }, { headers });

//             if (res.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 showToast("Session expired. Please login again.", 'error');
//                 setTimeout(() => window.location.href = '/login', 2000);
//                 return;
//             }

//             if (res.data) {
//                 showToast('Video added successfully!', 'success');
//                 setShowModal(false);
//                 setFormData({ title: '', videoUrl: '', description: '' });
//                 fetchVideos(); 
//             }
//         } catch (err) {
//             console.error("Submit error:", err.response?.data || err.message);
//             if (err.response?.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 showToast("Session expired. Please login again.", 'error');
//                 setTimeout(() => window.location.href = '/login', 2000);
//             } else {
//                 showToast(err.response?.data?.message || "Something went wrong!", 'error');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ✅ Delete Video with Authentication
//     const handleDelete = async (id) => {
//         if (!checkAuth()) return;
        
//         try {
//             const headers = getAuthHeaders();
//             await axios.delete(`${BASE_URL}/del-videos/${id}`, { headers });
//             showToast('Video deleted successfully!', 'success');
//             fetchVideos();
//             setDeleteConfirm(null);
//         } catch (err) {
//             console.error("Delete error:", err);
//             if (err.response?.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 showToast("Session expired. Please login again.", 'error');
//                 setTimeout(() => window.location.href = '/login', 2000);
//             } else {
//                 showToast("Failed to delete video.", 'error');
//             }
//         }
//     };

//     // Filter and Pagination
//     const filteredVideos = banners.filter(video =>
//         video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         video.description?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = filteredVideos.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);

//     // Statistics
//     const totalVideos = banners.length;

//     const styles = {
//         container: {
//             backgroundColor: theme.bg,
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
//             background: theme.primaryGradient,
//             WebkitBackgroundClip: 'text',
//             WebkitTextFillColor: 'transparent',
//             marginBottom: '8px'
//         },
//         pageSubtitle: {
//             color: theme.textLight,
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
//             backgroundColor: theme.card,
//             borderRadius: '16px',
//             padding: '20px',
//             border: `1px solid ${theme.border}`,
//             transition: 'all 0.3s ease',
//             cursor: 'pointer'
//         },
//         statIcon: {
//             width: '50px',
//             height: '50px',
//             borderRadius: '12px',
//             background: theme.primaryGradient,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             fontSize: '24px',
//             marginBottom: '16px'
//         },
//         statValue: {
//             fontSize: '28px',
//             fontWeight: '700',
//             color: theme.text,
//             marginBottom: '4px'
//         },
//         statLabel: {
//             fontSize: '13px',
//             color: theme.textLight,
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
//             border: `1px solid ${theme.border}`,
//             backgroundColor: theme.card,
//             color: theme.text,
//             width: '300px',
//             fontSize: '14px',
//             outline: 'none',
//             transition: 'all 0.3s'
//         },
//         addBtn: {
//             background: theme.primaryGradient,
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
//         videosGrid: {
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
//             gap: '24px',
//             marginBottom: '30px'
//         },
//         videoCard: {
//             backgroundColor: theme.card,
//             borderRadius: '20px',
//             overflow: 'hidden',
//             border: `1px solid ${theme.border}`,
//             transition: 'all 0.3s ease',
//             position: 'relative'
//         },
//         videoWrapper: {
//             position: 'relative',
//             paddingBottom: '56.25%',
//             height: 0,
//             overflow: 'hidden',
//             backgroundColor: '#000'
//         },
//         videoIframe: {
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             border: 'none'
//         },
//         cardContent: {
//             padding: '20px'
//         },
//         videoTitle: {
//             fontSize: '18px',
//             fontWeight: '700',
//             color: theme.text,
//             marginBottom: '8px'
//         },
//         videoDescription: {
//             fontSize: '13px',
//             color: theme.textLight,
//             lineHeight: '1.5',
//             marginBottom: '16px'
//         },
//         cardActions: {
//             display: 'flex',
//             gap: '10px',
//             paddingTop: '16px',
//             borderTop: `1px solid ${theme.border}`
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
//         deleteBtn: {
//             backgroundColor: `${theme.danger}20`,
//             color: theme.danger
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
//             border: `1px solid ${theme.border}`,
//             backgroundColor: theme.card,
//             color: theme.text,
//             cursor: 'pointer',
//             transition: 'all 0.3s',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center'
//         },
//         activePage: {
//             background: theme.primaryGradient,
//             color: 'white',
//             border: 'none'
//         },
//         emptyState: {
//             textAlign: 'center',
//             padding: '60px',
//             color: theme.textLight
//         },
//         loadingSpinner: {
//             textAlign: 'center',
//             padding: '60px',
//             color: theme.textLight
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
//             backgroundColor: theme.card,
//             borderRadius: '24px',
//             width: '500px',
//             maxWidth: '90%',
//             maxHeight: '90vh',
//             overflowY: 'auto'
//         },
//         modalHeader: {
//             padding: '24px',
//             borderBottom: `1px solid ${theme.border}`,
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             position: 'sticky',
//             top: 0,
//             backgroundColor: theme.card,
//             zIndex: 1
//         },
//         modalBody: {
//             padding: '24px'
//         },
//         modalFooter: {
//             padding: '20px 24px',
//             borderTop: `1px solid ${theme.border}`,
//             display: 'flex',
//             justifyContent: 'flex-end',
//             gap: '12px'
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
//             transition: 'all 0.3s'
//         },
//         textarea: {
//             width: '100%',
//             padding: '10px 14px',
//             borderRadius: '10px',
//             border: `1px solid ${theme.border}`,
//             backgroundColor: theme.bg,
//             color: theme.text,
//             fontSize: '14px',
//             outline: 'none',
//             resize: 'vertical',
//             minHeight: '80px'
//         },
//         label: {
//             display: 'block',
//             marginBottom: '8px',
//             fontWeight: '600',
//             fontSize: '13px',
//             color: theme.text
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
//         },
//         disabledBtn: {
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
//                     .video-card:hover {
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
//                     .video-card {
//                         animation: slideUp 0.3s ease;
//                     }
//                 `}
//             </style>

//             <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
//                 <Sidebar theme={theme} isCollapsed={isCollapsed} activeView={activeView} />

//                 <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
//                     <Header 
//                         theme={theme}
//                         isDarkMode={isDarkMode}
//                         toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
//                         toggleSidebar={() => setIsCollapsed(!isCollapsed)}
//                     />

//                     <div style={styles.mainContent}>
//                         {/* Header Section */}
//                         <div style={styles.pageHeader}>
//                             <h1 style={styles.pageTitle}>Video Management</h1>
//                             <p style={styles.pageSubtitle}>Manage your video content and galleries</p>
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
//                                 <div style={styles.statIcon}>🎬</div>
//                                 <div style={styles.statValue}>{totalVideos}</div>
//                                 <div style={styles.statLabel}>Total Videos</div>
//                             </div>
//                             <div className="stat-card" style={styles.statCard}>
//                                 <div style={styles.statIcon}>📹</div>
//                                 <div style={styles.statValue}>HD</div>
//                                 <div style={styles.statLabel}>Quality</div>
//                             </div>
//                             <div className="stat-card" style={styles.statCard}>
//                                 <div style={styles.statIcon}>🎥</div>
//                                 <div style={styles.statValue}>Premium</div>
//                                 <div style={styles.statLabel}>Content</div>
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
//                                 onClick={() => setShowModal(true)}
//                                 disabled={loading}
//                             >
//                                 <i className="bi bi-plus-circle"></i> Add New Video
//                             </button>
//                         </div>

//                         {/* Videos Grid */}
//                         {loading && banners.length === 0 ? (
//                             <div style={styles.loadingSpinner}>
//                                 <div className="spinner-border text-primary" role="status">
//                                     <span className="visually-hidden">Loading...</span>
//                                 </div>
//                                 <p style={{ marginTop: '16px' }}>Loading videos...</p>
//                             </div>
//                         ) : currentItems.length > 0 ? (
//                             <>
//                                 <div style={styles.videosGrid}>
//                                     {currentItems.map((video) => (
//                                         <div key={video.id} className="video-card" style={styles.videoCard}>
//                                             <div style={styles.videoWrapper}>
//                                                 <iframe
//                                                     src={getEmbedUrl(video.video_url)}
//                                                     title={video.title}
//                                                     style={styles.videoIframe}
//                                                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                                                     allowFullScreen
//                                                 />
//                                             </div>
//                                             <div style={styles.cardContent}>
//                                                 <h3 style={styles.videoTitle}>{video.title}</h3>
//                                                 <p style={styles.videoDescription}>
//                                                     {video.description}
//                                                 </p>
//                                                 <div style={styles.cardActions}>
//                                                     <button 
//                                                         style={{...styles.actionBtn, ...styles.deleteBtn}}
//                                                         onClick={() => setDeleteConfirm(video)}
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
//                                 <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎬</div>
//                                 <h4>No Videos Found</h4>
//                                 <p style={{ color: theme.textLight, marginBottom: '20px' }}>
//                                     {searchTerm ? `No results found for "${searchTerm}"` : 'Start by adding your first video'}
//                                 </p>
//                                 {!searchTerm && (
//                                     <button style={styles.addBtn} onClick={() => setShowModal(true)}>
//                                         <i className="bi bi-plus-circle"></i> Add New Video
//                                     </button>
//                                 )}
//                             </div>
//                         )}
//                     </div>

//                     <Footer theme={theme} />
//                 </div>
//             </div>

//             {/* Toast Notification */}
//             {toast.show && (
//                 <div style={{
//                     ...styles.toast,
//                     backgroundColor: toast.type === 'success' ? theme.success : theme.danger
//                 }}>
//                     {toast.type === 'success' ? '✅' : '❌'} {toast.message}
//                 </div>
//             )}

//             {/* Add/Edit Modal */}
//             {showModal && (
//                 <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
//                     <div style={styles.modal} onClick={e => e.stopPropagation()}>
//                         <div style={styles.modalHeader}>
//                             <h5 style={{ margin: 0, fontWeight: '600' }}>
//                                 ✨ Add New Video
//                             </h5>
//                             <button 
//                                 onClick={() => setShowModal(false)}
//                                 style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: theme.text }}
//                             >
//                                 ×
//                             </button>
//                         </div>
//                         <form onSubmit={handleSubmit}>
//                             <div style={styles.modalBody}>
//                                 <div className="mb-3">
//                                     <label style={styles.label}>Video Title *</label>
//                                     <input
//                                         type="text"
//                                         name="title"
//                                         value={formData.title}
//                                         onChange={handleChange}
//                                         style={styles.input}
//                                         placeholder="Enter video title"
//                                         required
//                                         disabled={loading}
//                                     />
//                                 </div>

//                                 <div className="mb-3">
//                                     <label style={styles.label}>Description *</label>
//                                     <textarea
//                                         name="description"
//                                         value={formData.description}
//                                         onChange={handleChange}
//                                         style={styles.textarea}
//                                         placeholder="Enter video description"
//                                         required
//                                         disabled={loading}
//                                     />
//                                 </div>

//                                 <div className="mb-4">
//                                     <label style={styles.label}>Video URL *</label>
//                                     <input
//                                         type="url"
//                                         name="videoUrl"
//                                         value={formData.videoUrl}
//                                         onChange={handleChange}
//                                         style={styles.input}
//                                         placeholder="https://youtube.com/watch?v=..."
//                                         required
//                                         disabled={loading}
//                                     />
//                                     <small style={{ color: theme.textLight, fontSize: '11px', display: 'block', marginTop: '5px' }}>
//                                         Supports YouTube, Vimeo, and other video platforms
//                                     </small>
//                                 </div>
//                             </div>
//                             <div style={styles.modalFooter}>
//                                 <button 
//                                     type="button" 
//                                     onClick={() => setShowModal(false)}
//                                     style={{...styles.actionBtn, backgroundColor: theme.border, color: theme.text, padding: '10px 24px'}}
//                                     disabled={loading}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button 
//                                     type="submit" 
//                                     disabled={loading}
//                                     style={{...styles.addBtn, padding: '10px 32px', ...(loading && styles.disabledBtn)}}
//                                 >
//                                     {loading ? (
//                                         <>
//                                             <span className="spinner-border spinner-border-sm me-2"></span>
//                                             Saving...
//                                         </>
//                                     ) : (
//                                         'Save Video'
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
//                                 <p style={{ fontSize: '13px', color: theme.textLight }}>This action cannot be undone.</p>
//                             </div>
//                         </div>
//                         <div style={styles.modalFooter}>
//                             <button 
//                                 onClick={() => setDeleteConfirm(null)} 
//                                 style={{...styles.actionBtn, backgroundColor: theme.border, color: theme.text, padding: '10px 24px'}}
//                                 disabled={loading}
//                             >
//                                 Cancel
//                             </button>
//                             <button 
//                                 onClick={() => handleDelete(deleteConfirm.id)} 
//                                 style={{...styles.deleteBtn, padding: '10px 24px', border: 'none', borderRadius: '10px'}}
//                                 disabled={loading}
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default VideoSection;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const ITEMS_PER_PAGE = 6;
const EMPTY_FORM = { title: '', videoUrl: '', description: '' };

const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const getEmbedUrl = (url) => {
    const videoId = getYoutubeId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
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
            width: '100%', maxWidth: width || '480px', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column', animation: 'slideUp .2s ease'
        }}>
            <div style={{
                padding: '18px 22px', borderBottom: `1px solid ${theme.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <h5 style={{ margin: 0, fontWeight: 600 }}>{title}</h5>
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '20px', color: theme.text, opacity: 0.6, cursor: 'pointer' }}>✕</button>
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

const VideoSection = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const theme = {
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
        Role: localStorage.getItem('Role') || 'admin',
        'Content-Type': 'application/json'
    });

    const checkAuth = () => {
        if (!localStorage.getItem('token')) {
            setAuthError('Please login to access this page');
            setTimeout(() => { window.location.href = '/login'; }, 2000);
            return false;
        }
        return true;
    };

    const handleAuthFailure = (setter) => {
        localStorage.removeItem('token');
        localStorage.removeItem('Role');
        setter('Session expired. Please login again.');
        setTimeout(() => { window.location.href = '/login'; }, 2000);
    };

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const fetchVideos = async () => {
        if (!checkAuth()) return;
        setLoading(true);
        setAuthError(null);
        try {
            const res = await axios.get(`${BASE_URL}/get-videos`, { headers: getAuthHeaders() });
            setVideos(Array.isArray(res.data) ? res.data : res.data.data || []);
        } catch (err) {
            console.error('Fetch error:', err);
            if (err.response?.status === 401) handleAuthFailure(setAuthError);
            else showToast('Failed to fetch videos', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchVideos(); }, []);

    const closeModal = () => { setShowModal(false); setFormData(EMPTY_FORM); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!checkAuth()) return;
        setLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/add-videos`, {
                title: formData.title,
                description: formData.description,
                video_url: formData.videoUrl
            }, { headers: getAuthHeaders() });

            if (res.data) {
                showToast('Video added successfully!');
                closeModal();
                fetchVideos();
            }
        } catch (err) {
            console.error('Submit error:', err.response?.data || err.message);
            if (err.response?.status === 401) handleAuthFailure((m) => showToast(m, 'error'));
            else showToast(err.response?.data?.message || 'Something went wrong!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!checkAuth()) return;
        try {
            await axios.delete(`${BASE_URL}/del-videos/${id}`, { headers: getAuthHeaders() });
            showToast('Video deleted successfully!');
            fetchVideos();
            setDeleteConfirm(null);
        } catch (err) {
            console.error('Delete error:', err);
            if (err.response?.status === 401) handleAuthFailure((m) => showToast(m, 'error'));
            else showToast('Failed to delete video.', 'error');
        }
    };

    const filteredVideos = videos.filter(v =>
        v.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalPages = Math.ceil(filteredVideos.length / ITEMS_PER_PAGE);
    const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = filteredVideos.slice(indexOfFirstItem, indexOfFirstItem + ITEMS_PER_PAGE);

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }}>
            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="video" />

                <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                    <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />

                    <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
                        <div style={{ marginBottom: '26px' }}>
                            <h1 style={{ fontSize: '26px', fontWeight: 700, color: theme.text, margin: 0 }}>Video Management</h1>
                            <p style={{ color: theme.textLight, margin: '4px 0 0' }}>Manage your video content and galleries</p>
                        </div>

                        {authError && (
                            <div className="alert" role="alert" style={{ border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text }}>
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>{authError}
                            </div>
                        )}

                        {/* Stats */}
                        <div className="row g-3 mb-4">
                            {[
                                { label: 'Total Videos', value: videos.length },
                                { label: 'Quality', value: 'HD' },
                                { label: 'Content', value: 'Premium' }
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
                                placeholder="Search by title or description..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                style={{ ...fieldStyle, width: '300px', backgroundColor: theme.card }}
                            />
                            <button
                                onClick={() => setShowModal(true)}
                                disabled={loading}
                                style={{ backgroundColor: accent, color: accentOn, border: 'none', padding: '10px 22px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                            >
                                <i className="bi bi-plus-circle me-2"></i>Add New Video
                            </button>
                        </div>

                        {/* Videos Grid */}
                        {loading && videos.length === 0 ? (
                            <div className="text-center py-5">
                                <div className="spinner-border" style={{ color: accent }} role="status"></div>
                                <p className="mt-3" style={{ color: theme.textLight }}>Loading videos...</p>
                            </div>
                        ) : currentItems.length > 0 ? (
                            <>
                                <div className="row g-3">
                                    {currentItems.map(video => (
                                        <div className="col-md-6 col-lg-4" key={video.id}>
                                            <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', overflow: 'hidden', height: '100%' }}>
                                                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, backgroundColor: '#000' }}>
                                                    <iframe
                                                        src={getEmbedUrl(video.video_url)}
                                                        title={video.title}
                                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                </div>
                                                <div style={{ padding: '16px' }}>
                                                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: theme.text, marginBottom: '6px' }}>{video.title}</h3>
                                                    <p style={{ fontSize: '13px', color: theme.textLight, lineHeight: 1.5, marginBottom: '14px' }}>
                                                        {video.description}
                                                    </p>
                                                    <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '12px' }}>
                                                        <button className="btn btn-sm btn-outline-dark w-100" onClick={() => setDeleteConfirm(video)} disabled={loading}>
                                                            <i className="bi bi-trash me-1"></i>Delete
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
                                <i className="bi bi-camera-reels display-4 d-block mb-3" style={{ opacity: 0.4 }}></i>
                                <h5 style={{ color: theme.text }}>No Videos Found</h5>
                                <p className="mb-3">{searchTerm ? `No results found for "${searchTerm}"` : 'Start by adding your first video'}</p>
                                {!searchTerm && (
                                    <button onClick={() => setShowModal(true)} style={{ backgroundColor: accent, color: accentOn, border: 'none', padding: '10px 22px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                                        <i className="bi bi-plus-circle me-2"></i>Add New Video
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <Footer theme={theme} />
                </div>
            </div>

            {/* Add Modal */}
            {showModal && (
                <form onSubmit={handleSubmit}>
                    <Modal
                        theme={theme}
                        title="Add New Video"
                        onClose={closeModal}
                        footer={<>
                            <button type="button" onClick={closeModal} disabled={loading} className="btn btn-outline-dark">Cancel</button>
                            <button type="submit" disabled={loading} style={{ backgroundColor: accent, color: accentOn, border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                                {loading ? (<><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>) : 'Save Video'}
                            </button>
                        </>}
                    >
                        <div className="mb-3">
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Video Title *</label>
                            <input type="text" name="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={fieldStyle} placeholder="Enter video title" required disabled={loading} />
                        </div>
                        <div className="mb-3">
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Description *</label>
                            <textarea name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ ...fieldStyle, minHeight: '80px' }} placeholder="Enter video description" required disabled={loading} />
                        </div>
                        <div>
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Video URL *</label>
                            <input type="url" name="videoUrl" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} style={fieldStyle} placeholder="https://youtube.com/watch?v=..." required disabled={loading} />
                            <small style={{ color: theme.textLight, fontSize: '11px', display: 'block', marginTop: '5px' }}>
                                Supports YouTube, Vimeo, and other video platforms
                            </small>
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
                        <h5 style={{ margin: '0 0 8px', fontWeight: 600 }}>Delete this video?</h5>
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

export default VideoSection;