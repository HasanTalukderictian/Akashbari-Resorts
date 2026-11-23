import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

// ⚠️ path আপনার folder অনুযায়ী ঠিক করুন (src/Config/api.js)
import { API_BASE_URL } from '../Config/api';

const ITEMS_PER_PAGE = 10;
const STATUSES = ['New', 'Contacted', 'Closed'];

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    Role: localStorage.getItem('Role') || 'admin',
    Accept: 'application/json',
});

const formatDate = (d) =>
    d
        ? new Date(d).toLocaleString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
        })
        : '—';

const InvestQuery = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    const [viewing, setViewing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [busyId, setBusyId] = useState(null);

    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    // ---------- সাদা-কালো theme ----------
    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#0a0a0a' : '#f5f5f5',
        card: isDarkMode ? '#141414' : '#ffffff',
        text: isDarkMode ? '#f5f5f5' : '#111111',
        textLight: isDarkMode ? '#a3a3a3' : '#6b6b6b',
        border: isDarkMode ? '#2b2b2b' : '#dcdcdc',
    };
    const accent = theme.text;
    const accentOn = theme.card;
    const muted = theme.textLight || '#6b6b6b';

    const fieldStyle = {
        padding: '10px 14px', borderRadius: '10px', border: `1px solid ${theme.border}`,
        backgroundColor: theme.bg, color: theme.text, fontSize: '14px', outline: 'none',
    };

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const handleAuthFailure = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('Role');
        setPageError('Session expired. Please login again.');
        setTimeout(() => { window.location.href = '/login'; }, 2000);
    };

    const checkAuth = () => {
        if (!localStorage.getItem('token')) {
            setPageError('Please login to access this page');
            setTimeout(() => { window.location.href = '/login'; }, 2000);
            return false;
        }
        return true;
    };

    // ---------- API: সব query আনা ----------
    const fetchItems = async () => {
        if (!checkAuth()) return;
        setLoading(true);
        setPageError(null);
        try {
            const res = await axios.get(`${API_BASE_URL}/investment-applications`, { headers: getAuthHeaders() });
            setItems(res.data?.status === true ? res.data.data || [] : []);
        } catch (err) {
            console.error('Fetch error:', err);
            const status = err.response?.status;
            if (status === 401) handleAuthFailure();
            else if (status === 403) setPageError('This account does not have admin access.');
            else if (status === 404) setPageError('API route not found. Upload the latest routes/api.php to the server.');
            else setPageError('Failed to load investment queries. Please try again.');
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchItems(); }, []);

    // ---------- API: status বদল ----------
    const updateStatus = async (item, status) => {
        if (!checkAuth() || item.status === status) return;
        setBusyId(item.id);
        try {
            const res = await axios.patch(
                `${API_BASE_URL}/investment-applications/${item.id}/status`,
                { status },
                { headers: getAuthHeaders() }
            );
            if (res.data?.status === true) {
                setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, status } : x)));
                setViewing((v) => (v && v.id === item.id ? { ...v, status } : v));
                showToast(`Marked as ${status}`);
            } else {
                showToast(res.data?.message || 'Failed to update status', 'error');
            }
        } catch (err) {
            if (err.response?.status === 401) handleAuthFailure();
            else showToast(err.response?.data?.message || 'Failed to update status', 'error');
        } finally {
            setBusyId(null);
        }
    };

    // ---------- API: delete ----------
    const confirmDelete = async () => {
        if (!deleting || !checkAuth()) return;
        setBusyId(deleting.id);
        try {
            const res = await axios.delete(`${API_BASE_URL}/investment-applications/${deleting.id}`, { headers: getAuthHeaders() });
            if (res.data?.status === true) {
                setItems((prev) => prev.filter((x) => x.id !== deleting.id));
                showToast('Query deleted successfully');
                setDeleting(null);
                setViewing(null);
            } else {
                showToast(res.data?.message || 'Delete failed', 'error');
            }
        } catch (err) {
            if (err.response?.status === 401) handleAuthFailure();
            else showToast(err.response?.data?.message || 'Delete failed', 'error');
        } finally {
            setBusyId(null);
        }
    };

    // ---------- Filter + pagination ----------
    const q = searchTerm.trim().toLowerCase();
    const filtered = items.filter((x) => {
        const matchesStatus = statusFilter === 'All' || x.status === statusFilter;
        const matchesSearch = !q || ['name', 'phone', 'email', 'category', 'address', 'profession']
            .some((k) => x[k]?.toString().toLowerCase().includes(q));
        return matchesStatus && matchesSearch;
    });
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = filtered.slice(start, start + ITEMS_PER_PAGE);

    useEffect(() => {
        if (currentPage > 1 && currentPage > totalPages) setCurrentPage(Math.max(1, totalPages));
    }, [totalPages, currentPage]);

    const counts = {
        All: items.length,
        New: items.filter((x) => x.status === 'New').length,
        Contacted: items.filter((x) => x.status === 'Contacted').length,
        Closed: items.filter((x) => x.status === 'Closed').length,
    };

    // New = কালো ভরাট, Contacted = কালো border, Closed = ধূসর
    const statusPill = (status) => ({
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: 600,
        border: `1px solid ${status === 'Closed' ? theme.border : accent}`,
        backgroundColor: status === 'New' ? accent : 'transparent',
        color: status === 'New' ? accentOn : status === 'Closed' ? muted : accent,
        whiteSpace: 'nowrap',
    });

    const DetailRow = ({ label, value, href }) => (
        <div className="iq-row" style={{ borderBottom: `1px solid ${theme.border}` }}>
            <span className="iq-row-label" style={{ color: muted }}>{label}</span>
            <span className="iq-row-value" style={{ color: theme.text }}>
                {value ? (href ? <a href={href} style={{ color: theme.text }}>{value}</a> : value) : '—'}
            </span>
        </div>
    );

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} />

                <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="flex-grow-1">
                    <Header
                        theme={theme}
                        isDarkMode={isDarkMode}
                        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
                    />

                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ flex: '1 0 auto', padding: '24px' }}>
                            {/* Title */}
                            <div style={{ marginBottom: '22px' }}>
                                <h1 style={{ fontSize: '24px', fontWeight: 700, color: theme.text, margin: 0 }}>Investment Queries</h1>
                                <p style={{ color: muted, margin: '4px 0 0' }}>Applications submitted from the website investment form</p>
                            </div>

                            {pageError && (
                                <div className="alert d-flex align-items-center justify-content-between flex-wrap gap-2" role="alert"
                                    style={{ border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text }}>
                                    <span><i className="bi bi-exclamation-triangle-fill me-2"></i>{pageError}</span>
                                    <button className="btn btn-sm btn-outline-dark" onClick={fetchItems}>Try again</button>
                                </div>
                            )}

                            {/* Stats (click = filter) */}
                            <div className="row g-3 mb-4">
                                {['All', ...STATUSES].map((s) => {
                                    const active = statusFilter === s;
                                    return (
                                        <div className="col-6 col-md-3" key={s}>
                                            <div
                                                onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                                                style={{
                                                    backgroundColor: active ? accent : theme.card,
                                                    border: `1px solid ${active ? accent : theme.border}`,
                                                    borderRadius: '14px', padding: '16px 18px', cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                <div style={{ fontSize: '22px', fontWeight: 700, color: active ? accentOn : theme.text }}>{counts[s]}</div>
                                                <div style={{ fontSize: '13px', fontWeight: 500, color: active ? accentOn : muted, opacity: active ? 0.85 : 1 }}>
                                                    {s === 'All' ? 'Total Queries' : s}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Table card */}
                            <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '20px' }}>
                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                                    <input
                                        type="text"
                                        placeholder="Search name, phone, email, category..."
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                        style={{ ...fieldStyle, width: '300px', maxWidth: '100%' }}
                                    />
                                    <button className="btn btn-outline-dark btn-sm" onClick={fetchItems} disabled={loading}>
                                        <i className={`bi bi-arrow-clockwise me-1 ${loading ? 'iq-spin' : ''}`}></i> Refresh
                                    </button>
                                </div>

                                {loading && items.length === 0 ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border" style={{ color: accent }} role="status"></div>
                                        <p className="mt-3" style={{ color: muted }}>Loading queries...</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle iq-table" style={{ color: theme.text, marginBottom: 0 }}>
                                            <thead>
                                                <tr>
                                                    {['#', 'Date', 'Applicant', 'Category', 'Amount', 'Status', 'Actions'].map((h) => (
                                                        <th key={h}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentItems.length > 0 ? currentItems.map((item, idx) => (
                                                    <tr key={item.id}>
                                                        <td style={{ color: muted, fontSize: '12px' }}>{start + idx + 1}</td>
                                                        <td style={{ fontSize: '12px', color: muted, whiteSpace: 'nowrap' }}>
                                                            {formatDate(item.created_at)}
                                                        </td>
                                                        <td>
                                                            <strong>{item.name}</strong>
                                                            <div style={{ fontSize: '12px' }}>
                                                                <a href={`tel:${item.phone}`} style={{ color: muted, textDecoration: 'none' }}>
                                                                    <i className="bi bi-telephone me-1"></i>{item.phone}
                                                                </a>
                                                            </div>
                                                        </td>
                                                        <td style={{ fontSize: '13px' }}>{item.category}</td>
                                                        <td style={{ fontSize: '13px', color: muted, whiteSpace: 'nowrap' }}>{item.amount_range || '—'}</td>
                                                        <td>
                                                            <select
                                                                value={item.status}
                                                                onChange={(e) => updateStatus(item, e.target.value)}
                                                                disabled={busyId === item.id}
                                                                style={{ ...fieldStyle, padding: '6px 10px', fontSize: '12px', fontWeight: 600 }}
                                                            >
                                                                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <button className="btn btn-sm btn-outline-dark" onClick={() => setViewing(item)}>
                                                                    <i className="bi bi-eye me-1"></i>View
                                                                </button>
                                                                <button className="btn btn-sm btn-outline-dark" onClick={() => setDeleting(item)} disabled={busyId === item.id} title="Delete">
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="7" className="text-center py-5" style={{ color: muted }}>
                                                            <i className="bi bi-inbox display-4 d-block mb-3" style={{ opacity: 0.4 }}></i>
                                                            {searchTerm || statusFilter !== 'All' ? 'No queries match your filter' : 'No investment queries yet'}
                                                            {(searchTerm || statusFilter !== 'All') && (
                                                                <div className="mt-3">
                                                                    <button className="btn btn-outline-dark btn-sm" onClick={() => { setSearchTerm(''); setStatusFilter('All'); setCurrentPage(1); }}>
                                                                        Clear filters
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                                        <button className="btn btn-sm btn-outline-dark" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>← Previous</button>
                                        <span style={{ color: muted, fontSize: '13px' }}>Page {currentPage} of {totalPages}</span>
                                        <button className="btn btn-sm btn-outline-dark" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next →</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ flexShrink: 0 }}>
                            <Footer theme={theme} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------- View Modal ---------- */}
            {viewing && (
                <div className="iq-backdrop" onClick={(e) => e.target === e.currentTarget && setViewing(null)}>
                    <div className="iq-modal" style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
                        <div className="d-flex justify-content-between align-items-center" style={{ padding: '18px 22px', borderBottom: `1px solid ${theme.border}` }}>
                            <div>
                                <h5 className="m-0 fw-bold" style={{ color: theme.text }}>{viewing.name}</h5>
                                <small style={{ color: muted }}>{formatDate(viewing.created_at)}</small>
                            </div>
                            <button onClick={() => setViewing(null)} style={{ background: 'transparent', border: 'none', fontSize: '20px', color: theme.text, opacity: 0.6, cursor: 'pointer' }}>✕</button>
                        </div>

                        <div style={{ padding: '6px 22px', overflowY: 'auto' }}>
                            <DetailRow label="Phone" value={viewing.phone} href={`tel:${viewing.phone}`} />
                            <DetailRow label="Email" value={viewing.email} href={viewing.email ? `mailto:${viewing.email}` : null} />
                            <DetailRow label="Profession" value={viewing.profession} />
                            <DetailRow label="Address" value={viewing.address} />
                            <DetailRow label="Category" value={viewing.category} />
                            <DetailRow label="Investment Amount" value={viewing.amount_range} />
                            <DetailRow label="Best Time to Call" value={viewing.preferred_time} />
                            <DetailRow label="Message" value={viewing.message} />
                            <div className="iq-row">
                                <span className="iq-row-label" style={{ color: muted }}>Status</span>
                                <span style={statusPill(viewing.status)}>{viewing.status}</span>
                            </div>
                        </div>

                        <div className="d-flex flex-wrap gap-2 justify-content-end" style={{ padding: '16px 22px', borderTop: `1px solid ${theme.border}` }}>
                            <button className="btn btn-outline-dark btn-sm" onClick={() => setDeleting(viewing)}>
                                <i className="bi bi-trash me-1"></i>Delete
                            </button>
                            {STATUSES.filter((s) => s !== viewing.status).map((s) => (
                                <button
                                    key={s}
                                    className="btn btn-sm"
                                    style={{ backgroundColor: accent, color: accentOn }}
                                    onClick={() => updateStatus(viewing, s)}
                                    disabled={busyId === viewing.id}
                                >
                                    Mark as {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ---------- Delete Confirm ---------- */}
            {deleting && (
                <div className="iq-backdrop" style={{ zIndex: 2100 }} onClick={(e) => e.target === e.currentTarget && busyId !== deleting.id && setDeleting(null)}>
                    <div style={{
                        backgroundColor: theme.card, color: theme.text, border: `1px solid ${theme.border}`,
                        borderRadius: '16px', width: '100%', maxWidth: '380px', padding: '28px 26px', textAlign: 'center',
                    }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%', border: `1.5px solid ${theme.text}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '20px',
                        }}>
                            <i className="bi bi-trash"></i>
                        </div>
                        <h5 style={{ margin: '0 0 8px', fontWeight: 600 }}>Delete this query?</h5>
                        <p style={{ margin: '0 0 22px', color: muted, fontSize: '14px' }}>
                            Query from "<strong>{deleting.name}</strong>" will be permanently removed.
                        </p>
                        <div className="d-flex gap-2">
                            <button onClick={() => setDeleting(null)} disabled={busyId === deleting.id} className="btn btn-outline-dark flex-fill">Cancel</button>
                            <button onClick={confirmDelete} disabled={busyId === deleting.id} className="btn flex-fill" style={{ backgroundColor: accent, color: accentOn }}>
                                {busyId === deleting.id ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------- Toast ---------- */}
            {toast.show && (
                <div style={{
                    position: 'fixed', bottom: '20px', right: '20px', zIndex: 2200,
                    padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 500,
                    backgroundColor: toast.type === 'error' ? '#b42318' : accent,
                    color: toast.type === 'error' ? '#fff' : accentOn,
                }}>
                    {toast.message}
                </div>
            )}

            <style>{`
                .iq-table thead th {
                    color: ${theme.text};
                    background: ${theme.card};
                    border-bottom: 2px solid ${theme.border};
                    padding: 12px;
                    font-size: 13px;
                    white-space: nowrap;
                }
                .iq-table tbody td {
                    padding: 12px;
                    background: ${theme.card};
                    color: ${theme.text};
                    border-color: ${theme.border};
                }
                .iq-table tbody tr:hover td {
                    background: ${theme.isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'};
                }

                .iq-backdrop {
                    position: fixed; inset: 0; z-index: 2000;
                    background: rgba(0,0,0,0.6);
                    display: flex; align-items: center; justify-content: center;
                    padding: 20px;
                }
                .iq-modal {
                    width: 100%; max-width: 620px; max-height: 90vh;
                    border-radius: 16px;
                    display: flex; flex-direction: column;
                    box-shadow: 0 24px 60px rgba(0,0,0,0.35);
                }
                .iq-row { display: flex; gap: 12px; padding: 10px 0; align-items: flex-start; }
                .iq-row:last-child { border-bottom: none !important; }
                .iq-row-label { width: 150px; flex-shrink: 0; font-size: 13px; }
                .iq-row-value { font-size: 14px; word-break: break-word; white-space: pre-line; }

                .iq-spin { display: inline-block; animation: iq-spin 0.8s linear infinite; }
                @keyframes iq-spin { to { transform: rotate(360deg); } }

                @media (max-width: 576px) {
                    .iq-row { flex-direction: column; gap: 2px; }
                    .iq-row-label { width: auto; }
                }
            `}</style>
        </div>
    );
};

export default InvestQuery;