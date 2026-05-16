
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

  // Fetch Testimonials
  const fetchTestimonials = async () => {

    try {

      const res = await axios.get(
        `${BASE_URL}/get-testimonials`
      );

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
              color: '#C6A07A',
              fontSize: '1.1rem',
              fontFamily: 'serif'
            }}
          >
            What said about us
          </p>

          <h2
            className="fw-bold display-5"
            style={{
              color: '#3A4350',
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
              backgroundColor: '#1A1A1A',
              color: '#fff',
              zIndex: 10
            }}
          >
            <FiChevronLeft size={24} />
          </button>

          <button
            className="swiper-next-btn position-absolute top-50 end-0 translate-middle-y rounded-circle border-0 d-flex align-items-center justify-content-center shadow-sm"
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#1A1A1A',
              color: '#fff',
              zIndex: 10
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
                      borderRadius: '15px'
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

                    <div className="card-body text-center d-flex flex-column align-items-center">

                      <FaQuoteLeft
                        className="mb-3"
                        style={{
                          color: '#C6A07A',
                          fontSize: '1.2rem'
                        }}
                      />

                      <h4
                        className="fw-bold mb-2"
                        style={{
                          color: '#3A4350',
                          fontFamily: 'serif'
                        }}
                      >
                        {testimonial.name}
                      </h4>

                      {/* Stars */}
                      <div className="mb-3">

                        {Array.from({ length: 5 }).map((_, idx) => (

                          <FaStar
                            key={idx}
                            className="me-1"
                            style={{
                              color:
                                idx < testimonial.stars
                                  ? '#C6A07A'
                                  : '#DCDCDC',
                              fontSize: '0.9rem'
                            }}
                          />

                        ))}

                      </div>

                      {/* Review Text */}
                      <p
                        className="fst-italic text-muted mb-4"
                        style={{
                          fontSize: '0.95rem',
                          lineHeight: '1.6',
                          fontFamily: 'serif'
                        }}
                      >
                        "{testimonial.text}"
                      </p>

                      {/* Footer Line */}
                      <div
                        className="w-100 position-relative border-top pt-3"
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
                            color: '#C6A07A',
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
                            color: '#C6A07A'
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
          background-color: #C6A07A;
          border-color: #C6A07A;
          transform: scale(1.2);
        }

        .swiper-prev-btn:hover,
        .swiper-next-btn:hover {
          background-color: #C6A07A !important;
        }

        .object-fit-cover {
          object-fit: cover;
        }

      `}</style>

    </section>
  );
};

export default Testominal;