'use client';

import { useState } from 'react';
import { Heart, Eye } from 'lucide-react';
import GiftDetailModal from '@/components/GiftDetailModal';
import { addToWishlist, removeFromWishlist } from '@/lib/api';

export function GiftCard({ gift, onWishlistToggle, isWishlisted = false }) {
    const [liked, setLiked] = useState(isWishlisted);
    const [imageError, setImageError] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const discount = gift.original_price && gift.original_price > gift.price
        ? Math.round(((gift.original_price - gift.price) / gift.original_price) * 100)
        : null;

    const handleLike = async (e) => {
        e.stopPropagation();
        const nextState = !liked;
        setLiked(nextState);
        try {
            if (nextState) await addToWishlist(gift.id);
            else await removeFromWishlist(gift.id);
        } catch {}
        if (onWishlistToggle) onWishlistToggle(gift.id, nextState);
    };

    return (
        <>
            <div onClick={() => setModalOpen(true)}
                className="group cursor-pointer rounded-2xl overflow-hidden flex flex-col"
                style={{
                    background: "#fff",
                    border: "1px solid rgba(201,151,44,0.15)",
                    boxShadow: "0 2px 16px rgba(190,45,58,0.06), 0 1px 4px rgba(0,0,0,0.04)",
                    transition: "box-shadow 0.3s ease, transform 0.3s ease"
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = "0 16px 48px rgba(190,45,58,0.14), 0 6px 16px rgba(0,0,0,0.08)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = "0 2px 16px rgba(190,45,58,0.06), 0 1px 4px rgba(0,0,0,0.04)";
                    e.currentTarget.style.transform = "translateY(0)";
                }}>

                {/* Image area */}
                <div className="relative h-52 overflow-hidden" style={{ background: "linear-gradient(135deg, #fdf8f3 0%, #f9eaea 100%)" }}>
                    {gift.image && !imageError ? (
                        <img src={gift.image} alt={gift.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={() => setImageError(true)} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl">{gift.emoji || '🎁'}</span>
                        </div>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Wishlist btn */}
                    <button type="button" onClick={handleLike} aria-label="Wishlist"
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300 shadow-md ${liked ? 'bg-[#be2d3a] text-white scale-110' : 'bg-white/90 text-[#be2d3a] hover:scale-110 backdrop-blur-sm'}`}>
                        <Heart className="w-3.5 h-3.5" fill={liked ? 'white' : 'none'} />
                    </button>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {gift.match_percentage ? (
                            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full text-white shadow-md"
                                style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}>
                                ✨ {gift.match_percentage}% Match
                            </span>
                        ) : gift.tag ? (
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white shadow-md"
                                style={{ background: "linear-gradient(135deg, #be2d3a, #c9972c)" }}>
                                {gift.tag}
                            </span>
                        ) : null}
                        {discount && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500 text-white">
                                {discount}% OFF
                            </span>
                        )}
                    </div>

                    {/* Quick view */}
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="flex items-center gap-1.5 bg-white/95 text-[#2d1f1f] text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
                            <Eye className="w-3 h-3" /> Quick View
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            {gift.category && (
                                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#c9972c" }}>
                                    {gift.category}
                                </span>
                            )}
                            {gift.rating && (
                                <span className="text-[11px] font-bold text-amber-500 flex items-center gap-0.5">
                                    ★ {gift.rating}
                                    {gift.review_count && <span className="text-gray-400 font-normal">({gift.review_count})</span>}
                                </span>
                            )}
                        </div>

                        <h3 className="font-bold text-[#2d1f1f] text-[15px] mb-2 line-clamp-2 group-hover:text-[#be2d3a] transition-colors leading-snug"
                            style={{ fontFamily: "'Playfair Display', serif" }}>
                            {gift.name}
                        </h3>

                        {gift.ai_explanation ? (
                            <p className="text-[11px] text-purple-700 bg-purple-50 p-2 rounded-lg mb-2 line-clamp-2 border border-purple-100 leading-snug">
                                ✨ {gift.ai_explanation}
                            </p>
                        ) : gift.description ? (
                            <p className="text-xs text-[#6b5b4e] mb-2 line-clamp-2 leading-relaxed">{gift.description}</p>
                        ) : null}
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#f0e8e0]">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-extrabold" style={{ color: "#be2d3a" }}>
                                {gift.price ? `₹${gift.price.toLocaleString('en-IN')}` : 'Free'}
                            </span>
                            {gift.original_price && gift.original_price > gift.price && (
                                <span className="text-xs text-gray-400 line-through">₹{gift.original_price.toLocaleString('en-IN')}</span>
                            )}
                        </div>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
                            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full text-white transition-all duration-300 hover:scale-105 shadow-sm"
                            style={{ background: "linear-gradient(135deg, #be2d3a, #c9972c)" }}>
                            View Gift
                        </button>
                    </div>
                </div>
            </div>

            <GiftDetailModal gift={gift} isOpen={modalOpen} onClose={() => setModalOpen(false)}
                isInitiallyWishlisted={liked} onWishlistChange={(id, state) => setLiked(state)} />
        </>
    );
}

export default GiftCard;
