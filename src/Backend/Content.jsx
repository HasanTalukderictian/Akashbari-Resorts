import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Content = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- Modal & Form States ---
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null); 
    const [formData, setFormData] = useState({ title: '', subtitle: '', slug: '' });
    const [selectedImages, setSelectedImages] = useState([]);
    const [previews, setPreviews] = useState([]);

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2'
    };

    // --- Fetch Data ---
    const fetchBanners = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://127.0.0.1:8000/api/v1/banners/active');
            const result = await res.json();
            if (result.status === 'success') {
                setBanners(Array.isArray(result.data) ? result.data : [result.data]);
            }
        } catch (err) { console.error("Fetch Error:", err); } 
        finally { setLoading(false); }
    };

    useEffect(() => { fetchBanners(); }, []);

    // --- Delete Function ---
    const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
        try {
            const res = await fetch(
                `http://127.0.0.1:8000/api/v1/del-banners/${id}`,
                {
                    method: 'DELETE'
                }
            );

            const data = await res.json();

            if (res.ok && data.status === 'success') {
                fetchBanners();
            } else {
                console.error(data);
            }
        } catch (err) {
            console.error("Delete Error:", err);
        }
    }
};

    // --- Edit Mode Trigger ---
const handleEdit = (banner) => {
    setEditId(banner.id);
    setFormData({
        title: banner.title,
        subtitle: banner.subtitle,
        slug: banner.slug
    });

    setSelectedImages([]); // ✅ FIX
    setPreviews(banner.images || []);

    setShowModal(true);
};
    const handleMultipleImages = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(files);
        const filePreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(filePreviews);
    };

    // --- Submit (Create & Update) ---
const handleSubmit = async () => {
    const data = new FormData();

    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle);
    data.append('slug', formData.slug);

    selectedImages.forEach(img => data.append('images[]', img));

    let url = 'http://127.0.0.1:8000/api/v1/banners';

    if (editId) {
        url = `http://127.0.0.1:8000/api/v1/banners/${editId}`;
    }

    const res = await fetch(url, {
        method: 'POST', // 👈 SAME FOR BOTH CREATE & UPDATE
        body: data
    });

    if (res.ok) {
        setShowModal(false);
        resetForm();
        fetchBanners();
    }
};

    const resetForm = () => {
        setEditId(null);
        setFormData({ title: '', subtitle: '', slug: '' });
        setPreviews([]);
        setSelectedImages([]);
    };

    const styles = {
        modalOverlay: {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
            display: showModal ? 'flex' : 'none', justifyContent: 'center',
            alignItems: 'center', zIndex: 10000, transition: '0.3s'
        },
        modalCard: {
            width: '500px', background: theme.card, borderRadius: '24px',
            border: `1px solid ${theme.border}`, overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        },
        uploadZone: {
            border: `2px dashed ${theme.border}`, borderRadius: '15px',
            padding: '20px', textAlign: 'center', cursor: 'pointer',
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : '#fafafa',
            transition: '0.3s'
        },
        tableCard: {
            background: theme.card, borderRadius: '20px',
            border: `1px solid ${theme.border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            overflow: 'hidden'
        },
        actionBtn: {
            width: '35px', height: '35px', borderRadius: '10px',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 4px', transition: '0.3s'
        }
    };

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }} className="container-fluid p-0">
            
            {/* --- Attractive Modal --- */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={() => { setShowModal(false); resetForm(); }}>
                    <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-bottom d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(to right, #da8cff, #9a55ff)' }}>
                            <h5 className="m-0 text-white fw-bold">{editId ? 'Update Banner' : 'Create New Banner'}</h5>
                            <button className="btn-close btn-close-white" onClick={() => { setShowModal(false); resetForm(); }}></button>
                        </div>

                        <div className="p-4">
                            <div className="mb-3">
                                <label className="form-label small fw-bold" style={{ color: theme.text }}>TITLE</label>
                                <input value={formData.title} className="form-control border-0 shadow-sm" style={{ background: theme.bg, color: theme.text }} placeholder="Enter title..." onChange={e => setFormData({...formData, title: e.target.value})} />
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold" style={{ color: theme.text }}>SUBTITLE</label>
                                    <input value={formData.subtitle} className="form-control shadow-sm border-0" style={{ background: theme.bg, color: theme.text }} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold" style={{ color: theme.text }}>SLUG</label>
                                    <input value={formData.slug} className="form-control shadow-sm border-0" style={{ background: theme.bg, color: theme.text }} onChange={e => setFormData({...formData, slug: e.target.value})} />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold" style={{ color: theme.text }}>IMAGES {editId && '(Leave empty to keep old)'}</label>
                                <div style={styles.uploadZone} onClick={() => document.getElementById('multiInput').click()}>
                                    <i className="bi bi-cloud-arrow-up fs-2" style={{ color: '#9a55ff' }}></i>
                                    <p className="mb-0 small text-muted text-uppercase">Click to upload</p>
                                    <input id="multiInput" type="file" multiple hidden onChange={handleMultipleImages} />
                                </div>
                            </div>

                            {previews.length > 0 && (
                                <div className="d-flex gap-2 overflow-auto pb-2">
                                    {previews.map((src, index) => (
                                        <img key={index} src={src} alt="preview" className="rounded shadow-sm" style={{ width: '60px', height: '45px', objectFit: 'cover', border: '1px solid #9a55ff' }} />
                                    ))}
                                </div>
                            )}

                            <div className="d-flex gap-3 mt-4">
                                <button className="btn btn-light flex-grow-1 fw-bold" onClick={() => { setShowModal(false); resetForm(); }}>Discard</button>
                                <button className="btn btn-primary flex-grow-1 fw-bold" style={{ background: 'linear-gradient(to right, #da8cff, #9a55ff)', border: 'none' }} onClick={handleSubmit}>
                                    {editId ? 'Update Now' : 'Upload Banner'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="content" />
                <div className="flex-grow-1 d-flex flex-column" style={{ height: '100vh', overflow: 'hidden' }}>
                    <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
                    
                    <div className="flex-grow-1 overflow-auto p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h4 className="fw-bold m-0" style={{ color: theme.text }}>Banner Management</h4>
                                <p className="text-muted small m-0">Admin Dashboard Control</p>
                            </div>
                            <button className="btn btn-primary px-4 shadow-sm" style={{ background: 'linear-gradient(to right, #da8cff, #9a55ff)', border: 'none', borderRadius: '10px' }} 
                                    onClick={() => { resetForm(); setShowModal(true); }}>
                                <i className="bi bi-plus-lg me-2"></i> Add New
                            </button>
                        </div>

                        <div style={styles.tableCard}>
                            <table className="table m-0" style={{ color: theme.text }}>
                                <thead style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#fcfcfc' }}>
                                    <tr>
                                        <th className="py-3 px-4 border-0 small text-uppercase">Banner Info</th>
                                        <th className="py-3 border-0 small text-uppercase">Link Slug</th>
                                        <th className="py-3 px-4 border-0 small text-uppercase text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="3" className="text-center py-5">Loading Banners...</td></tr>
                                    ) : banners.map((b) => (
                                        <tr key={b.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                                            <td className="py-3 px-4 align-middle">
                                                <div className="fw-bold">{b.title}</div>
                                                <div className="small text-muted">{b.subtitle}</div>
                                            </td>
                                            <td className="py-3 align-middle">
                                                <span className="badge rounded-pill bg-light text-dark border">/{b.slug}</span>
                                            </td>
                                            <td className="py-3 px-4 text-end align-middle">
                                                <button className="btn btn-outline-primary" style={{ ...styles.actionBtn, borderColor: '#da8cff', color: '#9a55ff' }} onClick={() => handleEdit(b)}>
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <button className="btn btn-outline-danger" style={styles.actionBtn} onClick={() => handleDelete(b.id)}>
                                                    <i className="bi bi-trash3"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Footer theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Content;