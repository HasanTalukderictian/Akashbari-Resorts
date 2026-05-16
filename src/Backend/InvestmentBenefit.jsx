import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import axios from 'axios';

const InvestmentBenefit = ({ theme: dashboardTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [benefitsList, setBenefitsList] = useState([]); 
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const itemsPerPage = 5;

    const BASE_URL = import.meta.env.VITE_BASE_URL;


    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        benefits: [''] 
    });

    const theme = {
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

    // Fetch Benefits
    const fetchBenefits = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/get-investment-benefits`);
            const data = response.data.data.data || response.data.data || [];
            setBenefitsList(data);
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBenefits();
    }, []);

    // Delete Function
    const handleDelete = async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/del-investment-benefits/${id}`);
            if (response.data.status) {
                fetchBenefits();
                setDeleteConfirm(null);
            }
        } catch (error) {
            console.error("Delete Error:", error);
        }
    };

    // Submit Function
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let response;
            if (editId) {
                response = await axios.post(`${BASE_URL}/edit-investment-benefits/${editId}`, formData);
            } else {
                response = await axios.post(`${BASE_URL}/investment-benefits`, formData);
            }

            if (response.data.status) {
                resetForm();
                fetchBenefits();
            }
        } catch (error) {
            console.error("Submit Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setFormData({
            title: item.title,
            subtitle: item.subtitle,
            benefits: Array.isArray(item.benefits) ? item.benefits : [item.benefits]
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({ title: '', subtitle: '', benefits: [''] });
        setEditId(null);
        setShowModal(false);
    };

    const handleBenefitChange = (index, value) => {
        const newBenefits = [...formData.benefits];
        newBenefits[index] = value;
        setFormData({ ...formData, benefits: newBenefits });
    };

    // Filter and Pagination
    const filteredBenefits = benefitsList.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBenefits.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBenefits.length / itemsPerPage);

    // Styles
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
        tableContainer: {
            backgroundColor: theme.card,
            borderRadius: '20px',
            border: `1px solid ${theme.border}`,
            overflow: 'hidden',
            transition: 'all 0.3s ease'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        th: {
            padding: '16px 20px',
            textAlign: 'left',
            backgroundColor: isDarkMode ? '#25253a' : '#f8f9fa',
            color: theme.text,
            fontWeight: '600',
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            borderBottom: `1px solid ${theme.border}`
        },
        td: {
            padding: '16px 20px',
            color: theme.text,
            borderBottom: `1px solid ${theme.border}`,
            fontSize: '14px'
        },
        benefitsList: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
        },
        benefitBadge: {
            background: `${theme.accent}20`,
            color: theme.accent,
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '500'
        },
        actionBtn: {
            padding: '8px 12px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s',
            margin: '0 4px'
        },
        editBtn: {
            backgroundColor: `${theme.accent}20`,
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
            marginTop: '30px'
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
        modalOverlay: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(8px)'
        },
        modal: {
            backgroundColor: theme.card,
            borderRadius: '24px',
            width: '600px',
            maxWidth: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
        },
        modalHeader: {
            padding: '24px',
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
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
            padding: '12px 16px',
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
            backgroundColor: isDarkMode ? '#25253a' : '#ffffff',
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

    // Statistics
    const totalBenefits = benefitsList.length;
    const totalBenefitItems = benefitsList.reduce((sum, item) => sum + (item.benefits?.length || 0), 0);

    return (
        <div style={styles.container}>
            <div className="d-flex" style={{ minHeight: '100vh', overflow: 'hidden' }}>
                <Sidebar theme={theme} isCollapsed={isCollapsed} />

                <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0, height: '100vh', overflow: 'hidden' }}>
                    <Header 
                        theme={theme}
                        isDarkMode={isDarkMode}
                        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
                    />

                    <div style={styles.mainContent}>
                        {/* Header Section */}
                        <div style={styles.pageHeader}>
                            <h1 style={styles.pageTitle}>Investment Benefits</h1>
                            <p style={styles.pageSubtitle}>Manage your investment benefits and features</p>
                        </div>

                        {/* Statistics Cards */}
                        <div style={styles.statCards}>
                            <div style={styles.statCard}>
                                <div style={styles.statIcon}>📊</div>
                                <div style={styles.statValue}>{totalBenefits}</div>
                                <div style={styles.statLabel}>Total Benefit Packages</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statIcon}>✨</div>
                                <div style={styles.statValue}>{totalBenefitItems}</div>
                                <div style={styles.statLabel}>Total Benefits</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statIcon}>🎯</div>
                                <div style={styles.statValue}>24/7</div>
                                <div style={styles.statLabel}>Active Support</div>
                            </div>
                        </div>

                        {/* Toolbar */}
                        <div style={styles.toolbar}>
                            <input
                                type="text"
                                placeholder="🔍 Search by title or subtitle..."
                                style={styles.searchBox}
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            <button 
                                style={styles.addBtn}
                                onClick={() => { resetForm(); setShowModal(true); }}
                            >
                                <i className="bi bi-plus-circle-fill"></i> Add New Benefit
                            </button>
                        </div>

                        {/* Table */}
                        <div style={styles.tableContainer}>
                            {loading ? (
                                <div style={styles.loadingSpinner}>
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p style={{ marginTop: '16px' }}>Loading benefits...</p>
                                </div>
                            ) : currentItems.length > 0 ? (
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>#</th>
                                            <th style={styles.th}>Title</th>
                                            <th style={styles.th}>Subtitle</th>
                                            <th style={styles.th}>Benefits</th>
                                            <th style={styles.th}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((item, idx) => (
                                            <tr key={item.id}>
                                                <td style={styles.td}>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                                <td style={styles.td}>
                                                    <strong>{item.title}</strong>
                                                </td>
                                                <td style={styles.td}>{item.subtitle}</td>
                                                <td style={styles.td}>
                                                    <div style={styles.benefitsList}>
                                                        {Array.isArray(item.benefits) && item.benefits.slice(0, 3).map((b, i) => (
                                                            <span key={i} style={styles.benefitBadge}>
                                                                {b}
                                                            </span>
                                                        ))}
                                                        {item.benefits?.length > 3 && (
                                                            <span style={styles.benefitBadge}>
                                                                +{item.benefits.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td style={styles.td}>
                                                    <button
                                                        style={{...styles.actionBtn, ...styles.editBtn}}
                                                        onClick={() => handleEdit(item)}
                                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                    <button
                                                        style={{...styles.actionBtn, ...styles.deleteBtn}}
                                                        onClick={() => setDeleteConfirm(item)}
                                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div style={styles.emptyState}>
                                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
                                    <h4>No Benefits Found</h4>
                                    <p style={{ color: theme.textLight }}>Click "Add New Benefit" to create your first benefit package</p>
                                </div>
                            )}
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
                    </div>

                    <Footer theme={theme} />
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={resetForm}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={{ margin: 0, fontWeight: '600' }}>
                                {editId ? 'Edit Benefit Package' : 'Add New Benefit Package'}
                            </h3>
                            <button 
                                onClick={resetForm}
                                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: theme.text }}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={styles.modalBody}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={styles.label}>Title *</label>
                                    <input
                                        type="text"
                                        style={styles.input}
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        placeholder="Enter benefit title"
                                        required
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={styles.label}>Subtitle *</label>
                                    <input
                                        type="text"
                                        style={styles.input}
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                                        placeholder="Enter benefit subtitle"
                                        required
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={styles.label}>Benefits List</label>
                                    {formData.benefits.map((benefit, index) => (
                                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                            <input
                                                type="text"
                                                style={{...styles.input, flex: 1}}
                                                value={benefit}
                                                onChange={(e) => handleBenefitChange(index, e.target.value)}
                                                placeholder={`Benefit ${index + 1}`}
                                                required
                                            />
                                            {formData.benefits.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({...formData, benefits: formData.benefits.filter((_, i) => i !== index)})}
                                                    style={{...styles.actionBtn, ...styles.deleteBtn, padding: '0 16px'}}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setFormData({...formData, benefits: [...formData.benefits, '']})}
                                        style={{...styles.addBtn, marginTop: '10px', padding: '8px 16px', fontSize: '12px'}}
                                    >
                                        + Add Another Benefit
                                    </button>
                                </div>
                            </div>
                            <div style={styles.modalFooter}>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    style={{...styles.actionBtn, backgroundColor: theme.border, color: theme.text, padding: '10px 24px'}}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{...styles.addBtn, padding: '10px 24px'}}
                                >
                                    {editId ? 'Update Benefit' : 'Save Benefit'}
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
                            <h3 style={{ margin: 0, fontWeight: '600' }}>Confirm Delete</h3>
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
                            <button onClick={() => handleDelete(deleteConfirm.id)} style={{...styles.deleteBtn, padding: '10px 24px', border: 'none', borderRadius: '8px'}}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvestmentBenefit;