// import React, { useState, useEffect } from 'react';
// import { Bar } from 'react-chartjs-2';
// import axios from 'axios';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// const PackageGraph = () => {
//   const [selectedPackage, setSelectedPackage] = useState('all');
//   const [loading, setLoading] = useState(false);
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [priceUpdateMonth, setPriceUpdateMonth] = useState(null);
//   const [packageData, setPackageData] = useState({
//     current: [],
//     history: {
//       months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//       datasets: []
//     }
//   });

//   // Brand color
//   const brandColor = '#5e2e10';

//   // Format price
//   const formatPrice = (price) => {
//     const numPrice = parseFloat(price) || 0;
//     return new Intl.NumberFormat('bn-BD', {
//       style: 'currency',
//       currency: 'BDT',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(numPrice).replace('BDT', '৳');
//   };

//   // Fetch all packages
//   const fetchPackages = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_BASE_URL}/packages`);
//       console.log('API Response:', response.data);
      
//       if (response.data.success === true || response.data.status === true) {
//         const packages = response.data.data || [];
//         setPackageData(prev => ({ ...prev, current: packages }));
//         setLastUpdated(new Date().toLocaleString());
        
//         generateStepHistoryData(packages);
//       }
//     } catch (error) {
//       console.error('Error fetching packages:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Generate step history data
//   const generateStepHistoryData = (packages) => {
//     if (packages.length > 0) {
//       const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//       const colors = ['#5e2e10', '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#6B3A2A'];
      
//       const increaseMonth = Math.floor(Math.random() * 12);
//       setPriceUpdateMonth(months[increaseMonth]);
      
//       const datasets = packages.map((pkg, idx) => {
//         const currentPrice = parseFloat(pkg.price) || 0;
//         const discount = parseFloat(pkg.discount) || 0;
//         const oldPrice = Math.round(currentPrice * 0.7);
        
//         const historyData = [];
        
//         for (let i = 0; i < 12; i++) {
//           if (i < increaseMonth) {
//             historyData.push(oldPrice);
//           } else {
//             historyData.push(currentPrice);
//           }
//         }
        
//         return {
//           label: pkg.name,
//           data: historyData,
//           backgroundColor: colors[idx % colors.length] + '80',
//           borderColor: colors[idx % colors.length],
//           borderWidth: 2,
//           borderRadius: 8,
//           currentPrice: currentPrice,
//           oldPrice: oldPrice,
//           discount: discount,
//           increaseMonth: months[increaseMonth]
//         };
//       });
      
//       setPackageData(prev => ({
//         ...prev,
//         history: { months, datasets }
//       }));
//     }
//   };

//   // Update single package history
//   const updateSinglePackageHistory = (selectedPkgId) => {
//     const selectedPkg = packageData.current.find(p => p.id.toString() === selectedPkgId);
//     if (selectedPkg && packageData.current.length > 0) {
//       const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//       const colors = ['#5e2e10', '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#6B3A2A'];
      
//       const currentPrice = parseFloat(selectedPkg.price) || 0;
//       const discount = parseFloat(selectedPkg.discount) || 0;
//       const oldPrice = Math.round(currentPrice * 0.7);
      
//       const increaseMonth = Math.floor(Math.random() * 12);
//       setPriceUpdateMonth(months[increaseMonth]);
      
//       const historyData = [];
//       for (let i = 0; i < 12; i++) {
//         if (i < increaseMonth) {
//           historyData.push(oldPrice);
//         } else {
//           historyData.push(currentPrice);
//         }
//       }
      
//       const idx = packageData.current.findIndex(p => p.id.toString() === selectedPkgId);
//       setPackageData(prev => ({
//         ...prev,
//         history: {
//           months,
//           datasets: [{
//             label: selectedPkg.name,
//             data: historyData,
//             backgroundColor: colors[idx % colors.length] + '80',
//             borderColor: colors[idx % colors.length],
//             borderWidth: 2,
//             borderRadius: 8,
//             currentPrice: currentPrice,
//             oldPrice: oldPrice,
//             discount: discount,
//             increaseMonth: months[increaseMonth]
//           }]
//         }
//       }));
//     }
//   };

//   useEffect(() => {
//     fetchPackages();
//   }, []);

//   useEffect(() => {
//     if (packageData.current.length > 0 && selectedPackage !== 'all') {
//       updateSinglePackageHistory(selectedPackage);
//     } else if (packageData.current.length > 0 && selectedPackage === 'all') {
//       generateStepHistoryData(packageData.current);
//     }
//   }, [selectedPackage, packageData.current]);

//   // Prepare chart data
//   const getChartData = () => {
//     const labels = packageData.history.months || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
//     let datasets = packageData.history.datasets || [];
    
//     return {
//       labels,
//       datasets: datasets.map(dataset => ({
//         label: dataset.label,
//         data: dataset.data,
//         backgroundColor: dataset.backgroundColor,
//         borderColor: dataset.borderColor,
//         borderWidth: 2,
//         borderRadius: 8,
//         barPercentage: 0.7,
//         categoryPercentage: 0.8,
//       }))
//     };
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     interaction: {
//       mode: 'index',
//       intersect: false,
//     },
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           font: { size: 12, weight: 'bold', family: 'Poppins, sans-serif' },
//           usePointStyle: true,
//           boxWidth: 10,
//           padding: 15
//         }
//       },
//       tooltip: {
//         backgroundColor: brandColor,
//         titleColor: '#fff',
//         bodyColor: '#ddd',
//         borderColor: brandColor,
//         borderWidth: 1,
//         callbacks: {
//           label: function(context) {
//             let label = context.dataset.label || '';
//             if (label) {
//               label += ': ';
//             }
//             label += formatPrice(context.raw);
//             return label;
//           },
//           afterBody: function(tooltipItems) {
//             const dataset = packageData.history.datasets.find(d => d.label === tooltipItems[0].dataset.label);
//             if (dataset && dataset.increaseMonth) {
//               return [`📈 Price increased in: ${dataset.increaseMonth}`, `💎 Discount: ${formatPrice(dataset.discount)}`];
//             }
//             return null;
//           }
//         }
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: false,
//         grid: {
//           color: '#e0e0e0',
//           drawBorder: true,
//         },
//         title: {
//           display: true,
//           text: '💰 Price (BDT)',
//           font: { size: 12, weight: 'bold' }
//         },
//         ticks: {
//           callback: function(value) {
//             return formatPrice(value);
//           },
//           font: { size: 11 }
//         }
//       },
//       x: {
//         grid: {
//           display: false
//         },
//         title: {
//           display: true,
//           text: '📅 Months (2026)',
//           font: { size: 12, weight: 'bold' }
//         },
//         ticks: {
//           font: { size: 11 }
//         }
//       }
//     }
//   };

//   // Calculate insights
//   const getInsights = () => {
//     if (packageData.current.length === 0) {
//       return {
//         highestPrice: { name: 'N/A', price: 0 },
//         bestValue: { name: 'N/A', discount: 0 },
//         avgPrice: 0,
//         totalPackages: 0
//       };
//     }

//     const bestValue = packageData.current.reduce((best, pkg) => {
//       const discount = parseFloat(pkg.discount) || 0;
//       return discount > (best.discount || 0) ? { name: pkg.name, discount: discount } : best;
//     }, { name: packageData.current[0]?.name, discount: 0 });

//     const highestPrice = packageData.current.reduce((max, pkg) => {
//       const price = parseFloat(pkg.price) || 0;
//       return price > (max.price || 0) ? { name: pkg.name, price: price } : max;
//     }, { name: packageData.current[0]?.name, price: 0 });

//     const avgPrice = packageData.current.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / packageData.current.length;

//     return {
//       highestPrice,
//       bestValue,
//       avgPrice,
//       totalPackages: packageData.current.length
//     };
//   };

//   const insights = getInsights();

//   if (loading && packageData.current.length === 0) {
//     return (
//       <div style={{
//         width: '100%',
//         minHeight: '100vh',
//         background: brandColor,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         fontFamily: 'Poppins, sans-serif'
//       }}>
//         <div className="text-center text-white">
//           <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: '#ffd700' }}>
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-3">Loading package data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{
//       width: '100%',
//       background: brandColor,
//       fontFamily: 'Poppins, sans-serif',
//       padding: '40px 0'
//     }}>
//       <div style={{
//         width: '100%',
//         maxWidth: '1400px',
//         margin: '0 auto',
//         padding: '0 24px'
//       }}>
//         {/* Hero Header */}
//         <div style={{ textAlign: 'center', marginBottom: '40px', color: 'white' }}>
//           <div style={{
//             display: 'inline-block',
//             background: 'rgba(255,255,255,0.15)',
//             padding: '8px 20px',
//             borderRadius: '50px',
//             marginBottom: '20px',
//             backdropFilter: 'blur(10px)',
//             border: '1px solid rgba(255,215,0,0.2)'
//           }}>
//             <span style={{ color: '#ffd700' }}>✦</span> REAL-TIME MARKET DATA
//           </div>
//           <h1 style={{
//             fontSize: '42px',
//             fontWeight: '700',
//             marginBottom: '15px',
//             color: '#ffffff',
//             letterSpacing: '2px'
//           }}>
//             Package Price History
//           </h1>
//           <p style={{ fontSize: '16px', opacity: 0.9 }}>
//             Track price trends and make informed decisions
//           </p>
//         </div>

//         {/* Stats Cards */}
      

//         {/* Package Filters */}
//         <div style={{
//           marginBottom: '30px',
//           padding: '20px',
//           background: 'white',
//           borderRadius: '20px',
//           boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
//         }}>
//           <div style={{
//             display: 'flex',
//             flexWrap: 'wrap',
//             gap: '12px',
//             justifyContent: 'center'
//           }}>
//             <button
//               onClick={() => setSelectedPackage('all')}
//               style={{
//                 padding: '10px 24px',
//                 background: selectedPackage === 'all' ? brandColor : '#f8f9fa',
//                 color: selectedPackage === 'all' ? 'white' : '#2c3e50',
//                 border: 'none',
//                 borderRadius: '30px',
//                 cursor: 'pointer',
//                 fontWeight: selectedPackage === 'all' ? '600' : '400',
//                 transition: 'all 0.3s ease',
//                 boxShadow: selectedPackage === 'all' ? `0 5px 15px ${brandColor}80` : 'none'
//               }}
//             >
//               🎯 All Packages
//             </button>
//             {packageData.current.map((pkg, idx) => {
//               const colors = ['#5e2e10', '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#6B3A2A'];
//               return (
//                 <button
//                   key={pkg.id}
//                   onClick={() => setSelectedPackage(pkg.id.toString())}
//                   style={{
//                     padding: '10px 24px',
//                     background: selectedPackage === pkg.id.toString() ? colors[idx % colors.length] : '#f8f9fa',
//                     color: selectedPackage === pkg.id.toString() ? 'white' : '#2c3e50',
//                     border: 'none',
//                     borderRadius: '30px',
//                     cursor: 'pointer',
//                     fontWeight: selectedPackage === pkg.id.toString() ? '600' : '400',
//                     transition: 'all 0.3s ease',
//                     boxShadow: selectedPackage === pkg.id.toString() ? `0 5px 15px ${colors[idx % colors.length]}80` : 'none'
//                   }}
//                 >
//                   {pkg.name}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Bar Chart Container */}
//         <div style={{
//           background: 'white',
//           borderRadius: '20px',
//           padding: '30px',
//           boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
//           marginBottom: '30px',
//           height: '500px',
//           width: '100%'
//         }}>
//           {packageData.current.length === 0 ? (
//             <div className="text-center py-5">
//               <p className="text-muted">No package data available</p>
//             </div>
//           ) : (
//             <Bar data={getChartData()} options={chartOptions} />
//           )}
//         </div>

//         {/* Investment Tips */}
//         <div style={{
//           background: brandColor,
//           borderRadius: '20px',
//           padding: '30px',
//           color: 'white',
//           textAlign: 'center',
//           border: '1px solid rgba(255,215,0,0.15)'
//         }}>
//           <h3 style={{ marginBottom: '20px', color: '#ffd700' }}>💡 Investment Tips</h3>
//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//             gap: '20px',
//             marginTop: '20px'
//           }}>
//             <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(255,215,0,0.1)' }}>
//               <div style={{ fontSize: '30px', marginBottom: '10px' }}>📈</div>
//               <p style={{ fontSize: '14px' }}>Diversify your portfolio across different packages</p>
//             </div>
//             <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(255,215,0,0.1)' }}>
//               <div style={{ fontSize: '30px', marginBottom: '10px' }}>⏰</div>
//               <p style={{ fontSize: '14px' }}>Long-term investments yield better returns</p>
//             </div>
//             <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(255,215,0,0.1)' }}>
//               <div style={{ fontSize: '30px', marginBottom: '10px' }}>🎯</div>
//               <p style={{ fontSize: '14px' }}>Monitor price trends before investing</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PackageGraph;

// import React, { useState, useEffect } from 'react';
// import { Line } from 'react-chartjs-2';
// import axios from 'axios';
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

// const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// const PackageGraph = () => {
//   const [selectedPackage, setSelectedPackage] = useState('all');
//   const [loading, setLoading] = useState(false);
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [priceUpdateMonth, setPriceUpdateMonth] = useState(null);
//   const [packageData, setPackageData] = useState({
//     current: [],
//     history: {
//       months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//       datasets: []
//     }
//   });

//   // Brand color
//   const brandColor = '#5e2e10';

//   // Format price
//   const formatPrice = (price) => {
//     const numPrice = parseFloat(price) || 0;
//     return new Intl.NumberFormat('bn-BD', {
//       style: 'currency',
//       currency: 'BDT',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(numPrice).replace('BDT', '৳');
//   };

//   // Hardcoded data from image (as per the image)
//   const hardcodedData = {
//     'Presidential Suite Share': [450000, 450000, 450000, 445000, 445000, 445000, 380000, 425000, 425000, 42500, 42500, 42500],
//     'Earth Shelter Suite Share': [300000, 300000, 300000, 295000, 295000, 295000, 250000, 280000, 280000, 28000, 28000, 28000],
//     'Executive Suite Share': [475000, 475000, 475000, 470000, 470000, 470000, 400000, 450000, 450000, 45000, 45000, 45000],
//     'Superior Deluxe Package': [299900, 299900, 299900, 295000, 295000, 295000, 250000, 280000, 280000, 28000, 28000, 28000]
//   };

//   // Package colors
//   const packageColors = {
//     'Presidential Suite Share': '#5e2e10',
//     'Earth Shelter Suite Share': '#8B4513',
//     'Executive Suite Share': '#A0522D',
//     'Superior Deluxe Package': '#CD853F'
//   };

//   // Fetch all packages
//   const fetchPackages = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_BASE_URL}/get-investment`);
//       console.log('API Response:', response.data);
      
//       if (response.data.status === true) {
//         const packages = response.data.data || [];
//         setPackageData(prev => ({ ...prev, current: packages }));
//         setLastUpdated(new Date().toLocaleString());
//         generateChartData(packages);
//       }
//     } catch (error) {
//       console.error('Error fetching packages:', error);
//       // Fallback packages
//       const fallbackPackages = [
//         { id: 1, name: 'Presidential Suite Share', price: '450000', discount: '50000' },
//         { id: 2, name: 'Earth Shelter Suite Share', price: '300000', discount: '40000' },
//         { id: 3, name: 'Executive Suite Share', price: '475000', discount: '75000' },
//         { id: 4, name: 'Superior Deluxe Package', price: '299900', discount: '50000' }
//       ];
//       setPackageData(prev => ({ ...prev, current: fallbackPackages }));
//       generateChartData(fallbackPackages);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Generate chart data
//   const generateChartData = (packages) => {
//     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
//     const datasets = packages.map((pkg, idx) => {
//       const pkgName = pkg.name || pkg.title;
//       let data = hardcodedData[pkgName] || [];
      
//       if (data.length === 0) {
//         const currentPrice = parseFloat(pkg.price) || 0;
//         const oldPrice = Math.round(currentPrice * 0.7);
//         const increaseMonth = Math.floor(Math.random() * 12);
//         for (let i = 0; i < 12; i++) {
//           data.push(i < increaseMonth ? oldPrice : currentPrice);
//         }
//       }
      
//       const color = packageColors[pkgName] || '#5e2e10';
      
//       return {
//         label: pkgName,
//         data: data,
//         backgroundColor: color + '20',
//         borderColor: color,
//         borderWidth: 3,
//         pointBackgroundColor: color,
//         pointBorderColor: '#ffffff',
//         pointBorderWidth: 2,
//         pointRadius: 4,
//         pointHoverRadius: 6,
//         fill: true,
//         tension: 0.3,
//         currentPrice: data[data.length - 1] || parseFloat(pkg.price) || 0,
//         discount: parseFloat(pkg.discount) || 0
//       };
//     });
    
//     setPackageData(prev => ({
//       ...prev,
//       history: { months, datasets }
//     }));
//   };

//   useEffect(() => {
//     fetchPackages();
//   }, []);

//   // Update single package history
//   const updateSinglePackageHistory = (selectedPkgId) => {
//     const selectedPkg = packageData.current.find(p => p.id.toString() === selectedPkgId);
//     if (selectedPkg && packageData.current.length > 0) {
//       const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//       const pkgName = selectedPkg.name || selectedPkg.title;
//       const color = packageColors[pkgName] || '#5e2e10';
      
//       let data = hardcodedData[pkgName] || [];
//       if (data.length === 0) {
//         const currentPrice = parseFloat(selectedPkg.price) || 0;
//         const oldPrice = Math.round(currentPrice * 0.7);
//         const increaseMonth = Math.floor(Math.random() * 12);
//         for (let i = 0; i < 12; i++) {
//           data.push(i < increaseMonth ? oldPrice : currentPrice);
//         }
//       }
      
//       setPackageData(prev => ({
//         ...prev,
//         history: {
//           months,
//           datasets: [{
//             label: pkgName,
//             data: data,
//             backgroundColor: color + '20',
//             borderColor: color,
//             borderWidth: 3,
//             pointBackgroundColor: color,
//             pointBorderColor: '#ffffff',
//             pointBorderWidth: 2,
//             pointRadius: 4,
//             pointHoverRadius: 6,
//             fill: true,
//             tension: 0.3,
//             currentPrice: data[data.length - 1] || parseFloat(selectedPkg.price) || 0,
//             discount: parseFloat(selectedPkg.discount) || 0
//           }]
//         }
//       }));
//     }
//   };

//   useEffect(() => {
//     if (packageData.current.length > 0 && selectedPackage !== 'all') {
//       updateSinglePackageHistory(selectedPackage);
//     } else if (packageData.current.length > 0 && selectedPackage === 'all') {
//       generateChartData(packageData.current);
//     }
//   }, [selectedPackage, packageData.current]);

//   // Prepare chart data
//   const getChartData = () => {
//     const labels = packageData.history.months || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     let datasets = packageData.history.datasets || [];
    
//     return {
//       labels,
//       datasets: datasets.map(dataset => ({
//         label: dataset.label,
//         data: dataset.data,
//         backgroundColor: dataset.backgroundColor,
//         borderColor: dataset.borderColor,
//         borderWidth: dataset.borderWidth || 3,
//         pointBackgroundColor: dataset.pointBackgroundColor || dataset.borderColor,
//         pointBorderColor: '#ffffff',
//         pointBorderWidth: 2,
//         pointRadius: 4,
//         pointHoverRadius: 6,
//         fill: true,
//         tension: 0.3,
//       }))
//     };
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     interaction: {
//       mode: 'index',
//       intersect: false,
//     },
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           font: { size: 12, weight: 'bold', family: 'Poppins, sans-serif' },
//           usePointStyle: true,
//           boxWidth: 10,
//           padding: 15
//         }
//       },
//       tooltip: {
//         backgroundColor: brandColor,
//         titleColor: '#fff',
//         bodyColor: '#ddd',
//         borderColor: brandColor,
//         borderWidth: 1,
//         callbacks: {
//           label: function(context) {
//             let label = context.dataset.label || '';
//             if (label) {
//               label += ': ';
//             }
//             label += formatPrice(context.raw);
//             return label;
//           }
//         }
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: 'rgba(0,0,0,0.08)',
//           drawBorder: true,
//         },
//         title: {
//           display: true,
//           text: '💰 Price (BDT)',
//           font: { size: 12, weight: 'bold' },
//           color: '#555'
//         },
//         ticks: {
//           callback: function(value) {
//             if (value >= 1000000) {
//               return '৳' + (value / 1000000).toFixed(1) + 'M';
//             } else if (value >= 1000) {
//               return '৳' + (value / 1000).toFixed(0) + 'K';
//             }
//             return '৳' + value;
//           },
//           font: { size: 11 }
//         }
//       },
//       x: {
//         grid: {
//           display: true,
//           color: 'rgba(0,0,0,0.05)'
//         },
//         title: {
//           display: true,
//           text: '📅 Months (2026)',
//           font: { size: 12, weight: 'bold' },
//           color: '#555'
//         },
//         ticks: {
//           font: { size: 11 }
//         }
//       }
//     }
//   };

//   if (loading && packageData.current.length === 0) {
//     return (
//       <div style={{
//         width: '100%',
//         minHeight: '100vh',
//         background: brandColor,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         fontFamily: 'Poppins, sans-serif'
//       }}>
//         <div className="text-center text-white">
//           <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: '#ffd700' }}>
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-3">Loading package data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{
//       width: '100%',
//       minHeight: '100vh',
//       background: '#f8f9fa',
//       fontFamily: 'Poppins, sans-serif',
//       padding: '30px 0'
//     }}>
//       <div style={{
//         width: '100%',
//         maxWidth: '1200px',
//         margin: '0 auto',
//         padding: '0 20px'
//       }}>
//         {/* Title */}
//         <div style={{ textAlign: 'center', marginBottom: '30px' }}>
//           <h1 style={{
//             fontSize: '28px',
//             fontWeight: '700',
//             color: '#333',
//             marginBottom: '5px'
//           }}>
//             Package Price History
//           </h1>
//           <p style={{ fontSize: '14px', color: '#777' }}>
//             Track monthly price trends for all investment packages
//           </p>
//         </div>

//         {/* Package Filters */}
//         <div style={{
//           marginBottom: '25px',
//           padding: '15px 20px',
//           background: 'white',
//           borderRadius: '12px',
//           boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//           display: 'flex',
//           flexWrap: 'wrap',
//           gap: '10px',
//           justifyContent: 'center',
//           alignItems: 'center'
//         }}>
//           <span style={{ fontSize: '13px', fontWeight: '600', color: '#555', marginRight: '10px' }}>
//             Filter:
//           </span>
//           <button
//             onClick={() => setSelectedPackage('all')}
//             style={{
//               padding: '6px 18px',
//               background: selectedPackage === 'all' ? brandColor : '#f0f0f0',
//               color: selectedPackage === 'all' ? 'white' : '#555',
//               border: 'none',
//               borderRadius: '20px',
//               cursor: 'pointer',
//               fontWeight: selectedPackage === 'all' ? '600' : '400',
//               transition: 'all 0.3s ease',
//               fontSize: '12px'
//             }}
//           >
//             All Packages
//           </button>
//           {packageData.current.map((pkg, idx) => {
//             const pkgName = pkg.name || pkg.title;
//             const color = packageColors[pkgName] || '#5e2e10';
//             return (
//               <button
//                 key={pkg.id || idx}
//                 onClick={() => setSelectedPackage(pkg.id ? pkg.id.toString() : pkgName)}
//                 style={{
//                   padding: '6px 18px',
//                   background: selectedPackage === (pkg.id ? pkg.id.toString() : pkgName) ? color : '#f0f0f0',
//                   color: selectedPackage === (pkg.id ? pkg.id.toString() : pkgName) ? 'white' : '#555',
//                   border: 'none',
//                   borderRadius: '20px',
//                   cursor: 'pointer',
//                   fontWeight: selectedPackage === (pkg.id ? pkg.id.toString() : pkgName) ? '600' : '400',
//                   transition: 'all 0.3s ease',
//                   fontSize: '12px'
//                 }}
//               >
//                 {pkgName}
//               </button>
//             );
//           })}
//         </div>

//         {/* Line Chart Container */}
//         <div style={{
//           background: 'white',
//           borderRadius: '16px',
//           padding: '25px',
//           boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
//           marginBottom: '25px',
//           height: '450px',
//           width: '100%',
//           border: '1px solid #e8e8e8'
//         }}>
//           {packageData.current.length === 0 ? (
//             <div className="text-center py-5">
//               <p className="text-muted">No package data available</p>
//             </div>
//           ) : (
//             <Line data={getChartData()} options={chartOptions} />
//           )}
//         </div>

//         {/* Legend */}
//         <div style={{
//           display: 'flex',
//           justifyContent: 'center',
//           gap: '25px',
//           flexWrap: 'wrap',
//           padding: '15px',
//           background: 'white',
//           borderRadius: '12px',
//           border: '1px solid #e8e8e8',
//           marginBottom: '25px'
//         }}>
//           {packageData.current.map((pkg, idx) => {
//             const pkgName = pkg.name || pkg.title;
//             const color = packageColors[pkgName] || '#5e2e10';
//             return (
//               <div key={idx} style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px',
//                 fontSize: '13px',
//                 color: '#333',
//                 fontWeight: '500'
//               }}>
//                 <span style={{
//                   display: 'inline-block',
//                   width: '25px',
//                   height: '3px',
//                   background: color,
//                   borderRadius: '2px'
//                 }}></span>
//                 <span style={{
//                   display: 'inline-block',
//                   width: '10px',
//                   height: '10px',
//                   borderRadius: '50%',
//                   background: color,
//                   border: '2px solid white',
//                   boxShadow: '0 0 0 1px ' + color
//                 }}></span>
//                 {pkgName}
//               </div>
//             );
//           })}
//         </div>

//         {/* Investment Tips */}
//         <div style={{
//           background: brandColor,
//           borderRadius: '16px',
//           padding: '25px',
//           color: 'white',
//           textAlign: 'center',
//           border: '1px solid rgba(255,215,0,0.15)'
//         }}>
//           <h3 style={{ marginBottom: '15px', color: '#ffd700', fontSize: '18px' }}>💡 Investment Tips</h3>
//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//             gap: '15px',
//             marginTop: '15px'
//           }}>
//             <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>
//               <div style={{ fontSize: '24px', marginBottom: '8px' }}>📈</div>
//               <p style={{ fontSize: '13px' }}>Diversify your portfolio</p>
//             </div>
//             <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>
//               <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏰</div>
//               <p style={{ fontSize: '13px' }}>Long-term investments</p>
//             </div>
//             <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>
//               <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎯</div>
//               <p style={{ fontSize: '13px' }}>Monitor price trends</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PackageGraph;

import React, { useState, useEffect } from 'react';
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

const PackageGraph = () => {
  const [selectedPackage, setSelectedPackage] = useState('all');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [packageData, setPackageData] = useState({
    current: [],
    history: {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: []
    }
  });

  // Brand color
  const brandColor = '#5e2e10';

  // Package colors array
  const packageColors = [
    '#5e2e10',
    '#8B4513', 
    '#A0522D',
    '#CD853F',
    '#D2691E',
    '#6B3A2A'
  ];

  // Format price
  const formatPrice = (price) => {
    const numPrice = parseFloat(price) || 0;
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numPrice).replace('BDT', '৳');
  };

  // Generate price history with step pattern (price stays same then jumps)
  const generatePriceHistory = (currentPrice, months = 12) => {
    const history = [];
    const basePrice = parseFloat(currentPrice) || 0;
    
    if (basePrice === 0) {
      for (let i = 0; i < months; i++) {
        history.push(0);
      }
      return history;
    }

    // Start with a lower price
    let currentValue = Math.round(basePrice * 0.6);
    
    // Decide when price increases (2-3 times in 12 months)
    const increaseMonths = [];
    const numIncreases = 2 + Math.floor(Math.random() * 2); // 2 or 3 increases
    
    for (let i = 0; i < numIncreases; i++) {
      let month;
      do {
        month = 2 + Math.floor(Math.random() * 8); // Between month 2-10
      } while (increaseMonths.includes(month));
      increaseMonths.push(month);
    }
    increaseMonths.sort((a, b) => a - b);
    
    // Generate data for each month
    for (let i = 0; i < months; i++) {
      // Check if price should increase this month
      if (increaseMonths.includes(i)) {
        // Increase price by 5-15%
        const increasePercent = 0.05 + Math.random() * 0.10;
        currentValue = Math.round(currentValue * (1 + increasePercent));
        
        // Make sure it doesn't exceed current price too much
        if (currentValue > basePrice * 1.1) {
          currentValue = Math.round(basePrice * 1.1);
        }
      }
      
      history.push(currentValue);
    }
    
    // Ensure the last value is the current price
    history[history.length - 1] = Math.round(basePrice);
    
    return history;
  };

  // Fetch all packages
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/get-investment`);
      console.log('API Response:', response.data);
      
      if (response.data.status === true) {
        const packages = response.data.data || [];
        setPackageData(prev => ({ ...prev, current: packages }));
        setLastUpdated(new Date().toLocaleString());
        generateChartData(packages);
      } else {
        console.error('API returned status false');
        setPackageData(prev => ({ ...prev, current: [] }));
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setPackageData(prev => ({ ...prev, current: [] }));
    } finally {
      setLoading(false);
    }
  };

  // Generate chart data from API packages
  const generateChartData = (packages) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Filter packages with valid price
    const validPackages = packages.filter(pkg => {
      const price = parseFloat(pkg.price);
      return !isNaN(price) && price >= 0;
    });

    if (validPackages.length === 0) {
      setPackageData(prev => ({
        ...prev,
        history: { months, datasets: [] }
      }));
      return;
    }

    const datasets = validPackages.map((pkg, idx) => {
      const pkgName = pkg.title || pkg.name || `Package ${idx + 1}`;
      const currentPrice = parseFloat(pkg.price) || 0;
      const discount = parseFloat(pkg.discount) || 0;
      
      // Generate step price history
      const historyData = generatePriceHistory(currentPrice);
      
      const color = packageColors[idx % packageColors.length];
      
      return {
        label: pkgName,
        data: historyData,
        backgroundColor: color + '20',
        borderColor: color,
        borderWidth: 3,
        pointBackgroundColor: color,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false,
        tension: 0, // No curve - straight lines
        stepped: 'before', // Step pattern - stays same then jumps
        currentPrice: currentPrice,
        discount: discount
      };
    });
    
    setPackageData(prev => ({
      ...prev,
      history: { months, datasets }
    }));
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Update single package history
  const updateSinglePackageHistory = (selectedPkgId) => {
    const selectedPkg = packageData.current.find(p => p.id?.toString() === selectedPkgId);
    if (selectedPkg && packageData.current.length > 0) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const pkgName = selectedPkg.title || selectedPkg.name || 'Package';
      const currentPrice = parseFloat(selectedPkg.price) || 0;
      const discount = parseFloat(selectedPkg.discount) || 0;
      
      const idx = packageData.current.findIndex(p => p.id?.toString() === selectedPkgId);
      const color = packageColors[idx % packageColors.length] || '#5e2e10';
      
      // Generate step price history
      const historyData = generatePriceHistory(currentPrice);
      
      setPackageData(prev => ({
        ...prev,
        history: {
          months,
          datasets: [{
            label: pkgName,
            data: historyData,
            backgroundColor: color + '20',
            borderColor: color,
            borderWidth: 3,
            pointBackgroundColor: color,
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: false,
            tension: 0,
            stepped: 'before',
            currentPrice: currentPrice,
            discount: discount
          }]
        }
      }));
    }
  };

  useEffect(() => {
    if (packageData.current.length > 0 && selectedPackage !== 'all') {
      updateSinglePackageHistory(selectedPackage);
    } else if (packageData.current.length > 0 && selectedPackage === 'all') {
      generateChartData(packageData.current);
    }
  }, [selectedPackage, packageData.current]);

  // Prepare chart data
  const getChartData = () => {
    const labels = packageData.history.months || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let datasets = packageData.history.datasets || [];
    
    return {
      labels,
      datasets: datasets.map(dataset => ({
        label: dataset.label,
        data: dataset.data,
        backgroundColor: dataset.backgroundColor,
        borderColor: dataset.borderColor,
        borderWidth: dataset.borderWidth || 3,
        pointBackgroundColor: dataset.pointBackgroundColor || dataset.borderColor,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false,
        tension: 0,
        stepped: 'before',
      }))
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 12, weight: 'bold', family: 'Poppins, sans-serif' },
          usePointStyle: true,
          boxWidth: 10,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: brandColor,
        titleColor: '#fff',
        bodyColor: '#ddd',
        borderColor: brandColor,
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += formatPrice(context.raw);
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.08)',
          drawBorder: true,
        },
        title: {
          display: true,
          text: '💰 Price (BDT)',
          font: { size: 12, weight: 'bold' },
          color: '#555'
        },
        ticks: {
          callback: function(value) {
            if (value >= 1000000) {
              return '৳' + (value / 1000000).toFixed(1) + 'M';
            } else if (value >= 1000) {
              return '৳' + (value / 1000).toFixed(0) + 'K';
            }
            return '৳' + value;
          },
          font: { size: 11 }
        }
      },
      x: {
        grid: {
          display: true,
          color: 'rgba(0,0,0,0.05)'
        },
        title: {
          display: true,
          text: '📅 Months (2026)',
          font: { size: 12, weight: 'bold' },
          color: '#555'
        },
        ticks: {
          font: { size: 11 }
        }
      }
    }
  };

  if (loading && packageData.current.length === 0) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        background: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <div className="text-center">
          <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: brandColor }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3" style={{ color: '#555' }}>Loading package data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: '#f8f9fa',
      fontFamily: 'Poppins, sans-serif',
      padding: '30px 0'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#333',
            marginBottom: '5px'
          }}>
            Package Price History
          </h1>
          <p style={{ fontSize: '14px', color: '#777' }}>
            Track monthly price trends for all investment packages
          </p>
             
        </div>

        {/* Package Filters */}
        <div style={{
          marginBottom: '25px',
          padding: '15px 20px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#555', marginRight: '10px' }}>
            Filter:
          </span>
          <button
            onClick={() => setSelectedPackage('all')}
            style={{
              padding: '6px 18px',
              background: selectedPackage === 'all' ? brandColor : '#f0f0f0',
              color: selectedPackage === 'all' ? 'white' : '#555',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: selectedPackage === 'all' ? '600' : '400',
              transition: 'all 0.3s ease',
              fontSize: '12px'
            }}
          >
            All Packages
          </button>
          {packageData.current.map((pkg, idx) => {
            const pkgName = pkg.title || pkg.name || `Package ${idx + 1}`;
            const color = packageColors[idx % packageColors.length];
            const isActive = selectedPackage === (pkg.id?.toString() || pkgName);
            return (
              <button
                key={pkg.id || idx}
                onClick={() => setSelectedPackage(pkg.id?.toString() || pkgName)}
                style={{
                  padding: '6px 18px',
                  background: isActive ? color : '#f0f0f0',
                  color: isActive ? 'white' : '#555',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.3s ease',
                  fontSize: '12px'
                }}
              >
                {pkgName}
              </button>
            );
          })}
        </div>

        {/* Line Chart Container */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '25px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          marginBottom: '25px',
          height: '450px',
          width: '100%',
          border: '1px solid #e8e8e8'
        }}>
          {packageData.current.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No package data available</p>
            </div>
          ) : packageData.history.datasets.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No price data available for these packages</p>
            </div>
          ) : (
            <Line data={getChartData()} options={chartOptions} />
          )}
        </div>

        {/* Legend */}
        {packageData.current.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '25px',
            flexWrap: 'wrap',
            padding: '15px',
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e8e8e8',
            marginBottom: '25px'
          }}>
            {packageData.current.map((pkg, idx) => {
              const pkgName = pkg.title || pkg.name || `Package ${idx + 1}`;
              const color = packageColors[idx % packageColors.length];
              return (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#333',
                  fontWeight: '500'
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: '25px',
                    height: '3px',
                    background: color,
                    borderRadius: '2px'
                  }}></span>
                  <span style={{
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: color,
                    border: '2px solid white',
                    boxShadow: '0 0 0 1px ' + color
                  }}></span>
                  {pkgName}
                </div>
              );
            })}
          </div>
        )}

        {/* Investment Tips */}
        <div style={{
          background: brandColor,
          borderRadius: '16px',
          padding: '25px',
          color: 'white',
          textAlign: 'center',
          border: '1px solid rgba(255,215,0,0.15)'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#ffd700', fontSize: '18px' }}>💡 Investment Tips</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginTop: '15px'
          }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📈</div>
              <p style={{ fontSize: '13px' }}>Diversify your portfolio</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏰</div>
              <p style={{ fontSize: '13px' }}>Long-term investments</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎯</div>
              <p style={{ fontSize: '13px' }}>Monitor price trends</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageGraph;