// import React from 'react';

// const Terms = () => {
//   const brandColor = "#5e2e10";

//   return (
//     <div className="bg-light min-vh-100 py-md-5">
//       {/* maxWidth কে ৯০০ থেকে বাড়িয়ে ১১০০ করা হয়েছে */}
//       <div className="container-fluid shadow-lg bg-white p-0 rounded-3 overflow-hidden" style={{ maxWidth: '1275px' }}>
        
//         {/* Header Section */}
//         <div style={{ backgroundColor: brandColor }} className="text-white p-5 pb-4">
//           <div className="border-top border-white-50 pt-4 mt-2">
//             <h1 className="display-3 fw-bold mb-0">Terms And Conditions Contract</h1>
//           </div>

//           <div className="border-top border-white-50 mt-5 pt-3 d-flex flex-wrap justify-content-between small opacity-75">
//             <span>🌐 www.techchainstrategies.com</span>
//             <span>📷 @techchain_strategies</span>
//             <span>📞 210-788-8829</span>
//           </div>
//         </div>

//         {/* Content Section */}
//         <div className="p-5">
          
//           {/* Section 1 */}
//           <div className="mb-5">
//             <h5 className="fw-bold d-flex align-items-center mb-3" style={{ color: brandColor }}>
//               <span className="rounded-circle me-2" style={{ width: '15px', height: '15px', backgroundColor: brandColor }}></span>
//               The Agreement
//             </h5>
//             <hr className="mb-4" />
//             <p className="text-dark opacity-75 lh-base">
//               This Service Agreement ("Contract") is made and entered into as of <strong>September 1, 2028</strong>, 
//               by and between <strong>TechChain Strategies</strong> ("Service Provider") and <strong>Samantha Rachel</strong> 
//               ("Client"). By engaging the services of TechChain Strategies, the Client agrees to be bound by the terms 
//               and conditions outlined in this Agreement.
//             </p>
//           </div>

//           {/* Section 2 */}
//           <div className="mb-5">
//             <h5 className="fw-bold d-flex align-items-center mb-3" style={{ color: brandColor }}>
//               <span className="rounded-circle me-2" style={{ width: '15px', height: '15px', backgroundColor: brandColor }}></span>
//               User Obligations
//             </h5>
//             <hr className="mb-4" />
//             <ul className="list-unstyled ps-4">
//               <li className="mb-2">
//                 <strong>• Accurate Information:</strong> The Client must provide correct information.
//               </li>
//               <li className="mb-2">
//                 <strong>• Compliance:</strong> The Client must follow laws and regulations.
//               </li>
//               <li className="mb-2">
//                 <strong>• Use of Services:</strong> The Client will use TechChain Strategies' services only for lawful purposes and as outlined in this Agreement.
//               </li>
//             </ul>
//           </div>

//           {/* Section 3 */}
//           <div className="mb-5">
//             <h5 className="fw-bold d-flex align-items-center mb-3" style={{ color: brandColor }}>
//               <span className="rounded-circle me-2" style={{ width: '15px', height: '15px', backgroundColor: brandColor }}></span>
//               Product/Service Details
//             </h5>
//             <hr className="mb-4" />
//             <p className="mb-3 opacity-75">TechChain Strategies offers the following services:</p>
//             <ul className="list-unstyled ps-4">
//               <li className="mb-1">• IT consulting</li>
//               <li className="mb-1">• Software development</li>
//               <li className="mb-1">• Cybersecurity solutions</li>
//               <li className="mb-1">• Technical support</li>
//               <li className="mb-1">• Custom IT solutions</li>
//             </ul>
//           </div>

//           {/* Page Number */}
//           <div className="text-end mt-5 pt-5 text-muted">
//             <small>1</small>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Terms;

import React from 'react';

/* ---------- wax-seal monogram (signature element) ---------- */
const SealMark = ({ ink, seal, initials = 'TCS' }) => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="36" cy="36" r="34" stroke={seal} strokeWidth="1.2" />
    <circle cx="36" cy="36" r="28" stroke={seal} strokeWidth="1.2" strokeDasharray="1.5 3.5" />
    <text
      x="36" y="42" textAnchor="middle"
      fontFamily="'Source Serif 4', Georgia, serif"
      fontSize="17" fontWeight="600" letterSpacing="1"
      fill={ink}
    >
      {initials}
    </text>
  </svg>
);

const Terms = () => {
  /* ---------- design tokens: "notarized letterhead" ---------- */
  const paper = '#EFE7D6';
  const paperAlt = '#F7F2E6';
  const ink = '#3A2A1C';
  const inkSoft = '#7A6A56';
  const rule = '#D8CBAE';
  const seal = '#7A2E22';
  const sealSoft = 'rgba(122,46,34,0.08)';

  const fontDisplay = "'Source Serif 4', 'Iowan Old Style', Georgia, serif";
  const fontMono = "'IBM Plex Mono', 'SF Mono', monospace";

  const styles = {
    page: {
      backgroundColor: '#DDD4BE',
      backgroundImage: `radial-gradient(${rule} 0.6px, transparent 0.6px)`,
      backgroundSize: '18px 18px',
      minHeight: '100vh',
      padding: '64px 20px',
      fontFamily: fontDisplay,
      color: ink,
      display: 'flex',
      justifyContent: 'center'
    },
    sheet: {
      backgroundColor: paper,
      maxWidth: '860px',
      width: '100%',
      boxShadow: '0 30px 60px -25px rgba(58,42,28,0.45)',
      border: `1px solid ${rule}`,
      position: 'relative'
    },
    innerBorder: {
      position: 'absolute',
      inset: '10px',
      border: `1px solid ${rule}`,
      pointerEvents: 'none'
    },
    letterhead: {
      padding: '44px 56px 30px'
    },
    letterheadTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '20px',
      flexWrap: 'wrap'
    },
    wordmark: {
      fontSize: '1.15rem',
      fontWeight: 700,
      letterSpacing: '0.02em',
      margin: 0
    },
    wordmarkSub: {
      fontFamily: fontMono,
      fontSize: '0.68rem',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: inkSoft,
      marginTop: '4px'
    },
    contactBlock: {
      fontFamily: fontMono,
      fontSize: '0.72rem',
      color: inkSoft,
      textAlign: 'right',
      lineHeight: 1.9
    },
    hr: {
      border: 'none',
      borderTop: `1px solid ${rule}`,
      margin: '26px 0'
    },
    titleRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '22px'
    },
    titleBlock: {
      flex: 1
    },
    eyebrow: {
      fontFamily: fontMono,
      fontSize: '0.7rem',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: seal,
      marginBottom: '8px'
    },
    title: {
      fontSize: '2.1rem',
      fontWeight: 600,
      margin: 0,
      lineHeight: 1.15,
      letterSpacing: '-0.01em'
    },
    refLine: {
      fontFamily: fontMono,
      fontSize: '0.72rem',
      color: inkSoft,
      marginTop: '14px',
      letterSpacing: '0.03em'
    },
    body: {
      padding: '10px 56px 8px'
    },
    section: {
      marginBottom: '38px'
    },
    sectionHead: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '14px',
      marginBottom: '6px'
    },
    articleTag: {
      fontFamily: fontMono,
      fontSize: '0.72rem',
      color: seal,
      letterSpacing: '0.08em',
      fontWeight: 600,
      whiteSpace: 'nowrap'
    },
    sectionTitle: {
      fontSize: '1.15rem',
      fontWeight: 600,
      margin: 0
    },
    sectionRule: {
      height: '1px',
      backgroundColor: rule,
      marginBottom: '16px'
    },
    para: {
      color: '#4A3826',
      fontSize: '1rem',
      lineHeight: 1.85,
      margin: 0,
      textAlign: 'justify'
    },
    dropCap: {
      float: 'left',
      fontFamily: fontDisplay,
      fontSize: '3.4rem',
      lineHeight: '0.78',
      fontWeight: 600,
      color: seal,
      padding: '4px 8px 0 0'
    },
    clauseList: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    },
    clauseItem: {
      display: 'flex',
      gap: '12px',
      padding: '10px 0',
      borderBottom: `1px solid ${rule}`,
      fontSize: '0.97rem',
      lineHeight: 1.7,
      color: '#4A3826'
    },
    clauseMark: {
      fontFamily: fontMono,
      color: seal,
      fontSize: '0.8rem',
      flexShrink: 0,
      paddingTop: '2px'
    },
    clauseLabel: {
      fontWeight: 600,
      color: ink
    },
    serviceRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '9px 0',
      fontSize: '0.97rem',
      color: '#4A3826'
    },
    serviceDot: {
      width: '5px',
      height: '5px',
      backgroundColor: seal,
      flexShrink: 0
    },
    intro: {
      color: inkSoft,
      fontSize: '0.95rem',
      marginBottom: '14px'
    },
    signBlock: {
      marginTop: '20px',
      padding: '36px 56px 10px',
      display: 'flex',
      gap: '48px',
      flexWrap: 'wrap'
    },
    signCol: {
      flex: '1 1 220px'
    },
    signLine: {
      borderTop: `1px solid ${ink}`,
      marginTop: '46px',
      paddingTop: '8px'
    },
    signName: {
      fontWeight: 600,
      fontSize: '0.95rem'
    },
    signRole: {
      fontFamily: fontMono,
      fontSize: '0.68rem',
      color: inkSoft,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginTop: '3px'
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '22px 56px 40px',
      fontFamily: fontMono,
      fontSize: '0.7rem',
      color: inkSoft,
      letterSpacing: '0.04em'
    }
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&family=IBM+Plex+Mono:wght@500;600&display=swap');
      `}</style>

      <div style={styles.sheet}>
        <div style={styles.innerBorder}></div>

        {/* Letterhead */}
        <div style={styles.letterhead}>
          <div style={styles.letterheadTop}>
            <div>
              <p style={styles.wordmark}>TechChain Strategies</p>
              <div style={styles.wordmarkSub}>IT Consulting &amp; Software Development</div>
            </div>
            <div style={styles.contactBlock}>
              www.techchainstrategies.com<br />
              @techchain_strategies<br />
              210-788-8829
            </div>
          </div>

          <hr style={styles.hr} />

          <div style={styles.titleRow}>
            <SealMark ink={ink} seal={seal} />
            <div style={styles.titleBlock}>
              <div style={styles.eyebrow}>Service Agreement</div>
              <h1 style={styles.title}>Terms &amp; Conditions Contract</h1>
              <div style={styles.refLine}>
                REF. TCS&#8209;2028&#8209;0091 &nbsp;&middot;&nbsp; EXECUTED 01 SEP 2028 &nbsp;&middot;&nbsp; PROVIDER: TECHCHAIN STRATEGIES &nbsp;&middot;&nbsp; CLIENT: SAMANTHA RACHEL
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={styles.body}>

          {/* Article I */}
          <div style={styles.section}>
            <div style={styles.sectionHead}>
              <span style={styles.articleTag}>ARTICLE I</span>
              <h5 style={styles.sectionTitle}>The Agreement</h5>
            </div>
            <div style={styles.sectionRule}></div>
            <p style={styles.para}>
              <span style={styles.dropCap}>T</span>
              his Service Agreement (&ldquo;Contract&rdquo;) is made and entered into as of <strong>September 1, 2028</strong>,
              by and between <strong>TechChain Strategies</strong> (&ldquo;Service Provider&rdquo;) and <strong>Samantha
              Rachel</strong> (&ldquo;Client&rdquo;). By engaging the services of TechChain Strategies, the Client agrees
              to be bound by the terms and conditions outlined in this Agreement.
            </p>
          </div>

          {/* Article II */}
          <div style={styles.section}>
            <div style={styles.sectionHead}>
              <span style={styles.articleTag}>ARTICLE II</span>
              <h5 style={styles.sectionTitle}>User Obligations</h5>
            </div>
            <div style={styles.sectionRule}></div>
            <ul style={styles.clauseList}>
              <li style={styles.clauseItem}>
                <span style={styles.clauseMark}>2.1</span>
                <span><span style={styles.clauseLabel}>Accurate Information — </span>The Client must provide correct information.</span>
              </li>
              <li style={styles.clauseItem}>
                <span style={styles.clauseMark}>2.2</span>
                <span><span style={styles.clauseLabel}>Compliance — </span>The Client must follow laws and regulations.</span>
              </li>
              <li style={{ ...styles.clauseItem, borderBottom: 'none' }}>
                <span style={styles.clauseMark}>2.3</span>
                <span><span style={styles.clauseLabel}>Use of Services — </span>The Client will use TechChain Strategies&rsquo; services only for lawful purposes and as outlined in this Agreement.</span>
              </li>
            </ul>
          </div>

          {/* Article III */}
          <div style={styles.section}>
            <div style={styles.sectionHead}>
              <span style={styles.articleTag}>ARTICLE III</span>
              <h5 style={styles.sectionTitle}>Product / Service Details</h5>
            </div>
            <div style={styles.sectionRule}></div>
            <p style={styles.intro}>TechChain Strategies offers the following services:</p>
            <div>
              {['IT consulting', 'Software development', 'Cybersecurity solutions', 'Technical support', 'Custom IT solutions'].map((s) => (
                <div style={styles.serviceRow} key={s}>
                  <span style={styles.serviceDot}></span>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Signature block */}
        <div style={styles.signBlock}>
          <div style={styles.signCol}>
            <div style={styles.signLine}>
              <div style={styles.signName}>TechChain Strategies</div>
              <div style={styles.signRole}>Service Provider · Sep 01, 2028</div>
            </div>
          </div>
          <div style={styles.signCol}>
            <div style={styles.signLine}>
              <div style={styles.signName}>Samantha Rachel</div>
              <div style={styles.signRole}>Client · Sep 01, 2028</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <span>TCS&#8209;2028&#8209;0091</span>
          <span>PAGE 1</span>
        </div>
      </div>
    </div>
  );
};

export default Terms;