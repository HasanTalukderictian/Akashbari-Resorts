import React from 'react';
import { FiMapPin, FiPhone } from 'react-icons/fi';

const brandColor = '#5e2e10';
const brandDark = '#3d1f0a';

// ---------- অফিসের তথ্য (এখানে যোগ / বদল করুন) ----------
const OFFICES = [
  {
    area: 'Banani',
    name: 'Head Office',
    isMain: true,
    address: 'House 43, Road 7, Block G, Banani, Dhaka 1213',
    phone: '+8801329737073',
  },
  {
    area: 'Dhanmondi',
    name: 'Dhanmondi Branch',
    address: 'Sultana Tower, Level 7, 2 Mirpur Road, Kalabagan, Dhanmondi',
    phone: '+8801329726779',
  },
  {
    area: 'Mirpur',
    name: 'Mirpur Branch',
    address: 'Level 5, Commercial Plot No. 16, Main Road No. 01, Senpara Parbata, Section 10, Mirpur, Dhaka 1216',
    phone: '+8801313766365',
  },
  {
    area: 'Uttara',
    name: 'Uttara Branch',
    address: 'Shareef Auckland Center, House 11 (Level 7), Road 6, Sector 4, Jashim Uddin Road, Uttara, Dhaka 1230',
    phone: '+8801613212135',
  },
  {
    area: 'Sylhet',
    name: 'Sylhet Branch',
    address: 'Niloy/15 (3rd floor), Raj Mansion, 3rd Floor, Chowhatta, Sylhet (Old US-Bangla Office / LG Showroom Building)',
    phone: '+8801613212137',
  },
];

const mapLink = (address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

const OfficeCard = ({ office, index }) => (
  <div className="of-card">
    <div className="of-card-top">
      <a
        href={mapLink(office.address)}
        target="_blank"
        rel="noopener noreferrer"
        className="of-icon"
        aria-label={`${office.name} on Google Maps`}
        title="View on map"
      >
        <FiMapPin />
      </a>
      <span className="of-number">{String(index + 1).padStart(2, '0')}</span>
    </div>

    <span className="of-area">{office.area}</span>

    <h3 className="of-name">
      {office.name}
      {office.isMain && <span className="of-badge">Main</span>}
    </h3>

    <p className="of-address">{office.address}</p>

    <div className="of-divider" />

    <a href={`tel:${office.phone}`} className="of-phone">
      <FiPhone />
      {office.phone}
    </a>
  </div>
);

const Offices = () => (
  <section className="of-section">
    <div className="container">
      <div className="of-header">
        <h2 className="of-title">
          Offices Across
          <br />
          Bangladesh
        </h2>
        <span className="of-line" />
        <p className="of-subtitle">
          With offices strategically located across Dhaka and Sylhet, we're always close by to serve you better.
        </p>
      </div>

      <div className="of-grid">
        {OFFICES.map((office, i) => (
          <OfficeCard key={office.name} office={office} index={i} />
        ))}
      </div>
    </div>

    <style>{`
      .of-section {
        background: #fffaf0;
        padding: 80px 0;
      }

      /* ---------- Header ---------- */
      .of-header {
        text-align: center;
        max-width: 720px;
        margin: 0 auto 50px;
      }
      .of-title {
        font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
        font-size: 2rem;
        font-weight: 400;
        line-height: 1.15;
        text-transform: uppercase;
        color: #292626;
        margin: 0;
      }
      .of-line {
        display: block;
        width: 76px;
        height: 3px;
        margin: 22px auto 20px;
        background: #292626;
      }
      .of-subtitle {
        color: #292626;
        font-size: 0.98rem;
        line-height: 1.6;
        margin: 0;
      }

      /* ---------- Grid: উপরে ২টা, নিচে ৩টা ---------- */
      .of-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 14px;
      }
      .of-card { grid-column: span 2; }
      .of-card:nth-child(1),
      .of-card:nth-child(2) { grid-column: span 3; }

      /* ---------- Card ---------- */
      .of-card {
        display: flex;
        flex-direction: column;
        background: #ffffff;
        border: 2px solid transparent;
        padding: 26px 26px 24px;
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
      }
      .of-card:hover {
        transform: translateY(-4px);
        border-color: ${brandColor};
        box-shadow: 0 16px 34px rgba(0, 0, 0, 0.35);
      }

      .of-card-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
      }
      .of-icon {
        width: 38px;
        height: 38px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: ${brandColor};
        color: #ffffff;
        font-size: 16px;
        text-decoration: none;
        transition: background 0.2s ease, transform 0.2s ease;
      }
      .of-icon:hover {
        background: ${brandDark};
        color: #ffffff;
        transform: scale(1.06);
      }
      .of-number {
        font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
        font-size: 1.6rem;
        font-weight: 700;
        line-height: 1;
        color: ${brandColor};
        opacity: 0.18;
        transition: opacity 0.25s ease;
      }
      .of-card:hover .of-number { opacity: 0.45; }

      .of-area {
        font-size: 0.68rem;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: ${brandColor};
        margin-bottom: 6px;
      }
      .of-name {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
        font-size: 1.3rem;
        font-weight: 400;
        text-transform: uppercase;
        color: #222222;
        margin: 0 0 14px;
      }
      .of-badge {
        font-family: 'Inter', sans-serif;
        font-size: 0.6rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        padding: 4px 8px;
        background: ${brandColor};
        color: #ffffff;
      }
      .of-address {
        color: #555555;
        font-size: 0.92rem;
        line-height: 1.75;
        margin: 0;
        flex: 1;
      }

      .of-divider {
        border-top: 1px dashed #d9cfc8;
        margin: 18px 0 16px;
      }

      .of-phone {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-size: 0.88rem;
        font-weight: 600;
        color: #222222;
        text-decoration: none;
        transition: color 0.2s ease;
      }
      .of-phone svg { color: ${brandColor}; }
      .of-phone:hover { color: ${brandColor}; }

      /* ---------- Tablet: প্রতি সারিতে ২টা ---------- */
      @media (max-width: 991px) {
        .of-grid { grid-template-columns: repeat(2, 1fr); }
        .of-card,
        .of-card:nth-child(1),
        .of-card:nth-child(2) { grid-column: span 1; }
        .of-card:last-child:nth-child(odd) { grid-column: span 2; }
      }

      /* ---------- Mobile: একটার নিচে একটা ---------- */
      @media (max-width: 576px) {
        .of-section { padding: 56px 0; }
        .of-header { margin-bottom: 34px; }
        .of-title { font-size: 1.6rem; }
        .of-grid { grid-template-columns: 1fr; }
        .of-card:last-child:nth-child(odd) { grid-column: span 1; }
        .of-card { padding: 22px 20px; }
        .of-name { font-size: 1.15rem; }
      }
    `}</style>
  </section>
);

export default Offices;