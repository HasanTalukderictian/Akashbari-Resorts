import { useEffect, useState } from "react";
import "../css/Banner.css";

import img1 from "../image/image1.jpg";
import img2 from "../image/image2.jpg";
import img3 from "../image/image3.jpg";

const images = [img1, img2, img3];

const Banner = ({ onDiscoverClick }) => { // 👈 props নাও
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="banner">
      
      {images.map((img, index) => (
        <div
          key={index}
          className={`banner-slide ${index === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      <div className="banner-overlay"></div>

      <div className="banner-content">
        <p className="subtitle">AkashBari Resort</p>
        <h1>A True Paradise On Earth</h1>

        {/* 👇 click event add */}
        <button 
          className="discover-btn"
          onClick={onDiscoverClick}
        >
          DISCOVER MORE
        </button>
      </div>

    </div>
  );
};

export default Banner;