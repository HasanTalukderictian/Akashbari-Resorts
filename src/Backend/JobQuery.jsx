import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

// ⚠️ path আপনার folder অনুযায়ী ঠিক করুন (src/Config/api.js)
import { API_BASE_URL, BACKEND_URL } from '../Config/api';

const API_URL = API_BASE_URL;
const STORAGE_URL = `${BACKEND_URL}/storage`;

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

const formatDate = (value, opts) => {
    if (!value) return 'N/A';
    const d = new Date(value);
    return isNaN(d) ? 'N/A' : d.toLocaleString('en-US', opts);
};

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
            padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap'
        }}>
            {opt?.label || status || 'N/A'}
        </span>
    );
};

// ---------------------------------------------------------------------

const JobQuery = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedApplication, setSelectedApplication] = useState(null);

    const [activeModal, setActiveModal] = useState(null); // 'detail' | 'edit' | 'delete' | 'status' | 'pdf'
    const [pdfUrl, setPdfUrl] = useState('');
    const [formData, setFormData] = useState(EMPTY_FORM);

    const abortRef = useRef(null);

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

    const setField = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }));

    const getResumeUrl = (path) => {
        if (!path) return null;
        if (/^https?:\/\//i.test(path)) return path;
        return `${STORAGE_URL}/${path.replace(/^\/?(public\/|storage\/)?/, '')}`;
    };

    // ---------- Login check / session expired ----------
    const hasToken = () => {
        if (!localStorage.getItem('token')) {
            setError('Please login to access this page');
            setTimeout(() => { window.location.href = '/login'; }, 2000);
            return false;
        }
        return true;
    };

    const handleAuthStatus = (res) => {
        if (res.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('Role');
            setError('Session expired. Please login again.');
            setTimeout(() => { window.location.href = '/login'; }, 2000);
            return true;
        }
        if (res.status === 403) {
            setError('This account does not have admin access.');
            return true;
        }
        return false;
    };

    // ---------- List ----------
    const fetchApplications = async () => {
        if (!hasToken()) return;

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.set('search', searchTerm);
            if (statusFilter) params.set('status', statusFilter);

            const res = await fetch(`${API_URL}/applications?${params}`, {
                headers: authHeaders(),
                signal: controller.signal
            });
            if (handleAuthStatus(res)) return;

            const body = await parseJson(res);
            if (!res.ok) throw new Error(errorMessage(body, 'Failed to fetch applications'));

            const list = Array.isArray(body.data?.data) ? body.data.data : Array.isArray(body.data) ? body.data : [];
            setApplications(list.map(app => ({ ...app, job_title: app.job_title || app.job?.title || 'N/A' })));
        } catch (err) {
            if (err.name === 'AbortError') return;
            setError(err.message);
        } finally {
            if (abortRef.current === controller) setLoading(false);
        }
    };

    // টাইপ শেষ হওয়ার 400ms পরে search
    useEffect(() => {
        const t = setTimeout(() => setSearchTerm(searchInput.trim()), 400);
        return () => clearTimeout(t);
    }, [searchInput]);

    useEffect(() => {
        fetchApplications();
        return () => abortRef.current?.abort();
    }, [searchTerm, statusFilter]);

    useEffect(() => {
        if (!successMessage) return;
        const t = setTimeout(() => setSuccessMessage(''), 3000);
        return () => clearTimeout(t);
    }, [successMessage]);

    const closeModal = () => { setActiveModal(null); setSelectedApplication(null); setPdfUrl(''); };

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

    // ---------- Single ----------
    const viewApplication = async (id) => {
        if (!hasToken()) return;
        setError(null);
        try {
            const res = await fetch(`${API_URL}/applications/${id}`, { headers: authHeaders() });
            if (handleAuthStatus(res)) return;
            const body = await parseJson(res);
            if (!res.ok || !body.data) throw new Error(errorMessage(body, 'Failed to fetch application details'));

            const data = { ...body.data, job_title: body.data.job_title || body.data.job?.title || 'N/A' };
            openModal('detail', data);
        } catch (err) {
            setError(err.message);
        }
    };

    // ---------- Update / Status / Delete ----------
    const runRequest = async (url, options, successMsg) => {
        if (!hasToken()) return;
        setSaving(true);
        setError(null);
        try {
            const res = await fetch(url, options);
            if (handleAuthStatus(res)) return;
            const body = await parseJson(res);
            if (!res.ok || body.status === false) throw new Error(errorMessage(body, 'Request failed'));

            setSuccessMessage(successMsg);
            closeModal();
            fetchApplications();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateApplication = (e) => {
        e.preventDefault();
        runRequest(`${API_URL}/applications/${selectedApplication.id}`, {
            method: 'PUT',
            headers: authHeaders(true),
            body: JSON.stringify(formData)
        }, 'Application updated successfully!');
    };

    const handleUpdateStatus = () => runRequest(`${API_URL}/applications/${selectedApplication.id}/status`, {
        method: 'PATCH',
        headers: authHeaders(true),
        body: JSON.stringify({ status: formData.status })
    }, 'Status updated successfully!');

    const handleDeleteApplication = () => runRequest(`${API_URL}/applications/${selectedApplication.id}`, {
        method: 'DELETE',
        headers: authHeaders()
    }, 'Application deleted successfully!');

    // ---------- Resume ----------
    const downloadResume = (path, fileName) => {
        const url = getResumeUrl(path);
        if (!url) return setError('No resume found');
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || 'resume.pdf';
        link.target = '_blank';
        link.rel = 'noopener';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const viewPdf = (path) => {
        const url = getResumeUrl(path);
        if (!url) return setError('No resume found');
        // Word file browser এ দেখা যায় না → নতুন tab এ খুলবে
        if (!/\.pdf(\?|$)/i.test(url)) {
            window.open(url, '_blank', 'noopener');
            return;
        }
        setPdfUrl(url);
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
                                <div className="alert alert-dismissible fade show" role="alert" style={{ border: '1px solid #b42318', backgroundColor: theme.card, color: theme.text }}>
                                    <i className="bi bi-exclamation-triangle-fill me-2" style={{ color: '#b42318' }}></i>{error}
                                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                                </div>
                            )}

                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                <div>
                                    <h2 style={{ color: theme.text }}>Job Applications</h2>
                                    <p style={{ color: theme.textLight }}>Manage all job applications and inquiries</p>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <button className="btn btn-outline-dark" onClick={fetchApplications} disabled={loading} title="Refresh">
                                        <i className="bi bi-arrow-clockwise"></i>
                                    </button>
                                    <span style={{
                                        backgroundColor: accent, color: accentOn, fontSize: '14px',
                                        padding: '8px 18px', borderRadius: '999px', fontWeight: 600
                                    }}>
                                        Total: {applications.length}
                                    </span>
                                </div>
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
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                        />
                                        {searchInput && (
                                            <button className="btn btn-outline-dark" onClick={() => setSearchInput('')}>
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
                                                <th key={h} style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading && applications.length === 0 ? (
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
                                            <tr key={app.id} style={{ color: theme.text, borderBottom: `1px solid ${theme.border}`, opacity: loading ? 0.6 : 1 }}>
                                                <td style={{ padding: '12px 16px', fontWeight: 600 }}>#{String(app.id).padStart(3, '0')}</td>
                                                <td style={{ padding: '12px 16px' }}><strong>{app.full_name}</strong></td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <span style={{ border: `1px solid ${theme.border}`, color: theme.text, padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                                        {app.job_title || 'N/A'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>{app.current_company || 'N/A'}</td>
                                                <td style={{ padding: '12px 16px' }}>{app.designation || 'N/A'}</td>
                                                <td style={{ padding: '12px 16px' }}>{EXPERIENCE_LABELS[app.experience] || app.experience || 'Not specified'}</td>
                                                <td style={{ padding: '12px 16px' }}><StatusBadge status={app.status} theme={theme} /></td>
                                                <td style={{ padding: '12px 16px', fontSize: '13px', whiteSpace: 'nowrap' }}>
                                                    {formatDate(app.created_at, { year: 'numeric', month: 'short', day: 'numeric' })}
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
                        <Field label="Email" theme={theme}><a href={`mailto:${selectedApplication.email}`} style={{ color: theme.text, textDecoration: 'underline', wordBreak: 'break-all' }}>{selectedApplication.email}</a></Field>
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
                                {formatDate(selectedApplication.created_at, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* PDF */}
            {activeModal === 'pdf' && pdfUrl && (
                <Modal theme={theme} title={`Resume: ${selectedApplication?.full_name || 'Document'}`} icon="bi-file-pdf"
                    onClose={() => { setActiveModal('detail'); setPdfUrl(''); }} wide
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
                            <button type="submit" className="btn" style={{ backgroundColor: accent, color: accentOn, border: 'none' }} disabled={saving}>
                                {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Updating...</> : <><i className="bi bi-save me-2"></i>Update Application</>}
                            </button>
                        </>}
                    >
                        <div className="row g-3">
                            <Field label={<>Full Name <span className="text-danger">*</span></>} theme={theme}>
                                <input required value={formData.full_name} onChange={(e) => setField('full_name', e.target.value)} style={fieldStyle} />
                            </Field>
                            <Field label={<>Email <span className="text-danger">*</span></>} theme={theme}>
                                <input required type="email" value={formData.email} onChange={(e) => setField('email', e.target.value)} style={fieldStyle} />
                            </Field>
                            <Field label={<>Phone <span className="text-danger">*</span></>} theme={theme}>
                                <input required value={formData.phone} onChange={(e) => setField('phone', e.target.value)} style={fieldStyle} />
                            </Field>
                            <Field label="Experience" theme={theme}>
                                <select value={formData.experience} onChange={(e) => setField('experience', e.target.value)} style={fieldStyle}>
                                    <option value="">Select Experience</option>
                                    {Object.entries(EXPERIENCE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                </select>
                            </Field>
                            <Field label="Current Company" theme={theme}>
                                <input value={formData.current_company} onChange={(e) => setField('current_company', e.target.value)} style={fieldStyle} placeholder="Current company name" />
                            </Field>
                            <Field label="Designation" theme={theme}>
                                <input value={formData.designation} onChange={(e) => setField('designation', e.target.value)} style={fieldStyle} placeholder="Current designation" />
                            </Field>
                            <Field label="Notice Period" theme={theme}>
                                <select value={formData.notice_period} onChange={(e) => setField('notice_period', e.target.value)} style={fieldStyle}>
                                    <option value="">Select Notice Period</option>
                                    {Object.entries(NOTICE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                </select>
                            </Field>
                            <Field label="Status" theme={theme}>
                                <select value={formData.status} onChange={(e) => setField('status', e.target.value)} style={fieldStyle}>
                                    {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </Field>
                            <div className="col-12">
                                <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>Cover Letter</label>
                                <textarea rows="3" value={formData.cover_letter} onChange={(e) => setField('cover_letter', e.target.value)} style={{ ...fieldStyle, minHeight: '80px' }} placeholder="Cover letter or additional information..." />
                            </div>
                            <div className="col-12">
                                <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>Admin Note</label>
                                <textarea rows="2" value={formData.admin_note} onChange={(e) => setField('admin_note', e.target.value)} style={{ ...fieldStyle, minHeight: '60px' }} placeholder="Add internal notes about this application..." />
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
                        <button className="btn" style={{ backgroundColor: accent, color: accentOn, border: 'none' }} onClick={handleUpdateStatus} disabled={saving}>
                            {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Updating...</> : <><i className="bi bi-check2 me-2"></i>Update Status</>}
                        </button>
                    </>}
                >
                    <p style={{ color: theme.text, marginBottom: '16px' }}>Update status for <strong>{selectedApplication.full_name}</strong></p>
                    <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block', color: theme.text }}>Select Status</label>
                    <select value={formData.status} onChange={(e) => setField('status', e.target.value)} style={fieldStyle}>
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
                    onClick={(e) => e.target === e.currentTarget && !saving && closeModal()}
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
                            <button onClick={closeModal} disabled={saving} className="btn btn-outline-dark flex-fill">Cancel</button>
                            <button onClick={handleDeleteApplication} disabled={saving} className="btn flex-fill" style={{ backgroundColor: accent, color: accentOn, border: 'none' }}>
                                {saving ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideIn { from { transform: translateY(-24px) scale(0.96); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
                .form-control, .form-select {
                    background-color: ${theme.card} !important;
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