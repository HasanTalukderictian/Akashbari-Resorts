// import React, { useState } from 'react';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import Footer from './Footer';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// } from 'chart.js';

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// const Packagestatistics = ({ theme: propsTheme }) => {
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(false);
//     const [activeTab, setActiveTab] = useState('packages');
//     const [selectedPackage, setSelectedPackage] = useState('all');
//     const [showModal, setShowModal] = useState(false);
//     const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
//     const [editingPackage, setEditingPackage] = useState(null);

//     // Package Data State
//     const [packageData, setPackageData] = useState({
//         current: [
//             { id: 1, name: "Superior Deluxe Package", price: 350000, discount: 50000, finalPrice: 300000, color: '#9a55ff', status: 'active' },
//             { id: 2, name: "Executive Suite Share", price: 475000, discount: 75000, finalPrice: 400000, color: '#ff6b6b', status: 'active' },
//             { id: 3, name: "Earth Shelter Suite Share", price: 599900, discount: 0, finalPrice: 599900, color: '#4ecdc4', status: 'active' },
//             { id: 4, name: "Presidential Suite Share", price: 699000, discount: 100000, finalPrice: 599000, color: '#f9ca24', status: 'active' }
//         ],
//         previous: [
//             { id: 1, name: "Superior Deluxe Package", price: 300000 },
//             { id: 2, name: "Executive Suite Share", price: 450000 },
//             { id: 3, name: "Earth Shelter Suite Share", price: 550900 },
//             { id: 4, name: "Presidential Suite Share", price: 600000 }
//         ],
//         history: {
//             months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//             superior: [280000, 285000, 290000, 300000, 320000, 350000],
//             executive: [420000, 430000, 440000, 450000, 460000, 475000],
//             earth: [520000, 530000, 540000, 550900, 560000, 599900],
//             presidential: [550000, 560000, 580000, 600000, 620000, 699000]
//         }
//     });

//     // Form State
//     const [formData, setFormData] = useState({
//         name: '',
//         price: '',
//         discount: '',
//         color: '#9a55ff'
//     });

//     const theme = propsTheme || {
//         isDarkMode,
//         bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
//         card: isDarkMode ? '#16213e' : '#ffffff',
//         text: isDarkMode ? '#e9ecef' : '#3e4b5b',
//         border: isDarkMode ? '#2d3436' : '#ebedf2',
//         sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b',
//         primary: '#9a55ff',
//         success: '#10b981',
//         warning: '#f59e0b',
//         danger: '#ef4444'
//     };

//     // Format price
//     const formatPrice = (price) => {
//         return new Intl.NumberFormat('bn-BD', {
//             style: 'currency',
//             currency: 'BDT',
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 0
//         }).format(price).replace('BDT', '৳');
//     };

//     // Prepare chart data
//     const getChartData = () => {
//         const labels = packageData.history.months;
        
//         if (selectedPackage === 'all') {
//             return {
//                 labels,
//                 datasets: [
//                     {
//                         label: 'Superior Deluxe Package',
//                         data: packageData.history.superior,
//                         borderColor: '#9a55ff',
//                         backgroundColor: 'rgba(154, 85, 255, 0.1)',
//                         borderWidth: 2,
//                         fill: true,
//                         tension: 0.4,
//                         pointRadius: 4,
//                         pointHoverRadius: 6,
//                     },
//                     {
//                         label: 'Executive Suite Share',
//                         data: packageData.history.executive,
//                         borderColor: '#ff6b6b',
//                         backgroundColor: 'rgba(255, 107, 107, 0.1)',
//                         borderWidth: 2,
//                         fill: true,
//                         tension: 0.4,
//                         pointRadius: 4,
//                         pointHoverRadius: 6,
//                     },
//                     {
//                         label: 'Earth Shelter Suite Share',
//                         data: packageData.history.earth,
//                         borderColor: '#4ecdc4',
//                         backgroundColor: 'rgba(78, 205, 196, 0.1)',
//                         borderWidth: 2,
//                         fill: true,
//                         tension: 0.4,
//                         pointRadius: 4,
//                         pointHoverRadius: 6,
//                     },
//                     {
//                         label: 'Presidential Suite Share',
//                         data: packageData.history.presidential,
//                         borderColor: '#f9ca24',
//                         backgroundColor: 'rgba(249, 202, 36, 0.1)',
//                         borderWidth: 2,
//                         fill: true,
//                         tension: 0.4,
//                         pointRadius: 4,
//                         pointHoverRadius: 6,
//                     }
//                 ]
//             };
//         } else {
//             let data, label, color;
//             switch(selectedPackage) {
//                 case 'superior':
//                     data = packageData.history.superior;
//                     label = 'Superior Deluxe Package';
//                     color = '#9a55ff';
//                     break;
//                 case 'executive':
//                     data = packageData.history.executive;
//                     label = 'Executive Suite Share';
//                     color = '#ff6b6b';
//                     break;
//                 case 'earth':
//                     data = packageData.history.earth;
//                     label = 'Earth Shelter Suite Share';
//                     color = '#4ecdc4';
//                     break;
//                 case 'presidential':
//                     data = packageData.history.presidential;
//                     label = 'Presidential Suite Share';
//                     color = '#f9ca24';
//                     break;
//                 default:
//                     data = packageData.history.superior;
//                     label = 'Superior Deluxe Package';
//                     color = '#9a55ff';
//             }
            
//             return {
//                 labels,
//                 datasets: [{
//                     label: label,
//                     data: data,
//                     borderColor: color,
//                     backgroundColor: color + '20',
//                     borderWidth: 3,
//                     fill: true,
//                     tension: 0.4,
//                     pointRadius: 5,
//                     pointHoverRadius: 7,
//                     pointBackgroundColor: color,
//                 }]
//             };
//         }
//     };

//     const chartOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 position: 'top',
//                 labels: {
//                     font: { size: 12 },
//                     usePointStyle: true,
//                     boxWidth: 10
//                 }
//             },
//             tooltip: {
//                 callbacks: {
//                     label: function(context) {
//                         let label = context.dataset.label || '';
//                         if (label) label += ': ';
//                         label += formatPrice(context.raw);
//                         return label;
//                     }
//                 }
//             }
//         },
//         scales: {
//             y: {
//                 beginAtZero: false,
//                 ticks: {
//                     callback: function(value) {
//                         return formatPrice(value);
//                     }
//                 }
//             }
//         }
//     };

//     // Open Add Modal
//     const openAddModal = () => {
//         setModalMode('add');
//         setFormData({
//             name: '',
//             price: '',
//             discount: '',
//             color: '#9a55ff'
//         });
//         setShowModal(true);
//     };

//     // Open Edit Modal
//     const openEditModal = (pkg) => {
//         setModalMode('edit');
//         setEditingPackage(pkg);
//         setFormData({
//             name: pkg.name,
//             price: pkg.price,
//             discount: pkg.discount,
//             color: pkg.color
//         });
//         setShowModal(true);
//     };

//     // Handle Form Submit
//     const handleSubmit = () => {
//         if (!formData.name || !formData.price) {
//             alert('Please fill all required fields');
//             return;
//         }

//         if (modalMode === 'add') {
//             // Add new package
//             const newId = packageData.current.length + 1;
//             const priceNum = parseInt(formData.price) || 0;
//             const discountNum = parseInt(formData.discount) || 0;
//             const newPkg = {
//                 id: newId,
//                 name: formData.name,
//                 price: priceNum,
//                 discount: discountNum,
//                 finalPrice: priceNum - discountNum,
//                 color: formData.color,
//                 status: 'active'
//             };
//             setPackageData({
//                 ...packageData,
//                 current: [...packageData.current, newPkg]
//             });
//         } else {
//             // Update existing package
//             const priceNum = parseInt(formData.price) || 0;
//             const discountNum = parseInt(formData.discount) || 0;
//             const updatedPackages = packageData.current.map(pkg => 
//                 pkg.id === editingPackage.id ? {
//                     ...pkg,
//                     name: formData.name,
//                     price: priceNum,
//                     discount: discountNum,
//                     finalPrice: priceNum - discountNum,
//                     color: formData.color
//                 } : pkg
//             );
//             setPackageData({ ...packageData, current: updatedPackages });
//         }
        
//         setShowModal(false);
//         setFormData({ name: '', price: '', discount: '', color: '#9a55ff' });
//         setEditingPackage(null);
//     };

//     const handleDeletePackage = (id) => {
//         if (window.confirm('Are you sure you want to delete this package?')) {
//             setPackageData({
//                 ...packageData,
//                 current: packageData.current.filter(pkg => pkg.id !== id)
//             });
//         }
//     };

//     const toggleSidebar = () => setIsCollapsed(!isCollapsed);
//     const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

//     const styles = {
//         container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
//         mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
//         contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
//         contentScroll: { flex: '1 0 auto', padding: '24px' },
//         footerWrapper: { flexShrink: 0 },
//         tabButton: (isActive) => ({
//             padding: '10px 24px',
//             backgroundColor: isActive ? theme.primary : 'transparent',
//             color: isActive ? '#fff' : theme.text,
//             border: `1px solid ${isActive ? theme.primary : theme.border}`,
//             borderRadius: '30px',
//             cursor: 'pointer',
//             fontWeight: '500',
//             transition: 'all 0.3s ease'
//         }),
//         card: {
//             backgroundColor: theme.card,
//             borderRadius: '16px',
//             padding: '20px',
//             border: `1px solid ${theme.border}`,
//             transition: 'all 0.3s ease'
//         },
//         input: {
//             width: '100%',
//             padding: '10px 14px',
//             borderRadius: '10px',
//             border: `1px solid ${theme.border}`,
//             backgroundColor: theme.bg,
//             color: theme.text,
//             fontSize: '14px',
//             outline: 'none',
//             transition: 'all 0.3s ease'
//         },
//         primaryBtn: {
//             background: theme.primary,
//             color: '#fff',
//             border: 'none',
//             padding: '10px 24px',
//             borderRadius: '10px',
//             fontWeight: '600',
//             cursor: 'pointer',
//             transition: 'all 0.3s ease'
//         },
//         secondaryBtn: {
//             background: 'transparent',
//             color: theme.text,
//             border: `1px solid ${theme.border}`,
//             padding: '10px 24px',
//             borderRadius: '10px',
//             fontWeight: '600',
//             cursor: 'pointer',
//             transition: 'all 0.3s ease'
//         }
//     };

//     return (
//         <div style={styles.container} className="container-fluid p-0">
//             <style>
//                 {`
//                     .package-card:hover {
//                         transform: translateY(-4px);
//                         box-shadow: 0 8px 25px rgba(154, 85, 255, 0.15);
//                     }
//                     .modal-overlay {
//                         position: fixed;
//                         top: 0;
//                         left: 0;
//                         right: 0;
//                         bottom: 0;
//                         background: rgba(0,0,0,0.7);
//                         display: flex;
//                         align-items: center;
//                         justify-content: center;
//                         z-index: 2000;
//                         animation: fadeIn 0.3s ease;
//                     }
//                     @keyframes fadeIn {
//                         from { opacity: 0; }
//                         to { opacity: 1; }
//                     }
//                     .modal-content {
//                         background: ${theme.card};
//                         border-radius: 20px;
//                         width: 500px;
//                         max-width: 90%;
//                         padding: 28px;
//                         animation: slideUp 0.3s ease;
//                     }
//                     @keyframes slideUp {
//                         from {
//                             transform: translateY(50px);
//                             opacity: 0;
//                         }
//                         to {
//                             transform: translateY(0);
//                             opacity: 1;
//                         }
//                     }
//                     .form-input:focus {
//                         border-color: ${theme.primary};
//                         box-shadow: 0 0 0 3px ${theme.primary}20;
//                     }
//                     .btn-primary:hover {
//                         transform: translateY(-2px);
//                         box-shadow: 0 5px 15px ${theme.primary}40;
//                     }
//                     .btn-secondary:hover {
//                         background: ${theme.border};
//                         transform: translateY(-2px);
//                     }
//                 `}
//             </style>

//             <div className="d-flex">
//                 <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="users" />

//                 <div style={styles.mainArea} className="flex-grow-1">
//                     <Header 
//                         theme={theme} 
//                         isDarkMode={isDarkMode} 
//                         toggleDarkMode={toggleDarkMode} 
//                         toggleSidebar={toggleSidebar} 
//                     />

//                     <div style={styles.contentContainer}>
//                         <div style={styles.contentScroll}>
//                             {/* Header */}
//                             <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
//                                 <div>
//                                     <h2 style={{ color: theme.text, fontWeight: '700' }}>
//                                         <i className="bi bi-graph-up" style={{ color: theme.primary, marginRight: '10px' }}></i>
//                                         Package Management
//                                     </h2>
//                                     <p style={{ color: theme.textLight }}>Manage your package pricing, discounts, and view historical trends</p>
//                                 </div>
//                                 <button 
//                                     onClick={openAddModal}
//                                     style={styles.primaryBtn}
//                                     className="btn-primary"
//                                 >
//                                     <i className="bi bi-plus-circle me-2"></i>Add New Package
//                                 </button>
//                             </div>

//                             {/* Tabs */}
//                             <div className="d-flex gap-3 mb-4 flex-wrap">
//                                 <button style={styles.tabButton(activeTab === 'packages')} onClick={() => setActiveTab('packages')}>
//                                     <i className="bi bi-box-seam me-2"></i>Packages
//                                 </button>
//                                 <button style={styles.tabButton(activeTab === 'history')} onClick={() => setActiveTab('history')}>
//                                     <i className="bi bi-graph-up me-2"></i>Price History
//                                 </button>
//                                 <button style={styles.tabButton(activeTab === 'insights')} onClick={() => setActiveTab('insights')}>
//                                     <i className="bi bi-lightbulb me-2"></i>Insights
//                                 </button>
//                             </div>

//                             {activeTab === 'packages' && (
//                                 <>
//                                     {/* Packages Grid */}
//                                     <div className="row g-4">
//                                         {packageData.current.map((pkg) => (
//                                             <div className="col-md-6 col-lg-3" key={pkg.id}>
//                                                 <div className="package-card" style={styles.card}>
//                                                     <div className="d-flex justify-content-between align-items-start mb-3">
//                                                         <div style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: pkg.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                                                             <i className="bi bi-gem" style={{ color: pkg.color, fontSize: '22px' }}></i>
//                                                         </div>
//                                                         <div className="dropdown">
//                                                             <button className="btn btn-sm" style={{ color: theme.text, fontSize: '20px' }} data-bs-toggle="dropdown">⋯</button>
//                                                             <ul className="dropdown-menu">
//                                                                 <li><button className="dropdown-item" onClick={() => openEditModal(pkg)}>✏️ Edit</button></li>
//                                                                 <li><button className="dropdown-item text-danger" onClick={() => handleDeletePackage(pkg.id)}>🗑️ Delete</button></li>
//                                                             </ul>
//                                                         </div>
//                                                     </div>
//                                                     <h6 style={{ color: theme.text, fontWeight: '600', marginBottom: '8px', fontSize: '16px' }}>{pkg.name}</h6>
//                                                     <div className="mb-2">
//                                                         <span style={{ fontSize: '22px', fontWeight: '700', color: pkg.color }}>{formatPrice(pkg.finalPrice)}</span>
//                                                         {pkg.discount > 0 && (
//                                                             <span style={{ fontSize: '13px', color: theme.textLight, textDecoration: 'line-through', marginLeft: '10px' }}>
//                                                                 {formatPrice(pkg.price)}
//                                                             </span>
//                                                         )}
//                                                     </div>
//                                                     {pkg.discount > 0 && (
//                                                         <span className="badge mt-2" style={{ backgroundColor: theme.success, color: '#fff', padding: '5px 12px' }}>
//                                                             Save {formatPrice(pkg.discount)}
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </>
//                             )}

//                             {activeTab === 'history' && (
//                                 <>
//                                     {/* Filter Buttons */}
//                                     <div className="d-flex gap-2 mb-4 flex-wrap">
//                                         <button className={`btn ${selectedPackage === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setSelectedPackage('all')}>All Packages</button>
//                                         <button className={`btn ${selectedPackage === 'superior' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setSelectedPackage('superior')}>Superior Deluxe</button>
//                                         <button className={`btn ${selectedPackage === 'executive' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setSelectedPackage('executive')}>Executive Suite</button>
//                                         <button className={`btn ${selectedPackage === 'earth' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setSelectedPackage('earth')}>Earth Shelter</button>
//                                         <button className={`btn ${selectedPackage === 'presidential' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setSelectedPackage('presidential')}>Presidential Suite</button>
//                                     </div>

//                                     {/* Chart */}
//                                     <div style={{...styles.card, height: '500px'}}>
//                                         <Line data={getChartData()} options={chartOptions} />
//                                     </div>
//                                 </>
//                             )}

//                             {activeTab === 'insights' && (
//                                 <div className="row g-4">
//                                     <div className="col-md-6">
//                                         <div style={styles.card}>
//                                             <h5 className="mb-3"><i className="bi bi-trending-up me-2" style={{ color: theme.success }}></i>Price Trends</h5>
//                                             <div className="mb-3">
//                                                 <div className="d-flex justify-content-between mb-2">
//                                                     <span>Superior Deluxe</span>
//                                                     <span style={{ color: theme.success }}>+25% ↑</span>
//                                                 </div>
//                                                 <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
//                                                     <div className="progress-bar" style={{ width: '25%', backgroundColor: '#9a55ff' }}></div>
//                                                 </div>
//                                             </div>
//                                             <div className="mb-3">
//                                                 <div className="d-flex justify-content-between mb-2">
//                                                     <span>Executive Suite</span>
//                                                     <span style={{ color: theme.success }}>+13% ↑</span>
//                                                 </div>
//                                                 <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
//                                                     <div className="progress-bar" style={{ width: '13%', backgroundColor: '#ff6b6b' }}></div>
//                                                 </div>
//                                             </div>
//                                             <div className="mb-3">
//                                                 <div className="d-flex justify-content-between mb-2">
//                                                     <span>Earth Shelter</span>
//                                                     <span style={{ color: theme.warning }}>+9% ↑</span>
//                                                 </div>
//                                                 <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
//                                                     <div className="progress-bar" style={{ width: '9%', backgroundColor: '#4ecdc4' }}></div>
//                                                 </div>
//                                             </div>
//                                             <div className="mb-3">
//                                                 <div className="d-flex justify-content-between mb-2">
//                                                     <span>Presidential Suite</span>
//                                                     <span style={{ color: theme.success }}>+27% ↑</span>
//                                                 </div>
//                                                 <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
//                                                     <div className="progress-bar" style={{ width: '27%', backgroundColor: '#f9ca24' }}></div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="col-md-6">
//                                         <div style={styles.card}>
//                                             <h5 className="mb-3"><i className="bi bi-star me-2" style={{ color: theme.warning }}></i>Recommendations</h5>
//                                             <div className="mb-3 p-3 rounded" style={{ backgroundColor: theme.bg }}>
//                                                 <i className="bi bi-lightbulb me-2" style={{ color: theme.warning }}></i>
//                                                 <strong>Best Value:</strong> Superior Deluxe Package with 14% discount
//                                             </div>
//                                             <div className="mb-3 p-3 rounded" style={{ backgroundColor: theme.bg }}>
//                                                 <i className="bi bi-graph-up me-2" style={{ color: theme.success }}></i>
//                                                 <strong>Highest Growth:</strong> Presidential Suite (+27% in 6 months)
//                                             </div>
//                                             <div className="p-3 rounded" style={{ backgroundColor: theme.bg }}>
//                                                 <i className="bi bi-bar-chart me-2" style={{ color: theme.primary }}></i>
//                                                 <strong>Most Stable:</strong> Earth Shelter Suite (steady growth)
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         <div style={styles.footerWrapper}>
//                             <Footer theme={theme} />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Unified Modal for Add/Edit */}
//             {showModal && (
//                 <div className="modal-overlay" onClick={() => setShowModal(false)}>
//                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                         <div className="d-flex justify-content-between align-items-center mb-4">
//                             <h4 style={{ color: theme.text, margin: 0 }}>
//                                 {modalMode === 'add' ? (
//                                     <><i className="bi bi-plus-circle me-2" style={{ color: theme.primary }}></i>Add New Package</>
//                                 ) : (
//                                     <><i className="bi bi-pencil-square me-2" style={{ color: theme.warning }}></i>Edit Package</>
//                                 )}
//                             </h4>
//                             <button 
//                                 onClick={() => setShowModal(false)}
//                                 style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: theme.text }}
//                             >
//                                 ×
//                             </button>
//                         </div>

