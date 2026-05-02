import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const OwnerSection = ({ theme: dashboardTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Edit state logic
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const initialFormState = {
        title: '',
        brand_name: '',
        whatsapp_number: '',
        description: '',
        features: [''], 
    };

    const [formData, setFormData] = useState(initialFormState);
    const [selectedImages, setSelectedImages] = useState([]);
    const [previews, setPreviews] = useState([]);

    const theme = {
        bg: isDarkMode ? '#1a1a2e' : (dashboardTheme?.bg || '#f2edf3'),
        card: isDarkMode ? '#16213e' : (dashboardTheme?.card || '#ffffff'),
        text: isDarkMode ? '#e9ecef' : (dashboardTheme?.text || '#3e4b5b'),
        border: isDarkMode ? '#2d3436' : (dashboardTheme?.border || '#ebedf2'),
        accent: dashboardTheme?.accent || '#639c4e'
    };

    const fetchProperties = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/get-property-offers');
            if (res.data.status && res.data.data.data) {
                setProperties(res.data.data.data);
            }
        } catch (err) { console.error("Fetch Error:", err); }
    };

    useEffect(() => { fetchProperties(); }, []);

    // --- Edit Mode Logic ---
    const handleEditClick = (item) => {
        setIsEditing(true);
        setEditId(item.id);
        setFormData({
            title: item.title,
            brand_name: item.brand_name,
            whatsapp_number: item.whatsapp_number,
            description: item.description,
            features: item.features && item.features.length > 0 ? item.features : [''],
        });
        // Existing images preview (Backend storage path)
        const existingPreviews = item.slider_images.map(img => `http://127.0.0.1:8000/storage/${img}`);
        setPreviews(existingPreviews);
        setShowModal(true);
    };

    const closeModal = () => {
        setFormData(initialFormState);
        setPreviews([]);
        setSelectedImages([]);
        setIsEditing(false);
        setEditId(null);
        setShowModal(false);
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    const addFeatureField = () => setFormData({ ...formData, features: [...formData.features, ''] });

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const oversized = files.find(file => file.size > 2048 * 1024);
        if (oversized) {
            alert(`File "${oversized.name}" is too large! Max 2MB.`);
            return;
        }
        setSelectedImages(files);
        setPreviews(files.map(file => URL.createObjectURL(file)));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const data = new FormData();
        data.append('title', formData.title);
        data.append('brand_name', formData.brand_name);
        data.append('whatsapp_number', formData.whatsapp_number);
        data.append('description', formData.description);
        
        formData.features.forEach((feature, index) => {
            if (feature.trim() !== '') data.append(`features[${index}]`, feature);
        });

        // Notoon image thakle pathabe
        if (selectedImages.length > 0) {
            selectedImages.forEach(img => data.append('slider_images[]', img));
        }

        try {
            // URL dynamic: edit hole edit-property-offers/{id} ar add hole add-property-offers
            const url = isEditing 
                ? `http://127.0.0.1:8000/api/edit-property-offers/${editId}`
                : `http://127.0.0.1:8000/api/add-property-offers`;

            await axios.post(url, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            fetchProperties();
            alert(isEditing ? "Updated Successfully!" : "Added Successfully!");
            closeModal();
        } catch (err) { 
            alert(err.response?.data?.message || "Something went wrong!");
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Delete this property?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/del-property-offers/${id}`);
                fetchProperties();
            } catch (err) { console.error(err); }
        }
    };

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh', color: theme.text, transition: '0.3s' }}>
            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
                <Sidebar theme={theme} isCollapsed={isCollapsed} />

                <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                    <Header 
                        theme={theme}
                        isDarkMode={isDarkMode}
                        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
                    />

                    <main className="p-4 flex-grow-1" style={{ overflowY: 'auto' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="fw-bold m-0">Inventory</h3>
                            <button 
                                className="btn text-white d-flex align-items-center gap-2 px-4 py-2 shadow-sm" 
                                style={{ backgroundColor: theme.accent, borderRadius: '10px' }}
                                onClick={() => setShowModal(true)}
                            >
                                <i className="bi bi-plus-circle-fill"></i> Add New
                            </button>
                        </div>

                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ backgroundColor: theme.card }}>
                            <div className="table-responsive">
                                <table className="table align-middle mb-0" style={{ color: theme.text }}>
                                    <thead style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f8f9fa' }}>
                                        <tr>
                                            <th className="ps-4 py-3 border-0">Image & Title</th>
                                            <th className="py-3 border-0">Brand</th>
                                            <th className="py-3 border-0">WhatsApp</th>
                                            <th className="py-3 border-0 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {properties.map((item) => (
                                            <tr key={item.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                                                <td className="ps-4 py-3">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <img 
                                                            src={`http://127.0.0.1:8000/storage/${item.slider_images[0]}`} 
                                                            alt="thumb"
                                                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                                                            onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
                                                        />
                                                        <span className="fw-bold">{item.title}</span>
                                                    </div>
                                                </td>
                                                <td>{item.brand_name}</td>
                                                <td>{item.whatsapp_number}</td>
                                                <td className="text-center">
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <button onClick={() => handleEditClick(item)} className="btn btn-sm btn-outline-primary border-0"><i className="bi bi-pencil-square"></i></button>
                                                        <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-outline-danger border-0"><i className="bi bi-trash3"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                    <Footer theme={theme} />
                </div>
            </div>

            {/* Modal - Both Add & Edit */}
            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4" style={{ backgroundColor: theme.card, color: theme.text }}>
                            <div className="modal-header border-0 p-4 pb-0">
                                <h5 className="fw-bold m-0">{isEditing ? 'Edit Property' : 'Add New Property'}</h5>
                                <button className={`btn-close ${isDarkMode ? 'btn-close-white' : ''}`} onClick={closeModal}></button>
                            </div>
                            <form onSubmit={handleSave} className="modal-body p-4">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">Title</label>
                                        <input type="text" required className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Brand Name</label>
                                        <input type="text" required className="form-control" value={formData.brand_name} onChange={e => setFormData({...formData, brand_name: e.target.value})} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">WhatsApp</label>
                                        <input type="text" required className="form-control" value={formData.whatsapp_number} onChange={e => setFormData({...formData, whatsapp_number: e.target.value})} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">Description</label>
                                        <textarea className="form-control" rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold d-flex justify-content-between">
                                            Features 
                                            <button type="button" className="btn btn-sm btn-link p-0 text-decoration-none" style={{color: theme.accent}} onClick={addFeatureField}>+ Add More</button>
                                        </label>
                                        {formData.features.map((f, i) => (
                                            <input key={i} type="text" className="form-control mb-2" value={f} onChange={e => handleFeatureChange(i, e.target.value)} />
                                        ))}
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">Images {isEditing && "(Leave blank to keep old ones)"}</label>
                                        <input type="file" multiple className="form-control" accept="image/*" onChange={handleImageChange} />
                                        <div className="d-flex flex-wrap gap-2 mt-3">
                                            {previews.map((src, i) => (
                                                <img key={i} src={src} alt="preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 p-0 mt-4 d-flex gap-2">
                                    <button type="button" className="btn btn-light px-4" onClick={closeModal}>Cancel</button>
                                    <button type="submit" disabled={loading} className="btn text-white px-5 shadow-sm" style={{ backgroundColor: theme.accent }}>
                                        {loading ? 'Processing...' : (isEditing ? 'Update Changes' : 'Save Property')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerSection;