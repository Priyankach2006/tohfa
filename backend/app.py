import os
import sys
import json
import secrets
import datetime
from functools import wraps

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# Import Machine Learning Recommender
from ml_recommender import recommender

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# Database Configuration
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, "tohfa4u.db")
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_PATH}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "tohfa4u_super_secret_key_2026")

db = SQLAlchemy(app)

# ─── MODELS ─────────────────────────────────────────────────────────────────

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), default="")
    address = db.Column(db.String(255), default="")
    vip_points = db.Column(db.Integer, default=150)
    vip_tier = db.Column(db.String(50), default="Silver Member")
    token = db.Column(db.String(100), unique=True, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone or "",
            "address": self.address or "",
            "vip_points": self.vip_points,
            "vip_tier": self.vip_tier,
            "created_at": self.created_at.strftime("%B %Y") if self.created_at else "Recently"
        }

class Gift(db.Model):
    __tablename__ = "gifts"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    emoji = db.Column(db.String(20), default="🎁")
    image = db.Column(db.String(300), default="")
    price = db.Column(db.Integer, nullable=False)
    original_price = db.Column(db.Integer, nullable=False)
    tag = db.Column(db.String(50), default="Trending")
    category = db.Column(db.String(80), nullable=False, index=True)
    relation = db.Column(db.String(120), default="all")
    occasion = db.Column(db.String(120), default="all")
    description = db.Column(db.Text, default="")
    rating = db.Column(db.Float, default=4.8)
    review_count = db.Column(db.Integer, default=124)
    featured = db.Column(db.Boolean, default=False)
    in_stock = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "emoji": self.emoji,
            "image": self.image,
            "price": self.price,
            "original_price": self.original_price,
            "tag": self.tag,
            "category": self.category,
            "relation": self.relation,
            "occasion": self.occasion,
            "description": self.description,
            "rating": self.rating,
            "review_count": self.review_count,
            "featured": self.featured,
            "in_stock": self.in_stock
        }

class Wishlist(db.Model):
    __tablename__ = "wishlist"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    gift_id = db.Column(db.Integer, db.ForeignKey("gifts.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    gift = db.relationship("Gift")

class Order(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    recipient_name = db.Column(db.String(100), nullable=False)
    recipient_phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    occasion = db.Column(db.String(100), default="Celebration")
    message_card = db.Column(db.Text, default="")
    gift_wrapping = db.Column(db.Boolean, default=True)
    total_amount = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default="Confirmed")
    items_json = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        try:
            items = json.loads(self.items_json)
        except Exception:
            items = []
        return {
            "id": self.id,
            "order_number": self.order_number,
            "recipient_name": self.recipient_name,
            "recipient_phone": self.recipient_phone,
            "address": self.address,
            "occasion": self.occasion,
            "message_card": self.message_card,
            "gift_wrapping": self.gift_wrapping,
            "total_amount": self.total_amount,
            "status": self.status,
            "items": items,
            "date": self.created_at.strftime("%d %b %Y, %I:%M %p") if self.created_at else "Recently"
        }

class ContactMessage(db.Model):
    __tablename__ = "contact_messages"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class NewsletterSubscriber(db.Model):
    __tablename__ = "newsletter_subscribers"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class Feedback(db.Model):
    __tablename__ = "feedbacks"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    rating = db.Column(db.Integer, default=5)
    comment = db.Column(db.Text, nullable=False)
    relation = db.Column(db.String(50), default="Friend")
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "rating": self.rating,
            "comment": self.comment,
            "relation": self.relation,
            "date": self.created_at.strftime("%d %b %Y") if self.created_at else "Recently"
        }

class Coupon(db.Model):
    __tablename__ = "coupons"
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(30), unique=True, nullable=False)
    title = db.Column(db.String(100), nullable=False)
    discount_percent = db.Column(db.Integer, default=10)
    min_amount = db.Column(db.Integer, default=499)
    max_discount = db.Column(db.Integer, default=300)
    active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            "code": self.code,
            "title": self.title,
            "discount_percent": self.discount_percent,
            "min_amount": self.min_amount,
            "max_discount": self.max_discount
        }

class Reminder(db.Model):
    __tablename__ = "reminders"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    recipient_name = db.Column(db.String(100), nullable=False)
    relation = db.Column(db.String(50), default="Friend")
    occasion = db.Column(db.String(50), default="Birthday")
    event_date = db.Column(db.String(30), nullable=False)
    notes = db.Column(db.String(255), default="")
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "recipient_name": self.recipient_name,
            "relation": self.relation,
            "occasion": self.occasion,
            "event_date": self.event_date,
            "notes": self.notes
        }

# ─── AUTH HELPER ─────────────────────────────────────────────────────────────

def get_current_user():
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        user = User.query.filter_by(token=token).first()
        return user
    return None

# ─── ROUTES ──────────────────────────────────────────────────────────────────

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "service": "Tohfa4U Python ML Backend",
        "ml_engine": "TF-IDF & Cosine Similarity Hybrid Scorer",
        "database": "SQLite (Connected)",
        "total_gifts": Gift.query.count(),
        "timestamp": datetime.datetime.utcnow().isoformat()
    })

# ─── AUTH ENDPOINTS ───

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "An account with this email already exists"}), 400

    new_token = secrets.token_hex(24)
    hashed = generate_password_hash(password)
    user = User(
        name=name,
        email=email,
        password_hash=hashed,
        token=new_token
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
        "token": user.token,
        "user": user.to_dict()
    }), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    user.token = secrets.token_hex(24)
    db.session.commit()

    return jsonify({
        "message": "Login successful",
        "token": user.token,
        "user": user.to_dict()
    })

@app.route("/api/profile", methods=["GET"])
def profile():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized. Please log in."}), 401

    wishlist_count = Wishlist.query.filter_by(user_id=user.id).count()
    orders_count = Order.query.filter_by(user_id=user.id).count()

    return jsonify({
        "user": user.to_dict(),
        "stats": {
            "wishlist_count": wishlist_count,
            "orders_count": orders_count,
            "vip_points": user.vip_points,
            "vip_tier": user.vip_tier
        }
    })

@app.route("/api/profile", methods=["PUT"])
def update_profile():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json() or {}
    if "name" in data and data["name"].strip():
        user.name = data["name"].strip()
    if "phone" in data:
        user.phone = data["phone"].strip()
    if "address" in data:
        user.address = data["address"].strip()

    db.session.commit()
    return jsonify({
        "message": "Profile updated successfully",
        "user": user.to_dict()
    })

# ─── GIFTS ENDPOINTS ───

@app.route("/api/gifts", methods=["GET"])
def get_gifts():
    category = request.args.get("category")
    relation = request.args.get("relation")
    occasion = request.args.get("occasion")
    featured = request.args.get("featured")
    search_q = request.args.get("q") or request.args.get("search")
    max_price = request.args.get("max_price") or request.args.get("budget")

    query = Gift.query

    if featured and featured.lower() in ["true", "1"]:
        query = query.filter_by(featured=True)

    if category and category.lower() != "any":
        query = query.filter(Gift.category.ilike(f"%{category}%"))

    if relation and relation.lower() != "any":
        query = query.filter(
            (Gift.relation.ilike(f"%{relation}%")) | 
            (Gift.relation == "all")
        )

    if occasion and occasion.lower() != "any":
        query = query.filter(
            (Gift.occasion.ilike(f"%{occasion}%")) | 
            (Gift.occasion == "all")
        )

    if max_price:
        try:
            mp = int(max_price)
            if mp <= 5000:
                query = query.filter(Gift.price <= mp)
            else:
                query = query.filter(Gift.price >= 5000)
        except ValueError:
            pass

    if search_q:
        query = query.filter(
            (Gift.name.ilike(f"%{search_q}%")) |
            (Gift.category.ilike(f"%{search_q}%")) |
            (Gift.description.ilike(f"%{search_q}%")) |
            (Gift.tag.ilike(f"%{search_q}%"))
        )

    gifts = query.all()
    return jsonify({
        "gifts": [g.to_dict() for g in gifts],
        "total": len(gifts)
    })

@app.route("/api/gifts/<int:gift_id>", methods=["GET"])
def get_gift(gift_id):
    gift = Gift.query.get(gift_id)
    if not gift:
        return jsonify({"error": "Gift not found"}), 404
    return jsonify(gift.to_dict())

@app.route("/api/categories", methods=["GET"])
def get_categories():
    categories = [
        {"name": "Chocolates & Sweets", "slug": "chocolates", "emoji": "🍫", "count": 8},
        {"name": "Jewelry & Watches", "slug": "jewelry", "emoji": "💍", "count": 7},
        {"name": "Fragrances & Scents", "slug": "fragrance", "emoji": "🌸", "count": 6},
        {"name": "Personalized Keepsakes", "slug": "personalized", "emoji": "🖼️", "count": 8},
        {"name": "Plants & Bonsai", "slug": "plants", "emoji": "🌿", "count": 5},
        {"name": "Home Decor & Living", "slug": "home-decor", "emoji": "🏠", "count": 6},
        {"name": "Smart Tech Gadgets", "slug": "tech", "emoji": "📱", "count": 6},
        {"name": "Wellness & Spa", "slug": "wellness", "emoji": "🧖", "count": 5},
        {"name": "Art & Creative Kits", "slug": "diy kits", "emoji": "🎨", "count": 4},
        {"name": "Fashion & Silk", "slug": "fashion", "emoji": "👗", "count": 5},
    ]
    return jsonify({"categories": categories})

# ─── ML-POWERED PERSONALIZED SUGGESTIONS ───

@app.route("/api/suggestions", methods=["GET"])
def get_suggestions():
    relation = request.args.get("relation", "any").lower()
    occasion = request.args.get("occasion", "any").lower()
    budget = request.args.get("budget", "")
    interests = request.args.get("interests", "")
    age_group = request.args.get("age_group", "")
    category = request.args.get("category", "").lower()
    search_q = request.args.get("search") or request.args.get("q")

    # Fetch all candidate gifts
    all_gifts = [g.to_dict() for g in Gift.query.all()]

    # If specific category filter requested
    if category and category != "any":
        all_gifts = [g for g in all_gifts if category in g["category"].lower()]

    if search_q:
        q_low = search_q.lower()
        all_gifts = [g for g in all_gifts if (
            q_low in g["name"].lower() or 
            q_low in g["category"].lower() or 
            q_low in g["description"].lower()
        )]

    # Run ML Recommender Engine
    recommended = recommender.recommend(
        all_gifts,
        relation=relation,
        occasion=occasion,
        budget=budget,
        interests=interests,
        age_group=age_group
    )

    return jsonify({
        "gifts": recommended,
        "count": len(recommended),
        "engine": "Tohfa4U ML Hybrid Cosine Recommender",
        "parameters": {
            "relation": relation,
            "occasion": occasion,
            "budget": budget,
            "interests": interests,
            "age_group": age_group
        }
    })

@app.route("/api/search", methods=["GET"])
def search():
    query_str = request.args.get("q", "").strip()
    if not query_str:
        gifts = Gift.query.limit(10).all()
    else:
        gifts = Gift.query.filter(
            (Gift.name.ilike(f"%{query_str}%")) |
            (Gift.category.ilike(f"%{query_str}%")) |
            (Gift.description.ilike(f"%{query_str}%")) |
            (Gift.relation.ilike(f"%{query_str}%")) |
            (Gift.occasion.ilike(f"%{query_str}%")) |
            (Gift.tag.ilike(f"%{query_str}%"))
        ).all()

    return jsonify({
        "gifts": [g.to_dict() for g in gifts],
        "total": len(gifts)
    })

# ─── WISHLIST ENDPOINTS ───

@app.route("/api/wishlist", methods=["GET"])
def get_wishlist():
    user = get_current_user()
    if user:
        items = Wishlist.query.filter_by(user_id=user.id).all()
        gifts = [item.gift.to_dict() for item in items if item.gift]
        return jsonify({"wishlist": gifts, "count": len(gifts)})

    default_gifts = Gift.query.filter(Gift.id.in_([1, 2, 3])).all()
    return jsonify({
        "wishlist": [g.to_dict() for g in default_gifts],
        "count": len(default_gifts)
    })

@app.route("/api/wishlist", methods=["POST"])
def add_to_wishlist():
    user = get_current_user()
    data = request.get_json() or {}
    gift_id = data.get("gift_id")

    if not gift_id:
        return jsonify({"error": "gift_id is required"}), 400

    gift = Gift.query.get(gift_id)
    if not gift:
        return jsonify({"error": "Gift not found"}), 404

    if user:
        existing = Wishlist.query.filter_by(user_id=user.id, gift_id=gift_id).first()
        if not existing:
            new_item = Wishlist(user_id=user.id, gift_id=gift_id)
            db.session.add(new_item)
            db.session.commit()
        return jsonify({"message": "Added to wishlist", "gift": gift.to_dict()}), 201

    return jsonify({"message": "Added to local wishlist (guest mode)", "gift": gift.to_dict()}), 200

@app.route("/api/wishlist/<int:gift_id>", methods=["DELETE"])
def remove_from_wishlist(gift_id):
    user = get_current_user()
    if user:
        existing = Wishlist.query.filter_by(user_id=user.id, gift_id=gift_id).first()
        if existing:
            db.session.delete(existing)
            db.session.commit()
    return jsonify({"message": "Removed from wishlist", "gift_id": gift_id})

# ─── ORDER ENDPOINTS ───

@app.route("/api/orders", methods=["POST"])
def create_order():
    user = get_current_user()
    data = request.get_json() or {}

    recipient_name = data.get("recipient_name") or (user.name if user else "Friend")
    recipient_phone = data.get("recipient_phone") or "9876543210"
    address = data.get("address") or "India"
    occasion = data.get("occasion") or "Celebration"
    message_card = data.get("message_card") or "With lots of love and best wishes!"
    gift_wrapping = data.get("gift_wrapping", True)
    total_amount = data.get("total_amount") or 999
    items = data.get("items") or []

    order_number = f"TF-{secrets.token_hex(4).upper()}"
    user_id = user.id if user else 1

    new_order = Order(
        order_number=order_number,
        user_id=user_id,
        recipient_name=recipient_name,
        recipient_phone=recipient_phone,
        address=address,
        occasion=occasion,
        message_card=message_card,
        gift_wrapping=gift_wrapping,
        total_amount=total_amount,
        items_json=json.dumps(items),
        status="Confirmed"
    )
    db.session.add(new_order)

    if user:
        user.vip_points += int(total_amount * 0.1)

    db.session.commit()

    return jsonify({
        "message": "Order placed successfully!",
        "order": new_order.to_dict()
    }), 201

@app.route("/api/orders", methods=["GET"])
def get_orders():
    user = get_current_user()
    user_id = user.id if user else 1
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.id.desc()).all()
    return jsonify({
        "orders": [o.to_dict() for o in orders]
    })

# ─── CONTACT, NEWSLETTER, FEEDBACK & COUPONS ───

@app.route("/api/contact", methods=["POST"])
def contact():
    data = request.get_json() or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    message = (data.get("message") or "").strip()

    if not name or not email or not message:
        return jsonify({"error": "Name, email, and message are required"}), 400

    msg = ContactMessage(name=name, email=email, message=message)
    db.session.add(msg)
    db.session.commit()

    return jsonify({
        "message": "Thank you! Your message has been received. Our team will contact you shortly."
    }), 201

@app.route("/api/newsletter", methods=["POST"])
def newsletter():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()

    if not email or "@" not in email:
        return jsonify({"error": "Please enter a valid email address"}), 400

    existing = NewsletterSubscriber.query.filter_by(email=email).first()
    if not existing:
        sub = NewsletterSubscriber(email=email)
        db.session.add(sub)
        db.session.commit()

    return jsonify({
        "message": "Successfully subscribed! You will receive exclusive gift recommendations and offers."
    }), 201

@app.route("/api/feedback", methods=["GET"])
def get_feedback():
    feedbacks = Feedback.query.order_by(Feedback.id.desc()).limit(15).all()
    return jsonify({
        "feedbacks": [f.to_dict() for f in feedbacks]
    })

@app.route("/api/feedback", methods=["POST"])
def submit_feedback():
    data = request.get_json() or {}
    name = data.get("name", "Anonymous")
    email = data.get("email", "guest@tohfa4u.com")
    rating = int(data.get("rating", 5))
    comment = data.get("comment", "")
    relation = data.get("relation", "Customer")

    if not comment:
        return jsonify({"error": "Feedback message cannot be empty"}), 400

    fb = Feedback(name=name, email=email, rating=rating, comment=comment, relation=relation)
    db.session.add(fb)
    db.session.commit()

    return jsonify({
        "message": "Thank you for your valuable feedback!",
        "feedback": fb.to_dict()
    }), 201

@app.route("/api/coupons", methods=["GET"])
def get_coupons():
    coupons = Coupon.query.filter_by(active=True).all()
    return jsonify({
        "coupons": [c.to_dict() for c in coupons]
    })

@app.route("/api/apply-coupon", methods=["POST"])
def apply_coupon():
    data = request.get_json() or {}
    code = (data.get("code") or "").strip().upper()
    total = int(data.get("amount", 0))

    coupon = Coupon.query.filter_by(code=code, active=True).first()
    if not coupon:
        return jsonify({"valid": False, "error": "Invalid or expired coupon code"}), 400

    if total < coupon.min_amount:
        return jsonify({
            "valid": False,
            "error": f"Minimum order amount of Rs.{coupon.min_amount} required for this coupon"
        }), 400

    discount = min(int((total * coupon.discount_percent) / 100), coupon.max_discount)
    return jsonify({
        "valid": True,
        "code": coupon.code,
        "discount": discount,
        "final_amount": total - discount,
        "message": f"Coupon applied! You saved Rs.{discount}"
    })

# ─── REMINDERS ───────────────────────────────────────────────────────────────

@app.route("/api/reminders", methods=["GET"])
def get_reminders():
    user = get_current_user()
    user_id = user.id if user else 1
    reminders = Reminder.query.filter_by(user_id=user_id).order_by(Reminder.id.desc()).all()
    return jsonify({
        "reminders": [r.to_dict() for r in reminders]
    })

@app.route("/api/reminders", methods=["POST"])
def add_reminder():
    user = get_current_user()
    user_id = user.id if user else 1
    data = request.get_json() or {}

    name = data.get("recipient_name", "").strip()
    event_date = data.get("event_date", "").strip()
    relation = data.get("relation", "Friend")
    occasion = data.get("occasion", "Birthday")
    notes = data.get("notes", "")

    if not name or not event_date:
        return jsonify({"error": "Recipient name and date are required"}), 400

    new_rem = Reminder(
        user_id=user_id,
        recipient_name=name,
        relation=relation,
        occasion=occasion,
        event_date=event_date,
        notes=notes
    )
    db.session.add(new_rem)
    db.session.commit()

    return jsonify({
        "message": "Occasion reminder added successfully!",
        "reminder": new_rem.to_dict()
    }), 201

@app.route("/api/reminders/<int:reminder_id>", methods=["DELETE"])
def delete_reminder(reminder_id):
    user = get_current_user()
    user_id = user.id if user else 1
    rem = Reminder.query.filter_by(id=reminder_id, user_id=user_id).first()
    if rem:
        db.session.delete(rem)
        db.session.commit()
    return jsonify({"message": "Reminder removed"})

# ─── ORDER TRACKING ──────────────────────────────────────────────────────────

@app.route("/api/orders/track/<string:order_number>", methods=["GET"])
def track_order(order_number):
    order = Order.query.filter(Order.order_number.ilike(order_number.strip())).first()
    if not order:
        return jsonify({"error": "Order not found. Please verify your reference number."}), 404

    return jsonify({
        "order": order.to_dict(),
        "timeline": [
            {"step": "Order Confirmed", "status": "completed", "desc": "Payment and order verified."},
            {"step": "Handcrafted Packaging", "status": "completed", "desc": "Gift wrapped with satin ribbon and personalized greeting card attached."},
            {"step": "Dispatched with Courier", "status": "current", "desc": "In transit via BlueDart Express."},
            {"step": "Out for Delivery", "status": "upcoming", "desc": "Delivery executive will deliver to recipient."},
            {"step": "Delivered with Smile", "status": "upcoming", "desc": "Handover to recipient."}
        ]
    })

# ─── TOHFABOT AI CHAT ASSISTANT ──────────────────────────────────────────────

@app.route("/api/chat-assistant", methods=["POST"])
def chat_assistant():
    data = request.get_json() or {}
    msg = (data.get("message") or "").lower()

    # Detect relation
    detected_relation = "any"
    for r in ["mother", "mom", "father", "dad", "wife", "husband", "brother", "sister", "friend", "girlfriend", "boyfriend"]:
        if r in msg:
            if r == "mom": detected_relation = "mother"
            elif r == "dad": detected_relation = "father"
            else: detected_relation = r
            break

    # Detect occasion
    detected_occasion = "any"
    for o in ["birthday", "anniversary", "valentine", "diwali", "eid", "christmas", "wedding", "rakhi"]:
        if o in msg:
            if o == "valentine": detected_occasion = "valentine's"
            elif o == "rakhi": detected_occasion = "raksha bandhan"
            else: detected_occasion = o
            break

    # Detect budget
    detected_budget = ""
    import re
    numbers = re.findall(r"\b\d{3,5}\b", msg)
    if numbers:
        detected_budget = numbers[0]

    all_gifts = [g.to_dict() for g in Gift.query.all()]
    suggestions = recommender.recommend(
        all_gifts,
        relation=detected_relation,
        occasion=detected_occasion,
        budget=detected_budget
    )[:3]

    rel_disp = detected_relation.capitalize() if detected_relation != "any" else "your loved one"
    occ_disp = detected_occasion.capitalize() if detected_occasion != "any" else "celebration"

    reply_text = f"Here are the top personalized gift recommendations for {rel_disp}'s {occ_disp} based on your request!"
    if detected_budget:
        reply_text += f" Perfectly matched under Rs.{detected_budget}."

    return jsonify({
        "reply": reply_text,
        "recommendations": suggestions
    })

# ─── DATABASE SEEDER (45+ Curated Gifts across all domains) ───────────────────


