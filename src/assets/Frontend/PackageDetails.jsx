import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Footer from './Common/Footer';
import Header from './Common/Header';
import Terms from '../../Backend/Terms';
import Faqpage from './Faqpage';

const PackageDetails = () => {
    const brandColor = '#5e2e10';
    const { id } = useParams();
    const location = useLocation();
    const pkg = location.state?.packageData;

    const [packageData, setPackageData] = useState(null);
    const [benefitsData, setBenefitsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Modal এবং Toast এর জন্য State
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success'); // 'success' or 'error'
    
    // ফর্ম ডাটা
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });
    
    const [formErrors, setFormErrors] = useState({});

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    // Check if package is VILLA
    const isVilla = packageData?.title?.toUpperCase().trim() === 'VILLA';
    const isSoldOut = packageData?.is_sold_out == 1;

    // প্যাকেজ ডাটা লোড করা
    useEffect(() => {
        const loadPackageData = async () => {
            if (pkg && pkg.id == id) {
                setPackageData(pkg);
                setLoading(false);
                return;
            }

            const savedPackages = localStorage.getItem('investmentPackages');
            if (savedPackages) {
                const packages = JSON.parse(savedPackages);
                const foundPackage = packages.find(p => p.id == id);
                if (foundPackage) {
                    setPackageData(foundPackage);
                    setLoading(false);
                    return;
                }
            }

            try {
                const response = await fetch(`${BASE_URL}/get-investment`);
                const result = await response.json();
                if (result.status && result.data) {
                    localStorage.setItem('investmentPackages', JSON.stringify(result.data));
                    const foundPackage = result.data.find(p => p.id == id);
                    if (foundPackage) {
                        setPackageData(foundPackage);
                    } else {
                        setPackageData(null);
                    }
                }
            } catch (error) {
                console.error("Error fetching package:", error);
                setPackageData(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadPackageData();
        }
    }, [id, pkg]);

    // AUTO SCROLL TO TOP
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    }, [id]);

    // Auto-slide functionality
    useEffect(() => {
        if (packageData?.images && packageData.images.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) =>
                    prevIndex === packageData.images.length - 1 ? 0 : prevIndex + 1
                );
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [packageData?.images]);

    // API থেকে বেনিফিট ডাটা ফেচ করা
    useEffect(() => {
        const fetchBenefits = async () => {
            try {
                const response = await fetch(`${BASE_URL}/get-investment-benefits`);
                const result = await response.json();
                if (result.status && result.data && result.data.data) {
                    setBenefitsData(result.data.data[0]);
                }
            } catch (error) {
                console.error("Error fetching benefits:", error);
            }
        };
        fetchBenefits();
    }, []);

    const nextImage = () => {
        if (packageData?.images) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === packageData.images.length - 1 ? 0 : prevIndex + 1
            );
        }
    };

    const prevImage = () => {
        if (packageData?.images) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === 0 ? packageData.images.length - 1 : prevIndex - 1
            );
        }
    };

    // Modal খোলা/বন্ধ করা
    const openModal = () => {
        setShowModal(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setShowModal(false);
        document.body.style.overflow = 'auto';
        setFormData({
            name: '',
            phone: '',
            email: '',
            message: ''
        });
        setFormErrors({});
    };

    // ইনপুট পরিবর্তন হ্যান্ডেল
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Error清除
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // ফর্ম ভ্যালিডেশন
    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }
        if (!formData.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^[0-9+\-\s()]{10,15}$/.test(formData.phone.trim())) {
            errors.phone = 'Please enter a valid phone number';
        }
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            errors.email = 'Please enter a valid email address';
        }
        if (!formData.message.trim()) {
            errors.message = 'Message is required';
        }
        return errors;
    };

    // ফর্ম সাবমিট
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/package-queries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    package_name: packageData?.title || 'N/A',
                    ...formData
                }),
            });
            
            setToastType('success');
            setToastMessage('✅ Your query has been submitted successfully! We will contact you soon.');
            setShowToast(true);
            closeModal();
            
            setTimeout(() => {
                setShowToast(false);
            }, 5000);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            setToastType('error');
            setToastMessage('❌ Something went wrong. Please try again.');
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 5000);
        }
    };

    if (loading) {
        return (
            <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                <Header />
                <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                    <div className="text-center">
                        <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: brandColor }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-muted">Loading package details...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!packageData) {
        return (
            <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                <Header />
                <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                    <div className="text-center">
                        <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: '4rem' }}></i>
                        <h3 className="mt-3">Package not found!</h3>
                        <p className="text-muted">The investment package you're looking for doesn't exist.</p>
                        <a href="/investment" className="btn mt-3" style={{ backgroundColor: brandColor, color: 'white', border: 'none' }}>
                            <i className="bi bi-arrow-left me-2"></i>Back to Investments
                        </a>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#f8f9fa' }}>
            <Header />

            {/* Toast Message */}
            {showToast && (
                <div className="position-fixed top-0 start-50 translate-middle-x mt-4" style={{ zIndex: 9999, width: '90%', maxWidth: '500px' }}>
                    <div className={`alert shadow-lg border-0 d-flex align-items-center gap-3 animate__animated animate__fadeInDown`}
                        style={{
                            backgroundColor: toastType === 'success' ? '#d4edda' : '#f8d7da',
                            color: toastType === 'success' ? '#155724' : '#721c24',
                            borderLeft: `4px solid ${toastType === 'success' ? '#28a745' : '#dc3545'}`,
                            padding: '16px 20px',
                            borderRadius: '12px'
                        }}>
                        <div className="flex-shrink-0">
                            {toastType === 'success' ? (
                                <i className="bi bi-check-circle-fill" style={{ fontSize: '24px', color: '#28a745' }}></i>
                            ) : (
                                <i className="bi bi-exclamation-circle-fill" style={{ fontSize: '24px', color: '#dc3545' }}></i>
                            )}
                        </div>
                        <div className="flex-grow-1">
                            <p className="mb-0 fw-medium" style={{ fontSize: '0.95rem' }}>{toastMessage}</p>
                        </div>
                        <button
                            onClick={() => setShowToast(false)}
                            className="btn-close"
                            style={{ fontSize: '12px' }}
                        ></button>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h5 className="modal-title fw-bold" style={{ color: brandColor }}>
                                <i className="bi bi-question-circle-fill me-2" style={{ color: brandColor }}></i>
                                Query About Package
                            </h5>
                            <button type="button" className="btn-close" onClick={closeModal}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <div className="bg-light p-2 rounded-3">
                                    <small className="text-muted">Package</small>
                                    <p className="fw-bold mb-0" style={{ color: brandColor }}>{packageData.title}</p>
                                </div>
                            </div>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-medium" style={{ fontSize: '0.9rem' }}>
                                        <i className="bi bi-person me-1"></i>Your Name <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                                        name="name"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        style={{ borderRadius: '8px', padding: '10px 14px' }}
                                    />
                                    {formErrors.name && (
                                        <div className="invalid-feedback">{formErrors.name}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-medium" style={{ fontSize: '0.9rem' }}>
                                        <i className="bi bi-phone me-1"></i>Your Phone <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                                        name="phone"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        style={{ borderRadius: '8px', padding: '10px 14px' }}
                                    />
                                    {formErrors.phone && (
                                        <div className="invalid-feedback">{formErrors.phone}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-medium" style={{ fontSize: '0.9rem' }}>
                                        <i className="bi bi-envelope me-1"></i>Email Address <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                                        name="email"
                                        placeholder="Enter your email address"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        style={{ borderRadius: '8px', padding: '10px 14px' }}
                                    />
                                    {formErrors.email && (
                                        <div className="invalid-feedback">{formErrors.email}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-medium" style={{ fontSize: '0.9rem' }}>
                                        <i className="bi bi-chat-dots me-1"></i>Message <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        className={`form-control ${formErrors.message ? 'is-invalid' : ''}`}
                                        name="message"
                                        rows="3"
                                        placeholder="Write your message or query..."
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        style={{ borderRadius: '8px', padding: '10px 14px', resize: 'vertical' }}
                                    />
                                    {formErrors.message && (
                                        <div className="invalid-feedback">{formErrors.message}</div>
                                    )}
                                </div>

                                <div className="d-flex gap-2 mt-4">
                                    <button
                                        type="button"
                                        className="btn w-50"
                                        onClick={closeModal}
                                        style={{
                                            backgroundColor: '#e9ecef',
                                            color: '#333',
                                            borderRadius: '8px',
                                            padding: '10px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn w-50 text-white"
                                        style={{
                                            backgroundColor: brandColor,
                                            borderRadius: '8px',
                                            padding: '10px',
                                            fontWeight: '500',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#3d1f0a'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = brandColor}
                                    >
                                        <i className="bi bi-send me-2"></i>Submit Query
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Slider Section */}
            <div className="position-relative" style={{ height: '60vh', overflow: 'hidden', marginTop: '0', paddingTop: '0' }}>
                <div className="position-relative h-100 w-100">
                    {packageData.images && packageData.images.length > 0 ? (
                        packageData.images.map((image, index) => (
                            <div
                                key={index}
                                className="position-absolute w-100 h-100 transition-fade"
                                style={{
                                    backgroundImage: `url(${image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    opacity: currentImageIndex === index ? 1 : 0,
                                    transition: 'opacity 0.8s ease-in-out',
                                    zIndex: currentImageIndex === index ? 1 : 0
                                }}
                            />
                        ))
                    ) : (
                        <div
                            className="position-absolute w-100 h-100"
                            style={{
                                background: `linear-gradient(135deg, ${brandColor} 0%, #3d1f0a 100%)`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />
                    )}

                    <div className="position-absolute w-100 h-100" style={{
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
                        zIndex: 2
                    }} />

                    <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 3 }}>
                        <div className="text-center text-white px-4">
                            <h6 className="text-uppercase mb-3" style={{ letterSpacing: '3px', fontWeight: '300', marginTop: '0', color: brandColor }}>
                                Investment Tier
                            </h6>
                            <h1 className="fw-bold mb-4 animate-title" style={{
                                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                fontSize: 'clamp(2rem, 8vw, 4rem)',
                                marginTop: '0'
                            }}>
                                {packageData.title}
                            </h1>
                            <div className="d-flex gap-2 justify-content-center flex-wrap">
                                <span className="badge px-3 py-2 rounded-pill shadow-sm" style={{ backgroundColor: brandColor, color: 'white' }}>
                                    <i className="bi bi-shield-check me-1"></i>Verified Asset
                                </span>
                                {packageData.is_popular == 1 && (
                                    <span className="badge bg-danger px-3 py-2 rounded-pill shadow-sm">
                                        <i className="bi bi-fire me-1"></i>Popular
                                    </span>
                                )}
                                {isSoldOut && (
                                    <span className="badge bg-secondary px-3 py-2 rounded-pill shadow-sm">
                                        <i className="bi bi-lock me-1"></i>Sold Out
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {packageData.images && packageData.images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="position-absolute top-50 start-0 translate-middle-y btn btn-light rounded-circle shadow-lg"
                                style={{
                                    zIndex: 4,
                                    width: '40px',
                                    height: '40px',
                                    marginLeft: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease',
                                    backgroundColor: 'rgba(255,255,255,0.9)'
                                }}
                            >
                                <i className="bi bi-chevron-left fs-5"></i>
                            </button>
                            <button
                                onClick={nextImage}
                                className="position-absolute top-50 end-0 translate-middle-y btn btn-light rounded-circle shadow-lg"
                                style={{
                                    zIndex: 4,
                                    width: '40px',
                                    height: '40px',
                                    marginRight: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease',
                                    backgroundColor: 'rgba(255,255,255,0.9)'
                                }}
                            >
                                <i className="bi bi-chevron-right fs-5"></i>
                            </button>
                        </>
                    )}

                    {packageData.images && packageData.images.length > 1 && (
                        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 d-flex gap-2" style={{ zIndex: 4 }}>
                            {packageData.images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className="rounded-circle border-0 p-0"
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        backgroundColor: currentImageIndex === index ? brandColor : 'rgba(255,255,255,0.5)',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Package Section */}
            <div className="container py-4 py-md-5">
                <div className="row g-3 g-md-4 align-items-stretch">
                    <div className="col-12 col-lg-6">
                        <div className="h-100 p-4 p-md-5 text-white rounded-4 shadow-lg d-flex flex-column justify-content-center"
                            style={{ background: `linear-gradient(135deg, ${brandColor} 0%, #3d1f0a 100%)` }}>
                                
                                 {isVilla && isSoldOut && (
                                <div className="mt-3 mb-5">
                                    <span className="badge bg-danger px-4 py-2 rounded-pill " style={{ fontSize: '1rem' }}>
                                       SOLD OUT
                                    </span>
                                </div>
                            )}
                            <h6 className="text-uppercase opacity-75 mb-2 mb-md-3" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>Investment Oppurnity</h6>
                            <h1 className="fw-bold mb-3 mb-md-4" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>Investment Package</h1>
                            
                            {/* Share Price - Always Show */}
                            <div className="mb-3">
                                <small className="text-white-50 d-block">Share Price</small>
                                <h3 className="text-white mb-0" style={{ 
                                    fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
                                    textDecoration: 'line-through',
                                    opacity: '0.7'
                                }}>
                                    ৳ {parseInt(packageData.share_price || 0).toLocaleString()}
                                </h3>
                            </div>
                            
                            {/* For VILLA - Hide Discount Price, Show only Full Payment */}
                            {isVilla ? (
                                <div className="mb-3">
                                    <small className="text-white-50 d-block">Full Payment Price</small>
                                    <h3 className="text-warning mb-0" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)' }}>
                                        ৳ {parseInt(packageData.discount || 0).toLocaleString()}
                                    </h3>
                                </div>
                            ) : (
                                <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3 mb-3">
                                    <div>
                                        <small className="text-white-50 d-block">Discount Price</small>
                                        <h3 className="text-white mb-0" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)' }}>৳ {parseInt(packageData.price).toLocaleString()}</h3>
                                    </div>
                                    {packageData.discount > 0 && (
                                        <div>
                                            <small className="text-white-50 d-block">Full Payment Price</small>
                                            <h3 className="text-warning mb-0" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)' }}>- ৳ {parseInt(packageData.discount).toLocaleString()}</h3>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* Sold Out Badge for VILLA */}
                           
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        <div className="card border-0 shadow-sm p-3 p-md-4 h-100 rounded-4">
                            <h2 className="fw-bold mb-3 mb-md-4 border-bottom pb-2" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', color: brandColor }}>
                                <i className="bi bi-info-circle-fill me-2" style={{ color: brandColor }}></i>
                                Package Summary
                            </h2>
                            <div className="row g-2 g-md-3 mb-3 mb-md-4">
                                {/* Share Price - Always Show */}
                                <div className="col-6">
                                    <small className="text-muted d-block mb-1">
                                        ৳ Share Price
                                    </small>
                                    <h4 className="fw-bold" style={{ 
                                        fontSize: 'clamp(1rem, 3.5vw, 1.2rem)', 
                                        color: brandColor,
                                        textDecoration: 'line-through',
                                        opacity: '0.6'
                                    }}>
                                        ৳ {parseInt(packageData.share_price || 0).toLocaleString()}
                                    </h4>
                                </div>
                                
                                {/* For VILLA - Show only Full Payment */}
                                {isVilla ? (
                                    <div className="col-6">
                                        <small className="text-muted d-block mb-1">
                                            <i className="bi bi-tag me-1"></i>Full Payment Price
                                        </small>
                                        <h4 className="fw-bold" style={{ fontSize: 'clamp(1rem, 3.5vw, 1.2rem)', color: brandColor }}>
                                            ৳ {parseInt(packageData.discount || 0).toLocaleString()}
                                        </h4>
                                    </div>
                                ) : (
                                    <>
                                        <div className="col-6">
                                            <small className="text-muted d-block mb-1">
                                                ৳ Discount Price
                                            </small>
                                            <h4 className="fw-bold" style={{ fontSize: 'clamp(1rem, 3.5vw, 1.2rem)', color: brandColor }}>৳ {parseInt(packageData.price).toLocaleString()}</h4>
                                        </div>
                                        <div className="col-6">
                                            <small className="text-muted d-block mb-1">
                                                <i className="bi bi-tag me-1"></i>Full Payment Price
                                            </small>
                                            <h4 className="fw-bold" style={{ fontSize: 'clamp(1rem, 3.5vw, 1.2rem)', color: brandColor }}>৳ {parseInt(packageData.discount || 0).toLocaleString()}</h4>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="bg-light p-3 p-md-4 rounded-4 mb-3 mb-md-4">
                                <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                    <span className="text-secondary" style={{ fontSize: 'clamp(0.8rem, 3vw, 0.9rem)' }}>
                                        <i className="bi bi-geo-fill me-2"></i>Land Ownership (Your proportinate share of the resort)
                                    </span>
                                    <span className="fw-bold" style={{ fontSize: 'clamp(0.8rem, 3vw, 0.9rem)' }}>{packageData.land}</span>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <span className="text-secondary" style={{ fontSize: 'clamp(0.8rem, 3vw, 0.9rem)' }}>
                                        <i className="bi bi-aspect-ratio me-2"></i>Room Size (built up accommadation area)
                                    </span>
                                    <span className="fw-bold" style={{ fontSize: 'clamp(0.8rem, 3vw, 0.9rem)' }}>{packageData.total_size}</span>
                                </div>
                            </div>

                            {packageData.description && (
                                <p className="text-muted mb-3 mb-md-4" style={{ textAlign: 'justify', fontSize: 'clamp(0.8rem, 3vw, 0.9rem)' }}>
                                    <i className="bi bi-chat-quote me-2"></i>
                                    {packageData.description}
                                </p>
                            )}

                            {/* বাটন দুটো পাশাপাশি - প্রতিটি ৫০% প্রস্থ */}
                            <div className="d-flex gap-2">
                                <a
                                    href="tel:01768712230"
                                    className="btn text-white w-50 py-2 py-md-3 rounded-pill fw-bold shadow d-flex align-items-center justify-content-center gap-2"
                                    style={{ 
                                        textDecoration: 'none', 
                                        transition: 'all 0.3s ease', 
                                        fontSize: 'clamp(0.8rem, 3vw, 0.95rem)',
                                        backgroundColor: brandColor,
                                        border: 'none'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#3d1f0a'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = brandColor}
                                >
                                    <i className="bi bi-telephone-fill"></i>
                                    CALL NOW
                                </a>
                                
                                <button
                                    onClick={openModal}
                                    className="btn text-white w-50 py-2 py-md-3 rounded-pill fw-bold shadow d-flex align-items-center justify-content-center gap-2"
                                    style={{ 
                                        textDecoration: 'none', 
                                        transition: 'all 0.3s ease', 
                                        fontSize: 'clamp(0.8rem, 3vw, 0.95rem)',
                                        backgroundColor: brandColor,
                                        border: 'none'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#3d1f0a'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = brandColor}
                                >
                                    <i className="bi bi-question-circle-fill"></i>
                                    QUERY
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                {!loading && benefitsData && benefitsData.benefits && benefitsData.benefits.length > 0 && (
                    <div className="mt-4 mt-md-5 pt-3 pt-md-5">
                        <div className="text-center mb-4 mb-md-5">
                            <span
                                className="badge px-3 py-2 mb-2 text-uppercase"
                                style={{
                                    fontSize: '0.7rem',
                                    background: `linear-gradient(135deg, ${brandColor} 0%, #3d1f0a 100%)`,
                                    color: 'white'
                                }}
                            >
                                <i className="bi bi-gift me-1"></i>Exclusive Rewards
                            </span>
                            <h2 className="fw-bold" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', color: brandColor }}>{benefitsData.title}</h2>
                            <p className="text-muted mx-auto px-3" style={{ maxWidth: '700px', fontSize: 'clamp(0.8rem, 3vw, 1rem)' }}>{benefitsData.subtitle}</p>
                        </div>

                        <div className="row g-2 g-md-3">
                            {benefitsData.benefits.map((benefit, index) => (
                                <div className={index === benefitsData.benefits.length - 1 ? "col-12" : "col-12 col-md-6"} key={index}>
                                    <div className="p-3 p-md-4 bg-white rounded-4 border shadow-sm h-100 d-flex gap-2 gap-md-3 hover-shadow transition-all" style={{ borderColor: `${brandColor}30 !important` }}>
                                        <div className="flex-shrink-0">
                                            <div className="text-white rounded-circle d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: '35px',
                                                    height: '35px',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.9rem',
                                                    background: `linear-gradient(135deg, ${brandColor} 0%, #3d1f0a 100%)`
                                                }}>
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-dark fw-medium" style={{ fontSize: 'clamp(0.8rem, 3.5vw, 0.95rem)' }}>{benefit}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Faqpage/>

            <Terms />


            <Footer />

            <style>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                .transition-fade {
                    transition: opacity 0.8s ease-in-out;
                }
                
                .hover-shadow:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
                }
                
                .transition-all {
                    transition: all 0.3s ease;
                }
                
                .animate-title {
                    animation: fadeInUp 1s ease-out;
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9998;
                    animation: fadeIn 0.3s ease;
                    padding: 20px;
                }
                
                .modal-container {
                    background: white;
                    border-radius: 16px;
                    max-width: 600px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: slideUp 0.3s ease;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                }
                
                .modal-header {
                    padding: 20px 24px 16px;
                    border-bottom: 1px solid #e9ecef;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: sticky;
                    top: 0;
                    background: white;
                    border-radius: 16px 16px 0 0;
                    z-index: 1;
                }
                
                .modal-title {
                    font-size: 1.1rem;
                    margin: 0;
                }
                
                .modal-body {
                    padding: 20px 24px 24px;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                /* Toast Animation */
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate__fadeInDown {
                    animation: fadeInDown 0.5s ease;
                }
                
                body {
                    margin: 0;
                    padding: 0;
                }
                
                @media (max-width: 768px) {
                    button {
                        cursor: pointer !important;
                        -webkit-tap-highlight-color: transparent;
                    }
                    
                    .btn, button {
                        touch-action: manipulation;
                    }
                    
                    .modal-container {
                        margin: 10px;
                        border-radius: 12px;
                    }
                    
                    .modal-header {
                        padding: 16px 18px 12px;
                    }
                    
                    .modal-body {
                        padding: 16px 18px 20px;
                    }
                }
                
                ::-webkit-scrollbar {
                    width: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            `}</style>
        </div>
    );
};

export default PackageDetails;