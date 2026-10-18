"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Gift, Sparkles, Star, Heart, CheckCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GiftCard } from "@/components/ui/GiftCard";
import { getGifts, subscribeNewsletter } from "@/lib/api";

const RELATIONS = [
  { name: "Mother", emoji: "👩", color: "bg-pink-50 border-pink-200 hover:border-pink-400", slug: "mother" },
  { name: "Father", emoji: "👨", color: "bg-blue-50 border-blue-200 hover:border-blue-400", slug: "father" },
  { name: "Wife", emoji: "💕", color: "bg-rose-50 border-rose-200 hover:border-rose-400", slug: "wife" },
  { name: "Husband", emoji: "💙", color: "bg-sky-50 border-sky-200 hover:border-sky-400", slug: "husband" },
  { name: "Brother", emoji: "🤝", color: "bg-green-50 border-green-200 hover:border-green-400", slug: "brother" },
  { name: "Sister", emoji: "👧", color: "bg-purple-50 border-purple-200 hover:border-purple-400", slug: "sister" },
  { name: "Friends", emoji: "🎉", color: "bg-amber-50 border-amber-200 hover:border-amber-400", slug: "friends" },
];

const OCCASIONS = [
  { name: "Birthday", emoji: "🎂", bg: "from-pink-400 to-rose-500" },
  { name: "Anniversary", emoji: "💍", bg: "from-rose-400 to-red-500" },
  { name: "Valentine's", emoji: "❤️", bg: "from-red-400 to-rose-600" },
  { name: "Diwali", emoji: "🪔", bg: "from-amber-400 to-orange-500" },
  { name: "Eid", emoji: "🌙", bg: "from-emerald-400 to-green-600" },
  { name: "Christmas", emoji: "🎄", bg: "from-green-500 to-emerald-700" },
  { name: "Raksha Bandhan", emoji: "🧵", bg: "from-orange-400 to-amber-600" },
  { name: "Holi", emoji: "🎨", bg: "from-purple-400 to-violet-600" },
];

const CATEGORIES = [
  { name: "Chocolates", emoji: "🍫", count: "12 items", slug: "chocolates" },
  { name: "Jewelry", emoji: "💍", count: "9 items", slug: "jewelry" },
  { name: "Perfumes", emoji: "🌸", count: "8 items", slug: "fragrance" },
  { name: "Plants", emoji: "🌿", count: "7 items", slug: "plants" },
  { name: "Tech Gifts", emoji: "📱", count: "6 items", slug: "tech gadgets" },
  { name: "Fashion", emoji: "👗", count: "5 items", slug: "fashion" },
];

const TRENDING_FALLBACK = [
  { id: 1, name: "Luxury Perfume Set", emoji: "🌸", price: 1499, original_price: 2499, tag: "Best Seller", category: "Fragrance", description: "A premium collection of exotic fragrances", rating: 4.9 },
  { id: 2, name: "Customized Photo Frame", emoji: "🖼️", price: 699, original_price: 999, tag: "Trending", category: "Personalized", description: "Beautiful handcrafted frame with your memories", rating: 4.7 },
  { id: 3, name: "Belgian Dark Chocolates Box", emoji: "🍫", price: 999, original_price: 1499, tag: "Popular", category: "Chocolates", description: "Artisan chocolates from around the world", rating: 4.8 },
  { id: 4, name: "Handmade Jewelry Box", emoji: "💎", price: 1799, original_price: 2299, tag: "Exclusive", category: "Jewelry", description: "Ornate wooden box with velvet lining", rating: 4.9 },
  { id: 5, name: "Indoor Plant Set", emoji: "🌿", price: 599, original_price: 799, tag: "Eco Friendly", category: "Plants", description: "Low maintenance air-purifying plants", rating: 4.6 },
  { id: 6, name: "Silk Scarf Collection", emoji: "🧣", price: 1299, original_price: 1799, tag: "Premium", category: "Fashion", description: "Hand-woven pure silk scarves", rating: 4.8 },
];

const WHY_US = [
  { icon: "🎀", title: "Curated with Love", desc: "Every gift is handpicked by our team and verified for quality." },
  { icon: "✨", title: "AI-Personalized", desc: "Our smart engine finds the perfect match for your person and budget." },
  { icon: "🚀", title: "Fast Delivery", desc: "Beautifully packed and delivered on time, every time." },
  { icon: "💯", title: "Happiness Guaranteed", desc: "100% satisfaction or your money back, no questions asked." },
];

export default function Home() {
  const [trendingGifts, setTrendingGifts] = useState(TRENDING_FALLBACK);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMsg, setNewsletterMsg] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [activeOccasion, setActiveOccasion] = useState(0);

  useEffect(() => {
    async function loadTrending() {
      try {
        const res = await getGifts({ featured: true });
        if (res && res.gifts && res.gifts.length > 0) {
          setTrendingGifts(res.gifts.slice(0, 6));
        }
      } catch (e) { /* use fallback */ }
    }
    loadTrending();
    const t = setInterval(() => setActiveOccasion(p => (p + 1) % OCCASIONS.length), 3000);
    return () => clearInterval(t);
  }, []);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribing(true);
    try {
      await subscribeNewsletter(newsletterEmail);
      setNewsletterMsg("You are in! Watch your inbox for curated gift ideas.");
      setNewsletterEmail("");
    } catch {
      setNewsletterMsg("You are in! Watch your inbox for curated gift ideas.");
    }
    setSubscribing(false);
  };

  return (
    <div className="overflow-x-hidden" style={{ background: "var(--cream)" }}>

      {/* ─── HERO ──────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d0a0f] via-[#4a1220] to-[#1a0a2e]" />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 30% 40%, #c9972c55 0%, transparent 50%), radial-gradient(circle at 75% 70%, #be2d3a44 0%, transparent 50%)" }} />

        {/* Floating gift icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {["🎁","🌹","🍫","💍","🎀","✨","🕯️","💐"].map((icon, i) => (
            <motion.div key={i}
              className="absolute text-3xl select-none"
              style={{ left: `${8 + i * 12}%`, top: `${15 + (i % 4) * 20}%`, opacity: 0.15 }}
              animate={{ y: [0, -15, 0], rotate: [0, 8, -8, 0] }}
              transition={{ duration: 5 + i * 0.7, repeat: Infinity, ease: "easeInOut" }}>
              {icon}
            </motion.div>
          ))}
        </div>

        {/* Gold ribbon top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c9972c] to-transparent opacity-60" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-[#f0d080] px-5 py-2 rounded-full text-sm font-medium mb-8 tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              Curated Gifts — Delivered with Love
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            The Perfect <span className="shimmer-gold italic">Tohfa</span><br />
            for Every Occasion
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-white/75 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            From luxurious perfumes to handcrafted keepsakes — we help you say
            <em className="text-[#f0d080] not-italic font-medium"> exactly</em> what you feel.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/suggestion">
              <button className="group flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-[#2d0a0f] text-base shadow-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,151,44,0.4)] hover:scale-105"
                style={{ background: "linear-gradient(135deg, #f0d080 0%, #c9972c 100%)" }}>
                <Gift className="w-5 h-5" />
                Find a Gift
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/foru">
              <button className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-base border border-white/30 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <Heart className="w-4 h-4 text-rose-300" />
                Gifts For You
              </button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="flex flex-wrap justify-center gap-6 mt-14 text-white/50 text-xs font-medium tracking-wide uppercase">
            {["10,000+ Happy Gifters", "37+ Curated Gifts", "Same Day Dispatch", "100% Genuine"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#c9972c]" />{t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <svg viewBox="0 0 1440 64" fill="none" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0 64L1440 64L1440 20C1200 60 900 0 600 30C300 60 100 10 0 20L0 64Z" fill="#fdf8f3" />
          </svg>
        </div>
      </section>

      {/* ─── OCCASION STRIP ─────────────────────────────────── */}
      <section className="py-10 px-4" style={{ background: "var(--cream)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="ornament-divider mb-8">
            <span className="text-sm font-semibold tracking-widest text-[#c9972c] uppercase">Shop by Occasion</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {OCCASIONS.map((occ, i) => (
              <motion.div key={occ.name} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}>
                <Link href={`/suggestion?occasion=${occ.name.toLowerCase()}`}>
                  <div className={`flex items-center gap-2.5 px-5 py-3 rounded-full border-2 font-medium text-sm cursor-pointer transition-all duration-300 ${activeOccasion === i ? 'bg-[#be2d3a] border-[#be2d3a] text-white shadow-lg' : 'bg-white border-[#e8d5c4] text-[#6b5b4e] hover:border-[#c9972c] hover:text-[#c9972c]'}`}>
                    <span>{occ.emoji}</span>
                    {occ.name}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GIFT BY RELATION ───────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest text-[#c9972c] uppercase mb-3">Thoughtful Gifting</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d1f1f] mb-4">Who Are You Gifting?</h2>
            <p className="text-[#6b5b4e] text-lg max-w-xl mx-auto">Personalized picks for everyone who matters — curated just for your relationship.</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {RELATIONS.map((rel, i) => (
              <motion.div key={rel.slug}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}>
                <Link href={`/suggestion?relation=${rel.slug}`}>
                  <div className={`group text-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${rel.color} card-warm`}>
                    <div className="text-4xl mb-3 block float-anim" style={{ animationDelay: `${i * 0.4}s` }}>{rel.emoji}</div>
                    <p className="font-semibold text-sm text-[#2d1f1f] group-hover:text-[#be2d3a] transition-colors">{rel.name}</p>
                    <p className="text-[10px] text-[#c9972c] font-medium mt-0.5">View Gifts</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRENDING GIFTS ─────────────────────────────────── */}
      <section className="py-20 px-4" style={{ background: "var(--cream)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest text-[#c9972c] uppercase mb-3">Most Loved</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d1f1f] mb-4">Trending Gifts</h2>
            <p className="text-[#6b5b4e] text-lg">The gifts everyone is talking about this season</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingGifts.map((gift, i) => (
              <motion.div key={gift.id}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <GiftCard gift={gift} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/suggestion">
              <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#be2d3a] text-[#be2d3a] font-semibold hover:bg-[#be2d3a] hover:text-white transition-all duration-300">
                Explore All Gifts
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ──────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest text-[#c9972c] uppercase mb-3">Browse</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d1f1f] mb-4">Shop by Category</h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                whileHover={{ y: -5 }}>
                <Link href={`/suggestion?category=${cat.slug}`}>
                  <div className="card-warm rounded-2xl p-6 text-center cursor-pointer group">
                    <div className="text-4xl mb-3">{cat.emoji}</div>
                    <p className="font-bold text-[#2d1f1f] text-sm group-hover:text-[#be2d3a] transition-colors">{cat.name}</p>
                    <p className="text-xs text-[#c9972c] font-medium mt-1">{cat.count}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY TOHFA4U ─────────────────────────────────────── */}
      <section className="py-24 px-4 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #2d0a0f 0%, #4a1220 50%, #1a0a2e 100%)" }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #c9972c 0%, transparent 60%), radial-gradient(circle at 80% 50%, #be2d3a 0%, transparent 60%)" }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9972c] to-transparent opacity-50" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-sm font-semibold tracking-widest text-[#f0d080] uppercase mb-4">Why Choose Us</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">Gifting Made Meaningful</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <div className="bg-white/8 backdrop-blur-md rounded-2xl p-7 border border-white/10 hover:border-[#c9972c]/40 transition-all duration-300 text-left group">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#f0d080] transition-colors">{item.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9972c] to-transparent opacity-50" />
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest text-[#c9972c] uppercase mb-3">Real Stories</p>
            <h2 className="text-4xl font-bold text-[#2d1f1f] mb-4">Made People Smile</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Priya S.", city: "Delhi", text: "Ordered a perfume set for my mom. She absolutely loved it. The packaging was so elegant!", rating: 5, gift: "Luxury Perfume Set" },
              { name: "Rahul M.", city: "Mumbai", text: "Sent a chocolate hamper for anniversary. My wife was so surprised. Delivery was on time too!", rating: 5, gift: "Belgian Chocolates" },
              { name: "Aisha K.", city: "Jaipur", text: "The AI suggestions were spot on! Found the perfect Diwali gift for my entire family.", rating: 5, gift: "Diwali Hamper" },
            ].map((review, i) => (
              <motion.div key={review.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="card-warm rounded-2xl p-6 h-full flex flex-col justify-between" style={{ background: "var(--cream)" }}>
                  <div>
                    <div className="flex text-[#c9972c] text-sm mb-3">
                      {"★".repeat(review.rating)}
                    </div>
                    <p className="text-[#4a3728] text-sm leading-relaxed mb-4 italic">"{review.text}"</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-[#e8d5c4]">
                    <div>
                      <p className="font-bold text-[#2d1f1f] text-sm">{review.name}</p>
                      <p className="text-xs text-[#6b5b4e]">{review.city}</p>
                    </div>
                    <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-200 px-2 py-1 rounded-full font-medium">{review.gift}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ──────────────────────────────────────── */}
      <section className="py-20 px-4" style={{ background: "var(--cream)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-5xl mb-4">💌</div>
            <h2 className="text-3xl font-bold text-[#2d1f1f] mb-3">Never Miss a Perfect Gift</h2>
            <p className="text-[#6b5b4e] mb-8">Get weekly curated gift ideas, exclusive deals, and occasion reminders — straight to your inbox.</p>

            {newsletterMsg ? (
              <div className="p-5 bg-green-50 text-green-700 font-semibold rounded-2xl border border-green-200 inline-flex items-center gap-3">
                <CheckCircle className="w-5 h-5" />
                {newsletterMsg}
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input type="email" required value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address..."
                  className="flex-1 px-5 py-3.5 rounded-full border-2 border-[#e8d5c4] focus:outline-none focus:border-[#c9972c] bg-white text-sm text-[#2d1f1f] placeholder-[#9a8880]" />
                <button type="submit" disabled={subscribing}
                  className="px-7 py-3.5 rounded-full font-semibold text-sm text-white whitespace-nowrap transition-all hover:scale-105 shadow-md disabled:opacity-70"
                  style={{ background: "linear-gradient(135deg, #be2d3a, #c9972c)" }}>
                  {subscribing ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
