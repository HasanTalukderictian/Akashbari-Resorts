

import { useEffect, useState } from "react";
import "../css/Banner.css";

import img1 from "../image/image1.jpg";
import img2 from "../image/image2.jpg";
import img3 from "../image/image3.jpg";


const images = [img1, img2, img3];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  // Auto change image
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000); // 4 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="banner">
      
      {/* Background Image */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`banner-slide ${index === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* Overlay */}
      <div className="banner-overlay"></div>

      {/* Content */}
      <div className="banner-content">
        <p className="subtitle">AkashBari Resort</p>
        <h1>A True Paradise On Earth</h1>
        <button className="discover-btn">DISCOVER MORE</button>
      </div>

    </div>
  );
};

export default Banner;
