import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Affilitaes = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [affiliates, setAffiliates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        image: null,
        imagePreview: null,
        title: '',
        description: '',
        website: ''
    });
    const [errors, setErrors] = useState({});
    const [editingId, setEditingId] = useState(null);

    // API Configuration
    const API_BASE_URL = 'http://localhost:8000/api';
    const API_URL = 'http://localhost:8000';

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2',
        sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b'
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    // Helper function to get full image URL
    const getFullImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/50?text=No+Image';
        if (imagePath.startsWith('http')) return imagePath;
        // Remove leading slash if exists and prepend API_URL
        const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `${API_URL}${cleanPath}`;
    };

    // Fetch affiliates from API
    const fetchAffiliates = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/affiliates`);
            console.log('API Response:', response.data);
            if (response.data.success) {
                // Transform the data to include full image URLs
                const transformedData = response.data.data.map(affiliate => ({
                    ...affiliate,
                    image_url: getFullImageUrl(affiliate.image)
                }));
                setAffiliates(transformedData);
            }
        } catch (error) {
            console.error('Error fetching affiliates:', error);
            if (error.response?.status === 500) {
                setErrors({ api: 'Server error. Please try again later.' });
            } else {
                setErrors({ api: 'Failed to load affiliates. Please check your connection.' });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAffiliates();
    }, []);

    // Handle image upload and preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                setErrors({ ...errors, image: 'Image size must be less than 2MB' });
                return;
            }
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                setErrors({ ...errors, image: 'Only JPEG, PNG, JPG, GIF images are allowed' });
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    image: file,
                    imagePreview: reader.result
                });
                if (errors.image) {
                    const newErrors = { ...errors };
                    delete newErrors.image;
                    setErrors(newErrors);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Clear error for this field
        if (errors[name]) {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.website.trim()) newErrors.website = 'Website URL is required';
        if (formData.website.trim() && !formData.website.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)) {
            newErrors.website = 'Please enter a valid website URL';
        }
        if (!editingId && !formData.image && !formData.imagePreview) {
            newErrors.image = 'Image is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Create form data for API
    const createFormData = () => {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('website', formData.website);
        if (formData.image && formData.image instanceof File) {
            data.append('image', formData.image);
        }
        return data;
    };

    // Handle form submit (Create/Update)
    const handleSubmit = async () => {
        if (!validateForm()) return;
        
        setSubmitting(true);
        
        try {
            const formDataToSend = createFormData();
            
            if (editingId) {
                // Update existing affiliate
                const response = await axios.post(
                    `${API_BASE_URL}/affiliates/${editingId}?_method=PUT`,
                    formDataToSend,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    }
                );
                if (response.data.success) {
                    await fetchAffiliates();
                    resetForm();
                    setShowModal(false);
                }
            } else {
                // Create new affiliate
                const response = await axios.post(
                    `${API_BASE_URL}/affiliates`,
                    formDataToSend,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    }
                );
                if (response.data.success) {
                    await fetchAffiliates();
                    resetForm();
                    setShowModal(false);
                }
            }
        } catch (error) {
            console.error('Error saving affiliate:', error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setErrors({ api: error.response.data.message });
            } else {
                setErrors({ api: 'Failed to save affiliate. Please try again.' });
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Handle edit
    const handleEdit = (affiliate) => {
        setEditingId(affiliate.id);
        setFormData({
            image: null,
            imagePreview: affiliate.image_url || getFullImageUrl(affiliate.image),
            title: affiliate.title,
            description: affiliate.description,
            website: affiliate.website
        });
        setShowModal(true);
    };

    // Handle delete
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this affiliate?')) {
            try {
                const response = await axios.delete(`${API_BASE_URL}/affiliates/${id}`);
                if (response.data.success) {
                    await fetchAffiliates();
                }
            } catch (error) {
                console.error('Error deleting affiliate:', error);
                alert('Failed to delete affiliate. Please try again.');
            }
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            image: null,
            imagePreview: null,
            title: '',
            description: '',
            website: ''
        });
        setErrors({});
        setEditingId(null);
    };

    // Handle modal close
    const handleCloseModal = () => {
        resetForm();
        setShowModal(false);
    };

    const styles = {
        container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
        mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
        contentScroll: { flex: '1 0 auto', padding: '24px' },
        footerWrapper: { flexShrink: 0 },
        headerSection: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '15px'
        },
        pageTitle: {
            color: theme.text,
            fontSize: '24px',
            fontWeight: '600',
            margin: 0
        },
        addButton: {
            backgroundColor: '#ff8c32',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        tableWrapper: {
            backgroundColor: theme.card,
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            border: `1px solid ${theme.border}`
        },
        table: {
            width: '100%',
            marginBottom: 0,
            color: theme.text
        },
        tableHeader: {
            backgroundColor: theme.isDarkMode ? '#0f3460' : '#f8f9fa',
            borderBottom: `2px solid ${theme.border}`
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
            animation: 'fadeIn 0.3s ease'
        },
        modalContainer: {
            backgroundColor: theme.card,
            borderRadius: '16px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            animation: 'slideIn 0.3s ease',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        },
        modalHeader: {
            padding: '20px 24px',
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        modalTitle: {
            color: theme.text,
            fontSize: '20px',
            fontWeight: '600',
            margin: 0
        },
        closeButton: {
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: theme.text,
            opacity: 0.7,
            transition: 'opacity 0.3s ease'
        },
        modalBody: {
            padding: '24px'
        },
        modalFooter: {
            padding: '16px 24px',
            borderTop: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
        },
        formGroup: {
            marginBottom: '20px'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            color: theme.text,
            fontWeight: '500',
            fontSize: '14px'
        },
        requiredStar: {
            color: '#ff8c32',
            marginLeft: '4px'
        },
        input: {
            width: '100%',
            padding: '10px 12px',
            border: `1px solid ${theme.border}`,
            borderRadius: '8px',
            backgroundColor: theme.card,
            color: theme.text,
            fontSize: '14px',
            transition: 'all 0.3s ease'
        },
        textarea: {
            width: '100%',
            padding: '10px 12px',
            border: `1px solid ${theme.border}`,
            borderRadius: '8px',
            backgroundColor: theme.card,
            color: theme.text,
            fontSize: '14px',
            minHeight: '100px',
            resize: 'vertical'
        },
        errorText: {
            color: '#dc3545',
            fontSize: '12px',
            marginTop: '5px'
        },
        imageUploadArea: {
            border: `2px dashed ${theme.border}`,
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backgroundColor: theme.isDarkMode ? '#1a1a2e' : '#f8f9fa'
        },
        imagePreview: {
            width: '100%',
            maxHeight: '150px',
            objectFit: 'contain',
            marginBottom: '10px',
            borderRadius: '8px'
        },
        uploadIcon: {
            fontSize: '40px',
            color: '#ff8c32',
            marginBottom: '10px'
        },
        uploadText: {
            color: theme.text,
            fontSize: '14px'
        },
        uploadSubtext: {
            color: '#6c757d',
            fontSize: '12px',
            marginTop: '5px'
        },
        actionButtons: {
            display: 'flex',
            gap: '8px'
        },
        editBtn: {
            backgroundColor: '#28a745',
            border: 'none',
            padding: '5px 12px',
            borderRadius: '6px',
            color: 'white',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        deleteBtn: {
            backgroundColor: '#dc3545',
            border: 'none',
            padding: '5px 12px',
            borderRadius: '6px',
            color: 'white',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        statusBadge: {
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500',
            display: 'inline-block'
        },
        websiteLink: {
            color: '#ff8c32',
            textDecoration: 'none',
            fontSize: '12px'
        },
        loadingSpinner: {
            textAlign: 'center',
            padding: '40px',
            color: theme.text
        }
    };

    if (loading) {
        return (
            <div style={styles.container} className="container-fluid p-0">
                <div className="d-flex">
                    <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="users" />
                    <div style={styles.mainArea} className="flex-grow-1">
                        <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />
                        <div style={styles.loadingSpinner}>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3">Loading affiliates...</p>
                        </div>
                        <Footer theme={theme} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="users" />

                <div style={styles.mainArea} className="flex-grow-1">
                    <Header 
                        theme={theme} 
                        isDarkMode={isDarkMode} 
                        toggleDarkMode={toggleDarkMode} 
                        toggleSidebar={toggleSidebar} 
                    />

                    <div style={styles.contentContainer}>
                        <div style={styles.contentScroll}>
                            {/* Header with Add Button */}
                            <div style={styles.headerSection}>
                                <h2 style={styles.pageTitle}>Affiliate Partners</h2>
                                <button 
                                    style={styles.addButton}
                                    onClick={() => setShowModal(true)}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e67e22'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff8c32'}
                                >
                                    <i className="bi bi-plus-lg"></i>
                                    Add New Affiliate
                                </button>
                            </div>

                            {/* Error Alert */}
                            {errors.api && (
                                <div className="alert alert-danger mb-3" role="alert">
                                    {errors.api}
                                </div>
                            )}

                            {/* Table */}
                            <div style={styles.tableWrapper}>
                                <table className="table" style={styles.table}>
                                    <thead style={styles.tableHeader}>
                                        <tr>
                                            <th style={{ padding: '12px' }}>Image</th>
                                            <th style={{ padding: '12px' }}>Title</th>
                                            <th style={{ padding: '12px' }}>Description</th>
                                            <th style={{ padding: '12px' }}>Website</th>
                                            <th style={{ padding: '12px' }}>Status</th>
                                            <th style={{ padding: '12px' }}>Created At</th>
                                            <th style={{ padding: '12px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {affiliates.map((affiliate) => (
                                            <tr key={affiliate.id}>
                                                <td style={{ padding: '12px' }}>
                                                    <img 
                                                        src={affiliate.image_url || getFullImageUrl(affiliate.image)}
                                                        alt={affiliate.title}
                                                        style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://via.placeholder.com/50?text=No+Image';
                                                        }}
                                                    />
                                                </td>
                                                <td style={{ padding: '12px', fontWeight: '500' }}>{affiliate.title}</td>
                                                <td style={{ padding: '12px' }}>
                                                    {affiliate.description && affiliate.description.length > 60 
                                                        ? `${affiliate.description.substring(0, 60)}...` 
                                                        : affiliate.description}
                                                </td>
                                                <td style={{ padding: '12px' }}>
                                                    <a href={affiliate.website} target="_blank" rel="noopener noreferrer" style={styles.websiteLink}>
                                                        {affiliate.website && affiliate.website.length > 30 
                                                            ? affiliate.website.substring(0, 30) + '...' 
                                                            : affiliate.website}
                                                    </a>
                                                </td>
                                                <td style={{ padding: '12px' }}>
                                                    <span style={{
                                                        ...styles.statusBadge,
                                                        backgroundColor: affiliate.status === 'active' ? '#d4edda' : '#f8d7da',
                                                        color: affiliate.status === 'active' ? '#155724' : '#721c24'
                                                    }}>
                                                        {affiliate.status === 'active' ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px' }}>{affiliate.created_at}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <div style={styles.actionButtons}>
                                                        <button 
                                                            style={styles.editBtn}
                                                            onClick={() => handleEdit(affiliate)}
                                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
                                                        >
                                                            <i className="bi bi-pencil"></i> Edit
                                                        </button>
                                                        <button 
                                                            style={styles.deleteBtn}
                                                            onClick={() => handleDelete(affiliate.id)}
                                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
                                                        >
                                                            <i className="bi bi-trash"></i> Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {affiliates.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '40px', color: theme.text }}>
                                        <i className="bi bi-inbox" style={{ fontSize: '48px' }}></i>
                                        <p style={{ marginTop: '10px' }}>No affiliates found. Click "Add New Affiliate" to create one.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={styles.footerWrapper}>
                            <Footer theme={theme} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={handleCloseModal}>
                    <div style={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>
                                {editingId ? 'Edit Affiliate' : 'Add New Affiliate'}
                            </h3>
                            <button style={styles.closeButton} onClick={handleCloseModal}>
                                <i className="bi bi-x"></i>
                            </button>
                        </div>
                        
                        <div style={styles.modalBody}>
                            {/* Image Upload */}
                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Affiliate Logo/Image <span style={styles.requiredStar}>*</span>
                                </label>
                                <div 
                                    style={styles.imageUploadArea}
                                    onClick={() => document.getElementById('imageUpload').click()}
                                >
                                    {formData.imagePreview ? (
                                        <img src={formData.imagePreview} alt="Preview" style={styles.imagePreview} />
                                    ) : (
                                        <>
                                            <div style={styles.uploadIcon}>
                                                <i className="bi bi-cloud-upload"></i>
                                            </div>
                                            <div style={styles.uploadText}>Click to upload image</div>
                                            <div style={styles.uploadSubtext}>PNG, JPG, GIF up to 2MB</div>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        id="imageUpload"
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                {errors.image && <div style={styles.errorText}>{errors.image}</div>}
                            </div>

                            {/* Title */}
                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Title <span style={styles.requiredStar}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter affiliate title"
                                    style={styles.input}
                                />
                                {errors.title && <div style={styles.errorText}>{errors.title}</div>}
                            </div>

                            {/* Description */}
                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Description <span style={styles.requiredStar}>*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter description"
                                    style={styles.textarea}
                                />
                                {errors.description && <div style={styles.errorText}>{errors.description}</div>}
                            </div>

                            {/* Website URL */}
                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Website URL <span style={styles.requiredStar}>*</span>
                                </label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com"
                                    style={styles.input}
                                />
                                {errors.website && <div style={styles.errorText}>{errors.website}</div>}
                            </div>
                        </div>

                        <div style={styles.modalFooter}>
                            <button 
                                className="btn btn-secondary"
                                onClick={handleCloseModal}
                                style={{ padding: '8px 20px' }}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                style={{ backgroundColor: '#ff8c32', border: 'none', padding: '8px 24px' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e67e22'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff8c32'}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        {editingId ? 'Updating...' : 'Saving...'}
                                    </>
                                ) : (
                                    editingId ? 'Update Affiliate' : 'Save Affiliate'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add animation styles */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateY(-50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                input:focus, textarea:focus {
                    outline: none;
                    border-color: #ff8c32 !important;
                    box-shadow: 0 0 0 2px rgba(255, 140, 50, 0.1);
                }
                
                .table-responsive {
                    overflow-x: auto;
                }
                
                @media (max-width: 768px) {
                    .table {
                        font-size: 12px;
                    }
                    
                    td, th {
                        padding: 8px !important;
                    }
                }
                
                button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default Affilitaes;