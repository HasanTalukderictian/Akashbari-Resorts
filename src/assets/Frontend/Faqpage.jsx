import React, { useState, useEffect } from 'react';
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

const IconSun = ({ color }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="3.4" stroke={color} strokeWidth="1.4" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
                key={deg}
                x1="9" y1="1.6" x2="9" y2="3.4"
                stroke={color} strokeWidth="1.4" strokeLinecap="round"
                transform={`rotate(${deg} 9 9)`}
            />
        ))}
    </svg>
);

const IconMoon = ({ color }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M13.5 9.8A6 6 0 1 1 8.2 3.5a5 5 0 0 0 5.3 6.3Z" fill={color} />
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

/* ---------- component ---------- */

const Faqpage = ({ theme: propsTheme }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000/api';

    useEffect(() => {
        fetchFaqs();
    }, []);

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

    const toggleFaq = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const filteredFaqs = faqs.filter(faq => {
        const searchLower = searchTerm.toLowerCase();
        const question = (faq.faq_question || '').toLowerCase();
        const answer = (faq.faq_answe || '').toLowerCase();
        return question.includes(searchLower) || answer.includes(searchLower);
    });

    /* ---------- design tokens: "card-catalog / reading room index" ---------- */

    const colors = {
        light: {
            bg: '#EDEAE1',
            bgDotOpacity: 0.5,
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
        },
        dark: {
            bg: '#14161B',
            bgDotOpacity: 0.35,
            surface: '#1C1F26',
            surfaceAlt: '#20232B',
            ink: '#EFEAE0',
            inkSecondary: '#9B9686',
            border: '#2C2F38',
            borderStrong: '#3A3E49',
            accent: '#77B599',
            accentSoft: 'rgba(119,181,153,0.14)',
            brass: '#D3A465',
            brassSoft: 'rgba(211,164,101,0.16)',
            shadow: '0 18px 40px -18px rgba(0,0,0,0.55)',
            notch: '#14161B'
        }
    };

    const c = isDarkMode ? colors.dark : colors.light;

    const fontDisplay = "'Fraunces', 'Iowan Old Style', Georgia, serif";
    const fontBody = "'IBM Plex Sans', -apple-system, 'Segoe UI', sans-serif";
    const fontMono = "'IBM Plex Mono', 'SF Mono', monospace";

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
            maxWidth: '760px',
            margin: '0 auto',
            width: '100%',
            position: 'relative',
            zIndex: 1
        },
        headerSection: {
            marginBottom: '46px'
        },
        drawerLabel: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '7px 14px',
            border: `1px solid ${c.borderStrong}`,
            borderRadius: '3px',
            backgroundColor: c.surface,
            marginBottom: '22px'
        },
        drawerDot: {
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: c.accent,
            flexShrink: 0
        },
        drawerText: {
            fontFamily: fontMono,
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: c.inkSecondary,
            fontWeight: 500
        },
        title: {
            fontFamily: fontDisplay,
            color: c.ink,
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
            maxWidth: '480px',
            lineHeight: '1.65'
        },
        searchBox: {
            position: 'relative'
        },
        searchInput: {
            width: '100%',
            boxSizing: 'border-box',
            padding: '14px 18px 14px 44px',
            border: `1px solid ${c.border}`,
            borderRadius: '4px',
            backgroundColor: c.surface,
            color: c.ink,
            fontFamily: fontMono,
            fontSize: '0.92rem',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            outline: 'none'
        },
        searchInputFocus: {
            borderColor: c.accent,
            boxShadow: `0 0 0 3px ${c.accentSoft}`
        },
        searchIcon: {
            position: 'absolute',
            left: '17px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
        },
        faqContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        },
        faqItem: {
            backgroundColor: c.surface,
            borderRadius: '3px',
            border: `1px solid ${c.border}`,
            position: 'relative',
            transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
            opacity: 0,
            animation: 'cardIn 0.45s cubic-bezier(0.4,0,0.2,1) forwards'
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
            borderWidth: '0 16px 16px 0',
            borderColor: `transparent ${c.notch} transparent transparent`,
            filter: `drop-shadow(-1px 1px 0 ${c.border})`
        },
        faqQuestion: {
            padding: '20px 26px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px'
        },
        questionNumber: {
            fontFamily: fontMono,
            fontSize: '0.78rem',
            color: c.brass,
            fontWeight: 600,
            paddingTop: '3px',
            flexShrink: 0,
            minWidth: '38px'
        },
        questionText: {
            fontFamily: fontDisplay,
            color: c.ink,
            fontSize: '1.12rem',
            fontWeight: 500,
            margin: 0,
            flex: 1,
            lineHeight: '1.45',
            paddingRight: '10px'
        },
        chevronWrap: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            flexShrink: 0,
            marginTop: '3px'
        },
        faqAnswer: {
            maxHeight: 0,
            overflow: 'hidden',
            transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease',
            opacity: 0
        },
        faqAnswerOpen: {
            maxHeight: '600px',
            opacity: 1
        },
        answerInner: {
            padding: '0 26px 24px 80px',
            borderLeft: 'none'
        },
        answerText: {
            color: c.inkSecondary,
            fontSize: '0.96rem',
            lineHeight: '1.85',
            margin: 0,
            paddingLeft: '16px',
            borderLeft: `2px solid ${c.brassSoft}`
        },
        darkModeToggle: {
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            padding: '0',
            backgroundColor: c.surface,
            border: `1px solid ${c.borderStrong}`,
            borderRadius: '50%',
            color: c.ink,
            cursor: 'pointer',
            zIndex: 1000,
            transition: 'transform 0.2s ease, border-color 0.2s ease',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: c.shadow
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
            width: '30px',
            height: '30px',
            border: `2px solid ${c.border}`,
            borderTop: `2px solid ${c.accent}`,
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '18px'
        },
        stateBox: {
            textAlign: 'center',
            padding: '70px 20px',
            border: `1px dashed ${c.borderStrong}`,
            borderRadius: '4px',
            backgroundColor: c.surfaceAlt
        },
        stateTitle: {
            fontFamily: fontDisplay,
            color: c.ink,
            fontSize: '1.3rem',
            fontWeight: 600,
            margin: '18px 0 8px'
        },
        stateText: {
            color: c.inkSecondary,
            fontSize: '0.92rem'
        },
        stats: {
            fontFamily: fontMono,
            textAlign: 'center',
            color: c.inkSecondary,
            fontSize: '0.75rem',
            letterSpacing: '0.04em',
            marginTop: '20px',
            padding: '4px'
        }
    };

    return (
        <div style={styles.container}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@500;600&display=swap');

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes cardIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fq-toggle:hover { transform: rotate(-14deg); }
                .fq-question:hover .fq-question-text { text-decoration: underline; text-decoration-color: ${c.brass}; text-underline-offset: 4px; }
            `}</style>

            <button
                style={styles.darkModeToggle}
                onClick={toggleDarkMode}
                title="Toggle dark mode"
                aria-label="Toggle dark mode"
                className="fq-toggle"
            >
                {isDarkMode ? <IconSun color={c.ink} /> : <IconMoon color={c.ink} />}
            </button>

            <div style={styles.contentWrapper}>
                <div style={styles.headerSection}>
                   

                    <h1 style={styles.title}>Frequently Asked Questions</h1>
                    <p style={styles.subtitle}>
                        A short index of answers about the platform. Search by keyword or browse the full list below.
                    </p>

               
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
                    <div style={styles.faqContainer}>
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => {
                                const isActive = activeIndex === index;
                                return (
                                    <div
                                        key={faq.id || index}
                                        style={{
                                            ...styles.faqItem,
                                            ...(isActive && styles.faqItemActive),
                                            animationDelay: `${Math.min(index, 10) * 45}ms`
                                        }}
                                    >
                                        <div style={styles.cornerNotch}></div>
                                        <div
                                            style={styles.faqQuestion}
                                            className="fq-question"
                                            onClick={() => toggleFaq(index)}
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

                        {filteredFaqs.length > 0 && (
                            <div style={styles.stats}>
                                {String(filteredFaqs.length).padStart(2, '0')} / {String(faqs.length).padStart(2, '0')} entries shown
                                {searchTerm && ' · filtered'}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Faqpage;