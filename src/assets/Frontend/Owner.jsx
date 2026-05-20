import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Owner = () => {
    const [property, setProperty] = useState(null);
    const [benefits, setBenefits] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Use environment variables for API URLs with fallbacks
    const API_BASE_URL = import.meta.env.VITE_BASE_URL;
    const STORAGE_URL = import.meta.env.VITE_API_URL || import.meta.env.API_URL || 'https://backend.akashbariresort.com';

    // Helper function to get image URL - FIXED for both local and production
    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/800x600?text=No+Image';
        
        // If already a full URL, return as is
        if (imagePath.startsWith('http')) return imagePath;
        
        // Handle different path formats
        let cleanPath = imagePath;
        
        // Remove any storage prefix if present
        if (cleanPath.startsWith('/storage/')) {
            cleanPath = cleanPath.replace('/storage/', '');
        } else if (cleanPath.startsWith('storage/')) {
            cleanPath = cleanPath.replace('storage/', '');
        }
        
        // Remove leading slashes
        cleanPath = cleanPath.replace(/^\/+/, '');
        
        // Ensure the base URL doesn't have trailing slash
        const baseUrl = STORAGE_URL.replace(/\/$/, '');
        
        // Construct the full URL
        return `${baseUrl}/storage/${cleanPath}`;
    };

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await axios.get(`${API_BASE_URL}/gets-property-offers`);

                if (response.data.status) {
                    const data = response.data.data;

                    if (data.offers && data.offers.data && data.offers.data.length > 0) {
                        const propertyData = data.offers.data[0];
                        // Process slider images to ensure they have correct URLs
                        if (propertyData.slider_images && propertyData.slider_images.length > 0) {
                            propertyData.slider_images = propertyData.slider_images.map(img => getImageUrl(img));
                        }
                        setProperty(propertyData);
                    }

                    if (data.benefits && data.benefits.length > 0) {
                        setBenefits(data.benefits);
                    }
                } else {
                    setError('Failed to load content');
                }
            } catch (error) {
                console.error("Content loading failed:", error);
                setError(error.response?.data?.message || 'Failed to load content. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    // Slider auto-play
    useEffect(() => {
        if (property?.slider_images && property.slider_images.length > 1) {
            const interval = setInterval(() => {
                setActiveIndex((prev) =>
                    prev === property.slider_images.length - 1 ? 0 : prev + 1
                );
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [property]);

    // WhatsApp handler
    const handleWhatsAppClick = () => {
        if (property?.whatsapp_number) {
            const cleanNumber = property.whatsapp_number.replace(/\D/g, '');
            window.open(`https://wa.me/${cleanNumber}`, '_blank');
        }
    };

    // Call handler
    const handleCallClick = () => {
        if (property?.whatsapp_number) {
            window.location.href = `tel:${property.whatsapp_number}`;
        }
    };

    // Styles
    const styles = {
        container: {
            background: '#f8f9fc',
            minHeight: '100vh',
            fontFamily: "'Poppins', sans-serif"
        },
        mainCard: {
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease'
        },
        sliderContainer: {
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#1a1a2e',
            minHeight: '350px'
        },
        slideImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
        },
        dot: {
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        brandText: {
            color: '#d4af37',
            fontSize: '1.8rem',
            fontWeight: 'bold'
        },
        featureItem: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '8px',
            padding: '6px',
            borderRadius: '10px',
            transition: 'all 0.3s ease'
        },
        actionBtn: {
            borderRadius: '50px',
            border: 'none',
            transition: 'all 0.3s ease',
            padding: '10px 20px',
            width: 'auto',
            minWidth: '220px',
            color: 'white',
            fontWeight: 'bold',
            display: 'inline-flex'
        },
        whatsappBtn: {
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
        },
        callBtn: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
        },
        benefitCard: {
            borderRadius: '20px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            border: 'none',
            boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
        },
        benefitIcon: {
            width: '60px',
            height: '60px',
            backgroundColor: '#f3e5f5',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
            transition: 'all 0.3s ease'
        }
    };

    if (loading) {
        return (
            <div style={styles.container} className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading amazing content...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container} className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <div className="text-center">
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚠️</div>
                    <h4 className="text-danger">Error Loading Content</h4>
                    <p className="text-muted">{error}</p>
                    <button 
                        className="btn btn-primary mt-3"
                        onClick={() => window.location.reload()}
                        style={{ borderRadius: '50px', padding: '10px 30px' }}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div style={styles.container} className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <div className="text-center">
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏢</div>
                    <h4>No Property Data Found</h4>
                    <p className="text-muted">Please check back later for investment opportunities.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <div className="container py-3 py-md-4">
                <div className="row g-0 shadow-lg d-lg-flex align-items-lg-stretch" style={styles.mainCard}>
                    
                    {/* Left Side - Image Slider */}
                    <div className="col-lg-6 d-flex flex-column" style={styles.sliderContainer}>
                        <div className="w-100 flex-grow-1 position-relative" style={{ minHeight: '400px' }}>
                            {property.slider_images && property.slider_images.map((img, index) => (
                                <div
                                    key={index}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        opacity: activeIndex === index ? 1 : 0,
                                        transition: 'opacity 0.8s ease-in-out',
                                        zIndex: activeIndex === index ? 1 : 0
                                    }}
                                >
                                    <img
                                        src={img}
                                        className="w-100 h-100"
                                        alt={`Property view ${index + 1}`}
                                        style={{
                                            objectFit: 'cover',
                                            objectPosition: 'center'
                                        }}
                                        onError={(e) => {
                                            console.error('Image failed to load:', img);
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/800x600?text=Property+Image';
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                        
                        {/* Slider Dots */}
                        {property.slider_images && property.slider_images.length > 1 && (
                            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-2" style={{ zIndex: 2 }}>
                                {property.slider_images.map((_, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setActiveIndex(index)}
                                        style={{
                                            ...styles.dot,
                                            width: activeIndex === index ? '30px' : '10px',
                                            backgroundColor: activeIndex === index ? '#d4af37' : 'rgba(255,255,255,0.7)'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Side - Content */}
                    <div className="col-lg-6 d-flex flex-column justify-content-center" style={{ backgroundColor: '#ffffff' }}>
                        <div className="p-3 p-md-4">
                            <div className="mb-2">
                                <span className="badge bg-warning text-dark px-3 py-2 rounded-pill" style={{ fontSize: '12px' }}>
                                    🏆 Premium Investment
                                </span>
                            </div>
                            
                            <h2 className="display-6 fw-bold mb-2" style={{ color: '#2c3e50', fontSize: '2rem' }}>
                                {property.title}
                            </h2>
                            
                            <h3 style={styles.brandText} className="mb-3">
                                {property.brand_name}
                            </h3>
                            
                            <p className="text-muted mb-3" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                                {property.description}
                            </p>

                            {/* Features */}
                            <div className="mb-3">
                                <h6 className="fw-bold mb-2" style={{ color: '#2c3e50', fontSize: '0.9rem' }}>
                                    ✨ Key Features
                                </h6>
                                {property.features && property.features.map((text, i) => (
                                    <div
                                        key={i}
                                        style={styles.featureItem}
                                        className="hover-feature"
                                    >
                                        <i className="bi bi-check-circle-fill me-2" style={{ color: '#10b981', fontSize: '14px' }}></i>
                                        <span style={{ color: '#4a5568', fontSize: '0.9rem' }}>{text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Both Buttons with Same Width */}
                            <div className="d-flex flex-column align-items-center gap-3">
                                {/* WhatsApp Button */}
                                <button
                                    onClick={handleWhatsAppClick}
                                    className="btn text-white py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                                    style={{
                                        ...styles.actionBtn,
                                        ...styles.whatsappBtn
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.3)';
                                    }}
                                >
                                    <i className="bi bi-whatsapp fs-5"></i>
                                    <span>Chat on WhatsApp</span>
                                </button>

                                {/* Call Button */}
                                <button
                                    onClick={handleCallClick}
                                    className="btn text-white py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                                    style={{
                                        ...styles.actionBtn,
                                        ...styles.callBtn
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                                    }}
                                >
                                    <i className="bi bi-telephone-fill fs-5"></i>
                                    <span>Call Now: {property.whatsapp_number || 'Number Not Available'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            {benefits.length > 0 && (
                <div className="container py-3 py-md-4">
                    <div className="text-center mb-4">
                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-pill mb-2" style={{ fontSize: '11px' }}>
                            Why Choose Us
                        </span>
                        <h2 className="fw-bold mb-2" style={{ color: '#2c3e50', fontSize: '1.8rem' }}>
                            Why Invest with Us?
                        </h2>
                        <div className="mx-auto" style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, #667eea, #764ba2)', borderRadius: '2px' }}></div>
                        <p className="text-muted mt-2" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.9rem' }}>
                            Discover the advantages of choosing us for your investment journey
                        </p>
                    </div>

                    <div className="row g-3">
                        {benefits.map((item, index) => (
                            <div className="col-md-6 col-lg-4" key={index}>
                                <div
                                    className="card h-100 p-3 text-center"
                                    style={styles.benefitCard}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-10px)';
                                        e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
                                    }}
                                >
                                    <div style={styles.benefitIcon}>
                                        <i className="bi bi-gem" style={{ fontSize: '1.8rem', color: '#b66dff' }}></i>
                                    </div>
                                    <h4 className="fw-bold mb-2" style={{ color: '#2c3e50', fontSize: '1.2rem' }}>
                                        {item.title}
                                    </h4>
                                    <p className="text-muted mb-0" style={{ lineHeight: '1.5', fontSize: '0.85rem' }}>
                                        {item.desc || item.description || 'Premium investment opportunity with guaranteed returns'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Call to Action Section */}
            <div className="container py-3 py-md-4">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="text-center p-4 rounded-4" style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '30px'
                        }}>
                            <h3 className="text-white fw-bold mb-2" style={{ fontSize: '1.5rem' }}>Ready to Invest?</h3>
                            <p className="text-white opacity-75 mb-3" style={{ fontSize: '0.9rem' }}>
                                Take the first step towards a profitable investment opportunity
                            </p>
                            <button
                                onClick={handleWhatsAppClick}
                                className="btn btn-light px-4 py-2 fw-bold"
                                style={{ borderRadius: '50px', color: '#667eea', fontSize: '0.9rem' }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <i className="bi bi-whatsapp me-2"></i>
                                Contact Us Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Responsive Global CSS */}
            <style>
                {`
                    .hover-feature:hover {
                        background: #f8f9fa;
                        transform: translateX(5px);
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .card {
                        animation: fadeIn 0.5s ease-out;
                    }
                    @media (max-width: 768px) {
                        .display-6 {
                            font-size: 1.5rem !important;
                        }
                        .brandText {
                            font-size: 1.2rem !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Owner;