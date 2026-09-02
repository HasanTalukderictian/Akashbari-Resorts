// import React, { useState, useEffect } from 'react';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import Footer from './Footer';
// import axios from 'axios';

// // API Base URL
// const API_BASE_URL = import.meta.env.VITE_BASE_URL;
// const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://backend.akashbariresort.com';

// const BlogSection = ({ theme: propsTheme }) => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(false);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [selectedBlog, setSelectedBlog] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage] = useState(6);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [uploadedImage, setUploadedImage] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [blogs, setBlogs] = useState([]);
//     const [editingBlog, setEditingBlog] = useState(null);
//     const [toast, setToast] = useState({ show: false, message: '', type: '' });
//     const [imageErrors, setImageErrors] = useState({});
//     const [authError, setAuthError] = useState(null);

//     const theme = propsTheme || {
//         isDarkMode,
//         bg: isDarkMode ? '#0f0f1a' : '#f8f9fc',
//         card: isDarkMode ? '#1a1a2e' : '#ffffff',
//         text: isDarkMode ? '#e9ecef' : '#2c3e50',
//         textLight: isDarkMode ? '#a0a0a0' : '#6c757d',
//         border: isDarkMode ? '#2d2d3d' : '#e9ecef',
//         primary: '#5e2e10',
//         primaryGradient: 'linear-gradient(135deg, #5e2e10 0%, #8B4513 100%)',
//         danger: '#ef4444',
//         success: '#10b981',
//         warning: '#f59e0b',
//         sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b'
//     };

//     // Get authentication headers
//     const getAuthHeaders = () => {
//         const token = localStorage.getItem('token');
//         return {
//             'Authorization': `Bearer ${token}`,
//             'Role': localStorage.getItem('Role') || 'admin'
//         };
//     };

//     // Get multipart headers for file upload
//     const getMultipartHeaders = () => {
//         const token = localStorage.getItem('token');
//         return {
//             'Authorization': `Bearer ${token}`,
//             'Role': localStorage.getItem('Role') || 'admin',
//             'Content-Type': 'multipart/form-data'
//         };
//     };

//     // Check authentication
//     const checkAuth = () => {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             setAuthError("Please login to access this page");
//             setTimeout(() => window.location.href = '/login', 2000);
//             return false;
//         }
//         return true;
//     };

//     // Fixed: Get image URL properly
//     const getImageUrl = (imagePath) => {
//         if (!imagePath) return null;
        
//         // If already a full URL, return as is
//         if (imagePath.startsWith('http')) return imagePath;
        
//         // Clean the path - remove 'blogs/' prefix if present
//         let cleanPath = imagePath;
//         if (cleanPath.startsWith('blogs/')) {
//             cleanPath = cleanPath.replace('blogs/', '');
//         }
//         if (cleanPath.startsWith('/blogs/')) {
//             cleanPath = cleanPath.replace('/blogs/', '');
//         }
        
//         // Remove any leading slashes
//         cleanPath = cleanPath.replace(/^\/+/, '');
        
//         // Remove query parameters if any
//         if (cleanPath.includes('?')) {
//             cleanPath = cleanPath.split('?')[0];
//         }
        
//         const baseUrl = BACKEND_URL.replace(/\/$/, '');
//         return `${baseUrl}/storage/blogs/${cleanPath}`;
//     };

//     const handleImageError = (blogId) => {
//         if (!imageErrors[blogId]) {
//             setImageErrors(prev => ({ ...prev, [blogId]: true }));
//         }
//     };

//     const getFinalImageUrl = (blog) => {
//         if (imageErrors[blog.id]) {
//             // Return a default placeholder image as data URL
//             return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
//         }
//         const url = getImageUrl(blog.image);
//         if (!url) {
//             return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
//         }
//         return url;
//     };

//     const [newBlog, setNewBlog] = useState({
//         title: '',
//         author: '',
//         category: '',
//         excerpt: '',
//         status: 'Draft',
//         introduction: '',
//         conclusion: '',
//         sections: [{ title: '', content: '' }]
//     });

//     const [editBlog, setEditBlog] = useState({
//         title: '',
//         author: '',
//         category: '',
//         excerpt: '',
//         status: 'Draft',
//         introduction: '',
//         conclusion: '',
//         sections: [{ title: '', content: '' }]
//     });

//     const showToast = (message, type = 'success') => {
//         setToast({ show: true, message, type });
//         setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
//     };

//     const fetchBlogs = async () => {
//         if (!checkAuth()) return;
        
//         setLoading(true);
//         setAuthError(null);
        
//         try {
//             const headers = getAuthHeaders();
//             const response = await axios.get(`${API_BASE_URL}/blogs`, { headers });
            
//             if (response.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 setAuthError("Session expired. Please login again.");
//                 setTimeout(() => window.location.href = '/login', 2000);
//                 return;
//             }
            
//             if (response.data.status === true) {
//                 setBlogs(response.data.data);
//             } else {
//                 setBlogs([]);
//             }
//         } catch (error) {
//             console.error('Error fetching blogs:', error);
//             if (error.response?.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 setAuthError("Session expired. Please login again.");
//                 setTimeout(() => window.location.href = '/login', 2000);
//             } else {
//                 setAuthError("Failed to load blogs. Please try again.");
//             }
//             setBlogs([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchBlogs();
//     }, []);

//     const filteredBlogs = blogs.filter(blog =>
//         blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         blog.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         blog.category?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentBlogs = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

//     const handleViewDetails = (blog) => {
//         setSelectedBlog(blog);
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         setSelectedBlog(null);
//     };

//     const handleEditClick = (blog) => {
//         setEditingBlog(blog);
//         let sections = [];
//         try {
//             sections = typeof blog.sections === 'string' ? JSON.parse(blog.sections) : (blog.sections || [{ title: '', content: '' }]);
//         } catch (e) {
//             sections = [{ title: '', content: '' }];
//         }
//         setEditBlog({
//             title: blog.title || '',
//             author: blog.author || '',
//             category: blog.category || '',
//             excerpt: blog.excerpt || '',
//             status: blog.status || 'Draft',
//             introduction: blog.introduction || '',
//             conclusion: blog.conclusion || '',
//             sections: sections
//         });
//         setImagePreview(getImageUrl(blog.image));
//         setIsEditModalOpen(true);
//     };

//     const handleCloseEditModal = () => {
//         setIsEditModalOpen(false);
//         setEditingBlog(null);
//         setEditBlog({
//             title: '',
//             author: '',
//             category: '',
//             excerpt: '',
//             status: 'Draft',
//             introduction: '',
//             conclusion: '',
//             sections: [{ title: '', content: '' }]
//         });
//         setImagePreview(null);
//         setUploadedImage(null);
//     };

//     const handleEditInputChange = (e) => {
//         const { name, value } = e.target;
//         setEditBlog({ ...editBlog, [name]: value });
//     };

//     const handleEditSectionChange = (index, field, value) => {
//         const updatedSections = [...editBlog.sections];
//         updatedSections[index][field] = value;
//         setEditBlog({ ...editBlog, sections: updatedSections });
//     };

//     const addEditSection = () => {
//         setEditBlog({
//             ...editBlog,
//             sections: [...editBlog.sections, { title: '', content: '' }]
//         });
//     };

//     const removeEditSection = (index) => {
//         const updatedSections = editBlog.sections.filter((_, i) => i !== index);
//         setEditBlog({ ...editBlog, sections: updatedSections });
//     };

//     const handleUpdateBlog = async () => {
//         if (!checkAuth()) return;
        
//         if (!editBlog.title || !editBlog.author || !editBlog.category || !editBlog.excerpt || !editBlog.introduction) {
//             showToast('Please fill in all required fields!', 'error');
//             return;
//         }

//         setLoading(true);
//         try {
//             const formData = new FormData();
//             formData.append('title', editBlog.title);
//             formData.append('author', editBlog.author);
//             formData.append('category', editBlog.category);
//             formData.append('excerpt', editBlog.excerpt);
//             formData.append('status', editBlog.status);
//             formData.append('introduction', editBlog.introduction);
//             formData.append('conclusion', editBlog.conclusion || '');
//             formData.append('sections', JSON.stringify(editBlog.sections));
//             formData.append('_method', 'PUT');
            
//             if (uploadedImage) {
//                 formData.append('image', uploadedImage);
//             }
            
//             const headers = getMultipartHeaders();
//             const response = await axios.post(`${API_BASE_URL}/blogs/${editingBlog.id}`, formData, { headers });
            
//             if (response.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 showToast("Session expired. Please login again.", 'error');
//                 setTimeout(() => window.location.href = '/login', 2000);
//                 return;
//             }
            
//             if (response.data.status === true) {
//                 showToast('Blog updated successfully!', 'success');
//                 fetchBlogs();
//                 handleCloseEditModal();
//             } else {
//                 showToast('Failed to update blog', 'error');
//             }
//         } catch (error) {
//             console.error('Error updating blog:', error);
//             if (error.response?.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 showToast("Session expired. Please login again.", 'error');
//                 setTimeout(() => window.location.href = '/login', 2000);
//             } else {
//                 showToast(error.response?.data?.message || 'Error updating blog.', 'error');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDeleteBlog = async (blogId, blogTitle) => {
//         if (!checkAuth()) return;
//         if (!window.confirm(`Are you sure you want to delete "${blogTitle}"?`)) return;
        
//         setLoading(true);
//         try {
//             const headers = getAuthHeaders();
//             const response = await axios.delete(`${API_BASE_URL}/blogs/${blogId}`, { headers });
            
//             if (response.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 showToast("Session expired. Please login again.", 'error');
//                 setTimeout(() => window.location.href = '/login', 2000);
//                 return;
//             }
            
//             if (response.data.status === true) {
//                 showToast('Blog deleted successfully!', 'success');
//                 fetchBlogs();
//             } else {
//                 showToast('Failed to delete blog', 'error');
//             }
//         } catch (error) {
//             console.error('Error deleting blog:', error);
//             if (error.response?.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 showToast("Session expired. Please login again.", 'error');
//                 setTimeout(() => window.location.href = '/login', 2000);
//             } else {
//                 showToast('Error deleting blog.', 'error');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAddNewBlog = () => {
//         setNewBlog({
//             title: '',
//             author: '',
//             category: '',
//             excerpt: '',
//             status: 'Draft',
//             introduction: '',
//             conclusion: '',
//             sections: [{ title: '', content: '' }]
//         });
//         setImagePreview(null);
//         setUploadedImage(null);
//         setIsAddModalOpen(true);
//     };

//     const handleCloseAddModal = () => {
//         setIsAddModalOpen(false);
//         setNewBlog({
//             title: '',
//             author: '',
//             category: '',
//             excerpt: '',
//             status: 'Draft',
//             introduction: '',
//             conclusion: '',
//             sections: [{ title: '', content: '' }]
//         });
//         setImagePreview(null);
//         setUploadedImage(null);
//     };

//     const handleImageUpload = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             if (file.size > 5 * 1024 * 1024) {
//                 showToast('Image size should be less than 5MB', 'error');
//                 return;
//             }
//             setUploadedImage(file);
//             const reader = new FileReader();
//             reader.onloadend = () => setImagePreview(reader.result);
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setNewBlog({ ...newBlog, [name]: value });
//     };

//     const handleSectionChange = (index, field, value) => {
//         const updatedSections = [...newBlog.sections];
//         updatedSections[index][field] = value;
//         setNewBlog({ ...newBlog, sections: updatedSections });
//     };

//     const addSection = () => {
//         setNewBlog({
//             ...newBlog,
//             sections: [...newBlog.sections, { title: '', content: '' }]
//         });
//     };

//     const removeSection = (index) => {
//         const updatedSections = newBlog.sections.filter((_, i) => i !== index);
//         setNewBlog({ ...newBlog, sections: updatedSections });
//     };

//     const handleSubmitBlog = async () => {
//         if (!checkAuth()) return;
        
//         if (!newBlog.title || !newBlog.author || !newBlog.category || !newBlog.excerpt || !newBlog.introduction) {
//             showToast('Please fill in all required fields!', 'error');
//             return;
//         }

//         setLoading(true);
//         try {
//             const formData = new FormData();
//             formData.append('title', newBlog.title);
//             formData.append('author', newBlog.author);
//             formData.append('category', newBlog.category);
//             formData.append('excerpt', newBlog.excerpt);
//             formData.append('status', newBlog.status);
//             formData.append('introduction', newBlog.introduction);
//             formData.append('conclusion', newBlog.conclusion || '');
//             formData.append('sections', JSON.stringify(newBlog.sections));
            
//             if (uploadedImage) {
//                 formData.append('image', uploadedImage);
//             }
            
//             const headers = getMultipartHeaders();
//             const response = await axios.post(`${API_BASE_URL}/blogs`, formData, { headers });
            
//             if (response.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 showToast("Session expired. Please login again.", 'error');
//                 setTimeout(() => window.location.href = '/login', 2000);
//                 return;
//             }
            
//             if (response.data.status === true) {
//                 showToast('Blog post added successfully!', 'success');
//                 fetchBlogs();
//                 handleCloseAddModal();
//             } else {
//                 showToast('Failed to add blog post', 'error');
//             }
//         } catch (error) {
//             console.error('Error adding blog:', error);
//             if (error.response?.status === 401) {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('Role');
//                 showToast("Session expired. Please login again.", 'error');
//                 setTimeout(() => window.location.href = '/login', 2000);
//             } else {
//                 showToast(error.response?.data?.message || 'Error adding blog post.', 'error');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const toggleSidebar = () => setIsCollapsed(!isCollapsed);
//     const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

//     const totalBlogs = blogs.length;
//     const publishedBlogs = blogs.filter(b => b.status === 'Published').length;
//     const draftBlogs = blogs.filter(b => b.status === 'Draft').length;
//     const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);

//     const styles = {
//         container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
//         mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
//         contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
//         contentScroll: { flex: '1 0 auto', padding: '30px' },
//         pageHeader: { marginBottom: '30px' },
//         pageTitle: { fontSize: '28px', fontWeight: '700', background: theme.primaryGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' },
//         pageSubtitle: { color: theme.textLight, fontSize: '14px' },
//         alert: { padding: '12px 20px', backgroundColor: 'rgba(94, 46, 16, 0.15)', color: '#5e2e10', borderRadius: '8px', marginBottom: '20px', fontWeight: '500' },
//         statsContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
//         statCard: { backgroundColor: theme.card, borderRadius: '16px', padding: '20px', border: `1px solid ${theme.border}`, transition: 'all 0.3s ease', cursor: 'pointer' },
//         statIcon: { width: '45px', height: '45px', borderRadius: '12px', background: theme.primaryGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '12px' },
//         statValue: { fontSize: '24px', fontWeight: '700', color: theme.text, marginBottom: '4px' },
//         statLabel: { fontSize: '13px', color: theme.textLight, fontWeight: '500' },
//         toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
//         searchBox: { padding: '12px 20px', borderRadius: '12px', border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text, width: '300px', fontSize: '14px', outline: 'none', transition: 'all 0.3s' },
//         addBtn: { background: theme.primaryGradient, color: 'white', border: 'none', padding: '12px 28px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(94, 46, 16, 0.3)' },
//         blogsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px', marginBottom: '30px' },
//         blogCard: { backgroundColor: theme.card, borderRadius: '20px', overflow: 'hidden', border: `1px solid ${theme.border}`, transition: 'all 0.3s ease', position: 'relative' },
//         blogImage: { width: '100%', height: '200px', objectFit: 'cover', transition: 'transform 0.5s ease' },
//         cardContent: { padding: '20px' },
//         blogTitle: { fontSize: '18px', fontWeight: '700', color: theme.text, marginBottom: '8px', lineHeight: '1.4' },
//         blogMeta: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', fontSize: '12px', color: theme.textLight },
//         categoryBadge: { backgroundColor: `${theme.primary}15`, color: theme.primary, padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', display: 'inline-block' },
//         statusBadge: (status) => ({ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', backgroundColor: status === 'Published' ? `${theme.success}20` : `${theme.warning}20`, color: status === 'Published' ? theme.success : theme.warning }),
//         blogExcerpt: { fontSize: '13px', color: theme.textLight, lineHeight: '1.5', marginBottom: '16px' },
//         cardActions: { display: 'flex', gap: '10px', paddingTop: '16px', borderTop: `1px solid ${theme.border}` },
//         actionBtn: { flex: 1, padding: '8px', borderRadius: '10px', border: 'none', cursor: 'pointer', transition: 'all 0.3s', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
//         viewBtn: { backgroundColor: `${theme.warning}20`, color: theme.warning },
//         editBtn: { backgroundColor: `${theme.primary}20`, color: theme.primary },
//         deleteBtn: { backgroundColor: `${theme.danger}20`, color: theme.danger },
//         pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '20px' },
//         pageBtn: { width: '40px', height: '40px', borderRadius: '10px', border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text, cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' },
//         activePage: { background: theme.primaryGradient, color: 'white', border: 'none' },
//         emptyState: { textAlign: 'center', padding: '60px', color: theme.textLight },
//         loadingSpinner: { textAlign: 'center', padding: '60px', color: theme.textLight },
//         modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(8px)' },
//         modal: { backgroundColor: theme.card, borderRadius: '24px', width: '800px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' },
//         modalHeader: { padding: '24px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: theme.card, zIndex: 1 },
//         modalBody: { padding: '24px' },
//         modalFooter: { padding: '20px 24px', borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'flex-end', gap: '12px' },
//         closeBtn: { background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: theme.text },
//         input: { width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.text, fontSize: '14px', outline: 'none', transition: 'all 0.3s' },
//         textarea: { width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.text, fontSize: '14px', outline: 'none', resize: 'vertical', minHeight: '80px' },
//         label: { display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px', color: theme.text },
//         imageUploadArea: { border: `2px dashed ${theme.border}`, borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s', backgroundColor: theme.bg },
//         imagePreview: { maxWidth: '100%', maxHeight: '200px', borderRadius: '12px', marginBottom: '12px', objectFit: 'cover' },
//         sectionCard: { marginBottom: '16px', padding: '16px', border: `1px solid ${theme.border}`, borderRadius: '12px', backgroundColor: theme.bg },
//         toast: { position: 'fixed', bottom: '20px', right: '20px', padding: '12px 20px', borderRadius: '10px', color: 'white', zIndex: 2000, animation: 'slideInRight 0.3s ease' }
//     };

//     return (
//         <div style={styles.container}>
//             <style>{`
//                 .stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(94, 46, 16, 0.15); }
//                 .blog-card:hover { transform: translateY(-6px); box-shadow: 0 12px 35px rgba(0,0,0,0.2); }
//                 .blog-card:hover img { transform: scale(1.05); }
//                 button:hover { transform: translateY(-2px); }
//                 .search-box:focus { border-color: #5e2e10; box-shadow: 0 0 0 3px rgba(94, 46, 16, 0.1); }
//                 .blog-card { animation: slideUp 0.3s ease; }
//                 @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
//                 @keyframes slideInRight { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
//             `}</style>

//             <div className="d-flex">
//                 <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="users" />
//                 <div style={styles.mainArea} className="flex-grow-1">
//                     <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />
//                     <div style={styles.contentContainer}>
//                         <div style={styles.contentScroll}>
//                             <div style={styles.pageHeader}>
//                                 <h1 style={styles.pageTitle}>Blog Management</h1>
//                                 <p style={styles.pageSubtitle}>Manage and create engaging blog content</p>
//                             </div>

//                             {/* Auth Error Display */}
//                             {authError && (
//                                 <div style={styles.alert}>
//                                     <i className="bi bi-exclamation-triangle-fill me-2"></i>
//                                     {authError}
//                                 </div>
//                             )}

//                             <div style={styles.statsContainer}>
//                                 <div className="stat-card" style={styles.statCard}><div style={styles.statIcon}>📝</div><div style={styles.statValue}>{totalBlogs}</div><div style={styles.statLabel}>Total Blogs</div></div>
//                                 <div className="stat-card" style={styles.statCard}><div style={styles.statIcon}>✅</div><div style={styles.statValue}>{publishedBlogs}</div><div style={styles.statLabel}>Published</div></div>
//                                 <div className="stat-card" style={styles.statCard}><div style={styles.statIcon}>✏️</div><div style={styles.statValue}>{draftBlogs}</div><div style={styles.statLabel}>Drafts</div></div>
//                                 <div className="stat-card" style={styles.statCard}><div style={styles.statIcon}>👁️</div><div style={styles.statValue}>{totalViews.toLocaleString()}</div><div style={styles.statLabel}>Total Views</div></div>
//                             </div>

//                             <div style={styles.toolbar}>
//                                 <input type="text" placeholder="🔍 Search by title, author, or category..." style={styles.searchBox} className="search-box" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
//                                 <button style={styles.addBtn} onClick={handleAddNewBlog} disabled={loading}><i className="bi bi-plus-circle"></i> Add New Blog</button>
//                             </div>

//                             {loading && blogs.length === 0 ? (
//                                 <div style={styles.loadingSpinner}><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div><p style={{ marginTop: '16px' }}>Loading blogs...</p></div>
//                             ) : currentBlogs.length > 0 ? (
//                                 <>
//                                     <div style={styles.blogsGrid}>
//                                         {currentBlogs.map((blog) => (
//                                             <div key={blog.id} className="blog-card" style={styles.blogCard}>
//                                                 <img src={getFinalImageUrl(blog)} alt={blog.title} style={styles.blogImage} onError={() => handleImageError(blog.id)} />
//                                                 <div style={styles.cardContent}>
//                                                     <h3 style={styles.blogTitle}>{blog.title}</h3>
//                                                     <div style={styles.blogMeta}><span>✍️ {blog.author}</span><span>📅 {blog.created_at?.split('T')[0]}</span><span>👁️ {blog.views?.toLocaleString() || 0}</span></div>
//                                                     <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}><span style={styles.categoryBadge}>{blog.category}</span><span style={styles.statusBadge(blog.status)}>{blog.status}</span></div>
//                                                     <p style={styles.blogExcerpt}>{blog.excerpt?.substring(0, 120)}...</p>
//                                                     <div style={styles.cardActions}>
//                                                         <button style={{...styles.actionBtn, ...styles.viewBtn}} onClick={() => handleViewDetails(blog)} disabled={loading}><i className="bi bi-eye"></i> View</button>
//                                                         <button style={{...styles.actionBtn, ...styles.editBtn}} onClick={() => handleEditClick(blog)} disabled={loading}><i className="bi bi-pencil"></i> Edit</button>
//                                                         <button style={{...styles.actionBtn, ...styles.deleteBtn}} onClick={() => handleDeleteBlog(blog.id, blog.title)} disabled={loading}><i className="bi bi-trash"></i> Delete</button>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                     {totalPages > 1 && (
//                                         <div style={styles.pagination}>
//                                             <button style={{...styles.pageBtn, ...(currentPage === 1 && { opacity: 0.5, cursor: 'not-allowed' })}} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>←</button>
//                                             {[...Array(Math.min(totalPages, 5))].map((_, i) => {
//                                                 let pageNum; if (totalPages <= 5) pageNum = i + 1; else if (currentPage <= 3) pageNum = i + 1; else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i; else pageNum = currentPage - 2 + i;
//                                                 return (<button key={i} style={{...styles.pageBtn, ...(currentPage === pageNum && styles.activePage)}} onClick={() => setCurrentPage(pageNum)}>{pageNum}</button>);
//                                             })}
//                                             <button style={{...styles.pageBtn, ...(currentPage === totalPages && { opacity: 0.5, cursor: 'not-allowed' })}} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>→</button>
//                                         </div>
//                                     )}
//                                 </>
//                             ) : (
//                                 <div style={styles.emptyState}><div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div><h4>No Blog Posts Found</h4><p style={{ marginBottom: '20px' }}>{searchTerm ? `No results found for "${searchTerm}"` : 'Start by adding your first blog post'}</p>{!searchTerm && (<button style={styles.addBtn} onClick={handleAddNewBlog}><i className="bi bi-plus-circle"></i> Create First Blog</button>)}</div>
//                             )}
//                         </div>
//                         <Footer theme={theme} />
//                     </div>
//                 </div>
//             </div>

//             {toast.show && (<div style={{...styles.toast, backgroundColor: toast.type === 'success' ? theme.success : theme.danger}}>{toast.message}</div>)}

//             {/* View Modal */}
//             {isModalOpen && selectedBlog && (
//                 <div style={styles.modalOverlay} onClick={handleCloseModal}>
//                     <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
//                         <div style={styles.modalHeader}><h3 style={{ margin: 0, color: theme.text }}>Blog Post Details</h3><button style={styles.closeBtn} onClick={handleCloseModal}>×</button></div>
//                         <div style={styles.modalBody}>
//                             {selectedBlog.image && (<div style={{ marginBottom: '20px', textAlign: 'center' }}><img src={getFinalImageUrl(selectedBlog)} alt={selectedBlog.title} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px' }} onError={() => handleImageError(selectedBlog.id)} /></div>)}
//                             <h2 style={{ color: theme.text, marginBottom: '16px' }}>{selectedBlog.title}</h2>
//                             <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, flexWrap: 'wrap' }}><span>📅 {selectedBlog.created_at?.split('T')[0]}</span><span>✍️ {selectedBlog.author}</span><span>📚 {selectedBlog.category}</span><span>👁️ {selectedBlog.views?.toLocaleString() || 0} views</span></div>
//                             <div style={{ backgroundColor: theme.isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa', padding: '16px', borderRadius: '12px', marginBottom: '20px', fontStyle: 'italic' }}><p style={{ margin: 0 }}>{selectedBlog.excerpt}</p></div>
//                             {selectedBlog.introduction && (<div style={{ marginBottom: '20px' }}><h4 style={{ marginBottom: '8px', color: theme.text }}>Introduction</h4><p style={{ lineHeight: '1.6' }}>{selectedBlog.introduction}</p></div>)}
//                             {(() => { let sections = []; try { sections = typeof selectedBlog.sections === 'string' ? JSON.parse(selectedBlog.sections) : (selectedBlog.sections || []); } catch(e) { sections = []; } return sections.map((section, idx) => (<div key={idx} style={{ marginBottom: '20px' }}><h4 style={{ marginBottom: '8px', color: theme.text }}>{section.title}</h4><p style={{ lineHeight: '1.6' }}>{section.content}</p></div>)); })()}
//                             {selectedBlog.conclusion && (<div style={{ marginTop: '20px', padding: '16px', backgroundColor: theme.isDarkMode ? 'rgba(255,255,255,0.05)' : '#e9ecef', borderRadius: '12px' }}><h4 style={{ marginBottom: '8px', color: theme.text }}>Conclusion</h4><p style={{ lineHeight: '1.6' }}>{selectedBlog.conclusion}</p></div>)}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Add Modal */}
//             {isAddModalOpen && (
//                 <div style={styles.modalOverlay} onClick={handleCloseAddModal}>
//                     <div style={{...styles.modal, maxWidth: '900px'}} onClick={(e) => e.stopPropagation()}>
//                         <div style={styles.modalHeader}><h3 style={{ margin: 0, color: theme.text }}>Add New Blog Post</h3><button style={styles.closeBtn} onClick={handleCloseAddModal}>×</button></div>
//                         <div style={styles.modalBody}>
//                             <form onSubmit={(e) => { e.preventDefault(); handleSubmitBlog(); }}>
//                                 <div className="row g-3">
//                                     <div className="col-12"><label style={styles.label}>Featured Image</label><div style={styles.imageUploadArea} onClick={() => document.getElementById('imageUpload').click()}>
//                                         {imagePreview ? (<div><img src={imagePreview} alt="Preview" style={styles.imagePreview} /><div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}><button type="button" style={styles.deleteBtn} onClick={() => { setImagePreview(null); setUploadedImage(null); }}>Remove</button><button type="button" style={styles.editBtn} onClick={() => document.getElementById('imageUpload').click()}>Change</button></div></div>) : (<div><div style={{ fontSize: '48px', marginBottom: '10px' }}>📷</div><p>Click to upload an image</p><p style={{ fontSize: '12px', color: theme.textLight }}>Max size: 5MB</p></div>)}
//                                         <input id="imageUpload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={loading} />
//                                     </div></div>
//                                     <div className="col-md-6"><label style={styles.label}>Title *</label><input type="text" name="title" style={styles.input} value={newBlog.title} onChange={handleInputChange} required disabled={loading} /></div>
//                                     <div className="col-md-6"><label style={styles.label}>Author *</label><input type="text" name="author" style={styles.input} value={newBlog.author} onChange={handleInputChange} required disabled={loading} /></div>
//                                     <div className="col-md-6"><label style={styles.label}>Category *</label><select name="category" style={styles.input} value={newBlog.category} onChange={handleInputChange} required disabled={loading}><option value="">Select Category</option><option value="Suite Tips">Suite Tips</option><option value="Weekend Getaway">Weekend Getaway</option><option value="Suite Review">Suite Review</option><option value="Business Travel">Business Travel</option><option value="Spa & Wellness">Spa & Wellness</option><option value="Room Guide">Room Guide</option></select></div>
//                                     <div className="col-md-6"><label style={styles.label}>Status *</label><select name="status" style={styles.input} value={newBlog.status} onChange={handleInputChange} disabled={loading}><option value="Draft">Draft</option><option value="Published">Published</option></select></div>
//                                     <div className="col-12"><label style={styles.label}>Excerpt *</label><textarea name="excerpt" style={styles.textarea} value={newBlog.excerpt} onChange={handleInputChange} required disabled={loading} /></div>
//                                     <div className="col-12"><label style={styles.label}>Introduction *</label><textarea name="introduction" style={styles.textarea} value={newBlog.introduction} onChange={handleInputChange} required disabled={loading} /></div>
//                                     <div className="col-12"><label style={styles.label}>Sections</label>{newBlog.sections.map((section, index) => (<div key={index} style={styles.sectionCard}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}><h5 style={{ margin: 0, color: theme.text }}>Section {index + 1}</h5>{index > 0 && (<button type="button" onClick={() => removeSection(index)} style={styles.deleteBtn} disabled={loading}>Remove</button>)}</div><input type="text" placeholder="Section Title" style={styles.input} value={section.title} onChange={(e) => handleSectionChange(index, 'title', e.target.value)} disabled={loading} /><textarea placeholder="Section Content" style={styles.textarea} value={section.content} onChange={(e) => handleSectionChange(index, 'content', e.target.value)} disabled={loading} /></div>))}<button type="button" onClick={addSection} style={styles.editBtn} disabled={loading}>+ Add Section</button></div>
//                                     <div className="col-12"><label style={styles.label}>Conclusion</label><textarea name="conclusion" style={styles.textarea} value={newBlog.conclusion} onChange={handleInputChange} disabled={loading} /></div>
//                                 </div>
//                                 <div style={styles.modalFooter}><button type="button" onClick={handleCloseAddModal} style={{...styles.actionBtn, backgroundColor: theme.border, color: theme.text, padding: '10px 24px'}} disabled={loading}>Cancel</button><button type="submit" style={{...styles.addBtn, padding: '10px 32px'}} disabled={loading}>{loading ? 'Submitting...' : 'Submit Blog'}</button></div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Edit Modal */}
//             {isEditModalOpen && editingBlog && (
//                 <div style={styles.modalOverlay} onClick={handleCloseEditModal}>
//                     <div style={{...styles.modal, maxWidth: '900px'}} onClick={(e) => e.stopPropagation()}>
//                         <div style={styles.modalHeader}><h3 style={{ margin: 0, color: theme.text }}>Edit Blog Post</h3><button style={styles.closeBtn} onClick={handleCloseEditModal}>×</button></div>
//                         <div style={styles.modalBody}>
//                             <form onSubmit={(e) => { e.preventDefault(); handleUpdateBlog(); }}>
//                                 <div className="row g-3">
//                                     <div className="col-12"><label style={styles.label}>Featured Image</label><div style={styles.imageUploadArea} onClick={() => document.getElementById('editImageUpload').click()}>
//                                         {imagePreview ? (<div><img src={imagePreview} alt="Preview" style={styles.imagePreview} /><div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}><button type="button" style={styles.deleteBtn} onClick={() => { setImagePreview(null); setUploadedImage(null); }}>Remove</button><button type="button" style={styles.editBtn} onClick={() => document.getElementById('editImageUpload').click()}>Change</button></div></div>) : (<div><div style={{ fontSize: '48px', marginBottom: '10px' }}>📷</div><p>Click to upload an image</p><p style={{ fontSize: '12px', color: theme.textLight }}>Max size: 5MB</p></div>)}
//                                         <input id="editImageUpload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={loading} />
//                                     </div></div>
//                                     <div className="col-md-6"><label style={styles.label}>Title *</label><input type="text" name="title" style={styles.input} value={editBlog.title} onChange={handleEditInputChange} required disabled={loading} /></div>
//                                     <div className="col-md-6"><label style={styles.label}>Author *</label><input type="text" name="author" style={styles.input} value={editBlog.author} onChange={handleEditInputChange} required disabled={loading} /></div>
//                                     <div className="col-md-6"><label style={styles.label}>Category *</label><select name="category" style={styles.input} value={editBlog.category} onChange={handleEditInputChange} required disabled={loading}><option value="">Select Category</option><option value="Suite Tips">Suite Tips</option><option value="Weekend Getaway">Weekend Getaway</option><option value="Suite Review">Suite Review</option><option value="Business Travel">Business Travel</option><option value="Spa & Wellness">Spa & Wellness</option><option value="Room Guide">Room Guide</option></select></div>
//                                     <div className="col-md-6"><label style={styles.label}>Status *</label><select name="status" style={styles.input} value={editBlog.status} onChange={handleEditInputChange} disabled={loading}><option value="Draft">Draft</option><option value="Published">Published</option></select></div>
//                                     <div className="col-12"><label style={styles.label}>Excerpt *</label><textarea name="excerpt" style={styles.textarea} value={editBlog.excerpt} onChange={handleEditInputChange} required disabled={loading} /></div>
//                                     <div className="col-12"><label style={styles.label}>Introduction *</label><textarea name="introduction" style={styles.textarea} value={editBlog.introduction} onChange={handleEditInputChange} required disabled={loading} /></div>
//                                     <div className="col-12"><label style={styles.label}>Sections</label>{editBlog.sections.map((section, index) => (<div key={index} style={styles.sectionCard}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}><h5 style={{ margin: 0, color: theme.text }}>Section {index + 1}</h5>{index > 0 && (<button type="button" onClick={() => removeEditSection(index)} style={styles.deleteBtn} disabled={loading}>Remove</button>)}</div><input type="text" placeholder="Section Title" style={styles.input} value={section.title} onChange={(e) => handleEditSectionChange(index, 'title', e.target.value)} disabled={loading} /><textarea placeholder="Section Content" style={styles.textarea} value={section.content} onChange={(e) => handleEditSectionChange(index, 'content', e.target.value)} disabled={loading} /></div>))}<button type="button" onClick={addEditSection} style={styles.editBtn} disabled={loading}>+ Add Section</button></div>
//                                     <div className="col-12"><label style={styles.label}>Conclusion</label><textarea name="conclusion" style={styles.textarea} value={editBlog.conclusion} onChange={handleEditInputChange} disabled={loading} /></div>
//                                 </div>
//                                 <div style={styles.modalFooter}><button type="button" onClick={handleCloseEditModal} style={{...styles.actionBtn, backgroundColor: theme.border, color: theme.text, padding: '10px 24px'}} disabled={loading}>Cancel</button><button type="submit" style={{...styles.addBtn, padding: '10px 32px'}} disabled={loading}>{loading ? 'Updating...' : 'Update Blog'}</button></div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default BlogSection;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://backend.akashbariresort.com';

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
            fd.append('_method', 'PUT');
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
                                    { label: 'Total Views', value: totalViews.toLocaleString() }
                                ].map(stat => (
                                    <div className="col-6 col-md-3" key={stat.label}>
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
                <Modal theme={theme} title="Blog Post Details" onClose={() => setViewingBlog(null)} wide>
                    {viewingBlog.image && (
                        <div className="text-center mb-4">
                            <img src={getFinalImageUrl(viewingBlog)} alt={viewingBlog.title} onError={() => setImageErrors(prev => ({ ...prev, [viewingBlog.id]: true }))} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px' }} />
                        </div>
                    )}
                    <h2 style={{ color: theme.text, marginBottom: '14px' }}>{viewingBlog.title}</h2>
                    <div className="d-flex flex-wrap gap-3 mb-3 pb-3" style={{ borderBottom: `1px solid ${theme.border}`, color: theme.textLight, fontSize: '13px' }}>
                        <span>{viewingBlog.created_at?.split('T')[0]}</span>
                        <span>{viewingBlog.author}</span>
                        <span>{viewingBlog.category}</span>
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

            {/* Toast */}
            {toast.show && (
                <div style={{
                    position: 'fixed', bottom: '20px', right: '20px', zIndex: 2000,
                    padding: '12px 20px', borderRadius: '10px', color: accentOn, fontSize: '14px',
                    backgroundColor: toast.type === 'success' ? accent : accent
                }}>
                    {toast.message}
                </div>
            )}

            <style jsx>{`
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