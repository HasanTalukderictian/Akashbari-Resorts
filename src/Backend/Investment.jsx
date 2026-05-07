import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Investment = ({ theme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // ডাটা স্টেট
    const [packages, setPackages] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        price: '',
        discount: '',
        land: '',
        building: '',
        total_size: '',
        description: '',
        is_popular: false,
        is_sold_out: false
    });
    const [isEditing, setIsEditing] = useState(false);

    const API_BASE = "http://127.0.0.1:8000/api";

    // ১. ডাটা ফেচ করা
    const fetchPackages = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/get-investment`);
            const result = await response.json();
            if (result.status) {
                setPackages(result.data || []);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    // ২. অ্যাড এবং এডিট হ্যান্ডলার (আপনার দেয়া রাউট অনুযায়ী)
    const handleSave = async (e) => {
        e.preventDefault();
        
        // এডিট হলে /edit-investment/{id} আর নতুন হলে /add-investment
        const url = isEditing 
            ? `${API_BASE}/edit-investment/${formData.id}` 
            : `${API_BASE}/add-investment`;

        try {
            const response = await fetch(url, {
                method: 'POST', // এডিট রাউট POST হিসেবে ডিফাইন করা আছে আপনার রিকোয়েস্টে
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.status) {
                await fetchPackages(); 
                closeModal();
            } else {
                alert(result.message || "Validation Error");
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("Server error, check console.");
        }
    };

    // ৩. ডিলিট হ্যান্ডলার (আপনার দেয়া রাউট অনুযায়ী: /del-investment/{id})
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this package?")) return;
        try {
            const response = await fetch(`${API_BASE}/del-investment/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (result.status) {
                setPackages(prev => prev.filter(item => item.id !== id));
            } else {
                alert(result.message || "Delete failed");
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const openModal = (item = null) => {
        if (item) {
            // ডাটাবেজ থেকে আসা boolean value (0/1) কে true/false এ কনভার্ট করা হচ্ছে
            setFormData({ 
                ...item,
                is_popular: item.is_popular == 1 ? true : false,
                is_sold_out: item.is_sold_out == 1 ? true : false
            });
            setIsEditing(true);
        } else {
            setFormData({
                id: '',
                title: '',
                price: '',
                discount: '',
                land: '',
                building: '',
                total_size: '',
                description: '',
                is_popular: false,
                is_sold_out: false
            });
            setIsEditing(false);
        }
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    const currentTheme = theme || {
        bg: isDarkMode ? '#1a1a1a' : '#f8f9fa',
        card: isDarkMode ? '#2d2d2d' : '#ffffff',
        text: isDarkMode ? '#ffffff' : '#333333',
        border: isDarkMode ? '#444' : '#dee2e6'
    };

    return (
        <div style={{ backgroundColor: currentTheme.bg, minHeight: '100vh', transition: '0.3s' }}>
            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
                <Sidebar theme={currentTheme} isCollapsed={isCollapsed} />
                <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                    <Header 
                        theme={currentTheme}
                        isDarkMode={isDarkMode}
                        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
                    />

                    <main className="p-4 flex-grow-1" style={{ overflowY: 'auto' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 style={{ color: currentTheme.text }} className="fw-bold">Investment Packages</h4>
                            <button className="btn btn-primary shadow-sm" onClick={() => openModal()}>
                                <i className="bi bi-plus-lg me-2"></i> Add New Package
                            </button>
                        </div>

                        {/* Table Section - Night Mode issue Fixed by adding style to table */}
                        <div className="card border-0 shadow-sm" style={{ backgroundColor: currentTheme.card, color: currentTheme.text, borderRadius: '15px' }}>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0" style={{ 
                                        color: currentTheme.text,
                                        backgroundColor: 'transparent' // টেবিল ব্যাকগ্রাউন্ড ট্রান্সপারেন্ট করা হয়েছে
                                    }}>
                                        <thead style={{ borderBottom: `1px solid ${currentTheme.border}` }}>
                                            <tr style={{ color: currentTheme.text }}>
                                                <th className="px-4 py-3 bg-transparent" style={{ color: currentTheme.text }}>Title</th>
                                                <th className="px-4 py-3 bg-transparent" style={{ color: currentTheme.text }}>Price</th>
                                                <th className="px-4 py-3 bg-transparent" style={{ color: currentTheme.text }}>Land/Size</th>
                                                <th className="px-4 py-3 bg-transparent" style={{ color: currentTheme.text }}>Status</th>
                                                <th className="px-4 py-3 bg-transparent text-end" style={{ color: currentTheme.text }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr><td colSpan="5" className="text-center py-4 bg-transparent" style={{ color: currentTheme.text }}>Loading...</td></tr>
                                            ) : packages.map((item) => (
                                                <tr key={item.id} style={{ borderColor: currentTheme.border }}>
                                                    <td className="px-4 py-3 fw-semibold bg-transparent" style={{ color: currentTheme.text }}>{item.title}</td>
                                                    <td className="px-4 py-3 bg-transparent" style={{ color: currentTheme.text }}>{item.price}</td>
                                                    <td className="px-4 py-3 bg-transparent" style={{ color: isDarkMode ? '#aaa' : '#6c757d' }}>{item.total_size}</td>
                                                    <td className="px-4 py-3 bg-transparent">
                                                        {item.is_popular == 1 && <span className="badge bg-success me-1">Popular</span>}
                                                        {item.is_sold_out == 1 && <span className="badge bg-danger">Sold Out</span>}
                                                    </td>
                                                    <td className="px-4 py-3 text-end bg-transparent">
                                                        <button className="btn btn-sm text-info me-2" onClick={() => openModal(item)}>
                                                            <i className="bi bi-pencil-square fs-5"></i>
                                                        </button>
                                                        <button className="btn btn-sm text-danger" onClick={() => handleDelete(item.id)}>
                                                            <i className="bi bi-trash3 fs-5"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </main>
                    <Footer theme={currentTheme} />
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <form className="modal-content border-0 shadow-lg" onSubmit={handleSave} style={{ backgroundColor: currentTheme.card, color: currentTheme.text }}>
                            <div className="modal-header border-0 px-4 pt-4">
                                <h5 className="fw-bold">{isEditing ? "Edit" : "Add"} Investment Package</h5>
                                <button type="button" className={`btn-close ${isDarkMode ? 'btn-close-white' : ''}`} onClick={closeModal}></button>
                            </div>
                            <div className="modal-body px-4">
                                <div className="row g-3">
                                    <div className="col-md-12">
                                        <label className="form-label fw-semibold">Package Title *</label>
                                        <input type="text" className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} value={formData.title} required
                                            onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Premium Garden" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Price</label>
                                        <input type="text" className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} value={formData.price}
                                            onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="e.g. 500000" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Discount</label>
                                        <input type="text" className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} value={formData.discount}
                                            onChange={(e) => setFormData({...formData, discount: e.target.value})} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold">Land</label>
                                        <input type="text" className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} value={formData.land}
                                            onChange={(e) => setFormData({...formData, land: e.target.value})} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold">Building</label>
                                        <input type="text" className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} value={formData.building}
                                            onChange={(e) => setFormData({...formData, building: e.target.value})} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold">Total Size</label>
                                        <input type="text" className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} value={formData.total_size}
                                            onChange={(e) => setFormData({...formData, total_size: e.target.value})} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Description</label>
                                        <textarea className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} rows="3" value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                                    </div>
                                    <div className="col-md-6 d-flex align-items-center">
                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" checked={formData.is_popular}
                                                onChange={(e) => setFormData({...formData, is_popular: e.target.checked})} />
                                            <label className="form-check-label fw-semibold">Mark as Popular</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 d-flex align-items-center">
                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" checked={formData.is_sold_out}
                                                onChange={(e) => setFormData({...formData, is_sold_out: e.target.checked})} />
                                            <label className="form-check-label fw-semibold text-danger">Mark as Sold Out</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-0 px-4 pb-4">
                                <button type="button" className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-light'} px-4`} onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary px-5 shadow-sm">Save Package</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Investment;