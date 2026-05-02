import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Owner = () => {
    const [content, setContent] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await axios.get('../../../public/owner.json');
                setContent(response.data);
            } catch (error) {
                console.error("Content loading failed:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    useEffect(() => {
        if (content?.hero?.slider_images) {
            const interval = setInterval(() => {
                setActiveIndex((prev) => (prev === content.hero.slider_images.length - 1 ? 0 : prev + 1));
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [content]);

    // WhatsApp Redirect Function
    const handleWhatsAppClick = () => {
        if (content?.hero?.whatsapp_number) {
            const number = content.hero.whatsapp_number;
            // Number thik thak format korar jonno (optional)
            const cleanNumber = number.replace(/\D/g, ''); 
            window.open(`https://wa.me/${cleanNumber}`, '_blank');
        }
    };

    if (loading) return <div className="text-center py-5">Loading Content...</div>;
    if (!content) return null;

    return (
        <div className="container-fluid py-5" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            <div className="container p-0 overflow-hidden shadow-sm bg-white rounded-4 mb-5">
                <div className="row g-0 align-items-center">

                    {/* Slider Column */}
                    <div className="col-lg-6 position-relative overflow-hidden" style={{ height: '550px' }}>
                        {content.hero.slider_images.map((img, index) => (
                            <div
                                key={index}
                                style={{
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                    opacity: activeIndex === index ? 1 : 0,
                                    transition: 'opacity 1s ease-in-out', zIndex: activeIndex === index ? 1 : 0
                                }}
                            >
                                <img src={img} className="w-100 h-100" alt="Resort" style={{ objectFit: 'cover' }} />
                            </div>
                        ))}

                        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-2" style={{ zIndex: 10 }}>
                            {content.hero.slider_images.map((_, index) => (
                                <div
                                    key={index} onClick={() => setActiveIndex(index)}
                                    style={{
                                        width: '12px', height: '12px', borderRadius: '50%',
                                        backgroundColor: activeIndex === index ? '#d4af37' : 'white',
                                        cursor: 'pointer', border: '2px solid rgba(0,0,0,0.2)'
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Text Column */}
                    <div className="col-lg-6">
                        <div className="p-4 p-md-5 mx-auto" style={{ maxWidth: '600px' }}>
                            <h6 className="text-uppercase fw-bold mb-3" style={{ color: '#4a4a4a', letterSpacing: '2px' }}>
                               Investment Opportunity
                            </h6>
                            <h2
                                className="display-4 fw-bold mb-4"
                                style={{
                                    color: '#3e4b5b',
                                    lineHeight: '1.2',
                                    fontWeight: '400'
                                }}
                            >
                                {content.hero.title}
                                <span style={{ color: '#d4af37', marginLeft: '10px' }}>{content.hero.brand_name}</span>
                            </h2>
                            <p className="lead text-muted mb-4">{content.hero.description}</p>

                            <div className="mb-4">
                                {content.hero.features.map((text, i) => (
                                    <div className="d-flex align-items-center mb-2" key={i}>
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        <span>{text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Updated Button with onClick */}
                            <button 
                                onClick={handleWhatsAppClick}
                                className="btn btn-lg text-white px-5 py-3 fw-bold shadow-lg"
                                style={{ background: 'linear-gradient(to right, #639c4e, #639c4e)', borderRadius: '30px', border: 'none' }}>
                                For Query <i className="bi bi-chat-dots ms-2"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="text-center mb-5 pt-4">
                    <h3 className="fw-bold mb-2">Why Invest with Us?</h3>
                    <div className="mx-auto" style={{ width: '60px', height: '4px', background: '#b66dff', borderRadius: '2px' }}></div>
                </div>

                <div className="row g-4">
                    {content.benefits.map((item, index) => (
                        <div className="col-md-4" key={index}>
                            <div className="card h-100 border-0 shadow-sm p-4 text-center transition-hover" style={{ borderRadius: '20px' }}>
                                <div className="d-inline-flex align-items-center justify-content-center mb-4 mx-auto shadow-sm"
                                    style={{ width: '70px', height: '70px', backgroundColor: '#f3e5f5', borderRadius: '15px' }}>
                                    <i className={`bi ${item.icon}`} style={{ fontSize: '2rem', color: item.color }}></i>
                                </div>
                                <h4 className="fw-bold mb-3" style={{ color: '#3e4b5b' }}>{item.title}</h4>
                                <p className="text-muted">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`.transition-hover:hover { transform: translateY(-10px); transition: 0.3s; }`}</style>
        </div>
    );
};

export default Owner;