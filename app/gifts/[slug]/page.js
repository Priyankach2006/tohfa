'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Gift, Sparkles, Filter } from 'lucide-react';
import { getGifts } from '@/lib/api';
import GiftCard from '@/components/ui/GiftCard';

const SLUG_TITLES = {
    'for-her': { title: 'Gifts For Her', relation: 'wife,mother,sister', emoji: '👩', subtitle: 'Curated perfumes, luxury jewelry, handbags & thoughtful hampers.' },
    'for-him': { title: 'Gifts For Him', relation: 'husband,father,brother', emoji: '👨', subtitle: 'Leather accessories, tech gadgets, watches, and grooming kits.' },
    'for-kids': { title: 'Gifts For Kids', relation: 'brother,sister', emoji: '🧸', subtitle: 'Fun DIY art sets, creative toys, learning kits & chocolates.' },
    'anniversary': { title: 'Anniversary Gifts', occasion: 'anniversary', emoji: '💍', subtitle: 'Romantic photo crystals, personalized keepsakes & gourmet flowers.' },
    'birthday': { title: 'Birthday Gifts', occasion: 'birthday', emoji: '🎂', subtitle: 'Unforgettable surprises for everyone turning a year wiser.' },
    'festive': { title: 'Festive & Diwali Gifts', occasion: 'diwali,eid,christmas', emoji: '🪔', subtitle: 'Royal dry fruits, sweets, decorative home lamps & festive hampers.' }
};

export default function GiftCategoryPage() {
    const params = useParams();
    const slug = params?.slug ? String(params.slug).toLowerCase() : 'for-her';
    
    const info = SLUG_TITLES[slug] || {
        title: slug.replace(/-/g, ' ').toUpperCase(),
        emoji: '🎁',
        subtitle: 'Handpicked gift suggestions for every special person and occasion.'
    };

    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                let queryParam = {};
                if (slug === 'for-her') queryParam.relation = 'wife';
                else if (slug === 'for-him') queryParam.relation = 'husband';
                else if (slug === 'for-kids') queryParam.category = 'diy kits';
                else if (slug === 'anniversary') queryParam.occasion = 'anniversary';
                else queryParam.category = slug.replace(/-/g, ' ');

                const res = await getGifts(queryParam);
                if (res && res.gifts && res.gifts.length > 0) {
                    setGifts(res.gifts);
                } else {
                    // Fallback to all gifts
                    const allRes = await getGifts();
                    setGifts(allRes.gifts || []);
                }
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        }
        load();
    }, [slug]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-white to-gray-50 pb-20">
            {/* Header */}
            <section className="py-16 px-4 bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white text-center">
                <div className="max-w-4xl mx-auto">
                    <span className="text-5xl block mb-3">{info.emoji}</span>
                    <h1 className="text-4xl md:text-5xl font-black mb-3">{info.title}</h1>
                    <p className="text-white/90 text-lg max-w-xl mx-auto">{info.subtitle}</p>
                </div>
            </section>

            {/* Catalog Grid */}
            <section className="max-w-6xl mx-auto py-12 px-4">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <span className="text-sm font-semibold text-gray-500">
                        Showing {gifts.length} curated gift{gifts.length !== 1 ? 's' : ''}
                    </span>
                    <a href="/suggestion" className="text-xs font-bold text-red-600 hover:underline">
                        Need Custom Filters? Try AI Suggestion &rarr;
                    </a>
                </div>

                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-4 shadow animate-pulse">
                                <div className="h-48 bg-gray-200 rounded-xl mb-4" />
                                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-4 bg-gray-100 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gifts.map((gift) => (
                            <GiftCard key={gift.id} gift={gift} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
