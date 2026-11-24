import React from 'react';
import { Navigate, Link } from 'react-router-dom';

// ⚠️ src/Config/permissions.js (folder এর নাম Config/config যা আছে হুবহু সেটাই লিখুন)
import { useAuthUser, canAccess, roleLabel } from '../../Config/permissions';

const AccessDenied = ({ user }) => (
    <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f5f5f5', padding: '20px'
    }}>
        <div style={{
            background: '#fff', border: '1px solid #dcdcdc', borderRadius: '16px',
            padding: '36px 30px', maxWidth: '420px', width: '100%', textAlign: 'center'
        }}>
            <div style={{
                width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 18px',
                border: '1.5px solid #111', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '26px'
            }}>
                <i className="bi bi-shield-lock"></i>
            </div>
            <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Access Denied</h4>
            <p style={{ color: '#6b6b6b', fontSize: '14px', marginBottom: '22px' }}>
                Your role ({roleLabel(user?.role)}) does not have permission to view this page.
                Please contact the Super Admin.
            </p>
            <Link
                to="/dashboard"
                className="btn"
                style={{ background: '#111', color: '#fff', padding: '10px 24px', borderRadius: '10px' }}
            >
                Back to Dashboard
            </Link>
        </div>
    </div>
);

const AdminRoute = ({ module, children }) => {
    const { user, loading } = useAuthUser();

    if (!localStorage.getItem('token')) return <Navigate to="/login" replace />;

    if (loading && !user) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner-border" style={{ color: '#111' }} role="status"></div>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;
    if (!canAccess(user, module)) return <AccessDenied user={user} />;

    return children;
};

export default AdminRoute;