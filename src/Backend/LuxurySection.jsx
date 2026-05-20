import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

// API এবং স্টোরেজ পাথ কনফিগারেশন
export const API_BASE = import.meta.env.VITE_BASE_URL;
export const STORAGE_BASE = import.meta.env.API_URL;

// Get authentication headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Role': localStorage.getItem('Role') || 'admin'
    };
};

// Check authentication
const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Please login to access this page");
        setTimeout(() => window.location.href = '/login', 2000);
        return false;
    }
    return true;
};

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
                alert('Image size should be less than 5MB');
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
        if (!checkAuth()) return;
        
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

            const headers = getAuthHeaders();
            
            if (editingItem) {
                data.append('_method', 'PUT');
                await axios.post(`${API_BASE}/luxury-items/${editingItem.id}`, data, { headers });
            } else {
                await axios.post(`${API_BASE}/luxury-items`, data, { headers });
            }

            fetchItems();
            onClose();
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                alert("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
            } else {
                alert(error.response?.data?.message || 'Something went wrong!');
            }
        } finally {
            setLoading(false);
        }
    };

    const modalStyles = {
        overlay: {
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
        modal: {
            backgroundColor: theme.card,
            color: theme.text,
            width: '100%',
            maxWidth: '550px',
            borderRadius: '24px',
            border: `1px solid ${theme.border}`,
            animation: 'slideUp 0.3s ease',
            overflow: 'hidden'
        },
        header: {
            padding: '20px 24px',
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        body: {
            padding: '24px',
            maxHeight: '70vh',
            overflowY: 'auto'
        },
        footer: {
            padding: '16px 24px',
            borderTop: `1px solid ${theme.border}`,
            display: 'flex',
            gap: '12px'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            fontSize: '13px',
            color: theme.text
        },
        input: {
            width: '100%',
            padding: '10px 14px',
            borderRadius: '10px',
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.bg,
            color: theme.text,
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s'
        },
        imagePreview: {
            width: '100%',
            maxHeight: '180px',
            objectFit: 'contain',
            borderRadius: '12px',
            border: `2px dashed ${theme.border}`,
            padding: '10px',
            backgroundColor: theme.bg
        },
        badge: {
            background: theme.accentGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '500',
            marginLeft: '8px'
        }
    };

    return (
        <div style={modalStyles.overlay} onClick={onClose}>
            <div style={modalStyles.modal} onClick={e => e.stopPropagation()}>
                <div style={modalStyles.header}>
                    <h5 className="fw-bold mb-0" style={{ margin: 0 }}>
                        {readOnly ? '📋 Item Details' : editingItem ? '✏️ Edit Luxury Item' : '✨ Add New Item'}
                    </h5>
                    <button 
                        onClick={onClose} 
                        className="btn-close" 
                        style={{ filter: theme.isDarkMode ? 'invert(1)' : 'none' }}
                    />
                </div>

                <div style={modalStyles.body}>
                    <div className="mb-3">
                        <label style={modalStyles.label}>Title *</label>
                        <input 
                            type="text" 
                            name="title" 
                            className="form-control"
                            readOnly={readOnly}
                            value={formData.title} 
                            onChange={handleInputChange}
                            style={modalStyles.input}
                            placeholder="Enter luxury item title"
                        />
                    </div>

                    {!readOnly && (
                        <div className="mb-3">
                            <label style={modalStyles.label}>
                                Image 
                                <span style={modalStyles.badge}>Optional</span>
                            </label>
                            <input 
                                type="file" 
                                className="form-control" 
                                onChange={handleImageChange}
                                accept="image/*"
                                style={modalStyles.input}
                            />
                            <small style={{ color: theme.textLight, fontSize: '11px' }}>
                                Max size: 5MB (JPG, PNG, WebP)
                            </small>
                        </div>
                    )}

                    {imagePreview && (
                        <div className="mb-3">
                            <label style={modalStyles.label}>Preview</label>
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                style={modalStyles.imagePreview}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/400x200?text=No+Image+Available';
                                }}
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <label style={modalStyles.label} className="d-flex justify-content-between">
                            Features
                            {!readOnly && (
                                <span 
                                    onClick={addFeatureField}
                                    style={{ cursor: 'pointer', color: '#667eea', fontSize: '12px' }}
                                >
                                    <i className="bi bi-plus-circle"></i> Add Feature
                                </span>
                            )}
                        </label>
                        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                            {formData.features.map((f, i) => (
                                <div key={i} className="d-flex gap-2 mb-2">
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        readOnly={readOnly}
                                        value={f} 
                                        onChange={(e) => handleFeatureChange(i, e.target.value)}
                                        style={modalStyles.input}
                                        placeholder={`Feature ${i + 1}`}
                                    />
                                    {!readOnly && formData.features.length > 1 && (
                                        <button 
                                            className="btn btn-sm" 
                                            onClick={() => removeFeatureField(i)}
                                            style={{ color: '#ef4444' }}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={modalStyles.footer}>
                    {!readOnly && (
                        <button 
                            className="btn btn-primary w-100 fw-bold" 
                            onClick={handleSubmit} 
                            disabled={loading}
                            style={{ padding: '10px', borderRadius: '10px' }}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Processing...
                                </>
                            ) : (
                                editingItem ? 'Update Item' : 'Save Item'
                            )}
                        </button>
                    )}
                    <button 
                        className="btn btn-secondary w-100 fw-bold" 
                        onClick={onClose}
                        style={{ padding: '10px', borderRadius: '10px' }}
                    >
                        {readOnly ? 'Close' : 'Cancel'}
                    </button>
                </div>
            </div>
        </div>
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
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [authError, setAuthError] = useState(null);
    const itemsPerPage = 6;

    const [selectedItem, setSelectedItem] = useState(null);
    const [readOnly, setReadOnly] = useState(false);

    const theme = {
        isDarkMode,
        bg: isDarkMode ? '#0f0f1a' : '#f8f9fc',
        card: isDarkMode ? '#1a1a2e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#2c3e50',
        textLight: isDarkMode ? '#a0a0a0' : '#6c757d',
        border: isDarkMode ? '#2d2d3d' : '#e9ecef',
        primary: '#667eea',
        accentGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        danger: '#ef4444',
        success: '#10b981'
    };

    const fetchItems = async () => {
        if (!checkAuth()) return;
        
        try {
            setLoading(true);
            setAuthError(null);
            const headers = getAuthHeaders();
            const res = await axios.get(`${API_BASE}/luxury-items`, { headers });
            
            if (res.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                setAuthError("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }
            
            const fetchedItems = res.data.data.data || [];
            
            const itemsWithImageUrl = fetchedItems.map(item => ({
                ...item,
                image_url: item.image_url || getImageUrl(item)
            }));
            
            setItems(itemsWithImageUrl);
        } catch (e) { 
            console.error(e);
            if (e.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                setAuthError("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
            } else {
                setAuthError("Failed to fetch luxury items. Please try again.");
            }
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { fetchItems(); }, []);

    const openModal = (item = null, isView = false) => {
        setSelectedItem(item);
        setReadOnly(isView);
        setShowModal(true);
    };

    const deleteItem = async (id) => {
        if (!checkAuth()) return;
        
        try {
            const headers = getAuthHeaders();
            await axios.delete(`${API_BASE}/luxury-items/${id}`, { headers });
            fetchItems();
            setDeleteConfirm(null);
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                alert("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
            } else {
                alert('Failed to delete item');
            }
        }
    };

    // Filter and Pagination
    const filteredItems = items.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    // Statistics
    const totalItems = items.length;
    const activeItems = items.filter(item => item.status === 'active').length;
    const totalFeatures = items.reduce((sum, item) => {
        let features = [];
        try {
            features = typeof item.features === 'string' ? JSON.parse(item.features) : item.features;
        } catch { features = [] }
        return sum + (features?.length || 0);
    }, 0);

    const styles = {
        container: {
            backgroundColor: theme.bg,
            color: theme.text,
            minHeight: '100vh',
            transition: 'all 0.3s ease'
        },
        mainContent: {
            flex: 1,
            overflowY: 'auto',
            padding: '30px'
        },
        pageHeader: {
            marginBottom: '30px'
        },
        pageTitle: {
            fontSize: '28px',
            fontWeight: '700',
            background: theme.accentGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
        },
        pageSubtitle: {
            color: theme.textLight,
            fontSize: '14px'
        },
        alert: {
            padding: '12px 20px',
            backgroundColor: 'rgba(254, 112, 150, 0.15)',
            color: '#fe7096',
            borderRadius: '8px',
            marginBottom: '20px',
            fontWeight: '500'
        },
        statCards: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
        },
        statCard: {
            backgroundColor: theme.card,
            borderRadius: '16px',
            padding: '20px',
            border: `1px solid ${theme.border}`,
            transition: 'all 0.3s ease',
            cursor: 'pointer'
        },
        statIcon: {
            width: '45px',
            height: '45px',
            borderRadius: '12px',
            background: theme.accentGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            marginBottom: '12px'
        },
        statValue: {
            fontSize: '24px',
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
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px'
        },
        searchBox: {
            padding: '10px 18px',
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.card,
            color: theme.text,
            width: '280px',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s'
        },
        addBtn: {
            background: theme.accentGradient,
            color: 'white',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        itemsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '30px'
        },
        itemCard: {
            backgroundColor: theme.card,
            borderRadius: '20px',
            overflow: 'hidden',
            border: `1px solid ${theme.border}`,
            transition: 'all 0.3s ease',
            position: 'relative'
        },
        itemImage: {
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
        },
        cardContent: {
            padding: '20px'
        },
        itemTitle: {
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '12px',
            color: theme.text
        },
        featureList: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '16px'
        },
        featureBadge: {
            background: `${theme.primary}15`,
            color: theme.primary,
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '500'
        },
        cardActions: {
            display: 'flex',
            gap: '10px',
            borderTop: `1px solid ${theme.border}`,
            paddingTop: '16px'
        },
        actionBtn: {
            flex: 1,
            padding: '8px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s',
            fontSize: '13px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
        },
        viewBtn: {
            backgroundColor: `${theme.primary}15`,
            color: theme.primary
        },
        editBtn: {
            backgroundColor: '#f59e0b20',
            color: '#f59e0b'
        },
        deleteBtn: {
            backgroundColor: `${theme.danger}20`,
            color: theme.danger
        },
        statusBadge: {
            position: 'absolute',
            top: '12px',
            right: '12px',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '600',
            zIndex: 1
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '20px'
        },
        pageBtn: {
            width: '38px',
            height: '38px',
            borderRadius: '10px',
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
            background: theme.accentGradient,
            color: 'white',
            border: 'none'
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

    return (
        <div style={styles.container}>
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from { transform: translateY(30px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    .stat-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
                    }
                    .item-card:hover {
                        transform: translateY(-6px);
                        box-shadow: 0 12px 35px rgba(0,0,0,0.2);
                    }
                    .item-card:hover img {
                        transform: scale(1.05);
                    }
                    button:hover {
                        transform: translateY(-2px);
                    }
                    .search-box:focus {
                        border-color: #667eea;
                        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                    }
                `}
            </style>

            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
                <Sidebar theme={theme} isCollapsed={isCollapsed} />
                <div className="flex-grow-1 d-flex flex-column">
                    <Header 
                        theme={theme} 
                        isDarkMode={isDarkMode} 
                        toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
                        toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
                    />
                    
                    <div style={styles.mainContent}>
                        {/* Header */}
                        <div style={styles.pageHeader}>
                            <h1 style={styles.pageTitle}>Luxury Collection</h1>
                            <p style={styles.pageSubtitle}>Manage your premium luxury items and features</p>
                        </div>

                        {/* Auth Error Display */}
                        {authError && (
                            <div style={styles.alert}>
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                {authError}
                            </div>
                        )}

                        {/* Statistics Cards */}
                        <div style={styles.statCards}>
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
                                <div style={styles.statIcon}>🎁</div>
                                <div style={styles.statValue}>{totalFeatures}</div>
                                <div style={styles.statLabel}>Total Features</div>
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
                            <button style={styles.addBtn} onClick={() => openModal()}>
                                <i className="bi bi-plus-lg"></i> Add New Item
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
                                <div style={styles.itemsGrid}>
                                    {currentItems.map((item) => (
                                        <div key={item.id} className="item-card" style={styles.itemCard}>
                                            <div style={{ position: 'relative', overflow: 'hidden' }}>
                                                <img 
                                                    src={item.image_url || 'https://via.placeholder.com/400x200?text=Luxury+Item'} 
                                                    alt={item.title}
                                                    style={styles.itemImage}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                                                    }}
                                                />
                                                <span style={{
                                                    ...styles.statusBadge,
                                                    backgroundColor: item.status === 'active' ? theme.success : theme.danger,
                                                    color: 'white'
                                                }}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            <div style={styles.cardContent}>
                                                <h3 style={styles.itemTitle}>{item.title}</h3>
                                                <div style={styles.featureList}>
                                                    {(() => {
                                                        let features = [];
                                                        try {
                                                            features = typeof item.features === 'string' ? JSON.parse(item.features) : item.features;
                                                        } catch { features = [] }
                                                        return features?.slice(0, 3).map((feature, idx) => (
                                                            <span key={idx} style={styles.featureBadge}>
                                                                {feature}
                                                            </span>
                                                        ));
                                                    })()}
                                                </div>
                                                <div style={styles.cardActions}>
                                                    <button 
                                                        style={{...styles.actionBtn, ...styles.viewBtn}}
                                                        onClick={() => openModal(item, true)}
                                                    >
                                                        <i className="bi bi-eye"></i> View
                                                    </button>
                                                    <button 
                                                        style={{...styles.actionBtn, ...styles.editBtn}}
                                                        onClick={() => openModal(item, false)}
                                                    >
                                                        <i className="bi bi-pencil"></i> Edit
                                                    </button>
                                                    <button 
                                                        style={{...styles.actionBtn, ...styles.deleteBtn}}
                                                        onClick={() => setDeleteConfirm(item)}
                                                    >
                                                        <i className="bi bi-trash"></i> Delete
                                                    </button>
                                                </div>
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
                                <h4>No Luxury Items Found</h4>
                                <p style={{ color: theme.textLight, marginBottom: '20px' }}>
                                    {searchTerm ? `No results found for "${searchTerm}"` : 'Start by adding your first luxury item'}
                                </p>
                                {!searchTerm && (
                                    <button style={styles.addBtn} onClick={() => openModal()}>
                                        <i className="bi bi-plus-lg"></i> Add New Item
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <Footer theme={theme} />
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    backdropFilter: 'blur(8px)'
                }} onClick={() => setDeleteConfirm(null)}>
                    <div style={{
                        backgroundColor: theme.card,
                        borderRadius: '20px',
                        width: '400px',
                        maxWidth: '90%',
                        padding: '24px'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚠️</div>
                            <h4>Confirm Delete</h4>
                            <p>Are you sure you want to delete <strong>{deleteConfirm.title}</strong>?</p>
                            <p style={{ fontSize: '13px', color: theme.textLight }}>This action cannot be undone.</p>
                        </div>
                        <div className="d-flex gap-2">
                            <button 
                                className="btn btn-secondary w-100"
                                onClick={() => setDeleteConfirm(null)}
                                style={{ padding: '10px', borderRadius: '10px' }}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn w-100"
                                onClick={() => deleteItem(deleteConfirm.id)}
                                style={{ backgroundColor: theme.danger, color: 'white', padding: '10px', borderRadius: '10px', border: 'none' }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <CustomModal 
                    theme={theme} 
                    onClose={() => setShowModal(false)} 
                    fetchItems={fetchItems} 
                    editingItem={selectedItem} 
                    readOnly={readOnly}
                />
            )}
        </div>
    );
};

export default LuxurySection;