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

// ============================================
// SECTION 2: JSON CONFIGURATION DATA
// ============================================

const aboutSectionData = {
    // Section Metadata
    sectionId: "welcome-section",
    sectionTitle: "About Us",
    
    // Gallery Images Configuration
    gallery: {
        images: [
            { id: 1, img: king1, title: "King Room", alt: "Luxury king room with modern amenities" },
            { id: 2, img: king2, title: "Suits Room", alt: "Elegant suite with separate living area" },
            { id: 3, img: king3, title: "Lake View", alt: "Scenic lake view from premium rooms" },
            { id: 4, img: king4, title: "City View", alt: "Panoramic city skyline view" },
            { id: 5, img: king5, title: "Family Room", alt: "Spacious family suite with kids area" }
        ],
        defaultImageId: 1,
        floatingBadge: {
            text: "Luxury Since 1999",
            icon: "✨"
        }
    },
    
    // Content Configuration
    content: {
        badge: "ABOUT US",
        title: {
            main: "Where Luxury Meets",
            gradient: "Timeless Elegance"
        },
        description: "Welcome to Hotelux, where luxury meets comfort in the heart of Paris. Since 1999, we have been dedicated to providing an exceptional stay for our guests, blending modern amenities with timeless elegance.",
        
        // Stats Cards
        stats: [
            { 
                id: 1, 
                number: "350+", 
                label: "Luxury Rooms",
                icon: "🏨"
            },
            { 
                id: 2, 
                number: "24/7", 
                label: "Concierge Service",
                icon: "🛎️"
            },
            { 
                id: 3, 
                number: "4.9", 
                label: "Guest Rating",
                icon: "⭐"
            }
        ],
        
        // Features List
        features: [
            { id: 1, icon: "🍳", text: "Complimentary Breakfast", category: "dining" },
            { id: 2, icon: "🛁", text: "Whirlpool Jacuzzi Tub", category: "amenities" },
            { id: 3, icon: "🍷", text: "Private Wet Bar", category: "amenities" },
            { id: 4, icon: "🌊", text: "Ocean View Suites", category: "rooms" }
        ],
        
        // Button Configuration
        button: {
            text: "Explore Our Story",
            link: "/our-story",
            target: "_self",
            variant: "primary"
        }
    },
    
    // API Endpoints (for backend integration)
    endpoints: {
        getContent: "/api/about/content",
        updateContent: "/api/about/content/update",
        uploadImage: "/api/about/gallery/upload",
        deleteImage: "/api/about/gallery/delete"
    }
};

// Separate JSON for facilities section data
const facilitiesSectionData = {
    sectionId: "facilities-section",
    header: {
        badge: "PREMIUM AMENITIES",
        title: "World-Class",
        gradientText: "Facilities",
        subtitle: "Experience unparalleled luxury with our carefully curated amenities"
    },
    facilities: [
        { id: 1, title: "Airport Taxi", img: img1, icon: "🚕", description: "24/7 airport pickup & drop service", link: "/services/airport-taxi" },
        { id: 2, title: "Swimming Pool", img: img2, icon: "🏊", description: "Infinity pool with ocean view", link: "/services/pool" },
        { id: 3, title: "Spa Center", img: img3, icon: "🧖‍♀️", description: "Traditional & modern therapies", link: "/services/spa" },
        { id: 4, title: "Fitness Center", img: img4, icon: "🏋️‍♂️", description: "State-of-the-art equipment", link: "/services/gym" },
        { id: 5, title: "Indoor Games", img: img5, icon: "🎮", description: "Recreation & gaming zone", link: "/services/games" }
    ],
    endpoints: {
        getFacilities: "/api/facilities",
        updateFacility: "/api/facilities/update"
    }
};

// Section 4 Places Data
const placesSectionData = {
    sectionId: "places-section",
    content: {
        tag: "EXPLORE DESTINATIONS",
        title: "Places Around",
        gradientText: "The Hotel",
        description: "Discover the most breathtaking locations near our hotel. From pristine beaches to ancient architecture, experience the best of what the city has to offer this summer.",
        stats: [
            { number: "12+", label: "Popular Spots" },
            { number: "30min", label: "Average Distance" },
            { number: "24/7", label: "Tour Support" }
        ],
        button: {
            text: "Discover All Places",
            link: "/destinations"
        }
    },
    places: [
        { id: 1, img: image1, title: "Coastal Paradise", icon: "🏖️", category: "beach" },
        { id: 2, img: image2, title: "Cultural Tours", icon: "🏛️", category: "culture" },
        { id: 3, img: image3, title: "Mountain Views", icon: "⛰️", category: "nature" },
        { id: 4, img: img4, title: "Heritage Sites", icon: "🏰", category: "historical" }
    ]
};

