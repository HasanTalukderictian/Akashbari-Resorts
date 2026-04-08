import React, { useState } from 'react';
import Header from './Common/Header';
import Footer from './Common/Footer';
import '../css/about.css';

// ইমেজের পাথগুলো আপনার প্রজেক্ট অনুযায়ী ইমপোর্ট করুন
import king1 from '../image/King-room1.jpg';
import king2 from '../image/King-room2.jpg';
import king3 from '../image/King-room13.jpg';
import king4 from '../image/King-room4.jpg';
import king5 from '../image/king5.jpg';

const AboutUs = () => {
    // ইমেজ রিপ্লেস করার জন্য স্টেট
    const [selectedImage, setSelectedImage] = useState(king1);


    const [activeId, setActiveId] = useState(1);

    const galleryData = [
        { id: 1, img: king1, title: "King Room" },
        { id: 2, img: king2, title: "Suits Room" },
        { id: 3, img: king3, title: "Lake View" },
        { id: 4, img: king4, title: "City View" },
        { id: 5, img: king5, title: "Family Room" },
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

            {/* Section 2: Welcome Section */}
            <section className="welcome-section py-5">
                <div className="container">
                    <div className="row align-items-center">

                        {/* বাম পাশ: ইমেজ রিপ্লেসমেন্ট গ্যালারি */}
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <div className="main-image-wrapper position-relative">
                                <img src={selectedImage} alt="Main Room" className="img-fluid main-img" />
                                <div className="image-accent"></div>
                            </div>

                            <div className="gallery-row d-flex gap-2 mt-3">
                                {galleryData.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`gallery-item ${activeId === item.id ? 'active-thumb' : ''}`}
                                        onClick={() => {
                                            console.log(item.img);
                                            setSelectedImage(item.img);
                                            
                                            setActiveId(item.id);
                                        }}
                                    >
                                        <img src={item.img} alt={item.title} />
                                        <p>{item.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ডান পাশ: টেক্সট এবং ফিচার */}
                        <div className="col-lg-6 ps-lg-5">
                            <h6 className="text-gold text-uppercase ls-2">About Us</h6>
                            <h2 className="display-6 serif mb-4 mt-2">
                                Welcome To Our Best luxury stay in <span className="text-gold">the city.</span>
                            </h2>
                            <p className="text-muted mb-4">
                                Welcome to Hotelux, where luxury meets comfort in the heart of Paris. Since 1999, we
                                have been dedicated to providing an exceptional stay for our guests, blending modern
                                amenities with timeless elegance.
                            </p>

                            <div className="row features-grid g-4">
                                <div className="col-md-6">
                                    <div className="feature-box d-flex align-items-center border p-3">
                                        <span className="me-3">⭐</span>
                                        <span className="fw-bold small">350 Best Rooms 5 Star</span>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="feature-box d-flex align-items-center border p-3">
                                        <span className="me-3">☕</span>
                                        <span className="fw-bold small">Breakfast each morning</span>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="feature-box d-flex align-items-center border p-3">
                                        <span className="me-3">🛀</span>
                                        <span className="fw-bold small">Double Whirlpool Jacuzzi Tub</span>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="feature-box d-flex align-items-center border p-3">
                                        <span className="me-3">🍷</span>
                                        <span className="fw-bold small">Wet Bar with Refrigerator</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default AboutUs;