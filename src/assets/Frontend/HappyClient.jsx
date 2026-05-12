import React, { useState, useEffect } from 'react';

// কাউন্টার লজিক
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
    const heroSectionStyle = {
        background: 'linear-gradient(rgba(3, 27, 51, 0.85), rgba(3, 27, 51, 0.85)), url("https://img.freepik.com/free-vector/stock-market-trading-graph-blue-background_1017-31846.jpg")',
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

    return (
        <section>
            {/* Hero Section */}
            <div style={heroSectionStyle}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <span className="text-warning fw-bold border-start border-warning border-3 ps-3 mb-3 d-inline-block" style={{ fontSize: '14px', letterSpacing: '1px' }}>
                                AKASHBARI RESORT & CLUB
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
                                    {/* Feature 1 */}
                                    <div className="py-3 border-top border-white-25">
                                        <div className="d-flex align-items-center">
                                            <span className="fs-3 me-3">💰</span>
                                            <div>
                                                <h6 className="fw-bold mb-0">Passive Income</h6>
                                                <p className="small mb-0 opacity-75">Maximize your wealth with guaranteed yearly revenue and steady annual profits.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Feature 2 */}
                                    <div className="py-3 border-top border-white-25">
                                        <div className="d-flex align-items-center">
                                            <span className="fs-3 me-3">💎</span>
                                            <div>
                                                <h6 className="fw-bold mb-0">Elite Status</h6>
                                                <p className="small mb-0 opacity-75">Unlock premium benefits with exclusive membership to the prestigious Akashbari Club.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Feature 3 */}
                                    <div className="py-3 border-top border-bottom border-white-25">
                                        <div className="d-flex align-items-center">
                                            <span className="fs-3 me-3">✨</span>
                                            <div>
                                                <h6 className="fw-bold mb-0">Luxury Living</h6>
                                                <p className="small mb-0 opacity-75">Experience the perfect blend of modern lifestyle, elegance, and comfort.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-11">
                        <div style={statsCardStyle} className="text-center">
                            <div className="row g-4">
                                <div className="col-md-3 border-end">
                                    <CountUpItem target={4000} suffix="+" />
                                    <p className="text-muted fw-bold mb-0">Happy Members</p>
                                </div>
                                <div className="col-md-3 border-end">
                                    <CountUpItem target={12} suffix="%" prefix="Up to " />
                                    <p className="text-muted fw-bold mb-0">Yearly Revenue</p>
                                </div>
                                <div className="col-md-3 border-end">
                                    <CountUpItem target={25} suffix="+" />
                                    <p className="text-muted fw-bold mb-0">Club Amenities</p>
                                </div>
                                <div className="col-md-3">
                                    <CountUpItem target={15} suffix="+" prefix="" />
                                    <p className="text-muted fw-bold mb-0">Years of Trust</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HappyClient;