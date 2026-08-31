import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const JobSettings = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    
    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        title: '',
        category: 'TOUR',
        description: '',
        locations: '',
        type: 'Contract',
        posted: '',
        buttonText: 'VIEW DETAILS',
        status: true,
        jobDetails: {
            metaInfo: {
                duration: 'Full-time',
                salary: 'Competitive',
                type: 'On Site',
                startTime: '9:00 AM',
                endTime: '5:00 PM'
            },
            overview: {
                title: 'JOB OVERVIEW',
                description: ''
            },
            responsibilities: {
                title: 'KEY RESPONSIBILITIES',
                items: ['']
            },
            requirements: {
                title: 'REQUIREMENTS',
                items: ['']
            },
            benefits: {
                title: 'BENEFITS & PERKS',
                items: ['']
            }
        }
    });

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2',
        sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b'
    };

    const API_URL = 'http://127.0.0.1:8000/api';

    // Fetch all jobs
    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/jobs`);
            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }
            const data = await response.json();
            setJobs(data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    // Auto-hide success message
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle nested form change
    const handleNestedChange = (section, field, value) => {
        setFormData({
            ...formData,
            jobDetails: {
                ...formData.jobDetails,
                [section]: {
                    ...formData.jobDetails[section],
                    [field]: value
                }
            }
        });
    };

    // Handle meta info change
    const handleMetaChange = (field, value) => {
        setFormData({
            ...formData,
            jobDetails: {
                ...formData.jobDetails,
                metaInfo: {
                    ...formData.jobDetails.metaInfo,
                    [field]: value
                }
            }
        });
    };

    // Handle array items change
    const handleArrayItemChange = (section, index, value) => {
        const newItems = [...formData.jobDetails[section].items];
        newItems[index] = value;
        setFormData({
            ...formData,
            jobDetails: {
                ...formData.jobDetails,
                [section]: {
                    ...formData.jobDetails[section],
                    items: newItems
                }
            }
        });
    };

    // Add array item
    const addArrayItem = (section) => {
        setFormData({
            ...formData,
            jobDetails: {
                ...formData.jobDetails,
                [section]: {
                    ...formData.jobDetails[section],
                    items: [...formData.jobDetails[section].items, '']
                }
            }
        });
    };

    // Remove array item
    const removeArrayItem = (section, index) => {
        const newItems = formData.jobDetails[section].items.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            jobDetails: {
                ...formData.jobDetails,
                [section]: {
                    ...formData.jobDetails[section],
                    items: newItems
                }
            }
        });
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            title: '',
            category: 'TOUR',
            description: '',
            locations: '',
            type: 'Contract',
            posted: '',
            buttonText: 'VIEW DETAILS',
            status: true,
            jobDetails: {
                metaInfo: {
                    duration: 'Full-time',
                    salary: 'Competitive',
                    type: 'On Site',
                    startTime: '9:00 AM',
                    endTime: '5:00 PM'
                },
                overview: {
                    title: 'JOB OVERVIEW',
                    description: ''
                },
                responsibilities: {
                    title: 'KEY RESPONSIBILITIES',
                    items: ['']
                },
                requirements: {
                    title: 'REQUIREMENTS',
                    items: ['']
                },
                benefits: {
                    title: 'BENEFITS & PERKS',
                    items: ['']
                }
            }
        });
    };

    // Load job data for edit
    const loadJobForEdit = (job) => {
        setSelectedJob(job);
        setFormData({
            title: job.title || '',
            category: job.category || 'TOUR',
            description: job.description || '',
            locations: job.locations || '',
            type: job.type || 'Contract',
            posted: job.posted || '',
            buttonText: job.buttonText || 'VIEW DETAILS',
            status: job.status !== undefined ? job.status : true,
            jobDetails: {
                metaInfo: {
                    duration: job.jobDetails?.metaInfo?.duration || 'Full-time',
                    salary: job.jobDetails?.metaInfo?.salary || 'Competitive',
                    type: job.jobDetails?.metaInfo?.type || 'On Site',
                    startTime: job.jobDetails?.metaInfo?.startTime || '9:00 AM',
                    endTime: job.jobDetails?.metaInfo?.endTime || '5:00 PM'
                },
                overview: {
                    title: job.jobDetails?.overview?.title || 'JOB OVERVIEW',
                    description: job.jobDetails?.overview?.description || ''
                },
                responsibilities: {
                    title: job.jobDetails?.responsibilities?.title || 'KEY RESPONSIBILITIES',
                    items: job.jobDetails?.responsibilities?.items || ['']
                },
                requirements: {
                    title: job.jobDetails?.requirements?.title || 'REQUIREMENTS',
                    items: job.jobDetails?.requirements?.items || ['']
                },
                benefits: {
                    title: job.jobDetails?.benefits?.title || 'BENEFITS & PERKS',
                    items: job.jobDetails?.benefits?.items || ['']
                }
            }
        });
        setShowEditModal(true);
    };

    // Add Job
    const handleAddJob = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/add-jobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add job');
            }

            setSuccessMessage('Job added successfully!');
            setShowAddModal(false);
            resetForm();
            fetchJobs();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Update Job
    const handleEditJob = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/edit-jobs/${selectedJob.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update job');
            }

            setSuccessMessage('Job updated successfully!');
            setShowEditModal(false);
            setSelectedJob(null);
            resetForm();
            fetchJobs();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Delete Job
    const handleDeleteJob = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/del-/${selectedJob.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete job');
            }

            setSuccessMessage('Job deleted successfully!');
            setShowDeleteModal(false);
            setSelectedJob(null);
            fetchJobs();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Toggle Status - FIXED
    const handleToggleStatus = async (jobId, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            const response = await fetch(`${API_URL}/toggule/${jobId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to toggle status');
            }

            // Update local state immediately
            setJobs(prevJobs => 
                prevJobs.map(job => 
                    job.id === jobId ? { ...job, status: newStatus } : job
                )
            );

            setSuccessMessage(`Job ${newStatus ? 'activated' : 'deactivated'} successfully!`);
        } catch (err) {
            setError(err.message);
        }
    };

    const styles = {
        container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
        mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
        contentScroll: { flex: '1 0 auto', padding: '24px' },
        footerWrapper: { flexShrink: 0 }
    };

    // Modal Styles - FIXED with scroll
    const modalStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
            padding: '20px',
            animation: 'fadeIn 0.3s ease'
        },
        modal: {
            backgroundColor: theme.card,
            borderRadius: '16px',
            maxWidth: '850px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            animation: 'slideIn 0.3s ease',
            position: 'relative'
        },
        header: {
            padding: '20px 24px',
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
            borderRadius: '16px 16px 0 0'
        },
        body: {
            padding: '24px',
            overflowY: 'auto',
            flex: '1 1 auto',
            maxHeight: 'calc(90vh - 140px)'
        },
        footer: {
            padding: '16px 24px',
            borderTop: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            flexShrink: 0,
            borderRadius: '0 0 16px 16px'
        },
        closeButton: {
            background: 'transparent',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            color: theme.text,
            padding: '0 8px',
            lineHeight: '1',
            opacity: 0.7,
            transition: 'opacity 0.2s'
        },
        input: {
            backgroundColor: theme.bg,
            color: theme.text,
            border: `1px solid ${theme.border}`,
            borderRadius: '8px',
            padding: '10px 14px',
            width: '100%',
            fontSize: '14px',
            transition: 'border-color 0.2s'
        },
        select: {
            backgroundColor: theme.bg,
            color: theme.text,
            border: `1px solid ${theme.border}`,
            borderRadius: '8px',
            padding: '10px 14px',
            width: '100%',
            fontSize: '14px',
            transition: 'border-color 0.2s'
        },
        textarea: {
            backgroundColor: theme.bg,
            color: theme.text,
            border: `1px solid ${theme.border}`,
            borderRadius: '8px',
            padding: '10px 14px',
            width: '100%',
            fontSize: '14px',
            minHeight: '80px',
            transition: 'border-color 0.2s'
        },
        label: {
            fontWeight: 600,
            fontSize: '13px',
            marginBottom: '6px',
            display: 'block',
            color: theme.text
        },
        statusBadge: {
            display: 'inline-block',
            padding: '5px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            border: 'none'
        }
    };

    return (
        <div style={styles.container} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="job" />

                <div style={styles.mainArea} className="flex-grow-1">
                    <Header
                        theme={theme}
                        isDarkMode={isDarkMode}
                        toggleDarkMode={toggleDarkMode}
                        toggleSidebar={toggleSidebar}
                    />

                    <div style={styles.contentContainer}>
                        <div style={styles.contentScroll}>
                            {/* Success Message */}
                            {successMessage && (
                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    {successMessage}
                                    <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {error}
                                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                                </div>
                            )}

                            {/* Header with Add Button */}
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                <div>
                                    <h2 style={{ color: theme.text }}>Job Management</h2>
                                    <p style={{ color: theme.text, opacity: 0.7 }}>Manage all job postings</p>
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        resetForm();
                                        setShowAddModal(true);
                                    }}
                                >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Add New Job
                                </button>
                            </div>

                            {/* Job List Table */}
                            <div className="table-responsive">
                                <table className="table table-hover" style={{ 
                                    backgroundColor: theme.card,
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
                                }}>
                                    <thead style={{ color: theme.text, borderBottom: `2px solid ${theme.border}` }}>
                                        <tr>
                                            <th style={{ padding: '14px 16px' }}>ID</th>
                                            <th style={{ padding: '14px 16px' }}>Title</th>
                                            <th style={{ padding: '14px 16px' }}>Category</th>
                                            <th style={{ padding: '14px 16px' }}>Type</th>
                                            <th style={{ padding: '14px 16px' }}>Location</th>
                                            <th style={{ padding: '14px 16px' }}>Status</th>
                                            <th style={{ padding: '14px 16px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="7" className="text-center py-5">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    <p className="mt-2" style={{ color: theme.text }}>Loading jobs...</p>
                                                </td>
                                            </tr>
                                        ) : jobs.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center py-5" style={{ color: theme.text }}>
                                                    <i className="bi bi-inbox display-4 d-block mb-3" style={{ opacity: 0.5 }}></i>
                                                    <h5>No jobs found</h5>
                                                    <p style={{ opacity: 0.7 }}>Click "Add New Job" to create your first job posting.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            jobs.map((job) => (
                                                <tr key={job.id} style={{ 
                                                    color: theme.text, 
                                                    borderBottom: `1px solid ${theme.border}`,
                                                    transition: 'background 0.2s'
                                                }}>
                                                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                                                        #{String(job.id).padStart(3, '0')}
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <strong>{job.title}</strong>
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <span className="badge bg-info">{job.category}</span>
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>{job.type}</td>
                                                    <td style={{ padding: '12px 16px' }}>{job.locations}</td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <button
                                                            style={{
                                                                ...modalStyles.statusBadge,
                                                                backgroundColor: job.status ? '#198754' : '#6c757d',
                                                                color: '#fff'
                                                            }}
                                                            onClick={() => handleToggleStatus(job.id, job.status)}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.transform = 'scale(1.05)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.transform = 'scale(1)';
                                                            }}
                                                        >
                                                            <i className={`bi ${job.status ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-1`}></i>
                                                            {job.status ? 'Active' : 'Inactive'}
                                                        </button>
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <div className="btn-group btn-group-sm">
                                                            <button
                                                                className="btn btn-outline-primary"
                                                                onClick={() => loadJobForEdit(job)}
                                                                title="Edit Job"
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-danger"
                                                                onClick={() => {
                                                                    setSelectedJob(job);
                                                                    setShowDeleteModal(true);
                                                                }}
                                                                title="Delete Job"
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div style={styles.footerWrapper}>
                            <Footer theme={theme} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== ADD MODAL - FIXED ===== */}
            {showAddModal && (
                <div style={modalStyles.overlay} onClick={(e) => {
                    if (e.target === e.currentTarget) setShowAddModal(false);
                }}>
                    <div style={modalStyles.modal}>
                        <div style={modalStyles.header}>
                            <h5 style={{ color: theme.text, margin: 0 }}>
                                <i className="bi bi-plus-circle me-2" style={{ color: '#0d6efd' }}></i>
                                Add New Job
                            </h5>
                            <button 
                                style={modalStyles.closeButton}
                                onClick={() => setShowAddModal(false)}
                                onMouseEnter={(e) => e.target.style.opacity = '1'}
                                onMouseLeave={(e) => e.target.style.opacity = '0.7'}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAddJob}>
                            <div style={modalStyles.body}>
                                {/* Basic Information */}
                                <div className="row mb-3">
                                    <div className="col-12">
                                        <label style={modalStyles.label}>Job Title <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="title"
                                            className="form-control"
                                            value={formData.title}
                                            onChange={handleChange}
                                            style={modalStyles.input}
                                            required
                                            placeholder="Enter job title"
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label style={modalStyles.label}>Category <span className="text-danger">*</span></label>
                                        <select
                                            name="category"
                                            className="form-select"
                                            value={formData.category}
                                            onChange={handleChange}
                                            style={modalStyles.select}
                                            required
                                        >
                                            <option value="TOUR">TOUR</option>
                                            <option value="SALES">SALES</option>
                                            <option value="MARKETING">MARKETING</option>
                                            <option value="IT">IT</option>
                                            <option value="HR">HR</option>
                                            <option value="OTHER">OTHER</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label style={modalStyles.label}>Job Type <span className="text-danger">*</span></label>
                                        <select
                                            name="type"
                                            className="form-select"
                                            value={formData.type}
                                            onChange={handleChange}
                                            style={modalStyles.select}
                                            required
                                        >
                                            <option value="Contract">Contract</option>
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Remote">Remote</option>
                                            <option value="Hybrid">Hybrid</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-12">
                                        <label style={modalStyles.label}>Description <span className="text-danger">*</span></label>
                                        <textarea
                                            name="description"
                                            className="form-control"
                                            rows="3"
                                            value={formData.description}
                                            onChange={handleChange}
                                            style={modalStyles.textarea}
                                            required
                                            placeholder="Enter job description"
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label style={modalStyles.label}>Location <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="locations"
                                            className="form-control"
                                            value={formData.locations}
                                            onChange={handleChange}
                                            style={modalStyles.input}
                                            required
                                            placeholder="e.g., Dhaka, Bangladesh"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label style={modalStyles.label}>Posted Date</label>
                                        <input
                                            type="text"
                                            name="posted"
                                            className="form-control"
                                            value={formData.posted}
                                            onChange={handleChange}
                                            placeholder="e.g., Posted 2 days ago"
                                            style={modalStyles.input}
                                        />
                                    </div>
                                </div>

                                <hr style={{ borderColor: theme.border, margin: '20px 0' }} />
                                <h6 style={{ color: theme.text, marginBottom: '16px' }}>Job Details</h6>

                                {/* Meta Info */}
                                <div className="row mb-3">
                                    <div className="col-md-3">
                                        <label style={modalStyles.label}>Duration</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.jobDetails.metaInfo.duration}
                                            onChange={(e) => handleMetaChange('duration', e.target.value)}
                                            style={modalStyles.input}
                                            placeholder="Full-time"
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label style={modalStyles.label}>Salary</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.jobDetails.metaInfo.salary}
                                            onChange={(e) => handleMetaChange('salary', e.target.value)}
                                            style={modalStyles.input}
                                            placeholder="Competitive"
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label style={modalStyles.label}>Work Type</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.jobDetails.metaInfo.type}
                                            onChange={(e) => handleMetaChange('type', e.target.value)}
                                            style={modalStyles.input}
                                            placeholder="On Site"
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label style={modalStyles.label}>Start Time</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.jobDetails.metaInfo.startTime}
                                            onChange={(e) => handleMetaChange('startTime', e.target.value)}
                                            style={modalStyles.input}
                                            placeholder="9:00 AM"
                                        />
                                    </div>
                                </div>

                                {/* Overview */}
                                <div className="mb-3">
                                    <label style={modalStyles.label}>Overview Description</label>
                                    <textarea
                                        className="form-control"
                                        rows="2"
                                        value={formData.jobDetails.overview.description}
                                        onChange={(e) => handleNestedChange('overview', 'description', e.target.value)}
                                        style={modalStyles.textarea}
                                        placeholder="Enter job overview"
                                    />
                                </div>

                                {/* Responsibilities */}
                                <div className="mb-3">
                                    <label style={modalStyles.label}>Responsibilities</label>
                                    {formData.jobDetails.responsibilities.items.map((item, index) => (
                                        <div key={index} className="input-group mb-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={item}
                                                onChange={(e) => handleArrayItemChange('responsibilities', index, e.target.value)}
                                                placeholder={`Responsibility ${index + 1}`}
                                                style={modalStyles.input}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() => removeArrayItem('responsibilities', index)}
                                                disabled={formData.jobDetails.responsibilities.items.length <= 1}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => addArrayItem('responsibilities')}
                                    >
                                        <i className="bi bi-plus-circle me-1"></i> Add Responsibility
                                    </button>
                                </div>

                                {/* Requirements */}
                                <div className="mb-3">
                                    <label style={modalStyles.label}>Requirements</label>
                                    {formData.jobDetails.requirements.items.map((item, index) => (
                                        <div key={index} className="input-group mb-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={item}
                                                onChange={(e) => handleArrayItemChange('requirements', index, e.target.value)}
                                                placeholder={`Requirement ${index + 1}`}
                                                style={modalStyles.input}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() => removeArrayItem('requirements', index)}
                                                disabled={formData.jobDetails.requirements.items.length <= 1}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => addArrayItem('requirements')}
                                    >
                                        <i className="bi bi-plus-circle me-1"></i> Add Requirement
                                    </button>
                                </div>

                                {/* Benefits */}
                                <div className="mb-3">
                                    <label style={modalStyles.label}>Benefits & Perks</label>
                                    {formData.jobDetails.benefits.items.map((item, index) => (
                                        <div key={index} className="input-group mb-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={item}
                                                onChange={(e) => handleArrayItemChange('benefits', index, e.target.value)}
                                                placeholder={`Benefit ${index + 1}`}
                                                style={modalStyles.input}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() => removeArrayItem('benefits', index)}
                                                disabled={formData.jobDetails.benefits.items.length <= 1}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => addArrayItem('benefits')}
                                    >
                                        <i className="bi bi-plus-circle me-1"></i> Add Benefit
                                    </button>
                                </div>
                            </div>

                            <div style={modalStyles.footer}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-save me-2"></i>
                                            Save Job
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ===== EDIT MODAL - FIXED ===== */}
            {showEditModal && (
                <div style={modalStyles.overlay} onClick={(e) => {
                    if (e.target === e.currentTarget) setShowEditModal(false);
                }}>
                    <div style={modalStyles.modal}>
                        <div style={modalStyles.header}>
                            <h5 style={{ color: theme.text, margin: 0 }}>
                                <i className="bi bi-pencil-square me-2" style={{ color: '#0d6efd' }}></i>
                                Edit Job: {selectedJob?.title}
                            </h5>
                            <button 
                                style={modalStyles.closeButton}
                                onClick={() => setShowEditModal(false)}
                                onMouseEnter={(e) => e.target.style.opacity = '1'}
                                onMouseLeave={(e) => e.target.style.opacity = '0.7'}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleEditJob}>
                            <div style={modalStyles.body}>
                                {/* Same form fields as Add Modal */}
                                <div className="row mb-3">
                                    <div className="col-12">
                                        <label style={modalStyles.label}>Job Title <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="title"
                                            className="form-control"
                                            value={formData.title}
                                            onChange={handleChange}
                                            style={modalStyles.input}
                                            required
                                            placeholder="Enter job title"
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label style={modalStyles.label}>Category <span className="text-danger">*</span></label>
                                        <select
                                            name="category"
                                            className="form-select"
                                            value={formData.category}
                                            onChange={handleChange}
                                            style={modalStyles.select}
                                            required
                                        >
                                            <option value="TOUR">TOUR</option>
                                            <option value="SALES">SALES</option>
                                            <option value="MARKETING">MARKETING</option>
                                            <option value="IT">IT</option>
                                            <option value="HR">HR</option>
                                            <option value="OTHER">OTHER</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label style={modalStyles.label}>Job Type <span className="text-danger">*</span></label>
                                        <select
                                            name="type"
                                            className="form-select"
                                            value={formData.type}
                                            onChange={handleChange}
                                            style={modalStyles.select}
                                            required
                                        >
                                            <option value="Contract">Contract</option>
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Remote">Remote</option>
                                            <option value="Hybrid">Hybrid</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-12">
                                        <label style={modalStyles.label}>Description <span className="text-danger">*</span></label>
                                        <textarea
                                            name="description"
                                            className="form-control"
                                            rows="3"
                                            value={formData.description}
                                            onChange={handleChange}
                                            style={modalStyles.textarea}
                                            required
                                            placeholder="Enter job description"
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label style={modalStyles.label}>Location <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="locations"
                                            className="form-control"
                                            value={formData.locations}
                                            onChange={handleChange}
                                            style={modalStyles.input}
                                            required
                                            placeholder="e.g., Dhaka, Bangladesh"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label style={modalStyles.label}>Posted Date</label>
                                        <input
                                            type="text"
                                            name="posted"
                                            className="form-control"
                                            value={formData.posted}
                                            onChange={handleChange}
                                            placeholder="e.g., Posted 2 days ago"
                                            style={modalStyles.input}
                                        />
                                    </div>
                                </div>

                                <hr style={{ borderColor: theme.border, margin: '20px 0' }} />
                                <h6 style={{ color: theme.text, marginBottom: '16px' }}>Job Details</h6>

                                <div className="row mb-3">
                                    <div className="col-md-3">
                                        <label style={modalStyles.label}>Duration</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.jobDetails.metaInfo.duration}
                                            onChange={(e) => handleMetaChange('duration', e.target.value)}
                                            style={modalStyles.input}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label style={modalStyles.label}>Salary</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.jobDetails.metaInfo.salary}
                                            onChange={(e) => handleMetaChange('salary', e.target.value)}
                                            style={modalStyles.input}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label style={modalStyles.label}>Work Type</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.jobDetails.metaInfo.type}
                                            onChange={(e) => handleMetaChange('type', e.target.value)}
                                            style={modalStyles.input}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label style={modalStyles.label}>Start Time</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.jobDetails.metaInfo.startTime}
                                            onChange={(e) => handleMetaChange('startTime', e.target.value)}
                                            style={modalStyles.input}
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label style={modalStyles.label}>Overview Description</label>
                                    <textarea
                                        className="form-control"
                                        rows="2"
                                        value={formData.jobDetails.overview.description}
                                        onChange={(e) => handleNestedChange('overview', 'description', e.target.value)}
                                        style={modalStyles.textarea}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label style={modalStyles.label}>Responsibilities</label>
                                    {formData.jobDetails.responsibilities.items.map((item, index) => (
                                        <div key={index} className="input-group mb-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={item}
                                                onChange={(e) => handleArrayItemChange('responsibilities', index, e.target.value)}
                                                placeholder={`Responsibility ${index + 1}`}
                                                style={modalStyles.input}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() => removeArrayItem('responsibilities', index)}
                                                disabled={formData.jobDetails.responsibilities.items.length <= 1}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => addArrayItem('responsibilities')}
                                    >
                                        <i className="bi bi-plus-circle me-1"></i> Add Responsibility
                                    </button>
                                </div>

                                <div className="mb-3">
                                    <label style={modalStyles.label}>Requirements</label>
                                    {formData.jobDetails.requirements.items.map((item, index) => (
                                        <div key={index} className="input-group mb-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={item}
                                                onChange={(e) => handleArrayItemChange('requirements', index, e.target.value)}
                                                placeholder={`Requirement ${index + 1}`}
                                                style={modalStyles.input}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() => removeArrayItem('requirements', index)}
                                                disabled={formData.jobDetails.requirements.items.length <= 1}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => addArrayItem('requirements')}
                                    >
                                        <i className="bi bi-plus-circle me-1"></i> Add Requirement
                                    </button>
                                </div>

                                <div className="mb-3">
                                    <label style={modalStyles.label}>Benefits & Perks</label>
                                    {formData.jobDetails.benefits.items.map((item, index) => (
                                        <div key={index} className="input-group mb-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={item}
                                                onChange={(e) => handleArrayItemChange('benefits', index, e.target.value)}
                                                placeholder={`Benefit ${index + 1}`}
                                                style={modalStyles.input}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() => removeArrayItem('benefits', index)}
                                                disabled={formData.jobDetails.benefits.items.length <= 1}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => addArrayItem('benefits')}
                                    >
                                        <i className="bi bi-plus-circle me-1"></i> Add Benefit
                                    </button>
                                </div>
                            </div>

                            <div style={modalStyles.footer}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-save me-2"></i>
                                            Update Job
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ===== DELETE MODAL - FIXED ===== */}
            {showDeleteModal && (
                <div style={modalStyles.overlay} onClick={(e) => {
                    if (e.target === e.currentTarget) setShowDeleteModal(false);
                }}>
                    <div style={{ ...modalStyles.modal, maxWidth: '500px' }}>
                        <div style={modalStyles.header}>
                            <h5 style={{ color: theme.text, margin: 0 }}>
                                <i className="bi bi-exclamation-triangle-fill me-2" style={{ color: '#dc3545' }}></i>
                                Delete Job
                            </h5>
                            <button 
                                style={modalStyles.closeButton}
                                onClick={() => setShowDeleteModal(false)}
                                onMouseEnter={(e) => e.target.style.opacity = '1'}
                                onMouseLeave={(e) => e.target.style.opacity = '0.7'}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={modalStyles.body}>
                            <p style={{ color: theme.text, fontSize: '15px' }}>Are you sure you want to delete the following job?</p>
                            <div style={{ 
                                backgroundColor: theme.bg, 
                                padding: '16px', 
                                borderRadius: '10px',
                                marginBottom: '16px',
                                border: `1px solid ${theme.border}`
                            }}>
                                <h6 style={{ color: theme.text, margin: 0 }}>{selectedJob?.title}</h6>
                                <p style={{ color: theme.text, opacity: 0.7, margin: '4px 0 0 0', fontSize: '13px' }}>
                                    #{String(selectedJob?.id).padStart(3, '0')} • {selectedJob?.category} • {selectedJob?.type}
                                </p>
                            </div>
                            <div className="alert alert-danger" style={{ borderRadius: '10px' }}>
                                <i className="bi bi-info-circle me-2"></i>
                                This action cannot be undone!
                            </div>
                        </div>

                        <div style={modalStyles.footer}>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-danger" onClick={handleDeleteJob} disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-trash me-2"></i>
                                        Delete Job
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: translateY(-30px) scale(0.95); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                
                .btn-close {
                    background: transparent;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: ${theme.text};
                    opacity: 0.5;
                    transition: opacity 0.2s;
                    padding: 4px 8px;
                }
                .btn-close:hover {
                    opacity: 1;
                }
                
                .form-control, .form-select {
                    background-color: ${theme.bg} !important;
                    color: ${theme.text} !important;
                    border-color: ${theme.border} !important;
                    transition: all 0.2s;
                }
                .form-control:focus, .form-select:focus {
                    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
                    border-color: #0d6efd;
                    outline: none;
                }
                .form-control::placeholder {
                    color: ${theme.text} !important;
                    opacity: 0.5;
                }
                
                .input-group .btn {
                    border-color: ${theme.border};
                }
                
                .table {
                    margin-bottom: 0;
                }
                .table > :not(caption) > * > * {
                    background-color: transparent !important;
                    border-bottom-color: ${theme.border} !important;
                }
                
                .table tbody tr:hover {
                    background-color: rgba(13, 110, 253, 0.04) !important;
                }
                
                .btn-group .btn {
                    border-radius: 6px;
                    padding: 4px 10px;
                    margin: 0 2px;
                }
                .btn-group .btn:hover {
                    transform: scale(1.1);
                    transition: transform 0.2s;
                }
                
                /* Scrollbar styling */
                ::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: ${theme.bg};
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb {
                    background: ${theme.border};
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #0d6efd;
                }
                
                /* Modal body scroll */
                .modal-body-scroll {
                    scrollbar-width: thin;
                }
                
                .badge {
                    font-weight: 500;
                    padding: 5px 14px;
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
};

export default JobSettings;