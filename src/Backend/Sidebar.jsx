import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthUser, canAccess, roleLabel } from '../Config/permissions';

const MENU_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2', path: '/dashboard', module: null },
    { id: 'users', label: 'Users', icon: 'bi-people-fill', path: '/users', module: 'users' },
    { id: 'gallery', label: 'Gallery', icon: 'bi-images', path: '/admin-gallery', module: 'gallery' },
    { id: 'query', label: 'Package Query', icon: 'bi-inbox-fill', path: '/package-query', module: 'package_query' },
    { id: 'project', label: 'Project View', icon: 'bi-kanban-fill', path: '/admin-project-view', module: 'project' },
    { id: 'blog', label: 'Blog Page', icon: 'bi-newspaper', path: '/admin-blog', module: 'blog' },
    { id: 'notice', label: 'Notice', icon: 'bi-megaphone-fill', path: '/admin-notice', module: 'notice' },
    { id: 'statistics', label: 'Price statistics', icon: 'bi-graph-up', path: '/admin-stat', module: 'packages' },
    { id: 'affilites', label: 'Affiliates', icon: 'bi-share-fill', path: '/admin-affilites', module: 'affiliates' },
    { id: 'sister', label: 'Sister Concerns', icon: 'bi-diagram-3-fill', path: '/admin-sister', module: 'partners' },
    { id: 'events', label: 'Events', icon: 'bi-calendar-event-fill', path: '/admin-events', module: 'events' },
    { id: 'teams', label: 'Teams', icon: 'bi-person-lines-fill', path: '/admin-team', module: 'team' },
    { id: 'FAQ', label: 'FAQ', icon: 'bi-question-circle-fill', path: '/admin-faq', module: 'faq' },
    { id: 'JOB', label: 'Job', icon: 'bi-briefcase-fill', path: '/admin-job', module: 'jobs' },
    { id: 'INVESTQUERY', label: 'Invest Query', icon: 'bi-cash-coin', path: '/admin-investquery', module: 'investment_query' },
    { id: 'JOBQUERY', label: 'Job Query', icon: 'bi-envelope-open-fill', path: '/admin-jobquery', module: 'job_applications' },
];

const CLUB_SUB_ITEMS = [
    { id: 'club-info', label: 'Club Info', icon: 'bi-info-circle-fill', path: '/admin-club', module: 'club' },
    { id: 'club-gallery', label: 'Club Gallery', icon: 'bi-images', path: '/admin-club-gallery', module: 'club' },
];

const LANDING_SUB_ITEMS = [
    { id: 'content', label: 'Contents', icon: 'bi-files', path: '/content', module: 'landing' },
    { id: 'welcome', label: 'Welcome Section', icon: 'bi-emoji-smile-fill', path: '/welcome', module: 'landing' },
    { id: 'video', label: 'Video Section', icon: 'bi-play-btn-fill', path: '/video', module: 'landing' },
    { id: 'owner', label: 'Owner Section', icon: 'bi-person-badge-fill', path: '/owner-section', module: 'landing' },
    { id: 'benefit', label: 'Owner Benefit', icon: 'bi-gem', path: '/owner-benefit', module: 'landing' },
    { id: 'investment', label: 'Investment Package', icon: 'bi-piggy-bank-fill', path: '/admin-investment', module: 'landing' },
    { id: 'investmentbenefit', label: 'Investment Benefit', icon: 'bi-bar-chart-steps', path: '/admin-investmentbenefit', module: 'landing' },
    { id: 'luxury', label: 'Luxury Section', icon: 'bi-gem', path: '/admin-luxury', module: 'landing' },
    { id: 'testo', label: 'Testo Section', icon: 'bi-chat-quote-fill', path: '/admin-testo', module: 'landing' },
    { id: 'client', label: 'Happy Client', icon: 'bi-emoji-laughing-fill', path: '/admin-client', module: 'landing' },
    { id: 'achievement', label: 'Achievement', icon: 'bi-trophy-fill', path: '/admin-achievement', module: 'landing' },
    { id: 'investrecord', label: 'Invest Record', icon: 'bi-cash-stack', path: '/admin-investrecord', module: 'landing' },
];

const LIGHT = {
    bg: '#ffffff', text: '#111111', muted: '#6b6b6b', accent: '#111111', accentOn: '#ffffff',
    border: '#dcdcdc', hover: 'rgba(0,0,0,0.05)', soft: '#f5f5f5',
};

const DARK = {
    bg: '#141414', text: '#f5f5f5', muted: '#a3a3a3', accent: '#f5f5f5', accentOn: '#111111',
    border: '#2b2b2b', hover: 'rgba(255,255,255,0.07)', soft: 'rgba(255,255,255,0.05)',
};

const isAnySubItemActive = (subItems, pathname) => subItems.some((item) => pathname === item.path);

