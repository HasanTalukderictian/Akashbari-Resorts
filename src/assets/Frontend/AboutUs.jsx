import React, { useState } from 'react';
import Header from './Common/Header';
import Footer from './Common/Footer';
import '../css/about.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import "swiper/css";
import "swiper/css/pagination";

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

// Package Price Data
const packageData = {
  current: [
    { id: 1, name: "Superior Deluxe Package", price: 350000, discount: 50000, finalPrice: 300000 },
    { id: 2, name: "EXECUTIVE SUITE SHARE", price: 475000, discount: 75000, finalPrice: 400000 },
    { id: 3, name: "EARTH SHELTER SUITE SHARE", price: 599900, discount: 0, finalPrice: 599900 },
    { id: 4, name: "PRESIDENTIAL SUITE SHARE", price: 699000, discount: 100000, finalPrice: 599000 }
  ],
  previous: [
    { id: 1, name: "Superior Deluxe Package", price: 300000, discount: 0, finalPrice: 300000 },
    { id: 2, name: "EXECUTIVE SUITE SHARE", price: 450000, discount: 0, finalPrice: 450000 },
    { id: 3, name: "EARTH SHELTER SUITE SHARE", price: 550900, discount: 0, finalPrice: 550900 },
    { id: 4, name: "PRESIDENTIAL SUITE SHARE", price: 600000, discount: 100000, finalPrice: 500000 }
  ],
  history: [
    { month: "Jan", superior: 280000, executive: 420000, earth: 520000, presidential: 550000 },
    { month: "Feb", superior: 285000, executive: 430000, earth: 530000, presidential: 560000 },
    { month: "Mar", superior: 290000, executive: 440000, earth: 540000, presidential: 580000 },
    { month: "Apr", superior: 300000, executive: 450000, earth: 550900, presidential: 600000 },
    { month: "May", superior: 320000, executive: 460000, earth: 560000, presidential: 620000 },
    { month: "Jun", superior: 350000, executive: 475000, earth: 599900, presidential: 699000 }
  ]
};

const AboutUs = () => {
    const [selectedImage, setSelectedImage] = useState(king1);
    const [activeId, setActiveId] = useState(1);
    const [selectedPackage, setSelectedPackage] = useState('superior');
    const [showHistory, setShowHistory] = useState(false);

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

    // Format price with BDT currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat('bn-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price).replace('BDT', '৳');
    };

    // Calculate max value for chart
    const maxValue = Math.max(
        ...packageData.history.flatMap(item => [item.superior, item.executive, item.earth, item.presidential])
    );

    // Chart component
    const PriceChart = () => {
        const getBarHeight = (value) => {
            return (value / maxValue) * 200;
        };

        const getPackageColor = (pkg) => {
            switch(pkg) {
                case 'superior': return '#9a55ff';
                case 'executive': return '#ff6b6b';
                case 'earth': return '#4ecdc4';
                case 'presidential': return '#f9ca24';
                default: return '#9a55ff';
            }
        };

        return (
            <div className="price-chart-container" style={{
                backgroundColor: '#fff',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                marginTop: '30px'
            }}>
                <div className="chart-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px',
                    flexWrap: 'wrap',
                    gap: '15px'
                }}>
                    <div>
                        <h3 style={{ color: '#2c3e50', marginBottom: '5px' }}>
                            <i className="bi bi-graph-up"></i> Package Price History
                        </h3>
                        <p style={{ color: '#7f8c8d', fontSize: '14px' }}>6 months price trend analysis</p>
                    </div>
                    <div className="legend" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '20px', height: '20px', backgroundColor: '#9a55ff', borderRadius: '4px' }}></div>
                            <span style={{ fontSize: '12px' }}>Superior Deluxe</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '20px', height: '20px', backgroundColor: '#ff6b6b', borderRadius: '4px' }}></div>
                            <span style={{ fontSize: '12px' }}>Executive Suite</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '20px', height: '20px', backgroundColor: '#4ecdc4', borderRadius: '4px' }}></div>
                            <span style={{ fontSize: '12px' }}>Earth Shelter</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '20px', height: '20px', backgroundColor: '#f9ca24', borderRadius: '4px' }}></div>
                            <span style={{ fontSize: '12px' }}>Presidential Suite</span>
                        </div>
                    </div>
                </div>

                <div className="chart-wrapper" style={{ overflowX: 'auto' }}>
                    <div className="chart" style={{ minWidth: '600px' }}>
                        {/* Y-axis labels */}
                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                            <div style={{ width: '80px' }}></div>
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', paddingRight: '10px' }}>
                                <span style={{ fontSize: '11px', color: '#7f8c8d' }}>৳0</span>
                                <span style={{ fontSize: '11px', color: '#7f8c8d' }}>৳{Math.round(maxValue/4)}k</span>
                                <span style={{ fontSize: '11px', color: '#7f8c8d' }}>৳{Math.round(maxValue/2)}k</span>
                                <span style={{ fontSize: '11px', color: '#7f8c8d' }}>৳{Math.round(maxValue*3/4)}k</span>
                                <span style={{ fontSize: '11px', color: '#7f8c8d' }}>৳{maxValue}k</span>
                            </div>
                        </div>

                        {/* Bars */}
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
                            {packageData.history.map((item, idx) => (
                                <div key={idx} style={{ flex: 1, textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'flex-end', height: '220px', marginBottom: '10px' }}>
                                        <div style={{ width: '40px', textAlign: 'center' }}>
                                            <div style={{
                                                height: `${getBarHeight(item.superior)}px`,
                                                backgroundColor: '#9a55ff',
                                                borderRadius: '8px 8px 0 0',
                                                transition: 'height 0.5s ease',
                                                position: 'relative',
                                                cursor: 'pointer'
                                            }}>
                                                <span style={{
                                                    position: 'absolute',
                                                    top: '-20px',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    fontSize: '10px',
                                                    fontWeight: 'bold',
                                                    whiteSpace: 'nowrap'
                                                }}>৳{(item.superior/1000).toFixed(0)}k</span>
                                            </div>
                                        </div>
                                        <div style={{ width: '40px', textAlign: 'center' }}>
                                            <div style={{
                                                height: `${getBarHeight(item.executive)}px`,
                                                backgroundColor: '#ff6b6b',
                                                borderRadius: '8px 8px 0 0',
                                                transition: 'height 0.5s ease',
                                                position: 'relative',
                                                cursor: 'pointer'
                                            }}>
                                                <span style={{
                                                    position: 'absolute',
                                                    top: '-20px',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    fontSize: '10px',
                                                    fontWeight: 'bold',
                                                    whiteSpace: 'nowrap'
                                                }}>৳{(item.executive/1000).toFixed(0)}k</span>
                                            </div>
                                        </div>
                                        <div style={{ width: '40px', textAlign: 'center' }}>
                                            <div style={{
                                                height: `${getBarHeight(item.earth)}px`,
                                                backgroundColor: '#4ecdc4',
                                                borderRadius: '8px 8px 0 0',
                                                transition: 'height 0.5s ease',
                                                position: 'relative',
                                                cursor: 'pointer'
                                            }}>
                                                <span style={{
                                                    position: 'absolute',
                                                    top: '-20px',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    fontSize: '10px',
                                                    fontWeight: 'bold',
                                                    whiteSpace: 'nowrap'
                                                }}>৳{(item.earth/1000).toFixed(0)}k</span>
                                            </div>
                                        </div>
                                        <div style={{ width: '40px', textAlign: 'center' }}>
                                            <div style={{
                                                height: `${getBarHeight(item.presidential)}px`,
                                                backgroundColor: '#f9ca24',
                                                borderRadius: '8px 8px 0 0',
                                                transition: 'height 0.5s ease',
                                                position: 'relative',
                                                cursor: 'pointer'
                                            }}>
                                                <span style={{
                                                    position: 'absolute',
                                                    top: '-20px',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    fontSize: '10px',
                                                    fontWeight: 'bold',
                                                    whiteSpace: 'nowrap'
                                                }}>৳{(item.presidential/1000).toFixed(0)}k</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 'bold', fontSize: '12px', marginTop: '10px' }}>{item.month}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

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

            {/* NEW SECTION: Package Price Comparison & History */}
            <section className="package-section py-5" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="container">
                    <div className="text-center mb-5">
                        <span className="text-gold text-uppercase ls-2 small fw-bold">Packages</span>
                        <h2 className="serif display-6 mt-2">Our <span className="text-muted">Room Packages</span></h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                            Compare our exclusive packages and check price history
                        </p>
                    </div>

                    {/* Package Cards */}
                    <div className="row g-4 mb-5">
                        {packageData.current.map((pkg, index) => {
                            const prevPkg = packageData.previous.find(p => p.id === pkg.id);
                            const priceIncreased = pkg.price > prevPkg.price;
                            const increaseAmount = pkg.price - prevPkg.price;
                            
                            return (
                                <div className="col-lg-3 col-md-6" key={pkg.id}>
                                    <div className="package-card" style={{
                                        backgroundColor: '#fff',
                                        borderRadius: '15px',
                                        overflow: 'hidden',
                                        boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                                        transition: 'transform 0.3s ease',
                                        height: '100%'
                                    }}>
                                        <div className="package-header" style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: '#fff',
                                            padding: '20px',
                                            textAlign: 'center'
                                        }}>
                                            <h4 className="mb-0" style={{ fontSize: '18px' }}>{pkg.name}</h4>
                                        </div>
                                        <div className="package-body" style={{ padding: '25px' }}>
                                            <div className="current-price text-center mb-3">
                                                <span style={{ fontSize: '14px', color: '#7f8c8d' }}>Current Price</span>
                                                <h3 style={{ color: '#2c3e50', marginBottom: '5px' }}>{formatPrice(pkg.finalPrice)}</h3>
                                                {pkg.discount > 0 && (
                                                    <span className="badge bg-danger" style={{ fontSize: '12px' }}>
                                                        Save {formatPrice(pkg.discount)}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {priceIncreased && (
                                                <div className="price-change text-center" style={{
                                                    backgroundColor: '#fff3cd',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    marginTop: '10px'
                                                }}>
                                                    <span style={{ fontSize: '12px', color: '#856404' }}>
                                                        <i className="bi bi-arrow-up-short"></i> Increased by {formatPrice(increaseAmount)}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            <div className="previous-price text-center mt-3">
                                                <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Previous Price</span>
                                                <p style={{ textDecoration: 'line-through', color: '#95a5a6', marginBottom: '0' }}>
                                                    {formatPrice(prevPkg.price)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="package-footer" style={{ padding: '15px', borderTop: '1px solid #e0e0e0' }}>
                                            <button className="btn w-100" style={{
                                                backgroundColor: '#9a55ff',
                                                color: '#fff',
                                                borderRadius: '25px',
                                                padding: '8px'
                                            }}>
                                                Book Now <i className="bi bi-arrow-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Price History Chart */}
                    <PriceChart />

                    {/* Toggle View Button */}
                    <div className="text-center mt-4">
                        <button 
                            className="btn btn-outline-primary"
                            onClick={() => setShowHistory(!showHistory)}
                            style={{ borderRadius: '25px', padding: '10px 30px' }}
                        >
                            {showHistory ? 'Hide Detailed History' : 'View Detailed Price History'}
                        </button>
                    </div>

                    {/* Detailed History Table */}
                    {showHistory && (
                        <div className="history-table mt-4" style={{
                            backgroundColor: '#fff',
                            borderRadius: '15px',
                            padding: '20px',
                            boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                            overflowX: 'auto'
                        }}>
                            <h5 className="mb-3">Monthly Price History (in BDT)</h5>
                            <table className="table table-hover">
                                <thead style={{ backgroundColor: '#9a55ff', color: '#fff' }}>
                                    <tr>
                                        <th>Month</th>
                                        <th>Superior Deluxe</th>
                                        <th>Executive Suite</th>
                                        <th>Earth Shelter</th>
                                        <th>Presidential Suite</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {packageData.history.map((item, idx) => (
                                        <tr key={idx}>
                                            <td><strong>{item.month}</strong></td>
                                            <td>{formatPrice(item.superior)}</td>
                                            <td>{formatPrice(item.executive)}</td>
                                            <td>{formatPrice(item.earth)}</td>
                                            <td>{formatPrice(item.presidential)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>

            {/* Section 3: Facilities Slider */}
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
                        loop={true}
                        autoplay={{ delay: 2500, disableOnInteraction: false }}
                        breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}
                        className="facility-swiper"
                    >
                        {facilities.map((item) => (
                            <SwiperSlide key={item.id}>
                                <div className="facility-card shadow-sm bg-white">
                                    <div className="facility-img-wrapper position-relative">
                                        <img src={item.img} alt={item.title} className="img-fluid" />
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

            {/* Section 4: Places Section */}
            <section className="places-section py-3">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-4 d-flex flex-column justify-content-center">
                            <div className="section-title-wrapper">
                                <span className="text-gold text-uppercase ls-2 small fw-bold">See Place</span>
                                <h3 className="serif display-6 mt-2 mb-4">
                                    Places Around The Hotel <br />
                                    <span className="text-muted">To Visit This Summer</span>
                                </h3>
                                <button className="view-more-btn">View More</button>
                            </div>
                        </div>

                        <div className="col-lg-8">
                            <div className="row g-3">
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

            {/* Section 5: Team Section */}
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
                            { name: "Sofia Bennett", role: "General Manager", img: team1 },
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