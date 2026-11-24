import React, { useState, useEffect, useMemo } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

// ⚠️ path আপনার folder অনুযায়ী ঠিক করুন
import { API_BASE_URL } from '../Config/api';
import { MODULES, ROLES, normalizeRole, roleLabel, useAuthUser } from '../Config/permissions';

const EMPTY_FORM = { name: '', email: '', password: '', role: 'admin', permissions: [] };

const authHeaders = (json = false) => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    Accept: 'application/json',
    ...(json ? { 'Content-Type': 'application/json' } : {})
});

const parseJson = async (res) => {
    const text = await res.text();
    try { return JSON.parse(text); }
    catch { return { message: res.status >= 500 ? `Server error (${res.status})` : `Unexpected response (${res.status})` }; }
};

const errorMessage = (body, fallback) => {
    if (body?.errors) {
        const first = Object.values(body.errors)[0];
        return Array.isArray(first) ? first[0] : String(first);
    }
    return body?.message || fallback;
};

const moduleLabel = (key) => MODULES.find((m) => m.key === key)?.label || key;

// ---------- Small pieces (component এর বাইরে) ----------

const Modal = ({ theme, title, onClose, children, footer, width }) => (
    <div
        style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '20px', animation: 'fadeIn .2s ease'
        }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
    >
        <div style={{
            backgroundColor: theme.card, color: theme.text,
            border: `1px solid ${theme.border}`, borderRadius: '16px',
            width: '100%', maxWidth: width || '400px', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column', animation: 'slideUp .2s ease'
        }}>
            <div className="d-flex justify-content-between align-items-center" style={{ padding: '20px 25px', borderBottom: `1px solid ${theme.border}` }}>
                <h5 className="fw-bold m-0">{title}</h5>
                <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '20px', color: theme.text, opacity: 0.6, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '22px 25px', overflowY: 'auto' }}>{children}</div>
            {footer && <div className="d-flex gap-2" style={{ padding: '16px 25px', borderTop: `1px solid ${theme.border}` }}>{footer}</div>}
        </div>
    </div>
);

const RoleBadge = ({ role, theme }) => {
    const r = normalizeRole(role);
    const filled = r === 'super_admin';
    return (
        <span style={{
            border: `1px solid ${theme.text}`,
            backgroundColor: filled ? theme.text : 'transparent',
            color: filled ? theme.card : theme.text,
            opacity: r === 'visitor' ? 0.6 : 1,
            fontSize: '11px', padding: '4px 10px', borderRadius: '999px', fontWeight: 600, whiteSpace: 'nowrap'
        }}>
            {roleLabel(role)}
        </span>
    );
};

const AccessCell = ({ user, theme }) => {
    const r = normalizeRole(user.role);
    if (r === 'super_admin') return <span style={{ fontSize: '13px', fontWeight: 600 }}>All access</span>;
    if (r !== 'admin') return <span style={{ fontSize: '13px', color: theme.textLight }}>No panel access</span>;

    const mods = (user.modules || []).filter((m) => m !== 'users');
    if (mods.length === 0) return <span style={{ fontSize: '13px', color: theme.textLight }}>None</span>;

    const shown = mods.slice(0, 3);
    return (
        <div className="d-flex flex-wrap gap-1" title={mods.map(moduleLabel).join(', ')}>
            {shown.map((m) => (
                <span key={m} style={{ border: `1px solid ${theme.border}`, fontSize: '11px', padding: '2px 8px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                    {moduleLabel(m)}
                </span>
            ))}
            {mods.length > 3 && (
                <span style={{ fontSize: '11px', padding: '2px 8px', color: theme.textLight }}>+{mods.length - 3} more</span>
            )}
        </div>
    );
};

const Label = ({ children, required }) => (
    <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', display: 'block' }}>
        {children} {required && <span className="text-danger">*</span>}
    </label>
);

const ModuleChecklist = ({ theme, selected, onChange }) => {
    const toggle = (key) =>
        onChange(selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <Label required>Allowed Sections</Label>
                <div className="d-flex gap-2">
                    <button type="button" className="btn btn-sm btn-outline-dark py-0" onClick={() => onChange(MODULES.map((m) => m.key))}>Select all</button>
                    <button type="button" className="btn btn-sm btn-outline-dark py-0" onClick={() => onChange([])}>Clear</button>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '8px' }}>
                {MODULES.map((m) => {
                    const on = selected.includes(m.key);
                    return (
                        <label
                            key={m.key}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                                padding: '8px 10px', borderRadius: '8px', fontSize: '13px',
                                border: `1px solid ${on ? theme.text : theme.border}`,
                                backgroundColor: on ? (theme.isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)') : 'transparent',
                                fontWeight: on ? 600 : 400, userSelect: 'none'
                            }}
                        >
                            <input type="checkbox" checked={on} onChange={() => toggle(m.key)} style={{ accentColor: theme.text }} />
                            <i className={`bi ${m.icon}`}></i>
                            {m.label}
                        </label>
                    );
                })}
            </div>
            <small style={{ color: theme.textLight, display: 'block', marginTop: '8px' }}>
                {selected.length} of {MODULES.length} sections selected
            </small>
        </div>
    );
};

// ---------------------------------------------------------------------

const Users = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const { user: me, refresh: refreshMe } = useAuthUser();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [pageError, setPageError] = useState(null);

    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [showPassword, setShowPassword] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);

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
        width: '100%', padding: '10px 12px', borderRadius: '8px',
        border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.text, fontSize: '14px'
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3500);
    };

    const handleAuthStatus = (res) => {
        if (res.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('Role');
            setPageError('Your session has expired. Redirecting to login...');
            setTimeout(() => { window.location.href = '/login'; }, 2000);
            return true;
        }
        if (res.status === 403) {
            setPageError('Only a Super Admin can manage users.');
            return true;
        }
        return false;
    };

    // ---------- Fetch ----------
    const fetchUsers = async () => {
        setLoading(true);
        setPageError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/users`, { headers: authHeaders() });
            if (handleAuthStatus(res)) return;
            const body = await parseJson(res);
            if (!res.ok) throw new Error(errorMessage(body, 'Failed to fetch users'));
            setUsers(Array.isArray(body.data) ? body.data : Array.isArray(body) ? body : []);
        } catch (err) {
            setPageError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const filteredUsers = useMemo(() => {
        const q = search.trim().toLowerCase();
        return users.filter((u) => {
            if (roleFilter && normalizeRole(u.role) !== roleFilter) return false;
            if (!q) return true;
            return String(u.name || '').toLowerCase().includes(q) || String(u.email || '').toLowerCase().includes(q);
        });
    }, [users, search, roleFilter]);

    const counts = useMemo(() => ({
        super_admin: users.filter((u) => normalizeRole(u.role) === 'super_admin').length,
        admin: users.filter((u) => normalizeRole(u.role) === 'admin').length,
        visitor: users.filter((u) => normalizeRole(u.role) === 'visitor').length,
    }), [users]);

    // ---------- Modal ----------
    const openAdd = () => {
        setEditingUser(null);
        setFormData(EMPTY_FORM);
        setShowPassword(false);
        setShowModal(true);
    };

    const openEdit = (u) => {
        const role = normalizeRole(u.role);
        setEditingUser(u);
        setFormData({
            name: u.name || '',
            email: u.email || '',
            password: '',
            role: ROLES.some((r) => r.value === role) ? role : 'admin',
            permissions: role === 'admin' ? (u.modules || []).filter((m) => m !== 'users') : []
        });
        setShowPassword(false);
        setShowModal(true);
    };

    const closeModal = () => {
        if (saving) return;
        setShowModal(false);
        setEditingUser(null);
        setFormData(EMPTY_FORM);
    };

    const setField = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }));

    const isSelf = (u) => me && u && String(me.id) === String(u.id);

    // ---------- Save ----------
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            role: formData.role,
            permissions: formData.role === 'admin' ? formData.permissions : []
        };

        if (!payload.name) return showToast('Name is required', 'error');
        if (!/^\S+@\S+\.\S+$/.test(payload.email)) return showToast('Please enter a valid email', 'error');
        if (!editingUser && formData.password.length < 8) return showToast('Password must be at least 8 characters', 'error');
        if (editingUser && formData.password && formData.password.length < 8) return showToast('New password must be at least 8 characters', 'error');
        if (payload.role === 'admin' && payload.permissions.length === 0) return showToast('Select at least one section for this admin', 'error');

        if (formData.password) payload.password = formData.password;

        setSaving(true);
        try {
            const url = editingUser ? `${API_BASE_URL}/users/${editingUser.id}` : `${API_BASE_URL}/users`;
            const res = await fetch(url, {
                method: editingUser ? 'PUT' : 'POST',
                headers: authHeaders(true),
                body: JSON.stringify(payload)
            });
            if (handleAuthStatus(res)) return;
            const body = await parseJson(res);
            if (!res.ok || body.status === false) throw new Error(errorMessage(body, 'Failed to save user'));

            showToast(body.message || (editingUser ? 'User updated successfully' : 'User created successfully'));
            if (editingUser && isSelf(editingUser)) refreshMe();
            setShowModal(false);
            setEditingUser(null);
            setFormData(EMPTY_FORM);
            fetchUsers();
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    // ---------- Delete ----------
    const confirmDelete = async () => {
        if (!deletingUser) return;
        setDeleting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/users/${deletingUser.id}`, {
                method: 'DELETE',
                headers: authHeaders()
            });
            if (handleAuthStatus(res)) return;
            const body = await parseJson(res);
            if (!res.ok || body.status === false) throw new Error(errorMessage(body, 'Failed to delete user'));

            showToast(body.message || 'User deleted successfully');
            setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setDeleting(false);
            setDeletingUser(null);
        }
    };

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} />

                <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="flex-grow-1">
                    <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '24px', flex: 1 }}>
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                                <div>
                                    <h4 className="fw-bold m-0" style={{ color: theme.text }}>User Management</h4>
                                    <p className="m-0 mt-1" style={{ color: theme.textLight, fontSize: '14px' }}>
                                        Create admins and control which sections they can access
                                    </p>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-dark" onClick={fetchUsers} disabled={loading} title="Refresh">
                                        <i className="bi bi-arrow-clockwise"></i>
                                    </button>
                                    <button onClick={openAdd} className="btn px-3" style={{ backgroundColor: accent, color: accentOn, border: 'none' }}>
                                        <i className="bi bi-person-plus-fill me-2"></i>Add User
                                    </button>
                                </div>
                            </div>

                            {pageError && (
                                <div className="alert d-flex align-items-center" role="alert" style={{ border: '1px solid #b42318', backgroundColor: theme.card, color: theme.text }}>
                                    <i className="bi bi-exclamation-triangle-fill me-2" style={{ color: '#b42318' }}></i>{pageError}
                                </div>
                            )}

                            {/* Summary */}
                            <div className="row g-3 mb-4">
                                {[
                                    { key: 'super_admin', label: 'Super Admins', icon: 'bi-shield-fill-check' },
                                    { key: 'admin', label: 'Admins', icon: 'bi-person-gear' },
                                    { key: 'visitor', label: 'Visitors', icon: 'bi-person' },
                                ].map((s) => (
                                    <div className="col-sm-4" key={s.key}>
                                        <button
                                            type="button"
                                            onClick={() => setRoleFilter(roleFilter === s.key ? '' : s.key)}
                                            style={{
                                                width: '100%', textAlign: 'left', backgroundColor: theme.card, color: theme.text,
                                                border: `1px solid ${roleFilter === s.key ? theme.text : theme.border}`,
                                                borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px'
                                            }}
                                        >
                                            <i className={`bi ${s.icon}`} style={{ fontSize: '22px' }}></i>
                                            <div>
                                                <div style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1 }}>{counts[s.key]}</div>
                                                <div style={{ fontSize: '13px', color: theme.textLight }}>{s.label}</div>
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div style={{ backgroundColor: theme.card, borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                                <div className="p-4">
                                    <div className="row g-2 mb-3">
                                        <div className="col-md-6">
                                            <input
                                                style={fieldStyle}
                                                placeholder="Search by name or email..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <select style={fieldStyle} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                                                <option value="">All roles</option>
                                                {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle" style={{ color: theme.text, marginBottom: 0 }}>
                                            <thead>
                                                <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                                                    {['Name', 'Email', 'Role', 'Access', ''].map((h) => (
                                                        <th key={h} style={{ color: theme.text, whiteSpace: 'nowrap' }} className={h === '' ? 'text-end' : ''}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loading && users.length === 0 ? (
                                                    <tr><td colSpan="5" className="text-center py-4" style={{ color: theme.textLight }}>
                                                        <div className="spinner-border spinner-border-sm me-2"></div>Loading...
                                                    </td></tr>
                                                ) : filteredUsers.length === 0 ? (
                                                    <tr><td colSpan="5" className="text-center py-4" style={{ color: theme.textLight }}>No users found.</td></tr>
                                                ) : filteredUsers.map((u) => (
                                                    <tr key={u.id || u.email} style={{ borderColor: theme.border }}>
                                                        <td style={{ color: theme.text, fontWeight: 600 }}>
                                                            {u.name}
                                                            {isSelf(u) && (
                                                                <span style={{ fontSize: '11px', marginLeft: '6px', color: theme.textLight, fontWeight: 400 }}>(you)</span>
                                                            )}
                                                        </td>
                                                        <td style={{ color: theme.text }}>{u.email}</td>
                                                        <td><RoleBadge role={u.role} theme={theme} /></td>
                                                        <td><AccessCell user={u} theme={theme} /></td>
                                                        <td className="text-end" style={{ whiteSpace: 'nowrap' }}>
                                                            <button onClick={() => openEdit(u)} className="btn btn-sm btn-outline-dark me-2" title="Edit">
                                                                <i className="bi bi-pencil"></i>
                                                            </button>
                                                            <button
                                                                onClick={() => setDeletingUser(u)}
                                                                className="btn btn-sm btn-outline-dark"
                                                                title={isSelf(u) ? "You can't delete yourself" : 'Delete'}
                                                                disabled={isSelf(u)}
                                                            >
                                                                <i className="bi bi-trash3"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Footer theme={theme} />
                    </div>
                </div>
            </div>

            {/* Add / Edit */}
            {showModal && (
                <form onSubmit={handleSubmit} noValidate>
                    <Modal
                        theme={theme}
                        title={editingUser ? `Edit User: ${editingUser.name}` : 'Add New User'}
                        onClose={closeModal}
                        width={formData.role === 'admin' ? '720px' : '440px'}
                        footer={<>
                            <button type="button" className="btn btn-outline-dark flex-grow-1" onClick={closeModal} disabled={saving}>Cancel</button>
                            <button type="submit" className="btn flex-grow-1" disabled={saving} style={{ backgroundColor: accent, color: accentOn, border: 'none' }}>
                                {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : (editingUser ? 'Update User' : 'Create User')}
                            </button>
                        </>}
                    >
                        <div className="row g-3">
                            <div className="col-md-6">
                                <Label required>Full Name</Label>
                                <input style={fieldStyle} value={formData.name} onChange={(e) => setField('name', e.target.value)} maxLength={255} />
                            </div>
                            <div className="col-md-6">
                                <Label required>Email</Label>
                                <input type="email" style={fieldStyle} value={formData.email} onChange={(e) => setField('email', e.target.value)} maxLength={255} autoComplete="off" />
                            </div>
                            <div className="col-md-6">
                                <Label required={!editingUser}>{editingUser ? 'New Password (optional)' : 'Password'}</Label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        style={{ ...fieldStyle, paddingRight: '40px' }}
                                        value={formData.password}
                                        onChange={(e) => setField('password', e.target.value)}
                                        placeholder={editingUser ? 'Leave empty to keep current' : 'Minimum 8 characters'}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: theme.textLight }}
                                    >
                                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <Label required>Role</Label>
                                <select
                                    style={fieldStyle}
                                    value={formData.role}
                                    onChange={(e) => setField('role', e.target.value)}
                                    disabled={editingUser && isSelf(editingUser)}
                                >
                                    {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                                </select>
                                {editingUser && isSelf(editingUser) && (
                                    <small style={{ color: theme.textLight }}>You can't change your own role.</small>
                                )}
                            </div>

                            <div className="col-12">
                                {formData.role === 'super_admin' && (
                                    <div style={{ backgroundColor: theme.bg, borderRadius: '10px', padding: '12px 14px', fontSize: '13px' }}>
                                        <i className="bi bi-shield-fill-check me-2"></i>
                                        Super Admin can access <strong>every section</strong> and manage other users.
                                    </div>
                                )}
                                {formData.role === 'visitor' && (
                                    <div style={{ backgroundColor: theme.bg, borderRadius: '10px', padding: '12px 14px', fontSize: '13px' }}>
                                        <i className="bi bi-info-circle me-2"></i>
                                        Visitors can use the website (e.g. submit blogs) but <strong>cannot open the admin panel</strong>.
                                    </div>
                                )}
                                {formData.role === 'admin' && (
                                    <ModuleChecklist
                                        theme={theme}
                                        selected={formData.permissions}
                                        onChange={(list) => setField('permissions', list)}
                                    />
                                )}
                            </div>
                        </div>
                    </Modal>
                </form>
            )}

            {/* Delete */}
            {deletingUser && (
                <div
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 9999, padding: '20px', animation: 'fadeIn .2s ease'
                    }}
                    onClick={(e) => e.target === e.currentTarget && !deleting && setDeletingUser(null)}
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
                            <i className="bi bi-trash3"></i>
                        </div>
                        <h5 style={{ margin: '0 0 8px', fontWeight: 600 }}>Delete this user?</h5>
                        <p style={{ margin: '0 0 22px', color: theme.textLight, fontSize: '14px' }}>
                            "<strong>{deletingUser.name}</strong>" ({roleLabel(deletingUser.role)}) will be permanently removed and logged out everywhere.
                        </p>
                        <div className="d-flex gap-2">
                            <button onClick={() => setDeletingUser(null)} disabled={deleting} className="btn btn-outline-dark flex-fill">Cancel</button>
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
                    position: 'fixed', bottom: '20px', right: '20px', zIndex: 10000,
                    padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 500,
                    backgroundColor: toast.type === 'error' ? '#b42318' : accent,
                    color: toast.type === 'error' ? '#fff' : accentOn,
                    display: 'flex', alignItems: 'center', gap: '8px', maxWidth: 'calc(100% - 40px)'
                }}>
                    <i className={`bi ${toast.type === 'error' ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'}`}></i>
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

export default Users;