import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

const InvestmentRecord = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [records, setRecords] = useState([]);
    const [valueRecords, setValueRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showValueModal, setShowValueModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingValue, setIsEditingValue] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [currentValueId, setCurrentValueId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        desc: ''
    });
    const [valueFormData, setValueFormData] = useState({
        member: '',
        revenue: '',
        expericence: '',
        amenities: ''
    });

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2',
        sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b'
    };

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    // Configure axios defaults
    axios.defaults.withCredentials = false;
    axios.defaults.headers.common['Accept'] = 'application/json';

    // Fetch all investment records
    const fetchRecords = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/get-investrecord`);
            
            console.log('Fetch response:', response.data);
            
            if (response.data.status === true) {
                setRecords(response.data.data || []);
            } else {
                setRecords([]);
            }
        } catch (error) {
            console.error('Error fetching records:', error);
            if (error.response) {
                Swal.fire('Error!', error.response.data.message || 'Failed to fetch records', 'error');
            } else {
                Swal.fire('Error!', 'Network error. Please check your connection.', 'error');
            }
            setRecords([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all value records
    const fetchValueRecords = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/get-valuerecord`);
            
            console.log('Fetch value records response:', response.data);
            
            if (response.data.status === true) {
                setValueRecords(response.data.data || []);
            } else {
                setValueRecords([]);
            }
        } catch (error) {
            console.error('Error fetching value records:', error);
            if (error.response) {
                Swal.fire('Error!', error.response.data.message || 'Failed to fetch value records', 'error');
            } else {
                Swal.fire('Error!', 'Network error. Please check your connection.', 'error');
            }
            setValueRecords([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
        fetchValueRecords();
    }, []);

    // Handle form input change for investment records
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form input change for value records
    const handleValueInputChange = (e) => {
        setValueFormData({
            ...valueFormData,
            [e.target.name]: e.target.value
        });
    };

    // Reset investment form
    const resetForm = () => {
        setFormData({
            title: '',
            desc: ''
        });
        setIsEditing(false);
        setCurrentId(null);
    };

    // Reset value form
    const resetValueForm = () => {
        setValueFormData({
            member: '',
            revenue: '',
            expericence: '',
            amenities: ''
        });
        setIsEditingValue(false);
        setCurrentValueId(null);
    };

    // Open modal for add investment record
    const handleAddClick = () => {
        resetForm();
        setShowModal(true);
        setIsEditing(false);
    };

    // Open modal for add value record
    const handleAddValueClick = () => {
        resetValueForm();
        setShowValueModal(true);
        setIsEditingValue(false);
    };

    // Open modal for edit investment record
    const handleEditClick = (record) => {
        setIsEditing(true);
        setCurrentId(record.id);
        setFormData({
            title: record.title,
            desc: record.desc
        });
        setShowModal(true);
    };

    // Open modal for edit value record
    const handleEditValueClick = (record) => {
        setIsEditingValue(true);
        setCurrentValueId(record.id);
        setValueFormData({
            member: record.member,
            revenue: record.revenue,
            expericence: record.expericence,
            amenities: record.amenities
        });
        setShowValueModal(true);
    };

    // Submit investment record form (Add/Edit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title) {
            Swal.fire('Warning!', 'Please enter title', 'warning');
            return;
        }
        
        if (!formData.desc) {
            Swal.fire('Warning!', 'Please enter description', 'warning');
            return;
        }

        setLoading(true);

        try {
            let response;
            
            if (isEditing) {
                response = await axios.post(`${BASE_URL}/edit-investrecord/${currentId}`, formData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                response = await axios.post(`${BASE_URL}/add-investrecord`, formData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            console.log('Submit response:', response.data);

            if (response.data.status === true) {
                Swal.fire('Success!', response.data.message || (isEditing ? 'Record updated successfully' : 'Record added successfully'), 'success');
                resetForm();
                setShowModal(false);
                fetchRecords();
            } else {
                Swal.fire('Error!', response.data.message || 'Something went wrong', 'error');
            }
        } catch (error) {
            console.error('Error saving record:', error);
            if (error.response) {
                Swal.fire('Error!', error.response.data.message || 'Failed to save record', 'error');
            } else {
                Swal.fire('Error!', 'Network error. Please check your connection.', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    // Submit value record form (Add/Edit)
    const handleValueSubmit = async (e) => {
        e.preventDefault();
        
        if (!valueFormData.member) {
            Swal.fire('Warning!', 'Please enter member count', 'warning');
            return;
        }
        
        if (!valueFormData.revenue) {
            Swal.fire('Warning!', 'Please enter revenue', 'warning');
            return;
        }
        
        if (!valueFormData.expericence) {
            Swal.fire('Warning!', 'Please enter experience', 'warning');
            return;
        }
        
        if (!valueFormData.amenities) {
            Swal.fire('Warning!', 'Please enter amenities', 'warning');
            return;
        }

        setLoading(true);

        try {
            let response;
            
            if (isEditingValue) {
                response = await axios.post(`${BASE_URL}/edit-valuerecord/${currentValueId}`, valueFormData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                response = await axios.post(`${BASE_URL}/add-valuerecord`, valueFormData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            console.log('Submit value response:', response.data);

            if (response.data.status === true) {
                Swal.fire('Success!', response.data.message || (isEditingValue ? 'Value record updated successfully' : 'Value record added successfully'), 'success');
                resetValueForm();
                setShowValueModal(false);
                fetchValueRecords();
            } else {
                Swal.fire('Error!', response.data.message || 'Something went wrong', 'error');
            }
        } catch (error) {
            console.error('Error saving value record:', error);
            if (error.response) {
                Swal.fire('Error!', error.response.data.message || 'Failed to save value record', 'error');
            } else {
                Swal.fire('Error!', 'Network error. Please check your connection.', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    // Delete investment record
    const handleDeleteClick = (id, title) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete "${title}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const response = await axios.delete(`${BASE_URL}/del-investrecord/${id}`);
                    
                    console.log('Delete response:', response.data);
                    
                    if (response.data.status === true) {
                        Swal.fire('Deleted!', response.data.message || 'Record deleted successfully', 'success');
                        fetchRecords();
                    } else {
                        Swal.fire('Error!', response.data.message || 'Failed to delete', 'error');
                    }
                } catch (error) {
                    console.error('Error deleting record:', error);
                    if (error.response) {
                        Swal.fire('Error!', error.response.data.message || 'Failed to delete record', 'error');
                    } else {
                        Swal.fire('Error!', 'Network error. Please check your connection.', 'error');
                    }
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    // Delete value record
    const handleDeleteValueClick = (id, member) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete record with ${member} members?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const response = await axios.delete(`${BASE_URL}/del-valuerecord/${id}`);
                    
                    console.log('Delete value response:', response.data);
                    
                    if (response.data.status === true) {
                        Swal.fire('Deleted!', response.data.message || 'Value record deleted successfully', 'success');
                        fetchValueRecords();
                    } else {
                        Swal.fire('Error!', response.data.message || 'Failed to delete', 'error');
                    }
                } catch (error) {
                    console.error('Error deleting value record:', error);
                    if (error.response) {
                        Swal.fire('Error!', error.response.data.message || 'Failed to delete value record', 'error');
                    } else {
                        Swal.fire('Error!', 'Network error. Please check your connection.', 'error');
                    }
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const styles = {
        container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
        mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
        contentScroll: { flex: '1 0 auto', padding: '24px' },
        footerWrapper: { flexShrink: 0 },
        splitLayout: {
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap'
        },
        leftSection: {
            flex: '1',
            minWidth: '300px'
        },
        rightSection: {
            flex: '1',
            minWidth: '300px'
        },
        card: {
            backgroundColor: theme.card,
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        },
        addBtn: {
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px',
            transition: 'background-color 0.3s'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: theme.card,
            borderRadius: '10px',
            overflow: 'hidden'
        },
        th: {
            backgroundColor: isDarkMode ? '#0f3460' : '#e9ecef',
            color: theme.text,
            padding: '12px',
            textAlign: 'left',
            fontWeight: 'bold',
            borderBottom: `1px solid ${theme.border}`
        },
        td: {
            color: theme.text,
            padding: '12px',
            borderBottom: `1px solid ${theme.border}`
        },
        editBtn: {
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            marginRight: '8px',
            fontSize: '12px'
        },
        deleteBtn: {
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '12px'
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        },
        modalContent: {
            backgroundColor: theme.card,
            borderRadius: '10px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
        },
        modalHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: `1px solid ${theme.border}`,
            paddingBottom: '10px'
        },
        modalTitle: {
            color: theme.text,
            fontSize: '24px',
            margin: 0
        },
        closeBtn: {
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: theme.text
        },
        formGroup: {
            marginBottom: '20px'
        },
        label: {
            display: 'block',
            color: theme.text,
            marginBottom: '8px',
            fontWeight: 'bold'
        },
        input: {
            width: '100%',
            padding: '10px',
            border: `1px solid ${theme.border}`,
            borderRadius: '5px',
            backgroundColor: theme.bg,
            color: theme.text,
            fontSize: '14px'
        },
        textarea: {
            width: '100%',
            padding: '10px',
            border: `1px solid ${theme.border}`,
            borderRadius: '5px',
            backgroundColor: theme.bg,
            color: theme.text,
            fontSize: '14px',
            minHeight: '100px',
            resize: 'vertical'
        },
        submitBtn: {
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '10px'
        },
        loadingText: {
            textAlign: 'center',
            color: theme.text,
            padding: '20px'
        },
        emptyText: {
            textAlign: 'center',
            color: theme.text,
            padding: '40px',
            fontSize: '18px'
        },
        headerContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '10px'
        },
        title: {
            color: theme.text,
            margin: 0
        },
        valueStats: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '15px',
            marginTop: '20px'
        },
        statCard: {
            backgroundColor: isDarkMode ? '#1a1a2e' : '#f8f9fa',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center'
        },
        statValue: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#007bff',
            marginBottom: '5px'
        },
        statLabel: {
            color: theme.text,
            fontSize: '14px'
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
                            {/* Split Layout 50% - 50% */}
                            <div style={styles.splitLayout}>
                                
                                {/* Left Section: Investment Records Table */}
                                <div style={styles.leftSection}>
                                    <div style={styles.card}>
                                        <div style={styles.headerContainer}>
                                            <h2 style={styles.title}>Investment Records</h2>
                                            <button onClick={handleAddClick} style={styles.addBtn}>
                                                <FaPlus /> Add New Record
                                            </button>
                                        </div>
                                    </div>

                                    {loading && !showModal ? (
                                        <div style={styles.loadingText}>
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <div>Loading records...</div>
                                        </div>
                                    ) : records.length === 0 ? (
                                        <div style={styles.emptyText}>
                                            No records found. Click "Add New Record" to get started.
                                        </div>
                                    ) : (
                                        <div style={styles.card}>
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
                                                            <td style={styles.td}>
                                                                <button 
                                                                    onClick={() => handleEditClick(record)} 
                                                                    style={styles.editBtn}
                                                                >
                                                                    <FaEdit /> 
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeleteClick(record.id, record.title)} 
                                                                    style={styles.deleteBtn}
                                                                >
                                                                    <FaTrash /> 
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                {/* Right Section: Value Records Table */}
                                <div style={styles.rightSection}>
                                    <div style={styles.card}>
                                        <div style={styles.headerContainer}>
                                            <h2 style={styles.title}>Value Records</h2>
                                            <button onClick={handleAddValueClick} style={styles.addBtn}>
                                                <FaPlus /> Add Value Record
                                            </button>
                                        </div>
                                    </div>

                                    {loading && !showValueModal ? (
                                        <div style={styles.loadingText}>
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <div>Loading value records...</div>
                                        </div>
                                    ) : valueRecords.length === 0 ? (
                                        <div style={styles.emptyText}>
                                            No value records found. Click "Add Value Record" to get started.
                                        </div>
                                    ) : (
                                        <div style={styles.card}>
                                            <table style={styles.table}>
                                                <thead>
                                                    <tr>
                                                        <th style={styles.th}>ID</th>
                                                        <th style={styles.th}>Member</th>
                                                        <th style={styles.th}>Revenue (%)</th>
                                                        <th style={styles.th}>Year of Experience</th>
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
                                                            <td style={styles.td}>
                                                                <button 
                                                                    onClick={() => handleEditValueClick(record)} 
                                                                    style={styles.editBtn}
                                                                >
                                                                    <FaEdit /> 
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeleteValueClick(record.id, record.member)} 
                                                                    style={styles.deleteBtn}
                                                                >
                                                                    <FaTrash /> 
                                                                </button>
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
                                                    <div style={styles.statValue}>
                                                        {valueRecords.reduce((sum, record) => sum + parseInt(record.member), 0).toLocaleString()}
                                                    </div>
                                                    <div style={styles.statLabel}>Total Members</div>
                                                </div>
                                                <div style={styles.statCard}>
                                                    <div style={styles.statValue}>
                                                        {valueRecords.reduce((sum, record) => sum + parseFloat(record.revenue), 0).toFixed(1)}%
                                                    </div>
                                                    <div style={styles.statLabel}>Total Revenue</div>
                                                </div>
                                                <div style={styles.statCard}>
                                                    <div style={styles.statValue}>
                                                        {valueRecords.reduce((sum, record) => sum + parseFloat(record.expericence), 0).toFixed(1)}%
                                                    </div>
                                                    <div style={styles.statLabel}>Total Experience</div>
                                                </div>
                                                <div style={styles.statCard}>
                                                    <div style={styles.statValue}>
                                                        {valueRecords.reduce((sum, record) => sum + parseInt(record.amenities), 0)}
                                                    </div>
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

            {/* Modal for Investment Record Add/Edit */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>{isEditing ? 'Edit Investment Record' : 'Add New Investment Record'}</h3>
                            <button onClick={() => setShowModal(false)} style={styles.closeBtn}>
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

                            <button type="submit" style={styles.submitBtn} disabled={loading}>
                                {loading ? 'Processing...' : (isEditing ? 'Update Record' : 'Add Record')}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Value Record Add/Edit */}
            {showValueModal && (
                <div style={styles.modalOverlay} onClick={() => setShowValueModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>{isEditingValue ? 'Edit Value Record' : 'Add New Value Record'}</h3>
                            <button onClick={() => setShowValueModal(false)} style={styles.closeBtn}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleValueSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Member Count *</label>
                                <input
                                    type="number"
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
                                    name="revenue"
                                    value={valueFormData.revenue}
                                    onChange={handleValueInputChange}
                                    style={styles.input}
                                    placeholder="Enter revenue percentage"
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Experience (%) *</label>
                                <input
                                    type="number"
                                    name="expericence"
                                    value={valueFormData.expericence}
                                    onChange={handleValueInputChange}
                                    style={styles.input}
                                    placeholder="Enter experience percentage"
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Amenities *</label>
                                <input
                                    type="number"
                                    name="amenities"
                                    value={valueFormData.amenities}
                                    onChange={handleValueInputChange}
                                    style={styles.input}
                                    placeholder="Enter amenities count"
                                    required
                                />
                            </div>

                            <button type="submit" style={styles.submitBtn} disabled={loading}>
                                {loading ? 'Processing...' : (isEditingValue ? 'Update Value Record' : 'Add Value Record')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvestmentRecord;