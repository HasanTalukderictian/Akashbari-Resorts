import React, { useState, useEffect } from 'react';

const brandColor = '#5e2e10';
const API_URL = 'https://backend.akashbariresort.com/api/peoject-view';

// প্রতিটা ছবি একটা frame এর ভেতরে: border, radius, overlay সব frame এ
const ImageFrame = ({ src, alt, className = '' }) => (
  <div className={`pv-frame ${className}`}>
    <img src={src} alt={alt} loading="lazy" />
  </div>
);

const OngoingView = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch images');

      const data = await response.json();
      // API সরাসরি array বা { data: [...] } দুটোই সামলায়
      const list = Array.isArray(data) ? data : data?.data || [];
      setImages(list.map((item) => item.image_url).filter(Boolean));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border" style={{ color: brandColor }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2" style={{ color: brandColor }}>Loading images...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5 text-center">
        <p style={{ color: 'red' }}>Error loading images: {error}</p>
        <button
          className="btn"
          style={{ backgroundColor: brandColor, color: 'white' }}
          onClick={fetchImages}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (images.length < 6) {
    return (
      <div className="container my-5 text-center">
        <p style={{ color: brandColor }}>
          Not enough images available. Need at least 6 images.
          Currently have {images.length} images.
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        body {
          background-color: #f5f5f1 !important;
          margin: 0;
          padding: 0;
        }
        html {
          background-color: #f5f5f1;
        }
      `}</style>

      <div className="container my-5 project-view-container">
        <h2 className="text-center fw-bold mt-4 mb-2" style={{ color: brandColor, fontFamily: 'serif' }}>
          Going Project View
        </h2>

        {/* Decorative Line */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '15px',
          marginBottom: '30px',
        }}>
          <span style={{ flex: '0 0 60px', height: '2px', background: `linear-gradient(90deg, transparent, ${brandColor})` }}></span>
          <span style={{ color: brandColor, fontSize: '18px' }}>✦</span>
          <span style={{ flex: '0 0 60px', height: '2px', background: `linear-gradient(90deg, ${brandColor}, transparent)` }}></span>
        </div>

        {/* 1st Row: Left big, Right two stacked */}
        <div className="pv-row">
          <ImageFrame src={images[0]} alt="Project View 1" className="pv-big" />
          <div className="pv-stack">
            <ImageFrame src={images[1]} alt="Project View 2" />
            <ImageFrame src={images[2]} alt="Project View 3" />
          </div>
        </div>

        {/* 2nd Row: Left two stacked, Right big */}
        <div className="pv-row pv-row-gap">
          <div className="pv-stack">
            <ImageFrame src={images[3]} alt="Project View 4" />
            <ImageFrame src={images[4]} alt="Project View 5" />
          </div>
          <ImageFrame src={images[5]} alt="Project View 6" className="pv-big" />
        </div>

        <style>{`
          /* ---------- Layout ---------- */
          .pv-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            height: 500px;
          }
          .pv-row-gap { margin-top: 40px; }

          .pv-stack {
            display: grid;
            grid-template-rows: 1fr 1fr;
            gap: 16px;
            min-height: 0;
          }

          /* ---------- Frame (border + radius + overlay এখানে) ---------- */
          .pv-frame {
            position: relative;
            overflow: hidden;
            border-radius: 12px;
            border: 3px solid ${brandColor};
            min-height: 0;
            background: #eee;
          }

          .pv-frame img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }

          /* Hover: শুধু ভেতরের ছবি zoom, frame এক জায়গায় থাকে */
          .pv-frame:hover img {
            transform: scale(1.05);
          }

          /* নিচ থেকে হালকা brand রঙের gradient (frame এর ভেতরেই) */
          .pv-frame::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, transparent 55%, ${brandColor}55);
            opacity: 0;
            transition: opacity 0.4s ease;
            pointer-events: none;
          }
          .pv-frame:hover::after {
            opacity: 1;
          }

          /* ---------- Tablet ---------- */
          @media (min-width: 769px) and (max-width: 1024px) {
            .pv-row { height: 400px; }
          }

          /* ---------- Mobile ---------- */
          @media (max-width: 768px) {
            .pv-row {
              grid-template-columns: 1fr;
              height: auto;
              gap: 10px;
            }
            .pv-row-gap { margin-top: 10px; }
            .pv-stack { gap: 10px; }
            .pv-frame {
              height: 280px;
              border-radius: 8px;
            }
          }

          @media (max-width: 480px) {
            .pv-frame { height: 220px; }
          }

          /* Touch device এ hover নেই */
          @media (hover: none) {
            .pv-frame:hover img { transform: none; }
            .pv-frame:hover::after { opacity: 0; }
          }
        `}</style>
      </div>
    </>
  );
};

export default OngoingView;