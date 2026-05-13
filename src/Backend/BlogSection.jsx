import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import axios from 'axios';

// Import images - CORRECTED PATHS
import king1 from '../assets/image/section/Blog/Blog_image-1.webp';
import king2 from '../assets/image/section/Blog/Blog_image-2.webp';
import king3 from '../assets/image/section/Blog/Blog_image-3.webp';
import king4 from '../assets/image/section/Blog/Blog_image-5.webp';
import king5 from '../assets/image/section/Blog/Blog_image-6.webp';
import king6 from '../assets/image/section/Blog/Blog_image-7.webp';

// API Base URL
const API_BASE_URL = 'http://localhost:8000/api';

const BlogSection = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [editingBlog, setEditingBlog] = useState(null);
    
    // Theme setup
    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2',
        sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b'
    };

    // New Blog Form State
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

    // Edit Blog Form State
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

    // Local fallback data
    const localBlogData = [
        {
            id: 1,
            title: "What Makes a Suite Stay Feel Comfortable, Not Complicated",
            slug: "what-makes-a-suite-stay-feel-comfortable",
            excerpt: "Discover the key elements that transform a simple hotel stay into an unforgettable suite experience.",
            image: king1,
            date: "2024-01-15",
            author: "Sarah Johnson",
            category: "Suite Tips",
            readTime: "5 min read",
            status: "Published",
            views: 1245,
            likes: 89,
            introduction: "Walking into a hotel lobby sets the tone for the entire stay.",
            sections: [
                { title: "First Interactions That Matter", content: "Beyond design, the lobby is where guests often have their first interaction with staff." },
                { title: "Comfort Without Complexity", content: "Modern travelers seek simplicity without sacrificing luxury." }
            ],
            conclusion: "Whether you're traveling for business or leisure, a well-designed suite should feel like your home away from home."
        },
        {
            id: 2,
            title: "Planning a Relaxed Weekend Stay at Orrivaa",
            slug: "planning-relaxed-weekend-stay-orrivaa",
            excerpt: "Your ultimate guide to planning the perfect peaceful weekend getaway.",
            image: king2,
            date: "2024-01-10",
            author: "Michael Chen",
            category: "Weekend Getaway",
            readTime: "6 min read",
            status: "Published",
            views: 982,
            likes: 67,
            introduction: "Planning a weekend getaway should be exciting, not stressful.",
            sections: [
                { title: "Choosing Your Perfect Room", content: "From cozy studios to spacious suites, we have options for every type of traveler." },
                { title: "Activities and Relaxation", content: "Balance your weekend with our curated activities." }
            ],
            conclusion: "A well-planned weekend can recharge you for weeks."
        }
    ];

    // Fetch blogs from API
    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/blogs`);
            if (response.data.status === true) {
                setBlogs(response.data.data);
            } else {
                setBlogs(localBlogData);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
            setBlogs(localBlogData);
        } finally {
            setLoading(false);
        }
    };

    // Load blogs on component mount
    useEffect(() => {
        fetchBlogs();
    }, []);

    // Filter blogs based on search
    const filteredBlogs = blogs.filter(blog =>
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
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

    // Handle Edit Blog
    const handleEditClick = (blog) => {
        setEditingBlog(blog);
        setEditBlog({
            title: blog.title,
            author: blog.author,
            category: blog.category,
            excerpt: blog.excerpt,
            status: blog.status,
            introduction: blog.introduction || '',
            conclusion: blog.conclusion || '',
            sections: blog.sections && typeof blog.sections === 'string' ? JSON.parse(blog.sections) : (blog.sections || [{ title: '', content: '' }])
        });
        setImagePreview(blog.image ? `http://localhost:8000/storage/${blog.image}` : null);
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

   

    
    
    // Update blog API - POST method directly (no _method field needed)
const handleUpdateBlog = async () => {
    if (!editBlog.title || !editBlog.author || !editBlog.category || !editBlog.excerpt || !editBlog.introduction) {
        alert('Please fill in all required fields!');
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
        
        if (uploadedImage) {
            formData.append('image', uploadedImage);
        }
        
        //直接用 POST, no _method
        const response = await axios.post(`${API_BASE_URL}/blogs/${editingBlog.id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        if (response.data.status === true) {
            alert('Blog updated successfully!');
            fetchBlogs();
            handleCloseEditModal();
        } else {
            alert('Failed to update blog');
        }
    } catch (error) {
        console.error('Error updating blog:', error);
        if (error.response) {
            alert(error.response.data.message || 'Error updating blog');
        } else {
            alert('Error updating blog. Please try again.');
        }
    } finally {
        setLoading(false);
    }
};

    // Delete blog API
    const handleDeleteBlog = async (blogId, blogTitle) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${blogTitle}"? This action cannot be undone.`);
        
        if (!confirmDelete) return;
        
        setLoading(true);
        try {
            const response = await axios.delete(`${API_BASE_URL}/blogs/${blogId}`);
            
            if (response.data.status === true) {
                alert('Blog deleted successfully!');
                fetchBlogs();
            } else {
                alert('Failed to delete blog');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Error deleting blog. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddNewBlog = () => {
        setIsAddModalOpen(true);
        setImagePreview(null);
        setUploadedImage(null);
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
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setUploadedImage(file);
            };
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

    // Submit blog to API
    const handleSubmitBlog = async () => {
        if (!newBlog.title || !newBlog.author || !newBlog.category || !newBlog.excerpt || !newBlog.introduction) {
            alert('Please fill in all required fields!');
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
            
            const response = await axios.post(`${API_BASE_URL}/blogs`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (response.data.status === true) {
                alert('Blog post added successfully!');
                fetchBlogs();
                handleCloseAddModal();
            } else {
                alert('Failed to add blog post');
            }
        } catch (error) {
            console.error('Error adding blog:', error);
            if (error.response) {
                alert(error.response.data.message || 'Error adding blog post');
            } else {
                alert('Error adding blog post. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    // Styles
    const styles = {
        container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
        mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
        contentScroll: { flex: '1 0 auto', padding: '24px' },
        footerWrapper: { flexShrink: 0 },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: theme.card,
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        },
        th: {
            backgroundColor: theme.isDarkMode ? '#0f3460' : '#f8f9fa',
            padding: '12px 16px',
            textAlign: 'left',
            color: theme.text,
            fontWeight: '600',
            borderBottom: `2px solid ${theme.border}`
        },
        td: {
            padding: '12px 16px',
            color: theme.text,
            borderBottom: `1px solid ${theme.border}`
        },
        viewBtn: {
            backgroundColor: '#ffc107',
            color: '#000',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s',
            marginRight: '5px'
        },
        editBtn: {
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s',
            marginRight: '5px'
        },
        deleteBtn: {
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s'
        },
        addBtn: {
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            marginLeft: '20px',
            transition: 'all 0.3s'
        },
        statusBadge: (status) => ({
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            backgroundColor: status === 'Published' ? '#d4edda' : '#fff3cd',
            color: status === 'Published' ? '#155724' : '#856404'
        }),
        searchBox: {
            padding: '10px 16px',
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.card,
            color: theme.text,
            width: '300px',
            marginBottom: '20px'
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '24px',
            marginBottom: '24px'
        },
        pageBtn: {
            padding: '8px 12px',
            borderRadius: '4px',
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.card,
            color: theme.text,
            cursor: 'pointer',
            transition: 'all 0.3s'
        },
        activePage: {
            backgroundColor: '#ffc107',
            color: '#000',
            borderColor: '#ffc107'
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        },
        modal: {
            backgroundColor: theme.card,
            borderRadius: '12px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        },
        modalHeader: {
            padding: '20px 24px',
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            backgroundColor: theme.card,
            zIndex: 1
        },
        modalBody: {
            padding: '24px'
        },
        closeBtn: {
            background: 'none',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            color: theme.text,
            padding: '0',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.3s'
        },
        input: {
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.bg,
            color: theme.text,
            marginBottom: '16px',
            fontSize: '14px'
        },
        textarea: {
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.bg,
            color: theme.text,
            marginBottom: '16px',
            minHeight: '80px',
            fontSize: '14px'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            color: theme.text,
            fontWeight: '500',
            fontSize: '14px'
        },
        submitBtn: {
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            marginRight: '10px'
        },
        cancelBtn: {
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500'
        },
        imageUploadArea: {
            border: `2px dashed ${theme.border}`,
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '16px',
            transition: 'all 0.3s',
            backgroundColor: theme.bg
        },
        imagePreview: {
            maxWidth: '100%',
            maxHeight: '200px',
            borderRadius: '8px',
            marginBottom: '16px',
            objectFit: 'cover'
        },
        removeImageBtn: {
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            marginTop: '8px'
        },
        loadingSpinner: {
            textAlign: 'center',
            padding: '50px',
            color: theme.text
        },
        actionButtons: {
            display: 'flex',
            gap: '5px',
            flexWrap: 'wrap'
        }
    };

    if (loading && blogs.length === 0) {
        return (
            <div style={styles.loadingSpinner}>
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading blogs...</p>
            </div>
        );
    }

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
                            {/* Header Section */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h2 style={{ color: theme.text }}>Blog Management</h2>
                                    <p style={{ color: theme.text, opacity: 0.7 }}>Manage and view all blog posts</p>
                                </div>
                                <div className="d-flex align-items-center">
                                    <input
                                        type="text"
                                        placeholder="Search by title, author, or category..."
                                        style={styles.searchBox}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <button 
                                        style={styles.addBtn}
                                        onClick={handleAddNewBlog}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
                                    >
                                        + Add New Blog
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div style={{ overflowX: 'auto' }}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>ID</th>
                                            <th style={styles.th}>Image</th>
                                            <th style={styles.th}>Title</th>
                                            <th style={styles.th}>Author</th>
                                            <th style={styles.th}>Category</th>
                                            <th style={styles.th}>Date</th>
                                            <th style={styles.th}>Status</th>
                                            <th style={styles.th}>Views</th>
                                            <th style={styles.th}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentBlogs.map((blog) => (
                                            <tr key={blog.id}>
                                                <td style={styles.td}>{blog.id}</td>
                                                <td style={styles.td}>
                                                    <img 
                                                        src={blog.image ? `http://localhost:8000/storage/${blog.image}` : king1} 
                                                        alt={blog.title}
                                                        style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                                                        onError={(e) => e.target.src = king1}
                                                    />
                                                </td>
                                                <td style={styles.td}>
                                                    <div>
                                                        <strong>{blog.title}</strong>
                                                        <div style={{ fontSize: '12px', opacity: 0.7 }}>{blog.excerpt?.substring(0, 60)}...</div>
                                                    </div>
                                                </td>
                                                <td style={styles.td}>{blog.author}</td>
                                                <td style={styles.td}>
                                                    <span style={{ 
                                                        backgroundColor: theme.isDarkMode ? '#2d3436' : '#e9ecef',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '12px'
                                                    }}>
                                                        {blog.category}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>{blog.date || blog.created_at?.split('T')[0]}</td>
                                                <td style={styles.td}>
                                                    <span style={styles.statusBadge(blog.status)}>
                                                        {blog.status}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>{blog.views?.toLocaleString() || 0}</td>
                                                <td style={styles.td}>
                                                    <div style={styles.actionButtons}>
                                                        <button 
                                                            style={styles.viewBtn}
                                                            onClick={() => handleViewDetails(blog)}
                                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#e0a800'}
                                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#ffc107'}
                                                        >
                                                            View
                                                        </button>
                                                        <button 
                                                            style={styles.editBtn}
                                                            onClick={() => handleEditClick(blog)}
                                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#138496'}
                                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#17a2b8'}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            style={styles.deleteBtn}
                                                            onClick={() => handleDeleteBlog(blog.id, blog.title)}
                                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {filteredBlogs.length > 0 && (
                                <div style={styles.pagination}>
                                    <button 
                                        style={{...styles.pageBtn, ...(currentPage === 1 && { opacity: 0.5, cursor: 'not-allowed' })}}
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index}
                                            style={{
                                                ...styles.pageBtn,
                                                ...(currentPage === index + 1 && styles.activePage)
                                            }}
                                            onClick={() => setCurrentPage(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button 
                                        style={{...styles.pageBtn, ...(currentPage === totalPages && { opacity: 0.5, cursor: 'not-allowed' })}}
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}

                            {/* No Results */}
                            {filteredBlogs.length === 0 && !loading && (
                                <div style={{ textAlign: 'center', padding: '50px', color: theme.text }}>
                                    <p>No blog posts found matching your search.</p>
                                </div>
                            )}
                        </div>

                        <div style={styles.footerWrapper}>
                            <Footer theme={theme} />
                        </div>
                    </div>
                </div>
            </div>

            {/* View Details Modal */}
            {isModalOpen && selectedBlog && (
                <div style={styles.modalOverlay} onClick={handleCloseModal}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={{ margin: 0, color: theme.text }}>Blog Post Details</h3>
                            <button style={styles.closeBtn} onClick={handleCloseModal}>×</button>
                        </div>
                        <div style={styles.modalBody}>
                            {selectedBlog.image && (
                                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                                    <img 
                                        src={selectedBlog.image.startsWith('http') ? selectedBlog.image : `http://localhost:8000/storage/${selectedBlog.image}`}
                                        alt={selectedBlog.title}
                                        style={{ 
                                            maxWidth: '100%', 
                                            maxHeight: '300px', 
                                            borderRadius: '8px',
                                            objectFit: 'cover'
                                        }}
                                        onError={(e) => e.target.src = king1}
                                    />
                                </div>
                            )}
                            <h2 style={{ color: theme.text, marginBottom: '16px' }}>{selectedBlog.title}</h2>
                            <div style={{ 
                                display: 'flex', 
                                gap: '20px', 
                                marginBottom: '20px', 
                                paddingBottom: '16px',
                                borderBottom: `1px solid ${theme.border}`,
                                flexWrap: 'wrap'
                            }}>
                                <span>📅 {selectedBlog.date || selectedBlog.created_at?.split('T')[0]}</span>
                                <span>✍️ {selectedBlog.author}</span>
                                <span>📚 {selectedBlog.category}</span>
                                <span>⏱️ {selectedBlog.read_time || '5 min read'}</span>
                                <span>👁️ {selectedBlog.views?.toLocaleString() || 0} views</span>
                                <span>❤️ {selectedBlog.likes || 0} likes</span>
                            </div>
                            <div style={{ 
                                backgroundColor: theme.isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
                                padding: '16px',
                                borderRadius: '8px',
                                marginBottom: '20px',
                                fontStyle: 'italic'
                            }}>
                                <p style={{ margin: 0 }}>{selectedBlog.excerpt}</p>
                            </div>
                            {selectedBlog.introduction && (
                                <div style={{ marginBottom: '16px' }}>
                                    <h4>Introduction</h4>
                                    <p>{selectedBlog.introduction}</p>
                                </div>
                            )}
                            {selectedBlog.sections && typeof selectedBlog.sections === 'string' && (
                                (() => {
                                    try {
                                        const sections = JSON.parse(selectedBlog.sections);
                                        return sections.map((section, idx) => (
                                            <div key={idx} style={{ marginBottom: '16px' }}>
                                                <h4>{section.title}</h4>
                                                <p>{section.content}</p>
                                            </div>
                                        ));
                                    } catch(e) {
                                        return null;
                                    }
                                })()
                            )}
                            {selectedBlog.sections && Array.isArray(selectedBlog.sections) && selectedBlog.sections.map((section, idx) => (
                                <div key={idx} style={{ marginBottom: '16px' }}>
                                    <h4>{section.title}</h4>
                                    <p>{section.content}</p>
                                </div>
                            ))}
                            {selectedBlog.conclusion && (
                                <div style={{ 
                                    marginTop: '20px',
                                    padding: '16px',
                                    backgroundColor: theme.isDarkMode ? 'rgba(255,255,255,0.05)' : '#e9ecef',
                                    borderRadius: '8px'
                                }}>
                                    <h4>Conclusion</h4>
                                    <p>{selectedBlog.conclusion}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add New Blog Modal */}
            {isAddModalOpen && (
                <div style={styles.modalOverlay} onClick={handleCloseAddModal}>
                    <div style={{...styles.modal, maxWidth: '900px'}} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={{ margin: 0, color: theme.text }}>Add New Blog Post</h3>
                            <button style={styles.closeBtn} onClick={handleCloseAddModal}>×</button>
                        </div>
                        <div style={styles.modalBody}>
                            <form onSubmit={(e) => { e.preventDefault(); handleSubmitBlog(); }}>
                                <div className="row">
                                    <div className="col-12">
                                        <label style={styles.label}>Featured Image</label>
                                        <div style={styles.imageUploadArea}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                style={{ display: 'none' }}
                                                id="imageUpload"
                                            />
                                            {imagePreview ? (
                                                <div>
                                                    <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
                                                    <div>
                                                        <button type="button" style={styles.removeImageBtn} onClick={() => { setImagePreview(null); setUploadedImage(null); }}>Remove Image</button>
                                                        <button type="button" style={{...styles.removeImageBtn, backgroundColor: '#17a2b8', marginLeft: '10px' }} onClick={() => document.getElementById('imageUpload').click()}>Change Image</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div onClick={() => document.getElementById('imageUpload').click()}>
                                                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>📷</div>
                                                    <p>Click to upload an image</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label style={styles.label}>Title *</label>
                                        <input type="text" name="title" style={styles.input} value={newBlog.title} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label style={styles.label}>Author *</label>
                                        <input type="text" name="author" style={styles.input} value={newBlog.author} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label style={styles.label}>Category *</label>
                                        <select name="category" style={styles.input} value={newBlog.category} onChange={handleInputChange} required>
                                            <option value="">Select Category</option>
                                            <option value="Suite Tips">Suite Tips</option>
                                            <option value="Weekend Getaway">Weekend Getaway</option>
                                            <option value="Suite Review">Suite Review</option>
                                            <option value="Business Travel">Business Travel</option>
                                            <option value="Spa & Wellness">Spa & Wellness</option>
                                            <option value="Room Guide">Room Guide</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label style={styles.label}>Status *</label>
                                        <select name="status" style={styles.input} value={newBlog.status} onChange={handleInputChange}>
                                            <option value="Draft">Draft</option>
                                            <option value="Published">Published</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label style={styles.label}>Excerpt *</label>
                                        <textarea name="excerpt" style={styles.textarea} value={newBlog.excerpt} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-12">
                                        <label style={styles.label}>Introduction *</label>
                                        <textarea name="introduction" style={styles.textarea} value={newBlog.introduction} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-12">
                                        <label style={styles.label}>Sections</label>
                                        {newBlog.sections.map((section, index) => (
                                            <div key={index} style={{ marginBottom: '20px', padding: '15px', border: `1px solid ${theme.border}`, borderRadius: '8px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                    <h5>Section {index + 1}</h5>
                                                    {index > 0 && <button type="button" onClick={() => removeSection(index)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>}
                                                </div>
                                                <input type="text" placeholder="Section Title" style={styles.input} value={section.title} onChange={(e) => handleSectionChange(index, 'title', e.target.value)} />
                                                <textarea placeholder="Section Content" style={styles.textarea} value={section.content} onChange={(e) => handleSectionChange(index, 'content', e.target.value)} />
                                            </div>
                                        ))}
                                        <button type="button" onClick={addSection} style={{ backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}>+ Add Section</button>
                                    </div>
                                    <div className="col-12">
                                        <label style={styles.label}>Conclusion</label>
                                        <textarea name="conclusion" style={styles.textarea} value={newBlog.conclusion} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                                    <button type="button" style={styles.cancelBtn} onClick={handleCloseAddModal}>Cancel</button>
                                    <button type="submit" style={styles.submitBtn} disabled={loading}>{loading ? 'Submitting...' : 'Submit Blog'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Blog Modal */}
            {isEditModalOpen && editingBlog && (
                <div style={styles.modalOverlay} onClick={handleCloseEditModal}>
                    <div style={{...styles.modal, maxWidth: '900px'}} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={{ margin: 0, color: theme.text }}>Edit Blog Post</h3>
                            <button style={styles.closeBtn} onClick={handleCloseEditModal}>×</button>
                        </div>
                        <div style={styles.modalBody}>
                            <form onSubmit={(e) => { e.preventDefault(); handleUpdateBlog(); }}>
                                <div className="row">
                                    <div className="col-12">
                                        <label style={styles.label}>Featured Image</label>
                                        <div style={styles.imageUploadArea}>
                                            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} id="editImageUpload" />
                                            {imagePreview ? (
                                                <div>
                                                    <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
                                                    <div>
                                                        <button type="button" style={styles.removeImageBtn} onClick={() => { setImagePreview(null); setUploadedImage(null); }}>Remove Image</button>
                                                        <button type="button" style={{...styles.removeImageBtn, backgroundColor: '#17a2b8', marginLeft: '10px' }} onClick={() => document.getElementById('editImageUpload').click()}>Change Image</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div onClick={() => document.getElementById('editImageUpload').click()}>
                                                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>📷</div>
                                                    <p>Click to upload an image</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label style={styles.label}>Title *</label>
                                        <input type="text" name="title" style={styles.input} value={editBlog.title} onChange={handleEditInputChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label style={styles.label}>Author *</label>
                                        <input type="text" name="author" style={styles.input} value={editBlog.author} onChange={handleEditInputChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label style={styles.label}>Category *</label>
                                        <select name="category" style={styles.input} value={editBlog.category} onChange={handleEditInputChange} required>
                                            <option value="">Select Category</option>
                                            <option value="Suite Tips">Suite Tips</option>
                                            <option value="Weekend Getaway">Weekend Getaway</option>
                                            <option value="Suite Review">Suite Review</option>
                                            <option value="Business Travel">Business Travel</option>
                                            <option value="Spa & Wellness">Spa & Wellness</option>
                                            <option value="Room Guide">Room Guide</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label style={styles.label}>Status *</label>
                                        <select name="status" style={styles.input} value={editBlog.status} onChange={handleEditInputChange}>
                                            <option value="Draft">Draft</option>
                                            <option value="Published">Published</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label style={styles.label}>Excerpt *</label>
                                        <textarea name="excerpt" style={styles.textarea} value={editBlog.excerpt} onChange={handleEditInputChange} required />
                                    </div>
                                    <div className="col-12">
                                        <label style={styles.label}>Introduction *</label>
                                        <textarea name="introduction" style={styles.textarea} value={editBlog.introduction} onChange={handleEditInputChange} required />
                                    </div>
                                    <div className="col-12">
                                        <label style={styles.label}>Sections</label>
                                        {editBlog.sections.map((section, index) => (
                                            <div key={index} style={{ marginBottom: '20px', padding: '15px', border: `1px solid ${theme.border}`, borderRadius: '8px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                    <h5>Section {index + 1}</h5>
                                                    {index > 0 && <button type="button" onClick={() => removeEditSection(index)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>}
                                                </div>
                                                <input type="text" placeholder="Section Title" style={styles.input} value={section.title} onChange={(e) => handleEditSectionChange(index, 'title', e.target.value)} />
                                                <textarea placeholder="Section Content" style={styles.textarea} value={section.content} onChange={(e) => handleEditSectionChange(index, 'content', e.target.value)} />
                                            </div>
                                        ))}
                                        <button type="button" onClick={addEditSection} style={{ backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}>+ Add Section</button>
                                    </div>
                                    <div className="col-12">
                                        <label style={styles.label}>Conclusion</label>
                                        <textarea name="conclusion" style={styles.textarea} value={editBlog.conclusion} onChange={handleEditInputChange} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                                    <button type="button" style={styles.cancelBtn} onClick={handleCloseEditModal}>Cancel</button>
                                    <button type="submit" style={styles.submitBtn} disabled={loading}>{loading ? 'Updating...' : 'Update Blog'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogSection;