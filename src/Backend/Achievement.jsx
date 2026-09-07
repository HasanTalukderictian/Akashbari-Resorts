// import React, { useState, useEffect } from 'react';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import Footer from './Footer';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import { FaEdit, FaTrash, FaUpload, FaTimes } from 'react-icons/fa';

// const Achievement = ({ theme: propsTheme }) => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(false);
//     const [achievements, setAchievements] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [currentId, setCurrentId] = useState(null);
//     const [formData, setFormData] = useState({
//         name: '',
//         image: null
//     });
//     const [imagePreview, setImagePreview] = useState(null);

//     const theme = propsTheme || {
//         isDarkMode,
//         bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
//         card: isDarkMode ? '#16213e' : '#ffffff',
//         text: isDarkMode ? '#e9ecef' : '#3e4b5b',
//         border: isDarkMode ? '#2d3436' : '#ebedf2',
//         sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b',
//         primary: '#5e2e10'
//     };

//     // Environment variables - FIXED
//     const BASE_URL = import.meta.env.VITE_BASE_URL;
//     const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL;

//     // Storage URL - FIXED (removed localhost)
//     const STORAGE_URL = API_URL.replace('/api', '');

//     // Function to get image URL - FIXED
//     const getImageUrl = (imagePath) => {
//         if (!imagePath) return 'https://via.placeholder.com/300x200?text=No+Image';
//         if (imagePath.startsWith('http')) return imagePath;

//         // Remove backslashes and clean the path
//         let cleanPath = imagePath.replace(/\\/g, '/');
//         cleanPath = cleanPath.replace(/^\/+/, '');

//         // Return the full URL with storage
//         return `${STORAGE_URL}/storage/${cleanPath}`;
//     };

//     // Configure axios defaults
//     axios.defaults.withCredentials = false;
//     axios.defaults.headers.common['Accept'] = 'application/json';
//     axios.defaults.headers.common['Content-Type'] = 'application/json';

//     // Fetch all achievements
//     const fetchAchievements = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`${BASE_URL}/get-achievement`, {
//                 headers: {
//                     'Accept': 'application/json',
//                 }
//             });

//             console.log('Fetch response:', response.data);

//             if (response.data.status === true) {
//                 setAchievements(response.data.data || []);
//             } else {
//                 setAchievements([]);
//             }
//         } catch (error) {
//             console.error('Error fetching achievements:', error);
//             if (error.response) {
//                 console.error('Error response:', error.response.data);
//                 Swal.fire('Error!', `Failed to fetch achievements: ${error.response.data.message || 'Server error'}`, 'error');
//             } else {
//                 Swal.fire('Error!', 'Failed to fetch achievements. Please check if backend is running.', 'error');
//             }
//             setAchievements([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchAchievements();
//     }, []);

//     // Handle form input change
//     const handleInputChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     // Handle image selection
//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             // Validate file type
//             const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
//             if (!allowedTypes.includes(file.type)) {
//                 Swal.fire('Error!', 'Only JPG, JPEG, PNG, and GIF files are allowed', 'error');
//                 return;
//             }

//             // Validate file size (max 2MB)
//             if (file.size > 2 * 1024 * 1024) {
//                 Swal.fire('Error!', 'File size should be less than 2MB', 'error');
//                 return;
//             }

//             setFormData({
//                 ...formData,
//                 image: file
//             });
//             // Create preview
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setImagePreview(reader.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     // Reset form
//     const resetForm = () => {
//         setFormData({
//             name: '',
//             image: null
//         });
//         setImagePreview(null);
//         setIsEditing(false);
//         setCurrentId(null);
//     };

//     // Open modal for add
//     const handleAddClick = () => {
//         resetForm();
//         setShowModal(true);
//         setIsEditing(false);
//     };

//     // Open modal for edit
//     const handleEditClick = (achievement) => {
//         setIsEditing(true);
//         setCurrentId(achievement.id);
//         setFormData({
//             name: achievement.name,
//             image: null
//         });
//         // Set image preview from existing image
//         const imageUrl = getImageUrl(achievement.image);
//         setImagePreview(imageUrl);
//         setShowModal(true);
//     };

//     // Submit form (Add/Edit)
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!formData.name) {
//             Swal.fire('Warning!', 'Please enter name', 'warning');
//             return;
//         }

//         // For add, image is required
//         if (!isEditing && !formData.image) {
//             Swal.fire('Warning!', 'Please select an image', 'warning');
//             return;
//         }

//         const formDataToSend = new FormData();
//         formDataToSend.append('name', formData.name);
//         if (formData.image) {
//             formDataToSend.append('image', formData.image);
//         }

//         setLoading(true);

//         try {
//             let response;
//             const config = {
//                 headers: { 
//                     'Content-Type': 'multipart/form-data',
//                     'Accept': 'application/json'
//                 }
//             };

//             if (isEditing) {
//                 response = await axios.post(`${BASE_URL}/edit-achievement/${currentId}`, formDataToSend, config);
//             } else {
//                 response = await axios.post(`${BASE_URL}/add-achievement`, formDataToSend, config);
//             }

//             console.log('Submit response:', response.data);

//             if (response.data.status === true) {
//                 Swal.fire('Success!', response.data.message || (isEditing ? 'Achievement updated successfully' : 'Achievement added successfully'), 'success');
//                 resetForm();
//                 setShowModal(false);
//                 fetchAchievements(); // Refresh the list
//             } else {
//                 Swal.fire('Error!', response.data.message || 'Something went wrong', 'error');
//             }
//         } catch (error) {
//             console.error('Error saving achievement:', error);
//             if (error.response) {
//                 console.error('Error response:', error.response.data);
//                 const errorMessage = error.response.data.message || 'Failed to save achievement';
//                 Swal.fire('Error!', errorMessage, 'error');
//             } else {
//                 Swal.fire('Error!', 'Network error. Please check your connection.', 'error');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Delete achievement
//     const handleDeleteClick = (id, name) => {
//         Swal.fire({
//             title: 'Are you sure?',
//             text: `You want to delete "${name}"?`,
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonColor: '#5e2e10',
//             cancelButtonColor: '#3085d6',
//             confirmButtonText: 'Yes, delete it!'
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 setLoading(true);
//                 try {
//                     const response = await axios.delete(`${BASE_URL}/del-achievement/${id}`, {
//                         headers: {
//                             'Accept': 'application/json'
//                         }
//                     });

//                     console.log('Delete response:', response.data);

//                     if (response.data.status === true) {
//                         Swal.fire('Deleted!', response.data.message || 'Achievement deleted successfully', 'success');
//                         fetchAchievements();
//                     } else {
//                         Swal.fire('Error!', response.data.message || 'Failed to delete', 'error');
//                     }
//                 } catch (error) {
//                     console.error('Error deleting achievement:', error);
//                     if (error.response) {
//                         Swal.fire('Error!', error.response.data.message || 'Failed to delete achievement', 'error');
//                     } else {
//                         Swal.fire('Error!', 'Network error. Please check your connection.', 'error');
//                     }
//                 } finally {
//                     setLoading(false);
//                 }
//             }
//         });
//     };

//     const toggleSidebar = () => setIsCollapsed(!isCollapsed);
//     const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

//     const styles = {
//         container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
//         mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
//         contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
//         contentScroll: { flex: '1 0 auto', padding: '24px' },
//         footerWrapper: { flexShrink: 0 },
//         card: {
//             backgroundColor: theme.card,
//             borderRadius: '10px',
//             padding: '20px',
//             marginBottom: '20px',
//             boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//         },
//         imageGallery: {
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
//             gap: '20px',
//             marginTop: '20px'
//         },
//         imageCard: {
//             backgroundColor: theme.card,
//             borderRadius: '10px',
//             overflow: 'hidden',
//             boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//             transition: 'transform 0.3s ease',
//             cursor: 'pointer'
//         },
//         imageWrapper: {
//             width: '100%',
//             height: '200px',
//             overflow: 'hidden',
//             position: 'relative'
//         },
//         image: {
//             width: '100%',
//             height: '100%',
//             objectFit: 'cover'
//         },
//         imageInfo: {
//             padding: '15px',
//             textAlign: 'center'
//         },
//         imageName: {
//             color: theme.text,
//             fontSize: '16px',
//             fontWeight: 'bold',
//             marginBottom: '10px',
//             wordBreak: 'break-word'
//         },
//         buttonGroup: {
//             display: 'flex',
//             gap: '10px',
//             justifyContent: 'center',
//             marginTop: '10px'
//         },
//         editBtn: {
//             backgroundColor: '#5e2e10',
//             color: 'white',
//             border: 'none',
//             padding: '8px 15px',
//             borderRadius: '5px',
//             cursor: 'pointer',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '5px',
//             fontSize: '14px',
//             transition: 'all 0.3s ease'
//         },
//         deleteBtn: {
//             backgroundColor: '#f44336',
//             color: 'white',
//             border: 'none',
//             padding: '8px 15px',
//             borderRadius: '5px',
//             cursor: 'pointer',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '5px',
//             fontSize: '14px',
//             transition: 'all 0.3s ease'
//         },
//         addBtn: {
//             backgroundColor: '#5e2e10',
//             color: 'white',
//             border: 'none',
//             padding: '10px 20px',
//             borderRadius: '5px',
//             cursor: 'pointer',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             fontSize: '16px',
//             transition: 'all 0.3s ease',
//             boxShadow: '0 4px 15px rgba(94, 46, 16, 0.3)'
//         },
//         modalOverlay: {
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0,0,0,0.5)',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             zIndex: 1000
//         },
//         modalContent: {
//             backgroundColor: theme.card,
//             borderRadius: '10px',
//             padding: '30px',
//             width: '90%',
//             maxWidth: '500px',
//             maxHeight: '90vh',
//             overflowY: 'auto'
//         },
//         modalHeader: {
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginBottom: '20px',
//             borderBottom: `1px solid ${theme.border}`,
//             paddingBottom: '10px'
//         },
//         modalTitle: {
//             color: theme.text,
//             fontSize: '24px',
//             margin: 0
//         },
//         closeBtn: {
//             backgroundColor: 'transparent',
//             border: 'none',
//             fontSize: '24px',
//             cursor: 'pointer',
//             color: theme.text,
//             transition: 'opacity 0.3s'
//         },
//         formGroup: {
//             marginBottom: '20px'
//         },
//         label: {
//             display: 'block',
//             color: theme.text,
//             marginBottom: '8px',
//             fontWeight: 'bold'
//         },
//         input: {
//             width: '100%',
//             padding: '10px',
//             border: `1px solid ${theme.border}`,
//             borderRadius: '5px',
//             backgroundColor: theme.bg,
//             color: theme.text,
//             outline: 'none',
//             transition: 'border-color 0.3s'
//         },
//         fileInput: {
//             width: '100%',
//             padding: '10px',
//             border: `1px solid ${theme.border}`,
//             borderRadius: '5px',
//             backgroundColor: theme.bg,
//             color: theme.text
//         },
//         previewImage: {
//             width: '100%',
//             maxHeight: '200px',
//             objectFit: 'cover',
//             borderRadius: '5px',
//             marginTop: '10px'
//         },
//         submitBtn: {
//             width: '100%',
//             padding: '12px',
//             backgroundColor: '#5e2e10',
//             color: 'white',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer',
//             fontSize: '16px',
//             marginTop: '10px',
//             transition: 'all 0.3s ease',
//             boxShadow: '0 4px 15px rgba(94, 46, 16, 0.3)'
//         },
//         loadingText: {
//             textAlign: 'center',
//             color: theme.text,
//             padding: '20px'
//         },
//         emptyText: {
//             textAlign: 'center',
//             color: theme.text,
//             padding: '40px',
//             fontSize: '18px'
//         }
//     };

//     // Hover effects for buttons
//     const handleButtonHover = (e, color) => {
//         e.currentTarget.style.backgroundColor = color;
//         e.currentTarget.style.transform = 'translateY(-2px)';
//     };

//     const handleButtonLeave = (e, color) => {
//         e.currentTarget.style.backgroundColor = color;
//         e.currentTarget.style.transform = 'translateY(0)';
//     };

//     return (
//         <div style={styles.container} className="container-fluid p-0">
//             <div className="d-flex">
//                 <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="achievement" />

//                 <div style={styles.mainArea} className="flex-grow-1">
//                     <Header 
//                         theme={theme} 
//                         isDarkMode={isDarkMode} 
//                         toggleDarkMode={toggleDarkMode} 
//                         toggleSidebar={toggleSidebar} 
//                     />

//                     <div style={styles.contentContainer}>
//                         <div style={styles.contentScroll}>
//                             {/* Header Section */}
//                             <div style={styles.card}>
//                                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
//                                     <h2 style={{ color: theme.text, margin: 0 }}>Achievement Gallery</h2>
//                                     <button 
//                                         onClick={handleAddClick} 
//                                         style={styles.addBtn}
//                                         onMouseEnter={(e) => handleButtonHover(e, '#8B4513')}
//                                         onMouseLeave={(e) => handleButtonLeave(e, '#5e2e10')}
//                                     >
//                                         <FaUpload /> Add New Achievement
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Image Gallery */}
//                             {loading && !showModal ? (
//                                 <div style={styles.loadingText}>
//                                     <div className="spinner-border text-primary" role="status">
//                                         <span className="visually-hidden">Loading...</span>
//                                     </div>
//                                     <div>Loading achievements...</div>
//                                 </div>
//                             ) : achievements.length === 0 ? (
//                                 <div style={styles.emptyText}>
//                                     No achievements found. Click "Add New Achievement" to get started.
//                                 </div>
//                             ) : (
//                                 <div style={styles.imageGallery}>
//                                     {achievements.map((item) => (
//                                         <div 
//                                             key={item.id} 
//                                             style={styles.imageCard}
//                                             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
//                                             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
//                                         >
//                                             <div style={styles.imageWrapper}>
//                                                 <img 
//                                                     src={getImageUrl(item.image)} 
//                                                     alt={item.name}
//                                                     style={styles.image}
//                                                     onError={(e) => {
//                                                         e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
//                                                     }}
//                                                 />
//                                             </div>
//                                             <div style={styles.imageInfo}>
//                                                 <div style={styles.imageName}>{item.name}</div>
//                                                 <div style={styles.buttonGroup}>
//                                                     <button 
//                                                         onClick={() => handleEditClick(item)} 
//                                                         style={styles.editBtn}
//                                                         onMouseEnter={(e) => handleButtonHover(e, '#8B4513')}
//                                                         onMouseLeave={(e) => handleButtonLeave(e, '#5e2e10')}
//                                                     >
//                                                         <FaEdit /> Edit
//                                                     </button>
//                                                     <button 
//                                                         onClick={() => handleDeleteClick(item.id, item.name)} 
//                                                         style={styles.deleteBtn}
//                                                         onMouseEnter={(e) => {
//                                                             e.currentTarget.style.backgroundColor = '#d32f2f';
//                                                             e.currentTarget.style.transform = 'translateY(-2px)';
//                                                         }}
//                                                         onMouseLeave={(e) => {
//                                                             e.currentTarget.style.backgroundColor = '#f44336';
//                                                             e.currentTarget.style.transform = 'translateY(0)';
//                                                         }}
//                                                     >
//                                                         <FaTrash /> Delete
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>

//                         <div style={styles.footerWrapper}>
//                             <Footer theme={theme} />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Modal for Add/Edit */}
//             {showModal && (
//                 <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
//                     <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
//                         <div style={styles.modalHeader}>
//                             <h3 style={styles.modalTitle}>{isEditing ? 'Edit Achievement' : 'Add New Achievement'}</h3>
//                             <button onClick={() => setShowModal(false)} style={styles.closeBtn}>
//                                 <FaTimes />
//                             </button>
//                         </div>

//                         <form onSubmit={handleSubmit}>
//                             <div style={styles.formGroup}>
//                                 <label style={styles.label}>Name *</label>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     value={formData.name}
//                                     onChange={handleInputChange}
//                                     style={styles.input}
//                                     placeholder="Enter achievement name"
//                                     required
//                                 />
//                             </div>

//                             <div style={styles.formGroup}>
//                                 <label style={styles.label}>Image {!isEditing && '*'}</label>
//                                 <input
//                                     type="file"
//                                     name="image"
//                                     onChange={handleImageChange}
//                                     accept="image/jpeg,image/jpg,image/png,image/gif"
//                                     style={styles.fileInput}
//                                 />
//                                 {imagePreview && (
//                                     <img src={imagePreview} alt="Preview" style={styles.previewImage} />
//                                 )}
//                                 {isEditing && !imagePreview && formData.image === null && (
//                                     <div style={{ marginTop: '10px', color: theme.text, fontSize: '12px' }}>
//                                         Current image will be kept if no new image is selected
//                                     </div>
//                                 )}
//                             </div>

//                             <button 
//                                 type="submit" 
//                                 style={styles.submitBtn} 
//                                 disabled={loading}
//                                 onMouseEnter={(e) => handleButtonHover(e, '#8B4513')}
//                                 onMouseLeave={(e) => handleButtonLeave(e, '#5e2e10')}
//                             >
//                                 {loading ? 'Processing...' : (isEditing ? 'Update Achievement' : 'Add Achievement')}
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Achievement;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import Footer from './Footer';

// const EMPTY_FORM = { name: '', image: null };

// const Modal = ({ theme, title, onClose, children, footer }) => (
//     <div
//         style={{
//             position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             zIndex: 1000, padding: '20px', animation: 'fadeIn .2s ease'
//         }}
//         onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//         <div style={{
//             backgroundColor: theme.card, color: theme.text,
//             border: `1px solid ${theme.border}`, borderRadius: '16px',
//             width: '100%', maxWidth: '480px', maxHeight: '90vh',
//             display: 'flex', flexDirection: 'column', animation: 'slideUp .2s ease'
//         }}>
//             <div style={{
//                 padding: '18px 22px', borderBottom: `1px solid ${theme.border}`,
//                 display: 'flex', justifyContent: 'space-between', alignItems: 'center'
//             }}>
//                 <h5 className="m-0 fw-bold">{title}</h5>
//                 <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '20px', color: theme.text, opacity: 0.6, cursor: 'pointer' }}>✕</button>
//             </div>
//             <div style={{ padding: '22px', overflowY: 'auto' }}>{children}</div>
//             {footer && (
//                 <div style={{ padding: '16px 22px', borderTop: `1px solid ${theme.border}` }}>{footer}</div>
//             )}
//         </div>
//     </div>
// );

// const Achievement = ({ theme: propsTheme }) => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(false);

//     const [achievements, setAchievements] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const [showModal, setShowModal] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [currentId, setCurrentId] = useState(null);
//     const [formData, setFormData] = useState(EMPTY_FORM);
//     const [imagePreview, setImagePreview] = useState(null);

//     const theme = propsTheme || {
//         isDarkMode,
//         bg: isDarkMode ? '#0a0a0a' : '#f5f5f5',
//         card: isDarkMode ? '#141414' : '#ffffff',
//         text: isDarkMode ? '#f5f5f5' : '#111111',
//         textLight: isDarkMode ? '#a3a3a3' : '#6b6b6b',
//         border: isDarkMode ? '#2b2b2b' : '#dcdcdc'
//     };
//     const accent = theme.text;
//     const accentOn = theme.card;

//     const fieldStyle = {
//         width: '100%', padding: '10px 14px', borderRadius: '10px',
//         border: `1px solid ${theme.border}`, backgroundColor: theme.bg,
//         color: theme.text, fontSize: '14px', outline: 'none'
//     };

//     const BASE_URL = import.meta.env.VITE_BASE_URL;
//     const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL;
//     const STORAGE_URL = API_URL.replace('/api', '');

//     const getImageUrl = (imagePath) => {
//         if (!imagePath) return 'https://via.placeholder.com/300x200?text=No+Image';
//         if (imagePath.startsWith('http')) return imagePath;
//         const cleanPath = imagePath.replace(/\\/g, '/').replace(/^\/+/, '');
//         return `${STORAGE_URL}/storage/${cleanPath}`;
//     };

//     axios.defaults.withCredentials = false;
//     axios.defaults.headers.common['Accept'] = 'application/json';
//     axios.defaults.headers.common['Content-Type'] = 'application/json';

//     const fetchAchievements = async () => {
//         setLoading(true);
//         try {
//             const res = await axios.get(`${BASE_URL}/get-achievement`, { headers: { Accept: 'application/json' } });
//             setAchievements(res.data.status === true ? res.data.data || [] : []);
//         } catch (err) {
//             console.error('Error fetching achievements:', err);
//             Swal.fire('Error!', err.response?.data?.message || 'Failed to fetch achievements.', 'error');
//             setAchievements([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => { fetchAchievements(); }, []);

//     const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;
//         if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
//             return Swal.fire('Error!', 'Only JPG, JPEG, PNG, and GIF files are allowed', 'error');
//         }
//         if (file.size > 2 * 1024 * 1024) {
//             return Swal.fire('Error!', 'File size should be less than 2MB', 'error');
//         }
//         setFormData({ ...formData, image: file });
//         const reader = new FileReader();
//         reader.onloadend = () => setImagePreview(reader.result);
//         reader.readAsDataURL(file);
//     };

//     const resetForm = () => {
//         setFormData(EMPTY_FORM);
//         setImagePreview(null);
//         setIsEditing(false);
//         setCurrentId(null);
//     };

//     const handleAddClick = () => { resetForm(); setShowModal(true); };

//     const handleEditClick = (item) => {
//         setIsEditing(true);
//         setCurrentId(item.id);
//         setFormData({ name: item.name, image: null });
//         setImagePreview(getImageUrl(item.image));
//         setShowModal(true);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!formData.name) return Swal.fire('Warning!', 'Please enter name', 'warning');
//         if (!isEditing && !formData.image) return Swal.fire('Warning!', 'Please select an image', 'warning');

//         const formDataToSend = new FormData();
//         formDataToSend.append('name', formData.name);
//         if (formData.image) formDataToSend.append('image', formData.image);

//         setLoading(true);
//         try {
//             const url = isEditing ? `${BASE_URL}/edit-achievement/${currentId}` : `${BASE_URL}/add-achievement`;
//             const res = await axios.post(url, formDataToSend, { headers: { 'Content-Type': 'multipart/form-data', Accept: 'application/json' } });
//             if (res.data.status === true) {
//                 Swal.fire('Success!', res.data.message || (isEditing ? 'Achievement updated successfully' : 'Achievement added successfully'), 'success');
//                 resetForm();
//                 setShowModal(false);
//                 fetchAchievements();
//             } else {
//                 Swal.fire('Error!', res.data.message || 'Something went wrong', 'error');
//             }
//         } catch (err) {
//             console.error('Error saving achievement:', err);
//             Swal.fire('Error!', err.response?.data?.message || 'Network error. Please check your connection.', 'error');
//         } finally {
//             setLoading(false);
//         }
//     };
    

   


//     const handleDeleteClick = (id, name) => {
//         Swal.fire({
//             title: 'Are you sure?',
//             text: `You want to delete "${name}"?`,
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonColor: theme.text,
//             cancelButtonColor: theme.textLight,
//             confirmButtonText: 'Yes, delete it!'
//         }).then(async (result) => {
//             if (!result.isConfirmed) return;
//             setLoading(true);
//             try {
//                 const res = await axios.delete(`${BASE_URL}/del-achievement/${id}`, { headers: { Accept: 'application/json' } });
//                 if (res.data.status === true) {
//                     Swal.fire('Deleted!', res.data.message || 'Achievement deleted successfully', 'success');
//                     fetchAchievements();
//                 } else {
//                     Swal.fire('Error!', res.data.message || 'Failed to delete', 'error');
//                 }
//             } catch (err) {
//                 console.error('Error deleting achievement:', err);
//                 Swal.fire('Error!', err.response?.data?.message || 'Network error. Please check your connection.', 'error');
//             } finally {
//                 setLoading(false);
//             }
//         });
//     };

//     const toggleSidebar = () => setIsCollapsed(!isCollapsed);
//     const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

//     return (
//         <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }} className="container-fluid p-0">
//             <div className="d-flex">
//                 <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="achievement" />

//                 <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="flex-grow-1">
//                     <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

//                     <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
//                         <div style={{ padding: '24px' }}>
//                             <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
//                                 <div>
//                                     <h2 style={{ color: theme.text, margin: 0 }}>Achievement Gallery</h2>
//                                     <p style={{ color: theme.textLight, margin: '4px 0 0' }}>Manage awards and milestones</p>
//                                 </div>
//                                 <button
//                                     onClick={handleAddClick}
//                                     style={{ backgroundColor: accent, color: accentOn, border: 'none', padding: '10px 22px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
//                                 >
//                                     <i className="bi bi-plus-circle me-2"></i>Add New Achievement
//                                 </button>
//                             </div>

//                             {loading && !showModal ? (
//                                 <div className="text-center py-5">
//                                     <div className="spinner-border" style={{ color: accent }} role="status"></div>
//                                     <p className="mt-3" style={{ color: theme.textLight }}>Loading achievements...</p>
//                                 </div>
//                             ) : achievements.length === 0 ? (
//                                 <div className="text-center py-5" style={{ color: theme.textLight }}>
//                                     <i className="bi bi-trophy display-4 d-block mb-3" style={{ opacity: 0.4 }}></i>
//                                     No achievements found. Click "Add New Achievement" to get started.
//                                 </div>
//                             ) : (
//                                 <div className="row g-3">
//                                     {achievements.map(item => (
//                                         <div className="col-md-6 col-lg-3" key={item.id}>
//                                             <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '10px', overflow: 'hidden', height: '100%' }}>
//                                                 <img
//                                                     src={getImageUrl(item.image)}
//                                                     alt={item.name}
//                                                     style={{ width: '100%', height: '160px', objectFit: 'cover' }}
//                                                     onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
//                                                 />
//                                                 <div style={{ padding: '16px', textAlign: 'center' }}>
//                                                     <div style={{ color: theme.text, fontWeight: 700, marginBottom: '12px', wordBreak: 'break-word' }}>{item.name}</div>
//                                                     <div className="d-flex gap-2 justify-content-center">

//                                                         <button className="btn btn-sm btn-outline-dark" onClick={() => handleEditClick(item)}>
//                                                             <i className="bi bi-pencil me-1"></i>Edit
//                                                         </button>
//                                                         <button className="btn btn-sm btn-outline-dark" onClick={() => handleDeleteClick(item.id, item.name)}>
//                                                             <i className="bi bi-trash me-1"></i>Delete
//                                                         </button>


//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                         <Footer theme={theme} />
//                     </div>
//                 </div>
//             </div>

//             {/* Add/Edit Modal */}
//             {showModal && (
//                 <form onSubmit={handleSubmit}>
//                     <Modal
//                         theme={theme}
//                         title={isEditing ? 'Edit Achievement' : 'Add New Achievement'}
//                         onClose={() => setShowModal(false)}
//                         footer={
//                             <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: accent, color: accentOn, border: 'none', padding: '11px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
//                                 {loading ? 'Processing...' : (isEditing ? 'Update Achievement' : 'Add Achievement')}
//                             </button>
//                         }
//                     >
//                         <div className="mb-3">
//                             <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Name *</label>
//                             <input type="text" name="name" value={formData.name} onChange={handleInputChange} style={fieldStyle} placeholder="Enter achievement name" required />
//                         </div>
//                         <div>
//                             <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Image {!isEditing && '*'}</label>
//                             <input type="file" name="image" onChange={handleImageChange} accept="image/jpeg,image/jpg,image/png,image/gif" style={fieldStyle} />
//                             {imagePreview && (
//                                 <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '10px', marginTop: '10px', border: `1px solid ${theme.border}` }} />
//                             )}
//                             {isEditing && !imagePreview && formData.image === null && (
//                                 <div style={{ marginTop: '8px', color: theme.textLight, fontSize: '12px' }}>
//                                     Current image will be kept if no new image is selected
//                                 </div>
//                             )}
//                         </div>
//                     </Modal>
//                 </form>
//             )}

//             <style>{`
//                 @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//                 @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
//                 .form-control, .form-select { background-color: ${theme.bg} !important; color: ${theme.text} !important; border-color: ${theme.border} !important; }
//             `}</style>
//         </div>
//     );
// };

// export default Achievement;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const EMPTY_FORM = { name: '', image: null };

const Modal = ({ theme, title, onClose, children, footer }) => (
    <div
        style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '20px', animation: 'fadeIn .2s ease'
        }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
    >
        <div style={{
            backgroundColor: theme.card, color: theme.text,
            border: `1px solid ${theme.border}`, borderRadius: '16px',
            width: '100%', maxWidth: '480px', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column', animation: 'slideUp .2s ease'
        }}>
            <div style={{
                padding: '18px 22px', borderBottom: `1px solid ${theme.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <h5 className="m-0 fw-bold">{title}</h5>
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '20px', color: theme.text, opacity: 0.6, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '22px', overflowY: 'auto' }}>{children}</div>
            {footer && (
                <div style={{ padding: '16px 22px', borderTop: `1px solid ${theme.border}` }}>{footer}</div>
            )}
        </div>
    </div>
);

const Achievement = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [imagePreview, setImagePreview] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const [toast, setToast] = useState({ show: false, message: '', type: '' });

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

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL;
    const STORAGE_URL = API_URL.replace('/api', '');

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/300x200?text=No+Image';
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.replace(/\\/g, '/').replace(/^\/+/, '');
        return `${STORAGE_URL}/storage/${cleanPath}`;
    };

    axios.defaults.withCredentials = false;
    axios.defaults.headers.common['Accept'] = 'application/json';
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const fetchAchievements = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/get-achievement`, { headers: { Accept: 'application/json' } });
            setAchievements(res.data.status === true ? res.data.data || [] : []);
        } catch (err) {
            console.error('Error fetching achievements:', err);
            showToast(err.response?.data?.message || 'Failed to fetch achievements.', 'error');
            setAchievements([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAchievements(); }, []);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
            return showToast('Only JPG, JPEG, PNG, and GIF files are allowed', 'error');
        }
        if (file.size > 2 * 1024 * 1024) {
            return showToast('File size should be less than 2MB', 'error');
        }
        setFormData({ ...formData, image: file });
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const resetForm = () => {
        setFormData(EMPTY_FORM);
        setImagePreview(null);
        setIsEditing(false);
        setCurrentId(null);
    };

    const handleAddClick = () => { resetForm(); setShowModal(true); };

    const handleEditClick = (item) => {
        setIsEditing(true);
        setCurrentId(item.id);
        setFormData({ name: item.name, image: null });
        setImagePreview(getImageUrl(item.image));
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) return showToast('Please enter name', 'error');
        if (!isEditing && !formData.image) return showToast('Please select an image', 'error');

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        if (formData.image) formDataToSend.append('image', formData.image);

        setLoading(true);
        try {
            const url = isEditing ? `${BASE_URL}/edit-achievement/${currentId}` : `${BASE_URL}/add-achievement`;
            const res = await axios.post(url, formDataToSend, { headers: { 'Content-Type': 'multipart/form-data', Accept: 'application/json' } });
            if (res.data.status === true) {
                showToast(res.data.message || (isEditing ? 'Achievement updated successfully' : 'Achievement added successfully'));
                resetForm();
                setShowModal(false);
                fetchAchievements();
            } else {
                showToast(res.data.message || 'Something went wrong', 'error');
            }
        } catch (err) {
            console.error('Error saving achievement:', err);
            showToast(err.response?.data?.message || 'Network error. Please check your connection.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;
        setDeleting(true);
        try {
            const res = await axios.delete(`${BASE_URL}/del-achievement/${deleteConfirm.id}`, { headers: { Accept: 'application/json' } });
            if (res.data.status === true) {
                showToast(res.data.message || 'Achievement deleted successfully');
                fetchAchievements();
                setDeleteConfirm(null);
            } else {
                showToast(res.data.message || 'Failed to delete', 'error');
            }
        } catch (err) {
            console.error('Error deleting achievement:', err);
            showToast(err.response?.data?.message || 'Network error. Please check your connection.', 'error');
        } finally {
            setDeleting(false);
        }
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="achievement" />

                <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="flex-grow-1">
                    <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '24px' }}>
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                                <div>
                                    <h2 style={{ color: theme.text, margin: 0 }}>Achievement Gallery</h2>
                                    <p style={{ color: theme.textLight, margin: '4px 0 0' }}>Manage awards and milestones</p>
                                </div>
                                <button
                                    onClick={handleAddClick}
                                    style={{ backgroundColor: accent, color: accentOn, border: 'none', padding: '10px 22px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                                >
                                    <i className="bi bi-plus-circle me-2"></i>Add New Achievement
                                </button>
                            </div>

                            {loading && !showModal ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border" style={{ color: accent }} role="status"></div>
                                    <p className="mt-3" style={{ color: theme.textLight }}>Loading achievements...</p>
                                </div>
                            ) : achievements.length === 0 ? (
                                <div className="text-center py-5" style={{ color: theme.textLight }}>
                                    <i className="bi bi-trophy display-4 d-block mb-3" style={{ opacity: 0.4 }}></i>
                                    No achievements found. Click "Add New Achievement" to get started.
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {achievements.map(item => (
                                        <div className="col-md-6 col-lg-4" key={item.id}>
                                            <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', overflow: 'hidden', height: '100%' }}>
                                                <img
                                                    src={getImageUrl(item.image)}
                                                    alt={item.name}
                                                    style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                                                />
                                                <div style={{ padding: '16px', textAlign: 'center' }}>
                                                    <div style={{ color: theme.text, fontWeight: 700, marginBottom: '12px', wordBreak: 'break-word' }}>{item.name}</div>
                                                    <div className="d-flex gap-2 justify-content-center">
                                                        <button className="btn btn-sm btn-outline-dark" onClick={() => handleEditClick(item)}>
                                                            <i className="bi bi-pencil me-1"></i>Edit
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-dark" onClick={() => setDeleteConfirm(item)}>
                                                            <i className="bi bi-trash me-1"></i>Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
                        title={isEditing ? 'Edit Achievement' : 'Add New Achievement'}
                        onClose={() => setShowModal(false)}
                        footer={
                            <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: accent, color: accentOn, border: 'none', padding: '11px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                                {loading ? 'Processing...' : (isEditing ? 'Update Achievement' : 'Add Achievement')}
                            </button>
                        }
                    >
                        <div className="mb-3">
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} style={fieldStyle} placeholder="Enter achievement name" required />
                        </div>
                        <div>
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>Image {!isEditing && '*'}</label>
                            <input type="file" name="image" onChange={handleImageChange} accept="image/jpeg,image/jpg,image/png,image/gif" style={fieldStyle} />
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '10px', marginTop: '10px', border: `1px solid ${theme.border}` }} />
                            )}
                            {isEditing && !imagePreview && formData.image === null && (
                                <div style={{ marginTop: '8px', color: theme.textLight, fontSize: '12px' }}>
                                    Current image will be kept if no new image is selected
                                </div>
                            )}
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
                    onClick={(e) => e.target === e.currentTarget && !deleting && setDeleteConfirm(null)}
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
                        <h5 style={{ margin: '0 0 8px', fontWeight: 600 }}>Delete this achievement?</h5>
                        <p style={{ margin: '0 0 22px', color: theme.textLight, fontSize: '14px' }}>
                            "<strong>{deleteConfirm.name}</strong>" will be permanently removed. This can't be undone.
                        </p>
                        <div className="d-flex gap-2">
                            <button onClick={() => setDeleteConfirm(null)} disabled={deleting} className="btn btn-outline-dark flex-fill">Cancel</button>
                            <button onClick={confirmDelete} disabled={deleting} className="btn flex-fill" style={{ backgroundColor: accent, color: accentOn, border: 'none' }}>
                                {deleting ? 'Deleting...' : 'Delete'}
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
                .form-control, .form-select { background-color: ${theme.bg} !important; color: ${theme.text} !important; border-color: ${theme.border} !important; }
            `}</style>
        </div>
    );
};

export default Achievement;