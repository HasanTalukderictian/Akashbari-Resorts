// import React, { useEffect, useState } from 'react'
// import Header from './Common/Header';
// import Footer from './Common/Footer';
// import { FaBuilding, FaMask, FaCamera, FaCocktail, FaBirthdayCake, FaCrown, FaGlassMartiniAlt, FaPhoneAlt, FaTimes } from 'react-icons/fa';
// import { Modal } from 'react-bootstrap';

// // Swiper Components
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// // CSS
// import 'swiper/css';
// import 'swiper/css/pagination'; 
// import 'swiper/css/navigation';

// const Club = () => {
//   const brandColor = '#5e2e10';
//   const [showModal, setShowModal] = useState(false);
//   const [clubInfo, setClubInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [galleryImages, setGalleryImages] = useState([]);
//   const [galleryLoading, setGalleryLoading] = useState(true);
  
//   const API_BASE_URL = import.meta.env.VITE_BASE_URL;
//   const API_URL = import.meta.env.VITE_BASE_URL;

//   // Modal open/close functions
//   const handleShowModal = () => setShowModal(true);
//   const handleCloseModal = () => setShowModal(false);

//   // Scroll to top on page load
//   useEffect(() => {
//     window.scrollTo({
//       top: 0,
//       behavior: 'instant'
//     });
//   }, []);

//   // Fetch club information from API
//   useEffect(() => {
//     const fetchClubInfo = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${API_BASE_URL}/club-infos`);
//         const result = await response.json();

//         if (result.success && result.data && result.data.length > 0) {
//           setClubInfo(result.data[0]);
//           setError(null);
//         } else {
//           setError('No club information found');
//         }
//       } catch (err) {
//         console.error('Error fetching club info:', err);
//         setError('Failed to load club information');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchClubInfo();
//   }, [API_BASE_URL]);

//   // Fetch gallery images for facilities section
//   useEffect(() => {
//     const fetchGalleryImages = async () => {
//       try {
//         setGalleryLoading(true);
//         const response = await fetch(`${API_BASE_URL}/club-gallery`);
//         const result = await response.json();

//         if (result.success && result.data && result.data.data) {
//           setGalleryImages(result.data.data);
//         } else {
//           setGalleryImages([]);
//         }
//       } catch (err) {
//         console.error('Error fetching gallery:', err);
//         setGalleryImages([]);
//       } finally {
//         setGalleryLoading(false);
//       }
//     };

//     fetchGalleryImages();
//   }, [API_BASE_URL]);

//   // Function to get correct image URL
//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return 'https://via.placeholder.com/800x600?text=No+Image';
//     if (imagePath.startsWith('http')) return imagePath;
    
//     const cleanPath = imagePath.replace(/^\/+/, '');
//     const baseUrl = API_URL.replace('/api', '');
//     return `${baseUrl}/storage/${cleanPath}`;
//   };

//   // Services Data
//   const servicesData = {
//     title: "Our Services",
//     subtitle: "Rem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
//     services: [
//       { id: 1, title: "CORPORATE EVENTS", description: "Lor sit amet, ctetur adipisicing elit, sed deiusmod tempor incididunt ut labore et", icon: <FaBuilding size={30} style={{ color: brandColor }} /> },
//       { id: 2, title: "BRANDED EVENTS", description: "Dolor sit amet, tetur adipisicing elit, sed do eiu smod temporin cididunt ut labore", icon: <FaMask size={30} style={{ color: brandColor }} /> },
//       { id: 3, title: "COMMERCIAL SHOOTS", description: "Dolor sit amet, tetur adipisicing elit, sed do eiu smod temporin cididunt ut labore", icon: <FaCamera size={30} style={{ color: brandColor }} /> },
//       { id: 4, title: "HAN PARTIES", description: "Psum dolor sit amet, ctetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et", icon: <FaCocktail size={30} style={{ color: brandColor }} /> },
//       { id: 5, title: "BIRTHDAY PARTIES", description: "Olor sit tetur adicing elit, sed do eiusmod tempor incididunt ut labore et", icon: <FaBirthdayCake size={30} style={{ color: brandColor }} /> },
//       { id: 6, title: "VIP SERVICE", description: "Isum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut", icon: <FaCrown size={30} style={{ color: brandColor }} /> }
//     ]
//   };

//   // Show loading state
//   if (loading) {
//     return (
//       <>
//         <Header/>
//         <div style={{ 
//           minHeight: '100vh', 
//           display: 'flex', 
//           alignItems: 'center', 
//           justifyContent: 'center',
//           backgroundColor: '#1a1a1a',
//           color: '#ffffff'
//         }}>
//           <div style={{ textAlign: 'center' }}>
//             <div className="spinner-border text-warning mb-3" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//             <p>Loading club information...</p>
//           </div>
//         </div>
//         <Footer/>
//       </>
//     );
//   }

//   // Show error state
//   if (error) {
//     return (
//       <>
//         <Header/>
//         <div style={{ 
//           minHeight: '100vh', 
//           display: 'flex', 
//           alignItems: 'center', 
//           justifyContent: 'center',
//           backgroundColor: '#1a1a1a',
//           color: '#ffffff'
//         }}>
//           <div style={{ textAlign: 'center' }}>
//             <p style={{ color: '#dc3545' }}>{error}</p>
//             <button 
//               onClick={() => window.location.reload()}
//               style={{
//                 backgroundColor: brandColor,
//                 color: '#ffffff',
//                 border: 'none',
//                 padding: '10px 20px',
//                 borderRadius: '4px',
//                 cursor: 'pointer'
//               }}
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//         <Footer/>
//       </>
//     );
//   }

//   return (
//     <> 
//       <Header/>
      
//       {/* Sticky Circular Button */}
//       <div 
//         className="sticky-member-btn"
//         onClick={handleShowModal}
//         style={{
//           position: 'fixed',
//           bottom: '30px',
//           right: '30px',
//           zIndex: 1000,
//           cursor: 'pointer'
//         }}
//       >
//         <button
//           style={{
//             width: '80px',
//             height: '80px',
//             borderRadius: '50%',
//             backgroundColor: brandColor,
//             border: 'none',
//             color: 'white',
//             fontSize: '14px',
//             fontWeight: 'bold',
//             cursor: 'pointer',
//             transition: 'all 0.3s ease',
//             boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             marginRight: '260px',
//             marginBottom: '150px',
//             gap: '5px',
//             fontFamily: "'Playfair Display', serif"
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.backgroundColor = '#3d1f0a';
//             e.currentTarget.style.transform = 'scale(1.1)';
//             e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.backgroundColor = brandColor;
//             e.currentTarget.style.transform = 'scale(1)';
//             e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
//           }}
//         >
//           <FaPhoneAlt size={24} />
//           <span style={{ fontSize: '11px', letterSpacing: '1px' }}>MEMBER</span>
//         </button>
//       </div>

//       {/* Modal Component */}
//       <Modal 
//         show={showModal} 
//         onHide={handleCloseModal}
//         centered
//         size="lg"
//         style={{ fontFamily: "'Playfair Display', serif" }}
//         contentClassName="modal-content-no-radius"
//       >
//         <Modal.Header 
//           style={{
//             borderBottom: `2px solid ${brandColor}`,
//             backgroundColor: '#1a1a1a',
//             color: 'white',
//             padding: '20px 30px',
//             borderRadius: '0'
//           }}
//         >
//           <Modal.Title 
//             style={{
//               fontSize: '24px',
//               fontWeight: 'bold',
//               letterSpacing: '1px'
//             }}
//           >
//             {clubInfo?.club_name || 'Akashbari Club'}
//           </Modal.Title>
//           <button
//             onClick={handleCloseModal}
//             style={{
//               background: 'none',
//               border: 'none',
//               color: 'white',
//               fontSize: '20px',
//               cursor: 'pointer',
//               transition: '0.3s'
//             }}
//             onMouseEnter={(e) => e.currentTarget.style.color = brandColor}
//             onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
//           >
//             <FaTimes />
//           </button>
//         </Modal.Header>
        
//         <Modal.Body 
//           style={{
//             backgroundColor: '#ffffff',
//             padding: '50px 40px',
//             textAlign: 'center',
//             borderRadius: '0'
//           }}
//         >
//           <div style={{ maxWidth: '500px', margin: '0 auto' }}>
//             <h3 
//               style={{
//                 fontSize: '28px',
//                 fontWeight: '700',
//                 color: '#1a1a1a',
//                 marginBottom: '15px',
//                 lineHeight: '1.3'
//               }}
//             >
//               We Are Starting
//             </h3>
            
//             <h2 
//               style={{
//                 fontSize: '36px',
//                 fontWeight: '800',
//                 color: brandColor,
//                 marginBottom: '15px',
//                 lineHeight: '1.2'
//               }}
//             >
//               {clubInfo?.club_name || 'Akashbari Club'}
//             </h2>
            
//             <h3 
//               style={{
//                 fontSize: '28px',
//                 fontWeight: '700',
//                 color: '#1a1a1a',
//                 marginBottom: '20px'
//               }}
//             >
//               Membership
//             </h3>
            
//             <div 
//               style={{
//                 display: 'inline-block',
//                 backgroundColor: brandColor,
//                 color: 'white',
//                 padding: '8px 25px',
//                 margin: '15px 0',
//                 fontSize: '22px',
//                 fontWeight: 'bold'
//               }}
//             >
//               2027
//             </div>
            
//             <p 
//               style={{
//                 fontSize: '16px',
//                 color: '#666',
//                 lineHeight: '1.6',
//                 marginTop: '20px'
//               }}
//             >
//               Get ready to be part of an exclusive experience!
//             </p>
//           </div>
//         </Modal.Body>
        
//         <Modal.Footer 
//           style={{
//             borderTop: '1px solid #e0e0e0',
//             backgroundColor: '#ffffff',
//             justifyContent: 'center',
//             padding: '20px',
//             borderRadius: '0'
//           }}
//         >
//           <button
//             onClick={handleCloseModal}
//             style={{
//               backgroundColor: brandColor,
//               color: 'white',
//               border: 'none',
//               padding: '10px 30px',
//               fontSize: '14px',
//               fontWeight: '600',
//               cursor: 'pointer',
//               transition: 'all 0.3s ease'
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.backgroundColor = '#3d1f0a';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.backgroundColor = brandColor;
//             }}
//           >
//             Close
//           </button>
//         </Modal.Footer>
//       </Modal>

//       {/* Main Content Container */}
//       <div style={{ position: 'relative', zIndex: 1 }}>
//         {/* 1st section - Club Info */}
//         <section className="py-5" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
//           <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
//             <h3 className='text-center mt-1 mb-15 font-bw' style={{ marginBottom: '2rem', color: brandColor }}>
//               {clubInfo?.club_name || 'AKASHBARI CLUB'}
//             </h3>
//             <div className="row align-items-center">
//               <div className="col-lg-7 pe-lg-5 mb-4 mb-lg-0">
//                 <div style={{ position: 'relative', zIndex: 1 }}>
//                   <div style={{ position: 'absolute', top: '-20px', left: '-40px', width: '150px', height: '150px', border: `15px solid ${brandColor}26`, borderRadius: '50%', zIndex: -1 }} />
                  
//                   <p style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#e0e0e0', textAlign: 'justify' }}>
//                     {clubInfo?.club_history || 'No history available'}
//                   </p>
                  
//                   <div className="mt-4 d-inline-block">
//                     <a 
//                       href={`tel:${clubInfo?.club_phone || ''}`}
//                       className="d-flex align-items-center text-decoration-none"
//                       style={{ 
//                         color: brandColor, 
//                         fontSize: '1.1rem', 
//                         fontWeight: '500',
//                         transition: 'color 0.3s ease',
//                         letterSpacing: '0.5px'
//                       }}
//                       onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
//                       onMouseLeave={(e) => e.currentTarget.style.color = brandColor}
//                     >
//                       <span 
//                         className="d-flex align-items-center justify-content-center me-2"
//                         style={{
//                           backgroundColor: `${brandColor}26`,
//                           padding: '10px',
//                           borderRadius: '50%',
//                           width: '38px',
//                           height: '38px'
//                         }}
//                       >
//                         <FaPhoneAlt size={16} />
//                       </span>
//                       {clubInfo?.club_phone || 'No phone number available'}
//                     </a>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-lg-5">
//                 <div className="p-3" style={{ backgroundColor: '#262626', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: `1px solid ${brandColor}40` }}>
//                   <img 
//                     src={clubInfo?.image ? `${API_URL}/${clubInfo.image}` : 'https://i.ibb.co.com/F4wxhh4L/Whats-App-Image-2026-05-24-at-3-40-22-PM-1.jpg'} 
//                     alt={clubInfo?.club_name || 'Club Building'} 
//                     className="img-fluid w-100" 
//                     style={{ display: 'block', objectFit: 'cover', height: '420px' }}
//                     onError={(e) => {
//                       e.target.src = 'https://i.ibb.co.com/F4wxhh4L/Whats-App-Image-2026-05-24-at-3-40-22-PM-1.jpg';
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
      
//         {/* 2nd section - Services */}
//         <section className="py-5" style={{ backgroundColor: '#07111e', color: '#ffffff' }}>
//           <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
//             <div className="text-center mb-5">
//               <div className="mb-2"><FaGlassMartiniAlt size={24} style={{ color: brandColor }} /></div>
//               <h2 className="fw-bold mb-3" style={{ fontSize: '2.5rem', letterSpacing: '1px', color: brandColor }}>{servicesData.title}</h2>
//               <div className="row justify-content-center">
//                 <div className="col-md-8">
//                   <p style={{ color: '#7a8a9e', fontSize: '0.95rem', lineHeight: '1.6' }}>{servicesData.subtitle}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="row g-4">
//               {servicesData.services.map((service) => (
//                 <div key={service.id} className="col-md-6 col-lg-4">
//                   <div 
//                     className="p-4 h-100 d-flex align-items-start"
//                     style={{ backgroundColor: '#101c2c', borderRadius: '4px', transition: 'all 0.3s ease', cursor: 'pointer', borderLeft: `3px solid ${brandColor}` }}
//                     onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = brandColor; e.currentTarget.style.transform = 'translateY(-5px)'; }}
//                     onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#101c2c'; e.currentTarget.style.transform = 'translateY(0)'; }}
//                   >
//                     <div className="me-3 mt-1">{service.icon}</div>
//                     <div>
//                       <h5 className="fw-bold mb-2" style={{ fontSize: '1.1rem', letterSpacing: '0.5px' }}>{service.title}</h5>
//                       <p className="mb-0" style={{ color: '#a4b3c6', fontSize: '0.9rem', lineHeight: '1.5' }}>{service.description}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* 3rd section - Facilities Overview (Dynamic from Gallery API) */}
//         <section className="py-5" style={{ backgroundColor: '#111111', color: '#ffffff' }}>
//           <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
//             <div className="mb-4">
//               <h2 style={{ color: brandColor, fontFamily: 'serif', fontSize: '2.2rem', fontWeight: '300' }}>
//                 Facilities Overview
//               </h2>
//             </div>

//             {galleryLoading ? (
//               <div className="text-center py-5">
//                 <div className="spinner-border text-warning" role="status">
//                   <span className="visually-hidden">Loading facilities...</span>
//                 </div>
//                 <p className="mt-3">Loading gallery images...</p>
//               </div>
//             ) : galleryImages.length === 0 ? (
//               <div className="text-center py-5">
//                 <p>No facilities images available</p>
//               </div>
//             ) : (
//               <Swiper
//                 modules={[Autoplay, Navigation, Pagination]}
//                 spaceBetween={24} 
//                 slidesPerView={1}
//                 loop={true}
//                 autoplay={{ delay: 3500, disableOnInteraction: false }}
//                 navigation={true}
//                 pagination={{ clickable: true }}
//                 breakpoints={{
//                   640: { slidesPerView: 1 },
//                   768: { slidesPerView: 2 },
//                   1024: { slidesPerView: 3 },
//                 }}
//               >
//                 {galleryImages.map((image) => (
//                   <SwiperSlide key={image.id}>
//                     <div 
//                       className="position-relative overflow-hidden"
//                       style={{ 
//                         height: '400px', 
//                         cursor: 'pointer',
//                         role: 'group'
//                       }}
//                       onMouseEnter={(e) => {
//                         const overlay = e.currentTarget.querySelector('.facility-overlay');
//                         if (overlay) overlay.style.opacity = '0';
//                       }}
//                       onMouseLeave={(e) => {
//                         const overlay = e.currentTarget.querySelector('.facility-overlay');
//                         if (overlay) overlay.style.opacity = '1';
//                       }}
//                     >
//                       <img 
//                         src={getImageUrl(image.image)} 
//                         alt={image.title || 'Facility Image'} 
//                         className="w-100 h-100" 
//                         style={{ objectFit: 'cover', display: 'block' }}
//                         onError={(e) => {
//                           e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
//                         }}
//                       />

//                       <div 
//                         className="facility-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-4"
//                         style={{ 
//                           backgroundColor: `rgba(0, 0, 0, 0.65)`, 
//                           transition: 'all 0.4s ease-in-out',
//                           opacity: 1
//                         }}
//                       >
//                         <div 
//                           className="w-100 h-100 d-flex align-items-center justify-content-center"
//                           style={{ border: `1px solid ${brandColor}66` }}
//                         >
//                           <h4 
//                             className="fw-normal text-white text-center px-3" 
//                             style={{ letterSpacing: '2px', fontSize: '1.25rem', fontFamily: 'serif' }}
//                           >
//                             {image.title || 'Club Facility'}
//                           </h4>
//                         </div>
//                       </div>
//                     </div>
//                   </SwiperSlide>
//                 ))}
//               </Swiper>
//             )}
//           </div>
//         </section>

//         <Footer/>
//       </div>

//       {/* Styles */}
//       <style jsx="true">{`
//         @keyframes pulse {
//           0% { transform: scale(1); }
//           50% { transform: scale(1.1); }
//           100% { transform: scale(1); }
//         }
        
//         .modal-content-no-radius {
//           border-radius: 0 !important;
//         }
        
//         .modal-content-no-radius .modal-header,
//         .modal-content-no-radius .modal-body,
//         .modal-content-no-radius .modal-footer {
//           border-radius: 0 !important;
//         }
        
//         @media (max-width: 768px) {
//           .sticky-member-btn button {
//             width: 60px !important;
//             height: 60px !important;
//             margin-right: 20px !important;
//             margin-bottom: 20px !important;
//           }
//           .sticky-member-btn span {
//             font-size: 9px !important;
//           }
//           .sticky-member-btn span:first-of-type {
//             font-size: 16px !important;
//           }
//         }
//       `}</style>
//     </>
//   )
// }

// export default Club

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

/* ---------------------------------------------------------------------- */
/* Design tokens — "Art-deco private lounge"                              */
/* ---------------------------------------------------------------------- */
const theme = {
  bgDeep: '#0B0A08',
  bgPanel: '#141210',
  bgPanelAlt: '#181512',
  gold: '#C9A15C',
  goldSoft: 'rgba(201,161,92,0.16)',
  goldFaint: 'rgba(201,161,92,0.35)',
  mahogany: '#6B3315',
  ivory: '#F2ECDE',
  muted: '#A79E8E',
  mutedDim: '#7A7266',
  fontDisplay: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
  fontBody: "'Jost', 'Inter', -apple-system, sans-serif",
};

/* ---------------------------------------------------------------------- */
/* Ornamental components — the page's recurring signature motif           */
/* ---------------------------------------------------------------------- */

const DecoDivider = ({ color = theme.gold, width = 220 }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', width, maxWidth: '100%', margin: '0 auto' }}>
    <span style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${color})` }} />
    <svg width="14" height="14" viewBox="0 0 14 14">
      <path d="M7 0 L14 7 L7 14 L0 7 Z" fill="none" stroke={color} strokeWidth="1.2" />
    </svg>
    <span style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${color}, transparent)` }} />
  </div>
);

const CornerFrame = ({ color = theme.gold, size = 22 }) => {
  const corner = (rotate) => (
    <svg width={size} height={size} viewBox="0 0 22 22" style={{ position: 'absolute', transform: `rotate(${rotate}deg)` }}>
      <path d="M1 1 H10 M1 1 V10" stroke={color} strokeWidth="1.4" fill="none" />
    </svg>
  );
  return (
    <>
      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>{corner(0)}</div>
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>{corner(90)}</div>
      <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>{corner(180)}</div>
      <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>{corner(270)}</div>
    </>
  );
};

const SunburstBg = ({ opacity = 0.05 }) => (
  <svg
    width="900" height="900" viewBox="0 0 900 900"
    style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity, pointerEvents: 'none' }}
  >
    {Array.from({ length: 36 }).map((_, i) => (
      <line
        key={i}
        x1="450" y1="450"
        x2={450 + 440 * Math.cos((i * 10 * Math.PI) / 180)}
        y2={450 + 440 * Math.sin((i * 10 * Math.PI) / 180)}
        stroke={theme.gold}
        strokeWidth="1"
      />
    ))}
    <circle cx="450" cy="450" r="120" stroke={theme.gold} strokeWidth="1" fill="none" />
  </svg>
);

const Eyebrow = ({ children }) => (
  <div style={{
    fontFamily: theme.fontBody,
    fontSize: '0.72rem',
    letterSpacing: '0.32em',
    textTransform: 'uppercase',
    color: theme.gold,
    fontWeight: 500,
  }}>
    {children}
  </div>
);

const Club = () => {
  const brandColor = theme.gold; // kept for backward reference in icon props below
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
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/800x600?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;

    const cleanPath = imagePath.replace(/^\/+/, '');
    const baseUrl = API_URL.replace('/api', '');
    return `${baseUrl}/storage/${cleanPath}`;
  };

  // Services Data
  const servicesData = {
    title: "Our Services",
    subtitle: "Rem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    services: [
      { id: 1, title: "CORPORATE EVENTS", description: "Lor sit amet, ctetur adipisicing elit, sed deiusmod tempor incididunt ut labore et", icon: <FaBuilding size={26} style={{ color: theme.gold }} /> },
      { id: 2, title: "BRANDED EVENTS", description: "Dolor sit amet, tetur adipisicing elit, sed do eiu smod temporin cididunt ut labore", icon: <FaMask size={26} style={{ color: theme.gold }} /> },
      { id: 3, title: "COMMERCIAL SHOOTS", description: "Dolor sit amet, tetur adipisicing elit, sed do eiu smod temporin cididunt ut labore", icon: <FaCamera size={26} style={{ color: theme.gold }} /> },
      { id: 4, title: "HAN PARTIES", description: "Psum dolor sit amet, ctetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et", icon: <FaCocktail size={26} style={{ color: theme.gold }} /> },
      { id: 5, title: "BIRTHDAY PARTIES", description: "Olor sit tetur adicing elit, sed do eiusmod tempor incididunt ut labore et", icon: <FaBirthdayCake size={26} style={{ color: theme.gold }} /> },
      { id: 6, title: "VIP SERVICE", description: "Isum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut", icon: <FaCrown size={26} style={{ color: theme.gold }} /> }
    ]
  };

  const fontImport = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Jost:wght@300;400;500&display=swap');
    `}</style>
  );

  // Show loading state
  if (loading) {
    return (
      <>
        {fontImport}
        <Header/>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.bgDeep,
          color: theme.ivory,
          fontFamily: theme.fontBody
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '38px', height: '38px', margin: '0 auto 20px',
              border: `2px solid ${theme.goldSoft}`, borderTop: `2px solid ${theme.gold}`,
              borderRadius: '50%', animation: 'deco-spin 0.9s linear infinite'
            }} />
            <p style={{ letterSpacing: '0.1em', fontSize: '0.85rem', color: theme.muted }}>Loading club information…</p>
          </div>
          <style>{`@keyframes deco-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
        <Footer/>
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        {fontImport}
        <Header/>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.bgDeep,
          color: theme.ivory,
          fontFamily: theme.fontBody
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#D98A6E', marginBottom: '20px', letterSpacing: '0.04em' }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: 'transparent',
                color: theme.gold,
                border: `1px solid ${theme.gold}`,
                padding: '12px 30px',
                letterSpacing: '0.12em',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.gold; e.currentTarget.style.color = theme.bgDeep; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = theme.gold; }}
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
      {fontImport}
      <Header/>

      {/* Sticky Membership Button */}
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
        <div style={{ position: 'relative', width: '74px', height: '74px' }}>
          <div style={{
            position: 'absolute', inset: '-6px',
            border: `1px solid ${theme.goldFaint}`,
            borderRadius: '50%',
            animation: 'pulse-ring 2.4s ease-out infinite'
          }} />
          <button
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              backgroundColor: theme.bgPanel,
              border: `1.5px solid ${theme.gold}`,
              color: theme.gold,
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              fontFamily: theme.fontDisplay
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.gold;
              e.currentTarget.style.color = theme.bgDeep;
              e.currentTarget.style.transform = 'scale(1.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.bgPanel;
              e.currentTarget.style.color = theme.gold;
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FaPhoneAlt size={18} />
            <span style={{ fontSize: '9px', letterSpacing: '1.4px' }}>MEMBER</span>
          </button>
        </div>
      </div>

      {/* Modal Component — styled as an engraved membership card */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        size="lg"
        contentClassName="modal-content-no-radius"
      >
        <Modal.Header
          style={{
            borderBottom: `1px solid ${theme.gold}`,
            backgroundColor: theme.bgDeep,
            color: theme.ivory,
            padding: '22px 32px',
            borderRadius: '0',
            fontFamily: theme.fontDisplay
          }}
        >
          <Modal.Title
            style={{
              fontSize: '22px',
              fontWeight: '700',
              letterSpacing: '1.5px',
              textTransform: 'uppercase'
            }}
          >
            {clubInfo?.club_name || 'Akashbari Club'}
          </Modal.Title>
          <button
            onClick={handleCloseModal}
            style={{
              background: 'none',
              border: 'none',
              color: theme.ivory,
              fontSize: '18px',
              cursor: 'pointer',
              transition: '0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = theme.gold}
            onMouseLeave={(e) => e.currentTarget.style.color = theme.ivory}
          >
            <FaTimes />
          </button>
        </Modal.Header>

        <Modal.Body
          style={{
            backgroundColor: theme.bgPanel,
            padding: '54px 40px',
            textAlign: 'center',
            borderRadius: '0',
            position: 'relative',
            fontFamily: theme.fontBody
          }}
        >
          <div style={{ position: 'absolute', inset: '14px', border: `1px solid ${theme.goldFaint}`, pointerEvents: 'none' }} />
          <CornerFrame />

          <div style={{ maxWidth: '460px', margin: '0 auto', position: 'relative' }}>
            <Eyebrow>We Are Starting</Eyebrow>

            <h2
              style={{
                fontFamily: theme.fontDisplay,
                fontSize: '2.4rem',
                fontWeight: '700',
                color: theme.gold,
                margin: '14px 0',
                lineHeight: '1.15'
              }}
            >
              {clubInfo?.club_name || 'Akashbari Club'}
            </h2>

            <h3
              style={{
                fontFamily: theme.fontDisplay,
                fontSize: '1.4rem',
                fontWeight: '500',
                fontStyle: 'italic',
                color: theme.ivory,
                marginBottom: '26px'
              }}
            >
              Membership
            </h3>

            <DecoDivider width={140} />

            <div
              style={{
                display: 'inline-block',
                border: `1px solid ${theme.gold}`,
                color: theme.gold,
                padding: '10px 34px',
                margin: '26px 0',
                fontFamily: theme.fontDisplay,
                fontSize: '1.5rem',
                fontWeight: 'bold',
                letterSpacing: '2px'
              }}
            >
              2027
            </div>

            <p
              style={{
                fontSize: '0.95rem',
                color: theme.muted,
                lineHeight: '1.7',
                marginTop: '10px'
              }}
            >
              Get ready to be part of an exclusive experience!
            </p>
          </div>
        </Modal.Body>

        <Modal.Footer
          style={{
            borderTop: `1px solid ${theme.goldSoft}`,
            backgroundColor: theme.bgPanel,
            justifyContent: 'center',
            padding: '20px',
            borderRadius: '0'
          }}
        >
          <button
            onClick={handleCloseModal}
            style={{
              backgroundColor: 'transparent',
              color: theme.gold,
              border: `1px solid ${theme.gold}`,
              padding: '10px 34px',
              fontSize: '0.78rem',
              fontWeight: '600',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: theme.fontBody
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.gold; e.currentTarget.style.color = theme.bgDeep; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = theme.gold; }}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>

      {/* Main Content Container */}
      <div style={{ position: 'relative', zIndex: 1, backgroundColor: theme.bgDeep, fontFamily: theme.fontBody }}>

        {/* 1st section — Club Info */}
        <section style={{ backgroundColor: theme.bgDeep, color: theme.ivory, padding: '90px 0', position: 'relative', overflow: 'hidden' }}>
          <SunburstBg />
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <Eyebrow>Est. Private Members' Lounge</Eyebrow>
              <h1
                className="font-bw"
                style={{
                  fontFamily: theme.fontDisplay,
                  fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
                  fontWeight: 700,
                  color: theme.ivory,
                  margin: '14px 0 20px',
                  letterSpacing: '0.5px'
                }}
              >
                {clubInfo?.club_name || 'Akashbari Club'}
              </h1>
              <DecoDivider />
            </div>

            <div className="row align-items-center">
              <div className="col-lg-7 pe-lg-5 mb-4 mb-lg-0">
                <p style={{ lineHeight: '1.9', fontSize: '1.05rem', color: '#CFC6B6', textAlign: 'justify' }}>
                  {clubInfo?.club_history || 'No history available'}
                </p>

                <div className="mt-4 d-inline-block">
                  <a
                    href={`tel:${clubInfo?.club_phone || ''}`}
                    className="d-flex align-items-center text-decoration-none"
                    style={{
                      color: theme.gold,
                      fontSize: '1.02rem',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      letterSpacing: '0.06em',
                      border: `1px solid ${theme.goldFaint}`,
                      padding: '10px 22px 10px 10px'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.gold; e.currentTarget.style.color = theme.ivory; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.goldFaint; e.currentTarget.style.color = theme.gold; }}
                  >
                    <span
                      className="d-flex align-items-center justify-content-center me-3"
                      style={{
                        backgroundColor: theme.goldSoft,
                        borderRadius: '50%',
                        width: '38px',
                        height: '38px'
                      }}
                    >
                      <FaPhoneAlt size={15} />
                    </span>
                    {clubInfo?.club_phone || 'No phone number available'}
                  </a>
                </div>
              </div>

              <div className="col-lg-5">
                <div style={{ position: 'relative', padding: '14px' }}>
                  <div style={{ position: 'absolute', inset: 0, border: `1px solid ${theme.goldFaint}` }} />
                  <CornerFrame />
                  <div style={{ backgroundColor: theme.bgPanel, boxShadow: '0 20px 50px rgba(0,0,0,0.55)' }}>
                    <img
                      src={clubInfo?.image ? `${API_URL}/${clubInfo.image}` : 'https://i.ibb.co.com/F4wxhh4L/Whats-App-Image-2026-05-24-at-3-40-22-PM-1.jpg'}
                      alt={clubInfo?.club_name || 'Club Building'}
                      className="img-fluid w-100"
                      style={{ display: 'block', objectFit: 'cover', height: '420px', filter: 'saturate(0.92) contrast(1.05)' }}
                      onError={(e) => {
                        e.target.src = 'https://i.ibb.co.com/F4wxhh4L/Whats-App-Image-2026-05-24-at-3-40-22-PM-1.jpg';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2nd section — Services */}
        <section style={{ backgroundColor: theme.bgPanel, color: '#ffffff', padding: '90px 0', borderTop: `1px solid ${theme.goldSoft}`, borderBottom: `1px solid ${theme.goldSoft}` }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <div className="text-center mb-5">
              <div className="mb-3"><FaGlassMartiniAlt size={20} style={{ color: theme.gold }} /></div>
              <h2
                className="fw-bold mb-3"
                style={{ fontFamily: theme.fontDisplay, fontSize: '2.4rem', letterSpacing: '1px', color: theme.ivory }}
              >
                {servicesData.title}
              </h2>
              <DecoDivider width={140} />
              <div className="row justify-content-center mt-3">
                <div className="col-md-8">
                  <p style={{ color: theme.mutedDim, fontSize: '0.95rem', lineHeight: '1.7' }}>{servicesData.subtitle}</p>
                </div>
              </div>
            </div>
            <div className="row g-4">
              {servicesData.services.map((service) => (
                <div key={service.id} className="col-md-6 col-lg-4">
                  <div
                    className="p-4 h-100 d-flex align-items-start service-card"
                    style={{
                      backgroundColor: theme.bgPanelAlt,
                      transition: 'all 0.35s ease',
                      cursor: 'pointer',
                      border: `1px solid ${theme.goldSoft}`,
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = theme.gold;
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = `0 16px 30px -12px rgba(201,161,92,0.25)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = theme.goldSoft;
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      className="me-3 d-flex align-items-center justify-content-center"
                      style={{ width: '52px', height: '52px', borderRadius: '50%', border: `1px solid ${theme.goldFaint}`, flexShrink: 0 }}
                    >
                      {service.icon}
                    </div>
                    <div>
                      <h5 className="fw-bold mb-2" style={{ fontFamily: theme.fontBody, fontSize: '0.98rem', letterSpacing: '0.08em', color: theme.ivory }}>
                        {service.title}
                      </h5>
                      <p className="mb-0" style={{ color: theme.mutedDim, fontSize: '0.88rem', lineHeight: '1.6' }}>{service.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3rd section — Facilities Overview (Dynamic from Gallery API) */}
        <section style={{ backgroundColor: theme.bgDeep, color: '#ffffff', padding: '90px 0' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <div className="text-center mb-5">
              <Eyebrow>Behind the Velvet Rope</Eyebrow>
              <h2 style={{ color: theme.ivory, fontFamily: theme.fontDisplay, fontSize: '2.3rem', fontWeight: '600', margin: '14px 0 20px' }}>
                Facilities Overview
              </h2>
              <DecoDivider width={140} />
            </div>

            {galleryLoading ? (
              <div className="text-center py-5">
                <div style={{
                  width: '34px', height: '34px', margin: '0 auto',
                  border: `2px solid ${theme.goldSoft}`, borderTop: `2px solid ${theme.gold}`,
                  borderRadius: '50%', animation: 'deco-spin 0.9s linear infinite'
                }} />
                <p className="mt-3" style={{ color: theme.muted }}>Loading gallery images…</p>
                <style>{`@keyframes deco-spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : galleryImages.length === 0 ? (
              <div className="text-center py-5">
                <p style={{ color: theme.muted }}>No facilities images available</p>
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
                      className="position-relative overflow-hidden facility-slide"
                      style={{ height: '400px', cursor: 'pointer', border: `1px solid ${theme.goldSoft}` }}
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
                      <div style={{
                        position: 'absolute', left: 0, right: 0, bottom: 0,
                        background: 'linear-gradient(to top, rgba(11,10,8,0.92), transparent)',
                        padding: '38px 20px 16px',
                        display: 'flex', alignItems: 'center', gap: '10px'
                      }}>
                        <span style={{ width: '18px', height: '1px', backgroundColor: theme.gold }} />
                        <h4
                          className="fw-normal text-white mb-0"
                          style={{ letterSpacing: '1.5px', fontSize: '1rem', fontFamily: theme.fontDisplay, textTransform: 'uppercase' }}
                        >
                          {image.title || 'Club Facility'}
                        </h4>
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
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.9; }
          70% { transform: scale(1.25); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0; }
        }

        .modal-content-no-radius {
          border-radius: 0 !important;
        }

        .modal-content-no-radius .modal-header,
        .modal-content-no-radius .modal-body,
        .modal-content-no-radius .modal-footer {
          border-radius: 0 !important;
        }

        .swiper-button-next, .swiper-button-prev {
          color: ${theme.gold} !important;
        }
        .swiper-pagination-bullet {
          background: ${theme.gold} !important;
          opacity: 0.4;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .sticky-member-btn > div {
            width: 58px !important;
            height: 58px !important;
          }
          .sticky-member-btn button {
            width: 58px !important;
            height: 58px !important;
          }
          .sticky-member-btn span {
            font-size: 8px !important;
          }
        }
      `}</style>
    </>
  )
}

export default Club