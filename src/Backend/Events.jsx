import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Events = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeView, setActiveView] = useState('events');

    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        event_datetime: '',
        main_title: '',
        subtitle: '',
        posted_by: '',
        description: '',
        features: [],
        thumb_img: null,
        main_img: null
    });

    // Image preview states
    const [thumbPreview, setThumbPreview] = useState(null);
    const [mainPreview, setMainPreview] = useState(null);

    const [featureInput, setFeatureInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    const theme = {
        isDarkMode,
        bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2',
        tableHeader: isDarkMode ? '#0f3460' : '#f8f9fa',
        tableRow: isDarkMode ? '#1a1a2e' : '#ffffff',
        tableRowAlt: isDarkMode ? '#16213e' : '#f8f9fa',
    };

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const API_URL = 'http://127.0.0.1:8000';

    // Get Auth Token from localStorage
    const getAuthToken = () => {
        const token = localStorage.getItem("token");
        return token;
    };

    // Helper function to get full image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        // Remove duplicate /storage
        const cleanPath = imagePath.replace(/^\/storage\/storage\//, '/storage/');
        if (cleanPath.startsWith('/storage/')) {
            return `${API_URL}${cleanPath}`;
        }
        return `${API_URL}/storage/${cleanPath}`;
    };

    // Create axios instance
    const axiosInstance = axios.create({
        baseURL: API_BASE,
        headers: {
            'Accept': 'application/json',
        }
    });

    // Add token to every request
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = getAuthToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            if (config.data instanceof FormData) {
                delete config.headers['Content-Type'];
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor for handling 401 errors
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("userRole");
                localStorage.removeItem("userName");
                window.location.href = '/';
            }
            return Promise.reject(error);
        }
    );

    // Fetch Events
    const fetchEvents = async () => {
        setFetchLoading(true);
        try {
            const token = getAuthToken();
            if (!token) {
                setEvents([]);
                setFetchLoading(false);
                return;
            }

            const res = await axiosInstance.get('/events/all');
            
            if (res.data.success && res.data.data) {
                setEvents(res.data.data);
            } else if (res.data.data) {
                setEvents(res.data.data);
            } else {
                setEvents([]);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setEvents([]);
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, [e.target.name]: file });
            
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            if (e.target.name === 'thumb_img') {
                setThumbPreview(previewUrl);
            } else if (e.target.name === 'main_img') {
                setMainPreview(previewUrl);
            }
        }
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setFormData({
                ...formData,
                features: [...formData.features, featureInput.trim()]
            });
            setFeatureInput('');
        }
    };

    const removeFeature = (index) => {
        const updatedFeatures = formData.features.filter((_, i) => i !== index);
        setFormData({ ...formData, features: updatedFeatures });
    };

    // Add or Update Event
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const token = getAuthToken();
        if (!token) {
            alert("Please login to add/edit events");
            window.location.href = '/';
            return;
        }
        
        const submitData = new FormData();
        submitData.append('title', formData.title);
        submitData.append('event_datetime', formData.event_datetime);
        submitData.append('main_title', formData.main_title);
        submitData.append('subtitle', formData.subtitle);
        submitData.append('posted_by', formData.posted_by);
        submitData.append('description', formData.description);
        
        if (formData.features && formData.features.length > 0) {
            formData.features.forEach((feature, index) => {
                submitData.append(`features[${index}]`, feature);
            });
        }
        
        if (formData.thumb_img && formData.thumb_img instanceof File) {
            submitData.append('thumb_img', formData.thumb_img);
        }
        if (formData.main_img && formData.main_img instanceof File) {
            submitData.append('main_img', formData.main_img);
        }

        setLoading(true);
        try {
            let res;
            if (editingEvent) {
                submitData.append('_method', 'PUT');
                res = await axiosInstance.post(`/events/${editingEvent.id}`, submitData);
            } else {
                res = await axiosInstance.post('/events', submitData);
            }

            if (res.data.success) {
                alert(editingEvent ? 'Event updated successfully!' : 'Event created successfully!');
                setShowModal(false);
                resetForm();
                fetchEvents();
            } else {
                alert(res.data.message || 'Failed to save event');
            }
        } catch (err) {
            console.error("Submit error:", err);
            if (err.response?.status === 401) {
                alert("Session expired. Please login again.");
                localStorage.removeItem("token");
                window.location.href = '/';
            } else if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                let errorMsg = "Validation errors:\n";
                Object.keys(errors).forEach(key => {
                    errorMsg += `${key}: ${errors[key][0]}\n`;
                });
                alert(errorMsg);
            } else if (err.response?.data?.message) {
                alert(err.response.data.message);
            } else {
                alert("Something went wrong! Please check console for details.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Delete Event
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        
        const token = getAuthToken();
        if (!token) {
            alert("Please login to delete events");
            window.location.href = '/';
            return;
        }
        
        try {
            await axiosInstance.delete(`/events/${id}`);
            setEvents(events.filter(event => event.id !== id));
            alert("Event deleted successfully!");
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete event: " + (err.response?.data?.message || err.message));
        }
    };

    // Edit Event
    const handleEdit = (event) => {
        const token = getAuthToken();
        if (!token) {
            alert("Please login to edit events");
            window.location.href = '/';
            return;
        }
        
        setEditingEvent(event);
        setFormData({
            title: event.title || '',
            event_datetime: event.event_datetime || '',
            main_title: event.mainTitle || '',
            subtitle: event.subtitle || '',
            posted_by: event.postedBy || '',
            description: event.description || '',
            features: event.features || [],
            thumb_img: null,
            main_img: null
        });
        
        // Clear previews
        setThumbPreview(null);
        setMainPreview(null);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            event_datetime: '',
            main_title: '',
            subtitle: '',
            posted_by: '',
            description: '',
            features: [],
            thumb_img: null,
            main_img: null
        });
        setThumbPreview(null);
        setMainPreview(null);
        setEditingEvent(null);
        setFeatureInput('');
    };

    const formatDateTime = (datetime) => {
        if (!datetime) return 'N/A';
        const date = new Date(datetime);
        return date.toLocaleString();
    };

    const isLoggedIn = !!getAuthToken();

    if (!isLoggedIn) {
        return (
            <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }}>
                <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
                    <Sidebar theme={theme} isCollapsed={isCollapsed} activeView={activeView} setActiveView={setActiveView} />
                    <div className="flex-grow-1 d-flex flex-column">
                        <Header 
                            theme={theme}
                            isDarkMode={isDarkMode}
                            toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                            toggleSidebar={() => setIsCollapsed(!isCollapsed)}
                        />
                        <div className="text-center py-5">
                            <div className="alert alert-warning m-5">
                                <h4>Please Login First</h4>
                                <p>You need to be logged in to access Event Management.</p>
                                <button className="btn btn-primary mt-3" onClick={() => window.location.href = '/'}>
                                    Go to Login
                                </button>
                            </div>
                        </div>
                        <Footer theme={theme} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }}>
            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
                
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView={activeView} setActiveView={setActiveView} />

                <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                    
                    <Header 
                        theme={theme}
                        isDarkMode={isDarkMode}
                        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
                    />

                    {/* Content Area */}
                    <div className="p-4 flex-grow-1" style={{ overflowY: 'auto' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold" style={{ color: theme.text }}>Event Management</h4>
                            <button 
                                className="btn text-white" 
                                style={{ background: '#9a55ff', borderRadius: '8px' }}
                                onClick={() => {
                                    resetForm();
                                    setShowModal(true);
                                }}
                            >
                                <i className="bi bi-plus-lg me-1"></i> Add Event
                            </button>
                        </div>

                        {fetchLoading && (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-2">Loading events...</p>
                            </div>
                        )}

                        {!fetchLoading && (
                            <div className="card shadow-sm border-0" style={{ backgroundColor: theme.card, borderRadius: '15px', overflow: 'hidden' }}>
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0" style={{ color: theme.text }}>
                                        <thead>
                                            <tr style={{ 
                                                backgroundColor: theme.tableHeader,
                                                color: isDarkMode ? '#fff' : '#2c3e50',
                                                borderBottom: `2px solid ${theme.border}`
                                            }}>
                                                <th className="py-3 px-4">Title</th>
                                                <th className="py-3">Main Title</th>
                                                <th className="py-3">Date & Time</th>
                                                <th className="py-3">Posted By</th>
                                                <th className="py-3">Status</th>
                                                <th className="text-center py-3">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {events.length > 0 ? (
                                                events.map((event, index) => (
                                                    <tr key={event.id} style={{ 
                                                        backgroundColor: index % 2 === 0 ? theme.tableRow : theme.tableRowAlt,
                                                        borderBottom: `1px solid ${theme.border}`,
                                                        color: theme.text
                                                    }}>
                                                        <td className="py-3 px-4">
                                                            <div className="d-flex align-items-center gap-2">
                                                                {event.thumbImg && (
                                                                    <img 
                                                                        src={getImageUrl(event.thumbImg)} 
                                                                        alt={event.title}
                                                                        style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.src = 'https://via.placeholder.com/40?text=No+Image';
                                                                        }}
                                                                    />
                                                                )}
                                                                <span style={{ color: theme.text }}>{event.title}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ color: theme.text }}>{event.mainTitle}</td>
                                                        <td style={{ color: theme.text }}>{event.time || formatDateTime(event.event_datetime)}</td>
                                                        <td style={{ color: theme.text }}>{event.postedBy}</td>
                                                        <td>
                                                            <span className={`badge ${event.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                                                                {event.status || 'Active'}
                                                            </span>
                                                        </td>
                                                        <td className="text-center">
                                                            <button 
                                                                className="btn btn-outline-primary btn-sm me-2"
                                                                onClick={() => handleEdit(event)}
                                                            >
                                                                <i className="bi bi-pencil"></i> Edit
                                                            </button>
                                                            <button 
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() => handleDelete(event.id)}
                                                            >
                                                                <i className="bi bi-trash"></i> Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-5">
                                                        <div style={{ color: theme.text }}>
                                                            <i className="bi bi-calendar-x display-4"></i>
                                                            <p className="mt-2">No events found. Click "Add Event" to create one.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div style={{ flexShrink: 0 }}>
                        <Footer theme={theme} />
                    </div>
                </div>
            </div>

            {/* Add/Edit Event Modal with Image Preview */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content" style={{ backgroundColor: theme.card, color: theme.text }}>
                            <div className="modal-header" style={{ borderBottomColor: theme.border }}>
                                <h5 className="modal-title">
                                    <i className="bi bi-calendar-plus me-2"></i>
                                    {editingEvent ? 'Edit Event' : 'Add New Event'}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">Title *</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                className="form-control"
                                                style={{ backgroundColor: isDarkMode ? '#1a1a2e' : '#fff', color: theme.text, borderColor: theme.border }}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">Event Date & Time *</label>
                                            <input
                                                type="datetime-local"
                                                name="event_datetime"
                                                value={formData.event_datetime}
                                                onChange={handleChange}
                                                className="form-control"
                                                style={{ backgroundColor: isDarkMode ? '#1a1a2e' : '#fff', color: theme.text, borderColor: theme.border }}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">Main Title *</label>
                                            <input
                                                type="text"
                                                name="main_title"
                                                value={formData.main_title}
                                                onChange={handleChange}
                                                className="form-control"
                                                style={{ backgroundColor: isDarkMode ? '#1a1a2e' : '#fff', color: theme.text, borderColor: theme.border }}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">Subtitle *</label>
                                            <input
                                                type="text"
                                                name="subtitle"
                                                value={formData.subtitle}
                                                onChange={handleChange}
                                                className="form-control"
                                                style={{ backgroundColor: isDarkMode ? '#1a1a2e' : '#fff', color: theme.text, borderColor: theme.border }}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">Posted By *</label>
                                            <input
                                                type="text"
                                                name="posted_by"
                                                value={formData.posted_by}
                                                onChange={handleChange}
                                                className="form-control"
                                                style={{ backgroundColor: isDarkMode ? '#1a1a2e' : '#fff', color: theme.text, borderColor: theme.border }}
                                                required
                                            />
                                        </div>

                                        <div className="col-12 mb-3">
                                            <label className="form-label fw-bold">Description *</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                className="form-control"
                                                rows="3"
                                                style={{ backgroundColor: isDarkMode ? '#1a1a2e' : '#fff', color: theme.text, borderColor: theme.border }}
                                                required
                                            />
                                        </div>

                                        <div className="col-12 mb-3">
                                            <label className="form-label fw-bold">Features</label>
                                            <div className="input-group mb-2">
                                                <input
                                                    type="text"
                                                    value={featureInput}
                                                    onChange={(e) => setFeatureInput(e.target.value)}
                                                    className="form-control"
                                                    placeholder="Add feature (e.g., 500 Best Rooms)"
                                                    style={{ backgroundColor: isDarkMode ? '#1a1a2e' : '#fff', color: theme.text, borderColor: theme.border }}
                                                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                                                />
                                                <button type="button" onClick={addFeature} className="btn btn-secondary" style={{ backgroundColor: '#9a55ff', borderColor: '#9a55ff' }}>
                                                    <i className="bi bi-plus"></i> Add
                                                </button>
                                            </div>
                                            <div className="d-flex flex-wrap gap-2">
                                                {formData.features.map((feature, index) => (
                                                    <span key={index} className="badge p-2" style={{ backgroundColor: '#9a55ff' }}>
                                                        {feature}
                                                        <i 
                                                            className="bi bi-x-circle ms-2" 
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => removeFeature(index)}
                                                        ></i>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Thumbnail Image with Preview */}
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">Thumbnail Image {!editingEvent && '*'}</label>
                                            <input
                                                type="file"
                                                name="thumb_img"
                                                onChange={handleFileChange}
                                                className="form-control"
                                                accept="image/*"
                                                style={{ backgroundColor: isDarkMode ? '#1a1a2e' : '#fff', color: theme.text, borderColor: theme.border }}
                                                required={!editingEvent}
                                            />
                                            <small className="text-muted">Recommended: 300x200px</small>
                                            {editingEvent && (
                                                <small className="text-muted d-block">Leave empty to keep current image</small>
                                            )}
                                            {/* Thumbnail Preview */}
                                            {(thumbPreview || (editingEvent && editingEvent.thumbImg)) && (
                                                <div className="mt-2">
                                                    <div className="border rounded p-2" style={{ display: 'inline-block', backgroundColor: theme.bg }}>
                                                        <img 
                                                            src={thumbPreview || getImageUrl(editingEvent?.thumbImg)} 
                                                            alt="Thumbnail Preview"
                                                            style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '5px' }}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = 'https://via.placeholder.com/100x70?text=Preview';
                                                            }}
                                                        />
                                                        <p className="small text-muted mt-1 mb-0 text-center">Thumbnail Preview</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Main Image with Preview */}
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">Main Image {!editingEvent && '*'}</label>
                                            <input
                                                type="file"
                                                name="main_img"
                                                onChange={handleFileChange}
                                                className="form-control"
                                                accept="image/*"
                                                style={{ backgroundColor: isDarkMode ? '#1a1a2e' : '#fff', color: theme.text, borderColor: theme.border }}
                                                required={!editingEvent}
                                            />
                                            <small className="text-muted">Recommended: 800x600px</small>
                                            {editingEvent && (
                                                <small className="text-muted d-block">Leave empty to keep current image</small>
                                            )}
                                            {/* Main Image Preview */}
                                            {(mainPreview || (editingEvent && editingEvent.mainImg)) && (
                                                <div className="mt-2">
                                                    <div className="border rounded p-2" style={{ display: 'inline-block', backgroundColor: theme.bg }}>
                                                        <img 
                                                            src={mainPreview || getImageUrl(editingEvent?.mainImg)} 
                                                            alt="Main Preview"
                                                            style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '5px' }}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = 'https://via.placeholder.com/120x80?text=Preview';
                                                            }}
                                                        />
                                                        <p className="small text-muted mt-1 mb-0 text-center">Main Image Preview</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2 mt-3">
                                        <button type="submit" className="btn btn-primary flex-grow-1" style={{ backgroundColor: '#9a55ff', borderColor: '#9a55ff' }} disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    {editingEvent ? 'Updating...' : 'Saving...'}
                                                </>
                                            ) : (
                                                editingEvent ? 'Update Event' : 'Save Event'
                                            )}
                                        </button>
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cleanup object URLs on unmount */}
            {useEffect(() => {
                return () => {
                    if (thumbPreview) URL.revokeObjectURL(thumbPreview);
                    if (mainPreview) URL.revokeObjectURL(mainPreview);
                };
            }, [thumbPreview, mainPreview])}
        </div>
    );
};

export default Events;