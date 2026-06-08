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
        <h2 className="fw-bold" style={{ color: '#5DB8C1' }}>
            {prefix}{count.toLocaleString()}{suffix}
        </h2>
    );
};

const Investment = () => {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [benefitsData, setBenefitsData] = useState(null);
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

    // Fixed Investment Benefits Data (12 items)
    const fixedBenefitsList = [
        "Saaf-Qabla Registration",
        "Return annual profit by utilizing our whole resort",
        "Yearly increase in asset worth",
        "Passive income",
        "Money-Back Guarantee",
        "Free stay facilities per share yearly: 02 nights 03 days on accommodation",
        "Discount on accommodation all over the year: 40%",
        "Discount all over the year on membership card facilities in Akashbari Hotel & Resorts and Akashbari Holidays",
        "No Down Payment",
        "Get 36-month, interest-free EMI option",
        "Based on construction progress, the share price will be increased every six months in phases, according to demand and supply. By the handover stage, the price of the lowest category of shares may reach up to 990,000 taka",
        "EMI Facilitist"
    ];

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
                let filteredPackages = packageResult.data.filter(pkg =>
                    pkg.title?.toUpperCase().trim() !== 'VILLA'
                );

                const getOrderIndex = (title) => {
                    const upperTitle = title?.toUpperCase().trim();
                    if (upperTitle?.includes('PRESIDENTIAL')) return 0;
                    if (upperTitle?.includes('EARTH')) return 1;
                    if (upperTitle?.includes('EXECUTIVE')) return 2;
                    if (upperTitle?.includes('SUPERIOR')) return 3;
                    return 999;
                };

                filteredPackages = filteredPackages.sort((a, b) => {
                    return getOrderIndex(a.title) - getOrderIndex(b.title);
                });

                setPackages(filteredPackages);
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

    const fetchCombinedData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/combined-records`, {
                headers: {
                    'Accept': 'application/json',
                }
            });

            console.log('Combined data response:', response.data);

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
                setError('No data found');
            }
        } catch (error) {
            console.error('Error fetching combined data:', error);
            setError('Failed to load data. Please try again later.');
        }
    };

    useEffect(() => {
        fetchData();
        fetchCombinedData();
    }, []);

    const handleCardClick = (pkg) => {
        if (pkg.is_sold_out != 1) {
            navigate(`/package-details/${pkg.id}`, { state: { packageData: pkg } });
        }
    };

    const getMessage = (title) => {
        switch (title) {
            case 'VILLA':
                return 'SOLD OUT';
            case 'EARTH SHELTER':
                return 'Different Touch';
            case 'PRESIDENTIAL SUITES':
                return 'Exclusive Apartment';
            case 'EXECUTIVE SUITE SHARE':
                return 'Smart Looky';
            case 'SUPERIOR DELUXE':
                return 'Lake View';
            default:
                return '';
        }
    };

    const getMessageBgColor = (title) => {
        if (title === 'VILLA') {
            return '#e00000';
        }
        return '#639c4e';
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

    const newCards = [
        {
            id: 'villa-card',
            title: 'VILLA',
            is_sold_out: 1
        },
        {
            id: 'presidential-card',
            title: 'PRESIDENTIAL SUITES',
            is_sold_out: 0
        },
        {
            id: 'earthshelter-card',
            title: 'EARTH SHELTER',
            is_sold_out: 0
        },
        {
            id: 'executive-card',
            title: 'EXECUTIVE SUITE SHARE',
            is_sold_out: 0
        },
        {
            id: 'superior-card',
            title: 'SUPERIOR DELUXE',
            is_sold_out: 0
        }
    ];

    if (loading) {
        return <div className="text-center py-5">Loading Investment Packages...</div>;
    }

    return (
        <>
            <section className="investment-section py-5">
                <div className="container text-center">
                    <div className="badge-opportunity mb-3">INVESTMENT OPPORTUNITIES</div>
                    <h1 className="main-title mb-2">RESORT INVESTMENT PACKAGES</h1>
                    <div className="yellow-divider mx-auto mb-4"></div>
                    <p className="sub-text mb-5">Become a partner in Bangladesh's premier luxury resort destination</p>

                    <div className="new-design-section">
                        <div className="row g-4 justify-content-center">
                            {newCards.map((pkg) => (
                                <div className="col" key={pkg.id} style={{ flex: '1 0 18%', maxWidth: '20%' }}>
                                    <div
                                        className="investment-card popular-border new-card-no-hover"
                                        style={{ minHeight: '180px', maxHeight: '200px', cursor: 'default' }}
                                    >
                                        <div className="card-content d-flex flex-column h-100 p-3" style={{ marginTop: '5px', overflow: 'visible' }}>
                                            <h4 className="pkg-title mt-3" style={{ minHeight: 'auto', fontSize: '1rem', textAlign: 'left' }}>{pkg.title}</h4>
                                            <div style={{
                                                backgroundColor: getMessageBgColor(pkg.title),
                                                color: 'white',
                                                padding: '10px 12px',
                                                marginTop: '12px',
                                                textAlign: 'center',
                                                fontWeight: '400',
                                                fontSize: '14px',
                                                fontFamily: "'Cormorant Infant', 'Georgia', serif",
                                                fontStyle: 'italic',
                                                letterSpacing: '0.5px',
                                                wordSpacing: '2px',
                                                minHeight: '50px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '100%',
                                                borderRadius: '3px',
                                                textShadow: '0 1px 1px rgba(0,0,0,0.1)'
                                            }}>
                                                {getMessage(pkg.title)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="row g-4 justify-content-center mt-5">
                        {packages.map((pkg) => {
                            const isPopular = pkg.title === 'SUPERIOR DELUXE';

                            return (
                                <div className="col-lg-3 col-md-6" key={pkg.id}>
                                    <div
                                        className={`investment-card popular-border ${pkg.is_sold_out == 1 ? 'sold-out-card' : 'clickable-card'}`}
                                        onClick={() => handleCardClick(pkg)}
                                        style={{ cursor: pkg.is_sold_out == 1 ? 'default' : 'pointer' }}
                                    >
                                        {isPopular && <div className="popular-badge-centered">POPULAR</div>}

                                        <div className="card-content d-flex flex-column h-100 p-3">
                                            <h3 className="pkg-title mt-3" style={{ textAlign: 'left' }}>{pkg.title}</h3>

                                            {pkg.is_sold_out == 1 ? (
                                                <div className="sold-out-container my-auto">
                                                    <div className="sold-out-btn">SOLD OUT</div>
                                                </div>
                                            ) : (
                                                <>
                                                    <h2 className="fw-bold mb-0" style={{ textAlign: 'left', fontSize: '1.2rem', color: '#ff8c32' }}>Price: ৳ {parseInt(pkg.price).toLocaleString()} BDT</h2>
                                                    <p className="fw-bold mb-0" style={{ fontSize: '1.2rem', textAlign: 'left', color: '#198754' }}>
                                                        Cashback: ৳ {parseInt(pkg.discount).toLocaleString()} BDT
                                                    </p>
                                                    <ul className="pkg-features text-start ps-3 mt-2 mb-2" style={{ textAlign: 'left', paddingLeft: '0' }}>
                                                        <li><strong>Land & Building:</strong> {pkg.land || 'N/A'}</li>
                                                        <li><strong>Total Room Size:</strong> {pkg.total_size || 'N/A'} sqft</li>
                                                        <li><strong>+ Amenities</strong></li>
                                                    </ul>
                                                    <p className="pkg-desc px-2 mt-2 mb-2" style={{ textAlign: 'left' }}>
                                                        {pkg.description && pkg.description.length > 80
                                                            ? `${pkg.description.substring(0, 80)}...`
                                                            : pkg.description}
                                                    </p>
                                                </>
                                            )}

                                            <button className={`inquire-btn mt-2 ${pkg.is_sold_out == 1 ? 'sold-out-footer' : 'popular-btn'}`}>
                                                {pkg.is_sold_out == 1 ? "NOT AVAILABLE" : "INQUIRE NOW"}
                                            </button>
                                        </div>
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
                                                <h2 className="fw-bold" style={{ color: '#5DB8C1' }}>
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

                {/* BENEFITS SECTION - Using original design classes */}
                <div className="benefits-container container mt-5 p-5 bg-white">
                    <h2 className='display-4 fw-normal text-uppercase mb-2 text-center'>Investment Benefits</h2>
                    <div className="yellow-divider mx-auto mb-4"></div>
                    <div className="row g-3">
                        {fixedBenefitsList.map((benefit, index) => (
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
            </section>
        </>
    );
};

export default Investment;