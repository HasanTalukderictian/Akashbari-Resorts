import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Investment = ({ theme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const itemsPerPage = 6;

    // Data state
    const [packages, setPackages] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        price: '',
        discount: '',
        land: '',
        building: '',
        total_size: '',
        description: '',
        images: [],
        imagePreview: [],
        is_popular: false,
        is_sold_out: false
    });
    const [isEditing, setIsEditing] = useState(false);

    const API_BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';

    // 1. Fetch data
    const fetchPackages = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/get-investment`);
            const result = await response.json();
            if (result.status) {
                setPackages(result.data || []);
            } else {
                console.error("Failed to fetch:", result.message);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    // Handle image change
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        // Clean up old preview URLs to prevent memory leaks
        if (formData.imagePreview.length > 0) {
            formData.imagePreview.forEach(url => {
                if (url && url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        }

        setFormData(prev => ({
            ...prev,
            images: files,
            imagePreview: files.map(file => URL.createObjectURL(file))
        }));
    };

    // 2. Add and Edit handler - FIXED
    const handleSave = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.title.trim()) {
            alert("Please enter package title");
            return;
        }
        if (!formData.price) {
            alert("Please enter package price");
            return;
        }

        const url = isEditing
            ? `${API_BASE}/edit-investment/${formData.id}`
            : `${API_BASE}/add-investment`;

        try {
            const sendData = new FormData();

            // Append all fields
            sendData.append('title', formData.title.trim());
            sendData.append('price', formData.price);
            sendData.append('discount', formData.discount || '0');
            sendData.append('land', formData.land || '0');
            sendData.append('building', formData.building || '0');
            sendData.append('total_size', formData.total_size || '0');
            sendData.append('description', formData.description || '');
            sendData.append('is_popular', formData.is_popular ? '1' : '0');
            sendData.append('is_sold_out', formData.is_sold_out ? '1' : '0');

            // Handle images - only append new images when adding or when new images are selected
            if (formData.images && formData.images.length > 0) {
                formData.images.forEach((image, index) => {
                    sendData.append('images[]', image);
                });
            }

            const response = await fetch(url, {
                method: 'POST',
                body: sendData
            });

            const result = await response.json();

            if (result.status) {
                await fetchPackages(); // Refresh the list
                closeModal();
                alert(isEditing ? "Package updated successfully!" : "Package added successfully!");
            } else {
                alert(result.message || "Validation Error");
            }

        } catch (error) {
            console.error("Save error:", error);
            alert("Server Error. Please try again.");
        }
    };

    // 3. Delete handler
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_BASE}/del-investment/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const result = await response.json();
            if (result.status) {
                setPackages(prev => prev.filter(item => item.id !== id));
                setDeleteConfirm(null);
                alert("Package deleted successfully!");
            } else {
                alert(result.message || "Delete failed");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete package");
        }
    };

    // Open modal for add/edit - FIXED: Properly set price and discount values
    const openModal = (item = null) => {
        console.log("Opening modal with item:", item); // Debug log
        
        if (item) {
            // Handle image previews for existing items
            let imagePreviewArray = [];
            if (item.images && Array.isArray(item.images)) {
                imagePreviewArray = item.images;
            } else if (item.images && typeof item.images === 'string') {
                try {
                    const parsed = JSON.parse(item.images);
                    imagePreviewArray = Array.isArray(parsed) ? parsed : [item.images];
                } catch {
                    imagePreviewArray = [item.images];
                }
            }

            // CRITICAL FIX: Ensure price and discount are properly set as strings
            const newFormData = {
                id: item.id || '',
                title: item.title || '',
                price: item.price ? item.price.toString() : '', // Convert to string
                discount: item.discount ? item.discount.toString() : '', // Convert to string
                land: item.land || '',
                building: item.building || '',
                total_size: item.total_size || '',
                description: item.description || '',
                images: [],
                imagePreview: imagePreviewArray,
                is_popular: item.is_popular == 1 || item.is_popular === true,
                is_sold_out: item.is_sold_out == 1 || item.is_sold_out === true
            };
            
            console.log("Setting form data for edit:", newFormData); // Debug log
            
            setFormData(newFormData);
            setIsEditing(true);
        } else {
            // Clean up preview URLs when closing
            if (formData.imagePreview.length > 0) {
                formData.imagePreview.forEach(url => {
                    if (url && url.startsWith('blob:')) {
                        URL.revokeObjectURL(url);
                    }
                });
            }
            
            setFormData({
                id: '',
                title: '',
                price: '',
                discount: '',
                land: '',
                building: '',
                total_size: '',
                description: '',
                images: [],
                imagePreview: [],
                is_popular: false,
                is_sold_out: false
            });
            setIsEditing(false);
        }
        setShowModal(true);
    };

    // Close modal and cleanup
    const closeModal = () => {
        // Clean up blob URLs
        if (formData.imagePreview.length > 0) {
            formData.imagePreview.forEach(url => {
                if (url && url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        }
        
        setShowModal(false);
        setFormData({
            id: '',
            title: '',
            price: '',
            discount: '',
            land: '',
            building: '',
            total_size: '',
            description: '',
            images: [],
            imagePreview: [],
            is_popular: false,
            is_sold_out: false
        });
        setIsEditing(false);
    };

    // Filter and Pagination
    const filteredPackages = packages.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPackages.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);

    // Statistics
    const totalPackages = packages.length;
    const popularPackages = packages.filter(item => item.is_popular == 1).length;
    const soldOutPackages = packages.filter(item => item.is_sold_out == 1).length;

    const currentTheme = theme || {
        bg: isDarkMode ? '#0f0f1a' : '#f8f9fc',
        card: isDarkMode ? '#1a1a2e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#2c3e50',
        textLight: isDarkMode ? '#a0a0a0' : '#6c757d',
        border: isDarkMode ? '#2d2d3d' : '#e9ecef',
        primary: '#9a55ff',
        accentGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        danger: '#ef4444',
        success: '#10b981',
        warning: '#f59e0b'
    };

    const styles = {
        container: {
            backgroundColor: currentTheme.bg,
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
            background: currentTheme.accentGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
        },
        pageSubtitle: {
            color: currentTheme.textLight,
            fontSize: '14px'
        },
        statCards: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
        },
        statCard: {
            backgroundColor: currentTheme.card,
            borderRadius: '16px',
            padding: '20px',
            border: `1px solid ${currentTheme.border}`,
            transition: 'all 0.3s ease',
            cursor: 'pointer'
        },
        statIcon: {
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: currentTheme.accentGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            marginBottom: '16px'
        },
        statValue: {
            fontSize: '28px',
            fontWeight: '700',
            color: currentTheme.text,
            marginBottom: '4px'
        },
        statLabel: {
            fontSize: '13px',
            color: currentTheme.textLight,
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
            border: `1px solid ${currentTheme.border}`,
            backgroundColor: currentTheme.card,
            color: currentTheme.text,
            width: '300px',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s'
        },
        addBtn: {
            background: currentTheme.accentGradient,
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
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
        },
        packagesGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px',
            marginBottom: '30px'
        },
        packageCard: {
            backgroundColor: currentTheme.card,
            borderRadius: '20px',
            overflow: 'hidden',
            border: `1px solid ${currentTheme.border}`,
            transition: 'all 0.3s ease',
            position: 'relative'
        },
        cardHeader: {
            padding: '20px',
            borderBottom: `1px solid ${currentTheme.border}`,
            background: currentTheme.accentGradient,
            color: 'white'
        },
        packageTitle: {
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '8px'
        },
        packagePrice: {
            fontSize: '28px',
            fontWeight: '800',
            marginBottom: '4px'
        },
        originalPrice: {
            fontSize: '16px',
            textDecoration: 'line-through',
            opacity: '0.8',
            marginLeft: '10px'
        },
        discountBadge: {
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: '#f59e0b',
            color: 'white',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
        },
        cardBody: {
            padding: '20px'
        },
        infoRow: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '12px',
            paddingBottom: '12px',
            borderBottom: `1px solid ${currentTheme.border}`
        },
        infoLabel: {
            fontSize: '13px',
            color: currentTheme.textLight,
            fontWeight: '500'
        },
        infoValue: {
            fontSize: '14px',
            fontWeight: '600',
            color: currentTheme.text
        },
        description: {
            fontSize: '13px',
            color: currentTheme.textLight,
            lineHeight: '1.5',
            marginTop: '12px',
            marginBottom: '16px'
        },
        cardActions: {
            display: 'flex',
            gap: '10px',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: `1px solid ${currentTheme.border}`
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
            backgroundColor: `${currentTheme.primary}15`,
            color: currentTheme.primary
        },
        deleteBtn: {
            backgroundColor: `${currentTheme.danger}20`,
            color: currentTheme.danger
        },
        statusBadge: {
            position: 'absolute',
            top: '20px',
            left: '20px',
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
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            border: `1px solid ${currentTheme.border}`,
            backgroundColor: currentTheme.card,
            color: currentTheme.text,
            cursor: 'pointer',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        activePage: {
            background: currentTheme.accentGradient,
            color: 'white',
            border: 'none'
        },
        emptyState: {
            textAlign: 'center',
            padding: '60px',
            color: currentTheme.textLight
        },
        loadingSpinner: {
            textAlign: 'center',
            padding: '60px',
            color: currentTheme.textLight
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
            backgroundColor: currentTheme.card,
            borderRadius: '24px',
            width: '700px',
            maxWidth: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
        },
        modalHeader: {
            padding: '24px',
            borderBottom: `1px solid ${currentTheme.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            backgroundColor: currentTheme.card,
            zIndex: 1
        },
        modalBody: {
            padding: '24px'
        },
        modalFooter: {
            padding: '20px 24px',
            borderTop: `1px solid ${currentTheme.border}`,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
        },
        input: {
            width: '100%',
            padding: '10px 14px',
            borderRadius: '10px',
            border: `1px solid ${currentTheme.border}`,
            backgroundColor: currentTheme.bg,
            color: currentTheme.text,
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            fontSize: '13px',
            color: currentTheme.text
        }
    };

    // Format price with commas
    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                    .package-card:hover {
                        transform: translateY(-6px);
                        box-shadow: 0 12px 35px rgba(0,0,0,0.2);
                    }
                    button:hover {
                        transform: translateY(-2px);
                    }
                    .search-box:focus {
                        border-color: #667eea;
                        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                    }
                    .package-card {
                        animation: slideUp 0.3s ease;
                    }
                `}
            </style>

            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
                <Sidebar theme={currentTheme} isCollapsed={isCollapsed} />
                <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                    <Header
                        theme={currentTheme}
                        isDarkMode={isDarkMode}
                        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
                    />

                    <div style={styles.mainContent}>
                        {/* Header Section */}
                        <div style={styles.pageHeader}>
                            <h1 style={styles.pageTitle}>Investment Packages</h1>
                            <p style={styles.pageSubtitle}>Manage your premium investment opportunities</p>
                        </div>

                        {/* Statistics Cards */}
                        <div style={styles.statCards}>
                            <div className="stat-card" style={styles.statCard}>
                                <div style={styles.statIcon}>🏘️</div>
                                <div style={styles.statValue}>{totalPackages}</div>
                                <div style={styles.statLabel}>Total Packages</div>
                            </div>
                            <div className="stat-card" style={styles.statCard}>
                                <div style={styles.statIcon}>⭐</div>
                                <div style={styles.statValue}>{popularPackages}</div>
                                <div style={styles.statLabel}>Popular Packages</div>
                            </div>
                            <div className="stat-card" style={styles.statCard}>
                                <div style={styles.statIcon}>🔴</div>
                                <div style={styles.statValue}>{soldOutPackages}</div>
                                <div style={styles.statLabel}>Sold Out</div>
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
                                <i className="bi bi-plus-circle"></i> Add New Package
                            </button>
                        </div>

                        {/* Packages Grid */}
                        {loading ? (
                            <div style={styles.loadingSpinner}>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p style={{ marginTop: '16px' }}>Loading investment packages...</p>
                            </div>
                        ) : currentItems.length > 0 ? (
                            <>
                                <div style={styles.packagesGrid}>
                                    {currentItems.map((item) => (
                                        <div key={item.id} className="package-card" style={styles.packageCard}>
                                            {/* Status Badge */}
                                            {item.is_popular == 1 && (
                                                <div style={{ ...styles.statusBadge, backgroundColor: currentTheme.success }}>
                                                    🔥 Popular
                                                </div>
                                            )}
                                            {item.is_sold_out == 1 && (
                                                <div style={{ ...styles.statusBadge, backgroundColor: currentTheme.danger }}>
                                                    ❌ Sold Out
                                                </div>
                                            )}

                                            {/* Discount Badge */}
                                            {item.discount && item.discount > 0 && (
                                                <div style={styles.discountBadge}>
                                                    {item.discount}% OFF
                                                </div>
                                            )}

                                            {/* Package Images */}
                                            {item.images && item.images.length > 0 && (
                                                <div
                                                    style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: item.images.length > 1
                                                            ? 'repeat(2, 1fr)'
                                                            : '1fr',
                                                        gap: '2px',
                                                        height: '220px',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {item.images.slice(0, 4).map((img, index) => (
                                                        <img
                                                            key={index}
                                                            src={img}
                                                            alt="package"
                                                            style={{
                                                                width: '100%',
                                                                height: '220px',
                                                                objectFit: 'cover'
                                                            }}
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/400x220?text=No+Image';
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            {/* Card Header */}
                                            <div style={styles.cardHeader}>
                                                <h3 style={styles.packageTitle}>{item.title}</h3>
                                                <div>
                                                    <span style={styles.packagePrice}>${formatPrice(item.price)}</span>
                                                    {item.discount && item.discount > 0 && (
                                                        <span style={styles.originalPrice}>
                                                            ${formatPrice(Math.floor(Number(item.price) * (1 + Number(item.discount) / 100)))}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Card Body */}
                                            <div style={styles.cardBody}>
                                                <div style={styles.infoRow}>
                                                    <span style={styles.infoLabel}>Land Size</span>
                                                    <span style={styles.infoValue}>{item.land || 'N/A'} sqft</span>
                                                </div>
                                                <div style={styles.infoRow}>
                                                    <span style={styles.infoLabel}>Building Size</span>
                                                    <span style={styles.infoValue}>{item.building || 'N/A'} sqft</span>
                                                </div>
                                                <div style={styles.infoRow}>
                                                    <span style={styles.infoLabel}>Total Size</span>
                                                    <span style={styles.infoValue}>{item.total_size || 'N/A'} sqft</span>
                                                </div>
                                                {item.description && (
                                                    <div style={styles.description}>
                                                        <strong>Description:</strong><br />
                                                        {item.description}
                                                    </div>
                                                )}

                                                {/* Action Buttons */}
                                                <div style={styles.cardActions}>
                                                    <button
                                                        style={{ ...styles.actionBtn, ...styles.editBtn }}
                                                        onClick={() => openModal(item)}
                                                    >
                                                        <i className="bi bi-pencil"></i> Edit
                                                    </button>
                                                    <button
                                                        style={{ ...styles.actionBtn, ...styles.deleteBtn }}
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
                                            style={{ ...styles.pageBtn, ...(currentPage === 1 && { opacity: 0.5, cursor: 'not-allowed' }) }}
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
                                            style={{ ...styles.pageBtn, ...(currentPage === totalPages && { opacity: 0.5, cursor: 'not-allowed' }) }}
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
                                <h4>No Investment Packages Found</h4>
                                <p style={{ color: currentTheme.textLight, marginBottom: '20px' }}>
                                    {searchTerm ? `No results found for "${searchTerm}"` : 'Start by adding your first investment package'}
                                </p>
                                {!searchTerm && (
                                    <button style={styles.addBtn} onClick={() => openModal()}>
                                        <i className="bi bi-plus-circle"></i> Add New Package
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <Footer theme={currentTheme} />
                </div>
            </div>

            {/* Add/Edit Modal - FIXED: Input fields properly bind to formData */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={closeModal}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <form onSubmit={handleSave}>
                            <div style={styles.modalHeader}>
                                <h5 style={{ margin: 0, fontWeight: '600' }}>
                                    {isEditing ? "✏️ Edit" : "✨ Add"} Investment Package
                                </h5>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: currentTheme.text }}
                                >
                                    ×
                                </button>
                            </div>
                            <div style={styles.modalBody}>
                                <div className="row g-3">
                                    <div className="col-md-12">
                                        <label style={styles.label}>Package Title *</label>
                                        <input
                                            type="text"
                                            style={styles.input}
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="e.g., Premium Garden Villa"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label style={styles.label}>Price *</label>
                                        <input
                                            type="number"
                                            style={styles.input}
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="e.g., 500000"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label style={styles.label}>Discount (%)</label>
                                        <input
                                            type="number"
                                            style={styles.input}
                                            value={formData.discount}
                                            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                            placeholder="e.g., 10"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label style={styles.label}>Land Size (sqft)</label>
                                        <input
                                            type="text"
                                            style={styles.input}
                                            value={formData.land}
                                            onChange={(e) => setFormData({ ...formData, land: e.target.value })}
                                            placeholder="Land size"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label style={styles.label}>Building Size (sqft)</label>
                                        <input
                                            type="text"
                                            style={styles.input}
                                            value={formData.building}
                                            onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                                            placeholder="Building size"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label style={styles.label}>Total Size (sqft)</label>
                                        <input
                                            type="text"
                                            style={styles.input}
                                            value={formData.total_size}
                                            onChange={(e) => setFormData({ ...formData, total_size: e.target.value })}
                                            placeholder="Total size"
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label style={styles.label}>Description</label>
                                        <textarea
                                            rows="3"
                                            style={{ ...styles.input, resize: 'vertical' }}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Describe the investment package..."
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label style={styles.label}>Upload Images</label>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            style={styles.input}
                                            onChange={handleImageChange}
                                        />
                                        <small style={{ color: currentTheme.textLight, display: 'block', marginTop: '5px' }}>
                                            You can select multiple images (Max 10MB each)
                                        </small>

                                        {/* Preview Images */}
                                        {formData.imagePreview && formData.imagePreview.length > 0 && (
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                                                    gap: '10px',
                                                    marginTop: '15px'
                                                }}
                                            >
                                                {formData.imagePreview.map((img, index) => (
                                                    <div key={index} style={{ position: 'relative' }}>
                                                        <img
                                                            src={img}
                                                            alt="preview"
                                                            style={{
                                                                width: '100%',
                                                                height: '100px',
                                                                objectFit: 'cover',
                                                                borderRadius: '10px',
                                                                border: `1px solid ${currentTheme.border}`
                                                            }}
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/100x100?text=Error';
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="is_popular"
                                                checked={formData.is_popular}
                                                onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <label className="form-check-label" htmlFor="is_popular" style={{ color: currentTheme.text }}>
                                                ⭐ Mark as Popular
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="is_sold_out"
                                                checked={formData.is_sold_out}
                                                onChange={(e) => setFormData({ ...formData, is_sold_out: e.target.checked })}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <label className="form-check-label" htmlFor="is_sold_out" style={{ color: currentTheme.danger }}>
                                                🔴 Mark as Sold Out
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={styles.modalFooter}>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    style={{ ...styles.actionBtn, backgroundColor: currentTheme.border, color: currentTheme.text, padding: '10px 24px' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ ...styles.addBtn, padding: '10px 32px' }}
                                >
                                    {isEditing ? 'Update Package' : 'Save Package'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div style={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
                    <div style={{ ...styles.modal, width: '400px' }} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h5 style={{ margin: 0, fontWeight: '600' }}>Confirm Delete</h5>
                            <button onClick={() => setDeleteConfirm(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
                        </div>
                        <div style={styles.modalBody}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                                <p>Are you sure you want to delete <strong>{deleteConfirm.title}</strong>?</p>
                                <p style={{ fontSize: '13px', color: currentTheme.textLight }}>This action cannot be undone.</p>
                            </div>
                        </div>
                        <div style={styles.modalFooter}>
                            <button onClick={() => setDeleteConfirm(null)} style={{ ...styles.actionBtn, backgroundColor: currentTheme.border, color: currentTheme.text, padding: '10px 24px' }}>Cancel</button>
                            <button onClick={() => handleDelete(deleteConfirm.id)} style={{ ...styles.deleteBtn, padding: '10px 24px', border: 'none', borderRadius: '10px' }}>Delete Permanently</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Investment;