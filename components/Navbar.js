// components/Navbar.js
'use client';

import { useEffect, useState } from 'react';

const Navbar = ({ toggleTheme, theme }) => {
  return (
    <nav className="bg-white dark:bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-semibold text-red-600">Tohfa4U</h1>
        <button
          onClick={toggleTheme}
          className="bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-4 py-2 rounded transition"
        >
          {theme === 'light' ? '🌙 Dark Mode' : '🌞 Light Mode'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
