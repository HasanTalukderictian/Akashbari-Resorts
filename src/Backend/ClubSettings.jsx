import React, { useEffect, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const ClubSettings = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Modal state
    const [showModal, setShowModal] = useState(false);

    // Form States
    const [clubName, setClubName] = useState('');
    const [clubHistory, setClubHistory] = useState('');
    const [clubPhone, setClubPhone] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [clubData, setClubData] = useState([]); // Changed to array
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null); // Added for edit functionality

    // Environment variables
    const API_BASE_URL = import.meta.env.VITE_BASE_URL;
    const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL;

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#1a1a2e' : '#f8f9fa',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2',
        sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b',
        accent: '#5e72e4'
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    useEffect(() => {
        fetchClubInfo();
    }, []);

    // Function to get image URL
    // Function to get correct image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/60x60?text=No+Image';
        if (imagePath.startsWith('http')) return imagePath;

        // Remove leading slashes if any
        const cleanPath = imagePath.replace(/^\/+/, '');

        // Get base URL without /api for the main URL
        const baseUrl = API_URL.replace('/api', '');

        // Return the image URL directly from the base URL (not from storage folder)
        return `${baseUrl}/${cleanPath}`;
    };

    const fetchClubInfo = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/club-infos`);
            const result = await response.json();

            if (result.success && result.data) {
                setClubData(result.data); // This is an array now
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (club) => {
        setClubName(club.club_name);
        setClubHistory(club.club_history);
        setClubPhone(club.club_phone);
        setEditId(club.id);
        setIsEdit(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this club?')) {
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/del-club-infos/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );

            const result = await response.json();

            if (result.success) {
                alert(result.message);
                fetchClubInfo(); // Refresh the list
                setClubName('');
                setClubHistory('');
                setClubPhone('');
                setImage(null);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error(error);
            alert('Delete failed');
        }
    };

    // Form Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('club_name', clubName);
        formData.append('club_history', clubHistory);
        formData.append('club_phone', clubPhone);

        if (image) {
            formData.append('image', image);
        }

        if (isEdit && editId) {
            formData.append('id', editId);
        }

        try {
            const url = isEdit
                ? `${API_BASE_URL}/edit-club-infos/${editId}`
                : `${API_BASE_URL}/club-infos`;

            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                alert(result.message);
                fetchClubInfo();
                setShowModal(false);
                setIsEdit(false);
                setEditId(null);
                setClubName('');
                setClubHistory('');
                setClubPhone('');
                setImage(null);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error(error);
            alert('Server Error');
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
        mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
        contentScroll: { flex: '1 0 auto', padding: '24px' },
        footerWrapper: { flexShrink: 0 },

        card: {
            backgroundColor: theme.card,
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: `1px solid ${theme.border}`,
            padding: '24px'
        },
        button: {
            backgroundColor: '#5e72e4',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: '600',
            transition: 'all 0.2s',
            boxShadow: '0 4px 6px rgba(50,50,93,.11)'
        },
        th: {
            backgroundColor: isDarkMode ? '#1f293d' : '#f6f9fc',
            color: theme.text,
            fontWeight: '600',
            borderBottom: `2px solid ${theme.border}`,
            padding: '15px'
        },
        td: {
            color: theme.text,
            borderBottom: `1px solid ${theme.border}`,
            padding: '15px',
            verticalAlign: 'middle'
        },
        modalOverlay: {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1050,
            backdropFilter: 'blur(4px)'
        },
        modalContent: {
            backgroundColor: theme.card,
            color: theme.text,
            borderRadius: '16px',
            width: '100%',
            maxWidth: '550px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            border: `1px solid ${theme.border}`,
            animation: 'fadeIn 0.3s ease-in-out'
        }
    };

    return (
        <div style={styles.container} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="users" />

                <div style={styles.mainArea} className="flex-grow-1">
                    <Header
                        theme={theme}
                        isDarkMode={isDarkMode}
                        toggleDarkMode={toggleDarkMode}
                        toggleSidebar={toggleSidebar}
                    />

                    <div style={styles.contentContainer}>
                        <div style={styles.contentScroll}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 style={{ color: theme.text, fontWeight: '700', margin: 0 }}>Club Settings</h4>
                                {clubData.length === 0 && (
                                    <button
                                        style={styles.button}
                                        onClick={() => {
                                            setIsEdit(false);
                                            setEditId(null);
                                            setClubName('');
                                            setClubHistory('');
                                            setClubPhone('');
                                            setImage(null);
                                            setShowModal(true);
                                        }}
                                        className="btn btn-primary d-flex align-items-center gap-2"
                                    >
                                        <i className="bi bi-plus-circle"></i> Add Club
                                    </button>
                                )}
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
                                            {clubData.length > 0 ? (
                                                clubData.map((club) => (
                                                    <tr key={club.id}>
                                                        <td style={styles.td}>
                                                            {club.image && (
                                                                <img
                                                                    src={getImageUrl(club.image)}
                                                                    alt={club.club_name}
                                                                    width="60"
                                                                    height="60"
                                                                    style={{
                                                                        objectFit: 'cover',
                                                                        borderRadius: '8px'
                                                                    }}
                                                                    onError={(e) => {
                                                                        e.target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                                                                    }}
                                                                />
                                                            )}
                                                        </td>
                                                        <td style={styles.td}>
                                                            <strong>{club.club_name}</strong>
                                                        </td>
                                                        <td style={styles.td}>
                                                            {club.club_phone}
                                                        </td>
                                                        <td style={styles.td}>
                                                            <div
                                                                style={{
                                                                    maxWidth: '300px',
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis'
                                                                }}
                                                                title={club.club_history} // Show full text on hover
                                                            >
                                                                {club.club_history}
                                                            </div>
                                                        </td>
                                                        <td style={styles.td} className="text-end">
                                                            <button
                                                                className="btn btn-sm btn-outline-secondary me-2"
                                                                onClick={() => handleEdit(club)}
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDelete(club.id)}
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-5">
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

            {/* Modal Form */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent} className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4 pb-2" style={{ borderBottom: `1px solid ${theme.border}` }}>
                            <h5 className="modal-title fw-bold" style={{ color: theme.text }}>
                                {isEdit ? 'Edit Club Info' : 'Add New Club Info'}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                style={{ filter: isDarkMode ? 'invert(1)' : 'none' }}
                                onClick={() => setShowModal(false)}
                            ></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold small">Club Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter club name"
                                    value={clubName}
                                    onChange={(e) => setClubName(e.target.value)}
                                    required
                                    style={{ backgroundColor: isDarkMode ? '#1f293d' : '#fff', color: theme.text, borderColor: theme.border }}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold small">Club Phone</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter club phone number"
                                    value={clubPhone}
                                    onChange={(e) => setClubPhone(e.target.value)}
                                    required
                                    style={{ backgroundColor: isDarkMode ? '#1f293d' : '#fff', color: theme.text, borderColor: theme.border }}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold small">
                                    Club Image {isEdit && '(Leave empty to keep current image)'}
                                </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    required={!isEdit} // Not required for edit
                                    style={{ backgroundColor: isDarkMode ? '#1f293d' : '#fff', color: theme.text, borderColor: theme.border }}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold small">Club History</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="Write about club history..."
                                    value={clubHistory}
                                    onChange={(e) => setClubHistory(e.target.value)}
                                    required
                                    style={{ backgroundColor: isDarkMode ? '#1f293d' : '#fff', color: theme.text, borderColor: theme.border }}
                                ></textarea>
                            </div>

                            <div className="d-flex justify-content-end gap-2 pt-2" style={{ borderTop: `1px solid ${theme.border}` }}>
                                <button
                                    type="button"
                                    className="btn btn-light px-4"
                                    onClick={() => setShowModal(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={styles.button}
                                    className="btn btn-primary px-4"
                                    disabled={loading}
                                >
                                    {loading ? 'Submitting...' : (isEdit ? 'Update Club' : 'Save Club')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClubSettings;