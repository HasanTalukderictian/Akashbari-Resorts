import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const ITEMS_PER_PAGE = 5;
const MAX_IMAGE_MB = 2; // backend এর সাথে মিল (max:2048)

const EMPTY_FORM = {
    id: '', name: '', designation: '', subtitle: '',
    phone: '', email: '', department: '', company: '', team_name: '',
    serial_number: '',
    image: '', imagePreview: null
};

const TEXT_FIELDS = ['name', 'designation', 'subtitle', 'phone', 'email', 'department', 'company', 'team_name', 'serial_number'];
const SEARCH_FIELDS = ['name', 'designation', 'email', 'phone', 'department', 'company', 'team_name'];
const TABLE_HEADERS = ['Image', 'Name', 'Team / Serial', 'Department / Company', 'Contact', 'Actions'];

const AVATAR_PLACEHOLDER =
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50">
            <rect width="100%" height="100%" fill="#dcdcdc"/>
            <text x="50%" y="54%" fill="#6b6b6b" font-family="sans-serif" font-size="20"
              text-anchor="middle" dominant-baseline="middle">?</text>
        </svg>`
    );

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    Role: localStorage.getItem('Role') || 'admin',
    Accept: 'application/json'
});
const getMultipartHeaders = () => ({ ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' });

// Serial: ধনাত্মক পূর্ণসংখ্যা হলে সংখ্যা, নাহলে null
const toSerial = (value) => {
    const n = parseInt(value, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
};

const Modal = ({ theme, title, onClose, children, footer }) => (
    <div
        style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '20px', animation: 'fadeIn .2s ease'
        }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
    >
        <div style={{
            backgroundColor: theme.card, color: theme.text,
            border: `1px solid ${theme.border}`, borderRadius: '16px',
            width: '100%', maxWidth: '560px', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column', animation: 'slideUp .2s ease'
        }}>
            <div style={{
                padding: '18px 22px', borderBottom: `1px solid ${theme.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <h5 className="m-0 fw-bold">{title}</h5>
                <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '20px', color: theme.text, opacity: 0.6, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '22px', overflowY: 'auto' }}>{children}</div>
            {footer && (
                <div style={{ padding: '16px 22px', borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    {footer}
                </div>
            )}
        </div>
    </div>
);

const Teamate = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [teamFilter, setTeamFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [serialTouched, setSerialTouched] = useState(false); // হাতে serial বদলালে আর auto বসাবে না
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);

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
        width: '100%', padding: '10px 14px', borderRadius: '10px',
        border: `1px solid ${theme.border}`, backgroundColor: theme.bg,
        color: theme.text, marginBottom: '14px', fontSize: '14px', outline: 'none'
    };
    const labelStyle = { fontSize: '12px', fontWeight: 600, color: theme.textLight, marginBottom: '4px', display: 'block' };
    const pillStyle = {
        fontSize: '11px', border: `1px solid ${theme.border}`, borderRadius: '999px',
        padding: '2px 10px', display: 'inline-block', whiteSpace: 'nowrap', color: theme.text
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const checkAuth = () => {
        if (!localStorage.getItem('token')) {
            setAuthError('Please login to access this page');
            setTimeout(() => { window.location.href = '/login'; }, 2000);
            return false;
        }
        return true;
    };

    const handleAuthFailure = (setter = setAuthError) => {
        localStorage.removeItem('token');
        localStorage.removeItem('Role');
        setter('Session expired. Please login again.');
        setTimeout(() => { window.location.href = '/login'; }, 2000);
    };

    const fetchTeamMembers = async () => {
        if (!checkAuth()) return;
        setLoading(true);
        setAuthError(null);
        try {
            const res = await axios.get(`${API_BASE_URL}/team-members`, { headers: getAuthHeaders() });
            setTeamMembers(res.data.status === true ? res.data.data || [] : []);
        } catch (err) {
            console.error('Fetch error:', err);
            if (err.response?.status === 401) handleAuthFailure();
            else setAuthError('Failed to fetch team members. Please try again.');
            setTeamMembers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTeamMembers(); }, []);

    // ওই team এর পরের serial (সবচেয়ে বড় + 1)
    const nextSerialFor = (team) => {
        const name = (team || '').trim();
        if (!name) return '';
        const max = teamMembers
            .filter((m) => (m.team_name || '').trim() === name)
            .reduce((acc, m) => Math.max(acc, toSerial(m.serial_number) || 0), 0);
        return String(max + 1);
    };

    const setField = (key) => (e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }));

    // Team বদলালে (নতুন member + serial হাতে না বদলালে) পরের serial বসাও
    const handleTeamChange = (e) => {
        const value = e.target.value;
        setFormData((prev) => ({
            ...prev,
            team_name: value,
            serial_number: !editingItem && !serialTouched ? nextSerialFor(value) : prev.serial_number
        }));
    };

    const handleSerialChange = (e) => {
        setSerialTouched(true);
        setFormData((prev) => ({ ...prev, serial_number: e.target.value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
            e.target.value = '';
            return showToast(`Image size should be less than ${MAX_IMAGE_MB}MB`, 'error');
        }
        const reader = new FileReader();
        reader.onloadend = () => setFormData((prev) => ({ ...prev, image: file, imagePreview: reader.result }));
        reader.readAsDataURL(file);
    };

    const openModal = (member = null) => {
        setSerialTouched(false);
        if (member) {
            setFormData({
                id: member.id,
                name: member.name || '',
                designation: member.designation || '',
                subtitle: member.subtitle || '',
                phone: member.phone || '',
                email: member.email || '',
                department: member.department || '',
                company: member.company || '',
                team_name: member.team_name || '',
                serial_number: member.serial_number != null ? String(member.serial_number) : '',
                image: '',
                imagePreview: member.image
            });
            setEditingItem(member);
        } else {
            // নতুন member: filter এ কোনো team select করা থাকলে সেটাই default + পরের serial
            setFormData({ ...EMPTY_FORM, team_name: teamFilter, serial_number: nextSerialFor(teamFilter) });
            setEditingItem(null);
        }
        setShowModal(true);
    };

    const closeModal = () => { setShowModal(false); setFormData(EMPTY_FORM); setEditingItem(null); setSerialTouched(false); };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!checkAuth()) return;
        if (!formData.name.trim() || !formData.designation.trim()) {
            return showToast('Name and Designation are required', 'error');
        }
        if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
            return showToast('Please enter a valid email', 'error');
        }
        const serialText = String(formData.serial_number || '').trim();
        if (serialText && (!/^\d+$/.test(serialText) || toSerial(serialText) === null)) {
            return showToast('Serial No must be a whole number (1, 2, 3...)', 'error');
        }

        setLoading(true);
        const payload = new FormData();
        TEXT_FIELDS.forEach((key) => payload.append(key, String(formData[key] ?? '').trim()));
        if (formData.image instanceof File) payload.append('image', formData.image);

        try {
            const url = editingItem
                ? `${API_BASE_URL}/edit-team-member/${editingItem.id}`
                : `${API_BASE_URL}/add-team-member`;

            const res = await axios.post(url, payload, { headers: getMultipartHeaders() });
            if (res.data.status === true) {
                showToast(editingItem ? 'Team member updated successfully' : 'Team member created successfully');
                fetchTeamMembers();
                closeModal();
            } else {
                showToast(res.data.message || 'Save failed', 'error');
            }
        } catch (err) {
            console.error('Save error:', err);
            if (err.response?.status === 401) {
                handleAuthFailure((m) => showToast(m, 'error'));
            } else if (err.response?.status === 403) {
                showToast('You do not have permission to manage team members.', 'error');
            } else if (err.response?.status === 422 && err.response.data.errors) {
                const firstError = Object.values(err.response.data.errors)[0][0];
                showToast(firstError, 'error');
            } else if (err.response?.status === 429) {
                showToast('Too many requests. Please wait a moment.', 'error');
            } else if (err.response) {
                showToast(err.response.data?.message || 'Something went wrong', 'error');
            } else if (err.request) {
                showToast('No response from server. Please check if backend is running.', 'error');
            } else {
                showToast('Error: ' + err.message, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteConfirm || !checkAuth()) return;
        setDeleting(true);
        try {
            const res = await axios.delete(`${API_BASE_URL}/delete-team-member/${deleteConfirm.id}`, { headers: getAuthHeaders() });
            if (res.data.status === true) {
                showToast('Team member deleted successfully');
                fetchTeamMembers();
            } else {
                showToast(res.data.message || 'Delete failed', 'error');
            }
            setDeleteConfirm(null);
        } catch (err) {
            console.error('Delete error:', err);
            if (err.response?.status === 401) handleAuthFailure((m) => showToast(m, 'error'));
            else showToast(err.response?.data?.message || 'Delete failed', 'error');
        } finally {
            setDeleting(false);
        }
    };

    // আগে থেকে থাকা team নাম (datalist suggestion + filter dropdown এর জন্য)
    const teamNames = [...new Set(teamMembers.map((m) => m.team_name?.trim()).filter(Boolean))].sort();

    const q = searchTerm.trim().toLowerCase();
    const filteredMembers = teamMembers.filter((m) => {
        const matchesTeam = !teamFilter || m.team_name?.trim() === teamFilter;
        const matchesSearch = !q || SEARCH_FIELDS.some((k) => m[k]?.toString().toLowerCase().includes(q));
        return matchesTeam && matchesSearch;
    });
    const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
    const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = filteredMembers.slice(indexOfFirstItem, indexOfFirstItem + ITEMS_PER_PAGE);

    // delete এর পর শেষ page খালি হয়ে গেলে আগের page এ ফিরে যাও
    useEffect(() => {
        if (currentPage > 1 && currentPage > totalPages) setCurrentPage(Math.max(1, totalPages));
    }, [totalPages, currentPage]);

    const dash = <span style={{ color: theme.textLight }}>—</span>;

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="teams" />

                <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="flex-grow-1">
                    <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '24px' }}>
                            <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '20px' }}>
                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: theme.text, margin: 0 }}>
                                        Team Members
                                        <span style={{ fontSize: '13px', fontWeight: 500, color: theme.textLight, marginLeft: '8px' }}>
                                            ({filteredMembers.length})
                                        </span>
                                    </h2>
                                    <div className="d-flex gap-2 flex-wrap">
                                        <select
                                            value={teamFilter}
                                            onChange={(e) => { setTeamFilter(e.target.value); setCurrentPage(1); }}
                                            style={{ ...fieldStyle, width: '180px', marginBottom: 0 }}
                                        >
                                            <option value="">All Teams</option>
                                            {teamNames.map((t) => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <input
                                            type="text"
                                            placeholder="Search name, email, team..."
                                            value={searchTerm}
                                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                            style={{ ...fieldStyle, width: '240px', marginBottom: 0 }}
                                        />
                                        <button
                                            onClick={() => openModal()}
                                            disabled={loading}
                                            style={{ backgroundColor: accent, color: accentOn, border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                                        >
                                            <i className="bi bi-plus-lg me-2"></i>Add Member
                                        </button>
                                    </div>
                                </div>

                                {authError && (
                                    <div className="alert" role="alert" style={{ border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.text }}>
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>{authError}
                                    </div>
                                )}

                                {loading && teamMembers.length === 0 ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border" style={{ color: accent }} role="status"></div>
                                        <p className="mt-3" style={{ color: theme.textLight }}>Loading team members...</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle" style={{ color: theme.text, marginBottom: 0 }}>
                                            <thead>
                                                <tr style={{ borderBottom: `2px solid ${theme.border}` }}>
                                                    {TABLE_HEADERS.map((h) => (
                                                        <th key={h} style={{ color: theme.text, padding: '12px', whiteSpace: 'nowrap' }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentItems.length > 0 ? currentItems.map((member) => (
                                                    <tr key={member.id} style={{ borderColor: theme.border }}>
                                                        <td style={{ padding: '12px' }}>
                                                            <img
                                                                src={member.image || AVATAR_PLACEHOLDER}
                                                                alt={member.name}
                                                                style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${theme.border}` }}
                                                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = AVATAR_PLACEHOLDER; }}
                                                            />
                                                        </td>

                                                        <td style={{ padding: '12px', color: theme.text }}>
                                                            <strong>{member.name}</strong>
                                                            <div style={{ fontSize: '12px', color: theme.textLight }}>{member.designation}</div>
                                                        </td>

                                                        <td style={{ padding: '12px' }}>
                                                            {member.team_name ? <span style={pillStyle}>{member.team_name}</span> : dash}
                                                            <div style={{ fontSize: '12px', color: theme.textLight, marginTop: '4px' }}>
                                                                {toSerial(member.serial_number) ? (
                                                                    <><i className="bi bi-sort-numeric-down me-1"></i>#{member.serial_number}</>
                                                                ) : (
                                                                    'No serial'
                                                                )}
                                                            </div>
                                                        </td>

                                                        <td style={{ padding: '12px', color: theme.text, fontSize: '13px' }}>
                                                            <div>{member.department || dash}</div>
                                                            <div style={{ fontSize: '12px', color: theme.textLight }}>{member.company}</div>
                                                        </td>

                                                        <td style={{ padding: '12px', fontSize: '13px' }}>
                                                            {member.phone || member.email ? (
                                                                <>
                                                                    {member.phone && (
                                                                        <div>
                                                                            <i className="bi bi-telephone me-1"></i>
                                                                            <a href={`tel:${member.phone}`} style={{ color: theme.text, textDecoration: 'none' }}>{member.phone}</a>
                                                                        </div>
                                                                    )}
                                                                    {member.email && (
                                                                        <div>
                                                                            <i className="bi bi-envelope me-1"></i>
                                                                            <a href={`mailto:${member.email}`} style={{ color: theme.textLight, textDecoration: 'none' }}>{member.email}</a>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ) : dash}
                                                        </td>

                                                        <td style={{ padding: '12px' }}>
                                                            <div className="d-flex gap-2">
                                                                <button className="btn btn-sm btn-outline-dark" onClick={() => openModal(member)} disabled={loading}>
                                                                    <i className="bi bi-pencil me-1"></i>Edit
                                                                </button>
                                                                <button className="btn btn-sm btn-outline-dark" onClick={() => setDeleteConfirm(member)} disabled={loading}>
                                                                    <i className="bi bi-trash me-1"></i>Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan={TABLE_HEADERS.length} className="text-center py-5" style={{ color: theme.textLight }}>
                                                            <i className="bi bi-people display-4 d-block mb-3" style={{ opacity: 0.4 }}></i>
                                                            {searchTerm || teamFilter ? 'No members match your filter' : 'No team members found'}
                                                            <div className="mt-3">
                                                                {searchTerm || teamFilter ? (
                                                                    <button
                                                                        className="btn btn-outline-dark"
                                                                        onClick={() => { setSearchTerm(''); setTeamFilter(''); setCurrentPage(1); }}
                                                                    >
                                                                        Clear filters
                                                                    </button>
                                                                ) : (
                                                                    <button onClick={() => openModal()} disabled={loading} style={{ backgroundColor: accent, color: accentOn, border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                                                                        Add your first team member
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                                        <button className="btn btn-sm btn-outline-dark" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1 || loading}>
                                            ← Previous
                                        </button>
                                        <span style={{ color: theme.textLight, fontSize: '13px' }}>Page {currentPage} of {totalPages}</span>
                                        <button className="btn btn-sm btn-outline-dark" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || loading}>
                                            Next →
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Footer theme={theme} />
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <form onSubmit={handleSave}>
                    <Modal
                        theme={theme}
                        title={editingItem ? 'Edit Team Member' : 'Add Team Member'}
                        onClose={closeModal}
                        footer={<>
                            <button type="button" className="btn btn-outline-dark" onClick={closeModal} disabled={loading}>Cancel</button>
                            <button type="submit" disabled={loading} style={{ backgroundColor: accent, color: accentOn, border: 'none', padding: '10px 22px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                                {loading ? (<><span className="spinner-border spinner-border-sm me-2"></span>{editingItem ? 'Updating...' : 'Saving...'}</>) : (editingItem ? 'Update' : 'Save')}
                            </button>
                        </>}
                    >
                        {formData.imagePreview && (
                            <img src={formData.imagePreview} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px', marginBottom: '14px', border: `1px solid ${theme.border}` }} />
                        )}

                        <label style={labelStyle}>Photo (max {MAX_IMAGE_MB}MB)</label>
                        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} style={fieldStyle} disabled={loading} />

                        <div className="row g-2">
                            <div className="col-sm-6">
                                <label style={labelStyle}>Name *</label>
                                <input type="text" value={formData.name} onChange={setField('name')} style={fieldStyle} required disabled={loading} />
                            </div>
                            <div className="col-sm-6">
                                <label style={labelStyle}> Branch *</label>
                                <input type="text" value={formData.designation} onChange={setField('designation')} style={fieldStyle} required disabled={loading} />
                            </div>

                            {/* Team Name + Serial No */}
                            <div className="col-sm-8">
                                <label style={labelStyle}>Team Name</label>
                                <input
                                    type="text"
                                    list="team-name-options"
                                    placeholder="e.g. Management Team"
                                    value={formData.team_name}
                                    onChange={handleTeamChange}
                                    style={fieldStyle}
                                    maxLength={255}
                                    disabled={loading}
                                />
                                <datalist id="team-name-options">
                                    {teamNames.map((t) => <option key={t} value={t} />)}
                                </datalist>
                            </div>
                            <div className="col-sm-4">
                                <label style={labelStyle}>Serial No</label>
                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    inputMode="numeric"
                                    placeholder="1, 2, 3..."
                                    value={formData.serial_number}
                                    onChange={handleSerialChange}
                                    style={fieldStyle}
                                    disabled={loading}
                                />
                            </div>
                            <div className="col-12" style={{ marginTop: '-8px', marginBottom: '10px' }}>
                                <small style={{ color: theme.textLight, fontSize: '11px' }}>
                                    <i className="bi bi-info-circle me-1"></i>
                                    About Us page এ এই team এর member রা Serial No অনুযায়ী (1, 2, 3...) দেখাবে। খালি রাখলে পদ অনুযায়ী শেষে দেখাবে।
                                </small>
                            </div>

                            <div className="col-sm-6">
                                <label style={labelStyle}>Phone</label>
                                <input type="tel" placeholder="+8801XXXXXXXXX" value={formData.phone} onChange={setField('phone')} style={fieldStyle} maxLength={20} disabled={loading} />
                            </div>
                            <div className="col-sm-6">
                                <label style={labelStyle}>Email</label>
                                <input type="email" placeholder="name@example.com" value={formData.email} onChange={setField('email')} style={fieldStyle} disabled={loading} />
                            </div>

                            <div className="col-sm-6">
                                <label style={labelStyle}>Department</label>
                                <input type="text" placeholder="e.g. Sales, HR" value={formData.department} onChange={setField('department')} style={fieldStyle} disabled={loading} />
                            </div>
                            <div className="col-sm-6">
                                <label style={labelStyle}>Company</label>
                                <input type="text" placeholder="e.g. Akashbari Global Services" value={formData.company} onChange={setField('company')} style={fieldStyle} disabled={loading} />
                            </div>
                        </div>

                        <label style={labelStyle}>Subtitle / Bio</label>
                        <textarea rows="3" value={formData.subtitle} onChange={setField('subtitle')} style={{ ...fieldStyle, marginBottom: 0 }} disabled={loading} />
                    </Modal>
                </form>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 2000, padding: '20px', animation: 'fadeIn .2s ease'
                    }}
                    onClick={(e) => e.target === e.currentTarget && !deleting && setDeleteConfirm(null)}
                >
                    <div style={{
                        backgroundColor: theme.card, color: theme.text,
                        border: `1px solid ${theme.border}`, borderRadius: '16px',
                        width: '100%', maxWidth: '380px', padding: '28px 26px', textAlign: 'center',
                        animation: 'slideUp .2s ease'
                    }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            border: `1.5px solid ${theme.text}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px', fontSize: '20px'
                        }}>
                            <i className="bi bi-trash"></i>
                        </div>
                        <h5 style={{ margin: '0 0 8px', fontWeight: 600 }}>Delete this member?</h5>
                        <p style={{ margin: '0 0 22px', color: theme.textLight, fontSize: '14px' }}>
                            "<strong>{deleteConfirm.name}</strong>" will be permanently removed. This can't be undone.
                        </p>
                        <div className="d-flex gap-2">
                            <button onClick={() => setDeleteConfirm(null)} disabled={deleting} className="btn btn-outline-dark flex-fill">Cancel</button>
                            <button onClick={confirmDelete} disabled={deleting} className="btn flex-fill" style={{ backgroundColor: accent, color: accentOn, border: 'none' }}>
                                {deleting ? 'Deleting...' : 'Delete'}
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
                    color: toast.type === 'error' ? '#fff' : accentOn
                }}>
                    {toast.message}
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .table tbody tr:hover { background-color: ${theme.isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'} !important; }
            `}</style>
        </div>
    );
};

export default Teamate;