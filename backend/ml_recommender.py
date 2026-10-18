import math
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Archetype and sentiment weights
RELATION_KEYWORDS = {
    "mother": "mother mom mummy caring elegant wellness jewelry home warmth sweet saree tea shawl affection mother's day",
    "father": "father dad papa leather wallet watch tech coffee practical desk organizer executive father's day grooming",
    "wife": "wife romantic love soulmate anniversary valentine luxury perfume jewelry flowers necklace bracelet dinner date",
    "husband": "husband romantic watch gadget speaker leather gym grooming stylish tech boyfriend partner",
    "brother": "brother cool tech gaming headphones sneakers fun chocolates travel gadgets rakhi raksha bandhan bro",
    "sister": "sister cute makeup jewelry accessories chocolates journal lamps creative room decor rakhi",
    "friends": "friend buddy quirky bluetooth fun games party coffee mug chocolates party memory hamper",
    "kids": "kids child toys diy art painting coloring puzzle playful educational cute plush sweet",
}

OCCASION_KEYWORDS = {
    "birthday": "birthday celebration joy festive party cake milestone surprise special year gift",
    "anniversary": "anniversary romantic couple marriage together forever love eternal milestone memory",
    "valentine's": "valentine romance heart roses flowers chocolate love confession romantic candle",
    "diwali": "diwali deepavali festival light brass sweets mithai dry fruits diya auspicious prosperity",
    "eid": "eid festive mubarak celebration sweets dry fruits attar fragrance traditional blessing",
    "christmas": "christmas holidays winter joy tree santa candle warm chocolate greeting gingerbread",
    "raksha bandhan": "raksha bandhan rakhi sibling bond promise brother sister sweets celebration",
    "wedding": "wedding marriage couple congratulations blessing royal elegant dinnerware home luxury",
    "housewarming": "housewarming home decor kitchen plant bonsai cozy auspicious living room art",
}

INTEREST_KEYWORDS = {
    "tech": "smart bluetooth tech electronic gadget speaker watch wireless digital audio",
    "romantic": "romantic love roses heart candle fragrance luxury anniversary valentine",
    "wellness": "spa bath relax organic salts calming herbal essential oil therapy skincare",
    "artistic": "art creative painting diy colors canvas sketch handmade craft drawing",
    "foodie": "chocolate gourmet sweets coffee tea dry fruits delicious taste artisanal cookies",
    "fashion": "silk jewelry watch bracelet leather scarf style elegant premium apparel",
    "nature": "plant bonsai jade eco friendly green air purifying ceramic pot sustainable",
    "reading": "book reading diary journal pen leather bound knowledge inspiring literature",
}

class MLGiftRecommender:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words='english')
        self.is_fitted = False
        self.gift_corpus = []
        self.gift_ids = []
        self.tfidf_matrix = None

    def build_corpus_text(self, gift):
        """Constructs a rich semantic document for each gift."""
        parts = [
            gift.get("name", ""),
            gift.get("category", ""),
            gift.get("tag", ""),
            gift.get("description", ""),
            gift.get("relation", "").replace(",", " "),
            gift.get("occasion", "").replace(",", " "),
        ]
        return " ".join(parts).lower()

    def fit(self, gifts):
        """Fits the TF-IDF feature space on all gifts."""
        if not gifts:
            return
        self.gift_ids = [g["id"] for g in gifts]
        self.gift_corpus = [self.build_corpus_text(g) for g in gifts]
        self.tfidf_matrix = self.vectorizer.fit_transform(self.gift_corpus)
        self.is_fitted = True

    def calculate_budget_score(self, gift_price, target_budget):
        """Calculates a smooth Gaussian-like curve score for budget suitability."""
        if not target_budget:
            return 1.0
        try:
            target = float(target_budget)
            if target <= 0:
                return 1.0
            
            # If target is 5001 (5000+ category), prefer luxury items
            if target > 5000:
                if gift_price >= 2500:
                    return 1.0
                return max(0.4, gift_price / 2500.0)

            # Ideal price is near target or slightly below for maximum value
            ratio = gift_price / target
            if ratio <= 1.0:
                # Within budget, closer to budget gets slightly higher value score
                return 0.7 + (0.3 * ratio)
            elif ratio <= 1.25:
                # Up to 25% above budget is still acceptable with small penalty
                return max(0.2, 1.0 - (ratio - 1.0) * 2.5)
            else:
                return 0.15
        except (ValueError, TypeError):
            return 1.0

    def calculate_relation_affinity(self, gift, target_relation):
        """Multi-attribute relation match score."""
        if not target_relation or target_relation == "any":
            return 1.0
        rel_str = (gift.get("relation") or "").lower()
        if rel_str == "all":
            return 0.9
        if target_relation in rel_str:
            return 1.0
        return 0.35

    def calculate_occasion_affinity(self, gift, target_occasion):
        """Multi-attribute occasion match score."""
        if not target_occasion or target_occasion == "any":
            return 1.0
        occ_str = (gift.get("occasion") or "").lower()
        if occ_str == "all":
            return 0.9
        if target_occasion in occ_str:
            return 1.0
        return 0.35

    def generate_explanation(self, gift, relation, occasion, interests, match_pct):
        """Generates transparent, human-readable ML reason for this gift."""
        rel_name = relation.capitalize() if relation and relation != "any" else "your loved one"
        occ_name = occasion.capitalize() if occasion and occasion != "any" else "special celebration"
        
        reasons = []
        cat = gift.get("category", "").lower()
        tag = gift.get("tag", "")

        if "perfume" in cat or "fragrance" in cat:
            reasons.append(f"signature long-lasting luxury scent popular for {rel_name}")
        elif "chocolat" in cat or "food" in cat:
            reasons.append("artisan taste crafted for celebratory sweet moments")
        elif "jewel" in cat:
            reasons.append(f"keepsake accessory symbolizing timeless connection with {rel_name}")
        elif "personalized" in cat:
            reasons.append("custom crafted to capture your personal memories forever")
        elif "tech" in cat:
            reasons.append("practical utility combined with modern smart design")
        elif "plant" in cat:
            reasons.append("sustainable air-purifying gift bringing daily joy and positivity")
        elif "wellness" in cat:
            reasons.append("restorative self-care experience")
        else:
            reasons.append(f"handcrafted quality rated {gift.get('rating', 4.9)}/5 stars")

        if tag:
            reasons.append(f"earned '{tag}' status with {gift.get('review_count', 120)}+ happy gifters")

        return f"{match_pct}% Match: Ideal for {rel_name}'s {occ_name} with {', and '.join(reasons)}."

    def recommend(self, gifts, relation="any", occasion="any", budget=None, interests=None, age_group=None):
        """
        Executes hybrid TF-IDF Cosine Similarity & Multi-Criteria Persona Scoring.
        Returns gifts sorted by match confidence with AI explanations.
        """
        if not gifts:
            return []

        if not self.is_fitted or len(self.gift_ids) != len(gifts):
            self.fit(gifts)

        relation = (relation or "any").lower().strip()
        occasion = (occasion or "any").lower().strip()
        interests_list = [i.strip().lower() for i in interests.split(",")] if isinstance(interests, str) and interests else (interests or [])

        # 1. Build Query Semantic Vector
        query_parts = []
        if relation in RELATION_KEYWORDS:
            query_parts.append(RELATION_KEYWORDS[relation])
        elif relation != "any":
            query_parts.append(relation)

        if occasion in OCCASION_KEYWORDS:
            query_parts.append(OCCASION_KEYWORDS[occasion])
        elif occasion != "any":
            query_parts.append(occasion)

        for interest in interests_list:
            if interest in INTEREST_KEYWORDS:
                query_parts.append(INTEREST_KEYWORDS[interest])
            else:
                query_parts.append(interest)

        if age_group:
            query_parts.append(age_group.lower())

        query_text = " ".join(query_parts) if query_parts else "gift surprise celebration curated"
        query_vector = self.vectorizer.transform([query_text])

        # 2. Compute Cosine Similarities across TF-IDF Space
        cosine_sims = cosine_similarity(query_vector, self.tfidf_matrix)[0]

        # 3. Compute Composite ML Score for each gift
        scored_gifts = []
        for i, gift in enumerate(gifts):
            cos_score = float(cosine_sims[i])
            rel_score = self.calculate_relation_affinity(gift, relation)
            occ_score = self.calculate_occasion_affinity(gift, occasion)
            bud_score = self.calculate_budget_score(gift.get("price", 0), budget)
            rat_score = min(1.0, float(gift.get("rating", 4.5)) / 5.0)

            # Interest match bonus
            interest_bonus = 0.0
            if interests_list:
                gift_text = self.gift_corpus[i]
                matches = sum(1 for item in interests_list if item in gift_text)
                interest_bonus = min(0.3, matches * 0.15)

            # Weighted Hybrid Aggregation
            # w1(Cosine): 0.35, w2(Relation): 0.25, w3(Occasion): 0.20, w4(Budget): 0.10, w5(Rating): 0.10
            composite_score = (
                (cos_score * 0.35) +
                (rel_score * 0.25) +
                (occ_score * 0.20) +
                (bud_score * 0.10) +
                (rat_score * 0.10) +
                interest_bonus
            )

            # Normalize to realistic percentage (75% to 99%)
            match_pct = int(min(99, max(74, math.floor(composite_score * 95) + 10)))

            explanation = self.generate_explanation(gift, relation, occasion, interests_list, match_pct)

            gift_copy = dict(gift)
            gift_copy["ml_score"] = round(composite_score, 4)
            gift_copy["match_percentage"] = match_pct
            gift_copy["ai_explanation"] = explanation
            scored_gifts.append(gift_copy)

        # Sort by composite ML score descending
        scored_gifts.sort(key=lambda x: x["ml_score"], reverse=True)
        return scored_gifts

recommender = MLGiftRecommender()
