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

        // sidebar: { width: isCollapsed ? '70px' : '260px', backgroundColor: theme.card, minHeight: '100vh', transition: 'width 0.3s ease', overflow: 'hidden', whiteSpace: 'nowrap', borderRight: `1px solid ${theme.border}` },
          
       sidebar: { 
        width: isCollapsed ? '70px' : '260px', 
        backgroundColor: theme.card, 
        height: '100vh', // minHeight এর বদলে height দিন
        position: 'sticky', // এটি সাইডবারকে ফিক্সড রাখবে
        top: 0,
        transition: 'width 0.3s ease', 
        overflowY: 'auto', // সাইডবার মেনু বড় হলে স্ক্রল হবে
        whiteSpace: 'nowrap', 
        borderRight: `1px solid ${theme.border}`,
        zIndex: 1000
    },
    mainArea: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden' // বাইরের স্ক্রল বন্ধ করবে
    },
    contentScroll: {
        flexGrow: 1,
        overflowY: 'auto', // শুধুমাত্র এই অংশটি স্ক্রল হবে
        backgroundColor: theme.bg,
        padding: '24px'
    },

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
                                    <div className="progress mb-3" style={{ height: '10px' }}>
                                        <div className="progress-bar" style={{ width: '75%', background: 'linear-gradient(to right, #b66dff, #8e44ad)' }}></div>
                                    </div>
                                    <div className="progress" style={{ height: '10px' }}>
                                        <div className="progress-bar bg-info" style={{ width: '45%' }}></div>
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
                                        <div key={i} className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-bottom px-0 py-3" style={{ color: theme.text, borderColor: theme.border }}>
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
            case 'tables':
                return (
                    <div className="card border-0 shadow-sm p-4 animate__animated animate__fadeIn" style={{ backgroundColor: theme.card, color: theme.text }}>
                        <h5>Recent Orders Table</h5>
                        <div className="table-responsive mt-3">
                            <table className="table" style={{ color: theme.text }}>
                                <thead style={{ borderBottom: `2px solid ${theme.border}` }}>
                                    <tr>
                                        <th>Project</th>
                                        <th>Manager</th>
                                        <th>Status</th>
                                        <th>Deadline</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td>E-commerce</td><td>John Doe</td><td><span className="badge bg-success">Done</span></td><td>May 15</td></tr>
                                    <tr><td>Mobile App</td><td>Jane Smith</td><td><span className="badge bg-warning">Pending</span></td><td>June 02</td></tr>
                                    <tr><td>Admin Panel</td><td>David Grey</td><td><span className="badge bg-info">In Progress</span></td><td>July 10</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'analytics':
                return (
                    <div className="card border-0 shadow-sm p-4 animate__animated animate__fadeIn" style={{ backgroundColor: theme.card, color: theme.text }}>
                        <h5>Data Analytics Report</h5>
                        <p className="text-muted">Detailed performance overview for the current month.</p>
                        <div className="row mt-4">
                            <div className="col-md-6"><div className="p-3 border rounded mb-3"><h6>Direct Traffic</h6><strong>80%</strong></div></div>
                            <div className="col-md-6"><div className="p-3 border rounded mb-3"><h6>Social Media</h6><strong>20%</strong></div></div>
                        </div>
                    </div>
                );
            case 'messages':
                return (
                    <div className="card border-0 shadow-sm p-4 animate__animated animate__fadeIn" style={{ backgroundColor: theme.card, color: theme.text }}>
                        <h5>Recent Messages</h5>
                        <div className="mt-3">
                            <div className="d-flex align-items-center mb-3 p-2 border-bottom">
                                <img src="https://i.pravatar.cc/40?img=1" className="rounded-circle me-3" alt="" />
                                <div><h6 className="mb-0">Sarah Jenkins</h6><small className="text-muted">Hey, is the report ready?</small></div>
                            </div>
                            <div className="d-flex align-items-center p-2">
                                <img src="https://i.pravatar.cc/40?img=2" className="rounded-circle me-3" alt="" />
                                <div><h6 className="mb-0">Mark Spencer</h6><small className="text-muted">The client loved the new design!</small></div>
                            </div>
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="card border-0 shadow-sm p-4 animate__animated animate__fadeIn" style={{ backgroundColor: theme.card, color: theme.text }}>
                        <h5>System Settings</h5>
                        <div className="mt-4">
                            <div className="form-check form-switch mb-3">
                                <input className="form-check-input" type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
                                <label className="form-check-label">Dark Mode Enabled</label>
                            </div>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" defaultChecked />
                                <label className="form-check-label">Email Notifications</label>
                            </div>
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <div className="card border-0 shadow-sm p-4 text-center animate__animated animate__fadeIn" style={{ backgroundColor: theme.card, color: theme.text }}>
                        <img src="https://i.pravatar.cc/100?img=12" className="rounded-circle mx-auto mb-3" style={{ border: '3px solid #b66dff' }} alt="" />
                        <h4>David Greymaax</h4>
                        <p className="text-muted">Senior Project Manager</p>
                        <button className="btn btn-outline-primary btn-sm px-4">Edit Profile</button>
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
                                    <div style={{ width: '100%', height: 250 }}><ResponsiveContainer><BarChart data={barData}><CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} vertical={false} /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme.text }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text }} /><Tooltip contentStyle={{ backgroundColor: theme.card }} /><Bar dataKey="visits" fill="#b66dff" radius={[4, 4, 0, 0]} barSize={15} /><Bar dataKey="sales" fill="#fe7096" radius={[4, 4, 0, 0]} barSize={15} /></BarChart></ResponsiveContainer></div>
                                </div>
                            </div>
                            <div className="col-lg-5">
                                <div className="card border-0 shadow-sm p-4 h-100" style={{ backgroundColor: theme.card, color: theme.text, borderRadius: '10px' }}>
                                    <h5 className="mb-4">Traffic Sources</h5>
                                    <div style={{ width: '100%', height: 250 }}><ResponsiveContainer><PieChart><Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}</Pie><Tooltip /><Legend iconType="circle" /></PieChart></ResponsiveContainer></div>
                                </div>
                            </div>
                        </div>

                        <div className="row g-4 mb-4">
                            <div className="col-12">
                                <div className="card border-0 shadow-sm p-4" style={{ backgroundColor: theme.card, color: theme.text, borderRadius: '10px' }}>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h5 className="m-0">Recent Transactions</h5>
                                        <button className="btn btn-sm text-white" style={{ backgroundColor: '#b66dff' }}>View All</button>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table align-middle" style={{ color: theme.text }}>
                                            <thead style={{ borderBottom: `1px solid ${theme.border}` }}>
                                                <tr className="text-muted small">
                                                    <th>TRACKING ID</th>
                                                    <th>PRODUCT</th>
                                                    <th>CUSTOMER</th>
                                                    <th>AMOUNT</th>
                                                    <th>STATUS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                                                    <td className="small">#WD-12543</td>
                                                    <td className="fw-bold">Premium Template</td>
                                                    <td><img src="https://i.pravatar.cc/30?img=1" className="rounded-circle me-2" alt="" /> Emily Blunt</td>
                                                    <td>$ 450.00</td>
                                                    <td><span className="badge rounded-pill bg-success-subtle text-success px-3">Paid</span></td>
                                                </tr>
                                                <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                                                    <td className="small">#WD-12544</td>
                                                    <td className="fw-bold">React Plugin</td>
                                                    <td><img src="https://i.pravatar.cc/30?img=2" className="rounded-circle me-2" alt="" /> Chris Evans</td>
                                                    <td>$ 120.00</td>
                                                    <td><span className="badge rounded-pill bg-warning-subtle text-warning px-3">Pending</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
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
            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
                {/* Sidebar */}
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
                        <div onClick={() => setActiveView('dashboard')} style={styles.navLink('dashboard')}><i className="bi bi-house-door fs-5 me-3"></i> {!isCollapsed && "Dashboard"}</div>
                        <div onClick={() => setActiveView('ui-elements')} style={styles.navLink('ui-elements')}><i className="bi bi-laptop fs-5 me-3"></i> {!isCollapsed && "UI Elements"}</div>
                        <div onClick={() => setActiveView('tasks')} style={styles.navLink('tasks')}><i className="bi bi-list-task fs-5 me-3"></i> {!isCollapsed && "Tasks"}</div>
                        <div onClick={() => setActiveView('tables')} style={styles.navLink('tables')}><i className="bi bi-table fs-5 me-3"></i> {!isCollapsed && "Tables"}</div>
                        <div onClick={() => setActiveView('analytics')} style={styles.navLink('analytics')}><i className="bi bi-graph-up fs-5 me-3"></i> {!isCollapsed && "Analytics"}</div>
                        <div onClick={() => setActiveView('messages')} style={styles.navLink('messages')}><i className="bi bi-chat-dots fs-5 me-3"></i> {!isCollapsed && "Messages"}</div>
                        <div onClick={() => setActiveView('settings')} style={styles.navLink('settings')}><i className="bi bi-gear fs-5 me-3"></i> {!isCollapsed && "Settings"}</div>
                        <div onClick={() => setActiveView('profile')} style={styles.navLink('profile')}><i className="bi bi-person-circle fs-5 me-3"></i> {!isCollapsed && "Profile"}</div>
                        <hr className="text-secondary" />
                        <div onClick={() => console.log('Logout')} style={styles.navLink('logout')} className="text-danger">
                            <i className="bi bi-box-arrow-right fs-5 me-3"></i> {!isCollapsed && "Logout"}
                        </div>
                    </div>
                </div>

                {/* Main Area Fix: Added styles.mainArea here */}
                <div style={styles.mainArea} className="flex-grow-1">
                    {/* Fixed Navbar */}
                    <nav className="navbar shadow-sm px-2 py-2" style={{ backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}`, height: '70px', flexShrink: 0 }}>
                        <div className="d-flex align-items-center w-100 px-4">
                            <i className="bi bi-list fs-4 me-4" style={{ cursor: 'pointer', color: theme.text }} onClick={toggleSidebar}></i>
                            <div className="ms-auto d-flex align-items-center gap-4">
                                <div onClick={toggleDarkMode} style={{ cursor: 'pointer', fontSize: '1.2rem', color: isDarkMode ? '#f1c40f' : '#2c3e50' }}>
                                    <i className={`bi bi-${isDarkMode ? 'sun-fill' : 'moon-stars-fill'}`}></i>
                                </div>
                                <div className="position-relative" style={{ cursor: 'pointer', color: theme.text }}>
                                    <i className="bi bi-bell fs-5"></i>
                                    <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{ fontSize: '5px' }}></span>
                                </div>
                                <img src="https://i.pravatar.cc/35?img=12" className="rounded-circle border" alt="user" style={{ borderColor: '#b66dff' }} />
                                <i className="bi bi-power fs-5 ms-2" style={{ color: '#ff4757', cursor: 'pointer' }}></i>
                            </div>
                        </div>
                    </nav>

                    {/* Scrollable Content: This div now uses contentScroll */}
                    <div style={styles.contentScroll}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="m-0 d-flex align-items-center" style={{ color: theme.text, textTransform: 'capitalize' }}>
                                <span style={styles.purpleIcon}>
                                    <i className={`bi bi-${activeView === 'dashboard' ? 'house-door-fill' : activeView === 'tasks' ? 'list-task' : 'laptop'}`}></i>
                                </span>
                                {activeView.replace('-', ' ')}
                            </h4>
                            <div className="d-flex align-items-center">
                                <span className="small fw-bold" style={{ color: isDarkMode ? '#fff' : '#6c757d' }}>Overview</span>
                                <i className="bi bi-info-circle ms-2" style={{ color: isDarkMode ? '#fff' : '#047edf' }}></i>
                            </div>
                        </div>

                        {/* Rendered View */}
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );

};

export default Dashbord;