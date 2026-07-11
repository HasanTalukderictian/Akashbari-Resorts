import React from 'react';
import '../css/Facility.css'; 

const Facility = () => {
  const facilities = [
    { name: "World Class Restaurant", icon: "🍴" },
    { name: "Suites Room", icon: "🛏️" },
    { name: "Auditorium", icon: "🎭" },
    { name: "Sauna", icon: "🌡️" },
    { name: "Spa", icon: "🧖‍♀️" },
    { name: "Salon", icon: "💇‍♀️" },
    { name: "Indoor Games", icon: "🎮" },
    { name: "Changing Room", icon: "🚪" },
    { name: "Meeting Room", icon: "👥" },
    { name: "Banquet Hall", icon: "🎊" },
    { name: "Storage", icon: "📦" },
    { name: "Game Zone", icon: "🎯" },
    { name: "Indoor Lounge", icon: "☕" },
    { name: "Juice Bar", icon: "🥤" },
    { name: "BBQ Kitchen", icon: "🔥" },
    { name: "Car Parking Facility", icon: "🚗" },
    { name: "Heater and Air Conditioning", icon: "❄️" },
    { name: "Swimming Pool", icon: "🏊‍♂️" },
    { name: "Guest Room", icon: "✨" },
    { name: "24/7 Room Service", icon: "🕒" },
  ];

  return (
    <section className="facility-section py-5" style={{ background: '#fcfcfc' }}>
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h6 className="text-uppercase mb-2" style={{ 
            letterSpacing: '2px', 
            color: '#5e2e10', 
            fontWeight: '700' 
          }}>
            Amenities
          </h6>
          <h2 className="display-4 fw-normal text-uppercase mb-2" style={{ 
            letterSpacing: '2px',
            color: '#5e2e10'
          }}>
            World-Class Facilities Include
          </h2>
          
        </div>

        {/* Facilities Grid */}
        <div className="row g-4 justify-content-center">
          {facilities.map((item, index) => (
            <div key={index} className="col-6 col-md-4 col-lg-3">
              <div className="facility-card-new" style={{
                background: 'white',
                borderRadius: '12px',
                padding: '25px 15px',
                textAlign: 'center',
                boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                border: '1px solid #e8e8e8',
                height: '100%',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(94, 46, 16, 0.15)';
                e.currentTarget.style.borderColor = '#5e2e10';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = '#e8e8e8';
              }}>
                <div className="icon-wrapper" style={{
                  width: '70px',
                  height: '70px',
                  margin: '0 auto 15px',
                  background: 'rgba(94, 46, 16, 0.08)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(94, 46, 16, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(94, 46, 16, 0.08)';
                }}>
                  <span className="icon-emoji" style={{
                    fontSize: '32px',
                    lineHeight: '1'
                  }}>{item.icon}</span>
                </div>
                <h6 className="facility-name-text" style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  margin: '0',
                  letterSpacing: '0.5px'
                }}>{item.name}</h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Facility;