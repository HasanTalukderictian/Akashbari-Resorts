import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const PackageQuery = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [perPage] = useState(10);
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    // Toast message
    const showToast = useCallback((type, message) => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 5000);
    }, []);

    // Fetch queries
    const fetchQueries = useCallback(async () => {
        setLoading(true);
        try {
            // Build URL with query parameters
            const params = new URLSearchParams();
            params.append('page', currentPage);
            params.append('per_page', perPage);
            
            if (statusFilter !== 'all') {
                params.append('status', statusFilter);
            }
            
            if (searchTerm.trim()) {
                params.append('search', searchTerm.trim());
            }

            const url = `${BASE_URL}/package-queries?${params.toString()}`;
            
            console.log('Fetching URL:', url);

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error:', response.status, errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('API Response:', result);
            
            // Check response structure - API returns { success: true, data: { data: [], total: 1, ... } }
            if (result.success === true) {
                const responseData = result.data;
                
                // Set queries from responseData.data
                setQueries(responseData.data || []);
                setTotalPages(responseData.last_page || 1);
                setTotalItems(responseData.total || 0);
                setCurrentPage(responseData.current_page || 1);
            } else {
                showToast('error', result.message || 'Failed to load queries');
                setQueries([]);
            }
        } catch (error) {
            console.error('Error fetching queries:', error);
            showToast('error', 'Error loading data: ' + error.message);
            setQueries([]);
        } finally {
            setLoading(false);
        }
    }, [BASE_URL, currentPage, statusFilter, searchTerm, perPage, showToast]);

    // Fetch on dependency change
    useEffect(() => {
        fetchQueries();
    }, [fetchQueries]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm.trim() || searchTerm === '') {
                setCurrentPage(1);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Update status
    const updateStatus = async (id, status) => {
        try {
            const response = await fetch(`${BASE_URL}/package-queries/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            
            const result = await response.json();
            
            if (result.success === true) {
                showToast('success', `Query marked as ${status}`);
                fetchQueries();
            } else {
                showToast('error', result.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            showToast('error', 'Error updating status');
        }
    };

    // Delete query
    const deleteQuery = async () => {
        if (!deleteId) return;
        
        try {
            const response = await fetch(`${BASE_URL}/package-queries/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            const result = await response.json();
            
            if (result.success === true) {
                showToast('success', 'Query deleted successfully');
                setShowDeleteModal(false);
                setDeleteId(null);
                fetchQueries();
            } else {
                showToast('error', result.message || 'Failed to delete query');
            }
        } catch (error) {
            console.error('Error deleting query:', error);
            showToast('error', 'Error deleting query');
        }
    };

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

    // Get status badge color - query থেকে status না থাকলে pending দেখাবে
    const getStatusBadge = (status) => {
        const colors = {
            pending: { bg: '#ffc107', text: '#856404' },
            replied: { bg: '#28a745', text: '#fff' },
            closed: { bg: '#6c757d', text: '#fff' }
        };
        return colors[status] || colors.pending;
    };

    const styles = {
        container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
        mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
        contentScroll: { flex: '1 0 auto', padding: '24px' },
        footerWrapper: { flexShrink: 0 },
        card: {
            background: theme.card,
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            padding: '24px',
            transition: 'all 0.3s ease'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px'
        },
        th: {
            textAlign: 'left',
            padding: '12px 16px',
            borderBottom: `2px solid ${theme.border}`,
            color: theme.text,
            fontWeight: '600',
            textTransform: 'uppercase',
            fontSize: '12px',
            letterSpacing: '0.5px'
        },
        td: {
            padding: '12px 16px',
            borderBottom: `1px solid ${theme.border}`,
            color: theme.text,
            verticalAlign: 'middle'
        },
        searchInput: {
            padding: '8px 16px',
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
            background: theme.isDarkMode ? '#2d3436' : '#fff',
            color: theme.text,
            outline: 'none',
            width: '250px',
            fontSize: '14px'
        },
        select: {
            padding: '8px 16px',
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
            background: theme.isDarkMode ? '#2d3436' : '#fff',
            color: theme.text,
            outline: 'none',
            fontSize: '14px'
        },
        actionBtn: {
            padding: '6px 12px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '12px',
            cursor: 'pointer',
            marginRight: '6px',
            transition: 'all 0.2s ease'
        }
    };

    return (
        <div style={styles.container} className="container-fluid p-0">
            {/* Toast */}
            {toast.show && (
                <div className="position-fixed top-0 end-0 m-3" style={{ zIndex: 9999 }}>
                    <div className={`alert alert-${toast.type === 'success' ? 'success' : 'danger'} shadow-lg border-0`} style={{ borderRadius: '12px' }}>
                        <div className="d-flex align-items-center gap-2">
                            <i className={`bi bi-${toast.type === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'}`}></i>
                            <span>{toast.message}</span>
                            <button type="button" className="btn-close" onClick={() => setToast({ show: false, message: '', type: '' })}></button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h5 className="modal-title fw-bold" style={{ color: '#dc3545' }}>
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                Confirm Delete
                            </h5>
                            <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this query? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn btn-danger" onClick={deleteQuery}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {showDetailsModal && selectedQuery && (
                <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
                    <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h5 className="modal-title fw-bold" style={{ color: '#5e2e10' }}>
                                <i className="bi bi-info-circle-fill me-2"></i>
                                Query Details
                            </h5>
                            <button type="button" className="btn-close" onClick={() => setShowDetailsModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="bg-light p-3 rounded-3">
                                        <small className="text-muted d-block">Package Name</small>
                                        <strong>{selectedQuery.package_name}</strong>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="bg-light p-3 rounded-3">
                                        <small className="text-muted d-block">Status</small>
                                        <span className="badge" style={{
                                            background: getStatusBadge(selectedQuery.status || 'pending').bg,
                                            color: getStatusBadge(selectedQuery.status || 'pending').text,
                                            padding: '6px 12px',
                                            borderRadius: '20px'
                                        }}>
                                            {(selectedQuery.status || 'pending').toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="bg-light p-3 rounded-3">
                                        <small className="text-muted d-block">Name</small>
                                        <strong>{selectedQuery.name}</strong>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="bg-light p-3 rounded-3">
                                        <small className="text-muted d-block">Phone</small>
                                        <strong>{selectedQuery.phone}</strong>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="bg-light p-3 rounded-3">
                                        <small className="text-muted d-block">Email</small>
                                        <strong>{selectedQuery.email}</strong>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="bg-light p-3 rounded-3">
                                        <small className="text-muted d-block">Message</small>
                                        <p className="mb-0 mt-1" style={{ whiteSpace: 'pre-wrap' }}>{selectedQuery.message}</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="bg-light p-3 rounded-3">
                                        <small className="text-muted d-block">Submitted At</small>
                                        <strong>{new Date(selectedQuery.created_at).toLocaleString()}</strong>
                                    </div>
                                </div>
                                {selectedQuery.replied_at && (
                                    <div className="col-md-6">
                                        <div className="bg-light p-3 rounded-3">
                                            <small className="text-muted d-block">Replied At</small>
                                            <strong>{new Date(selectedQuery.replied_at).toLocaleString()}</strong>
                                        </div>
                                    </div>
                                )}
                                {selectedQuery.admin_notes && (
                                    <div className="col-12">
                                        <div className="bg-light p-3 rounded-3">
                                            <small className="text-muted d-block">Admin Notes</small>
                                            <p className="mb-0 mt-1">{selectedQuery.admin_notes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="queries" />

                <div style={styles.mainArea} className="flex-grow-1">
                    <Header 
                        theme={theme} 
                        isDarkMode={isDarkMode} 
                        toggleDarkMode={toggleDarkMode} 
                        toggleSidebar={toggleSidebar} 
                    />

                    <div style={styles.contentContainer}>
                        <div style={styles.contentScroll}>
                            <div style={styles.card}>
                                {/* Header */}
                                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                                    <div>
                                        <h4 className="fw-bold mb-1" style={{ color: theme.text }}>
                                            <i className="bi bi-chat-dots-fill me-2" style={{ color: '#5e2e10' }}></i>
                                            Package Queries
                                        </h4>
                                        <small className="text-muted">Manage all package inquiries from customers</small>
                                    </div>
                                    <div className="d-flex gap-2 mt-2 mt-sm-0">
                                        <button 
                                            className="btn btn-sm" 
                                            style={{ background: '#5e2e10', color: '#fff' }}
                                            onClick={fetchQueries}
                                        >
                                            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                                        </button>
                                    </div>
                                </div>

                                {/* Filters */}
                                <div className="d-flex flex-wrap gap-3 mb-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Search by name, email, phone..."
                                            style={styles.searchInput}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <select
                                            style={styles.select}
                                            value={statusFilter}
                                            onChange={(e) => {
                                                setStatusFilter(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <option value="all">All Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="replied">Replied</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>
                                    <div className="ms-auto">
                                        <span className="text-muted">
                                            Total: {totalItems} queries
                                        </span>
                                    </div>
                                </div>

                                {/* Table */}
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border" style={{ color: '#5e2e10' }} role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-2 text-muted">Loading queries...</p>
                                    </div>
                                ) : queries.length === 0 ? (
                                    <div className="text-center py-5">
                                        <i className="bi bi-inbox" style={{ fontSize: '48px', color: '#ccc' }}></i>
                                        <p className="mt-3 text-muted">No queries found</p>
                                        <small className="text-muted">Try adjusting your search or filter</small>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table style={styles.table}>
                                            <thead>
                                                <tr>
                                                    <th style={styles.th}>#</th>
                                                    <th style={styles.th}>Package</th>
                                                    <th style={styles.th}>Name</th>
                                                    <th style={styles.th}>Email</th>
                                                    <th style={styles.th}>Phone</th>
                                                    <th style={styles.th}>Status</th>
                                                    <th style={styles.th}>Date</th>
                                                    <th style={styles.th}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {queries.map((query, index) => {
                                                    const status = query.status || 'pending';
                                                    const statusBadge = getStatusBadge(status);
                                                    return (
                                                        <tr key={query.id}>
                                                            <td style={styles.td}>{(currentPage - 1) * perPage + index + 1}</td>
                                                            <td style={styles.td}>
                                                                <span className="fw-medium" style={{ color: '#5e2e10' }}>
                                                                    {query.package_name}
                                                                </span>
                                                            </td>
                                                            <td style={styles.td}>{query.name}</td>
                                                            <td style={styles.td}>
                                                                <a href={`mailto:${query.email}`} style={{ color: '#5e2e10', textDecoration: 'none' }}>
                                                                    {query.email}
                                                                </a>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <a href={`tel:${query.phone}`} style={{ color: theme.text, textDecoration: 'none' }}>
                                                                    {query.phone}
                                                                </a>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <span className="badge" style={{
                                                                    background: statusBadge.bg,
                                                                    color: statusBadge.text,
                                                                    padding: '4px 12px',
                                                                    borderRadius: '20px',
                                                                    fontSize: '11px',
                                                                    fontWeight: '500'
                                                                }}>
                                                                    {status.toUpperCase()}
                                                                </span>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <small>{new Date(query.created_at).toLocaleDateString()}</small>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <div className="d-flex flex-wrap gap-1">
                                                                    <button
                                                                        style={{
                                                                            ...styles.actionBtn,
                                                                            background: '#17a2b8',
                                                                            color: '#fff'
                                                                        }}
                                                                        onClick={() => {
                                                                            setSelectedQuery(query);
                                                                            setShowDetailsModal(true);
                                                                        }}
                                                                        title="View Details"
                                                                    >
                                                                        <i className="bi bi-eye"></i>
                                                                    </button>
                                                                    
                                                                    {status === 'pending' && (
                                                                        <button
                                                                            style={{
                                                                                ...styles.actionBtn,
                                                                                background: '#28a745',
                                                                                color: '#fff'
                                                                            }}
                                                                            onClick={() => updateStatus(query.id, 'replied')}
                                                                            title="Mark as Replied"
                                                                        >
                                                                            <i className="bi bi-check2"></i>
                                                                        </button>
                                                                    )}
                                                                    
                                                                    {status !== 'closed' && (
                                                                        <button
                                                                            style={{
                                                                                ...styles.actionBtn,
                                                                                background: '#6c757d',
                                                                                color: '#fff'
                                                                            }}
                                                                            onClick={() => updateStatus(query.id, 'closed')}
                                                                            title="Mark as Closed"
                                                                        >
                                                                            <i className="bi bi-x-lg"></i>
                                                                        </button>
                                                                    )}
                                                                    
                                                                    <button
                                                                        style={{
                                                                            ...styles.actionBtn,
                                                                            background: '#dc3545',
                                                                            color: '#fff'
                                                                        }}
                                                                        onClick={() => {
                                                                            setDeleteId(query.id);
                                                                            setShowDeleteModal(true);
                                                                        }}
                                                                        title="Delete"
                                                                    >
                                                                        <i className="bi bi-trash"></i>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-between align-items-center mt-4">
                                        <small className="text-muted">
                                            Page {currentPage} of {totalPages}
                                        </small>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                            >
                                                <i className="bi bi-chevron-left"></i>
                                            </button>
                                            <span className="px-3 py-1 bg-light rounded" style={{ lineHeight: '2' }}>
                                                {currentPage}
                                            </span>
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                            >
                                                <i className="bi bi-chevron-right"></i>
                                            </button>
                                        </div>
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

            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9998;
                    animation: fadeIn 0.3s ease;
                    padding: 20px;
                }
                
                .modal-container {
                    background: white;
                    border-radius: 16px;
                    max-width: 600px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: slideUp 0.3s ease;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                }
                
                .modal-container.modal-lg {
                    max-width: 700px;
                }
                
                .modal-header {
                    padding: 20px 24px 16px;
                    border-bottom: 1px solid #e9ecef;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: sticky;
                    top: 0;
                    background: white;
                    border-radius: 16px 16px 0 0;
                    z-index: 1;
                }
                
                .modal-title {
                    font-size: 1.1rem;
                    margin: 0;
                }
                
                .modal-body {
                    padding: 20px 24px 24px;
                }
                
                .modal-footer {
                    padding: 16px 24px 20px;
                    border-top: 1px solid #e9ecef;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @media (max-width: 768px) {
                    .modal-container {
                        margin: 10px;
                        border-radius: 12px;
                    }
                    
                    .modal-header {
                        padding: 16px 18px 12px;
                    }
                    
                    .modal-body {
                        padding: 16px 18px 20px;
                    }
                    
                    .modal-footer {
                        padding: 12px 18px 16px;
                    }
                }
            `}</style>
        </div>
    );
};

export default PackageQuery;