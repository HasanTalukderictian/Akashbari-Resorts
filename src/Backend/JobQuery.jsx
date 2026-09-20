
// import React, { useState, useEffect } from 'react';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import Footer from './Footer';

// const STATUS_OPTIONS = [
//     { value: 'pending', label: 'Pending', color: '#f0a500' },
//     { value: 'reviewing', label: 'Reviewing', color: '#0ea5b7' },
//     { value: 'shortlisted', label: 'Shortlisted', color: '#2f9e5b' },
//     { value: 'rejected', label: 'Rejected', color: '#e0523f' },
//     { value: 'hired', label: 'Hired', color: '#7c5cbf' }
// ];

// const EXPERIENCE_LABELS = {
//     entry: 'Fresh Graduate / Entry Level',
//     '1-2': '1–2 years',
//     '3-5': '3–5 years',
//     '5-10': '5–10 years',
//     '10+': '10+ years'
// };

// const NOTICE_LABELS = {
//     immediate: 'Immediate',
//     '15-days': '15 days',
//     '30-days': '30 days',
//     '45-days': '45 days',
//     '60-days': '60 days',
//     '90-days': '90 days'
// };

// const EMPTY_FORM = {
//     full_name: '', email: '', phone: '', experience: '', current_company: '',
//     designation: '', notice_period: '', cover_letter: '', status: 'pending', admin_note: ''
// };

// // const API_URL = 'https://backend.akashbariresort.com/api';
// // const STORAGE_URL = 'https://backend.akashbariresort.com/storage';

// const API_URL = 'http://127.0.0.1:8000/api';
// const STORAGE_URL = 'http://127.0.0.1:8000/storage';

// // ---- Small reusable pieces (keeps the JSX below short & consistent) ----

// const Modal = ({ theme, title, icon, iconColor, onClose, children, footer, wide }) => (
//     <div
//         style={{
//             position: 'fixed', inset: 0, backgroundColor: 'rgba(20,20,30,0.55)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             zIndex: 1050, padding: '20px', animation: 'fadeIn .2s ease'
//         }}
//         onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//         <div style={{
//             backgroundColor: theme.card, borderRadius: '18px', width: '100%',
//             maxWidth: wide ? '900px' : '620px', maxHeight: '90vh',
//             display: 'flex', flexDirection: 'column',
//             boxShadow: '0 24px 60px rgba(0,0,0,0.35)', animation: 'slideIn .25s ease'
//         }}>
//             <div style={{
//                 padding: '18px 22px', borderBottom: `1px solid ${theme.border}`,
//                 display: 'flex', justifyContent: 'space-between', alignItems: 'center'
//             }}>
//                 <h5 style={{ color: theme.text, margin: 0, fontWeight: 600 }}>
//                     <i className={`bi ${icon} me-2`} style={{ color: iconColor }}></i>{title}
//                 </h5>
//                 <button onClick={onClose} style={{
//                     background: 'transparent', border: 'none', fontSize: '22px',
//                     color: theme.text, opacity: 0.6, cursor: 'pointer'
//                 }}>✕</button>
//             </div>
//             <div style={{ padding: '22px', overflowY: 'auto' }}>{children}</div>
//             {footer && (
//                 <div style={{
//                     padding: '16px 22px', borderTop: `1px solid ${theme.border}`,
//                     display: 'flex', justifyContent: 'flex-end', gap: '10px'
//                 }}>{footer}</div>
//             )}
//         </div>
//     </div>
// );

// const Field = ({ label, theme, children }) => (
//     <div className="col-md-6">
//         <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>
//             {label}
//         </label>
//         {children}
//     </div>
// );

// const StatusBadge = ({ status }) => {
//     const opt = STATUS_OPTIONS.find(s => s.value === status);
//     return (
//         <span style={{
//             backgroundColor: opt?.color || '#8a8a8a', color: '#fff', padding: '4px 12px',
//             borderRadius: '999px', fontSize: '12px', fontWeight: 600
//         }}>
//             {opt?.label || status}
//         </span>
//     );
// };

// // ---------------------------------------------------------------------

// const JobQuery = ({ theme: propsTheme }) => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(false);

//     const [applications, setApplications] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [successMessage, setSuccessMessage] = useState('');

//     const [searchTerm, setSearchTerm] = useState('');
//     const [statusFilter, setStatusFilter] = useState('');
//     const [selectedApplication, setSelectedApplication] = useState(null);

//     const [activeModal, setActiveModal] = useState(null); // 'detail' | 'edit' | 'delete' | 'status' | 'pdf'
//     const [pdfUrl, setPdfUrl] = useState('');
//     const [formData, setFormData] = useState(EMPTY_FORM);

//     const theme = propsTheme || {
//         isDarkMode,
//         bg: isDarkMode ? '#15172b' : '#f5f3f7',
//         card: isDarkMode ? '#1d2140' : '#ffffff',
//         text: isDarkMode ? '#e9ecef' : '#333a4d',
//         border: isDarkMode ? '#2c2f4d' : '#e7e5ee',
//         accent: '#6c5ce7'
//     };

//     const toggleSidebar = () => setIsCollapsed(!isCollapsed);
//     const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

//     const fieldStyle = {
//         backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}`,
//         borderRadius: '10px', padding: '10px 14px', width: '100%', fontSize: '14px'
//     };

//     const getResumeUrl = (path) => path ? `${STORAGE_URL}/${path.replace(/^public\//, '')}` : null;

//     const fetchApplications = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const params = new URLSearchParams();
//             if (searchTerm) params.set('search', searchTerm);
//             if (statusFilter) params.set('status', statusFilter);
//             const res = await fetch(`${API_URL}/applications?${params}`);
//             if (!res.ok) throw new Error('Failed to fetch applications');
//             const data = await res.json();
//             const list = data.data?.data || data.data || [];
//             setApplications(list.map(app => ({ ...app, job_title: app.job_title || app.job?.title || 'N/A' })));
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => { fetchApplications(); }, [searchTerm, statusFilter]);

//     useEffect(() => {
//         if (!successMessage) return;
//         const t = setTimeout(() => setSuccessMessage(''), 3000);
//         return () => clearTimeout(t);
//     }, [successMessage]);

//     const closeModal = () => { setActiveModal(null); setSelectedApplication(null); };

//     const openModal = (type, app) => {
//         setSelectedApplication(app);
//         if (type === 'edit' || type === 'status') {
//             setFormData({
//                 full_name: app.full_name || '', email: app.email || '', phone: app.phone || '',
//                 experience: app.experience || '', current_company: app.current_company || '',
//                 designation: app.designation || '', notice_period: app.notice_period || '',
//                 cover_letter: app.cover_letter || '', status: app.status || 'pending',
//                 admin_note: app.admin_note || ''
//             });
//         }
//         setActiveModal(type);
//     };

//     const viewApplication = async (id) => {
//         try {
//             const res = await fetch(`${API_URL}/applications/${id}`);
//             if (!res.ok) throw new Error('Failed to fetch application details');
//             const { data } = await res.json();
//             data.job_title = data.job_title || data.job?.title || 'N/A';
//             openModal('detail', data);
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     const runRequest = async (url, options, successMsg) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const res = await fetch(url, options);
//             if (!res.ok) {
//                 const err = await res.json();
//                 throw new Error(err.message || 'Request failed');
//             }
//             setSuccessMessage(successMsg);
//             closeModal();
//             fetchApplications();
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleUpdateApplication = (e) => {
//         e.preventDefault();
//         runRequest(`${API_URL}/applications/${selectedApplication.id}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
//             body: JSON.stringify(formData)
//         }, 'Application updated successfully!');
//     };

//     const handleUpdateStatus = () => runRequest(`${API_URL}/applications/${selectedApplication.id}/status`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
//         body: JSON.stringify({ status: formData.status })
//     }, 'Status updated successfully!');

//     const handleDeleteApplication = () => runRequest(`${API_URL}/applications/${selectedApplication.id}`, {
//         method: 'DELETE',
//         headers: { Accept: 'application/json' }
//     }, 'Application deleted successfully!');

//     const downloadResume = (path, fileName) => {
//         if (!path) return setError('No resume found');
//         const link = document.createElement('a');
//         link.href = getResumeUrl(path);
//         link.download = fileName || 'resume.pdf';
//         link.target = '_blank';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         setSuccessMessage('Resume downloaded successfully!');
//     };

//     const viewPdf = (path) => {
//         if (!path) return setError('No resume found');
//         setPdfUrl(getResumeUrl(path));
//         setActiveModal('pdf');
//     };

//     return (
//         <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }} className="container-fluid p-0">
//             <div className="d-flex">
//                 <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="jobquery" />

//                 <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="flex-grow-1">
//                     <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

//                     <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
//                         <div style={{ padding: '24px' }}>
//                             {successMessage && (
//                                 <div className="alert alert-success alert-dismissible fade show" role="alert">
//                                     <i className="bi bi-check-circle-fill me-2"></i>{successMessage}
//                                     <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
//                                 </div>
//                             )}
//                             {error && (
//                                 <div className="alert alert-danger alert-dismissible fade show" role="alert">
//                                     <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
//                                     <button type="button" className="btn-close" onClick={() => setError(null)}></button>
//                                 </div>
//                             )}

//                             <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
//                                 <div>
//                                     <h2 style={{ color: theme.text }}>Job Applications</h2>
//                                     <p style={{ color: theme.text, opacity: 0.65 }}>Manage all job applications and inquiries</p>
//                                 </div>
//                                 <span style={{
//                                     backgroundColor: theme.accent, color: '#fff', fontSize: '14px',
//                                     padding: '8px 18px', borderRadius: '999px', fontWeight: 600
//                                 }}>
//                                     Total: {applications.length}
//                                 </span>
//                             </div>

//                             <div className="row g-3 mb-4">
//                                 <div className="col-md-6">
//                                     <div className="input-group">
//                                         <span className="input-group-text" style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}>
//                                             <i className="bi bi-search"></i>
//                                         </span>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             placeholder="Search by name, email, phone, company, designation..."
//                                             value={searchTerm}
//                                             onChange={(e) => setSearchTerm(e.target.value)}
//                                             style={{ backgroundColor: theme.card, color: theme.text, borderColor: theme.border }}
//                                         />
//                                         {searchTerm && (
//                                             <button className="btn btn-outline-secondary" onClick={() => setSearchTerm('')} style={{ borderColor: theme.border, color: theme.text }}>
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
//                                         style={{ backgroundColor: theme.card, color: theme.text, borderColor: theme.border }}
//                                     >
//                                         <option value="">All Status</option>
//                                         {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
//                                     </select>
//                                 </div>
//                             </div>

//                             <div className="table-responsive">
//                                 <table className="table table-hover" style={{ backgroundColor: theme.card, borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 14px rgba(0,0,0,0.06)' }}>
//                                     <thead style={{ color: theme.text, borderBottom: `2px solid ${theme.border}` }}>
//                                         <tr>
//                                             {['#', 'Name', 'Applied Position', 'Company', 'Designation', 'Experience', 'Status', 'Applied', 'Actions'].map(h => (
//                                                 <th key={h} style={{ padding: '14px 16px' }}>{h}</th>
//                                             ))}
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {loading ? (
//                                             <tr><td colSpan="9" className="text-center py-5">
//                                                 <div className="spinner-border" style={{ color: theme.accent }} role="status"></div>
//                                                 <p className="mt-2" style={{ color: theme.text }}>Loading applications...</p>
//                                             </td></tr>
//                                         ) : applications.length === 0 ? (
//                                             <tr><td colSpan="9" className="text-center py-5" style={{ color: theme.text }}>
//                                                 <i className="bi bi-inbox display-4 d-block mb-3" style={{ opacity: 0.4 }}></i>
//                                                 <h5>No applications found</h5>
//                                                 <p style={{ opacity: 0.65 }}>{searchTerm || statusFilter ? 'Try adjusting your search filters' : 'No applications submitted yet'}</p>
//                                             </td></tr>
//                                         ) : applications.map(app => (
//                                             <tr key={app.id} style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>
//                                                 <td style={{ padding: '12px 16px', fontWeight: 600 }}>#{String(app.id).padStart(3, '0')}</td>
//                                                 <td style={{ padding: '12px 16px' }}><strong>{app.full_name}</strong></td>
//                                                 <td style={{ padding: '12px 16px' }}>
//                                                     <span style={{ backgroundColor: `${theme.accent}22`, color: theme.accent, padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
//                                                         {app.job_title || 'N/A'}
//                                                     </span>
//                                                 </td>
//                                                 <td style={{ padding: '12px 16px' }}>{app.current_company || 'N/A'}</td>
//                                                 <td style={{ padding: '12px 16px' }}>{app.designation || 'N/A'}</td>
//                                                 <td style={{ padding: '12px 16px' }}>{EXPERIENCE_LABELS[app.experience] || app.experience || 'Not specified'}</td>
//                                                 <td style={{ padding: '12px 16px' }}><StatusBadge status={app.status} /></td>
//                                                 <td style={{ padding: '12px 16px', fontSize: '13px' }}>
//                                                     {new Date(app.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
//                                                 </td>
//                                                 <td style={{ padding: '12px 16px' }}>
//                                                     <div className="btn-group btn-group-sm">
//                                                         <button className="btn btn-outline-info" onClick={() => viewApplication(app.id)} title="View Details"><i className="bi bi-eye"></i></button>
//                                                         <button className="btn btn-outline-success" onClick={() => openModal('status', app)} title="Change Status"><i className="bi bi-check-circle"></i></button>
//                                                         <button className="btn btn-outline-danger" onClick={() => openModal('delete', app)} title="Delete"><i className="bi bi-trash"></i></button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                         <Footer theme={theme} />
//                     </div>
//                 </div>
//             </div>

//             {/* Detail */}
//             {activeModal === 'detail' && selectedApplication && (
//                 <Modal theme={theme} title="Application Details" icon="bi-info-circle" iconColor={theme.accent} onClose={closeModal} wide
//                     footer={<>
//                         <button className="btn btn-secondary" onClick={closeModal}>Close</button>
//                         <button className="btn btn-primary" onClick={() => openModal('edit', selectedApplication)}>
//                             <i className="bi bi-pencil me-2"></i>Edit
//                         </button>
//                     </>}
//                 >
//                     <div className="row g-3">
//                         <Field label="Full Name" theme={theme}><div style={{ color: theme.text, fontWeight: 500 }}>{selectedApplication.full_name}</div></Field>
//                         <Field label="Applied Position" theme={theme}>
//                             <span style={{ backgroundColor: `${theme.accent}22`, color: theme.accent, padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
//                                 {selectedApplication.job_title || 'N/A'}
//                             </span>
//                         </Field>
//                         <Field label="Email" theme={theme}><a href={`mailto:${selectedApplication.email}`} style={{ color: theme.accent }}>{selectedApplication.email}</a></Field>
//                         <Field label="Phone" theme={theme}><a href={`tel:${selectedApplication.phone}`} style={{ color: theme.accent }}>{selectedApplication.phone}</a></Field>
//                         <Field label="Experience" theme={theme}><span style={{ color: theme.text }}>{EXPERIENCE_LABELS[selectedApplication.experience] || 'Not specified'}</span></Field>
//                         <Field label="Status" theme={theme}><StatusBadge status={selectedApplication.status} /></Field>
//                         <Field label="Current Company" theme={theme}><div style={{ color: theme.text, fontWeight: 500 }}>{selectedApplication.current_company || 'N/A'}</div></Field>
//                         <Field label="Designation" theme={theme}><div style={{ color: theme.text, fontWeight: 500 }}>{selectedApplication.designation || 'N/A'}</div></Field>
//                         <Field label="Notice Period" theme={theme}><div style={{ color: theme.text }}>{NOTICE_LABELS[selectedApplication.notice_period] || 'Not specified'}</div></Field>
//                         <div className="col-12">
//                             <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>Cover Letter</label>
//                             <div style={{ color: theme.text, backgroundColor: theme.bg, padding: '12px', borderRadius: '10px', minHeight: '80px', whiteSpace: 'pre-wrap' }}>
//                                 {selectedApplication.cover_letter || 'No cover letter provided'}
//                             </div>
//                         </div>
//                         {selectedApplication.admin_note && (
//                             <div className="col-12">
//                                 <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>Admin Note</label>
//                                 <div style={{ color: theme.text, backgroundColor: theme.bg, padding: '12px', borderRadius: '10px', whiteSpace: 'pre-wrap', borderLeft: `3px solid ${theme.accent}` }}>
//                                     {selectedApplication.admin_note}
//                                 </div>
//                             </div>
//                         )}
//                         {selectedApplication.resume && (
//                             <div className="col-12 d-flex gap-2 flex-wrap">
//                                 <button className="btn btn-primary" onClick={() => viewPdf(selectedApplication.resume)}><i className="bi bi-eye me-2"></i>View Resume</button>
//                                 <button className="btn btn-success" onClick={() => downloadResume(selectedApplication.resume, selectedApplication.resume_original_name || `${selectedApplication.full_name}_resume.pdf`)}>
//                                     <i className="bi bi-download me-2"></i>Download Resume
//                                 </button>
//                             </div>
//                         )}
//                         <div className="col-12">
//                             <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>Applied On</label>
//                             <div style={{ color: theme.text }}>
//                                 {new Date(selectedApplication.created_at).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
//                             </div>
//                         </div>
//                     </div>
//                 </Modal>
//             )}

//             {/* PDF */}
//             {activeModal === 'pdf' && pdfUrl && (
//                 <Modal theme={theme} title={`Resume: ${selectedApplication?.full_name || 'Document'}`} icon="bi-file-pdf" iconColor="#e0523f"
//                     onClose={() => { setActiveModal(null); setPdfUrl(''); }} wide
//                 >
//                     <iframe src={pdfUrl} style={{ width: '100%', height: '70vh', border: 'none', borderRadius: '10px' }} title="Resume PDF" />
//                 </Modal>
//             )}

//             {/* Edit */}
//             {activeModal === 'edit' && selectedApplication && (
//                 <form onSubmit={handleUpdateApplication}>
//                     <Modal theme={theme} title={`Edit Application: ${selectedApplication.full_name}`} icon="bi-pencil-square" iconColor={theme.accent} onClose={closeModal} wide
//                         footer={<>
//                             <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
//                             <button type="submit" className="btn btn-primary" disabled={loading}>
//                                 {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Updating...</> : <><i className="bi bi-save me-2"></i>Update Application</>}
//                             </button>
//                         </>}
//                     >
//                         <div className="row g-3">
//                             <Field label={<>Full Name <span className="text-danger">*</span></>} theme={theme}>
//                                 <input required value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} style={fieldStyle} />
//                             </Field>
//                             <Field label={<>Email <span className="text-danger">*</span></>} theme={theme}>
//                                 <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={fieldStyle} />
//                             </Field>
//                             <Field label={<>Phone <span className="text-danger">*</span></>} theme={theme}>
//                                 <input required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={fieldStyle} />
//                             </Field>
//                             <Field label="Experience" theme={theme}>
//                                 <select value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} style={fieldStyle}>
//                                     <option value="">Select Experience</option>
//                                     {Object.entries(EXPERIENCE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
//                                 </select>
//                             </Field>
//                             <Field label="Current Company" theme={theme}>
//                                 <input value={formData.current_company} onChange={(e) => setFormData({ ...formData, current_company: e.target.value })} style={fieldStyle} placeholder="Current company name" />
//                             </Field>
//                             <Field label="Designation" theme={theme}>
//                                 <input value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} style={fieldStyle} placeholder="Current designation" />
//                             </Field>
//                             <Field label="Notice Period" theme={theme}>
//                                 <select value={formData.notice_period} onChange={(e) => setFormData({ ...formData, notice_period: e.target.value })} style={fieldStyle}>
//                                     <option value="">Select Notice Period</option>
//                                     {Object.entries(NOTICE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
//                                 </select>
//                             </Field>
//                             <Field label="Status" theme={theme}>
//                                 <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={fieldStyle}>
//                                     {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
//                                 </select>
//                             </Field>
//                             <div className="col-12">
//                                 <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>Cover Letter</label>
//                                 <textarea rows="3" value={formData.cover_letter} onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })} style={{ ...fieldStyle, minHeight: '80px' }} placeholder="Cover letter or additional information..." />
//                             </div>
//                             <div className="col-12">
//                                 <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>Admin Note</label>
//                                 <textarea rows="2" value={formData.admin_note} onChange={(e) => setFormData({ ...formData, admin_note: e.target.value })} style={{ ...fieldStyle, minHeight: '60px' }} placeholder="Add internal notes about this application..." />
//                             </div>
//                         </div>
//                     </Modal>
//                 </form>
//             )}

//             {/* Status */}
//             {activeModal === 'status' && selectedApplication && (
//                 <Modal theme={theme} title="Update Status" icon="bi-check-circle" iconColor="#2f9e5b" onClose={closeModal}
//                     footer={<>
//                         <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
//                         <button className="btn btn-success" onClick={handleUpdateStatus} disabled={loading}>
//                             {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Updating...</> : <><i className="bi bi-check2 me-2"></i>Update Status</>}
//                         </button>
//                     </>}
//                 >
//                     <p style={{ color: theme.text, marginBottom: '16px' }}>Update status for <strong>{selectedApplication.full_name}</strong></p>
//                     <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>Select Status</label>
//                     <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={fieldStyle}>
//                         {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
//                     </select>
//                     <div style={{ backgroundColor: theme.bg, padding: '12px', borderRadius: '10px', marginTop: '14px' }}>
//                         <p style={{ color: theme.text, margin: 0, fontSize: '13px' }}>
//                             <i className="bi bi-info-circle me-1"></i>Current status: <StatusBadge status={selectedApplication.status} />
//                         </p>
//                     </div>
//                 </Modal>
//             )}

//             {/* Delete */}
//             {activeModal === 'delete' && selectedApplication && (
//                 <Modal theme={theme} title="Delete Application" icon="bi-exclamation-triangle-fill" iconColor="#e0523f" onClose={closeModal}
//                     footer={<>
//                         <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
//                         <button className="btn btn-danger" onClick={handleDeleteApplication} disabled={loading}>
//                             {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Deleting...</> : <><i className="bi bi-trash me-2"></i>Delete Application</>}
//                         </button>
//                     </>}
//                 >
//                     <p style={{ color: theme.text }}>Are you sure you want to delete this application?</p>
//                     <div style={{ backgroundColor: theme.bg, padding: '16px', borderRadius: '10px', marginBottom: '16px', border: `1px solid ${theme.border}` }}>
//                         <h6 style={{ color: theme.text, margin: 0 }}>{selectedApplication.full_name}</h6>
//                         <p style={{ color: theme.text, opacity: 0.65, margin: '4px 0 0 0', fontSize: '13px' }}>
//                             {selectedApplication.job_title || 'N/A'} • {selectedApplication.email}
//                         </p>
//                     </div>
//                     <div className="alert alert-danger" style={{ borderRadius: '10px' }}>
//                         <i className="bi bi-info-circle me-2"></i>This action cannot be undone!
//                     </div>
//                 </Modal>
//             )}

//             <style jsx>{`
//                 @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//                 @keyframes slideIn { from { transform: translateY(-24px) scale(0.96); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
//                 .form-control, .form-select {
//                     background-color: ${theme.bg} !important;
//                     color: ${theme.text} !important;
//                     border-color: ${theme.border} !important;
//                 }
//                 .form-control:focus, .form-select:focus {
//                     box-shadow: 0 0 0 3px ${theme.accent}26;
//                     border-color: ${theme.accent};
//                 }
//                 .table tbody tr:hover { background-color: ${theme.accent}0d !important; }
//                 .btn-group .btn { border-radius: 6px; padding: 4px 10px; margin: 0 2px; }
//                 ::-webkit-scrollbar { width: 6px; height: 6px; }
//                 ::-webkit-scrollbar-track { background: ${theme.bg}; }
//                 ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 10px; }
//                 ::-webkit-scrollbar-thumb:hover { background: ${theme.accent}; }
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
    { value: 'pending', label: 'Pending' },
    { value: 'reviewing', label: 'Reviewing' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'hired', label: 'Hired' }
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

// ---- Small reusable pieces ----

const Modal = ({ theme, title, icon, onClose, children, footer, wide }) => (
    <div
        style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1050, padding: '20px', animation: 'fadeIn .2s ease'
        }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
    >
        <div style={{
            backgroundColor: theme.card, color: theme.text, border: `1px solid ${theme.border}`,
            borderRadius: '18px', width: '100%', maxWidth: wide ? '900px' : '620px', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 24px 60px rgba(0,0,0,0.25)', animation: 'slideIn .2s ease'
        }}>
            <div style={{
                padding: '18px 22px', borderBottom: `1px solid ${theme.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <h5 style={{ margin: 0, fontWeight: 600 }}>
                    {icon && <i className={`bi ${icon} me-2`}></i>}{title}
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

const StatusBadge = ({ status, theme }) => {
    const opt = STATUS_OPTIONS.find(s => s.value === status);
    const isFinal = status === 'hired';
    return (
        <span style={{
            border: `1px solid ${theme.text}`,
            backgroundColor: isFinal ? theme.text : 'transparent',
            color: isFinal ? theme.card : theme.text,
            padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600
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
        bg: isDarkMode ? '#0a0a0a' : '#f5f5f5',
        card: isDarkMode ? '#141414' : '#ffffff',
        text: isDarkMode ? '#f5f5f5' : '#111111',
        textLight: isDarkMode ? '#a3a3a3' : '#6b6b6b',
        border: isDarkMode ? '#2b2b2b' : '#dcdcdc'
    };
    const accent = theme.text;
    const accentOn = theme.card;

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
                                <div className="alert alert-dismissible fade show" role="alert" style={{ border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text }}>
                                    <i className="bi bi-check-circle-fill me-2"></i>{successMessage}
                                    <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-dismissible fade show" role="alert" style={{ border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text }}>
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                                </div>
                            )}

                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                <div>
                                    <h2 style={{ color: theme.text }}>Job Applications</h2>
                                    <p style={{ color: theme.textLight }}>Manage all job applications and inquiries</p>
                                </div>
                                <span style={{
                                    backgroundColor: accent, color: accentOn, fontSize: '14px',
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
                                            <button className="btn btn-outline-dark" onClick={() => setSearchTerm('')}>
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
                                <table className="table table-hover" style={{ backgroundColor: theme.card, borderRadius: '14px', overflow: 'hidden' }}>
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
                                                <div className="spinner-border" style={{ color: accent }} role="status"></div>
                                                <p className="mt-2" style={{ color: theme.textLight }}>Loading applications...</p>
                                            </td></tr>
                                        ) : applications.length === 0 ? (
                                            <tr><td colSpan="9" className="text-center py-5" style={{ color: theme.textLight }}>
                                                <i className="bi bi-inbox display-4 d-block mb-3" style={{ opacity: 0.4 }}></i>
                                                <h5 style={{ color: theme.text }}>No applications found</h5>
                                                <p>{searchTerm || statusFilter ? 'Try adjusting your search filters' : 'No applications submitted yet'}</p>
                                            </td></tr>
                                        ) : applications.map(app => (
                                            <tr key={app.id} style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>
                                                <td style={{ padding: '12px 16px', fontWeight: 600 }}>#{String(app.id).padStart(3, '0')}</td>
                                                <td style={{ padding: '12px 16px' }}><strong>{app.full_name}</strong></td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <span style={{ border: `1px solid ${theme.border}`, color: theme.text, padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
                                                        {app.job_title || 'N/A'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>{app.current_company || 'N/A'}</td>
                                                <td style={{ padding: '12px 16px' }}>{app.designation || 'N/A'}</td>
                                                <td style={{ padding: '12px 16px' }}>{EXPERIENCE_LABELS[app.experience] || app.experience || 'Not specified'}</td>
                                                <td style={{ padding: '12px 16px' }}><StatusBadge status={app.status} theme={theme} /></td>
                                                <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                                                    {new Date(app.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <div className="btn-group btn-group-sm">
                                                        <button className="btn btn-outline-dark" onClick={() => viewApplication(app.id)} title="View Details"><i className="bi bi-eye"></i></button>
                                                        <button className="btn btn-outline-dark" onClick={() => openModal('status', app)} title="Change Status"><i className="bi bi-check-circle"></i></button>
                                                        <button className="btn btn-outline-dark" onClick={() => openModal('delete', app)} title="Delete"><i className="bi bi-trash"></i></button>
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
                <Modal theme={theme} title="Application Details" icon="bi-info-circle" onClose={closeModal} wide
                    footer={<>
                        <button className="btn btn-outline-dark" onClick={closeModal}>Close</button>
                        <button className="btn" style={{ backgroundColor: accent, color: accentOn, border: 'none' }} onClick={() => openModal('edit', selectedApplication)}>
                            <i className="bi bi-pencil me-2"></i>Edit
                        </button>
                    </>}
                >
                    <div className="row g-3">
                        <Field label="Full Name" theme={theme}><div style={{ color: theme.text, fontWeight: 500 }}>{selectedApplication.full_name}</div></Field>
                        <Field label="Applied Position" theme={theme}>
                            <span style={{ border: `1px solid ${theme.border}`, color: theme.text, padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
                                {selectedApplication.job_title || 'N/A'}
                            </span>
                        </Field>
                        <Field label="Email" theme={theme}><a href={`mailto:${selectedApplication.email}`} style={{ color: theme.text, textDecoration: 'underline' }}>{selectedApplication.email}</a></Field>
                        <Field label="Phone" theme={theme}><a href={`tel:${selectedApplication.phone}`} style={{ color: theme.text, textDecoration: 'underline' }}>{selectedApplication.phone}</a></Field>
                        <Field label="Experience" theme={theme}><span style={{ color: theme.text }}>{EXPERIENCE_LABELS[selectedApplication.experience] || 'Not specified'}</span></Field>
                        <Field label="Status" theme={theme}><StatusBadge status={selectedApplication.status} theme={theme} /></Field>
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
                                <div style={{ color: theme.text, backgroundColor: theme.bg, padding: '12px', borderRadius: '10px', whiteSpace: 'pre-wrap', borderLeft: `3px solid ${theme.text}` }}>
                                    {selectedApplication.admin_note}
                                </div>
                            </div>
                        )}
                        {selectedApplication.resume && (
                            <div className="col-12 d-flex gap-2 flex-wrap">
                                <button className="btn btn-outline-dark" onClick={() => viewPdf(selectedApplication.resume)}><i className="bi bi-eye me-2"></i>View Resume</button>
                                <button className="btn" style={{ backgroundColor: accent, color: accentOn, border: 'none' }} onClick={() => downloadResume(selectedApplication.resume, selectedApplication.resume_original_name || `${selectedApplication.full_name}_resume.pdf`)}>
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
                <Modal theme={theme} title={`Resume: ${selectedApplication?.full_name || 'Document'}`} icon="bi-file-pdf"
                    onClose={() => { setActiveModal(null); setPdfUrl(''); }} wide
                >
                    <iframe src={pdfUrl} style={{ width: '100%', height: '70vh', border: 'none', borderRadius: '10px' }} title="Resume PDF" />
                </Modal>
            )}

            {/* Edit */}
            {activeModal === 'edit' && selectedApplication && (
                <form onSubmit={handleUpdateApplication}>
                    <Modal theme={theme} title={`Edit Application: ${selectedApplication.full_name}`} icon="bi-pencil-square" onClose={closeModal} wide
                        footer={<>
                            <button type="button" className="btn btn-outline-dark" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn" style={{ backgroundColor: accent, color: accentOn, border: 'none' }} disabled={loading}>
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
                <Modal theme={theme} title="Update Status" icon="bi-check-circle" onClose={closeModal}
                    footer={<>
                        <button className="btn btn-outline-dark" onClick={closeModal}>Cancel</button>
                        <button className="btn" style={{ backgroundColor: accent, color: accentOn, border: 'none' }} onClick={handleUpdateStatus} disabled={loading}>
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
                            <i className="bi bi-info-circle me-1"></i>Current status: <StatusBadge status={selectedApplication.status} theme={theme} />
                        </p>
                    </div>
                </Modal>
            )}

            {/* Delete */}
            {activeModal === 'delete' && selectedApplication && (
                <div
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 2000, padding: '20px', animation: 'fadeIn .2s ease'
                    }}
                    onClick={(e) => e.target === e.currentTarget && !loading && closeModal()}
                >
                    <div style={{
                        backgroundColor: theme.card, color: theme.text,
                        border: `1px solid ${theme.border}`, borderRadius: '16px',
                        width: '100%', maxWidth: '380px', padding: '28px 26px', textAlign: 'center',
                        animation: 'slideIn .2s ease'
                    }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            border: `1.5px solid ${theme.text}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px', fontSize: '20px'
                        }}>
                            <i className="bi bi-trash"></i>
                        </div>
                        <h5 style={{ margin: '0 0 8px', fontWeight: 600 }}>Delete this application?</h5>
                        <p style={{ margin: '0 0 22px', color: theme.textLight, fontSize: '14px' }}>
                            "<strong>{selectedApplication.full_name}</strong>" ({selectedApplication.job_title || 'N/A'}) will be permanently removed. This can't be undone.
                        </p>
                        <div className="d-flex gap-2">
                            <button onClick={closeModal} disabled={loading} className="btn btn-outline-dark flex-fill">Cancel</button>
                            <button onClick={handleDeleteApplication} disabled={loading} className="btn flex-fill" style={{ backgroundColor: accent, color: accentOn, border: 'none' }}>
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
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
                    box-shadow: 0 0 0 3px ${theme.text}1a;
                    border-color: ${theme.text};
                }
                .table tbody tr:hover { background-color: ${theme.isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'} !important; }
                .btn-group .btn { border-radius: 6px; padding: 4px 10px; margin: 0 2px; }
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: ${theme.bg}; }
                ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default JobQuery;