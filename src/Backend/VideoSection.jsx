import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const VideoSection = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeView, setActiveView] = useState('video');

    const [banners, setBanners] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        videoUrl: '',
        description: ''
    });

    const theme = {
        isDarkMode,
        bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2',
    };

    // ✅ Fetch Videos
    const fetchVideos = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/get-videos');
            // Backend res.data.success অথবা সরাসরি ডাটা চেক করা
            if (res.data) {
                setBanners(Array.isArray(res.data) ? res.data : res.data.data || []);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Add Video
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/add-videos', {
                title: formData.title,
                description: formData.description,
                video_url: formData.videoUrl 
            });

            if (res.data) {
                setShowModal(false);
                setFormData({ title: '', videoUrl: '', description: '' });
                fetchVideos(); 
            }
        } catch (err) {
            console.error("Submit error:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Something went wrong!");
        }
    };

    // ✅ Delete Video
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this video?")) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/del-videos/${id}`);
            setBanners(banners.filter(x => x.id !== id));
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete video.");
        }
    };

    return (
        <div style={{ backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s' }}>
            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
                
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView={activeView} />

                <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                    
                    <Header 
                        theme={theme}
                        isDarkMode={isDarkMode}
                        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
                    />

                    {/* Content Area */}
                    <div className="p-4 flex-grow-1" style={{ overflowY: 'auto' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold" style={{ color: theme.text }}>Video Management</h4>
                            <button 
                                className="btn text-white" 
                                style={{ background: '#9a55ff', borderRadius: '8px' }}
                                onClick={() => setShowModal(true)}
                            >
                                <i className="bi bi-plus-lg me-1"></i> Add Video
                            </button>
                        </div>

                        <div className="card shadow-sm border-0 p-3" style={{ backgroundColor: theme.card, borderRadius: '15px' }}>
                            <div className="table-responsive">
                                <table className="table table-hover" style={{ color: theme.text }}>
                                    <thead>
                                        <tr style={{ color: theme.text }}>
                                            <th style={{ backgroundColor: 'transparent', color: theme.text }}>Title</th>
                                            <th style={{ backgroundColor: 'transparent', color: theme.text }}>Description</th>
                                            <th style={{ backgroundColor: 'transparent', color: theme.text }}>Video URL</th>
                                            <th className="text-center" style={{ backgroundColor: 'transparent', color: theme.text }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {banners.length > 0 ? (
                                            banners.map(b => (
                                                <tr key={b.id} style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>
                                                    <td className="py-3" style={{ backgroundColor: 'transparent', color: theme.text }}>{b.title}</td>
                                                    <td className="py-3" style={{ backgroundColor: 'transparent', color: theme.text }}>{b.description}</td>
                                                    <td className="py-3" style={{ backgroundColor: 'transparent' }}>
                                                        <a href={b.video_url} target="_blank" rel="noreferrer" style={{ color: '#9a55ff', textDecoration: 'none' }}>
                                                            {b.video_url}
                                                        </a>
                                                    </td>
                                                    <td className="text-center py-3" style={{ backgroundColor: 'transparent' }}>
                                                        <button 
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => handleDelete(b.id)}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 text-muted">No videos found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Footer Fixed at Bottom */}
                    <div style={{ flexShrink: 0 }}>
                        <Footer theme={theme} />
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{
                    background: "rgba(0,0,0,0.7)",
                    position: "fixed",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1050
                }}>
                    <div className="animate__animated animate__fadeInDown" style={{
                        background: theme.card,
                        color: theme.text,
                        padding: '30px',
                        width: '100%',
                        maxWidth: '450px',
                        borderRadius: '15px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }}>
                        <h4 className="mb-4 fw-bold">Add New Video</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="form-control"
                                    style={{ backgroundColor: isDarkMode ? '#1a1a2e' : '#fff', color: theme.text, borderColor: theme.border }}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="form-control"
                                    rows="3"
                                    style={{ backgroundColor: isDarkMode ? '#1a1a2e' : '#fff', color: theme.text, borderColor: theme.border }}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold">Video URL</label>
                                <input
                                    type="url"
                                    name="videoUrl"
                                    value={formData.videoUrl}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="https://example.com/video"
                                    style={{ backgroundColor: isDarkMode ? '#1a1a2e' : '#fff', color: theme.text, borderColor: theme.border }}
                                    required
                                />
                            </div>

                            <div className="d-flex gap-2">
                                <button type="submit" className="btn text-white w-100" style={{ background: '#9a55ff' }}>
                                    Save Video
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-light w-100" 
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoSection;