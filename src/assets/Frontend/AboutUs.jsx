import React, { useState, useEffect } from 'react';
import Header from './Common/Header';
import Footer from './Common/Footer';
import '../css/about.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEye, 
  faBullseye, 
  faStar, 
  faHeart,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
// ব্র্যান্ড আইকনগুলো আলাদাভাবে ইম্পোর্ট করতে হবে
import { 
  faLinkedin, 
  faTwitter 
} from '@fortawesome/free-brands-svg-icons';

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
// CEO Image - আপনার ইমেজ পাথ অনুযায়ী পরিবর্তন করুন
import ceoImage from '../../assets/image/section/Blog/ceo.jpg';

const AboutUs = () => {
    const brandColor = '#5e2e10';
    const [selectedImage, setSelectedImage] = useState(king1);
    const [activeId, setActiveId] = useState(1);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_BASE_URL;

    // পেজ লোড হলে টপে স্ক্রল করার জন্য
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    }, []);

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
                        <div className="col-12 text-white text-center">
                            <h1 className="banner-title serif mb-3">About Us</h1>
                            <div className="message-wrapper">
                                <p className="mb-0" style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '300',
                                    fontStyle: 'italic',
                                    borderLeft: `3px solid ${brandColor}`,
                                    borderRight: `3px solid ${brandColor}`,
                                    display: 'inline-block',
                                    padding: '0 25px',
                                    letterSpacing: '0.3px'
                                }}>
                                    <FontAwesomeIcon icon={faHeart} className="me-2" style={{ color: brandColor }} />
                                    Crafting dreams, building futures
                                    <FontAwesomeIcon icon={faHeart} className="ms-2" style={{ color: brandColor }} />
                                </p>
                            </div>
                        </div>
                    </div>


                </div>
            </section>

            {/* Akashbari Hotel & Resort Section */}
            <section className="akashbari-intro-section py-5" style={{ backgroundColor: '#fcfcfc' }}>
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <div className="modern-content">
                                <div className="section-badge mb-3" style={{ color: brandColor }}>
                                    
                                    WELCOME TO AKASHBARI
                                </div>
                                <h2 className="modern-title mb-4">
                                    Experience Luxury At
                                    <span  style={{ color: brandColor, fontSize: '50px'}}> Akashbari Hotels & Resorts</span>
                                </h2>
                                <div className="p-3 mb-4 rounded-3 bg-white shadow-sm border-start border-4" style={{ borderColor: brandColor }}>
                                    <p className="mb-2">
                                        <strong> Business Type:</strong> Luxury Hospitality & Eco Resort
                                    </p>
                                    <p className="mb-0">
                                        <strong> Established Since:</strong> 2015
                                    </p>
                                </div>
                                <p className="modern-description text-muted mb-4" style={{ fontFamily: 'inherit', fontSize: '1rem', lineHeight: '1.6' }}>
                                    Akashbari Hotels & Resort is a premier getaway destination blending nature with world-class hospitality.
                                    Designed for families, couples, and corporate events, we offer a tranquil environment away from the hustle of daily life.
                                </p>
                                <h4 className="serif mb-3" style={{ fontSize: '1.3rem', fontWeight: '600', color: brandColor }}>
                                     Our Premium Facilities:
                                </h4>
                                <ul className="list-unstyled mb-4">
                                    <li className="mb-2 text-secondary" style={{ fontSize: '1.05rem' }}>✓ Premium Eco Cottages & Suites</li>
                                    <li className="mb-2 text-secondary" style={{ fontSize: '1.05rem' }}>✓ Infinity Swimming Pool</li>
                                    <li className="mb-2 text-secondary" style={{ fontSize: '1.05rem' }}>✓ Multi-Cuisine Fine Dining Restaurant</li>
                                    <li className="mb-2 text-secondary" style={{ fontSize: '1.05rem' }}>✓ Guided Nature Trails & Kids Zone</li>
                                    <li className="mb-2 text-secondary" style={{ fontSize: '1.05rem' }}>✓ Corporate Conference Hall & Event Spaces</li>
                                </ul>

                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="modern-gallery-wrapper">
                                <div className="main-image-container position-relative overflow-hidden rounded-4 shadow-lg" style={{ border: `2px solid ${brandColor}40` }}>
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

            {/* ========== CEO SECTION - Same design as existing sections ========== */}
            <section className="ceo-section py-5" style={{ backgroundColor: '#ffffff' }}>
                <div className="container">
                    {/* Section Header - Same as vision section */}
                    <div className="text-center mb-5">
                        <div className="section-badge d-inline-flex align-items-center gap-2 mb-3" style={{
                            backgroundColor: `${brandColor}15`,
                            padding: '8px 20px',
                            borderRadius: '50px',
                            color: brandColor,
                            fontSize: '14px',
                            fontWeight: '600',
                            fontFamily: 'inherit'
                        }}>
                            <span style={{ fontSize: '18px' }}></span>
                            LEADERSHIP CORNER
                        </div>
                        <h2 className="modern-title mb-3" style={{ fontFamily: 'inherit' }}>
                            Message from Our
                            <span  style={{ color: brandColor }}> CEO & Founder</span>
                        </h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontFamily: 'inherit', fontSize: '1rem' }}>
                            Meet the visionary behind Akashbari's success
                        </p>
                    </div>

                    <div className="row align-items-center g-5">
                        {/* Left Side - CEO Image */}
                        <div className="col-lg-5">
                            <div className="ceo-image-area text-center">
                                <div className="position-relative d-inline-block">
                                    <div className="ceo-image-wrapper rounded-4 overflow-hidden shadow-lg" style={{
                                        border: `5px solid ${brandColor}`,
                                        borderRadius: '20px',
                                        maxWidth: '350px',
                                        margin: '0 auto'
                                    }}>
                                        <img
                                            src={ceoImage}
                                            alt="CEO & Founder"
                                            className="img-fluid w-100"
                                            style={{ minHeight: '350px', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/350x400?text=CEO+Image';
                                            }}
                                        />
                                    </div>
                                    <div className="ceo-name-card mt-3 p-3 bg-white rounded-3 shadow-sm" style={{
                                        position: 'relative',
                                        zIndex: '2',
                                        fontFamily: 'inherit',
                                        border: `1px solid ${brandColor}30`
                                    }}>
                                        <h4 className="mb-0" style={{ color: brandColor, fontWeight: '700', fontFamily: 'inherit' }}>Touhidul Alam Milky</h4>
                                        <p className="mb-0 text-muted" style={{ fontFamily: 'inherit' }}>CEO & Founder, Akashbari Group</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - CEO Content */}
                        <div className="col-lg-7">
                            {/* CEO Message Box - Same style as business info box */}
                            <div className="ceo-message-box p-4 rounded-4 mb-4" style={{
                                backgroundColor: '#fcfcfc',
                                borderLeft: `4px solid ${brandColor}`,
                                boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
                                fontFamily: 'inherit'
                            }}>
                                <span style={{ fontSize: '40px', color: brandColor, opacity: '0.4', fontFamily: 'inherit' }}>"</span>
                                <p className="ceo-quote-text px-3" style={{
                                    fontSize: '1rem',
                                    lineHeight: '1.7',
                                    color: '#4a5568',
                                    fontStyle: 'italic',
                                    fontFamily: 'inherit'
                                }}>
                                    Akashbari was born from a dream to create a sanctuary where luxury meets nature,
                                    where every guest feels like family, and where hospitality goes beyond service to become
                                    an unforgettable experience. Our journey is driven by passion, integrity, and an unwavering
                                    commitment to excellence.
                                </p>
                                <span style={{ fontSize: '40px', color: brandColor, opacity: '0.4', display: 'block', textAlign: 'right', fontFamily: 'inherit' }}>"</span>
                            </div>

                            {/* Vision, Mission, Goal Grid - Updated with Font Awesome icons */}
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <div className="vm-card text-center p-3 rounded-3" style={{
                                        backgroundColor: '#fcfcfc',
                                        border: `1px solid ${brandColor}30`,
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        height: '100%',
                                        fontFamily: 'inherit'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.boxShadow = `0 10px 25px ${brandColor}30`;
                                            e.currentTarget.style.borderColor = brandColor;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                            e.currentTarget.style.borderColor = `${brandColor}30`;
                                        }}>
                                        <div className="vm-icon mb-2" style={{ fontSize: '36px', color: brandColor }}>
                                            <FontAwesomeIcon icon={faEye} />
                                        </div>
                                        <h5 className="mb-2" style={{ fontWeight: '700', color: brandColor, fontFamily: 'inherit', fontSize: '1.1rem' }}>Our Vision</h5>
                                        <p className="small text-muted mb-0" style={{ fontFamily: 'inherit', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                            To be Bangladesh's most preferred eco-luxury resort, setting global benchmarks in sustainable hospitality.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="vm-card text-center p-3 rounded-3" style={{
                                        backgroundColor: '#fcfcfc',
                                        border: `1px solid ${brandColor}30`,
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        height: '100%',
                                        fontFamily: 'inherit'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.boxShadow = `0 10px 25px ${brandColor}30`;
                                            e.currentTarget.style.borderColor = brandColor;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                            e.currentTarget.style.borderColor = `${brandColor}30`;
                                        }}>
                                        <div className="vm-icon mb-2" style={{ fontSize: '36px', color: brandColor }}>
                                            <FontAwesomeIcon icon={faBullseye} />
                                        </div>
                                        <h5 className="mb-2" style={{ fontWeight: '700', color: brandColor, fontFamily: 'inherit', fontSize: '1.1rem' }}>Our Mission</h5>
                                        <p className="small text-muted mb-0" style={{ fontFamily: 'inherit', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                            To provide exceptional hospitality experiences while preserving nature and empowering local communities.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="vm-card text-center p-3 rounded-3" style={{
                                        backgroundColor: '#fcfcfc',
                                        border: `1px solid ${brandColor}30`,
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        height: '100%',
                                        fontFamily: 'inherit'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.boxShadow = `0 10px 25px ${brandColor}30`;
                                            e.currentTarget.style.borderColor = brandColor;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                            e.currentTarget.style.borderColor = `${brandColor}30`;
                                        }}>
                                        <div className="vm-icon mb-2" style={{ fontSize: '36px', color: brandColor }}>
                                            <FontAwesomeIcon icon={faStar} />
                                        </div>
                                        <h5 className="mb-2" style={{ fontWeight: '700', color: brandColor, fontFamily: 'inherit', fontSize: '1.1rem' }}>Our Goal</h5>
                                        <p className="small text-muted mb-0" style={{ fontFamily: 'inherit', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                            To expand sustainably across Bangladesh, creating 1000+ jobs and becoming a model for responsible tourism.
                                        </p>
                                    </div>
                                </div>
                            </div>



                        </div>
                    </div>
                </div>
            </section>
            {/* ========== CEO SECTION ENDS HERE ========== */}



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
                
                .ceo-section {
                    animation: fadeIn 0.8s ease-out;
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
            `}</style>

            {/* Team Section - Dynamic from API */}
            {/* <section className="team-section-modern py-5">
                <div className="container">
                    <div className="team-header-modern text-center">

                        <div className="section-tag centered" style={{ color: brandColor }}>
                    
                            MEET OUR EXPERTS
                        </div>
                        <h2 className="team-title" style={{ fontFamily: 'inherit' }}>
                            The Passionate <span  style={{ color: brandColor }}>People Behind</span><br />
                            Your Perfect Stay
                        </h2>
                        <p className="team-subtitle" style={{ fontFamily: 'inherit', fontSize: '0.95rem' }}>
                            Akashbari is supported by a dedicated team focused on creating a calm, welcoming environment.
                            From daily operations to guest support, each role contributes to a smooth and thoughtful stay experience.
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status" style={{ color: brandColor }}>
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
                                style={{ backgroundColor: brandColor, borderColor: brandColor }}
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
                                                <a href={`mailto:${member.email || 'info@akashbari.com'}`} className="social-link" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: brandColor }}>
                                                    <FontAwesomeIcon icon={faEnvelope} />
                                                </a>
                                                <a href="#" className="social-link" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: brandColor }}>
                                                    <FontAwesomeIcon icon={faLinkedin} />
                                                </a>
                                                <a href="#" className="social-link" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: brandColor }}>
                                                    <FontAwesomeIcon icon={faTwitter} />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="team-info">
                                            <h3 className="team-member-name" style={{ fontFamily: 'inherit', color: brandColor }}>{member.name}</h3>
                                            <p className="team-member-role" style={{ fontFamily: 'inherit' }}>{member.designation}</p>
                                            <p className="team-member-bio" style={{ fontFamily: 'inherit' }}>{member.subtitle}</p>
                                            <div className="team-divider" style={{ backgroundColor: brandColor }}></div>

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
            </section> */}


            <section className="team-section-modern py-5">
    <div className="container">
        <div className="team-header-modern text-center">
            <div className="section-tag centered" style={{ color: brandColor }}>
                MEET OUR EXPERTS
            </div>
            <h2 className="team-title" style={{ fontFamily: 'inherit' }}>
                The Passionate <span style={{ color: brandColor }}>People Behind</span><br />
                Your Perfect Stay
            </h2>
            <p className="team-subtitle" style={{ fontFamily: 'inherit', fontSize: '0.95rem' }}>
                Akashbari is supported by a dedicated team focused on creating a calm, welcoming environment.
                From daily operations to guest support, each role contributes to a smooth and thoughtful stay experience.
            </p>
        </div>

        {loading ? (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" style={{ color: brandColor }}>
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
                    style={{ backgroundColor: brandColor, borderColor: brandColor }}
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
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain', // Shows full image without cropping
                                        objectPosition: 'center',
                                        backgroundColor: '#f8f9fa',
                                        display: 'block'
                                    }}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                    }}
                                />
                                <div className="team-social-overlay">
                                    <a href={`mailto:${member.email || 'info@akashbari.com'}`} className="social-link" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: brandColor }}>
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </a>
                                    <a href="#" className="social-link" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: brandColor }}>
                                        <FontAwesomeIcon icon={faLinkedin} />
                                    </a>
                                    <a href="#" className="social-link" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: brandColor }}>
                                        <FontAwesomeIcon icon={faTwitter} />
                                    </a>
                                </div>
                            </div>
                            <div className="team-info">
                                <h3 className="team-member-name" style={{ fontFamily: 'inherit', color: brandColor }}>{member.name}</h3>
                                <p className="team-member-role" style={{ fontFamily: 'inherit' }}>{member.designation}</p>
                                <p className="team-member-bio" style={{ fontFamily: 'inherit' }}>{member.subtitle}</p>
                                <div className="team-divider" style={{ backgroundColor: brandColor }}></div>
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

{/* Add this CSS to your stylesheet or in a <style> tag */}
<style>{`
    .team-grid-modern {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 30px;
        padding: 20px 0;
    }

    .team-card-modern {
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        background: #ffffff;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .team-card-modern:hover {
        transform: translateY(-8px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .team-card-inner {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .team-image-wrapper {
        position: relative;
        width: 100%;
        padding-top: 100%; /* 1:1 Square aspect ratio */
        overflow: hidden;
        background: #f8f9fa;
        flex-shrink: 0;
    }

    .team-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: contain; /* Shows full image without cropping */
        object-position: center;
        background-color: #f8f9fa;
        padding: 10px; /* Optional: Adds some breathing room */
    }

    /* Alternative: If you want the image to fill the container but show fully */
    /* Use this if you prefer the image to stretch to fill without cropping */
    /*
    .team-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }
    */

    .team-social-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        gap: 12px;
        padding: 15px;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
        opacity: 0;
        transition: opacity 0.3s ease;
        transform: translateY(10px);
        transition: all 0.3s ease;
    }

    .team-image-wrapper:hover .team-social-overlay {
        opacity: 1;
        transform: translateY(0);
    }

    .social-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        color: white !important;
        text-decoration: none;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .social-link:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }

    .team-info {
        padding: 20px 20px 25px;
        flex: 1;
        display: flex;
        flex-direction: column;
        background: #ffffff;
    }

    .team-member-name {
        font-size: 1.15rem;
        font-weight: 600;
        margin-bottom: 5px;
        letter-spacing: -0.01em;
    }

    .team-member-role {
        font-size: 0.85rem;
        color: #6c757d;
        margin-bottom: 8px;
        font-weight: 500;
    }

    .team-member-bio {
        font-size: 0.88rem;
        color: #495057;
        line-height: 1.6;
        margin-bottom: 12px;
        flex: 1;
    }

    .team-divider {
        width: 40px;
        height: 3px;
        border-radius: 2px;
        margin-top: auto;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .team-grid-modern {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 20px;
        }

        .team-image-wrapper {
            padding-top: 100%;
        }

        .team-info {
            padding: 16px 16px 20px;
        }

        .team-member-name {
            font-size: 1rem;
        }
    }

    @media (max-width: 480px) {
        .team-grid-modern {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
        }
    }
`}</style>

            <Footer />
        </>
    );
};

export default AboutUs;