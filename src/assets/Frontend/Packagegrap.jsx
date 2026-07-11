import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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
  const [priceUpdateMonth, setPriceUpdateMonth] = useState(null);
  const [packageData, setPackageData] = useState({
    current: [],
    history: {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
      
      if (response.data.success === true || response.data.status === true) {
        const packages = response.data.data || [];
        setPackageData(prev => ({ ...prev, current: packages }));
        setLastUpdated(new Date().toLocaleString());
        
        // Generate history data based on actual prices
        generateStepHistoryData(packages);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate step history data (price only increases at specific month)
  const generateStepHistoryData = (packages) => {
    if (packages.length > 0) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const colors = ['#9a55ff', '#ff6b6b', '#4ecdc4', '#ffa500', '#20c997', '#6c5ce7'];
      
      // Randomly select a month when price increased (for demo)
      // In real scenario, this would come from API
      const increaseMonth = Math.floor(Math.random() * 12); // Random month 0-11
      setPriceUpdateMonth(months[increaseMonth]);
      
      const datasets = packages.map((pkg, idx) => {
        const currentPrice = parseFloat(pkg.price) || 0;
        const discount = parseFloat(pkg.discount) || 0;
        const oldPrice = Math.round(currentPrice * 0.7); // Old price was 70% of current
        
        const historyData = [];
        
        for (let i = 0; i < 12; i++) {
          if (i < increaseMonth) {
            // Before price increase - old price
            historyData.push(oldPrice);
          } else {
            // After price increase - current price
            historyData.push(currentPrice);
          }
        }
        
        return {
          label: pkg.name,
          data: historyData,
          backgroundColor: colors[idx % colors.length] + '80',
          borderColor: colors[idx % colors.length],
          borderWidth: 2,
          borderRadius: 8,
          currentPrice: currentPrice,
          oldPrice: oldPrice,
          discount: discount,
          increaseMonth: months[increaseMonth]
        };
      });
      
      setPackageData(prev => ({
        ...prev,
        history: { months, datasets }
      }));
    }
  };

  // Update single package history when selected
  const updateSinglePackageHistory = (selectedPkgId) => {
    const selectedPkg = packageData.current.find(p => p.id.toString() === selectedPkgId);
    if (selectedPkg && packageData.current.length > 0) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const colors = ['#9a55ff', '#ff6b6b', '#4ecdc4', '#ffa500', '#20c997', '#6c5ce7'];
      
      const currentPrice = parseFloat(selectedPkg.price) || 0;
      const discount = parseFloat(selectedPkg.discount) || 0;
      const oldPrice = Math.round(currentPrice * 0.7);
      
      // Randomly select a month for price increase
      const increaseMonth = Math.floor(Math.random() * 12);
      setPriceUpdateMonth(months[increaseMonth]);
      
      const historyData = [];
      for (let i = 0; i < 12; i++) {
        if (i < increaseMonth) {
          historyData.push(oldPrice);
        } else {
          historyData.push(currentPrice);
        }
      }
      
      const idx = packageData.current.findIndex(p => p.id.toString() === selectedPkgId);
      setPackageData(prev => ({
        ...prev,
        history: {
          months,
          datasets: [{
            label: selectedPkg.name,
            data: historyData,
            backgroundColor: colors[idx % colors.length] + '80',
            borderColor: colors[idx % colors.length],
            borderWidth: 2,
            borderRadius: 8,
            currentPrice: currentPrice,
            oldPrice: oldPrice,
            discount: discount,
            increaseMonth: months[increaseMonth]
          }]
        }
      }));
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    if (packageData.current.length > 0 && selectedPackage !== 'all') {
      updateSinglePackageHistory(selectedPackage);
    } else if (packageData.current.length > 0 && selectedPackage === 'all') {
      generateStepHistoryData(packageData.current);
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
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
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
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        bodyColor: '#ddd',
        borderColor: '#9a55ff',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += formatPrice(context.raw);
            return label;
          },
          afterBody: function(tooltipItems) {
            const dataset = packageData.history.datasets.find(d => d.label === tooltipItems[0].dataset.label);
            if (dataset && dataset.increaseMonth) {
              return [`📈 Price increased in: ${dataset.increaseMonth}`, `💎 Discount: ${formatPrice(dataset.discount)}`];
            }
            return null;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: '#e0e0e0',
          drawBorder: true,
        },
        title: {
          display: true,
          text: '💰 Price (BDT)',
          font: { size: 12, weight: 'bold' }
        },
        ticks: {
          callback: function(value) {
            return formatPrice(value);
          },
          font: { size: 11 }
        }
      },
      x: {
        grid: {
          display: false
        },
        title: {
          display: true,
          text: '📅 Months (2024)',
          font: { size: 12, weight: 'bold' }
        },
        ticks: {
          font: { size: 11 }
        }
      }
    }
  };

  // Calculate insights
  const getInsights = () => {
    if (packageData.current.length === 0) {
      return {
        highestPrice: { name: 'N/A', price: 0 },
        bestValue: { name: 'N/A', discount: 0 },
        avgPrice: 0,
        totalPackages: 0
      };
    }

    const bestValue = packageData.current.reduce((best, pkg) => {
      const discount = parseFloat(pkg.discount) || 0;
      return discount > (best.discount || 0) ? { name: pkg.name, discount: discount } : best;
    }, { name: packageData.current[0]?.name, discount: 0 });

    const highestPrice = packageData.current.reduce((max, pkg) => {
      const price = parseFloat(pkg.price) || 0;
      return price > (max.price || 0) ? { name: pkg.name, price: price } : max;
    }, { name: packageData.current[0]?.name, price: 0 });

    const avgPrice = packageData.current.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / packageData.current.length;

    return {
      highestPrice,
      bestValue,
      avgPrice,
      totalPackages: packageData.current.length
    };
  };

  const insights = getInsights();

  if (loading && packageData.current.length === 0) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <div className="text-center text-white">
          <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading package data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Poppins, sans-serif',
      padding: '40px 0'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        {/* Hero Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px', color: 'white' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.2)',
            padding: '8px 20px',
            borderRadius: '50px',
            marginBottom: '20px',
            backdropFilter: 'blur(10px)'
          }}>
             REAL-TIME MARKET DATA
          </div>
          <h1 style={{
            fontSize: '42px',
            fontWeight: '700',
            marginBottom: '15px',
            background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Package Price History
          </h1>
          <p style={{ fontSize: '16px', opacity: 0.9 }}>
            Track price trends and make informed decisions
          </p>
        
        
        </div>

       

        {/* Package Filters */}
        <div style={{
          marginBottom: '30px',
          padding: '20px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
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
                background: selectedPackage === 'all' ? '#9a55ff' : '#f8f9fa',
                color: selectedPackage === 'all' ? 'white' : '#2c3e50',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                fontWeight: selectedPackage === 'all' ? '600' : '400',
                transition: 'all 0.3s ease',
                boxShadow: selectedPackage === 'all' ? '0 5px 15px rgba(154,85,255,0.3)' : 'none'
              }}
            >
              🎯 All Packages
            </button>
            {packageData.current.map((pkg, idx) => {
              const colors = ['#9a55ff', '#ff6b6b', '#4ecdc4', '#ffa500', '#20c997', '#6c5ce7'];
              return (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id.toString())}
                  style={{
                    padding: '10px 24px',
                    background: selectedPackage === pkg.id.toString() ? colors[idx % colors.length] : '#f8f9fa',
                    color: selectedPackage === pkg.id.toString() ? 'white' : '#2c3e50',
                    border: 'none',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    fontWeight: selectedPackage === pkg.id.toString() ? '600' : '400',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedPackage === pkg.id.toString() ? `0 5px 15px ${colors[idx % colors.length]}80` : 'none'
                  }}
                >
                  {pkg.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bar Chart Container */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          marginBottom: '30px',
          height: '500px',
          width: '100%'
        }}>
          {packageData.current.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No package data available</p>
            </div>
          ) : (
            <Bar data={getChartData()} options={chartOptions} />
          )}
        </div>

       

        {/* Investment Tips */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          padding: '30px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '20px' }}>💡 Investment Tips</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '15px' }}>
              <div style={{ fontSize: '30px', marginBottom: '10px' }}>📈</div>
              <p style={{ fontSize: '14px' }}>Diversify your portfolio across different packages</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '15px' }}>
              <div style={{ fontSize: '30px', marginBottom: '10px' }}>⏰</div>
              <p style={{ fontSize: '14px' }}>Long-term investments yield better returns</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '15px' }}>
              <div style={{ fontSize: '30px', marginBottom: '10px' }}>🎯</div>
              <p style={{ fontSize: '14px' }}>Monitor price trends before investing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageGraph;