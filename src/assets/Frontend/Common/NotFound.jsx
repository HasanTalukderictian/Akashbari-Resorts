import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Poppins', 'Segoe UI', sans-serif"
    },
    card: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '30px',
      padding: '60px 40px',
      textAlign: 'center',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      maxWidth: '600px',
      width: '100%',
      animation: 'slideIn 0.5s ease-out',
      backdropFilter: 'blur(10px)'
    },
    errorCode: {
      fontSize: '180px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '20px',
      lineHeight: '1',
      textShadow: '2px 2px 10px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#2d3748',
      marginBottom: '15px'
    },
    message: {
      fontSize: '18px',
      color: '#718096',
      marginBottom: '30px',
      lineHeight: '1.6'
    },
    buttonContainer: {
      display: 'flex',
      gap: '15px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    primaryBtn: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '12px 30px',
      fontSize: '16px',
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: '600',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
    },
    secondaryBtn: {
      background: 'white',
      color: '#667eea',
      border: '2px solid #667eea',
      padding: '12px 30px',
      fontSize: '16px',
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: '600',
      backgroundColor: 'transparent'
    },
    illustration: {
      fontSize: '120px',
      marginBottom: '20px',
      animation: 'float 3s ease-in-out infinite'
    },
    suggestionList: {
      marginTop: '30px',
      textAlign: 'left',
      background: '#f7fafc',
      padding: '20px',
      borderRadius: '15px'
    },
    suggestionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '10px'
    },
    suggestionItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 0',
      color: '#718096',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }
  };

  const suggestions = [
    { icon: '🏠', text: 'Go back to Homepage', path: '/' },
    { icon: '📄', text: 'Check Blog Posts', path: '/blog' },
    { icon: '📞', text: 'Contact Support', path: '/contact' },
    { icon: '🔍', text: 'Browse Gallery', path: '/gallery' }
  ];

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          
          .primary-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          }
          
          .secondary-btn:hover {
            background: #667eea;
            color: white;
            transform: translateY(-2px);
          }
          
          .suggestion-item:hover {
            transform: translateX(5px);
            color: #667eea;
          }
        `}
      </style>
      
      <div style={styles.card}>
        {/* Animation Illustration */}
        <div style={styles.illustration}>
          🔍
        </div>
        
        {/* 404 Error Code */}
        <div style={styles.errorCode}>
          404
        </div>
        
        {/* Title */}
        <h1 style={styles.title}>
          Oops! Page Not Found
        </h1>
        
        {/* Message */}
        <p style={styles.message}>
          The page you are looking for might have been removed,<br />
          had its name changed, or is temporarily unavailable.
        </p>
        
        {/* Buttons */}
        <div style={styles.buttonContainer}>
          <button
            style={styles.primaryBtn}
            className="primary-btn"
            onClick={() => navigate('/')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🏠 Back to Home
          </button>
          
          <button
            style={styles.secondaryBtn}
            className="secondary-btn"
            onClick={() => navigate(-1)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ◀ Go Back
          </button>
        </div>
        
        {/* Suggestions */}
        <div style={styles.suggestionList}>
          <div style={styles.suggestionTitle}>
            💡 You might want to try:
          </div>
          {suggestions.map((item, index) => (
            <div
              key={index}
              style={styles.suggestionItem}
              className="suggestion-item"
              onClick={() => navigate(item.path)}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span>{item.text}</span>
              <span style={{ marginLeft: 'auto', fontSize: '12px' }}>→</span>
            </div>
          ))}
        </div>
        
        {/* Fun Fact */}
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#a0aec0' }}>
          ⚡ Tip: Check the URL for any typos
        </div>
      </div>
    </div>
  );
};

export default NotFound;