"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { loginUser, registerUser } from "@/lib/api";
import { Mail, Lock, User, Eye, EyeOff, Sparkles, Gift } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "signup" && form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        await registerUser({ name: form.name, email: form.email, password: form.password });
        setSuccess("Account created successfully! Redirecting...");
      } else {
        await loginUser({ email: form.email, password: form.password });
        setSuccess("Login successful! Redirecting...");
      }
      setTimeout(() => router.push("/profile"), 1000);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:block"
        >
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Gift className="w-4 h-4" />
              Welcome to Tohfa4U
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
              Find the <span className="text-red-500">Perfect Gift</span> for Everyone
            </h2>
            <p className="text-gray-500 text-lg mb-8">
              Join Tohfa4U to get personalized gift suggestions, save your wishlist, and never miss an occasion.
            </p>

            <div className="space-y-4">
              {[
                { icon: <Sparkles className="w-5 h-5" />, text: "AI-powered gift recommendations" },
                { icon: "🎁", text: "Save & share your wishlist" },
                { icon: "🔔", text: "Occasion reminders & alerts" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="flex items-center gap-3 text-gray-600"
                >
                  <span className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                    {item.icon}
                  </span>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right - Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100"
        >
          {/* Toggle */}
          <div className="mb-6 rounded-xl bg-gray-50 p-1.5 flex gap-2">
            {["signin", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); setSuccess(""); }}
                className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${mode === m
                    ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {m === "signin" ? "Login" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Error / Success Messages */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-xl text-sm">
              {success}
            </motion.div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="confirm"
                    type="password"
                    value={form.confirm}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    placeholder="Repeat password"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60"
            >
              {loading ? "Please wait..." : mode === "signin" ? "Login" : "Create Account"}
            </button>

            <p className="text-xs text-gray-400 text-center">
              By continuing, you agree to our Terms and Privacy Policy.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
