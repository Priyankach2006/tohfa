"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { GiftCard } from "@/components/ui/GiftCard";
import { Button } from "@/components/ui/Button";
import { SlidersHorizontal, Sparkles, Gift, Loader2, Cpu, Check, Award } from "lucide-react";
import { getSuggestions } from "@/lib/api";

const RELATIONS = ["Any", "Mother", "Father", "Wife", "Husband", "Brother", "Sister", "Friends", "Kids"];
const OCCASIONS = ["Any", "Birthday", "Anniversary", "Valentine's", "Diwali", "Holi", "Eid", "Christmas", "Raksha Bandhan", "Wedding", "Housewarming"];
const BUDGETS = [
  { label: "Any Budget", value: "" },
  { label: "Under ₹500", value: "500" },
  { label: "Under ₹1000", value: "1000" },
  { label: "Under ₹2000", value: "2000" },
  { label: "Under ₹5000", value: "5000" },
  { label: "Luxury (₹5000+)", value: "5001" },
];

const INTEREST_OPTIONS = [
  { label: "Romantic", icon: "❤️", value: "romantic" },
  { label: "Tech & Gadgets", icon: "📱", value: "tech" },
  { label: "Wellness & Spa", icon: "🧖", value: "wellness" },
  { label: "Foodie & Coffee", icon: "🍫", value: "foodie" },
  { label: "Art & DIY", icon: "🎨", value: "artistic" },
  { label: "Fashion & Silk", icon: "👗", value: "fashion" },
  { label: "Plants & Green", icon: "🌿", value: "nature" },
  { label: "Books & Journal", icon: "📖", value: "reading" },
];

const AGE_GROUPS = [
  "Any Age",
  "Kids and Teens (Under 18)",
  "Young Adults (18-35)",
  "Middle Aged (35-55)",
  "Seniors (55+)"
];

const FALLBACK_GIFTS = [
  { id: 1, name: "Luxury French Floral Perfume Gift Set", emoji: "flower", price: 1499, tag: "Best Seller", category: "Fragrance", description: "Premium Parisian fragrances", match_percentage: 95 },
  { id: 2, name: "Customized 3D Crystal Photo Cube", emoji: "photo", price: 699, tag: "Trending", category: "Personalized", description: "Handcrafted 3D laser frame", match_percentage: 92 },
  { id: 3, name: "Artisanal Belgian Dark Chocolates Truffle Box", emoji: "choc", price: 999, tag: "Popular", category: "Chocolates", description: "Artisan chocolates worldwide", match_percentage: 90 },
  { id: 4, name: "Retro Walnut Wood Bluetooth Speaker", emoji: "speaker", price: 2199, tag: "Trending", category: "Tech Gadgets", description: "Rich deep bass and vintage casing", match_percentage: 88 },
  { id: 5, name: "Air-Purifying Bonsai and Jade Plant Duo", emoji: "plant", price: 599, tag: "Eco Friendly", category: "Plants", description: "Air-purifying plants set", match_percentage: 85 },
  { id: 6, name: "Rose Gold Infinity Solitaire Bracelet", emoji: "gem", price: 1799, tag: "Exclusive", category: "Jewelry", description: "18k dipped rose gold bracelet", match_percentage: 97 },
];

function SuggestionPageInner() {
  const searchParams = useSearchParams();

  const [relation, setRelation] = useState("Any");
  const [occasion, setOccasion] = useState("Any");
  const [budget, setBudget] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [ageGroup, setAgeGroup] = useState("Any Age");
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const resultsRef = useRef(null);

  const toggleInterest = (val) => {
    setSelectedInterests((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
    );
  };

  const handleSearch = async (overrideSearch, overrideCategory) => {
    setLoading(true);
    setSearched(true);

    try {
      const searchQ = (overrideSearch !== undefined && overrideSearch !== null)
        ? overrideSearch
        : (searchParams.get("search") || searchParams.get("q") || "");
      const categoryQ = (overrideCategory !== undefined && overrideCategory !== null)
        ? overrideCategory
        : (searchParams.get("category") || "");

      const params = {};
      if (relation !== "Any") params.relation = relation.toLowerCase();
      if (occasion !== "Any") params.occasion = occasion.toLowerCase();
      if (budget) params.budget = budget;
      if (categoryQ) params.category = categoryQ.toLowerCase();
      if (searchQ) params.search = searchQ;
      if (selectedInterests.length > 0) params.interests = selectedInterests.join(",");
      if (ageGroup !== "Any Age") params.age_group = ageGroup;

      const data = await getSuggestions(params);
      setGifts(data.gifts || data);
    } catch {
      let filtered = [...FALLBACK_GIFTS];
      if (budget && Number(budget) <= 5000) {
        filtered = filtered.filter((g) => g.price <= Number(budget));
      }
      setGifts(filtered);
    }

    setLoading(false);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  useEffect(() => {
    const r = searchParams.get("relation");
    const o = searchParams.get("occasion");
    const c = searchParams.get("category");
    const s = searchParams.get("search") || searchParams.get("q");

    if (r) setRelation(r.charAt(0).toUpperCase() + r.slice(1));
    if (o) setOccasion(o.charAt(0).toUpperCase() + o.slice(1));

    if (r || o || c || s) {
      handleSearch(s || "", c || "");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-red-50 pb-20">
      <section className="relative py-16 px-4 bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 text-white overflow-hidden">
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow">
              <Cpu className="w-4 h-4 text-amber-300" />
              Machine Learning Gifting Algorithm (TF-IDF and Cosine Affinity)
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">AI Personalized Gift Engine</h1>
            <p className="text-lg text-white/90 max-w-xl mx-auto">
              Our smart algorithm computes personality vectors, relation affinities, and budget fitness to recommend the most meaningful gift.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto -mt-8 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-rose-100"
        >
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-bold text-gray-800">Fine-Tune Recipient Profile</h2>
            </div>
            <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-2.5 py-1 rounded-full">ML Matching Active</span>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">1. Who is it for?</label>
              <select value={relation} onChange={(e) => setRelation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-400 text-sm font-medium transition">
                {RELATIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">2. What is the occasion?</label>
              <select value={occasion} onChange={(e) => setOccasion(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-400 text-sm font-medium transition">
                {OCCASIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">3. Target Budget</label>
              <select value={budget} onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-400 text-sm font-medium transition">
                {BUDGETS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">4. Recipient Age Group</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {AGE_GROUPS.map((ag) => (
                <button key={ag} type="button" onClick={() => setAgeGroup(ag)}
                  className={`py-2 px-3 text-xs rounded-xl font-semibold border transition ${ageGroup === ag ? "bg-red-600 text-white border-red-600 shadow-sm" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}>
                  {ag}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">5. Their Interests and Personality</label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((item) => {
                const isSelected = selectedInterests.includes(item.value);
                return (
                  <button key={item.value} type="button" onClick={() => toggleInterest(item.value)}
                    className={`flex items-center gap-1.5 py-2 px-3.5 rounded-full text-xs font-semibold border transition-all ${isSelected ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-md scale-105" : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-rose-50 hover:border-rose-300"}`}>
                    <span>{item.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-center pt-2">
            <Button size="lg" onClick={() => handleSearch()} disabled={loading} className="px-8 shadow-xl">
              {loading ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Running ML Matching Algorithms...</>
              ) : (
                <><Sparkles className="w-5 h-5 mr-2 text-amber-300" />Compute Personalized Gift Recommendations</>
              )}
            </Button>
          </div>
        </motion.div>
      </section>

      <section ref={resultsRef} className="max-w-6xl mx-auto py-16 px-4">
        {loading ? (
          <div className="text-center py-20 space-y-4">
            <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="inline-block text-6xl">
              🤖
            </motion.div>
            <h3 className="text-xl font-bold text-gray-800">Running TF-IDF Vectors and Cosine Scoring</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">Analyzing sentiment keywords, relationship affinities, and budget fitness...</p>
          </div>
        ) : searched && gifts.length > 0 ? (
          <>
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100/70 px-3 py-1 rounded-full mb-2">
                <Award className="w-3.5 h-3.5" />Ranked by ML Composite Confidence Score
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900">Found {gifts.length} Personalized Gift{gifts.length > 1 ? "s" : ""}</h2>
              <p className="text-gray-500 text-sm mt-1">Gifts sorted from highest semantic match to lowest based on your profile inputs</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gifts.map((gift, i) => (
                <motion.div key={gift.id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={i === 0 ? "relative" : ""}>
                  {i === 0 && (
                    <div className="absolute -top-3 left-4 z-20 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                      Top AI Pick ({gift.match_percentage || 98}% Match)
                    </div>
                  )}
                  <GiftCard gift={gift} />
                </motion.div>
              ))}
            </div>
          </>
        ) : searched ? (
          <div className="text-center py-20 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm max-w-lg mx-auto">
            <span className="text-5xl block mb-3">🔍</span>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No direct matches found</h3>
            <p className="text-sm text-gray-500 mb-6">Try choosing broader interests or adjusting the budget to expand ML recommendations.</p>
            <Button onClick={() => { setRelation("Any"); setOccasion("Any"); setBudget(""); setSelectedInterests([]); handleSearch("", ""); }}>
              Reset Filters and Show All
            </Button>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl p-8 border border-rose-100 shadow-sm max-w-2xl mx-auto">
            <Gift className="w-16 h-16 text-rose-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Ready to find a personalized tohfa?</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Select your relation, occasion, and your loved ones hobbies above. Our machine learning engine will score each gift and explain why it is the right fit!
            </p>
            <Button size="lg" onClick={() => handleSearch()}>
              <Sparkles className="w-4 h-4 mr-2" />Start Personalization
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

export default function SuggestionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-5xl animate-bounce">🎁</div>
          <p className="text-gray-500 font-medium">Loading Gift Engine...</p>
        </div>
      </div>
    }>
      <SuggestionPageInner />
    </Suspense>
  );
}
