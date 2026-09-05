
import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

// API Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const STORAGE_URL = import.meta.env.VITE_API_URL || import.meta.env.API_URL || 'https://backend.akashbariresort.com';

const Content = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [authError, setAuthError] = useState(null);

    // --- API Data States ---
    const [featureTitles, setFeatureTitles] = useState([]); 
    const [groupedFeatures, setGroupedFeatures] = useState([]); 

    // --- Modal & Form States ---
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [sectionType, setSectionType] = useState('hero');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [featureDeleteConfirm, setFeatureDeleteConfirm] = useState(null);

    const [formData, setFormData] = useState({
        title: '', subtitle: '', slug: '',
        aboutTitle: '',
    });

    // This will hold ALL features for the selected category when editing
    const [aboutFeatures, setAboutFeatures] = useState([{ id: null, category: '', feature: '' }]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [previews, setPreviews] = useState([]);

    // State for storing the original category name when editing
    const [editingCategory, setEditingCategory] = useState(null);

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#0a0a0a' : '#f5f5f5',
        card: isDarkMode ? '#141414' : '#ffffff',
        text: isDarkMode ? '#f5f5f5' : '#111111',
        textLight: isDarkMode ? '#a3a3a3' : '#6b6b6b',
        border: isDarkMode ? '#2b2b2b' : '#dcdcdc'
    };
    // Single black/white accent (inverts automatically with dark mode)
    const accent = theme.text;
    const accentOn = theme.card;

    // Get authentication headers
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Role': localStorage.getItem('Role') || 'admin',
            'Content-Type': 'application/json'
        };
    };

    // Get multipart headers for file upload
    const getMultipartHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Role': localStorage.getItem('Role') || 'admin'
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

    // Helper function to get image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        
        let cleanPath = imagePath;
        if (cleanPath.startsWith('/storage/')) {
            cleanPath = cleanPath.replace('/storage/', '');
        } else if (cleanPath.startsWith('storage/')) {
            cleanPath = cleanPath.replace('storage/', '');
        }
        cleanPath = cleanPath.replace(/^\/+/, '');
        
        const baseUrl = STORAGE_URL.replace(/\/$/, '');
        return `${baseUrl}/storage/${cleanPath}`;
    };

    // --- API Functions with Authentication ---
    const fetchBanners = async () => {
        if (!checkAuth()) return;
        
        try {
            setLoading(true);
            setAuthError(null);
            const headers = getAuthHeaders();
            const res = await fetch(`${API_BASE_URL}/v1/banners/active`, { headers });
            
            if (res.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                setAuthError("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }
            
            const result = await res.json();
            if (result.status === 'success') {
                setBanners(Array.isArray(result.data) ? result.data : [result.data]);
            }
        } catch (err) { 
            console.error(err);
            setAuthError("Failed to fetch banners. Please try again.");
        } finally { 
            setLoading(false); 
        }
    };

    const fetchFeatureTitles = async () => {
        if (!checkAuth()) return;
        
        try {
            const headers = getAuthHeaders();
            const res = await fetch(`${API_BASE_URL}/get-features`, { headers });
            
            if (res.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                setAuthError("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }
            
            const result = await res.json();
            if (result.status === 'success') setFeatureTitles(result.data);
        } catch (err) { console.error(err); }
    };

    const fetchGroupedFeatures = async () => {
        if (!checkAuth()) return;
        
        try {
            const headers = getAuthHeaders();
            const res = await fetch(`${API_BASE_URL}/get-about-features`, { headers });
            
            if (res.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                setAuthError("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }
            
            const result = await res.json();
            if (result.status === 'success') setGroupedFeatures(result.data);
        } catch (err) { console.error(err); }
    };

    // --- Fetch individual feature by ID (for editing single feature) ---
    const viewFeature = async (featureId) => {
        if (!checkAuth()) return null;
        
        try {
            const headers = getAuthHeaders();
            const res = await fetch(`${API_BASE_URL}/view-about-feature/${featureId}`, { headers });
            
            if (res.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                alert("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
                return null;
            }
            
            const result = await res.json();
            if (result.status === 'success') {
                return result.data;
            }
            return null;
        } catch (err) { 
            console.error('Error fetching feature:', err);
            return null;
        }
    };

    // --- View ALL features for a category with proper IDs ---
    const viewFeatureCategory = async (categoryName) => {
        if (!checkAuth()) return;
        
        // Find the category in groupedFeatures
        const categoryData = groupedFeatures.find(g => g.category === categoryName);
        if (!categoryData) {
            alert("Category not found.");
            return null;
        }

        // Find the feature title ID for this category
        const featureTitle = featureTitles.find(ft => ft.title === categoryName);
        if (!featureTitle) {
            alert("Feature ID not found. Please try again.");
            return null;
        }

        try {
            const headers = getAuthHeaders();
            const res = await fetch(`${API_BASE_URL}/get-about-features`, { headers });
            const result = await res.json();
            
            if (result.status === 'success') {
                const allFeatures = result.data;
                const categoryDataWithIds = allFeatures.find(g => g.category === categoryName);
                
                if (categoryDataWithIds && categoryDataWithIds.details) {
                    const featuresWithIds = categoryData.details.map((detail, index) => ({
                        id: `${featureTitle.id}-${index}`, // Temporary ID
                        category: categoryName,
                        feature: detail,
                        actualId: null
                    }));
                    
                    setAboutFeatures(featuresWithIds);
                    setEditId(featureTitle.id);
                    setEditingCategory(categoryName);
                    setFormData({ ...formData, aboutTitle: categoryName });
                    setSectionType('about');
                    setShowModal(true);
                    
                    return { id: featureTitle.id, features: featuresWithIds };
                }
            }
            
            // Fallback: Use groupedFeatures data
            const features = categoryData.details.map((detail, index) => ({
                id: `${featureTitle.id}-${index}`,
                category: categoryName,
                feature: detail
            }));

            if (features.length === 0) {
                features.push({ id: Date.now(), category: categoryName, feature: '' });
            }

            setAboutFeatures(features);
            setEditId(featureTitle.id);
            setEditingCategory(categoryName);
            setFormData({ ...formData, aboutTitle: categoryName });
            setSectionType('about');
            setShowModal(true);
            
            return { id: featureTitle.id, features };
            
        } catch (err) {
            console.error('Error fetching features:', err);
            alert("Error loading features. Please try again.");
            return null;
        }
    };

    // --- Edit multiple features with correct payload ---
    const editFeatures = async (categoryId, featuresArray) => {
        if (!checkAuth()) return false;
        
        try {
            setLoading(true);
            const headers = getAuthHeaders();
            
            const validFeatures = featuresArray.filter(f => f.feature && f.feature.trim() !== '');
            
            if (validFeatures.length === 0) {
                alert("Please add at least one feature.");
                setLoading(false);
                return false;
            }

            let successCount = 0;
            let errorCount = 0;
            let errorMessages = [];

            for (const feature of validFeatures) {
                const payload = {
                    category: feature.category,
                    feature: feature.feature
                };

                console.log('Updating feature with payload:', payload);

                const res = await fetch(`${API_BASE_URL}/edit-about-feature/${categoryId}`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload)
                });

                if (res.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('Role');
                    alert("Session expired. Please login again.");
                    setTimeout(() => window.location.href = '/login', 2000);
                    return false;
                }

                const result = await res.json();
                console.log('Update response:', result);

                if (result.status === 'success') {
                    successCount++;
                } else {
                    errorCount++;
                    errorMessages.push(result.message || 'Unknown error');
                }
            }

            if (errorCount > 0 && successCount === 0) {
                alert(`Failed to update features. Errors: ${errorMessages.join(', ')}`);
                return false;
            }

            if (successCount > 0) {
                alert(`Updated ${successCount} feature${successCount > 1 ? 's' : ''} successfully!${errorCount > 0 ? ` ${errorCount} failed.` : ''}`);
                fetchGroupedFeatures();
                fetchFeatureTitles();
                setShowModal(false);
                resetForm();
                return true;
            }

            return false;
            
        } catch (err) { 
            console.error('Error in editFeatures:', err);
            alert("Error updating features: " + err.message);
            return false;
        } finally { 
            setLoading(false); 
        }
    };

    // Delete entire feature category
    const deleteFeatureCategory = async (featureId) => {
        if (!checkAuth()) return;
        
        try {
            setLoading(true);
            const headers = getAuthHeaders();
            const res = await fetch(`${API_BASE_URL}/delete-all-about-features`, {
                method: 'DELETE',
                headers: headers,
                body: JSON.stringify({ id: featureId })
            });
            
            if (res.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                alert("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }
            
            if (res.ok) {
                alert("Feature category deleted successfully!");
                fetchGroupedFeatures();
                fetchFeatureTitles();
                setFeatureDeleteConfirm(null);
            } else {
                const result = await res.json();
                alert(result.message || "Failed to delete feature category");
            }
        } catch (err) { 
            console.error(err);
            alert("Error deleting feature category");
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchBanners();
        fetchFeatureTitles();
        fetchGroupedFeatures();
    }, []);

    const handleAddAboutTitle = async () => {
        if (!checkAuth()) return;
        if (!formData.aboutTitle) return alert("Title is required");
        
        try {
            const headers = getAuthHeaders();
            const res = await fetch(`${API_BASE_URL}/add-features`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ title: formData.aboutTitle })
            });
            
            if (res.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                alert("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }
            
            const result = await res.json();
            if (result.status === 'success') {
                alert("Header Title Saved!");
                fetchFeatureTitles();
                setFormData({ ...formData, aboutTitle: '' });
            }
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async () => {
        if (!checkAuth()) return;
        
        setLoading(true);
        try {
            if (sectionType === 'hero') {
                const data = new FormData();
                data.append('title', formData.title);
                data.append('subtitle', formData.subtitle);
                data.append('slug', formData.slug);
                selectedImages.forEach((image) => data.append('images[]', image));

                const url = editId ? `${API_BASE_URL}/v1/update-banners/${editId}` : `${API_BASE_URL}/v1/add-banners`;
                const headers = getMultipartHeaders();
                
                const res = await fetch(url, { method: 'POST', body: data, headers });
                
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('Role');
                    alert("Session expired. Please login again.");
                    setTimeout(() => window.location.href = '/login', 2000);
                    return;
                }
                
                const result = await res.json();
                if (result.status === 'success') {
                    alert("Hero Banner Saved!");
                    setShowModal(false); resetForm(); fetchBanners();
                }
            } else {
                if (editId) {
                    await editFeatures(editId, aboutFeatures);
                } else {
                    const headers = getAuthHeaders();
                    const res = await fetch(`${API_BASE_URL}/save-about-features`, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({ aboutFeatures: aboutFeatures.map(f => ({
                            category: f.category,
                            feature: f.feature
                        })) })
                    });
                    
                    if (res.status === 401) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('Role');
                        alert("Session expired. Please login again.");
                        setTimeout(() => window.location.href = '/login', 2000);
                        return;
                    }
                    
                    const result = await res.json();
                    if (result.status === 'success') {
                        alert("Features Saved!");
                        setShowModal(false); resetForm(); fetchGroupedFeatures();
                    }
                }
            }
        } catch (err) { 
            console.error(err);
            alert("Error saving content: " + err.message);
        }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!checkAuth()) return;
        
        try {
            const headers = getAuthHeaders();
            const res = await fetch(`${API_BASE_URL}/v1/del-banners/${id}`, { method: 'DELETE', headers });
            
            if (res.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('Role');
                alert("Session expired. Please login again.");
                setTimeout(() => window.location.href = '/login', 2000);
                return;
            }
            
            if (res.ok) {
                fetchBanners();
                setDeleteConfirm(null);
            }
        } catch (err) { console.error(err); }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        if (item.slug) {
            setSectionType('hero');
            setFormData({ ...formData, title: item.title, subtitle: item.subtitle, slug: item.slug });
            if (item.images && item.images.length > 0) {
                const imageUrls = item.images.map(img => getImageUrl(img));
                setPreviews(imageUrls);
            }
            setShowModal(true);
        }
    };

    // Handle feature edit button click - loads ALL features for the category
    const handleFeatureEdit = async (group) => {
        await viewFeatureCategory(group.category);
    };

    // Handle feature delete button click - deletes entire category
    const handleFeatureDelete = (group) => {
        const featureTitle = featureTitles.find(ft => ft.title === group.category);
        if (featureTitle) {
            setFeatureDeleteConfirm({
                id: featureTitle.id,
                title: group.category
            });
        } else {
            alert("Feature ID not found. Please try again.");
        }
    };

    const resetForm = () => {
        setEditId(null);
        setEditingCategory(null);
        setFormData({ title: '', subtitle: '', slug: '', aboutTitle: '' });
        setAboutFeatures([{ id: Date.now(), category: '', feature: '' }]);
        // Clean up blob URLs
        previews.forEach(url => {
            if (url && url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        });
        setPreviews([]);
        setSelectedImages([]);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const oversized = files.find(file => file.size > 5 * 1024 * 1024);
        if (oversized) {
            alert(`File "${oversized.name}" is too large! Max 5MB.`);
            return;
        }
        setSelectedImages(files);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const handleFeatureChange = useCallback((index, field, value) => {
        setAboutFeatures(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [field]: value
            };
            return updated;
        });
    }, []);

    const addFeatureRow = useCallback(() => {
        const category = editingCategory || '';
        setAboutFeatures(prev => [
            ...prev,
            { id: Date.now() + Math.random(), category: category, feature: '' }
        ]);
    }, [editingCategory]);

    const removeFeatureRow = useCallback((index) => {
        setAboutFeatures(prev => {
            const updated = prev.filter((_, i) => i !== index);
            return updated;
        });
    }, []);

    // Filter banners
    const filteredBanners = banners.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const styles = {
        container: {
            backgroundColor: theme.bg,
            minHeight: '100vh',
            transition: 'all 0.3s ease'
        },
        mainWrapper: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            height: '100vh',
            overflow: 'hidden'
        },
        scrollContent: {
            flex: 1,
            overflowY: 'auto',
            padding: '30px'
        },
        pageHeader: {
            marginBottom: '30px'
        },
        pageTitle: {
            fontSize: '28px',
            fontWeight: '700',
            color: theme.text,
            marginBottom: '8px'
        },
        pageSubtitle: {
            color: theme.textLight,
            fontSize: '14px'
        },
        alert: {
            padding: '12px 20px',
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.card,
            color: theme.text,
            borderRadius: '8px',
            marginBottom: '20px',
            fontWeight: '500'
        },
        toolbar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px'
        },
        searchBox: {
            padding: '12px 20px',
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.card,
            color: theme.text,
            width: '300px',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s'
        },
        addBtn: {
            backgroundColor: accent,
            color: accentOn,
            border: 'none',
            padding: '12px 28px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        tableContainer: {
            backgroundColor: theme.card,
            borderRadius: '20px',
            border: `1px solid ${theme.border}`,
            overflow: 'hidden',
            marginBottom: '30px',
            transition: 'all 0.3s ease'
        },
        sectionTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: theme.text,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        th: {
            padding: '16px 20px',
            textAlign: 'left',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f8f8',
            color: theme.text,
            fontWeight: '600',
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            borderBottom: `1px solid ${theme.border}`
        },
        td: {
            padding: '16px 20px',
            color: theme.text,
            borderBottom: `1px solid ${theme.border}`,
            fontSize: '14px'
        },
        actionBtn: {
            padding: '8px 12px',
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
            cursor: 'pointer',
            transition: 'all 0.3s',
            margin: '0 4px',
            backgroundColor: 'transparent',
            color: theme.text
        },
        badge: {
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '600',
            display: 'inline-block',
            border: `1px solid ${theme.text}`
        },
        modalOverlay: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(6px)'
        },
        modalCard: {
            width: '700px',
            maxWidth: '90%',
            maxHeight: '90vh',
            backgroundColor: theme.card,
            color: theme.text,
            borderRadius: '20px',
            border: `1px solid ${theme.border}`,
            overflow: 'hidden',
            animation: 'slideUp 0.25s ease'
        },
        modalHeader: {
            padding: '22px 24px',
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        modalBody: {
            padding: '24px',
            maxHeight: 'calc(90vh - 140px)',
            overflowY: 'auto'
        },
        modalFooter: {
            padding: '18px 24px',
            borderTop: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
        },
        input: {
            width: '100%',
            padding: '10px 14px',
            borderRadius: '10px',
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.bg,
            color: theme.text,
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            fontSize: '13px',
            color: theme.text
        },
        uploadZone: {
            border: `2px dashed ${theme.border}`,
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s',
            backgroundColor: theme.bg
        },
        imagePreviewContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '12px'
        },
        previewImage: {
            width: '80px',
            height: '60px',
            borderRadius: '8px',
            objectFit: 'cover',
            border: `2px solid ${theme.text}`
        },
        radioGroup: {
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            padding: '12px',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f8f8',
            borderRadius: '50px',
            marginBottom: '24px'
        },
        featureRow: {
            display: 'flex',
            gap: '12px',
            marginBottom: '12px',
            alignItems: 'center'
        },
        featureCategory: {
            flex: 1
        },
        featureValue: {
            flex: 2
        },
        featureRemoveBtn: {
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
            backgroundColor: 'transparent',
            color: theme.text,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        emptyState: {
            textAlign: 'center',
            padding: '60px',
            color: theme.textLight
        },
        disabledBtn: {
            opacity: 0.6,
            cursor: 'not-allowed'
        }
    };

    return (
        <div style={styles.container}>
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from { transform: translateY(24px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    .search-box:focus {
                        border-color: ${accent};
                        box-shadow: 0 0 0 3px ${accent}1a;
                    }
                    .upload-zone:hover {
                        border-color: ${accent};
                        background: ${theme.isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'};
                    }
                    .action-btn:hover {
                        background-color: ${accent} !important;
                        color: ${accentOn} !important;
                    }
                `}
            </style>

            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="content" />
                
                <div style={styles.mainWrapper}>
                    <Header 
                        theme={theme} 
                        isDarkMode={isDarkMode} 
                        toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
                        toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
                    />
                    
                    <div style={styles.scrollContent}>
                        {/* Header Section */}
                        <div style={styles.pageHeader}>
                            <h1 style={styles.pageTitle}>Content Management</h1>
                            <p style={styles.pageSubtitle}>Manage banners, hero sections, and about features</p>
                        </div>

                        {/* Auth Error Display */}
                        {authError && (
                            <div style={styles.alert}>
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                {authError}
                            </div>
                        )}

                        {/* Toolbar */}
                        <div style={styles.toolbar}>
                            <input
                                type="text"
                                placeholder="Search by title..."
                                style={styles.searchBox}
                                className="search-box"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button 
                                style={styles.addBtn} 
                                onClick={() => { resetForm(); setShowModal(true); }}
                                disabled={loading}
                            >
                                <i className="bi bi-plus-circle"></i> Add New Content
                            </button>
                        </div>

                        {/* Banners Table */}
                        <div style={styles.tableContainer}>
                            <div style={{ padding: '20px', borderBottom: `1px solid ${theme.border}` }}>
                                <div style={styles.sectionTitle}>
                                    <i className="bi bi-images"></i>
                                    Banners & Hero Sections
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>Title</th>
                                            <th style={styles.th}>Type</th>
                                            <th style={styles.th}>Slug/Link</th>
                                            <th style={styles.th}>Images</th>
                                            <th style={styles.th}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading && banners.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" style={{ ...styles.td, textAlign: 'center' }}>
                                                    <div className="spinner-border" style={{ color: accent }} role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filteredBanners.length > 0 ? (
                                            filteredBanners.map((b) => (
                                                <tr key={b.id}>
                                                    <td style={styles.td}>
                                                        <div className="fw-bold">{b.title}</div>
                                                        {b.subtitle && <div className="small" style={{ color: theme.textLight }}>{b.subtitle}</div>}
                                                    </td>
                                                    <td style={styles.td}>
                                                        <span style={styles.badge}>
                                                            {b.slug ? 'Hero Section' : 'About Section'}
                                                        </span>
                                                    </td>
                                                    <td style={styles.td}>
                                                        {b.slug ? `/${b.slug}` : 'About Page'}
                                                    </td>
                                                    <td style={styles.td}>
                                                        {b.images && b.images.length > 0 && (
                                                            <img 
                                                                src={getImageUrl(b.images[0])} 
                                                                alt="thumb"
                                                                style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: `1px solid ${theme.border}` }}
                                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                                                            />
                                                        )}
                                                    </td>
                                                    <td style={styles.td}>
                                                        <button 
                                                            className="action-btn"
                                                            style={styles.actionBtn}
                                                            onClick={() => handleEdit(b)}
                                                            disabled={loading}
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                        <button 
                                                            className="action-btn"
                                                            style={styles.actionBtn}
                                                            onClick={() => setDeleteConfirm(b)}
                                                            disabled={loading}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" style={{ ...styles.td, textAlign: 'center' }}>
                                                    <div style={styles.emptyState}>
                                                        <i className="bi bi-images" style={{ fontSize: '48px', opacity: 0.4 }}></i>
                                                        <p>No banners found. Click "Add New Content" to create one.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* About Features Section with Edit & Delete */}
                        <div style={styles.tableContainer}>
                            <div style={{ padding: '20px', borderBottom: `1px solid ${theme.border}` }}>
                                <div style={styles.sectionTitle}>
                                    <i className="bi bi-card-checklist"></i>
                                    About Features
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>Category Name</th>
                                            <th style={styles.th}>Features Details</th>
                                            <th style={styles.th}>Status</th>
                                            <th style={styles.th}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groupedFeatures.length > 0 ? (
                                            groupedFeatures.map((group, index) => (
                                                <tr key={index}>
                                                    <td style={styles.td}>
                                                        <div className="fw-bold">{group.category}</div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                                            {group.details && group.details.map((detail, i) => (
                                                                <li key={i} style={{ marginBottom: '4px' }}>{detail}</li>
                                                            ))}
                                                        </ul>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <span style={styles.badge}>Active</span>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <button 
                                                            className="action-btn"
                                                            style={styles.actionBtn}
                                                            onClick={() => handleFeatureEdit(group)}
                                                            disabled={loading}
                                                            title="Edit all features in this category"
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                        <button 
                                                            className="action-btn"
                                                            style={styles.actionBtn}
                                                            onClick={() => handleFeatureDelete(group)}
                                                            disabled={loading}
                                                            title="Delete entire category"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" style={{ ...styles.td, textAlign: 'center' }}>
                                                    <div style={styles.emptyState}>
                                                        <i className="bi bi-list-ul" style={{ fontSize: '48px', opacity: 0.4 }}></i>
                                                        <p>No features found. Add features in the modal.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <Footer theme={theme} />
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={() => { setShowModal(false); resetForm(); }}>
                    <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h5 style={{ margin: 0, fontWeight: '600' }}>
                                {editId && sectionType === 'about' ? (
                                    <><i className="bi bi-pencil-square me-2"></i>Edit Features Category</>
                                ) : editId ? (
                                    <><i className="bi bi-pencil-square me-2"></i>Edit Content</>
                                ) : (
                                    <><i className="bi bi-stars me-2"></i>Add New Content</>
                                )}
                            </h5>
                            <button 
                                onClick={() => { setShowModal(false); resetForm(); }}
                                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: theme.text, opacity: 0.6 }}
                            >
                                ✕
                            </button>
                        </div>
                        <div style={styles.modalBody}>
                            {!editId && (
                                <div style={styles.radioGroup}>
                                    {['hero', 'about'].map(type => (
                                        <div className="form-check" key={type}>
                                            <input 
                                                className="form-check-input" 
                                                type="radio" 
                                                name="section" 
                                                id={`section-${type}`}
                                                checked={sectionType === type} 
                                                onChange={() => setSectionType(type)} 
                                                disabled={loading}
                                            />
                                            <label className="form-check-label fw-bold text-capitalize" htmlFor={`section-${type}`}>
                                                {type} Section
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {sectionType === 'hero' ? (
                                <>
                                    <div className="mb-3">
                                        <label style={styles.label}>Hero Title *</label>
                                        <input 
                                            style={styles.input}
                                            value={formData.title} 
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Enter hero title"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label style={styles.label}>Subtitle</label>
                                            <input 
                                                style={styles.input}
                                                value={formData.subtitle} 
                                                onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                                                placeholder="Enter subtitle"
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label style={styles.label}>Slug</label>
                                            <input 
                                                style={styles.input}
                                                value={formData.slug} 
                                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                                placeholder="e.g., home, about"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label style={styles.label}>Upload Images</label>
                                        <div 
                                            style={styles.uploadZone}
                                            className="upload-zone"
                                            onClick={() => !loading && document.getElementById('fileInput').click()}
                                        >
                                            <i className="bi bi-cloud-arrow-up" style={{ fontSize: '32px', color: theme.text }}></i>
                                            <p className="mb-0 small" style={{ color: theme.textLight }}>Click to upload or drag and drop</p>
                                            <input id="fileInput" type="file" multiple hidden accept="image/*" onChange={handleImageChange} disabled={loading} />
                                        </div>
                                        {previews.length > 0 && (
                                            <div style={styles.imagePreviewContainer}>
                                                {previews.map((src, idx) => (
                                                    <img key={idx} src={src} alt="preview" style={styles.previewImage} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mb-4 p-3 rounded" style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
                                        <h6 className="fw-bold mb-3" style={{ color: theme.text }}>
                                            {editId ? 'Edit Feature Category' : 'Header Section'}
                                        </h6>
                                        <div className="d-flex gap-2">
                                            <input 
                                                className="form-control" 
                                                style={styles.input}
                                                placeholder="Category Title" 
                                                value={formData.aboutTitle} 
                                                onChange={e => setFormData({ ...formData, aboutTitle: e.target.value })} 
                                                disabled={loading || !!editId}
                                            />
                                            {!editId && (
                                                <button 
                                                    onClick={handleAddAboutTitle} 
                                                    className="btn" 
                                                    style={{ backgroundColor: accent, color: accentOn, border: 'none', padding: '0 20px', borderRadius: '10px' }}
                                                    disabled={loading}
                                                >
                                                    Add
                                                </button>
                                            )}
                                        </div>
                                        {editId && (
                                            <small style={{ color: theme.textLight }}>Category name cannot be changed. To rename, delete and recreate.</small>
                                        )}
                                    </div>
                                    <div className="p-3 rounded" style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="fw-bold m-0">
                                                {editId ? `Edit Features (${aboutFeatures.length})` : 'Features Section'}
                                            </h6>
                                            <button 
                                                className="btn btn-sm rounded-circle" 
                                                onClick={addFeatureRow}
                                                style={{ backgroundColor: accent, color: accentOn, width: '32px', height: '32px', border: 'none' }}
                                                disabled={loading}
                                            >
                                                <i className="bi bi-plus-lg"></i>
                                            </button>
                                        </div>
                                        {/* Render ALL features with proper unique keys */}
                                        {aboutFeatures.length > 0 ? (
                                            aboutFeatures.map((feat, index) => (
                                                <div 
                                                    key={feat.id || `feature-${index}`} 
                                                    style={styles.featureRow}
                                                >
                                                    <div style={styles.featureCategory}>
                                                        {editId ? (
                                                            <input 
                                                                className="form-control" 
                                                                style={styles.input}
                                                                placeholder="Category Name" 
                                                                value={feat.category || editingCategory || ''} 
                                                                onChange={(e) => handleFeatureChange(index, 'category', e.target.value)}
                                                                disabled={true}
                                                            />
                                                        ) : (
                                                            <select 
                                                                className="form-select" 
                                                                style={styles.input}
                                                                value={feat.category} 
                                                                onChange={(e) => handleFeatureChange(index, 'category', e.target.value)}
                                                                disabled={loading}
                                                            >
                                                                <option value="">Select Category</option>
                                                                {featureTitles.map((item) => (
                                                                    <option key={item.id} value={item.title}>{item.title}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                    </div>
                                                    <div style={styles.featureValue}>
                                                        <input 
                                                            className="form-control" 
                                                            style={styles.input}
                                                            placeholder="Feature..." 
                                                            value={feat.feature} 
                                                            onChange={(e) => handleFeatureChange(index, 'feature', e.target.value)} 
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                    {aboutFeatures.length > 1 && (
                                                        <button 
                                                            type="button"
                                                            style={styles.featureRemoveBtn}
                                                            onClick={() => removeFeatureRow(index)}
                                                            disabled={loading}
                                                            title="Remove this feature"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{ color: theme.textLight, textAlign: 'center', padding: '10px' }}>
                                                No features in this category. Add one using the + button.
                                            </p>
                                        )}
                                        {/* Display count of features being edited */}
                                        {editId && aboutFeatures.length > 0 && (
                                            <div style={{ marginTop: '10px', fontSize: '12px', color: theme.textLight }}>
                                                Total features: {aboutFeatures.length}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        <div style={styles.modalFooter}>
                            <button 
                                className="btn btn-outline-dark" 
                                onClick={() => { setShowModal(false); resetForm(); }}
                                style={{ padding: '10px 24px', borderRadius: '10px' }}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn" 
                                onClick={handleSubmit} 
                                disabled={loading}
                                style={{ backgroundColor: accent, color: accentOn, border: 'none', padding: '10px 32px', borderRadius: '10px', ...(loading && styles.disabledBtn) }}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Processing...
                                    </>
                                ) : (
                                    editId ? 'Update Changes' : 'Publish Content'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Banner Confirmation Modal */}
            {deleteConfirm && (
                <div style={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
                    <div style={{ ...styles.modalCard, width: '380px', padding: '28px 26px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            border: `1.5px solid ${theme.text}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px', fontSize: '20px'
                        }}>
                            <i className="bi bi-trash"></i>
                        </div>
                        <h5 style={{ margin: '0 0 8px', fontWeight: 600 }}>Delete this banner?</h5>
                        <p style={{ margin: '0 0 22px', color: theme.textLight, fontSize: '14px' }}>
                            "<strong>{deleteConfirm.title}</strong>" will be permanently removed. This can't be undone.
                        </p>
                        <div className="d-flex gap-2">
                            <button 
                                onClick={() => setDeleteConfirm(null)} 
                                className="btn btn-outline-dark flex-fill"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => handleDelete(deleteConfirm.id)} 
                                className="btn flex-fill"
                                style={{ backgroundColor: accent, color: accentOn, border: 'none' }}
                                disabled={loading}
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Feature Category Confirmation Modal */}
            {featureDeleteConfirm && (
                <div style={styles.modalOverlay} onClick={() => setFeatureDeleteConfirm(null)}>
                    <div style={{ ...styles.modalCard, width: '380px', padding: '28px 26px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            border: `1.5px solid ${theme.text}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px', fontSize: '20px'
                        }}>
                            <i className="bi bi-trash"></i>
                        </div>
                        <h5 style={{ margin: '0 0 8px', fontWeight: 600 }}>Delete this category?</h5>
                        <p style={{ margin: '0 0 22px', color: theme.textLight, fontSize: '14px' }}>
                            "<strong>{featureDeleteConfirm.title}</strong>" and all its features will be permanently removed. This can't be undone.
                        </p>
                        <div className="d-flex gap-2">
                            <button 
                                onClick={() => setFeatureDeleteConfirm(null)} 
                                className="btn btn-outline-dark flex-fill"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => deleteFeatureCategory(featureDeleteConfirm.id)} 
                                className="btn flex-fill"
                                style={{ backgroundColor: accent, color: accentOn, border: 'none' }}
                                disabled={loading}
                            >
                                {loading ? 'Deleting...' : 'Delete Category'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Content;