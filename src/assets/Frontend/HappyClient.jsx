import React, { useState, useEffect } from 'react';
import axios from 'axios';

// কাউন্টার কম্পোনেন্ট
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

const HappyClient = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [combinedData, setCombinedData] = useState({
        record_members: [],
        invest_records: []
    });

    // Environment variables - FIXED
    const API_BASE_URL = import.meta.env.VITE_BASE_URL;
    const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL;

    // ইমেজ এবং কনফিগারেশন JSON
    const pageConfig = {
        heroBgImage: "https://img.freepik.com/free-vector/stock-market-trading-graph-blue-background_1017-31846.jpg",
        overlayOpacity: 0.95
    };

    const featureIcons = ["💰", "💎", "✨"];

    // Fetch combined data from API - FIXED URL
    const fetchCombinedData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/combined-records`, {
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCombinedData();
    }, [API_BASE_URL]); // Added dependency

    // Get the first member record for stats
    const getMemberStats = () => {
        if (combinedData.record_members.length > 0) {
            const member = combinedData.record_members[0];
            return {
                member: parseInt(member.member) || 0,
                revenue: parseInt(member.revenue) || 0,
                amenities: parseInt(member.amenities) || 0,
                experience: parseInt(member.expericence) || 0
            };
        }
        return {
            member: 0,
            revenue: 0,
            amenities: 0,
            experience: 0
        };
    };

    // Dynamic stats data from API
    const getStatsData = () => {
        const stats = getMemberStats();
        return [
            { id: 1, target: stats.member, suffix: "+", prefix: "", label: "Happy Members" },
            { id: 2, target: stats.revenue, suffix: "%", prefix: "Up to ", label: "Yearly Revenue" },
            { id: 3, target: stats.amenities, suffix: "+", prefix: "", label: "Club Amenities" },
            { id: 4, target: stats.experience, suffix: "+", prefix: "", label: "Years of Trust" }
        ];
    };

    // Dynamic features data from invest_records API
    const getFeaturesData = () => {
        if (combinedData.invest_records.length > 0) {
            return combinedData.invest_records.map((record) => ({
                id: record.id,
                title: record.title,
                desc: record.desc
            }));
        }
        // Fallback data if API returns empty
        return [
            {
                id: 1,
                title: "Passive Income",
                desc: "Maximize your wealth with guaranteed yearly revenue and steady annual profits."
            },
            {
                id: 2,
                title: "Elite Status",
                desc: "Unlock premium benefits with exclusive membership to the prestigious Akashbari Club."
            },
            {
                id: 3,
                title: "Luxury Living",
                desc: "Experience the perfect blend of modern lifestyle, elegance, and comfort."
            }
        ];
    };

    const featuresData = getFeaturesData();
    const statsData = getStatsData();

    // Hero section style
    const heroSectionStyle = {
        background: `linear-gradient(rgba(3, 27, 51, ${pageConfig.overlayOpacity}), rgba(3, 27, 51, ${pageConfig.overlayOpacity})), url("${pageConfig.heroBgImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '100px 0 160px 0',
        color: 'white'
    };

    const statsCardStyle = {
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '40px 20px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
        marginTop: '-80px',
        position: 'relative',
        zIndex: '10'
    };

    // Loading state
    if (loading) {
        return (
            <section>
                <div style={heroSectionStyle}>
                    <div className="container text-center">
                        <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-white">Loading amazing content...</p>
                    </div>
                </div>
            </section>
        );
    }

    // Error state
    if (error) {
        return (
            <section>
                <div style={heroSectionStyle}>
                    <div className="container text-center">
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                        <button 
                            onClick={() => window.location.reload()}
                            className="btn btn-light mt-3"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section>
            <div style={heroSectionStyle}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <span className="text-warning fw-bold border-start border-warning border-3 ps-3 mb-3 d-inline-block" style={{ fontSize: '14px', letterSpacing: '1px' }}>
                                AKASHBARI HOTEL & RESORT
                            </span>
                            <h1 className="display-4 fw-bold mb-4" style={{ lineHeight: '1.2' }}>
                                Investments that <br />
                                <span style={{ color: '#5DB8C1' }}>make you a Property Owner</span>
                            </h1>
                        </div>
                        <div className="col-md-6">
                            <div className="ps-md-4" style={{ borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
                                <h4 className="fw-light mb-3">Your Investment, Your Future</h4>
                                <p className="lead mb-2">
                                    Become a proud <strong>Property Owner</strong> by investing in Akashbari Resort shares.
                                </p>
                                
                                <div className="mt-4">
                                    {featuresData.map((item, index) => (
                                        <div key={item.id} className={`py-3 border-top border-white-25 ${index === featuresData.length - 1 ? 'border-bottom' : ''}`}>
                                            <div className="d-flex align-items-center">
                                                <span className="fs-3 me-3">{featureIcons[index % featureIcons.length]}</span>
                                                <div>
                                                    <h6 className="fw-bold mb-0">{item.title}</h6>
                                                    <p className="small mb-0 opacity-75">{item.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-11">
                        <div style={statsCardStyle} className="text-center">
                            <div className="row g-4">
                                {statsData.map((stat, index) => (
                                    <div key={stat.id} className={`col-md-3 ${index !== statsData.length - 1 ? 'border-end' : ''}`}>
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
                                        <p className="text-muted fw-bold mb-0">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HappyClient;