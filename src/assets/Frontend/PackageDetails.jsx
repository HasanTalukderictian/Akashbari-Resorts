import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Footer from './Common/Footer';
import Header from './Common/Header';

const PackageDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const pkg = location.state?.packageData;

    const [benefitsData, setBenefitsData] = useState(null);
    const [loading, setLoading] = useState(true);

    // API থেকে বেনিফিট ডাটা ফেচ করা
    useEffect(() => {
        const fetchBenefits = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/get-investment-benefits');
                const result = await response.json();
                if (result.status) {
                    // API থেকে প্রথম অবজেক্টটি নেওয়া হচ্ছে
                    setBenefitsData(result.data.data[0]);
                }
            } catch (error) {
                console.error("Error fetching benefits:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBenefits();
    }, []);

    if (!pkg) {
        return (
            <div className="text-center py-5">
                <h3 className="mt-5">Package details not found!</h3>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#f8f9fa' }}>
            <Header />

            {/* Main Package Section */}
            <div className="container py-5 mt-5">
                <div className="row g-4 align-items-stretch">
                    <div className="col-lg-6">
                        <div className="h-100 p-5 text-white rounded-4 shadow-lg d-flex flex-column justify-content-center"
                            style={{ background: 'linear-gradient(45deg, #1a2a6c, #9c3a3a, #f5c662)' }}>
                            <h6 className="text-uppercase tracking-widest opacity-75 mb-3">Investment Tier</h6>
                            <h1 className="display-3 fw-bold mb-4">{pkg.title}</h1>
                            <div className="d-flex align-items-center gap-3">

                                <span className="badge bg-warning text-dark px-3 py-2 rounded-pill shadow-sm">Verified Asset</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="card border-0 shadow-sm p-4 h-100 rounded-4">
                            <h2 className="fw-bold mb-4 border-bottom pb-2">Package Summary</h2>
                            <div className="row g-3 mb-4">
                                <div className="col-6">
                                    <small className="text-muted d-block">Investment Value</small>
                                    <h4 className="text-success fw-bold">৳ {pkg.price}</h4>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">Expected Discount</small>
                                    <h4 className="text-primary fw-bold">৳ {pkg.discount}</h4>
                                </div>
                            </div>

                            <div className="bg-light p-4 rounded-4 mb-4">
                                <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                    <span className="text-secondary"><i className="bi bi-geo-fill me-2"></i>Land Area</span>
                                    <span className="fw-bold">{pkg.land}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                    <span className="text-secondary"><i className="bi bi-building me-2"></i>Building Size</span>
                                    <span className="fw-bold">{pkg.building}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-secondary"><i className="bi bi-aspect-ratio me-2"></i>Total Space</span>
                                    <span className="fw-bold">{pkg.totalSize}</span>
                                </div>
                            </div>

                            <p className="text-muted mb-4" style={{ textAlign: 'justify' }}>{pkg.description}</p>
                            <a
                                href="tel:01768712230"
                                className="btn btn-dark w-100 py-3 rounded-pill fw-bold shadow d-flex align-items-center justify-content-center gap-2"
                                style={{ textDecoration: 'none' }}
                            >
                                <i className="bi bi-telephone-fill"></i>
                                CALL NOW: 01768712230
                            </a>
                        </div>
                    </div>
                </div>

                {/* Benefits Section - Dynamic from API */}
                {!loading && benefitsData && (
                    <div className="mt-5 pt-5">
                        <div className="text-center mb-5">
                            <span className="badge bg-primary px-3 py-2 mb-2 text-uppercase">Exclusive Rewards</span>
                            <h2 className="display-5 fw-bold">{benefitsData.title}</h2>
                            <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>{benefitsData.subtitle}</p>
                        </div>

                        <div className="row g-3">
                            {benefitsData.benefits && benefitsData.benefits.map((benefit, index) => (
                                <div className={index === benefitsData.benefits.length - 1 ? "col-12" : "col-md-6"} key={index}>
                                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100 d-flex gap-3 hover-shadow transition-all">
                                        <div className="flex-shrink-0">
                                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                                style={{ width: '40px', height: '40px', fontWeight: 'bold' }}>
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-dark fw-medium">{benefit}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />

            <style>{`
                .hover-shadow:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
                }
                .transition-all {
                    transition: all 0.3s ease;
                }
            `}</style>
        </div>
    );
};

export default PackageDetails;