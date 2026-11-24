

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

//     // NEW: Scroll handler to close modal
//     useEffect(() => {
//         const handleScroll = () => {
//             if (showVilla) {
//                 setShowVilla(false);
//             }
//         };

//         if (showVilla) {
//             window.addEventListener('scroll', handleScroll);
//         }

//         return () => {
//             window.removeEventListener('scroll', handleScroll);
//         };
//     }, [showVilla]);

//     // Dynamic Subtitle Mapping
//     const getSubTitle = (title) => {
//         const upperTitle = title?.toUpperCase().trim() || '';
//         if (upperTitle.includes('PRESIDENTIAL')) return 'Exclusive Apartment';
//         if (upperTitle.includes('EARTH')) return 'Different Touch';
//         if (upperTitle.includes('EXECUTIVE')) return 'Smart Looks';
//         if (upperTitle.includes('SUPERIOR')) return 'Lake View';
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

//     // Villa Hover
//     const handleCategoryHover = (pkg) => {
//         const isVilla = pkg.title?.toUpperCase().includes('VILLA');

//         if (isVilla) {
//             setShowVilla(true);
//         }
//     };

//     // Close Villa Modal
//     const closeVillaModal = () => {
//         setShowVilla(false);
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
//                             <h1 className="main-title mt-3 mb-2 text-white">
//                                 RESORT INVESTMENT PACKAGES
//                             </h1>
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
//                                                 index !== packages.length - 1
//                                                     ? 'has-border-right'
//                                                     : ''
//                                             }`}
//                                             onMouseEnter={() => handleCategoryHover(pkg)}
//                                             style={{
//                                                 cursor: isVilla ? 'pointer' : 'default'
//                                             }}
//                                         >
//                                             <h6 className="category-title">
//                                                 {pkg.title}
//                                             </h6>

//                                             {isSoldOut ? (
//                                                 <span className="badge-sold-out-pill">
//                                                     Sold Out
//                                                 </span>
//                                             ) : (
//                                                 subTitle && (
//                                                     <span className="subtitle-tag">
//                                                         {subTitle}
//                                                     </span>
//                                                 )
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
//                                             className={`investment-card ${
//                                                 isSoldOut && !isVilla
//                                                     ? 'card-disabled'
//                                                     : ''
//                                             }`}
//                                             onClick={() =>
//                                                 isClickable && handleCardClick(pkg)
//                                             }
//                                         >
//                                             {/* Badges */}
//                                             {isPopular && (
//                                                 <span className="badge-popular">
//                                                     Popular
//                                                 </span>
//                                             )}

//                                             {isVilla && isSoldOut && (
//                                                 <span className="badge-sold-out">
//                                                     Sold Out
//                                                 </span>
//                                             )}

//                                             {/* Card Content */}
//                                             <div className="card-body-content">
//                                                 <h5 className="package-title">
//                                                     {pkg.title}
//                                                 </h5>

//                                                 <div className="price-info-list">
//                                                     <div className="price-row">
//                                                         <span className="price-label">
//                                                             Share Price:
//                                                         </span>
//                                                         <span className="price-value-share">
//                                                             ৳ {parseInt(
//                                                                 pkg.share_price || 0
//                                                             ).toLocaleString()}
//                                                         </span>
//                                                     </div>

//                                                     <div className="price-row highlight">
//                                                         <span className="price-label">
//                                                             Discount Price:
//                                                         </span>
//                                                         <span className="price-value discount">
//                                                             ৳ {parseInt(
//                                                                 pkg.price || 0
//                                                             ).toLocaleString()}
//                                                         </span>
//                                                     </div>

//                                                     <div className="price-row">
//                                                         <span className="price-label">
//                                                             Full Payment:
//                                                         </span>
//                                                         <span className="price-value full-payment">
//                                                             ৳ {parseInt(
//                                                                 pkg.discount || 0
//                                                             ).toLocaleString()}
//                                                         </span>
//                                                     </div>
//                                                 </div>

//                                                 <hr className="card-divider" />

//                                                 <div className="details-list">
//                                                     <div className="detail-item">
//                                                         <i className="bi bi-geo-alt-fill icon"></i>
//                                                         <span>
//                                                             <strong>
//                                                                 Land & Building:
//                                                             </strong>{' '}
//                                                             {pkg.land || 'N/A'}
//                                                         </span>
//                                                     </div>

//                                                     <div
//                                                         className="detail-item"
//                                                         title={pkg.description}
//                                                     >
//                                                         <i className="bi bi-stars icon"></i>
//                                                         <span>
//                                                             <strong>
//                                                                 Amenities:
//                                                             </strong>{' '}
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
//                                                 className={`btn-inquire ${
//                                                     !isClickable
//                                                         ? 'disabled'
//                                                         : ''
//                                                 }`}
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     if (isClickable) {
//                                                         handleCardClick(pkg);
//                                                     }
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
//                                     style={{
//                                         position: 'relative',
//                                         width: '100%',
//                                         maxWidth: '320px'
//                                     }}
//                                 >

//                                     {/* X Close Button */}
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
//                                                         className={`investment-card ${
//                                                             isSoldOut && !isVilla
//                                                                 ? 'card-disabled'
//                                                                 : ''
//                                                         }`}
//                                                         onClick={() => setShowVilla(false)}
//                                                         style={{
//                                                             width: '100%',
//                                                             margin: 0,
//                                                             cursor: 'pointer'
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
//                                                                         ৳ {parseInt(
//                                                                             pkg.share_price || 0
//                                                                         ).toLocaleString()}
//                                                                     </span>
//                                                                 </div>

//                                                                 <div className="price-row highlight">
//                                                                     <span className="price-label">
//                                                                         Discount Price:
//                                                                     </span>

//                                                                     <span className="price-value discount">
//                                                                         ৳ {parseInt(
//                                                                             pkg.price || 0
//                                                                         ).toLocaleString()}
//                                                                     </span>
//                                                                 </div>

//                                                                 <div className="price-row">
//                                                                     <span className="price-label">
//                                                                         Full Payment:
//                                                                     </span>

//                                                                     <span className="price-value full-payment">
//                                                                         ৳ {parseInt(
//                                                                             pkg.discount || 0
//                                                                         ).toLocaleString()}
//                                                                     </span>
//                                                                 </div>

//                                                             </div>

//                                                             <hr className="card-divider" />

//                                                             <div className="details-list">

//                                                                 <div className="detail-item">
//                                                                     <i className="bi bi-geo-alt-fill icon"></i>

//                                                                     <span>
//                                                                         <strong>
//                                                                             Land & Building:
//                                                                         </strong>{' '}
//                                                                         {pkg.land || 'N/A'}
//                                                                     </span>
//                                                                 </div>

//                                                                 <div
//                                                                     className="detail-item"
//                                                                     title={pkg.description}
//                                                                 >
//                                                                     <i className="bi bi-stars icon"></i>

//                                                                     <span>
//                                                                         <strong>
//                                                                             Amenities:
//                                                                         </strong>{' '}

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
//                                                             className={`btn-inquire ${
//                                                                 !isClickable
//                                                                     ? 'disabled'
//                                                                     : ''
//                                                             }`}
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();

//                                                                 if (isClickable) {
//                                                                     handleCardClick(pkg);
//                                                                 }
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
//                                             index !== statsData.length - 1
//                                                 ? 'has-stat-border'
//                                                 : ''
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
//                                         <p className="stat-label">
//                                             {stat.label}
//                                         </p>
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
//                             <h2 className="benefits-title">
//                                 INVESTMENT BENEFITS
//                             </h2>
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
        let frameId;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) frameId = window.requestAnimationFrame(step);
        };
        frameId = window.requestAnimationFrame(step);
        return () => window.cancelAnimationFrame(frameId);
    }, [target, duration]);

    return (
        <h2 className="stat-number">
            {prefix}{count.toLocaleString()}{suffix}
        </h2>
    );
};

// ---------- Helpers ----------
const isSoldOutPkg = (pkg) => Number(pkg.is_sold_out) === 1;
const formatTk = (value) => `৳ ${parseInt(value || 0, 10).toLocaleString()}`;

// উপরের category bar এর subtitle
const getSubTitle = (title) => {
    const t = title?.toUpperCase().trim() || '';
    if (t.includes('VILLA')) return 'Private Villa';
    if (t.includes('PRESIDENTIAL')) return 'Exclusive Apartment';
    if (t.includes('EARTH')) return 'Different Touch';
    if (t.includes('EXECUTIVE')) return 'Smart Looks';
    if (t.includes('SUPERIOR')) return 'Lake View';
    return '';
};

const getOrderIndex = (title) => {
    const t = title?.toUpperCase().trim() || '';
    if (t.includes('VILLA')) return 0;
    if (t.includes('SUPERIOR')) return 1;
    if (t.includes('EXECUTIVE')) return 2;
    if (t.includes('EARTH')) return 3;
    if (t.includes('PRESIDENTIAL')) return 99;
    return 500;
};

// ---------- Package Card (grid আর sold-out popup দুই জায়গাতেই একই card) ----------
const PackageCard = ({ pkg, onInquire, isPopular, soldOut = false }) => (
    <div
        className="investment-card"
        onClick={soldOut ? undefined : onInquire}
        style={{ cursor: soldOut ? 'default' : 'pointer' }}
    >
        {isPopular && !soldOut && <span className="badge-popular">Popular</span>}
        {soldOut && <span className="badge-sold-out">Sold Out</span>}

        <div className="card-body-content">
            <h5 className="package-title">{pkg.title}</h5>

            <div className="price-info-list">
                <div className="price-row">
                    <span className="price-label">Share Price:</span>
                    <span className="price-value-share">{formatTk(pkg.share_price)}</span>
                </div>

                <div className="price-row highlight">
                    <span className="price-label">Discount Price:</span>
                    <span className="price-value discount">{formatTk(pkg.price)}</span>
                </div>

                <div className="price-row">
                    <span className="price-label">Full Payment:</span>
                    <span className="price-value full-payment">{formatTk(pkg.discount)}</span>
                </div>
            </div>

            <hr className="card-divider" />

            <div className="details-list">
                <div className="detail-item">
                    <i className="bi bi-geo-alt-fill icon"></i>
                    <span>
                        <strong>Land & Building:</strong> {pkg.land || 'N/A'}
                    </span>
                </div>

                <div className="detail-item" title={pkg.description}>
                    <i className="bi bi-stars icon"></i>
                    <span>
                        <strong>Amenities:</strong>{' '}
                        {pkg.description
                            ? (pkg.description.length > 25 ? `${pkg.description.slice(0, 25)}...` : pkg.description)
                            : 'N/A'}
                    </span>
                </div>
            </div>
        </div>

        <button
            className={`btn-inquire ${soldOut ? 'disabled' : ''}`}
            disabled={soldOut}
            onClick={(e) => {
                e.stopPropagation();
                if (!soldOut) onInquire();
            }}
        >
            <span>{soldOut ? 'Sold Out' : 'Inquire Now'}</span>
            {!soldOut && <i className="bi bi-arrow-right-short ms-1"></i>}
        </button>
    </div>
);

const Investment = ({ showOnlyBenefits = false }) => {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [benefits, setBenefits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [combinedData, setCombinedData] = useState({ record_members: [], invest_records: [] });
    const [error, setError] = useState(null);

    // Sold out package — hover করলে popup এ দেখাবে
    const [previewPkg, setPreviewPkg] = useState(null);

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const API_URL = `${BASE_URL}/get-investment`;
    const BENEFITS_API_URL = `${BASE_URL}/get-investment-benefits`;

    // Scroll করলে popup বন্ধ
    useEffect(() => {
        if (!previewPkg) return;
        const handleScroll = () => setPreviewPkg(null);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [previewPkg]);

    // ESC চাপলে popup বন্ধ
    useEffect(() => {
        if (!previewPkg) return;
        const onKey = (e) => e.key === 'Escape' && setPreviewPkg(null);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [previewPkg]);

    // Fetch investment packages
    const fetchPackages = async () => {
        try {
            const response = await fetch(API_URL);
            const result = await response.json();

            if (result.status && Array.isArray(result.data)) {
                const sorted = [...result.data].sort((a, b) => getOrderIndex(a.title) - getOrderIndex(b.title));
                setPackages(sorted);
            }
        } catch (err) {
            console.error('Error fetching packages:', err);
            setError('Failed to load investment packages.');
        }
    };

    // Fetch investment benefits
    const fetchBenefits = async () => {
        try {
            const response = await fetch(BENEFITS_API_URL);
            const result = await response.json();
            const benefitsData = result?.data?.data;

            if (result.status && Array.isArray(benefitsData) && benefitsData[0]?.benefits) {
                setBenefits(benefitsData[0].benefits);
            } else {
                setBenefits([]);
            }
        } catch (err) {
            console.error('Error fetching benefits:', err);
            setBenefits([]);
        }
    };

    // Fetch combined data for statistics
    const fetchCombinedData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/combined-records`, {
                headers: { Accept: 'application/json' },
            });

            if (response.data.status === true && response.data.data) {
                setCombinedData({
                    record_members: response.data.data.record_members || [],
                    invest_records: response.data.data.invest_records || [],
                });
            } else {
                setCombinedData({ record_members: [], invest_records: [] });
            }
        } catch (err) {
            // Stats না এলেও পুরো section বন্ধ হবে না — শুধু 0 দেখাবে
            console.error('Error fetching combined data:', err);
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            await Promise.all([fetchPackages(), fetchBenefits(), fetchCombinedData()]);
            setLoading(false);
        };
        fetchAllData();
    }, []);

    const goToDetails = (pkg) => {
        if (isSoldOutPkg(pkg)) return;
        navigate(`/package-details/${pkg.id}`, { state: { packageData: pkg } });
    };

    // উপরের bar এ sold out package এর নামে hover / tap → popup
    const openPreview = (pkg) => {
        if (isSoldOutPkg(pkg)) setPreviewPkg(pkg);
    };

    const getStatsData = () => {
        const member = combinedData.record_members[0] || {};
        return [
            { id: 1, target: parseInt(member.member, 10) || 0, suffix: '+', prefix: '', label: 'Happy Members' },
            { id: 2, target: parseInt(member.revenue, 10) || 0, suffix: '%', prefix: 'Up to ', label: 'Yearly Revenue' },
            { id: 3, target: parseInt(member.amenities, 10) || 0, suffix: '+', prefix: '', label: 'Club Amenities' },
            { id: 4, target: parseInt(member.expericence, 10) || 0, suffix: '+', prefix: '', label: 'Years of Trust' },
        ];
    };

    const statsData = getStatsData();

    // নিচের grid: শুধু available package (Villa সহ) — sold out বাদ
    const gridPackages = packages.filter((pkg) => !isSoldOutPkg(pkg));

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
                            <h1 className="main-title mt-3 mb-2 text-white">RESORT INVESTMENT PACKAGES</h1>
                            <p className="sub-text mx-auto">
                                Become a partner in Bangladesh's premier luxury resort destination and enjoy high guaranteed returns.
                            </p>
                        </div>

                        {/* Top Category Header Row — সব package (sold out সহ) */}
                        <div className="top-category-bar mb-5">
                            <div className="row g-0 align-items-center">
                                {packages.map((pkg, index) => {
                                    const isSoldOut = isSoldOutPkg(pkg);
                                    const subTitle = getSubTitle(pkg.title);

                                    return (
                                        <div
                                            key={pkg.id || index}
                                            className={`col-12 col-sm-6 col-lg p-3 text-center category-item ${
                                                index !== packages.length - 1 ? 'has-border-right' : ''
                                            }`}
                                            onMouseEnter={() => openPreview(pkg)}
                                            onClick={() => openPreview(pkg)}
                                            role={isSoldOut ? 'button' : undefined}
                                            tabIndex={isSoldOut ? 0 : undefined}
                                            onKeyDown={(e) => isSoldOut && e.key === 'Enter' && openPreview(pkg)}
                                            style={{ cursor: isSoldOut ? 'pointer' : 'default' }}
                                            title={isSoldOut ? 'View package details' : undefined}
                                        >
                                            <h6 className="category-title">{pkg.title}</h6>

                                            {isSoldOut ? (
                                                <span className="badge-sold-out-pill">Sold Out</span>
                                            ) : (
                                                subTitle && <span className="subtitle-tag">{subTitle}</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Main Investment Cards Grid — Villa সহ সব available package */}
                        {gridPackages.length > 0 ? (
                            <div className="row g-4 mb-5 justify-content-center">
                                {gridPackages.map((pkg, index) => (
                                    <div className="col-12 col-sm-6 col-lg-3" key={pkg.id || index}>
                                        <PackageCard
                                            pkg={pkg}
                                            isPopular={pkg.title?.toUpperCase().includes('SUPERIOR')}
                                            onInquire={() => goToDetails(pkg)}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="sub-text text-center mx-auto mb-5">
                                All packages are currently sold out. Please contact us for upcoming opportunities.
                            </p>
                        )}

                        {/* Sold Out Package Popup (আগের Villa popup এর মতো) */}
                        {previewPkg && (
                            <div
                                className="villa-modal-overlay"
                                onClick={() => setPreviewPkg(null)}
                                style={{
                                    position: 'fixed',
                                    inset: 0,
                                    background: 'rgba(0, 0, 0, 0.75)',
                                    zIndex: 9999,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '20px',
                                }}
                            >
                                <div
                                    className="villa-modal-content"
                                    onClick={(e) => e.stopPropagation()}
                                    style={{ position: 'relative', width: '100%', maxWidth: '320px' }}
                                >
                                    {/* X Close Button */}
                                    <button
                                        type="button"
                                        aria-label="Close"
                                        onClick={() => setPreviewPkg(null)}
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
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                        }}
                                    >
                                        ×
                                    </button>

                                    <PackageCard pkg={previewPkg} soldOut onInquire={() => {}} />
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
                                            index !== statsData.length - 1 ? 'has-stat-border' : ''
                                        }`}
                                    >
                                        {stat.target > 0 ? (
                                            <CountUpItem target={stat.target} suffix={stat.suffix} prefix={stat.prefix} />
                                        ) : (
                                            <h2 className="stat-number">{stat.prefix}0{stat.suffix}</h2>
                                        )}
                                        <p className="stat-label">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Benefits Section */}
                {benefits.length > 0 && (
                    <div className="benefits-card-wrapper" id="investment-benefits">
                        <div className="text-center mb-4">
                            <h2 className="benefits-title">INVESTMENT BENEFITS</h2>
                            <div className="accent-divider mx-auto"></div>
                        </div>

                        <div className="row g-3">
                            {benefits.map((benefit, index) => (
                                <div className="col-12 col-md-6" key={index}>
                                    <div className="benefit-card">
                                        <div className="benefit-index">{String(index + 1).padStart(2, '0')}</div>
                                        <div className="benefit-description">{benefit}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="footer-promo-box text-center mt-5">
                            <h4 className="promo-title">Ready to Secure Your Future?</h4>
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