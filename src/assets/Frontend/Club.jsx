import React, { useEffect, useState } from 'react'
import Header from './Common/Header';
import Footer from './Common/Footer';
import { FaBuilding, FaMask, FaCamera, FaCocktail, FaBirthdayCake, FaCrown, FaGlassMartiniAlt, FaPhoneAlt, FaTimes } from 'react-icons/fa';
import { Modal } from 'react-bootstrap';

// Swiper Components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// CSS
import 'swiper/css';
import 'swiper/css/pagination'; 
import 'swiper/css/navigation';

const Club = () => {
  const [showModal, setShowModal] = useState(false);
  const [clubInfo, setClubInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  
  const API_BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_URL = import.meta.env.VITE_BASE_URL;

  // Modal open/close functions
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, []);

  // Fetch club information from API
  useEffect(() => {
    const fetchClubInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/club-infos`);
        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          setClubInfo(result.data[0]);
          setError(null);
        } else {
          setError('No club information found');
        }
      } catch (err) {
        console.error('Error fetching club info:', err);
        setError('Failed to load club information');
      } finally {
        setLoading(false);
      }
    };

    fetchClubInfo();
  }, [API_BASE_URL]);

  // Fetch gallery images for facilities section
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setGalleryLoading(true);
        const response = await fetch(`${API_BASE_URL}/club-gallery`);
        const result = await response.json();

        if (result.success && result.data && result.data.data) {
          setGalleryImages(result.data.data);
        } else {
          setGalleryImages([]);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
        setGalleryImages([]);
      } finally {
        setGalleryLoading(false);
      }
    };

    fetchGalleryImages();
  }, [API_BASE_URL]);

  // Function to get correct image URL
 // Function to get correct image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/800x600?text=No+Image';
  if (imagePath.startsWith('http')) return imagePath;
  
  // Remove leading slashes if any
  const cleanPath = imagePath.replace(/^\/+/, '');
  
  // Use the API_URL from env for storage path
  // Remove /api from API_URL to get base URL for storage
  const baseUrl = API_URL.replace('/api', '');
  return `${baseUrl}/storage/${cleanPath}`;
};

  // ২য় সেকশনের ডাটা
  const servicesData = {
    title: "Our Services",
    subtitle: "Rem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    services: [
      { id: 1, title: "CORPORATE EVENTS", description: "Lor sit amet, ctetur adipisicing elit, sed deiusmod tempor incididunt ut labore et", icon: <FaBuilding size={30} style={{ color: '#ff003c' }} /> },
      { id: 2, title: "BRANDED EVENTS", description: "Dolor sit amet, tetur adipisicing elit, sed do eiu smod temporin cididunt ut labore", icon: <FaMask size={30} style={{ color: '#ff003c' }} /> },
      { id: 3, title: "COMMERCIAL SHOOTS", description: "Dolor sit amet, tetur adipisicing elit, sed do eiu smod temporin cididunt ut labore", icon: <FaCamera size={30} style={{ color: '#ff003c' }} /> },
      { id: 4, title: "HAN PARTIES", description: "Psum dolor sit amet, ctetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et", icon: <FaCocktail size={30} style={{ color: '#ff003c' }} /> },
      { id: 5, title: "BIRTHDAY PARTIES", description: "Olor sit tetur adicing elit, sed do eiusmod tempor incididunt ut labore et", icon: <FaBirthdayCake size={30} style={{ color: '#ff003c' }} /> },
      { id: 6, title: "VIP SERVICE", description: "Isum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut", icon: <FaCrown size={30} style={{ color: '#ff003c' }} /> }
    ]
  };

  // Show loading state
  if (loading) {
    return (
      <>
        <Header/>
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          color: '#ffffff'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner-border text-warning mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading club information...</p>
          </div>
        </div>
        <Footer/>
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <Header/>
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          color: '#ffffff'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#dc3545' }}>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#b8860b',
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer/>
      </>
    );
  }

  return (
    <> 
      <Header/>
      
      {/* Sticky Circular Button */}
      <div 
        className="sticky-member-btn"
        onClick={handleShowModal}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 1000,
          cursor: 'pointer'
        }}
      >
        <button
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#25D366',
            border: 'none',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '260px',
            marginBottom: '150px',
            gap: '5px',
            fontFamily: "'Playfair Display', serif"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#128C7E';
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#25D366';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
          }}
        >
          <FaPhoneAlt size={24} />
          <span style={{ fontSize: '11px', letterSpacing: '1px' }}>MEMBER</span>
        </button>
      </div>

      {/* Modal Component */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal}
        centered
        size="lg"
        style={{ fontFamily: "'Playfair Display', serif" }}
        contentClassName="modal-content-no-radius"
      >
        <Modal.Header 
          style={{
            borderBottom: '2px solid #25D366',
            backgroundColor: '#1a1a1a',
            color: 'white',
            padding: '20px 30px',
            borderRadius: '0'
          }}
        >
          <Modal.Title 
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              letterSpacing: '1px'
            }}
          >
            {clubInfo?.club_name || 'Akashbari Club'}
          </Modal.Title>
          <button
            onClick={handleCloseModal}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              transition: '0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#25D366'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
          >
            <FaTimes />
          </button>
        </Modal.Header>
        
        <Modal.Body 
          style={{
            backgroundColor: '#ffffff',
            padding: '50px 40px',
            textAlign: 'center',
            borderRadius: '0'
          }}
        >
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h3 
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '15px',
                lineHeight: '1.3'
              }}
            >
              We Are Starting
            </h3>
            
            <h2 
              style={{
                fontSize: '36px',
                fontWeight: '800',
                color: '#25D366',
                marginBottom: '15px',
                lineHeight: '1.2'
              }}
            >
              {clubInfo?.club_name || 'Akashbari Club'}
            </h2>
            
            <h3 
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '20px'
              }}
            >
              Membership
            </h3>
            
            <div 
              style={{
                display: 'inline-block',
                backgroundColor: '#25D366',
                color: 'white',
                padding: '8px 25px',
                margin: '15px 0',
                fontSize: '22px',
                fontWeight: 'bold'
              }}
            >
              2027
            </div>
            
            <p 
              style={{
                fontSize: '16px',
                color: '#666',
                lineHeight: '1.6',
                marginTop: '20px'
              }}
            >
              Get ready to be part of an exclusive experience!
            </p>
          </div>
        </Modal.Body>
        
        <Modal.Footer 
          style={{
            borderTop: '1px solid #e0e0e0',
            backgroundColor: '#ffffff',
            justifyContent: 'center',
            padding: '20px',
            borderRadius: '0'
          }}
        >
          <button
            onClick={handleCloseModal}
            style={{
              backgroundColor: '#25D366',
              color: 'white',
              border: 'none',
              padding: '10px 30px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#128C7E';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#25D366';
            }}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>

      {/* Main Content Container */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* 1st section - Club Info */}
        <section className="py-5" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <h3 className='text-center mt-1 mb-15 font-bw' style={{ marginBottom: '2rem' }}>
              {clubInfo?.club_name || 'AKASHBARI CLUB'}
            </h3>
            <div className="row align-items-center">
              <div className="col-lg-7 pe-lg-5 mb-4 mb-lg-0">
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ position: 'absolute', top: '-20px', left: '-40px', width: '150px', height: '150px', border: '15px solid rgba(184, 134, 11, 0.15)', borderRadius: '50%', zIndex: -1 }} />
                  
                  <p style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#e0e0e0', textAlign: 'justify' }}>
                    {clubInfo?.club_history || 'No history available'}
                  </p>
                  
                  <div className="mt-4 d-inline-block">
                    <a 
                      href={`tel:${clubInfo?.club_phone || ''}`}
                      className="d-flex align-items-center text-decoration-none"
                      style={{ 
                        color: '#b8860b', 
                        fontSize: '1.1rem', 
                        fontWeight: '500',
                        transition: 'color 0.3s ease',
                        letterSpacing: '0.5px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#b8860b'}
                    >
                      <span 
                        className="d-flex align-items-center justify-content-center me-2"
                        style={{
                          backgroundColor: 'rgba(184, 134, 11, 0.15)',
                          padding: '10px',
                          borderRadius: '50%',
                          width: '38px',
                          height: '38px'
                        }}
                      >
                        <FaPhoneAlt size={16} />
                      </span>
                      {clubInfo?.club_phone || 'No phone number available'}
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="p-3" style={{ backgroundColor: '#262626', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                  <img 
                    src={clubInfo?.image ? `${API_URL}/${clubInfo.image}` : 'https://i.ibb.co.com/F4wxhh4L/Whats-App-Image-2026-05-24-at-3-40-22-PM-1.jpg'} 
                    alt={clubInfo?.club_name || 'Club Building'} 
                    className="img-fluid w-100" 
                    style={{ display: 'block', objectFit: 'cover', height: '420px' }}
                    onError={(e) => {
                      e.target.src = 'https://i.ibb.co.com/F4wxhh4L/Whats-App-Image-2026-05-24-at-3-40-22-PM-1.jpg';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      
        {/* 2nd section - Services */}
        <section className="py-5" style={{ backgroundColor: '#07111e', color: '#ffffff' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <div className="text-center mb-5">
              <div className="mb-2"><FaGlassMartiniAlt size={24} style={{ color: '#ff003c' }} /></div>
              <h2 className="fw-bold mb-3" style={{ fontSize: '2.5rem', letterSpacing: '1px' }}>{servicesData.title}</h2>
              <div className="row justify-content-center">
                <div className="col-md-8">
                  <p style={{ color: '#7a8a9e', fontSize: '0.95rem', lineHeight: '1.6' }}>{servicesData.subtitle}</p>
                </div>
              </div>
            </div>
            <div className="row g-4">
              {servicesData.services.map((service) => (
                <div key={service.id} className="col-md-6 col-lg-4">
                  <div 
                    className="p-4 h-100 d-flex align-items-start"
                    style={{ backgroundColor: '#101c2c', borderRadius: '4px', transition: 'all 0.3s ease', cursor: 'pointer' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#800020'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#101c2c'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div className="me-3 mt-1">{service.icon}</div>
                    <div>
                      <h5 className="fw-bold mb-2" style={{ fontSize: '1.1rem', letterSpacing: '0.5px' }}>{service.title}</h5>
                      <p className="mb-0" style={{ color: '#a4b3c6', fontSize: '0.9rem', lineHeight: '1.5' }}>{service.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3rd section - Facilities Overview (Dynamic from Gallery API) */}
        <section className="py-5" style={{ backgroundColor: '#111111', color: '#ffffff' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <div className="mb-4">
              <h2 style={{ color: '#b8860b', fontFamily: 'serif', fontSize: '2.2rem', fontWeight: '300' }}>
                Facilities Overview
              </h2>
            </div>

            {galleryLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status">
                  <span className="visually-hidden">Loading facilities...</span>
                </div>
                <p className="mt-3">Loading gallery images...</p>
              </div>
            ) : galleryImages.length === 0 ? (
              <div className="text-center py-5">
                <p>No facilities images available</p>
              </div>
            ) : (
              <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                spaceBetween={24} 
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                navigation={true}
                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
              >
                {galleryImages.map((image) => (
                  <SwiperSlide key={image.id}>
                    <div 
                      className="position-relative overflow-hidden"
                      style={{ 
                        height: '400px', 
                        cursor: 'pointer',
                        role: 'group'
                      }}
                      onMouseEnter={(e) => {
                        const overlay = e.currentTarget.querySelector('.facility-overlay');
                        if (overlay) overlay.style.opacity = '0';
                      }}
                      onMouseLeave={(e) => {
                        const overlay = e.currentTarget.querySelector('.facility-overlay');
                        if (overlay) overlay.style.opacity = '1';
                      }}
                    >
                      <img 
                        src={getImageUrl(image.image)} 
                        alt={image.title || 'Facility Image'} 
                        className="w-100 h-100" 
                        style={{ objectFit: 'cover', display: 'block' }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                        }}
                      />

                      <div 
                        className="facility-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-4"
                        style={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.65)', 
                          transition: 'all 0.4s ease-in-out',
                          opacity: 1
                        }}
                      >
                        <div 
                          className="w-100 h-100 d-flex align-items-center justify-content-center"
                          style={{ border: '1px solid rgba(184, 134, 11, 0.4)' }}
                        >
                          <h4 
                            className="fw-normal text-white text-center px-3" 
                            style={{ letterSpacing: '2px', fontSize: '1.25rem', fontFamily: 'serif' }}
                          >
                            {image.title || 'Club Facility'}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </section>

        <Footer/>
      </div>

      {/* Styles */}
      <style jsx="true">{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        .modal-content-no-radius {
          border-radius: 0 !important;
        }
        
        .modal-content-no-radius .modal-header,
        .modal-content-no-radius .modal-body,
        .modal-content-no-radius .modal-footer {
          border-radius: 0 !important;
        }
        
        @media (max-width: 768px) {
          .sticky-member-btn button {
            width: 60px !important;
            height: 60px !important;
            margin-right: 20px !important;
            margin-bottom: 20px !important;
          }
          .sticky-member-btn span {
            font-size: 9px !important;
          }
          .sticky-member-btn span:first-of-type {
            font-size: 16px !important;
          }
        }
      `}</style>
    </>
  )
}

export default Club