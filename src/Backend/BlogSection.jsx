import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
// const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://backend.akashbariresort.com';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const CATEGORIES = ['Suite Tips', 'Weekend Getaway', 'Suite Review', 'Business Travel', 'Spa & Wellness', 'Room Guide'];
const ITEMS_PER_PAGE = 8;
const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";

const EMPTY_BLOG = {
    title: '', author: '', category: '', excerpt: '', status: 'Draft',
    introduction: '', conclusion: '', sections: [{ title: '', content: '' }]
};

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    Role: localStorage.getItem('Role') || 'admin'
});
const getMultipartHeaders = () => ({ ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' });

const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    let cleanPath = imagePath.replace(/^\/?blogs\//, '').replace(/^\/+/, '').split('?')[0];
    return `${BACKEND_URL.replace(/\/$/, '')}/storage/blogs/${cleanPath}`;
};

// ---- Reusable pieces ----

const Modal = ({ theme, title, onClose, children, footer, wide }) => (
    <div
        style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(20,20,30,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000, padding: '20px', animation: 'fadeIn .2s ease'
        }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
    >
        <div style={{
            backgroundColor: theme.card, borderRadius: '18px', width: '100%',
            maxWidth: wide ? '900px' : '700px', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 24px 60px rgba(0,0,0,0.35)', animation: 'slideUp .25s ease'
        }}>
            <div style={{
                padding: '18px 24px', borderBottom: `1px solid ${theme.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                position: 'sticky', top: 0, backgroundColor: theme.card, borderRadius: '18px 18px 0 0'
            }}>
                <h5 style={{ color: theme.text, margin: 0, fontWeight: 600 }}>{title}</h5>
                <button onClick={onClose} style={{
                    background: 'transparent', border: 'none', fontSize: '24px',
                    color: theme.text, opacity: 0.6, cursor: 'pointer'
                }}>✕</button>
            </div>
            <div style={{ padding: '24px', overflowY: 'auto' }}>{children}</div>
            {footer && (
                <div style={{
                    padding: '16px 24px', borderTop: `1px solid ${theme.border}`,
                    display: 'flex', justifyContent: 'flex-end', gap: '10px'
                }}>{footer}</div>
            )}
        </div>
    </div>
);

const Label = ({ theme, children, required }) => (
    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '13px', color: theme.text }}>
        {children} {required && <span style={{ color: theme.text }}>*</span>}
    </label>
);

// Shared form for both Add and Edit blog
const BlogForm = ({ theme, fieldStyle, blog, setBlog, imagePreview, onImageChange, onImageRemove, loading, inputId }) => {
    const setField = (name, value) => setBlog({ ...blog, [name]: value });
    const setSection = (index, field, value) => {
        const sections = [...blog.sections];
        sections[index][field] = value;
        setBlog({ ...blog, sections });
    };
    const addSection = () => setBlog({ ...blog, sections: [...blog.sections, { title: '', content: '' }] });
    const removeSection = (index) => setBlog({ ...blog, sections: blog.sections.filter((_, i) => i !== index) });

    return (
        <div className="row g-3">
            <div className="col-12">
                <Label theme={theme}>Featured Image</Label>
                <div
                    onClick={() => document.getElementById(inputId).click()}
                    style={{ border: `2px dashed ${theme.border}`, borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer', backgroundColor: theme.bg }}
                >
                    {imagePreview ? (
                        <div>
                            <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '12px', marginBottom: '12px', objectFit: 'cover' }} />
                            <div className="d-flex gap-2 justify-content-center">
                                <button type="button" className="btn btn-outline-dark btn-sm" onClick={(e) => { e.stopPropagation(); onImageRemove(); }} disabled={loading}>Remove</button>
                                <button type="button" className="btn btn-outline-dark btn-sm" disabled={loading}>Change</button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ color: theme.textLight }}>
                            <i className="bi bi-image display-6 d-block mb-2"></i>
                            <p className="mb-1">Click to upload an image</p>
                            <p className="mb-0" style={{ fontSize: '12px' }}>Max size: 5MB</p>
                        </div>
                    )}
                    <input id={inputId} type="file" accept="image/*" style={{ display: 'none' }} onChange={onImageChange} disabled={loading} />
                </div>
            </div>

            <div className="col-md-6">
                <Label theme={theme} required>Title</Label>
                <input className="form-control" style={fieldStyle} value={blog.title} onChange={(e) => setField('title', e.target.value)} required disabled={loading} />
            </div>
            <div className="col-md-6">
                <Label theme={theme} required>Author</Label>
                <input className="form-control" style={fieldStyle} value={blog.author} onChange={(e) => setField('author', e.target.value)} required disabled={loading} />
            </div>
            <div className="col-md-6">
                <Label theme={theme} required>Category</Label>
                <select className="form-select" style={fieldStyle} value={blog.category} onChange={(e) => setField('category', e.target.value)} required disabled={loading}>
                    <option value="">Select Category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div className="col-md-6">
                <Label theme={theme} required>Status</Label>
                <select className="form-select" style={fieldStyle} value={blog.status} onChange={(e) => setField('status', e.target.value)} disabled={loading}>
                    {/* Visitor er Pending/Rejected blog edit korle status silently Draft hoye jabe na */}
                    {['Pending', 'Rejected'].includes(blog.status) && <option value={blog.status}>{blog.status}</option>}
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                </select>
            </div>
            <div className="col-12">
                <Label theme={theme} required>Excerpt</Label>
                <textarea className="form-control" rows="2" style={{ ...fieldStyle, minHeight: '70px' }} value={blog.excerpt} onChange={(e) => setField('excerpt', e.target.value)} required disabled={loading} />
            </div>
            <div className="col-12">
                <Label theme={theme} required>Introduction</Label>
                <textarea className="form-control" rows="3" style={{ ...fieldStyle, minHeight: '80px' }} value={blog.introduction} onChange={(e) => setField('introduction', e.target.value)} required disabled={loading} />
            </div>

            <div className="col-12">
                <Label theme={theme}>Sections</Label>
                {blog.sections.map((section, i) => (
                    <div key={i} style={{ marginBottom: '14px', padding: '14px', border: `1px solid ${theme.border}`, borderRadius: '12px', backgroundColor: theme.bg }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong style={{ color: theme.text, fontSize: '14px' }}>Section {i + 1}</strong>
                            {i > 0 && (
                                <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => removeSection(i)} disabled={loading}>Remove</button>
                            )}
                        </div>
                        <input className="form-control mb-2" style={fieldStyle} placeholder="Section Title" value={section.title} onChange={(e) => setSection(i, 'title', e.target.value)} disabled={loading} />
                        <textarea className="form-control" rows="2" style={{ ...fieldStyle, minHeight: '60px' }} placeholder="Section Content" value={section.content} onChange={(e) => setSection(i, 'content', e.target.value)} disabled={loading} />
                    </div>
                ))}
                <button type="button" className="btn btn-sm btn-outline-dark" onClick={addSection} disabled={loading}>
                    <i className="bi bi-plus-circle me-1"></i> Add Section
                </button>
            </div>

            <div className="col-12">
                <Label theme={theme}>Conclusion</Label>
                <textarea className="form-control" rows="2" style={{ ...fieldStyle, minHeight: '70px' }} value={blog.conclusion} onChange={(e) => setField('conclusion', e.target.value)} disabled={loading} />
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------

const BlogSection = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [imageErrors, setImageErrors] = useState({});

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [viewingBlog, setViewingBlog] = useState(null);
    const [editingBlog, setEditingBlog] = useState(null);
    const [deletingBlog, setDeletingBlog] = useState(null);
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Visitor blog reject korar jonno
    const [rejectingBlog, setRejectingBlog] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    const [newBlog, setNewBlog] = useState(EMPTY_BLOG);
    const [editBlog, setEditBlog] = useState(EMPTY_BLOG);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);

    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#0a0a0a' : '#f5f5f5',
        card: isDarkMode ? '#141414' : '#ffffff',
        text: isDarkMode ? '#f5f5f5' : '#111111',
        textLight: isDarkMode ? '#a3a3a3' : '#6b6b6b',
        border: isDarkMode ? '#2b2b2b' : '#dcdcdc'
    };
    // Single black/white accent used in place of the old colored theme keys
    const accent = theme.text;
    const accentOn = theme.card;

    const fieldStyle = {
        backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}`,
        borderRadius: '10px', padding: '10px 14px', fontSize: '14px'
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const handleAuthFailure = (message) => {
        localStorage.removeItem('token');
        localStorage.removeItem('Role');
        setAuthError(message);
        showToast(message, 'error');
        setTimeout(() => { window.location.href = '/login'; }, 2000);
    };

    const checkAuth = () => {
        if (!localStorage.getItem('token')) {
            setAuthError('Please login to access this page');
            setTimeout(() => { window.location.href = '/login'; }, 2000);
            return false;
        }
        return true;
    };

    const getFinalImageUrl = (blog) => {
        if (imageErrors[blog.id]) return PLACEHOLDER_IMG;
        return getImageUrl(blog.image) || PLACEHOLDER_IMG;
    };

    const fetchBlogs = async () => {
        if (!checkAuth()) return;
        setLoading(true);
        setAuthError(null);
        try {
            const res = await axios.get(`${API_BASE_URL}/blogs`, { headers: getAuthHeaders() });
            setBlogs(res.data.status === true ? res.data.data : []);
        } catch (err) {
            console.error('Error fetching blogs:', err);
            if (err.response?.status === 401) {
                handleAuthFailure('Session expired. Please login again.');
            } else {
                setAuthError('Failed to load blogs. Please try again.');
            }
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBlogs(); }, []);

    const filteredBlogs = blogs.filter(b =>
        [b.title, b.author, b.category].some(f => f?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
    const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentBlogs = filteredBlogs.slice(indexOfFirstItem, indexOfFirstItem + ITEMS_PER_PAGE);

    const totalBlogs = blogs.length;
    const publishedBlogs = blogs.filter(b => b.status === 'Published').length;
    const draftBlogs = blogs.filter(b => b.status === 'Draft').length;
    const pendingBlogs = blogs.filter(b => b.status === 'Pending').length;
    const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);

    const parseSections = (raw) => {
        try {
            return typeof raw === 'string' ? JSON.parse(raw) : (raw || [{ title: '', content: '' }]);
        } catch {
            return [{ title: '', content: '' }];
        }
    };

    const openAddModal = () => {
        setNewBlog(EMPTY_BLOG);
        setImagePreview(null);
        setUploadedImage(null);
        setIsAddOpen(true);
    };
    const closeAddModal = () => { setIsAddOpen(false); setImagePreview(null); setUploadedImage(null); };

    const openEditModal = (blog) => {
        setEditingBlog(blog);
        setEditBlog({
            title: blog.title || '', author: blog.author || '', category: blog.category || '',
            excerpt: blog.excerpt || '', status: blog.status || 'Draft',
            introduction: blog.introduction || '', conclusion: blog.conclusion || '',
            sections: parseSections(blog.sections)
        });
        setImagePreview(getImageUrl(blog.image));
        setUploadedImage(null);
    };
    const closeEditModal = () => { setEditingBlog(null); setImagePreview(null); setUploadedImage(null); };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) return showToast('Image size should be less than 5MB', 'error');
        setUploadedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };
    const handleImageRemove = () => { setImagePreview(null); setUploadedImage(null); };

    const buildFormData = (blog) => {
        const fd = new FormData();
        Object.entries(blog).forEach(([key, val]) => {
            if (key === 'sections') fd.append('sections', JSON.stringify(val));
            else fd.append(key, val ?? '');
        });
        if (uploadedImage) fd.append('image', uploadedImage);
        return fd;
    };

    const handleSubmitBlog = async (e) => {
        e.preventDefault();
        if (!checkAuth()) return;
        if (!newBlog.title || !newBlog.author || !newBlog.category || !newBlog.excerpt || !newBlog.introduction) {
            return showToast('Please fill in all required fields!', 'error');
        }
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/blogs`, buildFormData(newBlog), { headers: getMultipartHeaders() });
            if (res.data.status === true) {
                showToast('Blog post added successfully!');
                fetchBlogs();
                closeAddModal();
            } else {
                showToast('Failed to add blog post', 'error');
            }
        } catch (err) {
            console.error('Error adding blog:', err);
            if (err.response?.status === 401) handleAuthFailure('Session expired. Please login again.');
            else showToast(err.response?.data?.message || 'Error adding blog post.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBlog = async (e) => {
        e.preventDefault();
        if (!checkAuth()) return;
        if (!editBlog.title || !editBlog.author || !editBlog.category || !editBlog.excerpt || !editBlog.introduction) {
            return showToast('Please fill in all required fields!', 'error');
        }
        setLoading(true);
        try {
            const fd = buildFormData(editBlog);
            // NOTE: '_method' PUT lagano hoyni, karon route e shudhu POST ache
            const res = await axios.post(`${API_BASE_URL}/blogs/${editingBlog.id}`, fd, { headers: getMultipartHeaders() });
            if (res.data.status === true) {
                showToast('Blog updated successfully!');
                fetchBlogs();
                closeEditModal();
            } else {
                showToast('Failed to update blog', 'error');
            }
        } catch (err) {
            console.error('Error updating blog:', err);
            if (err.response?.status === 401) handleAuthFailure('Session expired. Please login again.');
            else showToast(err.response?.data?.message || 'Error updating blog.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deletingBlog || !checkAuth()) return;
        setLoading(true);
        try {
            const res = await axios.delete(`${API_BASE_URL}/blogs/${deletingBlog.id}`, { headers: getAuthHeaders() });
            if (res.data.status === true) {
                showToast('Blog deleted successfully!');
                fetchBlogs();
            } else {
                showToast('Failed to delete blog', 'error');
            }
            setDeletingBlog(null);
        } catch (err) {
            console.error('Error deleting blog:', err);
            if (err.response?.status === 401) handleAuthFailure('Session expired. Please login again.');
            else showToast('Error deleting blog.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Approve (Published) / Reject (Rejected + reason)
    const updateBlogStatus = async (blog, status, reason = null) => {
        if (!checkAuth()) return;
        setLoading(true);
        try {
            const res = await axios.patch(
                `${API_BASE_URL}/blogs/${blog.id}/status`,
                { status, rejection_reason: reason },
                { headers: getAuthHeaders() }
            );
            if (res.data.status === true) {
                showToast(status === 'Published' ? 'Blog approved and published!' : 'Blog rejected');
                setViewingBlog(null);
                setRejectingBlog(null);
                setRejectReason('');
                fetchBlogs();
            } else {
                showToast('Failed to update status', 'error');
            }
        } catch (err) {
            console.error('Error updating status:', err);
            if (err.response?.status === 401) handleAuthFailure('Session expired. Please login again.');
            else showToast(err.response?.data?.message || 'Error updating status.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const closeRejectModal = () => { setRejectingBlog(null); setRejectReason(''); };

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }} className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="users" />

                <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="flex-grow-1">
                    <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '28px' }}>
                            <div style={{ marginBottom: '26px' }}>
                                <h1 style={{ fontSize: '26px', fontWeight: 700, color: theme.text, margin: 0 }}>Blog Management</h1>
                                <p style={{ color: theme.textLight, margin: '4px 0 0' }}>Manage and create engaging blog content</p>
                            </div>

                            {authError && (
                                <div className="alert" role="alert" style={{ border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text }}>
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>{authError}
                                </div>
                            )}

                            {/* Stats */}
                            <div className="row g-3 mb-4">
                                {[
                                    { label: 'Total Blogs', value: totalBlogs },
                                    { label: 'Published', value: publishedBlogs },
                                    { label: 'Drafts', value: draftBlogs },
                                    { label: 'Pending', value: pendingBlogs },
                                    { label: 'Total Views', value: totalViews.toLocaleString() }
                                ].map(stat => (
                                    <div className="col-6 col-md" key={stat.label}>
                                        <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '18px' }}>
                                            <div style={{ fontSize: '22px', fontWeight: 700, color: theme.text }}>{stat.value}</div>
                                            <div style={{ fontSize: '13px', color: theme.textLight, fontWeight: 500 }}>{stat.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Toolbar */}
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                                <input
                                    type="text"
                                    placeholder="Search by title, author, or category..."
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                    style={{ ...fieldStyle, width: '320px' }}
                                />
                                <button className="btn" style={{ backgroundColor: accent, color: accentOn }} onClick={openAddModal} disabled={loading}>
                                    <i className="bi bi-plus-circle me-2"></i>Add New Blog
                                </button>
                            </div>

                            {loading && blogs.length === 0 ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border" style={{ color: accent }} role="status"></div>
                                    <p className="mt-3" style={{ color: theme.textLight }}>Loading blogs...</p>
                                </div>
                            ) : currentBlogs.length > 0 ? (
                                <>
                                    <div className="row g-3">
                                        {currentBlogs.map(blog => (
                                            <div className="col-6 col-md-4 col-lg-3" key={blog.id}>
                                                <div style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '18px', overflow: 'hidden', height: '100%' }}>
                                                    <img src={getFinalImageUrl(blog)} alt={blog.title} onError={() => setImageErrors(prev => ({ ...prev, [blog.id]: true }))} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                                                    <div style={{ padding: '18px' }}>
                                                        <h3 style={{ fontSize: '17px', fontWeight: 700, color: theme.text, marginBottom: '8px' }}>{blog.title}</h3>
                                                        <div style={{ fontSize: '12px', color: theme.textLight, marginBottom: '10px' }}>
                                                            {blog.author} • {blog.created_at?.split('T')[0]} • {blog.views?.toLocaleString() || 0} views
                                                        </div>
                                                        <div className="d-flex gap-2 flex-wrap mb-2">
                                                            <span style={{ border: `1px solid ${theme.border}`, color: theme.textLight, padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>{blog.category}</span>
                                                            <span style={{
                                                                border: `1px solid ${accent}`,
                                                                backgroundColor: blog.status === 'Published' ? accent : 'transparent',
                                                                color: blog.status === 'Published' ? accentOn : accent,
                                                                padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600
                                                            }}>{blog.status}</span>
                                                        </div>
                                                        <p style={{ fontSize: '13px', color: theme.textLight, lineHeight: 1.5, marginBottom: '14px' }}>
                                                            {blog.excerpt?.substring(0, 110)}...
                                                        </p>
                                                        <div className="d-flex gap-2" style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '12px' }}>
                                                            <button className="btn btn-sm btn-outline-dark flex-fill" onClick={() => setViewingBlog(blog)} disabled={loading}><i className="bi bi-eye"></i> View</button>
                                                            <button className="btn btn-sm btn-outline-dark flex-fill" onClick={() => openEditModal(blog)} disabled={loading}><i className="bi bi-pencil"></i> Edit</button>
                                                            <button className="btn btn-sm btn-outline-dark flex-fill" onClick={() => setDeletingBlog(blog)} disabled={loading}><i className="bi bi-trash"></i> Delete</button>
                                                        </div>

                                                        {/* Pending blog: Approve / Reject */}
                                                        {blog.status === 'Pending' && (
                                                            <div className="d-flex gap-2 mt-2">
                                                                <button
                                                                    className="btn btn-sm flex-fill"
                                                                    style={{ backgroundColor: accent, color: accentOn }}
                                                                    onClick={() => updateBlogStatus(blog, 'Published')}
                                                                    disabled={loading}
                                                                >
                                                                    <i className="bi bi-check-lg"></i> Approve
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-outline-dark flex-fill"
                                                                    onClick={() => setRejectingBlog(blog)}
                                                                    disabled={loading}
                                                                >
                                                                    <i className="bi bi-x-lg"></i> Reject
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="d-flex justify-content-center gap-2 mt-4">
                                            <button className="btn btn-sm" style={{ border: `1px solid ${theme.border}`, color: theme.text, opacity: currentPage === 1 ? 0.5 : 1 }} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>←</button>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                                                <button
                                                    key={num}
                                                    className="btn btn-sm"
                                                    style={{ border: `1px solid ${theme.border}`, backgroundColor: currentPage === num ? accent : 'transparent', color: currentPage === num ? accentOn : theme.text }}
                                                    onClick={() => setCurrentPage(num)}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                            <button className="btn btn-sm" style={{ border: `1px solid ${theme.border}`, color: theme.text, opacity: currentPage === totalPages ? 0.5 : 1 }} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>→</button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-5" style={{ color: theme.textLight }}>
                                    <i className="bi bi-inbox display-4 d-block mb-3" style={{ opacity: 0.4 }}></i>
                                    <h5 style={{ color: theme.text }}>No Blog Posts Found</h5>
                                    <p className="mb-3">{searchTerm ? `No results found for "${searchTerm}"` : 'Start by adding your first blog post'}</p>
                                    {!searchTerm && (
                                        <button className="btn" style={{ backgroundColor: accent, color: accentOn }} onClick={openAddModal}>
                                            <i className="bi bi-plus-circle me-2"></i>Create First Blog
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        <Footer theme={theme} />
                    </div>
                </div>
            </div>

            {/* View Modal */}
            {viewingBlog && (
                <Modal
                    theme={theme}
                    title="Blog Post Details"
                    onClose={() => setViewingBlog(null)}
                    wide
                    footer={viewingBlog.status === 'Pending' ? (
                        <>
                            <button className="btn btn-outline-dark" onClick={() => setRejectingBlog(viewingBlog)} disabled={loading}>Reject</button>
                            <button
                                className="btn"
                                style={{ backgroundColor: accent, color: accentOn }}
                                onClick={() => updateBlogStatus(viewingBlog, 'Published')}
                                disabled={loading}
                            >
                                {loading ? 'Publishing...' : 'Approve & publish'}
                            </button>
                        </>
                    ) : null}
                >
                    {viewingBlog.image && (
                        <div className="text-center mb-4">
                            <img src={getFinalImageUrl(viewingBlog)} alt={viewingBlog.title} onError={() => setImageErrors(prev => ({ ...prev, [viewingBlog.id]: true }))} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px' }} />
                        </div>
                    )}
                    <h2 style={{ color: theme.text, marginBottom: '14px' }}>{viewingBlog.title}</h2>

                    {viewingBlog.status === 'Rejected' && viewingBlog.rejection_reason && (
                        <div style={{ border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', color: theme.text, fontSize: '14px' }}>
                            <strong>Rejection reason:</strong> {viewingBlog.rejection_reason}
                        </div>
                    )}

                    <div className="d-flex flex-wrap gap-3 mb-3 pb-3" style={{ borderBottom: `1px solid ${theme.border}`, color: theme.textLight, fontSize: '13px' }}>
                        <span>{viewingBlog.created_at?.split('T')[0]}</span>
                        <span>{viewingBlog.author}</span>
                        <span>{viewingBlog.category}</span>
                        <span>{viewingBlog.status}</span>
                        <span>{viewingBlog.views?.toLocaleString() || 0} views</span>
                    </div>
                    <div style={{ backgroundColor: theme.bg, padding: '14px', borderRadius: '12px', marginBottom: '18px', fontStyle: 'italic', color: theme.text }}>
                        {viewingBlog.excerpt}
                    </div>
                    {viewingBlog.introduction && (
                        <div className="mb-3">
                            <h5 style={{ color: theme.text }}>Introduction</h5>
                            <p style={{ color: theme.text, lineHeight: 1.6 }}>{viewingBlog.introduction}</p>
                        </div>
                    )}
                    {parseSections(viewingBlog.sections).map((section, idx) => (
                        <div className="mb-3" key={idx}>
                            <h5 style={{ color: theme.text }}>{section.title}</h5>
                            <p style={{ color: theme.text, lineHeight: 1.6 }}>{section.content}</p>
                        </div>
                    ))}
                    {viewingBlog.conclusion && (
                        <div style={{ backgroundColor: theme.bg, padding: '14px', borderRadius: '12px' }}>
                            <h5 style={{ color: theme.text }}>Conclusion</h5>
                            <p style={{ color: theme.text, lineHeight: 1.6, margin: 0 }}>{viewingBlog.conclusion}</p>
                        </div>
                    )}
                </Modal>
            )}

            {/* Add Modal */}
            {isAddOpen && (
                <form onSubmit={handleSubmitBlog}>
                    <Modal
                        theme={theme}
                        title="Add New Blog Post"
                        onClose={closeAddModal}
                        wide
                        footer={<>
                            <button type="button" className="btn btn-outline-dark" onClick={closeAddModal} disabled={loading}>Cancel</button>
                            <button type="submit" className="btn" style={{ backgroundColor: accent, color: accentOn }} disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Blog'}
                            </button>
                        </>}
                    >
                        <BlogForm theme={theme} fieldStyle={fieldStyle} blog={newBlog} setBlog={setNewBlog} imagePreview={imagePreview} onImageChange={handleImageChange} onImageRemove={handleImageRemove} loading={loading} inputId="addImageUpload" />
                    </Modal>
                </form>
            )}

            {/* Edit Modal */}
            {editingBlog && (
                <form onSubmit={handleUpdateBlog}>
                    <Modal
                        theme={theme}
                        title="Edit Blog Post"
                        onClose={closeEditModal}
                        wide
                        footer={<>
                            <button type="button" className="btn btn-outline-dark" onClick={closeEditModal} disabled={loading}>Cancel</button>
                            <button type="submit" className="btn" style={{ backgroundColor: accent, color: accentOn }} disabled={loading}>
                                {loading ? 'Updating...' : 'Update Blog'}
                            </button>
                        </>}
                    >
                        <BlogForm theme={theme} fieldStyle={fieldStyle} blog={editBlog} setBlog={setEditBlog} imagePreview={imagePreview} onImageChange={handleImageChange} onImageRemove={handleImageRemove} loading={loading} inputId="editImageUpload" />
                    </Modal>
                </form>
            )}

            {/* Delete Confirmation Modal */}
            {deletingBlog && (
                <div
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 2000, padding: '20px', animation: 'fadeIn .2s ease'
                    }}
                    onClick={(e) => e.target === e.currentTarget && !loading && setDeletingBlog(null)}
                >
                    <div style={{
                        backgroundColor: theme.card, color: theme.text,
                        border: `1px solid ${theme.border}`, borderRadius: '16px',
                        width: '100%', maxWidth: '380px', padding: '28px 26px', textAlign: 'center',
                        animation: 'slideUp .2s ease'
                    }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            border: `1.5px solid ${accent}`, color: accent,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px', fontSize: '20px'
                        }}>
                            <i className="bi bi-trash"></i>
                        </div>
                        <h5 style={{ margin: '0 0 8px', fontWeight: 600 }}>Delete this blog?</h5>
                        <p style={{ margin: '0 0 22px', color: theme.textLight, fontSize: '14px' }}>
                            "{deletingBlog.title}" will be permanently removed. This can't be undone.
                        </p>
                        <div className="d-flex gap-2">
                            <button
                                onClick={() => setDeletingBlog(null)}
                                disabled={loading}
                                className="btn flex-fill"
                                style={{ border: `1px solid ${theme.border}`, color: theme.text, backgroundColor: 'transparent' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={loading}
                                className="btn flex-fill"
                                style={{ backgroundColor: accent, color: accentOn, border: 'none' }}
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {rejectingBlog && (
                <Modal
                    theme={theme}
                    title="Reject this blog"
                    onClose={closeRejectModal}
                    footer={<>
                        <button className="btn btn-outline-dark" onClick={closeRejectModal} disabled={loading}>Cancel</button>
                        <button
                            className="btn"
                            style={{ backgroundColor: accent, color: accentOn }}
                            onClick={() => updateBlogStatus(rejectingBlog, 'Rejected', rejectReason.trim())}
                            disabled={loading || !rejectReason.trim()}
                        >
                            {loading ? 'Rejecting...' : 'Reject blog'}
                        </button>
                    </>}
                >
                    <p style={{ color: theme.textLight, fontSize: '14px' }}>
                        Tell the author why "{rejectingBlog.title}" was rejected.
                    </p>
                    <textarea
                        className="form-control"
                        rows="3"
                        maxLength={500}
                        placeholder="Reason for rejection"
                        style={fieldStyle}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                </Modal>
            )}

            {/* Toast */}
            {toast.show && (
                <div style={{
                    position: 'fixed', bottom: '20px', right: '20px', zIndex: 2100,
                    padding: '12px 20px', borderRadius: '10px', color: accentOn, fontSize: '14px',
                    backgroundColor: accent
                }}>
                    {toast.message}
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .form-control, .form-select {
                    background-color: ${theme.bg} !important;
                    color: ${theme.text} !important;
                    border-color: ${theme.border} !important;
                }
                .form-control:focus, .form-select:focus {
                    box-shadow: 0 0 0 3px ${accent}26;
                    border-color: ${accent};
                }
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: ${theme.bg}; }
                ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default BlogSection;