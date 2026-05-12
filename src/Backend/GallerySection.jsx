import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

// Laravel Backend URL
const API_BASE_URL = 'http://localhost:8000/api/gallery';

const GallerySection = ({ theme: propsTheme }) => {
    // --- State Management ---
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [galleryItems, setGalleryItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        image: null,
        imagePreview: ''
    });

    // --- Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // --- Dynamic Theme ---
    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#121212' : '#f4f7fa',
        card: isDarkMode ? '#1e1e1e' : '#ffffff',
        text: isDarkMode ? '#e0e0e0' : '#333333',
        border: isDarkMode ? '#333333' : '#e0e0e0',
        primary: '#9a55ff',
        tableHeader: isDarkMode ? '#2d2d2d' : '#f8f9fa'
    };

    // --- API Logic ---
    const fetchGallery = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_BASE_URL);
            setGalleryItems(res.data);
        } catch (err) {
            console.error("Data Load Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    // --- Pagination Calculation ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = galleryItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(galleryItems.length / itemsPerPage);

    // --- Handlers ---
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file,
                imagePreview: URL.createObjectURL(file)
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title) return alert("Title is required");

        const data = new FormData();
        data.append('title', formData.title);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            if (editingItem) {
                // Use POST with _method spoofing for Laravel if needed, or direct POST
                await axios.post(`${API_BASE_URL}/${editingItem.id}`, data);
            } else {
                await axios.post(API_BASE_URL, data);
            }
            fetchGallery();
            closeModal();
        } catch (err) {
            alert("Error saving data.");
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await axios.delete(`${API_BASE_URL}/${id}`);
                fetchGallery();
            } catch (err) {
                console.error("Delete Error:", err);
            }
        }
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            image: null,
            imagePreview: item.image_url
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setFormData({ title: '', image: null, imagePreview: '' });
    };

    // --- Styles ---
    const styles = {
        container: {
            display: 'flex',
            height: '100vh',
            width: '100vw',
            backgroundColor: theme.bg,
            color: theme.text,
            overflow: 'hidden',
            transition: 'all 0.3s ease'
        },
        mainWrapper: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            height: '100vh',
            position: 'relative'
        },
        scrollContent: {
            flexGrow: 1,
            overflowY: 'auto',
            padding: '30px',
            paddingBottom: '100px'
        },
        footerFixed: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.card,
            borderTop: `1px solid ${theme.border}`,
            zIndex: 10
        },
        card: {
            backgroundColor: theme.card,
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        },
        // IMPORTANT: Override for Table Cells in Night Mode
        tableCell: {
            backgroundColor: 'transparent', 
            color: theme.text,
            borderColor: theme.border
        },
        modalOverlay: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: showModal ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(5px)'
        }
    };

    return (
        <div style={styles.container}>
            <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="gallery" />

            <div style={styles.mainWrapper}>
                <Header 
                    theme={theme} isDarkMode={isDarkMode}
                    toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
                    toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
                />

                <div style={styles.scrollContent}>
                    <div className="container-fluid">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="fw-bold m-0" style={{ color: theme.text }}>Gallery Assets</h3>
                            <button 
                                className="btn text-white px-4 py-2 fw-semibold shadow-sm" 
                                style={{ background: theme.primary, borderRadius: '8px', border: 'none' }}
                                onClick={() => setShowModal(true)}
                            >
                                <i className="bi bi-plus-lg me-2"></i> Add New Image
                            </button>
                        </div>

                        <div style={styles.card} className="overflow-hidden">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0" style={{ color: theme.text }}>
                                    <thead>
                                        <tr style={{ backgroundColor: theme.tableHeader }}>
                                            <th className="ps-4 py-3 border-0" style={{ color: theme.text }}>Preview</th>
                                            <th className="border-0" style={{ color: theme.text }}>Title</th>
                                            <th className="border-0" style={{ color: theme.text }}>Created At</th>
                                            <th className="text-center border-0" style={{ color: theme.text }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ borderTop: 'none' }}>
                                        {loading ? (
                                            <tr><td colSpan="4" className="text-center py-5" style={styles.tableCell}>Loading...</td></tr>
                                        ) : currentItems.length > 0 ? (
                                            currentItems.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="ps-4" style={styles.tableCell}>
                                                        <img 
                                                            src={item.image_url} 
                                                            alt="" 
                                                            style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} 
                                                        />
                                                    </td>
                                                    <td className="fw-medium" style={styles.tableCell}>{item.title}</td>
                                                    <td className="text-muted small" style={styles.tableCell}>{new Date(item.created_at).toLocaleDateString()}</td>
                                                    <td className="text-center" style={styles.tableCell}>
                                                        <button className="btn btn-sm btn-outline-primary me-2 border-0" onClick={() => openEditModal(item)}>
                                                            <i className="bi bi-pencil-square"></i>
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-danger border-0" onClick={() => handleDelete(item.id)}>
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="4" className="text-center py-5" style={styles.tableCell}>No data found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* --- Pagination UI --- */}
                            <div className="d-flex justify-content-between align-items-center p-3" style={{ borderTop: `1px solid ${theme.border}`, backgroundColor: theme.card }}>
                                <span className="small opacity-75">
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, galleryItems.length)} of {galleryItems.length}
                                </span>
                                <nav>
                                    <ul className="pagination pagination-sm m-0 gap-1">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link border-0 rounded-circle" onClick={() => setCurrentPage(p => p - 1)} style={{ background: theme.bg, color: theme.text }}>
                                                <i className="bi bi-chevron-left"></i>
                                            </button>
                                        </li>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <li key={i} className="page-item">
                                                <button 
                                                    className="page-link border-0 rounded-circle mx-1" 
                                                    onClick={() => setCurrentPage(i + 1)}
                                                    style={{ 
                                                        background: currentPage === i + 1 ? theme.primary : theme.bg,
                                                        color: currentPage === i + 1 ? '#fff' : theme.text,
                                                        width: '32px', height: '32px'
                                                    }}
                                                >
                                                    {i + 1}
                                                </button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button className="page-link border-0 rounded-circle" onClick={() => setCurrentPage(p => p + 1)} style={{ background: theme.bg, color: theme.text }}>
                                                <i className="bi bi-chevron-right"></i>
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.footerFixed}><Footer theme={theme} /></div>
            </div>

            {/* Modal */}
            <div style={styles.modalOverlay} onClick={closeModal}>
                <div 
                    className="p-4" 
                    style={{ ...styles.card, width: '450px', color: theme.text }} 
                    onClick={e => e.stopPropagation()}
                >
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="fw-bold m-0">{editingItem ? 'Update Image' : 'Upload Image'}</h5>
                        <button className={`btn-close ${isDarkMode ? 'btn-close-white' : ''}`} onClick={closeModal}></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label small fw-bold">Title</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                style={{ backgroundColor: theme.bg, color: theme.text, borderColor: theme.border }}
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-bold">Image File</label>
                            <input 
                                type="file" 
                                className="form-control" 
                                style={{ backgroundColor: theme.bg, color: theme.text, borderColor: theme.border }}
                                onChange={handleImageChange}
                            />
                        </div>
                        {formData.imagePreview && (
                            <img src={formData.imagePreview} className="rounded w-100 mb-3 shadow-sm" style={{ height: '150px', objectFit: 'cover' }} alt="preview" />
                        )}
                        <div className="d-flex gap-2">
                            <button type="button" className="btn btn-secondary w-100" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn text-white w-100" style={{ background: theme.primary }}>
                                {editingItem ? 'Update' : 'Upload'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GallerySection;