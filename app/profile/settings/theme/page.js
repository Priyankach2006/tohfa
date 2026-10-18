'use client';

import { useEffect, useState } from 'react';

export default function ThemeSettings() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">Theme Settings</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Current Theme: <strong>{theme.toUpperCase()}</strong>
        </p>
        <button
          onClick={toggleTheme}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          Toggle to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>
    </div>
  );
}
