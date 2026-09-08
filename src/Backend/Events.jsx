// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Header from './Header';
// import Footer from './Footer';
// import Sidebar from './Sidebar';

// const Events = () => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(false);
//     const [activeView, setActiveView] = useState('events');

//     const [events, setEvents] = useState([]);
//     const [showModal, setShowModal] = useState(false);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [editingEvent, setEditingEvent] = useState(null);
//     const [deletingEvent, setDeletingEvent] = useState(null);
//     const [toast, setToast] = useState({ show: false, message: '', type: '' });

//     const [formData, setFormData] = useState({
//         title: '',
//         event_datetime: '',
//         main_title: '',
//         subtitle: '',
//         posted_by: '',
//         description: '',
//         features: [],
//         thumb_img: null,
//         main_img: null
//     });

//     const [thumbPreview, setThumbPreview] = useState(null);
//     const [mainPreview, setMainPreview] = useState(null);
//     const [featureInput, setFeatureInput] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [fetchLoading, setFetchLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 6;

//     const theme = {
//         isDarkMode,
//         bg: isDarkMode ? '#0f0f1a' : '#f8f9fc',
//         card: isDarkMode ? '#1a1a2e' : '#ffffff',
//         cardHover: isDarkMode ? '#22223b' : '#f8f9fa',
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
    
//     const API_BASE = import.meta.env.VITE_BASE_URL;
//     const API_URL = import.meta.env.VITE_BASE_URL;

//     const showToast = (message, type = 'success') => {
//         setToast({ show: true, message, type });
//         setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
//     };

//     const getAuthToken = () => {
//         const token = localStorage.getItem("token");
//         return token;
//     };

//     const getImageUrl = (imagePath) => {
//         if (!imagePath) return null;
//         if (imagePath.startsWith('http')) return imagePath;
//         const cleanPath = imagePath.replace(/^\/storage\/storage\//, '/storage/');
//         if (cleanPath.startsWith('/storage/')) {
//             return `${API_URL}${cleanPath}`;
//         }
//         return `${API_URL}/storage/${cleanPath}`;
//     };

//     const axiosInstance = axios.create({
//         baseURL: API_BASE,
//         headers: { 'Accept': 'application/json' }
//     });

//     axiosInstance.interceptors.request.use((config) => {
//         const token = getAuthToken();
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         if (config.data instanceof FormData) {
//             delete config.headers['Content-Type'];
//         }
//         return config;
//     });

//     const fetchEvents = async () => {
//         setFetchLoading(true);
//         try {
//             const token = getAuthToken();
//             if (!token) {
//                 setEvents([]);
//                 setFetchLoading(false);
//                 return;
//             }
//             const res = await axiosInstance.get('/events/all');
//             if (res.data.success && res.data.data) {
//                 setEvents(res.data.data);
//             } else if (res.data.data) {
//                 setEvents(res.data.data);
//             } else {
//                 setEvents([]);
//             }
//         } catch (err) {
//             console.error("Fetch error:", err);
//             setEvents([]);
//         } finally {
//             setFetchLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchEvents();
//     }, []);

//     const filteredEvents = events.filter(event =>
//         event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         event.mainTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         event.postedBy?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             if (file.size > 5 * 1024 * 1024) {
//                 showToast('Image size should be less than 5MB', 'error');
//                 return;
//             }
//             setFormData({ ...formData, [e.target.name]: file });
//             const previewUrl = URL.createObjectURL(file);
//             if (e.target.name === 'thumb_img') {
//                 setThumbPreview(previewUrl);
//             } else if (e.target.name === 'main_img') {
//                 setMainPreview(previewUrl);
//             }
//         }
//     };

//     const addFeature = () => {
//         if (featureInput.trim()) {
//             setFormData({
//                 ...formData,
//                 features: [...formData.features, featureInput.trim()]
//             });
//             setFeatureInput('');
//         }
//     };

//     const removeFeature = (index) => {
//         const updatedFeatures = formData.features.filter((_, i) => i !== index);
//         setFormData({ ...formData, features: updatedFeatures });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         const token = getAuthToken();
//         if (!token) {
//             showToast("Please login to add/edit events", 'error');
//             window.location.href = '/';
//             return;
//         }
        
//         const submitData = new FormData();
//         submitData.append('title', formData.title);
//         submitData.append('event_datetime', formData.event_datetime);
//         submitData.append('main_title', formData.main_title);
//         submitData.append('subtitle', formData.subtitle);
//         submitData.append('posted_by', formData.posted_by);
//         submitData.append('description', formData.description);
        
//         if (formData.features && formData.features.length > 0) {
//             formData.features.forEach((feature, index) => {
//                 submitData.append(`features[${index}]`, feature);
//             });
//         }
        
//         if (formData.thumb_img && formData.thumb_img instanceof File) {
//             submitData.append('thumb_img', formData.thumb_img);
//         }
//         if (formData.main_img && formData.main_img instanceof File) {
//             submitData.append('main_img', formData.main_img);
//         }

//         setLoading(true);
//         try {
//             let res;
//             if (editingEvent) {
//                 submitData.append('_method', 'PUT');
//                 res = await axiosInstance.post(`/events/${editingEvent.id}`, submitData);
//             } else {
//                 res = await axiosInstance.post('/events', submitData);
//             }

//             if (res.data.success) {
//                 showToast(editingEvent ? 'Event updated successfully!' : 'Event created successfully!', 'success');
//                 setShowModal(false);
//                 resetForm();
//                 fetchEvents();
//             } else {
//                 showToast(res.data.message || 'Failed to save event', 'error');
//             }
//         } catch (err) {
//             console.error("Submit error:", err);
//             if (err.response?.status === 401) {
//                 showToast("Session expired. Please login again.", 'error');
//                 localStorage.removeItem("token");
//                 window.location.href = '/';
//             } else {
//                 showToast(err.response?.data?.message || "Something went wrong!", 'error');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const confirmDelete = (event) => {
//         setDeletingEvent(event);
//         setShowDeleteModal(true);
//     };

//     const handleDelete = async () => {
//         try {
//             await axiosInstance.delete(`/events/${deletingEvent.id}`);
//             fetchEvents();
//             setShowDeleteModal(false);
//             setDeletingEvent(null);
//             showToast("Event deleted successfully!", 'success');
//         } catch (err) {
//             console.error("Delete error:", err);
//             showToast("Failed to delete event", 'error');
//         }
//     };

//     const handleEdit = (event) => {
//         const token = getAuthToken();
//         if (!token) {
//             showToast("Please login to edit events", 'error');
//             window.location.href = '/';
//             return;
//         }
        
//         setEditingEvent(event);
//         setFormData({
//             title: event.title || '',
//             event_datetime: event.event_datetime || '',
//             main_title: event.mainTitle || '',
//             subtitle: event.subtitle || '',
//             posted_by: event.postedBy || '',
//             description: event.description || '',
//             features: event.features || [],
//             thumb_img: null,
//             main_img: null
//         });
        
//         setThumbPreview(null);
//         setMainPreview(null);
//         setShowModal(true);
//     };

//     const resetForm = () => {
//         setFormData({
//             title: '',
//             event_datetime: '',
//             main_title: '',
//             subtitle: '',
//             posted_by: '',
//             description: '',
//             features: [],
//             thumb_img: null,
//             main_img: null
//         });
//         setThumbPreview(null);
//         setMainPreview(null);
//         setEditingEvent(null);
//         setFeatureInput('');
//     };

//     const formatDateTime = (datetime) => {
//         if (!datetime) return 'N/A';
//         const date = new Date(datetime);
//         return date.toLocaleString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     const isLoggedIn = !!getAuthToken();

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
//             flex: 1,
//             minWidth: '150px',
//             border: `1px solid ${theme.border}`,
//             transition: 'all 0.3s ease'
//         },
//         statIcon: {
//             fontSize: '32px',
//             marginBottom: '12px'
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
//             marginBottom: '30px',
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
//         eventGrid: {
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
//             gap: '24px',
//             marginBottom: '30px'
//         },
//         eventCard: {
//             backgroundColor: theme.card,
//             borderRadius: '20px',
//             overflow: 'hidden',
//             border: `1px solid ${theme.border}`,
//             transition: 'all 0.3s ease',
//             position: 'relative'
//         },
//         imageWrapper: {
//             position: 'relative',
//             overflow: 'hidden',
//             cursor: 'pointer'
//         },
//         eventImage: {
//             width: '100%',
//             height: '200px',
//             objectFit: 'cover',
//             transition: 'transform 0.5s ease',
//             display: 'block'
//         },
//         cardOverlay: {
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: 'linear-gradient(135deg, rgba(94, 46, 16, 0.95) 0%, rgba(139, 69, 19, 0.95) 100%)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             gap: '20px',
//             opacity: 0,
//             transition: 'opacity 0.3s ease',
//             zIndex: 10
//         },
//         actionBtn: {
//             width: '50px',
//             height: '50px',
//             borderRadius: '12px',
//             border: 'none',
//             fontSize: '24px',
//             cursor: 'pointer',
//             transition: 'all 0.3s ease',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             backgroundColor: 'white',
//             color: '#333',
//             boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
//         },
//         cardContent: {
//             padding: '20px'
//         },
//         eventTitle: {
//             fontSize: '18px',
//             fontWeight: '600',
//             color: theme.text,
//             marginBottom: '8px'
//         },
//         eventMeta: {
//             display: 'flex',
//             alignItems: 'center',
//             gap: '12px',
//             marginBottom: '12px',
//             fontSize: '13px',
//             color: theme.textLight
//         },
//         featureList: {
//             display: 'flex',
//             flexWrap: 'wrap',
//             gap: '8px',
//             marginTop: '12px'
//         },
//         featureBadge: {
//             backgroundColor: theme.primary,
//             color: 'white',
//             padding: '4px 12px',
//             borderRadius: '20px',
//             fontSize: '11px',
//             fontWeight: '500'
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
//             borderRadius: '12px',
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
//         modalOverlay: {
//             position: 'fixed',
//             inset: 0,
//             backgroundColor: 'rgba(0,0,0,0.8)',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             zIndex: 2000,
//             backdropFilter: 'blur(8px)'
//         },
//         modal: {
//             backgroundColor: theme.card,
//             borderRadius: '20px',
//             width: '800px',
//             maxWidth: '90%',
//             maxHeight: '90vh',
//             overflowY: 'auto'
//         },
//         modalHeader: {
//             padding: '20px 24px',
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
//         imageUploadArea: {
//             border: `2px dashed ${theme.border}`,
//             borderRadius: '12px',
//             padding: '20px',
//             textAlign: 'center',
//             cursor: 'pointer',
//             transition: 'all 0.3s',
//             backgroundColor: theme.bg
//         },
//         imagePreview: {
//             width: '100%',
//             height: '150px',
//             borderRadius: '12px',
//             objectFit: 'cover',
//             marginBottom: '12px'
//         },
//         toast: {
//             position: 'fixed',
//             bottom: '20px',
//             right: '20px',
//             padding: '14px 24px',
//             borderRadius: '12px',
//             color: 'white',
//             zIndex: 2000,
//             display: 'flex',
//             alignItems: 'center',
//             gap: '10px',
//             boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
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
//         }
//     };

//     const totalEvents = events.length;
//     const upcomingEvents = events.filter(e => new Date(e.event_datetime) > new Date()).length;
//     const pastEvents = events.filter(e => new Date(e.event_datetime) <= new Date()).length;

//     if (!isLoggedIn) {
//         return (
//             <div style={styles.container}>
//                 <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
//                     <Sidebar theme={theme} isCollapsed={isCollapsed} activeView={activeView} setActiveView={setActiveView} />
//                     <div className="flex-grow-1 d-flex flex-column">
//                         <Header 
//                             theme={theme}
//                             isDarkMode={isDarkMode}
//                             toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
//                             toggleSidebar={() => setIsCollapsed(!isCollapsed)}
//                         />
//                         <div style={styles.emptyState}>
//                             <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔒</div>
//                             <h4>Please Login First</h4>
//                             <p>You need to be logged in to access Event Management.</p>
//                             <button className="btn btn-primary mt-3" onClick={() => window.location.href = '/'}>
//                                 Go to Login
//                             </button>
//                         </div>
//                         <Footer theme={theme} />
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div style={styles.container}>
//             <style>
//                 {`
//                     @keyframes fadeIn {
//                         from { opacity: 0; }
//                         to { opacity: 1; }
//                     }
//                     @keyframes slideUp {
//                         from { transform: translateY(50px); opacity: 0; }
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
//                     .event-card:hover {
//                         transform: translateY(-8px);
//                         box-shadow: 0 12px 30px rgba(0,0,0,0.2);
//                     }
//                     .image-wrapper:hover .card-overlay {
//                         opacity: 1 !important;
//                     }
//                     .image-wrapper:hover img {
//                         transform: scale(1.1);
//                     }
//                     .action-btn:hover {
//                         transform: scale(1.1) !important;
//                         box-shadow: 0 6px 20px rgba(0,0,0,0.25) !important;
//                     }
//                     button:hover {
//                         transform: translateY(-2px);
//                     }
//                     .search-box:focus {
//                         border-color: #5e2e10;
//                         box-shadow: 0 0 0 3px rgba(94, 46, 16, 0.1);
//                     }
//                 `}
//             </style>

//             <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
//                 <Sidebar theme={theme} isCollapsed={isCollapsed} activeView={activeView} setActiveView={setActiveView} />

//                 <div style={styles.mainWrapper}>
//                     <Header 
//                         theme={theme}
//                         isDarkMode={isDarkMode}
//                         toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
//                         toggleSidebar={() => setIsCollapsed(!isCollapsed)}
//                     />

//                     <div style={styles.scrollContent}>
//                         <div style={{ marginBottom: '30px' }}>
//                             <h1 style={styles.pageTitle}>Event Management</h1>
//                             <p style={{ color: theme.textLight }}>Manage and organize your events</p>
//                         </div>

//                         <div style={styles.statsContainer}>
//                             <div className="stat-card" style={styles.statCard}>
//                                 <div style={styles.statIcon}>📅</div>
//                                 <div style={styles.statValue}>{totalEvents}</div>
//                                 <div style={styles.statLabel}>Total Events</div>
//                             </div>
//                             <div className="stat-card" style={styles.statCard}>
//                                 <div style={styles.statIcon}>⏰</div>
//                                 <div style={styles.statValue}>{upcomingEvents}</div>
//                                 <div style={styles.statLabel}>Upcoming Events</div>
//                             </div>
//                             <div className="stat-card" style={styles.statCard}>
//                                 <div style={styles.statIcon}>✅</div>
//                                 <div style={styles.statValue}>{pastEvents}</div>
//                                 <div style={styles.statLabel}>Past Events</div>
//                             </div>
//                         </div>

//                         <div style={styles.toolbar}>
//                             <input
//                                 type="text"
//                                 placeholder="🔍 Search by title, main title, or posted by..."
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
//                                 onClick={() => {
//                                     resetForm();
//                                     setShowModal(true);
//                                 }}
//                             >
//                                 + Add Event
//                             </button>
//                         </div>

//                         {fetchLoading ? (
//                             <div style={styles.loadingSpinner}>
//                                 <div className="spinner-border text-primary" role="status">
//                                     <span className="visually-hidden">Loading...</span>
//                                 </div>
//                                 <p style={{ marginTop: '16px' }}>Loading events...</p>
//                             </div>
//                         ) : currentItems.length > 0 ? (
//                             <>
//                                 <div style={styles.eventGrid}>
//                                     {currentItems.map((event) => (
//                                         <div key={event.id} className="event-card" style={styles.eventCard}>
//                                             <div className="image-wrapper" style={styles.imageWrapper}>
//                                                 <img 
//                                                     src={getImageUrl(event.thumbImg) || 'https://via.placeholder.com/400x200?text=Event+Image'} 
//                                                     alt={event.title}
//                                                     style={styles.eventImage}
//                                                     onError={(e) => {
//                                                         e.target.onerror = null;
//                                                         e.target.src = 'https://via.placeholder.com/400x200?text=Event+Image';
//                                                     }}
//                                                 />
//                                                 <div className="card-overlay" style={styles.cardOverlay}>
//                                                     <button 
//                                                         className="action-btn"
//                                                         style={styles.actionBtn}
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             handleEdit(event);
//                                                         }}
//                                                         onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
//                                                         onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
//                                                     >
//                                                         ✏️
//                                                     </button>
//                                                     <button 
//                                                         className="action-btn"
//                                                         style={styles.actionBtn}
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             confirmDelete(event);
//                                                         }}
//                                                         onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
//                                                         onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
//                                                     >
//                                                         🗑️
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                             <div style={styles.cardContent}>
//                                                 <div style={styles.eventTitle}>{event.title}</div>
//                                                 <div style={styles.eventMeta}>
//                                                     <span>📅 {formatDateTime(event.event_datetime)}</span>
//                                                     <span>👤 {event.postedBy}</span>
//                                                 </div>
//                                                 <div style={{ fontSize: '14px', color: theme.textLight, marginBottom: '12px' }}>
//                                                     {event.mainTitle}
//                                                 </div>
//                                                 {event.features && event.features.length > 0 && (
//                                                     <div style={styles.featureList}>
//                                                         {event.features.slice(0, 3).map((feature, idx) => (
//                                                             <span key={idx} style={styles.featureBadge}>
//                                                                 {feature}
//                                                             </span>
//                                                         ))}
//                                                         {event.features.length > 3 && (
//                                                             <span style={styles.featureBadge}>
//                                                                 +{event.features.length - 3} more
//                                                             </span>
//                                                         )}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>

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
//                                 <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
//                                 <h4>No events found</h4>
//                                 <p style={{ color: theme.textLight, marginBottom: '20px' }}>
//                                     {searchTerm ? `No results found for "${searchTerm}"` : 'Start by adding your first event'}
//                                 </p>
//                                 {!searchTerm && (
//                                     <button style={styles.addBtn} onClick={() => setShowModal(true)}>
//                                         + Add Event
//                                     </button>
//                                 )}
//                             </div>
//                         )}
//                     </div>

//                     <Footer theme={theme} />
//                 </div>
//             </div>

//             {/* Add/Edit Event Modal */}
//             {showModal && (
//                 <div style={styles.modalOverlay} onClick={() => {
//                     setShowModal(false);
//                     resetForm();
//                 }}>
//                     <div style={styles.modal} onClick={e => e.stopPropagation()}>
//                         <div style={styles.modalHeader}>
//                             <h5 style={{ margin: 0, fontWeight: '600' }}>
//                                 {editingEvent ? 'Edit Event' : 'Add New Event'}
//                             </h5>
//                             <button 
//                                 className={`btn-close ${isDarkMode ? 'btn-close-white' : ''}`} 
//                                 onClick={() => {
//                                     setShowModal(false);
//                                     resetForm();
//                                 }}
//                             ></button>
//                         </div>
//                         <div style={styles.modalBody}>
//                             <form onSubmit={handleSubmit}>
//                                 <div className="row">
//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label fw-semibold mb-2">Event Title *</label>
//                                         <input
//                                             type="text"
//                                             name="title"
//                                             value={formData.title}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                             style={styles.input}
//                                             required
//                                             placeholder="Enter event title"
//                                         />
//                                     </div>

//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label fw-semibold mb-2">Event Date & Time *</label>
//                                         <input
//                                             type="datetime-local"
//                                             name="event_datetime"
//                                             value={formData.event_datetime}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                             style={styles.input}
//                                             required
//                                         />
//                                     </div>

//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label fw-semibold mb-2">Main Title *</label>
//                                         <input
//                                             type="text"
//                                             name="main_title"
//                                             value={formData.main_title}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                             style={styles.input}
//                                             required
//                                             placeholder="Enter main title"
//                                         />
//                                     </div>

//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label fw-semibold mb-2">Subtitle *</label>
//                                         <input
//                                             type="text"
//                                             name="subtitle"
//                                             value={formData.subtitle}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                             style={styles.input}
//                                             required
//                                             placeholder="Enter subtitle"
//                                         />
//                                     </div>

//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label fw-semibold mb-2">Posted By *</label>
//                                         <input
//                                             type="text"
//                                             name="posted_by"
//                                             value={formData.posted_by}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                             style={styles.input}
//                                             required
//                                             placeholder="Enter your name"
//                                         />
//                                     </div>

//                                     <div className="col-12 mb-3">
//                                         <label className="form-label fw-semibold mb-2">Description *</label>
//                                         <textarea
//                                             name="description"
//                                             value={formData.description}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                             style={styles.textarea}
//                                             required
//                                             placeholder="Describe the event details..."
//                                         />
//                                     </div>

//                                     <div className="col-12 mb-3">
//                                         <label className="form-label fw-semibold mb-2">Features</label>
//                                         <div className="input-group mb-2">
//                                             <input
//                                                 type="text"
//                                                 value={featureInput}
//                                                 onChange={(e) => setFeatureInput(e.target.value)}
//                                                 className="form-control"
//                                                 style={styles.input}
//                                                 placeholder="Add feature (e.g., 500+ Attendees)"
//                                                 onKeyPress={(e) => e.key === 'Enter' && addFeature()}
//                                             />
//                                             <button type="button" onClick={addFeature} className="btn" style={{ background: theme.primary, color: 'white' }}>
//                                                 Add
//                                             </button>
//                                         </div>
//                                         <div className="d-flex flex-wrap gap-2 mt-2">
//                                             {formData.features.map((feature, index) => (
//                                                 <span key={index} className="badge p-2" style={{ backgroundColor: theme.primary, color: 'white' }}>
//                                                     {feature}
//                                                     <i 
//                                                         className="bi bi-x-circle ms-2" 
//                                                         style={{ cursor: 'pointer' }}
//                                                         onClick={() => removeFeature(index)}
//                                                     ></i>
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     </div>

//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label fw-semibold mb-2">Thumbnail Image {!editingEvent && '*'}</label>
//                                         <div 
//                                             style={styles.imageUploadArea}
//                                             onClick={() => document.getElementById('thumbInput').click()}
//                                         >
//                                             {thumbPreview || (editingEvent && editingEvent.thumbImg) ? (
//                                                 <>
//                                                     <img 
//                                                         src={thumbPreview || getImageUrl(editingEvent?.thumbImg)} 
//                                                         alt="Thumbnail Preview"
//                                                         style={styles.imagePreview}
//                                                     />
//                                                     <p style={{ fontSize: '13px', color: theme.textLight }}>
//                                                         Click to change image
//                                                     </p>
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     <div style={{ fontSize: '48px', marginBottom: '10px' }}>🖼️</div>
//                                                     <p>Click to upload thumbnail</p>
//                                                     <p style={{ fontSize: '12px', color: theme.textLight }}>Recommended: 300x200px, max 5MB</p>
//                                                 </>
//                                             )}
//                                         </div>
//                                         <input
//                                             type="file"
//                                             id="thumbInput"
//                                             name="thumb_img"
//                                             onChange={handleFileChange}
//                                             style={{ display: 'none' }}
//                                             accept="image/*"
//                                             required={!editingEvent}
//                                         />
//                                     </div>

//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label fw-semibold mb-2">Main Image {!editingEvent && '*'}</label>
//                                         <div 
//                                             style={styles.imageUploadArea}
//                                             onClick={() => document.getElementById('mainInput').click()}
//                                         >
//                                             {mainPreview || (editingEvent && editingEvent.mainImg) ? (
//                                                 <>
//                                                     <img 
//                                                         src={mainPreview || getImageUrl(editingEvent?.mainImg)} 
//                                                         alt="Main Preview"
//                                                         style={styles.imagePreview}
//                                                     />
//                                                     <p style={{ fontSize: '13px', color: theme.textLight }}>
//                                                         Click to change image
//                                                     </p>
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     <div style={{ fontSize: '48px', marginBottom: '10px' }}>📷</div>
//                                                     <p>Click to upload main image</p>
//                                                     <p style={{ fontSize: '12px', color: theme.textLight }}>Recommended: 800x600px, max 5MB</p>
//                                                 </>
//                                             )}
//                                         </div>
//                                         <input
//                                             type="file"
//                                             id="mainInput"
//                                             name="main_img"
//                                             onChange={handleFileChange}
//                                             style={{ display: 'none' }}
//                                             accept="image/*"
//                                             required={!editingEvent}
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="d-flex gap-2 mt-3">
//                                     <button 
//                                         type="submit" 
//                                         className="btn flex-grow-1" 
//                                         style={{ background: theme.primaryGradient, color: 'white', border: 'none' }} 
//                                         disabled={loading}
//                                     >
//                                         {loading ? (
//                                             <>
//                                                 <span className="spinner-border spinner-border-sm me-2"></span>
//                                                 {editingEvent ? 'Updating...' : 'Saving...'}
//                                             </>
//                                         ) : (
//                                             editingEvent ? 'Update Event' : 'Save Event'
//                                         )}
//                                     </button>
//                                     <button 
//                                         type="button" 
//                                         className="btn btn-secondary" 
//                                         onClick={() => {
//                                             setShowModal(false);
//                                             resetForm();
//                                         }}
//                                     >
//                                         Cancel
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Delete Confirmation Modal */}
//             {showDeleteModal && (
//                 <div style={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
//                     <div style={{...styles.modal, width: '400px'}} onClick={e => e.stopPropagation()}>
//                         <div style={styles.modalHeader}>
//                             <h5 style={{ margin: 0, fontWeight: '600' }}>Confirm Delete</h5>
//                             <button 
//                                 className={`btn-close ${isDarkMode ? 'btn-close-white' : ''}`} 
//                                 onClick={() => setShowDeleteModal(false)}
//                             ></button>
//                         </div>
//                         <div style={styles.modalBody}>
//                             <div style={{ textAlign: 'center', marginBottom: '20px' }}>
//                                 <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚠️</div>
//                                 <p>Are you sure you want to delete <strong>{deletingEvent?.title}</strong>?</p>
//                                 <p style={{ fontSize: '13px', color: theme.textLight }}>This action cannot be undone.</p>
//                             </div>
//                             <div className="d-flex gap-2">
//                                 <button 
//                                     type="button" 
//                                     className="btn btn-secondary w-100" 
//                                     onClick={() => setShowDeleteModal(false)}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button 
//                                     type="button" 
//                                     className="btn w-100"
//                                     style={{ background: theme.danger, color: 'white', border: 'none' }}
//                                     onClick={handleDelete}
//                                 >
//                                     Delete
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

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

// export default Events;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const ITEMS_PER_PAGE = 6;
const EMPTY_FORM = {
    title: '', event_datetime: '', main_title: '', subtitle: '',
    posted_by: '', description: '', features: [], thumb_img: null, main_img: null
};

const getAuthToken = () => localStorage.getItem('token');

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
            width: '100%', maxWidth: width || '800px', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column', animation: 'slideUp .2s ease'
        }}>
            <div style={{
                padding: '18px 24px', borderBottom: `1px solid ${theme.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                position: 'sticky', top: 0, backgroundColor: theme.card, borderRadius: '18px 18px 0 0'
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

const Events = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeView, setActiveView] = useState('events');

    const [events, setEvents] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [deletingEvent, setDeletingEvent] = useState(null);

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [thumbPreview, setThumbPreview] = useState(null);
    const [mainPreview, setMainPreview] = useState(null);
    const [featureInput, setFeatureInput] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [toast, setToast] = useState({ show: false, message: '', type: '' });

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

    const API_BASE = import.meta.env.VITE_BASE_URL;
    const API_URL = import.meta.env.VITE_BASE_URL;

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.replace(/^\/storage\/storage\//, '/storage/');
        return cleanPath.startsWith('/storage/') ? `${API_URL}${cleanPath}` : `${API_URL}/storage/${cleanPath}`;
    };

    const axiosInstance = axios.create({ baseURL: API_BASE, headers: { Accept: 'application/json' } });
    axiosInstance.interceptors.request.use((config) => {
        const token = getAuthToken();
        if (token) config.headers.Authorization = `Bearer ${token}`;
        if (config.data instanceof FormData) delete config.headers['Content-Type'];
        return config;
    });

    const fetchEvents = async () => {
        setFetchLoading(true);
        try {
            if (!getAuthToken()) { setEvents([]); return; }
            const res = await axiosInstance.get('/events/all');
            setEvents(res.data.data || []);
        } catch (err) {
            console.error('Fetch error:', err);
            setEvents([]);
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => { fetchEvents(); }, []);

    const filteredEvents = events.filter(event =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.mainTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.postedBy?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
    const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfFirstItem + ITEMS_PER_PAGE);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) return showToast('Image size should be less than 5MB', 'error');
        setFormData({ ...formData, [e.target.name]: file });
        const previewUrl = URL.createObjectURL(file);
        if (e.target.name === 'thumb_img') setThumbPreview(previewUrl);
        else setMainPreview(previewUrl);
    };

    const addFeature = () => {
        if (!featureInput.trim()) return;
        setFormData({ ...formData, features: [...formData.features, featureInput.trim()] });
        setFeatureInput('');
    };
    const removeFeature = (index) => setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });

    const resetForm = () => {
        setFormData(EMPTY_FORM);
        setThumbPreview(null);
        setMainPreview(null);
        setEditingEvent(null);
        setFeatureInput('');
    };

    const closeModal = () => { setShowModal(false); resetForm(); };

    const handleEdit = (event) => {
        if (!getAuthToken()) { showToast('Please login to edit events', 'error'); window.location.href = '/'; return; }
        setEditingEvent(event);
        setFormData({
            title: event.title || '', event_datetime: event.event_datetime || '',
            main_title: event.mainTitle || '', subtitle: event.subtitle || '',
            posted_by: event.postedBy || '', description: event.description || '',
            features: event.features || [], thumb_img: null, main_img: null
        });
        setThumbPreview(null);
        setMainPreview(null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!getAuthToken()) { showToast('Please login to add/edit events', 'error'); window.location.href = '/'; return; }

        const submitData = new FormData();
        ['title', 'event_datetime', 'main_title', 'subtitle', 'posted_by', 'description'].forEach(key => submitData.append(key, formData[key]));
        formData.features.forEach((f, i) => submitData.append(`features[${i}]`, f));
        if (formData.thumb_img instanceof File) submitData.append('thumb_img', formData.thumb_img);
        if (formData.main_img instanceof File) submitData.append('main_img', formData.main_img);

        setLoading(true);
        try {
            const url = editingEvent ? `/events/${editingEvent.id}` : '/events';
            if (editingEvent) submitData.append('_method', 'PUT');
            const res = await axiosInstance.post(url, submitData);
            if (res.data.success) {
                showToast(editingEvent ? 'Event updated successfully!' : 'Event created successfully!');
                closeModal();
                fetchEvents();
            } else {
                showToast(res.data.message || 'Failed to save event', 'error');
            }
        } catch (err) {
            console.error('Submit error:', err);
            if (err.response?.status === 401) {
                showToast('Session expired. Please login again.', 'error');
                localStorage.removeItem('token');
                window.location.href = '/';
            } else {
                showToast(err.response?.data?.message || 'Something went wrong!', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`/events/${deletingEvent.id}`);
            fetchEvents();
            setDeletingEvent(null);
            showToast('Event deleted successfully!');
        } catch (err) {
            console.error('Delete error:', err);
            showToast('Failed to delete event', 'error');
        }
    };

    const formatDateTime = (datetime) => {
        if (!datetime) return 'N/A';
        return new Date(datetime).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const isLoggedIn = !!getAuthToken();
    const totalEvents = events.length;
    const upcomingEvents = events.filter(e => new Date(e.event_datetime) > new Date()).length;
    const pastEvents = totalEvents - upcomingEvents;

    if (!isLoggedIn) {
        return (
            <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }}>
                <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
                    <Sidebar theme={theme} isCollapsed={isCollapsed} activeView={activeView} setActiveView={setActiveView} />
                    <div className="flex-grow-1 d-flex flex-column">
                        <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
                        <div className="text-center py-5" style={{ color: theme.textLight }}>
                            <i className="bi bi-lock display-4 d-block mb-3" style={{ opacity: 0.4 }}></i>
                            <h4 style={{ color: theme.text }}>Please Login First</h4>
                            <p>You need to be logged in to access Event Management.</p>
                            <button className="btn btn-outline-dark mt-3" onClick={() => window.location.href = '/'}>Go to Login</button>
                        </div>
                        <Footer theme={theme} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }}>
            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView={activeView} setActiveView={setActiveView} />

                <div className="d-flex flex-column flex-grow-1" style={{ overflow: 'hidden' }}>
                    <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />

                    <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
                        <div style={{ marginBottom: '26px' }}>
                            <h1 style={{ fontSize: '26px', fontWeight: 700, color: theme.text, margin: 0 }}>Event Management</h1>
                            <p style={{ color: theme.textLight, margin: '4px 0 0' }}>Manage and organize your events</p>
                        </div>

                        {/* Stats */}
                        <div className="row g-3 mb-4">
                            {[
                                { label: 'Total Events', value: totalEvents },
                                { label: 'Upcoming Events', value: upcomingEvents },
                                { label: 'Past Events', value: pastEvents }
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
                                placeholder="Search by title, main title, or posted by..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                style={{ ...fieldStyle, width: '320px', backgroundColor: theme.card }}
                            />
                            <button onClick={() => { resetForm(); setShowModal(true); }} style={{ backgroundColor: accent, color: accentOn, border: 'none', padding: '10px 22px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                                <i className="bi bi-plus-lg me-2"></i>Add Event
                            </button>
                        </div>

                        {/* Events Grid */}
                        {fetchLoading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border" style={{ color: accent }} role="status"></div>
                                <p className="mt-3" style={{ color: theme.textLight }}>Loading events...</p>
                            </div>
                        ) : currentItems.length > 0 ? (
                            <>
                                <div className="row g-3">
                                    {currentItems.map(event => (
                                        <div className="col-md-6 col-lg-4" key={event.id}>
                                            <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', overflow: 'hidden', height: '100%' }}>
                                                <div style={{ position: 'relative' }}>
                                                    <img
                                                        src={getImageUrl(event.thumbImg) || 'https://via.placeholder.com/400x200?text=Event+Image'}
                                                        alt={event.title}
                                                        style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x200?text=Event+Image'; }}
                                                    />
                                                    <div className="d-flex gap-2" style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                                        <button className="btn btn-sm" onClick={() => handleEdit(event)} style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, color: theme.text }}>
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                        <button className="btn btn-sm" onClick={() => setDeletingEvent(event)} style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, color: theme.text }}>
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div style={{ padding: '16px' }}>
                                                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: theme.text, marginBottom: '8px' }}>{event.title}</h3>
                                                    <div style={{ fontSize: '12px', color: theme.textLight, marginBottom: '4px' }}>
                                                        <i className="bi bi-calendar-event me-1"></i>{formatDateTime(event.event_datetime)}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: theme.textLight, marginBottom: '10px' }}>
                                                        <i className="bi bi-person me-1"></i>{event.postedBy}
                                                    </div>
                                                    <div style={{ fontSize: '13px', color: theme.textLight, marginBottom: '10px' }}>{event.mainTitle}</div>
                                                    {event.features?.length > 0 && (
                                                        <div className="d-flex flex-wrap gap-2">
                                                            {event.features.slice(0, 3).map((feature, idx) => (
                                                                <span key={idx} style={{ border: `1px solid ${theme.border}`, color: theme.text, padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 500 }}>
                                                                    {feature}
                                                                </span>
                                                            ))}
                                                            {event.features.length > 3 && (
                                                                <span style={{ border: `1px solid ${theme.border}`, color: theme.textLight, padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 500 }}>
                                                                    +{event.features.length - 3} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
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
                                <i className="bi bi-calendar-x display-4 d-block mb-3" style={{ opacity: 0.4 }}></i>
                                <h5 style={{ color: theme.text }}>No events found</h5>
                                <p className="mb-3">{searchTerm ? `No results found for "${searchTerm}"` : 'Start by adding your first event'}</p>
                                {!searchTerm && (
                                    <button onClick={() => setShowModal(true)} style={{ backgroundColor: accent, color: accentOn, border: 'none', padding: '10px 22px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                                        <i className="bi bi-plus-lg me-2"></i>Add Event
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
                <Modal theme={theme} title={editingEvent ? 'Edit Event' : 'Add New Event'} onClose={closeModal}>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Event Title *</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} style={fieldStyle} required placeholder="Enter event title" />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Event Date & Time *</label>
                                <input type="datetime-local" name="event_datetime" value={formData.event_datetime} onChange={handleChange} style={fieldStyle} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Main Title *</label>
                                <input type="text" name="main_title" value={formData.main_title} onChange={handleChange} style={fieldStyle} required placeholder="Enter main title" />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Subtitle *</label>
                                <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} style={fieldStyle} required placeholder="Enter subtitle" />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Posted By *</label>
                                <input type="text" name="posted_by" value={formData.posted_by} onChange={handleChange} style={fieldStyle} required placeholder="Enter your name" />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Description *</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...fieldStyle, minHeight: '100px', resize: 'vertical' }} required placeholder="Describe the event details..." />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Features</label>
                                <div className="d-flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={featureInput}
                                        onChange={(e) => setFeatureInput(e.target.value)}
                                        style={fieldStyle}
                                        placeholder="Add feature (e.g., 500+ Attendees)"
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                                    />
                                    <button type="button" onClick={addFeature} className="btn btn-outline-dark">Add</button>
                                </div>
                                <div className="d-flex flex-wrap gap-2">
                                    {formData.features.map((feature, index) => (
                                        <span key={index} style={{ border: `1px solid ${theme.border}`, color: theme.text, padding: '5px 12px', borderRadius: '999px', fontSize: '12px' }}>
                                            {feature}
                                            <i className="bi bi-x-circle ms-2" style={{ cursor: 'pointer' }} onClick={() => removeFeature(index)}></i>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Thumbnail Image {!editingEvent && '*'}</label>
                                <div onClick={() => document.getElementById('thumbInput').click()} style={{ border: `2px dashed ${theme.border}`, borderRadius: '12px', padding: '18px', textAlign: 'center', cursor: 'pointer', backgroundColor: theme.bg }}>
                                    {thumbPreview || editingEvent?.thumbImg ? (
                                        <>
                                            <img src={thumbPreview || getImageUrl(editingEvent?.thumbImg)} alt="Thumbnail Preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px', marginBottom: '10px' }} />
                                            <p style={{ fontSize: '12px', color: theme.textLight, margin: 0 }}>Click to change image</p>
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-image" style={{ fontSize: '32px', color: theme.textLight }}></i>
                                            <p className="mb-0 mt-2">Click to upload thumbnail</p>
                                            <p style={{ fontSize: '11px', color: theme.textLight, margin: 0 }}>Recommended: 300x200px, max 5MB</p>
                                        </>
                                    )}
                                </div>
                                <input type="file" id="thumbInput" name="thumb_img" onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" required={!editingEvent} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Main Image {!editingEvent && '*'}</label>
                                <div onClick={() => document.getElementById('mainInput').click()} style={{ border: `2px dashed ${theme.border}`, borderRadius: '12px', padding: '18px', textAlign: 'center', cursor: 'pointer', backgroundColor: theme.bg }}>
                                    {mainPreview || editingEvent?.mainImg ? (
                                        <>
                                            <img src={mainPreview || getImageUrl(editingEvent?.mainImg)} alt="Main Preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px', marginBottom: '10px' }} />
                                            <p style={{ fontSize: '12px', color: theme.textLight, margin: 0 }}>Click to change image</p>
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-camera" style={{ fontSize: '32px', color: theme.textLight }}></i>
                                            <p className="mb-0 mt-2">Click to upload main image</p>
                                            <p style={{ fontSize: '11px', color: theme.textLight, margin: 0 }}>Recommended: 800x600px, max 5MB</p>
                                        </>
                                    )}
                                </div>
                                <input type="file" id="mainInput" name="main_img" onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" required={!editingEvent} />
                            </div>
                        </div>

                        <div className="d-flex gap-2 mt-4">
                            <button type="submit" className="btn flex-fill" disabled={loading} style={{ backgroundColor: accent, color: accentOn, border: 'none' }}>
                                {loading ? (<><span className="spinner-border spinner-border-sm me-2"></span>{editingEvent ? 'Updating...' : 'Saving...'}</>) : (editingEvent ? 'Update Event' : 'Save Event')}
                            </button>
                            <button type="button" className="btn btn-outline-dark" onClick={closeModal}>Cancel</button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            {deletingEvent && (
                <div
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 2000, padding: '20px', animation: 'fadeIn .2s ease'
                    }}
                    onClick={(e) => e.target === e.currentTarget && setDeletingEvent(null)}
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
                        <h5 style={{ margin: '0 0 8px', fontWeight: 600 }}>Delete this event?</h5>
                        <p style={{ margin: '0 0 22px', color: theme.textLight, fontSize: '14px' }}>
                            "<strong>{deletingEvent.title}</strong>" will be permanently removed. This can't be undone.
                        </p>
                        <div className="d-flex gap-2">
                            <button onClick={() => setDeletingEvent(null)} className="btn btn-outline-dark flex-fill">Cancel</button>
                            <button onClick={handleDelete} className="btn flex-fill" style={{ backgroundColor: accent, color: accentOn, border: 'none' }}>Delete</button>
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
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: ${theme.bg}; }
                ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default Events;