'use client';

import Link from 'next/link';
import {
  HomeIcon,
  UserIcon,
  HeartIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <header className="bg-white text-red-600 p-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
        {/* Left: Logo + Home + For U */}
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold">
            <Link href="/" className="hover:text-orange-400">
              Tohfa4U
            </Link>
          </h1>
         
          
        </div>

        {/* Center: Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-40 px-3 py-1 rounded-md text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-6">

        <Link href="/foru" className="hover:text-orange-400 text-lg font-serif italic text-red-600">
            For you
          </Link>
          <Link href="/profile" className="hover:text-orange-400">
            <UserIcon className="h-5 w-5" />
          </Link>
          <Link href="/wishlist" className="hover:text-orange-400">
            <HeartIcon className="h-5 w-5" />
          </Link>
          <Link href="/login" className="hover:text-orange-400">
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
