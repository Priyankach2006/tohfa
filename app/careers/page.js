"use client";

export default function CareersPage() {
  return (
    <div className="text-center py-20 px-4 bg-white">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-orange-500 mb-6 drop-shadow-lg">
        Careers at Tohfa4U
      </h1>

      {/* Intro */}
      <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-10">
        At Tohfa4U, we’re always looking for creative, passionate, and dedicated individuals
        to join our growing team. If you’re excited about building smart gifting solutions and
        want to make a difference in how people express love, we’d love to hear from you!
      </p>

      {/* Open Positions */}
      <div className="max-w-4xl mx-auto text-left">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Current Openings</h2>
        <ul className="space-y-6">
          <li className="p-4 border border-gray-200 rounded-xl shadow-sm">
            <h3 className="text-xl font-medium text-orange-500">Frontend Developer</h3>
            <p className="text-gray-700">
              Work with our design and backend teams to bring magical gift interfaces to life.
            </p>
          </li>
          <li className="p-4 border border-gray-200 rounded-xl shadow-sm">
            <h3 className="text-xl font-medium text-orange-500">AI/ML Engineer</h3>
            <p className="text-gray-700">
              Help us improve our AI gifting engine by building smarter, faster algorithms.
            </p>
          </li>
          <li className="p-4 border border-gray-200 rounded-xl shadow-sm">
            <h3 className="text-xl font-medium text-orange-500">Marketing Intern</h3>
            <p className="text-gray-700">
              Assist in brand storytelling, social media growth, and creative campaign planning.
            </p>
          </li>
        </ul>
      </div>

      {/* Call to Action */}
      <div className="mt-12">
        <p className="text-lg text-gray-800">Don't see a role that fits?</p>
        <p className="text-orange-500 font-medium">
          Email us at careers@tohfa4u.com with your CV and a short note about you!
        </p>
      </div>
    </div>
  );
}
