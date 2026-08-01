// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import '../../css/welcome.css';
// import logo from '../../image/Akashbari  resort logo png-01.png';

// const Welcome = () => {
//   const [features, setFeatures] = useState([]);
//   const [welcomeData, setWelcomeData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const API_BASE_URL = import.meta.env.VITE_BASE_URL;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const welcomeRes = await axios.get(`${API_BASE_URL}/get-welcomes`);
//         if (welcomeRes.data.success && welcomeRes.data.data.length > 0) {
//           setWelcomeData(welcomeRes.data.data[0]);
//         }

//         const featuresRes = await axios.get(`${API_BASE_URL}/get-about-features`);
//         if (featuresRes.data.status === "success") {
//           setFeatures(featuresRes.data.data[0].details);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <section className="welcome-section py-5">
//       <div className="container">
//         <div className="row align-items-center">

//           {/* Left Content Side */}
//           <div className="col-lg-6 mb-4 mb-lg-0">
//             <div className="d-flex align-items-center gap-3">
//               <div>
//                 <h3 className="welcome-title text-uppercase mb-0">
//                   {welcomeData ? welcomeData.title.split(' ').slice(0, 2).join(' ') : "Welcome To"}
//                 </h3>
//                 <h3 className="welcome-subtitle text-uppercase mb-0">
//                   {welcomeData ? welcomeData.title.split(' ').slice(2).join(' ') : "Akashbari Resort"}
//                 </h3>
//               </div>

//               <div className="welcome-logo-wrapper">
//                 <img
//                   src={logo}
//                   alt="logo"
//                   style={{ width: '110px', height: 'auto', objectFit: 'contain' }}
//                 />
//               </div>
//             </div>
//             <div className="line-divider mb-4"></div>

//             <div className="welcome-text">
//               {welcomeData ? (
//                 welcomeData.description.split('\r\n\r\n').map((para, index) => (
//                   <p key={index}>{para}</p>
//                 ))
//               ) : (
//                 <p>Loading description...</p>
//               )}
//             </div>

//             {/* Button and Call Box Section */}
//             <div className="mt-4 d-flex flex-column gap-4">
//               <div>
//                 <Link
//                   to="/club"
//                   className="btn text-uppercase px-4 py-2 text-decoration-none"
//                   style={{
//                     backgroundColor: '#5e2e10',
//                     color: '#ffffff',
//                     fontWeight: '500',
//                     letterSpacing: '1px',
//                     borderRadius: '4px',
//                     transition: 'all 0.3s ease'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.backgroundColor = '#6b9e3e';
//                     e.currentTarget.style.color = '#ffffff';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.backgroundColor = '#5e2e10';
//                     e.currentTarget.style.color = '#ffffff';
//                   }}
//                 >
//                   Visit Club
//                 </Link>
//               </div>

//               {/* Call Box */}
//               <div
//                 style={{
//                   border: '2px solid #1a1a1a',
//                   padding: '15px 25px',
//                   display: 'inline-flex',
//                   alignItems: 'center',
//                   gap: '20px',
//                   maxWidth: '480px',
//                   backgroundColor: '#f9f9f9'
//                 }}
//               >
//                 <div
//                   style={{
//                     backgroundColor: '#639c4e',
//                     borderRadius: '50%',
//                     width: '45px',
//                     height: '45px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     flexShrink: 0
//                   }}
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth="2"
//                     stroke="#ffffff"
//                     style={{ width: '22px', height: '22px' }}
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.75Z" />
//                   </svg>
//                 </div>

//                 <span
//                   style={{
//                     fontSize: '18px',
//                     fontWeight: '700',
//                     color: '#1a1a1a',
//                     letterSpacing: '1.5px',
//                     fontFamily: 'sans-serif'
//                   }}
//                 >
//                   CALL NOW: +8801701294455
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Right Features Side */}
//           <div className="col-lg-5 offset-lg-1">
//             <div className="features-box" style={{ border: `2px solid #5e2e10` }}>
//               <h2 className="features-title text-center text-uppercase mb-4">Features & Facilities</h2>

//               {loading ? (
//                 <p className="text-center">Loading...</p>
//               ) : (
//                 <ul className="list-unstyled features-list">
//                   {features.map((item, index) => (
//                     <li key={index} style={{
//                       padding: '8px 0',
//                       borderBottom: '1px solid rgba(0,0,0,0.05)'
//                     }}>
//                       {item}
//                     </li>
//                   ))}
//                 </ul>
//               )}

//               {/* Updated More Button */}
//               <div className="text-center mt-4">
//                 <button 
//                   className="more-btn"
//                   style={{
//                     backgroundColor: '#5e2e10', // Band color
//                     color: '#ffffff',
//                     border: 'none',
//                     padding: '10px 35px',
//                     fontSize: '16px',
//                     fontWeight: '600',
//                     letterSpacing: '1px',
//                     borderRadius: '4px',
//                     cursor: 'pointer',
//                     transition: 'all 0.3s ease',
//                     textTransform: 'uppercase',
//                     boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.backgroundColor = '#6b9e3e';
//                     e.currentTarget.style.transform = 'translateY(-2px)';
//                     e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.backgroundColor = '#5e2e10';
//                     e.currentTarget.style.transform = 'translateY(0)';
//                     e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
//                   }}
//                   onClick={() => {
//                     // Add your click handler here
//                     console.log('More button clicked');
//                   }}
//                 >
//                   More
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Welcome;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../css/welcome.css';
import logo from '../../image/Akashbari  resort logo png-01.png';

const Welcome = ({ scrollToInvestment }) => {  // Added prop for scrolling
  const [features, setFeatures] = useState([]);
  const [welcomeData, setWelcomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const welcomeRes = await axios.get(`${API_BASE_URL}/get-welcomes`);
        if (welcomeRes.data.success && welcomeRes.data.data.length > 0) {
          setWelcomeData(welcomeRes.data.data[0]);
        }

        const featuresRes = await axios.get(`${API_BASE_URL}/get-about-features`);
        if (featuresRes.data.status === "success") {
          setFeatures(featuresRes.data.data[0].details);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle More button click - scroll to Investment Benefits
  // In Welcome component, the More button onClick should call scrollToBenefitsOnly
  const handleMoreClick = () => {
    if (scrollToInvestment) {
      scrollToInvestment(); // This now calls scrollToBenefitsOnly from parent
    } else {
      const benefitsElement = document.getElementById('investment-benefits');
      if (benefitsElement) {
        benefitsElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  
  return (
    <section className="welcome-section py-5">
      <div className="container">
        <div className="row align-items-center">

          {/* Left Content Side */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="d-flex align-items-center gap-3">
              <div>
                <h3 className="welcome-title text-uppercase mb-0">
                  {welcomeData ? welcomeData.title.split(' ').slice(0, 2).join(' ') : "Welcome To"}
                </h3>
                <h3 className="welcome-subtitle text-uppercase mb-0">
                  {welcomeData ? welcomeData.title.split(' ').slice(2).join(' ') : "Akashbari Resort"}
                </h3>
              </div>

              <div className="welcome-logo-wrapper">
                <img
                  src={logo}
                  alt="logo"
                  style={{ width: '110px', height: 'auto', objectFit: 'contain' }}
                />
              </div>
            </div>
            <div className="line-divider mb-4"></div>

            <div className="welcome-text">
              {welcomeData ? (
                welcomeData.description.split('\r\n\r\n').map((para, index) => (
                  <p key={index}>{para}</p>
                ))
              ) : (
                <p>Loading description...</p>
              )}
            </div>

            {/* Button and Call Box Section */}
            <div className="mt-4 d-flex flex-column gap-4">
              <div>
                <Link
                  to="/club"
                  className="btn text-uppercase px-4 py-2 text-decoration-none"
                  style={{
                    backgroundColor: '#5e2e10',
                    color: '#ffffff',
                    fontWeight: '500',
                    letterSpacing: '1px',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#6b9e3e';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#5e2e10';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                >
                  Visit Club
                </Link>
              </div>

              {/* Call Box */}
              <div
                style={{
                  border: '2px solid #1a1a1a',
                  padding: '15px 25px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '20px',
                  maxWidth: '480px',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <div
                  style={{
                    backgroundColor: '#639c4e',
                    borderRadius: '50%',
                    width: '45px',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="#ffffff"
                    style={{ width: '22px', height: '22px' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.75Z" />
                  </svg>
                </div>

                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1a1a1a',
                    letterSpacing: '1.5px',
                    fontFamily: 'sans-serif'
                  }}
                >
                  CALL NOW: +8801701294455
                </span>
              </div>
            </div>
          </div>

          {/* Right Features Side */}
          <div className="col-lg-5 offset-lg-1">
            <div className="features-box" style={{ border: `2px solid #5e2e10` }}>
              <h2 className="features-title text-center text-uppercase mb-4">Features & Facilities</h2>

              {loading ? (
                <p className="text-center">Loading...</p>
              ) : (
                <ul className="list-unstyled features-list">
                  {features.map((item, index) => (
                    <li key={index} style={{
                      padding: '8px 0',
                      borderBottom: '1px solid rgba(0,0,0,0.05)'
                    }}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {/* Updated More Button with onClick handler */}
              <div className="text-center mt-4">
                <button
                  className="more-btn"
                  onClick={handleMoreClick}  // Added click handler
                  style={{
                    backgroundColor: '#5e2e10',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 35px',
                    fontSize: '16px',
                    fontWeight: '600',
                    letterSpacing: '1px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#6b9e3e';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#5e2e10';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                  }}
                >
                  More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;