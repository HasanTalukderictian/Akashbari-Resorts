import React, { useEffect } from 'react'
import Header from './Common/Header';
import Footer from './Common/Footer';
import { FaBuilding, FaMask, FaCamera, FaCocktail, FaBirthdayCake, FaCrown, FaGlassMartiniAlt, FaPhoneAlt } from 'react-icons/fa';

// Swiper Components এবং Styles ইম্পোর্ট
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// সঠিক CSS পাথসমূহ
import 'swiper/css';
import 'swiper/css/pagination'; 
import 'swiper/css/navigation';

const Club = () => {
  // ✅ পেজ লোড হলে টপে স্ক্রল করার জন্য
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant' // 'smooth' অথবা 'instant'
    });
  }, []); // Empty dependency array - শুধু প্রথমবার লোড হলে

  // ১ম সেকশনের ডাটা
  const sectionData = {
    description: "At the heart of Gulshan Club is the collective kinship amongst its Members. Founded in 1978, GCL prides itself for being more than just a club, but a home away from home. The Club was set up on the belief that life is best spent in the company of loved ones. It is at this juncture that some members, recognizing the importance of personal growth and academic achievement alongside social bonding, have opted to enhance their qualifications by engaging services to, seeing it as a way to balance their professional and personal lives effectively. Presently, it is the only family club in Bangladesh. Governing administrations, throughout the years, have been working relentlessly strengthening the bond and fellowship of its Members, as well as bringing families closer together through arts, culture, sports, and various initiatives and events.",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Gulshan Club Building",
    ContactNumber: "01768712230"
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

  // ৩য় সেকশনের ডাটা 
  const facilitiesData = {
    title: "Facilities Overview",
    items: [
      {
        id: 1,
        title: "OUTDOOR SPORTS",
        imageUrl: "https://i.ibb.co.com/jP8Hz8Fx/spor-sahasi-yapiminda-dikkat-edilmesi-gerekenler.jpg"
      },
      {
        id: 2,
        title: "HALL",
        imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 3,
        title: "FOOD & BEVERAGE",
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 4,
        title: "GYMNASIUM",
        imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
      }
    ]
  };

  return (
    <> 
      <Header/>
      
      {/* 1st section */}
      <section className="py-5" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h3 className='text-center mt-1 mb-15 font-bw' style={{ marginBottom: '2rem' }}>AKASHBARI CLUB</h3>
          <div className="row align-items-center">
            <div className="col-lg-7 pe-lg-5 mb-4 mb-lg-0">
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ position: 'absolute', top: '-20px', left: '-40px', width: '150px', height: '150px', border: '15px solid rgba(184, 134, 11, 0.15)', borderRadius: '50%', zIndex: -1 }} />
                
                {/* ডেসক্রিপশন */}
                <p style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#e0e0e0', textAlign: 'justify' }}>
                  {sectionData.description}
                </p>
                
                {/* ফোন নাম্বার */}
                <div className="mt-4 d-inline-block">
                  <a 
                    href={`tel:${sectionData.ContactNumber}`}
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
                    {sectionData.ContactNumber}
                  </a>
                </div>

              </div>
            </div>
            <div className="col-lg-5">
              <div className="p-3" style={{ backgroundColor: '#262626', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <img src={sectionData.imageUrl} alt={sectionData.imageAlt} className="img-fluid w-100" style={{ display: 'block', objectFit: 'cover', height: '420px' }} />
              </div>
            </div>
          </div>
        </div>
      </section>
    
      {/* 2nd section */}
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

      {/* 3rd section (Facilities Slider Overview) */}
      <section className="py-5" style={{ backgroundColor: '#111111', color: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div className="mb-4">
            <h2 style={{ color: '#b8860b', fontFamily: 'serif', fontSize: '2.2rem', fontWeight: '300' }}>
              {facilitiesData.title}
            </h2>
          </div>

          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={24} 
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {facilitiesData.items.map((facility) => (
              <SwiperSlide key={facility.id}>
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
                    src={facility.imageUrl} 
                    alt={facility.title} 
                    className="w-100 h-100" 
                    style={{ objectFit: 'cover', display: 'block' }}
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
                        {facility.title}
                      </h4>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <Footer/>
    </>
  )
}

export default Club