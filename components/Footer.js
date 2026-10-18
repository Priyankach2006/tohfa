'use client';

import Link from 'next/link';
import { Gift, Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-rose-100 text-gray-700 py-12 mt-16 shadow-inner">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Main 4 Column Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

                    {/* Brand Col */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-200">
                                <Gift className="w-5 h-5" />
                            </div>
                            <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                                Tohfa4U
                            </span>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Your thoughtful AI-powered gifting partner. Discover, personalize, and deliver genuine smiles across India.
                        </p>
                        <div className="flex gap-2 pt-2">
                            <a href="https://facebook.com/tohfa4u" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-red-600 flex items-center justify-center text-sm font-bold transition">fb</a>
                            <a href="https://twitter.com/tohfa4u" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-red-600 flex items-center justify-center text-sm font-bold transition">tw</a>
                            <a href="https://instagram.com/tohfa4u" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-red-600 flex items-center justify-center text-sm font-bold transition">in</a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-gray-900 text-base mb-4">About Tohfa4U</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/about" className="hover:text-red-600 transition">About Us</Link></li>
                            <li><Link href="/team" className="hover:text-red-600 transition">Our Team</Link></li>
                            <li><Link href="/careers" className="hover:text-red-600 transition">Careers</Link></li>
                            <li><Link href="/services" className="hover:text-red-600 transition">Our Services</Link></li>
                            <li><Link href="/feedback" className="hover:text-red-600 transition">Customer Reviews</Link></li>
                            <li><Link href="/blog" className="hover:text-red-600 transition">Gifting Blog</Link></li>
                        </ul>
                    </div>

                    {/* Offers & Support */}
                    <div>
                        <h3 className="font-bold text-gray-900 text-base mb-4">Offers & Help</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/offers" className="hover:text-red-600 transition">Current Offers</Link></li>
                            <li><Link href="/offers" className="hover:text-red-600 transition">Seasonal Deals</Link></li>
                            <li><Link href="/offers" className="hover:text-red-600 transition">Exclusive Coupons</Link></li>
                            <li><Link href="/faq" className="hover:text-red-600 transition">FAQs</Link></li>
                            <li><Link href="/contact" className="hover:text-red-600 transition">Customer Support</Link></li>
                            <li><Link href="/profile/settings/privacy-policy" className="hover:text-red-600 transition">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-bold text-gray-900 text-base mb-4">Popular Collections</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/gifts/for-her" className="hover:text-red-600 transition">Gifts For Her</Link></li>
                            <li><Link href="/gifts/for-him" className="hover:text-red-600 transition">Gifts For Him</Link></li>
                            <li><Link href="/gifts/for-kids" className="hover:text-red-600 transition">Gifts For Kids</Link></li>
                            <li><Link href="/gifts/anniversary" className="hover:text-red-600 transition">Anniversary Gifts</Link></li>
                            <li><Link href="/gifts/birthday" className="hover:text-red-600 transition">Birthday Surprises</Link></li>
                            <li><Link href="/gifts/festive" className="hover:text-red-600 transition">Festive Hampers</Link></li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Contact Bar */}
                <div className="border-t border-gray-100 pt-8 pb-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                        <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-red-500" />
                            contact@tohfa4u.com
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-red-500" />
                            +91 12345 67890
                        </span>
                        <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-red-500" />
                            Ramghat Road, Mathura, UP
                        </span>
                    </div>

                    <p>&copy; {new Date().getFullYear()} Tohfa4U. All rights reserved. Crafted with care in India.</p>
                </div>

            </div>
        </footer>
    );
}
