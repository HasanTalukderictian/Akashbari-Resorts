import React from 'react';

const Footer = ({ theme }) => {
    const BRAND_COLOR = '#5e2e10';
    
    return (
        <footer className="py-3 mt-auto" style={{ 
            backgroundColor: theme.card, 
            borderTop: `1px solid ${theme.border}`,
            color: theme.text,
            fontSize: '14px'
        }}>
            <div className="container-fluid px-4">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <span className="text-muted">Copyright © 2026 </span>
                        <a href="#" style={{ 
                            color: BRAND_COLOR, 
                            textDecoration: 'none', 
                            fontWeight: '600',
                            transition: 'color 0.3s ease'
                        }} 
                        onMouseEnter={(e) => e.target.style.color = '#4a250d'}
                        onMouseLeave={(e) => e.target.style.color = BRAND_COLOR}
                        >
                            Hasan Talukder
                        </a>. 
                        <span> All rights reserved.</span>
                    </div>
                    <div className="d-none d-md-block">
                        <span>Hand-crafted & made with </span>
                        <i className="bi bi-heart-fill" style={{ color: BRAND_COLOR }}></i>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;