"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaGlobe,
  FaBell,
  FaPalette,
  FaUserShield,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

const languages = ["English", "Hindi", "Tamil", "Bengali"];

export default function SettingsPage() {
  const [selected, setSelected] = useState(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("English");
  const router = useRouter();

  useEffect(() => {
    const savedLang = localStorage.getItem("preferredLanguage");
    if (savedLang) setCurrentLanguage(savedLang);
  }, []);

  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem("preferredLanguage", lang);
    setShowLanguageModal(false);
  };

  const settingsOptions = [
    {
      label: "Change Language",
      icon: <FaGlobe />,
      action: () => setShowLanguageModal(true),
    },
    {
      label: "Notification Preferences",
      icon: <FaBell />,
      action: () => router.push("/profile/settings/notifications"),
    },
    {
      label: "App Theme",
      icon: <FaPalette />,
      action: () => router.push("/profile/settings/theme"),
    },
    {
      label: "Privacy Policy",
      icon: <FaUserShield />,
      action: () => router.push("/profile/settings/privacy-policy"),
    },
    {
      label: "Logout",
      icon: <FaSignOutAlt />,
      action: () => alert("Logged out"),
    },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-red-50 rounded-2xl shadow-xl border border-red-200 p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-6">Settings</h2>
        <ul className="space-y-4">
          {settingsOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => {
                setSelected(option.label);
                option.action();
              }}
              className="flex items-center justify-between bg-white hover:bg-red-100 p-4 rounded-xl cursor-pointer border border-red-100 transition"
            >
              <div className="flex items-center gap-4 text-red-600">
                {option.icon}
                <span>
                  {option.label}
                  {option.label === "Change Language" && (
                    <span className="text-sm text-red-400 ml-2">
                      ({currentLanguage})
                    </span>
                  )}
                </span>
              </div>
              <span className="text-sm text-red-400">
                {selected === option.label ? "✔" : ""}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-80 relative">
            <button
              onClick={() => setShowLanguageModal(false)}
              className="absolute top-2 right-2 text-red-500"
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-bold text-red-600 mb-4">
              Select Language
            </h3>
            <ul className="space-y-3">
              {languages.map((lang) => (
                <li
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`p-3 rounded-xl cursor-pointer border border-red-200 ${
                    currentLanguage === lang
                      ? "bg-red-100 text-red-700 font-semibold"
                      : "hover:bg-red-50 text-red-600"
                  }`}
                >
                  {lang}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
