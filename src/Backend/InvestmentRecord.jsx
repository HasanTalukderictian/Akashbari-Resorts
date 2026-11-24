import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

// ⚠️ path আপনার folder অনুযায়ী ঠিক করুন (src/Config/api.js)
import { API_BASE_URL } from '../Config/api';

const BRAND = '#5e2e10';
const BRAND_HOVER = '#8B4513';

const EMPTY_FORM = { title: '', desc: '' };
const EMPTY_VALUE_FORM = { member: '', revenue: '', expericence: '', amenities: '' };

// ---------- Axios instance: প্রতিটা request এ token + JSON header ----------
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: false,
    headers: { Accept: 'application/json' }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers.Role = localStorage.getItem('Role') || 'admin';
    return config;
});

// Error থেকে পড়ার মতো message
const getErrorMessage = (error, fallback) => {
    const body = error.response?.data;
    if (body?.errors) {
        const first = Object.values(body.errors)[0];
        return Array.isArray(first) ? first[0] : String(first);
    }
    if (body && typeof body === 'object' && body.message) return body.message;
    if (error.response?.status >= 500) return `Server error (${error.response.status}). Please try again.`;
    if (!error.response) return 'Network error. Please check your connection.';
    return fallback;
};

const toNumber = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
};

const InvestmentRecord = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [records, setRecords] = useState([]);
    const [valueRecords, setValueRecords] = useState([]);

    const [loadingRecords, setLoadingRecords] = useState(false);
    const [loadingValues, setLoadingValues] = useState(false);
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [showValueModal, setShowValueModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingValue, setIsEditingValue] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [currentValueId, setCurrentValueId] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [valueFormData, setValueFormData] = useState(EMPTY_VALUE_FORM);

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2',
        sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b',
        primary: BRAND
    };
    const dark = theme.isDarkMode ?? isDarkMode;

    // ---------- Login check / session expired ----------
    const hasToken = () => {
        if (!localStorage.getItem('token')) {
            Swal.fire('Login required', 'Please login to access this page', 'warning')
                .then(() => { window.location.href = '/login'; });
            return false;
        }
        return true;
    };

    // 401/403 হলে true ফেরত দেয়
    const handleAuthError = (error) => {
        const status = error.response?.status;
        if (status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('Role');
            Swal.fire('Session expired', 'Please login again.', 'warning')
                .then(() => { window.location.href = '/login'; });
            return true;
        }
        if (status === 403) {
            Swal.fire('Access denied', 'This account does not have admin access.', 'error');
            return true;
        }
        return false;
    };

    const showError = (error, fallback) => {
        console.error(fallback, error);
        if (!handleAuthError(error)) Swal.fire('Error!', getErrorMessage(error, fallback), 'error');
    };

    // ---------- Fetch ----------
    const fetchRecords = async () => {
        setLoadingRecords(true);
        try {
            const { data } = await api.get('/get-investrecord');
            setRecords(data?.status === true && Array.isArray(data.data) ? data.data : []);
        } catch (error) {
            showError(error, 'Failed to fetch records');
            setRecords([]);
        } finally {
            setLoadingRecords(false);
        }
    };

    const fetchValueRecords = async () => {
        setLoadingValues(true);
        try {
            const { data } = await api.get('/get-valuerecord');
            setValueRecords(data?.status === true && Array.isArray(data.data) ? data.data : []);
        } catch (error) {
            showError(error, 'Failed to fetch value records');
            setValueRecords([]);
        } finally {
            setLoadingValues(false);
        }
    };

    useEffect(() => {
        fetchRecords();
        fetchValueRecords();
    }, []);

    // ---------- Form handlers ----------
    const handleInputChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    const handleValueInputChange = (e) => setValueFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const resetForm = () => { setFormData(EMPTY_FORM); setIsEditing(false); setCurrentId(null); };
    const resetValueForm = () => { setValueFormData(EMPTY_VALUE_FORM); setIsEditingValue(false); setCurrentValueId(null); };

    const closeModal = () => { if (saving) return; setShowModal(false); resetForm(); };
    const closeValueModal = () => { if (saving) return; setShowValueModal(false); resetValueForm(); };

    const handleAddClick = () => { resetForm(); setShowModal(true); };
    const handleAddValueClick = () => { resetValueForm(); setShowValueModal(true); };

    const handleEditClick = (record) => {
        setIsEditing(true);
        setCurrentId(record.id);
        setFormData({ title: record.title ?? '', desc: record.desc ?? '' });
        setShowModal(true);
    };

    const handleEditValueClick = (record) => {
        setIsEditingValue(true);
        setCurrentValueId(record.id);
        setValueFormData({
            member: record.member ?? '',
            revenue: record.revenue ?? '',
            expericence: record.expericence ?? '',
            amenities: record.amenities ?? ''
        });
        setShowValueModal(true);
    };

    // ---------- Submit: Investment record ----------
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hasToken()) return;

        const payload = { title: formData.title.trim(), desc: formData.desc.trim() };
        if (!payload.title) return Swal.fire('Warning!', 'Please enter title', 'warning');
        if (!payload.desc) return Swal.fire('Warning!', 'Please enter description', 'warning');

        setSaving(true);
        try {
            const { data } = isEditing
                ? await api.post(`/edit-investrecord/${currentId}`, payload)
                : await api.post('/add-investrecord', payload);

            if (data?.status === true) {
                Swal.fire('Success!', data.message || (isEditing ? 'Record updated successfully' : 'Record added successfully'), 'success');
                setShowModal(false);
                resetForm();
                fetchRecords();
            } else {
                Swal.fire('Error!', data?.message || 'Something went wrong', 'error');
            }
        } catch (error) {
            showError(error, 'Failed to save record');
        } finally {
            setSaving(false);
        }
    };

    // ---------- Submit: Value record ----------
    const handleValueSubmit = async (e) => {
        e.preventDefault();
        if (!hasToken()) return;

        const checks = [
            ['member', 'Please enter member count'],
            ['revenue', 'Please enter revenue'],
            ['expericence', 'Please enter years of experience'],
            ['amenities', 'Please enter amenities']
        ];
        for (const [key, msg] of checks) {
            if (String(valueFormData[key]).trim() === '') return Swal.fire('Warning!', msg, 'warning');
        }

        setSaving(true);
        try {
            const { data } = isEditingValue
                ? await api.post(`/edit-valuerecord/${currentValueId}`, valueFormData)
                : await api.post('/add-valuerecord', valueFormData);

            if (data?.status === true) {
                Swal.fire('Success!', data.message || (isEditingValue ? 'Value record updated successfully' : 'Value record added successfully'), 'success');
                setShowValueModal(false);
                resetValueForm();
                fetchValueRecords();
            } else {
                Swal.fire('Error!', data?.message || 'Something went wrong', 'error');
            }
        } catch (error) {
            showError(error, 'Failed to save value record');
        } finally {
            setSaving(false);
        }
    };

    // ---------- Delete ----------
    const confirmAndDelete = async (text, url, onDone, fallback) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: BRAND,
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!'
        });
        if (!result.isConfirmed || !hasToken()) return;

        setSaving(true);
        try {
            const { data } = await api.delete(url);
            if (data?.status === true) {
                Swal.fire('Deleted!', data.message || 'Deleted successfully', 'success');
                onDone();
            } else {
                Swal.fire('Error!', data?.message || 'Failed to delete', 'error');
            }
        } catch (error) {
            showError(error, fallback);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (id, title) =>
        confirmAndDelete(`You want to delete "${title}"?`, `/del-investrecord/${id}`, fetchRecords, 'Failed to delete record');

    const handleDeleteValueClick = (id, member) =>
        confirmAndDelete(`You want to delete record with ${member} members?`, `/del-valuerecord/${id}`, fetchValueRecords, 'Failed to delete value record');

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    // Hover handlers
    const handleButtonHover = (e, color) => {
        e.currentTarget.style.backgroundColor = color;
        e.currentTarget.style.transform = 'translateY(-2px)';
    };
    const handleButtonLeave = (e, color) => {
        e.currentTarget.style.backgroundColor = color;
        e.currentTarget.style.transform = 'translateY(0)';
    };

    // Stats
    const totalMembers = valueRecords.reduce((sum, r) => sum + toNumber(r.member), 0);
    const totalRevenue = valueRecords.reduce((sum, r) => sum + toNumber(r.revenue), 0);
    const totalExperience = valueRecords.reduce((sum, r) => sum + toNumber(r.expericence), 0);
    const totalAmenities = valueRecords.reduce((sum, r) => sum + toNumber(r.amenities), 0);

    const styles = {
        container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
        mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
        contentScroll: { flex: '1 0 auto', padding: '24px' },
        footerWrapper: { flexShrink: 0 },
        splitLayout: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
        leftSection: { flex: '1', minWidth: '300px' },
        rightSection: { flex: '1', minWidth: '300px' },
        card: {
            backgroundColor: theme.card, borderRadius: '10px', padding: '20px',
            marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        },
        tableWrap: { overflowX: 'auto' },
        addBtn: {
            backgroundColor: BRAND, color: 'white', border: 'none', padding: '10px 20px',
            borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center',
            gap: '8px', fontSize: '16px', transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(94, 46, 16, 0.3)'
        },
        table: { width: '100%', borderCollapse: 'collapse', backgroundColor: theme.card, borderRadius: '10px', overflow: 'hidden' },
        th: {
            backgroundColor: dark ? '#0f3460' : '#e9ecef', color: theme.text, padding: '12px',
            textAlign: 'left', fontWeight: 'bold', borderBottom: `1px solid ${theme.border}`, whiteSpace: 'nowrap'
        },
        td: { color: theme.text, padding: '12px', borderBottom: `1px solid ${theme.border}` },
        actionsTd: { color: theme.text, padding: '12px', borderBottom: `1px solid ${theme.border}`, whiteSpace: 'nowrap' },
        editBtn: {
            backgroundColor: BRAND, color: 'white', border: 'none', padding: '6px 12px',
            borderRadius: '5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
            gap: '5px', marginRight: '8px', fontSize: '12px', transition: 'all 0.3s ease'
        },
        deleteBtn: {
            backgroundColor: '#f44336', color: 'white', border: 'none', padding: '6px 12px',
            borderRadius: '5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
            gap: '5px', fontSize: '12px', transition: 'all 0.3s ease'
        },
        modalOverlay: {
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px'
        },
        modalContent: {
            backgroundColor: theme.card, borderRadius: '10px', padding: '30px', width: '100%',
            maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto'
        },
        modalHeader: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px',
            borderBottom: `1px solid ${theme.border}`, paddingBottom: '10px'
        },
        modalTitle: { color: theme.text, fontSize: '22px', margin: 0 },
        closeBtn: {
            backgroundColor: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer',
            color: theme.text, transition: 'all 0.3s ease'
        },
        formGroup: { marginBottom: '20px' },
        label: { display: 'block', color: theme.text, marginBottom: '8px', fontWeight: 'bold' },
        input: {
            width: '100%', padding: '10px', border: `1px solid ${theme.border}`, borderRadius: '5px',
            backgroundColor: theme.bg, color: theme.text, fontSize: '14px'
        },
        textarea: {
            width: '100%', padding: '10px', border: `1px solid ${theme.border}`, borderRadius: '5px',
            backgroundColor: theme.bg, color: theme.text, fontSize: '14px', minHeight: '100px', resize: 'vertical'
        },
        submitBtn: {
            width: '100%', padding: '12px', backgroundColor: BRAND, color: 'white', border: 'none',
            borderRadius: '5px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '16px', marginTop: '10px',
            transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(94, 46, 16, 0.3)', opacity: saving ? 0.7 : 1
        },
        loadingText: { textAlign: 'center', color: theme.text, padding: '20px' },
        emptyText: { textAlign: 'center', color: theme.text, padding: '40px', fontSize: '18px' },
        headerContainer: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '0', flexWrap: 'wrap', gap: '10px'
        },
        title: { color: theme.text, margin: 0 },
        valueStats: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginTop: '20px' },
        statCard: { backgroundColor: dark ? '#1a1a2e' : '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center' },
        statValue: { fontSize: '24px', fontWeight: 'bold', color: dark ? '#d9a77f' : BRAND, marginBottom: '5px' },
        statLabel: { color: theme.text, fontSize: '14px' }
    };

    const Spinner = ({ text }) => (
        <div style={styles.loadingText}>
            <div className="spinner-border" style={{ color: BRAND }} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <div>{text}</div>
        </div>
    );

    const ActionButtons = ({ onEdit, onDelete }) => (
        <>
            <button
                onClick={onEdit}
                disabled={saving}
                style={styles.editBtn}
                title="Edit"
                onMouseEnter={(e) => handleButtonHover(e, BRAND_HOVER)}
                onMouseLeave={(e) => handleButtonLeave(e, BRAND)}
            >
                <FaEdit />
            </button>
            <button
                onClick={onDelete}
                disabled={saving}
                style={styles.deleteBtn}
                title="Delete"
                onMouseEnter={(e) => handleButtonHover(e, '#d32f2f')}
                onMouseLeave={(e) => handleButtonLeave(e, '#f44336')}
            >
                <FaTrash />
            </button>
        </>
    );

    return (
        <div style={styles.container} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="investment-record" />

                <div style={styles.mainArea} className="flex-grow-1">
                    <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

                    <div style={styles.contentContainer}>
                        <div style={styles.contentScroll}>
                            <div style={styles.splitLayout}>

                                {/* Left: Investment Records */}
                                <div style={styles.leftSection}>
                                    <div style={styles.card}>
                                        <div style={styles.headerContainer}>
                                            <h2 style={styles.title}>Investment Records</h2>
                                            <button
                                                onClick={handleAddClick}
                                                style={styles.addBtn}
                                                onMouseEnter={(e) => handleButtonHover(e, BRAND_HOVER)}
                                                onMouseLeave={(e) => handleButtonLeave(e, BRAND)}
                                            >
                                                <FaPlus /> Add New Record
                                            </button>
                                        </div>
                                    </div>

                                    {loadingRecords && records.length === 0 ? (
                                        <Spinner text="Loading records..." />
                                    ) : records.length === 0 ? (
                                        <div style={styles.emptyText}>
                                            No records found. Click "Add New Record" to get started.
                                        </div>
                                    ) : (
                                        <div style={{ ...styles.card, ...styles.tableWrap, opacity: loadingRecords ? 0.6 : 1 }}>
                                            <table style={styles.table}>
                                                <thead>
                                                    <tr>
                                                        <th style={styles.th}>ID</th>
                                                        <th style={styles.th}>Title</th>
                                                        <th style={styles.th}>Description</th>
                                                        <th style={styles.th}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {records.map((record) => (
                                                        <tr key={record.id}>
                                                            <td style={styles.td}>{record.id}</td>
                                                            <td style={styles.td}><strong>{record.title}</strong></td>
                                                            <td style={styles.td}>{record.desc}</td>
                                                            <td style={styles.actionsTd}>
                                                                <ActionButtons
                                                                    onEdit={() => handleEditClick(record)}
                                                                    onDelete={() => handleDeleteClick(record.id, record.title)}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                {/* Right: Value Records */}
                                <div style={styles.rightSection}>
                                    <div style={styles.card}>
                                        <div style={styles.headerContainer}>
                                            <h2 style={styles.title}>Value Records</h2>
                                            <button
                                                onClick={handleAddValueClick}
                                                style={styles.addBtn}
                                                onMouseEnter={(e) => handleButtonHover(e, BRAND_HOVER)}
                                                onMouseLeave={(e) => handleButtonLeave(e, BRAND)}
                                            >
                                                <FaPlus /> Add Value Record
                                            </button>
                                        </div>
                                    </div>

                                    {loadingValues && valueRecords.length === 0 ? (
                                        <Spinner text="Loading value records..." />
                                    ) : valueRecords.length === 0 ? (
                                        <div style={styles.emptyText}>
                                            No value records found. Click "Add Value Record" to get started.
                                        </div>
                                    ) : (
                                        <div style={{ ...styles.card, ...styles.tableWrap, opacity: loadingValues ? 0.6 : 1 }}>
                                            <table style={styles.table}>
                                                <thead>
                                                    <tr>
                                                        <th style={styles.th}>ID</th>
                                                        <th style={styles.th}>Member</th>
                                                        <th style={styles.th}>Revenue (%)</th>
                                                        <th style={styles.th}>Years of Experience</th>
                                                        <th style={styles.th}>Amenities</th>
                                                        <th style={styles.th}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {valueRecords.map((record) => (
                                                        <tr key={record.id}>
                                                            <td style={styles.td}>{record.id}</td>
                                                            <td style={styles.td}><strong>{record.member}</strong></td>
                                                            <td style={styles.td}>{record.revenue}%</td>
                                                            <td style={styles.td}>{record.expericence}</td>
                                                            <td style={styles.td}>{record.amenities}</td>
                                                            <td style={styles.actionsTd}>
                                                                <ActionButtons
                                                                    onEdit={() => handleEditValueClick(record)}
                                                                    onDelete={() => handleDeleteValueClick(record.id, record.member)}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* Statistics Summary */}
                                    {valueRecords.length > 0 && (
                                        <div style={styles.card}>
                                            <h3 style={{ color: theme.text, marginBottom: '15px' }}>Statistics Summary</h3>
                                            <div style={styles.valueStats}>
                                                <div style={styles.statCard}>
                                                    <div style={styles.statValue}>{totalMembers.toLocaleString()}</div>
                                                    <div style={styles.statLabel}>Total Members</div>
                                                </div>
                                                <div style={styles.statCard}>
                                                    <div style={styles.statValue}>{totalRevenue.toFixed(1)}%</div>
                                                    <div style={styles.statLabel}>Total Revenue</div>
                                                </div>
                                                <div style={styles.statCard}>
                                                    <div style={styles.statValue}>{totalExperience.toLocaleString()}</div>
                                                    <div style={styles.statLabel}>Years of Experience</div>
                                                </div>
                                                <div style={styles.statCard}>
                                                    <div style={styles.statValue}>{totalAmenities.toLocaleString()}</div>
                                                    <div style={styles.statLabel}>Total Amenities</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div style={styles.footerWrapper}>
                            <Footer theme={theme} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal: Investment Record */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={closeModal}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>{isEditing ? 'Edit Investment Record' : 'Add New Investment Record'}</h3>
                            <button type="button" onClick={closeModal} style={styles.closeBtn}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    placeholder="Enter title"
                                    maxLength={255}
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Description *</label>
                                <textarea
                                    name="desc"
                                    value={formData.desc}
                                    onChange={handleInputChange}
                                    style={styles.textarea}
                                    placeholder="Enter description"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                style={styles.submitBtn}
                                disabled={saving}
                                onMouseEnter={(e) => handleButtonHover(e, BRAND_HOVER)}
                                onMouseLeave={(e) => handleButtonLeave(e, BRAND)}
                            >
                                {saving ? 'Processing...' : (isEditing ? 'Update Record' : 'Add Record')}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Value Record */}
            {showValueModal && (
                <div style={styles.modalOverlay} onClick={closeValueModal}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>{isEditingValue ? 'Edit Value Record' : 'Add New Value Record'}</h3>
                            <button type="button" onClick={closeValueModal} style={styles.closeBtn}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleValueSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Member Count *</label>
                                <input
                                    type="number"
                                    min="0"
                                    name="member"
                                    value={valueFormData.member}
                                    onChange={handleValueInputChange}
                                    style={styles.input}
                                    placeholder="Enter member count"
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Revenue (%) *</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    name="revenue"
                                    value={valueFormData.revenue}
                                    onChange={handleValueInputChange}
                                    style={styles.input}
                                    placeholder="Enter revenue percentage"
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Years of Experience *</label>
                                <input
                                    type="number"
                                    min="0"
                                    name="expericence"
                                    value={valueFormData.expericence}
                                    onChange={handleValueInputChange}
                                    style={styles.input}
                                    placeholder="Enter years of experience"
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Amenities *</label>
                                <input
                                    type="number"
                                    min="0"
                                    name="amenities"
                                    value={valueFormData.amenities}
                                    onChange={handleValueInputChange}
                                    style={styles.input}
                                    placeholder="Enter amenities count"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                style={styles.submitBtn}
                                disabled={saving}
                                onMouseEnter={(e) => handleButtonHover(e, BRAND_HOVER)}
                                onMouseLeave={(e) => handleButtonLeave(e, BRAND)}
                            >
                                {saving ? 'Processing...' : (isEditingValue ? 'Update Value Record' : 'Add Value Record')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvestmentRecord;