import { useState } from 'react';
import GiftCard from '../../components/GiftCard';
import giftsData from '../../data/gifts';

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState([]);

  // Generate random gift suggestions
  const generateSuggestions = () => {
    const randomGifts = [];
    for (let i = 0; i < 6; i++) {
      const randomGift = giftsData[Math.floor(Math.random() * giftsData.length)];
      randomGifts.push(randomGift);
    }
    setSuggestions(randomGifts);
  };

  return (
    <div className="text-center py-20 px-4">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-orange-500 mb-6">
        Gift Suggestions
      </h1>

      {/* Description */}
      <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
        Not sure what to gift? Let us help! Our AI-powered system generates
        personalized gift suggestions based on your preferences.
      </p>

      {/* Generate Suggestions Button */}
      <button
        onClick={generateSuggestions}
        className="bg-orange-500 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all duration-300"
      >
        Generate Gift Ideas
      </button>

      {/* Suggestions Grid */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {suggestions.length > 0 ? (
          suggestions.map((gift, index) => (
            <GiftCard key={index} gift={gift} />
          ))
        ) : (
          <p className="text-gray-600">Click the button above to generate gift suggestions.</p>
        )}
      </div>
    </div>
  );
}
