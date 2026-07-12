import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Testominal = () => {
    
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    
    // UI States
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeView, setActiveView] = useState('video');
    const [showModal, setShowModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [authError, setAuthError] = useState(null);
    const itemsPerPage = 6;

    // Data States
    const [testimonials, setTestimonials] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        image: null,
        source: '',
        stars: 5,
        text: ''
    });

    const theme = {
        isDarkMode,
        bg: isDarkMode ? '#0f0f1a' : '#f8f9fc',
        card: isDarkMode ? '#1a1a2e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#2c3e50',
        textLight: isDarkMode ? '#a0a0a0' : '#6c757d',
        border: isDarkMode ? '#2d2d3d' : '#e9ecef',
        primary: '#5e2e10',
        primaryGradient: 'linear-gradient(135deg, #5e2e10 0%, #8B4513 100%)',
        danger: '#ef4444',
        success: '#10b981',
        warning: '#f59e0b'
    };

    // Get authentication headers
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Role': localStorage.getItem('Role') || 'admin'
        };
    };

    // Get multipart headers for file upload
    const getMultipartHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Role': localStorage.getItem('Role') || 'admin',
            'Content-Type': 'multipart/form-data'
        };
    };

    // Check authentication
    const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setAuthError("Please login to access this page");
            setTimeout(() => window.location.href = '/login', 2000);
            return false;
        }
        return true;
    };

    // Fetch Testimonials with authentication
    const fetchTestimonials = async () => {
        if (!checkAuth()) return;
        
        setLoading(true);
        setAuthError(null);
        
        try {
            const headers = getAuthHeaders();
            const res = await axios.get(`${BASE_URL}/get-testimonials`, { headers });
            
            if (res.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                setAuthError("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }
            
            setTestimonials(res.data.data || []);
        } catch (err) {
            console.error("Fetch Error:", err);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                setAuthError("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
            } else {
                setAuthError("Failed to fetch testimonials. Please try again.");
            }
            setTestimonials([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files && files[0]) {
            const file = files[0];
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }
            setFormData((prev) => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Submit Form with authentication
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!checkAuth()) return;
        
        setSubmitting(true);
        
        const data = new FormData();
        data.append('name', formData.name);
        if (formData.image) {
            data.append('image', formData.image);
        }
        data.append('source', formData.source);
        data.append('stars', formData.stars);
        data.append('text', formData.text);

        try {
            const headers = getMultipartHeaders();
            const res = await axios.post(
                `${BASE_URL}/add-testimonial`,
                data,
                { headers }
            );

            if (res.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                alert("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }

            if (res.status === 201 || res.data.status) {
                setShowModal(false);
                setFormData({
                    name: '',
                    image: null,
                    source: '',
                    stars: 5,
                    text: ''
                });
                setImagePreview(null);
                fetchTestimonials();
                alert("Testimonial added successfully!");
            } else {
                alert(res.data.message || "Failed to save testimonial");
            }
        } catch (err) {
            console.error("Submit Error:", err.response?.data || err);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                alert("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
            } else {
                alert("Failed to save testimonial");
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Delete Testimonial with authentication
    const handleDelete = async (id) => {
        if (!checkAuth()) return;
        
        try {
            const headers = getAuthHeaders();
            await axios.delete(`${BASE_URL}/del-testimonial/${id}`, { headers });
            fetchTestimonials();
            setDeleteConfirm(null);
            alert("Testimonial deleted successfully!");
        } catch (err) {
            console.error("Delete Error:", err);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                alert("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
            } else {
                alert("Failed to delete testimonial");
            }
        }
    };

    // Filter and Pagination
    const filteredTestimonials = testimonials.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.source?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTestimonials.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);

    // Statistics
    const totalTestimonials = testimonials.length;
    const avgRating = testimonials.reduce((sum, item) => sum + (item.stars || 0), 0) / totalTestimonials || 0;

    // Render Stars
    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, i) => (
            <i 
                key={i} 
                className={`bi bi-star${i < rating ? '-fill' : ''}`}
                style={{ color: '#f59e0b', fontSize: '14px', marginRight: '2px' }}
            ></i>
        ));
    };

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
            background: theme.primaryGradient,
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
            backgroundColor: 'rgba(94, 46, 16, 0.15)',
            color: '#5e2e10',
            borderRadius: '8px',
            marginBottom: '20px',
            fontWeight: '500'
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
            background: theme.primaryGradient,
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
            boxShadow: '0 4px 15px rgba(94, 46, 16, 0.3)'
        },
        testimonialsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px',
            marginBottom: '30px'
        },
        testimonialCard: {
            backgroundColor: theme.card,
            borderRadius: '20px',
            overflow: 'hidden',
            border: `1px solid ${theme.border}`,
            transition: 'all 0.3s ease',
            position: 'relative'
        },
        cardHeader: {
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            borderBottom: `1px solid ${theme.border}`
        },
        avatar: {
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: `3px solid ${theme.primary}`
        },
        userInfo: {
            flex: 1
        },
        userName: {
            fontSize: '18px',
            fontWeight: '700',
            color: theme.text,
            marginBottom: '4px'
        },
        userSource: {
            fontSize: '12px',
            color: theme.textLight,
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
        },
        rating: {
            marginBottom: '12px'
        },
        cardBody: {
            padding: '20px'
        },
        reviewText: {
            fontSize: '14px',
            color: theme.textLight,
            lineHeight: '1.6',
            marginBottom: '16px'
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
            background: theme.primaryGradient,
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
            width: '550px',
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
        buttonDisabled: {
            opacity: 0.7,
            cursor: 'not-allowed'
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
                        box-shadow: 0 8px 25px rgba(94, 46, 16, 0.15);
                    }
                    .testimonial-card:hover {
                        transform: translateY(-6px);
                        box-shadow: 0 12px 35px rgba(0,0,0,0.2);
                    }
                    button:hover {
                        transform: translateY(-2px);
                    }
                    .search-box:focus {
                        border-color: #5e2e10;
                        box-shadow: 0 0 0 3px rgba(94, 46, 16, 0.1);
                    }
                    .testimonial-card {
                        animation: slideUp 0.3s ease;
                    }
                `}
            </style>

            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
                <Sidebar
                    theme={theme}
                    isCollapsed={isCollapsed}
                    activeView={activeView}
                />

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
                            <h1 style={styles.pageTitle}>Testimonial Management</h1>
                            <p style={styles.pageSubtitle}>Manage customer feedback and reviews</p>
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
                                <div style={styles.statIcon}>💬</div>
                                <div style={styles.statValue}>{totalTestimonials}</div>
                                <div style={styles.statLabel}>Total Testimonials</div>
                            </div>
                            <div className="stat-card" style={styles.statCard}>
                                <div style={styles.statIcon}>⭐</div>
                                <div style={styles.statValue}>{avgRating.toFixed(1)}</div>
                                <div style={styles.statLabel}>Average Rating</div>
                            </div>
                            <div className="stat-card" style={styles.statCard}>
                                <div style={styles.statIcon}>👍</div>
                                <div style={styles.statValue}>100%</div>
                                <div style={styles.statLabel}>Satisfaction Rate</div>
                            </div>
                        </div>

                        {/* Toolbar */}
                        <div style={styles.toolbar}>
                            <input
                                type="text"
                                placeholder="🔍 Search by name or source..."
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
                                onClick={() => setShowModal(true)}
                                disabled={loading}
                            >
                                <i className="bi bi-plus-circle"></i> Add Testimonial
                            </button>
                        </div>

                        {/* Testimonials Grid */}
                        {loading ? (
                            <div style={styles.loadingSpinner}>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p style={{ marginTop: '16px' }}>Loading testimonials...</p>
                            </div>
                        ) : currentItems.length > 0 ? (
                            <>
                                <div style={styles.testimonialsGrid}>
                                    {currentItems.map((item) => (
                                        <div key={item.id} className="testimonial-card" style={styles.testimonialCard}>
                                            <div style={styles.cardHeader}>
                                                <img
                                                    src={item.image_url || 'https://via.placeholder.com/60?text=User'}
                                                    alt={item.name}
                                                    style={styles.avatar}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/60?text=User';
                                                    }}
                                                />
                                                <div style={styles.userInfo}>
                                                    <h3 style={styles.userName}>{item.name}</h3>
                                                    <div style={styles.userSource}>
                                                        <i className="bi bi-building"></i>
                                                        <span>{item.source || 'Customer'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={styles.cardBody}>
                                                <div style={styles.rating}>
                                                    {renderStars(item.stars)}
                                                    <span style={{ marginLeft: '8px', fontSize: '12px', color: theme.textLight }}>
                                                        ({item.stars}/5)
                                                    </span>
                                                </div>
                                                <p style={styles.reviewText}>
                                                    "{item.text}"
                                                </p>
                                                <div style={styles.cardActions}>
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
                                <div style={{ fontSize: '64px', marginBottom: '16px' }}>💬</div>
                                <h4>No Testimonials Found</h4>
                                <p style={{ color: theme.textLight, marginBottom: '20px' }}>
                                    {searchTerm ? `No results found for "${searchTerm}"` : 'Start by adding your first testimonial'}
                                </p>
                                {!searchTerm && (
                                    <button style={styles.addBtn} onClick={() => setShowModal(true)}>
                                        <i className="bi bi-plus-circle"></i> Add Testimonial
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
                <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h5 style={{ margin: 0, fontWeight: '600' }}>
                                ✨ Add New Testimonial
                            </h5>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: theme.text }}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={styles.modalBody}>
                                <div className="mb-3">
                                    <label style={styles.label}>Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        style={styles.input}
                                        placeholder="Enter customer name"
                                        required
                                        disabled={submitting}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label style={styles.label}>Profile Image</label>
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleChange}
                                        style={styles.input}
                                        disabled={submitting}
                                    />
                                    {imagePreview && (
                                        <div className="mt-3 text-center">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    borderRadius: '50%',
                                                    objectFit: 'cover',
                                                    border: `3px solid ${theme.primary}`
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label style={styles.label}>Source</label>
                                    <input
                                        type="text"
                                        name="source"
                                        value={formData.source}
                                        onChange={handleChange}
                                        style={styles.input}
                                        placeholder="e.g., Google, Facebook, TripAdvisor"
                                        disabled={submitting}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label style={styles.label}>Rating (1-5 stars)</label>
                                    <input
                                        type="number"
                                        name="stars"
                                        min="1"
                                        max="5"
                                        value={formData.stars}
                                        onChange={handleChange}
                                        style={styles.input}
                                        required
                                        disabled={submitting}
                                    />
                                    <div className="mt-2">
                                        {renderStars(formData.stars)}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label style={styles.label}>Review Text *</label>
                                    <textarea
                                        name="text"
                                        value={formData.text}
                                        onChange={handleChange}
                                        rows="4"
                                        style={{...styles.input, resize: 'vertical'}}
                                        placeholder="Write the customer's review..."
                                        required
                                        disabled={submitting}
                                    />
                                </div>
                            </div>
                            <div style={styles.modalFooter}>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{...styles.actionBtn, backgroundColor: theme.border, color: theme.text, padding: '10px 24px'}}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    style={{...styles.addBtn, padding: '10px 32px', ...(submitting && styles.buttonDisabled)}}
                                >
                                    {submitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Testimonial'
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
                                <p>Are you sure you want to delete testimonial from <strong>{deleteConfirm.name}</strong>?</p>
                                <p style={{ fontSize: '13px', color: theme.textLight }}>This action cannot be undone.</p>
                            </div>
                        </div>
                        <div style={styles.modalFooter}>
                            <button 
                                onClick={() => setDeleteConfirm(null)} 
                                style={{...styles.actionBtn, backgroundColor: theme.border, color: theme.text, padding: '10px 24px'}}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => handleDelete(deleteConfirm.id)} 
                                style={{...styles.deleteBtn, padding: '10px 24px', border: 'none', borderRadius: '10px'}}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Testominal;