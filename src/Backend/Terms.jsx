import React, { useEffect, useState } from 'react';


const brandColor = '#5e2e10';
const brandDark = '#3d1f0a';
const brandTint = '#f6eee9';

const COMPANY = 'Akashbari Hotels and Resorts Limited';
const POLICY_EMAIL = 'akashbariholtelandresorts@gmail.com'; // ⚠️ বানান মিলিয়ে নিন
const POLICY_PHONE = '+8801329737073';

/* ---------- Key Terms ---------- */
const KEY_TERMS = [
    { term: 'Due Date', meaning: 'The date your monthly instalment must be paid.' },
    { term: 'Grace Period', meaning: '7 calendar days after the Due Date.' },
    { term: 'Overdue', meaning: 'Any amount not paid after the Due Date.' },
    { term: 'Default', meaning: '3 consecutive missed monthly instalments.' },
    { term: 'Suspension', meaning: 'Temporary blocking of booking/usage benefits due to overdue payment.' },
    { term: 'Termination', meaning: 'Cancellation of the Agreement after "No Payment for 10 months" (see Section 4).' },
    { term: 'Saaf Kabla', meaning: 'A registered sale deed used in Bangladesh for transfer of property ownership.' },
];

/*
 * ---------- Policy sections ----------
 * **text** লিখলে সেই অংশ bold হবে
 * intro    = section এর শুরুর লাইন (ঐচ্ছিক)
 * clauses  = [number, text]
 * groups   = section এর ভেতরে ছোট ভাগ (Section 10 এর মতো)
 */
const SECTIONS = [
    {
        id: 'late-payment',
        title: 'Late Payment (One Simple Rule)',
        intro: 'If you do not pay within the **Grace Period**:',
        clauses: [
            ['1.1', 'Your account becomes **Overdue**.'],
            ['1.2', 'We may **Suspend** booking/usage benefits until all dues are cleared.'],
        ],
    },
    {
        id: 'default',
        title: 'Default and Reactivation',
        intro: 'If you miss **3 consecutive monthly instalments**, or miss **2 consecutive instalments which occurs 3 times** in the whole 36-month period:',
        clauses: [
            ['2.1', 'You are in **Default** and your account may be treated as "Suspended" and will need to be reactivated.'],
            ['2.2', 'To reactivate, you must clear all overdue instalments and an additional **10% of the total due deposit amount** in full. This 10% is the **Reactivation Fee**.'],
            ['2.3', 'Partial payment does **not** reactivate the account.'],
        ],
    },
    {
        id: 'notice',
        title: 'Formal Notice Before Termination',
        intro: 'When you enter Default (3 missed instalments), we will send a **Formal Default Notice**:',
        clauses: [
            ['3.1', 'Sent by registered post/courier to your address and by email (extra notice).'],
            ['3.2', 'The notice will state your total overdue amount and a final payment deadline.'],
            ['3.3', 'You will have **at least 45 days** to clear all dues (the "**Cure Period**").'],
        ],
    },
    {
        id: 'termination',
        title: 'Termination for No Payment for 10 Months',
        intro: 'If you make **no payments for 10 months** from your last payment date (or from the first missed Due Date, whichever is later), we may Terminate the Agreement.',
        clauses: [
            ['4.1', 'Termination may occur only after the Cure Period in the Default Notice has ended without full payment, as lack of interest in continuing business.'],
            ['4.2', 'On Termination, all bookings/benefits stop immediately, and access credentials are deactivated.'],
            ['4.3', 'You have no right to occupy or take physical possession of any property; access is only through Company-approved booking/check-in systems.'],
        ],
    },
    {
        id: 'settlement',
        title: 'Termination Settlement',
        intro: 'If we Terminate due to "No Payment for 10 months":',
        clauses: [
            ['5.1', 'We will deduct **Tk. 50,000 or the total deposited amount, whichever is lower**, as forfeiture (administrative recovery / liquidated damages).'],
            ['5.2', '**Safeguard:** the forfeiture cannot exceed the total amount you have actually paid to us.'],
            ['5.3', 'We will return the remaining paid amount (if any), after deducting the forfeiture amount (as capped above).'],
            ['5.4', 'Refund timing after Termination: **within 90 days** of the Termination Notice, by account-payee bank transfer/cheque only.'],
            ['5.5', 'We will provide a **Settlement Statement** (paid-to-date, deductions, net refund).'],
        ],
    },
    {
        id: 'customer-refund',
        title: 'Customer-Initiated Refunds',
        intro: 'If the customer account is not, and has never been, Overdue/Default/Suspended, the customer may apply for a refund as follows:',
        clauses: [
            ['6.1', 'You must email the official email: {EMAIL}'],
            ['6.2', 'The email must include: **Agreement/Booking ID, buyer\'s name & NID/passport, payment proofs, reason, and bank details**.'],
        ],
    },
    {
        id: 'refund-settlement',
        title: 'Refund Settlement',
        clauses: [
            ['7.1', 'Refunds will be processed **within 30 days** after approval.'],
            ['7.2', 'A **10% administrative fee** will be deducted from all customer-initiated refunds.'],
            ['7.3', 'Bank/MFS charges may be deducted if applicable.'],
        ],
    },
    {
        id: 'hardship',
        title: 'Hardship (Inability to Pay)',
        intro: 'If you are temporarily unable to pay, you may request a **Hardship Plan** by email **before** termination. If approved (at our discretion), we may provide the following:',
        clauses: [
            ['8.1', 'Payment pause **up to 90 days**; OR'],
            ['8.2', 'Reschedule instalments (extend tenure **up to 6 months**).'],
            ['8.3', 'While on a Hardship Plan, we may keep booking restricted until payments normalize.'],
        ],
    },
    {
        id: 'death-disability',
        title: 'Death or Permanent Disability',
        clauses: [
            ['9.1', '**Death:** nominee/legal heir may apply to continue or transfer the Agreement by submitting the required documents (see clause 6.2).'],
            ['9.2', '**Permanent disability/critical illness:** upon proof, we may offer rescheduling or allow cancellation under customer-initiated refund rules.'],
        ],
    },
    {
        id: 'transfer',
        title: 'Transfer / Resale (Including "Saaf Kabla")',
        groups: [
            {
                number: '10.1',
                title: 'Transfer while instalments are ongoing',
                clauses: [
                    ['10.1.1', 'Allowed only with our written approval and only if your account is up to date (not Overdue/Default/Suspended).'],
                    ['10.1.2', 'Transferee must pass **KYC (Know Your Customer)** and sign acceptance of the Agreement.'],
                    ['10.1.3', 'Transfer fee: **5%** (if applicable).'],
                ],
            },
            {
                number: '10.2',
                title: 'Transfer after full payment (only if your product structure includes title transfer)',
                clauses: [
                    ['10.2.1', 'Any **Saaf Kabla** (registered deed) will be executed only after full payment and completion of required legal steps.'],
                    ['10.2.2', 'After deed transfer, any further resale may require a fresh Saaf Kabla (subsequent deed) as per law.'],
                ],
            },
        ],
    },
    {
        id: 'notices',
        title: 'Notices',
        clauses: [
            ['11.1', 'We may send reminders by SMS/WhatsApp/email; formal notices will be sent by registered post/courier plus email.'],
            ['11.2', 'You must keep your address, email, and phone updated.'],
        ],
    },
    {
        id: 'disputes',
        title: 'Disputes',
        clauses: [
            ['12.1', '**First step:** written complaint to our official email; we try to resolve within **15 business days**.'],
            ['12.2', 'If unresolved: arbitration under the **Arbitration Act, 2001** (seat: Dhaka), unless mandatory law requires otherwise.'],
        ],
    },
];

/* **bold** আর {EMAIL} কে আসল element এ রূপান্তর */
const RichText = ({ text }) => {
    const parts = text.split(/(\*\*.+?\*\*|\{EMAIL\})/g).filter(Boolean);
    return parts.map((part, i) => {
        if (part === '{EMAIL}') {
            return (
                <a key={i} href={`mailto:${POLICY_EMAIL}`} className="tp-link">
                    {POLICY_EMAIL}
                </a>
            );
        }
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
    });
};

const ClauseList = ({ clauses }) => (
    <ol className="tp-clauses">
        {clauses.map(([num, text]) => (
            <li key={num}>
                <span className="tp-clause-num">{num}</span>
                <span className="tp-clause-text"><RichText text={text} /></span>
            </li>
        ))}
    </ol>
);

const Terms = () => {
    const [activeId, setActiveId] = useState('key-terms');

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    // Scroll করার সময় কোন section পড়া হচ্ছে, সূচিপত্রে সেটা হাইলাইট
    useEffect(() => {
        const ids = ['key-terms', ...SECTIONS.map((s) => s.id)];
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible[0]) setActiveId(visible[0].target.id);
            },
            { rootMargin: '-120px 0px -60% 0px', threshold: 0 }
        );
        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    const goTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <>
           

            <main className="tp-page">
                {/* ---------- Banner ---------- */}
                <section className="tp-hero">
                    <div className="container">
                        <span className="tp-eyebrow">Terms &amp; Conditions</span>
                        <h1>Refund and Payment Policy</h1>
                        <span className="tp-hero-line" />
                        <p>{COMPANY}</p>
                    </div>
                </section>

                {/* ---------- Mobile: section chips ---------- */}
                <nav className="tp-chips tp-no-print" aria-label="Policy sections">
                    <button type="button" className={activeId === 'key-terms' ? 'active' : ''} onClick={() => goTo('key-terms')}>
                        Key Terms
                    </button>
                    {SECTIONS.map((s, i) => (
                        <button
                            key={s.id}
                            type="button"
                            className={activeId === s.id ? 'active' : ''}
                            onClick={() => goTo(s.id)}
                        >
                            {i + 1}. {s.title.split(' (')[0]}
                        </button>
                    ))}
                </nav>

                <div className="container tp-wrap">
                    <div className="tp-layout">
                        {/* ---------- Desktop: সূচিপত্র ---------- */}
                        <aside className="tp-toc tp-no-print">
                            <h6>On this page</h6>
                            <ul>
                                <li>
                                    <button type="button" className={activeId === 'key-terms' ? 'active' : ''} onClick={() => goTo('key-terms')}>
                                        <span className="tp-toc-num">—</span> Key Terms
                                    </button>
                                </li>
                                {SECTIONS.map((s, i) => (
                                    <li key={s.id}>
                                        <button type="button" className={activeId === s.id ? 'active' : ''} onClick={() => goTo(s.id)}>
                                            <span className="tp-toc-num">{String(i + 1).padStart(2, '0')}</span>
                                            {s.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                          
                        </aside>

                        {/* ---------- Content ---------- */}
                        <div className="tp-content">
                            {/* Key Terms */}
                            <section id="key-terms" className="tp-card tp-anchor">
                                <div className="tp-card-head">
                                    <span className="tp-badge"><i className="bi bi-book"></i></span>
                                    <div>
                                        <span className="tp-kicker">Plain meaning</span>
                                        <h2>Key Terms</h2>
                                    </div>
                                </div>

                                <div className="tp-terms">
                                    {KEY_TERMS.map((t) => (
                                        <div key={t.term} className="tp-term">
                                            <dt>{t.term}</dt>
                                            <dd>{t.meaning}</dd>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Sections */}
                            {SECTIONS.map((s, i) => (
                                <section key={s.id} id={s.id} className="tp-card tp-anchor">
                                    <div className="tp-card-head">
                                        <span className="tp-badge">{i + 1}</span>
                                        <div>
                                            <span className="tp-kicker">Section {i + 1}</span>
                                            <h2>{s.title}</h2>
                                        </div>
                                    </div>

                                    {s.intro && (
                                        <p className="tp-intro"><RichText text={s.intro} /></p>
                                    )}

                                    {s.clauses && <ClauseList clauses={s.clauses} />}

                                    {s.groups?.map((g) => (
                                        <div key={g.number} className="tp-group">
                                            <h3>
                                                <span>{g.number}</span> {g.title}
                                            </h3>
                                            <ClauseList clauses={g.clauses} />
                                        </div>
                                    ))}
                                </section>
                            ))}

                            {/* Contact */}
                            <div className="tp-contact">
                                <div>
                                    <h3>Questions about this policy?</h3>
                                    <p>Write to us and our team will respond within 15 business days.</p>
                                </div>
                                <div className="tp-contact-actions">
                                    <a href={`mailto:${POLICY_EMAIL}`} className="tp-btn tp-btn-light">
                                        <i className="bi bi-envelope me-2"></i>Email us
                                    </a>
                                    <a href={`tel:${POLICY_PHONE}`} className="tp-btn tp-btn-outline">
                                        <i className="bi bi-telephone me-2"></i>{POLICY_PHONE}
                                    </a>
                                </div>
                            </div>

                          
                        </div>
                    </div>
                </div>
            </main>

       

            <style>{`
                .tp-page {
                    background: ${brandTint};
                    color: #2b2b2b;
                }

                /* ---------- Hero ---------- */
                .tp-hero {
                    background: ${brandColor};
                    color: #fff;
                    text-align: center;
                    padding: 70px 0 64px;
                }
                .tp-eyebrow {
                    display: inline-block;
                    font-size: 0.5rem;
                    letter-spacing: 0.28em;
                    text-transform: uppercase;
                    opacity: 0.85;
                }
                .tp-hero h1 {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: clamp(1.2rem, 4.5vw, 3rem);
                    font-weight: 500;
                    margin: 10px 0 0;
                }
                .tp-hero-line {
                    display: block;
                    width: 64px;
                    height: 3px;
                    background: #fff;
                    margin: 18px auto 14px;
                }
                .tp-hero p { margin: 0; opacity: 0.85; font-size: 0.95rem; }

                /* ---------- Layout ---------- */
                .tp-wrap { padding-top: 40px; padding-bottom: 70px; }
                .tp-layout {
                    display: grid;
                    grid-template-columns: 270px 1fr;
                    gap: 32px;
                    align-items: start;
                }

                /* ---------- TOC (desktop) ---------- */
                .tp-toc {
                    position: sticky;
                    top: 100px;
                    background: #fff;
                    border: 1px solid ${brandColor}1f;
                    border-radius: 16px;
                    padding: 20px 14px;
                    max-height: calc(100vh - 130px);
                    overflow-y: auto;
                }
                .tp-toc h6 {
                    font-size: 0.5rem;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #8a7b70;
                    margin: 0 8px 12px;
                }
                .tp-toc ul { list-style: none; margin: 0; padding: 0; }
                .tp-toc button {
                    display: flex;
                    gap: 10px;
                    width: 100%;
                    text-align: left;
                    background: transparent;
                    border: none;
                    border-radius: 8px;
                    padding: 8px 10px;
                    font-size: 0.84rem;
                    line-height: 1.4;
                    color: #4a4a4a;
                    cursor: pointer;
                    transition: background 0.2s ease, color 0.2s ease;
                }
                .tp-toc button:hover { background: ${brandTint}; color: ${brandColor}; }
                .tp-toc button.active {
                    background: ${brandColor};
                    color: #fff;
                }
                .tp-toc-num {
                    font-weight: 700;
                    font-size: 0.75rem;
                    opacity: 0.7;
                    min-width: 18px;
                    padding-top: 1px;
                }

                .tp-print-btn {
                    width: 100%;
                    margin-top: 14px;
                    padding: 10px;
                    border-radius: 999px;
                    border: 1px solid ${brandColor};
                    background: transparent;
                    color: ${brandColor};
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .tp-print-btn:hover { background: ${brandColor}; color: #fff; }
                .tp-print-mobile { display: none; }

                /* ---------- Chips (mobile) ---------- */
                .tp-chips { display: none; }

                /* ---------- Cards ---------- */
                .tp-content { min-width: 0; }
                .tp-card {
                    background: #fff;
                    border: 1px solid ${brandColor}1a;
                    border-radius: 18px;
                    padding: 28px 30px;
                    margin-bottom: 18px;
                    box-shadow: 0 6px 20px rgba(94, 46, 16, 0.05);
                }
                .tp-anchor { scroll-margin-top: 100px; }

                .tp-card-head {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 18px;
                }
                .tp-badge {
                    width: 46px;
                    height: 46px;
                    flex-shrink: 0;
                    border-radius: 12px;
                    background: ${brandColor};
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 1.25rem;
                    font-weight: 700;
                }
                .tp-kicker {
                    display: block;
                    font-size: 0.68rem;
                    font-weight: 700;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                    color: ${brandColor};
                    opacity: 0.75;
                }
                .tp-card h2 {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 1.35rem;
                    font-weight: 600;
                    color: #222;
                    margin: 2px 0 0;
                }

                .tp-intro {
                    background: ${brandTint};
                    border-left: 3px solid ${brandColor};
                    border-radius: 0 10px 10px 0;
                    padding: 12px 16px;
                    margin: 0 0 14px;
                    font-size: 0.96rem;
                    line-height: 1.7;
                    color: #3d3d3d;
                }

                /* Clauses */
                .tp-clauses { list-style: none; margin: 0; padding: 0; }
                .tp-clauses li {
                    display: flex;
                    gap: 14px;
                    padding: 12px 0;
                    border-bottom: 1px dashed ${brandColor}26;
                    font-size: 0.96rem;
                    line-height: 1.75;
                    color: #444;
                }
                .tp-clauses li:last-child { border-bottom: none; padding-bottom: 0; }
                .tp-clause-num {
                    flex-shrink: 0;
                    min-width: 52px;
                    font-weight: 700;
                    font-size: 0.82rem;
                    color: ${brandColor};
                    padding-top: 2px;
                }
                .tp-clause-text { min-width: 0; overflow-wrap: anywhere; }
                .tp-clauses strong, .tp-intro strong { color: #222; font-weight: 600; }

                .tp-link {
                    color: ${brandColor};
                    font-weight: 600;
                    text-decoration: underline;
                    text-underline-offset: 3px;
                    word-break: break-all;
                }

                /* Sub groups (Section 10) */
                .tp-group + .tp-group { margin-top: 20px; }
                .tp-group h3 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #222;
                    margin: 0 0 4px;
                    padding: 10px 14px;
                    background: ${brandTint};
                    border-radius: 10px;
                }
                .tp-group h3 span { color: ${brandColor}; margin-right: 6px; }

                /* Key terms */
                .tp-terms {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                    margin: 0;
                }
                .tp-term {
                    border: 1px solid ${brandColor}1f;
                    border-radius: 12px;
                    padding: 14px 16px;
                    background: #fffdfb;
                    transition: border-color 0.2s ease, transform 0.2s ease;
                }
                .tp-term:hover { border-color: ${brandColor}; transform: translateY(-2px); }
                .tp-term dt {
                    font-size: 0.92rem;
                    font-weight: 700;
                    color: ${brandColor};
                    margin-bottom: 4px;
                }
                .tp-term dd {
                    margin: 0;
                    font-size: 0.9rem;
                    line-height: 1.6;
                    color: #555;
                }

                /* Contact */
                .tp-contact {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 18px;
                    background: ${brandDark};
                    color: #fff;
                    border-radius: 18px;
                    padding: 26px 30px;
                    margin-top: 8px;
                }
                .tp-contact h3 {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 1.3rem;
                    margin: 0 0 4px;
                }
                .tp-contact p { margin: 0; opacity: 0.8; font-size: 0.9rem; }
                .tp-contact-actions { display: flex; flex-wrap: wrap; gap: 10px; }

                .tp-btn {
                    display: inline-flex;
                    align-items: center;
                    padding: 10px 20px;
                    border-radius: 999px;
                    font-size: 0.88rem;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }
                .tp-btn-light { background: #fff; color: ${brandColor}; }
                .tp-btn-light:hover { background: ${brandTint}; color: ${brandColor}; }
                .tp-btn-outline { border: 1px solid rgba(255,255,255,0.5); color: #fff; }
                .tp-btn-outline:hover { background: rgba(255,255,255,0.1); color: #fff; }

                /* ---------- Tablet ---------- */
                @media (max-width: 991px) {
                    .tp-layout { grid-template-columns: 1fr; }
                    .tp-toc { display: none; }
                    .tp-print-mobile { display: block; }

                    .tp-chips {
                        display: flex;
                        gap: 8px;
                        overflow-x: auto;
                        padding: 12px 16px;
                        position: sticky;
                        top: 0;
                        z-index: 5;
                        background: ${brandTint};
                        border-bottom: 1px solid ${brandColor}1f;
                        scrollbar-width: none;
                    }
                    .tp-chips::-webkit-scrollbar { display: none; }
                    .tp-chips button {
                        flex-shrink: 0;
                        padding: 7px 14px;
                        border-radius: 999px;
                        border: 1px solid ${brandColor}40;
                        background: #fff;
                        color: ${brandColor};
                        font-size: 0.8rem;
                        font-weight: 600;
                        white-space: nowrap;
                        cursor: pointer;
                    }
                    .tp-chips button.active { background: ${brandColor}; color: #fff; border-color: ${brandColor}; }

                    .tp-anchor { scroll-margin-top: 130px; }
                }

                /* ---------- Mobile ---------- */
                @media (max-width: 576px) {
                    .tp-hero { padding: 50px 0 44px; }
                    .tp-wrap { padding-top: 22px; padding-bottom: 48px; }
                    .tp-card { padding: 22px 18px; border-radius: 14px; }
                    .tp-card-head { gap: 12px; }
                    .tp-badge { width: 40px; height: 40px; font-size: 1.1rem; }
                    .tp-card h2 { font-size: 1.15rem; }
                    .tp-terms { grid-template-columns: 1fr; }
                    .tp-clauses li { gap: 10px; font-size: 0.93rem; }
                    .tp-clause-num { min-width: 44px; }
                    .tp-contact { padding: 22px 20px; }
                    .tp-contact-actions, .tp-contact-actions .tp-btn { width: 100%; justify-content: center; }
                }

                /* ---------- Print ---------- */
                @media print {
                    .tp-no-print, .tp-print-btn, .tp-contact-actions { display: none !important; }
                    .tp-page { background: #fff; }
                    .tp-hero { background: #fff; color: #000; padding: 0 0 16px; border-bottom: 2px solid #000; }
                    .tp-hero-line { background: #000; }
                    .tp-layout { grid-template-columns: 1fr; }
                    .tp-card, .tp-contact {
                        box-shadow: none;
                        border: 1px solid #ccc;
                        break-inside: avoid;
                        background: #fff;
                        color: #000;
                    }
                    .tp-badge { background: #000; }
                }
            `}</style>
        </>
    );
};

export default Terms;