const initials = (name) =>
    String(name || 'A').trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || 'A';

const MenuLink = ({ item, isCollapsed, sub = false }) => (
    <NavLink
        to={item.path}
        end
        title={isCollapsed ? item.label : undefined}
        className={({ isActive }) =>
            `sb-link ${sub ? 'sb-sub' : ''} ${isCollapsed ? 'sb-collapsed' : ''} ${isActive ? 'active' : ''}`
        }
    >
        <i className={`bi ${item.icon} sb-icon`}></i>
        {!isCollapsed && <span className="sb-label">{item.label}</span>}
    </NavLink>
);

const SubMenu = ({ label, icon, items, isOpen, onToggle, active, isCollapsed }) => (
    <div className="sb-group">
        <button
            type="button"
            title={isCollapsed ? label : undefined}
            onClick={() => !isCollapsed && onToggle()}
            aria-expanded={isOpen}
            className={`sb-link ${isCollapsed ? 'sb-collapsed' : ''} ${active ? 'sb-parent-active' : ''}`}
        >
            <i className={`bi ${icon} sb-icon`}></i>
            {!isCollapsed && (
                <>
                    <span className="sb-label">{label}</span>
                    <i className={`bi bi-chevron-down sb-chevron ${isOpen ? 'open' : ''}`}></i>
                </>
            )}
        </button>

        {!isCollapsed && isOpen && (
            <div className="sb-submenu">
                {items.map((subItem) => (
                    <MenuLink key={subItem.id} item={subItem} isCollapsed={false} sub />
                ))}
            </div>
        )}
    </div>
);

