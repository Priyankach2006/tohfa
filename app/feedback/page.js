'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, CheckCircle, Send, Heart } from 'lucide-react';
import { getFeedbacks, submitFeedback } from '@/lib/api';

export default function FeedbackPage() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [relation, setRelation] = useState('Customer');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        loadFeedbacks();
    }, []);

    const loadFeedbacks = async () => {
        try {
            const res = await getFeedbacks();
            if (res && res.feedbacks) setFeedbacks(res.feedbacks);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await submitFeedback({ name, email, rating, comment, relation });
            setSuccessMsg('Thank you so much! Your feedback has been posted.');
            setName('');
            setEmail('');
            setComment('');
            loadFeedbacks();
        } catch (err) {
            setSuccessMsg('Thank you for your valuable feedback!');
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-white to-gray-50 py-16 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-600 mb-3 uppercase tracking-wider">
                        <Heart className="w-3.5 h-3.5 fill-rose-500" />
                        Community Love & Reviews
                    </span>
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-3">Customer Feedback & Reviews</h1>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        See what gifters are saying about Tohfa4U and share your own gifting story with us!
                    </p>
                </div>

                <div className="grid md:grid-cols-5 gap-10 items-start">
                    {/* Submit Form */}
                    <div className="md:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-rose-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-red-500" />
                            Leave a Review
                        </h3>

                        {successMsg ? (
                            <div className="p-6 text-center space-y-3">
                                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                                <h4 className="font-bold text-gray-800">{successMsg}</h4>
                                <button
                                    onClick={() => setSuccessMsg('')}
                                    className="text-xs font-bold text-red-600 hover:underline"
                                >
                                    Write Another Review
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Rahul Sharma"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Your Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Who did you buy for?</label>
                                    <select
                                        value={relation}
                                        onChange={(e) => setRelation(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400 focus:outline-none"
                                    >
                                        <option value="Mother">Mother</option>
                                        <option value="Father">Father</option>
                                        <option value="Wife">Wife</option>
                                        <option value="Husband">Husband</option>
                                        <option value="Sister">Sister</option>
                                        <option value="Brother">Brother</option>
                                        <option value="Friend">Friend</option>
                                        <option value="Customer">General Customer</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                                type="button"
                                                key={s}
                                                onClick={() => setRating(s)}
                                                className="p-1 focus:outline-none"
                                            >
                                                <Star
                                                    className={`w-6 h-6 ${
                                                        s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Your Story & Experience</label>
                                    <textarea
                                        rows="3"
                                        required
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="How was the gift delivery and recipient's reaction?"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400 focus:outline-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    {submitting ? 'Submitting...' : 'Post Feedback'}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Feedbacks List */}
                    <div className="md:col-span-3 space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Recent Stories ({feedbacks.length})
                        </h3>

                        {feedbacks.map((fb) => (
                            <div
                                key={fb.id || fb.name}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 hover:shadow-md transition"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-rose-100 text-red-600 font-bold flex items-center justify-center uppercase">
                                            {fb.name ? fb.name.charAt(0) : 'U'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-sm">{fb.name}</h4>
                                            <span className="text-[11px] font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
                                                Gifted to {fb.relation}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 text-amber-400">
                                        {[...Array(fb.rating || 5)].map((_, i) => (
                                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed mb-2">"{fb.comment}"</p>
                                <span className="text-[11px] text-gray-400">{fb.date || 'Recent review'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
