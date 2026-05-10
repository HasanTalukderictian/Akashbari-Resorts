import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PackageGraph = () => {
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'line'
  const [selectedPackage, setSelectedPackage] = useState('all');

  // Package Data
  const packageData = {
    current: [
      { id: 1, name: "Superior Deluxe Package", price: 350000, discount: 50000, finalPrice: 300000, color: '#9a55ff' },
      { id: 2, name: "Executive Suite Share", price: 475000, discount: 75000, finalPrice: 400000, color: '#ff6b6b' },
      { id: 3, name: "Earth Shelter Suite Share", price: 599900, discount: 0, finalPrice: 599900, color: '#4ecdc4' },
      { id: 4, name: "Presidential Suite Share", price: 699000, discount: 100000, finalPrice: 599000, color: '#f9ca24' }
    ],
    previous: [
      { id: 1, name: "Superior Deluxe Package", price: 300000 },
      { id: 2, name: "Executive Suite Share", price: 450000 },
      { id: 3, name: "Earth Shelter Suite Share", price: 550900 },
      { id: 4, name: "Presidential Suite Share", price: 600000 }
    ],
    history: {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      superior: [280000, 285000, 290000, 300000, 320000, 350000],
      executive: [420000, 430000, 440000, 450000, 460000, 475000],
      earth: [520000, 530000, 540000, 550900, 560000, 599900],
      presidential: [550000, 560000, 580000, 600000, 620000, 699000]
    }
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

  // Prepare chart data
  const getChartData = () => {
    const labels = packageData.history.months;
    
    if (selectedPackage === 'all') {
      return {
        labels,
        datasets: [
          {
            label: 'Superior Deluxe Package',
            data: packageData.history.superior,
            borderColor: '#9a55ff',
            backgroundColor: chartType === 'bar' ? 'rgba(154, 85, 255, 0.5)' : 'rgba(154, 85, 255, 0.1)',
            borderWidth: 2,
            fill: chartType === 'line',
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Executive Suite Share',
            data: packageData.history.executive,
            borderColor: '#ff6b6b',
            backgroundColor: chartType === 'bar' ? 'rgba(255, 107, 107, 0.5)' : 'rgba(255, 107, 107, 0.1)',
            borderWidth: 2,
            fill: chartType === 'line',
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Earth Shelter Suite Share',
            data: packageData.history.earth,
            borderColor: '#4ecdc4',
            backgroundColor: chartType === 'bar' ? 'rgba(78, 205, 196, 0.5)' : 'rgba(78, 205, 196, 0.1)',
            borderWidth: 2,
            fill: chartType === 'line',
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Presidential Suite Share',
            data: packageData.history.presidential,
            borderColor: '#f9ca24',
            backgroundColor: chartType === 'bar' ? 'rgba(249, 202, 36, 0.5)' : 'rgba(249, 202, 36, 0.1)',
            borderWidth: 2,
            fill: chartType === 'line',
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
          }
        ]
      };
    } else {
      // Single package view
      let data, label, color;
      switch(selectedPackage) {
        case 'superior':
          data = packageData.history.superior;
          label = 'Superior Deluxe Package';
          color = '#9a55ff';
          break;
        case 'executive':
          data = packageData.history.executive;
          label = 'Executive Suite Share';
          color = '#ff6b6b';
          break;
        case 'earth':
          data = packageData.history.earth;
          label = 'Earth Shelter Suite Share';
          color = '#4ecdc4';
          break;
        case 'presidential':
          data = packageData.history.presidential;
          label = 'Presidential Suite Share';
          color = '#f9ca24';
          break;
        default:
          data = packageData.history.superior;
          label = 'Superior Deluxe Package';
          color = '#9a55ff';
      }
      
      return {
        labels: packageData.history.months,
        datasets: [{
          label: label,
          data: data,
          borderColor: color,
          backgroundColor: chartType === 'bar' ? color + '80' : color + '20',
          borderWidth: 3,
          fill: chartType === 'line',
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: color,
        }]
      };
    }
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

  // Calculate statistics
  const getPriceChange = (current, previous) => {
    const change = current - previous;
    const percentage = (change / previous) * 100;
    return { change, percentage };
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '5px auto',
      padding: '20px',
      fontFamily: 'Poppins, sans-serif'
    }}>
      {/* Header Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
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

     

      {/* Chart Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px',
        marginBottom: '30px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setChartType('bar')}
            style={{
              padding: '8px 20px',
              backgroundColor: chartType === 'bar' ? '#9a55ff' : '#fff',
              color: chartType === 'bar' ? '#fff' : '#2c3e50',
              border: `1px solid ${chartType === 'bar' ? '#9a55ff' : '#ddd'}`,
              borderRadius: '25px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="bi bi-bar-chart"></i> Bar Chart
          </button>
          <button
            onClick={() => setChartType('line')}
            style={{
              padding: '8px 20px',
              backgroundColor: chartType === 'line' ? '#9a55ff' : '#fff',
              color: chartType === 'line' ? '#fff' : '#2c3e50',
              border: `1px solid ${chartType === 'line' ? '#9a55ff' : '#ddd'}`,
              borderRadius: '25px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="bi bi-graph-up"></i> Line Chart
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedPackage('all')}
            style={{
              padding: '8px 20px',
              backgroundColor: selectedPackage === 'all' ? '#9a55ff' : '#fff',
              color: selectedPackage === 'all' ? '#fff' : '#2c3e50',
              border: `1px solid ${selectedPackage === 'all' ? '#9a55ff' : '#ddd'}`,
              borderRadius: '25px',
              cursor: 'pointer'
            }}
          >
            All Packages
          </button>
          <button
            onClick={() => setSelectedPackage('superior')}
            style={{
              padding: '8px 20px',
              backgroundColor: selectedPackage === 'superior' ? '#9a55ff' : '#fff',
              color: selectedPackage === 'superior' ? '#fff' : '#2c3e50',
              border: `1px solid ${selectedPackage === 'superior' ? '#9a55ff' : '#ddd'}`,
              borderRadius: '25px',
              cursor: 'pointer'
            }}
          >
            Superior Deluxe
          </button>
          <button
            onClick={() => setSelectedPackage('executive')}
            style={{
              padding: '8px 20px',
              backgroundColor: selectedPackage === 'executive' ? '#ff6b6b' : '#fff',
              color: selectedPackage === 'executive' ? '#fff' : '#2c3e50',
              border: `1px solid ${selectedPackage === 'executive' ? '#ff6b6b' : '#ddd'}`,
              borderRadius: '25px',
              cursor: 'pointer'
            }}
          >
            Executive Suite
          </button>
          <button
            onClick={() => setSelectedPackage('earth')}
            style={{
              padding: '8px 20px',
              backgroundColor: selectedPackage === 'earth' ? '#4ecdc4' : '#fff',
              color: selectedPackage === 'earth' ? '#fff' : '#2c3e50',
              border: `1px solid ${selectedPackage === 'earth' ? '#4ecdc4' : '#ddd'}`,
              borderRadius: '25px',
              cursor: 'pointer'
            }}
          >
            Earth Shelter
          </button>
          <button
            onClick={() => setSelectedPackage('presidential')}
            style={{
              padding: '8px 20px',
              backgroundColor: selectedPackage === 'presidential' ? '#f9ca24' : '#fff',
              color: selectedPackage === 'presidential' ? '#2c3e50' : '#2c3e50',
              border: `1px solid ${selectedPackage === 'presidential' ? '#f9ca24' : '#ddd'}`,
              borderRadius: '25px',
              cursor: 'pointer'
            }}
          >
            Presidential Suite
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
        marginBottom: '30px',
        height: '500px'
      }}>
        <Line data={getChartData()} options={chartOptions} />
      </div>

      {/* Summary Statistics */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
      }}>
        <h4 style={{
          marginBottom: '20px',
          color: '#2c3e50'
        }}>
          <i className="bi bi-info-circle" style={{ color: '#9a55ff', marginRight: '10px' }}></i>
          Key Insights
        </h4>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
            <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Highest Price Increase</span>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#e74c3c' }}>
              Presidential Suite
            </div>
            <span style={{ fontSize: '12px', color: '#27ae60' }}>+16.5% from last month</span>
          </div>
          
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
            <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Best Value Package</span>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#9a55ff' }}>
              Superior Deluxe
            </div>
            <span style={{ fontSize: '12px', color: '#7f8c8d' }}>With 14% discount</span>
          </div>
          
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
            <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Most Popular</span>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff6b6b' }}>
              Executive Suite
            </div>
            <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Highest booking rate</span>
          </div>
          
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
            <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Price Stability</span>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4ecdc4' }}>
              Earth Shelter
            </div>
            <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Steady price increase</span>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default PackageGraph;