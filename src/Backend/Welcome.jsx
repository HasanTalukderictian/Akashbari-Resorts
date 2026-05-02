// import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Axios import kora holo
// import Header from './Header';
// import Sidebar from './Sidebar';
// import Footer from './Footer';

// const Welcome = ({ theme: propsTheme }) => {
//     const [isCollapsed, setIsCollapsed] = useState(localStorage.getItem("sidebar") === "true");
//     const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("darkMode") === "true");

//     const [banners, setBanners] = useState([]); // Initial empty array
//     const [loading, setLoading] = useState(true);
//     const [showModal, setShowModal] = useState(false);
//     const [imagePreview, setImagePreview] = useState(null);
    
//     const [formData, setFormData] = useState({
//         title: '',
//         description: '',
        
//         image: null
//     });

//     const theme = propsTheme || {
//         isDarkMode,
//         bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
//         card: isDarkMode ? '#16213e' : '#ffffff',
//         text: isDarkMode ? '#e9ecef' : '#3e4b5b',
//         border: isDarkMode ? '#2d3436' : '#ebedf2',
//         inputBg: isDarkMode ? '#2d3436' : '#ffffff'
//     };

//     // ✅ API theke data Load kora (GET)
//     const fetchWelcomes = async () => {
//         try {
//             const response = await axios.get('http://127.0.0.1:8000/api/get-welcomes');
//             if (response.data.success) {
//                 setBanners(response.data.data);
//             }
//         } catch (error) {
//             console.error("Data load korte somossa hoyeche:", error);
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

//     // ✅ Data Backend e pathano (POST)
//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         // Image thakle oboshoy FormData use korte hobe
//         const data = new FormData();
//         data.append('title', formData.title);
//         data.append('description', formData.description);
//         if (formData.image) {
//             data.append('image', formData.image);
//         }

//         try {
//             const response = await axios.post('http://127.0.0.1:8000/api/add-welcomes', data, {
//                 headers: { 'Content-Type': 'multipart/form-data' }
//             });

//             if (response.data.success) {
//                 alert("Data successfully added!");
//                 setShowModal(false);
//                 fetchWelcomes(); // List refresh korar jonno
//             }
//         } catch (error) {
//             console.error("Upload error:", error.response?.data || error.message);
//             alert(error.response?.data?.message || "Kichu ekta vul hoyeche!");
//         }
//     };

//     // ✅ Data Delete kora
//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure?")) return;
//         try {
         
//             await axios.delete(`http://127.0.0.1:8000/api/del-welcomes/${id}`);
//             setBanners(banners.filter(x => x.id !== id));
//         } catch (error) {
//             console.error("Delete failed:", error);
//         }
//     };

//     return (
//         <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }} className="d-flex">
//             <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="content" />

//             <div className="flex-grow-1 d-flex flex-column" style={{ height: '100vh' }}>
//                 <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />

//                 <div className="flex-grow-1 overflow-auto p-4">
//                     <div className="d-flex justify-content-between align-items-center mb-4">
//                         <h4 style={{ color: theme.text }} className="fw-bold">Welcome Section</h4>
//                         <button className="btn btn-primary px-4" onClick={handleAddClick}>+ Add Record</button>
//                     </div>

//                     <div className="table-responsive p-3" style={{ background: theme.card, borderRadius: "12px" }}>
//                         {loading ? (
//                             <div className="text-center p-5">Loading data...</div>
//                         ) : (
//                             <table className={`table ${isDarkMode ? 'table-dark' : ''} align-middle`}>
//                                 <thead>
//                                     <tr>
//                                         <th>Image</th>
//                                         <th>Title</th>
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
//                                                 ) : 'No Image'}
//                                             </td>
//                                             <td className="fw-bold">{b.title}</td>
//                                             <td className="text-muted">{b.description}</td>
//                                             <td className="text-end">
//                                                 <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(b.id)}>Delete</button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                     {banners.length === 0 && (
//                                         <tr>
//                                             <td colSpan="4" className="text-center p-4">No records found.</td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         )}
//                     </div>
//                 </div>

//                 {/* ✅ MODAL */}
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
//                                             <input type="text" name="title" className="form-control" style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }} onChange={handleChange} required />
//                                         </div>
//                                         <div className="mb-3">
//                                             <label className="form-label fw-bold">Description</label>
//                                             <textarea name="description" className="form-control" rows="3" style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }} onChange={handleChange} required></textarea>
//                                         </div>
//                                         <div className="mb-3">
//                                             <label className="form-label fw-bold">Upload Image</label>
//                                             <input type="file" className="form-control" accept="image/*" style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }} onChange={handleImageChange} />
//                                             {imagePreview && (
//                                                 <div className="mt-3 text-center">
//                                                     <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }} />
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                     <div className="modal-footer border-top-0">
//                                         <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
//                                         <button type="submit" className="btn btn-primary px-4">Submit</button>
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
    // LocalStorage theke state nite hobe properly
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
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: null
    });

    // Sidebar collapse toggle handle function
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
        inputBg: isDarkMode ? '#2d3436' : '#ffffff'
    };

    const fetchWelcomes = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/get-welcomes');
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
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/add-welcomes', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                alert("Data successfully added!");
                setShowModal(false);
                fetchWelcomes();
            }
        } catch (error) {
            console.error("Upload error:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Kichu ekta vul hoyeche!");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/del-welcomes/${id}`);
            setBanners(banners.filter(x => x.id !== id));
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh', display: 'flex' }}>
            {/* Sidebar wrap kora hoyeche jate width fixed thake */}
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
                        <button className="btn btn-primary px-4 shadow-sm" onClick={handleAddClick}>+ Add Record</button>
                    </div>

                    <div className="table-responsive p-3 shadow-sm" style={{ background: theme.card, borderRadius: "12px" }}>
                        {loading ? (
                            <div className="text-center p-5">Loading data...</div>
                        ) : (
                            <table className={`table ${isDarkMode ? 'table-dark' : ''} align-middle mb-0`}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '100px' }}>Image</th>
                                        <th style={{ width: '200px' }}>Title</th>
                                        <th>Description</th>
                                        <th className="text-end">Action</th>
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
                                            <td className="fw-bold">{b.title}</td>
                                            <td className="text-muted small" style={{ maxWidth: '400px' }}>{b.description}</td>
                                            <td className="text-end">
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(b.id)}>
                                                    <i className="bi bi-trash"></i> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {banners.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center p-4">No records found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <Footer theme={theme} />
            </div>

            {/* MODAL (Same as before) */}
            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ backgroundColor: theme.card, color: theme.text, border: `1px solid ${theme.border}` }}>
                            <div className="modal-header border-bottom-0">
                                <h5 className="modal-title">Add Welcome Section</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Title</label>
                                        <input type="text" name="title" className="form-control shadow-none" style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Description</label>
                                        <textarea name="description" className="form-control shadow-none" rows="3" style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }} onChange={handleChange} required></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Upload Image</label>
                                        <input type="file" className="form-control shadow-none" accept="image/*" style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }} onChange={handleImageChange} />
                                        {imagePreview && (
                                            <div className="mt-3 text-center">
                                                <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="modal-footer border-top-0">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary px-4">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Welcome;