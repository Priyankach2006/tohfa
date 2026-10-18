'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Heart,
    User,
    Search,
    LogOut,
    Sparkles,
    Gift,
    Menu,
    X,
    Package,
    Tag
} from 'lucide-react';
import { getStoredUser, logoutUser, getWishlist, searchGifts } from '@/lib/api';

export default function Header() {
    const [user, setUser] = useState(null);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const router = useRouter();
    const searchRef = useRef(null);
    const userMenuRef = useRef(null);

    const syncUserData = () => {
        setUser(getStoredUser());
    };

    const syncWishlist = async () => {
        try {
            const data = await getWishlist();
            if (data && data.wishlist) {
                setWishlistCount(data.wishlist.length);
            }
        } catch {
            const stored = JSON.parse(localStorage.getItem('wishlist_items') || '[]');
            setWishlistCount(stored.length);
        }
    };

    useEffect(() => {
        syncUserData();
        syncWishlist();

        window.addEventListener('authChange', syncUserData);
        window.addEventListener('wishlistChange', syncWishlist);

        // Click outside handler
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSearchDropdown(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('authChange', syncUserData);
            window.removeEventListener('wishlistChange', syncWishlist);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Live search debounced
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setShowSearchDropdown(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await searchGifts(searchQuery);
                setSearchResults(res.gifts ? res.gifts.slice(0, 5) : []);
                setShowSearchDropdown(true);
            } catch (err) {
                console.error(err);
            }
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowSearchDropdown(false);
            router.push(`/suggestion?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleLogout = () => {
        logoutUser();
        setUser(null);
        setShowUserMenu(false);
        router.push('/login');
    };

    return (
        <header style={{ background: "#fff", borderBottom: "1px solid rgba(201,151,44,0.2)", boxShadow: "0 2px 20px rgba(190,45,58,0.06)" }} className="sticky top-0 z-50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20 gap-4">
                    {/* Left: Brand Logo & Main Nav */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform"
                                style={{ background: "linear-gradient(135deg, #be2d3a 0%, #c9972c 100%)" }}>
                                <Gift className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xl font-extrabold" style={{ fontFamily: "'Playfair Display', serif", color: "#2d1f1f" }}>Tohfa4U</span>
                                <p className="text-[9px] tracking-widest uppercase font-medium" style={{ color: "#c9972c", lineHeight: 1 }}>Curated Gifts</p>
                            </div>
                        </Link>

                        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold" style={{ color: "#6b5b4e" }}>
                            <Link href="/" className="hover:text-[#be2d3a] transition-colors">Home</Link>
                            <Link href="/suggestion" className="hover:text-[#be2d3a] transition-colors flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5" style={{ color: "#c9972c" }} />
                                Gift Ideas
                            </Link>
                            <Link href="/foru" className="hover:text-[#be2d3a] transition-colors">For You</Link>
                            <Link href="/offers" className="hover:text-[#be2d3a] transition-colors flex items-center gap-1">
                                <Tag className="w-3.5 h-3.5" style={{ color: "#be2d3a" }} />
                                Offers
                            </Link>
                            <Link href="/about" className="hover:text-[#be2d3a] transition-colors">About</Link>
                        </nav>
                    </div>

                    {/* Center: Live Search Bar */}
                    <div ref={searchRef} className="relative flex-1 max-w-md hidden sm:block">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search perfumes, chocolates, gifts..."
                                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-full focus:outline-none focus:ring-2 transition-all"
                                style={{ background: "#fdf8f3", border: "1.5px solid rgba(201,151,44,0.25)", color: "#2d1f1f" }}
                                onFocus={e => e.target.style.borderColor = '#c9972c'}
                                onBlur={e => e.target.style.borderColor = 'rgba(201,151,44,0.25)'}
                            />
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#c9972c" }} />
                        </form>

                        {/* Search Dropdown */}
                        {showSearchDropdown && searchResults.length > 0 && (
                            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-rose-100 overflow-hidden z-50">
                                <div className="p-2 divide-y divide-gray-50">
                                    {searchResults.map((gift) => (
                                        <div
                                            key={gift.id}
                                            onClick={() => {
                                                setShowSearchDropdown(false);
                                                router.push(`/suggestion?search=${encodeURIComponent(searchQuery.trim())}`);
                                            }}
                                            className="p-2.5 flex items-center gap-3 hover:bg-rose-50/60 rounded-xl cursor-pointer transition"
                                        >
                                            <span className="text-2xl">{gift.emoji || '🎁'}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 truncate">{gift.name}</p>
                                                <p className="text-xs text-gray-400">{gift.category}</p>
                                            </div>
                                            <span className="text-sm font-bold text-red-600">₹{gift.price}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-gray-50 px-4 py-2 text-center text-xs text-red-600 font-semibold cursor-pointer hover:bg-rose-50"
                                     onClick={handleSearchSubmit}>
                                    View all matching gifts &rarr;
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3 md:gap-4">
                        {/* Wishlist Icon */}
                        <Link
                            href="/wishlist"
                            className="relative p-2.5 rounded-full hover:bg-rose-50 text-gray-700 hover:text-red-600 transition"
                            title="Your Wishlist"
                        >
                            <Heart className="w-5 h-5" />
                            {wishlistCount > 0 && (
                                <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* User Account / Login */}
                        {user ? (
                            <div ref={userMenuRef} className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-rose-50 border border-rose-100 transition"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                                        {user.name ? user.name.charAt(0) : 'U'}
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700 hidden md:block max-w-[100px] truncate">
                                        {user.name.split(' ')[0]}
                                    </span>
                                </button>

                                {/* User Dropdown */}
                                {showUserMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-rose-100 py-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                            <span className="inline-block mt-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                                                {user.vip_tier || 'Member'}
                                            </span>
                                        </div>
                                        <Link
                                            href="/profile"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-red-600 transition"
                                        >
                                            <User className="w-4 h-4" />
                                            My Profile
                                        </Link>
                                        <Link
                                            href="/profile"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-red-600 transition"
                                        >
                                            <Package className="w-4 h-4" />
                                            My Orders
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-rose-50 transition border-t border-gray-100 mt-1"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white shadow-md transition hover:scale-105"
                                style={{ background: "linear-gradient(135deg, #be2d3a, #c9972c)" }}
                            >
                                <User className="w-3.5 h-3.5" />
                                <span>Sign In</span>
                            </Link>
                        )}

                        {/* Mobile Hamburger Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 lg:hidden"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                {mobileMenuOpen && (
                    <div className="lg:hidden py-4 border-t border-gray-100 space-y-3">
                        <form onSubmit={handleSearchSubmit} className="relative sm:hidden mb-3">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search gifts..."
                                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </form>
                        <nav className="flex flex-col gap-2 font-medium text-gray-700">
                            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-rose-50">Home</Link>
                            <Link href="/suggestion" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-rose-50">Gift Ideas</Link>
                            <Link href="/foru" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-rose-50">For You</Link>
                            <Link href="/offers" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-rose-50">Offers & Deals</Link>
                            <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-rose-50">Wishlist ({wishlistCount})</Link>
                            <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-rose-50">Profile & Orders</Link>
                            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-rose-50">About Us</Link>
                            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-rose-50">Contact Us</Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