//                         <div className="mb-3">
//                             <label style={{ color: theme.text, display: 'block', marginBottom: '8px', fontWeight: '500' }}>
//                                 Package Name <span style={{ color: theme.danger }}>*</span>
//                             </label>
//                             <input 
//                                 type="text" 
//                                 className="form-input"
//                                 style={styles.input} 
//                                 placeholder="Enter package name"
//                                 value={formData.name} 
//                                 onChange={(e) => setFormData({...formData, name: e.target.value})} 
//                             />
//                         </div>

//                         <div className="mb-3">
//                             <label style={{ color: theme.text, display: 'block', marginBottom: '8px', fontWeight: '500' }}>
//                                 Price (৳) <span style={{ color: theme.danger }}>*</span>
//                             </label>
//                             <input 
//                                 type="number" 
//                                 className="form-input"
//                                 style={styles.input} 
//                                 placeholder="Enter price"
//                                 value={formData.price} 
//                                 onChange={(e) => setFormData({...formData, price: e.target.value})} 
//                             />
//                         </div>

//                         <div className="mb-3">
//                             <label style={{ color: theme.text, display: 'block', marginBottom: '8px', fontWeight: '500' }}>
//                                 Discount (৳)
//                             </label>
//                             <input 
//                                 type="number" 
//                                 className="form-input"
//                                 style={styles.input} 
//                                 placeholder="Enter discount amount"
//                                 value={formData.discount} 
//                                 onChange={(e) => setFormData({...formData, discount: e.target.value})} 
//                             />
//                             {formData.price && formData.discount && (
//                                 <small style={{ color: theme.success, marginTop: '5px', display: 'block' }}>
//                                     Final Price: {formatPrice(parseInt(formData.price) - parseInt(formData.discount))}
//                                 </small>
//                             )}
//                         </div>

//                         <div className="mb-4">
//                             <label style={{ color: theme.text, display: 'block', marginBottom: '8px', fontWeight: '500' }}>
//                                 Package Color
//                             </label>
//                             <div className="d-flex align-items-center gap-3">
//                                 <input 
//                                     type="color" 
//                                     style={{ width: '50px', height: '50px', borderRadius: '10px', border: `1px solid ${theme.border}`, cursor: 'pointer' }}
//                                     value={formData.color} 
//                                     onChange={(e) => setFormData({...formData, color: e.target.value})} 
//                                 />
//                                 <div style={{ 
//                                     padding: '8px 16px', 
//                                     backgroundColor: formData.color + '20', 
//                                     borderRadius: '8px',
//                                     color: formData.color,
//                                     fontWeight: '500'
//                                 }}>
//                                     Preview Color
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="d-flex gap-3">
//                             <button 
//                                 onClick={handleSubmit} 
//                                 style={{ flex: 1, ...styles.primaryBtn }}
//                                 className="btn-primary"
//                             >
//                                 {modalMode === 'add' ? (
//                                     <><i className="bi bi-check-circle me-2"></i>Add Package</>
//                                 ) : (
//                                     <><i className="bi bi-save me-2"></i>Update Package</>
//                                 )}
//                             </button>
//                             <button 
//                                 onClick={() => setShowModal(false)} 
//                                 style={{ flex: 1, ...styles.secondaryBtn }}
//                                 className="btn-secondary"
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Packagestatistics;



import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const Packagestatistics = ({ theme: propsTheme }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState('packages');
    const [selectedPackage, setSelectedPackage] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [editingPackage, setEditingPackage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    // Package Data State
    const [packageData, setPackageData] = useState({
        current: [],
        history: {
            months: [],
            datasets: []
        }
    });

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        discount: '',
        color: '#9a55ff'
    });

    const theme = propsTheme || {
        isDarkMode,
        bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2',
        sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b',
        primary: '#9a55ff',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444'
    };

    // Show toast notification
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('bn-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price).replace('BDT', '৳');
    };

    // Fetch all packages
   const fetchPackages = async () => {
    setLoading(true);
    try {
        const response = await axios.get(`${API_BASE_URL}/packages`);

        if (response.data.success === true) {
            setPackageData(prev => ({
                ...prev,
                current: response.data.data
            }));
        }
    } catch (error) {
        console.error(error);
        showToast('Failed to load packages', 'error');
    } finally {
        setLoading(false);
    }
};
    // Fetch price history
    const fetchPriceHistory = async (packageId = null) => {
        setLoading(true);
        try {
            let url = `${API_BASE_URL}/packages/history`;
            if (packageId && packageId !== 'all') {
                url = `${API_BASE_URL}/packages/${packageId}/history`;
            }
            const response = await axios.get(url);
            if (response.data.status === true) {
                setPackageData(prev => ({ ...prev, history: response.data.data }));
            }
        } catch (error) {
            console.error('Error fetching price history:', error);
        } finally {
            setLoading(false);
        }
    };

    // Add new package
    const addPackage = async () => {
    if (!formData.name || !formData.price) {
        showToast('Please fill all required fields', 'error');
        return;
    }

    setLoading(true);
    try {
        const response = await axios.post(`${API_BASE_URL}/packages`, {
            name: formData.name,
            price: parseInt(formData.price),
            discount: parseInt(formData.discount) || 0,
            color: formData.color
        });

        if (response.data.success === true) {
            showToast('Package added successfully!', 'success');

            setShowModal(false);   // ✅ modal close FIX
            setFormData({ name: '', price: '', discount: '', color: '#9a55ff' });

            await fetchPackages();  // ✅ data refresh FIX
        }

    } catch (error) {
        console.error(error);
        showToast(error.response?.data?.message || 'Failed to add package', 'error');
    } finally {
        setLoading(false);
    }
};

    // Update package
   const updatePackage = async () => {
    if (!formData.name || !formData.price) {
        showToast('Please fill all required fields', 'error');
        return;
    }

    setLoading(true);
    try {
        const response = await axios.put(`${API_BASE_URL}/packages/${editingPackage.id}`, {
            name: formData.name,
            price: parseInt(formData.price),
            discount: parseInt(formData.discount) || 0,
            color: formData.color
        });

        if (response.data.success === true) {
            showToast('Package updated successfully!', 'success');

            setShowModal(false);   // ✅ FIX
            setEditingPackage(null);
            setFormData({ name: '', price: '', discount: '', color: '#9a55ff' });

            await fetchPackages();  // ✅ refresh UI
        }

    } catch (error) {
        console.error(error);
        showToast(error.response?.data?.message || 'Failed to update package', 'error');
    } finally {
        setLoading(false);
    }
};
    // Delete package
   const deletePackage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;

    setLoading(true);
    try {
        const response = await axios.delete(`${API_BASE_URL}/packages/${id}`);

        if (response.data.success === true) {
            showToast('Package deleted successfully!', 'success');

            await fetchPackages(); // ✅ ensure refresh after delete
        } else {
            showToast('Delete failed', 'error');
        }

    } catch (error) {
        console.error('Error deleting package:', error);
        showToast(error.response?.data?.message || 'Failed to delete package', 'error');
    } finally {
        setLoading(false);
    }
};

    // Open Add Modal
    const openAddModal = () => {
        setModalMode('add');
        setFormData({ name: '', price: '', discount: '', color: '#9a55ff' });
        setShowModal(true);
    };

    // Open Edit Modal
    const openEditModal = (pkg) => {
        setModalMode('edit');
        setEditingPackage(pkg);
        setFormData({
            name: pkg.name,
            price: pkg.price,
            discount: pkg.discount,
            color: pkg.color
        });
        setShowModal(true);
    };

    // Handle Form Submit
    const handleSubmit = () => {
        if (modalMode === 'add') {
            addPackage();
        } else {
            updatePackage();
        }
    };

    useEffect(() => {
        fetchPackages();
        fetchPriceHistory();
    }, []);

    useEffect(() => {
        if (activeTab === 'history') {
            fetchPriceHistory(selectedPackage === 'all' ? null : selectedPackage);
        }
    }, [activeTab, selectedPackage]);

    // Prepare chart data
    const getChartData = () => {
        if (!packageData.history || !packageData.history.months) {
            return { labels: [], datasets: [] };
        }

        const labels = packageData.history.months;
        const datasets = packageData.history.datasets || [];
        
        return { labels, datasets };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: { size: 12 },
                    usePointStyle: true,
                    boxWidth: 10
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        label += formatPrice(context.raw);
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    callback: function(value) {
                        return formatPrice(value);
                    }
                }
            }
        }
    };

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const styles = {
        container: { backgroundColor: theme.bg, minHeight: '100vh', transition: 'all 0.3s ease' },
        mainArea: { height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        contentContainer: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
        contentScroll: { flex: '1 0 auto', padding: '24px' },
        footerWrapper: { flexShrink: 0 },
        tabButton: (isActive) => ({
            padding: '10px 24px',
            backgroundColor: isActive ? theme.primary : 'transparent',
            color: isActive ? '#fff' : theme.text,
            border: `1px solid ${isActive ? theme.primary : theme.border}`,
            borderRadius: '30px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.3s ease'
        }),
        card: {
            backgroundColor: theme.card,
            borderRadius: '16px',
            padding: '20px',
            border: `1px solid ${theme.border}`,
            transition: 'all 0.3s ease'
        },
        input: {
            width: '100%',
            padding: '10px 14px',
            borderRadius: '10px',
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.bg,
            color: theme.text,
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s ease'
        },
        primaryBtn: {
            background: theme.primary,
            color: '#fff',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '10px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        secondaryBtn: {
            background: 'transparent',
            color: theme.text,
            border: `1px solid ${theme.border}`,
            padding: '10px 24px',
            borderRadius: '10px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        toast: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '10px',
            color: 'white',
            zIndex: 2000,
            animation: 'slideInRight 0.3s ease'
        }
    };

    return (
        <div style={styles.container} className="container-fluid p-0">
            <style>
                {`
                    .package-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 8px 25px rgba(154, 85, 255, 0.15);
                    }
                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0,0,0,0.7);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 2000;
                        animation: fadeIn 0.3s ease;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideInRight {
                        from { transform: translateX(100px); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    .modal-content {
                        background: ${theme.card};
                        border-radius: 20px;
                        width: 500px;
                        max-width: 90%;
                        padding: 28px;
                        animation: slideUp 0.3s ease;
                    }
                    @keyframes slideUp {
                        from {
                            transform: translateY(50px);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }
                    .form-input:focus {
                        border-color: ${theme.primary};
                        box-shadow: 0 0 0 3px ${theme.primary}20;
                    }
                    .btn-primary:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px ${theme.primary}40;
                    }
                    .btn-secondary:hover {
                        background: ${theme.border};
                        transform: translateY(-2px);
                    }
                `}
            </style>

            <div className="d-flex">
                <Sidebar theme={theme} isCollapsed={isCollapsed} activeView="users" />

                <div style={styles.mainArea} className="flex-grow-1">
                    <Header 
                        theme={theme} 
                        isDarkMode={isDarkMode} 
                        toggleDarkMode={toggleDarkMode} 
                        toggleSidebar={toggleSidebar} 
                    />

                    <div style={styles.contentContainer}>
                        <div style={styles.contentScroll}>
                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                                <div>
                                    <h2 style={{ color: theme.text, fontWeight: '700' }}>
                                        <i className="bi bi-graph-up" style={{ color: theme.primary, marginRight: '10px' }}></i>
                                        Package Management
                                    </h2>
                                    <p style={{ color: theme.textLight }}>Manage your package pricing, discounts, and view historical trends</p>
                                </div>
                                <button 
                                    onClick={openAddModal}
                                    style={styles.primaryBtn}
                                    className="btn-primary"
                                >
                                    <i className="bi bi-plus-circle me-2"></i>Add New Package
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="d-flex gap-3 mb-4 flex-wrap">
                                <button style={styles.tabButton(activeTab === 'packages')} onClick={() => setActiveTab('packages')}>
                                    <i className="bi bi-box-seam me-2"></i>Packages
                                </button>
                                <button style={styles.tabButton(activeTab === 'history')} onClick={() => setActiveTab('history')}>
                                    <i className="bi bi-graph-up me-2"></i>Price History
                                </button>
                                <button style={styles.tabButton(activeTab === 'insights')} onClick={() => setActiveTab('insights')}>
                                    <i className="bi bi-lightbulb me-2"></i>Insights
                                </button>
                            </div>

                            {activeTab === 'packages' && (
                                <>
                                    {loading && packageData.current.length === 0 ? (
                                        <div className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <p className="mt-3">Loading packages...</p>
                                        </div>
                                    ) : packageData.current.length === 0 ? (
                                        <div style={styles.card} className="text-center py-5">
                                            <i className="bi bi-box-seam" style={{ fontSize: '48px', color: theme.textLight }}></i>
                                            <h4 className="mt-3">No Packages Found</h4>
                                            <p>Click the "Add New Package" button to create your first package.</p>
                                        </div>
                                    ) : (
                                        <div className="row g-4">
                                            {packageData.current.map((pkg) => (
                                                <div className="col-md-6 col-lg-3" key={pkg.id}>
                                                    <div className="package-card" style={styles.card}>
                                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                                            <div style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: pkg.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <i className="bi bi-gem" style={{ color: pkg.color, fontSize: '22px' }}></i>
                                                            </div>
                                                            <div className="dropdown">
                                                                <button className="btn btn-sm" style={{ color: theme.text, fontSize: '20px' }} data-bs-toggle="dropdown">⋯</button>
                                                                <ul className="dropdown-menu">
                                                                    <li><button className="dropdown-item" onClick={() => openEditModal(pkg)}>✏️ Edit</button></li>
                                                                    <li><button className="dropdown-item text-danger" onClick={() => deletePackage(pkg.id)}>🗑️ Delete</button></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <h6 style={{ color: theme.text, fontWeight: '600', marginBottom: '8px', fontSize: '16px' }}>{pkg.name}</h6>
                                                        <div className="mb-2">
                                                            <span style={{ fontSize: '22px', fontWeight: '700', color: pkg.color }}>{formatPrice(pkg.final_price || pkg.price - pkg.discount)}</span>
                                                            {pkg.discount > 0 && (
                                                                <span style={{ fontSize: '13px', color: theme.textLight, textDecoration: 'line-through', marginLeft: '10px' }}>
                                                                    {formatPrice(pkg.price)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {pkg.discount > 0 && (
                                                            <span className="badge mt-2" style={{ backgroundColor: theme.success, color: '#fff', padding: '5px 12px' }}>
                                                                Save {formatPrice(pkg.discount)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === 'history' && (
                                <>
                                    {/* Filter Buttons */}
                                    <div className="d-flex gap-2 mb-4 flex-wrap">
                                        <button className={`btn ${selectedPackage === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setSelectedPackage('all')}>All Packages</button>
                                        {packageData.current.map((pkg) => (
                                            <button 
                                                key={pkg.id}
                                                className={`btn ${selectedPackage === pkg.slug || selectedPackage === pkg.id.toString() ? 'btn-primary' : 'btn-outline-secondary'}`} 
                                                onClick={() => setSelectedPackage(pkg.slug || pkg.id.toString())}
                                            >
                                                {pkg.name}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Chart */}
                                    <div style={{...styles.card, height: '500px'}}>
                                        {loading ? (
                                            <div className="text-center py-5">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <Line data={getChartData()} options={chartOptions} />
                                        )}
                                    </div>
                                </>
                            )}

                            {activeTab === 'insights' && (
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div style={styles.card}>
                                            <h5 className="mb-3"><i className="bi bi-trending-up me-2" style={{ color: theme.success }}></i>Price Trends</h5>
                                            {packageData.current.map((pkg, index) => (
                                                <div className="mb-3" key={pkg.id}>
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span>{pkg.name}</span>
                                                        <span style={{ color: theme.success }}>+{Math.floor(Math.random() * 30) + 5}% ↑</span>
                                                    </div>
                                                    <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                                                        <div className="progress-bar" style={{ width: `${Math.floor(Math.random() * 30) + 5}%`, backgroundColor: pkg.color }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div style={styles.card}>
                                            <h5 className="mb-3"><i className="bi bi-star me-2" style={{ color: theme.warning }}></i>Recommendations</h5>
                                            {packageData.current.filter(p => p.discount > 0).length > 0 && (
                                                <div className="mb-3 p-3 rounded" style={{ backgroundColor: theme.bg }}>
                                                    <i className="bi bi-lightbulb me-2" style={{ color: theme.warning }}></i>
                                                    <strong>Best Value:</strong> {packageData.current.find(p => p.discount > 0)?.name} with {packageData.current.find(p => p.discount > 0)?.discount}% discount
                                                </div>
                                            )}
                                            <div className="mb-3 p-3 rounded" style={{ backgroundColor: theme.bg }}>
                                                <i className="bi bi-graph-up me-2" style={{ color: theme.success }}></i>
                                                <strong>Total Packages:</strong> {packageData.current.length} active packages
                                            </div>
                                            <div className="p-3 rounded" style={{ backgroundColor: theme.bg }}>
                                                <i className="bi bi-bar-chart me-2" style={{ color: theme.primary }}></i>
                                                <strong>Average Price:</strong> {formatPrice(packageData.current.reduce((sum, p) => sum + p.price, 0) / (packageData.current.length || 1))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={styles.footerWrapper}>
                            <Footer theme={theme} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {toast.show && (
                <div style={{
                    ...styles.toast,
                    backgroundColor: toast.type === 'success' ? theme.success : theme.danger
                }}>
                    {toast.message}
                </div>
            )}

            {/* Unified Modal for Add/Edit */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 style={{ color: theme.text, margin: 0 }}>
                                {modalMode === 'add' ? (
                                    <><i className="bi bi-plus-circle me-2" style={{ color: theme.primary }}></i>Add New Package</>
                                ) : (
                                    <><i className="bi bi-pencil-square me-2" style={{ color: theme.warning }}></i>Edit Package</>
                                )}
                            </h4>
                            <button 
                                onClick={() => setShowModal(false)}
                                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: theme.text }}
                            >
                                ×
                            </button>
                        </div>

                        <div className="mb-3">
                            <label style={{ color: theme.text, display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Package Name <span style={{ color: theme.danger }}>*</span>
                            </label>
                            <input 
                                type="text" 
                                className="form-input"
                                style={styles.input} 
                                placeholder="Enter package name"
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            />
                        </div>

                        <div className="mb-3">
                            <label style={{ color: theme.text, display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Price (৳) <span style={{ color: theme.danger }}>*</span>
                            </label>
                            <input 
                                type="number" 
                                className="form-input"
                                style={styles.input} 
                                placeholder="Enter price"
                                value={formData.price} 
                                onChange={(e) => setFormData({...formData, price: e.target.value})} 
                            />
                        </div>

                        <div className="mb-3">
                            <label style={{ color: theme.text, display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Discount (%) 
                            </label>
                            <input 
                                type="number" 
                                className="form-input"
                                style={styles.input} 
                                placeholder="Enter discount percentage"
                                value={formData.discount} 
                                onChange={(e) => setFormData({...formData, discount: e.target.value})} 
                            />
                            {formData.price && formData.discount && (
                                <small style={{ color: theme.success, marginTop: '5px', display: 'block' }}>
                                    Final Price: {formatPrice(parseInt(formData.price) - (parseInt(formData.price) * parseInt(formData.discount) / 100))}
                                </small>
                            )}
                        </div>

                        <div className="mb-4">
                            <label style={{ color: theme.text, display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Package Color
                            </label>
                            <div className="d-flex align-items-center gap-3">
                                <input 
                                    type="color" 
                                    style={{ width: '50px', height: '50px', borderRadius: '10px', border: `1px solid ${theme.border}`, cursor: 'pointer' }}
                                    value={formData.color} 
                                    onChange={(e) => setFormData({...formData, color: e.target.value})} 
                                />
                                <div style={{ 
                                    padding: '8px 16px', 
                                    backgroundColor: formData.color + '20', 
                                    borderRadius: '8px',
                                    color: formData.color,
                                    fontWeight: '500'
                                }}>
                                    Preview Color
                                </div>
                            </div>
                        </div>

                        <div className="d-flex gap-3">
                            <button 
                                onClick={handleSubmit} 
                                style={{ flex: 1, ...styles.primaryBtn }}
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Processing...</>
                                ) : (
                                    modalMode === 'add' ? (
                                        <><i className="bi bi-check-circle me-2"></i>Add Package</>
                                    ) : (
                                        <><i className="bi bi-save me-2"></i>Update Package</>
                                    )
                                )}
                            </button>
                            <button 
                                onClick={() => setShowModal(false)} 
                                style={{ flex: 1, ...styles.secondaryBtn }}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Packagestatistics;