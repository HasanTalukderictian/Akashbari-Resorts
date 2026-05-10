// import React, { useState } from 'react';
// import '../css/event.css';

// const Event = () => {
//   const eventsList = [
//     {
//       id: 1,
//       title: "Wedding Party",
//       time: "12:30 Pm, Thu 25 july 2025",
//       thumbImg: "https://dreamlayout.mnsithub.com/php/hoteluxphp/assets/images/resources/event-one-1-1.jpg",
//       mainImg: "https://dreamlayout.mnsithub.com/php/hoteluxphp/assets/images/resources/event-one-1-1.jpg",
//       dateBox: { day: 25, month: "Jul" },
//       mainTitle: "A Royal Wedding Celebration",
//       subtitle: "Enjoy The Wedding Bliss",
//       postedBy: "Royal Events",
//       comments: 12,
//       features: ["500 Best Rooms 5 Star", "Honeymoon Suite Jacuzzi", "Grand Banquet Hall", "Open Bar Service"]
//     },
//     {
//       id: 2,
//       title: "Family Party",
//       time: "12:30 Pm, Thu 16 Feb 2025",
//       thumbImg: "https://dreamlayout.mnsithub.com/php/hoteluxphp/assets/images/resources/event-one-1-2.jpg",
//       mainImg: "https://dreamlayout.mnsithub.com/php/hoteluxphp/assets/images/resources/event-one-1-2.jpg",
//       dateBox: { day: 16, month: "Feb" },
//       mainTitle: "Annual Family Gathering",
//       subtitle: "Reunite With Loved Ones",
//       postedBy: "Anya Sharma",
//       comments: 8,
//       features: ["Spacious Rooms", "Kids Play Area", "Buffet Dinner", "Live Music"]
//     },
//     {
//       id: 3,
//       title: "Festival Music Electronic",
//       time: "12:30 Pm, Thu 20 Aug 2025",
//       thumbImg: "https://dreamlayout.mnsithub.com/php/hoteluxphp/assets/images/resources/event-one-1-2.jpg",
//       mainImg: "https://dreamlayout.mnsithub.com/php/hoteluxphp/assets/images/resources/event-one-1-2.jpg",
//       dateBox: { day: 20, month: "Aug" },
//       mainTitle: "EDM Festival Night",
//       subtitle: "Dance to the Beats",
//       postedBy: "DJ Rahul",
//       comments: 25,
//       features: ["250 Best Rooms 5 Star", "VIP Pool Access", "Glow in the Dark Bar", "After Party Entry"]
//     },
//     {
//       id: 4,
//       title: "Summer Party",
//       time: "12:30 Pm, Thu 15 Feb 2025",
//       thumbImg: "https://dreamlayout.mnsithub.com/php/hoteluxphp/assets/images/resources/event-one-1-4.jpg",
//       mainImg: "https://dreamlayout.mnsithub.com/php/hoteluxphp/assets/images/resources/event-one-1-4.jpg",
//       dateBox: { day: 15, month: "Feb" },
//       mainTitle: "An Excellent Summer Party",
//       subtitle: "Enjoy The Summer Party",
//       postedBy: "Adam Smith",
//       comments: 5,
//       features: ["250 Best Rooms 5 Star", "Double Whirlpool Jacuzzi Tub", "Luxurious High Thread Count", "Wet Bar with Refrigerator"]
//     }
//   ];

//   const [activeEvent, setActiveEvent] = useState(eventsList[0]); // Default first item

//   return (
//     <section className="event-section py-5">
//       <div className="container">
//         <h2 className='mb-4 serif fw-bold'>Events</h2>
//         <div className="row g-4">

//           {/* Left Side List */}
//           <div className="col-lg-4">
//             <div className="event-list-wrapper">
//               {eventsList.map((event) => (
//                 <div
//                   key={event.id}
//                   className={`event-list-item d-flex align-items-center mb-3 p-3 shadow-sm ${activeEvent.id === event.id ? 'active' : ''}`}
//                   onClick={() => setActiveEvent(event)}
//                 >
//                   <img src={event.thumbImg} alt={event.title} className="event-thumb me-3" />
//                   <div className="event-list-info">
//                     <h6 className="event-list-title m-0 fw-bold">{event.title}</h6>
//                     <small className="text-muted">{event.time}</small>
//                   </div>
//                 </div>
//               ))}
//               <div className="text-center mt-3">
//                 <button
//                   className="btn btn-outline-dark w-100 p-2 text-uppercase fw-bold custom-btn-outline"
//                   style={{ fontSize: '13px' }}
//                 >
//                   View All Events
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Right Side Details */}
//           <div className="col-lg-8">
//             <div className="active-event-card shadow-sm bg-white overflow-hidden">
//               <div className="row g-0"> {/* g-0 removed padding between image and text */}
//                 <div className="col-md-7 position-relative">
//                   <div className="image-container">
//                     <img src={activeEvent.mainImg} alt={activeEvent.title} className="active-main-img img-fluid w-100" />
//                   </div>
//                   <div className="date-overlay text-center">
//                     <h3 className="m-0 fw-bold">{activeEvent.dateBox.day}</h3>
//                     <span>{activeEvent.dateBox.month}</span>
//                   </div>
//                 </div>

//                 <div className="col-md-5 p-4 d-flex flex-column justify-content-center">
//                   <h3 className="event-content-title serif mb-2">{activeEvent.mainTitle}</h3>
//                   <h6 className="event-content-subtitle mb-3 serif">{activeEvent.subtitle}</h6>

//                   <div className="event-description text-muted mb-3">
//                     <p className="small mb-2">Posted by {activeEvent.postedBy} | {activeEvent.comments} Comments</p>
//                     <p className="small">Enjoy your stay with our premium event services and world-class hospitality.</p>
//                   </div>

