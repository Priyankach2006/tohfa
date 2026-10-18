"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GiftCard } from "@/components/ui/GiftCard";
import { Sparkles, RefreshCw } from "lucide-react";
import { getGifts } from "@/lib/api";
import { Button } from "@/components/ui/Button";

const FALLBACK_PICKS = [
  { id: 1, name: "Rose Gold Watch", emoji: "⌚", price: 2499, tag: "Trending", category: "Accessories", description: "Elegant minimalist timepiece" },
  { id: 2, name: "Spa Gift Basket", emoji: "🧖", price: 1299, tag: "Relaxing", category: "Wellness", description: "Lavender bath & body set" },
  { id: 3, name: "Personalized Keychain", emoji: "🔑", price: 299, tag: "Bestseller", category: "Personalized", description: "Custom engraved metal keychain" },
  { id: 4, name: "Motivational Book Set", emoji: "📖", price: 899, tag: "Inspiring", category: "Books", description: "Top 3 motivational reads" },
  { id: 5, name: "Handmade Candle Trio", emoji: "🕯️", price: 649, tag: "Artisan", category: "Home Decor", description: "Soy wax with essential oils" },
  { id: 6, name: "Gourmet Tea Collection", emoji: "🍵", price: 549, tag: "Premium", category: "Beverages", description: "Exotic tea sampler box" },
  { id: 7, name: "Silk Eye Mask", emoji: "😴", price: 399, tag: "Self Care", category: "Wellness", description: "100% mulberry silk eye mask" },
  { id: 8, name: "Photo Album Kit", emoji: "📸", price: 799, tag: "Memories", category: "Personalized", description: "DIY scrapbook with stickers" },
  { id: 9, name: "Exotic Flower Bouquet", emoji: "💐", price: 999, tag: "Fresh", category: "Flowers", description: "Hand-arranged seasonal flowers" },
];

export default function ForYouPage() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGifts = async () => {
    setLoading(true);
    try {
      const data = await getGifts({ featured: true });
      setGifts(data.gifts || data);
    } catch {
      // Shuffle fallback and pick 6
      const shuffled = [...FALLBACK_PICKS].sort(() => Math.random() - 0.5);
      setGifts(shuffled.slice(0, 6));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-red-50">
      {/* Hero */}
      <section className="relative py-16 px-4 bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/10 text-6xl"
              style={{ left: `${10 + i * 20}%`, top: `${15 + (i % 3) * 25}%` }}
              animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3 + i, repeat: Infinity }}
            >
              {['💝', '✨', '🎁', '💫', '🌟'][i]}
            </motion.div>
          ))}
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Curated Just For You
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">For You</h1>
            <p className="text-lg text-white/90">Personalized gift picks handpicked based on what people love!</p>
          </motion.div>
        </div>
      </section>

      {/* Gift Grid */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Your Picks</h2>
          <Button variant="secondary" size="sm" onClick={fetchGifts} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-md animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
                <div className="h-10 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gifts.map((gift, i) => (
              <motion.div
                key={gift.id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <GiftCard gift={gift} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}