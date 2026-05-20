import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const OwnerBenefit = ({ theme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [authError, setAuthError] = useState(null);
    const itemsPerPage = 6;
    
    const [benefits, setBenefits] = useState([]);
    const [formData, setFormData] = useState({ id: '', title: '', desc: '' });
    const [isEditing, setIsEditing] = useState(false);

    const API_BASE = import.meta.env.VITE_BASE_URL;

    // Get authentication headers
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Role': localStorage.getItem('Role') || 'admin'
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

    const fetchBenefits = async () => {
        if (!checkAuth()) return;
        
        try {
            setLoading(true);
            setAuthError(null);
            
            const headers = getAuthHeaders();
            const response = await fetch(`${API_BASE}/get-property-benifit`, {
                method: 'GET',
                headers: headers
            });
            
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                setAuthError("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }
            
            const result = await response.json();
            
            if (result.status && result.data && Array.isArray(result.data.data)) {
                setBenefits(result.data.data);
            } else {
                setBenefits([]);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setBenefits([]);
            setAuthError("Failed to fetch benefits. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBenefits();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!checkAuth()) return;
        
        const url = isEditing 
            ? `${API_BASE}/edit-property-benifit/${formData.id}` 
            : `${API_BASE}/add-property-benifit`;

        try {
            setLoading(true);
            const headers = getAuthHeaders();
            
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    title: formData.title,
                    desc: formData.desc
                }),
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                setAuthError("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }

            const result = await response.json();

            if (result.status) {
                await fetchBenefits(); 
                closeModal();
            } else {
                alert(result.message || result.error || "Error saving data");
            }
        } catch (error) {
            console.error("Save error:", error);
            alert(error.message || "Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!checkAuth()) return;
        
        try {
            setLoading(true);
            const headers = getAuthHeaders();
            
            const response = await fetch(`${API_BASE}/delete-property-benifit/${id}`, {
                method: 'DELETE',
                headers: headers
            });
            
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                setAuthError("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }
            
            const result = await response.json();
            if (result.status) {
                await fetchBenefits();
                setDeleteConfirm(null);
            } else {
                alert(result.message || "Error deleting benefit");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete benefit. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const openModal = (item = null) => {
        if (item) {
            setFormData({ id: item.id, title: item.title, desc: item.desc });
            setIsEditing(true);
        } else {
            setFormData({ id: '', title: '', desc: '' });
            setIsEditing(false);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({ id: '', title: '', desc: '' });
        setIsEditing(false);
    };

    // Filter and Pagination
    const filteredBenefits = benefits.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.desc?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBenefits.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBenefits.length / itemsPerPage);

    // Statistics
    const totalBenefits = benefits.length;

    const currentTheme = theme || {
        isDarkMode,
        bg: isDarkMode ? '#0f0f1a' : '#f8f9fc',
        card: isDarkMode ? '#1a1a2e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#2c3e50',
        textLight: isDarkMode ? '#a0a0a0' : '#6c757d',
        border: isDarkMode ? '#2d2d3d' : '#e9ecef',
        primary: '#9a55ff',
        primaryGradient: 'linear-gradient(135deg, #9a55ff 0%, #c084fc 100%)',
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
            background: currentTheme.primaryGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
        },
        pageSubtitle: {
            color: currentTheme.textLight,
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
            background: currentTheme.primaryGradient,
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
            background: currentTheme.primaryGradient,
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
        benefitsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px',
            marginBottom: '30px'
        },
        benefitCard: {
            backgroundColor: currentTheme.card,
            borderRadius: '20px',
            overflow: 'hidden',
            border: `1px solid ${currentTheme.border}`,
            transition: 'all 0.3s ease',
            position: 'relative'
        },
        cardHeader: {
            padding: '20px',
            background: currentTheme.primaryGradient,
            color: 'white'
        },
        benefitTitle: {
            fontSize: '18px',
            fontWeight: '700',
            marginBottom: '0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        cardBody: {
            padding: '20px'
        },
        benefitDesc: {
            fontSize: '14px',
            color: currentTheme.textLight,
            lineHeight: '1.6',
            marginBottom: '16px'
        },
        cardActions: {
            display: 'flex',
            gap: '10px',
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
            background: currentTheme.primaryGradient,
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
            width: '500px',
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
        textarea: {
            width: '100%',
            padding: '10px 14px',
            borderRadius: '10px',
            border: `1px solid ${currentTheme.border}`,
            backgroundColor: currentTheme.bg,
            color: currentTheme.text,
            fontSize: '14px',
            outline: 'none',
            resize: 'vertical',
            minHeight: '100px'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            fontSize: '13px',
            color: currentTheme.text
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
                    @keyframes slideInRight {
                        from { transform: translateX(100px); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    .stat-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 8px 25px rgba(154, 85, 255, 0.15);
                    }
                    .benefit-card:hover {
                        transform: translateY(-6px);
                        box-shadow: 0 12px 35px rgba(0,0,0,0.2);
                    }
                    button:hover {
                        transform: translateY(-2px);
                    }
                    .search-box:focus {
                        border-color: #9a55ff;
                        box-shadow: 0 0 0 3px rgba(154, 85, 255, 0.1);
                    }
                    .benefit-card {
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
                            <h1 style={styles.pageTitle}>Owner Benefits</h1>
                            <p style={styles.pageSubtitle}>Manage property owner benefits and incentives</p>
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
                                <div style={styles.statIcon}>🎁</div>
                                <div style={styles.statValue}>{totalBenefits}</div>
                                <div style={styles.statLabel}>Total Benefits</div>
                            </div>
                            <div className="stat-card" style={styles.statCard}>
                                <div style={styles.statIcon}>⭐</div>
                                <div style={styles.statValue}>Premium</div>
                                <div style={styles.statLabel}>Quality</div>
                            </div>
                            <div className="stat-card" style={styles.statCard}>
                                <div style={styles.statIcon}>💎</div>
                                <div style={styles.statValue}>Exclusive</div>
                                <div style={styles.statLabel}>Offers</div>
                            </div>
                        </div>

                        {/* Toolbar */}
                        <div style={styles.toolbar}>
                            <input
                                type="text"
                                placeholder="🔍 Search by title or description..."
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
                                disabled={loading}
                            >
                                <i className="bi bi-plus-circle"></i> Add New Benefit
                            </button>
                        </div>

                        {/* Benefits Grid */}
                        {loading && benefits.length === 0 ? (
                            <div style={styles.loadingSpinner}>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p style={{ marginTop: '16px' }}>Loading benefits...</p>
                            </div>
                        ) : currentItems.length > 0 ? (
                            <>
                                <div style={styles.benefitsGrid}>
                                    {currentItems.map((item) => (
                                        <div key={item.id} className="benefit-card" style={styles.benefitCard}>
                                            <div style={styles.cardHeader}>
                                                <div style={styles.benefitTitle}>
                                                    <i className="bi bi-gift-fill"></i>
                                                    {item.title}
                                                </div>
                                            </div>
                                            <div style={styles.cardBody}>
                                                <p style={styles.benefitDesc}>
                                                    {item.desc}
                                                </p>
                                                <div style={styles.cardActions}>
                                                    <button 
                                                        style={{...styles.actionBtn, ...styles.editBtn}}
                                                        onClick={() => openModal(item)}
                                                        disabled={loading}
                                                    >
                                                        <i className="bi bi-pencil"></i> Edit
                                                    </button>
                                                    <button 
                                                        style={{...styles.actionBtn, ...styles.deleteBtn}}
                                                        onClick={() => setDeleteConfirm(item)}
                                                        disabled={loading}
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
                                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎁</div>
                                <h4>No Benefits Found</h4>
                                <p style={{ color: currentTheme.textLight, marginBottom: '20px' }}>
                                    {searchTerm ? `No results found for "${searchTerm}"` : 'Start by adding your first benefit'}
                                </p>
                                {!searchTerm && (
                                    <button style={styles.addBtn} onClick={() => openModal()}>
                                        <i className="bi bi-plus-circle"></i> Add New Benefit
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <Footer theme={currentTheme} />
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={closeModal}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h5 style={{ margin: 0, fontWeight: '600' }}>
                                {isEditing ? '✏️ Edit Benefit' : '✨ Add New Benefit'}
                            </h5>
                            <button 
                                onClick={closeModal}
                                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: currentTheme.text }}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div style={styles.modalBody}>
                                <div className="mb-3">
                                    <label style={styles.label}>Benefit Title *</label>
                                    <input 
                                        type="text" 
                                        style={styles.input}
                                        value={formData.title}
                                        required
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        placeholder="Enter benefit title"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label style={styles.label}>Description *</label>
                                    <textarea 
                                        style={styles.textarea}
                                        value={formData.desc}
                                        required
                                        onChange={(e) => setFormData({...formData, desc: e.target.value})}
                                        placeholder="Enter benefit description"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div style={styles.modalFooter}>
                                <button 
                                    type="button" 
                                    onClick={closeModal}
                                    style={{...styles.actionBtn, backgroundColor: currentTheme.border, color: currentTheme.text, padding: '10px 24px'}}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    style={{...styles.addBtn, padding: '10px 32px', ...(loading && styles.buttonDisabled)}}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            {isEditing ? 'Updating...' : 'Saving...'}
                                        </>
                                    ) : (
                                        isEditing ? 'Update Benefit' : 'Save Benefit'
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
                                <p style={{ fontSize: '13px', color: currentTheme.textLight }}>This action cannot be undone.</p>
                            </div>
                        </div>
                        <div style={styles.modalFooter}>
                            <button 
                                onClick={() => setDeleteConfirm(null)} 
                                style={{...styles.actionBtn, backgroundColor: currentTheme.border, color: currentTheme.text, padding: '10px 24px'}}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => handleDelete(deleteConfirm.id)} 
                                style={{...styles.deleteBtn, padding: '10px 24px', border: 'none', borderRadius: '10px', ...(loading && styles.buttonDisabled)}}
                                disabled={loading}
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerBenefit;