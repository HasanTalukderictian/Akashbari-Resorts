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

// NEW DATA: Akashbari Resort Section Data (Only Text)
const akashbariSectionData = {
    sectionId: "akashbari-intro-section",
    badge: "WELCOME TO AKASHBARI",
    titleMain: "Experience Luxury At",
    titleGradient: "Akashbari Hotel & Resort",
    businessType: "Luxury Hospitality & Eco Resort",
    established: "2015",
    description: "Akashbari Hotel & Resort is a premier getaway destination blending nature with world-class hospitality. Designed for families, couples, and corporate events, we offer a tranquil environment away from the hustle of daily life.",
    facilities: [
        "Premium Eco Cottages & Suites",
        "Infinity Swimming Pool",
        "Multi-Cuisine Fine Dining Restaurant",
        "Guided Nature Trails & Kids Zone",
        "Corporate Conference Hall & Event Spaces"
    ],
    buttonText: "Book Your Stay",
    buttonLink: "/booking"
};

const aboutSectionData = {
    sectionId: "welcome-section",
    sectionTitle: "About Us",
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
    content: {
        badge: "ABOUT US",
        title: {
            main: "Where Luxury Meets",
            gradient: "Timeless Elegance"
        },
        description: "Welcome to Hotelux, where luxury meets comfort in the heart of Paris. Since 1999, we have been dedicated to providing an exceptional stay for our guests, blending modern amenities with timeless elegance.",
        stats: [
            { id: 1, number: "350+", label: "Luxury Rooms", icon: "🏨" },
            { id: 2, number: "24/7", label: "Concierge Service", icon: "🛎️" },
            { id: 3, number: "4.9", label: "Guest Rating", icon: "⭐" }
        ],
        features: [
            { id: 1, icon: "🍳", text: "Complimentary Breakfast", category: "dining" },
            { id: 2, icon: "🛁", text: "Whirlpool Jacuzzi Tub", category: "amenities" },
            { id: 3, icon: "🍷", text: "Private Wet Bar", category: "amenities" },
            { id: 4, icon: "🌊", text: "Ocean View Suites", category: "rooms" }
        ],
        button: {
            text: "Explore Our Story",
            link: "/our-story",
            target: "_self",
            variant: "primary"
        }
    }
};



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

const visionSectionData = {
    sectionId: "vision-section",
    badge: "OUR VISION",
    title: "Shaping the Future of",
    gradientText: "Luxury Hospitality",
    description: "At Akashbari Hotel & Resort, we envision a future where luxury and sustainability coexist harmoniously. Our vision is to create a sanctuary that not only provides exceptional comfort but also inspires a deeper connection with nature and community.",
    icon: "👁️",
    visionPoints: [
        {
            id: 1,
            icon: "🌿",
            title: "Sustainable Excellence",
            description: "Pioneering eco-friendly luxury that minimizes environmental impact while maximizing guest comfort and satisfaction.",
            color: "#10b981"
        },
        {
            id: 2,
            icon: "🤝",
            title: "Community First",
            description: "Empowering local communities through employment, cultural preservation, and responsible tourism initiatives.",
            color: "#3b82f6"
        },
        {
            id: 3,
            icon: "✨",
            title: "Innovation & Growth",
            description: "Continuously evolving our services and facilities to exceed global hospitality standards and guest expectations.",
            color: "#9a55ff"
        },
        {
            id: 4,
            icon: "❤️",
            title: "Guest Centricity",
            description: "Creating unforgettable memories through personalized experiences and genuine warm hospitality.",
            color: "#ef4444"
        }
    ],
    stats: [
        { value: "500+", label: "Happy Guests Daily", icon: "😊" },
        { value: "98%", label: "Guest Satisfaction", icon: "⭐" },
        { value: "15+", label: "Years of Excellence", icon: "🏆" },
        { value: "50+", label: "Awards Won", icon: "🎖️" }
    ]
};

const teamSectionData = {
    sectionId: "team-section",
    header: {
        icon: "",
        tag: "MEET OUR EXPERTS",
        title: "The Passionate",
        gradientText: "People Behind",
        subtitle: "Your Perfect Stay",
        description: "Akashbari is supported by a dedicated team focused on creating a calm, welcoming environment. From daily operations to guest support, each role contributes to a smooth and thoughtful stay experience."
    },
    teamMembers: [
        { id: 1, name: "Sofia Bennett", role: "General Manager", img: team1, bio: "15+ years of luxury hospitality experience", social: { linkedin: "#", twitter: "#", email: "sofia@hotelux.com" }, contactBadge: "📧 Book a Meeting" },
        { id: 2, name: "Daniel Wright", role: "Guest Experience Lead", img: team2, bio: "Creating unforgettable moments for every guest", social: { linkedin: "#", instagram: "#", email: "daniel@hotelux.com" }, contactBadge: "📧 Book a Meeting" },
        { id: 3, name: "Alex Morgan", role: "Operations Manager", img: team3, bio: "Ensuring seamless daily operations", social: { linkedin: "#", twitter: "#", email: "alex@hotelux.com" }, contactBadge: "📧 Book a Meeting" },
        { id: 4, name: "Emma Collins", role: "Events & Services Manager", img: team4, bio: "Crafting extraordinary events", social: { instagram: "#", linkedin: "#", email: "emma@hotelux.com" }, contactBadge: "📧 Book a Meeting" },
        { id: 5, name: "Liam Parker", role: "Hospitality Coordinator", img: team5, bio: "Making every guest feel at home", social: { twitter: "#", linkedin: "#", email: "liam@hotelux.com" }, contactBadge: "📧 Book a Meeting" },
        { id: 6, name: "Olivia Reed", role: "Front Desk Supervisor", img: team6, bio: "Your first friendly face at Akashbari", social: { instagram: "#", linkedin: "#", email: "olivia@hotelux.com" }, contactBadge: "📧 Book a Meeting" }
    ],

};

const AboutUs = () => {
    const [selectedImage, setSelectedImage] = useState(aboutSectionData.gallery.images[0].img);
    const [activeId, setActiveId] = useState(aboutSectionData.gallery.defaultImageId);

    const galleryImages = aboutSectionData.gallery.images;
    const contentData = aboutSectionData.content;
    const statsData = contentData.stats;
    const featuresData = contentData.features;

    const placesContent = placesSectionData.content;
    const placesList = placesSectionData.places;

    const teamHeader = teamSectionData.header;
    const teamMembers = teamSectionData.teamMembers;


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
                                <a href="/" className="text-white text-decoration-none small">Home</a>
                                <span className="separator mx-2 text-warning small">&gt;</span>
                                <span className="current-page text-white small">About</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW SECTION: Akashbari Hotel & Resort (Text on Left, Image on Right) */}
            <section id={akashbariSectionData.sectionId} className="akashbari-intro-section py-5" style={{ backgroundColor: '#fcfcfc' }}>
                <div className="container">
                    <div className="row align-items-center g-5">

                        {/* Left Side - Text Details */}
                        <div className="col-lg-6">
                            <div className="modern-content">
                                <div className="section-badge mb-3">
                                    <span className="badge-dot"></span>
                                    {akashbariSectionData.badge}
                                </div>

                                <h2 className="modern-title mb-4">
                                    {akashbariSectionData.titleMain}
                                    <span className="text-gradient"> {akashbariSectionData.titleGradient}</span>
                                </h2>

                                {/* Business Info Details */}
                                <div className="p-3 mb-4 rounded-3 bg-white shadow-sm border-start border-4 border-warning">
                                    <p className="mb-2"><strong>Business Type:</strong> {akashbariSectionData.businessType}</p>
                                    <p className="mb-0"><strong>Established Since:</strong> {akashbariSectionData.established}</p>
                                </div>

                                <p className="modern-description text-muted mb-4">
                                    {akashbariSectionData.description}
                                </p>

                                {/* Facilities List */}
                                <h4 className="serif mb-3" style={{ fontSize: '1.3rem', fontWeight: '600' }}>Our Premium Facilities:</h4>
                                <ul className="list-unstyled mb-4">
                                    {akashbariSectionData.facilities.map((facility, index) => (
                                        <li className="mb-2 text-secondary" key={index} style={{ fontSize: '1.05rem' }}>
                                            • {facility}
                                        </li>
                                    ))}
                                </ul>

                                <button className="explore-btn" onClick={() => window.location.href = akashbariSectionData.buttonLink}>
                                    {akashbariSectionData.buttonText}
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

            {/* Section 2: Welcome Section with Gallery */}

            <section id={visionSectionData.sectionId} className="vision-section py-5" style={{ backgroundColor: '#ffffff' }}>
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
                            <span style={{ fontSize: '18px' }}>{visionSectionData.icon}</span>
                            {visionSectionData.badge}
                        </div>
                        <h2 className="modern-title mb-3">
                            {visionSectionData.title}
                            <span className="text-gradient"> {visionSectionData.gradientText}</span>
                        </h2>
                        <p className="vision-description text-muted mx-auto" style={{ maxWidth: '700px', fontSize: '1.1rem', lineHeight: '1.6' }}>
                            {visionSectionData.description}
                        </p>
                    </div>

                    {/* Vision Points Grid */}
                    <div className="row g-4 mb-5">
                        {visionSectionData.visionPoints.map((point) => (
                            <div className="col-md-6 col-lg-3" key={point.id}>
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
                                        background: `linear-gradient(135deg, ${point.color}15 0%, ${point.color}05 100%)`,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <span style={{ fontSize: '32px' }}>{point.icon}</span>
                                    </div>
                                    <h4 className="vision-point-title mb-3" style={{ fontSize: '1.2rem', fontWeight: '700', color: '#2c3e50' }}>
                                        {point.title}
                                    </h4>
                                    <p className="vision-point-description text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                                        {point.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Vision Stats Row */}
                    <div className="vision-stats-wrapper mt-4 p-4 rounded-4" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '20px'
                    }}>
                        <div className="row text-center">
                            {visionSectionData.stats.map((stat, index) => (
                                <div className="col-md-3 col-6 mb-3 mb-md-0" key={index}>
                                    <div className="stat-item">
                                        <div className="stat-icon mb-2">
                                            <span style={{ fontSize: '32px' }}>{stat.icon}</span>
                                        </div>
                                        <h3 className="stat-value text-white mb-1" style={{ fontSize: '2rem', fontWeight: '700' }}>
                                            {stat.value}
                                        </h3>
                                        <p className="stat-label text-white-50 mb-0" style={{ fontSize: '0.9rem' }}>
                                            {stat.label}
                                        </p>
                                    </div>
                                </div>
                            ))}
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


            {/* Section 5: Team Section */}
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


                </div>
            </section>



            <Footer />
        </>
    );
};

export default AboutUs;