const Sidebar = ({ theme, isCollapsed, styles = {} }) => {
    const location = useLocation();
    const { user, loading } = useAuthUser();

    const [isLandingOpen, setIsLandingOpen] = useState(() => isAnySubItemActive(LANDING_SUB_ITEMS, location.pathname));
    const [isClubOpen, setIsClubOpen] = useState(() => isAnySubItemActive(CLUB_SUB_ITEMS, location.pathname));

    const colors = theme?.isDarkMode ? DARK : LIGHT;

    useEffect(() => {
        if (isAnySubItemActive(LANDING_SUB_ITEMS, location.pathname)) setIsLandingOpen(true);
        if (isAnySubItemActive(CLUB_SUB_ITEMS, location.pathname)) setIsClubOpen(true);
    }, [location.pathname]);

    // শুধু অনুমতি পাওয়া menu
    const allowed = (item) => canAccess(user, item.module);
    const mainItems = MENU_ITEMS.filter(allowed);
    const landingItems = LANDING_SUB_ITEMS.filter(allowed);
    const clubItems = CLUB_SUB_ITEMS.filter(allowed);

    const topItems = mainItems.filter((i) => i.id === 'dashboard' || i.id === 'users');
    const restItems = mainItems.filter((i) => i.id !== 'dashboard' && i.id !== 'users');

    const cssVars = {
        '--sb-bg': colors.bg,
        '--sb-text': colors.text,
        '--sb-muted': colors.muted,
        '--sb-accent': colors.accent,
        '--sb-accent-on': colors.accentOn,
        '--sb-border': colors.border,
        '--sb-hover': colors.hover,
        '--sb-soft': colors.soft,
    };

    return (
        <aside
            className={`sb d-none d-md-block shadow-sm ${isCollapsed ? 'is-collapsed' : ''}`}
            style={{ ...cssVars, ...(styles?.sidebar || {}) }}
        >
            {/* Logo */}
            <div className="sb-logo">
                {isCollapsed ? <div className="sb-logo-mini">D</div> : <h3>DASHBOARD</h3>}
            </div>

            {/* User Card */}
            <div className="sb-user">
                <div className="sb-avatar">{initials(user?.name)}</div>
                {!isCollapsed && (
                    <div className="sb-user-text">
                        <p title={user?.name}>{user?.name || 'Welcome'}</p>
                        <span>{user ? roleLabel(user.role) : 'Loading...'}</span>
                    </div>
                )}
            </div>

            {/* Menu */}
            <nav className="sb-nav">
                {loading && !user ? (
                    <div className="sb-loading">
                        {[1, 2, 3, 4, 5].map((n) => <div key={n} className="sb-skeleton"></div>)}
                    </div>
                ) : (
                    <>
                        {topItems.map((item) => (
                            <MenuLink key={item.id} item={item} isCollapsed={isCollapsed} />
                        ))}

                        {landingItems.length > 0 && (
                            <SubMenu
                                label="Landing Page"
                                icon="bi-browser-safari"
                                items={landingItems}
                                isOpen={isLandingOpen}
                                onToggle={() => setIsLandingOpen((v) => !v)}
                                active={isAnySubItemActive(landingItems, location.pathname)}
                                isCollapsed={isCollapsed}
                            />
                        )}

                        {restItems.map((item) => (
                            <MenuLink key={item.id} item={item} isCollapsed={isCollapsed} />
                        ))}

                        {clubItems.length > 0 && (
                            <SubMenu
                                label="Club"
                                icon="bi-building"
                                items={clubItems}
                                isOpen={isClubOpen}
                                onToggle={() => setIsClubOpen((v) => !v)}
                                active={isAnySubItemActive(clubItems, location.pathname)}
                                isCollapsed={isCollapsed}
                            />
                        )}
                    </>
                )}
            </nav>

            <style>{`
                aside.sb {
                    width: 260px;
                    height: 100vh;
                    flex-shrink: 0;
                    background: var(--sb-bg) !important;
                    border-right: 1px solid var(--sb-border);
                    overflow-y: auto;
                    overflow-x: hidden;
                    transition: width 0.3s ease;
                }
                aside.sb.is-collapsed { width: 80px; }

                aside.sb .sb-logo { padding: 24px 16px 16px; text-align: center; }
                aside.sb .sb-logo h3 { margin: 0; color: var(--sb-accent) !important; font-weight: 800; letter-spacing: 1px; }
                aside.sb .sb-logo-mini {
                    width: 40px; height: 40px; margin: 0 auto; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    background: var(--sb-accent); color: var(--sb-accent-on) !important; font-weight: 700;
                }

                aside.sb .sb-user {
                    display: flex; align-items: center; gap: 12px;
                    margin: 0 12px 20px; padding: 8px; border-radius: 12px;
                    background: var(--sb-soft); border: 1px solid var(--sb-border);
                }
                aside.sb.is-collapsed .sb-user { justify-content: center; }
                aside.sb .sb-avatar {
                    width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    background: var(--sb-accent); color: var(--sb-accent-on) !important;
                    font-weight: 700; font-size: 14px;
                }
                aside.sb .sb-user-text { overflow: hidden; }
                aside.sb .sb-user-text p {
                    margin: 0; font-size: 13px; font-weight: 700; color: var(--sb-text) !important;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                aside.sb .sb-user-text span { font-size: 11px; color: var(--sb-muted) !important; }

                aside.sb .sb-nav { padding: 0 8px 24px; }

                aside.sb .sb-link,
                aside.sb .sb-link:visited {
                    display: flex; align-items: center; gap: 12px; width: 100%;
                    padding: 11px 18px; margin-bottom: 4px; border: none; border-radius: 8px;
                    background: transparent !important; color: var(--sb-text) !important;
                    font-size: 14px; font-weight: 500; text-align: left;
                    text-decoration: none !important; cursor: pointer;
                    transition: background-color 0.2s ease, color 0.2s ease;
                }
                aside.sb .sb-link:hover,
                aside.sb .sb-link:focus-visible {
                    background: var(--sb-hover) !important; color: var(--sb-text) !important; outline: none;
                }
                aside.sb .sb-link.active,
                aside.sb .sb-link.active:hover,
                aside.sb .sb-link.active:focus-visible {
                    background: var(--sb-accent) !important; color: var(--sb-accent-on) !important;
                }
                aside.sb .sb-link i,
                aside.sb .sb-link span,
                aside.sb .sb-link .bi { color: inherit !important; }

                aside.sb .sb-link.sb-parent-active { background: var(--sb-hover) !important; font-weight: 600; }

                aside.sb .sb-icon { font-size: 18px; flex-shrink: 0; width: 20px; text-align: center; }
                aside.sb .sb-label { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                aside.sb .sb-chevron { font-size: 12px; transition: transform 0.2s ease; }
                aside.sb .sb-chevron.open { transform: rotate(180deg); }

                aside.sb .sb-link.sb-collapsed { justify-content: center; padding: 12px 0; }
                aside.sb .sb-link.sb-collapsed .sb-icon { font-size: 20px; }

                aside.sb .sb-group { margin-top: 4px; }
                aside.sb .sb-submenu { margin: 2px 0 6px 18px; padding-left: 8px; border-left: 2px solid var(--sb-border); }
                aside.sb .sb-link.sb-sub { padding: 9px 14px; margin-bottom: 2px; font-size: 13px; }
                aside.sb .sb-link.sb-sub .sb-icon { font-size: 14px; }

                aside.sb .sb-loading { padding: 4px 8px; }
                aside.sb .sb-skeleton {
                    height: 36px; border-radius: 8px; margin-bottom: 8px;
                    background: var(--sb-soft); animation: sbPulse 1.2s ease-in-out infinite;
                }
                @keyframes sbPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

                aside.sb::-webkit-scrollbar { width: 6px; }
                aside.sb::-webkit-scrollbar-thumb { background: var(--sb-border); border-radius: 3px; }
            `}</style>
        </aside>
    );
};

export default Sidebar;