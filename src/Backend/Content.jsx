import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Content = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- API Data States ---
    const [featureTitles, setFeatureTitles] = useState([]); // Dropdown er jonno
    const [groupedFeatures, setGroupedFeatures] = useState([]); // 2nd Table er jonno

    // --- Modal & Form States ---
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [sectionType, setSectionType] = useState('hero');

    const [formData, setFormData] = useState({
        title: '', subtitle: '', slug: '',
        aboutTitle: '',
    });

    const [aboutFeatures, setAboutFeatures] = useState([{ category: '', feature: '' }]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [previews, setPreviews] = useState([]);

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2'
    };

    // --- 1. Fetch Main Banners ---
    const fetchBanners = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://127.0.0.1:8000/api/v1/banners/active');
            const result = await res.json();
            if (result.status === 'success') {
                setBanners(Array.isArray(result.data) ? result.data : [result.data]);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    // --- 2. Fetch Feature Titles for Dropdown ---
    const fetchFeatureTitles = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/get-features');
            const result = await res.json();
            if (result.status === 'success') {
                setFeatureTitles(result.data);
            }
        } catch (err) { console.error("Dropdown fetch error:", err); }
    };

    // --- 3. Fetch Grouped Features (for 2nd Table) ---
    const fetchGroupedFeatures = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/get-about-features'); // Change API URL if needed
            const result = await res.json();
            if (result.status === 'success') {
                setGroupedFeatures(result.data);
            }
        } catch (err) { console.error("Grouped data fetch error:", err); }
    };

    useEffect(() => {
        fetchBanners();
        fetchFeatureTitles();
        fetchGroupedFeatures();
    }, []);

    // --- Add Header Title API ---
    const handleAddAboutTitle = async () => {
        if (!formData.aboutTitle) return alert("Title is required");
        try {
            const res = await fetch('http://127.0.0.1:8000/api/add-features', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ title: formData.aboutTitle })
            });
            const result = await res.json();
            if (result.status === 'success') {
                alert("Header Title Saved!");
                fetchFeatureTitles();
                setFormData({ ...formData, aboutTitle: '' });
            }
        } catch (err) { console.error(err); }
    };

    // --- Submit Logic (Hero & About) ---
    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (sectionType === 'hero') {
                const data = new FormData();
                data.append('title', formData.title);
                data.append('subtitle', formData.subtitle);
                data.append('slug', formData.slug);
                selectedImages.forEach((image) => data.append('images[]', image));

                const url = editId ? `http://127.0.0.1:8000/api/v1/update-banners/${editId}` : 'http://127.0.0.1:8000/api/v1/add-banners';
                const res = await fetch(url, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } });
                const result = await res.json();

                if (result.status === 'success') {
                    alert("Hero Banner Saved!");
                    setShowModal(false); resetForm(); fetchBanners();
                }
            } else {
                // About Section Save Logic
                const res = await fetch('http://127.0.0.1:8000/api/save-about-features', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    // Key-ti oboshoy 'aboutFeatures' hote hobe
                    body: JSON.stringify({ aboutFeatures: aboutFeatures })
                });
                const result = await res.json();
                if (result.status === 'success') {
                    alert("Features Saved!");
                    setShowModal(false); resetForm(); fetchGroupedFeatures();
                }
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            const res = await fetch(`http://127.0.0.1:8000/api/v1/del-banners/${id}`, { method: 'DELETE' });
            if (res.ok) fetchBanners();
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        if (item.slug) {
            setSectionType('hero');
            setFormData({ ...formData, title: item.title, subtitle: item.subtitle, slug: item.slug });
            setPreviews(item.images || []);
        } else {
            setSectionType('about');
            setFormData({ ...formData, aboutTitle: item.title });
            setAboutFeatures([{ category: item.category || '', feature: item.features || '' }]);
        }
        setShowModal(true);
    };

    const resetForm = () => {
        setEditId(null);
        setFormData({ title: '', subtitle: '', slug: '', aboutTitle: '' });
        setAboutFeatures([{ category: '', feature: '' }]);
        setPreviews([]);
        setSelectedImages([]);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(files);
        setPreviews(files.map(file => URL.createObjectURL(file)));
    };

    const handleFeatureChange = (index, field, value) => {
        const updated = [...aboutFeatures];
        updated[index][field] = value;
        setAboutFeatures(updated);
    };

    const styles = {
        modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: showModal ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', zIndex: 10000 },
        modalCard: { width: '650px', maxHeight: '90vh', background: theme.card, borderRadius: '24px', border: `1px solid ${theme.border}`, overflowY: 'auto' },
        uploadZone: { border: `2px dashed ${theme.border}`, borderRadius: '15px', padding: '20px', textAlign: 'center', cursor: 'pointer', backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : '#fafafa' },
        tableCard: { background: theme.card, borderRadius: '20px', border: `1px solid ${theme.border}`, overflow: 'hidden' },
        actionBtn: { width: '35px', height: '35px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '0 4px' }
    };

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }} className="container-fluid p-0 d-flex flex-column">

            {showModal && (
                <div style={styles.modalOverlay} onClick={() => { setShowModal(false); resetForm(); }}>
                    <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-bottom d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(to right, #da8cff, #9a55ff)' }}>
                            <h5 className="m-0 text-white fw-bold">{editId ? `Edit ${sectionType.toUpperCase()}` : 'Add New Content'}</h5>
                            <button className="btn-close btn-close-white" onClick={() => { setShowModal(false); resetForm(); }}></button>
                        </div>

                        <div className="p-4">
                            {!editId && (
                                <div className="mb-4 d-flex justify-content-center gap-4 border p-2 rounded-pill bg-light">
                                    {['hero', 'about'].map(type => (
                                        <div className="form-check" key={type}>
                                            <input className="form-check-input" type="radio" name="section" checked={sectionType === type} onChange={() => setSectionType(type)} />
                                            <label className="form-check-label fw-bold text-capitalize">{type} Section</label>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {sectionType === 'hero' ? (
                                <div id="hero-form">
                                    <div className="mb-3">
                                        <label className="small fw-bold">HERO TITLE</label>
                                        <input value={formData.title} className="form-control" onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-6"><label className="small fw-bold">SUBTITLE</label><input value={formData.subtitle} className="form-control" onChange={e => setFormData({ ...formData, subtitle: e.target.value })} /></div>
                                        <div className="col-md-6"><label className="small fw-bold">SLUG</label><input value={formData.slug} className="form-control" onChange={e => setFormData({ ...formData, slug: e.target.value })} /></div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="small fw-bold">UPLOAD IMAGES</label>
                                        <div style={styles.uploadZone} onClick={() => document.getElementById('fileInput').click()}>
                                            <i className="bi bi-cloud-arrow-up fs-2" style={{ color: '#9a55ff' }}></i>
                                            <p className="mb-0 small text-muted">Click to upload</p>
                                            <input id="fileInput" type="file" multiple hidden onChange={handleImageChange} />
                                        </div>
                                    </div>
                                    {previews.length > 0 && (
                                        <div className="d-flex gap-2 overflow-auto pb-3">
                                            {previews.map((src, idx) => (
                                                <img key={idx} src={src} alt="preview" className="rounded border shadow-sm" style={{ width: '80px', height: '55px', objectFit: 'cover' }} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div id="about-form">
                                    <div className="p-3 mb-3 rounded border bg-light">
                                        <h6 className="fw-bold text-primary mb-3">Header Section</h6>
                                        <div className="d-flex gap-2">
                                            <input className="form-control" placeholder="Main Title" value={formData.aboutTitle} onChange={e => setFormData({ ...formData, aboutTitle: e.target.value })} />
                                            <button onClick={handleAddAboutTitle} className="btn btn-primary px-3" style={{ background: '#9a55ff', border: 'none' }}>Add</button>
                                        </div>
                                    </div>

                                    <div className="p-3 rounded border bg-light">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="fw-bold text-info m-0">Features Section</h6>
                                            <button className="btn btn-dark btn-sm rounded-circle" onClick={() => setAboutFeatures([...aboutFeatures, { category: '', feature: '' }])}><i className="bi bi-plus-lg"></i></button>
                                        </div>
                                        {aboutFeatures.map((feat, index) => (
                                            <div key={index} className="row g-2 mb-3 border-bottom pb-3">
                                                <div className="col-md-5">
                                                    <select className="form-select" value={feat.category} onChange={(e) => handleFeatureChange(index, 'category', e.target.value)}>
                                                        <option value="">Select Category</option>
                                                        {featureTitles.map((item) => (
                                                            <option key={item.id} value={item.title}>{item.title}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-md-7">
                                                    <input className="form-control" placeholder="Feature..." value={feat.feature} onChange={(e) => handleFeatureChange(index, 'feature', e.target.value)} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="d-flex gap-3 mt-4">
                                <button className="btn btn-light flex-grow-1 fw-bold border" onClick={() => { setShowModal(false); resetForm(); }}>Discard</button>
                                <button className="btn btn-primary flex-grow-1 fw-bold" style={{ background: 'linear-gradient(to right, #da8cff, #9a55ff)', border: 'none' }} onClick={handleSubmit} disabled={loading}>
                                    {loading ? 'Processing...' : (editId ? 'Save Changes' : 'Publish Content')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="d-flex flex-grow-1">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="content" />
                <div className="flex-grow-1 d-flex flex-column" style={{ height: '100vh' }}>
                    <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
                    <div className="flex-grow-1 overflow-auto p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold m-0" style={{ color: theme.text }}>Page Management</h4>
                            <button className="btn btn-primary px-4 shadow-sm fw-bold" style={{ background: 'linear-gradient(to right, #da8cff, #9a55ff)', border: 'none', borderRadius: '12px' }} onClick={() => { resetForm(); setShowModal(true); }}>+ Add New</button>
                        </div>

                        {/* --- TABLE 1: MAIN BANNERS --- */}
                        <div style={styles.tableCard}>
                            <table className="table m-0" style={{ color: theme.text }}>
                                <thead style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#fcfcfc' }}>
                                    <tr>
                                        <th className="py-3 px-4 border-0">Title</th>
                                        <th className="py-3 border-0">Type</th>
                                        <th className="py-3 px-4 border-0 text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {banners.map((b) => (
                                        <tr key={b.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                                            <td className="py-3 px-4 align-middle">
                                                <div className="fw-bold">{b.title}</div>
                                                <div className="small text-muted">{b.slug ? `/${b.slug}` : 'About Section'}</div>
                                            </td>
                                            <td className="py-3 align-middle"><span className={`badge rounded-pill ${b.slug ? 'bg-primary' : 'bg-info'}`}>{b.slug ? 'Hero' : 'About'}</span></td>
                                            <td className="py-3 px-4 text-end align-middle">
                                                <button className="btn btn-outline-primary" style={styles.actionBtn} onClick={() => handleEdit(b)}><i className="bi bi-pencil-square"></i></button>
                                                <button className="btn btn-outline-danger" style={styles.actionBtn} onClick={() => handleDelete(b.id)}><i className="bi bi-trash3"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* --- TABLE 2: GROUPED ABOUT FEATURES --- */}
                        <div className="mt-5 mb-3">
                            <h6 className="fw-bold text-muted">Grouped About Features</h6>
                        </div>
                        <div style={styles.tableCard}>
                            <table className="table m-0" style={{ color: theme.text }}>
                                <thead style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#fcfcfc' }}>
                                    <tr>
                                        <th className="py-3 px-4 border-0">Category Name</th>
                                        <th className="py-3 border-0">Features Details</th>
                                        <th className="py-3 px-4 border-0 text-end">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedFeatures.length > 0 ? (
                                        groupedFeatures.map((group, index) => (
                                            <tr key={index} style={{ borderBottom: `1px solid ${theme.border}` }}>
                                                <td className="py-3 px-4 align-middle">
                                                    <div className="fw-bold text-primary">{group.category}</div>
                                                </td>
                                                <td className="py-3 align-middle">
                                                    <ul className="m-0 p-0" style={{ listStyle: 'none' }}>
                                                        {group.details && group.details.map((detail, i) => (
                                                            <li key={i} className="small mb-1 text-muted">
                                                                <i className="bi bi-check2-circle text-success me-2"></i>{detail}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td className="py-3 px-4 text-end align-middle">
                                                    <span className="badge bg-success rounded-pill">Active</span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="3" className="text-center py-4 text-muted">No features found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-auto pt-4"><Footer theme={theme} /></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Content;