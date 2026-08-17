// // import React from 'react';
// // import '../css/Facility.css'; 

// // const Facility = () => {
// //   const facilities = [
// //     { name: "World Class Restaurant", icon: "🍴" },
// //     { name: "Suites Room", icon: "🛏️" },
// //     { name: "Auditorium", icon: "🎭" },
// //     { name: "Sauna", icon: "🌡️" },
// //     { name: "Spa", icon: "🧖‍♀️" },
// //     { name: "Salon", icon: "💇‍♀️" },
// //     { name: "Indoor Games", icon: "🎮" },
// //     { name: "Changing Room", icon: "🚪" },
// //     { name: "Meeting Room", icon: "👥" },
// //     { name: "Banquet Hall", icon: "🎊" },
// //     { name: "Storage", icon: "📦" },
// //     { name: "Game Zone", icon: "🎯" },
// //     { name: "Indoor Lounge", icon: "☕" },
// //     { name: "Juice Bar", icon: "🥤" },
// //     { name: "BBQ Kitchen", icon: "🔥" },
// //     { name: "Car Parking Facility", icon: "🚗" },
// //     { name: "Heater and Air Conditioning", icon: "❄️" },
// //     { name: "Swimming Pool", icon: "🏊‍♂️" },
// //     { name: "Guest Room", icon: "✨" },
// //     { name: "24/7 Room Service", icon: "🕒" },
// //   ];

// //   return (
// //     <section className="facility-section py-5" style={{ background: '#fcfcfc' }}>
// //       <div className="container">
// //         {/* Header Section */}
// //         <div className="text-center mb-5">
// //           <h6 className="text-uppercase mb-2" style={{ 
// //             letterSpacing: '2px', 
// //             color: '#5e2e10', 
// //             fontWeight: '700' 
// //           }}>
// //             Amenities
// //           </h6>
// //           <h2 className="display-4 fw-normal text-uppercase mb-2" style={{ 
// //             letterSpacing: '2px',
// //             color: '#5e2e10'
// //           }}>
// //             World-Class Facilities Include
// //           </h2>
          
// //         </div>

// //         {/* Facilities Grid */}
// //         <div className="row g-4 justify-content-center">
// //           {facilities.map((item, index) => (
// //             <div key={index} className="col-6 col-md-4 col-lg-3">
// //               <div className="facility-card-new" style={{
// //                 background: 'white',
// //                 borderRadius: '12px',
// //                 padding: '25px 15px',
// //                 textAlign: 'center',
// //                 boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
// //                 transition: 'all 0.3s ease',
// //                 border: '1px solid #e8e8e8',
// //                 height: '100%',
// //                 cursor: 'default'
// //               }}
// //               onMouseEnter={(e) => {
// //                 e.currentTarget.style.transform = 'translateY(-5px)';
// //                 e.currentTarget.style.boxShadow = '0 10px 30px rgba(94, 46, 16, 0.15)';
// //                 e.currentTarget.style.borderColor = '#5e2e10';
// //               }}
// //               onMouseLeave={(e) => {
// //                 e.currentTarget.style.transform = 'translateY(0)';
// //                 e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
// //                 e.currentTarget.style.borderColor = '#e8e8e8';
// //               }}>
// //                 <div className="icon-wrapper" style={{
// //                   width: '70px',
// //                   height: '70px',
// //                   margin: '0 auto 15px',
// //                   background: 'rgba(94, 46, 16, 0.08)',
// //                   borderRadius: '50%',
// //                   display: 'flex',
// //                   alignItems: 'center',
// //                   justifyContent: 'center',
// //                   transition: 'all 0.3s ease'
// //                 }}
// //                 onMouseEnter={(e) => {
// //                   e.currentTarget.style.background = 'rgba(94, 46, 16, 0.15)';
// //                 }}
// //                 onMouseLeave={(e) => {
// //                   e.currentTarget.style.background = 'rgba(94, 46, 16, 0.08)';
// //                 }}>
// //                   <span className="icon-emoji" style={{
// //                     fontSize: '32px',
// //                     lineHeight: '1'
// //                   }}>{item.icon}</span>
// //                 </div>
// //                 <h6 className="facility-name-text" style={{
// //                   fontSize: '14px',
// //                   fontWeight: '600',
// //                   color: '#333',
// //                   margin: '0',
// //                   letterSpacing: '0.5px'
// //                 }}>{item.name}</h6>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default Facility;


// // // import React from 'react';
// // // import '../css/Facility.css';

// // // // SVG Icon Components
// // // const FacilityIcon = ({ type }) => {
// // //   const icons = {
// // //     restaurant: (
// // //       <svg viewBox="0 0 24 24" fill="none" stroke="#5e2e10" strokeWidth="1.5">
// // //         <path d="M3 3L4 5L6 3L8 5L10 3L12 5L14 3L16 5L18 3L20 5L21 3V21H3V3Z"/>
// // //         <path d="M7 8H17M7 12H14M7 16H11"/>
// // //       </svg>
// // //     ),
// // //     room: (
// // //       <svg viewBox="0 0 24 24" fill="none" stroke="#5e2e10" strokeWidth="1.5">
// // //         <rect x="3" y="5" width="18" height="14" rx="2"/>
// // //         <path d="M8 5V19M16 5V19M3 12H8M16 12H21"/>
// // //       </svg>
// // //     ),
// // //     // Add more SVG icons as needed
// // //   };
  
// // //   return icons[type] || icons.restaurant;
// // // };

// // // const Facility = () => {
// // //   const facilities = [
// // //     { name: "World Class Restaurant", icon: "restaurant" },
// // //     { name: "Suites Room", icon: "room" },
// // //     // ... rest of facilities
// // //   ];

// // //   return (
// // //     <section className="facility-section py-5" style={{ background: '#fcfcfc' }}>
// // //       <div className="container">
// // //         <div className="text-center mb-5">
// // //           <h6 className="text-uppercase mb-2" style={{ 
// // //             letterSpacing: '2px', 
// // //             color: '#5e2e10', 
// // //             fontWeight: '700' 
// // //           }}>
// // //             Amenities
// // //           </h6>
// // //           <h2 className="display-4 fw-normal text-uppercase mb-2" style={{ 
// // //             letterSpacing: '2px',
// // //             color: '#5e2e10'
// // //           }}>
// // //             World-Class Facilities Include
// // //           </h2>
// // //         </div>

// // //         <div className="row g-4 justify-content-center">
// // //           {facilities.map((item, index) => (
// // //             <div key={index} className="col-6 col-md-4 col-lg-3">
// // //               <div className="facility-card-new" style={{
// // //                 background: 'white',
// // //                 borderRadius: '12px',
// // //                 padding: '25px 15px',
// // //                 textAlign: 'center',
// // //                 boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
// // //                 transition: 'all 0.3s ease',
// // //                 border: '1px solid #e8e8e8',
// // //                 height: '100%',
// // //                 cursor: 'default'
// // //               }}
// // //               onMouseEnter={(e) => {
// // //                 e.currentTarget.style.transform = 'translateY(-5px)';
// // //                 e.currentTarget.style.boxShadow = '0 10px 30px rgba(94, 46, 16, 0.15)';
// // //                 e.currentTarget.style.borderColor = '#5e2e10';
// // //               }}
// // //               onMouseLeave={(e) => {
// // //                 e.currentTarget.style.transform = 'translateY(0)';
// // //                 e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
// // //                 e.currentTarget.style.borderColor = '#e8e8e8';
// // //               }}>
// // //                 <div className="icon-wrapper" style={{
// // //                   width: '70px',
// // //                   height: '70px',
// // //                   margin: '0 auto 15px',
// // //                   background: 'rgba(94, 46, 16, 0.08)',
// // //                   borderRadius: '50%',
// // //                   display: 'flex',
// // //                   alignItems: 'center',
// // //                   justifyContent: 'center',
// // //                   transition: 'all 0.3s ease',
// // //                   padding: '15px'
// // //                 }}
// // //                 onMouseEnter={(e) => {
// // //                   e.currentTarget.style.background = 'rgba(94, 46, 16, 0.15)';
// // //                 }}
// // //                 onMouseLeave={(e) => {
// // //                   e.currentTarget.style.background = 'rgba(94, 46, 16, 0.08)';
// // //                 }}>
// // //                   <FacilityIcon type={item.icon} />
// // //                 </div>
// // //                 <h6 className="facility-name-text" style={{
// // //                   fontSize: '14px',
// // //                   fontWeight: '600',
// // //                   color: '#333',
// // //                   margin: '0',
// // //                   letterSpacing: '0.5px'
// // //                 }}>{item.name}</h6>
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>
// // //     </section>
// // //   );
// // // };

// // // export default Facility;



// import React from 'react';
// import '../css/Facility.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { 
//   faUtensils, 
//   faBed, 
//   faTheaterMasks, 
//   faHotTub, 
//   faSpa, 
//   faCut, 
//   faGamepad, 
//   faDoorOpen, 
//   faUsers, 
//   faGlassCheers, 
//   faBoxes, 
//   faBullseye, 
//   faCoffee, 
//   faGlassMartiniAlt, 
//   faFire, 
//   faParking, 
//   faSnowflake, 
//   faSwimmer, 
//   faUserFriends, 
//   faClock 
// } from '@fortawesome/free-solid-svg-icons';

// import Restaurant from '../../assets/image/section/resorts features  images/restaurant-interior.jpg'
// import Suites from '../../assets/image/section/resorts features  images/Suites Room.jpg'
// import Auditorium from '../../assets/image/section/resorts features  images/AUS_Main_Auditorium.jpg'
// import Sauna from '../../assets/image/section/resorts features  images/Sauna.jpg'
// import Spa from '../../assets/image/section/resorts features  images/Spa.jpg'
// import Salon from '../../assets/image/section/resorts features  images/Salon.jpg'
// import Games from '../../assets/image/section/resorts features  images/Indoor Games.jpg'
// import ChangingRoom from '../../assets/image/section/resorts features  images/Changing Room.jpg'
// import MeetingRoom from '../../assets/image/section/resorts features  images/Meeting Room.jpg'
// import BanquetHall from '../../assets/image/section/resorts features  images/Banquet Hall.jpg'
// import Storage from '../../assets/image/section/resorts features  images/Storage.jpg'
// import GameZone from '../../assets/image/section/resorts features  images/Game Zone.jpg'
// import IndoorLounge from '../../assets/image/section/resorts features  images/Indoor Lounge.jpg'
// import BBQKitchen from '../../assets/image/section/resorts features  images/BBQ Kitchen.jpg'
// import JuiceBar from '../../assets/image/section/resorts features  images/Juice Bar.jpg'
// import CarParking from '../../assets/image/section/resorts features  images/Car Parking Facility.jpg'
// import AC from '../../assets/image/section/resorts features  images/Heater and Air Conditioning.jpg'
// import SwimmingPool from '../../assets/image/section/resorts features  images/Swimming Pool.jpg'
// import GuestRoom from '../../assets/image/section/resorts features  images/Guest Room.jpg'
// import RoomService from '../../assets/image/section/resorts features  images/24-hours.jpg'


// const Facility = () => {
//   const facilities = [
//     { name: "World Class Restaurant", icon: faUtensils },
//     { name: "Suites Room", icon: faBed },
//     { name: "Auditorium", icon: faTheaterMasks },
//     { name: "Sauna", icon: faHotTub },
//     { name: "Spa", icon: faSpa },
//     { name: "Salon", icon: faCut },
//     { name: "Indoor Games", icon: faGamepad },
//     { name: "Changing Room", icon: faDoorOpen },
//     { name: "Meeting Room", icon: faUsers },
//     { name: "Banquet Hall", icon: faGlassCheers },
//     { name: "Storage", icon: faBoxes },
//     { name: "Game Zone", icon: faBullseye },
//     { name: "Indoor Lounge", icon: faCoffee },
//     { name: "Juice Bar", icon: faGlassMartiniAlt },
//     { name: "BBQ Kitchen", icon: faFire },
//     { name: "Car Parking Facility", icon: faParking },
//     { name: "Heater and Air Conditioning", icon: faSnowflake },
//     { name: "Swimming Pool", icon: faSwimmer },
//     { name: "Guest Room", icon: faUserFriends },
//     { name: "24/7 Room Service", icon: faClock },
//   ];

//   return (
//     <section className="facility-section py-5" style={{ background: '#fcfcfc' }}>
//       <div className="container">
//         {/* Header Section */}
//         <div className="text-center mb-5">
//           <h6 className=" mb-2" style={{ 
//             letterSpacing: '2px', 
//             color: '#5e2e10', 
//             fontWeight: '700',
//             fontFamily: 'serif'

//           }}>
//             Amenities
//           </h6>
//           <h2 className="display-4 fw-normal  mb-2" style={{ 
//             letterSpacing: '2px',
//             color: '#5e2e10', 
//             fontFamily: 'serif'
//           }}>
//             World-Class Facilities Include
//           </h2>
//         </div>

//         {/* Facilities Grid */}
//         <div className="row g-4 justify-content-center">
//           {facilities.map((item, index) => (
//             <div key={index} className="col-6 col-md-4 col-lg-3">
//               <div className="facility-card-new" style={{
//                 background: 'white',
//                 borderRadius: '12px',
//                 padding: '25px 15px',
//                 textAlign: 'center',
//                 boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
//                 transition: 'all 0.3s ease',
//                 border: '1px solid #e8e8e8',
//                 height: '100%',
//                 cursor: 'default'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = 'translateY(-5px)';
//                 e.currentTarget.style.boxShadow = '0 10px 30px rgba(94, 46, 16, 0.15)';
//                 e.currentTarget.style.borderColor = '#5e2e10';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = 'translateY(0)';
//                 e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
//                 e.currentTarget.style.borderColor = '#e8e8e8';
//               }}>
//                 <div className="icon-wrapper" style={{
//                   width: '70px',
//                   height: '70px',
//                   margin: '0 auto 15px',
//                   background: 'rgba(94, 46, 16, 0.08)',
//                   borderRadius: '50%',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   transition: 'all 0.3s ease',
//                   fontSize: '28px',
//                   color: '#5e2e10'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.background = 'rgba(94, 46, 16, 0.15)';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.background = 'rgba(94, 46, 16, 0.08)';
//                 }}>
//                   <FontAwesomeIcon icon={item.icon} />
//                 </div>
//                 <h6 className="facility-name-text" style={{
//                   fontSize: '14px',
//                   fontWeight: '600',
//                   color: '#333',
//                   margin: '0',
//                   letterSpacing: '0.5px'
//                 }}>{item.name}</h6>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Facility;

import React from 'react';
import '../css/Facility.css';

import Restaurant from '../../assets/image/section/resorts features  images/restaurant-interior.jpg'
import Suites from '../../assets/image/section/resorts features  images/Suites Room.jpg'
import Auditorium from '../../assets/image/section/resorts features  images/AUS_Main_Auditorium.jpg'
import Sauna from '../../assets/image/section/resorts features  images/Sauna.jpg'
import Spa from '../../assets/image/section/resorts features  images/Spa.jpg'
import Salon from '../../assets/image/section/resorts features  images/Salon.jpg'
import Games from '../../assets/image/section/resorts features  images/Indoor Games.jpg'
import ChangingRoom from '../../assets/image/section/resorts features  images/Changing Room.jpg'
import MeetingRoom from '../../assets/image/section/resorts features  images/Meeting Room.jpg'
import BanquetHall from '../../assets/image/section/resorts features  images/Banquet Hall.jpg'
import Storage from '../../assets/image/section/resorts features  images/Storage.jpg'
import GameZone from '../../assets/image/section/resorts features  images/Game Zone.jpg'
import IndoorLounge from '../../assets/image/section/resorts features  images/Indoor Lounge.jpg'
import BBQKitchen from '../../assets/image/section/resorts features  images/BBQ Kitchen.jpg'
import JuiceBar from '../../assets/image/section/resorts features  images/Juice Bar.jpg'
import CarParking from '../../assets/image/section/resorts features  images/Car Parking Facility.jpg'
import AC from '../../assets/image/section/resorts features  images/Heater and Air Conditioning.jpg'
import SwimmingPool from '../../assets/image/section/resorts features  images/Swimming Pool.jpg'
import GuestRoom from '../../assets/image/section/resorts features  images/Guest Room.jpg'
import RoomService from '../../assets/image/section/resorts features  images/24-hours.jpg'

const Facility = () => {
  const facilities = [
    { name: "World Class Restaurant", image: Restaurant },
    { name: "Suites Room", image: Suites },
    { name: "Auditorium", image: Auditorium },
    { name: "Sauna", image: Sauna },
    { name: "Spa", image: Spa },
    { name: "Salon", image: Salon },
    { name: "Indoor Games", image: Games },
    { name: "Changing Room", image: ChangingRoom },
    { name: "Meeting Room", image: MeetingRoom },
    { name: "Banquet Hall", image: BanquetHall },
    { name: "Storage", image: Storage },
    { name: "Game Zone", image: GameZone },
    { name: "Indoor Lounge", image: IndoorLounge },
    { name: "Juice Bar", image: JuiceBar },
    { name: "BBQ Kitchen", image: BBQKitchen },
    { name: "Car Parking Facility", image: CarParking },
    { name: "Heater and Air Conditioning", image: AC },
    { name: "Swimming Pool", image: SwimmingPool },
    { name: "Guest Room", image: GuestRoom },
    { name: "24/7 Room Service", image: RoomService },
  ];

  return (
    <section className="facility-section py-5" style={{ background: '#fcfcfc' }}>
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h6 className=" mb-2" style={{ 
            letterSpacing: '2px', 
            color: '#5e2e10', 
            fontWeight: '700',
            fontFamily: 'serif'
          }}>
            Amenities
          </h6>
          <h2 className="display-4 fw-normal  mb-2" style={{ 
            letterSpacing: '2px',
            color: '#5e2e10', 
            fontFamily: 'serif'
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
                  transition: 'all 0.3s ease',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(94, 46, 16, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(94, 46, 16, 0.08)';
                }}>
                  <img 
                    src={item.image} 
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%'
                    }}
                  />
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