// Section 5 Team Data
const teamSectionData = {
    sectionId: "team-section",
    header: {
        icon: "👥",
        tag: "MEET OUR EXPERTS",
        title: "The Passionate",
        gradientText: "People Behind",
        subtitle: "Your Perfect Stay",
        description: "Akashbari is supported by a dedicated team focused on creating a calm, welcoming environment. From daily operations to guest support, each role contributes to a smooth and thoughtful stay experience."
    },
    teamMembers: [
        { 
            id: 1,
            name: "Sofia Bennett", 
            role: "General Manager", 
            img: team1,
            bio: "15+ years of luxury hospitality experience",
            social: { linkedin: "#", twitter: "#", email: "sofia@hotelux.com" },
            contactBadge: "📧 Book a Meeting"
        },
        { 
            id: 2,
            name: "Daniel Wright", 
            role: "Guest Experience Lead", 
            img: team2,
            bio: "Creating unforgettable moments for every guest",
            social: { linkedin: "#", instagram: "#", email: "daniel@hotelux.com" },
            contactBadge: "📧 Book a Meeting"
        },
        { 
            id: 3,
            name: "Alex Morgan", 
            role: "Operations Manager", 
            img: team3,
            bio: "Ensuring seamless daily operations",
            social: { linkedin: "#", twitter: "#", email: "alex@hotelux.com" },
            contactBadge: "📧 Book a Meeting"
        },
        { 
            id: 4,
            name: "Emma Collins", 
            role: "Events & Services Manager", 
            img: team4,
            bio: "Crafting extraordinary events",
            social: { instagram: "#", linkedin: "#", email: "emma@hotelux.com" },
            contactBadge: "📧 Book a Meeting"
        },
        { 
            id: 5,
            name: "Liam Parker", 
            role: "Hospitality Coordinator", 
            img: team5,
            bio: "Making every guest feel at home",
            social: { twitter: "#", linkedin: "#", email: "liam@hotelux.com" },
            contactBadge: "📧 Book a Meeting"
        },
        { 
            id: 6,
            name: "Olivia Reed", 
            role: "Front Desk Supervisor", 
            img: team6,
            bio: "Your first friendly face at Akashbari",
            social: { instagram: "#", linkedin: "#", email: "olivia@hotelux.com" },
            contactBadge: "📧 Book a Meeting"
        }
    ],
    cta: {
        icon: "🌟",
        title: "Join Our Amazing Team",
        description: "We're always looking for passionate people to join our family",
        buttonText: "View Open Positions",
        buttonLink: "/careers"
    },
    endpoints: {
        getTeam: "/api/team",
        updateTeam: "/api/team/update"
    }
};

const AboutUs = () => {
    // State from JSON config
    const [selectedImage, setSelectedImage] = useState(aboutSectionData.gallery.images[0].img);
    const [activeId, setActiveId] = useState(aboutSectionData.gallery.defaultImageId);
    
    // Extract data from config
    const galleryImages = aboutSectionData.gallery.images;
    const contentData = aboutSectionData.content;
    const statsData = contentData.stats;
    const featuresData = contentData.features;
    
    // Facilities data
    const facilitiesList = facilitiesSectionData.facilities;
    const facilitiesHeader = facilitiesSectionData.header;
    
    // Places data
    const placesContent = placesSectionData.content;
    const placesList = placesSectionData.places;
    
    // Team data
    const teamHeader = teamSectionData.header;
    const teamMembers = teamSectionData.teamMembers;
    const teamCTA = teamSectionData.cta;

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

            {/* Section 2: Welcome Section - Using JSON Data */}
            <section className="welcome-section-modern py-5">
                <div className="container">
                    <div className="row align-items-center g-5">
                        {/* Left Side - Image Gallery */}
                        <div className="col-lg-6">
                            <div className="modern-gallery-wrapper">
                                <div className="main-image-container">
                                    <img src={selectedImage} alt="Luxury Room" className="main-image-modern" />
                                    <div className="floating-badge">
                                        <span className="badge-icon">{aboutSectionData.gallery.floatingBadge.icon}</span>
                                        <span>{aboutSectionData.gallery.floatingBadge.text}</span>
                                    </div>
                                    <div className="image-overlay-gradient"></div>
                                </div>
                                
                                <div className="thumbnail-strip">
                                    {galleryImages.map((item) => (
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

                        {/* Right Side - Content from JSON */}
                        <div className="col-lg-6">
                            <div className="modern-content">
                                <div className="section-badge">
                                    <span className="badge-dot"></span>
                                    {contentData.badge}
                                </div>
                                <h2 className="modern-title">
                                    {contentData.title.main}
                                    <span className="text-gradient"> {contentData.title.gradient}</span>
                                </h2>
                                <p className="modern-description">
                                    {contentData.description}
                                </p>

                                <div className="stats-grid">
                                    {statsData.map((stat) => (
                                        <div className="stat-card" key={stat.id}>
                                            <div className="stat-number">{stat.number}</div>
                                            <div className="stat-label">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="feature-list-modern">
                                    {featuresData.map((feature) => (
                                        <div className="feature-item" key={feature.id}>
                                            <div className="feature-icon">{feature.icon}</div>
                                            <div className="feature-text">{feature.text}</div>
                                        </div>
                                    ))}
                                </div>

                                <button className="explore-btn" onClick={() => window.location.href = contentData.button.link}>
                                    {contentData.button.text}
                                    <svg className="btn-arrow" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Facilities - Using JSON Data */}
            <section className="facilities-modern py-5">
                <div className="container">
                    <div className="section-header-modern text-center">
                        <div className="header-badge">{facilitiesHeader.badge}</div>
                        <h2 className="header-title">
                            {facilitiesHeader.title} 
                            <span className="text-gradient"> {facilitiesHeader.gradientText}</span>
                        </h2>
                        <p className="header-subtitle">{facilitiesHeader.subtitle}</p>
                    </div>

                    <div className="facilities-grid">
                        {facilitiesList.map((item) => (
                            <div className="facility-card-modern" key={item.id}>
                                <div className="card-bg"></div>
                                <div className="card-content">
                                    <div className="icon-wrapper">
                                        <span className="facility-icon">{item.icon}</span>
                                    </div>
                                    <h3 className="facility-title">{item.title}</h3>
                                    <p className="facility-description">{item.description}</p>
                                    <div className="card-hover-effect">
                                        <button className="learn-more" onClick={() => window.location.href = item.link}>
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

            {/* Section 4: Places Section - Using JSON Data */}
            <section className="places-section-modern py-5">
                <div className="container">
                    <div className="places-wrapper">
                        <div className="places-content">
                            <div className="section-tag">
                                <span className="tag-line"></span>
                                {placesContent.tag}
                            </div>
                            <h2 className="places-title">
                                {placesContent.title} 
                                <span className="text-gradient"> {placesContent.gradientText}</span>
                            </h2>
                            <p className="places-description">{placesContent.description}</p>
                            
                            <div className="destination-stats">
                                {placesContent.stats.map((stat, idx) => (
                                    <div className="dest-stat" key={idx}>
                                        <div className="dest-stat-number">{stat.number}</div>
                                        <div className="dest-stat-label">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                            
                            <button className="explore-places-btn" onClick={() => window.location.href = placesContent.button.link}>
                                {placesContent.button.text}
                                <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>

                        <div className="places-grid-modern">
                            {placesList.map((place) => (
                                <div key={place.id} className={`grid-item grid-item-${place.id}`}>
                                    <div className="grid-image-wrapper">
                                        <img src={place.img} alt={place.title} />
                                        <div className="image-overlay">
                                            <div className="image-caption">
                                                <span className="caption-icon">{place.icon}</span>
                                                <span>{place.title}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 5: Team Section - Using JSON Data */}
            <section className="team-section-modern py-5">
                <div className="container">
                    <div className="team-header-modern text-center">
                        <div className="header-icon-wrapper">
                            <span className="header-icon">{teamHeader.icon}</span>
                        </div>
                        <div className="section-tag centered">
                            <span className="tag-dot"></span>
                            {teamHeader.tag}
                        </div>
                        <h2 className="team-title">
                            {teamHeader.title} <span className="text-gradient">{teamHeader.gradientText}</span><br />
                            {teamHeader.subtitle}
                        </h2>
                        <p className="team-subtitle">{teamHeader.description}</p>
                    </div>

                    <div className="team-grid-modern">
                        {teamMembers.map((member) => (
                            <div className="team-card-modern" key={member.id}>
                                <div className="team-card-inner">
                                    <div className="team-image-wrapper">
                                        <img src={member.img} alt={member.name} className="team-image" />
                                        <div className="team-social-overlay">
                                            {Object.keys(member.social).map((social, idx) => (
                                                <a key={idx} href={member.social[social]} className="social-link" target="_blank" rel="noopener noreferrer">
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
                                            <span>{member.contactBadge}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="team-cta">
                        <div className="cta-content">
                            <span className="cta-icon">{teamCTA.icon}</span>
                            <h4>{teamCTA.title}</h4>
                            <p>{teamCTA.description}</p>
                            <button className="join-team-btn" onClick={() => window.location.href = teamCTA.buttonLink}>
                                {teamCTA.buttonText}
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