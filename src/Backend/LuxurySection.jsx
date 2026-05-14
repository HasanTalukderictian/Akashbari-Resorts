import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

// API এবং স্টোরেজ পাথ কনফিগারেশন
export const API_BASE = 'http://127.0.0.1:8000/api';
export const STORAGE_BASE = 'http://127.0.0.1:8000';

// হেল্পার ফাংশন ইমেজ URL জেনারেট করার জন্য
const getImageUrl = (item) => {
    if (!item) return null;
    
    if (item.image_url) {
        return item.image_url;
    }
    
    if (item.image) {
        if (item.image.startsWith('http')) {
            return item.image;
        }
        let cleanPath = item.image.replace(/^storage\//, '');
        return `${STORAGE_BASE}/${cleanPath}`;
    }
    
    return null;
};

// --- মোডাল কম্পোনেন্ট (Create, View, Edit এর জন্য) ---
const CustomModal = ({ theme, onClose, fetchItems, editingItem, readOnly }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        image: null,
        features: ['']
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    useEffect(() => {
        if (editingItem) {
            let parsedFeatures = [''];
            try {
                parsedFeatures = typeof editingItem.features === 'string' 
                    ? JSON.parse(editingItem.features) 
                    : editingItem.features;
            } catch (e) {
                parsedFeatures = [editingItem.features];
            }

            setFormData({
                title: editingItem.title || '',
                image: null,
                features: parsedFeatures || ['']
            });
            
            const imageUrl = getImageUrl(editingItem);
            setImagePreview(imageUrl);
        }
    }, [editingItem]);

    const handleInputChange = (e) => {
        if (readOnly) return;
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showToast('Image size should be less than 5MB', 'error');
                return;
            }
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    const addFeatureField = () => {
        setFormData({ ...formData, features: [...formData.features, ''] });
    };

    const removeFeatureField = (index) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData({ ...formData, features: newFeatures });
    };

    const handleSubmit = async () => {
        if (!formData.title) {
            showToast('Please enter a title', 'error');
            return;
        }

        try {
            setLoading(true);
            const data = new FormData();
            data.append('title', formData.title);
            
            if (editingItem) {
                data.append('status', editingItem.status || 'active');
            }
            
            if (formData.image) {
                data.append('image', formData.image);
            }
            
            formData.features.forEach((feature, index) => {
                if (feature.trim() !== '') {
                    data.append(`features[${index}]`, feature);
                }
            });

            if (editingItem) {
                data.append('_method', 'PUT');
                await axios.post(`${API_BASE}/luxury-items/${editingItem.id}`, data);
                showToast('Item updated successfully!', 'success');
            } else {
                await axios.post(`${API_BASE}/luxury-items`, data);
                showToast('Item created successfully!', 'success');
            }

            fetchItems();
            setTimeout(() => onClose(), 1000);
        } catch (error) {
            console.error(error);
            showToast(error.response?.data?.message || 'Something went wrong!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        modalOverlay: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.3s ease'
        },
        modalContainer: {
            backgroundColor: theme.card,
            borderRadius: '20px',
            width: '100%',
            maxWidth: '550px',
            maxHeight: '90vh',
            overflowY: 'auto',
            animation: 'slideUp 0.3s ease',
            border: `1px solid ${theme.border}`
        },
        modalHeader: {
            padding: '20px 24px',
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            backgroundColor: theme.card,
            zIndex: 1
        },
        modalBody: {
            padding: '24px'
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.bg,
            color: theme.text,
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s'
        },
        imageUploadArea: {
            border: `2px dashed ${theme.border}`,
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s',
            backgroundColor: theme.bg
        },
        imagePreview: {
            width: '100%',
            maxHeight: '200px',
            objectFit: 'contain',
            borderRadius: '12px',
            marginBottom: '12px'
        },
        featureInput: {
            display: 'flex',
            gap: '8px',
            marginBottom: '8px'
        },
        toast: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '12px',
            color: 'white',
            zIndex: 2000,
            animation: 'slideInRight 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        }
    };

    return (
        <>
            <div style={styles.modalOverlay}>
                <div style={styles.modalContainer}>
                    <div style={styles.modalHeader}>
                        <h5 className="fw-bold mb-0" style={{ 
                            background: theme.primaryGradient || 'linear-gradient(135deg, #9a55ff 0%, #c084fc 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            {readOnly ? 'Item Details' : editingItem ? 'Edit Luxury Item' : 'Add New Item'}
                        </h5>
                        <button onClick={onClose} className="btn-close" 
                            style={{ filter: theme.isDarkMode ? 'invert(1)' : 'none' }}>
                        </button>
                    </div>

                    <div style={styles.modalBody}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold mb-2">Title</label>
                            <input 
                                type="text" 
                                name="title" 
                                className="form-control" 
                                readOnly={readOnly}
                                value={formData.title} 
                                onChange={handleInputChange}
                                style={styles.input}
                                placeholder="Enter item title"
                            />
                        </div>

                        {!readOnly && (
                            <div className="mb-3">
                                <label className="form-label fw-semibold mb-2">Image</label>
                                <div 
                                    style={styles.imageUploadArea}
                                    onClick={() => document.getElementById('imageInput').click()}
                                >
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
                                            <p style={{ fontSize: '13px', color: theme.textLight }}>
                                                Click to change image
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📷</div>
                                            <p>Click to upload an image</p>
                                            <p style={{ fontSize: '12px', color: theme.textLight }}>Max size: 5MB</p>
                                        </>
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    id="imageInput"
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                        )}

                        {imagePreview && readOnly && (
                            <div className="mb-3 text-center">
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    style={styles.imagePreview}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/400x200?text=No+Image+Available';
                                    }}
                                />
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="form-label fw-semibold mb-2 d-flex justify-content-between">
                                Features
                                {!readOnly && (
                                    <span className="text-primary" style={{ cursor: 'pointer' }} onClick={addFeatureField}>
                                        <i className="bi bi-plus-circle"></i> Add Feature
                                    </span>
                                )}
                            </label>
                            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {formData.features.map((f, i) => (
                                    <div key={i} style={styles.featureInput}>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            readOnly={readOnly}
                                            value={f} 
                                            onChange={(e) => handleFeatureChange(i, e.target.value)}
                                            style={styles.input}
                                            placeholder={`Feature ${i + 1}`}
                                        />
                                        {!readOnly && formData.features.length > 1 && (
                                            <button 
                                                className="btn btn-sm" 
                                                style={{ backgroundColor: theme.danger || '#ef4444', color: 'white', borderRadius: '8px' }}
                                                onClick={() => removeFeatureField(i)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            {!readOnly && (
                                <button 
                                    className="btn w-100 fw-bold" 
                                    style={{ background: theme.primaryGradient || 'linear-gradient(135deg, #9a55ff 0%, #c084fc 100%)', color: 'white', border: 'none' }}
                                    onClick={handleSubmit} 
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Save Changes'}
                                </button>
                            )}
                            <button 
                                className="btn btn-secondary w-100 fw-bold" 
                                onClick={onClose}
                            >
                                {readOnly ? 'Close' : 'Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {toast.show && (
                <div style={{
                    ...styles.toast,
                    backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444'
                }}>
                    {toast.type === 'success' ? '✅' : '❌'} {toast.message}
                </div>
            )}
        </>
    );
};

// --- মেইন সেকশন কম্পোনেন্ট ---
const LuxurySection = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const itemsPerPage = 8;

    // এডিট ও ভিউ স্টেট
    const [selectedItem, setSelectedItem] = useState(null);
    const [readOnly, setReadOnly] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingItem, setDeletingItem] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const theme = {
        isDarkMode,
        bg: isDarkMode ? '#0f0f1a' : '#f8f9fc',
        card: isDarkMode ? '#1a1a2e' : '#ffffff',
        cardHover: isDarkMode ? '#22223b' : '#f8f9fa',
        text: isDarkMode ? '#e9ecef' : '#2c3e50',
        textLight: isDarkMode ? '#a0a0a0' : '#6c757d',
        border: isDarkMode ? '#2d2d3d' : '#e9ecef',
        primary: '#9a55ff',
        primaryGradient: 'linear-gradient(135deg, #9a55ff 0%, #c084fc 100%)',
        danger: '#ef4444',
        success: '#10b981'
    };

    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/luxury-items`);
            const fetchedItems = res.data.data.data || [];
            
            const itemsWithImageUrl = fetchedItems.map(item => ({
                ...item,
                image_url: item.image_url || getImageUrl(item)
            }));
            
            setItems(itemsWithImageUrl);
        } catch (e) { 
            console.error(e); 
            showToast('Failed to load items', 'error');
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { fetchItems(); }, []);

    // Filter and pagination
    const filteredItems = items.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const openModal = (item = null, isView = false) => {
        setSelectedItem(item);
        setReadOnly(isView);
        setShowModal(true);
    };

    const confirmDelete = (item) => {
        setDeletingItem(item);
        setShowDeleteModal(true);
    };

    const deleteItem = async () => {
        try {
            await axios.delete(`${API_BASE}/luxury-items/${deletingItem.id}`);
            fetchItems();
            setShowDeleteModal(false);
            setDeletingItem(null);
            showToast('Item deleted successfully!', 'success');
        } catch (error) {
            console.error(error);
            showToast('Failed to delete item', 'error');
        }
    };

    // Styles
    const styles = {
        container: {
            backgroundColor: theme.bg,
            minHeight: '100vh',
            transition: 'all 0.3s ease'
        },
        mainWrapper: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            height: '100vh',
            overflow: 'hidden'
        },
        scrollContent: {
            flex: 1,
            overflowY: 'auto',
            padding: '30px'
        },
        pageTitle: {
            fontSize: '28px',
            fontWeight: '700',
            background: theme.primaryGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
        },
        statsContainer: {
            display: 'flex',
            gap: '20px',
            marginBottom: '30px',
            flexWrap: 'wrap'
        },
        statCard: {
            backgroundColor: theme.card,
            borderRadius: '16px',
            padding: '20px',
            flex: 1,
            minWidth: '150px',
            border: `1px solid ${theme.border}`,
            transition: 'all 0.3s ease'
        },
        statIcon: {
            fontSize: '32px',
            marginBottom: '12px'
        },
        statValue: {
            fontSize: '28px',
            fontWeight: '700',
            color: theme.text,
            marginBottom: '4px'
        },
        statLabel: {
            fontSize: '13px',
            color: theme.textLight,
            fontWeight: '500'
        },
        toolbar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            flexWrap: 'wrap',
            gap: '16px'
        },
        searchBox: {
            padding: '12px 20px',
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.card,
            color: theme.text,
            width: '300px',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s'
        },
        addBtn: {
            background: theme.primaryGradient,
            color: 'white',
            border: 'none',
            padding: '12px 28px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(154, 85, 255, 0.3)'
        },
        itemGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '30px'
        },
        itemCard: {
            backgroundColor: theme.card,
            borderRadius: '20px',
            overflow: 'hidden',
            border: `1px solid ${theme.border}`,
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative'
        },
        itemImage: {
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
        },
        cardOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(154, 85, 255, 0.95) 0%, rgba(192, 132, 252, 0.95) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            opacity: 0,
            transition: 'all 0.3s ease'
        },
        cardContent: {
            padding: '16px'
        },
        itemTitle: {
            fontSize: '16px',
            fontWeight: '600',
            color: theme.text,
            marginBottom: '8px'
        },
        statusBadge: (status) => ({
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '500',
            backgroundColor: status === 'active' ? theme.success : theme.danger,
            color: 'white'
        }),
        featureList: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginTop: '12px'
        },
        featureBadge: {
            backgroundColor: theme.primary,
            color: 'white',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: '500'
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '20px'
        },
        pageBtn: {
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.card,
            color: theme.text,
            cursor: 'pointer',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        activePage: {
            background: theme.primaryGradient,
            color: 'white',
            border: 'none'
        },
        modalOverlay: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.3s ease'
        },
        modal: {
            backgroundColor: theme.card,
            borderRadius: '20px',
            width: '400px',
            maxWidth: '90%',
            animation: 'slideUp 0.3s ease'
        },
        toast: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '14px 24px',
            borderRadius: '12px',
            color: 'white',
            zIndex: 2000,
            animation: 'slideInRight 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        },
        emptyState: {
            textAlign: 'center',
            padding: '60px',
            color: theme.textLight
        },
        loadingSpinner: {
            textAlign: 'center',
            padding: '60px',
            color: theme.textLight
        }
    };

    // Calculate statistics
    const totalItems = items.length;
    const activeItems = items.filter(i => i.status === 'active').length;
    const inactiveItems = items.filter(i => i.status !== 'active').length;

    return (
        <div style={styles.container}>
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from { transform: translateY(50px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    @keyframes slideInRight {
                        from { transform: translateX(100px); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    .stat-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 8px 25px rgba(154, 85, 255, 0.15);
                    }
                    .item-card:hover {
                        transform: translateY(-8px);
                        box-shadow: 0 12px 30px rgba(0,0,0,0.2);
                    }
                    .item-card:hover .card-overlay {
                        opacity: 1;
                    }
                    .item-card:hover img {
                        transform: scale(1.1);
                    }
                    button:hover {
                        transform: translateY(-2px);
                    }
                    button:active {
                        transform: translateY(0);
                    }
                    .search-box:focus {
                        border-color: #9a55ff;
                        box-shadow: 0 0 0 3px rgba(154, 85, 255, 0.1);
                    }
                `}
            </style>

            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
                <Sidebar theme={theme} isCollapsed={isCollapsed} />

                <div style={styles.mainWrapper}>
                    <Header 
                        theme={theme} 
                        isDarkMode={isDarkMode} 
                        toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
                        toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
                    />

                    <div style={styles.scrollContent}>
                        {/* Header Section */}
                        <div style={{ marginBottom: '30px' }}>
                            <h1 style={styles.pageTitle}>Luxury Collection</h1>
                            <p style={{ color: theme.textLight }}>Manage your luxury items and products</p>
                        </div>

                        {/* Statistics Cards */}
                        <div style={styles.statsContainer}>
                            <div className="stat-card" style={styles.statCard}>
                                <div style={styles.statIcon}>✨</div>
                                <div style={styles.statValue}>{totalItems}</div>
                                <div style={styles.statLabel}>Total Items</div>
                            </div>
                            <div className="stat-card" style={styles.statCard}>
                                <div style={styles.statIcon}>✅</div>
                                <div style={styles.statValue}>{activeItems}</div>
                                <div style={styles.statLabel}>Active Items</div>
                            </div>
                            <div className="stat-card" style={styles.statCard}>
                                <div style={styles.statIcon}>📦</div>
                                <div style={styles.statValue}>{inactiveItems}</div>
                                <div style={styles.statLabel}>Inactive Items</div>
                            </div>
                        </div>

                        {/* Toolbar */}
                        <div style={styles.toolbar}>
                            <input
                                type="text"
                                placeholder="🔍 Search by title..."
                                style={styles.searchBox}
                                className="search-box"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            <button 
                                style={styles.addBtn}
                                onClick={() => openModal()}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                + Add New Item
                            </button>
                        </div>

                        {/* Items Grid */}
                        {loading ? (
                            <div style={styles.loadingSpinner}>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p style={{ marginTop: '16px' }}>Loading luxury items...</p>
                            </div>
                        ) : currentItems.length > 0 ? (
                            <>
                                <div style={styles.itemGrid}>
                                    {currentItems.map((item) => (
                                        <div 
                                            key={item.id} 
                                            className="item-card"
                                            style={styles.itemCard}
                                        >
                                            <div style={{ position: 'relative', overflow: 'hidden' }}>
                                                {item.image_url ? (
                                                    <img 
                                                        src={item.image_url} 
                                                        alt={item.title}
                                                        style={styles.itemImage}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{ 
                                                        ...styles.itemImage, 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center',
                                                        backgroundColor: theme.border
                                                    }}>
                                                        <span>No Image</span>
                                                    </div>
                                                )}
                                                <div className="card-overlay" style={styles.cardOverlay}>
                                                    <button 
                                                        className="btn btn-light btn-sm rounded-circle"
                                                        onClick={() => openModal(item, true)}
                                                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                                    >
                                                        👁️
                                                    </button>
                                                    <button 
                                                        className="btn btn-light btn-sm rounded-circle"
                                                        onClick={() => openModal(item, false)}
                                                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button 
                                                        className="btn btn-light btn-sm rounded-circle"
                                                        onClick={() => confirmDelete(item)}
                                                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                            <div style={styles.cardContent}>
                                                <div style={styles.itemTitle}>{item.title}</div>
                                                <div style={{ marginBottom: '8px' }}>
                                                    <span style={styles.statusBadge(item.status)}>
                                                        {item.status || 'active'}
                                                    </span>
                                                </div>
                                                {item.features && item.features.length > 0 && (
                                                    <div style={styles.featureList}>
                                                        {item.features.slice(0, 3).map((feature, idx) => (
                                                            <span key={idx} style={styles.featureBadge}>
                                                                {feature}
                                                            </span>
                                                        ))}
                                                        {item.features.length > 3 && (
                                                            <span style={styles.featureBadge}>
                                                                +{item.features.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div style={styles.pagination}>
                                        <button
                                            style={{...styles.pageBtn, ...(currentPage === 1 && { opacity: 0.5, cursor: 'not-allowed' })}}
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            ←
                                        </button>
                                        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }
                                            return (
                                                <button
                                                    key={i}
                                                    style={{
                                                        ...styles.pageBtn,
                                                        ...(currentPage === pageNum && styles.activePage)
                                                    }}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        <button
                                            style={{...styles.pageBtn, ...(currentPage === totalPages && { opacity: 0.5, cursor: 'not-allowed' })}}
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            →
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={styles.emptyState}>
                                <div style={{ fontSize: '64px', marginBottom: '16px' }}>✨</div>
                                <h4>No luxury items found</h4>
                                <p style={{ color: theme.textLight, marginBottom: '20px' }}>
                                    {searchTerm ? `No results found for "${searchTerm}"` : 'Start by adding your first luxury item'}
                                </p>
                                {!searchTerm && (
                                    <button style={styles.addBtn} onClick={() => openModal()}>
                                        + Add New Item
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <Footer theme={theme} />
                </div>
            </div>

            {/* Add/Edit/View Modal */}
            {showModal && (
                <CustomModal 
                    theme={theme} 
                    onClose={() => setShowModal(false)} 
                    fetchItems={fetchItems} 
                    editingItem={selectedItem} 
                    readOnly={readOnly}
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div style={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={{ padding: '24px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚠️</div>
                                <h5>Confirm Delete</h5>
                                <p>Are you sure you want to delete <strong>{deletingItem?.title}</strong>?</p>
                                <p style={{ fontSize: '13px', color: theme.textLight }}>This action cannot be undone.</p>
                            </div>
                            <div className="d-flex gap-2">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary w-100" 
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="btn w-100"
                                    style={{ background: theme.danger, color: 'white', border: 'none' }}
                                    onClick={deleteItem}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast.show && (
                <div style={{
                    ...styles.toast,
                    backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444'
                }}>
                    {toast.type === 'success' ? '✅' : '❌'} {toast.message}
                </div>
            )}
        </div>
    );
};

export default LuxurySection;