'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, Mail, Phone, MessageSquare } from 'lucide-react';

const FAQS = [
    {
        q: 'How does Tohfa4U AI gift suggestion work?',
        a: 'Our smart recommendation engine analyzes the recipient relationship (mother, father, partner, friend), the occasion (birthday, anniversary, festival), and your budget to suggest personalized gifts with high sentiment value and verified quality ratings.'
    },
    {
        q: 'Can I add custom message cards and gift wrapping?',
        a: 'Yes! When placing any order, you can choose premium ribbon gift wrapping and type a customized greeting card message that our team will hand-write or print in elegant script and attach to your package.'
    },
    {
        q: 'How long does delivery take?',
        a: 'Standard delivery takes 2 to 4 business days across India. We also offer express delivery in metro areas. You will receive an SMS and email notification with your tracking details once dispatched.'
    },
    {
        q: 'What is Tohfa VIP Club and how do I earn points?',
        a: 'Every time you order a gift on Tohfa4U, you earn 10% cashback in VIP Points. These points can be redeemed on future orders for instant discounts and exclusive rewards.'
    },
    {
        q: 'Can I send gifts anonymously or as a surprise?',
        a: 'Absolutely! You can specify recipient delivery details, and your identity will remain confidential unless you choose to sign your name in the gift card message.'
    },
    {
        q: 'What is your refund or replacement policy?',
        a: 'If any gift arrives damaged, broken, or defective, contact us within 48 hours with a picture, and our support team will immediately arrange a hassle-free replacement or full refund.'
    }
];

export default function FAQPage() {
    const [openIdx, setOpenIdx] = useState(0);

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-white to-gray-50 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-600 mb-3 uppercase tracking-wider">
                        <HelpCircle className="w-3.5 h-3.5" />
                        Got Questions? We Have Answers
                    </span>
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-3">Frequently Asked Questions</h1>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        Everything you need to know about Tohfa4U gift orders, deliveries, customization, and payments.
                    </p>
                </div>

                <div className="space-y-4 mb-16">
                    {FAQS.map((faq, i) => {
                        const isOpen = openIdx === i;
                        return (
                            <div
                                key={i}
                                className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden transition-all"
                            >
                                <button
                                    onClick={() => setOpenIdx(isOpen ? null : i)}
                                    className="w-full p-5 text-left flex items-center justify-between font-bold text-gray-800 hover:text-red-600 transition"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-400 transform transition-transform ${
                                            isOpen ? 'rotate-180 text-red-600' : ''
                                        }`}
                                    />
                                </button>
                                {isOpen && (
                                    <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Still have questions */}
                <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl p-8 text-white text-center shadow-xl">
                    <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
                    <p className="text-white/90 text-sm max-w-md mx-auto mb-6">
                        Our dedicated support concierge is ready to assist you with order inquiries, bulk gifting, and corporate orders.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="/contact"
                            className="px-6 py-2.5 bg-white text-red-600 font-bold rounded-xl text-sm shadow hover:bg-rose-50 transition"
                        >
                            Contact Support
                        </a>
                        <a
                            href="tel:+911234567890"
                            className="px-6 py-2.5 bg-white/20 border border-white/40 text-white font-bold rounded-xl text-sm hover:bg-white/30 transition"
                        >
                            Call Helpline
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
