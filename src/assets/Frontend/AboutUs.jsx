import React, { useState, useEffect } from 'react';
import Header from './Common/Header';
import Footer from './Common/Footer';
import '../css/about.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEye,
    faBullseye,
    faStar,
    faHeart,
    faEnvelope,
    faPhone
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

import king3 from '../image/section/Blog/hotle.jpeg';
import ceoImage from '../../assets/image/section/Blog/ceo.jpg';

// Company logo থাকলে import করে এখানে বসান, যেমন:
// import companyLogo from '../image/logo.png';
const COMPANY_LOGO = null;

// ---------- Brand colors ----------
const brandColor = '#5e2e10';      // main brand
const brandDark = '#3d1f0a';       // hover / darker
const brandTint = '#f6eee9';       // হালকা background
const DEFAULT_COMPANY = 'Akashbari Global Services';
const DEFAULT_TEAM = 'Our Team';

// Placeholder (via.placeholder.com বন্ধ হয়ে গেছে)
const makePlaceholder = (text) =>
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400">
            <rect width="100%" height="100%" fill="${brandTint}"/>
            <text x="50%" y="50%" fill="${brandColor}" font-family="sans-serif" font-size="18"
              text-anchor="middle" dominant-baseline="middle">${text}</text>
        </svg>`
    );
const MEMBER_PLACEHOLDER = makePlaceholder('No Image');
const CEO_PLACEHOLDER = makePlaceholder('CEO Image');

// 01XXXXXXXXX → 8801XXXXXXXXX (WhatsApp এর জন্য country code লাগে)
const toWhatsAppLink = (phone) => {
    let digits = (phone || '').replace(/\D/g, '');
    if (digits.startsWith('0')) digits = '88' + digits;
    return `https://wa.me/${digits}`;
};

// ---------- Team অনুযায়ী group (API যে order এ দেয় সেই order থাকবে) ----------
const groupByTeam = (members) =>
    members.reduce((groups, member) => {
        const key = member.team_name?.trim() || DEFAULT_TEAM;
        const existing = groups.find((g) => g.name === key);
        if (existing) existing.members.push(member);
        else groups.push({ name: key, members: [member] });
        return groups;
    }, []);

// ---------- পদ অনুযায়ী ক্রম (উপরের পদ আগে) ----------
// নতুন পদ লাগলে সঠিক জায়গায় একটা লাইন যোগ করুন
// প্রতিটা লাইনে: [মূল নাম, ...একই পদের অন্য বানান]
const DESIGNATION_ORDER = [
    ['chairman'],
    ['managing director', 'md'],
    ['ceo', 'chief executive officer'],
    ['director'],
    ['general manager', 'gm'],
    ['deputy general manager', 'dgm'],
    ['assistant general manager', 'agm'],
    ['senior manager', 'sr. manager', 'sr manager'],
    ['manager', 'branch manager'],
    ['deputy manager'],
    ['assistant manager', 'asst. manager', 'asst manager'],
    ['senior executive', 'sr. executive', 'sr executive'],
    ['executive'],
    ['junior executive', 'jr. executive', 'jr executive'],
    ['officer'],
    ['trainee', 'intern'],
];

const normalize = (text) => (text || '').toLowerCase().replace(/\s+/g, ' ').trim();

// সব বানান → rank (0 = সবচেয়ে উপরে)
const RANK_MAP = new Map(
    DESIGNATION_ORDER.flatMap((aliases, rank) => aliases.map((a) => [a, rank]))
);
// লম্বা নাম আগে, যাতে "assistant manager" কে "manager" না ধরে
const ALIASES_BY_LENGTH = [...RANK_MAP.keys()].sort((a, b) => b.length - a.length);

