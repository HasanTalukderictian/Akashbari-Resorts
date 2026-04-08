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
    { name: "Guest Room with Elegant Decoration", icon: "✨" },
    { name: "24/7 Room Service", icon: "🕒" },
  ];

  return (
    <section className="facility-section py-5">
      <div className="container text-center">
        {/* Header Section */}
        <h2 className="facility-title text-uppercase">World-Class Facilities</h2>
        <div className="yellow-divider-center mx-auto mb-3"></div>
        <p className="facility-subtitle text-muted mb-5">
          Experience premium amenities designed for your comfort and enjoyment
        </p>

        {/* Facilities Grid */}
        <div className="row g-0 border-top border-start ">
          {facilities.map((item, index) => (
            <div key={index} className="col-6 col-md-4 col-lg-3">
              <div className="facility-card border-end border-bottom py-5 px-5">
                <div className="facility-icon mb-3">{item.icon}</div>
                <h6 className="facility-name text-uppercase">{item.name}</h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Facility;