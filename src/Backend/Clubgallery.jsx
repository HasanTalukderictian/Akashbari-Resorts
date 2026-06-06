import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { FaUpload, FaEdit, FaTrash, FaImage, FaSpinner, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Clubgallery = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [title, setTitle] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [imageErrors, setImageErrors] = useState({});
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    // Environment variables
    const API_BASE_URL = import.meta.env.VITE_BASE_URL;
    const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL;
    const BASE_URL = API_URL.replace('/api', '');

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2',
        sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b',
        accent: '#5e72e4'
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    // Function to get correct image URL - FIXED
    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/300x250?text=No+Image';
        
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        // Remove leading slashes
        let cleanPath = imagePath.replace(/^\/+/, '');
        
        // If path already contains storage, don't add it again
        if (cleanPath.startsWith('storage/')) {
            return `${BASE_URL}/${cleanPath}`;
        }
        
        // Return with storage prefix
        return `${BASE_URL}/storage/${cleanPath}`;
    };

    // Fetch gallery images with pagination - FIXED
    const fetchGalleryImages = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/club-gallery?page=${page}`);
            const result = await response.json();
            
            console.log('API Response:', result);
            
            if (result.success && result.data) {
                const images = result.data.data || [];
                console.log('Images:', images);
                setGalleryImages(images);
                
                setCurrentPage(result.data.current_page || 1);
                setLastPage(result.data.last_page || 1);
                setTotal(result.data.total || 0);
            } else {
                setGalleryImages([]);
            }
        } catch (error) {
            console.error('Error fetching gallery:', error);
            setGalleryImages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGalleryImages(currentPage);
    }, [currentPage]);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }
            
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddClick = () => {
        setIsEdit(false);
        setTitle('');
        setImageFile(null);
        setPreviewUrl(null);
        setEditId(null);
        setShowModal(true);
    };

    const handleEditClick = (image) => {
        setIsEdit(true);
        setTitle(image.title || '');
        setEditId(image.id);
        setPreviewUrl(getImageUrl(image.image));
        setImageFile(null);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this image?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/del-club-gallery/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (result.success) {
                alert('Image deleted successfully!');
                fetchGalleryImages(currentPage);
            } else {
                alert(result.message || 'Delete failed');
            }
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Delete failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isEdit && !imageFile) {
            alert('Please select an image');
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('title', title);
        
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            let url = `${API_BASE_URL}/add-club-gallery`;
            let method = 'POST';
            
            if (isEdit && editId) {
                url = `${API_BASE_URL}/edit-club-gallery/${editId}`;
                method = 'POST';
                formData.append('_method', 'PUT');
            }
            
            const response = await fetch(url, {
                method: method,
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                alert(isEdit ? 'Image updated successfully!' : 'Image uploaded successfully!');
                setShowModal(false);
                setTitle('');
                setImageFile(null);
                setPreviewUrl(null);
                fetchGalleryImages(currentPage);
            } else {
                alert(result.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Server error');
        } finally {
            setUploading(false);
        }
    };

    const handleImageError = (imageId) => {
        setImageErrors(prev => ({ ...prev, [imageId]: true }));
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= lastPage) {
            setCurrentPage(page);
        }
    };

    const styles = {
        container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
        mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
        contentScroll: { flex: '1 0 auto', padding: '24px' },
        footerWrapper: { flexShrink: 0 },
        card: {
            backgroundColor: theme.card,
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
        },
        uploadBtn: {
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            padding: '12px 28px',
            borderRadius: '8px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
        }
    };

    return (
        <div style={styles.container} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="gallery" />

                <div style={styles.mainArea} className="flex-grow-1">
                    <Header 
                        theme={theme} 
                        isDarkMode={isDarkMode} 
                        toggleDarkMode={toggleDarkMode} 
                        toggleSidebar={toggleSidebar} 
                    />

                    <div style={styles.contentContainer}>
                        <div style={styles.contentScroll}>
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                                <div>
                                    <h3 style={{ color: theme.text, fontWeight: '700', margin: 0 }}>Club Gallery</h3>
                                    <p style={{ color: theme.text, opacity: 0.7, marginTop: '5px' }}>
                                        Manage your club's image gallery • Total: {total} images
                                    </p>
                                </div>
                                <button 
                                    onClick={handleAddClick}
                                    style={styles.uploadBtn}
                                    className="btn"
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
                                >
                                    <FaPlus /> Upload New Image
                                </button>
                            </div>

                            {loading ? (
                                <div className="text-center py-5">
                                    <FaSpinner className="spinner-border text-primary" size={40} style={{ animation: 'spin 1s linear infinite' }} />
                                    <p className="mt-3" style={{ color: theme.text }}>Loading gallery...</p>
                                </div>
                            ) : galleryImages.length === 0 ? (
                                <div style={styles.card} className="text-center py-5">
                                    <FaImage size={60} style={{ color: theme.border, marginBottom: '20px' }} />
                                    <h5 style={{ color: theme.text }}>No images in gallery</h5>
                                    <p style={{ color: theme.text, opacity: 0.7 }}>Click the "Upload New Image" button to add images</p>
                                </div>
                            ) : (
                                <>
                                    <div className="row g-4">
                                        {galleryImages.map((image) => {
                                            const imageUrl = getImageUrl(image.image);
                                            console.log(`Loading image ${image.id}:`, imageUrl);
                                            
                                            return (
                                                <div key={image.id} className="col-md-6 col-lg-4 col-xl-3">
                                                    <div style={styles.card} className="shadow-sm">
                                                        <div className="position-relative">
                                                            {!imageErrors[image.id] ? (
                                                                <img 
                                                                    src={imageUrl}
                                                                    alt={image.title || 'Gallery Image'}
                                                                    className="w-100"
                                                                    style={{ 
                                                                        height: '250px', 
                                                                        objectFit: 'cover',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                    onClick={() => window.open(imageUrl, '_blank')}
                                                                    onError={() => handleImageError(image.id)}
                                                                />
                                                            ) : (
                                                                <div style={{ 
                                                                    height: '250px', 
                                                                    backgroundColor: '#f0f0f0',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    flexDirection: 'column'
                                                                }}>
                                                                    <FaImage size={50} color="#ccc" />
                                                                    <p style={{ color: '#999', marginTop: '10px' }}>Image not found</p>
                                                                    <small style={{ color: '#999', fontSize: '11px' }}>{image.image}</small>
                                                                </div>
                                                            )}
                                                            <div className="position-absolute top-0 end-0 p-2" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                                                                <button
                                                                    className="btn btn-sm btn-link text-white me-2"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleEditClick(image);
                                                                    }}
                                                                >
                                                                    <FaEdit />
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-link text-danger"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDelete(image.id);
                                                                    }}
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="p-3">
                                                            <h6 style={{ 
                                                                color: theme.text, 
                                                                fontWeight: '600', 
                                                                marginBottom: '8px'
                                                            }}>
                                                                {image.title || 'Untitled'}
                                                            </h6>
                                                            <small style={{ color: theme.text, opacity: 0.5 }}>
                                                                {new Date(image.created_at).toLocaleDateString()}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {lastPage > 1 && (
                                        <div className="d-flex justify-content-center align-items-center mt-5">
                                            <nav>
                                                <ul className="pagination">
                                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                        <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
                                                            <FaArrowLeft size={12} /> Previous
                                                        </button>
                                                    </li>
                                                    
                                                    {[...Array(lastPage)].map((_, i) => {
                                                        const pageNum = i + 1;
                                                        if (pageNum === 1 || pageNum === lastPage || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                                                            return (
                                                                <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                                                                    <button className="page-link" onClick={() => goToPage(pageNum)}>
                                                                        {pageNum}
                                                                    </button>
                                                                </li>
                                                            );
                                                        }
                                                        if (pageNum === 2 && currentPage > 3) {
                                                            return <li key="ellipsis1" className="page-item disabled"><span className="page-link">...</span></li>;
                                                        }
                                                        if (pageNum === lastPage - 1 && currentPage < lastPage - 2) {
                                                            return <li key="ellipsis2" className="page-item disabled"><span className="page-link">...</span></li>;
                                                        }
                                                        return null;
                                                    })}
                                                    
                                                    <li className={`page-item ${currentPage === lastPage ? 'disabled' : ''}`}>
                                                        <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
                                                            Next <FaArrowRight size={12} />
                                                        </button>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div style={styles.footerWrapper}>
                            <Footer theme={theme} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Add/Edit */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content" style={{ backgroundColor: theme.card, borderRadius: '12px' }}>
                            <div className="modal-header" style={{ borderBottom: `1px solid ${theme.border}` }}>
                                <h5 className="modal-title" style={{ color: theme.text, fontWeight: '600' }}>
                                    {isEdit ? 'Edit Image' : 'Upload New Image'}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label" style={{ color: theme.text, fontWeight: '500' }}>
                                            Title <span className="text-muted">(Optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Enter image title"
                                            style={{
                                                backgroundColor: isDarkMode ? '#1f293d' : '#fff',
                                                color: theme.text,
                                                borderColor: theme.border
                                            }}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" style={{ color: theme.text, fontWeight: '500' }}>
                                            Image {!isEdit && <span className="text-danger">*</span>}
                                            {isEdit && <span className="text-muted"> (Leave empty to keep current image)</span>}
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            required={!isEdit}
                                            style={{
                                                backgroundColor: isDarkMode ? '#1f293d' : '#fff',
                                                color: theme.text,
                                                borderColor: theme.border
                                            }}
                                        />
                                    </div>

                                    {previewUrl && (
                                        <div className="mt-3">
                                            <label className="form-label" style={{ color: theme.text, fontWeight: '500' }}>Preview</label>
                                            <div className="mt-2">
                                                <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="modal-footer" style={{ borderTop: `1px solid ${theme.border}` }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary" 
                                        disabled={uploading}
                                        style={{ backgroundColor: '#28a745', border: 'none' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
                                    >
                                        {uploading ? (<> <FaSpinner className="spinner-border-sm me-2" /> {isEdit ? 'Updating...' : 'Uploading...'} </>) : (<> <FaUpload className="me-2" /> {isEdit ? 'Update Image' : 'Upload Image'} </>)}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <style jsx="true">{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .spinner-border {
                    animation: spin 1s linear infinite;
                }
                
                .modal.show {
                    display: block;
                }
                
                .page-link {
                    cursor: pointer;
                }
                
                .page-item.disabled .page-link {
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default Clubgallery;