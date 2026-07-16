import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Investment.css';
import axios from 'axios';

// CountUpItem কম্পোনেন্ট
const CountUpItem = ({ target, duration = 2000, suffix = "", prefix = "" }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentCount = Math.floor(progress * target);
            setCount(currentCount);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [target, duration]);

    return (
        <h2 className="fw-bold" style={{ color: '#5e2e10' }}>
            {prefix}{count.toLocaleString()}{suffix}
        </h2>
    );
};

const Investment = () => {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [benefits, setBenefits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [combinedData, setCombinedData] = useState({
        record_members: [],
        invest_records: []
    });
    const [error, setError] = useState(null);

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const API_URL = `${BASE_URL}/get-investment`;
    const BENEFITS_API_URL = `${BASE_URL}/get-investment-benefits`;

    // statsCardStyle
    const statsCardStyle = {
        backgroundColor: '#ffffff',
        borderRadius: '15px',
        padding: '40px 20px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
        marginTop: '0',
        position: 'relative',
        zIndex: '10',
        border: '1px solid #eef2f6'
    };

    // Fetch investment packages
    const fetchPackages = async () => {
        try {
            const response = await fetch(API_URL);
            const result = await response.json();
            
            if (result.status) {
                // Include VILLA and other packages
                let allPackages = result.data;

                const getOrderIndex = (title) => {
                    const upperTitle = title?.toUpperCase().trim();
                    if (upperTitle?.includes('PRESIDENTIAL')) return 0;
                    if (upperTitle?.includes('EARTH')) return 1;
                    if (upperTitle?.includes('EXECUTIVE')) return 2;
                    if (upperTitle?.includes('SUPERIOR')) return 3;
                    if (upperTitle?.includes('VILLA')) return 4;
                    return 999;
                };

                allPackages = allPackages.sort((a, b) => {
                    return getOrderIndex(a.title) - getOrderIndex(b.title);
                });

                setPackages(allPackages);
            }
        } catch (error) {
            console.error("Error fetching packages:", error);
            setError('Failed to load packages');
        }
    };

    // Fetch investment benefits
    const fetchBenefits = async () => {
        try {
            const response = await fetch(BENEFITS_API_URL);
            const result = await response.json();
            
            console.log('Benefits API Response:', result);
            
            if (result.status && result.data && result.data.data) {
                const benefitsData = result.data.data;
                
                if (benefitsData.length > 0 && benefitsData[0].benefits) {
                    console.log('Benefits found:', benefitsData[0].benefits);
                    setBenefits(benefitsData[0].benefits);
                } else {
                    console.log('No benefits found in response');
                    setBenefits([]);
                }
            } else {
                setBenefits([]);
            }
        } catch (error) {
            console.error("Error fetching benefits:", error);
            setBenefits([]);
        }
    };

    // Fetch combined data for stats
    const fetchCombinedData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/combined-records`, {
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (response.data.status === true && response.data.data) {
                setCombinedData({
                    record_members: response.data.data.record_members || [],
                    invest_records: response.data.data.invest_records || []
                });
                setError(null);
            } else {
                setCombinedData({
                    record_members: [],
                    invest_records: []
                });
            }
        } catch (error) {
            console.error('Error fetching combined data:', error);
            setError('Failed to load data. Please try again later.');
        }
    };

    // Fetch all data
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            await Promise.all([
                fetchPackages(),
                fetchBenefits(),
                fetchCombinedData()
            ]);
            setLoading(false);
        };
        
        fetchAllData();
    }, []);

    const handleCardClick = (pkg) => {
        if (pkg.is_sold_out != 1) {
            navigate(`/package-details/${pkg.id}`, { state: { packageData: pkg } });
        }
    };

    const getStatsData = () => {
        const member = combinedData.record_members[0] || {};
        return [
            { id: 1, target: parseInt(member.member) || 0, suffix: "+", prefix: "", label: "Happy Members" },
            { id: 2, target: parseInt(member.revenue) || 0, suffix: "%", prefix: "Up to ", label: "Yearly Revenue" },
            { id: 3, target: parseInt(member.amenities) || 0, suffix: "+", prefix: "", label: "Club Amenities" },
            { id: 4, target: parseInt(member.expericence) || 0, suffix: "+", prefix: "", label: "Years of Trust" }
        ];
    };

    const statsData = getStatsData();

    if (loading) {
        return <div className="text-center py-5">Loading Investment Packages...</div>;
    }

    if (error) {
        return <div className="text-center py-5 text-danger">{error}</div>;
    }

    return (
        <>
            <section className="investment-section py-5">
                <div className="container text-center">
                    <div className="badge-opportunity mb-3">INVESTMENT OPPORTUNITIES</div>
                    <h1 className="main-title mb-2">RESORT INVESTMENT PACKAGES</h1>
                    <div className="mx-auto"></div>
                    <p className="sub-text mb-5">Become a partner in Bangladesh's premier luxury resort destination</p>

                    {/* Investment Packages Grid */}
                    <div className="row g-4 justify-content-center">
                        {packages.map((pkg, index) => {
                            const isSoldOut = pkg.is_sold_out == 1;
                            const isPopular = pkg.title?.toUpperCase().includes('SUPERIOR');
                            const isVilla = pkg.title?.toUpperCase().trim() === 'VILLA';
                            
                            return (
                                <div className="col-lg-3 col-md-6" key={pkg.id || index}>
                                    <div 
                                        className={`investment-card ${isSoldOut ? 'sold-out-card' : 'clickable-card'}`}
                                        onClick={() => !isSoldOut && handleCardClick(pkg)}
                                        style={{ 
                                            cursor: isSoldOut ? 'default' : 'pointer',
                                            position: 'relative',
                                            overflow: 'visible'
                                        }}
                                    >
                                        {/* SUPERIOR DELUXE Badge - Right Corner */}
                                        {isPopular && !isSoldOut && (
                                            <div style={{
                                                position: 'absolute',
                                                right: '5px',
                                                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                                color: '#5e2e10',
                                                padding: '6px 16px',
                                                borderRadius: '30px',
                                                fontSize: '10px',
                                                fontWeight: '700',
                                                zIndex: 20,
                                                boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
                                                border: '2px solid #fff',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px',
                                                animation: 'slideInTop 0.5s ease-out'
                                            }}>
                                                ⭐ Popular
                                            </div>
                                        )}

                                        {/* For Villa - Show SOLD OUT overlay in center with title visible */}
                                        {isVilla && isSoldOut ? (
                                            <div style={{
                                                position: 'relative',
                                                height: '100%',
                                                minHeight: '400px',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                                {/* Title - Always visible with same color as other packages */}
                                                <div className="card-content d-flex flex-column h-100 p-4" style={{ position: 'relative', zIndex: 2 }}>
                                                    <h3 className="pkg-title mb-2" style={{ color: '#333' }}>{pkg.title}</h3>
                                                </div>
                                                
                                                {/* SOLD OUT Overlay */}
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    background: '#fff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    zIndex: 1,
                                                    borderRadius: '8px'
                                                }}>
                                                    <div style={{
                                                        background: '#dc3545',
                                                        color: 'white',
                                                        padding: '15px 35px',
                                                        borderRadius: '8px',
                                                        fontWeight: '800',
                                                        fontSize: '24px',
                                                        letterSpacing: '2px',
                                                        textTransform: 'uppercase',
                                                        boxShadow: '0 4px 20px rgba(220, 53, 69, 0.5)',
                                                        border: '2px solid white'
                                                    }}>
                                                        SOLD OUT
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Regular content for non-sold out or non-villa */}
                                                <div className="card-content d-flex flex-column h-100 p-4">
                                                    {/* Title - Same color for all packages */}
                                                    <h3 className="pkg-title mb-2" style={{ color: '#333' }}>{pkg.title}</h3>
                                                    
                                                    {/* Price - Show for non-sold out items */}
                                                    {!isSoldOut ? (
                                                        <>
                                                            <h2 className="pkg-price mb-1">
                                                                ৳ {parseInt(pkg.price || 0).toLocaleString()}
                                                            </h2>
                                                            {/* Cashback */}
                                                            {parseInt(pkg.discount || 0) > 0 && (
                                                                <p className="pkg-cashback mb-2" style={{ color: '#198754', fontWeight: '600' }}>
                                                                    Cashback: ৳ {parseInt(pkg.discount || 0).toLocaleString()}
                                                                </p>
                                                            )}
                                                        </>
                                                    ) : (
                                                        // For other sold out packages (not villa)
                                                        <div style={{
                                                            background: '#dc3545',
                                                            color: 'white',
                                                            padding: '8px 15px',
                                                            borderRadius: '8px',
                                                            display: 'inline-block',
                                                            fontWeight: '700',
                                                            fontSize: '16px',
                                                            marginBottom: '10px'
                                                        }}>
                                                            🎯 SOLD OUT
                                                        </div>
                                                    )}
                                                    
                                                    {/* Land & Building */}
                                                    <p className="pkg-detail mb-1" style={{ fontSize: '14px', color: '#555' }}>
                                                        <strong>Land & building —</strong> {pkg.land || 'N/A'}
                                                    </p>
                                                    
                                                    {/* Room Size */}
                                                    <p className="pkg-detail mb-3" style={{ fontSize: '14px', color: '#555' }}>
                                                        <strong>Room size —</strong> {pkg.total_size || 'N/A'} sft
                                                    </p>
                                                    
                                                    {/* Description */}
                                                    {pkg.description && (
                                                        <p className="pkg-desc mb-3" style={{ fontSize: '13px', color: '#666' }}>
                                                            {pkg.description.length > 80 
                                                                ? `${pkg.description.substring(0, 80)}...` 
                                                                : pkg.description}
                                                        </p>
                                                    )}
                                                    
                                                    {/* Button */}
                                                    {isSoldOut ? (
                                                        <button className="inquire-btn sold-out-footer" disabled style={{
                                                            background: '#94a3b8',
                                                            cursor: 'not-allowed',
                                                            opacity: '0.7'
                                                        }}>
                                                            SOLD OUT
                                                        </button>
                                                    ) : (
                                                        <button className="inquire-btn popular-btn">
                                                            INQUIRE NOW
                                                        </button>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* STATS SECTION */}
                <div className="container my-5" style={{ marginTop: '0', paddingTop: '20px' }}>
                    <div className="row justify-content-center">
                        <div className="col-lg-11">
                            <div style={statsCardStyle} className="text-center">
                                <div className="row g-4">
                                    {statsData.map((stat, index) => (
                                        <div key={stat.id} className={`col-md-3 ${index !== statsData.length - 1 ? 'border-end' : ''}`} style={{ borderColor: '#e2e8f0' }}>
                                            {stat.target > 0 ? (
                                                <CountUpItem
                                                    target={stat.target}
                                                    suffix={stat.suffix}
                                                    prefix={stat.prefix}
                                                />
                                            ) : (
                                                <h2 className="fw-bold" style={{ color: '#5e2e10' }}>
                                                    {stat.prefix}0{stat.suffix}
                                                </h2>
                                            )}
                                            <p className="fw-bold mb-0" style={{ color: '#718096' }}>{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BENEFITS SECTION */}
                {benefits.length > 0 && (
                    <div className="benefits-container container mt-5 p-5 bg-white">
                        <h2 className='display-4 fw-normal text-uppercase mb-2 text-center'>Investment Benefits</h2>
                        <div className="yellow-divider mx-auto mb-4"></div>
                        <div className="row g-3">
                            {benefits.map((benefit, index) => (
                                <div className="col-12 col-md-6" key={index}>
                                    <div className="benefit-item d-flex align-items-center">
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
        </>
    );
};

export default Investment;