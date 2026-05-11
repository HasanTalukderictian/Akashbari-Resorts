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
          <h6 className="text-primary fw-bold text-uppercase mb-2" style={{ letterSpacing: '2px' }}>Amenities</h6>
          <h2 className="facility-main-title fw-bold">World-Class Facilities</h2>
          <div className="custom-divider mx-auto"></div>
        </div>

        {/* Facilities Grid */}
        <div className="row g-4 justify-content-center">
          {facilities.map((item, index) => (
            <div key={index} className="col-6 col-md-4 col-lg-3">
              <div className="facility-card-new">
                <div className="icon-wrapper">
                  <span className="icon-emoji">{item.icon}</span>
                </div>
                <h6 className="facility-name-text">{item.name}</h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Facility;