import React, { useEffect, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

// ⚠️ path আপনার folder অনুযায়ী ঠিক করুন (src/Config/api.js)
import { API_BASE_URL, BACKEND_URL } from '../Config/api';

const BRAND = '#5e2e10';
const BRAND_HOVER = '#8B4513';
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE_MB = 2;

const PLACEHOLDER =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="100%" height="100%" fill="#e5e5e5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="9" fill="#888">No Image</text></svg>'
    );

// ---------- Auth headers (admin route এ token লাগে) ----------
// FormData পাঠালে Content-Type দেবেন না, browser নিজে boundary বসায়
const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    Role: localStorage.getItem('Role') || 'admin',
    Accept: 'application/json'
});

// Server HTML পাঠালেও crash করবে না
const parseJson = async (res) => {
    const text = await res.text();
    try {
        return JSON.parse(text);
    } catch {
        return {
            message:
                res.status === 413 ? 'Image is too large for the server.'
                : res.status >= 500 ? `Server error (${res.status}). Please try again.`
                : `Unexpected response (${res.status})`
        };
    }
};

const errorMessage = (body, fallback) => {
    if (body?.errors) {
        const first = Object.values(body.errors)[0];
        return Array.isArray(first) ? first[0] : String(first);
    }
    return body?.message || fallback;
};

// Backend `success` বা `status` যেটাই দিক
const isOk = (body) => body?.success === true || body?.status === true;

// আপনার backend ছবি public folder এ রাখে (storage এ না)
const getImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER;
    if (/^(https?:|data:|blob:)/i.test(imagePath)) return imagePath;
    const cleanPath = imagePath.replace(/\\/g, '/').replace(/^\/+/, '');
    return `${BACKEND_URL}/${cleanPath}`;
};

const handleImgError = (e) => {
    if (e.currentTarget.src !== PLACEHOLDER) e.currentTarget.src = PLACEHOLDER;
};

const ClubSettings = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [showModal, setShowModal] = useState(false);

    // Form
    const [clubName, setClubName] = useState('');
    const [clubHistory, setClubHistory] = useState('');
    const [clubPhone, setClubPhone] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [fileKey, setFileKey] = useState(0);

    const [clubData, setClubData] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#1a1a2e' : '#f8f9fa',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2',
        sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b',
        primary: BRAND,
        primaryGradient: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_HOVER} 100%)`
    };
    const dark = theme.isDarkMode ?? isDarkMode;

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

    // ---------- Fetch ----------
    const fetchClubInfo = async () => {
        setFetching(true);
        try {
            const res = await fetch(`${API_BASE_URL}/club-infos`, { headers: { Accept: 'application/json' } });
            const body = await parseJson(res);
            if (!res.ok) throw new Error(errorMessage(body, 'Failed to load club info'));
            const list = Array.isArray(body.data) ? body.data : body.data ? [body.data] : [];
            setClubData(isOk(body) ? list : []);
        } catch (error) {
            console.error(error);
            showToast(error.message, 'error');
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => { fetchClubInfo(); }, []);

    // ESC চাপলে modal বন্ধ
    useEffect(() => {
        if (!showModal) return;
        const onKey = (e) => e.key === 'Escape' && closeModal();
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [showModal, loading]);

    // ---------- Form helpers ----------
    const resetForm = () => {
        setClubName('');
        setClubHistory('');
        setClubPhone('');
        setImage(null);
        setImagePreview(null);
        setIsEdit(false);
        setEditId(null);
        setFileKey((k) => k + 1);
    };

    const closeModal = () => {
        if (loading) return;
        setShowModal(false);
        resetForm();
    };

    const openAddModal = () => { resetForm(); setShowModal(true); };

    const handleEdit = (club) => {
        resetForm();
        setClubName(club.club_name || '');
        setClubHistory(club.club_history || '');
        setClubPhone(club.club_phone || '');
        setImagePreview(club.image ? getImageUrl(club.image) : null);
        setEditId(club.id);
        setIsEdit(true);
        setShowModal(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!ALLOWED_TYPES.includes(file.type)) {
            e.target.value = '';
            return showToast('Only JPG, PNG, GIF and WEBP files are allowed', 'error');
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            e.target.value = '';
            return showToast(`Image must be less than ${MAX_SIZE_MB}MB`, 'error');
        }
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    // ---------- Submit ----------
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hasToken()) return;

        const name = clubName.trim();
        const phone = clubPhone.trim();
        const history = clubHistory.trim();
        if (!name || !phone || !history) return showToast('Please fill in all required fields', 'error');
        if (!isEdit && !image) return showToast('Please select a club image', 'error');

        const formData = new FormData();
        formData.append('club_name', name);
        formData.append('club_history', history);
        formData.append('club_phone', phone);
        if (image) formData.append('image', image);
        if (isEdit && editId) formData.append('id', editId);

        setLoading(true);
        try {
            const url = isEdit
                ? `${API_BASE_URL}/edit-club-infos/${editId}`
                : `${API_BASE_URL}/club-infos`;

            const res = await fetch(url, {
                method: 'POST',
                headers: authHeaders(),
                body: formData
            });
            if (handleAuthStatus(res)) return;

            const body = await parseJson(res);
            if (!res.ok || !isOk(body)) throw new Error(errorMessage(body, 'Failed to save club info'));

            showToast(body.message || (isEdit ? 'Club updated successfully' : 'Club added successfully'));
            setShowModal(false);
            resetForm();
            fetchClubInfo();
        } catch (error) {
            console.error(error);
            showToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    // ---------- Delete ----------
    const confirmDelete = async () => {
        if (!deleteTarget || !hasToken()) return;
        setDeleting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/del-club-infos/${deleteTarget.id}`, {
                method: 'DELETE',
                headers: authHeaders()
            });
            if (handleAuthStatus(res)) return;

            const body = await parseJson(res);
            if (!res.ok || !isOk(body)) throw new Error(errorMessage(body, 'Delete failed'));

            showToast(body.message || 'Club deleted successfully');
            fetchClubInfo();
        } catch (error) {
            console.error(error);
            showToast(error.message, 'error');
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    };

    // Hover handlers
    const handleButtonHover = (e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(94, 46, 16, 0.4)';
    };
    const handleButtonLeave = (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(94, 46, 16, 0.3)';
    };

    const inputStyle = { backgroundColor: dark ? '#1f293d' : '#fff', color: theme.text, borderColor: theme.border };

    const styles = {
        container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
        mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
        contentScroll: { flex: '1 0 auto', padding: '24px' },
        footerWrapper: { flexShrink: 0 },
        card: {
            backgroundColor: theme.card, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: `1px solid ${theme.border}`, padding: '24px'
        },
        button: {
            background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_HOVER} 100%)`, color: '#fff',
            border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600',
            transition: 'all 0.3s ease', boxShadow: '0 4px 6px rgba(94, 46, 16, 0.3)'
        },
        th: {
            backgroundColor: dark ? '#1f293d' : '#f6f9fc', color: theme.text, fontWeight: '600',
            borderBottom: `2px solid ${theme.border}`, padding: '15px', whiteSpace: 'nowrap'
        },
        td: { color: theme.text, borderBottom: `1px solid ${theme.border}`, padding: '15px', verticalAlign: 'middle' },
        modalOverlay: {
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050,
            backdropFilter: 'blur(4px)', padding: '16px'
        },
        modalContent: {
            backgroundColor: theme.card, color: theme.text, borderRadius: '16px', width: '100%',
            maxWidth: '550px', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)', border: `1px solid ${theme.border}`,
            animation: 'fadeIn 0.3s ease-in-out'
        }
    };

    return (
        <div style={styles.container} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="club" />

                <div style={styles.mainArea} className="flex-grow-1">
                    <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

                    <div style={styles.contentContainer}>
                        <div style={styles.contentScroll}>
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                                <h4 style={{ color: theme.text, fontWeight: '700', margin: 0 }}>Club Settings</h4>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn"
                                        onClick={fetchClubInfo}
                                        disabled={fetching}
                                        title="Refresh"
                                        style={{ border: `1px solid ${theme.border}`, color: theme.text }}
                                    >
                                        <i className="bi bi-arrow-clockwise"></i>
                                    </button>
                                    {!fetching && clubData.length === 0 && (
                                        <button
                                            style={styles.button}
                                            onClick={openAddModal}
                                            className="btn d-flex align-items-center gap-2"
                                            onMouseEnter={handleButtonHover}
                                            onMouseLeave={handleButtonLeave}
                                        >
                                            <i className="bi bi-plus-circle"></i> Add Club
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div style={styles.card}>
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th style={styles.th}>Image</th>
                                                <th style={styles.th}>Club Name</th>
                                                <th style={styles.th}>Phone</th>
                                                <th style={styles.th}>History</th>
                                                <th style={styles.th} className="text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fetching && clubData.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-5" style={{ ...styles.td, borderBottom: 'none' }}>
                                                        <div className="spinner-border" style={{ color: BRAND }} role="status"></div>
                                                        <div className="mt-2">Loading...</div>
                                                    </td>
                                                </tr>
                                            ) : clubData.length > 0 ? (
                                                clubData.map((club) => (
                                                    <tr key={club.id}>
                                                        <td style={styles.td}>
                                                            <img
                                                                src={getImageUrl(club.image)}
                                                                alt={club.club_name}
                                                                width="60"
                                                                height="60"
                                                                style={{ objectFit: 'cover', borderRadius: '8px' }}
                                                                onError={handleImgError}
                                                            />
                                                        </td>
                                                        <td style={styles.td}><strong>{club.club_name}</strong></td>
                                                        <td style={{ ...styles.td, whiteSpace: 'nowrap' }}>{club.club_phone}</td>
                                                        <td style={styles.td}>
                                                            <div
                                                                style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                                title={club.club_history}
                                                            >
                                                                {club.club_history}
                                                            </div>
                                                        </td>
                                                        <td style={{ ...styles.td, whiteSpace: 'nowrap' }} className="text-end">
                                                            <button
                                                                className="btn btn-sm btn-outline-secondary me-2"
                                                                onClick={() => handleEdit(club)}
                                                                title="Edit"
                                                                style={{ borderColor: theme.border, color: theme.text }}
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => setDeleteTarget(club)}
                                                                title="Delete"
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-5" style={{ color: theme.text }}>
                                                        No Club Information Found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div style={styles.footerWrapper}>
                            <Footer theme={theme} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Add / Edit Modal */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && closeModal()}>
                    <div style={styles.modalContent} className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4 pb-2" style={{ borderBottom: `1px solid ${theme.border}` }}>
                            <h5 className="modal-title fw-bold m-0" style={{ color: theme.text }}>
                                {isEdit ? 'Edit Club Info' : 'Add New Club Info'}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                style={{ filter: dark ? 'invert(1)' : 'none' }}
                                onClick={closeModal}
                                disabled={loading}
                            ></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold small" style={{ color: theme.text }}>Club Name <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter club name"
                                    value={clubName}
                                    onChange={(e) => setClubName(e.target.value)}
                                    maxLength={255}
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold small" style={{ color: theme.text }}>Club Phone <span className="text-danger">*</span></label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    placeholder="Enter club phone number"
                                    value={clubPhone}
                                    onChange={(e) => setClubPhone(e.target.value)}
                                    maxLength={50}
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold small" style={{ color: theme.text }}>
                                    Club Image {isEdit ? '(Leave empty to keep current image)' : <span className="text-danger">*</span>}
                                </label>
                                <input
                                    key={fileKey}
                                    type="file"
                                    className="form-control"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    onChange={handleImageChange}
                                    required={!isEdit}
                                    style={inputStyle}
                                />
                                <div className="small mt-1" style={{ color: theme.text, opacity: 0.6 }}>
                                    JPG, PNG, GIF or WEBP · Max {MAX_SIZE_MB}MB
                                </div>
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        onError={handleImgError}
                                        style={{ marginTop: '10px', width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '10px', border: `1px solid ${theme.border}` }}
                                    />
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold small" style={{ color: theme.text }}>Club History <span className="text-danger">*</span></label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="Write about club history..."
                                    value={clubHistory}
                                    onChange={(e) => setClubHistory(e.target.value)}
                                    required
                                    style={inputStyle}
                                ></textarea>
                            </div>

                            <div className="d-flex justify-content-end gap-2 pt-3" style={{ borderTop: `1px solid ${theme.border}` }}>
                                <button
                                    type="button"
                                    className="btn px-4"
                                    onClick={closeModal}
                                    disabled={loading}
                                    style={{ backgroundColor: theme.border, color: theme.text, border: 'none' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
                                    className="btn px-4"
                                    disabled={loading}
                                    onMouseEnter={handleButtonHover}
                                    onMouseLeave={handleButtonLeave}
                                >
                                    {loading
                                        ? <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</>
                                        : (isEdit ? 'Update Club' : 'Save Club')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteTarget && (
                <div style={{ ...styles.modalOverlay, zIndex: 2000 }} onClick={(e) => e.target === e.currentTarget && !deleting && setDeleteTarget(null)}>
                    <div style={{ ...styles.modalContent, maxWidth: '380px', padding: '28px 26px', textAlign: 'center' }}>
                        <div style={{
                            width: '50px', height: '50px', borderRadius: '50%', margin: '0 auto 16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: 'rgba(220,53,69,0.1)', color: '#dc3545', fontSize: '22px'
                        }}>
                            <i className="bi bi-trash"></i>
                        </div>
                        <h5 style={{ margin: '0 0 8px', fontWeight: 700 }}>Delete this club?</h5>
                        <p style={{ margin: '0 0 22px', opacity: 0.75, fontSize: '14px' }}>
                            "<strong>{deleteTarget.club_name}</strong>" will be permanently removed.
                        </p>
                        <div className="d-flex gap-2">
                            <button
                                className="btn flex-fill"
                                onClick={() => setDeleteTarget(null)}
                                disabled={deleting}
                                style={{ backgroundColor: theme.border, color: theme.text, border: 'none' }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn flex-fill"
                                onClick={confirmDelete}
                                disabled={deleting}
                                style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none' }}
                            >
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
                    backgroundColor: toast.type === 'error' ? '#b42318' : BRAND, color: '#fff',
                    display: 'flex', alignItems: 'center', gap: '8px', maxWidth: 'calc(100% - 40px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                }}>
                    <i className={`bi ${toast.type === 'error' ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'}`}></i>
                    {toast.message}
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                .form-control:focus { border-color: ${BRAND} !important; box-shadow: 0 0 0 3px rgba(94,46,16,0.15) !important; }
            `}</style>
        </div>
    );
};

export default ClubSettings;