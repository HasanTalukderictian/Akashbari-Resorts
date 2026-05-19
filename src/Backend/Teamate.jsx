import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

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
        primary: '#9a55ff',
        danger: '#ef4444',
        success: '#10b981',
        warning: '#f59e0b'
    };

    // =========================
    // FETCH TEAM MEMBERS
    // =========================
    const fetchTeamMembers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/team-members`);
            
            console.log('API Response:', response.data);
            
            if (response.data.status === true) {
                setTeamMembers(response.data.data || []);
            } else {
                setTeamMembers([]);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            if (error.response) {
                console.log('Error response:', error.response.data);
                alert(`Error: ${error.response.data.message || 'Failed to fetch team members'}`);
            } else {
                alert('Network error. Please check your connection.');
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
    // SAVE TEAM MEMBER (FIXED FOR YOUR ROUTES)
    // =========================
    const handleSave = async (e) => {
        e.preventDefault();

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

            // UPDATE - using your edit-team-member route
            if (editingItem) {
                response = await axios.post(
                    `${API_BASE_URL}/edit-team-member/${editingItem.id}`,
                    payload,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                
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
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                
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
            
            if (error.response) {
                console.log('Error response:', error.response.data);
                
                if (error.response.status === 422) {
                    // Validation errors
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
    // DELETE MEMBER
    // =========================
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this member?');
        if (!confirmDelete) return;

        try {
            setLoading(true);
            const response = await axios.delete(`${API_BASE_URL}/delete-team-member/${id}`);
            
            if (response.data.status === true) {
                alert('Team member deleted successfully');
                fetchTeamMembers();
            } else {
                alert(response.data.message || 'Delete failed');
            }
        } catch (error) {
            console.error('Delete error:', error);
            
            if (error.response) {
                alert(error.response.data?.message || 'Delete failed');
            } else {
                alert('Network error. Please try again.');
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
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
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
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
            gap: '4px'
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
                                        <button style={styles.addButton} onClick={() => openModal()}>
                                            ➕ Add Member
                                        </button>
                                    </div>
                                </div>

                                {loading ? (
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
                                                                    <button style={styles.editBtn} onClick={() => openModal(member)}>
                                                                        ✏️ Edit
                                                                    </button>
                                                                    <button style={styles.deleteBtn} onClick={() => handleDelete(member.id)}>
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
                                                            <button style={{ ...styles.addButton, marginTop: '10px' }} onClick={() => openModal()}>
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
                                            style={styles.editBtn}
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            ← Previous
                                        </button>
                                        <span style={{ padding: '6px 12px', color: theme.text }}>
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            style={styles.editBtn}
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
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
                                />
                                
                                <input
                                    type="text"
                                    placeholder="Name *"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={styles.input}
                                    required
                                />
                                
                                <input
                                    type="text"
                                    placeholder="Designation *"
                                    value={formData.designation}
                                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                    style={styles.input}
                                    required
                                />
                                
                                <textarea
                                    rows="4"
                                    placeholder="Subtitle / Bio"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    style={styles.input}
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
                                >
                                    Cancel
                                </button>
                                <button type="submit" style={styles.addButton}>
                                    {editingItem ? 'Update' : 'Save'}
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