//                   <ul className="list-unstyled feature-list mb-4">
//                     {activeEvent.features.map((f, i) => (
//                       <li key={i} className="small mb-1 d-flex align-items-center">
//                         <span className="text-success me-2">✔</span> {f}
//                       </li>
//                     ))}
//                   </ul>

//                   <button className="read-more-btn py-2 px-4 text-white align-self-start">Read More</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Event;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/event.css';

const Event = () => {
  const [eventsList, setEventsList] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
  const API_URL = 'http://127.0.0.1:8000';

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.replace(/^\/storage\/storage\//, '/storage/');
    if (cleanPath.startsWith('/storage/')) {
      return `${API_URL}${cleanPath}`;
    }
    return `${API_URL}/storage/${cleanPath}`;
  };

  // Fetch events from API
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/events/all`);
      
      console.log("API Response:", response.data);
      
      if (response.data.success && response.data.data) {
        setEventsList(response.data.data);
        setActiveEvent(response.data.data[0]); // Set first event as active
      } else if (response.data.data) {
        setEventsList(response.data.data);
        setActiveEvent(response.data.data[0]);
      } else {
        setEventsList([]);
        setError('No events found');
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError('Failed to load events. Please try again later.');
      setEventsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="event-section py-5">
        <div className="container">
          <h2 className='mb-4 serif fw-bold'>Events</h2>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading events...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="event-section py-5">
        <div className="container">
          <h2 className='mb-4 serif fw-bold'>Events</h2>
          <div className="alert alert-danger text-center">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        </div>
      </section>
    );
  }

  // No events state
  if (!eventsList.length) {
    return (
      <section className="event-section py-5">
        <div className="container">
          <h2 className='mb-4 serif fw-bold'>Events</h2>
          <div className="text-center py-5">
            <i className="bi bi-calendar-x display-1 text-muted"></i>
            <p className="mt-3">No events available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="event-section py-5">
      <div className="container">
        <h2 className='mb-4 serif fw-bold'>Events</h2>
        <div className="row g-4">

          {/* Left Side List */}
          <div className="col-lg-4">
            <div className="event-list-wrapper">
              {eventsList.map((event) => (
                <div
                  key={event.id}
                  className={`event-list-item d-flex align-items-center mb-3 p-3 shadow-sm ${activeEvent?.id === event.id ? 'active' : ''}`}
                  onClick={() => setActiveEvent(event)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={getImageUrl(event.thumbImg)} 
                    alt={event.title} 
                    className="event-thumb me-3"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/80x60?text=Event';
                    }}
                  />
                  <div className="event-list-info">
                    <h6 className="event-list-title m-0 fw-bold">{event.title}</h6>
                    <small className="text-muted">{event.time}</small>
                  </div>
                </div>
              ))}
              <div className="text-center mt-3">
                <button
                  className="btn btn-outline-dark w-100 p-2 text-uppercase fw-bold custom-btn-outline"
                  style={{ fontSize: '13px' }}
                  onClick={() => window.location.href = '/all-events'}
                >
                  View All Events
                </button>
              </div>
            </div>
          </div>

          {/* Right Side Details */}
          <div className="col-lg-8">
            {activeEvent && (
              <div className="active-event-card shadow-sm bg-white overflow-hidden">
                <div className="row g-0">
                  <div className="col-md-7 position-relative">
                    <div className="image-container">
                      <img 
                        src={getImageUrl(activeEvent.mainImg)} 
                        alt={activeEvent.title} 
                        className="active-main-img img-fluid w-100"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/600x400?text=Event+Image';
                        }}
                      />
                    </div>
                    <div className="date-overlay text-center">
                      <h3 className="m-0 fw-bold">{activeEvent.dateBox?.day || new Date(activeEvent.event_datetime).getDate()}</h3>
                      <span>{activeEvent.dateBox?.month || new Date(activeEvent.event_datetime).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                  </div>

                  <div className="col-md-5 p-4 d-flex flex-column justify-content-center">
                    <h3 className="event-content-title serif mb-2">{activeEvent.mainTitle}</h3>
                    <h6 className="event-content-subtitle mb-3 serif">{activeEvent.subtitle}</h6>

                    <div className="event-description text-muted mb-3">
                      <p className="small mb-2">
                        Posted by {activeEvent.postedBy} | {activeEvent.comments || 0} Comments
                      </p>
                      <p className="small">
                        {activeEvent.description ? 
                          (activeEvent.description.length > 100 ? 
                            `${activeEvent.description.substring(0, 100)}...` : 
                            activeEvent.description
                          ) : 
                          'Enjoy your stay with our premium event services and world-class hospitality.'
                        }
                      </p>
                    </div>

                    <ul className="list-unstyled feature-list mb-4">
                      {activeEvent.features && activeEvent.features.length > 0 ? (
                        activeEvent.features.map((f, i) => (
                          <li key={i} className="small mb-1 d-flex align-items-center">
                            <span className="text-success me-2">✔</span> {f}
                          </li>
                        ))
                      ) : (
                        <>
                          <li className="small mb-1 d-flex align-items-center">
                            <span className="text-success me-2">✔</span> Premium Services
                          </li>
                          <li className="small mb-1 d-flex align-items-center">
                            <span className="text-success me-2">✔</span> World Class Hospitality
                          </li>
                          <li className="small mb-1 d-flex align-items-center">
                            <span className="text-success me-2">✔</span> Best Price Guarantee
                          </li>
                        </>
                      )}
                    </ul>

                    <button 
                      className="read-more-btn py-2 px-4 text-white align-self-start"
                      onClick={() => window.location.href = `/event/${activeEvent.slug || activeEvent.id}`}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Event;