const getRank = (designation) => {
    const d = normalize(designation);
    if (RANK_MAP.has(d)) return RANK_MAP.get(d);

    // "Sales Executive" → "executive", "Branch Manager" → "manager"
    const alias = ALIASES_BY_LENGTH.find((a) => d.endsWith(' ' + a));
    return alias ? RANK_MAP.get(alias) : Infinity; // অচেনা পদ → সবার শেষে
};

// পদ অনুযায়ী serial করে (একই পদের মধ্যে API এর order থাকে)
const sortByRank = (members) =>
    [...members].sort((a, b) => {
        const ra = getRank(a.designation);
        const rb = getRank(b.designation);
        if (ra !== rb) return ra - rb;
        // দুজনই অচেনা পদ হলে পদের নাম অনুযায়ী A-Z
        if (ra === Infinity) return normalize(a.designation).localeCompare(normalize(b.designation));
        return 0;
    });

const VALUES = [
    { icon: faEye, title: 'Our Vision', text: "To be Bangladesh's most preferred eco-luxury resort, setting global benchmarks in sustainable hospitality." },
    { icon: faBullseye, title: 'Our Mission', text: 'To provide exceptional hospitality experiences while preserving nature and empowering local communities.' },
    { icon: faStar, title: 'Our Goal', text: 'To expand sustainably across Bangladesh, creating 1000+ jobs and becoming a model for responsible tourism.' }
];

// ---------- Team Card ----------
const TeamCard = ({ member }) => {
    const [first, ...rest] = (member.company || DEFAULT_COMPANY).trim().split(/\s+/);
    const hasContact = member.phone || member.email;

    return (
        <div className="ag-card">
            {/* Left: Photo */}
            <div className="ag-photo">
                <img
                    src={member.image || MEMBER_PLACEHOLDER}
                    alt={member.name}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = MEMBER_PLACEHOLDER; }}
                />

                {hasContact && (
                    <div className="ag-overlay">
                        {member.phone && (
                            <a href={`tel:${member.phone}`} className="ag-action" aria-label={`Call ${member.name}`}>
                                <FontAwesomeIcon icon={faPhone} />
                            </a>
                        )}
                        {member.phone && (
                            <a href={toWhatsAppLink(member.phone)} className="ag-action" target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${member.name}`}>
                                <FontAwesomeIcon icon={faWhatsapp} />
                            </a>
                        )}
                        {member.email && (
                            <a href={`mailto:${member.email}`} className="ag-action" aria-label={`Email ${member.name}`}>
                                <FontAwesomeIcon icon={faEnvelope} />
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* Right: Info */}
            <div className="ag-info">
                <div className="ag-info-top">
                    <div className="ag-badge">
                        {COMPANY_LOGO ? (
                            <img src={COMPANY_LOGO} alt="" className="ag-badge-logo" />
                        ) : (
                            <span className="ag-badge-mark">{first.charAt(0).toUpperCase()}</span>
                        )}
                        <span className="ag-badge-text">
                            <strong>{first.toUpperCase()}</strong>
                            {rest.length > 0 && <small>{rest.join(' ').toUpperCase()}</small>}
                        </span>
                    </div>
                </div>

                <div className="ag-info-body">
                    <h3 className="ag-name">{member.name}</h3>

                    <div className="ag-role">
                        <span className="ag-designation">{member.designation}</span>
                        {member.department && <span className="ag-dept">{member.department}</span>}
                    </div>

                    {hasContact && (
                        <>
                            <div className="ag-divider" />
                            <ul className="ag-contacts">
                                {member.phone && (
                                    <li>
                                        <FontAwesomeIcon icon={faPhone} className="ag-ico" />
                                        <a href={`tel:${member.phone}`}>{member.phone}</a>
                                    </li>
                                )}
                                {member.phone && (
                                    <li>
                                        <FontAwesomeIcon icon={faWhatsapp} className="ag-ico" />
                                        <a href={toWhatsAppLink(member.phone)} target="_blank" rel="noopener noreferrer">{member.phone}</a>
                                    </li>
                                )}
                                {member.email && (
                                    <li>
                                        <FontAwesomeIcon icon={faEnvelope} className="ag-ico" />
                                        <a href={`mailto:${member.email}`} className="ag-email">{member.email}</a>
                                    </li>
                                )}
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const AboutUs = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    const fetchTeamMembers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/team-members`);
            const result = await response.json();

            if (response.ok && result.status === true) {
                setTeamMembers(result.data || []);
            } else {
                setError(result.message || 'Failed to fetch team members');
            }
        } catch (err) {
            console.error('Error fetching team members:', err);
            setError('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const teamGroups = groupByTeam(teamMembers);

    return (
        <>
            <Header />

            {/* Section 1: Banner */}
            <section className="about-banner text-center d-flex flex-column justify-content-center">
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-white text-center">
                            <h1 className="banner-title serif mb-3">About Us</h1>
                            <div className="message-wrapper">
                                <p className="mb-0" style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '300',
                                    fontStyle: 'italic',
                                    borderLeft: `3px solid ${brandColor}`,
                                    borderRight: `3px solid ${brandColor}`,
                                    display: 'inline-block',
                                    padding: '0 25px',
                                    letterSpacing: '0.3px'
                                }}>
                                    <FontAwesomeIcon icon={faHeart} className="me-2" style={{ color: brandColor }} />
                                    Crafting dreams, building futures
                                    <FontAwesomeIcon icon={faHeart} className="ms-2" style={{ color: brandColor }} />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Akashbari Hotel & Resort Section */}
            <section className="akashbari-intro-section py-5" style={{ backgroundColor: '#fcfcfc' }}>
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <div className="modern-content">
                                <div className="section-badge mb-3" style={{ color: brandColor }}>
                                    WELCOME TO AKASHBARI
                                </div>
                                <h2 className="modern-title mb-4">
                                    Experience Luxury At
                                    <span style={{ color: brandColor, fontSize: '50px' }}> Akashbari Hotels & Resorts</span>
                                </h2>
                                <div className="p-3 mb-4 rounded-3 bg-white shadow-sm border-start border-4" style={{ borderColor: brandColor }}>
                                    <p className="mb-2"><strong> Business Type:</strong> Luxury Hospitality & Eco Resort</p>
                                    <p className="mb-0"><strong> Established Since:</strong> 2023</p>
                                </div>
                                <p className="modern-description text-muted mb-4" style={{ fontFamily: 'inherit', fontSize: '1rem', lineHeight: '1.6' }}>
                                    Akashbari Hotels & Resort is a premier getaway destination blending nature with world-class hospitality.
                                    Designed for families, couples, and corporate events, we offer a tranquil environment away from the hustle of daily life.
                                </p>
                                <h4 className="serif mb-3" style={{ fontSize: '1.3rem', fontWeight: '600', color: brandColor }}>
                                    Our Premium Facilities:
                                </h4>
                                <ul className="list-unstyled mb-4">
                                    {[
                                        'Premium Eco Cottages & Suites',
                                        'Infinity Swimming Pool',
                                        'Multi-Cuisine Fine Dining Restaurant',
                                        'Guided Nature Trails & Kids Zone',
                                        'Corporate Conference Hall & Event Spaces'
                                    ].map((item) => (
                                        <li key={item} className="mb-2 text-secondary" style={{ fontSize: '1.05rem' }}>✓ {item}</li>
                                    ))}
                                </ul>

                                <h4 className="serif mb-3" style={{ fontSize: '1.3rem', fontWeight: '600', color: brandColor }}>
                                    We Offer Investment Opportunity:
                                </h4>
                                <ul className="list-unstyled mb-4">
                                    {[
                                        'Become a Property Owner',
                                        'Yearly Profit',
                                        'Free Membership',
                                        'Investment Guideline',
                                        'Social Networking'
                                    ].map((item) => (
                                        <li key={item} className="mb-2 text-secondary" style={{ fontSize: '1.05rem' }}>✓ {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="modern-gallery-wrapper">
                                <div className="main-image-container position-relative overflow-hidden rounded-4 shadow-lg" style={{ border: `2px solid ${brandColor}40` }}>
                                    <img
                                        src={king3}
                                        alt="Akashbari Resort View"
                                        className="img-fluid w-100"
                                        style={{ minHeight: '420px', objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== CEO SECTION ========== */}
            <section className="ceo-section py-5" style={{ backgroundColor: '#ffffff' }}>
                <div className="container">
                    <div className="text-center mb-5">
                        <div className="section-badge d-inline-flex align-items-center gap-2 mb-3" style={{
                            backgroundColor: `${brandColor}15`,
                            padding: '8px 20px',
                            borderRadius: '50px',
                            color: brandColor,
                            fontSize: '14px',
                            fontWeight: '600'
                        }}>
                            LEADERSHIP CORNER
                        </div>
                        <h2 className="modern-title mb-3">
                            Message from Our
                            <span style={{ color: brandColor }}> Managing Director & Founder</span>
                        </h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '1rem' }}>
                            Meet the visionary behind Akashbari's success
                        </p>
                    </div>

                    <div className="row align-items-center g-5">
                        <div className="col-lg-5">
                            <div className="ceo-image-area text-center">
                                <div className="position-relative d-inline-block">
                                    <div className="ceo-image-wrapper rounded-4 overflow-hidden shadow-lg" style={{
                                        border: `5px solid ${brandColor}`,
                                        borderRadius: '20px',
                                        maxWidth: '350px',
                                        margin: '0 auto'
                                    }}>
                                        <img
                                            src={ceoImage}
                                            alt="CEO & Founder"
                                            className="img-fluid w-100"
                                            style={{ minHeight: '350px', objectFit: 'cover' }}
                                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = CEO_PLACEHOLDER; }}
                                        />
                                    </div>
                                    <div className="ceo-name-card mt-3 p-3 bg-white rounded-3 shadow-sm" style={{
                                        position: 'relative',
                                        zIndex: '2',
                                        border: `1px solid ${brandColor}30`
                                    }}>
                                        <h4 className="mb-0" style={{ color: brandColor, fontWeight: '700' }}>Touhidul Alam Milky</h4>
                                        <p className="mb-0 text-muted">Managing Director & Founder, Akashbari Group</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-7">
                            <div className="ceo-message-box p-4 rounded-4 mb-4" style={{
                                backgroundColor: '#fcfcfc',
                                borderLeft: `4px solid ${brandColor}`,
                                boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
                            }}>
                                <span style={{ fontSize: '40px', color: brandColor, opacity: '0.4' }}>"</span>
                                <p className="ceo-quote-text px-3" style={{
                                    fontSize: '1rem',
                                    lineHeight: '1.7',
                                    color: '#4a5568',
                                    fontStyle: 'italic'
                                }}>
                                    Akashbari was born from a dream to create a sanctuary where luxury meets nature,
                                    where every guest feels like family, and where hospitality goes beyond service to become
                                    an unforgettable experience. Our journey is driven by passion, integrity, and an unwavering
                                    commitment to excellence.
                                </p>
                                <span style={{ fontSize: '40px', color: brandColor, opacity: '0.4', display: 'block', textAlign: 'right' }}>"</span>
                            </div>

                            <div className="row g-3">
                                {VALUES.map((v) => (
                                    <div className="col-md-4" key={v.title}>
                                        <div className="vm-card text-center p-3 rounded-3 h-100">
                                            <div className="vm-icon mb-2" style={{ fontSize: '36px', color: brandColor }}>
                                                <FontAwesomeIcon icon={v.icon} />
                                            </div>
                                            <h5 className="mb-2" style={{ fontWeight: '700', color: brandColor, fontSize: '1.1rem' }}>{v.title}</h5>
                                            <p className="small text-muted mb-0" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>{v.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== TEAM SECTION ========== */}
            <section className="ag-team-section py-5">
                <div className="container">
                    <div className="team-header-modern text-center mb-4">
                        <div className="section-tag centered" style={{ color: brandColor }}>
                            MEET OUR EXPERTS
                        </div>
                        <h2 className="team-title">
                            The Passionate <span style={{ color: brandColor }}>People Behind</span><br />
                            Your Perfect Stay
                        </h2>
                        <p className="team-subtitle" style={{ fontSize: '0.95rem' }}>
                            Akashbari is supported by a dedicated team focused on creating a calm, welcoming environment.
                            From daily operations to guest support, each role contributes to a smooth and thoughtful stay experience.
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status" style={{ color: brandColor }}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3 text-muted">Loading team members...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-5">
                            <p className="text-danger">⚠️ {error}</p>
                            <button
                                className="btn mt-3 text-white"
                                onClick={fetchTeamMembers}
                                style={{ backgroundColor: brandColor, borderColor: brandColor }}
                            >
                                Retry
                            </button>
                        </div>
                    ) : teamMembers.length > 0 ? (
                        teamGroups.map((group) => (
                            <div key={group.name} className="ag-group">
                                <div className="ag-group-head">
                                    <h3>{group.name}</h3>
                                    <span className="ag-group-line" />
                                    <span className="ag-group-count">{group.members.length}</span>
                                </div>

                                {/* এক grid এ serial: Manager → Assistant Manager → Senior Executive → Executive (মাঝে ফাঁকা নেই) */}
                                <div className="ag-grid">
                                    {sortByRank(group.members).map((member) => (
                                        <TeamCard key={member.id} member={member} />
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-5">
                            <p className="text-muted">No team members found.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />

            <style>{`
                /* ---------- CEO / Vision cards ---------- */
                .ceo-section { animation: fadeIn 0.8s ease-out; }
                .vm-card {
                    background-color: #fcfcfc;
                    border: 1px solid ${brandColor}30;
                    transition: all 0.3s ease;
                }
                .vm-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px ${brandColor}30;
                    border-color: ${brandColor};
                }

                /* ---------- Team section ---------- */
                .ag-team-section {
                    --ag-brand: ${brandColor};
                    --ag-brand-dark: ${brandDark};
                    --ag-tint: ${brandTint};
                    background: #f7f5f1;
                }

                .ag-group + .ag-group { margin-top: 48px; }

                .ag-group-head {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 22px;
                }
                .ag-group-head h3 {
                    margin: 0;
                    font-size: 1.35rem;
                    font-weight: 800;
                    color: var(--ag-brand);
                    white-space: nowrap;
                }
                .ag-group-line { flex: 1; height: 1px; background: ${brandColor}30; }
                .ag-group-count {
                    min-width: 26px;
                    height: 26px;
                    padding: 0 8px;
                    border-radius: 999px;
                    background: var(--ag-tint);
                    color: var(--ag-brand);
                    font-size: 0.78rem;
                    font-weight: 700;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }

                .ag-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 22px;
                }

                /* Card */
                .ag-card {
                    display: grid;
                    grid-template-columns: 50% 50%;
                    min-height: 300px;
                    border-radius: 16px;
                    overflow: hidden;
                    background: var(--ag-tint);
                    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
                    transition: transform 0.35s ease, box-shadow 0.35s ease;
                    animation: agFadeUp 0.5s ease-out backwards;
                }
                .ag-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 16px 34px ${brandColor}33;
                }

                /* Photo — info panel এর নিচে 18px ঢুকে থাকে, তাই মাঝে কোনো gap থাকে না */
                .ag-photo {
                    position: relative;
                    overflow: hidden;
                    margin-right: -18px;
                    z-index: 0;
                }
                .ag-photo img {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: top center;
                    transition: transform 0.5s ease;
                }
                .ag-card:hover .ag-photo img { transform: scale(1.06); }

                /* Hover action buttons */
                .ag-overlay {
                    position: absolute;
                    left: 0;
                    right: 18px; /* panel এর নিচে ঢাকা অংশ বাদ দিয়ে center */
                    bottom: 0;
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    padding: 40px 10px 14px;
                    background: linear-gradient(transparent, rgba(0, 0, 0, 0.55));
                    opacity: 0;
                    transform: translateY(12px);
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                .ag-card:hover .ag-overlay { opacity: 1; transform: translateY(0); }
                .ag-action {
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--ag-brand);
                    color: #fff !important;
                    text-decoration: none;
                    font-size: 14px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
                    transition: transform 0.2s ease, background 0.2s ease;
                }
                .ag-action:hover { transform: scale(1.12); background: var(--ag-brand-dark); }

                /* Info panel */
                .ag-info {
                    position: relative;
                    z-index: 1;
                    background: #fff;
                    border: 3px solid var(--ag-brand);
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                }
                .ag-info-top {
                    padding: 12px 16px;
                    border-bottom: 1px solid ${brandColor}1f;
                }
                .ag-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 4px 12px 4px 8px;
                    border: 1px solid var(--ag-brand);
                    border-radius: 6px;
                    line-height: 1.1;
                }
                .ag-badge-logo { width: 22px; height: 22px; object-fit: contain; }
                .ag-badge-mark {
                    width: 20px;
                    height: 20px;
                    border-radius: 4px;
                    background: var(--ag-brand);
                    color: #fff;
                    font-size: 11px;
                    font-weight: 800;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                .ag-badge-text { display: flex; flex-direction: column; }
                .ag-badge-text strong { font-size: 11px; font-weight: 800; color: #1d1d1d; letter-spacing: 0.3px; }
                .ag-badge-text small { font-size: 8px; font-weight: 600; color: var(--ag-brand); letter-spacing: 0.4px; }

                .ag-info-body {
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }
                .ag-name {
                    font-size: 1.15rem;
                    font-weight: 800;
                    color: #1d1d1d;
                    line-height: 1.25;
                    margin: 0 0 6px;
                }
                .ag-role {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 6px 8px;
                }
                .ag-designation { color: var(--ag-brand); font-weight: 700; font-size: 0.9rem; }
                .ag-dept {
                    background: var(--ag-tint);
                    color: var(--ag-brand);
                    font-size: 0.72rem;
                    font-weight: 500;
                    padding: 3px 10px;
                    border-radius: 999px;
                }
                .ag-divider { border-top: 1px dashed ${brandColor}33; margin: 14px 0 12px; }

                .ag-contacts { list-style: none; padding: 0; margin: 0; }
                .ag-contacts li {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    font-size: 0.85rem;
                    color: #444;
                    margin-bottom: 9px;
                }
                .ag-contacts li:last-child { margin-bottom: 0; }
                .ag-ico { color: var(--ag-brand); opacity: 0.75; width: 14px; margin-top: 3px; flex-shrink: 0; }
                .ag-contacts a { color: #444; text-decoration: none; transition: color 0.2s ease; }
                .ag-contacts a:hover { color: var(--ag-brand); }
                .ag-email { overflow-wrap: anywhere; }

                @keyframes agFadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

                /* Responsive */
                @media (max-width: 576px) {
                    .ag-grid { grid-template-columns: 1fr; gap: 16px; }
                    .ag-card { grid-template-columns: 50% 50%; min-height: 260px; }
                    .ag-info-top { padding: 10px 12px; }
                    .ag-info-body { padding: 12px; }
                    .ag-name { font-size: 1rem; }
                    .ag-contacts li { font-size: 0.78rem; gap: 8px; }
                }

                /* Touch device এ hover নেই */
                @media (hover: none) {
                    .ag-card:hover { transform: none; }
                }
            `}</style>
        </>
    );
};

export default AboutUs;