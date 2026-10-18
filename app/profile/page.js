'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Package,
    Gift,
    Crown,
    HelpCircle,
    Settings,
    LogOut,
    User,
    Mail,
    Phone,
    MapPin,
    Copy,
    Check,
    CheckCircle2,
    Clock,
    ShoppingBag
} from 'lucide-react';
import { getProfile, getOrders, getCoupons, logoutUser, updateProfile, isLoggedIn } from '@/lib/api';

export default function ProfileDashboard() {
    const [activeTab, setActiveTab] = useState('orders');
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState(null);
    
    // Edit profile state
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', phone: '', address: '' });
    const [saveSuccess, setSaveSuccess] = useState(false);

    const router = useRouter();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const profileRes = await getProfile();
            if (profileRes && profileRes.user) {
                setUser(profileRes.user);
                setEditForm({
                    name: profileRes.user.name || '',
                    phone: profileRes.user.phone || '',
                    address: profileRes.user.address || ''
                });
            }
        } catch (err) {
            // If guest or unauthorized, check local data
            const local = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('tohfa_user') || 'null') : null;
            if (local) {
                setUser(local);
                setEditForm({ name: local.name, phone: local.phone || '', address: local.address || '' });
            }
        }

        try {
            const ordersRes = await getOrders();
            if (ordersRes && ordersRes.orders) {
                setOrders(ordersRes.orders);
            }
        } catch (err) {
            console.error('Failed to load orders', err);
        }

        try {
            const couponsRes = await getCoupons();
            if (couponsRes && couponsRes.coupons) {
                setCoupons(couponsRes.coupons);
            }
        } catch (err) {
            setCoupons([
                { code: 'TOHFA50', title: 'Flat ₹50 OFF', discount_percent: 10, min_amount: 499 },
                { code: 'WELCOME20', title: '20% OFF First Order', discount_percent: 20, min_amount: 799 }
            ]);
        }

        setLoading(false);
    };

    const handleCopyCoupon = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await updateProfile(editForm);
            if (res.user) setUser(res.user);
            setEditing(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        logoutUser();
        router.push('/login');
    };

    const menuItems = [
        { id: 'orders', label: 'My Orders', icon: Package, count: orders.length },
        { id: 'coupons', label: 'Coupons & Offers', icon: Gift, count: coupons.length },
        { id: 'vip', label: 'Tohfa VIP Club', icon: Crown },
        { id: 'help', label: 'Help & Support', icon: HelpCircle },
        { id: 'settings', label: 'Account Settings', icon: Settings, route: '/profile/settings' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50/50 via-white to-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Profile Header Banner */}
                <div className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
                        <div className="w-20 h-20 rounded-full bg-white text-red-600 flex items-center justify-center font-black text-3xl shadow-lg border-4 border-white/30 uppercase">
                            {user?.name ? user.name.charAt(0) : 'T'}
                        </div>
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                <h1 className="text-2xl md:text-3xl font-extrabold">{user?.name || 'Tohfa Gifter'}</h1>
                                <span className="bg-white/20 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {user?.vip_tier || 'Silver Member'}
                                </span>
                            </div>
                            <p className="text-white/80 text-sm flex items-center justify-center md:justify-start gap-3">
                                <span>{user?.email || 'guest@tohfa4u.com'}</span>
                                {user?.created_at && (
                                    <>
                                        <span>•</span>
                                        <span>Member since {user.created_at}</span>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/20">
                        <div className="text-center">
                            <span className="block text-2xl font-black">{user?.vip_points || 150}</span>
                            <span className="text-xs text-white/80 font-medium">VIP Points</span>
                        </div>
                        <div className="w-px h-8 bg-white/20"></div>
                        <div className="text-center">
                            <span className="block text-2xl font-black">{orders.length}</span>
                            <span className="text-xs text-white/80 font-medium">Total Orders</span>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Left Sidebar Menu */}
                    <div className="md:col-span-1 space-y-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-3 space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            if (item.route) router.push(item.route);
                                            else setActiveTab(item.id);
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                            isActive
                                                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-rose-200'
                                                : 'text-gray-600 hover:bg-rose-50/70 hover:text-red-600'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-4 h-4" />
                                            <span>{item.label}</span>
                                        </div>
                                        {item.count !== undefined && (
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {item.count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}

                            <div className="pt-2 border-t border-gray-100">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-rose-50 transition"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>

                        {/* User Contact Details Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-5 text-xs text-gray-600 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-800 text-sm">Personal Info</span>
                                <button
                                    onClick={() => setEditing(!editing)}
                                    className="text-red-600 font-semibold hover:underline"
                                >
                                    {editing ? 'Cancel' : 'Edit'}
                                </button>
                            </div>

                            {saveSuccess && (
                                <p className="text-green-600 font-semibold bg-green-50 p-2 rounded-lg">
                                    Profile updated successfully!
                                </p>
                            )}

                            {!editing ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-rose-500" />
                                        <span>{user?.phone || 'Add phone number'}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                                        <span>{user?.address || 'Civil Lines, Mathura, Uttar Pradesh'}</span>
                                    </div>
                                </>
                            ) : (
                                <form onSubmit={handleSaveProfile} className="space-y-2 pt-1">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Name</label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full px-2 py-1.5 border rounded-lg text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Phone</label>
                                        <input
                                            type="text"
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            className="w-full px-2 py-1.5 border rounded-lg text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Address</label>
                                        <textarea
                                            rows="2"
                                            value={editForm.address}
                                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                            className="w-full px-2 py-1.5 border rounded-lg text-xs"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-1.5 bg-red-600 text-white font-bold rounded-lg text-xs hover:bg-red-700 transition"
                                    >
                                        Save Changes
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Right Content Tab */}
                    <div className="md:col-span-3">
                        {activeTab === 'orders' && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center justify-between">
                                    <span>Order History ({orders.length})</span>
                                    <button
                                        onClick={() => router.push('/suggestion')}
                                        className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1"
                                    >
                                        <ShoppingBag className="w-3.5 h-3.5" />
                                        Explore More Gifts
                                    </button>
                                </h2>

                                {orders.length === 0 ? (
                                    <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                                        <Package className="w-16 h-16 text-rose-200 mx-auto mb-3" />
                                        <h3 className="text-lg font-bold text-gray-700">No orders placed yet</h3>
                                        <p className="text-sm text-gray-400 mb-5">Your sent gift surprises will appear right here!</p>
                                        <button
                                            onClick={() => router.push('/suggestion')}
                                            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition shadow-md"
                                        >
                                            Find a Gift Now
                                        </button>
                                    </div>
                                ) : (
                                    orders.map((order) => (
                                        <div
                                            key={order.id || order.order_number}
                                            className="bg-white rounded-2xl shadow-sm border border-rose-100 p-5 hover:shadow-md transition"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                                                <div>
                                                    <span className="font-mono font-bold text-red-600 text-sm">
                                                        {order.order_number}
                                                    </span>
                                                    <p className="text-xs text-gray-400 mt-0.5">{order.date}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        {order.status || 'Confirmed'}
                                                    </span>
                                                    <span className="text-base font-extrabold text-gray-900">
                                                        ₹{order.total_amount}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="py-4 space-y-3">
                                                {order.items && order.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-3">
                                                        <span className="text-2xl">{item.emoji || '🎁'}</span>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-bold text-gray-800">{item.name}</p>
                                                            <p className="text-xs text-gray-500">Qty: {item.quantity || 1} • ₹{item.price}</p>
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className="bg-rose-50/40 p-3 rounded-xl text-xs space-y-1 text-gray-600">
                                                    <p><strong className="text-gray-800">Sent To:</strong> {order.recipient_name} ({order.recipient_phone})</p>
                                                    <p><strong className="text-gray-800">Address:</strong> {order.address}</p>
                                                    {order.message_card && (
                                                        <p className="italic text-gray-500 pt-1">
                                                            "{order.message_card}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'coupons' && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-gray-800">Active Coupons & Promo Offers</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {coupons.map((coupon) => (
                                        <div
                                            key={coupon.code}
                                            className="bg-white rounded-2xl p-5 border-2 border-dashed border-rose-200 shadow-sm relative overflow-hidden flex flex-col justify-between"
                                        >
                                            <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-rose-50 rounded-full pointer-events-none"></div>
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-mono font-black text-red-600 text-base bg-rose-50 px-3 py-1 rounded-lg">
                                                        {coupon.code}
                                                    </span>
                                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                                        {coupon.discount_percent}% OFF
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-gray-800 text-sm mb-1">{coupon.title}</h4>
                                                <p className="text-xs text-gray-500 mb-4">
                                                    Applicable on orders above ₹{coupon.min_amount}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleCopyCoupon(coupon.code)}
                                                className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition ${
                                                    copiedCode === coupon.code
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                }`}
                                            >
                                                {copiedCode === coupon.code ? (
                                                    <>
                                                        <Check className="w-3.5 h-3.5" />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3.5 h-3.5" />
                                                        Copy Code
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'vip' && (
                            <div className="bg-white rounded-3xl p-8 border border-rose-100 shadow-sm space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-200">
                                        <Crown className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">Tohfa VIP Club</h2>
                                        <p className="text-xs text-gray-500">Earn rewards with every gift you send</p>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-3 gap-4 text-center">
                                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                                        <span className="text-xs font-bold uppercase text-amber-700">Current Tier</span>
                                        <p className="text-xl font-extrabold text-amber-800 mt-1">{user?.vip_tier || 'Silver Member'}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                                        <span className="text-xs font-bold uppercase text-red-700">Reward Points</span>
                                        <p className="text-xl font-extrabold text-red-800 mt-1">{user?.vip_points || 150} Pts</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                                        <span className="text-xs font-bold uppercase text-emerald-700">Cashback Rate</span>
                                        <p className="text-xl font-extrabold text-emerald-800 mt-1">10% Points</p>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <h4 className="font-bold text-gray-800 text-sm">Tier Benefits</h4>
                                    <ul className="text-xs text-gray-600 space-y-2 list-disc pl-5">
                                        <li>Priority delivery for all festive and anniversary orders</li>
                                        <li>Exclusive access to VIP coupon codes (up to 25% OFF)</li>
                                        <li>Free premium ribbon gift wrapping on orders over ₹999</li>
                                        <li>Dedicated gifting concierge on WhatsApp & Email</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeTab === 'help' && (
                            <div className="bg-white rounded-3xl p-8 border border-rose-100 shadow-sm space-y-6">
                                <h2 className="text-xl font-bold text-gray-800">Tohfa4U Help & Support</h2>
                                <p className="text-sm text-gray-600">
                                    We are committed to making your gifting seamless. Have questions about an order or delivery?
                                </p>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                        <h4 className="font-bold text-sm text-gray-800 mb-1">Customer Support Email</h4>
                                        <p className="text-xs text-gray-500 mb-2">Replies within 2-4 hours</p>
                                        <a href="mailto:support@tohfa4u.com" className="text-xs font-bold text-red-600 hover:underline">
                                            support@tohfa4u.com &rarr;
                                        </a>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                        <h4 className="font-bold text-sm text-gray-800 mb-1">Helpline Phone</h4>
                                        <p className="text-xs text-gray-500 mb-2">Mon - Sat (9:00 AM - 9:00 PM)</p>
                                        <a href="tel:+911234567890" className="text-xs font-bold text-red-600 hover:underline">
                                            +91 12345 67890 &rarr;
                                        </a>
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.push('/contact')}
                                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition"
                                >
                                    Open Contact Page
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
