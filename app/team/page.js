"use client";

export default function OurTeam() {
  return (
    <div className="text-center py-20 px-4 bg-white">
      <h1 className="text-4xl font-bold text-lightOrange mb-6 drop-shadow-lg">
        Our Team
      </h1>

      <div className="mt-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Meet the Team
        </h2>

        <div className="flex justify-center space-x-8 flex-wrap">
          <div className="text-center mb-6">
            <img
              src="/images/team-member-1.jpg"
              alt="Team Member 1"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <p className="font-semibold">John Doe</p>
            <p className="text-gray-600">Co-founder & CEO</p>
          </div>

          <div className="text-center mb-6">
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
