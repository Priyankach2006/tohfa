'use client';

import { Sparkles, BookOpen, Clock, ArrowRight } from 'lucide-react';

const ARTICLES = [
    {
        id: 1,
        title: 'Top 10 Thoughtful Anniversary Gifts That Never Fail to Impress',
        category: 'Anniversary Guide',
        date: 'October 2026',
        readTime: '4 min read',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
        excerpt: 'From 3D crystal photos capturing nostalgic wedding moments to hand-dipped rose gold jewelry, here are the highest rated gifts couples cherish.'
    },
    {
        id: 2,
        title: 'How to Pick the Perfect Diwali & Festive Gift for Family & Colleagues',
        category: 'Festive Trends',
        date: 'October 2026',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
        excerpt: 'Avoid generic gifts! Discover how royal brass dry-fruit hampers, artisanal chocolates, and ambient aroma diffusers create lasting festive joy.'
    },
    {
        id: 3,
        title: 'Meaningful Birthday Gifts for Him: Beyond Wallets and Ties',
        category: 'Gifting for Men',
        date: 'October 2026',
        readTime: '3 min read',
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
        excerpt: 'Vintage Bluetooth wooden radios, engraved leather essentials, and wellness kits that suit modern men with discerning taste.'
    }
];

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-white to-gray-50 py-16 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-600 mb-3 uppercase tracking-wider">
                        <BookOpen className="w-3.5 h-3.5" />
                        Gifting Insights & Inspiration
                    </span>
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-3">Tohfa4U Gifting Journal</h1>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        Expert tips, occasion guides, and creative ideas to help you express love with the perfect present.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {ARTICLES.map((article) => (
                        <div
                            key={article.id}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-rose-100 flex flex-col justify-between"
                        >
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between text-xs text-rose-500 font-semibold mb-2">
                                        <span>{article.category}</span>
                                        <span className="flex items-center gap-1 text-gray-400">
                                            <Clock className="w-3 h-3" />
                                            {article.readTime}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-base mb-2 leading-snug">
                                        {article.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 leading-relaxed mb-4">
                                        {article.excerpt}
                                    </p>
                                </div>

                                <a
                                    href="/suggestion"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700"
                                >
                                    Browse Related Gifts
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
