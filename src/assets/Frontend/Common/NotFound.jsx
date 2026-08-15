import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';


const NotFound = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Segoe UI', 'Poppins', sans-serif",
      color: '#1a1a2e'
    },
    content: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      minHeight: 'calc(100vh - 160px)'
    },
    card: {
      background: '#ffffff',
      borderRadius: '30px',
      padding: '50px 45px',
      textAlign: 'center',
      border: '1px solid #e8e8e8',
      maxWidth: '750px',
      width: '100%',
      boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
      animation: 'slideIn 0.6s ease-out'
    },
    oopsText: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#5e2e10',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      marginBottom: '8px'
    },
    title: {
      fontSize: '44px',
      fontWeight: '700',
      marginBottom: '10px',
      color: '#1a1a2e',
      letterSpacing: '-1px'
    },
    subtitle: {
      fontSize: '18px',
      color: '#666666',
      marginBottom: '25px',
      fontWeight: '300'
    },
    errorCode: {
      fontSize: '160px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #5e2e10 0%, #8a4520 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      lineHeight: '1',
      marginBottom: '5px',
      letterSpacing: '-5px'
    },
    oopsSmall: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#5e2e10',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      marginBottom: '20px'
    },
    helpTitle: {
      fontSize: '18px',
      fontWeight: '500',
      color: '#1a1a2e',
      marginBottom: '20px',
      letterSpacing: '0.5px'
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px',
      marginBottom: '35px'
    },
    gridItem: {
      background: '#f8f8f8',
      border: '1px solid #e8e8e8',
      borderRadius: '16px',
      padding: '18px 20px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'left',
      display: 'flex',
      alignItems: 'center',
      gap: '14px'
    },
    gridIcon: {
      fontSize: '24px',
      width: '44px',
      height: '44px',
      background: 'rgba(94, 46, 16, 0.08)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: '#5e2e10'
    },
    gridText: {
      flex: 1
    },
    gridTitle: {
      color: '#1a1a2e',
      fontSize: '15px',
      fontWeight: '500',
      marginBottom: '2px'
    },
    gridDesc: {
      color: '#888888',
      fontSize: '12px',
      fontWeight: '300'
    },
    buttonContainer: {
      display: 'flex',
      gap: '15px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    primaryBtn: {
      background: 'linear-gradient(135deg, #5e2e10 0%, #8a4520 100%)',
      color: 'white',
      border: 'none',
      padding: '14px 38px',
      fontSize: '15px',
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: '600',
      boxShadow: '0 8px 25px rgba(94, 46, 16, 0.25)',
      letterSpacing: '0.3px'
    },
    secondaryBtn: {
      background: '#f0f0f0',
      color: '#1a1a2e',
      border: '1px solid #d8d8d8',
      padding: '14px 38px',
      fontSize: '15px',
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: '500'
    },
    // Responsive styles
    '@media (max-width: 768px)': {
      card: {
        padding: '35px 25px'
      },
      errorCode: {
        fontSize: '120px'
      },
      title: {
        fontSize: '32px'
      },
      gridContainer: {
        gridTemplateColumns: '1fr',
        gap: '12px'
      },
      oopsText: {
        fontSize: '16px'
      },
      subtitle: {
        fontSize: '15px'
      },
      primaryBtn: {
        padding: '12px 28px',
        fontSize: '14px',
        width: '100%'
      },
      secondaryBtn: {
        padding: '12px 28px',
        fontSize: '14px',
        width: '100%'
      },
      buttonContainer: {
        flexDirection: 'column',
        gap: '10px'
      },
      gridItem: {
        padding: '15px'
      }
    },
    '@media (max-width: 480px)': {
      card: {
        padding: '25px 18px',
        borderRadius: '20px'
      },
      errorCode: {
        fontSize: '90px',
        letterSpacing: '-3px'
      },
      title: {
        fontSize: '26px'
      },
      oopsText: {
        fontSize: '14px',
        letterSpacing: '1px'
      },
      subtitle: {
        fontSize: '14px',
        marginBottom: '20px'
      },
      oopsSmall: {
        fontSize: '14px',
        marginBottom: '15px'
      },
      helpTitle: {
        fontSize: '16px',
        marginBottom: '15px'
      },
      gridContainer: {
        gap: '10px',
        marginBottom: '25px'
      },
      gridItem: {
        padding: '12px 15px',
        gap: '10px',
        borderRadius: '12px'
      },
      gridIcon: {
        fontSize: '20px',
        width: '38px',
        height: '38px',
        borderRadius: '10px'
      },
      gridTitle: {
        fontSize: '13px'
      },
      gridDesc: {
        fontSize: '11px'
      },
      primaryBtn: {
        padding: '12px 20px',
        fontSize: '13px',
        width: '100%'
      },
      secondaryBtn: {
        padding: '12px 20px',
        fontSize: '13px',
        width: '100%'
      },
      buttonContainer: {
        flexDirection: 'column',
        gap: '10px',
        width: '100%'
      },
      content: {
        padding: '20px 15px'
      }
    }
  };

  const helpItems = [
    { 
      icon: '❓', 
      title: 'Question and answers', 
      desc: 'Find answers to common questions',
      path: '/faq'
    },
    { 
      icon: '💬', 
      title: 'Community forum', 
      desc: 'Connect with our community',
      path: '/forum'
    },
    { 
      icon: '✉️', 
      title: 'Send support request', 
      desc: 'We\'ll get back to you soon',
      path: '/support'
    },
    { 
      icon: '💬', 
      title: 'Live Support', 
      desc: 'Chat with our team now',
      path: '/live-chat'
    }
  ];

  // Get screen width for responsive rendering
  const isMobile = window.innerWidth <= 480;
  const isTablet = window.innerWidth <= 768;

  return (
    <div style={styles.container}>
      <Header />
      
      <div style={styles.content}>
        <style>
          {`
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateY(40px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .primary-btn:hover {
              transform: translateY(-3px);
              box-shadow: 0 10px 35px rgba(94, 46, 16, 0.4);
            }
            
            .secondary-btn:hover {
              background: #e8e8e8;
              transform: translateY(-3px);
            }
            
            .grid-item:hover {
              background: rgba(94, 46, 16, 0.06);
              border-color: #5e2e10;
              transform: translateY(-3px);
              box-shadow: 0 8px 25px rgba(0,0,0,0.06);
            }

            /* Responsive styles */
            @media (max-width: 768px) {
              .card {
                padding: 35px 25px !important;
              }
              .error-code {
                font-size: 120px !important;
              }
              .title {
                font-size: 32px !important;
              }
              .grid-container {
                grid-template-columns: 1fr !important;
                gap: 12px !important;
              }
              .button-container {
                flex-direction: column !important;
                gap: 10px !important;
              }
              .primary-btn, .secondary-btn {
                width: 100% !important;
                justify-content: center !important;
              }
            }

            @media (max-width: 480px) {
              .card {
                padding: 25px 18px !important;
                border-radius: 20px !important;
              }
              .error-code {
                font-size: 90px !important;
                letter-spacing: -3px !important;
              }
              .title {
                font-size: 26px !important;
              }
              .oops-text {
                font-size: 14px !important;
                letter-spacing: 1px !important;
              }
              .subtitle {
                font-size: 14px !important;
                margin-bottom: 20px !important;
              }
              .grid-item {
                padding: 12px 15px !important;
                gap: 10px !important;
                border-radius: 12px !important;
              }
              .grid-icon {
                font-size: 20px !important;
                width: 38px !important;
                height: 38px !important;
                border-radius: 10px !important;
              }
              .grid-title {
                font-size: 13px !important;
              }
              .grid-desc {
                font-size: 11px !important;
              }
              .primary-btn, .secondary-btn {
                padding: 12px 20px !important;
                font-size: 13px !important;
                width: 100% !important;
              }
              .content {
                padding: 20px 15px !important;
              }
              .help-title {
                font-size: 16px !important;
                margin-bottom: 15px !important;
              }
              .grid-container {
                gap: 10px !important;
                margin-bottom: 25px !important;
              }
              .button-container {
                flex-direction: column !important;
                gap: 10px !important;
                width: 100% !important;
              }
            }
          `}
        </style>
        
        <div style={{
          ...styles.card,
          ...(isMobile ? {
            padding: '25px 18px',
            borderRadius: '20px'
          } : isTablet ? {
            padding: '35px 25px'
          } : {})
        }} className="card">
          {/* Oops! heading */}
          <div style={{
            ...styles.oopsText,
            ...(isMobile ? {
              fontSize: '14px',
              letterSpacing: '1px'
            } : isTablet ? {
              fontSize: '16px'
            } : {})
          }} className="oops-text">
            Oops!
          </div>
          
          {/* Something Went Wrong! */}
          <h1 style={{
            ...styles.title,
            ...(isMobile ? {
              fontSize: '26px'
            } : isTablet ? {
              fontSize: '32px'
            } : {})
          }} className="title">
            Something Went Wrong!
          </h1>
          
          {/* Subtitle */}
          <p style={{
            ...styles.subtitle,
            ...(isMobile ? {
              fontSize: '14px',
              marginBottom: '20px'
            } : isTablet ? {
              fontSize: '15px'
            } : {})
          }} className="subtitle">
            Don't worry our team is here to help
          </p>
          
          {/* 404 */}
          <div style={{
            ...styles.errorCode,
            ...(isMobile ? {
              fontSize: '90px',
              letterSpacing: '-3px'
            } : isTablet ? {
              fontSize: '120px'
            } : {})
          }} className="error-code">
            404
          </div>
          
          {/* Oops! small text */}
          <div style={{
            ...styles.oopsSmall,
            ...(isMobile ? {
              fontSize: '14px',
              marginBottom: '15px'
            } : {})
          }}>
            Oops!
          </div>
          
          {/* Help section title */}
          <div style={{
            ...styles.helpTitle,
            ...(isMobile ? {
              fontSize: '16px',
              marginBottom: '15px'
            } : {})
          }} className="help-title">
            How can we help you?
          </div>
          
          {/* 4 grid items */}
          <div style={{
            ...styles.gridContainer,
            ...(isMobile ? {
              gridTemplateColumns: '1fr',
              gap: '10px',
              marginBottom: '25px'
            } : isTablet ? {
              gridTemplateColumns: '1fr',
              gap: '12px'
            } : {})
          }} className="grid-container">
            {helpItems.map((item, index) => (
              <div
                key={index}
                style={{
                  ...styles.gridItem,
                  ...(isMobile ? {
                    padding: '12px 15px',
                    gap: '10px',
                    borderRadius: '12px'
                  } : isTablet ? {
                    padding: '15px'
                  } : {})
                }}
                className="grid-item"
                onClick={() => navigate(item.path)}
              >
                <div style={{
                  ...styles.gridIcon,
                  ...(isMobile ? {
                    fontSize: '20px',
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px'
                  } : {})
                }} className="grid-icon">
                  {item.icon}
                </div>
                <div style={styles.gridText}>
                  <div style={{
                    ...styles.gridTitle,
                    ...(isMobile ? {
                      fontSize: '13px'
                    } : {})
                  }} className="grid-title">{item.title}</div>
                  <div style={{
                    ...styles.gridDesc,
                    ...(isMobile ? {
                      fontSize: '11px'
                    } : {})
                  }} className="grid-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Buttons */}
          <div style={{
            ...styles.buttonContainer,
            ...(isMobile ? {
              flexDirection: 'column',
              gap: '10px',
              width: '100%'
            } : isTablet ? {
              flexDirection: 'column',
              gap: '10px'
            } : {})
          }} className="button-container">
            <button
              style={{
                ...styles.primaryBtn,
                ...(isMobile ? {
                  padding: '12px 20px',
                  fontSize: '13px',
                  width: '100%'
                } : isTablet ? {
                  padding: '12px 28px',
                  fontSize: '14px',
                  width: '100%'
                } : {})
              }}
              className="primary-btn"
              onClick={() => navigate('/')}
            >
              🏠 Back to Home
            </button>
            
            <button
              style={{
                ...styles.secondaryBtn,
                ...(isMobile ? {
                  padding: '12px 20px',
                  fontSize: '13px',
                  width: '100%'
                } : isTablet ? {
                  padding: '12px 28px',
                  fontSize: '14px',
                  width: '100%'
                } : {})
              }}
              className="secondary-btn"
              onClick={() => navigate(-1)}
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;