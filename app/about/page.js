"use client";

export default function AboutPage() {
  return (
    <div className="text-center py-20 px-4 bg-white">
      <h1 className="text-4xl font-bold text-lightOrange mb-6 drop-shadow-lg">
        About Tohfa4U
      </h1>

      <p className="text-lg text-gray-700 mb-6 max-w-4xl mx-auto">
        Tohfa4U is your AI-powered gift assistant designed to make gifting
        simple and thoughtful. Whether it's for a birthday, anniversary, or any
        special occasion, our platform uses advanced AI algorithms to suggest
        personalized gift ideas based on the recipient's relationship with you,
        their interests, and the occasion.
      </p>

      <p className="text-lg text-gray-700 mb-6 max-w-4xl mx-auto">
        Our mission is to take the stress out of shopping for the perfect gift
        and help you show your loved ones how much you care. With a user-friendly
        interface and thoughtful recommendations, Tohfa4U ensures that you'll
        never run out of great gift ideas again.
      </p>

      <div className="mt-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Meet the Team</h2>
        <div className="flex justify-center space-x-8">
          <div className="text-center">
            <img
              src="/images/team-member-1.jpg"
              alt="Team Member 1"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <p className="font-semibold">John Doe</p>
            <p className="text-gray-600">Co-founder & CEO</p>
          </div>
          <div className="text-center">
            <img
              src="/images/team-member-2.jpg"
              alt="Team Member 2"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <p className="font-semibold">Jane Smith</p>
            <p className="text-gray-600">Co-founder & CTO</p>
          </div>
        </div>
      </div>
    </div>
  );
}
