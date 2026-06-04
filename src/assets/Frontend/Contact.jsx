import React, { useState } from 'react'
import Header from './Common/Header'
import Footer from './Common/Footer'
import '../css/blog.css';
import '../css/Contact.css'
import 'bootstrap-icons/font/bootstrap-icons.css';

import contactImg from '../image/section/Blog/Hotel6.png'
// CEO Image

import axios from 'axios';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const API_BASE_URL = import.meta.env.VITE_BASE_URL;

    // পেজ লোড হলে টপে স্ক্রল করার জন্য
    React.useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    }, []);

    const contactInfo = [
        {
            id: 1,
            title: "Call Us",
            detail: "+880 1701 294455",
            icon: "bi bi-telephone",
            action: "tel:+8801701294455"
        },
        {
            id: 2,
            title: "Mail Us",
            detail: "info@akashbari.com",
            icon: "bi bi-envelope",
            action: "mailto:info@akashbari.com"
        },
        {
            id: 3,
            title: "Location",
            detail: "Akashbari Hotel & Resort",
            detail2: "Sreepur, Gazipur, Bangladesh",
            icon: "bi bi-geo-alt",
            action: "https://www.google.com/maps/place/24%C2%B007'12.2%22N+90%C2%B030'27.8%22E/@24.1200554,90.5051585,17z"
        }
    ];

    // Coordinates for Gazipur location
    const latitude = 24.1200554;
    const longitude = 90.5077334;
    const googleMapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.5!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDA3JzEyLjIiTiA5MMKwMzAnMjcuOCJF!5e0!3m2!1sen!2sbd!4v1234567890!5m2!1sen!2sbd`;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error message when user starts typing
        if (errorMessage) setErrorMessage('');
    };

    // Validation function
    const validateForm = () => {
        if (!formData.name.trim()) {
            setErrorMessage('Name is required');
            return false;
        }
        if (!formData.email.trim()) {
            setErrorMessage('Email is required');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setErrorMessage('Please enter a valid email address');
            return false;
        }
        if (!formData.phone.trim()) {
            setErrorMessage('Phone number is required');
            return false;
        }
        if (formData.phone.length < 10) {
            setErrorMessage('Phone number must be at least 10 digits');
            return false;
        }
        if (!formData.message.trim()) {
            setErrorMessage('Message is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);
        setErrorMessage('');

        try {
            const response = await axios.post(`${API_BASE_URL}/addqueries`, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                message: formData.message
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            console.log('Response:', response.data);

            if (response.data.status === true || response.data.status === 'success') {
                setSubmitStatus('success');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    message: ''
                });

                setTimeout(() => {
                    setSubmitStatus(null);
                }, 5000);
            } else {
                setSubmitStatus('error');
                setErrorMessage(response.data.message || 'Failed to submit. Please try again.');
                setTimeout(() => {
                    setSubmitStatus(null);
                }, 5000);
            }

        } catch (error) {
            console.error('Error details:', error);
            
            let errorMsg = 'Something went wrong. Please try again.';
            
            if (error.response) {
                // Server responded with error status
                console.log('Error response:', error.response.data);
                if (error.response.data.message) {
                    errorMsg = error.response.data.message;
                } else if (error.response.data.errors) {
                    const errors = error.response.data.errors;
                    const firstError = Object.values(errors)[0];
                    errorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
                } else if (error.response.status === 422) {
                    errorMsg = 'Validation failed. Please check your inputs.';
                } else if (error.response.status === 500) {
                    errorMsg = 'Server error. Please try again later.';
                }
            } else if (error.request) {
                // Request made but no response
                errorMsg = 'Network error. Please check your connection.';
            }
            
            setSubmitStatus('error');
            setErrorMessage(errorMsg);
            
            setTimeout(() => {
                setSubmitStatus(null);
            }, 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header />

            <section className="blog-banner text-center d-flex flex-column justify-content-center">
                <div className="container">
                    <h1 className="blog-title serif mb-2 text-white">Contact</h1>
                    <h1 className="blog-title serif mb-2 text-white">Akashbari Resort</h1>
                </div>
            </section>

            {/* 2nd Section: Send an Enquiry */}
            <section className="enquiry-section py-5">
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-6">
                            <div className="contact-image-wrapper h-100">
                                <img
                                    src={contactImg}
                                    alt="Staff Member"
                                    className="img-fluid rounded-4 shadow-sm custom-enquiry-img"
                                />
                            </div>
                        </div>

                        <div className="col-lg-6 text-start">
                            <div className="form-content">
                                <span className="text-gold text-uppercase ls-2 small fw-bold d-block mb-2">
                                    <span className="dot-icon">●</span> Quick Enquiry
                                </span>
                                <h2 className="serif display-6 mb-3 text-start">
                                    Send an <span className="text-italic">Enquiry</span>
                                </h2>
                                <p className="text-muted mb-4 text-start">
                                    Have a question or special request? Leave us a message and we'll
                                    follow up soon with the details you need.
                                </p>

                                <form className="enquiry-form text-start" onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small d-block text-start">Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="form-control custom-input"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small d-block text-start">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="form-control custom-input"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small d-block text-start">Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="form-control custom-input"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold small d-block text-start">Message *</label>
                                        <textarea
                                            className="form-control custom-input"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows="4"
                                            required
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn-submit-query"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending...' : 'Submit Query'}
                                    </button>
                                    
                                    {errorMessage && (
                                        <div className="alert alert-danger mt-3">
                                            {errorMessage}
                                        </div>
                                    )}
                                    
                                    {submitStatus === 'success' && (
                                        <div className="alert alert-success mt-3">
                                            Your enquiry has been submitted successfully. We'll contact you soon.
                                        </div>
                                    )}

                                    {submitStatus === 'error' && !errorMessage && (
                                        <div className="alert alert-danger mt-3">
                                            Something went wrong. Please try again.
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

           

            {/* 3rd Section: Get in Touch */}
            <section className="contact-info-section py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <span className="text-gold text-uppercase ls-2 small fw-bold d-block mb-2">
                            <span className="dot-icon">●</span> Contact Us
                        </span>
                        <h2 className="serif display-6">
                            Get in <span className="text-italic">Touch</span>
                        </h2>
                        <p className="text-muted mt-3">
                            Prefer a quick call or a message? Use the option that suits you.
                        </p>
                    </div>

                    <div className="row g-4">
                        {contactInfo.map((item) => (
                            <div className="col-lg-4 col-md-6" key={item.id}>
                                <a
                                    href={item.action}
                                    target={item.id === 3 ? "_blank" : "_self"}
                                    rel={item.id === 3 ? "noopener noreferrer" : ""}
                                    className="text-decoration-none"
                                >
                                    <div className="contact-card text-center h-100">
                                        <div className="contact-icon-wrapper">
                                            <i className={`bi ${item.icon} text-gold`}></i>
                                        </div>
                                        <h4 className="serif">{item.title}</h4>
                                        <p className="text-muted mb-1">{item.detail}</p>
                                        {item.detail2 && <p className="text-muted">{item.detail2}</p>}
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4th Section: Google Map Location */}
            <section className="map-section py-5" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="container">
                    <div className="text-center mb-5">
                        <span className="text-gold text-uppercase ls-2 small fw-bold d-block mb-2">
                            <span className="dot-icon">●</span> Our Location
                        </span>
                        <h2 className="serif display-6">
                            Find Us on <span className="text-italic">Google Maps</span>
                        </h2>
                        <p className="text-muted mt-3">
                            Visit us at Akashbari Resort, Sreepur, Gazipur - where nature meets luxury
                        </p>
                    </div>

                    <div className="row g-4">
                        {/* Map Column */}
                        <div className="col-lg-8 d-flex">
                            <div className="map-wrapper rounded-4 overflow-hidden shadow-lg w-100">
                                <iframe
                                    src={googleMapEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, minHeight: '450px' }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Akashbari Resort Location"
                                ></iframe>
                            </div>
                        </div>

                        {/* Location Details Column */}
                        <div className="col-lg-4 d-flex">
                            <div className="location-details w-100 p-4 rounded-4 shadow-sm d-flex flex-column" style={{ backgroundColor: '#fff' }}>
                                <h4 className="serif mb-3 text-gold">📍 Address Details</h4>
                                <div className="location-info mb-4">
                                    <p className="mb-2">
                                        <strong>Resort Name:</strong><br />
                                        Akashbari Resort
                                    </p>
                                    <p className="mb-2">
                                        <strong>Exact Location:</strong><br />
                                        Joy Narayan Pur Dighir Par, Raja Bari,<br />
                                        Sreepur, Gazipur - 1740<br />
                                        Bangladesh
                                    </p>
                                    <p className="mb-2">
                                        <strong>Nearby Landmark:</strong><br />
                                        • 8 KM from Rajendrapur Cantonment<br />
                                        • 15 minutes journey to Rajendrapur Cantonment
                                    </p>

                                    <p className="mb-2">
                                        <strong>Getting There:</strong><br />
                                        • 1 hour from Dhaka City<br />
                                        • 30 minutes from Gazipur City<br />
                                        • 15 minutes from Rajendrapur Cantonment
                                    </p>
                                </div>

                                <div className="direction-buttons mt-auto">
                                    <a
                                        href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline-primary w-100"
                                        style={{ color: '#639c4e', borderColor: '#639c4e' }}
                                    >
                                        <i className="bi bi-navigation me-2"></i>
                                        Open in Google Maps App
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Info Cards */}
                    <div className="row g-4 mt-4">
                        <div className="col-md-3 col-6">
                            <div className="info-mini-card text-center p-3 rounded-3" style={{ backgroundColor: '#fff', transition: 'transform 0.3s' }}>
                                <i className="bi bi-clock-history fs-1 text-gold"></i>
                                <h6 className="mt-2 mb-0">Check-in</h6>
                                <small className="text-muted">2:00 PM</small>
                            </div>
                        </div>
                        <div className="col-md-3 col-6">
                            <div className="info-mini-card text-center p-3 rounded-3" style={{ backgroundColor: '#fff', transition: 'transform 0.3s' }}>
                                <i className="bi bi-clock fs-1 text-gold"></i>
                                <h6 className="mt-2 mb-0">Check-out</h6>
                                <small className="text-muted">12:00 PM</small>
                            </div>
                        </div>
                        <div className="col-md-3 col-6">
                            <div className="info-mini-card text-center p-3 rounded-3" style={{ backgroundColor: '#fff', transition: 'transform 0.3s' }}>
                                <i className="bi bi-car-front fs-1 text-gold"></i>
                                <h6 className="mt-2 mb-0">Parking</h6>
                                <small className="text-muted">Free Parking</small>
                            </div>
                        </div>
                        <div className="col-md-3 col-6">
                            <div className="info-mini-card text-center p-3 rounded-3" style={{ backgroundColor: '#fff', transition: 'transform 0.3s' }}>
                                <i className="bi bi-wifi fs-1 text-gold"></i>
                                <h6 className="mt-2 mb-0">Wi-Fi</h6>
                                <small className="text-muted">Free High-Speed</small>
                            </div>
                        </div>
                    </div>

                    {/* Nearby Attractions */}
                    <div className="nearby-attractions-wrapper mt-5 pt-4">
                        <div className="text-center mb-4">
                            <h3 className="serif display-6 fs-2">
                                <span className="text-italic">Nearby Attractions</span>
                            </h3>
                            <p className="text-muted">Explore the beauty around Akashbari Resort</p>
                        </div>
                        <div className="row g-4">
                            <div className="col-md-3 col-sm-6">
                                <div className="attraction-card text-center p-4 rounded-4 h-100 shadow-sm" style={{ backgroundColor: '#fff', transition: 'all 0.3s ease', cursor: 'pointer' }}>
                                    <div className="attraction-icon mb-3">
                                        <i className="bi bi-tree-fill fs-1 text-gold"></i>
                                    </div>
                                    <h5 className="serif mb-2">Bhawal National Park</h5>
                                    <p className="text-muted small mb-0">Lush green forest, rich biodiversity & peaceful trails</p>
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <div className="attraction-card text-center p-4 rounded-4 h-100 shadow-sm" style={{ backgroundColor: '#fff', transition: 'all 0.3s ease', cursor: 'pointer' }}>
                                    <div className="attraction-icon mb-3">
                                        <i className="bi bi-building fs-1 text-gold"></i>
                                    </div>
                                    <h5 className="serif mb-2">Rajendrapur Cantonment</h5>
                                    <p className="text-muted small mb-0">Historical military area with scenic surroundings</p>
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <div className="attraction-card text-center p-4 rounded-4 h-100 shadow-sm" style={{ backgroundColor: '#fff', transition: 'all 0.3s ease', cursor: 'pointer' }}>
                                    <div className="attraction-icon mb-3">
                                        <i className="bi bi-water fs-1 text-gold"></i>
                                    </div>
                                    <h5 className="serif mb-2">Bangabandhu Safari Park</h5>
                                    <p className="text-muted small mb-0">Exciting wildlife safari, exotic animals & family fun</p>
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <div className="attraction-card text-center p-4 rounded-4 h-100 shadow-sm" style={{ backgroundColor: '#fff', transition: 'all 0.3s ease', cursor: 'pointer' }}>
                                    <div className="attraction-icon mb-3">
                                        <i className="bi bi-flower1 fs-1 text-gold"></i>
                                    </div>
                                    <h5 className="serif mb-2">Nuhash Polli</h5>
                                    <p className="text-muted small mb-0">Artistic village with sculptures & cultural vibes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .map-wrapper iframe {
                    transition: all 0.3s ease;
                }
                .map-wrapper:hover iframe {
                    transform: scale(1.01);
                }
                .location-details {
                    transition: all 0.3s ease;
                }
                .location-details:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                }
                .info-mini-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }
                .contact-card {
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                .contact-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                }
                .attraction-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 30px rgba(0,0,0,0.15) !important;
                }
                .ceo-section {
                    animation: fadeIn 0.8s ease-out;
                }
                .vm-card {
                    transition: all 0.3s ease;
                }
                .core-value-badge {
                    transition: all 0.3s ease;
                }
                .core-value-badge:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 2px 8px rgba(154, 85, 255, 0.2);
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @media (max-width: 768px) {
                    .map-wrapper iframe {
                        min-height: 350px;
                    }
                }
            `}</style>

            <Footer />
        </>
    )
}

export default Contact;