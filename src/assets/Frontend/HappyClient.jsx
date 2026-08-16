
// export default HappyClient;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/investattack.css'
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
        <h2 className="fw-bold" style={{ color: '#5e2e10' }}>
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

    // Environment variables
    const API_BASE_URL = import.meta.env.VITE_BASE_URL;

    // Hero section style - Background changed to WHITE
    const heroSectionStyle = {
        backgroundColor: '#ffffff',
        padding: '100px 0 160px 0',
        color: '#1a1a1a'
    };

    // Stats card style - Background white with subtle shadow
    const statsCardStyle = {
        backgroundColor: '#ffffff',
        borderRadius: '15px',
        padding: '40px 20px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
        marginTop: '-80px',
        position: 'relative',
        zIndex: '10',
        border: '1px solid #eef2f6'
    };

    // Fetch combined data from API
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
    }, []);

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

    // Loading state
    if (loading) {
        return (
            <section>
                <div style={heroSectionStyle}>
                    <div className="container text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading amazing content...</p>
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
                            className="btn btn-primary mt-3"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section style={{ backgroundColor: '#ffffff' }}>
            <div style={heroSectionStyle}>
                <div className="container">
                    <div className="row align-items-center">
                        {/* Left Column - Text Content */}
                        <div className="col-md-6">
                            {/* Desktop & Mobile - Different font sizes */}
                            <span 
                                className="fw-bold mb-3 d-inline-block brand-text" 
                                style={{ 
                                    fontSize: '25px', 
                                    letterSpacing: '1px', 
                                    color: '#5e2e10',
                                    display: 'block'
                                }}
                            >
                                AKASHBARI HOTEL & RESORT
                            </span>
                            
                            <h1 
                                className="fw-bold mb-4 main-heading" 
                                style={{ 
                                    lineHeight: '1.2', 
                                    color: '#1a1a1a',
                                    fontSize: 'clamp(1.8rem, 4vw, 3.5rem)' // Responsive font size
                                }}
                            >
                                Investments that <br />
                                <span style={{ color: '#5e2e10' }}>make you a Property Owner</span>
                            </h1>
                        </div>

                        {/* Right Column - Features with proper padding */}
                        <div className="col-md-6">
                            <div className="ps-md-4" style={{ 
                                borderLeft: '1px solid rgba(0,0,0,0.1)',
                                paddingLeft: '15px',
                                paddingRight: '15px'
                            }}>
                                <h4 className="fw-light mb-3" style={{ color: '#5e2e10' }}>Your Investment, Your Future</h4>
                                <p className="lead mb-2" style={{ color: '#2d3748' }}>
                                    Become a proud <strong>Property Owner</strong> by investing in Akashbari Hotel & Resorts' projects.
                                </p>
                                
                                <div className="mt-4">
                                    {featuresData.map((item, index) => (
                                        <div key={item.id} className={`py-3 border-top ${index === featuresData.length - 1 ? 'border-bottom' : ''}`} style={{ borderColor: '#e2e8f0 !important' }}>
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    <h6 className="fw-bold mb-0" style={{ color: '#5e2e10' }}>{item.title}</h6>
                                                    <p className="small mb-0" style={{ color: '#718096' }}>{item.desc}</p>
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

            {/* Stats Section - Keep as is */}
            {/* <div className="state-container" style={{ marginTop: '-60px', position: 'relative', zIndex: '10' }}>
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
            </div> */}
        </section>
    );
};

export default HappyClient;