const API_BASE = 'http://localhost:5000/api';

export function getToken() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('tohfa_token');
    }
    return null;
}

export function setToken(token) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('tohfa_token', token);
    }
}

export function removeToken() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('tohfa_token');
        localStorage.removeItem('tohfa_user');
    }
}

export function getStoredUser() {
    if (typeof window !== 'undefined') {
        const u = localStorage.getItem('tohfa_user');
        if (u) {
            try { return JSON.parse(u); } catch { return null; }
        }
    }
    return null;
}

export function setStoredUser(user) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('tohfa_user', JSON.stringify(user));
        // Dispatch custom event for real-time header sync
        window.dispatchEvent(new Event('authChange'));
    }
}

async function request(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || data.message || 'Something went wrong');
        }

        return data;
    } catch (err) {
        if (err.message === 'Failed to fetch') {
            console.warn('Backend server is not reachable, using offline mode');
            throw new Error('Backend server is not reachable. Please check backend connection.');
        }
        throw err;
    }
}

// ─── AUTH ───────────────────────────────────────────
export async function registerUser({ name, email, password }) {
    const data = await request('/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
    });
    if (data.token) setToken(data.token);
    if (data.user) setStoredUser(data.user);
    return data;
}

export async function loginUser({ email, password }) {
    const data = await request('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    if (data.token) setToken(data.token);
    if (data.user) setStoredUser(data.user);
    return data;
}

export function logoutUser() {
    removeToken();
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authChange'));
    }
}

export async function getProfile() {
    const data = await request('/profile');
    if (data.user) setStoredUser(data.user);
    return data;
}

export async function updateProfile(userData) {
    const data = await request('/profile', {
        method: 'PUT',
        body: JSON.stringify(userData),
    });
    if (data.user) setStoredUser(data.user);
    return data;
}

export function isLoggedIn() {
    return !!getToken();
}

// ─── GIFTS ──────────────────────────────────────────
export async function getGifts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/gifts${query ? `?${query}` : ''}`);
}

export async function getGiftById(id) {
    return request(`/gifts/${id}`);
}

export async function getCategories() {
    return request('/categories');
}

export async function getSuggestions(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/suggestions${query ? `?${query}` : ''}`);
}

// ─── WISHLIST ───────────────────────────────────────
export async function getWishlist() {
    try {
        const data = await request('/wishlist');
        if (typeof window !== 'undefined' && data.wishlist) {
            localStorage.setItem('wishlist_count', data.wishlist.length);
            window.dispatchEvent(new Event('wishlistChange'));
        }
        return data;
    } catch (e) {
        // Fallback to local storage
        if (typeof window !== 'undefined') {
            const stored = JSON.parse(localStorage.getItem('wishlist_items') || '[]');
            return { wishlist: stored };
        }
        throw e;
    }
}

export async function addToWishlist(giftId) {
    try {
        const res = await request('/wishlist', {
            method: 'POST',
            body: JSON.stringify({ gift_id: giftId }),
        });
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('wishlistChange'));
        }
        return res;
    } catch (e) {
        return { message: 'Saved locally' };
    }
}

export async function removeFromWishlist(giftId) {
    try {
        const res = await request(`/wishlist/${giftId}`, {
            method: 'DELETE',
        });
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('wishlistChange'));
        }
        return res;
    } catch (e) {
        return { message: 'Removed locally' };
    }
}

// ─── ORDERS ─────────────────────────────────────────
export async function createOrder(orderData) {
    return request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
    });
}

export async function getOrders() {
    return request('/orders');
}

// ─── CONTACT & NEWSLETTER ───────────────────────────
export async function submitContactForm({ name, email, message }) {
    return request('/contact', {
        method: 'POST',
        body: JSON.stringify({ name, email, message }),
    });
}

export async function subscribeNewsletter(email) {
    return request('/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
}

// ─── FEEDBACK / REVIEWS ─────────────────────────────
export async function getFeedbacks() {
    return request('/feedback');
}

export async function submitFeedback(data) {
    return request('/feedback', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// ─── COUPONS ────────────────────────────────────────
export async function getCoupons() {
    return request('/coupons');
}

export async function applyCoupon(code, amount) {
    return request('/apply-coupon', {
        method: 'POST',
        body: JSON.stringify({ code, amount }),
    });
}

// ─── SEARCH ─────────────────────────────────────────
export async function searchGifts(query) {
    return request(`/search?q=${encodeURIComponent(query)}`);
}
