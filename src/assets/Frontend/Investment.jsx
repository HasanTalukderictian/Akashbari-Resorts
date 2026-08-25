// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../css/investmentcopy.css';
// import axios from 'axios';

// // CountUpItem component
// const CountUpItem = ({ target, duration = 2000, suffix = "", prefix = "" }) => {
//     const [count, setCount] = useState(0);

//     useEffect(() => {
//         let startTimestamp = null;
//         const step = (timestamp) => {
//             if (!startTimestamp) startTimestamp = timestamp;
//             const progress = Math.min((timestamp - startTimestamp) / duration, 1);
//             const currentCount = Math.floor(progress * target);
//             setCount(currentCount);

//             if (progress < 1) {
//                 window.requestAnimationFrame(step);
//             }
//         };
//         window.requestAnimationFrame(step);
//     }, [target, duration]);

//     return (
//         <h2 className="fw-bold" style={{ color: '#5e2e10' }}>
//             {prefix}{count.toLocaleString()}{suffix}
//         </h2>
//     );
// };

// const Investment = ({ showOnlyBenefits = false }) => {
//     const navigate = useNavigate();
//     const [packages, setPackages] = useState([]);
//     const [benefits, setBenefits] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [combinedData, setCombinedData] = useState({
//         record_members: [],
//         invest_records: []
//     });
//     const [error, setError] = useState(null);

//     const BASE_URL = import.meta.env.VITE_BASE_URL;
//     const API_URL = `${BASE_URL}/get-investment`;
//     const BENEFITS_API_URL = `${BASE_URL}/get-investment-benefits`;

//     const statsCardStyle = {
//         backgroundColor: '#ffffff',
//         borderRadius: '15px',
//         padding: '40px 20px',
//         boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
//         marginTop: '0',
//         position: 'relative',
//         zIndex: '10',
//         border: '1px solid #eef2f6'
//     };

//     // Subtitle mapping based on design image
//     const getSubTitle = (title) => {
//         const upperTitle = title?.toUpperCase().trim() || '';
//         if (upperTitle.includes('PRESIDENTIAL')) return 'exclusive apartment';
//         if (upperTitle.includes('EARTH')) return 'different touch';
//         if (upperTitle.includes('EXECUTIVE')) return 'smart looks';
//         if (upperTitle.includes('SUPERIOR')) return 'Lake view';
//         return '';
//     };

//     // Fetch investment packages
//     const fetchPackages = async () => {
//         try {
//             const response = await fetch(API_URL);
//             const result = await response.json();

//             if (result.status) {
//                 let allPackages = result.data;

//                 const getOrderIndex = (title) => {
//                     const upperTitle = title?.toUpperCase().trim();
//                     if (upperTitle?.includes('PRESIDENTIAL')) return 0;
//                     if (upperTitle?.includes('EARTH')) return 1;
//                     if (upperTitle?.includes('EXECUTIVE')) return 2;
//                     if (upperTitle?.includes('SUPERIOR')) return 3;
//                     if (upperTitle?.includes('VILLA')) return 4;
//                     return 999;
//                 };

//                 allPackages = allPackages.sort((a, b) => {
//                     return getOrderIndex(a.title) - getOrderIndex(b.title);
//                 });

//                 setPackages(allPackages);
//             }
//         } catch (error) {
//             console.error("Error fetching packages:", error);
//             setError('Failed to load packages');
//         }
//     };

//     // Fetch investment benefits
//     const fetchBenefits = async () => {
//         try {
//             const response = await fetch(BENEFITS_API_URL);
//             const result = await response.json();

//             if (result.status && result.data && result.data.data) {
//                 const benefitsData = result.data.data;
//                 if (benefitsData.length > 0 && benefitsData[0].benefits) {
//                     setBenefits(benefitsData[0].benefits);
//                 } else {
//                     setBenefits([]);
//                 }
//             } else {
//                 setBenefits([]);
//             }
//         } catch (error) {
//             console.error("Error fetching benefits:", error);
//             setBenefits([]);
//         }
//     };

//     // Fetch combined data for stats
//     const fetchCombinedData = async () => {
//         try {
//             const response = await axios.get(`${BASE_URL}/combined-records`, {
//                 headers: {
//                     'Accept': 'application/json',
//                 }
//             });

//             if (response.data.status === true && response.data.data) {
//                 setCombinedData({
//                     record_members: response.data.data.record_members || [],
//                     invest_records: response.data.data.invest_records || []
//                 });
//                 setError(null);
//             } else {
//                 setCombinedData({
//                     record_members: [],
//                     invest_records: []
//                 });
//             }
//         } catch (error) {
//             console.error('Error fetching combined data:', error);
//             setError('Failed to load data. Please try again later.');
//         }
//     };

//     useEffect(() => {
//         const fetchAllData = async () => {
//             setLoading(true);
//             await Promise.all([
//                 fetchPackages(),
//                 fetchBenefits(),
//                 fetchCombinedData()
//             ]);
//             setLoading(false);
//         };

//         fetchAllData();
//     }, []);

//     const handleCardClick = (pkg) => {
//         if (pkg.is_sold_out != 1) {
//             navigate(`/package-details/${pkg.id}`, { state: { packageData: pkg } });
//         }
//     };

//     const getStatsData = () => {
//         const member = combinedData.record_members[0] || {};
//         return [
//             { id: 1, target: parseInt(member.member) || 0, suffix: "+", prefix: "", label: "Happy Members" },
//             { id: 2, target: parseInt(member.revenue) || 0, suffix: "%", prefix: "Up to ", label: "Yearly Revenue" },
//             { id: 3, target: parseInt(member.amenities) || 0, suffix: "+", prefix: "", label: "Club Amenities" },
//             { id: 4, target: parseInt(member.expericence) || 0, suffix: "+", prefix: "", label: "Years of Trust" }
//         ];
//     };

//     const statsData = getStatsData();

//     if (loading) {
//         return <div className="text-center py-5">Loading Investment Packages...</div>;
//     }

//     if (error) {
//         return <div className="text-center py-5 text-danger">{error}</div>;
//     }

//     // Filter active (available) packages for the bottom grid
//     const availablePackages = packages.filter(pkg => pkg.is_sold_out != 1);

//     return (
//         <>
//             <section className="investment-section py-5">
//                 <div className="container text-center">

//                     {!showOnlyBenefits && (
//                         <>
//                             <div className="badge-opportunity mb-3">INVESTMENT OPPORTUNITIES</div>
//                             <h1 className="main-title mb-2 desktop-only">RESORT INVESTMENT PACKAGES</h1>
//                             <p className="sub-text mb-5 desktop-only">Become a partner in Bangladesh's premier luxury resort destination</p>

//                             {/* Top Category Header Row (As shown in design image) */}
//                             <div className="row g-0 mb-4 border border-dark rounded overflow-hidden">
//                                 {packages.map((pkg, index) => {
//                                     const isSoldOut = pkg.is_sold_out == 1;
//                                     const subTitle = getSubTitle(pkg.title);

//                                     return (
//                                         <div 
//                                             key={pkg.id || index} 
//                                             className={`col ${index !== packages.length - 1 ? 'border-end border-dark' : ''} p-3 d-flex flex-column align-items-center justify-content-between`}
//                                             style={{ backgroundColor: '#fff', minHeight: '130px' }}
//                                         >
//                                             <h6 className="fw-bold text-uppercase mb-2 text-dark" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>
//                                                 {pkg.title}
//                                             </h6>

//                                             {isSoldOut ? (
//                                                 <div 
//                                                     className="w-100 py-2 text-white fw-bold fst-italic" 
//                                                     style={{ backgroundColor: '#ff0000', borderRadius: '2px', fontSize: '1.1rem' }}
//                                                 >
//                                                     Sold Out
//                                                 </div>
//                                             ) : (
//                                                 subTitle && (
//                                                     <div 
//                                                         className="w-100 py-2 border border-dark text-dark fw-normal fst-italic"
//                                                         style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem' }}
//                                                     >
//                                                         {subTitle}
//                                                     </div>
//                                                 )
//                                             )}
//                                         </div>
//                                     );
//                                 })}
//                             </div>

                          
//                            {/* Main Investment Cards Grid */}
// <div className="row g-0 border border-dark rounded overflow-hidden mb-5">
//     {availablePackages.map((pkg, index) => {
//         // SUPERIOR DELUXE এর জন্য Popular চেক
//         const isPopular = pkg.title?.toUpperCase().includes('SUPERIOR');

//         return (
//             <div 
//                 className={`col-md-3 ${index !== availablePackages.length - 1 ? 'border-end border-dark' : ''} text-start p-4 bg-white clickable-card position-relative`}
//                 key={pkg.id || index}
//                 onClick={() => handleCardClick(pkg)}
//                 style={{ cursor: 'pointer' }}
//             >
//                 {/* Popular Badge (Top Right Corner) */}
//                 {isPopular && (
//                     <span className="popular-badge">
//                         Popular
//                     </span>
//                 )}

//                 {/* Title */}
//                 <h5 className="fw-bold text-uppercase mb-4 text-dark pe-4" style={{ minHeight: '3px', color: '#5e2e10', border: 'none', borderBottom: 'none' }}>
//                     {pkg.title}
//                 </h5>

//                 {/* Price */}
//                 <div className="mb-3">
//                     <span className="fw-bold fs-5 text-dark">
//                         Share Price:৳ {parseInt(pkg.share_price || 0).toLocaleString()}
//                     </span>
//                 </div>

//                 {/* Cashback Offer */}
//                 <p className="mb-2 fw-bold text-dark fs-6">
//                     Discount Price: ৳ {parseInt(pkg.price || 0).toLocaleString()}
//                 </p>

//                 {/* Installment Size */}
//                 <p className="mb-2 fw-bold fs-6" style={{ color: '#639c4e' }}>   
//                     Full Payment Price: ৳ {parseInt(pkg.discount || 0).toLocaleString()}
//                 </p>

//                 {/* Land & Building Area */}
//                 <p className="mb-2 text-dark fs-6">
//                     Land & Building Area: {pkg.land || 'N/A'}
//                 </p>
                
//                 {/* Amnities (Truncated/Shortened text) */}
//                 <p className="mb-2 text-dark fs-6" title={pkg.description}>
//                     Amnities : {pkg.description ? (pkg.description.length > 30 ? `${pkg.description.slice(0, 30)}...` : pkg.description) : 'N/A'}
//                 </p>
               
//             </div>
//         );
//     })}
// </div>
//                         </>
//                     )}

//                     {/* STATS SECTION */}
//                     {!showOnlyBenefits && (
//                         <div className="container my-5" style={{ marginTop: '0', paddingTop: '20px' }}>
//                             <div className="row justify-content-center">
//                                 <div className="col-lg-11">
//                                     <div style={statsCardStyle} className="text-center">
//                                         <div className="row g-4">
//                                             {statsData.map((stat, index) => (
//                                                 <div key={stat.id} className={`col-md-3 ${index !== statsData.length - 1 ? 'border-end' : ''}`} style={{ borderColor: '#e2e8f0' }}>
//                                                     {stat.target > 0 ? (
//                                                         <CountUpItem
//                                                             target={stat.target}
//                                                             suffix={stat.suffix}
//                                                             prefix={stat.prefix}
//                                                         />
//                                                     ) : (
//                                                         <h2 className="fw-bold" style={{ color: '#5e2e10' }}>
//                                                             {stat.prefix}0{stat.suffix}
//                                                         </h2>
//                                                     )}
//                                                     <p className="fw-bold mb-0" style={{ color: '#718096' }}>{stat.label}</p>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* BENEFITS SECTION */}
//                 {benefits.length > 0 && (
//                     <div className="benefits-container container p-5 bg-white" id="investment-benefits">
//                         <h2 className='display-4 fw-normal text-uppercase mb-2 text-center'>Investment Benefits</h2>
//                         <div className="yellow-divider mx-auto mb-4"></div>
//                         <div className="row g-3">
//                             {benefits.map((benefit, index) => (
//                                 <div className="col-12 col-md-6" key={index}>
//                                     <div className="benefit-item d-flex align-items-center">
//                                         <span className="benefit-number">{String(index + 1).padStart(2, '0')}</span>
//                                         <span className="benefit-text">{benefit}</span>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="footer-promo text-center mt-5">
//                             <h4 className="promo-question">Ready to Secure Your Future?</h4>
//                             <p className="promo-text">Join hundreds of successful investors who have already secured their financial future with Akashbari Hotels & Resorts.</p>
//                         </div>
//                     </div>
//                 )}
//             </section>
//         </>
//     );
// };

// export default Investment;



// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../css/investmentcopy.css';
// import axios from 'axios';

// // CountUpItem component
// const CountUpItem = ({ target, duration = 2000, suffix = "", prefix = "" }) => {
//     const [count, setCount] = useState(0);

//     useEffect(() => {
//         let startTimestamp = null;
//         const step = (timestamp) => {
//             if (!startTimestamp) startTimestamp = timestamp;
//             const progress = Math.min((timestamp - startTimestamp) / duration, 1);
//             const currentCount = Math.floor(progress * target);
//             setCount(currentCount);

//             if (progress < 1) {
//                 window.requestAnimationFrame(step);
//             }
//         };
//         window.requestAnimationFrame(step);
//     }, [target, duration]);

//     return (
//         <h2 className="fw-bold" style={{ color: '#5e2e10' }}>
//             {prefix}{count.toLocaleString()}{suffix}
//         </h2>
//     );
// };

// const Investment = ({ showOnlyBenefits = false }) => {
//     const navigate = useNavigate();
//     const [packages, setPackages] = useState([]);
//     const [benefits, setBenefits] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [combinedData, setCombinedData] = useState({
//         record_members: [],
//         invest_records: []
//     });
//     const [error, setError] = useState(null);

//     const BASE_URL = import.meta.env.VITE_BASE_URL;
//     const API_URL = `${BASE_URL}/get-investment`;
//     const BENEFITS_API_URL = `${BASE_URL}/get-investment-benefits`;

//     const statsCardStyle = {
//         backgroundColor: '#ffffff',
//         borderRadius: '15px',
//         padding: '40px 20px',
//         boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
//         marginTop: '0',
//         position: 'relative',
//         zIndex: '10',
//         border: '1px solid #eef2f6'
//     };

//     // Subtitle mapping based on design image
//     const getSubTitle = (title) => {
//         const upperTitle = title?.toUpperCase().trim() || '';
//         if (upperTitle.includes('PRESIDENTIAL')) return 'Exclusive Apartment';
//         if (upperTitle.includes('EARTH')) return 'Fifferent Touch';
//         if (upperTitle.includes('EXECUTIVE')) return 'Smart Looks';
//         if (upperTitle.includes('SUPERIOR')) return 'Lake View';
//         return '';
//     };

//     // Fetch investment packages
//     const fetchPackages = async () => {
//         try {
//             const response = await fetch(API_URL);
//             const result = await response.json();

//             if (result.status) {
//                 let allPackages = result.data;

//                 // Villa-কে সবার শেষে রাখার জন্য Sorting Order
//                 const getOrderIndex = (title) => {
//                     const upperTitle = title?.toUpperCase().trim();
//                     if (upperTitle?.includes('PRESIDENTIAL')) return 0;
//                     if (upperTitle?.includes('EARTH')) return 1;
//                     if (upperTitle?.includes('EXECUTIVE')) return 2;
//                     if (upperTitle?.includes('SUPERIOR')) return 3;
//                     if (upperTitle?.includes('VILLA')) return 999; // Villa-কে একদম শেষে দেওয়া হলো
//                     return 500;
//                 };

//                 allPackages = allPackages.sort((a, b) => {
//                     return getOrderIndex(a.title) - getOrderIndex(b.title);
//                 });

//                 setPackages(allPackages);
//             }
//         } catch (error) {
//             console.error("Error fetching packages:", error);
//             setError('Failed to load packages');
//         }
//     };

//     // Fetch investment benefits
//     const fetchBenefits = async () => {
//         try {
//             const response = await fetch(BENEFITS_API_URL);
//             const result = await response.json();

//             if (result.status && result.data && result.data.data) {
//                 const benefitsData = result.data.data;
//                 if (benefitsData.length > 0 && benefitsData[0].benefits) {
//                     setBenefits(benefitsData[0].benefits);
//                 } else {
//                     setBenefits([]);
//                 }
//             } else {
//                 setBenefits([]);
//             }
//         } catch (error) {
//             console.error("Error fetching benefits:", error);
//             setBenefits([]);
//         }
//     };

//     // Fetch combined data for stats
//     const fetchCombinedData = async () => {
//         try {
//             const response = await axios.get(`${BASE_URL}/combined-records`, {
//                 headers: {
//                     'Accept': 'application/json',
//                 }
//             });

//             if (response.data.status === true && response.data.data) {
//                 setCombinedData({
//                     record_members: response.data.data.record_members || [],
//                     invest_records: response.data.data.invest_records || []
//                 });
//                 setError(null);
//             } else {
//                 setCombinedData({
//                     record_members: [],
//                     invest_records: []
//                 });
//             }
//         } catch (error) {
//             console.error('Error fetching combined data:', error);
//             setError('Failed to load data. Please try again later.');
//         }
//     };

//     useEffect(() => {
//         const fetchAllData = async () => {
//             setLoading(true);
//             await Promise.all([
//                 fetchPackages(),
//                 fetchBenefits(),
//                 fetchCombinedData()
//             ]);
//             setLoading(false);
//         };

//         fetchAllData();
//     }, []);

//     const handleCardClick = (pkg) => {
//         if (pkg.is_sold_out != 1) {
//             navigate(`/package-details/${pkg.id}`, { state: { packageData: pkg } });
//         }
//     };

//     const getStatsData = () => {
//         const member = combinedData.record_members[0] || {};
//         return [
//             { id: 1, target: parseInt(member.member) || 0, suffix: "+", prefix: "", label: "Happy Members" },
//             { id: 2, target: parseInt(member.revenue) || 0, suffix: "%", prefix: "Up to ", label: "Yearly Revenue" },
//             { id: 3, target: parseInt(member.amenities) || 0, suffix: "+", prefix: "", label: "Club Amenities" },
//             { id: 4, target: parseInt(member.expericence) || 0, suffix: "+", prefix: "", label: "Years of Trust" }
//         ];
//     };

//     const statsData = getStatsData();

//     if (loading) {
//         return <div className="text-center py-5">Loading Investment Packages...</div>;
//     }

//     if (error) {
//         return <div className="text-center py-5 text-danger">{error}</div>;
//     }

//     // Filter active (available) packages for the bottom grid
//     const availablePackages = packages.filter(pkg => pkg.is_sold_out != 1);

//     return (
//         <>
//             <section className="investment-section py-5">
//                 <div className="container text-center">

//                     {!showOnlyBenefits && (
//                         <>
//                             <div className="badge-opportunity mb-3">INVESTMENT OPPORTUNITIES</div>
//                             <h1 className="main-title mb-2 desktop-only">RESORT INVESTMENT PACKAGES</h1>
//                             <p className="sub-text mb-5 desktop-only">Become a partner in Bangladesh's premier luxury resort destination</p>

//                             {/* Top Category Header Row */}
//                             <div className="row g-0 mb-4 border border-dark rounded overflow-hidden">
//                                 {packages.map((pkg, index) => {
//                                     const isSoldOut = pkg.is_sold_out == 1;
//                                     const subTitle = getSubTitle(pkg.title);

//                                     return (
//                                         <div 
//                                             key={pkg.id || index} 
//                                             className={`col ${index !== packages.length - 1 ? 'border-end border-dark' : ''} p-3 d-flex flex-column align-items-center justify-content-between`}
//                                             style={{ backgroundColor: '#fff', minHeight: '130px' }}
//                                         >
//                                             <h6 className="fw-bold text-uppercase mb-2 text-dark" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>
//                                                 {pkg.title}
//                                             </h6>

//                                             {isSoldOut ? (
//                                                 <div 
//                                                     className="w-100 py-2 text-white fw-bold fst-italic" 
//                                                     style={{ backgroundColor: '#ff0000', borderRadius: '2px', fontSize: '1.1rem' }}
//                                                 >
//                                                     Sold Out
//                                                 </div>
//                                             ) : (
//                                                 subTitle && (
//                                                     <div 
//                                                         className="w-100 py-2 border border-dark text-dark fw-normal fst-italic"
//                                                         style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem' }}
//                                                     >
//                                                         {subTitle}
//                                                     </div>
//                                                 )
//                                             )}
//                                         </div>
//                                     );
//                                 })}
//                             </div>

//                             {/* Main Investment Cards Grid */}
//                            <div className="row g-3 mb-5">
//     {packages.map((pkg, index) => {
//         // SUPERIOR DELUXE এর জন্য Popular চেক
//         const isPopular = pkg.title?.toUpperCase().includes('SUPERIOR');
//         // Villa চেক
//         const isVilla = pkg.title?.toUpperCase().includes('VILLA');
//         // Sold Out চেক
//         const isSoldOut = pkg.is_sold_out == 1;

//         return (
//             <div 
//                 className={`col ${index !== packages.length - 1 ? '' : ''} text-start p-3 bg-white clickable-card position-relative d-flex flex-column justify-content-between ${isSoldOut ? 'opacity-75' : ''}`}
//                 key={pkg.id || index}
//                 onClick={() => !isSoldOut && handleCardClick(pkg)}
//                 style={{ 
//                     cursor: isSoldOut ? 'default' : 'pointer',
//                     minHeight: '380px',
//                     height: 'auto',
//                     border: '1px solid #dee2e6',
//                     borderRadius: '8px',
//                     boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
//                 }}
//             >
//                 <div>
//                     {/* Popular Badge (Top Right Corner) */}
//                     {isPopular && (
//                         <span className="popular-badge" style={{
//                             position: 'absolute',
//                             top: '8px',
//                             right: '8px',
//                             backgroundColor: '#ffc107',
//                             color: '#000',
//                             padding: '2px 10px',
//                             borderRadius: '3px',
//                             fontSize: '10px',
//                             fontWeight: 'bold',
//                             textTransform: 'uppercase',
//                             letterSpacing: '0.5px',
//                             zIndex: 5
//                         }}>
//                             Popular
//                         </span>
//                     )}

//                     {/* Villa Sold Out Badge - শুধুমাত্র Villa কার্ডের জন্য (শুধু ব্যাজ হিসেবে) */}
//                     {isVilla && isSoldOut && (
//                         <span className="villa-badge" style={{
//                             position: 'absolute',
//                             top: '8px',
//                             right: '8px',
//                             backgroundColor: '#ff0000',
//                             color: 'white',
//                             padding: '2px 10px',
//                             borderRadius: '3px',
//                             fontSize: '10px',
//                             fontWeight: 'bold',
//                             textTransform: 'uppercase',
//                             letterSpacing: '0.5px',
//                             zIndex: 5
//                         }}>
//                             Sold Out
//                         </span>
//                     )}

//                     {/* Title */}
//                     <h5 className="fw-bold text-uppercase mb-1  pe-4" style={{ 
//                         fontSize: '1rem',
//                         color: '#5e2e10',
//                         minHeight: '35px',
//                         lineHeight: '1.2'
//                     }}>
//                         {pkg.title}
//                     </h5>

//                     {/* Price */}
//                     <div className="mb-1">
//                         <span className="fw-bold" style={{ fontSize: '0.95rem' }}>
//                             Share Price:৳ {parseInt(pkg.share_price || 0).toLocaleString()}
//                         </span>
//                     </div>

//                     {/* Discount Price */}
//                     <p className="mb-0 fw-bold " style={{ fontSize: '0.95rem' }}>
//                         Discount Price: ৳ {parseInt(pkg.price || 0).toLocaleString()}
//                     </p>

//                     {/* Full Payment Price */}
//                     <p className="mb-0 fw-bold" style={{ color: '#639c4e', fontSize: '0.8rem' }}>   
//                         Full Payment Price: ৳ {parseInt(pkg.discount || 0).toLocaleString()}
//                     </p>

//                     {/* Land & Building Area */}
//                     <p className="mb-0 " style={{ fontSize: '0.8rem' }}>
//                         Land & Building Area: {pkg.land || 'N/A'}
//                     </p>
                    
//                     {/* Amenities (Truncated/Shortened text) */}
//                     <p className="mb-0 text-dark" style={{ fontSize: '0.8rem' }} title={pkg.description}>
//                         Amenities : {pkg.description ? (pkg.description.length > 25 ? `${pkg.description.slice(0, 25)}...` : pkg.description) : 'N/A'}
//                     </p>
//                 </div>

//                 {/* Inquire Now Button - সব কার্ডের জন্য Inquire Now (Villa সহ) */}
//                 <button 
//                     className="btn w-100 fw-bold mt-2" 
//                     style={{ 
//                         backgroundColor: '#5e2e10', 
//                         color: '#ffffff', 
//                         borderRadius: '4px',
//                         cursor: 'pointer',
//                         opacity: 1,
//                         fontSize: '0.75rem',
//                         padding: '6px 12px',
//                         border: 'none'
//                     }}
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         handleCardClick(pkg);
//                     }}
//                 >
//                     Inquire Now
//                 </button>
               
//             </div>
//         );
//     })}
//                              </div>
//                         </>
//                     )}

//                     {/* STATS SECTION */}
//                     {!showOnlyBenefits && (
//                         <div className="container my-5" style={{ marginTop: '0', paddingTop: '20px' }}>
//                             <div className="row justify-content-center">
//                                 <div className="col-lg-11">
//                                     <div style={statsCardStyle} className="text-center">
//                                         <div className="row g-4">
//                                             {statsData.map((stat, index) => (
//                                                 <div key={stat.id} className={`col-md-3 ${index !== statsData.length - 1 ? 'border-end' : ''}`} style={{ borderColor: '#e2e8f0' }}>
//                                                     {stat.target > 0 ? (
//                                                         <CountUpItem
//                                                             target={stat.target}
//                                                             suffix={stat.suffix}
//                                                             prefix={stat.prefix}
//                                                         />
//                                                     ) : (
//                                                         <h2 className="fw-bold" style={{ color: '#5e2e10' }}>
//                                                             {stat.prefix}0{stat.suffix}
//                                                         </h2>
//                                                     )}
//                                                     <p className="fw-bold mb-0" style={{ color: '#718096' }}>{stat.label}</p>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* BENEFITS SECTION */}
//                 {benefits.length > 0 && (
//                     <div className="benefits-container container p-5 bg-white" id="investment-benefits">
//                         <h2 className='display-4 fw-normal text-uppercase mb-2 text-center'>Investment Benefits</h2>
//                         <div className="yellow-divider mx-auto mb-4"></div>
//                         <div className="row g-3">
//                             {benefits.map((benefit, index) => (
//                                 <div className="col-12 col-md-6" key={index}>
//                                     <div className="benefit-item d-flex align-items-center">
//                                         <span className="benefit-number">{String(index + 1).padStart(2, '0')}</span>
//                                         <span className="benefit-text">{benefit}</span>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="footer-promo text-center mt-5">
//                             <h4 className="promo-question">Ready to Secure Your Future?</h4>
//                             <p className="promo-text">Join hundreds of successful investors who have already secured their financial future with Akashbari Hotels & Resorts.</p>
//                         </div>
//                     </div>
//                 )}
//             </section>
//         </>
//     );
// };

// export default Investment;
   


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../css/investmentcopy.css';

// // Smooth Animated Counter Component
// const CountUpItem = ({ target, duration = 2000, suffix = '', prefix = '' }) => {
//     const [count, setCount] = useState(0);

//     useEffect(() => {
//         let startTimestamp = null;
//         const step = (timestamp) => {
//             if (!startTimestamp) startTimestamp = timestamp;
//             const progress = Math.min((timestamp - startTimestamp) / duration, 1);
//             const currentCount = Math.floor(progress * target);
//             setCount(currentCount);

//             if (progress < 1) {
//                 window.requestAnimationFrame(step);
//             }
//         };
//         window.requestAnimationFrame(step);
//     }, [target, duration]);

//     return (
//         <h2 className="stat-number">
//             {prefix}{count.toLocaleString()}{suffix}
//         </h2>
//     );
// };

// const Investment = ({ showOnlyBenefits = false }) => {
//     const navigate = useNavigate();
//     const [packages, setPackages] = useState([]);
//     const [benefits, setBenefits] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [combinedData, setCombinedData] = useState({
//         record_members: [],
//         invest_records: []
//     });
//     const [error, setError] = useState(null);

//     const BASE_URL = import.meta.env.VITE_BASE_URL;
//     const API_URL = `${BASE_URL}/get-investment`;
//     const BENEFITS_API_URL = `${BASE_URL}/get-investment-benefits`;

//     // Dynamic Subtitle Mapping
//     const getSubTitle = (title) => {
//         const upperTitle = title?.toUpperCase().trim() || '';
//         if (upperTitle.includes('PRESIDENTIAL')) return 'Exclusive Apartment';
//         if (upperTitle.includes('EARTH')) return 'Different Touch';
//         if (upperTitle.includes('EXECUTIVE')) return 'Smart Looks';
//         if (upperTitle.includes('SUPERIOR')) return 'Lake View';
//         return '';
//     };

//     // Fetch investment packages
//     const fetchPackages = async () => {
//         try {
//             const response = await fetch(API_URL);
//             const result = await response.json();

//             if (result.status) {
//                 let allPackages = result.data;

//                 const getOrderIndex = (title) => {
//                     const upperTitle = title?.toUpperCase().trim();
//                     if (upperTitle?.includes('VILLA')) return 0;
//                     if (upperTitle?.includes('PRESIDENTIAL')) return 99;
//                     if (upperTitle?.includes('EARTH')) return 3;
//                     if (upperTitle?.includes('EXECUTIVE')) return 2;
//                     if (upperTitle?.includes('SUPERIOR')) return 1;
                   
//                     return 500;
//                 };

//                 allPackages = allPackages.sort((a, b) => getOrderIndex(a.title) - getOrderIndex(b.title));
//                 setPackages(allPackages);
//             }
//         } catch (err) {
//             console.error("Error fetching packages:", err);
//             setError('Failed to load investment packages.');
//         }
//     };

//     // Fetch investment benefits
//     const fetchBenefits = async () => {
//         try {
//             const response = await fetch(BENEFITS_API_URL);
//             const result = await response.json();

//             if (result.status && result.data && result.data.data) {
//                 const benefitsData = result.data.data;
//                 if (benefitsData.length > 0 && benefitsData[0].benefits) {
//                     setBenefits(benefitsData[0].benefits);
//                 } else {
//                     setBenefits([]);
//                 }
//             } else {
//                 setBenefits([]);
//             }
//         } catch (err) {
//             console.error("Error fetching benefits:", err);
//             setBenefits([]);
//         }
//     };

//     // Fetch combined data for statistics
//     const fetchCombinedData = async () => {
//         try {
//             const response = await axios.get(`${BASE_URL}/combined-records`, {
//                 headers: { 'Accept': 'application/json' }
//             });

//             if (response.data.status === true && response.data.data) {
//                 setCombinedData({
//                     record_members: response.data.data.record_members || [],
//                     invest_records: response.data.data.invest_records || []
//                 });
//                 setError(null);
//             } else {
//                 setCombinedData({ record_members: [], invest_records: [] });
//             }
//         } catch (err) {
//             console.error('Error fetching combined data:', err);
//             setError('Failed to load data. Please try again later.');
//         }
//     };

//     useEffect(() => {
//         const fetchAllData = async () => {
//             setLoading(true);
//             await Promise.all([
//                 fetchPackages(),
//                 fetchBenefits(),
//                 fetchCombinedData()
//             ]);
//             setLoading(false);
//         };

//         fetchAllData();
//     }, []);

//     const handleCardClick = (pkg) => {
//         const isVilla = pkg.title?.toUpperCase().includes('VILLA');
//         if (isVilla || pkg.is_sold_out != 1) {
//             navigate(`/package-details/${pkg.id}`, { state: { packageData: pkg } });
//         }
//     };

//     const getStatsData = () => {
//         const member = combinedData.record_members[0] || {};
//         return [
//             { id: 1, target: parseInt(member.member) || 0, suffix: "+", prefix: "", label: "Happy Members" },
//             { id: 2, target: parseInt(member.revenue) || 0, suffix: "%", prefix: "Up to ", label: "Yearly Revenue" },
//             { id: 3, target: parseInt(member.amenities) || 0, suffix: "+", prefix: "", label: "Club Amenities" },
//             { id: 4, target: parseInt(member.expericence) || 0, suffix: "+", prefix: "", label: "Years of Trust" }
//         ];
//     };

//     const statsData = getStatsData();

//     if (loading) {
//         return (
//             <div className="loader-container">
//                 <div className="custom-spinner"></div>
//                 <p>Loading Investment Opportunities...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="error-container">
//                 <p>{error}</p>
//             </div>
//         );
//     }

//     return (
//         <section className="investment-section py-5">
//             <div className="container">
//                 {!showOnlyBenefits && (
//                     <>
//                         {/* Header Title Section */}
//                         <div className="text-center mb-5">
//                             <span className="badge-opportunity">INVESTMENT OPPORTUNITIES</span>
//                             <h1 className="main-title mt-3 mb-2 text-white">RESORT INVESTMENT PACKAGES</h1>
//                             <p className="sub-text mx-auto">
//                                 Become a partner in Bangladesh's premier luxury resort destination and enjoy high guaranteed returns.
//                             </p>
//                         </div>

//                         {/* Top Category Header Row */}
//                         <div className="top-category-bar mb-5">
//                             <div className="row g-0 align-items-center">
//                                 {packages.map((pkg, index) => {
//                                     const isSoldOut = pkg.is_sold_out == 1;
//                                     const subTitle = getSubTitle(pkg.title);

//                                     return (
//                                         <div
//                                             key={pkg.id || index}
//                                             className={`col-12 col-sm-6 col-lg p-3 text-center category-item ${
//                                                 index !== packages.length - 1 ? 'has-border-right' : ''
//                                             }`}
//                                         >
//                                             <h6 className="category-title">{pkg.title}</h6>
//                                             {isSoldOut ? (
//                                                 <span className="badge-sold-out-pill">Sold Out</span>
//                                             ) : (
//                                                 subTitle && <span className="subtitle-tag">{subTitle}</span>
//                                             )}
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>

//                         {/* Main Investment Cards Grid */}
//                         <div className="row g-4 mb-5">
//                             {packages.map((pkg, index) => {
//                                 const isPopular = pkg.title?.toUpperCase().includes('SUPERIOR');
//                                 const isVilla = pkg.title?.toUpperCase().includes('VILLA');
//                                 const isSoldOut = pkg.is_sold_out == 1;
//                                 const isClickable = isVilla || !isSoldOut;

//                                 return (
//                                     <div
//                                         className="col-12 col-sm-6 col-lg-3"
//                                         key={pkg.id || index}
//                                     >
//                                         <div
//                                             className={`investment-card ${isSoldOut && !isVilla ? 'card-disabled' : ''}`}
//                                             onClick={() => isClickable && handleCardClick(pkg)}
//                                         >
//                                             {/* Badges */}
//                                             {isPopular && <span className="badge-popular">Popular</span>}
//                                             {isVilla && isSoldOut && <span className="badge-sold-out">Sold Out</span>}

//                                             {/* Card Content */}
//                                             <div className="card-body-content">
//                                                 <h5 className="package-title">{pkg.title}</h5>

//                                                 <div className="price-info-list">
//                                                     <div className="price-row">
//                                                         <span className="price-label">Share Price:</span>
//                                                         <span className="price-value-share">৳ {parseInt(pkg.share_price || 0).toLocaleString()}</span>
//                                                     </div>

//                                                     <div className="price-row highlight">
//                                                         <span className="price-label">Discount Price:</span>
//                                                         <span className="price-value discount">৳ {parseInt(pkg.price || 0).toLocaleString()}</span>
//                                                     </div>

//                                                     <div className="price-row">
//                                                         <span className="price-label">Full Payment:</span>
//                                                         <span className="price-value full-payment">৳ {parseInt(pkg.discount || 0).toLocaleString()}</span>
//                                                     </div>
//                                                 </div>

//                                                 <hr className="card-divider" />

//                                                 <div className="details-list">
//                                                     <div className="detail-item">
//                                                         <i className="bi bi-geo-alt-fill icon"></i>
//                                                         <span><strong>Land & Building:</strong> {pkg.land || 'N/A'}</span>
//                                                     </div>
//                                                     <div className="detail-item" title={pkg.description}>
//                                                         <i className="bi bi-stars icon"></i>
//                                                         <span>
//                                                             <strong>Amenities:</strong>{' '}
//                                                             {pkg.description ? (pkg.description.length > 25 ? `${pkg.description.slice(0, 25)}...` : pkg.description) : 'N/A'}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             {/* Action Button */}
//                                             <button
//                                                 className={`btn-inquire ${!isClickable ? 'disabled' : ''}`}
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     if (isClickable) handleCardClick(pkg);
//                                                 }}
//                                             >
//                                                 <span>Inquire Now</span>
//                                                 <i className="bi bi-arrow-right-short ms-1"></i>
//                                             </button>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>

//                         {/* Stats Section */}
//                         <div className="stats-wrapper mb-5">
//                             <div className="row g-4 text-center">
//                                 {statsData.map((stat, index) => (
//                                     <div
//                                         key={stat.id}
//                                         className={`col-12 col-sm-6 col-md-3 stat-box ${
//                                             index !== statsData.length - 1 ? 'has-stat-border' : ''
//                                         }`}
//                                     >
//                                         {stat.target > 0 ? (
//                                             <CountUpItem
//                                                 target={stat.target}
//                                                 suffix={stat.suffix}
//                                                 prefix={stat.prefix}
//                                             />
//                                         ) : (
//                                             <h2 className="stat-number">{stat.prefix}0{stat.suffix}</h2>
//                                         )}
//                                         <p className="stat-label">{stat.label}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </>
//                 )}

//                 {/* Benefits Section */}
//                 {benefits.length > 0 && (
//                     <div className="benefits-card-wrapper" id="investment-benefits">
//                         <div className="text-center mb-4">
//                             <h2 className="benefits-title">INVESTMENT BENEFITS</h2>
//                             <div className="accent-divider mx-auto"></div>
//                         </div>

//                         <div className="row g-3">
//                             {benefits.map((benefit, index) => (
//                                 <div className="col-12 col-md-6" key={index}>
//                                     <div className="benefit-card">
//                                         <div className="benefit-index">{String(index + 1).padStart(2, '0')}</div>
//                                         <div className="benefit-description">{benefit}</div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>

//                         <div className="footer-promo-box text-center mt-5">
//                             <h4 className="promo-title">Ready to Secure Your Future?</h4>
//                             <p className="promo-description">
//                                 Join hundreds of successful investors who have already secured their financial future with Akashbari Hotels & Resorts.
//                             </p>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </section>
//     );
// };

// export default Investment;





// import React, { useState, useEffect } from 'react';

// import { useNavigate } from 'react-router-dom';

// import axios from 'axios';

// import '../css/investmentcopy.css';



// // Smooth Animated Counter Component

// const CountUpItem = ({ target, duration = 2000, suffix = '', prefix = '' }) => {

//     const [count, setCount] = useState(0);



//     useEffect(() => {

//         let startTimestamp = null;

//         const step = (timestamp) => {

//             if (!startTimestamp) startTimestamp = timestamp;

//             const progress = Math.min((timestamp - startTimestamp) / duration, 1);

//             const currentCount = Math.floor(progress * target);

//             setCount(currentCount);



//             if (progress < 1) {

//                 window.requestAnimationFrame(step);

//             }

//         };

//         window.requestAnimationFrame(step);

//     }, [target, duration]);



//     return (

//         <h2 className="stat-number">

//             {prefix}{count.toLocaleString()}{suffix}

//         </h2>

//     );

// };



// const Investment = ({ showOnlyBenefits = false }) => {

//     const navigate = useNavigate();

//     const [packages, setPackages] = useState([]);

//     const [benefits, setBenefits] = useState([]);

//     const [loading, setLoading] = useState(true);

//     const [combinedData, setCombinedData] = useState({

//         record_members: [],

//         invest_records: []

//     });

//     const [error, setError] = useState(null);

//     const [showVilla, setShowVilla] = useState(false);



//     const BASE_URL = import.meta.env.VITE_BASE_URL;

//     const API_URL = `${BASE_URL}/get-investment`;

//     const BENEFITS_API_URL = `${BASE_URL}/get-investment-benefits`;



//     // Dynamic Subtitle Mapping

//     const getSubTitle = (title) => {

//         const upperTitle = title?.toUpperCase().trim() || '';

//         if (upperTitle.includes('PRESIDENTIAL')) return 'Exclusive Apartment';

//         if (upperTitle.includes('EARTH')) return 'Different Touch';

//         if (upperTitle.includes('EXECUTIVE')) return 'Smart Looks';

//         if (upperTitle.includes('SUPERIOR')) return 'Lake View';

//         return '';

//     };



//     // Fetch investment packages

//     const fetchPackages = async () => {

//         try {

//             const response = await fetch(API_URL);

//             const result = await response.json();



//             if (result.status) {

//                 let allPackages = result.data;



//                 const getOrderIndex = (title) => {

//                     const upperTitle = title?.toUpperCase().trim();

//                     if (upperTitle?.includes('VILLA')) return 0;

//                     if (upperTitle?.includes('PRESIDENTIAL')) return 99;

//                     if (upperTitle?.includes('EARTH')) return 3;

//                     if (upperTitle?.includes('EXECUTIVE')) return 2;

//                     if (upperTitle?.includes('SUPERIOR')) return 1;

                   

//                     return 500;

//                 };



//                 allPackages = allPackages.sort((a, b) => getOrderIndex(a.title) - getOrderIndex(b.title));

//                 setPackages(allPackages);

//             }

//         } catch (err) {

//             console.error("Error fetching packages:", err);

//             setError('Failed to load investment packages.');

//         }

//     };



//     // Fetch investment benefits

//     const fetchBenefits = async () => {

//         try {

//             const response = await fetch(BENEFITS_API_URL);

//             const result = await response.json();



//             if (result.status && result.data && result.data.data) {

//                 const benefitsData = result.data.data;

//                 if (benefitsData.length > 0 && benefitsData[0].benefits) {

//                     setBenefits(benefitsData[0].benefits);

//                 } else {

//                     setBenefits([]);

//                 }

//             } else {

//                 setBenefits([]);

//             }

//         } catch (err) {

//             console.error("Error fetching benefits:", err);

//             setBenefits([]);

//         }

//     };



//     // Fetch combined data for statistics

//     const fetchCombinedData = async () => {

//         try {

//             const response = await axios.get(`${BASE_URL}/combined-records`, {

//                 headers: { 'Accept': 'application/json' }

//             });



//             if (response.data.status === true && response.data.data) {

//                 setCombinedData({

//                     record_members: response.data.data.record_members || [],

//                     invest_records: response.data.data.invest_records || []

//                 });

//                 setError(null);

//             } else {

//                 setCombinedData({ record_members: [], invest_records: [] });

//             }

//         } catch (err) {

//             console.error('Error fetching combined data:', err);

//             setError('Failed to load data. Please try again later.');

//         }

//     };



//     useEffect(() => {

//         const fetchAllData = async () => {

//             setLoading(true);

//             await Promise.all([

//                 fetchPackages(),

//                 fetchBenefits(),

//                 fetchCombinedData()

//             ]);

//             setLoading(false);

//         };



//         fetchAllData();

//     }, []);



//     // Hide Villa card again when page is scrolled

//     useEffect(() => {

//         const handleScroll = () => {

//             if (window.scrollY > 0) {

//                 setShowVilla(false);

//             }

//         };

//         window.addEventListener('scroll', handleScroll);

//         return () => {

//             window.removeEventListener('scroll', handleScroll);

//         };

//     }, []);



//     const handleCardClick = (pkg) => {

//         const isVilla = pkg.title?.toUpperCase().includes('VILLA');

//         if (isVilla || pkg.is_sold_out != 1) {

//             navigate(`/package-details/${pkg.id}`, { state: { packageData: pkg } });

//         }

//     };



//     const handleCategoryClick = (pkg) => {

//         const isVilla = pkg.title?.toUpperCase().includes('VILLA');



//         if (isVilla) {

//             setShowVilla(true);

//         }

//     };



//     const getStatsData = () => {

//         const member = combinedData.record_members[0] || {};

//         return [

//             { id: 1, target: parseInt(member.member) || 0, suffix: "+", prefix: "", label: "Happy Members" },

//             { id: 2, target: parseInt(member.revenue) || 0, suffix: "%", prefix: "Up to ", label: "Yearly Revenue" },

//             { id: 3, target: parseInt(member.amenities) || 0, suffix: "+", prefix: "", label: "Club Amenities" },

//             { id: 4, target: parseInt(member.expericence) || 0, suffix: "+", prefix: "", label: "Years of Trust" }

//         ];

//     };



//     const statsData = getStatsData();



//     if (loading) {

//         return (

//             <div className="loader-container">

//                 <div className="custom-spinner"></div>

//                 <p>Loading Investment Opportunities...</p>

//             </div>

//         );

//     }



//     if (error) {

//         return (

//             <div className="error-container">

//                 <p>{error}</p>

//             </div>

//         );

//     }



//     return (

//         <section className="investment-section py-5">

//             <div className="container">

//                 {!showOnlyBenefits && (

//                     <>

//                         {/* Header Title Section */}

//                         <div className="text-center mb-5">

//                             <span className="badge-opportunity">INVESTMENT OPPORTUNITIES</span>

//                             <h1 className="main-title mt-3 mb-2 text-white">RESORT INVESTMENT PACKAGES</h1>

//                             <p className="sub-text mx-auto">

//                                 Become a partner in Bangladesh's premier luxury resort destination and enjoy high guaranteed returns.

//                             </p>

//                         </div>



//                         {/* Top Category Header Row */}

//                         <div className="top-category-bar mb-5">

//                             <div className="row g-0 align-items-center">

//                                 {packages.map((pkg, index) => {

//                                     const isSoldOut = pkg.is_sold_out == 1;

//                                     const subTitle = getSubTitle(pkg.title);

//                                     const isVilla = pkg.title?.toUpperCase().includes('VILLA');



//                                     return (

//                                         <div

//                                             key={pkg.id || index}

//                                             className={`col-12 col-sm-6 col-lg p-3 text-center category-item ${

//                                                 index !== packages.length - 1 ? 'has-border-right' : ''

//                                             }`}

//                                             onClick={() => handleCategoryClick(pkg)}

//                                             style={{ cursor: isVilla ? 'pointer' : 'default' }}

//                                         >

//                                             <h6 className="category-title">{pkg.title}</h6>

//                                             {isSoldOut ? (

//                                                 <span className="badge-sold-out-pill">Sold Out</span>

//                                             ) : (

//                                                 subTitle && <span className="subtitle-tag">{subTitle}</span>

//                                             )}

//                                         </div>

//                                     );

//                                 })}

//                             </div>

//                         </div>



//                         {/* Main Investment Cards Grid */}

//                         <div className="row g-4 mb-5">

//                             {packages.map((pkg, index) => {

//                                 const isPopular = pkg.title?.toUpperCase().includes('SUPERIOR');

//                                 const isVilla = pkg.title?.toUpperCase().includes('VILLA');

//                                 const isSoldOut = pkg.is_sold_out == 1;

//                                 const isClickable = isVilla || !isSoldOut;



//                                 // Villa hidden initially

//                                 if (isVilla && !showVilla) {

//                                     return null;

//                                 }



//                                 return (

//                                     <div

//                                         className="col-12 col-sm-6 col-lg-3"

//                                         key={pkg.id || index}

//                                     >

//                                         <div

//                                             className={`investment-card ${isSoldOut && !isVilla ? 'card-disabled' : ''}`}

//                                             onClick={() => isClickable && handleCardClick(pkg)}

//                                         >

//                                             {/* Badges */}

//                                             {isPopular && <span className="badge-popular">Popular</span>}

//                                             {isVilla && isSoldOut && <span className="badge-sold-out">Sold Out</span>}



//                                             {/* Card Content */}

//                                             <div className="card-body-content">

//                                                 <h5 className="package-title">{pkg.title}</h5>



//                                                 <div className="price-info-list">

//                                                     <div className="price-row">

//                                                         <span className="price-label">Share Price:</span>

//                                                         <span className="price-value-share">৳ {parseInt(pkg.share_price || 0).toLocaleString()}</span>

//                                                     </div>



//                                                     <div className="price-row highlight">

//                                                         <span className="price-label">Discount Price:</span>

//                                                         <span className="price-value discount">৳ {parseInt(pkg.price || 0).toLocaleString()}</span>

//                                                     </div>



//                                                     <div className="price-row">

//                                                         <span className="price-label">Full Payment:</span>

//                                                         <span className="price-value full-payment">৳ {parseInt(pkg.discount || 0).toLocaleString()}</span>

//                                                     </div>

//                                                 </div>



//                                                 <hr className="card-divider" />



//                                                 <div className="details-list">

//                                                     <div className="detail-item">

//                                                         <i className="bi bi-geo-alt-fill icon"></i>

//                                                         <span><strong>Land & Building:</strong> {pkg.land || 'N/A'}</span>

//                                                     </div>

//                                                     <div className="detail-item" title={pkg.description}>

//                                                         <i className="bi bi-stars icon"></i>

//                                                         <span>

//                                                             <strong>Amenities:</strong>{' '}

//                                                             {pkg.description ? (pkg.description.length > 25 ? `${pkg.description.slice(0, 25)}...` : pkg.description) : 'N/A'}

//                                                         </span>

//                                                     </div>

//                                                 </div>

//                                             </div>



//                                             {/* Action Button */}

//                                             <button

//                                                 className={`btn-inquire ${!isClickable ? 'disabled' : ''}`}

//                                                 onClick={(e) => {

//                                                     e.stopPropagation();

//                                                     if (isClickable) handleCardClick(pkg);

//                                                 }}

//                                             >

//                                                 <span>Inquire Now</span>

//                                                 <i className="bi bi-arrow-right-short ms-1"></i>

//                                             </button>

//                                         </div>

//                                     </div>

//                                 );

//                             })}

//                         </div>



//                         {/* Stats Section */}

//                         <div className="stats-wrapper mb-5">

//                             <div className="row g-4 text-center">

//                                 {statsData.map((stat, index) => (

//                                     <div

//                                         key={stat.id}

//                                         className={`col-12 col-sm-6 col-md-3 stat-box ${

//                                             index !== statsData.length - 1 ? 'has-stat-border' : ''

//                                         }`}

//                                     >

//                                         {stat.target > 0 ? (

//                                             <CountUpItem

//                                                 target={stat.target}

//                                                 suffix={stat.suffix}

//                                                 prefix={stat.prefix}

//                                             />

//                                         ) : (

//                                             <h2 className="stat-number">{stat.prefix}0{stat.suffix}</h2>

//                                         )}

//                                         <p className="stat-label">{stat.label}</p>

//                                     </div>

//                                 ))}

//                             </div>

//                         </div>

//                     </>

//                 )}



//                 {/* Benefits Section */}

//                 {benefits.length > 0 && (

//                     <div className="benefits-card-wrapper" id="investment-benefits">

//                         <div className="text-center mb-4">

//                             <h2 className="benefits-title">INVESTMENT BENEFITS</h2>

//                             <div className="accent-divider mx-auto"></div>

//                         </div>



//                         <div className="row g-3">

//                             {benefits.map((benefit, index) => (

//                                 <div className="col-12 col-md-6" key={index}>

//                                     <div className="benefit-card">

//                                         <div className="benefit-index">{String(index + 1).padStart(2, '0')}</div>

//                                         <div className="benefit-description">{benefit}</div>

//                                     </div>

//                                 </div>

//                             ))}

//                         </div>



//                         <div className="footer-promo-box text-center mt-5">

//                             <h4 className="promo-title">Ready to Secure Your Future?</h4>

//                             <p className="promo-description">

//                                 Join hundreds of successful investors who have already secured their financial future with Akashbari Hotels & Resorts.

//                             </p>

//                         </div>

//                     </div>

//                 )}

//             </div>

//         </section>

//     );

// };



// export default Investment;




// new code akhane likbo 


// import React, { useState, useEffect } from 'react';

// import { useNavigate } from 'react-router-dom';

// import axios from 'axios';

// import '../css/investmentcopy.css';



// // Smooth Animated Counter Component

// const CountUpItem = ({ target, duration = 2000, suffix = '', prefix = '' }) => {

//     const [count, setCount] = useState(0);



//     useEffect(() => {

//         let startTimestamp = null;

//         const step = (timestamp) => {

//             if (!startTimestamp) startTimestamp = timestamp;

//             const progress = Math.min((timestamp - startTimestamp) / duration, 1);

//             const currentCount = Math.floor(progress * target);

//             setCount(currentCount);



//             if (progress < 1) {

//                 window.requestAnimationFrame(step);

//             }

//         };

//         window.requestAnimationFrame(step);

//     }, [target, duration]);



//     return (

//         <h2 className="stat-number">

//             {prefix}{count.toLocaleString()}{suffix}

//         </h2>

//     );

// };



// const Investment = ({ showOnlyBenefits = false }) => {

//     const navigate = useNavigate();

//     const [packages, setPackages] = useState([]);

//     const [benefits, setBenefits] = useState([]);

//     const [loading, setLoading] = useState(true);

//     const [combinedData, setCombinedData] = useState({

//         record_members: [],

//         invest_records: []

//     });

//     const [error, setError] = useState(null);

//     const [showVilla, setShowVilla] = useState(false);



//     const BASE_URL = import.meta.env.VITE_BASE_URL;

//     const API_URL = `${BASE_URL}/get-investment`;

//     const BENEFITS_API_URL = `${BASE_URL}/get-investment-benefits`;



//     // Dynamic Subtitle Mapping

//     const getSubTitle = (title) => {

//         const upperTitle = title?.toUpperCase().trim() || '';

//         if (upperTitle.includes('PRESIDENTIAL')) return 'Exclusive Apartment';

//         if (upperTitle.includes('EARTH')) return 'Different Touch';

//         if (upperTitle.includes('EXECUTIVE')) return 'Smart Looks';

//         if (upperTitle.includes('SUPERIOR')) return 'Lake View';

//         return '';

//     };



//     // Fetch investment packages

//     const fetchPackages = async () => {

//         try {

//             const response = await fetch(API_URL);

//             const result = await response.json();



//             if (result.status) {

//                 let allPackages = result.data;



//                 const getOrderIndex = (title) => {

//                     const upperTitle = title?.toUpperCase().trim();

//                     if (upperTitle?.includes('VILLA')) return 0;

//                     if (upperTitle?.includes('PRESIDENTIAL')) return 99;

//                     if (upperTitle?.includes('EARTH')) return 3;

//                     if (upperTitle?.includes('EXECUTIVE')) return 2;

//                     if (upperTitle?.includes('SUPERIOR')) return 1;

                   

//                     return 500;

//                 };



//                 allPackages = allPackages.sort((a, b) => getOrderIndex(a.title) - getOrderIndex(b.title));

//                 setPackages(allPackages);

//             }

//         } catch (err) {

//             console.error("Error fetching packages:", err);

//             setError('Failed to load investment packages.');

//         }

//     };



//     // Fetch investment benefits

//     const fetchBenefits = async () => {

//         try {

//             const response = await fetch(BENEFITS_API_URL);

//             const result = await response.json();



//             if (result.status && result.data && result.data.data) {

//                 const benefitsData = result.data.data;

//                 if (benefitsData.length > 0 && benefitsData[0].benefits) {

//                     setBenefits(benefitsData[0].benefits);

//                 } else {

//                     setBenefits([]);

//                 }

//             } else {

//                 setBenefits([]);

//             }

//         } catch (err) {

//             console.error("Error fetching benefits:", err);

//             setBenefits([]);

//         }

//     };



//     // Fetch combined data for statistics

//     const fetchCombinedData = async () => {

//         try {

//             const response = await axios.get(`${BASE_URL}/combined-records`, {

//                 headers: { 'Accept': 'application/json' }

//             });



//             if (response.data.status === true && response.data.data) {

//                 setCombinedData({

//                     record_members: response.data.data.record_members || [],

//                     invest_records: response.data.data.invest_records || []

//                 });

//                 setError(null);

//             } else {

//                 setCombinedData({ record_members: [], invest_records: [] });

//             }

//         } catch (err) {

//             console.error('Error fetching combined data:', err);

//             setError('Failed to load data. Please try again later.');

//         }

//     };



//     useEffect(() => {

//         const fetchAllData = async () => {

//             setLoading(true);

//             await Promise.all([

//                 fetchPackages(),

//                 fetchBenefits(),

//                 fetchCombinedData()

//             ]);

//             setLoading(false);

//         };



//         fetchAllData();

//     }, []);



//     const handleCardClick = (pkg) => {

//         const isVilla = pkg.title?.toUpperCase().includes('VILLA');

//         if (isVilla || pkg.is_sold_out != 1) {

//             navigate(`/package-details/${pkg.id}`, { state: { packageData: pkg } });

//         }

//     };



//     // Villa Category Click

//     const handleCategoryClick = (pkg) => {

//         const isVilla = pkg.title?.toUpperCase().includes('VILLA');



//         if (isVilla) {

//             setShowVilla(true);

//         }

//     };



//     const getStatsData = () => {

//         const member = combinedData.record_members[0] || {};

//         return [

//             { id: 1, target: parseInt(member.member) || 0, suffix: "+", prefix: "", label: "Happy Members" },

//             { id: 2, target: parseInt(member.revenue) || 0, suffix: "%", prefix: "Up to ", label: "Yearly Revenue" },

//             { id: 3, target: parseInt(member.amenities) || 0, suffix: "+", prefix: "", label: "Club Amenities" },

//             { id: 4, target: parseInt(member.expericence) || 0, suffix: "+", prefix: "", label: "Years of Trust" }

//         ];

//     };



//     const statsData = getStatsData();



//     if (loading) {

//         return (

//             <div className="loader-container">

//                 <div className="custom-spinner"></div>

//                 <p>Loading Investment Opportunities...</p>

//             </div>

//         );

//     }



//     if (error) {

//         return (

//             <div className="error-container">

//                 <p>{error}</p>

//             </div>

//         );

//     }



//     return (

//         <section className="investment-section py-5">

//             <div className="container">

//                 {!showOnlyBenefits && (

//                     <>

//                         {/* Header Title Section */}

//                         <div className="text-center mb-5">

//                             <span className="badge-opportunity">INVESTMENT OPPORTUNITIES</span>

//                             <h1 className="main-title mt-3 mb-2 text-white">RESORT INVESTMENT PACKAGES</h1>

//                             <p className="sub-text mx-auto">

//                                 Become a partner in Bangladesh's premier luxury resort destination and enjoy high guaranteed returns.

//                             </p>

//                         </div>



//                         {/* Top Category Header Row */}

//                         <div className="top-category-bar mb-5">

//                             <div className="row g-0 align-items-center">

//                                 {packages.map((pkg, index) => {

//                                     const isSoldOut = pkg.is_sold_out == 1;

//                                     const subTitle = getSubTitle(pkg.title);

//                                     const isVilla = pkg.title?.toUpperCase().includes('VILLA');



//                                     return (

//                                         <div

//                                             key={pkg.id || index}

//                                             className={`col-12 col-sm-6 col-lg p-3 text-center category-item ${

//                                                 index !== packages.length - 1 ? 'has-border-right' : ''

//                                             }`}

//                                             onClick={() => handleCategoryClick(pkg)}

//                                             style={{ cursor: isVilla ? 'pointer' : 'default' }}

//                                         >

//                                             <h6 className="category-title">{pkg.title}</h6>

//                                             {isSoldOut ? (

//                                                 <span className="badge-sold-out-pill">Sold Out</span>

//                                             ) : (

//                                                 subTitle && <span className="subtitle-tag">{subTitle}</span>

//                                             )}

//                                         </div>

//                                     );

//                                 })}

//                             </div>

//                         </div>



//                         {/* Main Investment Cards Grid */}

//                         <div className="row g-4 mb-5">

//                             {packages.map((pkg, index) => {

//                                 const isPopular = pkg.title?.toUpperCase().includes('SUPERIOR');

//                                 const isVilla = pkg.title?.toUpperCase().includes('VILLA');

//                                 const isSoldOut = pkg.is_sold_out == 1;

//                                 const isClickable = isVilla || !isSoldOut;



//                                 // Villa will not appear in main grid

//                                 if (isVilla) {

//                                     return null;

//                                 }



//                                 return (

//                                     <div

//                                         className="col-12 col-sm-6 col-lg-3"

//                                         key={pkg.id || index}

//                                     >

//                                         <div

//                                             className={`investment-card ${isSoldOut && !isVilla ? 'card-disabled' : ''}`}

//                                             onClick={() => isClickable && handleCardClick(pkg)}

//                                         >

//                                             {/* Badges */}

//                                             {isPopular && <span className="badge-popular">Popular</span>}

//                                             {isVilla && isSoldOut && <span className="badge-sold-out">Sold Out</span>}



//                                             {/* Card Content */}

//                                             <div className="card-body-content">

//                                                 <h5 className="package-title">{pkg.title}</h5>



//                                                 <div className="price-info-list">

//                                                     <div className="price-row">

//                                                         <span className="price-label">Share Price:</span>

//                                                         <span className="price-value-share">

//                                                             ৳ {parseInt(pkg.share_price || 0).toLocaleString()}

//                                                         </span>

//                                                     </div>



//                                                     <div className="price-row highlight">

//                                                         <span className="price-label">Discount Price:</span>

//                                                         <span className="price-value discount">

//                                                             ৳ {parseInt(pkg.price || 0).toLocaleString()}

//                                                         </span>

//                                                     </div>



//                                                     <div className="price-row">

//                                                         <span className="price-label">Full Payment:</span>

//                                                         <span className="price-value full-payment">

//                                                             ৳ {parseInt(pkg.discount || 0).toLocaleString()}

//                                                         </span>

//                                                     </div>

//                                                 </div>



//                                                 <hr className="card-divider" />



//                                                 <div className="details-list">

//                                                     <div className="detail-item">

//                                                         <i className="bi bi-geo-alt-fill icon"></i>

//                                                         <span>

//                                                             <strong>Land & Building:</strong> {pkg.land || 'N/A'}

//                                                         </span>

//                                                     </div>



//                                                     <div

//                                                         className="detail-item"

//                                                         title={pkg.description}

//                                                     >

//                                                         <i className="bi bi-stars icon"></i>

//                                                         <span>

//                                                             <strong>Amenities:</strong>{' '}

//                                                             {pkg.description

//                                                                 ? (

//                                                                     pkg.description.length > 25

//                                                                         ? `${pkg.description.slice(0, 25)}...`

//                                                                         : pkg.description

//                                                                 )

//                                                                 : 'N/A'}

//                                                         </span>

//                                                     </div>

//                                                 </div>

//                                             </div>



//                                             {/* Action Button */}

//                                             <button

//                                                 className={`btn-inquire ${!isClickable ? 'disabled' : ''}`}

//                                                 onClick={(e) => {

//                                                     e.stopPropagation();

//                                                     if (isClickable) handleCardClick(pkg);

//                                                 }}

//                                             >

//                                                 <span>Inquire Now</span>

//                                                 <i className="bi bi-arrow-right-short ms-1"></i>

//                                             </button>

//                                         </div>

//                                     </div>

//                                 );

//                             })}

//                         </div>



//                         {/* Villa Modal */}

//                         {showVilla && (

//                             <div

//                                 className="villa-modal-overlay"

//                                 onClick={() => setShowVilla(false)}

//                                 style={{

//                                     position: 'fixed',

//                                     inset: 0,

//                                     background: 'rgba(0, 0, 0, 0.75)',

//                                     zIndex: 9999,

//                                     display: 'flex',

//                                     alignItems: 'center',

//                                     justifyContent: 'center',

//                                     padding: '20px'

//                                 }}

//                             >

//                                 <div

//                                     className="villa-modal-content"

//                                     onClick={(e) => e.stopPropagation()}

//                                     style={{

//                                         position: 'relative',

//                                         width: '100%',

//                                         maxWidth: '320px'

//                                     }}

//                                 >

//                                     {/* Close Button */}

//                                     <button

//                                         type="button"

//                                         onClick={() => setShowVilla(false)}

//                                         style={{

//                                             position: 'absolute',

//                                             top: '-15px',

//                                             right: '-15px',

//                                             width: '36px',

//                                             height: '36px',

//                                             borderRadius: '50%',

//                                             border: 'none',

//                                             background: '#fff',

//                                             color: '#111',

//                                             fontSize: '24px',

//                                             lineHeight: '1',

//                                             zIndex: 10,

//                                             cursor: 'pointer',

//                                             display: 'flex',

//                                             alignItems: 'center',

//                                             justifyContent: 'center',

//                                             boxShadow: '0 4px 15px rgba(0,0,0,0.3)'

//                                         }}

//                                     >

//                                         ×

//                                     </button>



//                                     {/* Villa Card */}

//                                     {packages

//                                         .filter(pkg =>

//                                             pkg.title?.toUpperCase().includes('VILLA')

//                                         )

//                                         .map((pkg) => {

//                                             const isVilla = true;

//                                             const isSoldOut = pkg.is_sold_out == 1;

//                                             const isClickable = true;



//                                             return (

//                                                 <div

//                                                     className="col-12"

//                                                     key={pkg.id}

//                                                 >

//                                                     <div

//                                                         className={`investment-card ${isSoldOut && !isVilla ? 'card-disabled' : ''}`}

//                                                         onClick={() => handleCardClick(pkg)}

//                                                         style={{

//                                                             width: '100%',

//                                                             margin: 0

//                                                         }}

//                                                     >

//                                                         {/* Badges */}

//                                                         {isSoldOut && (

//                                                             <span className="badge-sold-out">

//                                                                 Sold Out

//                                                             </span>

//                                                         )}



//                                                         {/* Card Content */}

//                                                         <div className="card-body-content">

//                                                             <h5 className="package-title">

//                                                                 {pkg.title}

//                                                             </h5>



//                                                             <div className="price-info-list">

//                                                                 <div className="price-row">

//                                                                     <span className="price-label">

//                                                                         Share Price:

//                                                                     </span>

//                                                                     <span className="price-value-share">

//                                                                         ৳ {parseInt(pkg.share_price || 0).toLocaleString()}

//                                                                     </span>

//                                                                 </div>



//                                                                 <div className="price-row highlight">

//                                                                     <span className="price-label">

//                                                                         Discount Price:

//                                                                     </span>

//                                                                     <span className="price-value discount">

//                                                                         ৳ {parseInt(pkg.price || 0).toLocaleString()}

//                                                                     </span>

//                                                                 </div>



//                                                                 <div className="price-row">

//                                                                     <span className="price-label">

//                                                                         Full Payment:

//                                                                     </span>

//                                                                     <span className="price-value full-payment">

//                                                                         ৳ {parseInt(pkg.discount || 0).toLocaleString()}

//                                                                     </span>

//                                                                 </div>

//                                                             </div>



//                                                             <hr className="card-divider" />



//                                                             <div className="details-list">

//                                                                 <div className="detail-item">

//                                                                     <i className="bi bi-geo-alt-fill icon"></i>

//                                                                     <span>

//                                                                         <strong>Land & Building:</strong>{' '}

//                                                                         {pkg.land || 'N/A'}

//                                                                     </span>

//                                                                 </div>



//                                                                 <div

//                                                                     className="detail-item"

//                                                                     title={pkg.description}

//                                                                 >

//                                                                     <i className="bi bi-stars icon"></i>

//                                                                     <span>

//                                                                         <strong>Amenities:</strong>{' '}

//                                                                         {pkg.description

//                                                                             ? (

//                                                                                 pkg.description.length > 25

//                                                                                     ? `${pkg.description.slice(0, 25)}...`

//                                                                                     : pkg.description

//                                                                             )

//                                                                             : 'N/A'}

//                                                                     </span>

//                                                                 </div>

//                                                             </div>

//                                                         </div>



//                                                         {/* Action Button */}

//                                                         <button

//                                                             className={`btn-inquire ${!isClickable ? 'disabled' : ''}`}

//                                                             onClick={(e) => {

//                                                                 e.stopPropagation();

//                                                                 if (isClickable) handleCardClick(pkg);

//                                                             }}

//                                                         >

//                                                             <span>Inquire Now</span>

//                                                             <i className="bi bi-arrow-right-short ms-1"></i>

//                                                         </button>

//                                                     </div>

//                                                 </div>

//                                             );

//                                         })}

//                                 </div>

//                             </div>

//                         )}



//                         {/* Stats Section */}

//                         <div className="stats-wrapper mb-5">

//                             <div className="row g-4 text-center">

//                                 {statsData.map((stat, index) => (

//                                     <div

//                                         key={stat.id}

//                                         className={`col-12 col-sm-6 col-md-3 stat-box ${

//                                             index !== statsData.length - 1 ? 'has-stat-border' : ''

//                                         }`}

//                                     >

//                                         {stat.target > 0 ? (

//                                             <CountUpItem

//                                                 target={stat.target}

//                                                 suffix={stat.suffix}

//                                                 prefix={stat.prefix}

//                                             />

//                                         ) : (

//                                             <h2 className="stat-number">

//                                                 {stat.prefix}0{stat.suffix}

//                                             </h2>

//                                         )}

//                                         <p className="stat-label">{stat.label}</p>

//                                     </div>

//                                 ))}

//                             </div>

//                         </div>

//                     </>

//                 )}



//                 {/* Benefits Section */}

//                 {benefits.length > 0 && (

//                     <div

//                         className="benefits-card-wrapper"

//                         id="investment-benefits"

//                     >

//                         <div className="text-center mb-4">

//                             <h2 className="benefits-title">INVESTMENT BENEFITS</h2>

//                             <div className="accent-divider mx-auto"></div>

//                         </div>



//                         <div className="row g-3">

//                             {benefits.map((benefit, index) => (

//                                 <div

//                                     className="col-12 col-md-6"

//                                     key={index}

//                                 >

//                                     <div className="benefit-card">

//                                         <div className="benefit-index">

//                                             {String(index + 1).padStart(2, '0')}

//                                         </div>

//                                         <div className="benefit-description">

//                                             {benefit}

//                                         </div>

//                                     </div>

//                                 </div>

//                             ))}

//                         </div>



//                         <div className="footer-promo-box text-center mt-5">

//                             <h4 className="promo-title">

//                                 Ready to Secure Your Future?

//                             </h4>

//                             <p className="promo-description">

//                                 Join hundreds of successful investors who have already secured their financial future with Akashbari Hotels & Resorts.

//                             </p>

//                         </div>

//                     </div>

//                 )}

//             </div>

//         </section>

//     );

// };



// export default Investment;



import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import '../css/investmentcopy.css';



// Smooth Animated Counter Component

const CountUpItem = ({ target, duration = 2000, suffix = '', prefix = '' }) => {

    const [count, setCount] = useState(0);



    useEffect(() => {

        let startTimestamp = null;

        const step = (timestamp) => {

            if (!startTimestamp) startTimestamp = timestamp;

            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            const currentCount = Math.floor(progress * target);

            setCount(currentCount);



            if (progress < 1) {

                window.requestAnimationFrame(step);

            }

        };

        window.requestAnimationFrame(step);

    }, [target, duration]);



    return (

        <h2 className="stat-number">

            {prefix}{count.toLocaleString()}{suffix}

        </h2>

    );

};



const Investment = ({ showOnlyBenefits = false }) => {

    const navigate = useNavigate();

    const [packages, setPackages] = useState([]);

    const [benefits, setBenefits] = useState([]);

    const [loading, setLoading] = useState(true);

    const [combinedData, setCombinedData] = useState({

        record_members: [],

        invest_records: []

    });

    const [error, setError] = useState(null);

    const [showVilla, setShowVilla] = useState(false);



    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const API_URL = `${BASE_URL}/get-investment`;

    const BENEFITS_API_URL = `${BASE_URL}/get-investment-benefits`;



    // Dynamic Subtitle Mapping

    const getSubTitle = (title) => {

        const upperTitle = title?.toUpperCase().trim() || '';

        if (upperTitle.includes('PRESIDENTIAL')) return 'Exclusive Apartment';

        if (upperTitle.includes('EARTH')) return 'Different Touch';

        if (upperTitle.includes('EXECUTIVE')) return 'Smart Looks';

        if (upperTitle.includes('SUPERIOR')) return 'Lake View';

        return '';

    };



    // Fetch investment packages

    const fetchPackages = async () => {

        try {

            const response = await fetch(API_URL);

            const result = await response.json();



            if (result.status) {

                let allPackages = result.data;



                const getOrderIndex = (title) => {

                    const upperTitle = title?.toUpperCase().trim();

                    if (upperTitle?.includes('VILLA')) return 0;

                    if (upperTitle?.includes('PRESIDENTIAL')) return 99;

                    if (upperTitle?.includes('EARTH')) return 3;

                    if (upperTitle?.includes('EXECUTIVE')) return 2;

                    if (upperTitle?.includes('SUPERIOR')) return 1;

                   

                    return 500;

                };



                allPackages = allPackages.sort((a, b) => getOrderIndex(a.title) - getOrderIndex(b.title));

                setPackages(allPackages);

            }

        } catch (err) {

            console.error("Error fetching packages:", err);

            setError('Failed to load investment packages.');

        }

    };



    // Fetch investment benefits

    const fetchBenefits = async () => {

        try {

            const response = await fetch(BENEFITS_API_URL);

            const result = await response.json();



            if (result.status && result.data && result.data.data) {

                const benefitsData = result.data.data;

                if (benefitsData.length > 0 && benefitsData[0].benefits) {

                    setBenefits(benefitsData[0].benefits);

                } else {

                    setBenefits([]);

                }

            } else {

                setBenefits([]);

            }

        } catch (err) {

            console.error("Error fetching benefits:", err);

            setBenefits([]);

        }

    };



    // Fetch combined data for statistics

    const fetchCombinedData = async () => {

        try {

            const response = await axios.get(`${BASE_URL}/combined-records`, {

                headers: { 'Accept': 'application/json' }

            });



            if (response.data.status === true && response.data.data) {

                setCombinedData({

                    record_members: response.data.data.record_members || [],

                    invest_records: response.data.data.invest_records || []

                });

                setError(null);

            } else {

                setCombinedData({ record_members: [], invest_records: [] });

            }

        } catch (err) {

            console.error('Error fetching combined data:', err);

            setError('Failed to load data. Please try again later.');

        }

    };



    useEffect(() => {

        const fetchAllData = async () => {

            setLoading(true);

            await Promise.all([

                fetchPackages(),

                fetchBenefits(),

                fetchCombinedData()

            ]);

            setLoading(false);

        };



        fetchAllData();

    }, []);



    const handleCardClick = (pkg) => {

        const isVilla = pkg.title?.toUpperCase().includes('VILLA');

        if (isVilla || pkg.is_sold_out != 1) {

            navigate(`/package-details/${pkg.id}`, { state: { packageData: pkg } });

        }

    };



    // Villa Hover

    const handleCategoryHover = (pkg) => {

        const isVilla = pkg.title?.toUpperCase().includes('VILLA');



        if (isVilla) {

            setShowVilla(true);

        }

    };



    // Close Villa Modal

    const closeVillaModal = () => {

        setShowVilla(false);

    };



    const getStatsData = () => {

        const member = combinedData.record_members[0] || {};

        return [

            { id: 1, target: parseInt(member.member) || 0, suffix: "+", prefix: "", label: "Happy Members" },

            { id: 2, target: parseInt(member.revenue) || 0, suffix: "%", prefix: "Up to ", label: "Yearly Revenue" },

            { id: 3, target: parseInt(member.amenities) || 0, suffix: "+", prefix: "", label: "Club Amenities" },

            { id: 4, target: parseInt(member.expericence) || 0, suffix: "+", prefix: "", label: "Years of Trust" }

        ];

    };



    const statsData = getStatsData();



    if (loading) {

        return (

            <div className="loader-container">

                <div className="custom-spinner"></div>

                <p>Loading Investment Opportunities...</p>

            </div>

        );

    }



    if (error) {

        return (

            <div className="error-container">

                <p>{error}</p>

            </div>

        );

    }



    return (

        <section className="investment-section py-5">

            <div className="container">

                {!showOnlyBenefits && (

                    <>

                        {/* Header Title Section */}

                        <div className="text-center mb-5">

                            <span className="badge-opportunity">INVESTMENT OPPORTUNITIES</span>

                            <h1 className="main-title mt-3 mb-2 text-white">

                                RESORT INVESTMENT PACKAGES

                            </h1>

                            <p className="sub-text mx-auto">

                                Become a partner in Bangladesh's premier luxury resort destination and enjoy high guaranteed returns.

                            </p>

                        </div>



                        {/* Top Category Header Row */}

                        <div className="top-category-bar mb-5">

                            <div className="row g-0 align-items-center">

                                {packages.map((pkg, index) => {

                                    const isSoldOut = pkg.is_sold_out == 1;

                                    const subTitle = getSubTitle(pkg.title);

                                    const isVilla = pkg.title?.toUpperCase().includes('VILLA');



                                    return (

                                        <div

                                            key={pkg.id || index}

                                            className={`col-12 col-sm-6 col-lg p-3 text-center category-item ${

                                                index !== packages.length - 1

                                                    ? 'has-border-right'

                                                    : ''

                                            }`}

                                            onMouseEnter={() => handleCategoryHover(pkg)}

                                            style={{

                                                cursor: isVilla ? 'pointer' : 'default'

                                            }}

                                        >

                                            <h6 className="category-title">

                                                {pkg.title}

                                            </h6>



                                            {isSoldOut ? (

                                                <span className="badge-sold-out-pill">

                                                    Sold Out

                                                </span>

                                            ) : (

                                                subTitle && (

                                                    <span className="subtitle-tag">

                                                        {subTitle}

                                                    </span>

                                                )

                                            )}

                                        </div>

                                    );

                                })}

                            </div>

                        </div>



                        {/* Main Investment Cards Grid */}

                        <div className="row g-4 mb-5">

                            {packages.map((pkg, index) => {

                                const isPopular = pkg.title?.toUpperCase().includes('SUPERIOR');

                                const isVilla = pkg.title?.toUpperCase().includes('VILLA');

                                const isSoldOut = pkg.is_sold_out == 1;

                                const isClickable = isVilla || !isSoldOut;



                                // Villa will not appear in main grid

                                if (isVilla) {

                                    return null;

                                }



                                return (

                                    <div

                                        className="col-12 col-sm-6 col-lg-3"

                                        key={pkg.id || index}

                                    >

                                        <div

                                            className={`investment-card ${

                                                isSoldOut && !isVilla

                                                    ? 'card-disabled'

                                                    : ''

                                            }`}

                                            onClick={() =>

                                                isClickable && handleCardClick(pkg)

                                            }

                                        >

                                            {/* Badges */}

                                            {isPopular && (

                                                <span className="badge-popular">

                                                    Popular

                                                </span>

                                            )}



                                            {isVilla && isSoldOut && (

                                                <span className="badge-sold-out">

                                                    Sold Out

                                                </span>

                                            )}



                                            {/* Card Content */}

                                            <div className="card-body-content">

                                                <h5 className="package-title">

                                                    {pkg.title}

                                                </h5>



                                                <div className="price-info-list">

                                                    <div className="price-row">

                                                        <span className="price-label">

                                                            Share Price:

                                                        </span>

                                                        <span className="price-value-share">

                                                            ৳ {parseInt(

                                                                pkg.share_price || 0

                                                            ).toLocaleString()}

                                                        </span>

                                                    </div>



                                                    <div className="price-row highlight">

                                                        <span className="price-label">

                                                            Discount Price:

                                                        </span>

                                                        <span className="price-value discount">

                                                            ৳ {parseInt(

                                                                pkg.price || 0

                                                            ).toLocaleString()}

                                                        </span>

                                                    </div>



                                                    <div className="price-row">

                                                        <span className="price-label">

                                                            Full Payment:

                                                        </span>

                                                        <span className="price-value full-payment">

                                                            ৳ {parseInt(

                                                                pkg.discount || 0

                                                            ).toLocaleString()}

                                                        </span>

                                                    </div>

                                                </div>



                                                <hr className="card-divider" />



                                                <div className="details-list">

                                                    <div className="detail-item">

                                                        <i className="bi bi-geo-alt-fill icon"></i>

                                                        <span>

                                                            <strong>

                                                                Land & Building:

                                                            </strong>{' '}

                                                            {pkg.land || 'N/A'}

                                                        </span>

                                                    </div>



                                                    <div

                                                        className="detail-item"

                                                        title={pkg.description}

                                                    >

                                                        <i className="bi bi-stars icon"></i>

                                                        <span>

                                                            <strong>

                                                                Amenities:

                                                            </strong>{' '}

                                                            {pkg.description

                                                                ? (

                                                                    pkg.description.length > 25

                                                                        ? `${pkg.description.slice(0, 25)}...`

                                                                        : pkg.description

                                                                )

                                                                : 'N/A'}

                                                        </span>

                                                    </div>

                                                </div>

                                            </div>



                                            {/* Action Button */}

                                            <button

                                                className={`btn-inquire ${

                                                    !isClickable

                                                        ? 'disabled'

                                                        : ''

                                                }`}

                                                onClick={(e) => {

                                                    e.stopPropagation();

                                                    if (isClickable) {

                                                        handleCardClick(pkg);

                                                    }

                                                }}

                                            >

                                                <span>Inquire Now</span>

                                                <i className="bi bi-arrow-right-short ms-1"></i>

                                            </button>

                                        </div>

                                    </div>

                                );

                            })}

                        </div>



                       {/* Villa Modal */}
{showVilla && (
    <div
        className="villa-modal-overlay"
        onClick={() => setShowVilla(false)}
        style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}
    >
        <div
            className="villa-modal-content"
            style={{
                position: 'relative',
                width: '100%',
                maxWidth: '320px'
            }}
        >

            {/* X Close Button */}
            <button
                type="button"
                onClick={() => setShowVilla(false)}
                style={{
                    position: 'absolute',
                    top: '-15px',
                    right: '-15px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: 'none',
                    background: '#fff',
                    color: '#111',
                    fontSize: '24px',
                    lineHeight: '1',
                    zIndex: 10,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                }}
            >
                ×
            </button>

            {/* Villa Card */}
            {packages
                .filter(pkg =>
                    pkg.title?.toUpperCase().includes('VILLA')
                )
                .map((pkg) => {

                    const isVilla = true;
                    const isSoldOut = pkg.is_sold_out == 1;
                    const isClickable = true;

                    return (
                        <div
                            className="col-12"
                            key={pkg.id}
                        >
                            <div
                                className={`investment-card ${
                                    isSoldOut && !isVilla
                                        ? 'card-disabled'
                                        : ''
                                }`}
                                onClick={() => setShowVilla(false)}
                                style={{
                                    width: '100%',
                                    margin: 0,
                                    cursor: 'pointer'
                                }}
                            >

                                {/* Badges */}
                                {isSoldOut && (
                                    <span className="badge-sold-out">
                                        Sold Out
                                    </span>
                                )}

                                {/* Card Content */}
                                <div className="card-body-content">

                                    <h5 className="package-title">
                                        {pkg.title}
                                    </h5>

                                    <div className="price-info-list">

                                        <div className="price-row">
                                            <span className="price-label">
                                                Share Price:
                                            </span>

                                            <span className="price-value-share">
                                                ৳ {parseInt(
                                                    pkg.share_price || 0
                                                ).toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="price-row highlight">
                                            <span className="price-label">
                                                Discount Price:
                                            </span>

                                            <span className="price-value discount">
                                                ৳ {parseInt(
                                                    pkg.price || 0
                                                ).toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="price-row">
                                            <span className="price-label">
                                                Full Payment:
                                            </span>

                                            <span className="price-value full-payment">
                                                ৳ {parseInt(
                                                    pkg.discount || 0
                                                ).toLocaleString()}
                                            </span>
                                        </div>

                                    </div>

                                    <hr className="card-divider" />

                                    <div className="details-list">

                                        <div className="detail-item">
                                            <i className="bi bi-geo-alt-fill icon"></i>

                                            <span>
                                                <strong>
                                                    Land & Building:
                                                </strong>{' '}
                                                {pkg.land || 'N/A'}
                                            </span>
                                        </div>

                                        <div
                                            className="detail-item"
                                            title={pkg.description}
                                        >
                                            <i className="bi bi-stars icon"></i>

                                            <span>
                                                <strong>
                                                    Amenities:
                                                </strong>{' '}

                                                {pkg.description
                                                    ? (
                                                        pkg.description.length > 25
                                                            ? `${pkg.description.slice(0, 25)}...`
                                                            : pkg.description
                                                    )
                                                    : 'N/A'}
                                            </span>
                                        </div>

                                    </div>

                                </div>

                                {/* Action Button */}
                                <button
                                    className={`btn-inquire ${
                                        !isClickable
                                            ? 'disabled'
                                            : ''
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();

                                        if (isClickable) {
                                            handleCardClick(pkg);
                                        }
                                    }}
                                >
                                    <span>Inquire Now</span>

                                    <i className="bi bi-arrow-right-short ms-1"></i>
                                </button>

                            </div>
                        </div>
                    );
                })}

        </div>
    </div>
)}


                        {/* Stats Section */}

                        <div className="stats-wrapper mb-5">

                            <div className="row g-4 text-center">

                                {statsData.map((stat, index) => (

                                    <div

                                        key={stat.id}

                                        className={`col-12 col-sm-6 col-md-3 stat-box ${

                                            index !== statsData.length - 1

                                                ? 'has-stat-border'

                                                : ''

                                        }`}

                                    >

                                        {stat.target > 0 ? (

                                            <CountUpItem

                                                target={stat.target}

                                                suffix={stat.suffix}

                                                prefix={stat.prefix}

                                            />

                                        ) : (

                                            <h2 className="stat-number">

                                                {stat.prefix}0{stat.suffix}

                                            </h2>

                                        )}

                                        <p className="stat-label">

                                            {stat.label}

                                        </p>

                                    </div>

                                ))}

                            </div>

                        </div>

                    </>

                )}



                {/* Benefits Section */}

                {benefits.length > 0 && (

                    <div

                        className="benefits-card-wrapper"

                        id="investment-benefits"

                    >

                        <div className="text-center mb-4">

                            <h2 className="benefits-title">

                                INVESTMENT BENEFITS

                            </h2>

                            <div className="accent-divider mx-auto"></div>

                        </div>



                        <div className="row g-3">

                            {benefits.map((benefit, index) => (

                                <div

                                    className="col-12 col-md-6"

                                    key={index}

                                >

                                    <div className="benefit-card">

                                        <div className="benefit-index">

                                            {String(index + 1).padStart(2, '0')}

                                        </div>

                                        <div className="benefit-description">

                                            {benefit}

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>



                        <div className="footer-promo-box text-center mt-5">

                            <h4 className="promo-title">

                                Ready to Secure Your Future?

                            </h4>

                            <p className="promo-description">

                                Join hundreds of successful investors who have already secured their financial future with Akashbari Hotels & Resorts.

                            </p>

                        </div>

                    </div>

                )}

            </div>

        </section>

    );

};



export default Investment;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../css/Investment.css';
// import axios from 'axios';
// import ReactGA from 'react-ga';

// // CountUpItem কম্পোনেন্ট
// const CountUpItem = ({ target, duration = 2000, suffix = "", prefix = "" }) => {
//     const [count, setCount] = useState(0);

//     useEffect(() => {
//         let startTimestamp = null;
//         const step = (timestamp) => {
//             if (!startTimestamp) startTimestamp = timestamp;
//             const progress = Math.min((timestamp - startTimestamp) / duration, 1);
//             const currentCount = Math.floor(progress * target);
//             setCount(currentCount);

//             if (progress < 1) {
//                 window.requestAnimationFrame(step);
//             }
//         };
//         window.requestAnimationFrame(step);
//     }, [target, duration]);

//     return (
//         <h2 className="fw-bold" style={{ color: '#5e2e10' }}>
//             {prefix}{count.toLocaleString()}{suffix}
//         </h2>
//     );
// };

// const Investment = ({ showOnlyBenefits = false }) => {
//     const navigate = useNavigate();
//     const [packages, setPackages] = useState([]);
//     const [benefits, setBenefits] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [combinedData, setCombinedData] = useState({
//         record_members: [],
//         invest_records: []
//     });
//     const [error, setError] = useState(null);

//     const BASE_URL = import.meta.env.VITE_BASE_URL;
//     const API_URL = `${BASE_URL}/get-investment`;
//     const BENEFITS_API_URL = `${BASE_URL}/get-investment-benefits`;

//     // statsCardStyle
//     const statsCardStyle = {
//         backgroundColor: '#ffffff',
//         borderRadius: '15px',
//         padding: '40px 20px',
//         boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
//         marginTop: '0',
//         position: 'relative',
//         zIndex: '10',
//         border: '1px solid #eef2f6'
//     };

//     // Fetch investment packages
//     const fetchPackages = async () => {
//         try {
//             const response = await fetch(API_URL);
//             const result = await response.json();

//             if (result.status) {
//                 let allPackages = result.data;

//                 const getOrderIndex = (title) => {
//                     const upperTitle = title?.toUpperCase().trim();
//                     if (upperTitle?.includes('PRESIDENTIAL')) return 0;
//                     if (upperTitle?.includes('EARTH')) return 1;
//                     if (upperTitle?.includes('EXECUTIVE')) return 2;
//                     if (upperTitle?.includes('SUPERIOR')) return 3;
//                     if (upperTitle?.includes('VILLA')) return 4;
//                     return 999;
//                 };

//                 allPackages = allPackages.sort((a, b) => {
//                     return getOrderIndex(a.title) - getOrderIndex(b.title);
//                 });

//                 setPackages(allPackages);
//             }
//         } catch (error) {
//             console.error("Error fetching packages:", error);
//             setError('Failed to load packages');
//         }
//     };

//     // Fetch investment benefits
//     const fetchBenefits = async () => {
//         try {
//             const response = await fetch(BENEFITS_API_URL);
//             const result = await response.json();

//             console.log('Benefits API Response:', result);

//             if (result.status && result.data && result.data.data) {
//                 const benefitsData = result.data.data;

//                 if (benefitsData.length > 0 && benefitsData[0].benefits) {
//                     console.log('Benefits found:', benefitsData[0].benefits);
//                     setBenefits(benefitsData[0].benefits);
//                 } else {
//                     console.log('No benefits found in response');
//                     setBenefits([]);
//                 }
//             } else {
//                 setBenefits([]);
//             }
//         } catch (error) {
//             console.error("Error fetching benefits:", error);
//             setBenefits([]);
//         }
//     };

//     // Fetch combined data for stats
//     const fetchCombinedData = async () => {
//         try {
//             const response = await axios.get(`${BASE_URL}/combined-records`, {
//                 headers: {
//                     'Accept': 'application/json',
//                 }
//             });

//             if (response.data.status === true && response.data.data) {
//                 setCombinedData({
//                     record_members: response.data.data.record_members || [],
//                     invest_records: response.data.data.invest_records || []
//                 });
//                 setError(null);
//             } else {
//                 setCombinedData({
//                     record_members: [],
//                     invest_records: []
//                 });
//             }
//         } catch (error) {
//             console.error('Error fetching combined data:', error);
//             setError('Failed to load data. Please try again later.');
//         }
//     };

//     // Fetch all data
//     useEffect(() => {
//         const fetchAllData = async () => {
//             setLoading(true);
//             await Promise.all([
//                 fetchPackages(),
//                 fetchBenefits(),
//                 fetchCombinedData()
//             ]);
//             setLoading(false);
//         };

//         fetchAllData();
//     }, []);



//     const handleCardClick = (pkg) => {

        

//         if (pkg.is_sold_out != 1) {
//             navigate(`/package-details/${pkg.id}`, { state: { packageData: pkg } });
//         }
//     };

//     const getStatsData = () => {
//         const member = combinedData.record_members[0] || {};
//         return [
//             { id: 1, target: parseInt(member.member) || 0, suffix: "+", prefix: "", label: "Happy Members" },
//             { id: 2, target: parseInt(member.revenue) || 0, suffix: "%", prefix: "Up to ", label: "Yearly Revenue" },
//             { id: 3, target: parseInt(member.amenities) || 0, suffix: "+", prefix: "", label: "Club Amenities" },
//             { id: 4, target: parseInt(member.expericence) || 0, suffix: "+", prefix: "", label: "Years of Trust" }
//         ];
//     };

//     const statsData = getStatsData();

//     if (loading) {
//         return <div className="text-center py-5">Loading Investment Packages...</div>;
//     }

//     if (error) {
//         return <div className="text-center py-5 text-danger">{error}</div>;
//     }

//     return (
//         <>
//             <section className="investment-section py-5">
//                 <div className="container text-center">

//                     {/* Show only if not in benefits-only mode */}
//                     {!showOnlyBenefits && (
//                         <>
//                             <div className="badge-opportunity mb-3">INVESTMENT OPPORTUNITIES</div>

//                             {/* Desktop & Tablet - Visible */}
//                             <h1 className="main-title mb-2 desktop-only">RESORT INVESTMENT PACKAGES</h1>

//                             <div className="mx-auto"></div>

//                             {/* Desktop & Tablet - Visible */}
//                             <p className="sub-text mb-5 desktop-only">Become a partner in Bangladesh's premier luxury resort destination</p>

//                             {/* Investment Packages Grid */}
//                             <div className="row g-4 justify-content-center">
//                                 {packages.map((pkg, index) => {
//                                     const isSoldOut = pkg.is_sold_out == 1;
//                                     const isPopular = pkg.title?.toUpperCase().includes('SUPERIOR');
//                                     const isVilla = pkg.title?.toUpperCase().trim() === 'VILLA';

//                                     return (
//                                         <div className="col-lg-3 col-md-6" key={pkg.id || index}>
//                                             <div
//                                                 className={`investment-card ${isSoldOut ? 'sold-out-card' : 'clickable-card'}`}
//                                                 onClick={() => !isSoldOut && handleCardClick(pkg)}
//                                                 style={{
//                                                     cursor: isSoldOut ? 'default' : 'pointer',
//                                                     position: 'relative',
//                                                     overflow: 'visible'
//                                                 }}
//                                             >
//                                                 {/* SUPERIOR DELUXE Badge - Right Corner */}
//                                                 {isPopular && !isSoldOut && (
//                                                     <div style={{
//                                                         position: 'absolute',
//                                                         right: '5px',
//                                                         background: 'linear-gradient(135deg, #FFD700, #FFA500)',
//                                                         color: '#5e2e10',
//                                                         padding: '6px 16px',
//                                                         borderRadius: '30px',
//                                                         fontSize: '10px',
//                                                         fontWeight: '700',
//                                                         zIndex: 20,
//                                                         boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
//                                                         border: '2px solid #fff',
//                                                         textTransform: 'uppercase',
//                                                         letterSpacing: '1px',
//                                                         animation: 'slideInTop 0.5s ease-out'
//                                                     }}>
//                                                         ⭐ Popular
//                                                     </div>
//                                                 )}

//                                                 {/* SOLD OUT Badge - Right Corner for Villa */}
//                                                 {isVilla && isSoldOut && (
//                                                     <div style={{
//                                                         position: 'absolute',
//                                                         right: '5px',
//                                                         top: '5px',
//                                                         background: '#dc3545',
//                                                         color: 'white',
//                                                         padding: '6px 16px',
//                                                         borderRadius: '30px',
//                                                         fontSize: '10px',
//                                                         fontWeight: '700',
//                                                         zIndex: 20,
//                                                         boxShadow: '0 4px 15px rgba(220, 53, 69, 0.4)',
//                                                         border: '2px solid #fff',
//                                                         textTransform: 'uppercase',
//                                                         letterSpacing: '1px',
//                                                         animation: 'slideInTop 0.5s ease-out'
//                                                     }}>
//                                                         SOLD OUT
//                                                     </div>
//                                                 )}


//                                                 {/* Villa Card Content - Always shows Share Price and Full Payment */}
//                                                 {isVilla ? (
//                                                     <div className="card-content d-flex flex-column h-100 p-4" style={{ textAlign: 'left' }}>
//                                                         {/* Package Title - Left Aligned */}
//                                                         <h3 className="pkg-title mb-2" style={{
//                                                             color: '#333',
//                                                             textAlign: 'left',
//                                                             fontSize: '1.2rem',
//                                                             fontWeight: '700'
//                                                         }}>
//                                                             {pkg.title}
//                                                         </h3>

//                                                         {/* Share Price with Strikethrough - Left Aligned */}
//                                                         <div className="mb-1" style={{
//                                                             display: 'flex',
//                                                             alignItems: 'center',
//                                                             gap: '8px',
//                                                             flexWrap: 'wrap',
//                                                             justifyContent: 'flex-start'
//                                                         }}>
//                                                             <span style={{
//                                                                 fontSize: '14px',
//                                                                 fontWeight: '600',
//                                                                 color: '#333'
//                                                             }}>
//                                                                 Share Price
//                                                             </span>
//                                                             <span style={{
//                                                                 textDecoration: 'line-through',
//                                                                 color: '#999',
//                                                                 fontWeight: '600',
//                                                                 fontSize: '16px'
//                                                             }}>
//                                                                 ৳ {parseInt(pkg.share_price || 0).toLocaleString()}
//                                                             </span>
//                                                         </div>

//                                                         {/* Full Payment / Cashback - Left Aligned */}
//                                                         {parseInt(pkg.discount || 0) > 0 && (
//                                                             <p className="pkg-cashback mb-2" style={{
//                                                                 color: '#198754',
//                                                                 fontWeight: '600',
//                                                                 fontSize: '14px',
//                                                                 textAlign: 'left'
//                                                             }}>
//                                                                 Full Payment: ৳ {parseInt(pkg.discount || 0).toLocaleString()}
//                                                             </p>
//                                                         )}

//                                                         {/* Land & Building - Left Aligned */}
//                                                         <p className="pkg-detail mb-1" style={{
//                                                             fontSize: '14px',
//                                                             color: '#555',
//                                                             display: 'flex',
//                                                             justifyContent: 'space-between',
//                                                             textAlign: 'left'
//                                                         }}>
//                                                             <span><strong>Land & building</strong></span>
//                                                             <span>{pkg.land || 'N/A'}</span>
//                                                         </p>

//                                                         {/* Room Size - Left Aligned */}
//                                                         <p className="pkg-detail mb-3" style={{
//                                                             fontSize: '14px',
//                                                             color: '#555',
//                                                             display: 'flex',
//                                                             justifyContent: 'space-between',
//                                                             textAlign: 'left'
//                                                         }}>
//                                                             <span><strong>Room size</strong></span>
//                                                             <span>{pkg.total_size || 'N/A'} sft</span>
//                                                         </p>

//                                                         {/* Description - Left Aligned */}
//                                                         {pkg.description && (
//                                                             <p className="pkg-desc mb-3" style={{
//                                                                 fontSize: '13px',
//                                                                 color: '#666',
//                                                                 lineHeight: '1.5',
//                                                                 textAlign: 'left'
//                                                             }}>
//                                                                 {pkg.description.length > 80
//                                                                     ? `${pkg.description.substring(0, 80)}...`
//                                                                     : pkg.description}
//                                                             </p>
//                                                         )}


//                                                         {/* Button - Left Aligned */}
//                                                         <button
//                                                             className="inquire-btn popular-btn"
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                                 // Sold Out status ignore kore direct navigate korbe
//                                                                 navigate(`/package-details/${pkg.id}`, { state: { packageData: pkg } });
//                                                             }}
//                                                             style={{
//                                                                 textAlign: 'center'
//                                                             }}
//                                                         >
//                                                             INQUIRE NOW
//                                                         </button>
//                                                     </div>
//                                                 ) : (
//                                                     /* Other Package Cards */
//                                                     <>
//                                                         <div className="card-content d-flex flex-column h-100 p-4" style={{ textAlign: 'left' }}>
//                                                             {/* Package Title - Left Aligned */}
//                                                             <h3 className="pkg-title mb-2" style={{
//                                                                 color: '#333',
//                                                                 textAlign: 'left',
//                                                                 fontSize: '1.2rem',
//                                                                 fontWeight: '700'
//                                                             }}>
//                                                                 {pkg.title}
//                                                             </h3>

//                                                             {!isSoldOut ? (
//                                                                 <>
//                                                                     {/* Share Price with Strikethrough - Left Aligned */}
//                                                                     <div className="mb-1" style={{
//                                                                         display: 'flex',
//                                                                         alignItems: 'center',
//                                                                         gap: '8px',
//                                                                         flexWrap: 'wrap',
//                                                                         justifyContent: 'flex-start'
//                                                                     }}>
//                                                                         <span style={{
//                                                                             fontSize: '14px',
//                                                                             fontWeight: '600',
//                                                                             color: '#333'
//                                                                         }}>
//                                                                             Share Price
//                                                                         </span>
//                                                                         <span style={{
//                                                                             textDecoration: 'line-through',
//                                                                             color: '#999',
//                                                                             fontWeight: '600',
//                                                                             fontSize: '16px'
//                                                                         }}>
//                                                                             ৳ {parseInt(pkg.share_price || 0).toLocaleString()}
//                                                                         </span>
//                                                                     </div>

//                                                                     {/* Discount Price - Left Aligned */}
//                                                                     <div style={{
//                                                                         display: 'flex',
//                                                                         alignItems: 'center',
//                                                                         gap: '10px',
//                                                                         flexWrap: 'wrap',
//                                                                         textAlign: 'left',
//                                                                         marginBottom: '4px'
//                                                                     }}>
//                                                                         <span style={{
//                                                                             fontSize: '14px',
//                                                                             fontWeight: '600',
//                                                                             color: '#333'
//                                                                         }}>
//                                                                             Discount Price
//                                                                         </span>
//                                                                         <h3 className="pkg-price mb-0" style={{
//                                                                             color: '#ff8c32',
//                                                                             fontSize: '1.8rem',
//                                                                             fontWeight: '700',
//                                                                             margin: 0
//                                                                         }}>
//                                                                             ৳ {parseInt(pkg.price || 0).toLocaleString()}
//                                                                         </h3>
//                                                                     </div>

//                                                                     {/* Full Payment / Cashback - Left Aligned */}
//                                                                     {parseInt(pkg.discount || 0) > 0 && (
//                                                                         <p className="pkg-cashback mb-2" style={{
//                                                                             color: '#198754',
//                                                                             fontWeight: '600',
//                                                                             fontSize: '14px',
//                                                                             textAlign: 'left'
//                                                                         }}>
//                                                                             Full Payment: ৳ {parseInt(pkg.discount || 0).toLocaleString()}
//                                                                         </p>
//                                                                     )}
//                                                                 </>
//                                                             ) : (
//                                                                 <div style={{
//                                                                     background: '#dc3545',
//                                                                     color: 'white',
//                                                                     padding: '8px 15px',
//                                                                     borderRadius: '8px',
//                                                                     display: 'inline-block',
//                                                                     fontWeight: '700',
//                                                                     fontSize: '16px',
//                                                                     marginBottom: '10px',
//                                                                     textAlign: 'left'
//                                                                 }}>
//                                                                     🎯 SOLD OUT
//                                                                 </div>
//                                                             )}

//                                                             {/* Land & Building - Left Aligned */}
//                                                             <p className="pkg-detail mb-1" style={{
//                                                                 fontSize: '14px',
//                                                                 color: '#555',
//                                                                 display: 'flex',
//                                                                 justifyContent: 'space-between',
//                                                                 textAlign: 'left'
//                                                             }}>
//                                                                 <span><strong>Land & building</strong></span>
//                                                                 <span>{pkg.land || 'N/A'}</span>
//                                                             </p>

//                                                             {/* Room Size - Left Aligned */}
//                                                             <p className="pkg-detail mb-3" style={{
//                                                                 fontSize: '14px',
//                                                                 color: '#555',
//                                                                 display: 'flex',
//                                                                 justifyContent: 'space-between',
//                                                                 textAlign: 'left'
//                                                             }}>
//                                                                 <span><strong>Room size</strong></span>
//                                                                 <span>{pkg.total_size || 'N/A'} sft</span>
//                                                             </p>

//                                                             {/* Description - Left Aligned */}
//                                                             {pkg.description && (
//                                                                 <p className="pkg-desc mb-3" style={{
//                                                                     fontSize: '13px',
//                                                                     color: '#666',
//                                                                     lineHeight: '1.5',
//                                                                     textAlign: 'left'
//                                                                 }}>
//                                                                     {pkg.description.length > 80
//                                                                         ? `${pkg.description.substring(0, 80)}...`
//                                                                         : pkg.description}
//                                                                 </p>
//                                                             )}

//                                                             {/* Button - Left Aligned */}



//                                                             {isSoldOut ? (
//                                                                 <button className="inquire-btn sold-out-footer" disabled style={{
//                                                                     background: '#94a3b8',
//                                                                     cursor: 'not-allowed',
//                                                                     opacity: '0.7',
//                                                                     textAlign: 'center'
//                                                                 }}>
//                                                                     SOLD OUT
//                                                                 </button>
//                                                             ) : (
//                                                                 <button className="inquire-btn popular-btn" style={{
//                                                                     textAlign: 'center'
//                                                                 }}>
//                                                                     INQUIRE NOW
//                                                                 </button>
//                                                             )}
//                                                         </div>
//                                                     </>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </>
//                     )}

//                     {/* STATS SECTION - Hide when showOnlyBenefits is true */}
//                     {!showOnlyBenefits && (
//                         <div className="stat-container my-5" style={{ marginTop: '0', paddingTop: '20px' }}>
//                             <div className="row justify-content-center">
//                                 <div className="col-lg-11">
//                                     <div style={statsCardStyle} className="text-center">
//                                         <div className="row g-4">
//                                             {statsData.map((stat, index) => (
//                                                 <div key={stat.id} className={`col-md-3 ${index !== statsData.length - 1 ? 'border-end' : ''}`} style={{ borderColor: '#e2e8f0' }}>
//                                                     {stat.target > 0 ? (
//                                                         <CountUpItem
//                                                             target={stat.target}
//                                                             suffix={stat.suffix}
//                                                             prefix={stat.prefix}
//                                                         />
//                                                     ) : (
//                                                         <h2 className="fw-bold" style={{ color: '#5e2e10' }}>
//                                                             {stat.prefix}0{stat.suffix}
//                                                         </h2>
//                                                     )}
//                                                     <p className="fw-bold mb-0" style={{ color: '#718096' }}>{stat.label}</p>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* BENEFITS SECTION - Always show */}
//                 {benefits.length > 0 && (
//                     <div className="benefits-container container p-5 bg-white" id="investment-benefits">
//                         <h2 className='display-4 fw-normal mb-2 text-center' style={{ fontSize: '1.8rem', fontWeight: '500', color: '#5e2e10', fontFamily: 'serif' }}>Investment Benefits</h2>
//                         <div className="yellow-divider mx-auto mb-4"></div>
//                         <div className="row g-3">
//                             {benefits.map((benefit, index) => (
//                                 <div className="col-12 col-md-6" key={index}>
//                                     <div className="benefit-item d-flex align-items-center">
//                                         <span className="benefit-number">{String(index + 1).padStart(2, '0')}</span>
//                                         <span className="benefit-text">{benefit}</span>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="footer-promo text-center mt-5">
//                             <h4 className="promo-question">Ready to Secure Your Future?</h4>
//                             <p className="promo-text">Join hundreds of successful investors who have already secured their financial future with Akashbari Hotels & Resorts.</p>
//                         </div>
//                     </div>
//                 )}
//             </section>
//         </>
//     );
// };

// export default Investment;