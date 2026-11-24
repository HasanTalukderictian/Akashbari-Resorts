import Header from "./Common/Header";
import Footer from "./Common/Footer";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import backgroundImage from '../Background/21188763-450a-4fa6-bd55-00e25dd6c660.jfif'

const brandColor = '#5e2e10';
const brandHover = '#3d1f0a';
const eventsPerPage = 6;
const DESCRIPTION_LIMIT = 120; // এর চেয়ে লম্বা হলে "See more" দেখাবে

const API_BASE = import.meta.env.VITE_BASE_URL;
// Vite এ শুধু VITE_ দিয়ে শুরু হওয়া env পড়া যায়; না থাকলে BASE_URL থেকে /api বাদ দিয়ে নেবে
const API_URL = (import.meta.env.VITE_API_URL || API_BASE || '').replace(/\/api\/?$/, '');

const EVENT_PLACEHOLDER =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
      <rect width="100%" height="100%" fill="#f6eee9"/>
      <text x="50%" y="50%" fill="${brandColor}" font-family="sans-serif" font-size="20"
        text-anchor="middle" dominant-baseline="middle">Event</text>
    </svg>`
  );

// ---------- Filter list ----------
const FILTERS = [
  { key: 'all', label: 'All Events', icon: 'bi-grid-3x3-gap-fill' },
  { key: 'running', label: 'Running', icon: 'bi-broadcast' },
  { key: 'upcoming', label: 'Upcoming', icon: 'bi-calendar-event-fill' },
  { key: 'past', label: 'Past Events', icon: 'bi-calendar-check-fill' },
];

const STATUS_LABEL = {
  running: { text: 'Running now', icon: 'bi-broadcast' },
  upcoming: { text: 'Upcoming', icon: 'bi-calendar-event' },
  past: { text: 'Completed', icon: 'bi-check2-circle' },
};

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/**
 * Event এর অবস্থা: 'running' | 'upcoming' | 'past' | null (তারিখ নেই/ভুল)
 * - end_datetime থাকলে: start <= এখন <= end হলে running
 * - end_datetime না থাকলে: event এর তারিখ আজ হলে running
 */
const getEventStatus = (event, now = new Date()) => {
  const start = new Date(event.event_datetime);
  if (Number.isNaN(start.getTime())) return null;

  const end = event.end_datetime ? new Date(event.end_datetime) : null;
  const hasValidEnd = end && !Number.isNaN(end.getTime());

  if (hasValidEnd) {
    if (now < start) return 'upcoming';
    if (now <= end) return 'running';
    return 'past';
  }

  if (isSameDay(start, now)) return 'running';
  return start > now ? 'upcoming' : 'past';
};

const AllEvents = () => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState({}); // কোন card এর description খোলা

  const theme = {
    isDarkMode,
    bg: isDarkMode ? '#1a1a2e' : '#f8f9fa',
    card: isDarkMode ? '#16213e' : '#ffffff',
    text: isDarkMode ? '#e9ecef' : '#2c3e50',
    border: isDarkMode ? '#2d3436' : '#e0e0e0',
        heroBg: isDarkMode
      ? `linear-gradient(rgba(26, 26, 46, 0.85), rgba(22, 33, 62, 0.85)), url("${backgroundImage}")`
      : `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${backgroundImage}")`,
    primaryColor: brandColor,
    primaryHover: brandHover,
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.replace(/^\/storage\/storage\//, '/storage/');
    if (cleanPath.startsWith('/storage/')) return `${API_URL}${cleanPath}`;
    return `${API_URL}/storage/${cleanPath.replace(/^\/+/, '')}`;
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/events/all`);
      if (response.data.success && response.data.data) {
        setEvents(response.data.data);
      } else {
        setEvents([]);
        setError('No events found');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Page এ আসলে সবসময় উপর থেকে শুরু
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  // Search বা filter বদলালে page 1 এ ফিরে যাও
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Pagination বদলালে উপরে scroll
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [currentPage]);

  const toggleExpanded = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  // প্রতিটা event এর status একবার হিসাব করে রাখি
  const now = new Date();
  const eventsWithStatus = events.map((event) => ({ ...event, _status: getEventStatus(event, now) }));

  const q = searchTerm.trim().toLowerCase();
  const searchedEvents = eventsWithStatus.filter((event) =>
    !q ||
    event.title?.toLowerCase().includes(q) ||
    event.mainTitle?.toLowerCase().includes(q) ||
    event.subtitle?.toLowerCase().includes(q)
  );

  // প্রতিটা filter এ কয়টা event (search অনুযায়ী)
  const counts = {
    all: searchedEvents.length,
    running: searchedEvents.filter((e) => e._status === 'running').length,
    upcoming: searchedEvents.filter((e) => e._status === 'upcoming').length,
    past: searchedEvents.filter((e) => e._status === 'past').length,
  };

  const filteredEvents = searchedEvents.filter(
    (event) => selectedCategory === 'all' || event._status === selectedCategory
  );

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const emptyMessage = {
    running: 'No events are running right now',
    upcoming: 'No upcoming events',
    past: 'No past events',
    all: 'No events found',
  }[selectedCategory];

  const styles = {
    pageContainer: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
    heroSection: {
      background: theme.heroBg,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '80px 0',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
    },
    heroContent: { position: 'relative', zIndex: 2 },
    heroTitle: { textShadow: '2px 4px 10px rgba(0,0,0,0.5)' },
    heroSubtitle: { opacity: 0.95, textShadow: '1px 2px 5px rgba(0,0,0,0.5)' },
    spinner: { width: '3rem', height: '3rem' },
    loadingText: { color: theme.text, fontSize: '1.1rem' },
    errorAlert: { borderRadius: '12px', padding: '20px' },
    searchBox: { position: 'relative' },
    searchIcon: {
      position: 'absolute',
      left: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 10,
      color: brandColor,
    },
    searchInput: {
      paddingLeft: '40px',
      borderRadius: '12px',
      border: `2px solid ${theme.border}`,
      height: '50px',
      fontSize: '15px',
      backgroundColor: theme.card,
      color: theme.text,
    },
    eventCard: {
      backgroundColor: theme.card,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    eventImageWrapper: { position: 'relative', overflow: 'hidden', height: '180px' },
    eventCardImg: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' },
    eventDateBadge: {
      position: 'absolute',
      top: '12px',
      left: '12px',
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      borderRadius: '8px',
      padding: '6px 10px',
      textAlign: 'center',
      minWidth: '45px',
      backdropFilter: 'blur(5px)',
      zIndex: 2,
    },
    eventDay: { display: 'block', fontSize: '18px', fontWeight: 'bold', lineHeight: 1 },
    eventMonth: { display: 'block', fontSize: '10px', textTransform: 'uppercase' },
    eventCardBody: { padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' },
    eventCardTitle: { fontSize: '17px', fontWeight: 'bold', marginBottom: '4px', color: theme.text },
    eventCardSubtitle: { fontSize: '13px', color: brandColor, marginBottom: '10px' },
    eventMeta: { display: 'flex', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' },
    eventMetaItem: { fontSize: '12px', color: '#6c757d' },
    eventCardDescription: {
      fontSize: '13px',
      color: '#6c757d',
      lineHeight: 1.5,
      marginBottom: '4px',
      whiteSpace: 'pre-line',
    },
    seeMoreBtn: {
      background: 'none',
      border: 'none',
      padding: 0,
      fontSize: '12px',
      fontWeight: 600,
      color: brandColor,
      cursor: 'pointer',
      alignSelf: 'flex-start',
      marginBottom: '12px',
    },
    eventFeatures: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' },
    featureTag: {
      backgroundColor: isDarkMode ? '#2d3436' : '#f0f0f0',
      padding: '4px 8px',
      borderRadius: '15px',
      fontSize: '11px',
      color: isDarkMode ? '#e9ecef' : '#666',
      display: 'inline-flex',
      alignItems: 'center',
    },
    eventCardFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '10px',
      borderTop: `1px solid ${theme.border}`,
      marginTop: 'auto',
    },
    paginationWrapper: { display: 'flex', justifyContent: 'center' },
    noEvents: { padding: '60px 20px' },
    noEventsIcon: { fontSize: '64px', color: '#dee2e6' },
    resultsCount: { fontSize: '14px', color: theme.text },
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }}>
        <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
        <div className="container py-5">
          <div className="text-center py-5">
            <div className="spinner-border" style={{ ...styles.spinner, color: brandColor }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3" style={styles.loadingText}>Loading amazing events...</p>
          </div>
        </div>
        <Footer theme={theme} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }}>
        <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
        <div className="container py-5">
          <div className="alert alert-danger text-center" style={styles.errorAlert}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <div className="mt-3">
              <button
                className="btn text-white"
                onClick={fetchEvents}
                style={{ backgroundColor: brandColor, borderColor: brandColor, borderRadius: '25px' }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer theme={theme} />
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <Header theme={theme} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} />

      {/* Hero Section */}
      <div className="hero-section" style={styles.heroSection}>
        <div className="container">
          <div className="text-center" style={styles.heroContent}>
            <h1 className="display-3 fw-bold mb-3" style={styles.heroTitle}>
              Explore Our Events
            </h1>
            <p className="lead mb-4" style={styles.heroSubtitle}>
              Discover unforgettable experiences and create lasting memories
            </p>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* Search and Filter Section */}
        <div className="row mb-5 align-items-center">
          <div className="col-lg-5 mb-3">
            <div className="search-box" style={styles.searchBox}>
              <i className="bi bi-search" style={styles.searchIcon}></i>
              <input
                type="text"
                className="form-control"
                placeholder="Search events by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>
          <div className="col-lg-7 mb-3">
            <div className="filter-buttons" role="tablist" aria-label="Filter events">
              {FILTERS.map((f) => {
                const active = selectedCategory === f.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={`ev-filter-btn ${active ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(f.key)}
                  >
                    {f.key === 'running' ? (
                      <span className="live-dot" aria-hidden="true"></span>
                    ) : (
                      <i className={`bi ${f.icon} filter-icon`}></i>
                    )}
                    <span className="filter-text">{f.label}</span>
                    <span className="filter-count">{counts[f.key]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-5" style={styles.noEvents}>
            <i className={`bi ${selectedCategory === 'running' ? 'bi-broadcast' : 'bi-calendar-x'}`} style={styles.noEventsIcon}></i>
            <h3 className="mt-3" style={{ color: theme.text }}>{emptyMessage}</h3>
            <p className="text-muted">Try adjusting your search or filter criteria</p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                className="btn mt-2 text-white"
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                style={{ backgroundColor: brandColor, borderColor: brandColor, borderRadius: '25px', padding: '8px 22px' }}
              >
                Show all events
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="row g-4 justify-content-center">
              {currentEvents.map((event) => {
                const eventDate = new Date(event.event_datetime);
                const isRunning = event._status === 'running';
                const status = STATUS_LABEL[event._status];

                const description = event.description || 'Experience an unforgettable event with premium services.';
                const isLong = description.length > DESCRIPTION_LIMIT;
                const isOpen = !!expanded[event.id];

                return (
                  <div key={event.id} className="col-xl-3 col-lg-4 col-md-6 col-12">
                    <div className="event-card" style={styles.eventCard}>
                      <div className="event-image-wrapper" style={styles.eventImageWrapper}>
                        <img
                          src={getImageUrl(event.mainImg) || getImageUrl(event.thumbImg) || EVENT_PLACEHOLDER}
                          alt={event.title}
                          className="event-card-img"
                          style={styles.eventCardImg}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = EVENT_PLACEHOLDER;
                          }}
                        />
                        <div className="event-date-badge" style={styles.eventDateBadge}>
                          <span className="event-day" style={styles.eventDay}>
                            {event.dateBox?.day || eventDate.getDate()}
                          </span>
                          <span className="event-month" style={styles.eventMonth}>
                            {event.dateBox?.month || eventDate.toLocaleString('default', { month: 'short' })}
                          </span>
                        </div>

                        {isRunning && (
                          <span className="live-badge">
                            <span className="live-dot"></span> LIVE
                          </span>
                        )}
                      </div>

                      <div className="event-card-body" style={styles.eventCardBody}>
                        <h5 className="event-card-title" style={styles.eventCardTitle}>{event.title}</h5>
                        {event.mainTitle && (
                          <p className="event-card-subtitle" style={styles.eventCardSubtitle}>{event.mainTitle}</p>
                        )}

                        <div className="event-meta" style={styles.eventMeta}>
                          {event.time && (
                            <span className="event-meta-item" style={styles.eventMetaItem}>
                              <i className="bi bi-clock me-1"></i> {event.time}
                            </span>
                          )}
                          {event.postedBy && (
                            <span className="event-meta-item" style={styles.eventMetaItem}>
                              <i className="bi bi-person me-1"></i> {event.postedBy}
                            </span>
                          )}
                        </div>

                        <p
                          className={`event-card-description ${isLong && !isOpen ? 'is-clamped' : ''}`}
                          style={styles.eventCardDescription}
                        >
                          {description}
                        </p>
                        {isLong ? (
                          <button
                            type="button"
                            style={styles.seeMoreBtn}
                            onClick={() => toggleExpanded(event.id)}
                            aria-expanded={isOpen}
                          >
                            {isOpen ? 'See less' : 'See more'}
                          </button>
                        ) : (
                          <div style={{ marginBottom: '12px' }} />
                        )}

                        {Array.isArray(event.features) && event.features.length > 0 && (
                          <div className="event-features" style={styles.eventFeatures}>
                            {event.features.map((feature, idx) => (
                              <span key={idx} className="feature-tag" style={styles.featureTag}>
                                <i className="bi bi-check-circle-fill me-1" style={{ color: brandColor }}></i> {String(feature)}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="event-card-footer" style={styles.eventCardFooter}>
                          <span className="text-muted small">
                            <i className="bi bi-calendar3 me-1"></i>
                            {Number.isNaN(eventDate.getTime())
                              ? '—'
                              : eventDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          {status && (
                            <span className={`status-pill status-${event._status}`}>
                              <i className={`bi ${status.icon} me-1`}></i>{status.text}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-wrapper mt-5" style={styles.paginationWrapper}>
                <nav>
                  <ul className="pagination justify-content-center flex-wrap">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        style={{ color: brandColor }}
                      >
                        <i className="bi bi-chevron-left"></i> Previous
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                      <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(index + 1)}
                          style={currentPage === index + 1
                            ? { backgroundColor: brandColor, borderColor: brandColor, color: 'white' }
                            : { color: brandColor }}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        style={{ color: brandColor }}
                      >
                        Next <i className="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}

            {/* Results count */}
            <div className="text-center mt-4" style={styles.resultsCount}>
              <p>
                Showing {indexOfFirstEvent + 1} to {Math.min(indexOfLastEvent, filteredEvents.length)} of {filteredEvents.length} events
              </p>
            </div>
          </>
        )}
      </div>

      <Footer theme={theme} />

      <style>{`
        /* ---------- Event card ---------- */
        .event-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.12) !important;
        }
        .event-card:hover .event-card-img { transform: scale(1.06); }

        .event-card-description.is-clamped {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ---------- Status pill (card footer) ---------- */
        .status-pill {
          display: inline-flex;
          align-items: center;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 999px;
          white-space: nowrap;
        }
        .status-running  { background: #fdecec; color: #c0262b; }
        .status-upcoming { background: ${brandColor}15; color: ${brandColor}; }
        .status-past     { background: #eef0f2; color: #6c757d; }

        /* ---------- Filter buttons ---------- */
        .filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: flex-end;
        }
        .ev-filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 25px;
          border: 1.5px solid ${brandColor};
          background: transparent;
          color: ${brandColor};
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .ev-filter-btn:hover {
          background: ${brandColor};
          color: #fff;
          transform: translateY(-2px);
        }
        .ev-filter-btn.active {
          background: ${brandColor};
          color: #fff;
          box-shadow: 0 6px 16px ${brandColor}40;
        }
        .filter-count {
          min-width: 22px;
          height: 22px;
          padding: 0 7px;
          border-radius: 999px;
          background: ${brandColor}15;
          color: inherit;
          font-size: 11px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .ev-filter-btn:hover .filter-count,
        .ev-filter-btn.active .filter-count { background: rgba(255,255,255,0.22); }

        /* ---------- Live indicator ---------- */
        .live-dot {
          position: relative;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #e5383b;
          flex-shrink: 0;
        }
        .live-dot::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: #e5383b;
          animation: livePulse 1.4s ease-out infinite;
        }
        @keyframes livePulse {
          0%   { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        .live-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(0,0,0,0.75);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.6px;
          backdrop-filter: blur(4px);
        }

        @media (prefers-reduced-motion: reduce) {
          .live-dot::after { animation: none; }
        }

        /* ---------- Pagination ---------- */
        .page-link { transition: all 0.3s ease; cursor: pointer; }
        .page-item:not(.disabled) .page-link:hover {
          transform: translateY(-2px);
          background-color: ${brandColor};
          color: white !important;
        }
        .page-item.active .page-link {
          background-color: ${brandColor} !important;
          border-color: ${brandColor} !important;
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 991px) {
          .hero-section { padding: 50px 0; }
          .hero-section h1 { font-size: 32px; }
          .filter-buttons { justify-content: center; }
        }

        @media (max-width: 767px) {
          .filter-icon { display: none !important; }
          .ev-filter-btn { font-size: 13px; padding: 6px 12px; gap: 6px; }
          .hero-section { padding: 40px 0; }
          .hero-section h1 { font-size: 28px; }
          .hero-section p { font-size: 16px; }
        }

        @media (max-width: 480px) {
          .filter-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
          .ev-filter-btn { justify-content: center; font-size: 12px; padding: 7px 10px; }
        }
      `}</style>
    </div>
  );
};

export default AllEvents;