import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Banner.css";

const Banner = ({ onDiscoverClick, onPackagesClick }) => { // নতুন prop যোগ করা হয়েছে
  const [bannerData, setBannerData] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_BASE_URL;
  const STORAGE_URL = import.meta.env.API_URL;
  const storageBaseUrl = `${STORAGE_URL}/storage/`;

  const navigate = useNavigate();
  const location = useLocation();

  const handleInvestmentClick = () => {
    if (location.pathname === "/") {
      scrollToOwner?.();
    } else {
      navigate("/");
      setTimeout(() => {
        const ownerSection = document.getElementById("invest-section");
        ownerSection?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 500);
    }
  };

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

        <div className="banner-buttons">
          <button
            className="discover-btn"
            onClick={onDiscoverClick}
          >
            DISCOVER MORE
          </button>

          <button
            className="discover-btn"
            onClick={onPackagesClick} // Packages বাটনের জন্য আলাদা ফাংশন
          >
            PACKAGES
          </button>
        </div>
      </div>

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