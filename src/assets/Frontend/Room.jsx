import React from 'react';
import '../css/room.css';
import img1 from '../image/room1.jpg'
import img2 from '../image/room2.jpg'
import image3 from '../image/room3.jpg'
// import img4 from '../image/room4.jpg'

const Room = () => {
    return (
        <section className="room-section py-5">
            <div className="container">
                {/* Header Section */}
                <div className="text-center mb-5">
                    <span className="explore-text">explore</span>
                    <h2 className="rooms-title text-uppercase">Rooms & Suites</h2>
                    <a href="#" className="view-all mt-2 explore-text text-decoration-none">
                        View All Rooms &rarr;
                    </a>
                </div>

                <div className="row g-4">
                    {/* Left Column - Large Luxury Room */}
                    <div className="col-lg-6">
                        <div className="room-card main-room">
                            <img src={img1} alt="Luxury Room" className="img-fluid w-100" />
                            <div className="room-info shadow">
                                <h4 className="text-uppercase">Luxury Room</h4>
                                <p className="room-meta">135 sqm | Max. 4 guests</p>
                                <hr />
                                <p className="room-price">From <span className="price-amount">$153.00</span> /night</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Two Small Rooms */}
                    <div className="col-lg-6">
                        <div className="row g-4">
                            {/* Double Room */}
                            <div className="col-12">
                                <div className="room-card small-room">
                                    <div className="row g-0 align-items-center">
                                        <div className="col-8">
                                            <img src={img2} alt="Double Room" className="img-fluid w-100" />
                                        </div>
                                        <div className="col-4">
                                            <div className="room-info-side shadow-sm">
                                                <h5 className="text-uppercase">Double Room</h5>
                                                <p className="room-meta small">264 sqm | Max. 10 guests</p>
                                                <hr />
                                                <p className="room-price">From <span className="price-amount">$149.00</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Junior Suite */}
                            <div className="col-12">
                                <div className="room-card small-room">
                                    <div className="row g-0 align-items-center flex-row-reverse">
                                        <div className="col-8">
                                            <img src={image3} alt="Junior Suite" className="img-fluid w-100" />
                                        </div>
                                        <div className="col-4 text-end">
                                            <div className="room-info-side-reverse shadow-sm">
                                                <h5 className="text-uppercase">Junior Suite</h5>
                                                <p className="room-meta small">175 sqm | Max. 5 guests</p>
                                                <hr />
                                                <p className="room-price">From <span className="price-amount">$149.00</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Room;