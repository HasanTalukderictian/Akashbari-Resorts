import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const Dashbord = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeView, setActiveView] = useState('dashboard'); 
    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    // --- ডাটা সেট ---
    const barData = [
        { name: 'JAN', visits: 4000, sales: 2400 },
        { name: 'FEB', visits: 3000, sales: 1398 },
        { name: 'MAR', visits: 2000, sales: 9800 },
        { name: 'APR', visits: 2780, sales: 3908 },
        { name: 'MAY', visits: 1890, sales: 4800 },
        { name: 'JUN', visits: 2390, sales: 3800 },
    ];

    const pieData = [
        { name: 'Search Engines', value: 30, color: '#047edf' },
        { name: 'Direct Click', value: 30, color: '#07cdae' },
        { name: 'Bookmarks', value: 40, color: '#fe7096' },
    ];

    const theme = {
        bg: isDarkMode ? '#1a1a2e' : '#f2edf3',
        card: isDarkMode ? '#16213e' : '#ffffff',
        text: isDarkMode ? '#e9ecef' : '#3e4b5b',
        border: isDarkMode ? '#2d3436' : '#ebedf2',
        sidebarText: isDarkMode ? '#b2bec3' : '#3e4b5b',
        gridColor: isDarkMode ? '#2d3436' : '#f5f5f5'
    };

    const styles = {
        container: { backgroundColor: theme.bg, minHeight: '100vh', fontFamily: "'Ubuntu', sans-serif", color: theme.text, transition: 'all 0.3s ease' },
        sidebar: { width: isCollapsed ? '70px' : '260px', backgroundColor: theme.card, minHeight: '100vh', transition: 'width 0.3s ease', overflow: 'hidden', whiteSpace: 'nowrap', borderRight: `1px solid ${theme.border}` },
        navLink: (view) => ({ 
            color: activeView === view ? '#b66dff' : theme.sidebarText, 
            padding: '12px 25px', 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            fontSize: '14px',
            fontWeight: activeView === view ? 'bold' : 'normal',
            cursor: 'pointer',
            backgroundColor: activeView === view ? (isDarkMode ? '#1a1a2e' : '#f8f9fa') : 'transparent'
        }),
        statCard: (type) => {
            let gradient = type === 'sales' ? 'linear-gradient(to right, #ffbf96, #fe7096)' :
                type === 'orders' ? 'linear-gradient(to right, #90caf9, #047edf)' :
                    'linear-gradient(to right, #84d9d2, #07cdae)';
            return { background: gradient, border: 'none', borderRadius: '10px', color: 'white' };
        },
        purpleIcon: { backgroundColor: '#b66dff', color: 'white', padding: '8px', borderRadius: '5px', marginRight: '10px' }
    };

    // --- কন্টেন্ট রেন্ডার ফাংশন ---
    const renderContent = () => {
        switch (activeView) {
            case 'ui-elements':
                return (
                    <div className="row g-4 animate__animated animate__fadeIn">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm p-4" style={{ backgroundColor: theme.card, color: theme.text }}>
                                <h5 className="mb-4">Buttons & Badges (UI Elements)</h5>
                                <div className="d-flex flex-wrap gap-3">
                                    <button className="btn btn-primary">Primary</button>
                                    <button className="btn btn-secondary">Secondary</button>
                                    <button className="btn btn-success">Success</button>
                                    <button className="btn btn-danger">Danger</button>
                                    <button className="btn btn-warning">Warning</button>
                                    <button className="btn btn-info text-white">Info</button>
                                </div>
                                <div className="mt-4">
                                    <h6>Progress Bars</h6>
                                    <div className="progress mb-3" style={{height: '10px'}}>
                                        <div className="progress-bar bg-gradient" style={{width: '75%', background: 'linear-gradient(to right, #b66dff, #8e44ad)'}}></div>
                                    </div>
                                    <div className="progress" style={{height: '10px'}}>
                                        <div className="progress-bar bg-info" style={{width: '45%'}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'tasks':
                return (
                    <div className="row g-4 animate__animated animate__fadeIn">
                        <div className="col-lg-12">
                            <div className="card border-0 shadow-sm p-4" style={{ backgroundColor: theme.card, color: theme.text }}>
                                <h5 className="mb-4">Project Tasks Management</h5>
                                <div className="list-group list-group-flush">
                                    {[
                                        { t: 'Update the documentation', p: 'High', c: 'danger' },
                                        { t: 'Fix navigation bug in mobile', p: 'Medium', c: 'warning' },
                                        { t: 'Design new landing page', p: 'Low', c: 'info' },
                                        { t: 'API Integration for checkout', p: 'High', c: 'danger' }
                                    ].map((item, i) => (
                                        <div key={i} className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-bottom px-0 py-3" style={{color: theme.text, borderColor: theme.border}}>
                                            <div className="d-flex align-items-center">
                                                <input className="form-check-input me-3" type="checkbox" />
                                                <span>{item.t}</span>
                                            </div>
                                            <span className={`badge bg-${item.c}`}>{item.p} Priority</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default: // Dashboard কন্টেন্ট
                return (
                    <>
                        <div className="row g-4 mb-4">
                            {['sales', 'orders', 'visitors'].map((type) => (
                                <div className="col-md-4" key={type}>
                                    <div className="card p-4 shadow-sm h-100" style={styles.statCard(type)}>
                                        <h5 className="fw-normal">{type === 'sales' ? 'Weekly Sales' : type === 'orders' ? 'Weekly Orders' : 'Visitors Online'}</h5>
                                        <h2 className="my-3">{type === 'sales' ? '$ 15,000' : type === 'orders' ? '45,633' : '95,574'}</h2>
                                        <p className="m-0 opacity-75 small">Increased by 5%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="row g-4 mb-4">
                            <div className="col-lg-7">
                                <div className="card border-0 shadow-sm p-4 h-100" style={{ backgroundColor: theme.card, color: theme.text, borderRadius: '10px' }}>
                                    <h5 className="mb-4">Visit & Sales Statistics</h5>
                                    <div style={{ width: '100%', height: 250 }}><ResponsiveContainer><BarChart data={barData}><CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} vertical={false} /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: theme.text}} /><YAxis axisLine={false} tickLine={false} tick={{fill: theme.text}} /><Tooltip contentStyle={{backgroundColor: theme.card}} /><Bar dataKey="visits" fill="#b66dff" radius={[4, 4, 0, 0]} barSize={15} /><Bar dataKey="sales" fill="#fe7096" radius={[4, 4, 0, 0]} barSize={15} /></BarChart></ResponsiveContainer></div>
                                </div>
                            </div>
                            <div className="col-lg-5">
                                <div className="card border-0 shadow-sm p-4 h-100" style={{ backgroundColor: theme.card, color: theme.text, borderRadius: '10px' }}>
                                    <h5 className="mb-4">Traffic Sources</h5>
                                    <div style={{ width: '100%', height: 250 }}><ResponsiveContainer><PieChart><Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}</Pie><Tooltip /><Legend iconType="circle" /></PieChart></ResponsiveContainer></div>
                                </div>
                            </div>
                            <div className="row g-4 mb-4">
                            <div className="col-lg-7">
                                <div className="card border-0 shadow-sm p-4 h-100" style={{ backgroundColor: theme.card, color: theme.text, borderRadius: '10px' }}>
                                    <h5 className="mb-4">Visit & Sales Statistics</h5>
                                    <div style={{ width: '100%', height: 250 }}><ResponsiveContainer><BarChart data={barData}><CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} vertical={false} /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: theme.text}} /><YAxis axisLine={false} tickLine={false} tick={{fill: theme.text}} /><Tooltip contentStyle={{backgroundColor: theme.card}} /><Bar dataKey="visits" fill="#b66dff" radius={[4, 4, 0, 0]} barSize={15} /><Bar dataKey="sales" fill="#fe7096" radius={[4, 4, 0, 0]} barSize={15} /></BarChart></ResponsiveContainer></div>
                                </div>
                            </div>
                            <div className="col-lg-5">
                                <div className="card border-0 shadow-sm p-4 h-100" style={{ backgroundColor: theme.card, color: theme.text, borderRadius: '10px' }}>
                                    <h5 className="mb-4">Traffic Sources</h5>
                                    <div style={{ width: '100%', height: 250 }}><ResponsiveContainer><PieChart><Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}</Pie><Tooltip /><Legend iconType="circle" /></PieChart></ResponsiveContainer></div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div style={styles.container} className="container-fluid p-0">
            <div className="d-flex">
                {/* Sidebar */}
                <div className="d-none d-md-block shadow-sm" style={styles.sidebar}>
                    <div className="p-4">
                        {isCollapsed ? (
                            <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{width: '35px', height: '35px', background: 'linear-gradient(#da8cff, #9a55ff)'}}><span className="text-white fw-bold">P</span></div>
                        ) : (
                            <h3 style={{ color: '#b66dff', fontWeight: 'bold' }}>Purple</h3>
                        )}
                    </div>
                    <div className="px-3 py-3 d-flex align-items-center border-bottom mb-3" style={{ borderBottomColor: theme.border }}>
                        <img src="https://i.pravatar.cc/40?img=12" className="rounded-circle me-2" alt="user" />
                        {!isCollapsed && <div><p className="m-0 fw-bold small">David Grey. H</p><span className="text-muted small">Project Manager</span></div>}
                    </div>
                    <div className="mt-2">
                        <div onClick={() => setActiveView('dashboard')} style={styles.navLink('dashboard')}><i className="bi bi-house-door fs-5 me-3"></i> {!isCollapsed && "Dashboard"}</div>
                        <div onClick={() => setActiveView('ui-elements')} style={styles.navLink('ui-elements')}><i className="bi bi-laptop fs-5 me-3"></i> {!isCollapsed && "UI Elements"}</div>
                        <div onClick={() => setActiveView('tasks')} style={styles.navLink('tasks')}><i className="bi bi-list-task fs-5 me-3"></i> {!isCollapsed && "Tasks"}</div>
                        <div onClick={() => setActiveView('tables')} style={styles.navLink('tables')}><i className="bi bi-table fs-5 me-3"></i> {!isCollapsed && "Tables"}</div>
                    </div>
                </div>

                {/* Main Area */}
                <div className="flex-grow-1" style={{ width: '0' }}>
                    <nav className="navbar shadow-sm px-4 py-2" style={{ backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}`, height: '70px' }}>
    <div className="d-flex align-items-center w-100">
        {/* Toggle Icon */}
        <i className="bi bi-list fs-4 me-4" style={{ cursor: 'pointer', color: theme.text }} onClick={toggleSidebar}></i>

        {/* --- Modern Search Input --- */}
        <div className="d-none d-md-flex align-items-center position-relative" style={{ width: '300px' }}>
            <i className="bi bi-search position-absolute ms-3" style={{ color: '#b66dff' }}></i>
            <input 
                type="text" 
                className="form-control border-0 ps-5 py-2" 
                placeholder="Search projects..." 
                style={{ 
                    backgroundColor: isDarkMode ? '#1a1a2e' : '#f8f9fa', 
                    color: theme.text,
                    borderRadius: '20px',
                    fontSize: '14px',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease'
                }} 
                onFocus={(e) => e.target.style.boxShadow = '0 0 5px rgba(182, 109, 255, 0.3)'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
            />
        </div>

        {/* Right Side Icons & Profile */}
        <div className="ms-auto d-flex align-items-center gap-4">
            {/* Dark Mode Toggle */}
            <div onClick={toggleDarkMode} style={{ cursor: 'pointer', fontSize: '1.2rem', color: isDarkMode ? '#f1c40f' : '#2c3e50' }}>
                <i className={`bi bi-${isDarkMode ? 'sun-fill' : 'moon-stars-fill'}`}></i>
            </div>

            {/* Notification Icon (Extra Added for Looks) */}
            <div className="position-relative" style={{ cursor: 'pointer', color: theme.text }}>
                <i className="bi bi-bell fs-5"></i>
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{fontSize: '5px'}}></span>
            </div>

            {/* Profile Section */}
            <div className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
                <img src="https://i.pravatar.cc/35?img=12" className="rounded-circle border" alt="user" style={{ borderColor: '#b66dff' }} />
                <span className="small fw-bold d-none d-lg-inline" style={{ color: theme.text }}>David Greymaax</span>
                <i className="bi bi-chevron-down small" style={{ color: theme.text, fontSize: '10px' }}></i>
            </div>

            <i className="bi bi-power fs-5 ms-2" style={{ color: '#ff4757', cursor: 'pointer' }}></i>
        </div>
    </div>
</nav>

                    <div className="p-4">
                        {/* Dynamic Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="m-0 d-flex align-items-center" style={{ color: theme.text, textTransform: 'capitalize' }}>
                                <span style={styles.purpleIcon}><i className={`bi bi-${activeView === 'dashboard' ? 'house-door-fill' : activeView === 'tasks' ? 'list-task' : 'laptop'}`}></i></span>
                                {activeView.replace('-', ' ')}
                            </h4>
                            <div className="d-flex align-items-center">
                                <span className="small fw-bold" style={{ color: isDarkMode ? '#fff' : '#6c757d' }}>Overview</span>
                                <i className="bi bi-info-circle ms-2" style={{ color: isDarkMode ? '#fff' : '#047edf' }}></i>
                            </div>
                        </div>

                        {/* রেন্ডার করা কন্টেন্ট এখানে দেখাবে */}
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashbord;