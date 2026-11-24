
// import React, { useState, useEffect } from 'react';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import Footer from './Footer';

// const CATEGORIES = ['TOUR', 'SALES', 'MARKETING', 'IT', 'HR', 'OTHER', 'Accounts & Finance'];
// const JOB_TYPES = ['Contract', 'Full-time', 'Part-time', 'Remote', 'Hybrid'];

// const EMPTY_FORM = {
//     title: '', category: 'TOUR', description: '', locations: '', type: 'Contract',
//     posted: '', buttonText: 'VIEW DETAILS', status: true,
//     jobDetails: {
//         metaInfo: { duration: 'Full-time', salary: 'Competitive', type: 'On Site', startTime: '9:00 AM', endTime: '5:00 PM' },
//         overview: { title: 'JOB OVERVIEW', description: '' },
//         responsibilities: { title: 'KEY RESPONSIBILITIES', items: [''] },
//         requirements: { title: 'REQUIREMENTS', items: [''] },
//         benefits: { title: 'BENEFITS & PERKS', items: [''] }
//     }
// };

// const API_URL = 'https://backend.akashbariresort.com/api';

// // ---- Reusable pieces ----

// const Modal = ({ theme, title, icon, onClose, children, footer, wide }) => (
//     <div
//         style={{
//             position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             zIndex: 1050, padding: '20px', animation: 'fadeIn .2s ease'
//         }}
//         onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//         <div style={{
//             backgroundColor: theme.card, color: theme.text, border: `1px solid ${theme.border}`,
//             borderRadius: '18px', width: '100%', maxWidth: wide ? '850px' : '500px', maxHeight: '90vh',
//             display: 'flex', flexDirection: 'column',
//             boxShadow: '0 24px 60px rgba(0,0,0,0.25)', animation: 'slideIn .2s ease'
//         }}>
//             <div style={{
//                 padding: '18px 22px', borderBottom: `1px solid ${theme.border}`,
//                 display: 'flex', justifyContent: 'space-between', alignItems: 'center'
//             }}>
//                 <h5 style={{ margin: 0, fontWeight: 600 }}>
//                     {icon && <i className={`bi ${icon} me-2`}></i>}{title}
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

// const Label = ({ theme, children, required }) => (
//     <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>
//         {children} {required && <span className="text-danger">*</span>}
//     </label>
// );

// // Editable list used for responsibilities / requirements / benefits
// const DynamicList = ({ theme, fieldStyle, label, items, onChange, onAdd, onRemove }) => (
//     <div className="mb-3">
//         <Label theme={theme}>{label}</Label>
//         {items.map((item, i) => (
//             <div key={i} className="input-group mb-2">
//                 <input
//                     className="form-control"
//                     value={item}
//                     onChange={(e) => onChange(i, e.target.value)}
//                     placeholder={`${label.replace(/s$/, '')} ${i + 1}`}
//                     style={fieldStyle}
//                 />
//                 <button type="button" className="btn btn-outline-dark" onClick={() => onRemove(i)} disabled={items.length <= 1}>
//                     <i className="bi bi-trash"></i>
//                 </button>
//             </div>
//         ))}
//         <button type="button" className="btn btn-sm btn-outline-dark" onClick={onAdd}>
//             <i className="bi bi-plus-circle me-1"></i> Add {label.replace(/s$/, '')}
//         </button>
//     </div>
// );

// // Shared Add/Edit form body
// const JobForm = ({ theme, fieldStyle, formData, setFormData }) => {
//     const setTop = (field, value) => setFormData({ ...formData, [field]: value });
//     const setMeta = (field, value) => setFormData({
//         ...formData, jobDetails: { ...formData.jobDetails, metaInfo: { ...formData.jobDetails.metaInfo, [field]: value } }
//     });
//     const setOverview = (value) => setFormData({
//         ...formData, jobDetails: { ...formData.jobDetails, overview: { ...formData.jobDetails.overview, description: value } }
//     });
//     const setListItem = (section, index, value) => {
//         const items = [...formData.jobDetails[section].items];
//         items[index] = value;
//         setFormData({ ...formData, jobDetails: { ...formData.jobDetails, [section]: { ...formData.jobDetails[section], items } } });
//     };
//     const addListItem = (section) => setFormData({
//         ...formData, jobDetails: { ...formData.jobDetails, [section]: { ...formData.jobDetails[section], items: [...formData.jobDetails[section].items, ''] } }
//     });
//     const removeListItem = (section, index) => setFormData({
//         ...formData, jobDetails: { ...formData.jobDetails, [section]: { ...formData.jobDetails[section], items: formData.jobDetails[section].items.filter((_, i) => i !== index) } }
//     });

//     return (
//         <>
//             <div className="mb-3">
//                 <Label theme={theme} required>Job Title</Label>
//                 <input className="form-control" required value={formData.title} onChange={(e) => setTop('title', e.target.value)} style={fieldStyle} placeholder="Enter job title" />
//             </div>

//             <div className="row mb-3 g-3">
//                 <div className="col-md-6">
//                     <Label theme={theme} required>Category</Label>
//                     <select className="form-select" required value={formData.category} onChange={(e) => setTop('category', e.target.value)} style={fieldStyle}>
//                         {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
//                     </select>
//                 </div>
//                 <div className="col-md-6">
//                     <Label theme={theme} required>Job Type</Label>
//                     <select className="form-select" required value={formData.type} onChange={(e) => setTop('type', e.target.value)} style={fieldStyle}>
//                         {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
//                     </select>
//                 </div>
//             </div>

//             <div className="mb-3">
//                 <Label theme={theme} required>Description</Label>
//                 <textarea className="form-control" rows="3" required value={formData.description} onChange={(e) => setTop('description', e.target.value)} style={{ ...fieldStyle, minHeight: '80px' }} placeholder="Enter job description" />
//             </div>

//             <div className="row mb-3 g-3">
//                 <div className="col-md-6">
//                     <Label theme={theme} required>Location</Label>
//                     <input className="form-control" required value={formData.locations} onChange={(e) => setTop('locations', e.target.value)} style={fieldStyle} placeholder="e.g., Dhaka, Bangladesh" />
//                 </div>
//                 <div className="col-md-6">
//                     <Label theme={theme}>Posted Date</Label>
//                     <input className="form-control" value={formData.posted} onChange={(e) => setTop('posted', e.target.value)} style={fieldStyle} placeholder="e.g., Posted 2 days ago" />
//                 </div>
//             </div>

//             <hr style={{ borderColor: theme.border, margin: '20px 0' }} />
//             <h6 style={{ color: theme.text, marginBottom: '16px' }}>Job Details</h6>

//             <div className="row mb-3 g-3">
//                 <div className="col-md-3">
//                     <Label theme={theme}>Duration</Label>
//                     <input className="form-control" value={formData.jobDetails.metaInfo.duration} onChange={(e) => setMeta('duration', e.target.value)} style={fieldStyle} />
//                 </div>
//                 <div className="col-md-3">
//                     <Label theme={theme}>Salary</Label>
//                     <input className="form-control" value={formData.jobDetails.metaInfo.salary} onChange={(e) => setMeta('salary', e.target.value)} style={fieldStyle} />
//                 </div>
//                 <div className="col-md-3">
//                     <Label theme={theme}>Work Type</Label>
//                     <input className="form-control" value={formData.jobDetails.metaInfo.type} onChange={(e) => setMeta('type', e.target.value)} style={fieldStyle} />
//                 </div>
//                 <div className="col-md-3">
//                     <Label theme={theme}>Start Time</Label>
//                     <input className="form-control" value={formData.jobDetails.metaInfo.startTime} onChange={(e) => setMeta('startTime', e.target.value)} style={fieldStyle} />
//                 </div>
//             </div>

//             <div className="mb-3">
//                 <Label theme={theme}>Overview Description</Label>
//                 <textarea className="form-control" rows="2" value={formData.jobDetails.overview.description} onChange={(e) => setOverview(e.target.value)} style={{ ...fieldStyle, minHeight: '60px' }} placeholder="Enter job overview" />
//             </div>

//             <DynamicList theme={theme} fieldStyle={fieldStyle} label="Responsibilities"
//                 items={formData.jobDetails.responsibilities.items}
//                 onChange={(i, v) => setListItem('responsibilities', i, v)}
//                 onAdd={() => addListItem('responsibilities')}
//                 onRemove={(i) => removeListItem('responsibilities', i)}
//             />
//             <DynamicList theme={theme} fieldStyle={fieldStyle} label="Requirements"
//                 items={formData.jobDetails.requirements.items}
//                 onChange={(i, v) => setListItem('requirements', i, v)}
//                 onAdd={() => addListItem('requirements')}
//                 onRemove={(i) => removeListItem('requirements', i)}
//             />
//             <DynamicList theme={theme} fieldStyle={fieldStyle} label="Benefits"
//                 items={formData.jobDetails.benefits.items}
//                 onChange={(i, v) => setListItem('benefits', i, v)}
//                 onAdd={() => addListItem('benefits')}
//                 onRemove={(i) => removeListItem('benefits', i)}
//             />
//         </>
//     );
// };

// // ---------------------------------------------------------------------

// const JobSettings = ({ theme: propsTheme }) => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(false);
//     const [jobs, setJobs] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const [activeModal, setActiveModal] = useState(null); // 'add' | 'edit' | 'delete'
//     const [selectedJob, setSelectedJob] = useState(null);
//     const [formData, setFormData] = useState(EMPTY_FORM);

//     const [toast, setToast] = useState({ show: false, message: '', type: '' });

//     const theme = propsTheme || {
//         isDarkMode,
//         bg: isDarkMode ? '#0a0a0a' : '#f5f5f5',
//         card: isDarkMode ? '#141414' : '#ffffff',
//         text: isDarkMode ? '#f5f5f5' : '#111111',
//         textLight: isDarkMode ? '#a3a3a3' : '#6b6b6b',
//         border: isDarkMode ? '#2b2b2b' : '#dcdcdc'
//     };
//     const accent = theme.text;
//     const accentOn = theme.card;

//     const fieldStyle = {
//         backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}`,
//         borderRadius: '10px', padding: '10px 14px', width: '100%', fontSize: '14px'
//     };

//     const toggleSidebar = () => setIsCollapsed(!isCollapsed);
//     const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

//     const showToast = (message, type = 'success') => {
//         setToast({ show: true, message, type });
//         setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
//     };

//     const fetchJobs = async () => {
//         setLoading(true);
//         try {
//             const res = await fetch(`${API_URL}/jobs`);
//             if (!res.ok) throw new Error('Failed to fetch jobs');
//             const data = await res.json();
//             setJobs(data.data || []);
//         } catch (err) {
//             showToast(err.message, 'error');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => { fetchJobs(); }, []);

//     const closeModal = () => { setActiveModal(null); setSelectedJob(null); };

//     const openAddModal = () => { setFormData(EMPTY_FORM); setActiveModal('add'); };

//     const openEditModal = (job) => {
//         setSelectedJob(job);
//         setFormData({
//             title: job.title || '', category: job.category || 'TOUR', description: job.description || '',
//             locations: job.locations || '', type: job.type || 'Contract', posted: job.posted || '',
//             buttonText: job.buttonText || 'VIEW DETAILS', status: job.status !== undefined ? job.status : true,
//             jobDetails: {
//                 metaInfo: {
//                     duration: job.jobDetails?.metaInfo?.duration || 'Full-time',
//                     salary: job.jobDetails?.metaInfo?.salary || 'Competitive',
//                     type: job.jobDetails?.metaInfo?.type || 'On Site',
//                     startTime: job.jobDetails?.metaInfo?.startTime || '9:00 AM',
//                     endTime: job.jobDetails?.metaInfo?.endTime || '5:00 PM'
//                 },
//                 overview: { title: job.jobDetails?.overview?.title || 'JOB OVERVIEW', description: job.jobDetails?.overview?.description || '' },
//                 responsibilities: { title: job.jobDetails?.responsibilities?.title || 'KEY RESPONSIBILITIES', items: job.jobDetails?.responsibilities?.items || [''] },
//                 requirements: { title: job.jobDetails?.requirements?.title || 'REQUIREMENTS', items: job.jobDetails?.requirements?.items || [''] },
//                 benefits: { title: job.jobDetails?.benefits?.title || 'BENEFITS & PERKS', items: job.jobDetails?.benefits?.items || [''] }
//             }
//         });
//         setActiveModal('edit');
//     };

//     const runRequest = async (url, options, successMsg) => {
//         setLoading(true);
//         try {
//             const res = await fetch(url, options);
//             if (!res.ok) {
//                 const err = await res.json();
//                 throw new Error(err.message || 'Request failed');
//             }
//             showToast(successMsg, 'success');
//             closeModal();
//             fetchJobs();
//         } catch (err) {
//             showToast(err.message, 'error');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAddJob = (e) => {
//         e.preventDefault();
//         runRequest(`${API_URL}/add-jobs`, {
//             method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
//         }, 'Job added successfully!');
//     };

//     const handleEditJob = (e) => {
//         e.preventDefault();
//         runRequest(`${API_URL}/edit-jobs/${selectedJob.id}`, {
//             method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
//         }, 'Job updated successfully!');
//     };

//     const handleDeleteJob = () => runRequest(`${API_URL}/del-/${selectedJob.id}`, { method: 'DELETE' }, 'Job deleted successfully!');

//     const handleToggleStatus = async (jobId, currentStatus) => {
//         const newStatus = !currentStatus;
//         try {
//             const res = await fetch(`${API_URL}/toggule/${jobId}/status`, {
//                 method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus })
//             });
//             if (!res.ok) {
//                 const err = await res.json();
//                 throw new Error(err.message || 'Failed to toggle status');
//             }
//             setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
//             showToast(`Job ${newStatus ? 'activated' : 'deactivated'} successfully!`, 'success');
//         } catch (err) {
//             showToast(err.message, 'error');
//         }
//     };

//     return (
//         <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }} className="container-fluid p-0">
//             <div className="d-flex">
//                 <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="job" />

//                 <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="flex-grow-1">
//                     <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

//                     <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
//                         <div style={{ padding: '24px' }}>
//                             <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
//                                 <div>
//                                     <h2 style={{ color: theme.text }}>Job Management</h2>
//                                     <p style={{ color: theme.textLight }}>Manage all job postings</p>
//                                 </div>
//                                 <button className="btn" style={{ backgroundColor: accent, color: accentOn, border: 'none' }} onClick={openAddModal}>
//                                     <i className="bi bi-plus-circle me-2"></i>Add New Job
//                                 </button>
//                             </div>

//                             <div className="table-responsive">
//                                 <table className="table table-hover" style={{ backgroundColor: theme.card, borderRadius: '14px', overflow: 'hidden' }}>
//                                     <thead style={{ color: theme.text, borderBottom: `2px solid ${theme.border}` }}>
//                                         <tr>
//                                             {['ID', 'Title', 'Category', 'Type', 'Location', 'Status', 'Actions'].map(h => (
//                                                 <th key={h} style={{ padding: '14px 16px' }}>{h}</th>
//                                             ))}
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {loading ? (
//                                             <tr><td colSpan="7" className="text-center py-5">
//                                                 <div className="spinner-border" style={{ color: accent }} role="status"></div>
//                                                 <p className="mt-2" style={{ color: theme.textLight }}>Loading jobs...</p>
//                                             </td></tr>
//                                         ) : jobs.length === 0 ? (
//                                             <tr><td colSpan="7" className="text-center py-5" style={{ color: theme.textLight }}>
//                                                 <i className="bi bi-inbox display-4 d-block mb-3" style={{ opacity: 0.4 }}></i>
//                                                 <h5 style={{ color: theme.text }}>No jobs found</h5>
//                                                 <p>Click "Add New Job" to create your first job posting.</p>
//                                             </td></tr>
//                                         ) : jobs.map(job => (
//                                             <tr key={job.id} style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>
//                                                 <td style={{ padding: '12px 16px', fontWeight: 600 }}>#{String(job.id).padStart(3, '0')}</td>
//                                                 <td style={{ padding: '12px 16px' }}><strong>{job.title}</strong></td>
//                                                 <td style={{ padding: '12px 16px' }}>
//                                                     <span style={{ border: `1px solid ${theme.text}`, color: theme.text, padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
//                                                         {job.category}
//                                                     </span>
//                                                 </td>
//                                                 <td style={{ padding: '12px 16px' }}>{job.type}</td>
//                                                 <td style={{ padding: '12px 16px' }}>{job.locations}</td>
//                                                 <td style={{ padding: '12px 16px' }}>
//                                                     <button
//                                                         onClick={() => handleToggleStatus(job.id, job.status)}
//                                                         style={{
//                                                             padding: '5px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 600,
//                                                             border: `1px solid ${theme.text}`, cursor: 'pointer',
//                                                             backgroundColor: job.status ? accent : 'transparent',
//                                                             color: job.status ? accentOn : theme.text
//                                                         }}
//                                                     >
//                                                         <i className={`bi ${job.status ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-1`}></i>
//                                                         {job.status ? 'Active' : 'Inactive'}
//                                                     </button>
//                                                 </td>
//                                                 <td style={{ padding: '12px 16px' }}>
//                                                     <div className="btn-group btn-group-sm">
//                                                         <button className="btn btn-outline-dark" onClick={() => openEditModal(job)} title="Edit Job"><i className="bi bi-pencil"></i></button>
//                                                         <button className="btn btn-outline-dark" onClick={() => { setSelectedJob(job); setActiveModal('delete'); }} title="Delete Job"><i className="bi bi-trash"></i></button>
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

//             {/* Add */}
//             {activeModal === 'add' && (
//                 <form onSubmit={handleAddJob}>
//                     <Modal theme={theme} title="Add New Job" icon="bi-plus-circle" onClose={closeModal} wide
//                         footer={<>
//                             <button type="button" className="btn btn-outline-dark" onClick={closeModal}>Cancel</button>
//                             <button type="submit" className="btn" style={{ backgroundColor: accent, color: accentOn, border: 'none' }} disabled={loading}>
//                                 {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : <><i className="bi bi-save me-2"></i>Save Job</>}
//                             </button>
//                         </>}
//                     >
//                         <JobForm theme={theme} fieldStyle={fieldStyle} formData={formData} setFormData={setFormData} />
//                     </Modal>
//                 </form>
//             )}

//             {/* Edit */}
//             {activeModal === 'edit' && selectedJob && (
//                 <form onSubmit={handleEditJob}>
//                     <Modal theme={theme} title={`Edit Job: ${selectedJob.title}`} icon="bi-pencil-square" onClose={closeModal} wide
//                         footer={<>
//                             <button type="button" className="btn btn-outline-dark" onClick={closeModal}>Cancel</button>
//                             <button type="submit" className="btn" style={{ backgroundColor: accent, color: accentOn, border: 'none' }} disabled={loading}>
//                                 {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Updating...</> : <><i className="bi bi-save me-2"></i>Update Job</>}
//                             </button>
//                         </>}
//                     >
//                         <JobForm theme={theme} fieldStyle={fieldStyle} formData={formData} setFormData={setFormData} />
//                     </Modal>
//                 </form>
//             )}

//             {/* Delete */}
//             {activeModal === 'delete' && selectedJob && (
//                 <div
//                     style={{
//                         position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
//                         display: 'flex', alignItems: 'center', justifyContent: 'center',
//                         zIndex: 2000, padding: '20px', animation: 'fadeIn .2s ease'
//                     }}
//                     onClick={(e) => e.target === e.currentTarget && !loading && closeModal()}
//                 >
//                     <div style={{
//                         backgroundColor: theme.card, color: theme.text,
//                         border: `1px solid ${theme.border}`, borderRadius: '16px',
//                         width: '100%', maxWidth: '380px', padding: '28px 26px', textAlign: 'center',
//                         animation: 'slideIn .2s ease'
//                     }}>
//                         <div style={{
//                             width: '48px', height: '48px', borderRadius: '50%',
//                             border: `1.5px solid ${theme.text}`,
//                             display: 'flex', alignItems: 'center', justifyContent: 'center',
//                             margin: '0 auto 16px', fontSize: '20px'
//                         }}>
//                             <i className="bi bi-trash"></i>
//                         </div>
//                         <h5 style={{ margin: '0 0 8px', fontWeight: 600 }}>Delete this job?</h5>
//                         <p style={{ margin: '0 0 22px', color: theme.textLight, fontSize: '14px' }}>
//                             "<strong>{selectedJob.title}</strong>" will be permanently removed. This can't be undone.
//                         </p>
//                         <div className="d-flex gap-2">
//                             <button onClick={closeModal} disabled={loading} className="btn btn-outline-dark flex-fill">Cancel</button>
//                             <button onClick={handleDeleteJob} disabled={loading} className="btn flex-fill" style={{ backgroundColor: accent, color: accentOn, border: 'none' }}>
//                                 {loading ? 'Deleting...' : 'Delete'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Toast */}
//             {toast.show && (
//                 <div style={{
//                     position: 'fixed', bottom: '20px', right: '20px', zIndex: 2000,
//                     padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 500,
//                     backgroundColor: accent, color: accentOn, display: 'flex', alignItems: 'center', gap: '8px'
//                 }}>
//                     <i className={`bi ${toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
//                     {toast.message}
//                 </div>
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
//                     box-shadow: 0 0 0 3px ${theme.text}1a;
//                     border-color: ${theme.text};
//                 }
//                 .table tbody tr:hover { background-color: ${theme.isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'} !important; }
//                 .btn-group .btn { border-radius: 6px; padding: 4px 10px; margin: 0 2px; }
//                 ::-webkit-scrollbar { width: 6px; height: 6px; }
//                 ::-webkit-scrollbar-track { background: ${theme.bg}; }
//                 ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 10px; }
//             `}</style>
//         </div>
//     );
// };

// export default JobSettings;





import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

// ⚠️ path আপনার folder অনুযায়ী ঠিক করুন (src/Config/api.js)
import { API_BASE_URL } from '../Config/api';

const API_URL = API_BASE_URL;

const CATEGORIES = ['TOUR', 'SALES', 'MARKETING', 'IT', 'HR', 'OTHER', 'Accounts & Finance'];
const JOB_TYPES = ['Contract', 'Full-time', 'Part-time', 'Remote', 'Hybrid'];

const todayText = () =>
    `Posted ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;

const createEmptyForm = () => ({
    title: '', category: 'TOUR', description: '', locations: '', type: 'Contract',
    posted: todayText(), buttonText: 'VIEW DETAILS', status: true,
    jobDetails: {
        metaInfo: { duration: 'Full-time', salary: 'Competitive', type: 'On Site', startTime: '9:00 AM', endTime: '5:00 PM' },
        overview: { title: 'JOB OVERVIEW', description: '' },
        responsibilities: { title: 'KEY RESPONSIBILITIES', items: [''] },
        requirements: { title: 'REQUIREMENTS', items: [''] },
        benefits: { title: 'BENEFITS & PERKS', items: [''] }
    }
});

const LIST_SECTIONS = [
    { key: 'responsibilities', label: 'Responsibilities' },
    { key: 'requirements', label: 'Requirements' },
    { key: 'benefits', label: 'Benefits' },
];

// ---------- Auth headers (admin route এ token লাগে) ----------
const authHeaders = (json = false) => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    Role: localStorage.getItem('Role') || 'admin',
    Accept: 'application/json',
    ...(json ? { 'Content-Type': 'application/json' } : {})
});

// Server HTML পাঠালেও crash করবে না
const parseJson = async (res) => {
    const text = await res.text();
    try {
        return JSON.parse(text);
    } catch {
        return { message: res.status >= 500 ? `Server error (${res.status})` : `Unexpected response (${res.status})` };
    }
};

// 422 হলে প্রথম validation error
const errorMessage = (body, fallback) => {
    if (body?.errors) {
        const first = Object.values(body.errors)[0];
        return Array.isArray(first) ? first[0] : String(first);
    }
    return body?.message || fallback;
};

// Backend এ পাঠানোর আগে: trim + ফাঁকা list item বাদ
const cleanPayload = (form) => {
    const jd = form.jobDetails;
    const cleanItems = (items) => items.map((i) => i.trim()).filter(Boolean);
    return {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        locations: form.locations.trim(),
        posted: form.posted.trim(),
        buttonText: form.buttonText.trim() || 'VIEW DETAILS',
        jobDetails: {
            metaInfo: Object.fromEntries(Object.entries(jd.metaInfo).map(([k, v]) => [k, String(v).trim()])),
            overview: { ...jd.overview, description: jd.overview.description.trim() },
            responsibilities: { ...jd.responsibilities, items: cleanItems(jd.responsibilities.items) },
            requirements: { ...jd.requirements, items: cleanItems(jd.requirements.items) },
            benefits: { ...jd.benefits, items: cleanItems(jd.benefits.items) },
        },
    };
};

// Submit এর আগে frontend এ check (backend এর rule অনুযায়ী)
const validateForm = (p) => {
    if (!p.title) return 'Job title is required';
    if (!p.description) return 'Description is required';
    if (!p.locations) return 'Location is required';
    if (!p.posted) return 'Posted date is required';
    const m = p.jobDetails.metaInfo;
    if (!m.duration || !m.salary || !m.type || !m.startTime || !m.endTime) return 'Please fill all job meta info fields';
    if (!p.jobDetails.overview.description) return 'Overview description is required';
    for (const { key, label } of LIST_SECTIONS) {
        if (p.jobDetails[key].items.length === 0) return `Add at least one item in ${label}`;
    }
    return null;
};

// ---- Reusable pieces ----

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
            borderRadius: '18px', width: '100%', maxWidth: wide ? '850px' : '500px', maxHeight: '90vh',
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
                <button type="button" onClick={onClose} style={{
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
        <Label theme={theme} required>{label}</Label>
        {items.map((item, i) => (
            <div key={i} className="input-group mb-2">
                <input
                    className="form-control"
                    value={item}
                    onChange={(e) => onChange(i, e.target.value)}
                    placeholder={`${label.replace(/s$/, '')} ${i + 1}`}
                    style={fieldStyle}
                />
                <button type="button" className="btn btn-outline-dark" onClick={() => onRemove(i)} disabled={items.length <= 1}>
                    <i className="bi bi-trash"></i>
                </button>
            </div>
        ))}
        <button type="button" className="btn btn-sm btn-outline-dark" onClick={onAdd}>
            <i className="bi bi-plus-circle me-1"></i> Add {label.replace(/s$/, '')}
        </button>
    </div>
);

// Shared Add/Edit form body
const JobForm = ({ theme, fieldStyle, formData, setFormData }) => {
    const setTop = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
    const setMeta = (field, value) => setFormData((prev) => ({
        ...prev, jobDetails: { ...prev.jobDetails, metaInfo: { ...prev.jobDetails.metaInfo, [field]: value } }
    }));
    const setOverview = (value) => setFormData((prev) => ({
        ...prev, jobDetails: { ...prev.jobDetails, overview: { ...prev.jobDetails.overview, description: value } }
    }));
    const setListItem = (section, index, value) => setFormData((prev) => {
        const items = [...prev.jobDetails[section].items];
        items[index] = value;
        return { ...prev, jobDetails: { ...prev.jobDetails, [section]: { ...prev.jobDetails[section], items } } };
    });
    const addListItem = (section) => setFormData((prev) => ({
        ...prev, jobDetails: { ...prev.jobDetails, [section]: { ...prev.jobDetails[section], items: [...prev.jobDetails[section].items, ''] } }
    }));
    const removeListItem = (section, index) => setFormData((prev) => ({
        ...prev, jobDetails: { ...prev.jobDetails, [section]: { ...prev.jobDetails[section], items: prev.jobDetails[section].items.filter((_, i) => i !== index) } }
    }));

    const meta = formData.jobDetails.metaInfo;

    return (
        <>
            <div className="mb-3">
                <Label theme={theme} required>Job Title</Label>
                <input className="form-control" required value={formData.title} onChange={(e) => setTop('title', e.target.value)} style={fieldStyle} placeholder="Enter job title" maxLength={255} />
            </div>

            <div className="row mb-3 g-3">
                <div className="col-md-6">
                    <Label theme={theme} required>Category</Label>
                    <select className="form-select" required value={formData.category} onChange={(e) => setTop('category', e.target.value)} style={fieldStyle}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        {formData.category && !CATEGORIES.includes(formData.category) && (
                            <option value={formData.category}>{formData.category}</option>
                        )}
                    </select>
                </div>
                <div className="col-md-6">
                    <Label theme={theme} required>Job Type</Label>
                    <select className="form-select" required value={formData.type} onChange={(e) => setTop('type', e.target.value)} style={fieldStyle}>
                        {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        {formData.type && !JOB_TYPES.includes(formData.type) && (
                            <option value={formData.type}>{formData.type}</option>
                        )}
                    </select>
                </div>
            </div>

            <div className="mb-3">
                <Label theme={theme} required>Description</Label>
                <textarea className="form-control" rows="3" required value={formData.description} onChange={(e) => setTop('description', e.target.value)} style={{ ...fieldStyle, minHeight: '80px' }} placeholder="Enter job description" />
            </div>

            <div className="row mb-3 g-3">
                <div className="col-md-4">
                    <Label theme={theme} required>Location</Label>
                    <input className="form-control" required value={formData.locations} onChange={(e) => setTop('locations', e.target.value)} style={fieldStyle} placeholder="e.g., Dhaka, Bangladesh" maxLength={255} />
                </div>
                <div className="col-md-4">
                    <Label theme={theme} required>Posted</Label>
                    <input className="form-control" required value={formData.posted} onChange={(e) => setTop('posted', e.target.value)} style={fieldStyle} placeholder="e.g., Posted 2 days ago" maxLength={100} />
                </div>
                <div className="col-md-4">
                    <Label theme={theme}>Button Text</Label>
                    <input className="form-control" value={formData.buttonText} onChange={(e) => setTop('buttonText', e.target.value)} style={fieldStyle} placeholder="VIEW DETAILS" maxLength={50} />
                </div>
            </div>

            <hr style={{ borderColor: theme.border, margin: '20px 0' }} />
            <h6 style={{ color: theme.text, marginBottom: '16px' }}>Job Details</h6>

            <div className="row mb-3 g-3">
                <div className="col-md-4">
                    <Label theme={theme} required>Duration</Label>
                    <input className="form-control" value={meta.duration} onChange={(e) => setMeta('duration', e.target.value)} style={fieldStyle} maxLength={100} />
                </div>
                <div className="col-md-4">
                    <Label theme={theme} required>Salary</Label>
                    <input className="form-control" value={meta.salary} onChange={(e) => setMeta('salary', e.target.value)} style={fieldStyle} maxLength={100} />
                </div>
                <div className="col-md-4">
                    <Label theme={theme} required>Work Type</Label>
                    <input className="form-control" value={meta.type} onChange={(e) => setMeta('type', e.target.value)} style={fieldStyle} maxLength={100} />
                </div>
                <div className="col-md-6">
                    <Label theme={theme} required>Start Time</Label>
                    <input className="form-control" value={meta.startTime} onChange={(e) => setMeta('startTime', e.target.value)} style={fieldStyle} maxLength={50} />
                </div>
                <div className="col-md-6">
                    <Label theme={theme} required>End Time</Label>
                    <input className="form-control" value={meta.endTime} onChange={(e) => setMeta('endTime', e.target.value)} style={fieldStyle} maxLength={50} />
                </div>
            </div>

            <div className="mb-3">
                <Label theme={theme} required>Overview Description</Label>
                <textarea className="form-control" rows="2" value={formData.jobDetails.overview.description} onChange={(e) => setOverview(e.target.value)} style={{ ...fieldStyle, minHeight: '60px' }} placeholder="Enter job overview" />
            </div>

            {LIST_SECTIONS.map(({ key, label }) => (
                <DynamicList
                    key={key}
                    theme={theme}
                    fieldStyle={fieldStyle}
                    label={label}
                    items={formData.jobDetails[key].items}
                    onChange={(i, v) => setListItem(key, i, v)}
                    onAdd={() => addListItem(key)}
                    onRemove={(i) => removeListItem(key, i)}
                />
            ))}
        </>
    );
};

// ---------------------------------------------------------------------

const JobSettings = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [togglingId, setTogglingId] = useState(null);

    const [activeModal, setActiveModal] = useState(null); // 'add' | 'edit' | 'delete'
    const [selectedJob, setSelectedJob] = useState(null);
    const [formData, setFormData] = useState(createEmptyForm);

    const [toast, setToast] = useState({ show: false, message: '', type: '' });

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

    const fieldStyle = {
        backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}`,
        borderRadius: '10px', padding: '10px 14px', width: '100%', fontSize: '14px'
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3500);
    };

    // ---------- Login check / session expired ----------
    const hasToken = () => {
        if (!localStorage.getItem('token')) {
            showToast('Please login to access this page', 'error');
            setTimeout(() => { window.location.href = '/login'; }, 2000);
            return false;
        }
        return true;
    };

    const handleAuthStatus = (res) => {
        if (res.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('Role');
            showToast('Session expired. Please login again.', 'error');
            setTimeout(() => { window.location.href = '/login'; }, 2000);
            return true;
        }
        if (res.status === 403) {
            showToast('This account does not have admin access.', 'error');
            return true;
        }
        return false;
    };

    // Admin: সব job (active + inactive)
    const fetchJobs = async () => {
        if (!hasToken()) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/jobs`, { headers: authHeaders() });
            if (handleAuthStatus(res)) return;
            const body = await parseJson(res);
            if (!res.ok) throw new Error(errorMessage(body, 'Failed to fetch jobs'));
            setJobs(Array.isArray(body.data) ? body.data : []);
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchJobs(); }, []);

    const closeModal = () => { setActiveModal(null); setSelectedJob(null); };

    const openAddModal = () => { setFormData(createEmptyForm()); setActiveModal('add'); };

    const openEditModal = (job) => {
        const jd = job.jobDetails || {};
        const items = (arr) => (Array.isArray(arr) && arr.length ? arr : ['']);
        setSelectedJob(job);
        setFormData({
            title: job.title || '', category: job.category || 'TOUR', description: job.description || '',
            locations: job.locations || '', type: job.type || 'Contract', posted: job.posted || todayText(),
            buttonText: job.buttonText || job.button_text || 'VIEW DETAILS',
            status: job.status !== undefined ? Boolean(job.status) : true,
            jobDetails: {
                metaInfo: {
                    duration: jd.metaInfo?.duration || 'Full-time',
                    salary: jd.metaInfo?.salary || 'Competitive',
                    type: jd.metaInfo?.type || 'On Site',
                    startTime: jd.metaInfo?.startTime || '9:00 AM',
                    endTime: jd.metaInfo?.endTime || '5:00 PM'
                },
                overview: { title: jd.overview?.title || 'JOB OVERVIEW', description: jd.overview?.description || '' },
                responsibilities: { title: jd.responsibilities?.title || 'KEY RESPONSIBILITIES', items: items(jd.responsibilities?.items) },
                requirements: { title: jd.requirements?.title || 'REQUIREMENTS', items: items(jd.requirements?.items) },
                benefits: { title: jd.benefits?.title || 'BENEFITS & PERKS', items: items(jd.benefits?.items) }
            }
        });
        setActiveModal('edit');
    };

    const runRequest = async (url, options, successMsg) => {
        if (!hasToken()) return;
        setLoading(true);
        try {
            const res = await fetch(url, options);
            if (handleAuthStatus(res)) return;
            const body = await parseJson(res);
            if (!res.ok || body.status === false) throw new Error(errorMessage(body, 'Request failed'));

            showToast(successMsg, 'success');
            closeModal();
            fetchJobs();
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const submitJob = (url, method, successMsg) => {
        const payload = cleanPayload(formData);
        const problem = validateForm(payload);
        if (problem) return showToast(problem, 'error');

        runRequest(url, {
            method,
            headers: authHeaders(true),
            body: JSON.stringify(payload)
        }, successMsg);
    };

    const handleAddJob = (e) => {
        e.preventDefault();
        submitJob(`${API_URL}/add-jobs`, 'POST', 'Job added successfully!');
    };

    const handleEditJob = (e) => {
        e.preventDefault();
        submitJob(`${API_URL}/edit-jobs/${selectedJob.id}`, 'PUT', 'Job updated successfully!');
    };

    const handleDeleteJob = () => runRequest(
        `${API_URL}/del-jobs/${selectedJob.id}`,
        { method: 'DELETE', headers: authHeaders() },
        'Job deleted successfully!'
    );

    const handleToggleStatus = async (job) => {
        if (!hasToken()) return;
        setTogglingId(job.id);
        try {
            const res = await fetch(`${API_URL}/toggule/${job.id}/status`, {
                method: 'PATCH',
                headers: authHeaders(true),
                body: JSON.stringify({ status: !job.status })
            });
            if (handleAuthStatus(res)) return;
            const body = await parseJson(res);
            if (!res.ok) throw new Error(errorMessage(body, 'Failed to toggle status'));

            // Backend যে status দিয়েছে সেটাই বসাও
            const newStatus = body?.data?.status !== undefined ? Boolean(body.data.status) : !job.status;
            setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j)));
            showToast(`Job ${newStatus ? 'activated' : 'deactivated'} successfully!`, 'success');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} />

                <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="flex-grow-1">
                    <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '24px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                <div>
                                    <h2 style={{ color: theme.text }}>Job Management</h2>
                                    <p style={{ color: theme.textLight }}>
                                        Manage all job postings · {jobs.length} total · {jobs.filter((j) => j.status).length} active
                                    </p>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-dark" onClick={fetchJobs} disabled={loading} title="Refresh">
                                        <i className="bi bi-arrow-clockwise"></i>
                                    </button>
                                    <button className="btn" style={{ backgroundColor: accent, color: accentOn, border: 'none' }} onClick={openAddModal}>
                                        <i className="bi bi-plus-circle me-2"></i>Add New Job
                                    </button>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover" style={{ backgroundColor: theme.card, borderRadius: '14px', overflow: 'hidden' }}>
                                    <thead style={{ color: theme.text, borderBottom: `2px solid ${theme.border}` }}>
                                        <tr>
                                            {['ID', 'Title', 'Category', 'Type', 'Location', 'Status', 'Actions'].map(h => (
                                                <th key={h} style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading && jobs.length === 0 ? (
                                            <tr><td colSpan="7" className="text-center py-5">
                                                <div className="spinner-border" style={{ color: accent }} role="status"></div>
                                                <p className="mt-2" style={{ color: theme.textLight }}>Loading jobs...</p>
                                            </td></tr>
                                        ) : jobs.length === 0 ? (
                                            <tr><td colSpan="7" className="text-center py-5" style={{ color: theme.textLight }}>
                                                <i className="bi bi-inbox display-4 d-block mb-3" style={{ opacity: 0.4 }}></i>
                                                <h5 style={{ color: theme.text }}>No jobs found</h5>
                                                <p>Click "Add New Job" to create your first job posting.</p>
                                            </td></tr>
                                        ) : jobs.map(job => (
                                            <tr key={job.id} style={{ color: theme.text, borderBottom: `1px solid ${theme.border}`, opacity: job.status ? 1 : 0.7 }}>
                                                <td style={{ padding: '12px 16px', fontWeight: 600 }}>#{String(job.id).padStart(3, '0')}</td>
                                                <td style={{ padding: '12px 16px' }}><strong>{job.title}</strong></td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <span style={{ border: `1px solid ${theme.text}`, color: theme.text, padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                                        {job.category}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>{job.type}</td>
                                                <td style={{ padding: '12px 16px' }}>{job.locations}</td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <button
                                                        onClick={() => handleToggleStatus(job)}
                                                        disabled={togglingId === job.id}
                                                        style={{
                                                            padding: '5px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 600,
                                                            border: `1px solid ${theme.text}`, cursor: 'pointer', whiteSpace: 'nowrap',
                                                            backgroundColor: job.status ? accent : 'transparent',
                                                            color: job.status ? accentOn : theme.text
                                                        }}
                                                    >
                                                        {togglingId === job.id ? (
                                                            <span className="spinner-border spinner-border-sm"></span>
                                                        ) : (
                                                            <>
                                                                <i className={`bi ${job.status ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-1`}></i>
                                                                {job.status ? 'Active' : 'Inactive'}
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <div className="btn-group btn-group-sm">
                                                        <button className="btn btn-outline-dark" onClick={() => openEditModal(job)} title="Edit Job"><i className="bi bi-pencil"></i></button>
                                                        <button className="btn btn-outline-dark" onClick={() => { setSelectedJob(job); setActiveModal('delete'); }} title="Delete Job"><i className="bi bi-trash"></i></button>
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
                <form onSubmit={handleAddJob} noValidate>
                    <Modal theme={theme} title="Add New Job" icon="bi-plus-circle" onClose={closeModal} wide
                        footer={<>
                            <button type="button" className="btn btn-outline-dark" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn" style={{ backgroundColor: accent, color: accentOn, border: 'none' }} disabled={loading}>
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
                <form onSubmit={handleEditJob} noValidate>
                    <Modal theme={theme} title={`Edit Job: ${selectedJob.title}`} icon="bi-pencil-square" onClose={closeModal} wide
                        footer={<>
                            <button type="button" className="btn btn-outline-dark" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn" style={{ backgroundColor: accent, color: accentOn, border: 'none' }} disabled={loading}>
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
                <div
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
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
                        <h5 style={{ margin: '0 0 8px', fontWeight: 600 }}>Delete this job?</h5>
                        <p style={{ margin: '0 0 22px', color: theme.textLight, fontSize: '14px' }}>
                            "<strong>{selectedJob.title}</strong>" will be permanently removed. This can't be undone.
                        </p>
                        <div className="d-flex gap-2">
                            <button onClick={closeModal} disabled={loading} className="btn btn-outline-dark flex-fill">Cancel</button>
                            <button onClick={handleDeleteJob} disabled={loading} className="btn flex-fill" style={{ backgroundColor: accent, color: accentOn, border: 'none' }}>
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast.show && (
                <div style={{
                    position: 'fixed', bottom: '20px', right: '20px', zIndex: 2100,
                    padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 500,
                    backgroundColor: toast.type === 'error' ? '#b42318' : accent,
                    color: toast.type === 'error' ? '#fff' : accentOn,
                    display: 'flex', alignItems: 'center', gap: '8px', maxWidth: 'calc(100% - 40px)'
                }}>
                    <i className={`bi ${toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
                    {toast.message}
                </div>
            )}

            <style>{`
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

export default JobSettings;