import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaUpload, FaTimes } from 'react-icons/fa';

const Achievement = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2',
        sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b'
    };

    // Environment variables - FIXED
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL;
    
    // Storage URL - FIXED (removed localhost)
    const STORAGE_URL = API_URL.replace('/api', '');

    // Function to get image URL - FIXED
    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/300x200?text=No+Image';
        if (imagePath.startsWith('http')) return imagePath;
        
        // Remove backslashes and clean the path
        let cleanPath = imagePath.replace(/\\/g, '/');
        cleanPath = cleanPath.replace(/^\/+/, '');
        
        // Return the full URL with storage
        return `${STORAGE_URL}/storage/${cleanPath}`;
    };

    // Configure axios defaults
    axios.defaults.withCredentials = false;
    axios.defaults.headers.common['Accept'] = 'application/json';
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    // Fetch all achievements
    const fetchAchievements = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/get-achievement`, {
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            console.log('Fetch response:', response.data);
            
            if (response.data.status === true) {
                setAchievements(response.data.data || []);
            } else {
                setAchievements([]);
            }
        } catch (error) {
            console.error('Error fetching achievements:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                Swal.fire('Error!', `Failed to fetch achievements: ${error.response.data.message || 'Server error'}`, 'error');
            } else {
                Swal.fire('Error!', 'Failed to fetch achievements. Please check if backend is running.', 'error');
            }
            setAchievements([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAchievements();
    }, []);

    // Handle form input change
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                Swal.fire('Error!', 'Only JPG, JPEG, PNG, and GIF files are allowed', 'error');
                return;
            }
            
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                Swal.fire('Error!', 'File size should be less than 2MB', 'error');
                return;
            }
            
            setFormData({
                ...formData,
                image: file
            });
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            image: null
        });
        setImagePreview(null);
        setIsEditing(false);
        setCurrentId(null);
    };

    // Open modal for add
    const handleAddClick = () => {
        resetForm();
        setShowModal(true);
        setIsEditing(false);
    };

    // Open modal for edit
    const handleEditClick = (achievement) => {
        setIsEditing(true);
        setCurrentId(achievement.id);
        setFormData({
            name: achievement.name,
            image: null
        });
        // Set image preview from existing image
        const imageUrl = getImageUrl(achievement.image);
        setImagePreview(imageUrl);
        setShowModal(true);
    };

    // Submit form (Add/Edit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name) {
            Swal.fire('Warning!', 'Please enter name', 'warning');
            return;
        }

        // For add, image is required
        if (!isEditing && !formData.image) {
            Swal.fire('Warning!', 'Please select an image', 'warning');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        setLoading(true);

        try {
            let response;
            const config = {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            };
            
            if (isEditing) {
                response = await axios.post(`${BASE_URL}/edit-achievement/${currentId}`, formDataToSend, config);
            } else {
                response = await axios.post(`${BASE_URL}/add-achievement`, formDataToSend, config);
            }

            console.log('Submit response:', response.data);

            if (response.data.status === true) {
                Swal.fire('Success!', response.data.message || (isEditing ? 'Achievement updated successfully' : 'Achievement added successfully'), 'success');
                resetForm();
                setShowModal(false);
                fetchAchievements(); // Refresh the list
            } else {
                Swal.fire('Error!', response.data.message || 'Something went wrong', 'error');
            }
        } catch (error) {
            console.error('Error saving achievement:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                const errorMessage = error.response.data.message || 'Failed to save achievement';
                Swal.fire('Error!', errorMessage, 'error');
            } else {
                Swal.fire('Error!', 'Network error. Please check your connection.', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    // Delete achievement
    const handleDeleteClick = (id, name) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete "${name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const response = await axios.delete(`${BASE_URL}/del-achievement/${id}`, {
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    
                    console.log('Delete response:', response.data);
                    
                    if (response.data.status === true) {
                        Swal.fire('Deleted!', response.data.message || 'Achievement deleted successfully', 'success');
                        fetchAchievements();
                    } else {
                        Swal.fire('Error!', response.data.message || 'Failed to delete', 'error');
                    }
                } catch (error) {
                    console.error('Error deleting achievement:', error);
                    if (error.response) {
                        Swal.fire('Error!', error.response.data.message || 'Failed to delete achievement', 'error');
                    } else {
                        Swal.fire('Error!', 'Network error. Please check your connection.', 'error');
                    }
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const styles = {
        container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
        mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
        contentScroll: { flex: '1 0 auto', padding: '24px' },
        footerWrapper: { flexShrink: 0 },
        card: {
            backgroundColor: theme.card,
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        },
        imageGallery: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px',
            marginTop: '20px'
        },
        imageCard: {
            backgroundColor: theme.card,
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
        },
        imageWrapper: {
            width: '100%',
            height: '200px',
            overflow: 'hidden',
            position: 'relative'
        },
        image: {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        },
        imageInfo: {
            padding: '15px',
            textAlign: 'center'
        },
        imageName: {
            color: theme.text,
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '10px',
            wordBreak: 'break-word'
        },
        buttonGroup: {
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            marginTop: '10px'
        },
        editBtn: {
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '14px'
        },
        deleteBtn: {
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '14px'
        },
        addBtn: {
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px',
            transition: 'background-color 0.3s'
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        },
        modalContent: {
            backgroundColor: theme.card,
            borderRadius: '10px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
        },
        modalHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: `1px solid ${theme.border}`,
            paddingBottom: '10px'
        },
        modalTitle: {
            color: theme.text,
            fontSize: '24px',
            margin: 0
        },
        closeBtn: {
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: theme.text,
            transition: 'opacity 0.3s'
        },
        formGroup: {
            marginBottom: '20px'
        },
        label: {
            display: 'block',
            color: theme.text,
            marginBottom: '8px',
            fontWeight: 'bold'
        },
        input: {
            width: '100%',
            padding: '10px',
            border: `1px solid ${theme.border}`,
            borderRadius: '5px',
            backgroundColor: theme.bg,
            color: theme.text,
            outline: 'none',
            transition: 'border-color 0.3s'
        },
        fileInput: {
            width: '100%',
            padding: '10px',
            border: `1px solid ${theme.border}`,
            borderRadius: '5px',
            backgroundColor: theme.bg,
            color: theme.text
        },
        previewImage: {
            width: '100%',
            maxHeight: '200px',
            objectFit: 'cover',
            borderRadius: '5px',
            marginTop: '10px'
        },
        submitBtn: {
            width: '100%',
            padding: '12px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '10px',
            transition: 'background-color 0.3s'
        },
        loadingText: {
            textAlign: 'center',
            color: theme.text,
            padding: '20px'
        },
        emptyText: {
            textAlign: 'center',
            color: theme.text,
            padding: '40px',
            fontSize: '18px'
        }
    };

    return (
        <div style={styles.container} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="achievement" />

                <div style={styles.mainArea} className="flex-grow-1">
                    <Header 
                        theme={theme} 
                        isDarkMode={isDarkMode} 
                        toggleDarkMode={toggleDarkMode} 
                        toggleSidebar={toggleSidebar} 
                    />

                    <div style={styles.contentContainer}>
                        <div style={styles.contentScroll}>
                            {/* Header Section */}
                            <div style={styles.card}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                    <h2 style={{ color: theme.text, margin: 0 }}>Achievement Gallery</h2>
                                    <button onClick={handleAddClick} style={styles.addBtn}>
                                        <FaUpload /> Add New Achievement
                                    </button>
                                </div>
                            </div>

                            {/* Image Gallery */}
                            {loading && !showModal ? (
                                <div style={styles.loadingText}>
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <div>Loading achievements...</div>
                                </div>
                            ) : achievements.length === 0 ? (
                                <div style={styles.emptyText}>
                                    No achievements found. Click "Add New Achievement" to get started.
                                </div>
                            ) : (
                                <div style={styles.imageGallery}>
                                    {achievements.map((item) => (
                                        <div 
                                            key={item.id} 
                                            style={styles.imageCard}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            <div style={styles.imageWrapper}>
                                                <img 
                                                    src={getImageUrl(item.image)} 
                                                    alt={item.name}
                                                    style={styles.image}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                                    }}
                                                />
                                            </div>
                                            <div style={styles.imageInfo}>
                                                <div style={styles.imageName}>{item.name}</div>
                                                <div style={styles.buttonGroup}>
                                                    <button onClick={() => handleEditClick(item)} style={styles.editBtn}>
                                                        <FaEdit /> Edit
                                                    </button>
                                                    <button onClick={() => handleDeleteClick(item.id, item.name)} style={styles.deleteBtn}>
                                                        <FaTrash /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
                <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>{isEditing ? 'Edit Achievement' : 'Add New Achievement'}</h3>
                            <button onClick={() => setShowModal(false)} style={styles.closeBtn}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    placeholder="Enter achievement name"
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Image {!isEditing && '*'}</label>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleImageChange}
                                    accept="image/jpeg,image/jpg,image/png,image/gif"
                                    style={styles.fileInput}
                                />
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" style={styles.previewImage} />
                                )}
                                {isEditing && !imagePreview && formData.image === null && (
                                    <div style={{ marginTop: '10px', color: theme.text, fontSize: '12px' }}>
                                        Current image will be kept if no new image is selected
                                    </div>
                                )}
                            </div>

                            <button type="submit" style={styles.submitBtn} disabled={loading}>
                                {loading ? 'Processing...' : (isEditing ? 'Update Achievement' : 'Add Achievement')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Achievement;