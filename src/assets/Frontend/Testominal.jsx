// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// import { FaQuoteLeft, FaStar } from 'react-icons/fa';
// import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// // Swiper styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

// const Testominal = () => {

//   const [testimonials, setTestimonials] = useState([]);
//   const brandColor = '#5e2e10';

//   const BASE_URL = import.meta.env.VITE_BASE_URL;

//   // Fetch Testimonials
//   const fetchTestimonials = async () => {

//     try {

//       const res = await axios.get(
//         `${BASE_URL}/get-testimonials`
//       );

//       setTestimonials(res.data.data || []);

//     } catch (error) {

//       console.error('Fetch Error:', error);

//       setTestimonials([]);
//     }
//   };

//   useEffect(() => {

//     fetchTestimonials();

//   }, []);

//   return (

//     <section className="py-5" style={{ backgroundColor: '#FAF9F6' }}>

//       <div className="container">

//         {/* --- Section Header --- */}
//         <div className="text-center mb-5 mt-4">

//           <p
//             className="fst-italic mb-1"
//             style={{
//               color: brandColor,
//               fontSize: '1.1rem',
//               fontFamily: 'serif'
//             }}
//           >
//             What said about us
//           </p>

//           <h2
//             className="fw-bold display-5"
//             style={{
//               color: '#5e2e10',
//               fontFamily: 'serif'
//             }}
//           >
//             Testimonials and Clients
//           </h2>

//           {/* Decorative Line */}
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             gap: '15px',
//             marginTop: '15px',
//           }}>
//             <span style={{
//               flex: '0 0 60px',
//               height: '2px',
//               background: `linear-gradient(90deg, transparent, ${brandColor})`,
//             }}></span>
//             <span style={{
//               color: brandColor,
//               fontSize: '18px',
//             }}>✦</span>
//             <span style={{
//               flex: '0 0 60px',
//               height: '2px',
//               background: `linear-gradient(90deg, ${brandColor}, transparent)`,
//             }}></span>
//           </div>

//         </div>

//         {/* --- Swiper Section --- */}
//         <div className="position-relative px-lg-5">

//           {/* --- Custom Navigation Buttons --- */}
//           <button
//             className="swiper-prev-btn position-absolute top-50 start-0 translate-middle-y rounded-circle border-0 d-flex align-items-center justify-content-center shadow-sm"
//             style={{
//               width: '40px',
//               height: '40px',
//               backgroundColor: brandColor,
//               color: '#fff',
//               zIndex: 10,
//               transition: 'all 0.3s ease'
//             }}
//           >
//             <FiChevronLeft size={24} />
//           </button>

//           <button
//             className="swiper-next-btn position-absolute top-50 end-0 translate-middle-y rounded-circle border-0 d-flex align-items-center justify-content-center shadow-sm"
//             style={{
//               width: '40px',
//               height: '40px',
//               backgroundColor: brandColor,
//               color: '#fff',
//               zIndex: 10,
//               transition: 'all 0.3s ease'
//             }}
//           >
//             <FiChevronRight size={24} />
//           </button>

//           <Swiper
//             modules={[Navigation, Pagination, Autoplay]}
//             spaceBetween={30}
//             slidesPerView={1}
//             loop={testimonials.length > 1}
//             autoplay={{
//               delay: 4000,
//               disableOnInteraction: false
//             }}
//             navigation={{
//               prevEl: '.swiper-prev-btn',
//               nextEl: '.swiper-next-btn',
//             }}
//             pagination={{
//               clickable: true,
//               bulletClass: 'swiper-custom-bullet',
//               bulletActiveClass: 'swiper-custom-bullet-active',
//             }}
//             breakpoints={{
//               768: { slidesPerView: 2 },
//               1024: { slidesPerView: 3 },
//             }}
//             className="testimonial-swiper pb-5"
//           >

//             {Array.isArray(testimonials) &&
//               testimonials.map((testimonial, index) => (

//                 <SwiperSlide
//                   key={testimonial.id}
//                   className="py-5"
//                 >

//                   {/* --- Slide Content Card --- */}
//                   <div
//                     className="card border-0 shadow-sm mx-auto position-relative pt-5 px-4 pb-4 "
//                     style={{
//                       maxWidth: '360px',
//                       borderRadius: '15px',
//                       border: `1px solid ${brandColor}20`,
//                       transition: 'all 0.3s ease'
//                     }}
//                   >

//                     {/* User Image */}
//                     <div
//                       className="position-absolute top-0 start-50 translate-middle border border-5 border-white rounded-circle shadow-sm overflow-hidden"
//                       style={{
//                         width: '100px',
//                         height: '100px',
//                         borderColor: `${brandColor} !important`
//                       }}
//                     >

//                       <img
//                         src={
//                           testimonial.image_url ||
//                           'https://via.placeholder.com/100'
//                         }
//                         alt={testimonial.name}
//                         className="w-100 h-100 object-fit-cover"
//                       />

//                     </div>

//                     <div className="card-body text-center d-flex flex-column align-items-center">

//                       <FaQuoteLeft
//                         className="mb-3"
//                         style={{
//                           color: brandColor,
//                           fontSize: '1.2rem'
//                         }}
//                       />

//                       <h4
//                         className="fw-bold mb-2"
//                         style={{
//                           color: '#3A4350',
//                           fontFamily: 'serif'
//                         }}
//                       >
//                         {testimonial.name}
//                       </h4>

//                       {/* Stars */}
//                       <div className="mb-3">

//                         {Array.from({ length: 5 }).map((_, idx) => (

//                           <FaStar
//                             key={idx}
//                             className="me-1"
//                             style={{
//                               color:
//                                 idx < testimonial.stars
//                                   ? brandColor
//                                   : '#DCDCDC',
//                               fontSize: '0.9rem'
//                             }}
//                           />

//                         ))}

//                       </div>

//                       {/* Review Text */}
//                       <p
//                         className="fst-italic text-muted mb-4"
//                         style={{
//                           fontSize: '0.95rem',
//                           lineHeight: '1.6',
//                           fontFamily: 'serif'
//                         }}
//                       >
//                         "{testimonial.text}"
//                       </p>

//                       {/* Footer Line */}
//                       <div
//                         className="w-100 position-relative border-top pt-3"
//                         style={{
//                           borderColor: '#eee'
//                         }}
//                       >

//                         <span
//                           className="position-absolute start-0 top-0 translate-middle-y text-muted small"
//                           style={{
//                             fontFamily: 'serif'
//                           }}
//                         >
//                           {String(index + 1).padStart(2, '0')}.
//                         </span>

//                         <span
//                           className="position-absolute start-50 top-0 translate-middle bg-white px-2 fw-bold text-uppercase"
//                           style={{
//                             color: brandColor,
//                             fontSize: '0.65rem',
//                             letterSpacing: '1px'
//                           }}
//                         >
//                           {testimonial.source || 'GOOGLE'}
//                         </span>

//                         <span
//                           className="position-absolute end-0 top-0 translate-middle-y"
//                           style={{
//                             opacity: 0.3,
//                             color: brandColor
//                           }}
//                         >
//                           <FaQuoteLeft
//                             size={12}
//                             style={{
//                               transform: 'scaleX(-1) rotate(180deg)'
//                             }}
//                           />
//                         </span>

//                       </div>

//                     </div>

//                   </div>

//                 </SwiperSlide>

//               ))}

//           </Swiper>

//         </div>

//       </div>

//       <style>{`

//         .testimonial-swiper .swiper-custom-bullet {
//           width: 10px;
//           height: 10px;
//           display: inline-block;
//           border-radius: 50%;
//           border: 1px solid #DCDCDC;
//           background: transparent;
//           margin: 0 5px;
//           cursor: pointer;
//           transition: 0.3s;
//         }

//         .testimonial-swiper .swiper-custom-bullet-active {
//           background-color: ${brandColor};
//           border-color: ${brandColor};
//           transform: scale(1.2);
//         }

//         .swiper-prev-btn:hover,
//         .swiper-next-btn:hover {
//           background-color: ${brandColor} !important;
//           opacity: 0.8;
//           transform: translateY(-50%) scale(1.1);
//         }

//         .object-fit-cover {
//           object-fit: cover;
//         }

//         /* Card hover effect */
//         .card:hover {
//           transform: translateY(-5px);
//           box-shadow: 0 10px 30px ${brandColor}20 !important;
//           border-color: ${brandColor}40 !important;
//         }

//       `}</style>

//     </section>
//   );
// };

// export default Testominal;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Testominal = () => {

  const [testimonials, setTestimonials] = useState([]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Truncate text function
  const truncateText = (text, maxLength = 215) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Fetch Testimonials
  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/get-testimonials`);
      setTestimonials(res.data.data || []);
    } catch (error) {
      console.error('Fetch Error:', error);
      setTestimonials([]);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <section className="py-5" style={{ backgroundColor: '#FAF9F6' }}>
      <div className="container">

        {/* --- Section Header --- */}
        <div className="text-center mb-5 mt-4">
          <p
            className="fst-italic mb-1"
            style={{
              color: '#5e2e10',
              fontSize: '1.1rem',
              fontFamily: 'serif'
            }}
          >
            What said about us
          </p>
          <h2
            className="fw-bold display-5"
            style={{
              color: '#5e2e10',
              fontFamily: 'serif'
            }}
          >
            Testimonials and Clients
          </h2>
        </div>

        {/* --- Swiper Section --- */}
        <div className="position-relative px-lg-5">

          {/* --- Custom Navigation Buttons --- */}
          <button
            className="swiper-prev-btn position-absolute top-50 start-0 translate-middle-y rounded-circle border-0 d-flex align-items-center justify-content-center shadow-sm"
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#5e2e10',
              color: '#fff',
              zIndex: 10,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#6b9e3e';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#5e2e10';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <FiChevronLeft size={24} />
          </button>

          <button
            className="swiper-next-btn position-absolute top-50 end-0 translate-middle-y rounded-circle border-0 d-flex align-items-center justify-content-center shadow-sm"
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#5e2e10',
              color: '#fff',
              zIndex: 10,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#6b9e3e';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#5e2e10';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <FiChevronRight size={24} />
          </button>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={testimonials.length > 1}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false
            }}
            navigation={{
              prevEl: '.swiper-prev-btn',
              nextEl: '.swiper-next-btn',
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-custom-bullet',
              bulletActiveClass: 'swiper-custom-bullet-active',
            }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="testimonial-swiper pb-5"
          >

            {Array.isArray(testimonials) &&
              testimonials.map((testimonial, index) => (

                <SwiperSlide
                  key={testimonial.id}
                  className="py-5"
                >

                  {/* --- Slide Content Card --- */}
                  <div
                    className="card border-0 shadow-sm mx-auto position-relative pt-5 px-4 pb-4"
                    style={{
                      maxWidth: '360px',
                      minHeight: '420px',
                      borderRadius: '15px',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px #5e2e10';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 3px  #5e2e10';
                    }}
                  >

                    {/* User Image */}
                    <div
                      className="position-absolute top-0 start-50 translate-middle border border-5 border-white rounded-circle shadow-sm overflow-hidden"
                      style={{
                        width: '100px',
                        height: '100px'
                      }}
                    >
                      <img
                        src={
                          testimonial.image_url ||
                          'https://via.placeholder.com/100'
                        }
                        alt={testimonial.name}
                        className="w-100 h-100 object-fit-cover"
                      />
                    </div>

                    <div className="card-body text-center d-flex flex-column align-items-center flex-grow-1">

                      <FaQuoteLeft
                        className="mb-3"
                        style={{
                          color: '#5e2e10',
                          fontSize: '1.2rem'
                        }}
                      />

                      <h4
                        className="fw-bold mb-1"
                        style={{
                          color: '#5e2e10',
                          fontFamily: 'serif'
                        }}
                      >
                        {testimonial.name}
                      </h4>

                      {/* Stars */}
                      <div className="mb-2">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <FaStar
                            key={idx}
                            className="me-1"
                            style={{
                              color:
                                idx < testimonial.stars
                                  ? '#5e2e10'
                                  : '#DCDCDC',
                              fontSize: '0.7rem'
                            }}
                          />
                        ))}
                      </div>

                      {/* Review Text - Truncated */}
                      <p
                        className="fst-italic text-muted mb-2"
                        style={{
                          fontSize: '0.90rem',
                          lineHeight: '1.25',
                          fontFamily: 'serif',
                          flex: '1 0 auto',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: '4',
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        "{truncateText(testimonial.text, 165)}"
                      </p>

                      {/* Footer Line */}
                      <div
                        className="w-100 position-relative border-top pt-3 mt-auto"
                        style={{
                          borderColor: '#eee'
                        }}
                      >
                        <span
                          className="position-absolute start-0 top-0 translate-middle-y text-muted small"
                          style={{
                            fontFamily: 'serif'
                          }}
                        >
                          {String(index + 1).padStart(2, '0')}.
                        </span>

                        <span
                          className="position-absolute start-50 top-0 translate-middle bg-white px-2 fw-bold text-uppercase"
                          style={{
                            color: '#5e2e10',
                            fontSize: '0.65rem',
                            letterSpacing: '1px'
                          }}
                        >
                          {testimonial.source || 'GOOGLE'}
                        </span>

                        <span
                          className="position-absolute end-0 top-0 translate-middle-y"
                          style={{
                            opacity: 0.3,
                            color: '#5e2e10'
                          }}
                        >
                          <FaQuoteLeft
                            size={12}
                            style={{
                              transform: 'scaleX(-1) rotate(180deg)'
                            }}
                          />
                        </span>

                      </div>

                    </div>

                  </div>

                </SwiperSlide>

              ))}

          </Swiper>

        </div>

      </div>

      <style>{`

        .testimonial-swiper .swiper-custom-bullet {
          width: 10px;
          height: 10px;
          display: inline-block;
          border-radius: 50%;
          border: 1px solid #DCDCDC;
          background: transparent;
          margin: 0 5px;
          cursor: pointer;
          transition: 0.3s;
        }

        .testimonial-swiper .swiper-custom-bullet-active {
          background-color: #6b9e3e;
          border-color: #6b9e3e;
          transform: scale(1.2);
          box-shadow: 0 0 15px rgba(156, 6, 6, 0.3);
        }

        .swiper-prev-btn:hover,
        .swiper-next-btn:hover {
          background-color: #6b9e3e !important;
          transform: translateY(-50%) scale(1.1) !important;
          box-shadow: 0 4px 15px rgba(156, 6, 6, 0.3) !important;
        }

        .object-fit-cover {
          object-fit: cover;
        }

        /* Card hover effect */
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .swiper-prev-btn,
          .swiper-next-btn {
            display: none !important;
          }
        }

      `}</style>

    </section>
  );
};

export default Testominal;