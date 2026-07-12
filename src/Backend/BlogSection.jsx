import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import axios from 'axios';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://backend.akashbariresort.com';

const BlogSection = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [editingBlog, setEditingBlog] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [imageErrors, setImageErrors] = useState({});
    const [authError, setAuthError] = useState(null);

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#0f0f1a' : '#f8f9fc',
        card: isDarkMode ? '#1a1a2e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#2c3e50',
        textLight: isDarkMode ? '#a0a0a0' : '#6c757d',
        border: isDarkMode ? '#2d2d3d' : '#e9ecef',
        primary: '#5e2e10',
        primaryGradient: 'linear-gradient(135deg, #5e2e10 0%, #8B4513 100%)',
        danger: '#ef4444',
        success: '#10b981',
        warning: '#f59e0b',
        sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b'
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

    // Fixed: Get image URL properly
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        
        // If already a full URL, return as is
        if (imagePath.startsWith('http')) return imagePath;
        
        // Clean the path - remove 'blogs/' prefix if present
        let cleanPath = imagePath;
        if (cleanPath.startsWith('blogs/')) {
            cleanPath = cleanPath.replace('blogs/', '');
        }
        if (cleanPath.startsWith('/blogs/')) {
            cleanPath = cleanPath.replace('/blogs/', '');
        }
        
        // Remove any leading slashes
        cleanPath = cleanPath.replace(/^\/+/, '');
        
        // Remove query parameters if any
        if (cleanPath.includes('?')) {
            cleanPath = cleanPath.split('?')[0];
        }
        
        const baseUrl = BACKEND_URL.replace(/\/$/, '');
        return `${baseUrl}/storage/blogs/${cleanPath}`;
    };

    const handleImageError = (blogId) => {
        if (!imageErrors[blogId]) {
            setImageErrors(prev => ({ ...prev, [blogId]: true }));
        }
    };

    const getFinalImageUrl = (blog) => {
        if (imageErrors[blog.id]) {
            // Return a default placeholder image as data URL
            return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
        }
        const url = getImageUrl(blog.image);
        if (!url) {
            return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
        }
        return url;
    };

    const [newBlog, setNewBlog] = useState({
        title: '',
        author: '',
        category: '',
        excerpt: '',
        status: 'Draft',
        introduction: '',
        conclusion: '',
        sections: [{ title: '', content: '' }]
    });

    const [editBlog, setEditBlog] = useState({
        title: '',
        author: '',
        category: '',
        excerpt: '',
        status: 'Draft',
        introduction: '',
        conclusion: '',
        sections: [{ title: '', content: '' }]
    });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const fetchBlogs = async () => {
        if (!checkAuth()) return;
        
        setLoading(true);
        setAuthError(null);
        
        try {
            const headers = getAuthHeaders();
            const response = await axios.get(`${API_BASE_URL}/blogs`, { headers });
            
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                setAuthError("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }
            
            if (response.data.status === true) {
                setBlogs(response.data.data);
            } else {
                setBlogs([]);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                setAuthError("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
            } else {
                setAuthError("Failed to load blogs. Please try again.");
            }
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const filteredBlogs = blogs.filter(blog =>
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBlogs = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

    const handleViewDetails = (blog) => {
        setSelectedBlog(blog);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBlog(null);
    };

    const handleEditClick = (blog) => {
        setEditingBlog(blog);
        let sections = [];
        try {
            sections = typeof blog.sections === 'string' ? JSON.parse(blog.sections) : (blog.sections || [{ title: '', content: '' }]);
        } catch (e) {
            sections = [{ title: '', content: '' }];
        }
        setEditBlog({
            title: blog.title || '',
            author: blog.author || '',
            category: blog.category || '',
            excerpt: blog.excerpt || '',
            status: blog.status || 'Draft',
            introduction: blog.introduction || '',
            conclusion: blog.conclusion || '',
            sections: sections
        });
        setImagePreview(getImageUrl(blog.image));
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingBlog(null);
        setEditBlog({
            title: '',
            author: '',
            category: '',
            excerpt: '',
            status: 'Draft',
            introduction: '',
            conclusion: '',
            sections: [{ title: '', content: '' }]
        });
        setImagePreview(null);
        setUploadedImage(null);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditBlog({ ...editBlog, [name]: value });
    };

    const handleEditSectionChange = (index, field, value) => {
        const updatedSections = [...editBlog.sections];
        updatedSections[index][field] = value;
        setEditBlog({ ...editBlog, sections: updatedSections });
    };

    const addEditSection = () => {
        setEditBlog({
            ...editBlog,
            sections: [...editBlog.sections, { title: '', content: '' }]
        });
    };

    const removeEditSection = (index) => {
        const updatedSections = editBlog.sections.filter((_, i) => i !== index);
        setEditBlog({ ...editBlog, sections: updatedSections });
    };

    const handleUpdateBlog = async () => {
        if (!checkAuth()) return;
        
        if (!editBlog.title || !editBlog.author || !editBlog.category || !editBlog.excerpt || !editBlog.introduction) {
            showToast('Please fill in all required fields!', 'error');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', editBlog.title);
            formData.append('author', editBlog.author);
            formData.append('category', editBlog.category);
            formData.append('excerpt', editBlog.excerpt);
            formData.append('status', editBlog.status);
            formData.append('introduction', editBlog.introduction);
            formData.append('conclusion', editBlog.conclusion || '');
            formData.append('sections', JSON.stringify(editBlog.sections));
            formData.append('_method', 'PUT');
            
            if (uploadedImage) {
                formData.append('image', uploadedImage);
            }
            
            const headers = getMultipartHeaders();
            const response = await axios.post(`${API_BASE_URL}/blogs/${editingBlog.id}`, formData, { headers });
            
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                showToast("Session expired. Please login again.", 'error');
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }
            
            if (response.data.status === true) {
                showToast('Blog updated successfully!', 'success');
                fetchBlogs();
                handleCloseEditModal();
            } else {
                showToast('Failed to update blog', 'error');
            }
        } catch (error) {
            console.error('Error updating blog:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                showToast("Session expired. Please login again.", 'error');
                setTimeout(() => window.location.href = '/login', 2000);
            } else {
                showToast(error.response?.data?.message || 'Error updating blog.', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlog = async (blogId, blogTitle) => {
        if (!checkAuth()) return;
        if (!window.confirm(`Are you sure you want to delete "${blogTitle}"?`)) return;
        
        setLoading(true);
        try {
            const headers = getAuthHeaders();
            const response = await axios.delete(`${API_BASE_URL}/blogs/${blogId}`, { headers });
            
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                showToast("Session expired. Please login again.", 'error');
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }
            
            if (response.data.status === true) {
                showToast('Blog deleted successfully!', 'success');
                fetchBlogs();
            } else {
                showToast('Failed to delete blog', 'error');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                showToast("Session expired. Please login again.", 'error');
                setTimeout(() => window.location.href = '/login', 2000);
            } else {
                showToast('Error deleting blog.', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddNewBlog = () => {
        setNewBlog({
            title: '',
            author: '',
            category: '',
            excerpt: '',
            status: 'Draft',
            introduction: '',
            conclusion: '',
            sections: [{ title: '', content: '' }]
        });
        setImagePreview(null);
        setUploadedImage(null);
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setNewBlog({
            title: '',
            author: '',
            category: '',
            excerpt: '',
            status: 'Draft',
            introduction: '',
            conclusion: '',
            sections: [{ title: '', content: '' }]
        });
        setImagePreview(null);
        setUploadedImage(null);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showToast('Image size should be less than 5MB', 'error');
                return;
            }
            setUploadedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBlog({ ...newBlog, [name]: value });
    };

    const handleSectionChange = (index, field, value) => {
        const updatedSections = [...newBlog.sections];
        updatedSections[index][field] = value;
        setNewBlog({ ...newBlog, sections: updatedSections });
    };

    const addSection = () => {
        setNewBlog({
            ...newBlog,
            sections: [...newBlog.sections, { title: '', content: '' }]
        });
    };

    const removeSection = (index) => {
        const updatedSections = newBlog.sections.filter((_, i) => i !== index);
        setNewBlog({ ...newBlog, sections: updatedSections });
    };

    const handleSubmitBlog = async () => {
        if (!checkAuth()) return;
        
        if (!newBlog.title || !newBlog.author || !newBlog.category || !newBlog.excerpt || !newBlog.introduction) {
            showToast('Please fill in all required fields!', 'error');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', newBlog.title);
            formData.append('author', newBlog.author);
            formData.append('category', newBlog.category);
            formData.append('excerpt', newBlog.excerpt);
            formData.append('status', newBlog.status);
            formData.append('introduction', newBlog.introduction);
            formData.append('conclusion', newBlog.conclusion || '');
            formData.append('sections', JSON.stringify(newBlog.sections));
            
            if (uploadedImage) {
                formData.append('image', uploadedImage);
            }
            
            const headers = getMultipartHeaders();
            const response = await axios.post(`${API_BASE_URL}/blogs`, formData, { headers });
            
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                showToast("Session expired. Please login again.", 'error');
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }
            
            if (response.data.status === true) {
                showToast('Blog post added successfully!', 'success');
                fetchBlogs();
                handleCloseAddModal();
            } else {
                showToast('Failed to add blog post', 'error');
            }
        } catch (error) {
            console.error('Error adding blog:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                showToast("Session expired. Please login again.", 'error');
                setTimeout(() => window.location.href = '/login', 2000);
            } else {
                showToast(error.response?.data?.message || 'Error adding blog post.', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const totalBlogs = blogs.length;
    const publishedBlogs = blogs.filter(b => b.status === 'Published').length;
    const draftBlogs = blogs.filter(b => b.status === 'Draft').length;
    const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);

    const styles = {
        container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
        mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
        contentScroll: { flex: '1 0 auto', padding: '30px' },
        pageHeader: { marginBottom: '30px' },
        pageTitle: { fontSize: '28px', fontWeight: '700', background: theme.primaryGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' },
        pageSubtitle: { color: theme.textLight, fontSize: '14px' },
        alert: { padding: '12px 20px', backgroundColor: 'rgba(94, 46, 16, 0.15)', color: '#5e2e10', borderRadius: '8px', marginBottom: '20px', fontWeight: '500' },
        statsContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
        statCard: { backgroundColor: theme.card, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.border}`, transition: 'all 0.3s ease', cursor: 'pointer' },
        statIcon: { width: '45px', height: '45px', borderRadius: '12px', background: theme.primaryGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '12px' },
        statValue: { fontSize: '24px', fontWeight: '700', color: theme.text, marginBottom: '4px' },
        statLabel: { fontSize: '13px', color: theme.textLight, fontWeight: '500' },
        toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
        searchBox: { padding: '12px 20px', borderRadius: '12px', border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text, width: '300px', fontSize: '14px', outline: 'none', transition: 'all 0.3s' },
        addBtn: { background: theme.primaryGradient, color: 'white', border: 'none', padding: '12px 28px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(94, 46, 16, 0.3)' },
        blogsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px', marginBottom: '30px' },
        blogCard: { backgroundColor: theme.card, borderRadius: '20px', overflow: 'hidden', border: `1px solid ${theme.border}`, transition: 'all 0.3s ease', position: 'relative' },
        blogImage: { width: '100%', height: '200px', objectFit: 'cover', transition: 'transform 0.5s ease' },
        cardContent: { padding: '20px' },
        blogTitle: { fontSize: '18px', fontWeight: '700', color: theme.text, marginBottom: '8px', lineHeight: '1.4' },
        blogMeta: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', fontSize: '12px', color: theme.textLight },
        categoryBadge: { backgroundColor: `${theme.primary}15`, color: theme.primary, padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', display: 'inline-block' },
        statusBadge: (status) => ({ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', backgroundColor: status === 'Published' ? `${theme.success}20` : `${theme.warning}20`, color: status === 'Published' ? theme.success : theme.warning }),
        blogExcerpt: { fontSize: '13px', color: theme.textLight, lineHeight: '1.5', marginBottom: '16px' },
        cardActions: { display: 'flex', gap: '10px', paddingTop: '16px', borderTop: `1px solid ${theme.border}` },
        actionBtn: { flex: 1, padding: '8px', borderRadius: '10px', border: 'none', cursor: 'pointer', transition: 'all 0.3s', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
        viewBtn: { backgroundColor: `${theme.warning}20`, color: theme.warning },
        editBtn: { backgroundColor: `${theme.primary}20`, color: theme.primary },
        deleteBtn: { backgroundColor: `${theme.danger}20`, color: theme.danger },
        pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '20px' },
        pageBtn: { width: '40px', height: '40px', borderRadius: '10px', border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text, cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        activePage: { background: theme.primaryGradient, color: 'white', border: 'none' },
        emptyState: { textAlign: 'center', padding: '60px', color: theme.textLight },
        loadingSpinner: { textAlign: 'center', padding: '60px', color: theme.textLight },
        modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(8px)' },
        modal: { backgroundColor: theme.card, borderRadius: '24px', width: '800px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' },
        modalHeader: { padding: '24px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: theme.card, zIndex: 1 },
        modalBody: { padding: '24px' },
        modalFooter: { padding: '20px 24px', borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'flex-end', gap: '12px' },
        closeBtn: { background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: theme.text },
        input: { width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.text, fontSize: '14px', outline: 'none', transition: 'all 0.3s' },
        textarea: { width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.text, fontSize: '14px', outline: 'none', resize: 'vertical', minHeight: '80px' },
        label: { display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px', color: theme.text },
        imageUploadArea: { border: `2px dashed ${theme.border}`, borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s', backgroundColor: theme.bg },
        imagePreview: { maxWidth: '100%', maxHeight: '200px', borderRadius: '12px', marginBottom: '12px', objectFit: 'cover' },
        sectionCard: { marginBottom: '16px', padding: '16px', border: `1px solid ${theme.border}`, borderRadius: '12px', backgroundColor: theme.bg },
        toast: { position: 'fixed', bottom: '20px', right: '20px', padding: '12px 20px', borderRadius: '10px', color: 'white', zIndex: 2000, animation: 'slideInRight 0.3s ease' }
    };

    return (
        <div style={styles.container}>
            <style>{`
                .stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(94, 46, 16, 0.15); }
                .blog-card:hover { transform: translateY(-6px); box-shadow: 0 12px 35px rgba(0,0,0,0.2); }
                .blog-card:hover img { transform: scale(1.05); }
                button:hover { transform: translateY(-2px); }
                .search-box:focus { border-color: #5e2e10; box-shadow: 0 0 0 3px rgba(94, 46, 16, 0.1); }
                .blog-card { animation: slideUp 0.3s ease; }
                @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes slideInRight { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            `}</style>

            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="users" />
                <div style={styles.mainArea} className="flex-grow-1">
                    <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />
                    <div style={styles.contentContainer}>
                        <div style={styles.contentScroll}>
                            <div style={styles.pageHeader}>
                                <h1 style={styles.pageTitle}>Blog Management</h1>
                                <p style={styles.pageSubtitle}>Manage and create engaging blog content</p>
                            </div>

                            {/* Auth Error Display */}
                            {authError && (
                                <div style={styles.alert}>
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {authError}
                                </div>
                            )}

                            <div style={styles.statsContainer}>
                                <div className="stat-card" style={styles.statCard}><div style={styles.statIcon}>📝</div><div style={styles.statValue}>{totalBlogs}</div><div style={styles.statLabel}>Total Blogs</div></div>
                                <div className="stat-card" style={styles.statCard}><div style={styles.statIcon}>✅</div><div style={styles.statValue}>{publishedBlogs}</div><div style={styles.statLabel}>Published</div></div>
                                <div className="stat-card" style={styles.statCard}><div style={styles.statIcon}>✏️</div><div style={styles.statValue}>{draftBlogs}</div><div style={styles.statLabel}>Drafts</div></div>
                                <div className="stat-card" style={styles.statCard}><div style={styles.statIcon}>👁️</div><div style={styles.statValue}>{totalViews.toLocaleString()}</div><div style={styles.statLabel}>Total Views</div></div>
                            </div>

                            <div style={styles.toolbar}>
                                <input type="text" placeholder="🔍 Search by title, author, or category..." style={styles.searchBox} className="search-box" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                                <button style={styles.addBtn} onClick={handleAddNewBlog} disabled={loading}><i className="bi bi-plus-circle"></i> Add New Blog</button>
                            </div>

                            {loading && blogs.length === 0 ? (
                                <div style={styles.loadingSpinner}><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div><p style={{ marginTop: '16px' }}>Loading blogs...</p></div>
                            ) : currentBlogs.length > 0 ? (
                                <>
                                    <div style={styles.blogsGrid}>
                                        {currentBlogs.map((blog) => (
                                            <div key={blog.id} className="blog-card" style={styles.blogCard}>
                                                <img src={getFinalImageUrl(blog)} alt={blog.title} style={styles.blogImage} onError={() => handleImageError(blog.id)} />
                                                <div style={styles.cardContent}>
                                                    <h3 style={styles.blogTitle}>{blog.title}</h3>
                                                    <div style={styles.blogMeta}><span>✍️ {blog.author}</span><span>📅 {blog.created_at?.split('T')[0]}</span><span>👁️ {blog.views?.toLocaleString() || 0}</span></div>
                                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}><span style={styles.categoryBadge}>{blog.category}</span><span style={styles.statusBadge(blog.status)}>{blog.status}</span></div>
                                                    <p style={styles.blogExcerpt}>{blog.excerpt?.substring(0, 120)}...</p>
                                                    <div style={styles.cardActions}>
                                                        <button style={{...styles.actionBtn, ...styles.viewBtn}} onClick={() => handleViewDetails(blog)} disabled={loading}><i className="bi bi-eye"></i> View</button>
                                                        <button style={{...styles.actionBtn, ...styles.editBtn}} onClick={() => handleEditClick(blog)} disabled={loading}><i className="bi bi-pencil"></i> Edit</button>
                                                        <button style={{...styles.actionBtn, ...styles.deleteBtn}} onClick={() => handleDeleteBlog(blog.id, blog.title)} disabled={loading}><i className="bi bi-trash"></i> Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {totalPages > 1 && (
                                        <div style={styles.pagination}>
                                            <button style={{...styles.pageBtn, ...(currentPage === 1 && { opacity: 0.5, cursor: 'not-allowed' })}} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>←</button>
                                            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                                let pageNum; if (totalPages <= 5) pageNum = i + 1; else if (currentPage <= 3) pageNum = i + 1; else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i; else pageNum = currentPage - 2 + i;
                                                return (<button key={i} style={{...styles.pageBtn, ...(currentPage === pageNum && styles.activePage)}} onClick={() => setCurrentPage(pageNum)}>{pageNum}</button>);
                                            })}
                                            <button style={{...styles.pageBtn, ...(currentPage === totalPages && { opacity: 0.5, cursor: 'not-allowed' })}} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>→</button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div style={styles.emptyState}><div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div><h4>No Blog Posts Found</h4><p style={{ marginBottom: '20px' }}>{searchTerm ? `No results found for "${searchTerm}"` : 'Start by adding your first blog post'}</p>{!searchTerm && (<button style={styles.addBtn} onClick={handleAddNewBlog}><i className="bi bi-plus-circle"></i> Create First Blog</button>)}</div>
                            )}
                        </div>
                        <Footer theme={theme} />
                    </div>
                </div>
            </div>

            {toast.show && (<div style={{...styles.toast, backgroundColor: toast.type === 'success' ? theme.success : theme.danger}}>{toast.message}</div>)}

            {/* View Modal */}
            {isModalOpen && selectedBlog && (
                <div style={styles.modalOverlay} onClick={handleCloseModal}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}><h3 style={{ margin: 0, color: theme.text }}>Blog Post Details</h3><button style={styles.closeBtn} onClick={handleCloseModal}>×</button></div>
                        <div style={styles.modalBody}>
                            {selectedBlog.image && (<div style={{ marginBottom: '20px', textAlign: 'center' }}><img src={getFinalImageUrl(selectedBlog)} alt={selectedBlog.title} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px' }} onError={() => handleImageError(selectedBlog.id)} /></div>)}
                            <h2 style={{ color: theme.text, marginBottom: '16px' }}>{selectedBlog.title}</h2>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, flexWrap: 'wrap' }}><span>📅 {selectedBlog.created_at?.split('T')[0]}</span><span>✍️ {selectedBlog.author}</span><span>📚 {selectedBlog.category}</span><span>👁️ {selectedBlog.views?.toLocaleString() || 0} views</span></div>
                            <div style={{ backgroundColor: theme.isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa', padding: '16px', borderRadius: '12px', marginBottom: '20px', fontStyle: 'italic' }}><p style={{ margin: 0 }}>{selectedBlog.excerpt}</p></div>
                            {selectedBlog.introduction && (<div style={{ marginBottom: '20px' }}><h4 style={{ marginBottom: '8px', color: theme.text }}>Introduction</h4><p style={{ lineHeight: '1.6' }}>{selectedBlog.introduction}</p></div>)}
                            {(() => { let sections = []; try { sections = typeof selectedBlog.sections === 'string' ? JSON.parse(selectedBlog.sections) : (selectedBlog.sections || []); } catch(e) { sections = []; } return sections.map((section, idx) => (<div key={idx} style={{ marginBottom: '20px' }}><h4 style={{ marginBottom: '8px', color: theme.text }}>{section.title}</h4><p style={{ lineHeight: '1.6' }}>{section.content}</p></div>)); })()}
                            {selectedBlog.conclusion && (<div style={{ marginTop: '20px', padding: '16px', backgroundColor: theme.isDarkMode ? 'rgba(255,255,255,0.05)' : '#e9ecef', borderRadius: '12px' }}><h4 style={{ marginBottom: '8px', color: theme.text }}>Conclusion</h4><p style={{ lineHeight: '1.6' }}>{selectedBlog.conclusion}</p></div>)}
                        </div>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            {isAddModalOpen && (
                <div style={styles.modalOverlay} onClick={handleCloseAddModal}>
                    <div style={{...styles.modal, maxWidth: '900px'}} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}><h3 style={{ margin: 0, color: theme.text }}>Add New Blog Post</h3><button style={styles.closeBtn} onClick={handleCloseAddModal}>×</button></div>
                        <div style={styles.modalBody}>
                            <form onSubmit={(e) => { e.preventDefault(); handleSubmitBlog(); }}>
                                <div className="row g-3">
                                    <div className="col-12"><label style={styles.label}>Featured Image</label><div style={styles.imageUploadArea} onClick={() => document.getElementById('imageUpload').click()}>
                                        {imagePreview ? (<div><img src={imagePreview} alt="Preview" style={styles.imagePreview} /><div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}><button type="button" style={styles.deleteBtn} onClick={() => { setImagePreview(null); setUploadedImage(null); }}>Remove</button><button type="button" style={styles.editBtn} onClick={() => document.getElementById('imageUpload').click()}>Change</button></div></div>) : (<div><div style={{ fontSize: '48px', marginBottom: '10px' }}>📷</div><p>Click to upload an image</p><p style={{ fontSize: '12px', color: theme.textLight }}>Max size: 5MB</p></div>)}
                                        <input id="imageUpload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={loading} />
                                    </div></div>
                                    <div className="col-md-6"><label style={styles.label}>Title *</label><input type="text" name="title" style={styles.input} value={newBlog.title} onChange={handleInputChange} required disabled={loading} /></div>
                                    <div className="col-md-6"><label style={styles.label}>Author *</label><input type="text" name="author" style={styles.input} value={newBlog.author} onChange={handleInputChange} required disabled={loading} /></div>
                                    <div className="col-md-6"><label style={styles.label}>Category *</label><select name="category" style={styles.input} value={newBlog.category} onChange={handleInputChange} required disabled={loading}><option value="">Select Category</option><option value="Suite Tips">Suite Tips</option><option value="Weekend Getaway">Weekend Getaway</option><option value="Suite Review">Suite Review</option><option value="Business Travel">Business Travel</option><option value="Spa & Wellness">Spa & Wellness</option><option value="Room Guide">Room Guide</option></select></div>
                                    <div className="col-md-6"><label style={styles.label}>Status *</label><select name="status" style={styles.input} value={newBlog.status} onChange={handleInputChange} disabled={loading}><option value="Draft">Draft</option><option value="Published">Published</option></select></div>
                                    <div className="col-12"><label style={styles.label}>Excerpt *</label><textarea name="excerpt" style={styles.textarea} value={newBlog.excerpt} onChange={handleInputChange} required disabled={loading} /></div>
                                    <div className="col-12"><label style={styles.label}>Introduction *</label><textarea name="introduction" style={styles.textarea} value={newBlog.introduction} onChange={handleInputChange} required disabled={loading} /></div>
                                    <div className="col-12"><label style={styles.label}>Sections</label>{newBlog.sections.map((section, index) => (<div key={index} style={styles.sectionCard}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}><h5 style={{ margin: 0, color: theme.text }}>Section {index + 1}</h5>{index > 0 && (<button type="button" onClick={() => removeSection(index)} style={styles.deleteBtn} disabled={loading}>Remove</button>)}</div><input type="text" placeholder="Section Title" style={styles.input} value={section.title} onChange={(e) => handleSectionChange(index, 'title', e.target.value)} disabled={loading} /><textarea placeholder="Section Content" style={styles.textarea} value={section.content} onChange={(e) => handleSectionChange(index, 'content', e.target.value)} disabled={loading} /></div>))}<button type="button" onClick={addSection} style={styles.editBtn} disabled={loading}>+ Add Section</button></div>
                                    <div className="col-12"><label style={styles.label}>Conclusion</label><textarea name="conclusion" style={styles.textarea} value={newBlog.conclusion} onChange={handleInputChange} disabled={loading} /></div>
                                </div>
                                <div style={styles.modalFooter}><button type="button" onClick={handleCloseAddModal} style={{...styles.actionBtn, backgroundColor: theme.border, color: theme.text, padding: '10px 24px'}} disabled={loading}>Cancel</button><button type="submit" style={{...styles.addBtn, padding: '10px 32px'}} disabled={loading}>{loading ? 'Submitting...' : 'Submit Blog'}</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && editingBlog && (
                <div style={styles.modalOverlay} onClick={handleCloseEditModal}>
                    <div style={{...styles.modal, maxWidth: '900px'}} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}><h3 style={{ margin: 0, color: theme.text }}>Edit Blog Post</h3><button style={styles.closeBtn} onClick={handleCloseEditModal}>×</button></div>
                        <div style={styles.modalBody}>
                            <form onSubmit={(e) => { e.preventDefault(); handleUpdateBlog(); }}>
                                <div className="row g-3">
                                    <div className="col-12"><label style={styles.label}>Featured Image</label><div style={styles.imageUploadArea} onClick={() => document.getElementById('editImageUpload').click()}>
                                        {imagePreview ? (<div><img src={imagePreview} alt="Preview" style={styles.imagePreview} /><div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}><button type="button" style={styles.deleteBtn} onClick={() => { setImagePreview(null); setUploadedImage(null); }}>Remove</button><button type="button" style={styles.editBtn} onClick={() => document.getElementById('editImageUpload').click()}>Change</button></div></div>) : (<div><div style={{ fontSize: '48px', marginBottom: '10px' }}>📷</div><p>Click to upload an image</p><p style={{ fontSize: '12px', color: theme.textLight }}>Max size: 5MB</p></div>)}
                                        <input id="editImageUpload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={loading} />
                                    </div></div>
                                    <div className="col-md-6"><label style={styles.label}>Title *</label><input type="text" name="title" style={styles.input} value={editBlog.title} onChange={handleEditInputChange} required disabled={loading} /></div>
                                    <div className="col-md-6"><label style={styles.label}>Author *</label><input type="text" name="author" style={styles.input} value={editBlog.author} onChange={handleEditInputChange} required disabled={loading} /></div>
                                    <div className="col-md-6"><label style={styles.label}>Category *</label><select name="category" style={styles.input} value={editBlog.category} onChange={handleEditInputChange} required disabled={loading}><option value="">Select Category</option><option value="Suite Tips">Suite Tips</option><option value="Weekend Getaway">Weekend Getaway</option><option value="Suite Review">Suite Review</option><option value="Business Travel">Business Travel</option><option value="Spa & Wellness">Spa & Wellness</option><option value="Room Guide">Room Guide</option></select></div>
                                    <div className="col-md-6"><label style={styles.label}>Status *</label><select name="status" style={styles.input} value={editBlog.status} onChange={handleEditInputChange} disabled={loading}><option value="Draft">Draft</option><option value="Published">Published</option></select></div>
                                    <div className="col-12"><label style={styles.label}>Excerpt *</label><textarea name="excerpt" style={styles.textarea} value={editBlog.excerpt} onChange={handleEditInputChange} required disabled={loading} /></div>
                                    <div className="col-12"><label style={styles.label}>Introduction *</label><textarea name="introduction" style={styles.textarea} value={editBlog.introduction} onChange={handleEditInputChange} required disabled={loading} /></div>
                                    <div className="col-12"><label style={styles.label}>Sections</label>{editBlog.sections.map((section, index) => (<div key={index} style={styles.sectionCard}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}><h5 style={{ margin: 0, color: theme.text }}>Section {index + 1}</h5>{index > 0 && (<button type="button" onClick={() => removeEditSection(index)} style={styles.deleteBtn} disabled={loading}>Remove</button>)}</div><input type="text" placeholder="Section Title" style={styles.input} value={section.title} onChange={(e) => handleEditSectionChange(index, 'title', e.target.value)} disabled={loading} /><textarea placeholder="Section Content" style={styles.textarea} value={section.content} onChange={(e) => handleEditSectionChange(index, 'content', e.target.value)} disabled={loading} /></div>))}<button type="button" onClick={addEditSection} style={styles.editBtn} disabled={loading}>+ Add Section</button></div>
                                    <div className="col-12"><label style={styles.label}>Conclusion</label><textarea name="conclusion" style={styles.textarea} value={editBlog.conclusion} onChange={handleEditInputChange} disabled={loading} /></div>
                                </div>
                                <div style={styles.modalFooter}><button type="button" onClick={handleCloseEditModal} style={{...styles.actionBtn, backgroundColor: theme.border, color: theme.text, padding: '10px 24px'}} disabled={loading}>Cancel</button><button type="submit" style={{...styles.addBtn, padding: '10px 32px'}} disabled={loading}>{loading ? 'Updating...' : 'Update Blog'}</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogSection;