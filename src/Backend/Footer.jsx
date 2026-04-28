import React from 'react';

const Footer = ({ theme }) => {
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
                        <a href="#" style={{ color: '#b66dff', textDecoration: 'none', fontWeight: '600' }}>Hasan Talukder</a>. 
                        <span> All rights reserved.</span>
                    </div>
                    <div className="d-none d-md-block">
                        <span>Hand-crafted & made with </span>
                        <i className="bi bi-heart-fill text-danger"></i>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;