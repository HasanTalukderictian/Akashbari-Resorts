

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

// /* ---------------------------------------------------------------------- */
// /* Design tokens — "Art-deco private lounge"                              */
// /* ---------------------------------------------------------------------- */
// const theme = {
//   bgDeep: '#0B0A08',
//   bgPanel: '#141210',
//   bgPanelAlt: '#181512',
//   gold: '#C9A15C',
//   goldSoft: 'rgba(201,161,92,0.16)',
//   goldFaint: 'rgba(201,161,92,0.35)',
//   mahogany: '#6B3315',
//   ivory: '#F2ECDE',
//   muted: '#A79E8E',
//   mutedDim: '#7A7266',
//   fontDisplay: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
//   fontBody: "'Jost', 'Inter', -apple-system, sans-serif",
// };

// /* ---------------------------------------------------------------------- */
// /* Ornamental components — the page's recurring signature motif           */
// /* ---------------------------------------------------------------------- */

// const DecoDivider = ({ color = theme.gold, width = 220 }) => (
//   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', width, maxWidth: '100%', margin: '0 auto' }}>
//     <span style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${color})` }} />
//     <svg width="14" height="14" viewBox="0 0 14 14">
//       <path d="M7 0 L14 7 L7 14 L0 7 Z" fill="none" stroke={color} strokeWidth="1.2" />
//     </svg>
//     <span style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${color}, transparent)` }} />
//   </div>
// );

// const CornerFrame = ({ color = theme.gold, size = 22 }) => {
//   const corner = (rotate) => (
//     <svg width={size} height={size} viewBox="0 0 22 22" style={{ position: 'absolute', transform: `rotate(${rotate}deg)` }}>
//       <path d="M1 1 H10 M1 1 V10" stroke={color} strokeWidth="1.4" fill="none" />
//     </svg>
//   );
//   return (
//     <>
//       <div style={{ position: 'absolute', top: '10px', left: '10px' }}>{corner(0)}</div>
//       <div style={{ position: 'absolute', top: '10px', right: '10px' }}>{corner(90)}</div>
//       <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>{corner(180)}</div>
//       <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>{corner(270)}</div>
//     </>
//   );
// };

// const SunburstBg = ({ opacity = 0.05 }) => (
//   <svg
//     width="900" height="900" viewBox="0 0 900 900"
//     style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity, pointerEvents: 'none' }}
//   >
//     {Array.from({ length: 36 }).map((_, i) => (
//       <line
//         key={i}
//         x1="450" y1="450"
//         x2={450 + 440 * Math.cos((i * 10 * Math.PI) / 180)}
//         y2={450 + 440 * Math.sin((i * 10 * Math.PI) / 180)}
//         stroke={theme.gold}
//         strokeWidth="1"
//       />
//     ))}
//     <circle cx="450" cy="450" r="120" stroke={theme.gold} strokeWidth="1" fill="none" />
//   </svg>
// );

// const Eyebrow = ({ children }) => (
//   <div style={{
//     fontFamily: theme.fontBody,
//     fontSize: '0.72rem',
//     letterSpacing: '0.32em',
//     textTransform: 'uppercase',
//     color: theme.gold,
//     fontWeight: 500,
//   }}>
//     {children}
//   </div>
// );

// const Club = () => {
//   const brandColor = theme.gold; // kept for backward reference in icon props below
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
//       { id: 1, title: "CORPORATE EVENTS", description: "Lor sit amet, ctetur adipisicing elit, sed deiusmod tempor incididunt ut labore et", icon: <FaBuilding size={26} style={{ color: theme.gold }} /> },
//       { id: 2, title: "BRANDED EVENTS", description: "Dolor sit amet, tetur adipisicing elit, sed do eiu smod temporin cididunt ut labore", icon: <FaMask size={26} style={{ color: theme.gold }} /> },
//       { id: 3, title: "COMMERCIAL SHOOTS", description: "Dolor sit amet, tetur adipisicing elit, sed do eiu smod temporin cididunt ut labore", icon: <FaCamera size={26} style={{ color: theme.gold }} /> },
//       { id: 4, title: "HAN PARTIES", description: "Psum dolor sit amet, ctetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et", icon: <FaCocktail size={26} style={{ color: theme.gold }} /> },
//       { id: 5, title: "BIRTHDAY PARTIES", description: "Olor sit tetur adicing elit, sed do eiusmod tempor incididunt ut labore et", icon: <FaBirthdayCake size={26} style={{ color: theme.gold }} /> },
//       { id: 6, title: "VIP SERVICE", description: "Isum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut", icon: <FaCrown size={26} style={{ color: theme.gold }} /> }
//     ]
//   };

//   const fontImport = (
//     <style>{`
//       @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Jost:wght@300;400;500&display=swap');
//     `}</style>
//   );

//   // Show loading state
//   if (loading) {
//     return (
//       <>
//         {fontImport}
//         <Header/>
//         <div style={{
//           minHeight: '100vh',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           backgroundColor: theme.bgDeep,
//           color: theme.ivory,
//           fontFamily: theme.fontBody
//         }}>
//           <div style={{ textAlign: 'center' }}>
//             <div style={{
//               width: '38px', height: '38px', margin: '0 auto 20px',
//               border: `2px solid ${theme.goldSoft}`, borderTop: `2px solid ${theme.gold}`,
//               borderRadius: '50%', animation: 'deco-spin 0.9s linear infinite'
//             }} />
//             <p style={{ letterSpacing: '0.1em', fontSize: '0.85rem', color: theme.muted }}>Loading club information…</p>
//           </div>
//           <style>{`@keyframes deco-spin { to { transform: rotate(360deg); } }`}</style>
//         </div>
//         <Footer/>
//       </>
//     );
//   }

//   // Show error state
//   if (error) {
//     return (
//       <>
//         {fontImport}
//         <Header/>
//         <div style={{
//           minHeight: '100vh',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           backgroundColor: theme.bgDeep,
//           color: theme.ivory,
//           fontFamily: theme.fontBody
//         }}>
//           <div style={{ textAlign: 'center' }}>
//             <p style={{ color: '#D98A6E', marginBottom: '20px', letterSpacing: '0.04em' }}>{error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               style={{
//                 backgroundColor: 'transparent',
//                 color: theme.gold,
//                 border: `1px solid ${theme.gold}`,
//                 padding: '12px 30px',
//                 letterSpacing: '0.12em',
//                 fontSize: '0.8rem',
//                 textTransform: 'uppercase',
//                 cursor: 'pointer',
//                 transition: 'all 0.3s ease'
//               }}
//               onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.gold; e.currentTarget.style.color = theme.bgDeep; }}
//               onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = theme.gold; }}
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
//       {fontImport}
//       <Header/>

//       {/* Sticky Membership Button */}
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
//         <div style={{ position: 'relative', width: '74px', height: '74px' }}>
//           <div style={{
//             position: 'absolute', inset: '-6px',
//             border: `1px solid ${theme.goldFaint}`,
//             borderRadius: '50%',
//             animation: 'pulse-ring 2.4s ease-out infinite'
//           }} />
//           <button
//             style={{
//               width: '74px',
//               height: '74px',
//               borderRadius: '50%',
//               backgroundColor: theme.bgPanel,
//               border: `1.5px solid ${theme.gold}`,
//               color: theme.gold,
//               fontSize: '14px',
//               fontWeight: 'bold',
//               cursor: 'pointer',
//               transition: 'all 0.3s ease',
//               boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               justifyContent: 'center',
//               gap: '5px',
//               fontFamily: theme.fontDisplay
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.backgroundColor = theme.gold;
//               e.currentTarget.style.color = theme.bgDeep;
//               e.currentTarget.style.transform = 'scale(1.06)';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.backgroundColor = theme.bgPanel;
//               e.currentTarget.style.color = theme.gold;
//               e.currentTarget.style.transform = 'scale(1)';
//             }}
//           >
//             <FaPhoneAlt size={18} />
//             <span style={{ fontSize: '9px', letterSpacing: '1.4px' }}>MEMBER</span>
//           </button>
//         </div>
//       </div>

//       {/* Modal Component — styled as an engraved membership card */}
//       <Modal
//         show={showModal}
//         onHide={handleCloseModal}
//         centered
//         size="lg"
//         contentClassName="modal-content-no-radius"
//       >
//         <Modal.Header
//           style={{
//             borderBottom: `1px solid ${theme.gold}`,
//             backgroundColor: theme.bgDeep,
//             color: theme.ivory,
//             padding: '22px 32px',
//             borderRadius: '0',
//             fontFamily: theme.fontDisplay
//           }}
//         >
//           <Modal.Title
//             style={{
//               fontSize: '22px',
//               fontWeight: '700',
//               letterSpacing: '1.5px',
//               textTransform: 'uppercase'
//             }}
//           >
//             {clubInfo?.club_name || 'Akashbari Club'}
//           </Modal.Title>
//           <button
//             onClick={handleCloseModal}
//             style={{
//               background: 'none',
//               border: 'none',
//               color: theme.ivory,
//               fontSize: '18px',
//               cursor: 'pointer',
//               transition: '0.3s'
//             }}
//             onMouseEnter={(e) => e.currentTarget.style.color = theme.gold}
//             onMouseLeave={(e) => e.currentTarget.style.color = theme.ivory}
//           >
//             <FaTimes />
//           </button>
//         </Modal.Header>

//         <Modal.Body
//           style={{
//             backgroundColor: theme.bgPanel,
//             padding: '54px 40px',
//             textAlign: 'center',
//             borderRadius: '0',
//             position: 'relative',
//             fontFamily: theme.fontBody
//           }}
//         >
//           <div style={{ position: 'absolute', inset: '14px', border: `1px solid ${theme.goldFaint}`, pointerEvents: 'none' }} />
//           <CornerFrame />

//           <div style={{ maxWidth: '460px', margin: '0 auto', position: 'relative' }}>
//             <Eyebrow>We Are Starting</Eyebrow>

//             <h2
//               style={{
//                 fontFamily: theme.fontDisplay,
//                 fontSize: '2.4rem',
//                 fontWeight: '700',
//                 color: theme.gold,
//                 margin: '14px 0',
//                 lineHeight: '1.15'
//               }}
//             >
//               {clubInfo?.club_name || 'Akashbari Club'}
//             </h2>

//             <h3
//               style={{
//                 fontFamily: theme.fontDisplay,
//                 fontSize: '1.4rem',
//                 fontWeight: '500',
//                 fontStyle: 'italic',
//                 color: theme.ivory,
//                 marginBottom: '26px'
//               }}
//             >
//               Membership
//             </h3>

//             <DecoDivider width={140} />

//             <div
//               style={{
//                 display: 'inline-block',
//                 border: `1px solid ${theme.gold}`,
//                 color: theme.gold,
//                 padding: '10px 34px',
//                 margin: '26px 0',
//                 fontFamily: theme.fontDisplay,
//                 fontSize: '1.5rem',
//                 fontWeight: 'bold',
//                 letterSpacing: '2px'
//               }}
//             >
//               2027
//             </div>

//             <p
//               style={{
//                 fontSize: '0.95rem',
//                 color: theme.muted,
//                 lineHeight: '1.7',
//                 marginTop: '10px'
//               }}
//             >
//               Get ready to be part of an exclusive experience!
//             </p>
//           </div>
//         </Modal.Body>

//         <Modal.Footer
//           style={{
//             borderTop: `1px solid ${theme.goldSoft}`,
//             backgroundColor: theme.bgPanel,
//             justifyContent: 'center',
//             padding: '20px',
//             borderRadius: '0'
//           }}
//         >
//           <button
//             onClick={handleCloseModal}
//             style={{
//               backgroundColor: 'transparent',
//               color: theme.gold,
//               border: `1px solid ${theme.gold}`,
//               padding: '10px 34px',
//               fontSize: '0.78rem',
//               fontWeight: '600',
//               letterSpacing: '0.14em',
//               textTransform: 'uppercase',
//               cursor: 'pointer',
//               transition: 'all 0.3s ease',
//               fontFamily: theme.fontBody
//             }}
//             onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.gold; e.currentTarget.style.color = theme.bgDeep; }}
//             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = theme.gold; }}
//           >
//             Close
//           </button>
//         </Modal.Footer>
//       </Modal>

//       {/* Main Content Container */}
//       <div style={{ position: 'relative', zIndex: 1, backgroundColor: theme.bgDeep, fontFamily: theme.fontBody }}>

//         {/* 1st section — Club Info */}
//         <section style={{ backgroundColor: theme.bgDeep, color: theme.ivory, padding: '90px 0', position: 'relative', overflow: 'hidden' }}>
//           <SunburstBg />
//           <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative' }}>
//             <div style={{ textAlign: 'center', marginBottom: '56px' }}>
//               <Eyebrow>Est. Private Members' Lounge</Eyebrow>
//               <h1
//                 className="font-bw"
//                 style={{
//                   fontFamily: theme.fontDisplay,
//                   fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
//                   fontWeight: 700,
//                   color: theme.ivory,
//                   margin: '14px 0 20px',
//                   letterSpacing: '0.5px'
//                 }}
//               >
//                 {clubInfo?.club_name || 'Akashbari Club'}
//               </h1>
//               <DecoDivider />
//             </div>

//             <div className="row align-items-center">
//               <div className="col-lg-7 pe-lg-5 mb-4 mb-lg-0">
//                 <p style={{ lineHeight: '1.9', fontSize: '1.05rem', color: '#CFC6B6', textAlign: 'justify' }}>
//                   {clubInfo?.club_history || 'No history available'}
//                 </p>

//                 <div className="mt-4 d-inline-block">
//                   <a
//                     href={`tel:${clubInfo?.club_phone || ''}`}
//                     className="d-flex align-items-center text-decoration-none"
//                     style={{
//                       color: theme.gold,
//                       fontSize: '1.02rem',
//                       fontWeight: '500',
//                       transition: 'all 0.3s ease',
//                       letterSpacing: '0.06em',
//                       border: `1px solid ${theme.goldFaint}`,
//                       padding: '10px 22px 10px 10px'
//                     }}
//                     onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.gold; e.currentTarget.style.color = theme.ivory; }}
//                     onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.goldFaint; e.currentTarget.style.color = theme.gold; }}
//                   >
//                     <span
//                       className="d-flex align-items-center justify-content-center me-3"
//                       style={{
//                         backgroundColor: theme.goldSoft,
//                         borderRadius: '50%',
//                         width: '38px',
//                         height: '38px'
//                       }}
//                     >
//                       <FaPhoneAlt size={15} />
//                     </span>
//                     {clubInfo?.club_phone || 'No phone number available'}
//                   </a>
//                 </div>
//               </div>

//               <div className="col-lg-5">
//                 <div style={{ position: 'relative', padding: '14px' }}>
//                   <div style={{ position: 'absolute', inset: 0, border: `1px solid ${theme.goldFaint}` }} />
//                   <CornerFrame />
//                   <div style={{ backgroundColor: theme.bgPanel, boxShadow: '0 20px 50px rgba(0,0,0,0.55)' }}>
//                     <img
//                       src={clubInfo?.image ? `${API_URL}/${clubInfo.image}` : 'https://i.ibb.co.com/F4wxhh4L/Whats-App-Image-2026-05-24-at-3-40-22-PM-1.jpg'}
//                       alt={clubInfo?.club_name || 'Club Building'}
//                       className="img-fluid w-100"
//                       style={{ display: 'block', objectFit: 'cover', height: '420px', filter: 'saturate(0.92) contrast(1.05)' }}
//                       onError={(e) => {
//                         e.target.src = 'https://i.ibb.co.com/F4wxhh4L/Whats-App-Image-2026-05-24-at-3-40-22-PM-1.jpg';
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* 2nd section — Services */}
//         <section style={{ backgroundColor: theme.bgPanel, color: '#ffffff', padding: '90px 0', borderTop: `1px solid ${theme.goldSoft}`, borderBottom: `1px solid ${theme.goldSoft}` }}>
//           <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
//             <div className="text-center mb-5">
//               <div className="mb-3"><FaGlassMartiniAlt size={20} style={{ color: theme.gold }} /></div>
//               <h2
//                 className="fw-bold mb-3"
//                 style={{ fontFamily: theme.fontDisplay, fontSize: '2.4rem', letterSpacing: '1px', color: theme.ivory }}
//               >
//                 {servicesData.title}
//               </h2>
//               <DecoDivider width={140} />
//               <div className="row justify-content-center mt-3">
//                 <div className="col-md-8">
//                   <p style={{ color: theme.mutedDim, fontSize: '0.95rem', lineHeight: '1.7' }}>{servicesData.subtitle}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="row g-4">
//               {servicesData.services.map((service) => (
//                 <div key={service.id} className="col-md-6 col-lg-4">
//                   <div
//                     className="p-4 h-100 d-flex align-items-start service-card"
//                     style={{
//                       backgroundColor: theme.bgPanelAlt,
//                       transition: 'all 0.35s ease',
//                       cursor: 'pointer',
//                       border: `1px solid ${theme.goldSoft}`,
//                       position: 'relative'
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.borderColor = theme.gold;
//                       e.currentTarget.style.transform = 'translateY(-6px)';
//                       e.currentTarget.style.boxShadow = `0 16px 30px -12px rgba(201,161,92,0.25)`;
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.borderColor = theme.goldSoft;
//                       e.currentTarget.style.transform = 'translateY(0)';
//                       e.currentTarget.style.boxShadow = 'none';
//                     }}
//                   >
//                     <div
//                       className="me-3 d-flex align-items-center justify-content-center"
//                       style={{ width: '52px', height: '52px', borderRadius: '50%', border: `1px solid ${theme.goldFaint}`, flexShrink: 0 }}
//                     >
//                       {service.icon}
//                     </div>
//                     <div>
//                       <h5 className="fw-bold mb-2" style={{ fontFamily: theme.fontBody, fontSize: '0.98rem', letterSpacing: '0.08em', color: theme.ivory }}>
//                         {service.title}
//                       </h5>
//                       <p className="mb-0" style={{ color: theme.mutedDim, fontSize: '0.88rem', lineHeight: '1.6' }}>{service.description}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* 3rd section — Facilities Overview (Dynamic from Gallery API) */}
//         <section style={{ backgroundColor: theme.bgDeep, color: '#ffffff', padding: '90px 0' }}>
//           <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
//             <div className="text-center mb-5">
//               <Eyebrow>Behind the Velvet Rope</Eyebrow>
//               <h2 style={{ color: theme.ivory, fontFamily: theme.fontDisplay, fontSize: '2.3rem', fontWeight: '600', margin: '14px 0 20px' }}>
//                 Facilities Overview
//               </h2>
//               <DecoDivider width={140} />
//             </div>

//             {galleryLoading ? (
//               <div className="text-center py-5">
//                 <div style={{
//                   width: '34px', height: '34px', margin: '0 auto',
//                   border: `2px solid ${theme.goldSoft}`, borderTop: `2px solid ${theme.gold}`,
//                   borderRadius: '50%', animation: 'deco-spin 0.9s linear infinite'
//                 }} />
//                 <p className="mt-3" style={{ color: theme.muted }}>Loading gallery images…</p>
//                 <style>{`@keyframes deco-spin { to { transform: rotate(360deg); } }`}</style>
//               </div>
//             ) : galleryImages.length === 0 ? (
//               <div className="text-center py-5">
//                 <p style={{ color: theme.muted }}>No facilities images available</p>
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
//                       className="position-relative overflow-hidden facility-slide"
//                       style={{ height: '400px', cursor: 'pointer', border: `1px solid ${theme.goldSoft}` }}
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
//                       <div style={{
//                         position: 'absolute', left: 0, right: 0, bottom: 0,
//                         background: 'linear-gradient(to top, rgba(11,10,8,0.92), transparent)',
//                         padding: '38px 20px 16px',
//                         display: 'flex', alignItems: 'center', gap: '10px'
//                       }}>
//                         <span style={{ width: '18px', height: '1px', backgroundColor: theme.gold }} />
//                         <h4
//                           className="fw-normal text-white mb-0"
//                           style={{ letterSpacing: '1.5px', fontSize: '1rem', fontFamily: theme.fontDisplay, textTransform: 'uppercase' }}
//                         >
//                           {image.title || 'Club Facility'}
//                         </h4>
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
//         @keyframes pulse-ring {
//           0% { transform: scale(0.95); opacity: 0.9; }
//           70% { transform: scale(1.25); opacity: 0; }
//           100% { transform: scale(0.95); opacity: 0; }
//         }

//         .modal-content-no-radius {
//           border-radius: 0 !important;
//         }

//         .modal-content-no-radius .modal-header,
//         .modal-content-no-radius .modal-body,
//         .modal-content-no-radius .modal-footer {
//           border-radius: 0 !important;
//         }

//         .swiper-button-next, .swiper-button-prev {
//           color: ${theme.gold} !important;
//         }
//         .swiper-pagination-bullet {
//           background: ${theme.gold} !important;
//           opacity: 0.4;
//         }
//         .swiper-pagination-bullet-active {
//           opacity: 1;
//         }

//         @media (max-width: 768px) {
//           .sticky-member-btn > div {
//             width: 58px !important;
//             height: 58px !important;
//           }
//           .sticky-member-btn button {
//             width: 58px !important;
//             height: 58px !important;
//           }
//           .sticky-member-btn span {
//             font-size: 8px !important;
//           }
//         }
//       `}</style>
//     </>
//   )
// }

// export default Club



import React, { useEffect, useState } from 'react';
import Header from './Common/Header';
import Footer from './Common/Footer';
import {
  FaBuilding, FaMask, FaCamera, FaCocktail, FaBirthdayCake,
  FaCrown, FaPhoneAlt, FaTimes,
} from 'react-icons/fa';
import { Modal } from 'react-bootstrap';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

/* ---------- Colors (আগের মতোই) ---------- */
const C = {
  bg: '#0B0A08',
  panel: '#141210',
  panelAlt: '#181512',
  gold: '#C9A15C',
  goldSoft: 'rgba(201,161,92,0.16)',
  goldLine: 'rgba(201,161,92,0.35)',
  ivory: '#F2ECDE',
  muted: '#A79E8E',
  mutedDim: '#7A7266',
};

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const STORAGE_BASE = (API_BASE_URL || '').replace(/\/api\/?$/, '');
const FALLBACK_CLUB_IMAGE = 'https://i.ibb.co.com/F4wxhh4L/Whats-App-Image-2026-05-24-at-3-40-22-PM-1.jpg';

const PLACEHOLDER =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <rect width="100%" height="100%" fill="${C.panel}"/>
      <text x="50%" y="50%" fill="${C.gold}" font-family="sans-serif" font-size="22"
        text-anchor="middle" dominant-baseline="middle">No Image</text>
    </svg>`
  );

// Laravel storage path → full URL
const getImageUrl = (path, fallback = PLACEHOLDER) => {
  if (!path) return fallback;
  if (path.startsWith('http')) return path;
  const clean = path.replace(/^\/+/, '').replace(/^storage\//, '');
  return `${STORAGE_BASE}/storage/${clean}`;
};

const SERVICES = [
  { id: 1, title: 'Corporate Events', icon: FaBuilding, text: 'Meetings, conferences and corporate gatherings in a refined private setting.' },
  { id: 2, title: 'Branded Events', icon: FaMask, text: 'Product launches and brand experiences tailored to your identity.' },
  { id: 3, title: 'Commercial Shoots', icon: FaCamera, text: 'Elegant interiors and scenic spaces for photo and video production.' },
  { id: 4, title: 'Private Parties', icon: FaCocktail, text: 'Exclusive evenings with curated drinks, music and hospitality.' },
  { id: 5, title: 'Birthday Parties', icon: FaBirthdayCake, text: 'Memorable celebrations planned and hosted with care.' },
  { id: 6, title: 'VIP Service', icon: FaCrown, text: 'Dedicated attention and premium amenities for our members.' },
];

const Spinner = ({ text }) => (
  <div className="club-loading">
    <div className="club-spinner" />
    {text && <p>{text}</p>}
  </div>
);

const SectionTitle = ({ eyebrow, title, subtitle }) => (
  <div className="club-section-title">
    {eyebrow && <span className="club-eyebrow">{eyebrow}</span>}
    <h2>{title}</h2>
    <span className="club-line" />
    {subtitle && <p>{subtitle}</p>}
  </div>
);

const Club = () => {
  const [showModal, setShowModal] = useState(false);
  const [clubInfo, setClubInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const fetchClubInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/club-infos`);
      const result = await res.json();

      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        setClubInfo(result.data[0]);
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

  const fetchGallery = async () => {
    try {
      setGalleryLoading(true);
      const res = await fetch(`${API_BASE_URL}/club-gallery`);
      const result = await res.json();
      // { data: { data: [...] } } (paginated) অথবা { data: [...] } দুটোই সামলায়
      const list = result?.data?.data || (Array.isArray(result?.data) ? result.data : []);
      setGalleryImages(result.success ? list : []);
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setGalleryImages([]);
    } finally {
      setGalleryLoading(false);
    }
  };

  useEffect(() => {
    fetchClubInfo();
    fetchGallery();
  }, []);

  const clubName = clubInfo?.club_name || 'Akashbari Club';
  const clubPhone = clubInfo?.club_phone;

  return (
    <>
      <Header />

      <main className="club-page">
        {loading ? (
          <Spinner text="Loading club information…" />
        ) : error ? (
          <div className="club-loading">
            <p className="club-error">{error}</p>
            <button className="club-btn club-btn-outline" onClick={fetchClubInfo}>Try Again</button>
          </div>
        ) : (
          <>
            {/* ---------- 1. Club Info ---------- */}
            <section className="club-hero">
              <div className="container">
                <div className="row align-items-center g-5">
                  <div className="col-lg-6">
                    <span className="club-eyebrow">Private Members' Lounge</span>
                    <h1 className="club-hero-title">{clubName}</h1>
                    <span className="club-line club-line-left" />

                    <p className="club-hero-text">
                      {clubInfo?.club_history || 'No history available'}
                    </p>

                    <div className="club-hero-actions">
                      <button className="club-btn club-btn-solid" onClick={() => setShowModal(true)}>
                        <FaCrown /> Membership
                      </button>
                      {clubPhone && (
                        <a href={`tel:${clubPhone}`} className="club-btn club-btn-outline">
                          <FaPhoneAlt /> {clubPhone}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="club-hero-img">
                      <img
                        src={getImageUrl(clubInfo?.image, FALLBACK_CLUB_IMAGE)}
                        alt={clubName}
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_CLUB_IMAGE; }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ---------- 2. Services ---------- */}
            <section className="club-section club-section-alt">
              <div className="container">
                <SectionTitle
                  eyebrow="What We Offer"
                  title="Our Services"
                  subtitle="From corporate gatherings to private celebrations, every occasion is hosted with comfort, privacy and attention to detail."
                />

                <div className="row g-4">
                  {SERVICES.map(({ id, title, text, icon: Icon }) => (
                    <div key={id} className="col-md-6 col-lg-4">
                      <div className="club-service">
                        <div className="club-service-icon"><Icon size={22} /></div>
                        <h5>{title}</h5>
                        <p>{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ---------- 3. Facilities (Gallery API) ---------- */}
            <section className="club-section">
              <div className="container">
                <SectionTitle eyebrow="Inside the Club" title="Facilities Overview" />

                {galleryLoading ? (
                  <Spinner text="Loading gallery…" />
                ) : galleryImages.length === 0 ? (
                  <p className="text-center" style={{ color: C.muted }}>No facilities images available</p>
                ) : (
                  <Swiper
                    className="club-swiper"
                    modules={[Autoplay, Navigation, Pagination]}
                    spaceBetween={20}
                    slidesPerView={1}
                    loop={galleryImages.length > 3}
                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                    navigation
                    pagination={{ clickable: true }}
                    breakpoints={{
                      768: { slidesPerView: 2 },
                      1024: { slidesPerView: 3 },
                    }}
                  >
                    {galleryImages.map((image) => (
                      <SwiperSlide key={image.id}>
                        <div className="club-facility">
                          <img
                            src={getImageUrl(image.image)}
                            alt={image.title || 'Club Facility'}
                            loading="lazy"
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER; }}
                          />
                          <div className="club-facility-caption">
                            {image.title || 'Club Facility'}
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />

      {/* ---------- Floating Membership button ---------- */}
      {!loading && !error && (
        <button className="club-fab" onClick={() => setShowModal(true)} aria-label="Membership">
          <FaCrown />
          <span>Membership</span>
        </button>
      )}

      {/* ---------- Membership Modal ---------- */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        contentClassName="club-modal"
      >
        <button className="club-modal-close" onClick={() => setShowModal(false)} aria-label="Close">
          <FaTimes />
        </button>

        <div className="club-modal-body">
          <div className="club-modal-icon"><FaCrown size={22} /></div>
          <span className="club-eyebrow">Coming Soon</span>
          <h3>{clubName}</h3>
          <p className="club-modal-sub">Membership</p>
          <div className="club-modal-year">2027</div>
          <p className="club-modal-text">Get ready to be part of an exclusive experience!</p>

          <div className="club-modal-actions">
            {clubPhone && (
              <a href={`tel:${clubPhone}`} className="club-btn club-btn-solid">
                <FaPhoneAlt /> Call Us
              </a>
            )}
            <button className="club-btn club-btn-outline" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      </Modal>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Jost:wght@300;400;500;600&display=swap');

        .club-page {
          background: ${C.bg};
          color: ${C.ivory};
          font-family: 'Jost', 'Inter', sans-serif;
          min-height: 60vh;
        }
        .club-page h1, .club-page h2, .club-page h3,
        .club-modal h3 {
          font-family: 'Playfair Display', Georgia, serif;
        }

        /* ---------- Shared ---------- */
        .club-eyebrow {
          display: inline-block;
          font-size: 0.72rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: ${C.gold};
          font-weight: 500;
        }
        .club-line {
          display: block;
          width: 60px;
          height: 2px;
          margin: 18px auto;
          background: ${C.gold};
        }
        .club-line-left { margin-left: 0; }

        .club-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 26px;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .club-btn-solid {
          background: ${C.gold};
          color: ${C.bg};
          border: 1px solid ${C.gold};
        }
        .club-btn-solid:hover {
          background: transparent;
          color: ${C.gold};
        }
        .club-btn-outline {
          background: transparent;
          color: ${C.gold};
          border: 1px solid ${C.goldLine};
        }
        .club-btn-outline:hover {
          border-color: ${C.gold};
          background: ${C.goldSoft};
          color: ${C.ivory};
        }

        .club-loading {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: ${C.muted};
          text-align: center;
        }
        .club-error { color: #D98A6E; margin: 0; }
        .club-spinner {
          width: 36px;
          height: 36px;
          border: 2px solid ${C.goldSoft};
          border-top-color: ${C.gold};
          border-radius: 50%;
          animation: club-spin 0.9s linear infinite;
        }
        @keyframes club-spin { to { transform: rotate(360deg); } }

        /* ---------- Hero ---------- */
        .club-hero { padding: 90px 0; }
        .club-hero-title {
          font-size: clamp(2.2rem, 5vw, 3.4rem);
          font-weight: 700;
          margin: 12px 0 0;
          color: ${C.ivory};
        }
        .club-hero-text {
          color: #CFC6B6;
          font-size: 1.02rem;
          line-height: 1.85;
          margin-bottom: 30px;
          white-space: pre-line;
        }
        .club-hero-actions { display: flex; flex-wrap: wrap; gap: 12px; }

        .club-hero-img {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid ${C.goldLine};
          box-shadow: 0 24px 60px rgba(0,0,0,0.5);
        }
        .club-hero-img img {
          display: block;
          width: 100%;
          height: 440px;
          object-fit: cover;
        }

        /* ---------- Sections ---------- */
        .club-section { padding: 90px 0; }
        .club-section-alt {
          background: ${C.panel};
          border-top: 1px solid ${C.goldSoft};
          border-bottom: 1px solid ${C.goldSoft};
        }
        .club-section-title { text-align: center; margin-bottom: 48px; }
        .club-section-title h2 {
          font-size: clamp(1.9rem, 4vw, 2.4rem);
          font-weight: 700;
          color: ${C.ivory};
          margin: 10px 0 0;
        }
        .club-section-title p {
          max-width: 620px;
          margin: 0 auto;
          color: ${C.muted};
          font-size: 0.95rem;
          line-height: 1.7;
        }

        /* ---------- Service card ---------- */
        .club-service {
          height: 100%;
          padding: 28px;
          border-radius: 14px;
          background: ${C.panelAlt};
          border: 1px solid ${C.goldSoft};
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .club-service:hover {
          transform: translateY(-5px);
          border-color: ${C.gold};
          box-shadow: 0 16px 30px -14px rgba(201,161,92,0.35);
        }
        .club-service-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${C.goldSoft};
          color: ${C.gold};
          margin-bottom: 18px;
        }
        .club-service h5 {
          font-size: 1.02rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: ${C.ivory};
          margin-bottom: 8px;
        }
        .club-service p {
          margin: 0;
          color: ${C.mutedDim};
          font-size: 0.9rem;
          line-height: 1.6;
        }

        /* ---------- Facilities slider ---------- */
        .club-swiper { padding-bottom: 46px !important; }
        .club-facility {
          position: relative;
          height: 380px;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid ${C.goldSoft};
        }
        .club-facility img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
        }
        .club-facility:hover img { transform: scale(1.05); }
        .club-facility-caption {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          padding: 40px 20px 16px;
          background: linear-gradient(to top, rgba(11,10,8,0.9), transparent);
          color: ${C.ivory};
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1rem;
          letter-spacing: 0.04em;
        }
        .club-swiper .swiper-button-next,
        .club-swiper .swiper-button-prev {
          color: ${C.gold};
          transform: scale(0.7);
        }
        .club-swiper .swiper-pagination-bullet { background: ${C.gold}; opacity: 0.35; }
        .club-swiper .swiper-pagination-bullet-active { opacity: 1; }

        /* ---------- Floating button ---------- */
        .club-fab {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 1000;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 999px;
          background: ${C.gold};
          color: ${C.bg};
          border: none;
          font-family: 'Jost', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          box-shadow: 0 10px 28px rgba(0,0,0,0.45);
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .club-fab:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 34px rgba(201,161,92,0.35);
        }

        /* ---------- Modal ---------- */
        .club-modal {
          position: relative;
          background: ${C.panel} !important;
          color: ${C.ivory};
          border: 1px solid ${C.goldLine} !important;
          border-radius: 18px !important;
          font-family: 'Jost', sans-serif;
          overflow: hidden;
        }
        .club-modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid ${C.goldSoft};
          background: transparent;
          color: ${C.muted};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 1;
        }
        .club-modal-close:hover { color: ${C.gold}; border-color: ${C.gold}; }
        .club-modal-body { padding: 48px 32px 36px; text-align: center; }
        .club-modal-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${C.goldSoft};
          color: ${C.gold};
        }
        .club-modal h3 {
          font-size: 2rem;
          font-weight: 700;
          color: ${C.gold};
          margin: 10px 0 4px;
        }
        .club-modal-sub { color: ${C.ivory}; font-style: italic; margin-bottom: 18px; }
        .club-modal-year {
          display: inline-block;
          padding: 6px 26px;
          border-radius: 999px;
          border: 1px solid ${C.gold};
          color: ${C.gold};
          font-size: 1.3rem;
          font-weight: 700;
          letter-spacing: 0.12em;
        }
        .club-modal-text { color: ${C.muted}; margin: 18px 0 26px; }
        .club-modal-actions { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; }

        /* ---------- Responsive ---------- */
        @media (max-width: 991px) {
          .club-hero { padding: 60px 0; }
          .club-hero-img img { height: 340px; }
          .club-section { padding: 64px 0; }
        }
        @media (max-width: 576px) {
          .club-hero-img img { height: 260px; }
          .club-facility { height: 300px; }
          .club-service { padding: 22px; }
          .club-fab { right: 16px; bottom: 16px; padding: 11px 16px; }
          .club-fab span { display: none; }
          .club-modal-body { padding: 44px 20px 28px; }
          .club-modal h3 { font-size: 1.6rem; }
        }
      `}</style>
    </>
  );
};

export default Club;