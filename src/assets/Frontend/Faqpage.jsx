import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

/* ---------- small inline icons (no emoji, keeps the catalog feel consistent) ---------- */

const IconSearch = ({ color }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="7" cy="7" r="5" stroke={color} strokeWidth="1.4" />
        <line x1="10.8" y1="10.8" x2="14.5" y2="14.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
);

const IconChevron = ({ color, open }) => (
    <svg
        width="14" height="14" viewBox="0 0 14 14" fill="none"
        style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)' }}
    >
        <path d="M3 5.5L7 9.5L11 5.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconSlot = ({ color }) => (
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
        <rect x="7" y="10" width="32" height="26" rx="1" stroke={color} strokeWidth="1.4" />
        <line x1="12" y1="17" x2="34" y2="17" stroke={color} strokeWidth="1.2" strokeDasharray="1 3" />
        <line x1="12" y1="23" x2="30" y2="23" stroke={color} strokeWidth="1.2" strokeDasharray="1 3" />
        <line x1="12" y1="29" x2="26" y2="29" stroke={color} strokeWidth="1.2" strokeDasharray="1 3" />
    </svg>
);

const IconMisfile = ({ color }) => (
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
        <rect x="6" y="12" width="24" height="26" rx="1" stroke={color} strokeWidth="1.4" transform="rotate(-8 6 12)" />
        <rect x="16" y="10" width="24" height="26" rx="1" stroke={color} strokeWidth="1.4" transform="rotate(6 16 10)" />
        <line x1="23" y1="34" x2="23" y2="34.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
);

/* ---------- design tokens: "card-catalog / reading room index" (শুধু light) ---------- */

const c = {
    bg: '#EDEAE1',
    surface: '#FFFFFF',
    surfaceAlt: '#F7F4EC',
    ink: '#201C16',
    inkSecondary: '#756B5C',
    border: '#DEDACD',
    borderStrong: '#C9C3AF',
    accent: '#3F6B54',
    accentSoft: 'rgba(63,107,84,0.10)',
    brass: '#B8874A',
    brassSoft: 'rgba(184,135,74,0.14)',
    shadow: '0 18px 40px -18px rgba(32,28,22,0.18)',
    notch: '#EDEAE1'
};

const fontDisplay = "'Fraunces', 'Iowan Old Style', Georgia, serif";
const fontBody = "'IBM Plex Sans', -apple-system, 'Segoe UI', sans-serif";
const fontMono = "'IBM Plex Mono', 'SF Mono', monospace";

// প্রতিটা FAQ card এর মাঝে কত ms বিরতি
const CARD_STEP_MS = 90;

const styles = {
    container: {
        backgroundColor: c.bg,
        backgroundImage: `radial-gradient(${c.borderStrong} 1px, transparent 1px)`,
        backgroundSize: '22px 22px',
        minHeight: '100vh',
        padding: '72px 20px 100px',
        transition: 'background-color 0.4s ease',
        fontFamily: fontBody,
        position: 'relative'
    },
    contentWrapper: {
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 1,
        padding: '0 20px'
    },
    headerSection: {
        marginBottom: '46px'
    },
    title: {
        fontFamily: fontDisplay,
        color: '#5e2e10',
        fontSize: '2.9rem',
        fontWeight: 600,
        fontOpticalSizing: 'auto',
        marginBottom: '14px',
        letterSpacing: '-0.02em',
        lineHeight: 1.08
    },
    subtitle: {
        color: c.inkSecondary,
        fontSize: '1.02rem',
        fontWeight: 400,
        marginBottom: '34px',
        maxWidth: '550px',
        lineHeight: '1.65'
    },
    searchBox: {
        position: 'relative',
        width: '100%'
    },
    searchInput: {
        width: '100%',
        boxSizing: 'border-box',
        padding: '16px 20px 16px 48px',
        border: `1px solid ${c.border}`,
        borderRadius: '4px',
        backgroundColor: c.surface,
        color: c.ink,
        fontFamily: fontMono,
        fontSize: '0.95rem',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        outline: 'none'
    },
    searchInputFocus: {
        borderColor: c.accent,
        boxShadow: `0 0 0 3px ${c.accentSoft}`
    },
    searchIcon: {
        position: 'absolute',
        left: '18px',
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none'
    },
    faqContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%'
    },
    faqItem: {
        backgroundColor: c.surface,
        borderRadius: '4px',
        border: `1px solid ${c.border}`,
        position: 'relative',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        width: '100%'
    },
    faqItemActive: {
        borderColor: c.accent,
        boxShadow: c.shadow
    },
    cornerNotch: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: '0 18px 18px 0',
        borderColor: `transparent ${c.notch} transparent transparent`,
        filter: `drop-shadow(-1px 1px 0 ${c.border})`
    },
    faqQuestion: {
        padding: '24px 30px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '20px',
        width: '100%',
        boxSizing: 'border-box'
    },
    questionNumber: {
        fontFamily: fontMono,
        fontSize: '0.82rem',
        color: c.brass,
        fontWeight: 600,
        paddingTop: '3px',
        flexShrink: 0,
        minWidth: '44px'
    },
    questionText: {
        fontFamily: fontDisplay,
        color: c.ink,
        fontSize: '1.18rem',
        fontWeight: 500,
        margin: 0,
        flex: 1,
        lineHeight: '1.5',
        paddingRight: '15px',
        wordWrap: 'break-word'
    },
    chevronWrap: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        flexShrink: 0,
        marginTop: '2px'
    },
    faqAnswer: {
        maxHeight: 0,
        overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease',
        opacity: 0
    },
    faqAnswerOpen: {
        maxHeight: '700px',
        opacity: 1
    },
    answerInner: {
        padding: '0 30px 28px 95px',
        borderLeft: 'none'
    },
    answerText: {
        color: c.inkSecondary,
        fontSize: '1rem',
        lineHeight: '1.9',
        margin: 0,
        paddingLeft: '20px',
        borderLeft: `2.5px solid ${c.brassSoft}`
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '90px 20px',
        color: c.inkSecondary,
        fontFamily: fontMono,
        fontSize: '0.85rem'
    },
    spinner: {
        width: '34px',
        height: '34px',
        border: `2.5px solid ${c.border}`,
        borderTop: `2.5px solid ${c.accent}`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        marginBottom: '18px'
    },
    stateBox: {
        textAlign: 'center',
        padding: '80px 20px',
        border: `1px dashed ${c.borderStrong}`,
        borderRadius: '4px',
        backgroundColor: c.surfaceAlt
    },
    stateTitle: {
        fontFamily: fontDisplay,
        color: c.ink,
        fontSize: '1.4rem',
        fontWeight: 600,
        margin: '18px 0 8px'
    },
    stateText: {
        color: c.inkSecondary,
        fontSize: '0.95rem'
    }
};

/* ---------- component ---------- */

const Faqpage = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeKey, setActiveKey] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // FAQ list screen এ এলে animation শুরু
    const listRef = useRef(null);
    const [inView, setInView] = useState(false);

    // Motion কমানো থাকলে animation ছাড়াই দেখাও
    const [reduceMotion] = useState(() =>
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000/api';

    useEffect(() => {
        fetchFaqs();
    }, []);

    // List দেখা গেলে একবার in-view
    useEffect(() => {
        if (loading || inView) return;
        const el = listRef.current;
        if (!el) return;

        if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
            setInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [loading, inView]);

    const fetchFaqs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/faqs`);

            let faqData = [];
            if (Array.isArray(response.data)) {
                faqData = response.data;
            } else if (response.data && typeof response.data === 'object') {
                if (Array.isArray(response.data.data)) {
                    faqData = response.data.data;
                } else if (Array.isArray(response.data.faqs)) {
                    faqData = response.data.faqs;
                } else {
                    const values = Object.values(response.data);
                    if (values.some(v => typeof v === 'object' && v !== null)) {
                        faqData = values;
                    } else {
                        faqData = [response.data];
                    }
                }
            }

            setFaqs(faqData);
            setError(null);
        } catch (err) {
            setError('Failed to load FAQs');
            console.error('Error fetching FAQs:', err);
            setFaqs([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleFaq = (key) => {
        setActiveKey((prev) => (prev === key ? null : key));
    };

    const filteredFaqs = faqs.filter(faq => {
        const searchLower = searchTerm.toLowerCase();
        const question = (faq.faq_question || '').toLowerCase();
        const answer = (faq.faq_answe || '').toLowerCase();
        return question.includes(searchLower) || answer.includes(searchLower);
    });

    // প্রতিটা card এর animation style
    const cardAnimation = (index) => {
        if (reduceMotion) return { opacity: 1 };
        if (!inView) return { opacity: 0 };
        return {
            opacity: 0,
            animation: 'faqDropIn 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards',
            animationDelay: `${Math.min(index, 10) * CARD_STEP_MS}ms`
        };
    };

    return (
        <div style={styles.container}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@500;600&display=swap');

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* FAQ card উপর থেকে নেমে বসবে */
                @keyframes faqDropIn {
                    0%   { opacity: 0; translate: 0 -30px; }
                    70%  { opacity: 1; translate: 0 4px; }
                    100% { opacity: 1; translate: 0 0; }
                }

                .fq-question:hover .fq-question-text { text-decoration: underline; text-decoration-color: ${c.brass}; text-underline-offset: 4px; }
            `}</style>

            <div style={styles.contentWrapper}>
                <div style={styles.headerSection}>
                    <h1 style={styles.title}>Frequently Asked Questions</h1>
                    <p style={styles.subtitle}>
                        A short index of answers about the platform. Search by keyword or browse the full list below.
                    </p>

                    {/* Search input */}
                    <div style={styles.searchBox}>
                        <div style={styles.searchIcon}>
                            <IconSearch color={c.inkSecondary} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search FAQs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            style={{
                                ...styles.searchInput,
                                ...(isSearchFocused && styles.searchInputFocus)
                            }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={styles.loadingContainer}>
                        <div style={styles.spinner}></div>
                        <div>Retrieving entries...</div>
                    </div>
                ) : error ? (
                    <div style={styles.stateBox}>
                        <IconMisfile color={c.inkSecondary} />
                        <h3 style={styles.stateTitle}>Entry not found</h3>
                        <p style={styles.stateText}>{error}</p>
                    </div>
                ) : (
                    <div ref={listRef} style={styles.faqContainer}>
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => {
                                const key = faq.id ?? `faq-${index}`;
                                const isActive = activeKey === key;
                                return (
                                    <div
                                        key={key}
                                        style={{
                                            ...styles.faqItem,
                                            ...(isActive && styles.faqItemActive),
                                            ...cardAnimation(index)
                                        }}
                                    >
                                        <div style={styles.cornerNotch}></div>
                                        <div
                                            style={styles.faqQuestion}
                                            className="fq-question"
                                            onClick={() => toggleFaq(key)}
                                        >
                                            <span style={styles.questionNumber}>
                                                N&deg;{String(index + 1).padStart(2, '0')}
                                            </span>
                                            <p style={styles.questionText} className="fq-question-text">
                                                {faq.faq_question || 'Question not available'}
                                            </p>
                                            <div style={styles.chevronWrap}>
                                                <IconChevron color={isActive ? c.accent : c.inkSecondary} open={isActive} />
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                ...styles.faqAnswer,
                                                ...(isActive && styles.faqAnswerOpen)
                                            }}
                                        >
                                            <div style={styles.answerInner}>
                                                <p style={styles.answerText}>
                                                    {faq.faq_answe || 'Answer not available'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div style={styles.stateBox}>
                                <IconSlot color={c.inkSecondary} />
                                <h3 style={styles.stateTitle}>No matching entries</h3>
                                <p style={styles.stateText}>Try a different search term.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Faqpage;