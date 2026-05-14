import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

// API এবং স্টোরেজ পাথ কনফিগারেশন
export const API_BASE = 'http://127.0.0.1:8000/api';
export const STORAGE_BASE = 'http://127.0.0.1:8000'; // Changed: removed '/storage'

// হেল্পার ফাংশন ইমেজ URL জেনারেট করার জন্য
const getImageUrl = (item) => {
    if (!item) return null;
    
    // যদি image_url থাকে (API থেকে আসা)
    if (item.image_url) {
        return item.image_url;
    }
    
    // যদি image ফিল্ড থাকে
    if (item.image) {
        // যদি ইতিমধ্যে full URL হয়
        if (item.image.startsWith('http')) {
            return item.image;
        }
        // পাথ থেকে 'storage/' বাদ দিয়ে base URL যোগ করুন
        let cleanPath = item.image.replace(/^storage\//, '');
        return `${STORAGE_BASE}/${cleanPath}`;
    }
    
    return null;
};

// --- মোডাল কম্পোনেন্ট (Create, View, Edit এর জন্য) ---
const CustomModal = ({ theme, onClose, fetchItems, editingItem, readOnly }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        image: null,
        features: ['']
    });
    const [imagePreview, setImagePreview] = useState(null);

    // এডিট বা ভিউ মোড হলে ডেটা সেট করা
    useEffect(() => {
        if (editingItem) {
            let parsedFeatures = [''];
            try {
                parsedFeatures = typeof editingItem.features === 'string' 
                    ? JSON.parse(editingItem.features) 
                    : editingItem.features;
            } catch (e) {
                parsedFeatures = [editingItem.features];
            }

            setFormData({
                title: editingItem.title || '',
                image: null,
                features: parsedFeatures || ['']
            });
            
            // ইমেজ প্রিভিউ সেট করা - সঠিকভাবে
            const imageUrl = getImageUrl(editingItem);
            setImagePreview(imageUrl);
        }
    }, [editingItem]);

    const handleInputChange = (e) => {
        if (readOnly) return;
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    const addFeatureField = () => {
        setFormData({ ...formData, features: [...formData.features, ''] });
    };

    const removeFeatureField = (index) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData({ ...formData, features: newFeatures });
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const data = new FormData();
            data.append('title', formData.title);
            
            // এডিট করার সময় status যোগ করুন
            if (editingItem) {
                data.append('status', editingItem.status || 'active');
            }
            
            if (formData.image) {
                data.append('image', formData.image);
            }
            
            formData.features.forEach((feature, index) => {
                if (feature.trim() !== '') {
                    data.append(`features[${index}]`, feature);
                }
            });

            if (editingItem) {
                // Laravel এ PUT রিকোয়েস্টে ফাইল পাঠাতে _method override লাগে
                data.append('_method', 'PUT');
                await axios.post(`${API_BASE}/luxury-items/${editingItem.id}`, data);
            } else {
                await axios.post(`${API_BASE}/luxury-items`, data);
            }

            fetchItems();
            onClose();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1050, backdropFilter: 'blur(4px)'
        }}>
            <div className="p-4 shadow" style={{
                backgroundColor: theme.card, color: theme.text,
                width: '100%', maxWidth: '500px', borderRadius: '20px',
                border: `1px solid ${theme.border}`
            }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0 text-primary">
                        {readOnly ? 'Item Details' : editingItem ? 'Edit Luxury Item' : 'Add New Item'}
                    </h5>
                    <button onClick={onClose} className="btn-close" 
                        style={{ filter: theme.isDarkMode ? 'invert(1)' : 'none' }}>
                    </button>
                </div>

                <div className="mb-3">
                    <label className="form-label small fw-bold">Title</label>
                    <input type="text" name="title" className="form-control" readOnly={readOnly}
                        value={formData.title} onChange={handleInputChange}
                        style={{ backgroundColor: theme.bg, color: theme.text, borderColor: theme.border }}
                    />
                </div>

                {!readOnly && (
                    <div className="mb-3">
                        <label className="form-label small fw-bold">Image</label>
                        <input type="file" className="form-control" onChange={handleImageChange}
                            style={{ backgroundColor: theme.bg, color: theme.text, borderColor: theme.border }}
                        />
                    </div>
                )}

                {imagePreview && (
                    <div className="mb-3 text-center">
                        <img 
                            src={imagePreview} 
                            alt="Preview" 
                            style={{ 
                                width: '100%', 
                                maxHeight: '150px', 
                                objectFit: 'contain', 
                                borderRadius: '10px',
                                border: `1px solid ${theme.border}`
                            }} 
                            onError={(e) => {
                                console.error('Image failed to load:', imagePreview);
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/400x200?text=No+Image+Available';
                            }}
                        />
                    </div>
                )}

                <div className="mb-4">
                    <label className="form-label small fw-bold d-flex justify-content-between">
                        Features
                        {!readOnly && (
                            <span className="text-primary" style={{ cursor: 'pointer' }} onClick={addFeatureField}>
                                <i className="bi bi-plus-circle"></i> Add
                            </span>
                        )}
                    </label>
                    <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                        {formData.features.map((f, i) => (
                            <div key={i} className="d-flex gap-2 mb-2">
                                <input type="text" className="form-control" readOnly={readOnly}
                                    value={f} onChange={(e) => handleFeatureChange(i, e.target.value)}
                                    style={{ backgroundColor: theme.bg, color: theme.text, borderColor: theme.border }}
                                />
                                {!readOnly && formData.features.length > 1 && (
                                    <button className="btn btn-sm text-danger" onClick={() => removeFeatureField(i)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="d-flex gap-2">
                    {!readOnly && (
                        <button className="btn btn-primary w-100 fw-bold" onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Processing...' : 'Save Changes'}
                        </button>
                    )}
                    <button className="btn btn-secondary w-100 fw-bold" onClick={onClose}>
                        {readOnly ? 'Close' : 'Cancel'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- মেইন সেকশন কম্পোনেন্ট ---
const LuxurySection = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // এডিট ও ভিউ স্টেট
    const [selectedItem, setSelectedItem] = useState(null);
    const [readOnly, setReadOnly] = useState(false);

    const theme = {
        isDarkMode,
        bg: isDarkMode ? '#0f172a' : '#f8f9fa',
        card: isDarkMode ? '#1e293b' : '#ffffff',
        text: isDarkMode ? '#f1f5f9' : '#334155',
        border: isDarkMode ? '#334155' : '#e2e8f0',
    };

    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/luxury-items`);
            const fetchedItems = res.data.data.data || [];
            
            // প্রতিটি আইটেমে image_url যোগ করুন যদি না থাকে
            const itemsWithImageUrl = fetchedItems.map(item => ({
                ...item,
                image_url: item.image_url || getImageUrl(item)
            }));
            
            setItems(itemsWithImageUrl);
        } catch (e) { 
            console.error(e); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { fetchItems(); }, []);

    const openModal = (item = null, isView = false) => {
        setSelectedItem(item);
        setReadOnly(isView);
        setShowModal(true);
    };

    const deleteItem = async (id) => {
        if (!window.confirm("Delete this item?")) return;
        try {
            await axios.delete(`${API_BASE}/luxury-items/${id}`);
            fetchItems();
        } catch (error) {
            console.error(error);
            alert('Failed to delete item');
        }
    };

    return (
        <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh' }}>
            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
                <Sidebar theme={theme} isCollapsed={isCollapsed} />
                <div className="flex-grow-1 d-flex flex-column">
                    <Header theme={theme} isDarkMode={isDarkMode} 
                        toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
                        toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
                    />
                    <main className="p-4 overflow-auto">
                        <div className="d-flex justify-content-between mb-4">
                            <h4 className="fw-bold">Luxury Items</h4>
                            <button className="btn btn-primary" onClick={() => openModal()}>
                                <i className="bi bi-plus-lg"></i> Add New
                            </button>
                        </div>

                        <div className="card border-0 shadow-sm" style={{ backgroundColor: theme.card }}>
                            <div className="table-responsive">
                                <table className={`table mb-0 ${isDarkMode ? 'table-dark' : ''}`}>
                                    <thead>
                                        <tr>
                                            <th className="p-3">Image</th>
                                            <th className="p-3">Title</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3 text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="text-center p-5">
                                                    No items found. Click "Add New" to create one.
                                                </td>
                                            </tr>
                                        ) : (
                                            items.map(item => (
                                                <tr key={item.id}>
                                                    <td className="p-3" style={{ width: '80px' }}>
                                                        {item.image_url ? (
                                                            <img 
                                                                src={item.image_url} 
                                                                alt={item.title} 
                                                                style={{ 
                                                                    width: '50px', 
                                                                    height: '50px', 
                                                                    objectFit: 'cover', 
                                                                    borderRadius: '8px' 
                                                                }}
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = 'https://via.placeholder.com/50x50?text=No+Img';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div style={{ 
                                                                width: '50px', 
                                                                height: '50px', 
                                                                background: '#ddd', 
                                                                borderRadius: '8px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '12px'
                                                            }}>
                                                                No img
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-3">{item.title}</td>
                                                    <td className="p-3">
                                                        <span className={`badge bg-${item.status === 'active' ? 'success' : 'danger'}`}>
                                                            {item.status}
                                                        </span>
                                                     </td>
                                                    <td className="p-3 text-end">
                                                        <button className="btn btn-sm btn-info me-2 text-white" onClick={() => openModal(item, true)}>
                                                            <i className="bi bi-eye"></i>
                                                        </button>
                                                        <button className="btn btn-sm btn-warning me-2 text-white" onClick={() => openModal(item, false)}>
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                        <button className="btn btn-sm btn-danger" onClick={() => deleteItem(item.id)}>
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                     </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                    <Footer theme={theme} />
                </div>
            </div>

            {showModal && (
                <CustomModal 
                    theme={theme} 
                    onClose={() => setShowModal(false)} 
                    fetchItems={fetchItems} 
                    editingItem={selectedItem} 
                    readOnly={readOnly}
                />
            )}
        </div>
    );
};

export default LuxurySection;