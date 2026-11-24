import { useEffect, useState } from 'react';
import { API_BASE_URL } from './api';

// Backend এর User::MODULES এর সাথে মিল রাখতে হবে
export const MODULES = [
    { key: 'landing', label: 'Landing Page', icon: 'bi-browser-safari' },
    { key: 'gallery', label: 'Gallery', icon: 'bi-images' },
    { key: 'project', label: 'Project View', icon: 'bi-kanban-fill' },
    { key: 'package_query', label: 'Package Query', icon: 'bi-inbox-fill' },
    { key: 'blog', label: 'Blog', icon: 'bi-newspaper' },
    { key: 'notice', label: 'Notice', icon: 'bi-megaphone-fill' },
    { key: 'packages', label: 'Price Statistics', icon: 'bi-graph-up' },
    { key: 'affiliates', label: 'Affiliates', icon: 'bi-share-fill' },
    { key: 'partners', label: 'Sister Concerns', icon: 'bi-diagram-3-fill' },
    { key: 'events', label: 'Events', icon: 'bi-calendar-event-fill' },
    { key: 'team', label: 'Teams', icon: 'bi-person-lines-fill' },
    { key: 'faq', label: 'FAQ', icon: 'bi-question-circle-fill' },
    { key: 'jobs', label: 'Job', icon: 'bi-briefcase-fill' },
    { key: 'job_applications', label: 'Job Query', icon: 'bi-envelope-open-fill' },
    { key: 'investment_query', label: 'Invest Query', icon: 'bi-cash-coin' },
    { key: 'club', label: 'Club', icon: 'bi-building' },
];

export const ROLES = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'visitor', label: 'Visitor' },
];

const CACHE_KEY = 'authUser';
const EVENT = 'auth-user-updated';
const MAX_AGE = 60 * 1000; // ১ মিনিট পর পর server থেকে নতুন করে আনবে

export const normalizeRole = (role) =>
    String(role || '').toLowerCase().trim().replace(/[\s-]+/g, '_');

export const roleLabel = (role) => {
    const found = ROLES.find((r) => r.value === normalizeRole(role));
    if (found) return found.label;
    return role || 'Unknown';
};

const readCache = () => {
    try {
        const raw = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
        // অন্য account এর পুরোনো cache হলে বাদ
        if (raw && raw.token === localStorage.getItem('token')) return raw;
    } catch (e) {
        /* ignore */
    }
    return null;
};

export const getCachedUser = () => {
    const cache = readCache();
    return cache ? cache.user : null;
};

const writeCache = (user) => {
    try {
        if (user) {
            localStorage.setItem(
                CACHE_KEY,
                JSON.stringify({ token: localStorage.getItem('token'), user, at: Date.now() })
            );
        } else {
            localStorage.removeItem(CACHE_KEY);
        }
    } catch (e) {
        /* ignore */
    }
    window.dispatchEvent(new Event(EVENT));
};

/** Logout এর সময় এটা call করুন */
export const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('Role');
    writeCache(null);
};

export const isSuperAdmin = (user) => !!user && normalizeRole(user.role) === 'super_admin';

/** module না দিলে শুধু login লাগবে (যেমন dashboard) */
export const canAccess = (user, module) => {
    if (!user) return false;

    const role = normalizeRole(user.role);

    if (!module) return role === 'super_admin' || role === 'admin';
    if (role === 'super_admin') return true;
    if (module === 'users') return false;
    if (role !== 'admin') return false;

    return Array.isArray(user.modules) && user.modules.includes(module);
};

let inflight = null;

export const fetchAuthUser = (force = false) => {
    const token = localStorage.getItem('token');
    if (!token) {
        writeCache(null);
        return Promise.resolve(null);
    }

    const cached = readCache();
    if (!force && cached && Date.now() - (cached.at || 0) < MAX_AGE) {
        return Promise.resolve(cached.user);
    }

    if (inflight) return inflight;

    inflight = (async() => {
        try {
            const res = await fetch(`${API_BASE_URL}/user`, {
                headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
            });

            if (res.status === 401) {
                clearAuth();
                return null;
            }
            if (!res.ok) return getCachedUser();

            const body = await res.json();
            const user = body && body.data ? body.data : body;
            writeCache(user);
            return user;
        } catch (e) {
            return getCachedUser();
        } finally {
            inflight = null;
        }
    })();

    return inflight;
};

/** যেকোনো component এ: const { user, loading } = useAuthUser(); */
export const useAuthUser = () => {
    const [user, setUser] = useState(getCachedUser);
    const [loading, setLoading] = useState(() => !getCachedUser() && !!localStorage.getItem('token'));

    useEffect(() => {
        let alive = true;
        const sync = () => {
            if (alive) setUser(getCachedUser());
        };
        window.addEventListener(EVENT, sync);

        fetchAuthUser().finally(() => {
            if (!alive) return;
            setUser(getCachedUser());
            setLoading(false);
        });

        return () => {
            alive = false;
            window.removeEventListener(EVENT, sync);
        };
    }, []);

    return { user, loading, refresh: () => fetchAuthUser(true) };
};