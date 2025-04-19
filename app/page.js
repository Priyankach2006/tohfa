export default function HomePage() {
  return (
    <div className="text-center py-20">
      {/* Heading */}
      <h1 className="text-5xl font-bold text-orange-500 mb-4">
        Welcome to Tohfa4U
      </h1>

      {/* Subheading */}
      <p className="text-xl text-gray-700 mb-6">
        Your personalized gift assistant powered by AI.
      </p>

      {/* Description */}
      <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
        Tohfa4U helps you find the perfect gift for any occasion. Whether it's
        for your mother, father, friend, or loved one, our AI-powered gift
        recommendations will make your shopping experience easier and more
        enjoyable.
      </p>

      {/* Call to Action */}
      <a
        href="/suggestions"
        className="inline-block bg-orange-500 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all duration-300"
      >
        Get Gift Suggestions
      </a>
    </div>
  );
}
