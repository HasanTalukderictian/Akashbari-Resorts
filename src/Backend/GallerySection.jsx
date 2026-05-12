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

    // --- Dynamic Theme ---
    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#121212' : '#f4f7fa',
        card: isDarkMode ? '#1e1e1e' : '#ffffff',
        text: isDarkMode ? '#e0e0e0' : '#333333',
        border: isDarkMode ? '#333333' : '#e0e0e0',
        primary: '#9a55ff'
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
                // Laravel-e file update korle POST method best with _method hack ba direct route
                await axios.post(`${API_BASE_URL}/${editingItem.id}`, data);
            } else {
                await axios.post(API_BASE_URL, data);
            }
            fetchGallery();
            closeModal();
        } catch (err) {
            alert("Error saving data. Check console.");
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

    // --- Styles (CSS-in-JS) ---
    const styles = {
        container: {
            display: 'flex',
            height: '100vh',
            width: '100vw',
            backgroundColor: theme.bg,
            color: theme.text,
            overflow: 'hidden'
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
            paddingBottom: '80px' // Space for fixed footer
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
        modalOverlay: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: showModal ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(5px)'
        },
        card: {
            backgroundColor: theme.card,
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }
    };

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="gallery" />

            {/* Main Section */}
            <div style={styles.mainWrapper}>
                <Header 
                    theme={theme} 
                    toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
                    toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
                />

                {/* Scrollable Content Area */}
                <div style={styles.scrollContent}>
                    <div className="container-fluid">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="fw-bold m-0">Gallery Assets</h3>
                            <button 
                                className="btn text-white px-4 py-2 fw-semibold" 
                                style={{ background: theme.primary, borderRadius: '8px' }}
                                onClick={() => setShowModal(true)}
                            >
                                <i className="bi bi-plus-lg me-2"></i> Add New Image
                            </button>
                        </div>

                        {/* Data Table */}
                        <div style={styles.card} className="overflow-hidden">
                            <table className="table table-hover align-middle mb-0" style={{ color: theme.text }}>
                                <thead style={{ backgroundColor: isDarkMode ? '#252525' : '#f8f9fa' }}>
                                    <tr>
                                        <th className="ps-4 py-3">Preview</th>
                                        <th>Title</th>
                                        <th>Created At</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="4" className="text-center py-5">Loading gallery...</td></tr>
                                    ) : galleryItems.length > 0 ? (
                                        galleryItems.map((item) => (
                                            <tr key={item.id} style={{ borderColor: theme.border }}>
                                                <td className="ps-4">
                                                    <img 
                                                        src={item.image_url} 
                                                        alt={item.title} 
                                                        style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} 
                                                    />
                                                </td>
                                                <td className="fw-medium">{item.title}</td>
                                                <td className="text-muted small">
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="text-center">
                                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(item)}>
                                                        <i className="bi bi-pencil"></i> Edit
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)}>
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="text-center py-5 text-muted">No images found in gallery.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Fixed Footer */}
                <div style={styles.footerFixed}>
                    <Footer theme={theme} />
                </div>
            </div>

            {/* Modern Modal */}
            <div style={styles.modalOverlay} onClick={closeModal}>
                <div 
                    className="p-4" 
                    style={{ ...styles.card, width: '450px' }} 
                    onClick={e => e.stopPropagation()}
                >
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="fw-bold m-0">{editingItem ? 'Update Image' : 'Upload to Gallery'}</h5>
                        <button className="btn-close" onClick={closeModal}></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label small fw-bold">Image Title</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="e.g. Summer Beach View"
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label small fw-bold">File Upload</label>
                            <input 
                                type="file" 
                                className="form-control" 
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                        </div>

                        {formData.imagePreview && (
                            <div className="mb-4">
                                <label className="form-label small fw-bold d-block">Preview</label>
                                <img 
                                    src={formData.imagePreview} 
                                    className="rounded w-100 shadow-sm" 
                                    style={{ height: '180px', objectFit: 'cover' }} 
                                    alt="preview" 
                                />
                            </div>
                        )}

                        <div className="d-flex gap-2">
                            <button type="button" className="btn btn-light w-100" onClick={closeModal}>Cancel</button>
                            <button 
                                type="submit" 
                                className="btn text-white w-100" 
                                style={{ background: theme.primary }}
                            >
                                {editingItem ? 'Save Changes' : 'Upload Now'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GallerySection;