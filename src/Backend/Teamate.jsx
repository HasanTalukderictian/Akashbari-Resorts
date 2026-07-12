import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const Teamate = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [loading, setLoading] = useState(false);
    const [teamMembers, setTeamMembers] = useState([]);
    const [authError, setAuthError] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        designation: '',
        subtitle: '',
        image: '',
        imagePreview: null
    });

    const theme = propsTheme || {
        isDarkMode: isDarkMode,
        bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2',
        sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b',
        primary: '#5e2e10',
        primaryGradient: 'linear-gradient(135deg, #5e2e10 0%, #8B4513 100%)',
        danger: '#ef4444',
        success: '#10b981',
        warning: '#f59e0b'
    };

    // Get authentication headers
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Role': localStorage.getItem('Role') || 'admin'
        };
    };

    // Get multipart headers for file upload
    const getMultipartHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Role': localStorage.getItem('Role') || 'admin',
            'Content-Type': 'multipart/form-data'
        };
    };

    // Check authentication
    const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setAuthError("Please login to access this page");
            setTimeout(() => window.location.href = '/login', 2000);
            return false;
        }
        return true;
    };

    // =========================
    // FETCH TEAM MEMBERS WITH AUTH
    // =========================
    const fetchTeamMembers = async () => {
        if (!checkAuth()) return;
        
        try {
            setLoading(true);
            setAuthError(null);
            const headers = getAuthHeaders();
            const response = await axios.get(`${API_BASE_URL}/team-members`, { headers });
            
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                setAuthError("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }
            
            if (response.data.status === true) {
                setTeamMembers(response.data.data || []);
            } else {
                setTeamMembers([]);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                setAuthError("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
            } else {
                setAuthError("Failed to fetch team members. Please try again.");
            }
            setTeamMembers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    // =========================
    // IMAGE CHANGE
    // =========================
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    image: file,
                    imagePreview: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    // =========================
    // OPEN MODAL
    // =========================
    const openModal = (member = null) => {
        if (member) {
            setFormData({
                id: member.id,
                name: member.name,
                designation: member.designation,
                subtitle: member.subtitle || '',
                image: '',
                imagePreview: member.image
            });
            setEditingItem(member);
        } else {
            setFormData({
                id: '',
                name: '',
                designation: '',
                subtitle: '',
                image: '',
                imagePreview: null
            });
            setEditingItem(null);
        }
        setShowModal(true);
    };

    // =========================
    // CLOSE MODAL
    // =========================
    const closeModal = () => {
        setShowModal(false);
        setFormData({
            id: '',
            name: '',
            designation: '',
            subtitle: '',
            image: '',
            imagePreview: null
        });
        setEditingItem(null);
    };

    // =========================
    // SAVE TEAM MEMBER WITH AUTH
    // =========================
    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!checkAuth()) return;

        if (!formData.name || !formData.designation) {
            alert('Please fill all required fields');
            return;
        }

        try {
            setLoading(true);
            
            const payload = new FormData();
            payload.append('name', formData.name);
            payload.append('designation', formData.designation);
            payload.append('subtitle', formData.subtitle || '');

            if (formData.image instanceof File) {
                payload.append('image', formData.image);
            }

            let response;
            const headers = getMultipartHeaders();

            // UPDATE - using your edit-team-member route
            if (editingItem) {
                payload.append('_method', 'POST');
                response = await axios.post(
                    `${API_BASE_URL}/edit-team-member/${editingItem.id}`,
                    payload,
                    { headers }
                );
                
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('Role');
                    alert("Session expired. Please login again.");
                    setTimeout(() => window.location.href = '/login', 2000);
                    return;
                }
                
                if (response.data.status === true) {
                    alert('Team member updated successfully');
                    fetchTeamMembers();
                    closeModal();
                } else {
                    alert(response.data.message || 'Update failed');
                }
            } 
            // CREATE - using your add-team-member route
            else {
                response = await axios.post(
                    `${API_BASE_URL}/add-team-member`,
                    payload,
                    { headers }
                );
                
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('Role');
                    alert("Session expired. Please login again.");
                    setTimeout(() => window.location.href = '/login', 2000);
                    return;
                }
                
                if (response.data.status === true) {
                    alert('Team member created successfully');
                    fetchTeamMembers();
                    closeModal();
                } else {
                    alert(response.data.message || 'Creation failed');
                }
            }
        } catch (error) {
            console.error('Save error:', error);
            
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                alert("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
            } else if (error.response) {
                if (error.response.status === 422) {
                    const errors = error.response.data.errors;
                    if (errors) {
                        Object.keys(errors).forEach((key) => {
                            alert(`${key}: ${errors[key][0]}`);
                        });
                    } else {
                        alert('Validation error occurred');
                    }
                } else if (error.response.status === 500) {
                    alert('Server error. Please check your backend.');
                } else {
                    alert(error.response.data?.message || 'Something went wrong');
                }
            } else if (error.request) {
                alert('No response from server. Please check if backend is running.');
            } else {
                alert('Error: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // DELETE MEMBER WITH AUTH
    // =========================
    const handleDelete = async (id) => {
        if (!checkAuth()) return;
        
        const confirmDelete = window.confirm('Are you sure you want to delete this member?');
        if (!confirmDelete) return;

        try {
            setLoading(true);
            const headers = getAuthHeaders();
            const response = await axios.delete(`${API_BASE_URL}/delete-team-member/${id}`, { headers });
            
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                alert("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }
            
            if (response.data.status === true) {
                alert('Team member deleted successfully');
                fetchTeamMembers();
            } else {
                alert(response.data.message || 'Delete failed');
            }
        } catch (error) {
            console.error('Delete error:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                alert("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
            } else {
                alert(error.response?.data?.message || 'Delete failed');
            }
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // FILTER SEARCH
    // =========================
    const filteredMembers = teamMembers.filter(
        (member) =>
            member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.designation?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // =========================
    // PAGINATION
    // =========================
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    // =========================
    // STYLES
    // =========================
    const styles = {
        container: {
            backgroundColor: theme.bg,
            minHeight: '100vh',
            transition: 'all 0.3s ease'
        },
        mainArea: {
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        },
        contentContainer: {
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
        },
        contentScroll: {
            flex: '1 0 auto',
            padding: '24px'
        },
        footerWrapper: {
            flexShrink: 0
        },
        alert: {
            padding: '12px 20px',
            backgroundColor: 'rgba(94, 46, 16, 0.15)',
            color: '#5e2e10',
            borderRadius: '8px',
            marginBottom: '20px',
            fontWeight: '500'
        },
        tableWrapper: {
            backgroundColor: theme.card,
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '20px'
        },
        headerSection: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '15px'
        },
        pageTitle: {
            fontSize: '24px',
            fontWeight: '700',
            color: theme.text,
            margin: 0
        },
        addButton: {
            background: theme.primaryGradient,
            color: 'white',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(94, 46, 16, 0.3)'
        },
        searchBox: {
            padding: '10px 15px',
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.bg,
            color: theme.text,
            width: '250px',
            fontSize: '14px',
            outline: 'none'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        th: {
            textAlign: 'left',
            padding: '12px',
            borderBottom: `2px solid ${theme.border}`,
            color: theme.text,
            fontWeight: '600'
        },
        td: {
            padding: '12px',
            borderBottom: `1px solid ${theme.border}`,
            color: theme.text
        },
        memberImage: {
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            objectFit: 'cover'
        },
        actionButtons: {
            display: 'flex',
            gap: '8px'
        },
        editBtn: {
            padding: '6px 12px',
            backgroundColor: '#5e2e10',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.3s ease'
        },
        deleteBtn: {
            padding: '6px 12px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.3s ease'
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
        },
        modal: {
            backgroundColor: theme.card,
            borderRadius: '16px',
            width: '500px',
            maxWidth: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
        },
        modalHeader: {
            padding: '20px',
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        modalBody: {
            padding: '20px'
        },
        modalFooter: {
            padding: '20px',
            borderTop: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px'
        },
        input: {
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.bg,
            color: theme.text,
            marginBottom: '15px',
            fontSize: '14px',
            outline: 'none'
        },
        imagePreview: {
            width: '100%',
            height: '150px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '10px'
        },
        loadingSpinner: {
            textAlign: 'center',
            padding: '40px',
            color: theme.text
        },
        disabledBtn: {
            opacity: 0.6,
            cursor: 'not-allowed'
        }
    };

    // Hover handlers
    const handleButtonHover = (e, color) => {
        e.currentTarget.style.backgroundColor = color;
        e.currentTarget.style.transform = 'translateY(-2px)';
    };

    const handleButtonLeave = (e, color) => {
        e.currentTarget.style.backgroundColor = color;
        e.currentTarget.style.transform = 'translateY(0)';
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
                            <div style={styles.tableWrapper}>
                                <div style={styles.headerSection}>
                                    <h2 style={styles.pageTitle}>👥 Team Members</h2>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input
                                            type="text"
                                            placeholder="🔍 Search..."
                                            style={styles.searchBox}
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                        />
                                        <button 
                                            style={styles.addButton} 
                                            onClick={() => openModal()}
                                            disabled={loading}
                                            onMouseEnter={(e) => handleButtonHover(e, '#8B4513')}
                                            onMouseLeave={(e) => handleButtonLeave(e, '#5e2e10')}
                                        >
                                            ➕ Add Member
                                        </button>
                                    </div>
                                </div>

                                {/* Auth Error Display */}
                                {authError && (
                                    <div style={styles.alert}>
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        {authError}
                                    </div>
                                )}

                                {loading && teamMembers.length === 0 ? (
                                    <div style={styles.loadingSpinner}>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p>Loading team members...</p>
                                    </div>
                                ) : (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={styles.table}>
                                            <thead>
                                                <tr>
                                                    <th style={styles.th}>Image</th>
                                                    <th style={styles.th}>Name</th>
                                                    <th style={styles.th}>Designation</th>
                                                    <th style={styles.th}>Subtitle</th>
                                                    <th style={styles.th}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentItems.length > 0 ? (
                                                    currentItems.map((member) => (
                                                        <tr key={member.id}>
                                                            <td style={styles.td}>
                                                                <img
                                                                    src={member.image}
                                                                    alt={member.name}
                                                                    style={styles.memberImage}
                                                                    onError={(e) => {
                                                                        e.target.src = 'https://via.placeholder.com/50?text=No+Image';
                                                                    }}
                                                                />
                                                            </td>
                                                            <td style={styles.td}>
                                                                <strong>{member.name}</strong>
                                                            </td>
                                                            <td style={styles.td}>{member.designation}</td>
                                                            <td style={styles.td}>{member.subtitle}</td>
                                                            <td style={styles.td}>
                                                                <div style={styles.actionButtons}>
                                                                    <button 
                                                                        style={styles.editBtn} 
                                                                        onClick={() => openModal(member)}
                                                                        disabled={loading}
                                                                        onMouseEnter={(e) => handleButtonHover(e, '#8B4513')}
                                                                        onMouseLeave={(e) => handleButtonLeave(e, '#5e2e10')}
                                                                    >
                                                                        ✏️ Edit
                                                                    </button>
                                                                    <button 
                                                                        style={styles.deleteBtn} 
                                                                        onClick={() => handleDelete(member.id)}
                                                                        disabled={loading}
                                                                        onMouseEnter={(e) => {
                                                                            e.currentTarget.style.backgroundColor = '#c82333';
                                                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                                                        }}
                                                                        onMouseLeave={(e) => {
                                                                            e.currentTarget.style.backgroundColor = '#ef4444';
                                                                            e.currentTarget.style.transform = 'translateY(0)';
                                                                        }}
                                                                    >
                                                                        🗑️ Delete
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: theme.text }}>
                                                            📭 No team members found
                                                            <br />
                                                            <button 
                                                                style={{ ...styles.addButton, marginTop: '10px' }} 
                                                                onClick={() => openModal()}
                                                                disabled={loading}
                                                                onMouseEnter={(e) => handleButtonHover(e, '#8B4513')}
                                                                onMouseLeave={(e) => handleButtonLeave(e, '#5e2e10')}
                                                            >
                                                                Add your first team member
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
                                        <button
                                            style={{...styles.editBtn, ...(currentPage === 1 && styles.disabledBtn)}}
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1 || loading}
                                            onMouseEnter={(e) => handleButtonHover(e, '#8B4513')}
                                            onMouseLeave={(e) => handleButtonLeave(e, '#5e2e10')}
                                        >
                                            ← Previous
                                        </button>
                                        <span style={{ padding: '6px 12px', color: theme.text }}>
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            style={{...styles.editBtn, ...(currentPage === totalPages && styles.disabledBtn)}}
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages || loading}
                                            onMouseEnter={(e) => handleButtonHover(e, '#8B4513')}
                                            onMouseLeave={(e) => handleButtonLeave(e, '#5e2e10')}
                                        >
                                            Next →
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={styles.footerWrapper}>
                            <Footer theme={theme} />
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={closeModal}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <form onSubmit={handleSave}>
                            <div style={styles.modalHeader}>
                                <h3 style={{ color: theme.text, margin: 0 }}>
                                    {editingItem ? '✏️ Edit Team Member' : '➕ Add Team Member'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '22px',
                                        cursor: 'pointer',
                                        color: theme.text
                                    }}
                                >
                                    ×
                                </button>
                            </div>

                            <div style={styles.modalBody}>
                                {formData.imagePreview && (
                                    <img src={formData.imagePreview} alt="Preview" style={styles.imagePreview} />
                                )}
                                
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={styles.input}
                                    disabled={loading}
                                />
                                
                                <input
                                    type="text"
                                    placeholder="Name *"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={styles.input}
                                    required
                                    disabled={loading}
                                />
                                
                                <input
                                    type="text"
                                    placeholder="Designation *"
                                    value={formData.designation}
                                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                    style={styles.input}
                                    required
                                    disabled={loading}
                                />
                                
                                <textarea
                                    rows="4"
                                    placeholder="Subtitle / Bio"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    style={styles.input}
                                    disabled={loading}
                                />
                            </div>

                            <div style={styles.modalFooter}>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    style={{
                                        padding: '10px 20px',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        backgroundColor: '#6c757d',
                                        color: 'white'
                                    }}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    style={{...styles.addButton, ...(loading && styles.disabledBtn)}}
                                    disabled={loading}
                                    onMouseEnter={(e) => handleButtonHover(e, '#8B4513')}
                                    onMouseLeave={(e) => handleButtonLeave(e, '#5e2e10')}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            {editingItem ? 'Updating...' : 'Saving...'}
                                        </>
                                    ) : (
                                        editingItem ? 'Update' : 'Save'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Teamate;