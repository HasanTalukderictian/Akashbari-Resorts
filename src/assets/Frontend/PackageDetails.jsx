import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Footer from './Common/Footer';
import Header from './Common/Header';
import Terms from '../../Backend/Terms';

const PackageDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const pkg = location.state?.packageData;
    
    // লোকাল স্টোরেজ থেকে ডাটা নেওয়ার জন্য স্টেট
    const [packageData, setPackageData] = useState(null);
    const [benefitsData, setBenefitsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    // প্যাকেজ ডাটা লোড করা (URL থেকে আইডি ব্যবহার করে)
    useEffect(() => {
        const loadPackageData = async () => {
            // প্রথমে location state থেকে চেক করা
            if (pkg && pkg.id == id) {
                setPackageData(pkg);
                setLoading(false);
                return;
            }
            
            // লোকাল স্টোরেজ থেকে চেক করা
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
            
            // API থেকে ডাটা ফেচ করা
            try {
                const response = await fetch(`${BASE_URL}/get-investment`);
                const result = await response.json();
                if (result.status && result.data) {
                    // ডাটা লোকাল স্টোরেজে সেভ করা
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

    // Manual navigation functions
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

    // লোডিং স্টেট
    if (loading) {
        return (
            <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                <Header />
                <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-muted">Loading package details...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // প্যাকেজ না পাওয়া গেলে
    if (!packageData) {
        return (
            <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                <Header />
                <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                    <div className="text-center">
                        <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: '4rem' }}></i>
                        <h3 className="mt-3">Package not found!</h3>
                        <p className="text-muted">The investment package you're looking for doesn't exist.</p>
                        <a href="/investment" className="btn btn-primary mt-3">
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

            {/* Image Slider Section with Centered Title - NO MARGIN */}
            <div className="position-relative" style={{ height: '60vh', overflow: 'hidden', marginTop: '0', paddingTop: '0' }}>
                {/* Slider Images */}
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
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />
                    )}
                    
                    {/* Dark Overlay for better text visibility */}
                    <div className="position-absolute w-100 h-100" style={{
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
                        zIndex: 2
                    }} />
                    
                    {/* Centered Package Name */}
                    <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 3 }}>
                        <div className="text-center text-white px-4">
                            <h6 className="text-uppercase mb-3" style={{ letterSpacing: '3px', fontWeight: '300', marginTop: '0' }}>
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
                                <span className="badge bg-warning text-dark px-3 py-2 rounded-pill shadow-sm">
                                    <i className="bi bi-shield-check me-1"></i>Verified Asset
                                </span>
                                {packageData.is_popular == 1 && (
                                    <span className="badge bg-danger px-3 py-2 rounded-pill shadow-sm">
                                        <i className="bi bi-fire me-1"></i>Popular
                                    </span>
                                )}
                                {packageData.is_sold_out == 1 && (
                                    <span className="badge bg-secondary px-3 py-2 rounded-pill shadow-sm">
                                        <i className="bi bi-lock me-1"></i>Limited
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Navigation Arrows - মোবাইলের জন্য অ্যাডজাস্টেড */}
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
                    
                    {/* Dots Indicator */}
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
                                        backgroundColor: currentImageIndex === index ? '#fff' : 'rgba(255,255,255,0.5)',
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
                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <h6 className="text-uppercase opacity-75 mb-2 mb-md-3" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>Investment Value</h6>
                            <h1 className="fw-bold mb-3 mb-md-4" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>Investment Package</h1>
                            <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3 mb-3">
                                <div>
                                    <small className="text-white-50 d-block">Original Price</small>
                                    <h3 className="text-white mb-0" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)' }}>৳ {parseInt(packageData.price).toLocaleString()}</h3>
                                </div>
                                {packageData.discount > 0 && (
                                    <div>
                                        <small className="text-white-50 d-block">Discount</small>
                                        <h3 className="text-warning mb-0" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)' }}>- ৳ {parseInt(packageData.discount).toLocaleString()}</h3>
                                    </div>
                                )}
                            </div>
                            {packageData.discount > 0 && (
                                <div className="mt-2">
                                    <small className="text-white-50 d-block">Final Price</small>
                                    <h2 className="text-warning fw-bold" style={{ fontSize: 'clamp(1.3rem, 5vw, 2rem)' }}>৳ {(parseInt(packageData.price) - parseInt(packageData.discount)).toLocaleString()}</h2>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        <div className="card border-0 shadow-sm p-3 p-md-4 h-100 rounded-4">
                            <h2 className="fw-bold mb-3 mb-md-4 border-bottom pb-2" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>
                                <i className="bi bi-info-circle-fill text-primary me-2"></i>
                                Package Summary
                            </h2>
                            <div className="row g-2 g-md-3 mb-3 mb-md-4">
                                <div className="col-6">
                                    <small className="text-muted d-block mb-1">
                                        <i className="bi bi-currency-dollar me-1"></i>Investment Value
                                    </small>
                                    <h4 className="text-success fw-bold" style={{ fontSize: 'clamp(1rem, 3.5vw, 1.2rem)' }}>৳ {parseInt(packageData.price).toLocaleString()}</h4>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block mb-1">
                                        <i className="bi bi-tag me-1"></i>Discount Amount
                                    </small>
                                    <h4 className="text-primary fw-bold" style={{ fontSize: 'clamp(1rem, 3.5vw, 1.2rem)' }}>৳ {parseInt(packageData.discount).toLocaleString()}</h4>
                                </div>
                            </div>

                            <div className="bg-light p-3 p-md-4 rounded-4 mb-3 mb-md-4">
                                <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                    <span className="text-secondary" style={{ fontSize: 'clamp(0.8rem, 3vw, 0.9rem)' }}>
                                        <i className="bi bi-geo-fill me-2"></i>Land Area
                                    </span>
                                    <span className="fw-bold" style={{ fontSize: 'clamp(0.8rem, 3vw, 0.9rem)' }}>{packageData.land}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                    <span className="text-secondary" style={{ fontSize: 'clamp(0.8rem, 3vw, 0.9rem)' }}>
                                        <i className="bi bi-building me-2"></i>Building Size
                                    </span>
                                    <span className="fw-bold" style={{ fontSize: 'clamp(0.8rem, 3vw, 0.9rem)' }}>{packageData.building}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-secondary" style={{ fontSize: 'clamp(0.8rem, 3vw, 0.9rem)' }}>
                                        <i className="bi bi-aspect-ratio me-2"></i>Total Space
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
                            
                            <a
                                href="tel:01768712230"
                                className="btn btn-dark w-100 py-2 py-md-3 rounded-pill fw-bold shadow d-flex align-items-center justify-content-center gap-2"
                                style={{ textDecoration: 'none', transition: 'all 0.3s ease', fontSize: 'clamp(0.9rem, 3.5vw, 1rem)' }}
                            >
                                <i className="bi bi-telephone-fill"></i>
                                CALL NOW: 01768712230
                            </a>
                        </div>
                    </div>
                </div>

                {/* Benefits Section - Dynamic from API */}
                {!loading && benefitsData && benefitsData.benefits && benefitsData.benefits.length > 0 && (
                    <div className="mt-4 mt-md-5 pt-3 pt-md-5">
                        <div className="text-center mb-4 mb-md-5">
                            <span className="badge bg-primary px-3 py-2 mb-2 text-uppercase" style={{ fontSize: '0.7rem' }}>
                                <i className="bi bi-gift me-1"></i>Exclusive Rewards
                            </span>
                            <h2 className="fw-bold" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>{benefitsData.title}</h2>
                            <p className="text-muted mx-auto px-3" style={{ maxWidth: '700px', fontSize: 'clamp(0.8rem, 3vw, 1rem)' }}>{benefitsData.subtitle}</p>
                        </div>

                        <div className="row g-2 g-md-3">
                            {benefitsData.benefits.map((benefit, index) => (
                                <div className={index === benefitsData.benefits.length - 1 ? "col-12" : "col-12 col-md-6"} key={index}>
                                    <div className="p-3 p-md-4 bg-white rounded-4 border shadow-sm h-100 d-flex gap-2 gap-md-3 hover-shadow transition-all">
                                        <div className="flex-shrink-0">
                                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                                style={{ width: '35px', height: '35px', fontWeight: 'bold', fontSize: '0.9rem' }}>
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

            <Terms/>
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
                
                body {
                    margin: 0;
                    padding: 0;
                }
                
                /* মোবাইলের জন্য টাচ অপটিমাইজেশন */
                @media (max-width: 768px) {
                    button {
                        cursor: pointer !important;
                        -webkit-tap-highlight-color: transparent;
                    }
                    
                    .btn, button {
                        touch-action: manipulation;
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