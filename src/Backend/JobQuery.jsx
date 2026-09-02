// import React, { useState, useEffect } from 'react';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import Footer from './Footer';

// const JobQuery = ({ theme: propsTheme }) => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(false);

//     // State variables
//     const [applications, setApplications] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [successMessage, setSuccessMessage] = useState('');

//     // Search and filter states
//     const [searchTerm, setSearchTerm] = useState('');
//     const [statusFilter, setStatusFilter] = useState('');
//     const [selectedApplication, setSelectedApplication] = useState(null);

//     // Modal states
//     const [showDetailModal, setShowDetailModal] = useState(false);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [showStatusModal, setShowStatusModal] = useState(false);
//     const [showPdfModal, setShowPdfModal] = useState(false);
//     const [pdfUrl, setPdfUrl] = useState('');

//     // Edit form state - UPDATED with new fields
//     const [editFormData, setEditFormData] = useState({
//         full_name: '',
//         email: '',
//         phone: '',
//         experience: '',
//         current_company: '',
//         designation: '',
//         notice_period: '',
//         cover_letter: '',
//         status: 'pending',
//         admin_note: ''
//     });

//     const theme = propsTheme || {
//         isDarkMode,
//         bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
//         card: isDarkMode ? '#16213e' : '#ffffff',
//         text: isDarkMode ? '#e9ecef' : '#3e4b5b',
//         border: isDarkMode ? '#2d3436' : '#ebedf2',
//         sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b'
//     };

//     const API_URL = 'https://backend.akashbariresort.com/api';
//     // const API_URL = 'http://127.0.0.1:8000/api';
//     // const STORAGE_URL = 'http://127.0.0.1:8000/storage';
//     const STORAGE_URL = 'https://backend.akashbariresort.com/storage';

//     // Status options
//     const statusOptions = [
//         { value: 'pending', label: 'Pending', color: '#ffc107' },
//         { value: 'reviewing', label: 'Reviewing', color: '#17a2b8' },
//         { value: 'shortlisted', label: 'Shortlisted', color: '#28a745' },
//         { value: 'rejected', label: 'Rejected', color: '#dc3545' },
//         { value: 'hired', label: 'Hired', color: '#6f42c1' }
//     ];

//     // Experience label mapping
//     const getExperienceLabel = (experience) => {
//         const labels = {
//             'entry': 'Fresh Graduate / Entry Level',
//             '1-2': '1–2 years',
//             '3-5': '3–5 years',
//             '5-10': '5–10 years',
//             '10+': '10+ years'
//         };
//         return labels[experience] || experience || 'Not specified';
//     };

//     // Notice period label mapping
//     const getNoticePeriodLabel = (period) => {
//         const labels = {
//             'immediate': 'Immediate',
//             '15-days': '15 days',
//             '30-days': '30 days',
//             '45-days': '45 days',
//             '60-days': '60 days',
//             '90-days': '90 days'
//         };
//         return labels[period] || period || 'Not specified';
//     };

//     // Fetch all applications
//     const fetchApplications = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             let url = `${API_URL}/applications?`;
//             if (searchTerm) {
//                 url += `search=${encodeURIComponent(searchTerm)}&`;
//             }
//             if (statusFilter) {
//                 url += `status=${statusFilter}&`;
//             }

//             const response = await fetch(url);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch applications');
//             }
//             const data = await response.json();
//             const applicationsData = data.data?.data || data.data || [];

//             // Transform data to ensure job_title is available
//             const transformedData = applicationsData.map(app => ({
//                 ...app,
//                 job_title: app.job_title || app.job?.title || 'N/A'
//             }));

//             setApplications(transformedData);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchApplications();
//     }, [searchTerm, statusFilter]);

//     // Auto-hide success message
//     useEffect(() => {
//         if (successMessage) {
//             const timer = setTimeout(() => setSuccessMessage(''), 3000);
//             return () => clearTimeout(timer);
//         }
//     }, [successMessage]);

//     const toggleSidebar = () => setIsCollapsed(!isCollapsed);
//     const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

//     // Get status badge style
//     const getStatusStyle = (status) => {
//         const option = statusOptions.find(s => s.value === status);
//         return {
//             backgroundColor: option?.color || '#6c757d',
//             color: '#fff',
//             padding: '4px 12px',
//             borderRadius: '20px',
//             fontSize: '12px',
//             fontWeight: 600,
//             display: 'inline-block'
//         };
//     };

//     // Get full resume URL
//     const getResumeUrl = (resumePath) => {
//         if (!resumePath) return null;
//         let cleanPath = resumePath.replace(/^public\//, '');
//         return `${STORAGE_URL}/${cleanPath}`;
//     };

//     // View application details
//     const viewApplication = async (id) => {
//         try {
//             const response = await fetch(`${API_URL}/applications/${id}`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch application details');
//             }
//             const data = await response.json();
//             const applicationData = data.data;
//             // Ensure job_title is available
//             applicationData.job_title = applicationData.job_title || applicationData.job?.title || 'N/A';
//             setSelectedApplication(applicationData);
//             setShowDetailModal(true);
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     // Open edit modal - UPDATED
//     const openEditModal = (application) => {
//         setSelectedApplication(application);
//         setEditFormData({
//             full_name: application.full_name || '',
//             email: application.email || '',
//             phone: application.phone || '',
//             experience: application.experience || '',
//             current_company: application.current_company || '',
//             designation: application.designation || '',
//             notice_period: application.notice_period || '',
//             cover_letter: application.cover_letter || '',
//             status: application.status || 'pending',
//             admin_note: application.admin_note || ''
//         });
//         setShowEditModal(true);
//     };

//     // Open status modal
//     const openStatusModal = (application) => {
//         setSelectedApplication(application);
//         setEditFormData({
//             ...editFormData,
//             status: application.status || 'pending'
//         });
//         setShowStatusModal(true);
//     };

//     // Handle edit form change
//     const handleEditChange = (e) => {
//         const { name, value } = e.target;
//         setEditFormData({ ...editFormData, [name]: value });
//     };

//     // Update application - UPDATED
//     const handleUpdateApplication = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await fetch(`${API_URL}/applications/${selectedApplication.id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json',
//                 },
//                 body: JSON.stringify(editFormData),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || 'Failed to update application');
//             }

//             const data = await response.json();
//             console.log('Update response:', data);

//             setSuccessMessage('Application updated successfully!');
//             setShowEditModal(false);
//             setSelectedApplication(null);
//             fetchApplications();
//         } catch (err) {
//             console.error('Update error:', err);
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Update status only
//     const handleUpdateStatus = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await fetch(`${API_URL}/applications/${selectedApplication.id}/status`, {
//                 method: 'PATCH',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json',
//                 },
//                 body: JSON.stringify({ status: editFormData.status }),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || 'Failed to update status');
//             }

//             const data = await response.json();
//             console.log('Status update response:', data);

//             setSuccessMessage('Status updated successfully!');
//             setShowStatusModal(false);
//             setSelectedApplication(null);
//             fetchApplications();
//         } catch (err) {
//             console.error('Status update error:', err);
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Delete application
//     const handleDeleteApplication = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await fetch(`${API_URL}/applications/${selectedApplication.id}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Accept': 'application/json',
//                 },
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || 'Failed to delete application');
//             }

//             const data = await response.json();
//             console.log('Delete response:', data);

//             setSuccessMessage('Application deleted successfully!');
//             setShowDeleteModal(false);
//             setSelectedApplication(null);
//             fetchApplications();
//         } catch (err) {
//             console.error('Delete error:', err);
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // View PDF in modal
//     const viewPdf = (resumePath) => {
//         if (!resumePath) {
//             setError('No resume found');
//             return;
//         }
//         const url = getResumeUrl(resumePath);
//         setPdfUrl(url);
//         setShowPdfModal(true);
//     };

