import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const OwnerBenefit = ({ theme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // ডাটা স্টেট (সবসময় অ্যারে দিয়ে শুরু হবে)
    const [benefits, setBenefits] = useState([]);
    const [formData, setFormData] = useState({ id: '', title: '', desc: '' });
    const [isEditing, setIsEditing] = useState(false);

    const API_BASE = "http://127.0.0.1:8000/api";

    // ১. ডাটা ফেচ করা (Pagination Format অনুযায়ী)
    const fetchBenefits = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/get-property-benifit`);
            const result = await response.json();
            
            // আপনার রেসপন্স অনুযায়ী: result.data.data হচ্ছে আসল অ্যারে
            if (result.status && result.data && Array.isArray(result.data.data)) {
                setBenefits(result.data.data);
            } else {
                setBenefits([]);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setBenefits([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBenefits();
    }, []);

    // ২. অ্যাড এবং এডিট হ্যান্ডলার
  const handleSave = async (e) => {
    e.preventDefault();
    
    // এডিট হলে ইউআরএল হবে: /api/edit-property-benifit/5
    // অ্যাড হলে ইউআরএল হবে: /api/add-property-benifit
    const url = isEditing 
        ? `${API_BASE}/edit-property-benifit/${formData.id}` 
        : `${API_BASE}/add-property-benifit`;

    try {
        const response = await fetch(url, {
            method: 'POST', // লারাভেল রাউটে যেহেতু POST দেওয়া
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: formData.title,
                desc: formData.desc
            }),
        });

        const result = await response.json();

        if (result.status) {
            await fetchBenefits(); // লিস্ট আপডেট করুন
            closeModal();
        } else {
            alert(result.message || "Error saving data");
        }
    } catch (error) {
        console.error("Save error:", error);
        alert("Server error, check console.");
    }
};

    // ৩. ডিলিট হ্যান্ডলার (ID টা বডিতে বা URL এ দিতে হয়)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;

    try {
        // ইউআরএল হবে: /api/delete-property-benifit/5
        const response = await fetch(`${API_BASE}/delete-property-benifit/${id}`, {
            method: 'DELETE', // রাউট অনুযায়ী DELETE মেথড
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (result.status) {
            // স্টেট থেকে সরাসরি ডিলিট করে দিলে রিফ্রেশ কম লাগবে
            setBenefits(prev => prev.filter(item => item.id !== id));
        } else {
            alert(result.message || "Delete failed");
        }
    } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete. Check network/server.");
    }
};

    const openModal = (item = null) => {
        if (item) {
            setFormData({ id: item.id, title: item.title, desc: item.desc });
            setIsEditing(true);
        } else {
            setFormData({ id: '', title: '', desc: '' });
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
                            <h4 style={{ color: currentTheme.text }} className="fw-bold">Owner Benefits</h4>
                            <button className="btn btn-primary" onClick={() => openModal()}>
                                <i className="bi bi-plus-lg me-2"></i> Add New
                            </button>
                        </div>

                        <div className="card border-0 shadow-sm" style={{ backgroundColor: currentTheme.card, color: currentTheme.text, borderRadius: '15px' }}>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0" style={{ color: currentTheme.text }}>
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-3">Title</th>
                                                <th className="px-4 py-3">Description</th>
                                                <th className="px-4 py-3 text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr><td colSpan="3" className="text-center py-4">Loading Data...</td></tr>
                                            ) : benefits.length > 0 ? (
                                                benefits.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="px-4 py-3 fw-semibold">{item.title}</td>
                                                        <td className="px-4 py-3 text-muted">{item.desc}</td>
                                                        <td className="px-4 py-3 text-end">
                                                            <button className="btn btn-sm text-info" onClick={() => openModal(item)}>
                                                                <i className="bi bi-pencil-square fs-5"></i>
                                                            </button>
                                                            <button className="btn btn-sm text-danger" onClick={() => handleDelete(item.id)}>
                                                                <i className="bi bi-trash3 fs-5"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan="3" className="text-center py-4 text-muted">No records found.</td></tr>
                                            )}
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
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <form className="modal-content" onSubmit={handleSave} style={{ backgroundColor: currentTheme.card, color: currentTheme.text }}>
                            <div className="modal-header border-0">
                                <h5 className="modal-title">{isEditing ? "Edit" : "Add"} Benefit</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input 
                                        type="text" className="form-control" 
                                        value={formData.title} required
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea 
                                        className="form-control" rows="3" 
                                        value={formData.desc} required
                                        onChange={(e) => setFormData({...formData, desc: e.target.value})}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer border-0">
                                <button type="button" className="btn btn-light" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary px-4">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerBenefit;