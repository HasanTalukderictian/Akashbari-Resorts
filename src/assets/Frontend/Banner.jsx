import { useEffect, useState } from "react";
import "../css/Banner.css";

const Banner = ({ onDiscoverClick }) => {
  const [bannerData, setBannerData] = useState(null); // ডাটা অবজেক্ট স্টোর করার জন্য
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // Use environment variables for URLs
  const API_BASE_URL = import.meta.env.VITE_BASE_URL;
  const STORAGE_URL = import.meta.env.API_URL;
  const storageBaseUrl = `${STORAGE_URL}/storage/`;

  // Helper function to get full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/storage/')) {
      return `${STORAGE_URL}${imagePath}`;
    }
    if (imagePath.startsWith('storage/')) {
      return `${STORAGE_URL}/${imagePath}`;
    }
    return `${storageBaseUrl}${imagePath.replace(/^\/?storage\//, '')}`;
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/v1/banners/active`);
        const result = await res.json();

        if (result.status === "success") {
          const data = result.data;
          // Process images to get full URLs
          if (data && data.images) {
            const processedImages = data.images.map(img => getFullImageUrl(img));
            setBannerData({ ...data, images: processedImages });
          } else {
            setBannerData(data);
          }
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
    if (bannerData && bannerData.images && bannerData.images.length > 0) {
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