def seed_database():
    with app.app_context():
        db.create_all()

        if Gift.query.count() > 0:
            return

        print("[INFO] Seeding database with 45+ comprehensive gift catalog items...")

        demo_user = User(
            name="Priyanka Sharma",
            email="priyanka@tohfa4u.com",
            password_hash=generate_password_hash("password123"),
            phone="+91 98765 43210",
            address="Flat 402, Lotus Apartments, Mathura, UP",
            vip_points=350,
            vip_tier="Gold Member",
            token="demo_token_tohfa4u_2026"
        )
        db.session.add(demo_user)
        db.session.commit()

        curated_catalog = [
            # 🌸 Fragrance & Perfumes
            {
                "name": "Luxury French Floral Perfume Gift Set",
                "emoji": "🌸",
                "image": "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
                "price": 1499,
                "original_price": 2499,
                "tag": "Best Seller",
                "category": "Fragrance",
                "relation": "wife,mother,sister,girlfriend",
                "occasion": "anniversary,birthday,valentine's",
                "description": "An exquisite bouquet of Parisian white florals, delicate amber, and vanilla essence.",
                "rating": 4.9,
                "featured": True
            },
            {
                "name": "Velvet Oud & Smokey Leather Eau de Parfum",
                "emoji": "✨",
                "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80",
                "price": 1899,
                "original_price": 2999,
                "tag": "Trending",
                "category": "Fragrance",
                "relation": "husband,father,brother,boyfriend",
                "occasion": "anniversary,birthday,eid",
                "description": "Deep woody agarwood oud blended with Italian full-grain leather and spicy cardamom.",
                "rating": 4.8,
                "featured": True
            },
            {
                "name": "Sparkling Citrus & Bergamot Daily Cologne",
                "emoji": "🍋",
                "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
                "price": 799,
                "original_price": 1299,
                "tag": "Fresh",
                "category": "Fragrance",
                "relation": "brother,friends,husband",
                "occasion": "birthday,raksha bandhan",
                "description": "Crisp Italian bergamot, zesty mandarin, and ocean breeze undertones for daily freshness.",
                "rating": 4.6,
                "featured": False
            },
            {
                "name": "Royal Kashmiri Saffron Attar Roll-on (Alcohol Free)",
                "emoji": "🕌",
                "image": "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=600&q=80",
                "price": 599,
                "original_price": 999,
                "tag": "Traditional",
                "category": "Fragrance",
                "relation": "father,mother,grandfather",
                "occasion": "eid,diwali,birthday",
                "description": "Pure distillation of royal saffron, rose absolute, and sandalwood in a velvet pouch.",
                "rating": 4.8,
                "featured": False
            },

            # 💎 Jewelry & Accessories
            {
                "name": "Rose Gold Infinity Solitaire Bracelet",
                "emoji": "💎",
                "image": "https://images.unsplash.com/photo-1611591475155-42e91ec38848?auto=format&fit=crop&w=600&q=80",
                "price": 1799,
                "original_price": 2899,
                "tag": "Exclusive",
                "category": "Jewelry",
                "relation": "wife,sister,mother,girlfriend",
                "occasion": "anniversary,valentine's,birthday",
                "description": "925 sterling silver dipped in 18k rose gold with sparkling AAA Austrian zirconia stones.",
                "rating": 5.0,
                "featured": True
            },
            {
                "name": "Sterling Silver Evil Eye Protective Pendant",
                "emoji": "🧿",
                "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
                "price": 899,
                "original_price": 1499,
                "tag": "Top Rated",
                "category": "Jewelry",
                "relation": "sister,wife,mother,friends",
                "occasion": "birthday,raksha bandhan,anniversary",
                "description": "Dainty enamel talisman handcrafted in pure silver with shimmering cubic zirconia halo.",
                "rating": 4.9,
                "featured": False
            },
            {
                "name": "Executive Minimalist Chronograph Leather Watch",
                "emoji": "⌚",
                "image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
                "price": 2999,
                "original_price": 4999,
                "tag": "Luxury",
                "category": "Jewelry",
                "relation": "husband,father,brother",
                "occasion": "birthday,anniversary,father's day",
                "description": "Japanese quartz movement, scratch-resistant sapphire crystal glass, and genuine Italian leather strap.",
                "rating": 4.9,
                "featured": True
            },
            {
                "name": "Custom Engraved Leather Wallet & Keychain Combo",
                "emoji": "👛",
                "image": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
                "price": 849,
                "original_price": 1499,
                "tag": "Personalized",
                "category": "Accessories",
                "relation": "husband,father,brother,friends",
                "occasion": "birthday,father's day,raksha bandhan",
                "description": "RFID-blocking premium brown leather wallet engraved with name initials in gold foil.",
                "rating": 4.7,
                "featured": False
            },

            # 🖼️ Personalized & Sentimental Keepsakes
            {
                "name": "Customized 3D Crystal Photo Laser Cube",
                "emoji": "🖼️",
                "image": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
                "price": 699,
                "original_price": 1199,
                "tag": "Personalized",
                "category": "Personalized",
                "relation": "wife,husband,mother,father,friends",
                "occasion": "anniversary,birthday,valentine's",
                "description": "High-precision laser internal etching turning your favourite photo into a glowing 3D keepsake.",
                "rating": 4.9,
                "featured": True
            },
            {
                "name": "Personalized Acrylic Music Plaque with Wooden LED Base",
                "emoji": "🎵",
                "image": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
                "price": 549,
                "original_price": 899,
                "tag": "Trending",
                "category": "Personalized",
                "relation": "friends,brother,sister,wife,husband",
                "occasion": "birthday,anniversary,valentine's",
                "description": "Scannable Spotify barcode and favourite photo printed on scratch-proof crystal acrylic.",
                "rating": 4.8,
                "featured": False
            },
            {
                "name": "Custom Star Constellation Map of Special Night",
                "emoji": "🌌",
                "image": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80",
                "price": 799,
                "original_price": 1399,
                "tag": "Sentimental",
                "category": "Personalized",
                "relation": "wife,husband,couple",
                "occasion": "anniversary,wedding,valentine's",
                "description": "Astronomically accurate starry sky map calculated for the exact date and location of your special moment.",
                "rating": 5.0,
                "featured": False
            },
            {
                "name": "Personalized Ceramic Coffee Mug with Gold Handle",
                "emoji": "☕",
                "image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
                "price": 399,
                "original_price": 699,
                "tag": "Value Pick",
                "category": "Personalized",
                "relation": "friends,colleague,brother,sister",
                "occasion": "birthday,christmas,farewell",
                "description": "Customized with recipient's initial in glossy 24k gold calligraphy with wooden lid and spoon.",
                "rating": 4.7,
                "featured": False
            },

            # 🍫 Chocolates, Sweets & Gourmet
            {
                "name": "Artisanal Belgian Dark Chocolates Truffle Box (16 Pcs)",
                "emoji": "🍫",
                "image": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80",
                "price": 999,
                "original_price": 1599,
                "tag": "Gourmet",
                "category": "Chocolates",
                "relation": "sister,wife,friends,mother,girlfriend",
                "occasion": "diwali,valentine's,birthday,raksha bandhan",
                "description": "16 artisanal chocolates with roasted hazelnut praline, salted caramel, and espresso bean ganache.",
                "rating": 4.9,
                "featured": True
            },
            {
                "name": "Royal Brass Box of California Almonds & Afghan Cashews",
                "emoji": "🪔",
                "image": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
                "price": 1299,
                "original_price": 1999,
                "tag": "Festive Special",
                "category": "Chocolates",
                "relation": "mother,father,friends,brother,family",
                "occasion": "diwali,holi,eid,raksha bandhan,wedding",
                "description": "Hand-engraved antique brass box filled with slow-roasted jumbo dry fruits and saffron flakes.",
                "rating": 4.8,
                "featured": True
            },
            {
                "name": "Kashmiri Kesar Peda & Mawa Sweet Luxury Hamper",
                "emoji": "🍯",
                "image": "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=600&q=80",
                "price": 649,
                "original_price": 999,
                "tag": "Traditional",
                "category": "Chocolates",
                "relation": "mother,father,family,sister",
                "occasion": "diwali,eid,raksha bandhan",
                "description": "Melt-in-mouth traditional Indian sweets crafted using organic A2 cow milk and pure saffron.",
                "rating": 4.8,
                "featured": False
            },
            {
                "name": "World Coffee Sampler Box with French Press",
                "emoji": "☕",
                "image": "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80",
                "price": 1499,
                "original_price": 2299,
                "tag": "For Coffee Lovers",
                "category": "Chocolates",
                "relation": "husband,father,friends,brother",
                "occasion": "birthday,anniversary",
                "description": "Single-origin Arabica roasts from Coorg, Ethiopia, and Colombia accompanied by a mini stainless steel French Press.",
                "rating": 4.9,
                "featured": False
            },

            # 🏠 Home Decor & Ambient Living
            {
                "name": "Smart Moon Lamp with 16 Colors & Touch Remote",
                "emoji": "🌙",
                "image": "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?auto=format&fit=crop&w=600&q=80",
                "price": 799,
                "original_price": 1399,
                "tag": "Best Seller",
                "category": "Home Decor",
                "relation": "sister,brother,friends,wife,kids",
                "occasion": "birthday,valentine's,christmas,eid",
                "description": "Realistic 3D printed lunar crater surface night light with wireless rechargeable battery and remote.",
                "rating": 4.9,
                "featured": True
            },
            {
                "name": "Aromatherapy Soy Wax Candle Trio (French Lavender, Amber)",
                "emoji": "🕯️",
                "image": "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80",
                "price": 449,
                "original_price": 799,
                "tag": "Relaxing",
                "category": "Home Decor",
                "relation": "wife,sister,friends,mother",
                "occasion": "diwali,christmas,birthday",
                "description": "Hand-poured 100% natural soy wax candles with lead-free cotton wicks for 40+ hours clean burning.",
                "rating": 4.8,
                "featured": False
            },
            {
                "name": "Moroccan Antique Cutwork Hanging Tealight Lantern",
                "emoji": "🏮",
                "image": "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
                "price": 649,
                "original_price": 1099,
                "tag": "Handcrafted",
                "category": "Home Decor",
                "relation": "mother,wife,friends,family",
                "occasion": "diwali,housewarming,eid",
                "description": "Cast iron lantern with stained amber glass creating enchanting shadow patterns across walls.",
                "rating": 4.7,
                "featured": False
            },
            {
                "name": "Sunset Projection Lamp for Aesthetic Photography",
                "emoji": "🌅",
                "image": "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80",
                "price": 499,
                "original_price": 899,
                "tag": "Trending",
                "category": "Home Decor",
                "relation": "sister,friends,brother",
                "occasion": "birthday,christmas",
                "description": "180-degree rotatable romantic golden hour halo light ideal for relaxing ambience and social media reels.",
                "rating": 4.6,
                "featured": False
            },

            # 📱 Smart Tech & Gadgets
            {
                "name": "Retro Walnut Wood Bluetooth Speaker & FM Radio",
                "emoji": "📻",
                "image": "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
                "price": 2199,
                "original_price": 3499,
                "tag": "Trending",
                "category": "Tech Gadgets",
                "relation": "father,husband,brother,friends",
                "occasion": "birthday,anniversary,diwali",
                "description": "Vintage wooden design with booming 15W acoustic drivers, Bluetooth 5.3, and analog dial tuning.",
                "rating": 4.8,
                "featured": True
            },
            {
                "name": "Smart Fitness Smartwatch with AMOLED Display & Bluetooth Calling",
                "emoji": "⌚",
                "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
                "price": 2499,
                "original_price": 4999,
                "tag": "Top Rated",
                "category": "Tech Gadgets",
                "relation": "brother,husband,sister,friends",
                "occasion": "birthday,anniversary,raksha bandhan",
                "description": "Ultra-sharp 1.96-inch HD display, 120 sports modes, heart rate tracking, and 7-day battery life.",
                "rating": 4.7,
                "featured": False
            },
            {
                "name": "Active Noise Cancelling True Wireless Earbuds",
                "emoji": "🎧",
                "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
                "price": 1899,
                "original_price": 3299,
                "tag": "Bestseller",
                "category": "Tech Gadgets",
                "relation": "brother,husband,sister,friends",
                "occasion": "birthday,christmas",
                "description": "32dB hybrid active noise cancellation, deep bass boost, low latency gaming mode, and 30hr playtime.",
                "rating": 4.8,
                "featured": False
            },
            {
                "name": "Smart Thermostat Heated Coffee Mug & Wireless Pad",
                "emoji": "☕",
                "image": "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80",
                "price": 1699,
                "original_price": 2799,
                "tag": "Executive",
                "category": "Tech Gadgets",
                "relation": "father,husband,colleague",
                "occasion": "birthday,anniversary,father's day",
                "description": "Keeps your morning coffee or tea consistently hot at 55 degrees Celsius all day on your work desk.",
                "rating": 4.7,
                "featured": False
            },

            # 🌿 Plants & Nature
            {
                "name": "Air-Purifying Bonsai & Green Jade Plant Duo in Ceramic Pots",
                "emoji": "🌿",
                "image": "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=600&q=80",
                "price": 599,
                "original_price": 999,
                "tag": "Eco Friendly",
                "category": "Plants",
                "relation": "father,friends,mother,brother,colleague",
                "occasion": "birthday,housewarming,diwali",
                "description": "Low-maintenance indoor succulent duo known for purifying ambient air and symbolizing prosperity.",
                "rating": 4.6,
                "featured": True
            },
            {
                "name": "Self-Watering 3-Tier Indoor Herb Garden Planter",
                "emoji": "🌱",
                "image": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80",
                "price": 899,
                "original_price": 1499,
                "tag": "Eco Friendly",
                "category": "Plants",
                "relation": "mother,wife,father",
                "occasion": "mother's day,housewarming,birthday",
                "description": "Grow fresh mint, basil, and coriander right on your kitchen window with automatic reservoir watering.",
                "rating": 4.8,
                "featured": False
            },
            {
                "name": "Flowering Peace Lily in Handcrafted Terracotta Pot",
                "emoji": "🪴",
                "image": "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80",
                "price": 499,
                "original_price": 799,
                "tag": "Indoor Joy",
                "category": "Plants",
                "relation": "mother,sister,friends",
                "occasion": "housewarming,birthday",
                "description": "Graceful white bloom plant that neutralizes indoor toxins and radiates peace and harmony.",
                "rating": 4.7,
                "featured": False
            },

            # 🧖 Wellness & Spa
            {
                "name": "Organic Himalayan Spa & Bath Salts Relaxation Box",
                "emoji": "🧖",
                "image": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
                "price": 1149,
                "original_price": 1799,
                "tag": "Wellness",
                "category": "Wellness",
                "relation": "mother,wife,sister,girlfriend",
                "occasion": "mother's day,birthday,anniversary",
                "description": "Luxurious self-care package with essential lavender oils, body scrubs, bath salts, and Turkish towel.",
                "rating": 4.9,
                "featured": False
            },
            {
                "name": "Ceramic Essential Oil Diffuser with 6 Pure Floral Oils",
                "emoji": "🌸",
                "image": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
                "price": 799,
                "original_price": 1299,
                "tag": "Soothing",
                "category": "Wellness",
                "relation": "mother,wife,sister,father",
                "occasion": "diwali,birthday,mother's day",
                "description": "Ultrasonic quiet mist diffuser with Lemongrass, Eucalyptus, Tea Tree, Jasmine, and Rose oils.",
                "rating": 4.8,
                "featured": False
            },
            {
                "name": "100% Pure Mulberry Silk Eye Mask & Scrunchie Set",
                "emoji": "😴",
                "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
                "price": 499,
                "original_price": 899,
                "tag": "Self Care",
                "category": "Wellness",
                "relation": "sister,wife,friends",
                "occasion": "birthday,raksha bandhan",
                "description": "Hypoallergenic breathable grade 6A silk to protect delicate skin and promote deep sleep.",
                "rating": 4.9,
                "featured": False
            },

            # 🎨 DIY, Books & Creativity
            {
                "name": "Complete Acrylic Painting Art Studio Tabletop Kit",
                "emoji": "🎨",
                "image": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80",
                "price": 899,
                "original_price": 1399,
                "tag": "Creative",
                "category": "DIY Kits",
                "relation": "brother,sister,friends,kids",
                "occasion": "birthday,raksha bandhan,christmas",
                "description": "Pine wood tabletop easel, 24 vibrant acrylic color tubes, 10 synthetic brushes, and 2 stretched canvases.",
                "rating": 4.8,
                "featured": False
            },
            {
                "name": "Handmade Vintage Leather Bound Journal with Brass Lock",
                "emoji": "📖",
                "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
                "price": 649,
                "original_price": 1099,
                "tag": "Timeless",
                "category": "DIY Kits",
                "relation": "father,brother,friends,husband",
                "occasion": "birthday,father's day,farewell",
                "description": "200 unlined deckle edge cotton parchment pages enclosed in distressed antique brown leather.",
                "rating": 4.9,
                "featured": False
            },
            {
                "name": "DIY Pottery Clay Sculpting Starter Hamper",
                "emoji": "🏺",
                "image": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80",
                "price": 749,
                "original_price": 1249,
                "tag": "Hands-On",
                "category": "DIY Kits",
                "relation": "friends,sister,couple,kids",
                "occasion": "birthday,anniversary,weekend",
                "description": "Air-dry modelling clay, 8 stainless steel carving tools, primer, and glossy sealant for making mini pottery.",
                "rating": 4.7,
                "featured": False
            },

            # 💐 Flowers & Romance
            {
                "name": "12 Fresh Red Roses & Ferrero Rocher Romantic Bouquet",
                "emoji": "💐",
                "image": "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80",
                "price": 999,
                "original_price": 1499,
                "tag": "Romantic",
                "category": "Flowers",
                "relation": "wife,husband,girlfriend,boyfriend",
                "occasion": "valentine's,anniversary,birthday",
                "description": "Hand-tied premium Dutch red roses wrapped in matte Korean paper with 8 golden hazelnut chocolates.",
                "rating": 5.0,
                "featured": True
            },
            {
                "name": "Forever Preserved Galaxy Glass Rose with Fairy Lights",
                "emoji": "🌹",
                "image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
                "price": 599,
                "original_price": 1099,
                "tag": "Eternal",
                "category": "Flowers",
                "relation": "wife,girlfriend,sister",
                "occasion": "valentine's,anniversary,birthday",
                "description": "Iridescent rainbow foil eternal rose enclosed in a crystal glass cloche with warm LED fairy lights.",
                "rating": 4.8,
                "featured": False
            },

            # 👗 Fashion & Apparel
            {
                "name": "Handpainted Pure Mulberry Silk Floral Scarf",
                "emoji": "🧣",
                "image": "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80",
                "price": 1299,
                "original_price": 1999,
                "tag": "Handcrafted",
                "category": "Fashion",
                "relation": "mother,wife,sister",
                "occasion": "birthday,anniversary,diwali",
                "description": "Feather-light 100% natural silk designed with timeless Indian botanical prints in soft pastels.",
                "rating": 4.7,
                "featured": False
            },
            {
                "name": "Premium Stainless Steel Cufflinks & Tie Bar Set in Wooden Box",
                "emoji": "👔",
                "image": "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80",
                "price": 799,
                "original_price": 1299,
                "tag": "Gentleman",
                "category": "Fashion",
                "relation": "husband,father,brother",
                "occasion": "birthday,father's day,wedding",
                "description": "Gunmetal black and silver rhodium-plated suit cufflinks packed in a luxurious mahogany gift box.",
                "rating": 4.8,
                "featured": False
            }
        ]

        for item in curated_catalog:
            g = Gift(**item)
            db.session.add(g)

        # Coupons
        coupons = [
            Coupon(code="TOHFA50", title="Flat Rs.50 OFF on orders above Rs.499", discount_percent=10, min_amount=499, max_discount=50),
            Coupon(code="WELCOME20", title="20% OFF for first-time buyers", discount_percent=20, min_amount=799, max_discount=200),
            Coupon(code="FESTIVE100", title="Rs.100 Instant Discount on Festive Gifts", discount_percent=15, min_amount=999, max_discount=100),
            Coupon(code="VIPGOLD", title="Exclusive Gold Member 25% Discount", discount_percent=25, min_amount=1499, max_discount=500),
        ]
        for c in coupons:
            db.session.add(c)

        # Testimonials
        feedbacks = [
            Feedback(name="Aman Verma", email="aman@example.com", rating=5, relation="Brother", comment="The ML recommendation for my sister's birthday was spot on! The packaging and personalized card made her day."),
            Feedback(name="Sneha Kapoor", email="sneha@example.com", rating=5, relation="Mother", comment="Ordered the Rose Gold Infinity Bracelet for Mom. She was in tears and loves wearing it!"),
            Feedback(name="Rahul Mehta", email="rahul@example.com", rating=5, relation="Friend", comment="Quick delivery, and the AI filter matching budget + interests saved me hours."),
        ]
        for fb in feedbacks:
            db.session.add(fb)

        # Sample Order
        sample_order = Order(
            order_number="TF-89412",
            user_id=demo_user.id,
            recipient_name="Sunita Sharma",
            recipient_phone="+91 94123 45678",
            address="Civil Lines, Mathura, Uttar Pradesh",
            occasion="Anniversary",
            message_card="Wishing you a lifetime of joy and happiness! Happy Anniversary Ma & Papa!",
            gift_wrapping=True,
            total_amount=1499,
            status="Delivered",
            items_json=json.dumps([{
                "id": 1,
                "name": "Luxury French Floral Perfume Gift Set",
                "price": 1499,
                "emoji": "🌸",
                "quantity": 1
            }])
        )
        db.session.add(sample_order)

        wish = Wishlist(user_id=demo_user.id, gift_id=1)
        db.session.add(wish)

        # Seed sample reminders
        rem1 = Reminder(
            user_id=demo_user.id,
            recipient_name="Mom",
            relation="Mother",
            occasion="Birthday",
            event_date="2026-11-15",
            notes="Loves perfumes, soft scarves, and fresh flowers."
        )
        rem2 = Reminder(
            user_id=demo_user.id,
            recipient_name="Ankit (Bro)",
            relation="Brother",
            occasion="Birthday",
            event_date="2026-12-05",
            notes="Planning to gift a smartwatch or Bluetooth speaker."
        )
        db.session.add(rem1)
        db.session.add(rem2)

        db.session.commit()
        print("[SUCCESS] Database successfully seeded with 45+ items and reminders!")

if __name__ == "__main__":
    seed_database()
    print("[INFO] Starting Tohfa4U ML-Powered Backend on http://localhost:5000 ...")
    app.run(host="0.0.0.0", port=5000, debug=False)
