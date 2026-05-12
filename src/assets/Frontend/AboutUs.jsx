import React, { useState } from 'react';
import Header from './Common/Header';
import Footer from './Common/Footer';
import '../css/about.css';

// Import images
import king1 from '../image/King-room1.jpg';
import king2 from '../image/King-room2.jpg';
import king3 from '../image/King-room13.jpg';
import king4 from '../image/King-room4.jpg';
import king5 from '../image/king5.jpg';
import img1 from '../image/facility1.jpg';
import img2 from '../image/facility2.jpg';
import img3 from '../image/facility3.jpg';
import img4 from '../image/facility4.jpg';
import img5 from '../image/facility5.jpg';
import image1 from '../image/place-1-1.jpg';
import image2 from '../image/place-1-3.jpg';
import image3 from '../image/place-1-2.jpg';
import team1 from '../image/section/Orrivaa-Team-1.webp';
import team2 from '../image/section/Orrivaa-Team-2.webp';
import team3 from '../image/section/Orrivaa-Team-3.webp';
import team4 from '../image/section/Orrivaa-Team-4.webp';
import team5 from '../image/section/Orrivaa-Team-5.webp';
import team6 from '../image/section/Orrivaa-Team-6.webp';

const AboutUs = () => {
    const [selectedImage, setSelectedImage] = useState(king1);
    const [activeId, setActiveId] = useState(1);

    const galleryData = [
        { id: 1, img: king1, title: "King Room" },
        { id: 2, img: king2, title: "Suits Room" },
        { id: 3, img: king3, title: "Lake View" },
        { id: 4, img: king4, title: "City View" },
        { id: 5, img: king5, title: "Family Room" },
    ];

    const facilities = [
        { id: 1, title: "Airport Taxi", img: img1, icon: "🚕" },
        { id: 2, title: "Swimming Pool", img: img2, icon: "🏊" },
        { id: 3, title: "Spa Center", img: img3, icon: "🧖‍♀️" },
        { id: 4, title: "Fitness Center", img: img4, icon: "🏋️‍♂️" },
        { id: 5, title: "Indoor Games", img: img5, icon: "🎮" },
    ];

    return (
        <>
            <Header />

            {/* Section 1: Banner */}
            <section className="about-banner text-center d-flex flex-column justify-content-center">
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-white">
                            <h1 className="banner-title serif mb-2">About</h1>
                            <div className="breadcrumb-wrapper">
                                <a href="/" className="text-white text-decoration-none small">Home</a>
                                <span className="separator mx-2 text-warning small">&gt;</span>
                                <span className="current-page text-white small">About</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Welcome Section - Modern Redesign */}
<section className="welcome-section-modern py-5">
    <div className="container">
        <div className="row align-items-center g-5">
            {/* Left Side - Image Gallery Modern */}
            <div className="col-lg-6">
                <div className="modern-gallery-wrapper">
                    <div className="main-image-container">
                        <img src={selectedImage} alt="Luxury Room" className="main-image-modern" />
                        <div className="floating-badge">
                            <span className="badge-icon">✨</span>
                            <span>Luxury Since 1999</span>
                        </div>
                        <div className="image-overlay-gradient"></div>
                    </div>
                    
                    <div className="thumbnail-strip">
                        {galleryData.map((item) => (
                            <div
                                key={item.id}
                                className={`thumbnail-item ${activeId === item.id ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedImage(item.img);
                                    setActiveId(item.id);
                                }}
                            >
                                <img src={item.img} alt={item.title} />
                                <div className="thumbnail-label">{item.title}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Content Modern */}
            <div className="col-lg-6">
                <div className="modern-content">
                    <div className="section-badge">
                        <span className="badge-dot"></span>
                        ABOUT US
                    </div>
                    <h2 className="modern-title">
                        Where Luxury Meets
                        <span className="text-gradient"> Timeless Elegance</span>
                    </h2>
                    <p className="modern-description">
                        Welcome to Hotelux, where luxury meets comfort in the heart of Paris. 
                        Since 1999, we have been dedicated to providing an exceptional stay 
                        for our guests, blending modern amenities with timeless elegance.
                    </p>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">350+</div>
                            <div className="stat-label">Luxury Rooms</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">24/7</div>
                            <div className="stat-label">Concierge Service</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">4.9</div>
                            <div className="stat-label">Guest Rating</div>
                        </div>
                    </div>

                    <div className="feature-list-modern">
                        <div className="feature-item">
                            <div className="feature-icon">🍳</div>
                            <div className="feature-text">Complimentary Breakfast</div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">🛁</div>
                            <div className="feature-text">Whirlpool Jacuzzi Tub</div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">🍷</div>
                            <div className="feature-text">Private Wet Bar</div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">🌊</div>
                            <div className="feature-text">Ocean View Suites</div>
                        </div>
                    </div>

                    <button className="explore-btn">
                        Explore Our Story
                        <svg className="btn-arrow" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</section>

{/* Section 3: Facilities - Modern Modern Redesign */}
<section className="facilities-modern py-5">
    <div className="container">
        <div className="section-header-modern text-center">
            <div className="header-badge">PREMIUM AMENITIES</div>
            <h2 className="header-title">World-Class <span className="text-gradient">Facilities</span></h2>
            <p className="header-subtitle">
                Experience unparalleled luxury with our carefully curated amenities
            </p>
        </div>

        <div className="facilities-grid">
            {facilities.map((item, index) => (
                <div className="facility-card-modern" key={item.id}>
                    <div className="card-bg"></div>
                    <div className="card-content">
                        <div className="icon-wrapper">
                            <span className="facility-icon">{item.icon}</span>
                        </div>
                        <h3 className="facility-title">{item.title}</h3>
                        <p className="facility-description">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </p>
                        <div className="card-hover-effect">
                            <button className="learn-more">
                                Learn More
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="card-image" style={{backgroundImage: `url(${item.img})`}}></div>
                </div>
            ))}
        </div>
    </div>
</section>

         {/* Section 4: Places Section - Modern Redesign */}
<section className="places-section-modern py-5">
    <div className="container">
        <div className="places-wrapper">
            {/* Left Side - Content */}
            <div className="places-content">
                <div className="section-tag">
                    <span className="tag-line"></span>
                    EXPLORE DESTINATIONS
                </div>
                <h2 className="places-title">
                    Places Around <span className="text-gradient">The Hotel</span>
                </h2>
                <p className="places-description">
                    Discover the most breathtaking locations near our hotel. 
                    From pristine beaches to ancient architecture, experience 
                    the best of what the city has to offer this summer.
                </p>
                
                <div className="destination-stats">
                    <div className="dest-stat">
                        <div className="dest-stat-number">12+</div>
                        <div className="dest-stat-label">Popular Spots</div>
                    </div>
                    <div className="dest-stat">
                        <div className="dest-stat-number">30min</div>
                        <div className="dest-stat-label">Average Distance</div>
                    </div>
                    <div className="dest-stat">
                        <div className="dest-stat-number">24/7</div>
                        <div className="dest-stat-label">Tour Support</div>
                    </div>
                </div>
                
                <button className="explore-places-btn">
                    Discover All Places
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </button>
            </div>

            {/* Right Side - Image Grid Modern */}
            <div className="places-grid-modern">
                <div className="grid-item grid-item-1">
                    <div className="grid-image-wrapper">
                        <img src={image1} alt="Coastal Paradise" />
                        <div className="image-overlay">
                            <div className="image-caption">
                                <span className="caption-icon">🏖️</span>
                                <span>Coastal Paradise</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid-item grid-item-2">
                    <div className="grid-image-wrapper">
                        <img src={image2} alt="Cultural Tours" />
                        <div className="image-overlay">
                            <div className="image-caption">
                                <span className="caption-icon">🏛️</span>
                                <span>Cultural Tours</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid-item grid-item-3">
                    <div className="grid-image-wrapper">
                        <img src={image3} alt="Mountain Views" />
                        <div className="image-overlay">
                            <div className="image-caption">
                                <span className="caption-icon">⛰️</span>
                                <span>Mountain Views</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid-item grid-item-4">
                    <div className="grid-image-wrapper">
                        <img src={img4} alt="Ancient Architecture" />
                        <div className="image-overlay">
                            <div className="image-caption">
                                <span className="caption-icon">🏰</span>
                                <span>Heritage Sites</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

{/* Section 5: Team Section - Modern Redesign */}
<section className="team-section-modern py-5">
    <div className="container">
        {/* Section Header */}
        <div className="team-header-modern text-center">
            <div className="header-icon-wrapper">
                <span className="header-icon">👥</span>
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

        {/* Team Grid */}
        <div className="team-grid-modern">
            {[
                { 
                    name: "Sofia Bennett", 
                    role: "General Manager", 
                    img: team1,
                    bio: "15+ years of luxury hospitality experience",
                    social: ["linkedin", "twitter", "email"]
                },
                { 
                    name: "Daniel Wright", 
                    role: "Guest Experience Lead", 
                    img: team2,
                    bio: "Creating unforgettable moments for every guest",
                    social: ["linkedin", "instagram", "email"]
                },
                { 
                    name: "Alex Morgan", 
                    role: "Operations Manager", 
                    img: team3,
                    bio: "Ensuring seamless daily operations",
                    social: ["linkedin", "twitter", "email"]
                },
                { 
                    name: "Emma Collins", 
                    role: "Events & Services Manager", 
                    img: team4,
                    bio: "Crafting extraordinary events",
                    social: ["instagram", "linkedin", "email"]
                },
                { 
                    name: "Liam Parker", 
                    role: "Hospitality Coordinator", 
                    img: team5,
                    bio: "Making every guest feel at home",
                    social: ["twitter", "linkedin", "email"]
                },
                { 
                    name: "Olivia Reed", 
                    role: "Front Desk Supervisor", 
                    img: team6,
                    bio: "Your first friendly face at Akashbari",
                    social: ["instagram", "linkedin", "email"]
                },
            ].map((member, index) => (
                <div className="team-card-modern" key={index}>
                    <div className="team-card-inner">
                        <div className="team-image-wrapper">
                            <img src={member.img} alt={member.name} className="team-image" />
                            <div className="team-social-overlay">
                                {member.social.map((social, idx) => (
                                    <a key={idx} href="#" className="social-link">
                                        <i className={`bi bi-${social}`}></i>
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="team-info">
                            <h3 className="team-member-name">{member.name}</h3>
                            <p className="team-member-role">{member.role}</p>
                            <p className="team-member-bio">{member.bio}</p>
                            <div className="team-divider"></div>
                            <div className="team-contact-badge">
                                <span>📧 Book a Meeting</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Join CTA */}
        <div className="team-cta">
            <div className="cta-content">
                <span className="cta-icon">🌟</span>
                <h4>Join Our Amazing Team</h4>
                <p>We're always looking for passionate people to join our family</p>
                <button className="join-team-btn">
                    View Open Positions
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</section>

            <Footer />
        </>
    );
};

export default AboutUs;