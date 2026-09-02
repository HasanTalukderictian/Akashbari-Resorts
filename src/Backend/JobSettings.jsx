// import React, { useState, useEffect } from 'react';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import Footer from './Footer';

// const JobSettings = ({ theme: propsTheme }) => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(false);
//     const [jobs, setJobs] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [successMessage, setSuccessMessage] = useState('');
    
//     // Modal states
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [selectedJob, setSelectedJob] = useState(null);

//     // Form states
//     const [formData, setFormData] = useState({
//         title: '',
//         category: 'TOUR',
//         description: '',
//         locations: '',
//         type: 'Contract',
//         posted: '',
//         buttonText: 'VIEW DETAILS',
//         status: true,
//         jobDetails: {
//             metaInfo: {
//                 duration: 'Full-time',
//                 salary: 'Competitive',
//                 type: 'On Site',
//                 startTime: '9:00 AM',
//                 endTime: '5:00 PM'
//             },
//             overview: {
//                 title: 'JOB OVERVIEW',
//                 description: ''
//             },
//             responsibilities: {
//                 title: 'KEY RESPONSIBILITIES',
//                 items: ['']
//             },
//             requirements: {
//                 title: 'REQUIREMENTS',
//                 items: ['']
//             },
//             benefits: {
//                 title: 'BENEFITS & PERKS',
//                 items: ['']
//             }
//         }
//     });

//     const theme = propsTheme || {
//         isDarkMode,
//         bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
//         card: isDarkMode ? '#16213e' : '#ffffff',
//         text: isDarkMode ? '#e9ecef' : '#3e4b5b',
//         border: isDarkMode ? '#2d3436' : '#ebedf2',
//         sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b'
//     };

//     // const API_URL = 'http://127.0.0.1:8000/api';
//     const API_URL = 'https://backend.akashbariresort.com/api';

//     // Fetch all jobs
//     const fetchJobs = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await fetch(`${API_URL}/jobs`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch jobs');
//             }
//             const data = await response.json();
//             setJobs(data.data || []);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchJobs();
//     }, []);

//     // Auto-hide success message
//     useEffect(() => {
//         if (successMessage) {
//             const timer = setTimeout(() => setSuccessMessage(''), 3000);
//             return () => clearTimeout(timer);
//         }
//     }, [successMessage]);

//     const toggleSidebar = () => setIsCollapsed(!isCollapsed);
//     const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

//     // Handle form input change
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     // Handle nested form change
//     const handleNestedChange = (section, field, value) => {
//         setFormData({
//             ...formData,
//             jobDetails: {
//                 ...formData.jobDetails,
//                 [section]: {
//                     ...formData.jobDetails[section],
//                     [field]: value
//                 }
//             }
//         });
//     };

//     // Handle meta info change
//     const handleMetaChange = (field, value) => {
//         setFormData({
//             ...formData,
//             jobDetails: {
//                 ...formData.jobDetails,
//                 metaInfo: {
//                     ...formData.jobDetails.metaInfo,
//                     [field]: value
//                 }
//             }
//         });
//     };

//     // Handle array items change
//     const handleArrayItemChange = (section, index, value) => {
//         const newItems = [...formData.jobDetails[section].items];
//         newItems[index] = value;
//         setFormData({
//             ...formData,
//             jobDetails: {
//                 ...formData.jobDetails,
//                 [section]: {
//                     ...formData.jobDetails[section],
//                     items: newItems
//                 }
//             }
//         });
//     };

//     // Add array item
//     const addArrayItem = (section) => {
//         setFormData({
//             ...formData,
//             jobDetails: {
//                 ...formData.jobDetails,
//                 [section]: {
//                     ...formData.jobDetails[section],
//                     items: [...formData.jobDetails[section].items, '']
//                 }
//             }
//         });
//     };

//     // Remove array item
//     const removeArrayItem = (section, index) => {
//         const newItems = formData.jobDetails[section].items.filter((_, i) => i !== index);
//         setFormData({
//             ...formData,
//             jobDetails: {
//                 ...formData.jobDetails,
//                 [section]: {
//                     ...formData.jobDetails[section],
//                     items: newItems
//                 }
//             }
//         });
//     };

//     // Reset form
//     const resetForm = () => {
//         setFormData({
//             title: '',
//             category: 'TOUR',
//             description: '',
//             locations: '',
//             type: 'Contract',
//             posted: '',
//             buttonText: 'VIEW DETAILS',
//             status: true,
//             jobDetails: {
//                 metaInfo: {
//                     duration: 'Full-time',
//                     salary: 'Competitive',
//                     type: 'On Site',
//                     startTime: '9:00 AM',
//                     endTime: '5:00 PM'
//                 },
//                 overview: {
//                     title: 'JOB OVERVIEW',
//                     description: ''
//                 },
//                 responsibilities: {
//                     title: 'KEY RESPONSIBILITIES',
//                     items: ['']
//                 },
//                 requirements: {
//                     title: 'REQUIREMENTS',
//                     items: ['']
//                 },
//                 benefits: {
//                     title: 'BENEFITS & PERKS',
//                     items: ['']
//                 }
//             }
//         });
//     };

//     // Load job data for edit
//     const loadJobForEdit = (job) => {
//         setSelectedJob(job);
//         setFormData({
//             title: job.title || '',
//             category: job.category || 'TOUR',
//             description: job.description || '',
//             locations: job.locations || '',
//             type: job.type || 'Contract',
//             posted: job.posted || '',
//             buttonText: job.buttonText || 'VIEW DETAILS',
//             status: job.status !== undefined ? job.status : true,
//             jobDetails: {
//                 metaInfo: {
//                     duration: job.jobDetails?.metaInfo?.duration || 'Full-time',
//                     salary: job.jobDetails?.metaInfo?.salary || 'Competitive',
//                     type: job.jobDetails?.metaInfo?.type || 'On Site',
//                     startTime: job.jobDetails?.metaInfo?.startTime || '9:00 AM',
//                     endTime: job.jobDetails?.metaInfo?.endTime || '5:00 PM'
//                 },
//                 overview: {
//                     title: job.jobDetails?.overview?.title || 'JOB OVERVIEW',
//                     description: job.jobDetails?.overview?.description || ''
//                 },
//                 responsibilities: {
//                     title: job.jobDetails?.responsibilities?.title || 'KEY RESPONSIBILITIES',
//                     items: job.jobDetails?.responsibilities?.items || ['']
//                 },
//                 requirements: {
//                     title: job.jobDetails?.requirements?.title || 'REQUIREMENTS',
//                     items: job.jobDetails?.requirements?.items || ['']
//                 },
//                 benefits: {
//                     title: job.jobDetails?.benefits?.title || 'BENEFITS & PERKS',
//                     items: job.jobDetails?.benefits?.items || ['']
//                 }
//             }
//         });
//         setShowEditModal(true);
//     };

//     // Add Job
//     const handleAddJob = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             const response = await fetch(`${API_URL}/add-jobs`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || 'Failed to add job');
//             }

//             setSuccessMessage('Job added successfully!');
//             setShowAddModal(false);
//             resetForm();
//             fetchJobs();
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Update Job
//     const handleEditJob = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             const response = await fetch(`${API_URL}/edit-jobs/${selectedJob.id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || 'Failed to update job');
//             }

//             setSuccessMessage('Job updated successfully!');
//             setShowEditModal(false);
//             setSelectedJob(null);
//             resetForm();
//             fetchJobs();
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Delete Job
//     const handleDeleteJob = async () => {
//         setLoading(true);
//         try {
//             const response = await fetch(`${API_URL}/del-/${selectedJob.id}`, {
//                 method: 'DELETE',
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || 'Failed to delete job');
//             }

//             setSuccessMessage('Job deleted successfully!');
//             setShowDeleteModal(false);
//             setSelectedJob(null);
//             fetchJobs();
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Toggle Status - FIXED
//     const handleToggleStatus = async (jobId, currentStatus) => {
//         try {
//             const newStatus = !currentStatus;
//             const response = await fetch(`${API_URL}/toggule/${jobId}/status`, {
//                 method: 'PATCH',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ status: newStatus }),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || 'Failed to toggle status');
//             }

//             // Update local state immediately
//             setJobs(prevJobs => 
//                 prevJobs.map(job => 
//                     job.id === jobId ? { ...job, status: newStatus } : job
//                 )
//             );

//             setSuccessMessage(`Job ${newStatus ? 'activated' : 'deactivated'} successfully!`);
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     const styles = {
//         container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
//         mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
//         contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
//         contentScroll: { flex: '1 0 auto', padding: '24px' },
//         footerWrapper: { flexShrink: 0 }
//     };

//     // Modal Styles - FIXED with scroll
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
//             maxWidth: '850px',
//             width: '100%',
//             maxHeight: '90vh',
//             display: 'flex',
//             flexDirection: 'column',
//             boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
//             animation: 'slideIn 0.3s ease',
//             position: 'relative'
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
//         },
//         statusBadge: {
//             display: 'inline-block',
//             padding: '5px 16px',
//             borderRadius: '20px',
//             fontSize: '13px',
//             fontWeight: 600,
//             cursor: 'pointer',
//             transition: 'all 0.3s ease',
//             border: 'none'
//         }
//     };

//     return (
//         <div style={styles.container} className="container-fluid p-0">
//             <div className="d-flex">
//                 <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="job" />

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

//                             {/* Header with Add Button */}
//                             <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
//                                 <div>
//                                     <h2 style={{ color: theme.text }}>Job Management</h2>
//                                     <p style={{ color: theme.text, opacity: 0.7 }}>Manage all job postings</p>
//                                 </div>
//                                 <button
//                                     className="btn btn-primary"
//                                     onClick={() => {
//                                         resetForm();
//                                         setShowAddModal(true);
//                                     }}
//                                 >
//                                     <i className="bi bi-plus-circle me-2"></i>
//                                     Add New Job
//                                 </button>
//                             </div>

//                             {/* Job List Table */}
//                             <div className="table-responsive">
//                                 <table className="table table-hover" style={{ 
//                                     backgroundColor: theme.card,
//                                     borderRadius: '12px',
//                                     overflow: 'hidden',
//                                     boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
//                                 }}>
//                                     <thead style={{ color: theme.text, borderBottom: `2px solid ${theme.border}` }}>
//                                         <tr>
//                                             <th style={{ padding: '14px 16px' }}>ID</th>
//                                             <th style={{ padding: '14px 16px' }}>Title</th>
//                                             <th style={{ padding: '14px 16px' }}>Category</th>
//                                             <th style={{ padding: '14px 16px' }}>Type</th>
//                                             <th style={{ padding: '14px 16px' }}>Location</th>
//                                             <th style={{ padding: '14px 16px' }}>Status</th>
//                                             <th style={{ padding: '14px 16px' }}>Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {loading ? (
//                                             <tr>
//                                                 <td colSpan="7" className="text-center py-5">
//                                                     <div className="spinner-border text-primary" role="status">
//                                                         <span className="visually-hidden">Loading...</span>
//                                                     </div>
//                                                     <p className="mt-2" style={{ color: theme.text }}>Loading jobs...</p>
//                                                 </td>
//                                             </tr>
//                                         ) : jobs.length === 0 ? (
//                                             <tr>
//                                                 <td colSpan="7" className="text-center py-5" style={{ color: theme.text }}>
//                                                     <i className="bi bi-inbox display-4 d-block mb-3" style={{ opacity: 0.5 }}></i>
//                                                     <h5>No jobs found</h5>
//                                                     <p style={{ opacity: 0.7 }}>Click "Add New Job" to create your first job posting.</p>
//                                                 </td>
//                                             </tr>
//                                         ) : (
//                                             jobs.map((job) => (
//                                                 <tr key={job.id} style={{ 
//                                                     color: theme.text, 
//                                                     borderBottom: `1px solid ${theme.border}`,
//                                                     transition: 'background 0.2s'
//                                                 }}>
//                                                     <td style={{ padding: '12px 16px', fontWeight: 600 }}>
//                                                         #{String(job.id).padStart(3, '0')}
//                                                     </td>
//                                                     <td style={{ padding: '12px 16px' }}>
//                                                         <strong>{job.title}</strong>
//                                                     </td>
//                                                     <td style={{ padding: '12px 16px' }}>
//                                                         <span className="badge bg-info">{job.category}</span>
//                                                     </td>
//                                                     <td style={{ padding: '12px 16px' }}>{job.type}</td>
//                                                     <td style={{ padding: '12px 16px' }}>{job.locations}</td>
//                                                     <td style={{ padding: '12px 16px' }}>
//                                                         <button
//                                                             style={{
//                                                                 ...modalStyles.statusBadge,
//                                                                 backgroundColor: job.status ? '#198754' : '#6c757d',
//                                                                 color: '#fff'
//                                                             }}
//                                                             onClick={() => handleToggleStatus(job.id, job.status)}
//                                                             onMouseEnter={(e) => {
//                                                                 e.target.style.transform = 'scale(1.05)';
//                                                             }}
//                                                             onMouseLeave={(e) => {
//                                                                 e.target.style.transform = 'scale(1)';
//                                                             }}
//                                                         >
//                                                             <i className={`bi ${job.status ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-1`}></i>
//                                                             {job.status ? 'Active' : 'Inactive'}
//                                                         </button>
//                                                     </td>
//                                                     <td style={{ padding: '12px 16px' }}>
//                                                         <div className="btn-group btn-group-sm">
//                                                             <button
//                                                                 className="btn btn-outline-primary"
//                                                                 onClick={() => loadJobForEdit(job)}
//                                                                 title="Edit Job"
//                                                             >
//                                                                 <i className="bi bi-pencil"></i>
//                                                             </button>
//                                                             <button
//                                                                 className="btn btn-outline-danger"
//                                                                 onClick={() => {
//                                                                     setSelectedJob(job);
//                                                                     setShowDeleteModal(true);
//                                                                 }}
//                                                                 title="Delete Job"
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

//             {/* ===== ADD MODAL - FIXED ===== */}
//             {showAddModal && (
//                 <div style={modalStyles.overlay} onClick={(e) => {
//                     if (e.target === e.currentTarget) setShowAddModal(false);
//                 }}>
//                     <div style={modalStyles.modal}>
//                         <div style={modalStyles.header}>
//                             <h5 style={{ color: theme.text, margin: 0 }}>
//                                 <i className="bi bi-plus-circle me-2" style={{ color: '#0d6efd' }}></i>
//                                 Add New Job
//                             </h5>
//                             <button 
//                                 style={modalStyles.closeButton}
//                                 onClick={() => setShowAddModal(false)}
//                                 onMouseEnter={(e) => e.target.style.opacity = '1'}
//                                 onMouseLeave={(e) => e.target.style.opacity = '0.7'}
//                             >
//                                 ✕
//                             </button>
//                         </div>

//                         <form onSubmit={handleAddJob}>
//                             <div style={modalStyles.body}>
//                                 {/* Basic Information */}
//                                 <div className="row mb-3">
//                                     <div className="col-12">
//                                         <label style={modalStyles.label}>Job Title <span className="text-danger">*</span></label>
//                                         <input
//                                             type="text"
//                                             name="title"
//                                             className="form-control"
//                                             value={formData.title}
//                                             onChange={handleChange}
//                                             style={modalStyles.input}
//                                             required
//                                             placeholder="Enter job title"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="row mb-3">
//                                     <div className="col-md-6">
//                                         <label style={modalStyles.label}>Category <span className="text-danger">*</span></label>
//                                         <select
//                                             name="category"
//                                             className="form-select"
//                                             value={formData.category}
//                                             onChange={handleChange}
//                                             style={modalStyles.select}
//                                             required
//                                         >
//                                             <option value="TOUR">TOUR</option>
//                                             <option value="SALES">SALES</option>
//                                             <option value="MARKETING">MARKETING</option>
//                                             <option value="IT">IT</option>
//                                             <option value="HR">HR</option>
//                                             <option value="OTHER">OTHER</option>
//                                         </select>
//                                     </div>
//                                     <div className="col-md-6">
//                                         <label style={modalStyles.label}>Job Type <span className="text-danger">*</span></label>
//                                         <select
//                                             name="type"
//                                             className="form-select"
//                                             value={formData.type}
//                                             onChange={handleChange}
//                                             style={modalStyles.select}
//                                             required
//                                         >
//                                             <option value="Contract">Contract</option>
//                                             <option value="Full-time">Full-time</option>
//                                             <option value="Part-time">Part-time</option>
//                                             <option value="Remote">Remote</option>
//                                             <option value="Hybrid">Hybrid</option>
//                                         </select>
//                                     </div>
//                                 </div>

//                                 <div className="row mb-3">
//                                     <div className="col-12">
//                                         <label style={modalStyles.label}>Description <span className="text-danger">*</span></label>
//                                         <textarea
//                                             name="description"
//                                             className="form-control"
//                                             rows="3"
//                                             value={formData.description}
//                                             onChange={handleChange}
//                                             style={modalStyles.textarea}
//                                             required
//                                             placeholder="Enter job description"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="row mb-3">
//                                     <div className="col-md-6">
//                                         <label style={modalStyles.label}>Location <span className="text-danger">*</span></label>
//                                         <input
//                                             type="text"
//                                             name="locations"
//                                             className="form-control"
//                                             value={formData.locations}
//                                             onChange={handleChange}
//                                             style={modalStyles.input}
//                                             required
//                                             placeholder="e.g., Dhaka, Bangladesh"
//                                         />
//                                     </div>
//                                     <div className="col-md-6">
//                                         <label style={modalStyles.label}>Posted Date</label>
//                                         <input
//                                             type="text"
//                                             name="posted"
//                                             className="form-control"
//                                             value={formData.posted}
//                                             onChange={handleChange}
//                                             placeholder="e.g., Posted 2 days ago"
//                                             style={modalStyles.input}
//                                         />
//                                     </div>
//                                 </div>

//                                 <hr style={{ borderColor: theme.border, margin: '20px 0' }} />
//                                 <h6 style={{ color: theme.text, marginBottom: '16px' }}>Job Details</h6>

//                                 {/* Meta Info */}
//                                 <div className="row mb-3">
//                                     <div className="col-md-3">
//                                         <label style={modalStyles.label}>Duration</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             value={formData.jobDetails.metaInfo.duration}
//                                             onChange={(e) => handleMetaChange('duration', e.target.value)}
//                                             style={modalStyles.input}
//                                             placeholder="Full-time"
//                                         />
//                                     </div>
//                                     <div className="col-md-3">
//                                         <label style={modalStyles.label}>Salary</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             value={formData.jobDetails.metaInfo.salary}
//                                             onChange={(e) => handleMetaChange('salary', e.target.value)}
//                                             style={modalStyles.input}
//                                             placeholder="Competitive"
//                                         />
//                                     </div>
//                                     <div className="col-md-3">
//                                         <label style={modalStyles.label}>Work Type</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             value={formData.jobDetails.metaInfo.type}
//                                             onChange={(e) => handleMetaChange('type', e.target.value)}
//                                             style={modalStyles.input}
//                                             placeholder="On Site"
//                                         />
//                                     </div>
//                                     <div className="col-md-3">
//                                         <label style={modalStyles.label}>Start Time</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             value={formData.jobDetails.metaInfo.startTime}
//                                             onChange={(e) => handleMetaChange('startTime', e.target.value)}
//                                             style={modalStyles.input}
//                                             placeholder="9:00 AM"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Overview */}
//                                 <div className="mb-3">
//                                     <label style={modalStyles.label}>Overview Description</label>
//                                     <textarea
//                                         className="form-control"
//                                         rows="2"
//                                         value={formData.jobDetails.overview.description}
//                                         onChange={(e) => handleNestedChange('overview', 'description', e.target.value)}
//                                         style={modalStyles.textarea}
//                                         placeholder="Enter job overview"
//                                     />
//                                 </div>

//                                 {/* Responsibilities */}
//                                 <div className="mb-3">
//                                     <label style={modalStyles.label}>Responsibilities</label>
//                                     {formData.jobDetails.responsibilities.items.map((item, index) => (
//                                         <div key={index} className="input-group mb-2">
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 value={item}
//                                                 onChange={(e) => handleArrayItemChange('responsibilities', index, e.target.value)}
//                                                 placeholder={`Responsibility ${index + 1}`}
//                                                 style={modalStyles.input}
//                                             />
//                                             <button
//                                                 type="button"
//                                                 className="btn btn-outline-danger"
//                                                 onClick={() => removeArrayItem('responsibilities', index)}
//                                                 disabled={formData.jobDetails.responsibilities.items.length <= 1}
//                                             >
//                                                 <i className="bi bi-trash"></i>
//                                             </button>
//                                         </div>
//                                     ))}
//                                     <button
//                                         type="button"
//                                         className="btn btn-sm btn-outline-primary"
//                                         onClick={() => addArrayItem('responsibilities')}
//                                     >
//                                         <i className="bi bi-plus-circle me-1"></i> Add Responsibility
//                                     </button>
//                                 </div>

//                                 {/* Requirements */}
//                                 <div className="mb-3">
//                                     <label style={modalStyles.label}>Requirements</label>
//                                     {formData.jobDetails.requirements.items.map((item, index) => (
//                                         <div key={index} className="input-group mb-2">
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 value={item}
//                                                 onChange={(e) => handleArrayItemChange('requirements', index, e.target.value)}
//                                                 placeholder={`Requirement ${index + 1}`}
//                                                 style={modalStyles.input}
//                                             />
//                                             <button
//                                                 type="button"
//                                                 className="btn btn-outline-danger"
//                                                 onClick={() => removeArrayItem('requirements', index)}
//                                                 disabled={formData.jobDetails.requirements.items.length <= 1}
//                                             >
//                                                 <i className="bi bi-trash"></i>
//                                             </button>
//                                         </div>
//                                     ))}
//                                     <button
//                                         type="button"
//                                         className="btn btn-sm btn-outline-primary"
//                                         onClick={() => addArrayItem('requirements')}
//                                     >
//                                         <i className="bi bi-plus-circle me-1"></i> Add Requirement
//                                     </button>
//                                 </div>

//                                 {/* Benefits */}
//                                 <div className="mb-3">
//                                     <label style={modalStyles.label}>Benefits & Perks</label>
//                                     {formData.jobDetails.benefits.items.map((item, index) => (
//                                         <div key={index} className="input-group mb-2">
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 value={item}
//                                                 onChange={(e) => handleArrayItemChange('benefits', index, e.target.value)}
//                                                 placeholder={`Benefit ${index + 1}`}
//                                                 style={modalStyles.input}
//                                             />
//                                             <button
//                                                 type="button"
//                                                 className="btn btn-outline-danger"
//                                                 onClick={() => removeArrayItem('benefits', index)}
//                                                 disabled={formData.jobDetails.benefits.items.length <= 1}
//                                             >
//                                                 <i className="bi bi-trash"></i>
//                                             </button>
//                                         </div>
//                                     ))}
//                                     <button
//                                         type="button"
//                                         className="btn btn-sm btn-outline-primary"
//                                         onClick={() => addArrayItem('benefits')}
//                                     >
//                                         <i className="bi bi-plus-circle me-1"></i> Add Benefit
//                                     </button>
//                                 </div>
//                             </div>

//                             <div style={modalStyles.footer}>
//                                 <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
//                                     Cancel
//                                 </button>
//                                 <button type="submit" className="btn btn-primary" disabled={loading}>
//                                     {loading ? (
//                                         <>
//                                             <span className="spinner-border spinner-border-sm me-2"></span>
//                                             Saving...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <i className="bi bi-save me-2"></i>
//                                             Save Job
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* ===== EDIT MODAL - FIXED ===== */}
//             {showEditModal && (
//                 <div style={modalStyles.overlay} onClick={(e) => {
//                     if (e.target === e.currentTarget) setShowEditModal(false);
//                 }}>
//                     <div style={modalStyles.modal}>
//                         <div style={modalStyles.header}>
//                             <h5 style={{ color: theme.text, margin: 0 }}>
//                                 <i className="bi bi-pencil-square me-2" style={{ color: '#0d6efd' }}></i>
//                                 Edit Job: {selectedJob?.title}
//                             </h5>
//                             <button 
//                                 style={modalStyles.closeButton}
//                                 onClick={() => setShowEditModal(false)}
//                                 onMouseEnter={(e) => e.target.style.opacity = '1'}
//                                 onMouseLeave={(e) => e.target.style.opacity = '0.7'}
//                             >
//                                 ✕
//                             </button>
//                         </div>

//                         <form onSubmit={handleEditJob}>
//                             <div style={modalStyles.body}>
//                                 {/* Same form fields as Add Modal */}
//                                 <div className="row mb-3">
//                                     <div className="col-12">
//                                         <label style={modalStyles.label}>Job Title <span className="text-danger">*</span></label>
//                                         <input
//                                             type="text"
//                                             name="title"
//                                             className="form-control"
//                                             value={formData.title}
//                                             onChange={handleChange}
//                                             style={modalStyles.input}
//                                             required
//                                             placeholder="Enter job title"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="row mb-3">
//                                     <div className="col-md-6">
//                                         <label style={modalStyles.label}>Category <span className="text-danger">*</span></label>
//                                         <select
//                                             name="category"
//                                             className="form-select"
//                                             value={formData.category}
//                                             onChange={handleChange}
//                                             style={modalStyles.select}
//                                             required
//                                         >
//                                             <option value="TOUR">TOUR</option>
//                                             <option value="SALES">SALES</option>
//                                             <option value="MARKETING">MARKETING</option>
//                                             <option value="IT">IT</option>
//                                             <option value="HR">HR</option>
//                                             <option value="OTHER">OTHER</option>
//                                         </select>
//                                     </div>
//                                     <div className="col-md-6">
//                                         <label style={modalStyles.label}>Job Type <span className="text-danger">*</span></label>
//                                         <select
//                                             name="type"
//                                             className="form-select"
//                                             value={formData.type}
//                                             onChange={handleChange}
//                                             style={modalStyles.select}
//                                             required
//                                         >
//                                             <option value="Contract">Contract</option>
//                                             <option value="Full-time">Full-time</option>
//                                             <option value="Part-time">Part-time</option>
//                                             <option value="Remote">Remote</option>
//                                             <option value="Hybrid">Hybrid</option>
//                                         </select>
//                                     </div>
//                                 </div>

//                                 <div className="row mb-3">
//                                     <div className="col-12">
//                                         <label style={modalStyles.label}>Description <span className="text-danger">*</span></label>
//                                         <textarea
//                                             name="description"
//                                             className="form-control"
//                                             rows="3"
//                                             value={formData.description}
//                                             onChange={handleChange}
//                                             style={modalStyles.textarea}
//                                             required
//                                             placeholder="Enter job description"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="row mb-3">
//                                     <div className="col-md-6">
//                                         <label style={modalStyles.label}>Location <span className="text-danger">*</span></label>
//                                         <input
//                                             type="text"
//                                             name="locations"
//                                             className="form-control"
//                                             value={formData.locations}
//                                             onChange={handleChange}
//                                             style={modalStyles.input}
//                                             required
//                                             placeholder="e.g., Dhaka, Bangladesh"
//                                         />
//                                     </div>
//                                     <div className="col-md-6">
//                                         <label style={modalStyles.label}>Posted Date</label>
//                                         <input
//                                             type="text"
//                                             name="posted"
//                                             className="form-control"
//                                             value={formData.posted}
//                                             onChange={handleChange}
//                                             placeholder="e.g., Posted 2 days ago"
//                                             style={modalStyles.input}
//                                         />
//                                     </div>
//                                 </div>

//                                 <hr style={{ borderColor: theme.border, margin: '20px 0' }} />
//                                 <h6 style={{ color: theme.text, marginBottom: '16px' }}>Job Details</h6>

//                                 <div className="row mb-3">
//                                     <div className="col-md-3">
//                                         <label style={modalStyles.label}>Duration</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             value={formData.jobDetails.metaInfo.duration}
//                                             onChange={(e) => handleMetaChange('duration', e.target.value)}
//                                             style={modalStyles.input}
//                                         />
//                                     </div>
//                                     <div className="col-md-3">
//                                         <label style={modalStyles.label}>Salary</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             value={formData.jobDetails.metaInfo.salary}
//                                             onChange={(e) => handleMetaChange('salary', e.target.value)}
//                                             style={modalStyles.input}
//                                         />
//                                     </div>
//                                     <div className="col-md-3">
//                                         <label style={modalStyles.label}>Work Type</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             value={formData.jobDetails.metaInfo.type}
//                                             onChange={(e) => handleMetaChange('type', e.target.value)}
//                                             style={modalStyles.input}
//                                         />
//                                     </div>
//                                     <div className="col-md-3">
//                                         <label style={modalStyles.label}>Start Time</label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             value={formData.jobDetails.metaInfo.startTime}
//                                             onChange={(e) => handleMetaChange('startTime', e.target.value)}
//                                             style={modalStyles.input}
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="mb-3">
//                                     <label style={modalStyles.label}>Overview Description</label>
//                                     <textarea
//                                         className="form-control"
//                                         rows="2"
//                                         value={formData.jobDetails.overview.description}
//                                         onChange={(e) => handleNestedChange('overview', 'description', e.target.value)}
//                                         style={modalStyles.textarea}
//                                     />
//                                 </div>

//                                 <div className="mb-3">
//                                     <label style={modalStyles.label}>Responsibilities</label>
//                                     {formData.jobDetails.responsibilities.items.map((item, index) => (
//                                         <div key={index} className="input-group mb-2">
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 value={item}
//                                                 onChange={(e) => handleArrayItemChange('responsibilities', index, e.target.value)}
//                                                 placeholder={`Responsibility ${index + 1}`}
//                                                 style={modalStyles.input}
//                                             />
//                                             <button
//                                                 type="button"
//                                                 className="btn btn-outline-danger"
//                                                 onClick={() => removeArrayItem('responsibilities', index)}
//                                                 disabled={formData.jobDetails.responsibilities.items.length <= 1}
//                                             >
//                                                 <i className="bi bi-trash"></i>
//                                             </button>
//                                         </div>
//                                     ))}
//                                     <button
//                                         type="button"
//                                         className="btn btn-sm btn-outline-primary"
//                                         onClick={() => addArrayItem('responsibilities')}
//                                     >
//                                         <i className="bi bi-plus-circle me-1"></i> Add Responsibility
//                                     </button>
//                                 </div>

//                                 <div className="mb-3">
//                                     <label style={modalStyles.label}>Requirements</label>
//                                     {formData.jobDetails.requirements.items.map((item, index) => (
//                                         <div key={index} className="input-group mb-2">
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 value={item}
//                                                 onChange={(e) => handleArrayItemChange('requirements', index, e.target.value)}
//                                                 placeholder={`Requirement ${index + 1}`}
//                                                 style={modalStyles.input}
//                                             />
//                                             <button
//                                                 type="button"
//                                                 className="btn btn-outline-danger"
//                                                 onClick={() => removeArrayItem('requirements', index)}
//                                                 disabled={formData.jobDetails.requirements.items.length <= 1}
//                                             >
//                                                 <i className="bi bi-trash"></i>
//                                             </button>
//                                         </div>
//                                     ))}
//                                     <button
//                                         type="button"
//                                         className="btn btn-sm btn-outline-primary"
//                                         onClick={() => addArrayItem('requirements')}
//                                     >
//                                         <i className="bi bi-plus-circle me-1"></i> Add Requirement
//                                     </button>
//                                 </div>

//                                 <div className="mb-3">
//                                     <label style={modalStyles.label}>Benefits & Perks</label>
//                                     {formData.jobDetails.benefits.items.map((item, index) => (
//                                         <div key={index} className="input-group mb-2">
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 value={item}
//                                                 onChange={(e) => handleArrayItemChange('benefits', index, e.target.value)}
//                                                 placeholder={`Benefit ${index + 1}`}
//                                                 style={modalStyles.input}
//                                             />
//                                             <button
//                                                 type="button"
//                                                 className="btn btn-outline-danger"
//                                                 onClick={() => removeArrayItem('benefits', index)}
//                                                 disabled={formData.jobDetails.benefits.items.length <= 1}
//                                             >
//                                                 <i className="bi bi-trash"></i>
//                                             </button>
//                                         </div>
//                                     ))}
//                                     <button
//                                         type="button"
//                                         className="btn btn-sm btn-outline-primary"
//                                         onClick={() => addArrayItem('benefits')}
//                                     >
//                                         <i className="bi bi-plus-circle me-1"></i> Add Benefit
//                                     </button>
//                                 </div>
//                             </div>

//                             <div style={modalStyles.footer}>
//                                 <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
//                                     Cancel
//                                 </button>
//                                 <button type="submit" className="btn btn-primary" disabled={loading}>
//                                     {loading ? (
//                                         <>
//                                             <span className="spinner-border spinner-border-sm me-2"></span>
//                                             Updating...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <i className="bi bi-save me-2"></i>
//                                             Update Job
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* ===== DELETE MODAL - FIXED ===== */}
//             {showDeleteModal && (
//                 <div style={modalStyles.overlay} onClick={(e) => {
//                     if (e.target === e.currentTarget) setShowDeleteModal(false);
//                 }}>
//                     <div style={{ ...modalStyles.modal, maxWidth: '500px' }}>
//                         <div style={modalStyles.header}>
//                             <h5 style={{ color: theme.text, margin: 0 }}>
//                                 <i className="bi bi-exclamation-triangle-fill me-2" style={{ color: '#dc3545' }}></i>
//                                 Delete Job
//                             </h5>
//                             <button 
//                                 style={modalStyles.closeButton}
//                                 onClick={() => setShowDeleteModal(false)}
//                                 onMouseEnter={(e) => e.target.style.opacity = '1'}
//                                 onMouseLeave={(e) => e.target.style.opacity = '0.7'}
//                             >
//                                 ✕
//                             </button>
//                         </div>

//                         <div style={modalStyles.body}>
//                             <p style={{ color: theme.text, fontSize: '15px' }}>Are you sure you want to delete the following job?</p>
//                             <div style={{ 
//                                 backgroundColor: theme.bg, 
//                                 padding: '16px', 
//                                 borderRadius: '10px',
//                                 marginBottom: '16px',
//                                 border: `1px solid ${theme.border}`
//                             }}>
//                                 <h6 style={{ color: theme.text, margin: 0 }}>{selectedJob?.title}</h6>
//                                 <p style={{ color: theme.text, opacity: 0.7, margin: '4px 0 0 0', fontSize: '13px' }}>
//                                     #{String(selectedJob?.id).padStart(3, '0')} • {selectedJob?.category} • {selectedJob?.type}
//                                 </p>
//                             </div>
//                             <div className="alert alert-danger" style={{ borderRadius: '10px' }}>
//                                 <i className="bi bi-info-circle me-2"></i>
//                                 This action cannot be undone!
//                             </div>
//                         </div>

//                         <div style={modalStyles.footer}>
//                             <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
//                                 Cancel
//                             </button>
//                             <button type="button" className="btn btn-danger" onClick={handleDeleteJob} disabled={loading}>
//                                 {loading ? (
//                                     <>
//                                         <span className="spinner-border spinner-border-sm me-2"></span>
//                                         Deleting...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <i className="bi bi-trash me-2"></i>
//                                         Delete Job
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
                
//                 .input-group .btn {
//                     border-color: ${theme.border};
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
                
//                 /* Scrollbar styling */
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
                
//                 /* Modal body scroll */
//                 .modal-body-scroll {
//                     scrollbar-width: thin;
//                 }
                
//                 .badge {
//                     font-weight: 500;
//                     padding: 5px 14px;
//                     border-radius: 20px;
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default JobSettings;



import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const CATEGORIES = ['TOUR', 'SALES', 'MARKETING', 'IT', 'HR', 'OTHER'];
const JOB_TYPES = ['Contract', 'Full-time', 'Part-time', 'Remote', 'Hybrid'];

const EMPTY_FORM = {
    title: '', category: 'TOUR', description: '', locations: '', type: 'Contract',
    posted: '', buttonText: 'VIEW DETAILS', status: true,
    jobDetails: {
        metaInfo: { duration: 'Full-time', salary: 'Competitive', type: 'On Site', startTime: '9:00 AM', endTime: '5:00 PM' },
        overview: { title: 'JOB OVERVIEW', description: '' },
        responsibilities: { title: 'KEY RESPONSIBILITIES', items: [''] },
        requirements: { title: 'REQUIREMENTS', items: [''] },
        benefits: { title: 'BENEFITS & PERKS', items: [''] }
    }
};

const API_URL = 'https://backend.akashbariresort.com/api';

// ---- Reusable pieces ----

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
            maxWidth: wide ? '850px' : '500px', maxHeight: '90vh',
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

const Label = ({ theme, children, required }) => (
    <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>
        {children} {required && <span className="text-danger">*</span>}
    </label>
);

// Editable list used for responsibilities / requirements / benefits
const DynamicList = ({ theme, fieldStyle, label, items, onChange, onAdd, onRemove }) => (
    <div className="mb-3">
        <Label theme={theme}>{label}</Label>
        {items.map((item, i) => (
            <div key={i} className="input-group mb-2">
                <input
                    className="form-control"
                    value={item}
                    onChange={(e) => onChange(i, e.target.value)}
                    placeholder={`${label.replace(/s$/, '')} ${i + 1}`}
                    style={fieldStyle}
                />
                <button type="button" className="btn btn-outline-danger" onClick={() => onRemove(i)} disabled={items.length <= 1}>
                    <i className="bi bi-trash"></i>
                </button>
            </div>
        ))}
        <button type="button" className="btn btn-sm btn-outline-primary" onClick={onAdd}>
            <i className="bi bi-plus-circle me-1"></i> Add {label.replace(/s$/, '')}
        </button>
    </div>
);

