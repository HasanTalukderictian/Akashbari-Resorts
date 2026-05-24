import React, { useState, useEffect } from 'react';
import Header from './Common/Header';
import Footer from './Common/Footer';
import '../css/about.css';

// Import images
import king1 from '../image/King-room1.jpg';
import king2 from '../image/King-room2.jpg';
import king3 from '../image/section/Blog/hotle.jpeg';
import king4 from '../image/King-room4.jpg';
import king5 from '../image/king5.jpg';
import img4 from '../image/facility4.jpg';
import image1 from '../image/place-1-1.jpg';
import image2 from '../image/place-1-3.jpg';
import image3 from '../image/place-1-2.jpg';

const AboutUs = () => {
    const [selectedImage, setSelectedImage] = useState(king1);
    const [activeId, setActiveId] = useState(1);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_BASE_URL;

    // ✅ পেজ লোড হলে টপে স্ক্রল করার জন্য
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'instant' // 'smooth' অথবা 'instant'
        });
    }, []); // Empty dependency array - শুধু প্রথমবার লোড হলে

    const galleryImages = [
        { id: 1, img: king1, title: "King Room", alt: "Luxury king room with modern amenities" },
        { id: 2, img: king2, title: "Suits Room", alt: "Elegant suite with separate living area" },
        { id: 3, img: king3, title: "Lake View", alt: "Scenic lake view from premium rooms" },
        { id: 4, img: king4, title: "City View", alt: "Panoramic city skyline view" },
        { id: 5, img: king5, title: "Family Room", alt: "Spacious family suite with kids area" }
    ];

    const placesList = [
        { id: 1, img: image1, title: "Coastal Paradise", category: "beach" },
        { id: 2, img: image2, title: "Cultural Tours", category: "culture" },
        { id: 3, img: image3, title: "Mountain Views", category: "nature" },
        { id: 4, img: img4, title: "Heritage Sites", category: "historical" }
    ];

    // Fetch team members from API
    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/team-members`);
                const result = await response.json();
                
                if (result.status === true) {
                    setTeamMembers(result.data);
                } else {
                    setError(result.message || 'Failed to fetch team members');
                }
            } catch (error) {
                console.error('Error fetching team members:', error);
                setError('Network error. Please check your connection.');
            } finally {
                setLoading(false);
            }
        };

        fetchTeamMembers();
    }, []);

    return (
        <>
            <Header />

            {/* Section 1: Banner */}
            <section className="about-banner text-center d-flex flex-column justify-content-center">
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-white">
                            <h1 className="banner-title serif mb-2">About Us</h1>
                            <div className="breadcrumb-wrapper">
                                <a href="/" className="text-white text-decoration-none small">🏠 Home</a>
                                <span className="separator mx-2 text-warning small">&gt;</span>
                                <span className="current-page text-white small">📄 About</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Akashbari Hotel & Resort Section */}
            <section className="akashbari-intro-section py-5" style={{ backgroundColor: '#fcfcfc' }}>
                <div className="container">
                    <div className="row align-items-center g-5">
                        {/* Left Side - Text Details */}
                        <div className="col-lg-6">
                            <div className="modern-content">
                                <div className="section-badge mb-3">
                                    <span className="badge-dot"></span>
                                    ✨ WELCOME TO AKASHBARI
                                </div>

                                <h2 className="modern-title mb-4">
                                    Experience Luxury At
                                    <span className="text-gradient"> Akashbari Hotel & Resort</span>
                                </h2>

                                {/* Business Info Details */}
                                <div className="p-3 mb-4 rounded-3 bg-white shadow-sm border-start border-4 border-warning">
                                    <p className="mb-2">
                                        <strong>🏢 Business Type:</strong> Luxury Hospitality & Eco Resort
                                    </p>
                                    <p className="mb-0">
                                        <strong>📅 Established Since:</strong> 2015
                                    </p>
                                </div>

                                <p className="modern-description text-muted mb-4">
                                    Akashbari Hotel & Resort is a premier getaway destination blending nature with world-class hospitality. 
                                    Designed for families, couples, and corporate events, we offer a tranquil environment away from the hustle of daily life.
                                </p>

                                {/* Facilities List */}
                                <h4 className="serif mb-3" style={{ fontSize: '1.3rem', fontWeight: '600' }}>
                                    🏆 Our Premium Facilities:
                                </h4>
                                <ul className="list-unstyled mb-4">
                                    <li className="mb-2 text-secondary" style={{ fontSize: '1.05rem' }}>✓ Premium Eco Cottages & Suites</li>
                                    <li className="mb-2 text-secondary" style={{ fontSize: '1.05rem' }}>✓ Infinity Swimming Pool</li>
                                    <li className="mb-2 text-secondary" style={{ fontSize: '1.05rem' }}>✓ Multi-Cuisine Fine Dining Restaurant</li>
                                    <li className="mb-2 text-secondary" style={{ fontSize: '1.05rem' }}>✓ Guided Nature Trails & Kids Zone</li>
                                    <li className="mb-2 text-secondary" style={{ fontSize: '1.05rem' }}>✓ Corporate Conference Hall & Event Spaces</li>
                                </ul>

                                <button className="explore-btn" onClick={() => window.location.href = '/booking'}>
                                    📅 Book Your Stay
                                </button>
                            </div>
                        </div>

                        {/* Right Side - Resort Image */}
                        <div className="col-lg-6">
                            <div className="modern-gallery-wrapper">
                                <div className="main-image-container position-relative overflow-hidden rounded-4 shadow-lg">
                                    <img
                                        src={king3}
                                        alt="Akashbari Resort View"
                                        className="img-fluid w-100"
                                        style={{ minHeight: '420px', objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision Section */}
            <section className="vision-section py-5" style={{ backgroundColor: '#ffffff' }}>
                <div className="container">
                    {/* Section Header */}
                    <div className="text-center mb-5">
                        <div className="section-badge d-inline-flex align-items-center gap-2 mb-3" style={{
                            backgroundColor: '#f0f0ff',
                            padding: '8px 20px',
                            borderRadius: '50px',
                            color: '#9a55ff',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}>
                            <span style={{ fontSize: '18px' }}>👁️</span>
                            OUR VISION
                        </div>
                        <h2 className="modern-title mb-3">
                            Shaping the Future of
                            <span className="text-gradient"> Luxury Hospitality</span>
                        </h2>
                        <p className="vision-description text-muted mx-auto" style={{ maxWidth: '700px', fontSize: '1.1rem', lineHeight: '1.6' }}>
                            At Akashbari Hotel & Resort, we envision a future where luxury and sustainability coexist harmoniously. 
                            Our vision is to create a sanctuary that not only provides exceptional comfort but also inspires a deeper 
                            connection with nature and community.
                        </p>
                    </div>

                    {/* Vision Points Grid */}
                    <div className="row g-4 mb-5">
                        <div className="col-md-6 col-lg-3">
                            <div className="vision-card h-100 text-center p-4 rounded-4" style={{
                                backgroundColor: '#fcfcfc',
                                border: '1px solid #e9ecef',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}>
                                <div className="vision-icon-wrapper mb-3" style={{
                                    width: '70px',
                                    height: '70px',
                                    margin: '0 auto',
                                    background: 'linear-gradient(135deg, #10b98115 0%, #10b98105 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <span style={{ fontSize: '32px' }}>🌿</span>
                                </div>
                                <h4 className="vision-point-title mb-3" style={{ fontSize: '1.2rem', fontWeight: '700', color: '#2c3e50' }}>
                                    Sustainable Excellence
                                </h4>
                                <p className="vision-point-description text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    Pioneering eco-friendly luxury that minimizes environmental impact while maximizing guest comfort and satisfaction.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="vision-card h-100 text-center p-4 rounded-4" style={{
                                backgroundColor: '#fcfcfc',
                                border: '1px solid #e9ecef',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}>
                                <div className="vision-icon-wrapper mb-3" style={{
                                    width: '70px',
                                    height: '70px',
                                    margin: '0 auto',
                                    background: 'linear-gradient(135deg, #3b82f615 0%, #3b82f605 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <span style={{ fontSize: '32px' }}>🤝</span>
                                </div>
                                <h4 className="vision-point-title mb-3" style={{ fontSize: '1.2rem', fontWeight: '700', color: '#2c3e50' }}>
                                    Community First
                                </h4>
                                <p className="vision-point-description text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    Empowering local communities through employment, cultural preservation, and responsible tourism initiatives.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="vision-card h-100 text-center p-4 rounded-4" style={{
                                backgroundColor: '#fcfcfc',
                                border: '1px solid #e9ecef',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}>
                                <div className="vision-icon-wrapper mb-3" style={{
                                    width: '70px',
                                    height: '70px',
                                    margin: '0 auto',
                                    background: 'linear-gradient(135deg, #9a55ff15 0%, #9a55ff05 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <span style={{ fontSize: '32px' }}>✨</span>
                                </div>
                                <h4 className="vision-point-title mb-3" style={{ fontSize: '1.2rem', fontWeight: '700', color: '#2c3e50' }}>
                                    Innovation & Growth
                                </h4>
                                <p className="vision-point-description text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    Continuously evolving our services and facilities to exceed global hospitality standards and guest expectations.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="vision-card h-100 text-center p-4 rounded-4" style={{
                                backgroundColor: '#fcfcfc',
                                border: '1px solid #e9ecef',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}>
                                <div className="vision-icon-wrapper mb-3" style={{
                                    width: '70px',
                                    height: '70px',
                                    margin: '0 auto',
                                    background: 'linear-gradient(135deg, #ef444415 0%, #ef444405 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <span style={{ fontSize: '32px' }}>❤️</span>
                                </div>
                                <h4 className="vision-point-title mb-3" style={{ fontSize: '1.2rem', fontWeight: '700', color: '#2c3e50' }}>
                                    Guest Centricity
                                </h4>
                                <p className="vision-point-description text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    Creating unforgettable memories through personalized experiences and genuine warm hospitality.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Vision Stats Row */}
                    <div className="vision-stats-wrapper mt-4 p-4 rounded-4" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '20px'
                    }}>
                        <div className="row text-center">
                            <div className="col-md-3 col-6 mb-3 mb-md-0">
                                <div className="stat-item">
                                    <div className="stat-icon mb-2">
                                        <span style={{ fontSize: '32px' }}>😊</span>
                                    </div>
                                    <h3 className="stat-value text-white mb-1" style={{ fontSize: '2rem', fontWeight: '700' }}>500+</h3>
                                    <p className="stat-label text-white-50 mb-0" style={{ fontSize: '0.9rem' }}>Happy Guests Daily</p>
                                </div>
                            </div>
                            <div className="col-md-3 col-6 mb-3 mb-md-0">
                                <div className="stat-item">
                                    <div className="stat-icon mb-2">
                                        <span style={{ fontSize: '32px' }}>⭐</span>
                                    </div>
                                    <h3 className="stat-value text-white mb-1" style={{ fontSize: '2rem', fontWeight: '700' }}>98%</h3>
                                    <p className="stat-label text-white-50 mb-0" style={{ fontSize: '0.9rem' }}>Guest Satisfaction</p>
                                </div>
                            </div>
                            <div className="col-md-3 col-6 mb-3 mb-md-0">
                                <div className="stat-item">
                                    <div className="stat-icon mb-2">
                                        <span style={{ fontSize: '32px' }}>🏆</span>
                                    </div>
                                    <h3 className="stat-value text-white mb-1" style={{ fontSize: '2rem', fontWeight: '700' }}>15+</h3>
                                    <p className="stat-label text-white-50 mb-0" style={{ fontSize: '0.9rem' }}>Years of Excellence</p>
                                </div>
                            </div>
                            <div className="col-md-3 col-6 mb-3 mb-md-0">
                                <div className="stat-item">
                                    <div className="stat-icon mb-2">
                                        <span style={{ fontSize: '32px' }}>🎖️</span>
                                    </div>
                                    <h3 className="stat-value text-white mb-1" style={{ fontSize: '2rem', fontWeight: '700' }}>50+</h3>
                                    <p className="stat-label text-white-50 mb-0" style={{ fontSize: '0.9rem' }}>Awards Won</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vision Quote/Footer */}
                    <div className="vision-quote text-center mt-5 pt-3">
                        <div className="quote-icon mb-3">
                            <span style={{ fontSize: '40px', opacity: '0.5' }}>❝</span>
                        </div>
                        <p className="quote-text" style={{ fontSize: '1.2rem', fontStyle: 'italic', color: '#6c757d', maxWidth: '800px', margin: '0 auto' }}>
                            "To be the most loved and trusted hospitality brand that transforms every stay into a cherished memory,
                            while nurturing the environment and communities we serve."
                        </p>
                        <div className="quote-author mt-3">
                            <p className="mb-0" style={{ fontWeight: '600', color: '#2c3e50' }}>- Akashbari Management</p>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                .vision-card:hover .vision-icon-wrapper {
                    transform: scale(1.1);
                    transition: transform 0.3s ease;
                }
                
                .vision-stats-wrapper {
                    animation: fadeInUp 0.6s ease-out;
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
                
                .vision-card {
                    animation: fadeInUp 0.5s ease-out;
                    animation-fill-mode: backwards;
                }
                
                .vision-card:nth-child(1) { animation-delay: 0.1s; }
                .vision-card:nth-child(2) { animation-delay: 0.2s; }
                .vision-card:nth-child(3) { animation-delay: 0.3s; }
                .vision-card:nth-child(4) { animation-delay: 0.4s; }
            `}</style>

            {/* Team Section - Dynamic from API */}
            <section className="team-section-modern py-5">
                <div className="container">
                    <div className="team-header-modern text-center">
                        <div className="header-icon-wrapper">
                            <span className="header-icon" style={{ fontSize: '2rem' }}>👥</span>
                        </div>
                        <div className="section-tag centered">
                            <span className="tag-dot"></span>
                            MEET OUR EXPERTS
                        </div>
                        <h2 className="team-title">
                            The Passionate <span className="text-gradient">People Behind</span><br />
                            Your Perfect Stay
                        </h2>
                        <p className="team-subtitle">
                            Akashbari is supported by a dedicated team focused on creating a calm, welcoming environment. 
                            From daily operations to guest support, each role contributes to a smooth and thoughtful stay experience.
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3 text-muted">Loading team members...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-5">
                            <p className="text-danger">⚠️ {error}</p>
                            <button 
                                className="btn btn-primary mt-3"
                                onClick={() => window.location.reload()}
                            >
                                Retry
                            </button>
                        </div>
                    ) : teamMembers.length > 0 ? (
                        <div className="team-grid-modern">
                            {teamMembers.map((member) => (
                                <div className="team-card-modern" key={member.id}>
                                    <div className="team-card-inner">
                                        <div className="team-image-wrapper">
                                            <img 
                                                src={member.image} 
                                                alt={member.name} 
                                                className="team-image"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                                }}
                                            />
                                            <div className="team-social-overlay">
                                                <a href={`mailto:${member.email || 'info@akashbari.com'}`} className="social-link" target="_blank" rel="noopener noreferrer">
                                                    <i className="bi bi-envelope"></i>
                                                </a>
                                                <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
                                                    <i className="bi bi-linkedin"></i>
                                                </a>
                                                <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
                                                    <i className="bi bi-twitter"></i>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="team-info">
                                            <h3 className="team-member-name">{member.name}</h3>
                                            <p className="team-member-role">{member.designation}</p>
                                            <p className="team-member-bio">{member.subtitle}</p>
                                            <div className="team-divider"></div>
                                            <div className="team-contact-badge">
                                                <span>📧 {member.email ? 'Contact' : 'Book a Meeting'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <p className="text-muted">No team members found.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
};

export default AboutUs;