import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Testominal = () => {

    // UI States
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeView, setActiveView] = useState('video');
    const [showModal, setShowModal] = useState(false);

    // Data States
    const [testimonials, setTestimonials] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        image: null,
        source: '',
        stars: 5,
        text: ''
    });

    const theme = {
        isDarkMode,
        bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2',
    };

    // Fetch Testimonials
    const fetchTestimonials = async () => {

        try {

            const res = await axios.get('http://127.0.0.1:8000/api/get-testimonials');

            setTestimonials(res.data.data || []);

        } catch (err) {

            console.error("Fetch Error:", err);

            setTestimonials([]);
        }
    };

    useEffect(() => {

        fetchTestimonials();

    }, []);

    // Handle Input Change
    const handleChange = (e) => {

        const { name, value, files } = e.target;

        if (name === 'image' && files && files[0]) {

            const file = files[0];

            setFormData((prev) => ({
                ...prev,
                image: file
            }));

            setImagePreview(URL.createObjectURL(file));

        } else {

            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Submit Form
    const handleSubmit = async (e) => {

        e.preventDefault();

        const data = new FormData();

        data.append('name', formData.name);

        if (formData.image) {
            data.append('image', formData.image);
        }

        data.append('source', formData.source);
        data.append('stars', formData.stars);
        data.append('text', formData.text);

        try {

            const res = await axios.post(
                'http://127.0.0.1:8000/api/add-testimonial',
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (res.status === 201) {

                setShowModal(false);

                setFormData({
                    name: '',
                    image: null,
                    source: '',
                    stars: 5,
                    text: ''
                });

                setImagePreview(null);

                fetchTestimonials();
            }

        } catch (err) {

            console.error("Submit Error:", err.response?.data || err);

            alert("Failed to save testimonial");
        }
    };

    // Delete Testimonial
    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure you want to delete this?")) {
            return;
        }

        try {

            await axios.delete(`http://127.0.0.1:8000/api/del-testimonial/${id}`);

            fetchTestimonials();

        } catch (err) {

            console.error("Delete Error:", err);
        }
    };

    return (

        <div
            style={{
                backgroundColor: theme.bg,
                minHeight: '100vh',
                transition: 'all 0.3s'
            }}
        >

            <div
                className="d-flex"
                style={{
                    height: '100vh',
                    overflow: 'hidden'
                }}
            >

                <Sidebar
                    theme={theme}
                    isCollapsed={isCollapsed}
                    activeView={activeView}
                />

                <div
                    className="flex-grow-1 d-flex flex-column"
                    style={{ minWidth: 0 }}
                >

                    <Header
                        theme={theme}
                        isDarkMode={isDarkMode}
                        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
                    />

                    <div
                        className="p-4 flex-grow-1"
                        style={{ overflowY: 'auto' }}
                    >

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <h4
                                className="fw-bold"
                                style={{ color: theme.text }}
                            >
                                Testimonial Management
                            </h4>

                            <button
                                className="btn text-white"
                                style={{
                                    background: '#9a55ff',
                                    borderRadius: '8px'
                                }}
                                onClick={() => setShowModal(true)}
                            >
                                <i className="bi bi-plus-lg me-1"></i>
                                Add Testimonial
                            </button>

                        </div>

                        <div
                            className="card shadow-sm border-0 p-3"
                            style={{
                                backgroundColor: theme.card,
                                borderRadius: '15px'
                            }}
                        >

                            <div className="table-responsive">

                                <table
                                    className="table"
                                    style={{ color: theme.text }}
                                >

                                    <thead>

                                        <tr style={{ color: theme.text }}>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Source</th>
                                            <th>Stars</th>
                                            <th>Review</th>
                                            <th>Action</th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {Array.isArray(testimonials) && testimonials.length > 0 ? (

                                            testimonials.map((item) => (

                                                <tr
                                                    key={item.id}
                                                    style={{ verticalAlign: 'middle' }}
                                                >

                                                    <td>

                                                        <img
                                                            src={
                                                                item.image_url ||
                                                                'https://via.placeholder.com/40'
                                                            }
                                                            alt={item.name}
                                                            style={{
                                                                width: '40px',
                                                                height: '40px',
                                                                borderRadius: '50%',
                                                                objectFit: 'cover'
                                                            }}
                                                        />

                                                    </td>

                                                    <td>{item.name}</td>

                                                    <td>
                                                        <span className="badge bg-info">
                                                            {item.source || 'N/A'}
                                                        </span>
                                                    </td>

                                                    <td>{item.stars} ⭐</td>

                                                    <td
                                                        style={{
                                                            maxWidth: '200px',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {item.text}
                                                    </td>

                                                    <td>

                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="btn btn-sm btn-outline-danger"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>

                                                    </td>

                                                </tr>

                                            ))

                                        ) : (

                                            <tr>

                                                <td
                                                    colSpan="6"
                                                    className="text-center py-5"
                                                >
                                                    No testimonials found.
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

            {/* Modal */}
            {showModal && (

                <div
                    style={{
                        background: "rgba(0,0,0,0.7)",
                        position: "fixed",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1050
                    }}
                >

                    <div
                        style={{
                            background: theme.card,
                            color: theme.text,
                            padding: '30px',
                            width: '100%',
                            maxWidth: '500px',
                            borderRadius: '15px',
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }}
                    >

                        <h4 className="mb-4 fw-bold">
                            Add New Testimonial
                        </h4>

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">

                                <label className="form-label small fw-bold">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-control"
                                    style={{
                                        backgroundColor: isDarkMode ? '#1a1a2e' : '#fff',
                                        color: theme.text,
                                        borderColor: theme.border
                                    }}
                                    required
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label small fw-bold">
                                    Image
                                </label>

                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="form-control"
                                    style={{
                                        backgroundColor: isDarkMode ? '#1a1a2e' : '#fff',
                                        color: theme.text,
                                        borderColor: theme.border
                                    }}
                                />

                                {imagePreview && (

                                    <div className="mt-2">

                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                border: `2px solid #9a55ff`
                                            }}
                                        />

                                    </div>

                                )}

                            </div>

                            <div className="mb-3">

                                <label className="form-label small fw-bold">
                                    Source
                                </label>

                                <input
                                    type="text"
                                    name="source"
                                    value={formData.source}
                                    onChange={handleChange}
                                    placeholder="e.g. Google"
                                    className="form-control"
                                    style={{
                                        backgroundColor: isDarkMode ? '#1a1a2e' : '#fff',
                                        color: theme.text,
                                        borderColor: theme.border
                                    }}
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label small fw-bold">
                                    Stars (1-5)
                                </label>

                                <input
                                    type="number"
                                    name="stars"
                                    min="1"
                                    max="5"
                                    value={formData.stars}
                                    onChange={handleChange}
                                    className="form-control"
                                    style={{
                                        backgroundColor: isDarkMode ? '#1a1a2e' : '#fff',
                                        color: theme.text,
                                        borderColor: theme.border
                                    }}
                                />

                            </div>

                            <div className="mb-4">

                                <label className="form-label small fw-bold">
                                    Review Text
                                </label>

                                <textarea
                                    name="text"
                                    value={formData.text}
                                    onChange={handleChange}
                                    rows="4"
                                    className="form-control"
                                    style={{
                                        backgroundColor: isDarkMode ? '#1a1a2e' : '#fff',
                                        color: theme.text,
                                        borderColor: theme.border
                                    }}
                                    required
                                ></textarea>

                            </div>

                            <div className="d-flex gap-2">

                                <button
                                    type="submit"
                                    className="btn text-white w-100"
                                    style={{ background: '#9a55ff' }}
                                >
                                    Save Testimonial
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-light w-100"
                                    onClick={() => {
                                        setShowModal(false);
                                        setImagePreview(null);
                                    }}
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

export default Testominal;