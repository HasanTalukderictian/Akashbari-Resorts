import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import axios from 'axios';

const InvestmentBenefit = ({ theme: dashboardTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [benefitsList, setBenefitsList] = useState([]); 
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        benefits: [''] 
    });

    const theme = {
        bg: isDarkMode ? '#1a1a2e' : (dashboardTheme?.bg || '#f2edf3'),
        card: isDarkMode ? '#16213e' : (dashboardTheme?.card || '#ffffff'),
        text: isDarkMode ? '#e9ecef' : (dashboardTheme?.text || '#3e4b5b'),
        border: isDarkMode ? '#2d3436' : (dashboardTheme?.border || '#ebedf2'),
        accent: dashboardTheme?.accent || '#639c4e'
    };

    // ১. ডাটা লোড করা
    const fetchBenefits = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/get-investment-benefits');
            const data = response.data.data.data || response.data.data || [];
            setBenefitsList(data);
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    };

    useEffect(() => {
        fetchBenefits();
    }, []);

    // ২. ডিলিট ফাংশন (এটি আগে বাদ পড়েছিল)
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/del-investment-benefits/${id}`);
                if (response.data.status) {
                    alert("Deleted successfully!");
                    fetchBenefits(); // টেবিল রিফ্রেশ
                }
            } catch (error) {
                alert("Delete failed! Something went wrong.");
                console.error("Delete Error:", error);
            }
        }
    };

    // ৩. সাবমিট ফাংশন (Store & Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (editId) {
                response = await axios.post(`http://127.0.0.1:8000/api/edit-investment-benefits/${editId}`, formData);
            } else {
                response = await axios.post('http://127.0.0.1:8000/api/investment-benefits', formData);
            }

            if (response.data.status) {
                alert("Success: " + response.data.message);
                resetForm();
                fetchBenefits();
            }
        } catch (error) {
            if (error.response && error.response.data) {
                alert("Error: " + error.response.data.message);
            } else {
                alert("Something went wrong!");
            }
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setFormData({
            title: item.title,
            subtitle: item.subtitle,
            benefits: Array.isArray(item.benefits) ? item.benefits : [item.benefits]
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({ title: '', subtitle: '', benefits: [''] });
        setEditId(null);
        setShowModal(false);
    };

    const handleBenefitChange = (index, value) => {
        const newBenefits = [...formData.benefits];
        newBenefits[index] = value;
        setFormData({ ...formData, benefits: newBenefits });
    };

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh', transition: '0.3s' }}>
            <div className="d-flex" style={{ minHeight: '100vh' }}>
                
                <Sidebar theme={theme} isCollapsed={isCollapsed} />

                <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                    <Header 
                        theme={theme}
                        isDarkMode={isDarkMode}
                        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
                    />

                    <main className="p-4" style={{ flex: 1 }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="fw-bold m-0" style={{ color: theme.text }}>Investment Benefit</h3>
                            <button 
                                onClick={() => { resetForm(); setShowModal(true); }}
                                className="btn text-white px-4 py-2 shadow-sm" 
                                style={{ backgroundColor: theme.accent, borderRadius: '10px', border: 'none' }}
                            >
                                <i className="bi bi-plus-circle-fill me-2"></i> Add New
                            </button>
                        </div>

                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ backgroundColor: theme.card }}>
                            <div className="table-responsive">
                                <table className={`table align-middle mb-0 ${isDarkMode ? 'table-dark' : ''}`} style={{ color: theme.text }}>
                                    <thead style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f8f9fa' }}>
                                        <tr>
                                            <th className="ps-4 py-3 border-0">Title</th>
                                            <th className="py-3 border-0">Subtitle</th>
                                            {/* <th className="py-3 border-0">Benefits</th> */}
                                            <th className="py-3 border-0 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {benefitsList.length > 0 ? (
                                            benefitsList.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="ps-4">{item.title}</td>
                                                    <td>{item.subtitle}</td>
                                                    {/* <td>
                                                        <ul className="mb-0 small list-unstyled p-0">
                                                            {Array.isArray(item.benefits) && item.benefits.map((b, i) => (
                                                                <li key={i}><i className="bi bi-dot"></i>{b}</li>
                                                            ))}
                                                        </ul>
                                                    </td> */}
                                                    <td className="text-center">
                                                        <div className="d-flex justify-content-center gap-2">
                                                            <button onClick={() => handleEdit(item)} className="btn btn-sm btn-outline-primary border-0 shadow-sm">
                                                                <i className="bi bi-pencil-square"></i>
                                                            </button>
                                                            <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-outline-danger border-0 shadow-sm">
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 opacity-50">No data available.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                    <Footer theme={theme} />
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4" style={{ backgroundColor: theme.card, color: theme.text }}>
                            <div className="modal-header border-0 p-4 pb-0">
                                <h5 className="fw-bold m-0">{editId ? 'Edit' : 'Add New'}</h5>
                                <button type="button" className={`btn-close ${isDarkMode ? 'btn-close-white' : ''}`} onClick={resetForm}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Title</label>
                                        <input type="text" className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Subtitle</label>
                                        <input type="text" className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold d-flex justify-content-between">
                                            Benefits
                                            <button type="button" onClick={() => setFormData({...formData, benefits: [...formData.benefits, '']})} className="btn btn-sm text-white px-2 py-0" style={{ backgroundColor: theme.accent, fontSize: '12px' }}>+ Add</button>
                                        </label>
                                        {formData.benefits.map((benefit, index) => (
                                            <div key={index} className="d-flex gap-2 mb-2">
                                                <input type="text" className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`} value={benefit} onChange={(e) => handleBenefitChange(index, e.target.value)} required />
                                                {formData.benefits.length > 1 && (
                                                    <button type="button" onClick={() => setFormData({...formData, benefits: formData.benefits.filter((_, i) => i !== index)})} className="btn btn-outline-danger btn-sm border-0"><i className="bi bi-trash"></i></button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="modal-footer border-0 p-4 pt-0">
                                    <button type="button" className="btn btn-secondary px-4 shadow-sm" onClick={resetForm} style={{ borderRadius: '8px' }}>Close</button>
                                    <button type="submit" className="btn text-white px-4 shadow-sm" style={{ backgroundColor: theme.accent, borderRadius: '8px' }}>
                                        {editId ? 'Update' : 'Save'}
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

export default InvestmentBenefit;