// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../css/Investment.css';

// const Investment = () => {
//     const navigate = useNavigate();
//     const [packages, setPackages] = useState([]);
//     const [benefitsData, setBenefitsData] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const BASE_URL = import.meta.env.VITE_BASE_URL;
//     const API_URL = `${BASE_URL}/get-investment`;
//     const BENEFITS_API_URL = `${BASE_URL}/get-investment-benefits`;

//     const fetchData = async () => {
//         try {
//             setLoading(true);
//             const [packageRes, benefitsRes] = await Promise.all([
//                 fetch(API_URL),
//                 fetch(BENEFITS_API_URL)
//             ]);
//             const packageResult = await packageRes.json();
//             const benefitsResult = await benefitsRes.json();
//             if (packageResult.status) {
//                 setPackages(packageResult.data);
//             }
//             if (benefitsResult.status) {
//                 setBenefitsData(benefitsResult.data.data[0]);
//             }
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const handleCardClick = (pkg) => {
//         if (pkg.is_sold_out != 1) {
//             navigate(`/package-details/${pkg.id}`, { state: { packageData: pkg } });
//         }
//     };

//     // 4 cards data for new design section
//     const newCards = [
//         {
//             id: 'villa-card',
//             title: 'VILLA',

//         },
//         {
//             id: 'presidential-card',
//             title: 'PRESIDENTIAL SUITE',

//         },
//         {
//             id: 'executive-card',
//             title: 'EXECUTIVE SUITE',

//         },
//         {
//             id: 'superior-card',
//             title: 'SUPERIOR DELUXE',

//         }
//     ];

//     if (loading) {
//         return <div className="text-center py-5">Loading Investment Packages...</div>;
//     }

//     return (
//         <section className="investment-section py-5">
//             <div className="container text-center">
//                 <div className="badge-opportunity mb-3">INVESTMENT OPPORTUNITIES</div>
//                 <h1 className="main-title mb-2">RESORT INVESTMENT PACKAGES</h1>
//                 <div className="yellow-divider mx-auto mb-4"></div>
//                 <p className="sub-text mb-5">Become a partner in Bangladesh's premier luxury resort destination</p>

//                 {/* NEW DESIGN ADDED HERE - 4 cards with category lines */}
//                 <div className="new-design-section">
//                     <div className="row g-4 justify-content-center">
//                         {newCards.map((pkg) => (
//                             <div className="col-lg-3 col-md-6" key={pkg.id}>
//                                 <div
//                                     className={`investment-card popular-border ${pkg.is_sold_out == 1 ? 'sold-out-card' : 'clickable-card'}`}
//                                     onClick={() => handleCardClick(pkg)}
//                                     style={{ cursor: pkg.is_sold_out == 1 ? 'default' : 'pointer', minHeight: '180px', maxHeight: '200px' }}
//                                 >
//                                     <div className="card-content d-flex flex-column h-100 p-3" style={{ marginTop: '5px', overflow: 'visible' }}>
//                                         <h3 className="pkg-title mt-3" style={{ minHeight: 'auto', fontSize: '1.1rem' }}>{pkg.title}</h3>

//                                         {pkg.is_sold_out == 1 ? (
//                                             <div className="sold-out-container my-auto">
//                                                 <div className="sold-out-btn">SOLD OUT</div>
//                                             </div>
//                                         ) : (
//                                             <></>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Your existing API packages section */}
//                 <div className="row g-4 justify-content-center mt-5">
//                     {packages.map((pkg) => (
//                         <div className="col-lg-3 col-md-6" key={pkg.id}>
//                             <div
//                                 className={`investment-card popular-border ${pkg.is_sold_out == 1 ? 'sold-out-card' : 'clickable-card'}`}
//                                 onClick={() => handleCardClick(pkg)}
//                                 style={{ cursor: pkg.is_sold_out == 1 ? 'default' : 'pointer' }}
//                             >
//                                 <div className="popular-badge-centered">POPULAR</div>
//                                 <div className="card-content d-flex flex-column h-100 p-3">
//                                     <h3 className="pkg-title mt-3">{pkg.title}</h3>

//                                     {pkg.is_sold_out == 1 ? (
//                                         <div className="sold-out-container my-auto">
//                                             <div className="sold-out-btn">SOLD OUT</div>
//                                         </div>
//                                     ) : (
//                                         <>
//                                             <h2 className="pkg-price mb-0">৳ {parseInt(pkg.price).toLocaleString()} BDT</h2>
//                                             <p className="pkg-cashback text-success fw-bold mb-0" style={{ fontSize: '1.2rem' }}>
//                                                 Cashback: ৳ {parseInt(pkg.discount).toLocaleString()} BDT
//                                             </p>
//                                             <ul className="pkg-features text-start ps-3 mt-2 mb-2">
//                                                 <li><strong>Land & Building:</strong> {pkg.land || 'N/A'}</li>
//                                                 <li><strong>Total Room Size:</strong> {pkg.total_size || 'N/A'} sqft</li>
//                                                 <li><strong>+ Amenities</strong></li>
//                                             </ul>
//                                             <p className="pkg-desc px-2 mt-2 mb-2">
//                                                 {pkg.description && pkg.description.length > 80
//                                                     ? `${pkg.description.substring(0, 80)}...`
//                                                     : pkg.description}
//                                             </p>
//                                         </>
//                                     )}

//                                     <button className={`inquire-btn mt-2 ${pkg.is_sold_out == 1 ? 'sold-out-footer' : 'popular-btn'}`}>
//                                         {pkg.is_sold_out == 1 ? "NOT AVAILABLE" : "INQUIRE NOW"}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {benefitsData && (
//                 <div className="benefits-container container mt-5 p-5 bg-white">
//                     <h2 className='display-4 fw-normal text-uppercase mb-2 text-center mb-2'> Investment Benefits</h2>
//                     <div className="row g-3">
//                         {benefitsData.benefits && benefitsData.benefits.map((benefit, index) => (
//                             <div className={index === benefitsData.benefits.length - 1 ? "col-12" : "col-md-6"} key={index}>
//                                 <div className={`benefit-item d-flex ${index === benefitsData.benefits.length - 1 ? "align-items-start" : "align-items-center"}`}>
//                                     <span className="benefit-number">{String(index + 1).padStart(2, '0')}</span>
//                                     <span className="benefit-text">{benefit}</span>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                     <div className="footer-promo text-center mt-5">
//                         <h4 className="promo-question">Ready to Secure Your Future?</h4>
//                         <p className="promo-text">Join hundreds of successful investors who have already secured their financial future with Akashbari Hotels & Resorts.</p>
//                     </div>
//                 </div>
//             )}
//         </section>
//     );
// };

// export default Investment;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Investment.css';

const Investment = () => {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [benefitsData, setBenefitsData] = useState(null);
    const [loading, setLoading] = useState(true);

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const API_URL = `${BASE_URL}/get-investment`;
    const BENEFITS_API_URL = `${BASE_URL}/get-investment-benefits`;

    const fetchData = async () => {
        try {
            setLoading(true);
            const [packageRes, benefitsRes] = await Promise.all([
                fetch(API_URL),
                fetch(BENEFITS_API_URL)
            ]);
            const packageResult = await packageRes.json();
            const benefitsResult = await benefitsRes.json();
            if (packageResult.status) {
                // Filter out VILLA from API packages
                const filteredPackages = packageResult.data.filter(pkg => pkg.title !== 'VILLA');
                setPackages(filteredPackages);
            }
            if (benefitsResult.status) {
                setBenefitsData(benefitsResult.data.data[0]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCardClick = (pkg) => {
        if (pkg.is_sold_out != 1) {
            navigate(`/package-details/${pkg.id}`, { state: { packageData: pkg } });
        }
    };

    // Function to get message based on title
    const getMessage = (title) => {
        switch (title) {
            case 'VILLA':
                return 'SOLD OUT';
            case 'EARTH SHELTER':
                return 'Different Touch';
            case 'PRESIDENTIAL SUITE':
                return 'Exclusive Apartment';
            case 'EXECUTIVE SUITE':
                return 'Smart Looky';
            case 'SUPERIOR DELUXE':
                return 'Lake View';
            default:
                return '';
        }
    };

    // Function to get background color based on message
    const getMessageBgColor = (title) => {
        if (title === 'VILLA') {
            return '#e00000'; // Red for SOLD OUT
        }
        return '#639c4e'; // Green for others
    };

    // 5 cards data for new design section
    const newCards = [
        {
            id: 'villa-card',
            title: 'VILLA',
            is_sold_out: 1
        },
        {
            id: 'earthshelter-card',
            title: 'EARTH SHELTER',
            is_sold_out: 0
        },
        {
            id: 'presidential-card',
            title: 'PRESIDENTIAL SUITE',
            is_sold_out: 0
        },
        {
            id: 'executive-card',
            title: 'EXECUTIVE SUITE',
            is_sold_out: 0
        },
        {
            id: 'superior-card',
            title: 'SUPERIOR DELUXE',
            is_sold_out: 0
        }
    ];

    if (loading) {
        return <div className="text-center py-5">Loading Investment Packages...</div>;
    }

    return (
        <section className="investment-section py-5">
            <div className="container text-center">
                <div className="badge-opportunity mb-3">INVESTMENT OPPORTUNITIES</div>
                <h1 className="main-title mb-2">RESORT INVESTMENT PACKAGES</h1>
                <div className="yellow-divider mx-auto mb-4"></div>
                <p className="sub-text mb-5">Become a partner in Bangladesh's premier luxury resort destination</p>

                {/* NEW DESIGN ADDED HERE - 5 cards in parallel row */}
                <div className="new-design-section">
                    <div className="row g-4 justify-content-center">
                        {newCards.map((pkg) => (
                            <div className="col" key={pkg.id} style={{ flex: '1 0 18%', maxWidth: '20%' }}>
                                <div
                                    className="investment-card popular-border new-card-no-hover"
                                    style={{ minHeight: '180px', maxHeight: '200px', cursor: 'default' }}
                                >
                                    <div className="card-content d-flex flex-column h-100 p-3" style={{ marginTop: '5px', overflow: 'visible' }}>
                                        <h4 className="pkg-title mt-3" style={{ minHeight: 'auto', fontSize: '1rem', textAlign: 'left' }}>{pkg.title}</h4>

                                        <div style={{
                                            backgroundColor: getMessageBgColor(pkg.title),
                                            color: 'white',
                                            padding: '10px 12px',
                                            marginTop: '12px',
                                            textAlign: 'center',
                                            fontWeight: '400',
                                            fontSize: '14px',
                                            fontFamily: "'Cormorant Infant', 'Georgia', serif",
                                            fontStyle: 'italic',
                                            letterSpacing: '0.5px',
                                            wordSpacing: '2px',
                                            minHeight: '50px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                            borderRadius: '3px',
                                            textShadow: '0 1px 1px rgba(0,0,0,0.1)'
                                        }}>
                                            {getMessage(pkg.title)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Your existing API packages section - VILLA removed */}
                <div className="row g-4 justify-content-center mt-5">
                    {packages.map((pkg) => (
                        <div className="col-lg-3 col-md-6" key={pkg.id}>
                            <div
                                className={`investment-card popular-border ${pkg.is_sold_out == 1 ? 'sold-out-card' : 'clickable-card'}`}
                                onClick={() => handleCardClick(pkg)}
                                style={{ cursor: pkg.is_sold_out == 1 ? 'default' : 'pointer' }}
                            >
                                <div className="popular-badge-centered">POPULAR</div>
                                <div className="card-content d-flex flex-column h-100 p-3">
                                    <h3 className="pkg-title mt-3" style={{ textAlign: 'left' }}>{pkg.title}</h3>

                                    {pkg.is_sold_out == 1 ? (
                                        <div className="sold-out-container my-auto">
                                            <div className="sold-out-btn">SOLD OUT</div>
                                        </div>
                                    ) : (
                                        <>
                                            <h2 className="pkg-price mb-0" style={{ textAlign: 'left' }}>৳ {parseInt(pkg.price).toLocaleString()} BDT</h2>
                                            <p className="pkg-cashback text-success fw-bold mb-0" style={{ fontSize: '1.2rem', textAlign: 'left' }}>
                                                Cashback: ৳ {parseInt(pkg.discount).toLocaleString()} BDT
                                            </p>
                                            <ul className="pkg-features text-start ps-3 mt-2 mb-2" style={{ textAlign: 'left', paddingLeft: '0' }}>
                                                <li><strong>Land & Building:</strong> {pkg.land || 'N/A'}</li>
                                                <li><strong>Total Room Size:</strong> {pkg.total_size || 'N/A'} sqft</li>
                                                <li><strong>+ Amenities</strong></li>
                                            </ul>
                                            <p className="pkg-desc px-2 mt-2 mb-2" style={{ textAlign: 'left' }}>
                                                {pkg.description && pkg.description.length > 80
                                                    ? `${pkg.description.substring(0, 80)}...`
                                                    : pkg.description}
                                            </p>
                                        </>
                                    )}

                                    <button className={`inquire-btn mt-2 ${pkg.is_sold_out == 1 ? 'sold-out-footer' : 'popular-btn'}`}>
                                        {pkg.is_sold_out == 1 ? "NOT AVAILABLE" : "INQUIRE NOW"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {benefitsData && (
                <div className="benefits-container container mt-5 p-5 bg-white">
                    <h2 className='display-4 fw-normal text-uppercase mb-2 text-center mb-2'> Investment Benefits</h2>
                    <div className="row g-3">
                        {benefitsData.benefits && benefitsData.benefits.map((benefit, index) => (
                            <div className={index === benefitsData.benefits.length - 1 ? "col-12" : "col-md-6"} key={index}>
                                <div className={`benefit-item d-flex ${index === benefitsData.benefits.length - 1 ? "align-items-start" : "align-items-center"}`}>
                                    <span className="benefit-number">{String(index + 1).padStart(2, '0')}</span>
                                    <span className="benefit-text">{benefit}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="footer-promo text-center mt-5">
                        <h4 className="promo-question">Ready to Secure Your Future?</h4>
                        <p className="promo-text">Join hundreds of successful investors who have already secured their financial future with Akashbari Hotels & Resorts.</p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Investment;