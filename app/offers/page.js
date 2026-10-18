'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag, Sparkles, Copy, Check, Gift, ArrowRight, Percent } from 'lucide-react';
import { getCoupons, getGifts } from '@/lib/api';
import GiftCard from '@/components/ui/GiftCard';

export default function OffersPage() {
    const [coupons, setCoupons] = useState([]);
    const [dealGifts, setDealGifts] = useState([]);
    const [copiedCode, setCopiedCode] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOffers() {
            try {
                const [couponData, giftData] = await Promise.all([
                    getCoupons(),
                    getGifts({ featured: true })
                ]);
                if (couponData && couponData.coupons) setCoupons(couponData.coupons);
                if (giftData && giftData.gifts) setDealGifts(giftData.gifts);
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        }
        fetchOffers();
    }, []);

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50/50 via-white to-gray-50 pb-20">
            {/* Hero Header */}
            <section className="relative py-16 px-4 bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white overflow-hidden text-center">
                <div className="max-w-4xl mx-auto relative z-10">
                    <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                        <Tag className="w-3.5 h-3.5" />
                        Exclusive Offers & Festive Discounts
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                        Celebrate & Save Big on Every Tohfa
                    </h1>
                    <p className="text-white/90 text-lg max-w-2xl mx-auto">
                        Apply verified promo codes and shop exclusive hand-picked gifts at special discounted rates!
                    </p>
                </div>
            </section>

            {/* Coupons Section */}
            <section className="max-w-6xl mx-auto -mt-8 px-4 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-rose-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Percent className="w-6 h-6 text-red-500" />
                        Available Promo Coupons
                    </h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {coupons.map((coupon) => (
                            <div
                                key={coupon.code}
                                className="border-2 border-dashed border-rose-200 rounded-2xl p-5 bg-gradient-to-br from-rose-50/40 to-white hover:border-red-400 transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-mono font-black text-red-600 text-base bg-rose-100/70 px-2.5 py-1 rounded-lg">
                                            {coupon.code}
                                        </span>
                                        <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                                            {coupon.discount_percent}% OFF
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-sm mb-1">{coupon.title}</h3>
                                    <p className="text-xs text-gray-500 mb-4">Min. spend ₹{coupon.min_amount}</p>
                                </div>

                                <button
                                    onClick={() => handleCopy(coupon.code)}
                                    className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition ${
                                        copiedCode === coupon.code
                                            ? 'bg-green-600 text-white'
                                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                                    }`}
                                >
                                    {copiedCode === coupon.code ? (
                                        <>
                                            <Check className="w-3.5 h-3.5" />
                                            Copied Code!
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
            </section>

            {/* Featured Deals Products */}
            <section className="max-w-6xl mx-auto py-16 px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Hot Seasonal Deals</h2>
                        <p className="text-gray-500 text-sm mt-1">Unbeatable discounts on popular gifts this week</p>
                    </div>
                    <a
                        href="/suggestion"
                        className="text-sm font-bold text-red-600 hover:underline flex items-center gap-1"
                    >
                        Browse All &rarr;
                    </a>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dealGifts.map((gift) => (
                        <GiftCard key={gift.id} gift={gift} />
                    ))}
                </div>
            </section>
        </div>
    );
}