//     // Download resume
//     const downloadResume = (resumePath, fileName) => {
//         if (!resumePath) {
//             setError('No resume found');
//             return;
//         }

//         try {
//             const url = getResumeUrl(resumePath);
//             console.log('Downloading from:', url);

//             const link = document.createElement('a');
//             link.href = url;
//             link.download = fileName || 'resume.pdf';
//             link.target = '_blank';
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);

//             setSuccessMessage('Resume downloaded successfully!');
//         } catch (err) {
//             console.error('Download error:', err);
//             setError('Failed to download resume: ' + err.message);
//         }
//     };

//     const styles = {
//         container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
//         mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
//         contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
//         contentScroll: { flex: '1 0 auto', padding: '24px' },
//         footerWrapper: { flexShrink: 0 }
//     };

//     // Modal Styles
//     const modalStyles = {
//         overlay: {
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0,0,0,0.6)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             zIndex: 1050,
//             padding: '20px',
//             animation: 'fadeIn 0.3s ease'
//         },
//         modal: {
//             backgroundColor: theme.card,
//             borderRadius: '16px',
//             maxWidth: '800px',
//             width: '100%',
//             maxHeight: '90vh',
//             display: 'flex',
//             flexDirection: 'column',
//             boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
//             animation: 'slideIn 0.3s ease'
//         },
//         pdfModal: {
//             backgroundColor: theme.card,
//             borderRadius: '16px',
//             maxWidth: '90vw',
//             width: '100%',
//             maxHeight: '90vh',
//             display: 'flex',
//             flexDirection: 'column',
//             boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
//             animation: 'slideIn 0.3s ease'
//         },
//         header: {
//             padding: '20px 24px',
//             borderBottom: `1px solid ${theme.border}`,
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             flexShrink: 0,
//             borderRadius: '16px 16px 0 0'
//         },
//         body: {
//             padding: '24px',
//             overflowY: 'auto',
//             flex: '1 1 auto',
//             maxHeight: 'calc(90vh - 140px)'
//         },
//         pdfBody: {
//             padding: '0',
//             overflowY: 'auto',
//             flex: '1 1 auto',
//             height: 'calc(90vh - 80px)',
//             backgroundColor: '#f5f5f5'
//         },
//         footer: {
//             padding: '16px 24px',
//             borderTop: `1px solid ${theme.border}`,
//             display: 'flex',
//             justifyContent: 'flex-end',
//             gap: '10px',
//             flexShrink: 0,
//             borderRadius: '0 0 16px 16px'
//         },
//         closeButton: {
//             background: 'transparent',
//             border: 'none',
//             fontSize: '28px',
//             cursor: 'pointer',
//             color: theme.text,
//             padding: '0 8px',
//             lineHeight: '1',
//             opacity: 0.7,
//             transition: 'opacity 0.2s'
//         },
//         input: {
//             backgroundColor: theme.bg,
//             color: theme.text,
//             border: `1px solid ${theme.border}`,
//             borderRadius: '8px',
//             padding: '10px 14px',
//             width: '100%',
//             fontSize: '14px',
//             transition: 'border-color 0.2s'
//         },
//         select: {
//             backgroundColor: theme.bg,
//             color: theme.text,
//             border: `1px solid ${theme.border}`,
//             borderRadius: '8px',
//             padding: '10px 14px',
//             width: '100%',
//             fontSize: '14px',
//             transition: 'border-color 0.2s'
//         },
//         textarea: {
//             backgroundColor: theme.bg,
//             color: theme.text,
//             border: `1px solid ${theme.border}`,
//             borderRadius: '8px',
//             padding: '10px 14px',
//             width: '100%',
//             fontSize: '14px',
//             minHeight: '80px',
//             transition: 'border-color 0.2s'
//         },
//         label: {
//             fontWeight: 600,
//             fontSize: '13px',
//             marginBottom: '6px',
//             display: 'block',
//             color: theme.text
//         }
//     };

//     return (
//         <div style={styles.container} className="container-fluid p-0">
//             <div className="d-flex">
//                 <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="jobquery" />

//                 <div style={styles.mainArea} className="flex-grow-1">
//                     <Header
//                         theme={theme}
//                         isDarkMode={isDarkMode}
//                         toggleDarkMode={toggleDarkMode}
//                         toggleSidebar={toggleSidebar}
//                     />

//                     <div style={styles.contentContainer}>
//                         <div style={styles.contentScroll}>
//                             {/* Success Message */}
//                             {successMessage && (
//                                 <div className="alert alert-success alert-dismissible fade show" role="alert">
//                                     <i className="bi bi-check-circle-fill me-2"></i>
//                                     {successMessage}
//                                     <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
//                                 </div>
//                             )}

//                             {/* Error Message */}
//                             {error && (
//                                 <div className="alert alert-danger alert-dismissible fade show" role="alert">
//                                     <i className="bi bi-exclamation-triangle-fill me-2"></i>
//                                     {error}
//                                     <button type="button" className="btn-close" onClick={() => setError(null)}></button>
//                                 </div>
//                             )}

//                             {/* Header */}
//                             <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
//                                 <div>
//                                     <h2 style={{ color: theme.text }}>
//                                         Job Applications
//                                     </h2>
//                                     <p style={{ color: theme.text, opacity: 0.7 }}>
//                                         Manage all job applications and inquiries
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <span className="badge bg-secondary" style={{ fontSize: '14px', padding: '8px 16px' }}>
//                                         Total: {applications.length}
//                                     </span>
//                                 </div>
//                             </div>

//                             {/* Search and Filter Bar */}
//                             <div className="row g-3 mb-4">
//                                 <div className="col-md-6">
//                                     <div className="input-group">
//                                         <span className="input-group-text" style={{
//                                             backgroundColor: theme.card,
//                                             borderColor: '#ffffff', // deep white border
//                                             color: theme.text,
//                                             borderWidth: '2px' // thicker for visibility
//                                         }}>
//                                             <i className="bi bi-search"></i>
//                                         </span>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             placeholder="Search by name, email, phone, company, designation..."
//                                             value={searchTerm}
//                                             onChange={(e) => setSearchTerm(e.target.value)}
//                                             style={{
//                                                 backgroundColor: theme.card,
//                                                 color: theme.text,
//                                                 borderColor: '#ffffff', // deep white border
//                                                 borderWidth: '2px'
//                                             }}
//                                         />
//                                         {searchTerm && (
//                                             <button
//                                                 className="btn btn-outline-secondary"
//                                                 onClick={() => setSearchTerm('')}
//                                                 style={{
//                                                     borderColor: '#ffffff', // deep white border
//                                                     color: theme.text,
//                                                     borderWidth: '2px'
//                                                 }}
//                                             >
//                                                 <i className="bi bi-x-circle"></i>
//                                             </button>
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="col-md-4">
//                                     <select
//                                         className="form-select"
//                                         value={statusFilter}
//                                         onChange={(e) => setStatusFilter(e.target.value)}
//                                         style={{
//                                             backgroundColor: theme.card,
//                                             color: theme.text,
//                                             borderColor: '#ffffff', // deep white border
//                                             borderWidth: '2px'
//                                         }}
//                                     >
//                                         <option value="">All Status</option>
//                                         {statusOptions.map((option) => (
//                                             <option key={option.value} value={option.value}>
//                                                 {option.label}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                             </div>

//                             {/* Applications Table - UPDATED with new columns */}
//                             <div className="table-responsive">
//                                 <table className="table table-hover" style={{
//                                     backgroundColor: theme.card,
//                                     borderRadius: '12px',
//                                     overflow: 'hidden',
//                                     boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
//                                 }}>
//                                     <thead style={{ color: theme.text, borderBottom: `2px solid ${theme.border}` }}>
//                                         <tr>
//                                             <th style={{ padding: '14px 16px' }}>#</th>
//                                             <th style={{ padding: '14px 16px' }}>Name</th>
//                                             <th style={{ padding: '14px 16px' }}>Applied Position</th>
//                                             <th style={{ padding: '14px 16px' }}>Company</th>
//                                             <th style={{ padding: '14px 16px' }}>Designation</th>
//                                             <th style={{ padding: '14px 16px' }}>Experience</th>
//                                             <th style={{ padding: '14px 16px' }}>Status</th>
//                                             <th style={{ padding: '14px 16px' }}>Applied</th>
//                                             <th style={{ padding: '14px 16px' }}>Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {loading ? (
//                                             <tr>
//                                                 <td colSpan="9" className="text-center py-5">
//                                                     <div className="spinner-border text-primary" role="status">
//                                                         <span className="visually-hidden">Loading...</span>
//                                                     </div>
//                                                     <p className="mt-2" style={{ color: theme.text }}>Loading applications...</p>
//                                                 </td>
//                                             </tr>
//                                         ) : applications.length === 0 ? (
//                                             <tr>
//                                                 <td colSpan="9" className="text-center py-5" style={{ color: theme.text }}>
//                                                     <i className="bi bi-inbox display-4 d-block mb-3" style={{ opacity: 0.5 }}></i>
//                                                     <h5>No applications found</h5>
//                                                     <p style={{ opacity: 0.7 }}>
//                                                         {searchTerm || statusFilter ? 'Try adjusting your search filters' : 'No applications submitted yet'}
//                                                     </p>
//                                                 </td>
//                                             </tr>
//                                         ) : (
//                                             applications.map((app, index) => (
//                                                 <tr key={app.id} style={{
//                                                     color: theme.text,
//                                                     borderBottom: `1px solid ${theme.border}`,
//                                                     transition: 'background 0.2s'
//                                                 }}>
//                                                     <td style={{ padding: '12px 16px', fontWeight: 600 }}>
//                                                         #{String(app.id).padStart(3, '0')}
//                                                     </td>
//                                                     <td style={{ padding: '12px 16px' }}>
//                                                         <strong>{app.full_name}</strong>
//                                                     </td>
//                                                     <td style={{ padding: '12px 16px' }}>
//                                                         <span className="badge bg-info text-dark">{app.job_title || 'N/A'}</span>
//                                                     </td>
//                                                     <td style={{ padding: '12px 16px' }}>
//                                                         {app.current_company || 'N/A'}
//                                                     </td>
//                                                     <td style={{ padding: '12px 16px' }}>
//                                                         {app.designation || 'N/A'}
//                                                     </td>
//                                                     <td style={{ padding: '12px 16px' }}>
//                                                         <span className="badge bg-secondary">
//                                                             {getExperienceLabel(app.experience)}
//                                                         </span>
//                                                     </td>
//                                                     <td style={{ padding: '12px 16px' }}>
//                                                         <span style={getStatusStyle(app.status)}>
//                                                             {statusOptions.find(s => s.value === app.status)?.label || app.status}
//                                                         </span>
//                                                     </td>
//                                                     <td style={{ padding: '12px 16px', fontSize: '13px' }}>
//                                                         {new Date(app.created_at).toLocaleDateString('en-US', {
//                                                             year: 'numeric',
//                                                             month: 'short',
//                                                             day: 'numeric'
//                                                         })}
//                                                     </td>
//                                                     <td style={{ padding: '12px 16px' }}>
//                                                         <div className="btn-group btn-group-sm">
//                                                             <button
//                                                                 className="btn btn-outline-info"
//                                                                 onClick={() => viewApplication(app.id)}
//                                                                 title="View Details"
//                                                             >
//                                                                 <i className="bi bi-eye"></i>
//                                                             </button>
//                                                             <button
//                                                                 className="btn btn-outline-success"
//                                                                 onClick={() => openStatusModal(app)}
//                                                                 title="Change Status"
//                                                             >
//                                                                 <i className="bi bi-check-circle"></i>
//                                                             </button>
//                                                             <button
//                                                                 className="btn btn-outline-danger"
//                                                                 onClick={() => {
//                                                                     setSelectedApplication(app);
//                                                                     setShowDeleteModal(true);
//                                                                 }}
//                                                                 title="Delete"
//                                                             >
//                                                                 <i className="bi bi-trash"></i>
//                                                             </button>
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             ))
//                                         )}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>

//                         <div style={styles.footerWrapper}>
//                             <Footer theme={theme} />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* ===== DETAIL VIEW MODAL - UPDATED ===== */}
//             {showDetailModal && selectedApplication && (
//                 <div style={modalStyles.overlay} onClick={(e) => {
//                     if (e.target === e.currentTarget) setShowDetailModal(false);
//                 }}>
//                     <div style={modalStyles.modal}>
//                         <div style={modalStyles.header}>
//                             <h5 style={{ color: theme.text, margin: 0 }}>
//                                 <i className="bi bi-info-circle me-2" style={{ color: '#0d6efd' }}></i>
//                                 Application Details
//                             </h5>
//                             <button
//                                 style={modalStyles.closeButton}
//                                 onClick={() => setShowDetailModal(false)}
//                             >
//                                 ✕
//                             </button>
//                         </div>

//                         <div style={modalStyles.body}>
//                             <div className="row g-3">
//                                 <div className="col-md-6">
//                                     <div style={{ ...modalStyles.label, color: theme.text, opacity: 0.7 }}>Full Name</div>
//                                     <div style={{ color: theme.text, fontWeight: 500 }}>{selectedApplication.full_name}</div>
//                                 </div>
//                                 <div className="col-md-6">
//                                     <div style={{ ...modalStyles.label, color: theme.text, opacity: 0.7 }}>Applied Position</div>
//                                     <div style={{ color: theme.text, fontWeight: 500 }}>
//                                         <span className="badge bg-info text-dark">{selectedApplication.job_title || 'N/A'}</span>
//                                     </div>
//                                 </div>
//                                 <div className="col-md-6">
//                                     <div style={{ ...modalStyles.label, color: theme.text, opacity: 0.7 }}>Email</div>
//                                     <div style={{ color: theme.text }}>
//                                         <a href={`mailto:${selectedApplication.email}`} style={{ color: '#0d6efd' }}>
//                                             {selectedApplication.email}
//                                         </a>
//                                     </div>
//                                 </div>
//                                 <div className="col-md-6">
//                                     <div style={{ ...modalStyles.label, color: theme.text, opacity: 0.7 }}>Phone</div>
//                                     <div style={{ color: theme.text }}>
//                                         <a href={`tel:${selectedApplication.phone}`} style={{ color: '#0d6efd' }}>
//                                             {selectedApplication.phone}
//                                         </a>
//                                     </div>
//                                 </div>
//                                 <div className="col-md-6">
//                                     <div style={{ ...modalStyles.label, color: theme.text, opacity: 0.7 }}>Experience</div>
//                                     <div style={{ color: theme.text }}>
//                                         <span className="badge bg-secondary">
//                                             {getExperienceLabel(selectedApplication.experience)}
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <div className="col-md-6">
//                                     <div style={{ ...modalStyles.label, color: theme.text, opacity: 0.7 }}>Status</div>
//                                     <div>
//                                         <span style={getStatusStyle(selectedApplication.status)}>
//                                             {statusOptions.find(s => s.value === selectedApplication.status)?.label || selectedApplication.status}
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <div className="col-md-6">
//                                     <div style={{ ...modalStyles.label, color: theme.text, opacity: 0.7 }}>Current Company</div>
//                                     <div style={{ color: theme.text, fontWeight: 500 }}>
//                                         {selectedApplication.current_company || 'N/A'}
//                                     </div>
//                                 </div>
//                                 <div className="col-md-6">
//                                     <div style={{ ...modalStyles.label, color: theme.text, opacity: 0.7 }}>Designation</div>
//                                     <div style={{ color: theme.text, fontWeight: 500 }}>
//                                         {selectedApplication.designation || 'N/A'}
//                                     </div>
//                                 </div>
//                                 <div className="col-md-6">
//                                     <div style={{ ...modalStyles.label, color: theme.text, opacity: 0.7 }}>Notice Period</div>
//                                     <div style={{ color: theme.text }}>
//                                         {getNoticePeriodLabel(selectedApplication.notice_period)}
//                                     </div>
//                                 </div>
//                                 <div className="col-12">
//                                     <div style={{ ...modalStyles.label, color: theme.text, opacity: 0.7 }}>Cover Letter</div>
//                                     <div style={{
//                                         color: theme.text,
//                                         backgroundColor: theme.bg,
//                                         padding: '12px',
//                                         borderRadius: '8px',
//                                         minHeight: '80px',
//                                         whiteSpace: 'pre-wrap'
//                                     }}>
//                                         {selectedApplication.cover_letter || 'No cover letter provided'}
//                                     </div>
//                                 </div>
//                                 {selectedApplication.admin_note && (
//                                     <div className="col-12">
//                                         <div style={{ ...modalStyles.label, color: theme.text, opacity: 0.7 }}>Admin Note</div>
//                                         <div style={{
//                                             color: theme.text,
//                                             backgroundColor: theme.bg,
//                                             padding: '12px',
//                                             borderRadius: '8px',
//                                             minHeight: '60px',
//                                             whiteSpace: 'pre-wrap',
//                                             borderLeft: `3px solid #0d6efd`
//                                         }}>
//                                             {selectedApplication.admin_note}
//                                         </div>
//                                     </div>
//                                 )}
//                                 {selectedApplication.resume && (
//                                     <div className="col-12">
//                                         <div className="d-flex gap-2 flex-wrap">
//                                             <button
//                                                 className="btn btn-primary"
//                                                 onClick={() => viewPdf(selectedApplication.resume)}
//                                             >
//                                                 <i className="bi bi-eye me-2"></i>
//                                                 View Resume
//                                             </button>
//                                             <button
//                                                 className="btn btn-success"
//                                                 onClick={() => downloadResume(selectedApplication.resume, selectedApplication.resume_original_name || `${selectedApplication.full_name}_resume.pdf`)}
//                                             >
//                                                 <i className="bi bi-download me-2"></i>
//                                                 Download Resume
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}
//                                 <div className="col-12">
//                                     <div style={{ ...modalStyles.label, color: theme.text, opacity: 0.7 }}>Applied On</div>
//                                     <div style={{ color: theme.text }}>
//                                         {new Date(selectedApplication.created_at).toLocaleString('en-US', {
//                                             year: 'numeric',
//                                             month: 'long',
//                                             day: 'numeric',
//                                             hour: '2-digit',
//                                             minute: '2-digit'
//                                         })}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div style={modalStyles.footer}>
//                             <button
//                                 type="button"
//                                 className="btn btn-secondary"
//                                 onClick={() => setShowDetailModal(false)}
//                             >
//                                 Close
//                             </button>
//                             <button
//                                 type="button"
//                                 className="btn btn-primary"
//                                 onClick={() => {
//                                     setShowDetailModal(false);
//                                     openEditModal(selectedApplication);
//                                 }}
//                             >
//                                 <i className="bi bi-pencil me-2"></i>
//                                 Edit
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ===== PDF VIEW MODAL ===== */}
//             {showPdfModal && pdfUrl && (
//                 <div style={modalStyles.overlay} onClick={(e) => {
//                     if (e.target === e.currentTarget) {
//                         setShowPdfModal(false);
//                         setPdfUrl('');
//                     }
//                 }}>
//                     <div style={modalStyles.pdfModal}>
//                         <div style={modalStyles.header}>
//                             <h5 style={{ color: theme.text, margin: 0 }}>
//                                 <i className="bi bi-file-pdf me-2" style={{ color: '#dc3545' }}></i>
//                                 Resume: {selectedApplication?.full_name || 'Document'}
//                             </h5>
//                             <div className="d-flex gap-2">
//                                 <button
//                                     className="btn btn-sm btn-success"
//                                     onClick={() => {
//                                         if (selectedApplication) {
//                                             downloadResume(
//                                                 selectedApplication.resume,
//                                                 selectedApplication.resume_original_name || `${selectedApplication.full_name}_resume.pdf`
//                                             );
//                                         }
//                                     }}
//                                 >
//                                     <i className="bi bi-download me-1"></i>
//                                     Download
//                                 </button>
//                                 <button
//                                     style={modalStyles.closeButton}
//                                     onClick={() => {
//                                         setShowPdfModal(false);
//                                         setPdfUrl('');
//                                     }}
//                                 >
//                                     ✕
//                                 </button>
//                             </div>
//                         </div>

//                         <div style={modalStyles.pdfBody}>
//                             <iframe
//                                 src={pdfUrl}
//                                 style={{
//                                     width: '100%',
//                                     height: '100%',
//                                     border: 'none'
//                                 }}
//                                 title="Resume PDF"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ===== EDIT MODAL - UPDATED ===== */}
//             {showEditModal && selectedApplication && (
//                 <div style={modalStyles.overlay} onClick={(e) => {
//                     if (e.target === e.currentTarget) setShowEditModal(false);
//                 }}>
//                     <div style={modalStyles.modal}>
//                         <div style={modalStyles.header}>
//                             <h5 style={{ color: theme.text, margin: 0 }}>
//                                 <i className="bi bi-pencil-square me-2" style={{ color: '#0d6efd' }}></i>
//                                 Edit Application: {selectedApplication.full_name}
//                             </h5>
//                             <button
//                                 style={modalStyles.closeButton}
//                                 onClick={() => setShowEditModal(false)}
//                             >
//                                 ✕
//                             </button>
//                         </div>

//                         <form onSubmit={handleUpdateApplication}>
//                             <div style={modalStyles.body}>
//                                 <div className="row g-3">
//                                     <div className="col-md-6">
//                                         <label style={modalStyles.label}>Full Name <span className="text-danger">*</span></label>
//                                         <input
//                                             type="text"
//                                             name="full_name"
//                                             className="form-control"
//                                             value={editFormData.full_name}
//                                             onChange={handleEditChange}
//                                             style={modalStyles.input}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="col-md-6">
//                                         <label style={modalStyles.label}>Email <span className="text-danger">*</span></label>
//                                         <input
//                                             type="email"
//                                             name="email"
//                                             className="form-control"
//                                             value={editFormData.email}
//                                             onChange={handleEditChange}
//                                             style={modalStyles.input}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="col-md-6">
//                                         <label style={modalStyles.label}>Phone <span className="text-danger">*</span></label>
//                                         <input
//                                             type="text"
//                                             name="phone"
//                                             className="form-control"
//                                             value={editFormData.phone}
//                                             onChange={handleEditChange}
//                                             style={modalStyles.input}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="col-md-6">
//                                         <label style={modalStyles.label}>Experience</label>
//                                         <select
//                                             name="experience"
//                                             className="form-select"
//                                             value={editFormData.experience}
//                                             onChange={handleEditChange}
//                                             style={modalStyles.select}
//                                         >
//                                             <option value="">Select Experience</option>
//                                             <option value="entry">Fresh Graduate / Entry Level</option>
//                                             <option value="1-2">1–2 years</option>
//                                             <option value="3-5">3–5 years</option>
//                                             <option value="5-10">5–10 years</option>
//                                             <option value="10+">10+ years</option>
//                                         </select>
//                                     </div>
//                                     <div className="col-md-6">
//                                         <label style={modalStyles.label}>Current Company</label>
//                                         <input
//                                             type="text"
//                                             name="current_company"
//                                             className="form-control"
//                                             value={editFormData.current_company}
//                                             onChange={handleEditChange}
//                                             style={modalStyles.input}
//                                             placeholder="Current company name"
//                                         />
//                                     </div>
//                                     <div className="col-md-6">
//                                         <label style={modalStyles.label}>Designation</label>
//                                         <input
//                                             type="text"
//                                             name="designation"
//                                             className="form-control"
//                                             value={editFormData.designation}
//                                             onChange={handleEditChange}
//                                             style={modalStyles.input}
//                                             placeholder="Current designation"
//                                         />
//                                     </div>
//                                     <div className="col-md-6">
//                                         <label style={modalStyles.label}>Notice Period</label>
//                                         <select
//                                             name="notice_period"
//                                             className="form-select"
//                                             value={editFormData.notice_period}
//                                             onChange={handleEditChange}
//                                             style={modalStyles.select}
//                                         >
//                                             <option value="">Select Notice Period</option>
//                                             <option value="immediate">Immediate</option>
//                                             <option value="15-days">15 days</option>
//                                             <option value="30-days">30 days</option>
//                                             <option value="45-days">45 days</option>
//                                             <option value="60-days">60 days</option>
//                                             <option value="90-days">90 days</option>
//                                         </select>
//                                     </div>
//                                     <div className="col-md-6">
//                                         <label style={modalStyles.label}>Status</label>
//                                         <select
//                                             name="status"
//                                             className="form-select"
//                                             value={editFormData.status}
//                                             onChange={handleEditChange}
//                                             style={modalStyles.select}
//                                         >
//                                             {statusOptions.map((option) => (
//                                                 <option key={option.value} value={option.value}>
//                                                     {option.label}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                     <div className="col-12">
//                                         <label style={modalStyles.label}>Cover Letter</label>
//                                         <textarea
//                                             name="cover_letter"
//                                             className="form-control"
//                                             rows="3"
//                                             value={editFormData.cover_letter}
//                                             onChange={handleEditChange}
//                                             style={modalStyles.textarea}
//                                             placeholder="Cover letter or additional information..."
//                                         />
//                                     </div>
//                                     <div className="col-12">
//                                         <label style={modalStyles.label}>Admin Note</label>
//                                         <textarea
//                                             name="admin_note"
//                                             className="form-control"
//                                             rows="2"
//                                             value={editFormData.admin_note}
//                                             onChange={handleEditChange}
//                                             style={modalStyles.textarea}
//                                             placeholder="Add internal notes about this application..."
//                                         />
//                                     </div>
//                                 </div>
//                             </div>

//                             <div style={modalStyles.footer}>
//                                 <button
//                                     type="button"
//                                     className="btn btn-secondary"
//                                     onClick={() => setShowEditModal(false)}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="btn btn-primary"
//                                     disabled={loading}
//                                 >
//                                     {loading ? (
//                                         <>
//                                             <span className="spinner-border spinner-border-sm me-2"></span>
//                                             Updating...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <i className="bi bi-save me-2"></i>
//                                             Update Application
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* ===== STATUS MODAL ===== */}
//             {showStatusModal && selectedApplication && (
//                 <div style={modalStyles.overlay} onClick={(e) => {
//                     if (e.target === e.currentTarget) setShowStatusModal(false);
//                 }}>
//                     <div style={{ ...modalStyles.modal, maxWidth: '450px' }}>
//                         <div style={modalStyles.header}>
//                             <h5 style={{ color: theme.text, margin: 0 }}>
//                                 <i className="bi bi-check-circle me-2" style={{ color: '#28a745' }}></i>
//                                 Update Status
//                             </h5>
//                             <button
//                                 style={modalStyles.closeButton}
//                                 onClick={() => setShowStatusModal(false)}
//                             >
//                                 ✕
//                             </button>
//                         </div>

//                         <div style={modalStyles.body}>
//                             <p style={{ color: theme.text, marginBottom: '16px' }}>
//                                 Update status for <strong>{selectedApplication.full_name}</strong>
//                             </p>
//                             <div className="mb-3">
//                                 <label style={modalStyles.label}>Select Status</label>
//                                 <select
//                                     className="form-select"
//                                     value={editFormData.status}
//                                     onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
//                                     style={modalStyles.select}
//                                 >
//                                     {statusOptions.map((option) => (
//                                         <option key={option.value} value={option.value}>
//                                             {option.label}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div style={{
//                                 backgroundColor: theme.bg,
//                                 padding: '12px',
//                                 borderRadius: '8px',
//                                 marginTop: '12px'
//                             }}>
//                                 <p style={{ color: theme.text, margin: 0, fontSize: '13px' }}>
//                                     <i className="bi bi-info-circle me-1"></i>
//                                     Current status: <span style={getStatusStyle(selectedApplication.status)}>
//                                         {statusOptions.find(s => s.value === selectedApplication.status)?.label || selectedApplication.status}
//                                     </span>
//                                 </p>
//                             </div>
//                         </div>

//                         <div style={modalStyles.footer}>
//                             <button
//                                 type="button"
//                                 className="btn btn-secondary"
//                                 onClick={() => setShowStatusModal(false)}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="button"
//                                 className="btn btn-success"
//                                 onClick={handleUpdateStatus}
//                                 disabled={loading}
//                             >
//                                 {loading ? (
//                                     <>
//                                         <span className="spinner-border spinner-border-sm me-2"></span>
//                                         Updating...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <i className="bi bi-check2 me-2"></i>
//                                         Update Status
//                                     </>
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ===== DELETE MODAL ===== */}
//             {showDeleteModal && selectedApplication && (
//                 <div style={modalStyles.overlay} onClick={(e) => {
//                     if (e.target === e.currentTarget) setShowDeleteModal(false);
//                 }}>
//                     <div style={{ ...modalStyles.modal, maxWidth: '500px' }}>
//                         <div style={modalStyles.header}>
//                             <h5 style={{ color: theme.text, margin: 0 }}>
//                                 <i className="bi bi-exclamation-triangle-fill me-2" style={{ color: '#dc3545' }}></i>
//                                 Delete Application
//                             </h5>
//                             <button
//                                 style={modalStyles.closeButton}
//                                 onClick={() => setShowDeleteModal(false)}
//                             >
//                                 ✕
//                             </button>
//                         </div>

//                         <div style={modalStyles.body}>
//                             <p style={{ color: theme.text }}>Are you sure you want to delete this application?</p>
//                             <div style={{
//                                 backgroundColor: theme.bg,
//                                 padding: '16px',
//                                 borderRadius: '10px',
//                                 marginBottom: '16px',
//                                 border: `1px solid ${theme.border}`
//                             }}>
//                                 <h6 style={{ color: theme.text, margin: 0 }}>{selectedApplication.full_name}</h6>
//                                 <p style={{ color: theme.text, opacity: 0.7, margin: '4px 0 0 0', fontSize: '13px' }}>
//                                     {selectedApplication.job_title || 'N/A'} • {selectedApplication.email}
//                                 </p>
//                             </div>
//                             <div className="alert alert-danger" style={{ borderRadius: '10px' }}>
//                                 <i className="bi bi-info-circle me-2"></i>
//                                 This action cannot be undone!
//                             </div>
//                         </div>

//                         <div style={modalStyles.footer}>
//                             <button
//                                 type="button"
//                                 className="btn btn-secondary"
//                                 onClick={() => setShowDeleteModal(false)}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="button"
//                                 className="btn btn-danger"
//                                 onClick={handleDeleteApplication}
//                                 disabled={loading}
//                             >
//                                 {loading ? (
//                                     <>
//                                         <span className="spinner-border spinner-border-sm me-2"></span>
//                                         Deleting...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <i className="bi bi-trash me-2"></i>
//                                         Delete Application
//                                     </>
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <style jsx>{`
//                 @keyframes fadeIn {
//                     from { opacity: 0; }
//                     to { opacity: 1; }
//                 }
//                 @keyframes slideIn {
//                     from { transform: translateY(-30px) scale(0.95); opacity: 0; }
//                     to { transform: translateY(0) scale(1); opacity: 1; }
//                 }
                
//                 .btn-close {
//                     background: transparent;
//                     border: none;
//                     font-size: 20px;
//                     cursor: pointer;
//                     color: ${theme.text};
//                     opacity: 0.5;
//                     transition: opacity 0.2s;
//                     padding: 4px 8px;
//                 }
//                 .btn-close:hover {
//                     opacity: 1;
//                 }
                
//                 .form-control, .form-select {
//                     background-color: ${theme.bg} !important;
//                     color: ${theme.text} !important;
//                     border-color: ${theme.border} !important;
//                     transition: all 0.2s;
//                 }
//                 .form-control:focus, .form-select:focus {
//                     box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
//                     border-color: #0d6efd;
//                     outline: none;
//                 }
//                 .form-control::placeholder {
//                     color: ${theme.text} !important;
//                     opacity: 0.5;
//                 }
                
//                 .table {
//                     margin-bottom: 0;
//                 }
//                 .table > :not(caption) > * > * {
//                     background-color: transparent !important;
//                     border-bottom-color: ${theme.border} !important;
//                 }
                
//                 .table tbody tr:hover {
//                     background-color: rgba(13, 110, 253, 0.04) !important;
//                 }
                
//                 .btn-group .btn {
//                     border-radius: 6px;
//                     padding: 4px 10px;
//                     margin: 0 2px;
//                 }
//                 .btn-group .btn:hover {
//                     transform: scale(1.1);
//                     transition: transform 0.2s;
//                 }
                
//                 .input-group-text {
//                     background-color: ${theme.card} !important;
//                     border-color: ${theme.border} !important;
//                     color: ${theme.text} !important;
//                 }
                
//                 iframe {
//                     background-color: #f5f5f5;
//                 }
                
//                 ::-webkit-scrollbar {
//                     width: 6px;
//                     height: 6px;
//                 }
//                 ::-webkit-scrollbar-track {
//                     background: ${theme.bg};
//                     border-radius: 10px;
//                 }
//                 ::-webkit-scrollbar-thumb {
//                     background: ${theme.border};
//                     border-radius: 10px;
//                 }
//                 ::-webkit-scrollbar-thumb:hover {
//                     background: #0d6efd;
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default JobQuery;




import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending', color: '#f0a500' },
    { value: 'reviewing', label: 'Reviewing', color: '#0ea5b7' },
    { value: 'shortlisted', label: 'Shortlisted', color: '#2f9e5b' },
    { value: 'rejected', label: 'Rejected', color: '#e0523f' },
    { value: 'hired', label: 'Hired', color: '#7c5cbf' }
];

const EXPERIENCE_LABELS = {
    entry: 'Fresh Graduate / Entry Level',
    '1-2': '1–2 years',
    '3-5': '3–5 years',
    '5-10': '5–10 years',
    '10+': '10+ years'
};

const NOTICE_LABELS = {
    immediate: 'Immediate',
    '15-days': '15 days',
    '30-days': '30 days',
    '45-days': '45 days',
    '60-days': '60 days',
    '90-days': '90 days'
};

const EMPTY_FORM = {
    full_name: '', email: '', phone: '', experience: '', current_company: '',
    designation: '', notice_period: '', cover_letter: '', status: 'pending', admin_note: ''
};

const API_URL = 'https://backend.akashbariresort.com/api';
const STORAGE_URL = 'https://backend.akashbariresort.com/storage';

// ---- Small reusable pieces (keeps the JSX below short & consistent) ----

const Modal = ({ theme, title, icon, iconColor, onClose, children, footer, wide }) => (
    <div
        style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(20,20,30,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1050, padding: '20px', animation: 'fadeIn .2s ease'
        }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
    >
        <div style={{
            backgroundColor: theme.card, borderRadius: '18px', width: '100%',
            maxWidth: wide ? '900px' : '620px', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 24px 60px rgba(0,0,0,0.35)', animation: 'slideIn .25s ease'
        }}>
            <div style={{
                padding: '18px 22px', borderBottom: `1px solid ${theme.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <h5 style={{ color: theme.text, margin: 0, fontWeight: 600 }}>
                    <i className={`bi ${icon} me-2`} style={{ color: iconColor }}></i>{title}
                </h5>
                <button onClick={onClose} style={{
                    background: 'transparent', border: 'none', fontSize: '22px',
                    color: theme.text, opacity: 0.6, cursor: 'pointer'
                }}>✕</button>
            </div>
            <div style={{ padding: '22px', overflowY: 'auto' }}>{children}</div>
            {footer && (
                <div style={{
                    padding: '16px 22px', borderTop: `1px solid ${theme.border}`,
                    display: 'flex', justifyContent: 'flex-end', gap: '10px'
                }}>{footer}</div>
            )}
        </div>
    </div>
);

const Field = ({ label, theme, children }) => (
    <div className="col-md-6">
        <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>
            {label}
        </label>
        {children}
    </div>
);

const StatusBadge = ({ status }) => {
    const opt = STATUS_OPTIONS.find(s => s.value === status);
    return (
        <span style={{
            backgroundColor: opt?.color || '#8a8a8a', color: '#fff', padding: '4px 12px',
            borderRadius: '999px', fontSize: '12px', fontWeight: 600
        }}>
            {opt?.label || status}
        </span>
    );
};

// ---------------------------------------------------------------------

const JobQuery = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedApplication, setSelectedApplication] = useState(null);

    const [activeModal, setActiveModal] = useState(null); // 'detail' | 'edit' | 'delete' | 'status' | 'pdf'
    const [pdfUrl, setPdfUrl] = useState('');
    const [formData, setFormData] = useState(EMPTY_FORM);

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#15172b' : '#f5f3f7',
        card: isDarkMode ? '#1d2140' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#333a4d',
        border: isDarkMode ? '#2c2f4d' : '#e7e5ee',
        accent: '#6c5ce7'
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const fieldStyle = {
        backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}`,
        borderRadius: '10px', padding: '10px 14px', width: '100%', fontSize: '14px'
    };

    const getResumeUrl = (path) => path ? `${STORAGE_URL}/${path.replace(/^public\//, '')}` : null;

    const fetchApplications = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.set('search', searchTerm);
            if (statusFilter) params.set('status', statusFilter);
            const res = await fetch(`${API_URL}/applications?${params}`);
            if (!res.ok) throw new Error('Failed to fetch applications');
            const data = await res.json();
            const list = data.data?.data || data.data || [];
            setApplications(list.map(app => ({ ...app, job_title: app.job_title || app.job?.title || 'N/A' })));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchApplications(); }, [searchTerm, statusFilter]);

    useEffect(() => {
        if (!successMessage) return;
        const t = setTimeout(() => setSuccessMessage(''), 3000);
        return () => clearTimeout(t);
    }, [successMessage]);

    const closeModal = () => { setActiveModal(null); setSelectedApplication(null); };

    const openModal = (type, app) => {
        setSelectedApplication(app);
        if (type === 'edit' || type === 'status') {
            setFormData({
                full_name: app.full_name || '', email: app.email || '', phone: app.phone || '',
                experience: app.experience || '', current_company: app.current_company || '',
                designation: app.designation || '', notice_period: app.notice_period || '',
                cover_letter: app.cover_letter || '', status: app.status || 'pending',
                admin_note: app.admin_note || ''
            });
        }
        setActiveModal(type);
    };

    const viewApplication = async (id) => {
        try {
            const res = await fetch(`${API_URL}/applications/${id}`);
            if (!res.ok) throw new Error('Failed to fetch application details');
            const { data } = await res.json();
            data.job_title = data.job_title || data.job?.title || 'N/A';
            openModal('detail', data);
        } catch (err) {
            setError(err.message);
        }
    };

    const runRequest = async (url, options, successMsg) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(url, options);
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Request failed');
            }
            setSuccessMessage(successMsg);
            closeModal();
            fetchApplications();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateApplication = (e) => {
        e.preventDefault();
        runRequest(`${API_URL}/applications/${selectedApplication.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(formData)
        }, 'Application updated successfully!');
    };

    const handleUpdateStatus = () => runRequest(`${API_URL}/applications/${selectedApplication.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ status: formData.status })
    }, 'Status updated successfully!');

    const handleDeleteApplication = () => runRequest(`${API_URL}/applications/${selectedApplication.id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' }
    }, 'Application deleted successfully!');

    const downloadResume = (path, fileName) => {
        if (!path) return setError('No resume found');
        const link = document.createElement('a');
        link.href = getResumeUrl(path);
        link.download = fileName || 'resume.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setSuccessMessage('Resume downloaded successfully!');
    };

    const viewPdf = (path) => {
        if (!path) return setError('No resume found');
        setPdfUrl(getResumeUrl(path));
        setActiveModal('pdf');
    };

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="jobquery" />

                <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="flex-grow-1">
                    <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '24px' }}>
                            {successMessage && (
                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                    <i className="bi bi-check-circle-fill me-2"></i>{successMessage}
                                    <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                                </div>
                            )}

                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                <div>
                                    <h2 style={{ color: theme.text }}>Job Applications</h2>
                                    <p style={{ color: theme.text, opacity: 0.65 }}>Manage all job applications and inquiries</p>
                                </div>
                                <span style={{
                                    backgroundColor: theme.accent, color: '#fff', fontSize: '14px',
                                    padding: '8px 18px', borderRadius: '999px', fontWeight: 600
                                }}>
                                    Total: {applications.length}
                                </span>
                            </div>

                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <span className="input-group-text" style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}>
                                            <i className="bi bi-search"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search by name, email, phone, company, designation..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{ backgroundColor: theme.card, color: theme.text, borderColor: theme.border }}
                                        />
                                        {searchTerm && (
                                            <button className="btn btn-outline-secondary" onClick={() => setSearchTerm('')} style={{ borderColor: theme.border, color: theme.text }}>
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
                                        style={{ backgroundColor: theme.card, color: theme.text, borderColor: theme.border }}
                                    >
                                        <option value="">All Status</option>
                                        {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover" style={{ backgroundColor: theme.card, borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 14px rgba(0,0,0,0.06)' }}>
                                    <thead style={{ color: theme.text, borderBottom: `2px solid ${theme.border}` }}>
                                        <tr>
                                            {['#', 'Name', 'Applied Position', 'Company', 'Designation', 'Experience', 'Status', 'Applied', 'Actions'].map(h => (
                                                <th key={h} style={{ padding: '14px 16px' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="9" className="text-center py-5">
                                                <div className="spinner-border" style={{ color: theme.accent }} role="status"></div>
                                                <p className="mt-2" style={{ color: theme.text }}>Loading applications...</p>
                                            </td></tr>
                                        ) : applications.length === 0 ? (
                                            <tr><td colSpan="9" className="text-center py-5" style={{ color: theme.text }}>
                                                <i className="bi bi-inbox display-4 d-block mb-3" style={{ opacity: 0.4 }}></i>
                                                <h5>No applications found</h5>
                                                <p style={{ opacity: 0.65 }}>{searchTerm || statusFilter ? 'Try adjusting your search filters' : 'No applications submitted yet'}</p>
                                            </td></tr>
                                        ) : applications.map(app => (
                                            <tr key={app.id} style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>
                                                <td style={{ padding: '12px 16px', fontWeight: 600 }}>#{String(app.id).padStart(3, '0')}</td>
                                                <td style={{ padding: '12px 16px' }}><strong>{app.full_name}</strong></td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <span style={{ backgroundColor: `${theme.accent}22`, color: theme.accent, padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
                                                        {app.job_title || 'N/A'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>{app.current_company || 'N/A'}</td>
                                                <td style={{ padding: '12px 16px' }}>{app.designation || 'N/A'}</td>
                                                <td style={{ padding: '12px 16px' }}>{EXPERIENCE_LABELS[app.experience] || app.experience || 'Not specified'}</td>
                                                <td style={{ padding: '12px 16px' }}><StatusBadge status={app.status} /></td>
                                                <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                                                    {new Date(app.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <div className="btn-group btn-group-sm">
                                                        <button className="btn btn-outline-info" onClick={() => viewApplication(app.id)} title="View Details"><i className="bi bi-eye"></i></button>
                                                        <button className="btn btn-outline-success" onClick={() => openModal('status', app)} title="Change Status"><i className="bi bi-check-circle"></i></button>
                                                        <button className="btn btn-outline-danger" onClick={() => openModal('delete', app)} title="Delete"><i className="bi bi-trash"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <Footer theme={theme} />
                    </div>
                </div>
            </div>

            {/* Detail */}
            {activeModal === 'detail' && selectedApplication && (
                <Modal theme={theme} title="Application Details" icon="bi-info-circle" iconColor={theme.accent} onClose={closeModal} wide
                    footer={<>
                        <button className="btn btn-secondary" onClick={closeModal}>Close</button>
                        <button className="btn btn-primary" onClick={() => openModal('edit', selectedApplication)}>
                            <i className="bi bi-pencil me-2"></i>Edit
                        </button>
                    </>}
                >
                    <div className="row g-3">
                        <Field label="Full Name" theme={theme}><div style={{ color: theme.text, fontWeight: 500 }}>{selectedApplication.full_name}</div></Field>
                        <Field label="Applied Position" theme={theme}>
                            <span style={{ backgroundColor: `${theme.accent}22`, color: theme.accent, padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
                                {selectedApplication.job_title || 'N/A'}
                            </span>
                        </Field>
                        <Field label="Email" theme={theme}><a href={`mailto:${selectedApplication.email}`} style={{ color: theme.accent }}>{selectedApplication.email}</a></Field>
                        <Field label="Phone" theme={theme}><a href={`tel:${selectedApplication.phone}`} style={{ color: theme.accent }}>{selectedApplication.phone}</a></Field>
                        <Field label="Experience" theme={theme}><span style={{ color: theme.text }}>{EXPERIENCE_LABELS[selectedApplication.experience] || 'Not specified'}</span></Field>
                        <Field label="Status" theme={theme}><StatusBadge status={selectedApplication.status} /></Field>
                        <Field label="Current Company" theme={theme}><div style={{ color: theme.text, fontWeight: 500 }}>{selectedApplication.current_company || 'N/A'}</div></Field>
                        <Field label="Designation" theme={theme}><div style={{ color: theme.text, fontWeight: 500 }}>{selectedApplication.designation || 'N/A'}</div></Field>
                        <Field label="Notice Period" theme={theme}><div style={{ color: theme.text }}>{NOTICE_LABELS[selectedApplication.notice_period] || 'Not specified'}</div></Field>
                        <div className="col-12">
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>Cover Letter</label>
                            <div style={{ color: theme.text, backgroundColor: theme.bg, padding: '12px', borderRadius: '10px', minHeight: '80px', whiteSpace: 'pre-wrap' }}>
                                {selectedApplication.cover_letter || 'No cover letter provided'}
                            </div>
                        </div>
                        {selectedApplication.admin_note && (
                            <div className="col-12">
                                <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>Admin Note</label>
                                <div style={{ color: theme.text, backgroundColor: theme.bg, padding: '12px', borderRadius: '10px', whiteSpace: 'pre-wrap', borderLeft: `3px solid ${theme.accent}` }}>
                                    {selectedApplication.admin_note}
                                </div>
                            </div>
                        )}
                        {selectedApplication.resume && (
                            <div className="col-12 d-flex gap-2 flex-wrap">
                                <button className="btn btn-primary" onClick={() => viewPdf(selectedApplication.resume)}><i className="bi bi-eye me-2"></i>View Resume</button>
                                <button className="btn btn-success" onClick={() => downloadResume(selectedApplication.resume, selectedApplication.resume_original_name || `${selectedApplication.full_name}_resume.pdf`)}>
                                    <i className="bi bi-download me-2"></i>Download Resume
                                </button>
                            </div>
                        )}
                        <div className="col-12">
                            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>Applied On</label>
                            <div style={{ color: theme.text }}>
                                {new Date(selectedApplication.created_at).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* PDF */}
            {activeModal === 'pdf' && pdfUrl && (
                <Modal theme={theme} title={`Resume: ${selectedApplication?.full_name || 'Document'}`} icon="bi-file-pdf" iconColor="#e0523f"
                    onClose={() => { setActiveModal(null); setPdfUrl(''); }} wide
                >
                    <iframe src={pdfUrl} style={{ width: '100%', height: '70vh', border: 'none', borderRadius: '10px' }} title="Resume PDF" />
                </Modal>
            )}

            {/* Edit */}
            {activeModal === 'edit' && selectedApplication && (
                <form onSubmit={handleUpdateApplication}>
                    <Modal theme={theme} title={`Edit Application: ${selectedApplication.full_name}`} icon="bi-pencil-square" iconColor={theme.accent} onClose={closeModal} wide
                        footer={<>
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Updating...</> : <><i className="bi bi-save me-2"></i>Update Application</>}
                            </button>
                        </>}
                    >
                        <div className="row g-3">
                            <Field label={<>Full Name <span className="text-danger">*</span></>} theme={theme}>
                                <input required value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} style={fieldStyle} />
                            </Field>
                            <Field label={<>Email <span className="text-danger">*</span></>} theme={theme}>
                                <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={fieldStyle} />
                            </Field>
                            <Field label={<>Phone <span className="text-danger">*</span></>} theme={theme}>
                                <input required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={fieldStyle} />
                            </Field>
                            <Field label="Experience" theme={theme}>
                                <select value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} style={fieldStyle}>
                                    <option value="">Select Experience</option>
                                    {Object.entries(EXPERIENCE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                </select>
                            </Field>
                            <Field label="Current Company" theme={theme}>
                                <input value={formData.current_company} onChange={(e) => setFormData({ ...formData, current_company: e.target.value })} style={fieldStyle} placeholder="Current company name" />
                            </Field>
                            <Field label="Designation" theme={theme}>
                                <input value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} style={fieldStyle} placeholder="Current designation" />
                            </Field>
                            <Field label="Notice Period" theme={theme}>
                                <select value={formData.notice_period} onChange={(e) => setFormData({ ...formData, notice_period: e.target.value })} style={fieldStyle}>
                                    <option value="">Select Notice Period</option>
                                    {Object.entries(NOTICE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                </select>
                            </Field>
                            <Field label="Status" theme={theme}>
                                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={fieldStyle}>
                                    {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </Field>
                            <div className="col-12">
                                <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>Cover Letter</label>
                                <textarea rows="3" value={formData.cover_letter} onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })} style={{ ...fieldStyle, minHeight: '80px' }} placeholder="Cover letter or additional information..." />
                            </div>
                            <div className="col-12">
                                <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>Admin Note</label>
                                <textarea rows="2" value={formData.admin_note} onChange={(e) => setFormData({ ...formData, admin_note: e.target.value })} style={{ ...fieldStyle, minHeight: '60px' }} placeholder="Add internal notes about this application..." />
                            </div>
                        </div>
                    </Modal>
                </form>
            )}

            {/* Status */}
            {activeModal === 'status' && selectedApplication && (
                <Modal theme={theme} title="Update Status" icon="bi-check-circle" iconColor="#2f9e5b" onClose={closeModal}
                    footer={<>
                        <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                        <button className="btn btn-success" onClick={handleUpdateStatus} disabled={loading}>
                            {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Updating...</> : <><i className="bi bi-check2 me-2"></i>Update Status</>}
                        </button>
                    </>}
                >
                    <p style={{ color: theme.text, marginBottom: '16px' }}>Update status for <strong>{selectedApplication.full_name}</strong></p>
                    <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>Select Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={fieldStyle}>
                        {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <div style={{ backgroundColor: theme.bg, padding: '12px', borderRadius: '10px', marginTop: '14px' }}>
                        <p style={{ color: theme.text, margin: 0, fontSize: '13px' }}>
                            <i className="bi bi-info-circle me-1"></i>Current status: <StatusBadge status={selectedApplication.status} />
                        </p>
                    </div>
                </Modal>
            )}

            {/* Delete */}
            {activeModal === 'delete' && selectedApplication && (
                <Modal theme={theme} title="Delete Application" icon="bi-exclamation-triangle-fill" iconColor="#e0523f" onClose={closeModal}
                    footer={<>
                        <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                        <button className="btn btn-danger" onClick={handleDeleteApplication} disabled={loading}>
                            {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Deleting...</> : <><i className="bi bi-trash me-2"></i>Delete Application</>}
                        </button>
                    </>}
                >
                    <p style={{ color: theme.text }}>Are you sure you want to delete this application?</p>
                    <div style={{ backgroundColor: theme.bg, padding: '16px', borderRadius: '10px', marginBottom: '16px', border: `1px solid ${theme.border}` }}>
                        <h6 style={{ color: theme.text, margin: 0 }}>{selectedApplication.full_name}</h6>
                        <p style={{ color: theme.text, opacity: 0.65, margin: '4px 0 0 0', fontSize: '13px' }}>
                            {selectedApplication.job_title || 'N/A'} • {selectedApplication.email}
                        </p>
                    </div>
                    <div className="alert alert-danger" style={{ borderRadius: '10px' }}>
                        <i className="bi bi-info-circle me-2"></i>This action cannot be undone!
                    </div>
                </Modal>
            )}

            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideIn { from { transform: translateY(-24px) scale(0.96); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
                .form-control, .form-select {
                    background-color: ${theme.bg} !important;
                    color: ${theme.text} !important;
                    border-color: ${theme.border} !important;
                }
                .form-control:focus, .form-select:focus {
                    box-shadow: 0 0 0 3px ${theme.accent}26;
                    border-color: ${theme.accent};
                }
                .table tbody tr:hover { background-color: ${theme.accent}0d !important; }
                .btn-group .btn { border-radius: 6px; padding: 4px 10px; margin: 0 2px; }
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: ${theme.bg}; }
                ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: ${theme.accent}; }
            `}</style>
        </div>
    );
};

export default JobQuery;