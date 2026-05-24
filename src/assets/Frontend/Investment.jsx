import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Investment.css';

const Investment = () => {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [benefitsData, setBenefitsData] = useState(null);
    const [loading, setLoading] = useState(true);

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const API_URL = `${BASE_URL}/get-investment`;
    const BENEFITS_API_URL = `${BASE_URL}/get-investment-benefits`;

    const fetchData = async () => {
        try {
            setLoading(true);
            const [packageRes, benefitsRes] = await Promise.all([
                fetch(API_URL),
                fetch(BENEFITS_API_URL)
            ]);
            const packageResult = await packageRes.json();
            const benefitsResult = await benefitsRes.json();
            if (packageResult.status) {
                setPackages(packageResult.data);
            }
            if (benefitsResult.status) {
                setBenefitsData(benefitsResult.data.data[0]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCardClick = (pkg) => {
        if (pkg.is_sold_out != 1) {
            navigate(`/package-details/${pkg.id}`, { state: { packageData: pkg } });
        }
    };

    if (loading) {
        return <div className="text-center py-5">Loading Investment Packages...</div>;
    }

    return (
        <section className="investment-section py-5">
            <div className="container text-center">
                <div className="badge-opportunity mb-3">INVESTMENT OPPORTUNITIES</div>
                <h1 className="main-title mb-2">RESORT INVESTMENT PACKAGES</h1>
                <div className="yellow-divider mx-auto mb-4"></div>
                <p className="sub-text mb-5">Become a partner in Bangladesh's premier luxury resort destination</p>

                <div className="row g-4 justify-content-center">
                    {packages.map((pkg) => (
                        <div className="col-lg-3 col-md-6" key={pkg.id}>
                            <div 
                                className={`investment-card ${pkg.is_popular == 1 ? 'popular-border' : ''} ${pkg.is_sold_out == 1 ? 'sold-out-card' : 'clickable-card'}`}
                                onClick={() => handleCardClick(pkg)}
                                style={{ cursor: pkg.is_sold_out == 1 ? 'default' : 'pointer' }}
                            >
                                {pkg.is_popular == 1 && (
                                    <div className="popular-badge-centered">
                                        POPULAR
                                    </div>
                                )}

                                <div className="card-content d-flex flex-column h-100 p-3">
                                    <h3 className="pkg-title mt-3">{pkg.title}</h3>

                                    {pkg.is_sold_out == 1 ? (
                                        <div className="sold-out-container my-auto">
                                            <div className="sold-out-btn">SOLD OUT</div>
                                        </div>
                                    ) : (
                                        <>
                                            <h2 className="pkg-price mb-0">৳BDT {parseInt(pkg.price).toLocaleString()}</h2>
                                            {/* CashBack line removed */}
                                            <ul className="pkg-features text-start ps-3 mt-2 mb-2">
                                                <li><strong>Land:</strong> {pkg.land || 'N/A'}</li>
                                                <li><strong>Building:</strong> {pkg.building || 'N/A'}</li>
                                                <li><strong>Total Room Size:</strong> {pkg.total_size || 'N/A'} sqft</li>
                                                <li><strong>+ Amenities</strong></li>
                                            </ul>
                                            <p className="pkg-desc px-2 mt-2 mb-2">
                                                {pkg.description && pkg.description.length > 80 
                                                    ? `${pkg.description.substring(0, 80)}...` 
                                                    : pkg.description}
                                            </p>
                                        </>
                                    )}

                                    <button className={`inquire-btn mt-2 ${pkg.is_popular == 1 ? 'popular-btn' : pkg.is_sold_out == 1 ? 'sold-out-footer' : ''}`}>
                                        {pkg.is_sold_out == 1 ? "NOT AVAILABLE" : "INQUIRE NOW"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {benefitsData && (
                <div className="benefits-container container mt-5 p-5 bg-white">
                    <div className="row g-3">
                        {benefitsData.benefits && benefitsData.benefits.map((benefit, index) => (
                            <div className={index === benefitsData.benefits.length - 1 ? "col-12" : "col-md-6"} key={index}>
                                <div className={`benefit-item d-flex ${index === benefitsData.benefits.length - 1 ? "align-items-start" : "align-items-center"}`}>
                                    <span className="benefit-number">{String(index + 1).padStart(2, '0')}</span>
                                    <span className="benefit-text">{benefit}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="footer-promo text-center mt-5">
                        <h4 className="promo-question">Ready to Secure Your Future?</h4>
                        <p className="promo-text">Join hundreds of successful investors who have already secured their financial future with Akashbari Hotels & Resorts.</p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Investment;