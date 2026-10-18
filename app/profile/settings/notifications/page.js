"use client";

import { useState } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    offers: true,
    wallet: false,
    recommendations: true,
    appUpdates: false,
  });

  const toggleNotification = (type) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const notificationOptions = [
    {
      label: "Order Updates",
      key: "orderUpdates",
      desc: "Receive updates about your orders and delivery status.",
    },
    {
      label: "Offers & Promotions",
      key: "offers",
      desc: "Get notified about the latest deals and sales.",
    },
    {
      label: "Wallet & Payment Alerts",
      key: "wallet",
      desc: "Important alerts related to transactions or refunds.",
    },
    {
      label: "Recommendations",
      key: "recommendations",
      desc: "Personalized suggestions based on your activity.",
    },
    {
      label: "App Updates",
      key: "appUpdates",
      desc: "Information about new features or changes in the app.",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-red-600 mb-6">
        Notification Preferences
      </h1>
      <ul className="space-y-4">
        {notificationOptions.map(({ label, key, desc }) => (
          <li
            key={key}
            className="p-4 border border-red-100 rounded-xl bg-red-50 hover:bg-red-100 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-red-700">{label}</h3>
                <p className="text-sm text-red-500">{desc}</p>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={notifications[key]}
                  onChange={() => toggleNotification(key)}
                />
                <div
                  className={`w-11 h-6 rounded-full ${
                    notifications[key] ? "bg-red-500" : "bg-gray-300"
                  } relative transition-colors`}
                >
                  <span
                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                      notifications[key] ? "translate-x-5" : ""
                    }`}
                  />
                </div>
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
