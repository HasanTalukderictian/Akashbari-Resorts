import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Gallery.css";
import { FaSearchPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Header from "./Common/Header";
import Footer from "./Common/Footer";

const Gallery = () => {
    const [currentIndex, setCurrentIndex] = useState(null);
    const [images, setImages] = useState([]); // API theke asha data ekhane thakbe
    const [loading, setLoading] = useState(true);

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    // 👉 Fetch Gallery Data from API
    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/gallery`);
                setImages(response.data); // Database theke asha array set hobe
                setLoading(false);
            } catch (error) {
                console.error("Error fetching gallery:", error);
                setLoading(false);
            }
        };

        fetchGallery();
    }, []);

    // 👉 next image logic
    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    // 👉 previous image logic
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

                    {loading ? (
                        <div className="text-center py-5">Loading Gallery...</div>
                    ) : (
                        <div className="row g-4">
                            {images.map((item, index) => (
                                <div className="col-lg-4 col-md-6" key={item.id || index}>
                                    <div
                                        className="gallery-item"
                                        onClick={() => setCurrentIndex(index)}
                                    >
                                        {/* API theke asha image_url use kora hoyeche */}
                                        <img 
                                            src={item.image_url} 
                                            alt={item.title} 
                                            className="img-fluid" 
                                            loading="lazy"
                                        />

                                        <div className="overlay">
                                            <FaSearchPlus color="#fff" size={30} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
                    <div className="position-relative" style={{ maxWidth: "90%", maxHeight: "90%" }}>
                        <img
                            src={images[currentIndex].image_url}
                            alt={images[currentIndex].title}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                width: "100%",
                                height: "auto",
                                maxHeight: "85vh",
                                borderRadius: "8px",
                            }}
                        />
                        <p className="text-center text-white mt-2 fw-bold">
                            {images[currentIndex].title}
                        </p>
                    </div>

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
                    
                    {/* Close Button */}
                    <button 
                        style={{
                            position: "absolute",
                            top: "20px",
                            right: "20px",
                            background: "none",
                            border: "none",
                            color: "white",
                            fontSize: "30px",
                            cursor: "pointer"
                        }}
                        onClick={() => setCurrentIndex(null)}
                    >
                        ×
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "60px",
    height: "60px",
    transition: "0.3s"
});

export default Gallery;