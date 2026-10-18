'use client'; // Add this to mark this component as client-side

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './globals.css';

export default function Layout({ children }) {
  const [theme, setTheme] = useState('light');

  // Set theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  // Toggle theme and save it in localStorage
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  return (
    <html lang="en" className={theme === 'dark' ? 'dark' : ''}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Tohfa4U — Curated Gifts for Every Occasion</title>
        <meta name="description" content="Discover thoughtful, personalized gift ideas for every occasion and relationship. Perfumes, chocolates, jewelry and more — curated with love." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white dark:bg-gray-900 text-black dark:text-white">
        {/* Header */}
        <Header toggleTheme={toggleTheme} theme={theme} />

        {/* Main Content */}
        <main className="min-h-screen">{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
