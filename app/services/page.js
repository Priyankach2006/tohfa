"use client";

export default function ServicesPage() {
  return (
    <div className="text-center py-20 px-4 bg-white">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-orange-500 mb-6 drop-shadow-lg">
        Our Services
      </h1>

      {/* Intro */}
      <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
        Tohfa4U is more than just a gift suggestion tool. We offer a range of
        personalized services to make every gifting experience smooth, thoughtful, and memorable.
      </p>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Service 1 */}
        <div className="bg-orange-50 rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-orange-500 mb-2">
            AI Gift Suggestions
          </h3>
          <p className="text-gray-700">
            Get personalized gift ideas based on your relationship, occasion, and preferences.
          </p>
        </div>

        {/* Service 2 */}
        <div className="bg-orange-50 rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-orange-500 mb-2">
            Occasion Reminders
          </h3>
          <p className="text-gray-700">
            Never forget an important date! Get reminders for birthdays, anniversaries, and more.
          </p>
        </div>

        {/* Service 3 */}
        <div className="bg-orange-50 rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-orange-500 mb-2">
            Gift Wrapping & Messages
          </h3>
          <p className="text-gray-700">
            Add a personal touch with custom wrapping options and heartfelt message cards.
          </p>
        </div>

        {/* Service 4 */}
        <div className="bg-orange-50 rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-orange-500 mb-2">
            Local & Global Delivery
          </h3>
          <p className="text-gray-700">
            We partner with trusted logistics providers to ensure timely delivery across India and abroad.
          </p>
        </div>

        {/* Service 5 */}
        <div className="bg-orange-50 rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-orange-500 mb-2">
            Personalized Gift Bundles
          </h3>
          <p className="text-gray-700">
            Choose curated gift bundles or let us auto-generate one based on user input.
          </p>
        </div>

        {/* Service 6 */}
        <div className="bg-orange-50 rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-orange-500 mb-2">
            Gift Tracking & Support
          </h3>
          <p className="text-gray-700">
            Track your orders in real time and get 24/7 support through our chatbot and support team.
          </p>
        </div>
      </div>
    </div>
  );
}
