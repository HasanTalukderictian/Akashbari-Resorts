import React from 'react';

const Sidebar = ({ theme, isCollapsed, activeView, setActiveView, styles }) => {
    return (
        <div className="d-none d-md-block shadow-sm" style={styles.sidebar}>
            <div className="p-4">
                {isCollapsed ? (
                    <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{ width: '35px', height: '35px', background: 'linear-gradient(#da8cff, #9a55ff)' }}><span className="text-white fw-bold">D</span></div>
                ) : (
                    <h3 style={{ color: '#b66dff', fontWeight: 'bold' }}>Dashboard</h3>
                )}
            </div>
            
            <div className="px-3 py-3 d-flex align-items-center border-bottom mb-3" style={{ borderBottomColor: theme.border }}>
                <img src="https://i.pravatar.cc/40?img=12" className="rounded-circle me-2" alt="user" />
                {!isCollapsed && <div><p className="m-0 fw-bold small">David Grey. H</p><span className="text-muted small">Project Manager</span></div>}
            </div>

            <div className="mt-2">
                {[
                    { id: 'dashboard', label: 'Dashboard', icon: 'house-door' },
                    { id: 'ui-elements', label: 'UI Elements', icon: 'laptop' },
                    { id: 'tasks', label: 'Tasks', icon: 'list-task' },
                    { id: 'tables', label: 'Tables', icon: 'table' },
                    { id: 'analytics', label: 'Analytics', icon: 'graph-up' },
                    { id: 'messages', label: 'Messages', icon: 'chat-dots' },
                    { id: 'settings', label: 'Settings', icon: 'gear' },
                    { id: 'profile', label: 'Profile', icon: 'person-circle' }
                ].map((item) => (
                    <div key={item.id} onClick={() => setActiveView(item.id)} style={styles.navLink(item.id)}>
                        <i className={`bi bi-${item.icon} fs-5 me-3`}></i> 
                        {!isCollapsed && item.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;