import React, { useState, useEffect } from 'react';

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
    // ইমেজ এবং কনফিগারেশন JSON
    const pageConfig = {
        heroBgImage: "https://img.freepik.com/free-vector/stock-market-trading-graph-blue-background_1017-31846.jpg",
        overlayOpacity: 0.95
    };

    const featuresData = [
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

    const statsData = [
        { id: 1, target: 4000, suffix: "+", prefix: "", label: "Happy Members" },
        { id: 2, target: 12, suffix: "%", prefix: "Up to ", label: "Yearly Revenue" },
        { id: 3, target: 25, suffix: "+", prefix: "", label: "Club Amenities" },
        { id: 4, target: 15, suffix: "+", prefix: "", label: "Years of Trust" }
    ];

    const featureIcons = ["💰", "💎", "✨"];

    // স্টাইল অবজেক্টে JSON ডেটা ব্যবহার করা হয়েছে
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

    return (
        <section>
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
                                    {featuresData.map((item, index) => (
                                        <div key={item.id} className={`py-3 border-top border-white-25 ${index === featuresData.length - 1 ? 'border-bottom' : ''}`}>
                                            <div className="d-flex align-items-center">
                                                <span className="fs-3 me-3">{featureIcons[index]}</span>
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
                                        <CountUpItem 
                                            target={stat.target} 
                                            suffix={stat.suffix} 
                                            prefix={stat.prefix} 
                                        />
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