import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const MENU_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2', path: '/dashboard' },
    { id: 'users', label: 'Users', icon: 'bi-people-fill', path: '/users' },
    { id: 'gallery', label: 'Gallery', icon: 'bi-images', path: '/admin-gallery' },
    { id: 'query', label: 'Package Query', icon: 'bi-inbox-fill', path: '/package-query' },
    { id: 'project', label: 'Project View', icon: 'bi-kanban-fill', path: '/admin-project-view' },
    { id: 'blog', label: 'Blog Page', icon: 'bi-newspaper', path: '/admin-blog' },
    { id: 'notice', label: 'Notice', icon: 'bi-megaphone-fill', path: '/admin-notice' },
    { id: 'statistics', label: 'Price statistics', icon: 'bi-graph-up', path: '/admin-stat' },
    { id: 'affilites', label: 'Affiliates', icon: 'bi-share-fill', path: '/admin-affilites' },
    { id: 'sister', label: 'Sister Concerns', icon: 'bi-diagram-3-fill', path: '/admin-sister' },
    { id: 'events', label: 'Events', icon: 'bi-calendar-event-fill', path: '/admin-events' },
    { id: 'teams', label: 'Teams', icon: 'bi-person-lines-fill', path: '/admin-team' },
    { id: 'FAQ', label: 'FAQ', icon: 'bi-question-circle-fill', path: '/admin-faq' },
    { id: 'JOB', label: 'Job', icon: 'bi-briefcase-fill', path: '/admin-job' },
    { id: 'JOBQUERY', label: 'Job Query', icon: 'bi-envelope-open-fill', path: '/admin-jobquery' },
];

const CLUB_SUB_ITEMS = [
    { id: 'club-info', label: 'Club Info', icon: 'bi-info-circle-fill', path: '/admin-club' },
    { id: 'club-gallery', label: 'Club Gallery', icon: 'bi-images', path: '/admin-club-gallery' },
];

const LANDING_SUB_ITEMS = [
    { id: 'content', label: 'Contents', icon: 'bi-files', path: '/content' },
    { id: 'welcome', label: 'Welcome Section', icon: 'bi-emoji-smile-fill', path: '/welcome' },
    { id: 'video', label: 'Video Section', icon: 'bi-play-btn-fill', path: '/video' },
    { id: 'owner', label: 'Owner Section', icon: 'bi-person-badge-fill', path: '/owner-section' },
    { id: 'benefit', label: 'Owner Benefit', icon: 'bi-gem', path: '/owner-benefit' },
    { id: 'investment', label: 'Investment Package', icon: 'bi-piggy-bank-fill', path: '/admin-investment' },
    { id: 'investmentbenefit', label: 'Investment Benefit', icon: 'bi-bar-chart-steps', path: '/admin-investmentbenefit' },
    { id: 'luxury', label: 'Luxury Section', icon: 'bi-gem', path: '/admin-luxury' },
    { id: 'testo', label: 'Testo Section', icon: 'bi-chat-quote-fill', path: '/admin-testo' },
    { id: 'client', label: 'Happy Client', icon: 'bi-emoji-laughing-fill', path: '/admin-client' },
    { id: 'achievement', label: 'Achievement', icon: 'bi-trophy-fill', path: '/admin-achievement' },
    { id: 'investrecord', label: 'Invest Record', icon: 'bi-cash-stack', path: '/admin-investrecord' },
];

// ---------- রং: সব page এ একই (page এর theme রং নেওয়া হয় না, শুধু dark mode দেখে) ----------
const LIGHT = {
    bg: '#ffffff',
    text: '#111111',
    muted: '#6b6b6b',
    accent: '#111111',
    accentOn: '#ffffff',
    border: '#dcdcdc',
    hover: 'rgba(0,0,0,0.05)',
    soft: '#f5f5f5',
};

const DARK = {
    bg: '#141414',
    text: '#f5f5f5',
    muted: '#a3a3a3',
    accent: '#f5f5f5',
    accentOn: '#111111',
    border: '#2b2b2b',
    hover: 'rgba(255,255,255,0.07)',
    soft: 'rgba(255,255,255,0.05)',
};

const isAnySubItemActive = (subItems, pathname) => subItems.some((item) => pathname === item.path);

/* ---------- Single menu link (component এর বাইরে, তাই প্রতি render এ নতুন হয় না) ---------- */
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

/* ---------- Dropdown menu ---------- */
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
    const [isLandingOpen, setIsLandingOpen] = useState(() => isAnySubItemActive(LANDING_SUB_ITEMS, location.pathname));
    const [isClubOpen, setIsClubOpen] = useState(() => isAnySubItemActive(CLUB_SUB_ITEMS, location.pathname));

    const colors = theme?.isDarkMode ? DARK : LIGHT;

    // অন্য page এ গেলে সংশ্লিষ্ট dropdown খোলা রাখো
    useEffect(() => {
        if (isAnySubItemActive(LANDING_SUB_ITEMS, location.pathname)) setIsLandingOpen(true);
        if (isAnySubItemActive(CLUB_SUB_ITEMS, location.pathname)) setIsClubOpen(true);
    }, [location.pathname]);

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
                <img src="https://i.pravatar.cc/40?img=12" alt="user" />
                {!isCollapsed && (
                    <div className="sb-user-text">
                        <p>Welcome</p>
                        <span>Premium Admin</span>
                    </div>
                )}
            </div>

            {/* Menu */}
            <nav className="sb-nav">
                {MENU_ITEMS.slice(0, 2).map((item) => (
                    <MenuLink key={item.id} item={item} isCollapsed={isCollapsed} />
                ))}

                <SubMenu
                    label="Landing Page"
                    icon="bi-browser-safari"
                    items={LANDING_SUB_ITEMS}
                    isOpen={isLandingOpen}
                    onToggle={() => setIsLandingOpen((v) => !v)}
                    active={isAnySubItemActive(LANDING_SUB_ITEMS, location.pathname)}
                    isCollapsed={isCollapsed}
                />

                {MENU_ITEMS.slice(2).map((item) => (
                    <MenuLink key={item.id} item={item} isCollapsed={isCollapsed} />
                ))}

                <SubMenu
                    label="Club"
                    icon="bi-building"
                    items={CLUB_SUB_ITEMS}
                    isOpen={isClubOpen}
                    onToggle={() => setIsClubOpen((v) => !v)}
                    active={isAnySubItemActive(CLUB_SUB_ITEMS, location.pathname)}
                    isCollapsed={isCollapsed}
                />
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

                /* Logo */
                aside.sb .sb-logo { padding: 24px 16px 16px; text-align: center; }
                aside.sb .sb-logo h3 {
                    margin: 0;
                    color: var(--sb-accent) !important;
                    font-weight: 800;
                    letter-spacing: 1px;
                }
                aside.sb .sb-logo-mini {
                    width: 40px;
                    height: 40px;
                    margin: 0 auto;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--sb-accent);
                    color: var(--sb-accent-on) !important;
                    font-weight: 700;
                }

                /* User card */
                aside.sb .sb-user {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin: 0 12px 20px;
                    padding: 8px;
                    border-radius: 12px;
                    background: var(--sb-soft);
                    border: 1px solid var(--sb-border);
                }
                aside.sb.is-collapsed .sb-user { justify-content: center; }
                aside.sb .sb-user img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    padding: 2px;
                    border: 2px solid var(--sb-accent);
                    flex-shrink: 0;
                }
                aside.sb .sb-user-text { overflow: hidden; }
                aside.sb .sb-user-text p {
                    margin: 0;
                    font-size: 13px;
                    font-weight: 700;
                    color: var(--sb-text) !important;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                aside.sb .sb-user-text span { font-size: 11px; color: var(--sb-muted) !important; }

                /* Menu */
                aside.sb .sb-nav { padding: 0 8px 24px; }

                /* সব অবস্থায় (normal / hover / focus / visited) রং এখানে ঠিক করা */
                aside.sb .sb-link,
                aside.sb .sb-link:visited {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                    padding: 11px 18px;
                    margin-bottom: 4px;
                    border: none;
                    border-radius: 8px;
                    background: transparent !important;
                    color: var(--sb-text) !important;
                    font-size: 14px;
                    font-weight: 500;
                    text-align: left;
                    text-decoration: none !important;
                    cursor: pointer;
                    transition: background-color 0.2s ease, color 0.2s ease;
                }
                aside.sb .sb-link:hover,
                aside.sb .sb-link:focus-visible {
                    background: var(--sb-hover) !important;
                    color: var(--sb-text) !important;
                    outline: none;
                }
                aside.sb .sb-link.active,
                aside.sb .sb-link.active:hover,
                aside.sb .sb-link.active:focus-visible {
                    background: var(--sb-accent) !important;
                    color: var(--sb-accent-on) !important;
                }

                /* ভেতরের icon / লেখা সবসময় link এর রং নেবে (বাইরের CSS কাজ করবে না) */
                aside.sb .sb-link i,
                aside.sb .sb-link span,
                aside.sb .sb-link .bi {
                    color: inherit !important;
                }

                /* Dropdown এর ভেতরের page active থাকলে parent হালকা হাইলাইট */
                aside.sb .sb-link.sb-parent-active {
                    background: var(--sb-hover) !important;
                    font-weight: 600;
                }

                aside.sb .sb-icon { font-size: 18px; flex-shrink: 0; width: 20px; text-align: center; }
                aside.sb .sb-label { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

                aside.sb .sb-chevron { font-size: 12px; transition: transform 0.2s ease; }
                aside.sb .sb-chevron.open { transform: rotate(180deg); }

                /* Collapsed */
                aside.sb .sb-link.sb-collapsed { justify-content: center; padding: 12px 0; }
                aside.sb .sb-link.sb-collapsed .sb-icon { font-size: 20px; }

                /* Sub menu */
                aside.sb .sb-group { margin-top: 4px; }
                aside.sb .sb-submenu {
                    margin: 2px 0 6px 18px;
                    padding-left: 8px;
                    border-left: 2px solid var(--sb-border);
                }
                aside.sb .sb-link.sb-sub {
                    padding: 9px 14px;
                    margin-bottom: 2px;
                    font-size: 13px;
                }
                aside.sb .sb-link.sb-sub .sb-icon { font-size: 14px; }

                /* Scrollbar */
                aside.sb::-webkit-scrollbar { width: 6px; }
                aside.sb::-webkit-scrollbar-thumb { background: var(--sb-border); border-radius: 3px; }
            `}</style>
        </aside>
    );
};

export default Sidebar;  