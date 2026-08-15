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
    
//     const [formData, setFormData] = useState({
//         title: '',
//         description: '',
//         image: null
//     });

//      const BASE_URL = import.meta.env.VITE_BASE_URL;

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
//         const data = new FormData();
//         data.append('title', formData.title);
//         data.append('description', formData.description);
//         if (formData.image) {
//             data.append('image', formData.image);
//         }

//         try {
//             const response = await axios.post(`${BASE_URL}/add-welcomes`, data, {
//                 headers: { 'Content-Type': 'multipart/form-data' }
//             });

//             if (response.data.success) {
//                 alert("Data successfully added!");
//                 setShowModal(false);
//                 fetchWelcomes();
//             }
//         } catch (error) {
//             console.error("Upload error:", error.response?.data || error.message);
//             alert(error.response?.data?.message || "Kichu ekta vul hoyeche!");
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure?")) return;
//         try {
//             await axios.delete(`${BASE_URL}/del-welcomes/${id}`);
//             setBanners(banners.filter(x => x.id !== id));
//         } catch (error) {
//             console.error("Delete failed:", error);
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
//                                         <th className="text-end">Action</th>
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
//                                                     Delete
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

//                 {/* MODAL SECTION */}
//                 {showModal && (
//                     <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
//                         <div className="modal-dialog modal-dialog-centered">
//                             <div className="modal-content" style={{ backgroundColor: theme.card, color: theme.text, border: `1px solid ${theme.border}` }}>
//                                 <div className="modal-header border-bottom-0">
//                                     <h5 className="modal-title">Add Welcome Section</h5>
//                                     <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
//                                 </div>
//                                 <form onSubmit={handleSubmit}>
//                                     <div className="modal-body">
//                                         <div className="mb-3">
//                                             <label className="form-label fw-bold">Title</label>
//                                             <input type="text" name="title" className="form-control shadow-none" style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }} onChange={handleChange} required />
//                                         </div>
//                                         <div className="mb-3">
//                                             <label className="form-label fw-bold">Description</label>
//                                             <textarea name="description" className="form-control shadow-none" rows="3" style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }} onChange={handleChange} required></textarea>
//                                         </div>
//                                         <div className="mb-3">
//                                             <label className="form-label fw-bold">Upload Image</label>
//                                             <input type="file" className="form-control shadow-none" accept="image/*" style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }} onChange={handleImageChange} />
//                                             {imagePreview && (
//                                                 <div className="mt-3 text-center">
//                                                     <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }} />
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
//                                             Submit
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

const Welcome = ({ theme: propsTheme }) => {
    // LocalStorage theke state properly initialize kora hoyeche
    const [isCollapsed, setIsCollapsed] = useState(() => {
        return localStorage.getItem("sidebar") === "true";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: null
    });

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    // Sidebar collapse toggle logic
    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem("sidebar", newState);
    };

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2',
        inputBg: isDarkMode ? '#2d3436' : '#ffffff',
        primary: '#5e2e10',
        primaryGradient: 'linear-gradient(135deg, #5e2e10 0%, #8B4513 100%)'
    };

    const fetchWelcomes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/get-welcomes`);
            if (response.data.success) {
                setBanners(response.data.data);
            }
        } catch (error) {
            console.error("Data load error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWelcomes();
    }, []);

    const handleAddClick = () => {
        setFormData({ title: '', description: '', image: null });
        setImagePreview(null);
        setIsEditing(false);
        setEditId(null);
        setShowModal(true);
    };

    const handleEditClick = (item) => {
        setFormData({
            title: item.title,
            description: item.description,
            image: null // Keep null for edit, old image will remain if no new image uploaded
        });
        setImagePreview(item.image); // Show existing image
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
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation: Check if either title or description is empty
        if (!formData.title.trim() || !formData.description.trim()) {
            alert("Please fill in all required fields!");
            return;
        }

        try {
            if (isEditing && editId) {
                // UPDATE API CALL
                const data = new FormData();
                data.append('title', formData.title);
                data.append('description', formData.description);
                if (formData.image) {
                    data.append('image', formData.image);
                }
                // Add _method field for Laravel to handle PUT request
                data.append('_method', 'POST');

                const response = await axios.post(`${BASE_URL}/welcome/${editId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.data.success) {
                    alert("Data successfully updated!");
                    setShowModal(false);
                    fetchWelcomes();
                } else {
                    alert(response.data.message || "Update failed!");
                }
            } else {
                // ADD NEW API CALL
                const data = new FormData();
                data.append('title', formData.title);
                data.append('description', formData.description);
                if (formData.image) {
                    data.append('image', formData.image);
                }

                const response = await axios.post(`${BASE_URL}/add-welcomes`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.data.success) {
                    alert("Data successfully added!");
                    setShowModal(false);
                    fetchWelcomes();
                } else {
                    alert(response.data.message || "Add failed!");
                }
            }
        } catch (error) {
            console.error("Operation error:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Something went wrong!");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${BASE_URL}/del-welcomes/${id}`);
            setBanners(banners.filter(x => x.id !== id));
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Delete failed!");
        }
    };

    // Custom button styles with brand color
    const buttonStyles = {
        primary: {
            background: theme.primaryGradient,
            border: 'none',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '8px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(94, 46, 16, 0.3)'
        },
        primaryModal: {
            background: theme.primaryGradient,
            border: 'none',
            color: 'white',
            padding: '10px 30px',
            borderRadius: '8px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(94, 46, 16, 0.3)'
        },
        edit: {
            backgroundColor: '#3b82f6',
            border: 'none',
            color: 'white',
            padding: '5px 15px',
            borderRadius: '6px',
            fontSize: '13px',
            transition: 'all 0.3s ease',
            marginRight: '8px'
        },
        danger: {
            backgroundColor: '#ef4444',
            border: 'none',
            color: 'white',
            padding: '5px 15px',
            borderRadius: '6px',
            fontSize: '13px',
            transition: 'all 0.3s ease'
        }
    };

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh', display: 'flex' }}>
            {/* Sidebar Section */}
            <div style={{ width: isCollapsed ? '80px' : '260px', transition: 'width 0.3s ease' }}>
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="welcome" />
            </div>

            <div className="flex-grow-1 d-flex flex-column" style={{ width: `calc(100% - ${isCollapsed ? '80px' : '260px'})`, transition: 'all 0.3s ease' }}>
                <Header 
                    theme={theme} 
                    isDarkMode={isDarkMode} 
                    toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
                    toggleSidebar={toggleSidebar} 
                />

                <div className="flex-grow-1 overflow-auto p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 style={{ color: theme.text }} className="fw-bold">Welcome Section</h4>
                        <button 
                            className="btn px-4 shadow-sm" 
                            style={buttonStyles.primary}
                            onClick={handleAddClick}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(94, 46, 16, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(94, 46, 16, 0.3)';
                            }}
                        >
                            + Add Record
                        </button>
                    </div>

                    <div className="table-responsive p-3 shadow-sm" style={{ background: theme.card, borderRadius: "12px" }}>
                        {loading ? (
                            <div className="text-center p-5" style={{ color: theme.text }}>Loading data...</div>
                        ) : (
                            <table className={`table ${isDarkMode ? 'table-dark' : ''} align-middle mb-0`}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '100px' }}>Image</th>
                                        <th style={{ width: '200px' }}>Title</th>
                                        <th>Description</th>
                                        <th className="text-end" style={{ width: '180px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {banners.map(b => (
                                        <tr key={b.id}>
                                            <td>
                                                {b.image ? (
                                                    <img src={b.image} alt="thumb" style={{width: '60px', height: '40px', borderRadius: '5px', objectFit: 'cover'}} />
                                                ) : <span className="text-muted small">No Image</span>}
                                            </td>
                                            <td className="fw-bold" style={{ color: theme.text }}>{b.title}</td>
                                            <td style={{ 
                                                color: isDarkMode ? '#ffffff' : '#6c757d', 
                                                fontSize: '0.9rem',
                                                maxWidth: '400px' 
                                            }}>
                                                {b.description}
                                            </td>
                                            <td className="text-end">
                                                <button 
                                                    className="btn btn-sm" 
                                                    style={buttonStyles.edit}
                                                    onClick={() => handleEditClick(b)}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = '#2563eb';
                                                        e.target.style.transform = 'scale(1.05)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = '#3b82f6';
                                                        e.target.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    <i className="bi bi-pencil me-1"></i> Edit
                                                </button>
                                                <button 
                                                    className="btn btn-sm" 
                                                    style={buttonStyles.danger}
                                                    onClick={() => handleDelete(b.id)}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = '#dc2626';
                                                        e.target.style.transform = 'scale(1.05)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = '#ef4444';
                                                        e.target.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    <i className="bi bi-trash me-1"></i> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {banners.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center p-4" style={{ color: theme.text }}>No records found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* MODAL SECTION - Updated for both Add and Edit */}
                {showModal && (
                    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content" style={{ backgroundColor: theme.card, color: theme.text, border: `1px solid ${theme.border}` }}>
                                <div className="modal-header border-bottom-0">
                                    <h5 className="modal-title">
                                        {isEditing ? 'Edit Welcome Section' : 'Add Welcome Section'}
                                    </h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Title <span className="text-danger">*</span></label>
                                            <input 
                                                type="text" 
                                                name="title" 
                                                className="form-control shadow-none" 
                                                style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }} 
                                                value={formData.title}
                                                onChange={handleChange} 
                                                required 
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Description <span className="text-danger">*</span></label>
                                            <textarea 
                                                name="description" 
                                                className="form-control shadow-none" 
                                                rows="3" 
                                                style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }} 
                                                value={formData.description}
                                                onChange={handleChange} 
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">
                                                {isEditing ? 'Change Image (Optional)' : 'Upload Image'}
                                            </label>
                                            <input 
                                                type="file" 
                                                className="form-control shadow-none" 
                                                accept="image/*" 
                                                style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }} 
                                                onChange={handleImageChange} 
                                            />
                                            {imagePreview && (
                                                <div className="mt-3 text-center">
                                                    <img 
                                                        src={imagePreview} 
                                                        alt="Preview" 
                                                        style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px', objectFit: 'contain' }} 
                                                    />
                                                    {isEditing && !formData.image && (
                                                        <p className="text-muted small mt-1">Current image shown. Upload new to replace.</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="modal-footer border-top-0">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button 
                                            type="submit" 
                                            className="btn px-4" 
                                            style={buttonStyles.primaryModal}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = 'translateY(-2px)';
                                                e.target.style.boxShadow = '0 6px 20px rgba(94, 46, 16, 0.4)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = '0 4px 15px rgba(94, 46, 16, 0.3)';
                                            }}
                                        >
                                            {isEditing ? 'Update' : 'Submit'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
                <Footer theme={theme} />
            </div>
        </div>
    );
};

export default Welcome;