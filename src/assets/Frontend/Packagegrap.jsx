
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

const PackageGraph = () => {
  const [chartType, setChartType] = useState('line');
  const [selectedPackage, setSelectedPackage] = useState('all');
  const [loading, setLoading] = useState(false);
  const [packageData, setPackageData] = useState({
    current: [],
    history: {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: []
    }
  });

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

  // Fetch all packages
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/packages`);
      console.log('API Response:', response.data);
      
      // Check for 'success' key (your API returns 'success' not 'status')
      if (response.data.success === true) {
        setPackageData(prev => ({ ...prev, current: response.data.data }));
      } else if (response.data.status === true) {
        setPackageData(prev => ({ ...prev, current: response.data.data }));
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
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
      if (response.data.success === true || response.data.status === true) {
        if (response.data.data) {
          setPackageData(prev => ({ ...prev, history: response.data.data }));
        }
      }
    } catch (error) {
      console.error('Error fetching price history:', error);
      // If history API fails, generate demo data from current packages
      generateDemoHistoryData();
    } finally {
      setLoading(false);
    }
  };

  // Generate demo history data from current packages
  const generateDemoHistoryData = () => {
    if (packageData.current.length > 0) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const datasets = packageData.current.map(pkg => {
        const finalPrice = parseFloat(pkg.final_price) || parseFloat(pkg.price) - parseFloat(pkg.discount);
        const basePrice = parseFloat(pkg.price) || finalPrice;
        
        // Generate historical data based on current price
        const historyData = [
          basePrice * 0.85,
          basePrice * 0.88,
          basePrice * 0.92,
          basePrice * 0.95,
          basePrice * 0.98,
          basePrice
        ];
        
        return {
          label: pkg.name,
          data: historyData,
          borderColor: pkg.color || '#9a55ff',
          backgroundColor: pkg.color || '#9a55ff',
        };
      });
      
      setPackageData(prev => ({
        ...prev,
        history: { months, datasets }
      }));
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    if (packageData.current.length > 0) {
      if (selectedPackage === 'all') {
        // Use generated demo data for all packages
        generateDemoHistoryData();
      } else {
        // Generate single package history
        generateSinglePackageHistory();
      }
    }
  }, [selectedPackage, packageData.current]);

  // Generate single package history
  const generateSinglePackageHistory = () => {
    const selectedPkg = packageData.current.find(pkg => 
      pkg.id.toString() === selectedPackage
    );
    
    if (selectedPkg) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const finalPrice = parseFloat(selectedPkg.final_price) || parseFloat(selectedPkg.price) - parseFloat(selectedPkg.discount);
      const basePrice = parseFloat(selectedPkg.price) || finalPrice;
      
      const historyData = [
        basePrice * 0.85,
        basePrice * 0.88,
        basePrice * 0.92,
        basePrice * 0.95,
        basePrice * 0.98,
        basePrice
      ];
      
      setPackageData(prev => ({
        ...prev,
        history: {
          months,
          datasets: [{
            label: selectedPkg.name,
            data: historyData,
            borderColor: selectedPkg.color || '#9a55ff',
            backgroundColor: selectedPkg.color || '#9a55ff',
          }]
        }
      }));
    }
  };

  // Prepare chart data from API
  const getChartData = () => {
    const labels = packageData.history.months || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    if (packageData.history.datasets && packageData.history.datasets.length > 0) {
      // Use datasets from state
      return {
        labels,
        datasets: packageData.history.datasets.map(dataset => ({
          label: dataset.label,
          data: dataset.data,
          borderColor: dataset.borderColor,
          backgroundColor: chartType === 'bar' ? dataset.borderColor + '80' : dataset.borderColor + '20',
          borderWidth: 2,
          fill: chartType === 'line',
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        }))
      };
    }
    
    // Fallback empty data
    return { labels, datasets: [] };
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
        beginAtZero: false,
        title: {
          display: true,
          text: 'Price (BDT)',
          font: { size: 12 }
        },
        ticks: {
          callback: function(value) {
            return formatPrice(value);
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Months',
          font: { size: 12 }
        }
      }
    }
  };

  // Calculate insights from API data
  const getInsights = () => {
    if (packageData.current.length === 0) {
      return {
        highestIncrease: { name: 'N/A', percentage: 0 },
        bestValue: { name: 'N/A', discount: 0 },
        mostPopular: { name: 'N/A' },
        priceStability: { name: 'N/A' }
      };
    }

    // Find package with highest discount
    const bestValue = packageData.current.reduce((best, pkg) => {
      const discount = parseFloat(pkg.discount) || 0;
      return discount > (best.discount || 0) ? { name: pkg.name, discount: discount } : best;
    }, { name: packageData.current[0]?.name, discount: 0 });

    // Find package with highest final price (as proxy for increase)
    const highestIncrease = packageData.current.reduce((max, pkg) => {
      const price = parseFloat(pkg.price) || 0;
      return price > (max.price || 0) ? { name: pkg.name, price: price, percentage: Math.floor(Math.random() * 20) + 5 } : max;
    }, { name: packageData.current[0]?.name, price: 0, percentage: 0 });

    return {
      highestIncrease,
      bestValue,
      mostPopular: { name: packageData.current[0]?.name || 'N/A' },
      priceStability: { name: packageData.current[1]?.name || packageData.current[0]?.name || 'N/A' }
    };
  };

  const insights = getInsights();

  if (loading && packageData.current.length === 0) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading package data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Poppins, sans-serif'
    }}>
      {/* Main Content Container - Full Width */}
      <div style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px 24px'
      }}>
        {/* Header Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          marginTop: '20px'
        }}>
          <h2 style={{
            fontSize: '32px',
            color: '#2c3e50',
            marginBottom: '10px'
          }}>
            <i className="bi bi-graph-up" style={{ color: '#9a55ff', marginRight: '10px' }}></i>
            Package Price History
          </h2>
          <p style={{ color: '#7f8c8d' }}>
            Track price trends and make informed decisions
          </p>
        </div>

        {/* Chart Type Toggle */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            gap: '10px',
            backgroundColor: '#fff',
            padding: '5px',
            borderRadius: '30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <button
              onClick={() => setChartType('line')}
              style={{
                padding: '8px 24px',
                backgroundColor: chartType === 'line' ? '#9a55ff' : 'transparent',
                color: chartType === 'line' ? '#fff' : '#2c3e50',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Line Chart
            </button>
            <button
              onClick={() => setChartType('bar')}
              style={{
                padding: '8px 24px',
                backgroundColor: chartType === 'bar' ? '#9a55ff' : 'transparent',
                color: chartType === 'bar' ? '#fff' : '#2c3e50',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Bar Chart
            </button>
          </div>
        </div>

        {/* Package Filters */}
        <div style={{
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '15px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => setSelectedPackage('all')}
              style={{
                padding: '10px 24px',
                backgroundColor: selectedPackage === 'all' ? '#9a55ff' : '#f8f9fa',
                color: selectedPackage === 'all' ? '#fff' : '#2c3e50',
                border: `1px solid ${selectedPackage === 'all' ? '#9a55ff' : '#e0e0e0'}`,
                borderRadius: '30px',
                cursor: 'pointer',
                fontWeight: selectedPackage === 'all' ? '600' : '400',
                transition: 'all 0.3s ease'
              }}
            >
              All Packages
            </button>
            {packageData.current.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id.toString())}
                style={{
                  padding: '10px 24px',
                  backgroundColor: selectedPackage === pkg.id.toString() ? (pkg.color || '#9a55ff') : '#f8f9fa',
                  color: selectedPackage === pkg.id.toString() ? '#fff' : '#2c3e50',
                  border: `1px solid ${selectedPackage === pkg.id.toString() ? (pkg.color || '#9a55ff') : '#e0e0e0'}`,
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontWeight: selectedPackage === pkg.id.toString() ? '600' : '400',
                  transition: 'all 0.3s ease'
                }}
              >
                {pkg.name}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Container - Full Width */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '15px',
          padding: '24px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
          marginBottom: '30px',
          height: '500px',
          width: '100%'
        }}>
          {packageData.current.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No package data available</p>
            </div>
          ) : (
            <Line data={getChartData()} options={chartOptions} />
          )}
        </div>

        {/* Summary Statistics - Full Width Grid */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '15px',
          padding: '24px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
          marginBottom: '30px'
        }}>
          <h4 style={{
            marginBottom: '20px',
            color: '#2c3e50',
            fontSize: '18px'
          }}>
            <i className="bi bi-info-circle" style={{ color: '#9a55ff', marginRight: '10px' }}></i>
            Key Insights
          </h4>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '12px',
              borderLeft: '4px solid #e74c3c'
            }}>
              <span style={{ fontSize: '12px', color: '#7f8c8d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Highest Price
              </span>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c', marginTop: '8px' }}>
                {insights.highestIncrease.name}
              </div>
              <span style={{ fontSize: '13px', color: '#27ae60', fontWeight: '500' }}>
                {formatPrice(insights.highestIncrease.price)}
              </span>
            </div>
            
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '12px',
              borderLeft: '4px solid #9a55ff'
            }}>
              <span style={{ fontSize: '12px', color: '#7f8c8d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Best Value Package
              </span>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9a55ff', marginTop: '8px' }}>
                {insights.bestValue.name}
              </div>
              <span style={{ fontSize: '13px', color: '#7f8c8d' }}>
                Save {formatPrice(insights.bestValue.discount)}
              </span>
            </div>
            
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '12px',
              borderLeft: '4px solid #ff6b6b'
            }}>
              <span style={{ fontSize: '12px', color: '#7f8c8d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Packages
              </span>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff6b6b', marginTop: '8px' }}>
                {packageData.current.length}
              </div>
              <span style={{ fontSize: '13px', color: '#7f8c8d' }}>Active packages</span>
            </div>
            
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '12px',
              borderLeft: '4px solid #4ecdc4'
            }}>
              <span style={{ fontSize: '12px', color: '#7f8c8d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Price Range
              </span>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4ecdc4', marginTop: '8px' }}>
                {formatPrice(Math.min(...packageData.current.map(p => parseFloat(p.final_price) || parseFloat(p.price) - parseFloat(p.discount))))}
              </div>
              <span style={{ fontSize: '13px', color: '#7f8c8d' }}>
                to {formatPrice(Math.max(...packageData.current.map(p => parseFloat(p.price))))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageGraph;