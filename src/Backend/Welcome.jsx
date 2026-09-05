
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import Footer from './Footer';

// const Welcome = ({ theme: propsTheme }) => {
//     // LocalStorage theke state properly initialize kora hoyeche
//     const [isCollapsed, setIsCollapsed] = useState(() => {
//         return localStorage.getItem("sidebar") === "true";
//     });
//     const [isDarkMode, setIsDarkMode] = useState(() => {
//         return localStorage.getItem("darkMode") === "true";
//     });

//     const [banners, setBanners] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showModal, setShowModal] = useState(false);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [isEditing, setIsEditing] = useState(false);
//     const [editId, setEditId] = useState(null);
    
//     const [formData, setFormData] = useState({
//         title: '',
//         description: '',
//         image: null
//     });

//     const BASE_URL = import.meta.env.VITE_BASE_URL;

//     // Sidebar collapse toggle logic
//     const toggleSidebar = () => {
//         const newState = !isCollapsed;
//         setIsCollapsed(newState);
//         localStorage.setItem("sidebar", newState);
//     };

//     const theme = propsTheme || {
//         isDarkMode,
//         bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
//         card: isDarkMode ? '#16213e' : '#ffffff',
//         text: isDarkMode ? '#e9ecef' : '#3e4b5b',
//         border: isDarkMode ? '#2d3436' : '#ebedf2',
//         inputBg: isDarkMode ? '#2d3436' : '#ffffff',
//         primary: '#5e2e10',
//         primaryGradient: 'linear-gradient(135deg, #5e2e10 0%, #8B4513 100%)'
//     };

//     const fetchWelcomes = async () => {
//         try {
//             const response = await axios.get(`${BASE_URL}/get-welcomes`);
//             if (response.data.success) {
//                 setBanners(response.data.data);
//             }
//         } catch (error) {
//             console.error("Data load error:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchWelcomes();
//     }, []);

//     const handleAddClick = () => {
//         setFormData({ title: '', description: '', image: null });
//         setImagePreview(null);
//         setIsEditing(false);
//         setEditId(null);
//         setShowModal(true);
//     };

//     const handleEditClick = (item) => {
//         setFormData({
//             title: item.title,
//             description: item.description,
//             image: null // Keep null for edit, old image will remain if no new image uploaded
//         });
//         setImagePreview(item.image); // Show existing image
//         setIsEditing(true);
//         setEditId(item.id);
//         setShowModal(true);
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setFormData({ ...formData, image: file });
//             const reader = new FileReader();
//             reader.onloadend = () => setImagePreview(reader.result);
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         // Validation: Check if either title or description is empty
//         if (!formData.title.trim() || !formData.description.trim()) {
//             alert("Please fill in all required fields!");
//             return;
//         }

//         try {
//             if (isEditing && editId) {
//                 // UPDATE API CALL
//                 const data = new FormData();
//                 data.append('title', formData.title);
//                 data.append('description', formData.description);
//                 if (formData.image) {
//                     data.append('image', formData.image);
//                 }
//                 // Add _method field for Laravel to handle PUT request
//                 data.append('_method', 'POST');

//                 const response = await axios.post(`${BASE_URL}/welcome/${editId}`, data, {
//                     headers: { 'Content-Type': 'multipart/form-data' }
//                 });

//                 if (response.data.success) {
//                     alert("Data successfully updated!");
//                     setShowModal(false);
//                     fetchWelcomes();
//                 } else {
//                     alert(response.data.message || "Update failed!");
//                 }
//             } else {
//                 // ADD NEW API CALL
//                 const data = new FormData();
//                 data.append('title', formData.title);
//                 data.append('description', formData.description);
//                 if (formData.image) {
//                     data.append('image', formData.image);
//                 }

//                 const response = await axios.post(`${BASE_URL}/add-welcomes`, data, {
//                     headers: { 'Content-Type': 'multipart/form-data' }
//                 });

//                 if (response.data.success) {
//                     alert("Data successfully added!");
//                     setShowModal(false);
//                     fetchWelcomes();
//                 } else {
//                     alert(response.data.message || "Add failed!");
//                 }
//             }
//         } catch (error) {
//             console.error("Operation error:", error.response?.data || error.message);
//             alert(error.response?.data?.message || "Something went wrong!");
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure?")) return;
//         try {
//             await axios.delete(`${BASE_URL}/del-welcomes/${id}`);
//             setBanners(banners.filter(x => x.id !== id));
//         } catch (error) {
//             console.error("Delete failed:", error);
//             alert("Delete failed!");
//         }
//     };

//     // Custom button styles with brand color
//     const buttonStyles = {
//         primary: {
//             background: theme.primaryGradient,
//             border: 'none',
//             color: 'white',
//             padding: '8px 20px',
//             borderRadius: '8px',
//             fontWeight: '500',
//             transition: 'all 0.3s ease',
//             boxShadow: '0 4px 15px rgba(94, 46, 16, 0.3)'
//         },
//         primaryModal: {
//             background: theme.primaryGradient,
//             border: 'none',
//             color: 'white',
//             padding: '10px 30px',
//             borderRadius: '8px',
//             fontWeight: '500',
//             transition: 'all 0.3s ease',
//             boxShadow: '0 4px 15px rgba(94, 46, 16, 0.3)'
//         },
//         edit: {
//             backgroundColor: '#3b82f6',
//             border: 'none',
//             color: 'white',
//             padding: '5px 15px',
//             borderRadius: '6px',
//             fontSize: '13px',
//             transition: 'all 0.3s ease',
//             marginRight: '8px'
//         },
//         danger: {
//             backgroundColor: '#ef4444',
//             border: 'none',
//             color: 'white',
//             padding: '5px 15px',
//             borderRadius: '6px',
//             fontSize: '13px',
//             transition: 'all 0.3s ease'
//         }
//     };

//     return (
//         <div style={{ backgroundColor: theme.bg, minHeight: '100vh', display: 'flex' }}>
//             {/* Sidebar Section */}
//             <div style={{ width: isCollapsed ? '80px' : '260px', transition: 'width 0.3s ease' }}>
//                 <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="welcome" />
//             </div>

//             <div className="flex-grow-1 d-flex flex-column" style={{ width: `calc(100% - ${isCollapsed ? '80px' : '260px'})`, transition: 'all 0.3s ease' }}>
//                 <Header 
//                     theme={theme} 
//                     isDarkMode={isDarkMode} 
//                     toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
//                     toggleSidebar={toggleSidebar} 
//                 />

//                 <div className="flex-grow-1 overflow-auto p-4">
//                     <div className="d-flex justify-content-between align-items-center mb-4">
//                         <h4 style={{ color: theme.text }} className="fw-bold">Welcome Section</h4>
//                         <button 
//                             className="btn px-4 shadow-sm" 
//                             style={buttonStyles.primary}
//                             onClick={handleAddClick}
//                             onMouseEnter={(e) => {
//                                 e.target.style.transform = 'translateY(-2px)';
//                                 e.target.style.boxShadow = '0 6px 20px rgba(94, 46, 16, 0.4)';
//                             }}
//                             onMouseLeave={(e) => {
//                                 e.target.style.transform = 'translateY(0)';
//                                 e.target.style.boxShadow = '0 4px 15px rgba(94, 46, 16, 0.3)';
//                             }}
//                         >
//                             + Add Record
//                         </button>
//                     </div>

//                     <div className="table-responsive p-3 shadow-sm" style={{ background: theme.card, borderRadius: "12px" }}>
//                         {loading ? (
//                             <div className="text-center p-5" style={{ color: theme.text }}>Loading data...</div>
//                         ) : (
//                             <table className={`table ${isDarkMode ? 'table-dark' : ''} align-middle mb-0`}>
//                                 <thead>
//                                     <tr>
//                                         <th style={{ width: '100px' }}>Image</th>
//                                         <th style={{ width: '200px' }}>Title</th>
//                                         <th>Description</th>
//                                         <th className="text-end" style={{ width: '180px' }}>Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {banners.map(b => (
//                                         <tr key={b.id}>
//                                             <td>
//                                                 {b.image ? (
//                                                     <img src={b.image} alt="thumb" style={{width: '60px', height: '40px', borderRadius: '5px', objectFit: 'cover'}} />
//                                                 ) : <span className="text-muted small">No Image</span>}
//                                             </td>
//                                             <td className="fw-bold" style={{ color: theme.text }}>{b.title}</td>
//                                             <td style={{ 
//                                                 color: isDarkMode ? '#ffffff' : '#6c757d', 
//                                                 fontSize: '0.9rem',
//                                                 maxWidth: '400px' 
//                                             }}>
//                                                 {b.description}
//                                             </td>
//                                             <td className="text-end">
//                                                 <button 
//                                                     className="btn btn-sm" 
//                                                     style={buttonStyles.edit}
//                                                     onClick={() => handleEditClick(b)}
//                                                     onMouseEnter={(e) => {
//                                                         e.target.style.backgroundColor = '#2563eb';
//                                                         e.target.style.transform = 'scale(1.05)';
//                                                     }}
//                                                     onMouseLeave={(e) => {
//                                                         e.target.style.backgroundColor = '#3b82f6';
//                                                         e.target.style.transform = 'scale(1)';
//                                                     }}
//                                                 >
//                                                     <i className="bi bi-pencil me-1"></i> Edit
//                                                 </button>
//                                                 <button 
//                                                     className="btn btn-sm" 
//                                                     style={buttonStyles.danger}
//                                                     onClick={() => handleDelete(b.id)}
//                                                     onMouseEnter={(e) => {
//                                                         e.target.style.backgroundColor = '#dc2626';
//                                                         e.target.style.transform = 'scale(1.05)';
//                                                     }}
//                                                     onMouseLeave={(e) => {
//                                                         e.target.style.backgroundColor = '#ef4444';
//                                                         e.target.style.transform = 'scale(1)';
//                                                     }}
//                                                 >
//                                                     <i className="bi bi-trash me-1"></i> Delete
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                     {banners.length === 0 && (
//                                         <tr>
//                                             <td colSpan="4" className="text-center p-4" style={{ color: theme.text }}>No records found.</td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         )}
//                     </div>
//                 </div>

//                 {/* MODAL SECTION - Updated for both Add and Edit */}
//                 {showModal && (
//                     <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
//                         <div className="modal-dialog modal-dialog-centered">
//                             <div className="modal-content" style={{ backgroundColor: theme.card, color: theme.text, border: `1px solid ${theme.border}` }}>
//                                 <div className="modal-header border-bottom-0">
//                                     <h5 className="modal-title">
//                                         {isEditing ? 'Edit Welcome Section' : 'Add Welcome Section'}
//                                     </h5>
//                                     <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
//                                 </div>
//                                 <form onSubmit={handleSubmit}>
//                                     <div className="modal-body">
//                                         <div className="mb-3">
//                                             <label className="form-label fw-bold">Title <span className="text-danger">*</span></label>
//                                             <input 
//                                                 type="text" 
//                                                 name="title" 
//                                                 className="form-control shadow-none" 
//                                                 style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }} 
//                                                 value={formData.title}
//                                                 onChange={handleChange} 
//                                                 required 
//                                             />
//                                         </div>
//                                         <div className="mb-3">
//                                             <label className="form-label fw-bold">Description <span className="text-danger">*</span></label>
//                                             <textarea 
//                                                 name="description" 
//                                                 className="form-control shadow-none" 
//                                                 rows="3" 
//                                                 style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }} 
//                                                 value={formData.description}
//                                                 onChange={handleChange} 
//                                                 required
//                                             ></textarea>
//                                         </div>
//                                         <div className="mb-3">
//                                             <label className="form-label fw-bold">
//                                                 {isEditing ? 'Change Image (Optional)' : 'Upload Image'}
//                                             </label>
//                                             <input 
//                                                 type="file" 
//                                                 className="form-control shadow-none" 
//                                                 accept="image/*" 
//                                                 style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }} 
//                                                 onChange={handleImageChange} 
//                                             />
//                                             {imagePreview && (
//                                                 <div className="mt-3 text-center">
//                                                     <img 
//                                                         src={imagePreview} 
//                                                         alt="Preview" 
//                                                         style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px', objectFit: 'contain' }} 
//                                                     />
//                                                     {isEditing && !formData.image && (
//                                                         <p className="text-muted small mt-1">Current image shown. Upload new to replace.</p>
//                                                     )}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                     <div className="modal-footer border-top-0">
//                                         <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
//                                         <button 
//                                             type="submit" 
//                                             className="btn px-4" 
//                                             style={buttonStyles.primaryModal}
//                                             onMouseEnter={(e) => {
//                                                 e.target.style.transform = 'translateY(-2px)';
//                                                 e.target.style.boxShadow = '0 6px 20px rgba(94, 46, 16, 0.4)';
//                                             }}
//                                             onMouseLeave={(e) => {
//                                                 e.target.style.transform = 'translateY(0)';
//                                                 e.target.style.boxShadow = '0 4px 15px rgba(94, 46, 16, 0.3)';
//                                             }}
//                                         >
//                                             {isEditing ? 'Update' : 'Submit'}
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//                 <Footer theme={theme} />
//             </div>
//         </div>
//     );
// };

// export default Welcome;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const EMPTY_FORM = { title: '', description: '', image: null };

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
            border: `1px solid ${theme.border}`, borderRadius: '16px',
            width: '100%', maxWidth: width || '480px', maxHeight: '90vh',
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
                <div style={{ padding: '16px 22px', borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    {footer}
                </div>
            )}
        </div>
    </div>
);

const Welcome = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebar') === 'true');
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);

    const [deletingItem, setDeletingItem] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#0a0a0a' : '#f5f5f5',
        card: isDarkMode ? '#141414' : '#ffffff',
        text: isDarkMode ? '#f5f5f5' : '#111111',
        textLight: isDarkMode ? '#a3a3a3' : '#6b6b6b',
        border: isDarkMode ? '#2b2b2b' : '#dcdcdc',
        inputBg: isDarkMode ? '#1a1a1a' : '#ffffff'
    };
    const accent = theme.text;
    const accentOn = theme.card;

    const toggleSidebar = () => {
        const next = !isCollapsed;
        setIsCollapsed(next);
        localStorage.setItem('sidebar', next);
    };

    const fetchWelcomes = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/get-welcomes`);
            if (res.data.success) setBanners(res.data.data);
        } catch (err) {
            console.error('Data load error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWelcomes(); }, []);

    const closeModal = () => { setShowModal(false); setFormData(EMPTY_FORM); setImagePreview(null); };

    const handleAddClick = () => {
        setFormData(EMPTY_FORM);
        setImagePreview(null);
        setIsEditing(false);
        setEditId(null);
        setShowModal(true);
    };

    const handleEditClick = (item) => {
        setFormData({ title: item.title, description: item.description, image: null });
        setImagePreview(item.image);
        setIsEditing(true);
        setEditId(item.id);
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFormData({ ...formData, image: file });
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.description.trim()) {
            alert('Please fill in all required fields!');
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        if (formData.image) data.append('image', formData.image);

        try {
            if (isEditing && editId) {
                data.append('_method', 'POST');
                const res = await axios.post(`${BASE_URL}/welcome/${editId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
                if (res.data.success) {
                    alert('Data successfully updated!');
                    closeModal();
                    fetchWelcomes();
                } else {
                    alert(res.data.message || 'Update failed!');
                }
            } else {
                const res = await axios.post(`${BASE_URL}/add-welcomes`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
                if (res.data.success) {
                    alert('Data successfully added!');
                    closeModal();
                    fetchWelcomes();
                } else {
                    alert(res.data.message || 'Add failed!');
                }
            }
        } catch (err) {
            console.error('Operation error:', err.response?.data || err.message);
            alert(err.response?.data?.message || 'Something went wrong!');
        }
    };

    const confirmDelete = async () => {
        if (!deletingItem) return;
        setDeleting(true);
        try {
            await axios.delete(`${BASE_URL}/del-welcomes/${deletingItem.id}`);
            setBanners(prev => prev.filter(x => x.id !== deletingItem.id));
            setDeletingItem(null);
        } catch (err) {
            console.error('Delete failed:', err);
            alert('Delete failed!');
        } finally {
            setDeleting(false);
        }
    };

    const fieldStyle = { backgroundColor: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` };

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh', display: 'flex' }}>
            <div style={{ width: isCollapsed ? '80px' : '260px', transition: 'width 0.3s ease' }}>
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="welcome" />
            </div>

            <div className="flex-grow-1 d-flex flex-column">
                <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} toggleSidebar={toggleSidebar} />

                <div className="flex-grow-1 overflow-auto p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 style={{ color: theme.text }} className="fw-bold">Welcome Section</h4>
                        <button
                            className="btn px-4"
                            onClick={handleAddClick}
                            style={{ backgroundColor: accent, color: accentOn, border: 'none', fontWeight: 500, borderRadius: '8px' }}
                        >
                            <i className="bi bi-plus-lg me-1"></i>Add Record
                        </button>
                    </div>

                    <div className="table-responsive p-3" style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px' }}>
                        {loading ? (
                            <div className="text-center p-5" style={{ color: theme.textLight }}>Loading data...</div>
                        ) : (
                            <table className="table align-middle mb-0" style={{ color: theme.text }}>
                                <thead>
                                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                                        <th style={{ width: '100px', color: theme.text }}>Image</th>
                                        <th style={{ width: '200px', color: theme.text }}>Title</th>
                                        <th style={{ color: theme.text }}>Description</th>
                                        <th className="text-end" style={{ width: '180px', color: theme.text }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {banners.map(b => (
                                        <tr key={b.id} style={{ borderColor: theme.border }}>
                                            <td>
                                                {b.image ? (
                                                    <img src={b.image} alt="thumb" style={{ width: '60px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: `1px solid ${theme.border}` }} />
                                                ) : <span style={{ color: theme.textLight, fontSize: '13px' }}>No Image</span>}
                                            </td>
                                            <td className="fw-bold" style={{ color: theme.text }}>{b.title}</td>
                                            <td style={{ color: theme.textLight, fontSize: '0.9rem', maxWidth: '400px' }}>{b.description}</td>
                                            <td className="text-end">
                                                <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleEditClick(b)}>
                                                    <i className="bi bi-pencil me-1"></i>Edit
                                                </button>
                                                <button className="btn btn-sm btn-outline-dark" onClick={() => setDeletingItem(b)}>
                                                    <i className="bi bi-trash me-1"></i>Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {banners.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center p-4" style={{ color: theme.textLight }}>No records found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <Footer theme={theme} />
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <form onSubmit={handleSubmit}>
                    <Modal
                        theme={theme}
                        title={isEditing ? 'Edit Welcome Section' : 'Add Welcome Section'}
                        onClose={closeModal}
                        footer={<>
                            <button type="button" className="btn btn-outline-dark" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn px-4" style={{ backgroundColor: accent, color: accentOn, border: 'none' }}>
                                {isEditing ? 'Update' : 'Submit'}
                            </button>
                        </>}
                    >
                        <div className="mb-3">
                            <label className="form-label fw-bold">Title <span className="text-danger">*</span></label>
                            <input type="text" name="title" className="form-control shadow-none" style={fieldStyle} value={formData.title} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Description <span className="text-danger">*</span></label>
                            <textarea name="description" className="form-control shadow-none" rows="3" style={fieldStyle} value={formData.description} onChange={handleChange} required></textarea>
                        </div>
                        <div>
                            <label className="form-label fw-bold">{isEditing ? 'Change Image (Optional)' : 'Upload Image'}</label>
                            <input type="file" className="form-control shadow-none" accept="image/*" style={fieldStyle} onChange={handleImageChange} />
                            {imagePreview && (
                                <div className="mt-3 text-center">
                                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px', objectFit: 'contain', border: `1px solid ${theme.border}` }} />
                                    {isEditing && !formData.image && (
                                        <p style={{ color: theme.textLight, fontSize: '13px' }} className="mt-1">Current image shown. Upload new to replace.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </Modal>
                </form>
            )}

            {/* Delete Confirmation Modal */}
            {deletingItem && (
                <div
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 2000, padding: '20px', animation: 'fadeIn .2s ease'
                    }}
                    onClick={(e) => e.target === e.currentTarget && !deleting && setDeletingItem(null)}
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
                        <h5 style={{ margin: '0 0 8px', fontWeight: 600 }}>Delete this record?</h5>
                        <p style={{ margin: '0 0 22px', color: theme.textLight, fontSize: '14px' }}>
                            "<strong>{deletingItem.title}</strong>" will be permanently removed. This can't be undone.
                        </p>
                        <div className="d-flex gap-2">
                            <button onClick={() => setDeletingItem(null)} disabled={deleting} className="btn btn-outline-dark flex-fill">Cancel</button>
                            <button onClick={confirmDelete} disabled={deleting} className="btn flex-fill" style={{ backgroundColor: accent, color: accentOn, border: 'none' }}>
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .form-control:focus { border-color: ${accent} !important; box-shadow: 0 0 0 3px ${accent}1a !important; }
                .table tbody tr:hover { background-color: ${theme.isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'}; }
            `}</style>
        </div>
    );
};

export default Welcome;