import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const JobQuery = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    // State variables
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    
    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedApplication, setSelectedApplication] = useState(null);
    
    // Modal states
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    
    // Edit form state
    const [editFormData, setEditFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        cover_letter: '',
        status: 'pending',
        admin_note: ''
    });

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2',
        sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b'
    };

    const API_URL = 'https://backend.akashbariresort.com/api';
    const STORAGE_URL = 'https://backend.akashbariresort.com/storage';

    // Status options
    const statusOptions = [
        { value: 'pending', label: 'Pending', color: '#ffc107' },
        { value: 'reviewing', label: 'Reviewing', color: '#17a2b8' },
        { value: 'shortlisted', label: 'Shortlisted', color: '#28a745' },
        { value: 'rejected', label: 'Rejected', color: '#dc3545' },
        { value: 'hired', label: 'Hired', color: '#6f42c1' }
    ];

    // Fetch all applications
    const fetchApplications = async () => {
        setLoading(true);
        setError(null);
        try {
            let url = `${API_URL}/applications?`;
            if (searchTerm) {
                url += `search=${encodeURIComponent(searchTerm)}&`;
            }
            if (statusFilter) {
                url += `status=${statusFilter}&`;
            }
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch applications');
            }
            const data = await response.json();
            const applicationsData = data.data?.data || data.data || [];
            setApplications(applicationsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [searchTerm, statusFilter]);

    // Auto-hide success message
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    // Get status badge style
    const getStatusStyle = (status) => {
        const option = statusOptions.find(s => s.value === status);
        return {
            backgroundColor: option?.color || '#6c757d',
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            display: 'inline-block'
        };
    };

    // Get full resume URL
    const getResumeUrl = (resumePath) => {
        if (!resumePath) return null;
        let cleanPath = resumePath.replace(/^public\//, '');
        return `${STORAGE_URL}/${cleanPath}`;
    };

    // View application details
    const viewApplication = async (id) => {
        try {
            const response = await fetch(`${API_URL}/applications/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch application details');
            }
            const data = await response.json();
            setSelectedApplication(data.data);
            setShowDetailModal(true);
        } catch (err) {
            setError(err.message);
        }
    };

    // Open edit modal
    const openEditModal = (application) => {
        setSelectedApplication(application);
        setEditFormData({
            full_name: application.full_name || '',
            email: application.email || '',
            phone: application.phone || '',
            position: application.position || '',
            experience: application.experience || '',
            cover_letter: application.cover_letter || '',
            status: application.status || 'pending',
            admin_note: application.admin_note || ''
        });
        setShowEditModal(true);
    };

    // Open status modal
    const openStatusModal = (application) => {
        setSelectedApplication(application);
        setEditFormData({
            ...editFormData,
            status: application.status || 'pending'
        });
        setShowStatusModal(true);
    };

    // Handle edit form change
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    // Update application - FIXED
    const handleUpdateApplication = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/applications/${selectedApplication.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(editFormData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update application');
            }

            const data = await response.json();
            console.log('Update response:', data);
            
            setSuccessMessage('Application updated successfully!');
            setShowEditModal(false);
            setSelectedApplication(null);
            fetchApplications(); // Refresh the list
        } catch (err) {
            console.error('Update error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Update status only - FIXED
    const handleUpdateStatus = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/applications/${selectedApplication.id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ status: editFormData.status }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update status');
            }

            const data = await response.json();
            console.log('Status update response:', data);
            
            setSuccessMessage('Status updated successfully!');
            setShowStatusModal(false);
            setSelectedApplication(null);
            fetchApplications(); // Refresh the list
        } catch (err) {
            console.error('Status update error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Delete application - FIXED
    const handleDeleteApplication = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/applications/${selectedApplication.id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete application');
            }

            const data = await response.json();
            console.log('Delete response:', data);
            
            setSuccessMessage('Application deleted successfully!');
            setShowDeleteModal(false);
            setSelectedApplication(null);
            fetchApplications(); // Refresh the list
        } catch (err) {
            console.error('Delete error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // View PDF in modal
    const viewPdf = (resumePath) => {
        if (!resumePath) {
            setError('No resume found');
            return;
        }
        const url = getResumeUrl(resumePath);
        setPdfUrl(url);
        setShowPdfModal(true);
    };

    // Download resume
    const downloadResume = (resumePath, fileName) => {
        if (!resumePath) {
            setError('No resume found');
            return;
        }

        try {
            const url = getResumeUrl(resumePath);
            console.log('Downloading from:', url);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName || 'resume.pdf';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setSuccessMessage('Resume downloaded successfully!');
        } catch (err) {
            console.error('Download error:', err);
            setError('Failed to download resume: ' + err.message);
        }
    };

    const styles = {
        container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
        mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
        contentScroll: { flex: '1 0 auto', padding: '24px' },
        footerWrapper: { flexShrink: 0 }
    };

    // Modal Styles
    const modalStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
            padding: '20px',
            animation: 'fadeIn 0.3s ease'
        },
        modal: {
            backgroundColor: theme.card,
            borderRadius: '16px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            animation: 'slideIn 0.3s ease'
        },
        pdfModal: {
            backgroundColor: theme.card,
            borderRadius: '16px',
            maxWidth: '90vw',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            animation: 'slideIn 0.3s ease'
        },
        header: {
            padding: '20px 24px',
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
            borderRadius: '16px 16px 0 0'
        },
        body: {
            padding: '24px',
            overflowY: 'auto',
            flex: '1 1 auto',
            maxHeight: 'calc(90vh - 140px)'
        },
        pdfBody: {
            padding: '0',
            overflowY: 'auto',
            flex: '1 1 auto',
            height: 'calc(90vh - 80px)',
            backgroundColor: '#f5f5f5'
        },
        footer: {
            padding: '16px 24px',
            borderTop: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            flexShrink: 0,
            borderRadius: '0 0 16px 16px'
        },
        closeButton: {
            background: 'transparent',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            color: theme.text,
            padding: '0 8px',
            lineHeight: '1',
            opacity: 0.7,
            transition: 'opacity 0.2s'
        },
        input: {
            backgroundColor: theme.bg,
            color: theme.text,
            border: `1px solid ${theme.border}`,
            borderRadius: '8px',
            padding: '10px 14px',
            width: '100%',
            fontSize: '14px',
            transition: 'border-color 0.2s'
        },
        select: {
            backgroundColor: theme.bg,
            color: theme.text,
            border: `1px solid ${theme.border}`,
            borderRadius: '8px',
            padding: '10px 14px',
            width: '100%',
            fontSize: '14px',
            transition: 'border-color 0.2s'
        },
        textarea: {
            backgroundColor: theme.bg,
            color: theme.text,
            border: `1px solid ${theme.border}`,
            borderRadius: '8px',
            padding: '10px 14px',
            width: '100%',
            fontSize: '14px',
            minHeight: '80px',
            transition: 'border-color 0.2s'
        },
        label: {
            fontWeight: 600,
            fontSize: '13px',
            marginBottom: '6px',
            display: 'block',
            color: theme.text
        }
    };

    return (
        <div style={styles.container} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="jobquery" />

                <div style={styles.mainArea} className="flex-grow-1">
                    <Header
                        theme={theme}
                        isDarkMode={isDarkMode}
                        toggleDarkMode={toggleDarkMode}
                        toggleSidebar={toggleSidebar}
                    />

                    <div style={styles.contentContainer}>
                        <div style={styles.contentScroll}>
                            {/* Success Message */}
                            {successMessage && (
                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    {successMessage}
                                    <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {error}
                                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                                </div>
                            )}

                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                <div>
                                    <h2 style={{ color: theme.text }}>
                                        <i className="bi bi-search me-2" style={{ color: '#0d6efd' }}></i>
                                        Job Applications
                                    </h2>
                                    <p style={{ color: theme.text, opacity: 0.7 }}>
                                        Manage all job applications and inquiries
                                    </p>
                                </div>
                                <div>
                                    <span className="badge bg-primary" style={{ fontSize: '14px', padding: '8px 16px' }}>
                                        Total: {applications.length}
                                    </span>
                                </div>
                            </div>

                            {/* Search and Filter Bar */}
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <span className="input-group-text" style={{ 
                                            backgroundColor: theme.card,
                                            borderColor: theme.border,
                                            color: theme.text
                                        }}>
                                            <i className="bi bi-search"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search by name, email, phone, position..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{
                                                backgroundColor: theme.card,
                                                color: theme.text,
                                                borderColor: theme.border
                                            }}
                                        />
                                        {searchTerm && (
                                            <button
                                                className="btn btn-outline-secondary"
                                                onClick={() => setSearchTerm('')}
                                                style={{
                                                    borderColor: theme.border,
                                                    color: theme.text
                                                }}
                                            >
                                                <i className="bi bi-x-circle"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <select
                                        className="form-select"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        style={{
                                            backgroundColor: theme.card,
                                            color: theme.text,
                                            borderColor: theme.border
                                        }}
                                    >
                                        <option value="">All Status</option>
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <button
                                        className="btn btn-outline-primary w-100"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setStatusFilter('');
                                        }}
                                    >
                                        <i className="bi bi-arrow-counterclockwise me-1"></i>
                                        Reset
                                    </button>
                                </div>
                            </div>

                            {/* Applications Table */}
                            <div className="table-responsive">
                                <table className="table table-hover" style={{
                                    backgroundColor: theme.card,
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
                                }}>
                                    <thead style={{ color: theme.text, borderBottom: `2px solid ${theme.border}` }}>
                                        <tr>
                                            <th style={{ padding: '14px 16px' }}>#</th>
                                            <th style={{ padding: '14px 16px' }}>Name</th>
                                            <th style={{ padding: '14px 16px' }}>Position</th>
                                            <th style={{ padding: '14px 16px' }}>Email</th>
                                            <th style={{ padding: '14px 16px' }}>Status</th>
                                            <th style={{ padding: '14px 16px' }}>Resume</th>
                                            <th style={{ padding: '14px 16px' }}>Applied</th>
                                            <th style={{ padding: '14px 16px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="8" className="text-center py-5">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    <p className="mt-2" style={{ color: theme.text }}>Loading applications...</p>
                                                </td>
                                            </tr>
                                        ) : applications.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="text-center py-5" style={{ color: theme.text }}>
                                                    <i className="bi bi-inbox display-4 d-block mb-3" style={{ opacity: 0.5 }}></i>
                                                    <h5>No applications found</h5>
                                                    <p style={{ opacity: 0.7 }}>
                                                        {searchTerm || statusFilter ? 'Try adjusting your search filters' : 'No applications submitted yet'}
                                                    </p>
                                                </td>
                                            </tr>
                                        ) : (
                                            applications.map((app, index) => (
                                                <tr key={app.id} style={{
                                                    color: theme.text,
                                                    borderBottom: `1px solid ${theme.border}`,
                                                    transition: 'background 0.2s'
                                                }}>
                                                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                                                        #{String(app.id).padStart(3, '0')}
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <strong>{app.full_name}</strong>
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>{app.position}</td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <a href={`mailto:${app.email}`} style={{ color: '#0d6efd', textDecoration: 'none' }}>
                                                            {app.email}
                                                        </a>
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <span style={getStatusStyle(app.status)}>
                                                            {statusOptions.find(s => s.value === app.status)?.label || app.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        {app.resume ? (
                                                            <div className="btn-group btn-group-sm">
                                                                <button
                                                                    className="btn btn-outline-info"
                                                                    onClick={() => viewPdf(app.resume)}
                                                                    title="View Resume"
                                                                >
                                                                    <i className="bi bi-eye"></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline-success"
                                                                    onClick={() => downloadResume(app.resume, app.resume_original_name || `${app.full_name}_resume.pdf`)}
                                                                    title="Download Resume"
                                                                >
                                                                    <i className="bi bi-download"></i>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted">No file</span>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                                                        {new Date(app.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <div className="btn-group btn-group-sm">
                                                            <button
                                                                className="btn btn-outline-info"
                                                                onClick={() => viewApplication(app.id)}
                                                                title="View Details"
                                                            >
                                                                <i className="bi bi-eye"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-success"
                                                                onClick={() => openStatusModal(app)}
                                                                title="Change Status"
                                                            >
                                                                <i className="bi bi-check-circle"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-danger"
                                                                onClick={() => {
                                                                    setSelectedApplication(app);
                                                                    setShowDeleteModal(true);
                                                                }}
                                                                title="Delete"
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div style={styles.footerWrapper}>
                            <Footer theme={theme} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== DETAIL VIEW MODAL ===== */}
            {showDetailModal && selectedApplication && (
                <div style={modalStyles.overlay} onClick={(e) => {
                    if (e.target === e.currentTarget) setShowDetailModal(false);
                }}>
                    <div style={modalStyles.modal}>
                        <div style={modalStyles.header}>
                            <h5 style={{ color: theme.text, margin: 0 }}>
                                <i className="bi bi-info-circle me-2" style={{ color: '#0d6efd' }}></i>
                                Application Details
                            </h5>
                            <button
                                style={modalStyles.closeButton}
                                onClick={() => setShowDetailModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={modalStyles.body}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div style={{ ...modalStyles.label, color: theme.text, opacity: 0.7 }}>Full Name</div>
                                    <div style={{ color: theme.text, fontWeight: 500 }}>{selectedApplication.full_name}</div>
                                </div>
                                <div className="col-md-6">
                                    <div style={{ ...modalStyles.label, color: theme.text, opacity: 0.7 }}>Position</div>
                                    <div style={{ color: theme.text, fontWeight: 500 }}>{selectedApplication.position}</div>
                                </div>
                                <div className="col-md-6">
                                    <div style={{ ...modalStyles.label, color: theme.text, opacity: 0.7 }}>Email</div>
                                    <div style={{ color: theme.text }}>
                                        <a href={`mailto:${selectedApplication.email}`} style={{ color: '#0d6efd' }}>
                                            {selectedApplication.email}
                                        </a>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div style={{ ...modalStyles.label, color: theme.text, opacity: 0.7 }}>Phone</div>
                                    <div style={{ color: theme.text }}>
                                        <a href={`tel:${selectedApplication.phone}`} style={{ color: '#0d6efd' }}>
                                            {selectedApplication.phone}
                                        </a>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div style={{ ...modalStyles.label, color: theme.text, opacity: 0.7 }}>Experience</div>
                                    <div style={{ color: theme.text }}>
                                        {selectedApplication.experience || 'Not specified'}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div style={{ ...modalStyles.label, color: theme.text, opacity: 0.7 }}>Status</div>
                                    <div>
                                        <span style={getStatusStyle(selectedApplication.status)}>
                                            {statusOptions.find(s => s.value === selectedApplication.status)?.label || selectedApplication.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div style={{ ...modalStyles.label, color: theme.text, opacity: 0.7 }}>Cover Letter</div>
                                    <div style={{
                                        color: theme.text,
                                        backgroundColor: theme.bg,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        minHeight: '80px',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {selectedApplication.cover_letter || 'No cover letter provided'}
                                    </div>
                                </div>
                                {selectedApplication.admin_note && (
                                    <div className="col-12">
                                        <div style={{ ...modalStyles.label, color: theme.text, opacity: 0.7 }}>Admin Note</div>
                                        <div style={{
                                            color: theme.text,
                                            backgroundColor: theme.bg,
                                            padding: '12px',
                                            borderRadius: '8px',
                                            minHeight: '60px',
                                            whiteSpace: 'pre-wrap',
                                            borderLeft: `3px solid #0d6efd`
                                        }}>
                                            {selectedApplication.admin_note}
                                        </div>
                                    </div>
                                )}
                                {selectedApplication.resume && (
                                    <div className="col-12">
                                        <div className="d-flex gap-2 flex-wrap">
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => viewPdf(selectedApplication.resume)}
                                            >
                                                <i className="bi bi-eye me-2"></i>
                                                View Resume
                                            </button>
                                            <button
                                                className="btn btn-success"
                                                onClick={() => downloadResume(selectedApplication.resume, selectedApplication.resume_original_name || `${selectedApplication.full_name}_resume.pdf`)}
                                            >
                                                <i className="bi bi-download me-2"></i>
                                                Download Resume
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div className="col-12">
                                    <div style={{ ...modalStyles.label, color: theme.text, opacity: 0.7 }}>Applied On</div>
                                    <div style={{ color: theme.text }}>
                                        {new Date(selectedApplication.created_at).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={modalStyles.footer}>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowDetailModal(false)}
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                    setShowDetailModal(false);
                                    openEditModal(selectedApplication);
                                }}
                            >
                                <i className="bi bi-pencil me-2"></i>
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== PDF VIEW MODAL ===== */}
            {showPdfModal && pdfUrl && (
                <div style={modalStyles.overlay} onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setShowPdfModal(false);
                        setPdfUrl('');
                    }
                }}>
                    <div style={modalStyles.pdfModal}>
                        <div style={modalStyles.header}>
                            <h5 style={{ color: theme.text, margin: 0 }}>
                                <i className="bi bi-file-pdf me-2" style={{ color: '#dc3545' }}></i>
                                Resume: {selectedApplication?.full_name || 'Document'}
                            </h5>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => {
                                        if (selectedApplication) {
                                            downloadResume(
                                                selectedApplication.resume, 
                                                selectedApplication.resume_original_name || `${selectedApplication.full_name}_resume.pdf`
                                            );
                                        }
                                    }}
                                >
                                    <i className="bi bi-download me-1"></i>
                                    Download
                                </button>
                                <button
                                    style={modalStyles.closeButton}
                                    onClick={() => {
                                        setShowPdfModal(false);
                                        setPdfUrl('');
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div style={modalStyles.pdfBody}>
                            <iframe
                                src={pdfUrl}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none'
                                }}
                                title="Resume PDF"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ===== EDIT MODAL - FIXED ===== */}
            {showEditModal && selectedApplication && (
                <div style={modalStyles.overlay} onClick={(e) => {
                    if (e.target === e.currentTarget) setShowEditModal(false);
                }}>
                    <div style={modalStyles.modal}>
                        <div style={modalStyles.header}>
                            <h5 style={{ color: theme.text, margin: 0 }}>
                                <i className="bi bi-pencil-square me-2" style={{ color: '#0d6efd' }}></i>
                                Edit Application: {selectedApplication.full_name}
                            </h5>
                            <button
                                style={modalStyles.closeButton}
                                onClick={() => setShowEditModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleUpdateApplication}>
                            <div style={modalStyles.body}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label style={modalStyles.label}>Full Name <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            className="form-control"
                                            value={editFormData.full_name}
                                            onChange={handleEditChange}
                                            style={modalStyles.input}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label style={modalStyles.label}>Position <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="position"
                                            className="form-control"
                                            value={editFormData.position}
                                            onChange={handleEditChange}
                                            style={modalStyles.input}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label style={modalStyles.label}>Email <span className="text-danger">*</span></label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={editFormData.email}
                                            onChange={handleEditChange}
                                            style={modalStyles.input}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label style={modalStyles.label}>Phone <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="phone"
                                            className="form-control"
                                            value={editFormData.phone}
                                            onChange={handleEditChange}
                                            style={modalStyles.input}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <label style={modalStyles.label}>Experience</label>
                                        <input
                                            type="text"
                                            name="experience"
                                            className="form-control"
                                            value={editFormData.experience}
                                            onChange={handleEditChange}
                                            style={modalStyles.input}
                                            placeholder="e.g., 3-5 years"
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <label style={modalStyles.label}>Status</label>
                                        <select
                                            name="status"
                                            className="form-select"
                                            value={editFormData.status}
                                            onChange={handleEditChange}
                                            style={modalStyles.select}
                                        >
                                            {statusOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label style={modalStyles.label}>Cover Letter</label>
                                        <textarea
                                            name="cover_letter"
                                            className="form-control"
                                            rows="3"
                                            value={editFormData.cover_letter}
                                            onChange={handleEditChange}
                                            style={modalStyles.textarea}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label style={modalStyles.label}>Admin Note</label>
                                        <textarea
                                            name="admin_note"
                                            className="form-control"
                                            rows="2"
                                            value={editFormData.admin_note}
                                            onChange={handleEditChange}
                                            style={modalStyles.textarea}
                                            placeholder="Add internal notes about this application..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={modalStyles.footer}>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-save me-2"></i>
                                            Update Application
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ===== STATUS MODAL ===== */}
            {showStatusModal && selectedApplication && (
                <div style={modalStyles.overlay} onClick={(e) => {
                    if (e.target === e.currentTarget) setShowStatusModal(false);
                }}>
                    <div style={{ ...modalStyles.modal, maxWidth: '450px' }}>
                        <div style={modalStyles.header}>
                            <h5 style={{ color: theme.text, margin: 0 }}>
                                <i className="bi bi-check-circle me-2" style={{ color: '#28a745' }}></i>
                                Update Status
                            </h5>
                            <button
                                style={modalStyles.closeButton}
                                onClick={() => setShowStatusModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={modalStyles.body}>
                            <p style={{ color: theme.text, marginBottom: '16px' }}>
                                Update status for <strong>{selectedApplication.full_name}</strong>
                            </p>
                            <div className="mb-3">
                                <label style={modalStyles.label}>Select Status</label>
                                <select
                                    className="form-select"
                                    value={editFormData.status}
                                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                                    style={modalStyles.select}
                                >
                                    {statusOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{
                                backgroundColor: theme.bg,
                                padding: '12px',
                                borderRadius: '8px',
                                marginTop: '12px'
                            }}>
                                <p style={{ color: theme.text, margin: 0, fontSize: '13px' }}>
                                    <i className="bi bi-info-circle me-1"></i>
                                    Current status: <span style={getStatusStyle(selectedApplication.status)}>
                                        {statusOptions.find(s => s.value === selectedApplication.status)?.label || selectedApplication.status}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div style={modalStyles.footer}>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowStatusModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={handleUpdateStatus}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check2 me-2"></i>
                                        Update Status
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== DELETE MODAL ===== */}
            {showDeleteModal && selectedApplication && (
                <div style={modalStyles.overlay} onClick={(e) => {
                    if (e.target === e.currentTarget) setShowDeleteModal(false);
                }}>
                    <div style={{ ...modalStyles.modal, maxWidth: '500px' }}>
                        <div style={modalStyles.header}>
                            <h5 style={{ color: theme.text, margin: 0 }}>
                                <i className="bi bi-exclamation-triangle-fill me-2" style={{ color: '#dc3545' }}></i>
                                Delete Application
                            </h5>
                            <button
                                style={modalStyles.closeButton}
                                onClick={() => setShowDeleteModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={modalStyles.body}>
                            <p style={{ color: theme.text }}>Are you sure you want to delete this application?</p>
                            <div style={{
                                backgroundColor: theme.bg,
                                padding: '16px',
                                borderRadius: '10px',
                                marginBottom: '16px',
                                border: `1px solid ${theme.border}`
                            }}>
                                <h6 style={{ color: theme.text, margin: 0 }}>{selectedApplication.full_name}</h6>
                                <p style={{ color: theme.text, opacity: 0.7, margin: '4px 0 0 0', fontSize: '13px' }}>
                                    {selectedApplication.position} • {selectedApplication.email}
                                </p>
                            </div>
                            <div className="alert alert-danger" style={{ borderRadius: '10px' }}>
                                <i className="bi bi-info-circle me-2"></i>
                                This action cannot be undone!
                            </div>
                        </div>

                        <div style={modalStyles.footer}>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleDeleteApplication}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-trash me-2"></i>
                                        Delete Application
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: translateY(-30px) scale(0.95); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                
                .btn-close {
                    background: transparent;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: ${theme.text};
                    opacity: 0.5;
                    transition: opacity 0.2s;
                    padding: 4px 8px;
                }
                .btn-close:hover {
                    opacity: 1;
                }
                
                .form-control, .form-select {
                    background-color: ${theme.bg} !important;
                    color: ${theme.text} !important;
                    border-color: ${theme.border} !important;
                    transition: all 0.2s;
                }
                .form-control:focus, .form-select:focus {
                    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
                    border-color: #0d6efd;
                    outline: none;
                }
                .form-control::placeholder {
                    color: ${theme.text} !important;
                    opacity: 0.5;
                }
                
                .table {
                    margin-bottom: 0;
                }
                .table > :not(caption) > * > * {
                    background-color: transparent !important;
                    border-bottom-color: ${theme.border} !important;
                }
                
                .table tbody tr:hover {
                    background-color: rgba(13, 110, 253, 0.04) !important;
                }
                
                .btn-group .btn {
                    border-radius: 6px;
                    padding: 4px 10px;
                    margin: 0 2px;
                }
                .btn-group .btn:hover {
                    transform: scale(1.1);
                    transition: transform 0.2s;
                }
                
                .input-group-text {
                    background-color: ${theme.card} !important;
                    border-color: ${theme.border} !important;
                    color: ${theme.text} !important;
                }
                
                iframe {
                    background-color: #f5f5f5;
                }
                
                ::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: ${theme.bg};
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb {
                    background: ${theme.border};
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #0d6efd;
                }
            `}</style>
        </div>
    );
};

export default JobQuery;