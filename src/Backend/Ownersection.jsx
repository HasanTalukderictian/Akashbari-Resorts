import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const OwnerSection = ({ theme: dashboardTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const itemsPerPage = 6;
    
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const initialFormState = {
        title: '',
        brand_name: '',
        whatsapp_number: '',
        description: '',
        features: [''], 
    };

    // Use environment variables with fallbacks
    const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000/api';
    const API_URL = import.meta.env.API_URL || 'http://localhost:8000';

    const [formData, setFormData] = useState(initialFormState);
    const [selectedImages, setSelectedImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    const theme = {
        isDarkMode,
        bg: isDarkMode ? '#0f0f1a' : (dashboardTheme?.bg || '#f8f9fc'),
        card: isDarkMode ? '#1a1a2e' : (dashboardTheme?.card || '#ffffff'),
        text: isDarkMode ? '#e9ecef' : (dashboardTheme?.text || '#2c3e50'),
        textLight: isDarkMode ? '#a0a0a0' : '#6c757d',
        border: isDarkMode ? '#2d2d3d' : (dashboardTheme?.border || '#e9ecef'),
        accent: dashboardTheme?.accent || '#9a55ff',
        accentGradient: 'linear-gradient(135deg, #9a55ff 0%, #c084fc 100%)',
        danger: '#ef4444',
        success: '#10b981',
        warning: '#f59e0b'
    };

    // Helper function to get image URL - FIXED
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        
        // If already a full URL, return as is
        if (imagePath.startsWith('http')) return imagePath;
        
        // Clean the path - remove any storage prefix and extra slashes
        let cleanPath = imagePath;
        
        // Remove /storage/ from beginning if present
        if (cleanPath.startsWith('/storage/')) {
            cleanPath = cleanPath.replace('/storage/', '');
        }
        // Remove storage/ from beginning if present
        else if (cleanPath.startsWith('storage/')) {
            cleanPath = cleanPath.replace('storage/', '');
        }
        
        // Remove any leading slashes
        cleanPath = cleanPath.replace(/^\/+/, '');
        
        // Construct the full URL
        return `${API_URL}/storage/${cleanPath}`;
    };

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/get-property-offers`);
            if (res.data.status && res.data.data.data) {
                setProperties(res.data.data.data);
            }
        } catch (err) { 
            console.error("Fetch Error:", err); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProperties(); }, []);

    const handleEditClick = (item) => {
        setIsEditing(true);
        setEditId(item.id);
        setFormData({
            title: item.title || '',
            brand_name: item.brand_name || '',
            whatsapp_number: item.whatsapp_number || '',
            description: item.description || '',
            features: item.features && item.features.length > 0 ? item.features : [''],
        });
        
        // Set existing images for preview - FIXED: process images correctly
        if (item.slider_images && item.slider_images.length > 0) {
            const imageUrls = item.slider_images.map(img => getImageUrl(img));
            setExistingImages(imageUrls);
            setPreviews(imageUrls);
        } else {
            setExistingImages([]);
            setPreviews([]);
        }
        setSelectedImages([]);
        setShowModal(true);
    };

    const closeModal = () => {
        setFormData(initialFormState);
        setPreviews([]);
        setExistingImages([]);
        setSelectedImages([]);
        setIsEditing(false);
        setEditId(null);
        setShowModal(false);
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    const addFeatureField = () => setFormData({ ...formData, features: [...formData.features, ''] });
    
    const removeFeatureField = (index) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData({ ...formData, features: newFeatures });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const oversized = files.find(file => file.size > 5 * 1024 * 1024);
        if (oversized) {
            alert(`File "${oversized.name}" is too large! Max 5MB.`);
            return;
        }
        setSelectedImages(files);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...existingImages, ...newPreviews]);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const data = new FormData();
        data.append('title', formData.title);
        data.append('brand_name', formData.brand_name);
        data.append('whatsapp_number', formData.whatsapp_number);
        data.append('description', formData.description);
        
        formData.features.forEach((feature, index) => {
            if (feature.trim() !== '') data.append(`features[${index}]`, feature);
        });

        if (selectedImages.length > 0) {
            selectedImages.forEach(img => data.append('slider_images[]', img));
        }

        try {
            const url = isEditing 
                ? `${BASE_URL}/edit-property-offers/${editId}`
                : `${BASE_URL}/add-property-offers`;

            await axios.post(url, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            fetchProperties();
            closeModal();
        } catch (err) { 
            alert(err.response?.data?.message || "Something went wrong!");
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/del-property-offers/${id}`);
            fetchProperties();
            setDeleteConfirm(null);
        } catch (err) { 
            console.error(err);
            alert("Failed to delete property");
        }
    };

    // Filter and Pagination
    const filteredProperties = properties.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

    // Statistics
    const totalProperties = properties.length;

    const styles = {
        container: {
            backgroundColor: theme.bg,
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
        statCards: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: theme.accentGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            marginBottom: '16px'
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
            marginBottom: '24px',
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
            background: theme.accentGradient,
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
        propertiesGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px',
            marginBottom: '30px'
        },
        propertyCard: {
            backgroundColor: theme.card,
            borderRadius: '20px',
            overflow: 'hidden',
            border: `1px solid ${theme.border}`,
            transition: 'all 0.3s ease',
            position: 'relative'
        },
        cardImage: {
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
        },
        cardContent: {
            padding: '20px'
        },
        propertyTitle: {
            fontSize: '18px',
            fontWeight: '700',
            color: theme.text,
            marginBottom: '8px'
        },
        brandName: {
            fontSize: '13px',
            color: theme.accent,
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
        },
        whatsapp: {
            fontSize: '13px',
            color: theme.success,
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
        },
        description: {
            fontSize: '13px',
            color: theme.textLight,
            lineHeight: '1.5',
            marginBottom: '12px'
        },
        featureList: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '16px'
        },
        featureBadge: {
            background: `${theme.accent}15`,
            color: theme.accent,
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '500'
        },
        cardActions: {
            display: 'flex',
            gap: '10px',
            paddingTop: '16px',
            borderTop: `1px solid ${theme.border}`
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
        editBtn: {
            backgroundColor: `${theme.accent}15`,
            color: theme.accent
        },
        deleteBtn: {
            backgroundColor: `${theme.danger}20`,
            color: theme.danger
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
        },
        modalOverlay: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(8px)'
        },
        modal: {
            backgroundColor: theme.card,
            borderRadius: '24px',
            width: '700px',
            maxWidth: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
        },
        modalHeader: {
            padding: '24px',
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
        modalFooter: {
            padding: '20px 24px',
            borderTop: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
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
        label: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            fontSize: '13px',
            color: theme.text
        },
        imagePreviewContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '12px'
        },
        previewImage: {
            width: '80px',
            height: '80px',
            borderRadius: '10px',
            objectFit: 'cover',
            border: `2px solid ${theme.accent}`,
            padding: '2px'
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
                        box-shadow: 0 8px 25px rgba(154, 85, 255, 0.15);
                    }
                    .property-card:hover {
                        transform: translateY(-6px);
                        box-shadow: 0 12px 35px rgba(0,0,0,0.2);
                    }
                    .property-card:hover img {
                        transform: scale(1.05);
                    }
                    button:hover {
                        transform: translateY(-2px);
                    }
                    .search-box:focus {
                        border-color: #9a55ff;
                        box-shadow: 0 0 0 3px rgba(154, 85, 255, 0.1);
                    }
                    .property-card {
                        animation: slideUp 0.3s ease;
                    }
                `}
            </style>

            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
                <Sidebar theme={theme} isCollapsed={isCollapsed} />

                <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                    <Header 
                        theme={theme}
                        isDarkMode={isDarkMode}
                        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
                    />

                    <div style={styles.mainContent}>
                        {/* Header Section */}
                        <div style={styles.pageHeader}>
                            <h1 style={styles.pageTitle}>Property Inventory</h1>
                            <p style={styles.pageSubtitle}>Manage your property listings and offers</p>
                        </div>

                        {/* Statistics Cards */}
                        <div style={styles.statCards}>
                            <div className="stat-card" style={styles.statCard}>
                                <div style={styles.statIcon}>🏘️</div>
                                <div style={styles.statValue}>{totalProperties}</div>
                                <div style={styles.statLabel}>Total Properties</div>
                            </div>
                            <div className="stat-card" style={styles.statCard}>
                                <div style={styles.statIcon}>🏢</div>
                                <div style={styles.statValue}>Active</div>
                                <div style={styles.statLabel}>Status</div>
                            </div>
                            <div className="stat-card" style={styles.statCard}>
                                <div style={styles.statIcon}>📞</div>
                                <div style={styles.statValue}>24/7</div>
                                <div style={styles.statLabel}>Support</div>
                            </div>
                        </div>

                        {/* Toolbar */}
                        <div style={styles.toolbar}>
                            <input
                                type="text"
                                placeholder="🔍 Search by title or brand..."
                                style={styles.searchBox}
                                className="search-box"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            <button style={styles.addBtn} onClick={() => setShowModal(true)}>
                                <i className="bi bi-plus-circle"></i> Add Property
                            </button>
                        </div>

                        {/* Properties Grid */}
                        {loading ? (
                            <div style={styles.loadingSpinner}>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p style={{ marginTop: '16px' }}>Loading properties...</p>
                            </div>
                        ) : currentItems.length > 0 ? (
                            <>
                                <div style={styles.propertiesGrid}>
                                    {currentItems.map((item) => (
                                        <div key={item.id} className="property-card" style={styles.propertyCard}>
                                            <img 
                                                src={item.slider_images?.[0] ? getImageUrl(item.slider_images[0]) : 'https://via.placeholder.com/400x200?text=Property+Image'} 
                                                alt={item.title}
                                                style={styles.cardImage}
                                                onError={(e) => {
                                                    console.error('Image failed to load:', e.target.src);
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                                                }}
                                            />
                                            <div style={styles.cardContent}>
                                                <h3 style={styles.propertyTitle}>{item.title}</h3>
                                                <div style={styles.brandName}>
                                                    <i className="bi bi-tag"></i> {item.brand_name}
                                                </div>
                                                <div style={styles.whatsapp}>
                                                    <i className="bi bi-whatsapp"></i> {item.whatsapp_number}
                                                </div>
                                                <p style={styles.description}>
                                                    {item.description?.substring(0, 100)}...
                                                </p>
                                                {item.features && item.features.length > 0 && (
                                                    <div style={styles.featureList}>
                                                        {item.features.slice(0, 3).map((feature, idx) => (
                                                            <span key={idx} style={styles.featureBadge}>
                                                                {feature}
                                                            </span>
                                                        ))}
                                                        {item.features.length > 3 && (
                                                            <span style={styles.featureBadge}>
                                                                +{item.features.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                <div style={styles.cardActions}>
                                                    <button 
                                                        style={{...styles.actionBtn, ...styles.editBtn}}
                                                        onClick={() => handleEditClick(item)}
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
                                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏘️</div>
                                <h4>No Properties Found</h4>
                                <p style={{ color: theme.textLight, marginBottom: '20px' }}>
                                    {searchTerm ? `No results found for "${searchTerm}"` : 'Start by adding your first property'}
                                </p>
                                {!searchTerm && (
                                    <button style={styles.addBtn} onClick={() => setShowModal(true)}>
                                        <i className="bi bi-plus-circle"></i> Add Property
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <Footer theme={theme} />
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={closeModal}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h5 style={{ margin: 0, fontWeight: '600' }}>
                                {isEditing ? '✏️ Edit Property' : '✨ Add New Property'}
                            </h5>
                            <button 
                                onClick={closeModal}
                                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: theme.text }}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div style={styles.modalBody}>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label style={styles.label}>Property Title *</label>
                                        <input 
                                            type="text" 
                                            required 
                                            style={styles.input}
                                            value={formData.title} 
                                            onChange={e => setFormData({...formData, title: e.target.value})}
                                            placeholder="Enter property title"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label style={styles.label}>Brand Name *</label>
                                        <input 
                                            type="text" 
                                            required 
                                            style={styles.input}
                                            value={formData.brand_name} 
                                            onChange={e => setFormData({...formData, brand_name: e.target.value})}
                                            placeholder="Enter brand name"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label style={styles.label}>WhatsApp Number *</label>
                                        <input 
                                            type="text" 
                                            required 
                                            style={styles.input}
                                            value={formData.whatsapp_number} 
                                            onChange={e => setFormData({...formData, whatsapp_number: e.target.value})}
                                            placeholder="+880XXXXXXXXX"
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label style={styles.label}>Description</label>
                                        <textarea 
                                            style={{...styles.input, resize: 'vertical', minHeight: '80px'}}
                                            rows="2" 
                                            value={formData.description} 
                                            onChange={e => setFormData({...formData, description: e.target.value})}
                                            placeholder="Describe the property..."
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label style={styles.label} className="d-flex justify-content-between">
                                            Features
                                            <button 
                                                type="button" 
                                                onClick={addFeatureField}
                                                style={{ color: theme.accent, background: 'none', border: 'none', cursor: 'pointer' }}
                                            >
                                                + Add More
                                            </button>
                                        </label>
                                        {formData.features.map((f, i) => (
                                            <div key={i} className="d-flex gap-2 mb-2">
                                                <input 
                                                    type="text" 
                                                    style={styles.input}
                                                    value={f} 
                                                    onChange={e => handleFeatureChange(i, e.target.value)}
                                                    placeholder={`Feature ${i + 1}`}
                                                />
                                                {formData.features.length > 1 && (
                                                    <button 
                                                        type="button"
                                                        onClick={() => removeFeatureField(i)}
                                                        style={{...styles.deleteBtn, padding: '0 15px', border: 'none', borderRadius: '10px'}}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="col-12">
                                        <label style={styles.label}>Property Images</label>
                                        <input 
                                            type="file" 
                                            multiple 
                                            style={styles.input}
                                            accept="image/*" 
                                            onChange={handleImageChange}
                                        />
                                        {previews.length > 0 && (
                                            <div style={styles.imagePreviewContainer}>
                                                {previews.map((src, i) => (
                                                    <img 
                                                        key={i} 
                                                        src={src} 
                                                        alt="preview" 
                                                        style={styles.previewImage}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://via.placeholder.com/80?text=No+Img';
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div style={styles.modalFooter}>
                                <button 
                                    type="button" 
                                    onClick={closeModal}
                                    style={{...styles.actionBtn, backgroundColor: theme.border, color: theme.text, padding: '10px 24px'}}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    style={{...styles.addBtn, padding: '10px 32px'}}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        isEditing ? 'Update Property' : 'Save Property'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div style={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
                    <div style={{...styles.modal, width: '400px'}} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h5 style={{ margin: 0, fontWeight: '600' }}>Confirm Delete</h5>
                            <button onClick={() => setDeleteConfirm(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
                        </div>
                        <div style={styles.modalBody}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                                <p>Are you sure you want to delete <strong>{deleteConfirm.title}</strong>?</p>
                                <p style={{ fontSize: '13px', color: theme.textLight }}>This action cannot be undone.</p>
                            </div>
                        </div>
                        <div style={styles.modalFooter}>
                            <button onClick={() => setDeleteConfirm(null)} style={{...styles.actionBtn, backgroundColor: theme.border, color: theme.text, padding: '10px 24px'}}>Cancel</button>
                            <button onClick={() => handleDelete(deleteConfirm.id)} style={{...styles.deleteBtn, padding: '10px 24px', border: 'none', borderRadius: '10px'}}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerSection;