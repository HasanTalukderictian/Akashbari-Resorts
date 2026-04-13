import React, { useState } from "react";
import "../css/Gallery.css";
import { FaSearchPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Header from "./Common/Header";
import Footer from "./Common/Footer";

const Gallery = () => {
    const [currentIndex, setCurrentIndex] = useState(null);

    const images = [
        "https://i.ibb.co/sdZrB5bQ/restaurant-img333.jpg",
        "https://i.ibb.co/vCQPNJqr/room-img3.jpg",
        "https://i.ibb.co/RGJ1Sr7f/room-img2.jpg",
        "https://i.ibb.co/Df0xszfx/room-img1.jpg",
        "https://i.ibb.co/chd0bMgP/room-img6.jpg",
        "https://i.ibb.co/rRtRpknT/room-img5.jpg",
        "https://i.ibb.co/0pMJkBBn/room-img4.jpg",
        "https://i.ibb.co.com/0pBxsngQ/5.jpg",
        'https://i.ibb.co.com/pB7B0dHF/7.jpg',
        'https://i.ibb.co.com/kWXFccP/8.jpg',
        'https://i.ibb.co.com/7dcgX3ZF/9.jpg',
        'https://i.ibb.co.com/RpPFJxKP/3.jpg'

    ];

    // 👉 next image
    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    // 👉 previous image
    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    return (
        <>
            <Header />

            <div className="gallery-wrapper py-5">
                <div className="container">
                    <h2 className="text-center mb-3 section-title">
                        Our Resort Gallery
                    </h2>
                    <p className="text-center mb-5">
                        Discover peaceful surroundings, breathtaking views, and relaxing spaces
                        <br/>
                        designed to give you the perfect escape from everyday life.
                    </p>

                    <div className="row g-4">
                        {images.map((img, index) => (
                            <div className="col-lg-4 col-md-6" key={index}>
                                <div
                                    className="gallery-item"
                                    onClick={() => setCurrentIndex(index)}
                                >
                                    <img src={img} alt="" className="img-fluid" />

                                    <div className="overlay">
                                        <FaSearchPlus color="#fff" size={30} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ✅ Lightbox with arrows */}
            {currentIndex !== null && (
                <div
                    onClick={() => setCurrentIndex(null)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.9)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                    }}
                >
                    {/* ❌ Close click prevent */}
                    <img
                        src={images[currentIndex]}
                        alt=""
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: "90%",
                            maxHeight: "90%",
                            borderRadius: "8px",
                        }}
                    />

                    {/* ⬅️ Left Arrow */}
                    <button
                        onClick={prevImage}
                        style={arrowStyle("left")}
                    >
                        <FaChevronLeft />
                    </button>

                    {/* ➡️ Right Arrow */}
                    <button
                        onClick={nextImage}
                        style={arrowStyle("right")}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            )}

            <Footer />
        </>
    );
};

// 👉 Arrow style function
const arrowStyle = (side) => ({
    position: "fixed",
    top: "50%",
    [side]: "30px",
    transform: "translateY(-50%)",
    background: "rgba(255,255,255,0.2)",
    border: "none",
    color: "#fff",
    fontSize: "30px",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "50%",
});

export default Gallery;