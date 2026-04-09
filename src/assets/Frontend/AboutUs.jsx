import React, { useState } from 'react';
import Header from './Common/Header';
import Footer from './Common/Footer';
import '../css/about.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import "swiper/css";
import "swiper/css/pagination";

// ইমেজের পাথগুলো আপনার প্রজেক্ট অনুযায়ী ইমপোর্ট করুন
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


// 4th section image


import image1 from '../image/place-1-1.jpg';
import image2 from '../image/place-1-3.jpg';
import image3 from '../image/place-1-2.jpg';



import team1 from '../image/section/Orrivaa-Team-1.webp';
import team2 from '../image/section//Orrivaa-Team-2.webp';
import team3 from '../image/section/Orrivaa-Team-3.webp';
import team4 from '../image/section/Orrivaa-Team-4.webp';
import team5 from '../image/section/Orrivaa-Team-5.webp';
import team6 from '../image/section/Orrivaa-Team-6.webp';


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





    const facilities = [
        { id: 1, title: "Airport Taxi", img: img1, icon: "🚕" },
        { id: 2, title: "Swimming Pool", img: img2, icon: "🏊" },
        { id: 3, title: "Spa Center", img: img3, icon: "🧖‍♀️" },
        { id: 4, title: "Fitness Center", img: img4, icon: "🏋️‍♂️" },
        { id: 5, title: "Indoor Games", img: img5, icon: "🎮" }, // উদাহরণের জন্য ডুপ্লিকেট
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

            {/* 3rd Section */}

            <section className="facility-slider-section py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <span className="text-gold text-uppercase ls-2 small fw-bold">Facilities</span>
                        <h2 className="serif display-6 mt-2">Our Hotelux <span className="text-muted">Facilities</span></h2>
                    </div>

                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        loop={true} // বৃত্তাকার মুভিং (Circular)
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}

                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 4 },
                        }}
                        className="facility-swiper"
                    >
                        {facilities.map((item) => (
                            <SwiperSlide key={item.id}>
                                <div className="facility-card shadow-sm bg-white">
                                    <div className="facility-img-wrapper position-relative">
                                        <img src={item.img} alt={item.title} className="img-fluid" />
                                        {/* গোল আইকন হোল্ডার */}
                                        <div className="facility-icon-circle">
                                            <span className="fs-4">{item.icon}</span>
                                        </div>
                                    </div>
                                    <div className="facility-content text-center p-2">
                                        <h4 className="serif mb-3">{item.title}</h4>
                                        <p className="text-muted small">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        </p>
                                        <button className="read-more-btn mt-3 py-1 px-2">Read More</button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            {/* 4th section */}
            {/* 4th Section: Places Around The Hotel */}
            <section className="places-section py-3">
                <div className="container">
                    <div className="row g-4">
                        {/* বাম পাশের টেক্সট কন্টেন্ট */}
                        <div className="col-lg-4 d-flex flex-column justify-content-center">
                            <div className="section-title-wrapper">
                                <span className="text-gold text-uppercase ls-2 small fw-bold">See Place</span>
                                <h3 className="serif display-6 mt-2 mb-4">
                                    Places Around The Hotel <br />
                                    <span className="text-muted">To Visit This Summer </span>

                                </h3>
                                <button className="view-more-btn">View More</button>
                            </div>
                        </div>

                        {/* ডান পাশের গ্রিড গ্যালারি */}
                        <div className="col-lg-8">
                            <div className="row g-3">
                                {/* উপরের ছোট দুটি ইমেজ */}
                                <div className="col-md-7">
                                    <div className="place-img-box h-100">
                                        <img src={image1} alt="Coastal View" className="img-fluid" />
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="place-img-box h-100">
                                        <img src={image2} alt="Traveler" className="img-fluid" />
                                    </div>
                                </div>
                                {/* নিচের বড় দুটি ইমেজ */}
                                <div className="col-md-5">
                                    <div className="place-img-box h-100">
                                        <img src={image3} alt="Promenade" className="img-fluid" />
                                    </div>
                                </div>
                                <div className="col-md-7">
                                    <div className="place-img-box h-100">
                                        <img src={img4} alt="Ancient Architecture" className="img-fluid" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5th Section */}
            {/* 5th Section: Our Team */}
            <section className="team-section py-5">
                <div className="container text-center">
                    <div className="team-header mb-5">
                        <span className="text-gold text-uppercase ls-2 small fw-bold">Our Team</span>
                        <h2 className="serif display-6 mt-2">The People <span className="text-italic">Behind Akashbari Resort</span></h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
                            Akashbari is supported by a dedicated team focused on creating a calm, welcoming environment.
                            From daily operations to guest support, each role contributes to a smooth and thoughtful stay experience.
                        </p>
                    </div>

                    <div className="row g-4">
                        {[
                            { name: "Sofia Bennett", role: "General Manager", img: team1 }, // Replace with actual team images
                            { name: "Daniel Wright", role: "Guest Experience Lead", img: team2 },
                            { name: "Alex Morgan", role: "Operations Manager", img: team3 },
                            { name: "Emma Collins", role: "Events & Services Manager", img: team4 },
                            { name: "Liam Parker", role: "Hospitality Coordinator", img: team5 },
                            { name: "Olivia Reed", role: "Front Desk Supervisor", img: team6 },
                        ].map((member, index) => (
                            <div className="col-lg-4 col-md-6" key={index}>
                                <div className="team-card">
                                    <div className="team-img-container mb-3">
                                        <img src={member.img} alt={member.name} className="img-fluid team-img" />
                                    </div>
                                    <h4 className="serif h5 mb-1">{member.name}</h4>
                                    <p className="text-gold small text-uppercase fw-bold">{member.role}</p>
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