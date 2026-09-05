// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const Header = ({ theme, isDarkMode, toggleDarkMode, toggleSidebar }) => {

//     const BASE_URL = import.meta.env.VITE_BASE_URL;

//     const navigate = useNavigate();

//     // ======================
//     // ✅ LOGOUT FUNCTION
//     // ======================
//     const handleLogout = async () => {
//         try {
//             await fetch(`${BASE_URL}/logout`, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             // clear token
//             localStorage.removeItem('token');
//             localStorage.removeItem('Role');

//             // redirect login
//             navigate('/login');

//         } catch (error) {
//             console.error('Logout error:', error);
//         }
//     };

//     return (
//         <nav
//             className="navbar shadow-sm px-2 py-2"
//             style={{
//                 backgroundColor: theme.card,
//                 borderBottom: `1px solid ${theme.border}`,
//                 height: '70px',
//                 flexShrink: 0
//             }}
//         >
//             <div className="d-flex align-items-center w-100 px-4">

//                 {/* Sidebar toggle */}
//                 <i
//                     className="bi bi-list fs-4 me-4"
//                     style={{ cursor: 'pointer', color: theme.text }}
//                     onClick={toggleSidebar}
//                 ></i>

//                 <div className="ms-auto d-flex align-items-center gap-4">

//                     {/* Dark mode */}
//                     <div
//                         onClick={toggleDarkMode}
//                         style={{
//                             cursor: 'pointer',
//                             fontSize: '1.2rem',
//                             color: isDarkMode ? '#f1c40f' : '#2c3e50'
//                         }}
//                     >
//                         <i className={`bi bi-${isDarkMode ? 'sun-fill' : 'moon-stars-fill'}`}></i>
//                     </div>

                   

//                     {/* User avatar */}
//                     <img
//                         src="https://i.pravatar.cc/35?img=12"
//                         className="rounded-circle border"
//                         alt="user"
//                         style={{ borderColor: '#b66dff' }}
//                     />

//                     {/* ===================== */}
//                     {/* ✅ LOGOUT BUTTON HERE */}
//                     {/* ===================== */}
//                     <i
//                         className="bi bi-power fs-5 ms-2"
//                         style={{ color: '#ff4757', cursor: 'pointer' }}
//                         onClick={handleLogout}
//                     ></i>

//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Header;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ theme, isDarkMode, toggleDarkMode, toggleSidebar }) => {

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const [toastTitle, setToastTitle] = useState('');

    // Auto hide toast after 3 seconds
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const handleLogout = async () => {
        try {
            await fetch(`${BASE_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            localStorage.removeItem('token');
            localStorage.removeItem('Role');

            setToastTitle('Logout Successful');
            setShowToast(true);

            setTimeout(() => {
                navigate('/login');
            }, 1000);

        } catch (error) {
            console.error('Logout error:', error);
            
            setToastTitle('⚠️ Logout Failed');
            setToastMessage('Something went wrong. Please try again.');
            setToastType('danger');
            setShowToast(true);
        }
    };

    // Toast icons
   
    return (
        <>
            <nav
                className="navbar shadow-sm px-2 py-2"
                style={{
                    backgroundColor: theme.card,
                    borderBottom: `1px solid ${theme.border}`,
                    height: '70px',
                    flexShrink: 0
                }}
            >
                <div className="d-flex align-items-center w-100 px-4">
                    <i
                        className="bi bi-list fs-4 me-4"
                        style={{ cursor: 'pointer', color: theme.text }}
                        onClick={toggleSidebar}
                    ></i>

                    <div className="ms-auto d-flex align-items-center gap-4">
                        <div
                            onClick={toggleDarkMode}
                            style={{
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                color: isDarkMode ? '#f1c40f' : '#2c3e50'
                            }}
                        >
                            <i className={`bi bi-${isDarkMode ? 'sun-fill' : 'moon-stars-fill'}`}></i>
                        </div>

                        <img
                            src="https://i.pravatar.cc/35?img=12"
                            className="rounded-circle border"
                            alt="user"
                            style={{ borderColor: '#b66dff' }}
                        />

                        <i
                            className="bi bi-power fs-5 ms-2"
                            style={{ color: '#ff4757', cursor: 'pointer' }}
                            onClick={handleLogout}
                            title="Logout"
                        ></i>
                    </div>
                </div>
            </nav>

            {/* ===================== */}
            {/* ✅ BEAUTIFUL TOAST MESSAGE */}
            {/* ===================== */}
            {showToast && (
                <div 
                    className="position-fixed top-0 end-0 p-3"
                    style={{ zIndex: 9999 }}
                >
                    <div 
                        className={`toast show border-0 shadow-lg`}
                        style={{
                            minWidth: '350px',
                            maxWidth: '450px',
                            borderRadius: '16px',
                            animation: 'slideInRight 0.5s ease',
                            backgroundColor: '#ffffff',
                            borderLeft: `6px solid ${toastType === 'success' ? '#28a745' : '#dc3545'}`
                        }}
                        role="alert"
                    >
                        <div className="toast-header border-0" style={{
                            backgroundColor: toastType === 'success' ? '#f0fdf4' : '#fef2f2',
                            borderRadius: '16px 16px 0 0',
                            padding: '14px 18px'
                        }}>
                            
                            <strong className="me-auto" style={{
                                fontSize: '14px',
                                color: toastType === 'success' ? '#16a34a' : '#dc2626',
                                fontWeight: '600'
                            }}>
                                {toastTitle}
                            </strong>
                           
                            <button 
                                type="button" 
                                className="btn-close ms-2" 
                                onClick={() => setShowToast(false)}
                                style={{ fontSize: '12px' }}
                            ></button>
                        </div>
                       
                    </div>
                </div>
            )}

            {/* CSS for animation */}
            <style>
                {`
                    @keyframes slideInRight {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }

                    @keyframes slideOutRight {
                        from {
                            transform: translateX(0);
                            opacity: 1;
                        }
                        to {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                    }

                    .toast {
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
                        transition: all 0.3s ease;
                    }

                    .toast:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 25px 70px rgba(0, 0, 0, 0.2) !important;
                    }

                    .toast-header .btn-close {
                        opacity: 0.7;
                        transition: opacity 0.2s ease;
                    }

                    .toast-header .btn-close:hover {
                        opacity: 1;
                    }

                    /* Progress bar for auto dismiss */
                    .toast-progress {
                        height: 3px;
                        background: ${toastType === 'success' ? '#22c55e' : '#ef4444'};
                        animation: progressBar 3s linear forwards;
                        border-radius: 0 0 0 3px;
                    }

                    @keyframes progressBar {
                        from {
                            width: 100%;
                        }
                        to {
                            width: 0%;
                        }
                    }
                `}
            </style>

            {/* Progress bar showing auto dismiss time */}
            {showToast && (
                <div 
                    className="position-fixed top-0 end-0 p-3"
                    style={{ 
                        zIndex: 9999,
                        paddingTop: '85px !important',
                        pointerEvents: 'none'
                    }}
                >
                    <div style={{
                        width: '350px',
                        height: '3px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '4px',
                        overflow: 'hidden'
                    }}>
                        <div className="toast-progress"></div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;