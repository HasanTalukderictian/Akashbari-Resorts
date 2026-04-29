// import { useEffect, useState } from "react";
// import "../css/Banner.css";

// import img1 from "../image/image1.jpg";
// import img2 from "../image/image2.jpg";
// import img3 from "../image/image3.jpg";

// const images = [img1, img2, img3];

// const Banner = ({ onDiscoverClick }) => { // 👈 props নাও
//   const [current, setCurrent] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % images.length);
//     }, 4000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="banner">

//       {images.map((img, index) => (
//         <div
//           key={index}
//           className={`banner-slide ${index === current ? "active" : ""}`}
//           style={{ backgroundImage: `url(${img})` }}
//         />
//       ))}

//       <div className="banner-overlay"></div>

//       <div className="banner-content">
//         <p className="subtitle">AkashBari Resort</p>
//         <h1>A True Paradise On Earth</h1>

//         {/* 👇 click event add */}
//         <button 
//           className="discover-btn"
//           onClick={onDiscoverClick}
//         >
//           DISCOVER MORE
//         </button>
//       </div>

//     </div>
//   );
// };

// export default Banner;

import { useEffect, useState } from "react";
import "../css/Banner.css";

const Banner = ({ onDiscoverClick }) => {
  const [bannerData, setBannerData] = useState(null); // ডাটা অবজেক্ট স্টোর করার জন্য
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // লারাভেলের স্টোরেজ ইউআরএল বেস
  const storageBaseUrl = "http://127.0.0.1:8000/storage/";

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/v1/banners/active'); // আপনার একটিভ ব্যানার এন্ডপয়েন্ট
        const result = await res.json();

        if (result.status === "success") {
          setBannerData(result.data); // result.data হচ্ছে আপনার সেই অবজেক্ট
        }
      } catch (err) {
        console.error("Failed to fetch banners", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // স্লাইডার ইন্টারভাল (ইমেজ অ্যারের ওপর ভিত্তি করে)
  useEffect(() => {
    if (bannerData && bannerData.images.length > 0) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % bannerData.images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [bannerData]);

  if (loading) return <div className="banner-loader">Loading...</div>;
  if (!bannerData || !bannerData.images || bannerData.images.length === 0) return null;

  return (
    <div className="banner">
      {/* ইমেজগুলো ডাটাবেজের 'images' অ্যারে থেকে লুপ হচ্ছে */}
      {bannerData.images.map((imgUrl, index) => (
        <div
          key={index}
          className={`banner-slide ${index === current ? "active" : ""}`}
          style={{
            
            backgroundImage: `url(${imgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      ))}

      <div className="banner-overlay"></div>

      <div className="banner-content">
        <p className="subtitle">{bannerData.subtitle}</p>
        <h1>{bannerData.title}</h1>

        <button
          className="discover-btn"
          onClick={onDiscoverClick}
        >
          DISCOVER MORE
        </button>
      </div>

      {/* স্লাইড ইন্ডিকেটর (ডটস) */}
      <div className="banner-dots">
        {bannerData.images.map((_, index) => (
          <span
            key={index}
            className={index === current ? "dot active" : "dot"}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Banner;