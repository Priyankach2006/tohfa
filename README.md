# 🎁 Tohfa4U - AI-Powered Full-Stack Gifting Platform

A full-fledged modern gift discovery and ordering web platform with **Next.js 15 (React 19)** on the frontend and a **Python (Flask + SQLAlchemy + SQLite)** backend.

---

## 🌟 Key Features

1. **Machine Learning (ML) Personalization Engine**:
   - Built with **scikit-learn (TF-IDF & Cosine Similarity Hybrid Scorer)** in [`backend/ml_recommender.py`](file:///c:/tohfa4u/backend/ml_recommender.py).
   - Generates composite multi-criteria match confidence scores (e.g. `98% ML Match ✨`) based on **Relation Affinities**, **Occasion Significance**, **Budget Elasticity**, **Personality & Interest Vectors** (Romantic, Tech, Wellness, Foodie, Art, Nature, Fashion, Books), and **Age Group**.
   - Provides **Explainable AI (XAI) rationale**: Explains in natural language *why* a particular gift was chosen for the recipient.
   - Real-time search with live dropdown auto-complete in the header.

2. **Full E-Commerce / Gifting Checkout**:
   - Interactive Gift Detail & Order Modal on any gift card.
   - Enter recipient name, phone, and delivery address.
   - Add personalized greeting card messages.
   - Choose optional luxury ribbon gift-wrapping.
   - Apply active promo codes (`TOHFA50`, `WELCOME20`, `FESTIVE100`) for instant discounts.
   - Real order generation stored in SQLite database with order tracking number.

3. **User Authentication & Profiles**:
   - Secure register & login with password hashing (`Werkzeug`).
   - Profile Dashboard displaying personal details, real order history, active coupons, and **Tohfa VIP Club** rewards points.
   - In-app profile editing (name, phone, address).

4. **Wishlist Sync**:
   - Add / remove gifts to Wishlist with real-time badge count updates in Header.
   - Synchronized between backend database and client fallback.

5. **Customer Reviews & Feedback**:
   - Interactive community feedback submission and display.

6. **Offers & Deals Hub**:
   - Live coupons with 1-click copy code functionality and seasonal discounts.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.3, React 19, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend**: Python 3.12, Flask, Flask-CORS, Flask-SQLAlchemy.
- **Database**: SQLite (`backend/tohfa4u.db`), auto-seeded on first launch.

---

## 🚀 Quick Start (One-Click)

On Windows, double-click **`start.bat`** or run:

```cmd
start.bat
```

This automatically boots both:
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:3000`

---

## 💻 Manual Commands

### 1. Start Python Backend
```cmd
python backend/app.py
```
*(The database and sample gifts/coupons are seeded automatically on first run)*

### 2. Start Next.js Frontend
```cmd
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend and SQLite health check |
| `POST` | `/api/register` | User registration |
| `POST` | `/api/login` | User login (returns auth token) |
| `GET` | `/api/profile` | Current user profile, stats & VIP points |
| `PUT` | `/api/profile` | Update user personal details |
| `GET` | `/api/gifts` | Filter gifts by category, relation, occasion, price |
| `GET` | `/api/suggestions` | AI smart gift recommendation engine |
| `GET` | `/api/search?q=...` | Live keyword search |
| `GET` | `/api/wishlist` | Retrieve user wishlist items |
| `POST` | `/api/wishlist` | Add gift to wishlist |
| `DELETE` | `/api/wishlist/:id` | Remove gift from wishlist |
| `POST` | `/api/orders` | Place a gift order with custom greeting & address |
| `GET` | `/api/orders` | List user orders |
| `GET` | `/api/coupons` | List all active promo discounts |
| `POST` | `/api/apply-coupon`| Validate and calculate coupon discount |
| `POST` | `/api/contact` | Submit contact inquiry |
| `POST` | `/api/newsletter`| Newsletter subscription |
| `GET` | `/api/feedback` | Community customer reviews |
| `POST` | `/api/feedback` | Submit feedback & rating |

---

## 📁 Project Structure

```
tohfa4u/
├── app/
│   ├── about/            # About Us page
│   ├── blog/             # Gifting advice & blog
│   ├── careers/          # Career openings
│   ├── contact/          # Contact form connected to DB
│   ├── faq/              # FAQs & support
│   ├── feedback/         # Reviews & feedback submission
│   ├── foru/             # Curated For You gifts
│   ├── gifts/[slug]/     # Dynamic categories (For Her, For Him, Anniversary, etc.)
│   ├── login/            # Sign In & Sign Up
│   ├── offers/           # Coupons & seasonal deals
│   ├── profile/          # Profile, orders history, VIP club
│   ├── services/         # Services overview
│   ├── suggestion/       # AI Gift recommendation finder
│   ├── team/             # Team page
│   ├── wishlist/         # Wishlist management
│   ├── layout.js         # Root layout with Header & Footer
│   └── page.js           # Main landing page
├── backend/
│   ├── app.py            # Flask API, SQLAlchemy models & database seeder
│   └── tohfa4u.db        # SQLite database
├── components/
│   ├── GiftDetailModal.js# Product preview & gift order checkout modal
│   ├── Header.js         # Live search, wishlist badge, auth state
│   ├── Footer.js         # Complete responsive footer
│   └── ui/GiftCard.js    # Card with instant detail modal & wishlist
├── lib/
│   └── api.js            # Frontend API client
├── package.json
└── start.bat             # 1-click full-stack launcher
```
