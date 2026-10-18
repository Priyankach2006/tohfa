"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { getWishlist, removeFromWishlist } from "@/lib/api";

const FALLBACK_PRODUCTS = [
  { id: 1, name: "Luxury Perfume", price: "₹1,499", tag: "Best Seller", emoji: "🌸" },
  { id: 2, name: "Customized Mug", price: "₹499", tag: "Trending", emoji: "☕" },
  { id: 3, name: "Flower Bouquet", price: "₹899", tag: "New Arrival", emoji: "💐" },
];

export default function WishlistPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getWishlist();
        setProducts(data.wishlist || data);
      } catch {
        // Fallback: load from localStorage
        const stored = JSON.parse(localStorage.getItem("wishlist_items") || "null");
        setProducts(stored || FALLBACK_PRODUCTS);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleRemove = async (id) => {
    try {
      await removeFromWishlist(id);
    } catch {
      // Offline mode
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Also update localStorage
    const updated = products.filter((p) => p.id !== id);
    localStorage.setItem("wishlist_items", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Hero */}
      <section className="py-12 px-4 bg-gradient-to-r from-red-500 to-rose-500 text-white">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-8 h-8" fill="white" />
              <h1 className="text-4xl font-bold">Your Wishlist</h1>
            </div>
            <p className="text-white/80 text-lg">
              {products.length} item{products.length !== 1 ? 's' : ''} saved
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-10 px-4">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-md animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-20 h-20 text-red-200 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Start adding gifts you love to save them here!</p>
            <a href="/suggestion" className="inline-block bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition">
              Browse Gifts
            </a>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-6xl">{product.emoji || '🎁'}</span>
                    )}
                    {product.tag && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {product.tag}
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-1">{product.name}</h2>
                    <p className="text-lg font-bold text-red-600 mb-4">{product.price || `₹${product.price_num || ''}`}</p>

                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-semibold">
                        <ShoppingBag className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleRemove(product.id)}
                        className="p-2.5 rounded-xl border-2 border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}