// Shared Add/Edit form body
const JobForm = ({ theme, fieldStyle, formData, setFormData }) => {
    const setTop = (field, value) => setFormData({ ...formData, [field]: value });
    const setMeta = (field, value) => setFormData({
        ...formData, jobDetails: { ...formData.jobDetails, metaInfo: { ...formData.jobDetails.metaInfo, [field]: value } }
    });
    const setOverview = (value) => setFormData({
        ...formData, jobDetails: { ...formData.jobDetails, overview: { ...formData.jobDetails.overview, description: value } }
    });
    const setListItem = (section, index, value) => {
        const items = [...formData.jobDetails[section].items];
        items[index] = value;
        setFormData({ ...formData, jobDetails: { ...formData.jobDetails, [section]: { ...formData.jobDetails[section], items } } });
    };
    const addListItem = (section) => setFormData({
        ...formData, jobDetails: { ...formData.jobDetails, [section]: { ...formData.jobDetails[section], items: [...formData.jobDetails[section].items, ''] } }
    });
    const removeListItem = (section, index) => setFormData({
        ...formData, jobDetails: { ...formData.jobDetails, [section]: { ...formData.jobDetails[section], items: formData.jobDetails[section].items.filter((_, i) => i !== index) } }
    });

    return (
        <>
            <div className="mb-3">
                <Label theme={theme} required>Job Title</Label>
                <input className="form-control" required value={formData.title} onChange={(e) => setTop('title', e.target.value)} style={fieldStyle} placeholder="Enter job title" />
            </div>

            <div className="row mb-3 g-3">
                <div className="col-md-6">
                    <Label theme={theme} required>Category</Label>
                    <select className="form-select" required value={formData.category} onChange={(e) => setTop('category', e.target.value)} style={fieldStyle}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="col-md-6">
                    <Label theme={theme} required>Job Type</Label>
                    <select className="form-select" required value={formData.type} onChange={(e) => setTop('type', e.target.value)} style={fieldStyle}>
                        {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>

            <div className="mb-3">
                <Label theme={theme} required>Description</Label>
                <textarea className="form-control" rows="3" required value={formData.description} onChange={(e) => setTop('description', e.target.value)} style={{ ...fieldStyle, minHeight: '80px' }} placeholder="Enter job description" />
            </div>

            <div className="row mb-3 g-3">
                <div className="col-md-6">
                    <Label theme={theme} required>Location</Label>
                    <input className="form-control" required value={formData.locations} onChange={(e) => setTop('locations', e.target.value)} style={fieldStyle} placeholder="e.g., Dhaka, Bangladesh" />
                </div>
                <div className="col-md-6">
                    <Label theme={theme}>Posted Date</Label>
                    <input className="form-control" value={formData.posted} onChange={(e) => setTop('posted', e.target.value)} style={fieldStyle} placeholder="e.g., Posted 2 days ago" />
                </div>
            </div>

            <hr style={{ borderColor: theme.border, margin: '20px 0' }} />
            <h6 style={{ color: theme.text, marginBottom: '16px' }}>Job Details</h6>

            <div className="row mb-3 g-3">
                <div className="col-md-3">
                    <Label theme={theme}>Duration</Label>
                    <input className="form-control" value={formData.jobDetails.metaInfo.duration} onChange={(e) => setMeta('duration', e.target.value)} style={fieldStyle} />
                </div>
                <div className="col-md-3">
                    <Label theme={theme}>Salary</Label>
                    <input className="form-control" value={formData.jobDetails.metaInfo.salary} onChange={(e) => setMeta('salary', e.target.value)} style={fieldStyle} />
                </div>
                <div className="col-md-3">
                    <Label theme={theme}>Work Type</Label>
                    <input className="form-control" value={formData.jobDetails.metaInfo.type} onChange={(e) => setMeta('type', e.target.value)} style={fieldStyle} />
                </div>
                <div className="col-md-3">
                    <Label theme={theme}>Start Time</Label>
                    <input className="form-control" value={formData.jobDetails.metaInfo.startTime} onChange={(e) => setMeta('startTime', e.target.value)} style={fieldStyle} />
                </div>
            </div>

            <div className="mb-3">
                <Label theme={theme}>Overview Description</Label>
                <textarea className="form-control" rows="2" value={formData.jobDetails.overview.description} onChange={(e) => setOverview(e.target.value)} style={{ ...fieldStyle, minHeight: '60px' }} placeholder="Enter job overview" />
            </div>

            <DynamicList theme={theme} fieldStyle={fieldStyle} label="Responsibilities"
                items={formData.jobDetails.responsibilities.items}
                onChange={(i, v) => setListItem('responsibilities', i, v)}
                onAdd={() => addListItem('responsibilities')}
                onRemove={(i) => removeListItem('responsibilities', i)}
            />
            <DynamicList theme={theme} fieldStyle={fieldStyle} label="Requirements"
                items={formData.jobDetails.requirements.items}
                onChange={(i, v) => setListItem('requirements', i, v)}
                onAdd={() => addListItem('requirements')}
                onRemove={(i) => removeListItem('requirements', i)}
            />
            <DynamicList theme={theme} fieldStyle={fieldStyle} label="Benefits"
                items={formData.jobDetails.benefits.items}
                onChange={(i, v) => setListItem('benefits', i, v)}
                onAdd={() => addListItem('benefits')}
                onRemove={(i) => removeListItem('benefits', i)}
            />
        </>
    );
};

// ---------------------------------------------------------------------

const JobSettings = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const [activeModal, setActiveModal] = useState(null); // 'add' | 'edit' | 'delete'
    const [selectedJob, setSelectedJob] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#15172b' : '#f5f3f7',
        card: isDarkMode ? '#1d2140' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#333a4d',
        border: isDarkMode ? '#2c2f4d' : '#e7e5ee',
        accent: '#6c5ce7'
    };

    const fieldStyle = {
        backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}`,
        borderRadius: '10px', padding: '10px 14px', width: '100%', fontSize: '14px'
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/jobs`);
            if (!res.ok) throw new Error('Failed to fetch jobs');
            const data = await res.json();
            setJobs(data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchJobs(); }, []);

    useEffect(() => {
        if (!successMessage) return;
        const t = setTimeout(() => setSuccessMessage(''), 3000);
        return () => clearTimeout(t);
    }, [successMessage]);

    const closeModal = () => { setActiveModal(null); setSelectedJob(null); };

    const openAddModal = () => { setFormData(EMPTY_FORM); setActiveModal('add'); };

    const openEditModal = (job) => {
        setSelectedJob(job);
        setFormData({
            title: job.title || '', category: job.category || 'TOUR', description: job.description || '',
            locations: job.locations || '', type: job.type || 'Contract', posted: job.posted || '',
            buttonText: job.buttonText || 'VIEW DETAILS', status: job.status !== undefined ? job.status : true,
            jobDetails: {
                metaInfo: {
                    duration: job.jobDetails?.metaInfo?.duration || 'Full-time',
                    salary: job.jobDetails?.metaInfo?.salary || 'Competitive',
                    type: job.jobDetails?.metaInfo?.type || 'On Site',
                    startTime: job.jobDetails?.metaInfo?.startTime || '9:00 AM',
                    endTime: job.jobDetails?.metaInfo?.endTime || '5:00 PM'
                },
                overview: { title: job.jobDetails?.overview?.title || 'JOB OVERVIEW', description: job.jobDetails?.overview?.description || '' },
                responsibilities: { title: job.jobDetails?.responsibilities?.title || 'KEY RESPONSIBILITIES', items: job.jobDetails?.responsibilities?.items || [''] },
                requirements: { title: job.jobDetails?.requirements?.title || 'REQUIREMENTS', items: job.jobDetails?.requirements?.items || [''] },
                benefits: { title: job.jobDetails?.benefits?.title || 'BENEFITS & PERKS', items: job.jobDetails?.benefits?.items || [''] }
            }
        });
        setActiveModal('edit');
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
            fetchJobs();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddJob = (e) => {
        e.preventDefault();
        runRequest(`${API_URL}/add-jobs`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
        }, 'Job added successfully!');
    };

    const handleEditJob = (e) => {
        e.preventDefault();
        runRequest(`${API_URL}/edit-jobs/${selectedJob.id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
        }, 'Job updated successfully!');
    };

    const handleDeleteJob = () => runRequest(`${API_URL}/del-/${selectedJob.id}`, { method: 'DELETE' }, 'Job deleted successfully!');

    const handleToggleStatus = async (jobId, currentStatus) => {
        const newStatus = !currentStatus;
        try {
            const res = await fetch(`${API_URL}/toggule/${jobId}/status`, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Failed to toggle status');
            }
            setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
            setSuccessMessage(`Job ${newStatus ? 'activated' : 'deactivated'} successfully!`);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="job" />

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
                                    <h2 style={{ color: theme.text }}>Job Management</h2>
                                    <p style={{ color: theme.text, opacity: 0.65 }}>Manage all job postings</p>
                                </div>
                                <button className="btn" style={{ backgroundColor: theme.accent, color: '#fff' }} onClick={openAddModal}>
                                    <i className="bi bi-plus-circle me-2"></i>Add New Job
                                </button>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover" style={{ backgroundColor: theme.card, borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 14px rgba(0,0,0,0.06)' }}>
                                    <thead style={{ color: theme.text, borderBottom: `2px solid ${theme.border}` }}>
                                        <tr>
                                            {['ID', 'Title', 'Category', 'Type', 'Location', 'Status', 'Actions'].map(h => (
                                                <th key={h} style={{ padding: '14px 16px' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="7" className="text-center py-5">
                                                <div className="spinner-border" style={{ color: theme.accent }} role="status"></div>
                                                <p className="mt-2" style={{ color: theme.text }}>Loading jobs...</p>
                                            </td></tr>
                                        ) : jobs.length === 0 ? (
                                            <tr><td colSpan="7" className="text-center py-5" style={{ color: theme.text }}>
                                                <i className="bi bi-inbox display-4 d-block mb-3" style={{ opacity: 0.4 }}></i>
                                                <h5>No jobs found</h5>
                                                <p style={{ opacity: 0.65 }}>Click "Add New Job" to create your first job posting.</p>
                                            </td></tr>
                                        ) : jobs.map(job => (
                                            <tr key={job.id} style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>
                                                <td style={{ padding: '12px 16px', fontWeight: 600 }}>#{String(job.id).padStart(3, '0')}</td>
                                                <td style={{ padding: '12px 16px' }}><strong>{job.title}</strong></td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <span style={{ backgroundColor: `${theme.accent}22`, color: theme.accent, padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
                                                        {job.category}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>{job.type}</td>
                                                <td style={{ padding: '12px 16px' }}>{job.locations}</td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <button
                                                        onClick={() => handleToggleStatus(job.id, job.status)}
                                                        style={{
                                                            padding: '5px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 600,
                                                            border: 'none', cursor: 'pointer', backgroundColor: job.status ? '#2f9e5b' : '#8a8a8a', color: '#fff'
                                                        }}
                                                    >
                                                        <i className={`bi ${job.status ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-1`}></i>
                                                        {job.status ? 'Active' : 'Inactive'}
                                                    </button>
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <div className="btn-group btn-group-sm">
                                                        <button className="btn btn-outline-primary" onClick={() => openEditModal(job)} title="Edit Job"><i className="bi bi-pencil"></i></button>
                                                        <button className="btn btn-outline-danger" onClick={() => { setSelectedJob(job); setActiveModal('delete'); }} title="Delete Job"><i className="bi bi-trash"></i></button>
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

            {/* Add */}
            {activeModal === 'add' && (
                <form onSubmit={handleAddJob}>
                    <Modal theme={theme} title="Add New Job" icon="bi-plus-circle" iconColor={theme.accent} onClose={closeModal} wide
                        footer={<>
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : <><i className="bi bi-save me-2"></i>Save Job</>}
                            </button>
                        </>}
                    >
                        <JobForm theme={theme} fieldStyle={fieldStyle} formData={formData} setFormData={setFormData} />
                    </Modal>
                </form>
            )}

            {/* Edit */}
            {activeModal === 'edit' && selectedJob && (
                <form onSubmit={handleEditJob}>
                    <Modal theme={theme} title={`Edit Job: ${selectedJob.title}`} icon="bi-pencil-square" iconColor={theme.accent} onClose={closeModal} wide
                        footer={<>
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Updating...</> : <><i className="bi bi-save me-2"></i>Update Job</>}
                            </button>
                        </>}
                    >
                        <JobForm theme={theme} fieldStyle={fieldStyle} formData={formData} setFormData={setFormData} />
                    </Modal>
                </form>
            )}

            {/* Delete */}
            {activeModal === 'delete' && selectedJob && (
                <Modal theme={theme} title="Delete Job" icon="bi-exclamation-triangle-fill" iconColor="#e0523f" onClose={closeModal}
                    footer={<>
                        <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                        <button className="btn btn-danger" onClick={handleDeleteJob} disabled={loading}>
                            {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Deleting...</> : <><i className="bi bi-trash me-2"></i>Delete Job</>}
                        </button>
                    </>}
                >
                    <p style={{ color: theme.text, fontSize: '15px' }}>Are you sure you want to delete the following job?</p>
                    <div style={{ backgroundColor: theme.bg, padding: '16px', borderRadius: '10px', marginBottom: '16px', border: `1px solid ${theme.border}` }}>
                        <h6 style={{ color: theme.text, margin: 0 }}>{selectedJob.title}</h6>
                        <p style={{ color: theme.text, opacity: 0.65, margin: '4px 0 0 0', fontSize: '13px' }}>
                            #{String(selectedJob.id).padStart(3, '0')} • {selectedJob.category} • {selectedJob.type}
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

export default JobSettings;