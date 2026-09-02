// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import Footer from './Footer';

// // Laravel Backend URL - Dynamic from env
// const API_BASE_URL = import.meta.env.VITE_BASE_URL;
// const STORAGE_URL = import.meta.env.API_URL;

// const ProjectState = ({ theme: propsTheme }) => {
//     // --- State Management ---
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [galleryItems, setGalleryItems] = useState([]);
//     const [editingItem, setEditingItem] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [deleteConfirm, setDeleteConfirm] = useState(null);
//     const [authError, setAuthError] = useState(null);
//     const itemsPerPage = 8;
    
//     const [formData, setFormData] = useState({
//         title: '',
//         image: null,
//         imagePreview: ''
//     });

//     // --- Dynamic Theme ---
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
//         tableHeader: isDarkMode ? '#25253a' : '#f8f9fa'
//     };

//     // Get authentication headers
//     const getAuthHeaders = () => {
//         const token = localStorage.getItem('token');
//         return {
//             'Authorization': `Bearer ${token}`,
//             'Role': localStorage.getItem('Role') || 'admin'
//         };
//     };

//     // Get multipart headers for file upload
//     const getMultipartHeaders = () => {
//         const token = localStorage.getItem('token');
//         return {
//             'Authorization': `Bearer ${token}`,
//             'Role': localStorage.getItem('Role') || 'admin',
//             'Content-Type': 'multipart/form-data'
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

//     // Helper function to get image URL
//     const getImageUrl = (imagePath) => {
//         if (!imagePath) return null;
//         if (imagePath.startsWith('http')) return imagePath;
//         if (imagePath.startsWith('/storage/')) {
//             return `${STORAGE_URL}${imagePath}`;
//         }
//         if (imagePath.startsWith('storage/')) {
//             return `${STORAGE_URL}/${imagePath}`;
//         }
//         return `${STORAGE_URL}/storage/${imagePath}`;
//     };

//     // --- API Logic with Authentication ---
//     const fetchGallery = async () => {
//         if (!checkAuth()) return;
        
//         setLoading(true);
//         setAuthError(null);
        
//         try {
//             const headers = getAuthHeaders();
//             const res = await axios.get(`${API_BASE_URL}/peoject-view`, { headers });
            
//             if (res.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 setAuthError("Session expired. Please login again.");
//                 setTimeout(() => window.location.href = '/login', 2000);
//                 return;
//             }
            
//             setGalleryItems(res.data);
//         } catch (err) {
//             console.error("Data Load Error:", err);
//             if (err.response?.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 setAuthError("Session expired. Please login again.");
//                 setTimeout(() => window.location.href = '/login', 2000);
//             } else {
//                 setAuthError("Failed to fetch gallery images. Please try again.");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchGallery();
//     }, []);

//     // --- Filter and Pagination ---
//     const filteredItems = galleryItems.filter(item =>
//         item.title?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

//     // Statistics
//     const totalItems = galleryItems.length;

//     // --- Handlers with Authentication ---
//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             if (file.size > 5 * 1024 * 1024) {
//                 alert('Image size should be less than 5MB');
//                 return;
//             }
//             // Clean up old preview URL
//             if (formData.imagePreview && formData.imagePreview.startsWith('blob:')) {
//                 URL.revokeObjectURL(formData.imagePreview);
//             }
//             setFormData({
//                 ...formData,
//                 image: file,
//                 imagePreview: URL.createObjectURL(file)
//             });
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         if (!checkAuth()) return;
        
//         setLoading(true);

//         const data = new FormData();
//         data.append('title', formData.title);
        
//         if (formData.image instanceof File) {
//             data.append('image', formData.image);
//         }

//         try {
//             const headers = getMultipartHeaders();
//             const url = editingItem 
//                 ? `${API_BASE_URL}/peoject-view/${editingItem.id}` 
//                 : `${API_BASE_URL}/peoject-view`;

//             if (editingItem) {
//                 data.append('_method', 'POST');
//             }

//             const response = await axios.post(url, data, { headers });
            
//             if (response.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 alert("Session expired. Please login again.");
//                 setTimeout(() => window.location.href = '/login', 2000);
//                 return;
//             }

//             fetchGallery();
//             closeModal();
//             alert(editingItem ? "Image updated successfully!" : "Image uploaded successfully!");
//         } catch (err) {
//             console.error("Full Error Object:", err.response);
//             if (err.response?.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 alert("Session expired. Please login again.");
//                 setTimeout(() => window.location.href = '/login', 2000);
//             } else {
//                 alert("Upload failed: " + (err.response?.data?.message || "Something went wrong!"));
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!checkAuth()) return;
        
//         try {
//             const headers = getAuthHeaders();
//             const response = await axios.delete(`${API_BASE_URL}/peoject-view/${id}`, { headers });
            
//             if (response.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 alert("Session expired. Please login again.");
//                 setTimeout(() => window.location.href = '/login', 2000);
//                 return;
//             }
            
//             fetchGallery();
//             setDeleteConfirm(null);
//             alert("Image deleted successfully!");
//         } catch (err) {
//             console.error("Delete Error:", err);
//             if (err.response?.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 alert("Session expired. Please login again.");
//                 setTimeout(() => window.location.href = '/login', 2000);
//             } else {
//                 alert("Failed to delete image");
//             }
//         }
//     };

//     const openEditModal = (item) => {
//         setEditingItem(item);
//         setFormData({
//             title: item.title,
//             image: null,
//             imagePreview: getImageUrl(item.image_url)
//         });
//         setShowModal(true);
//     };

//     const closeModal = () => {
//         // Clean up blob URL
//         if (formData.imagePreview && formData.imagePreview.startsWith('blob:')) {
//             URL.revokeObjectURL(formData.imagePreview);
//         }
//         setShowModal(false);
//         setEditingItem(null);
//         setFormData({ title: '', image: null, imagePreview: '' });
//     };

//     // --- Styles ---
//     const styles = {
//         container: {
//             backgroundColor: theme.bg,
//             minHeight: '100vh',
//             transition: 'all 0.3s ease'
//         },
//         mainWrapper: {
//             display: 'flex',
//             flexDirection: 'column',
//             flexGrow: 1,
//             height: '100vh',
//             overflow: 'hidden'
//         },
//         scrollContent: {
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
//         galleryGrid: {
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
//             gap: '24px',
//             marginBottom: '30px'
//         },
//         galleryCard: {
//             backgroundColor: theme.card,
//             borderRadius: '20px',
//             overflow: 'hidden',
//             border: `1px solid ${theme.border}`,
//             transition: 'all 0.3s ease',
//             position: 'relative'
//         },
//         cardImage: {
//             width: '100%',
//             height: '200px',
//             objectFit: 'cover',
//             transition: 'transform 0.5s ease'
//         },
//         cardContent: {
//             padding: '16px'
//         },
//         cardTitle: {
//             fontSize: '16px',
//             fontWeight: '600',
//             color: theme.text,
//             marginBottom: '8px'
//         },
//         cardDate: {
//             fontSize: '11px',
//             color: theme.textLight,
//             marginBottom: '12px',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '5px'
//         },
//         cardActions: {
//             display: 'flex',
//             gap: '10px',
//             paddingTop: '12px',
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
//         editBtn: {
//             backgroundColor: `${theme.primary}15`,
//             color: theme.primary
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
//         label: {
//             display: 'block',
//             marginBottom: '8px',
//             fontWeight: '600',
//             fontSize: '13px',
//             color: theme.text
//         },
//         imagePreview: {
//             width: '100%',
//             height: '180px',
//             objectFit: 'cover',
//             borderRadius: '12px',
//             marginTop: '12px',
//             border: `2px solid ${theme.primary}`
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
//                     .stat-card:hover {
//                         transform: translateY(-4px);
//                         box-shadow: 0 8px 25px rgba(94, 46, 16, 0.15);
//                     }
//                     .gallery-card:hover {
//                         transform: translateY(-6px);
//                         box-shadow: 0 12px 35px rgba(0,0,0,0.2);
//                     }
//                     .gallery-card:hover img {
//                         transform: scale(1.05);
//                     }
//                     button:hover {
//                         transform: translateY(-2px);
//                     }
//                     .search-box:focus {
//                         border-color: #5e2e10;
//                         box-shadow: 0 0 0 3px rgba(94, 46, 16, 0.1);
//                     }
//                     .gallery-card {
//                         animation: slideUp 0.3s ease;
//                     }
//                 `}
//             </style>

//             <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
//                 <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="gallery" />

//                 <div style={styles.mainWrapper}>
//                     <Header 
//                         theme={theme} 
//                         isDarkMode={isDarkMode}
//                         toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
//                         toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
//                     />

//                     <div style={styles.scrollContent}>
//                         {/* Header Section */}
//                         <div style={styles.pageHeader}>
//                             <h1 style={styles.pageTitle}>Gallery Management</h1>
//                             <p style={styles.pageSubtitle}>Manage your image gallery assets</p>
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
//                                 <div style={styles.statIcon}>🖼️</div>
//                                 <div style={styles.statValue}>{totalItems}</div>
//                                 <div style={styles.statLabel}>Total Images</div>
//                             </div>
//                             <div className="stat-card" style={styles.statCard}>
//                                 <div style={styles.statIcon}>📸</div>
//                                 <div style={styles.statValue}>HD Quality</div>
//                                 <div style={styles.statLabel}>Resolution</div>
//                             </div>
//                             <div className="stat-card" style={styles.statCard}>
//                                 <div style={styles.statIcon}>💾</div>
//                                 <div style={styles.statValue}>Cloud</div>
//                                 <div style={styles.statLabel}>Storage</div>
//                             </div>
//                         </div>

//                         {/* Toolbar */}
//                         <div style={styles.toolbar}>
//                             <input
//                                 type="text"
//                                 placeholder="🔍 Search by title..."
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
//                                 <i className="bi bi-plus-circle"></i> Add New Image
//                             </button>
//                         </div>

//                         {/* Gallery Grid */}
//                         {loading ? (
//                             <div style={styles.loadingSpinner}>
//                                 <div className="spinner-border text-primary" role="status">
//                                     <span className="visually-hidden">Loading...</span>
//                                 </div>
//                                 <p style={{ marginTop: '16px' }}>Loading gallery images...</p>
//                             </div>
//                         ) : currentItems.length > 0 ? (
//                             <>
//                                 <div style={styles.galleryGrid}>
//                                     {currentItems.map((item) => (
//                                         <div key={item.id} className="gallery-card" style={styles.galleryCard}>
//                                             <img 
//                                                 src={getImageUrl(item.image_url) || 'https://via.placeholder.com/400x200?text=Gallery+Image'} 
//                                                 alt={item.title}
//                                                 style={styles.cardImage}
//                                                 onError={(e) => {
//                                                     e.target.onerror = null;
//                                                     e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
//                                                 }}
//                                             />
//                                             <div style={styles.cardContent}>
//                                                 <h3 style={styles.cardTitle}>{item.title}</h3>
//                                                 <div style={styles.cardDate}>
//                                                     <i className="bi bi-calendar"></i>
//                                                     {new Date(item.created_at).toLocaleDateString()}
//                                                 </div>
//                                                 <div style={styles.cardActions}>
//                                                     <button 
//                                                         style={{...styles.actionBtn, ...styles.editBtn}}
//                                                         onClick={() => openEditModal(item)}
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
//                                 <div style={{ fontSize: '64px', marginBottom: '16px' }}>🖼️</div>
//                                 <h4>No Gallery Images Found</h4>
//                                 <p style={{ color: theme.textLight, marginBottom: '20px' }}>
//                                     {searchTerm ? `No results found for "${searchTerm}"` : 'Start by adding your first image'}
//                                 </p>
//                                 {!searchTerm && (
//                                     <button style={styles.addBtn} onClick={() => setShowModal(true)}>
//                                         <i className="bi bi-plus-circle"></i> Add New Image
//                                     </button>
//                                 )}
//                             </div>
//                         )}
//                     </div>

//                     <Footer theme={theme} />
//                 </div>
//             </div>

//             {/* Add/Edit Modal */}
//             {showModal && (
//                 <div style={styles.modalOverlay} onClick={closeModal}>
//                     <div style={styles.modal} onClick={e => e.stopPropagation()}>
//                         <div style={styles.modalHeader}>
//                             <h5 style={{ margin: 0, fontWeight: '600' }}>
//                                 {editingItem ? '✏️ Edit Image' : '✨ Add New Image'}
//                             </h5>
//                             <button 
//                                 onClick={closeModal}
//                                 style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: theme.text }}
//                             >
//                                 ×
//                             </button>
//                         </div>
//                         <form onSubmit={handleSubmit}>
//                             <div style={styles.modalBody}>
//                                 <div className="mb-3">
//                                     <label style={styles.label}>Image Title *</label>
//                                     <input 
//                                         type="text" 
//                                         style={styles.input}
//                                         value={formData.title}
//                                         onChange={e => setFormData({...formData, title: e.target.value})}
//                                         placeholder="Enter image title"
//                                         required
//                                         disabled={loading}
//                                     />
//                                 </div>
//                                 <div className="mb-3">
//                                     <label style={styles.label}>Image File {!editingItem && '*'}</label>
//                                     <input 
//                                         type="file" 
//                                         style={styles.input}
//                                         accept="image/*"
//                                         onChange={handleImageChange}
//                                         required={!editingItem}
//                                         disabled={loading}
//                                     />
//                                     <small style={{ color: theme.textLight, fontSize: '11px' }}>
//                                         Max size: 5MB (JPG, PNG, WebP)
//                                     </small>
//                                 </div>
//                                 {formData.imagePreview && (
//                                     <img 
//                                         src={formData.imagePreview} 
//                                         alt="Preview" 
//                                         style={styles.imagePreview}
//                                         onError={(e) => {
//                                             e.target.onerror = null;
//                                             e.target.src = 'https://via.placeholder.com/400x200?text=Preview';
//                                         }}
//                                     />
//                                 )}
//                             </div>
//                             <div style={styles.modalFooter}>
//                                 <button 
//                                     type="button" 
//                                     onClick={closeModal}
//                                     style={{...styles.actionBtn, backgroundColor: theme.border, color: theme.text, padding: '10px 24px'}}
//                                     disabled={loading}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button 
//                                     type="submit" 
//                                     disabled={loading}
//                                     style={{...styles.addBtn, padding: '10px 32px', ...(loading && styles.buttonDisabled)}}
//                                 >
//                                     {loading ? (
//                                         <>
//                                             <span className="spinner-border spinner-border-sm me-2"></span>
//                                             Processing...
//                                         </>
//                                     ) : (
//                                         editingItem ? 'Update Image' : 'Upload Image'
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
//                                 {loading ? 'Deleting...' : 'Delete'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };



// export default ProjectState



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const STORAGE_URL = import.meta.env.API_URL;
const ITEMS_PER_PAGE = 8;
const PLACEHOLDER_IMG = 'https://via.placeholder.com/400x200?text=No+Image';

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    Role: localStorage.getItem('Role') || 'admin'
});
const getMultipartHeaders = () => ({ ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' });

const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/storage/')) return `${STORAGE_URL}${imagePath}`;
    if (imagePath.startsWith('storage/')) return `${STORAGE_URL}/${imagePath}`;
    return `${STORAGE_URL}/storage/${imagePath}`;
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
            width: '100%', maxWidth: width || '460px', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column', animation: 'slideUp .25s ease'
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

const ProjectState = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({ title: '', image: null, imagePreview: '' });

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

    const fetchGallery = async () => {
        if (!checkAuth()) return;
        setLoading(true);
        setAuthError(null);
        try {
            const res = await axios.get(`${API_BASE_URL}/peoject-view`, { headers: getAuthHeaders() });
            setGalleryItems(res.data);
        } catch (err) {
            console.error('Data Load Error:', err);
            if (err.response?.status === 401) handleAuthFailure();
            else setAuthError('Failed to fetch gallery images. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchGallery(); }, []);

    const filteredItems = galleryItems.filter(item => item.title?.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfFirstItem + ITEMS_PER_PAGE);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) return alert('Image size should be less than 5MB');
        if (formData.imagePreview?.startsWith('blob:')) URL.revokeObjectURL(formData.imagePreview);
        setFormData({ ...formData, image: file, imagePreview: URL.createObjectURL(file) });
    };

    const openAddModal = () => { setEditingItem(null); setFormData({ title: '', image: null, imagePreview: '' }); setShowModal(true); };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormData({ title: item.title, image: null, imagePreview: getImageUrl(item.image_url) });
        setShowModal(true);
    };

    const closeModal = () => {
        if (formData.imagePreview?.startsWith('blob:')) URL.revokeObjectURL(formData.imagePreview);
        setShowModal(false);
        setEditingItem(null);
        setFormData({ title: '', image: null, imagePreview: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!checkAuth()) return;
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        if (formData.image instanceof File) data.append('image', formData.image);
        if (editingItem) data.append('_method', 'POST');

        try {
            const url = editingItem ? `${API_BASE_URL}/peoject-view/${editingItem.id}` : `${API_BASE_URL}/peoject-view`;
            await axios.post(url, data, { headers: getMultipartHeaders() });
            fetchGallery();
            closeModal();
            alert(editingItem ? 'Image updated successfully!' : 'Image uploaded successfully!');
        } catch (err) {
            console.error('Upload Error:', err.response);
            if (err.response?.status === 401) handleAuthFailure();
            else alert('Upload failed: ' + (err.response?.data?.message || 'Something went wrong!'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!checkAuth()) return;
        setLoading(true);
        try {
            await axios.delete(`${API_BASE_URL}/peoject-view/${id}`, { headers: getAuthHeaders() });
            fetchGallery();
            setDeleteConfirm(null);
        } catch (err) {
            console.error('Delete Error:', err);
            if (err.response?.status === 401) handleAuthFailure();
            else alert('Failed to delete image');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }} className="container-fluid p-0">
            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="gallery" />

                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100vh', overflow: 'hidden' }}>
                    <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

                    <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
                        <div style={{ marginBottom: '26px' }}>
                            <h1 style={{ fontSize: '26px', fontWeight: 700, color: theme.text, margin: 0 }}>Gallery Management</h1>
                            <p style={{ color: theme.textLight, margin: '4px 0 0' }}>Manage your image gallery assets</p>
                        </div>

                        {authError && (
                            <div className="alert" role="alert" style={{ border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text }}>
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>{authError}
                            </div>
                        )}

                        {/* Stats */}
                        <div className="row g-3 mb-4">
                            {[
                                { label: 'Total Images', value: galleryItems.length },
                                { label: 'Resolution', value: 'HD Quality' },
                                { label: 'Storage', value: 'Cloud' }
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
                                placeholder="Search by title..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                style={{ ...fieldStyle, width: '280px', backgroundColor: theme.card }}
                            />
                            <button
                                onClick={openAddModal}
                                disabled={loading}
                                style={{ backgroundColor: accent, color: accentOn, border: 'none', padding: '10px 22px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                            >
                                <i className="bi bi-plus-circle me-2"></i>Add New Image
                            </button>
                        </div>

                        {/* Gallery Grid */}
                        {loading && galleryItems.length === 0 ? (
                            <div className="text-center py-5">
                                <div className="spinner-border" style={{ color: accent }} role="status"></div>
                                <p className="mt-3" style={{ color: theme.textLight }}>Loading gallery images...</p>
                            </div>
                        ) : currentItems.length > 0 ? (
                            <>
                                <div className="row g-3">
                                    {currentItems.map(item => (
                                        <div className="col-6 col-md-4 col-lg-3" key={item.id}>
                                            <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', overflow: 'hidden', height: '100%' }}>
                                                <img
                                                    src={getImageUrl(item.image_url) || PLACEHOLDER_IMG}
                                                    alt={item.title}
                                                    style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                                                    onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMG; }}
                                                />
                                                <div style={{ padding: '14px' }}>
                                                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: theme.text, marginBottom: '6px' }}>{item.title}</h3>
                                                    <div style={{ fontSize: '11px', color: theme.textLight, marginBottom: '12px' }}>
                                                        <i className="bi bi-calendar me-1"></i>{new Date(item.created_at).toLocaleDateString()}
                                                    </div>
                                                    <div className="d-flex gap-2" style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '10px' }}>
                                                        <button className="btn btn-sm btn-outline-dark flex-fill" onClick={() => openEditModal(item)} disabled={loading}>
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
                                <i className="bi bi-images display-4 d-block mb-3" style={{ opacity: 0.4 }}></i>
                                <h5 style={{ color: theme.text }}>No Gallery Images Found</h5>
                                <p className="mb-3">{searchTerm ? `No results found for "${searchTerm}"` : 'Start by adding your first image'}</p>
                                {!searchTerm && (
                                    <button onClick={openAddModal} style={{ backgroundColor: accent, color: accentOn, border: 'none', padding: '10px 22px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                                        <i className="bi bi-plus-circle me-2"></i>Add New Image
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
                <form onSubmit={handleSubmit}>
                    <Modal
                        theme={theme}
                        title={editingItem ? 'Edit Image' : 'Add New Image'}
                        onClose={closeModal}
                        footer={<>
                            <button type="button" onClick={closeModal} disabled={loading} className="btn btn-outline-dark">Cancel</button>
                            <button type="submit" disabled={loading} style={{ backgroundColor: accent, color: accentOn, border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                                {loading ? (<><span className="spinner-border spinner-border-sm me-2"></span>Processing...</>) : (editingItem ? 'Update Image' : 'Upload Image')}
                            </button>
                        </>}
                    >
                        <div className="mb-3">
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Image Title *</label>
                            <input
                                type="text"
                                style={fieldStyle}
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter image title"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-3">
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Image File {!editingItem && '*'}</label>
                            <input
                                type="file"
                                style={fieldStyle}
                                accept="image/*"
                                onChange={handleImageChange}
                                required={!editingItem}
                                disabled={loading}
                            />
                            <small style={{ color: theme.textLight, fontSize: '11px' }}>Max size: 5MB (JPG, PNG, WebP)</small>
                        </div>
                        {formData.imagePreview && (
                            <img
                                src={formData.imagePreview}
                                alt="Preview"
                                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', border: `1px solid ${theme.border}` }}
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x200?text=Preview'; }}
                            />
                        )}
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
                        <h5 style={{ margin: '0 0 8px', fontWeight: 600 }}>Delete this image?</h5>
                        <p style={{ margin: '0 0 22px', color: theme.textLight, fontSize: '14px' }}>
                            "<strong>{deleteConfirm.title}</strong>" will be permanently removed. This can't be undone.
                        </p>
                        <div className="d-flex gap-2">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                disabled={loading}
                                className="btn btn-outline-dark flex-fill"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm.id)}
                                disabled={loading}
                                className="btn flex-fill"
                                style={{ backgroundColor: accent, color: accentOn, border: 'none' }}
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
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

export default ProjectState;
