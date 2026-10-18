export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-red-600">Privacy Policy</h1>
      <p className="text-gray-700">
        At Tohfa4U, we are committed to protecting your privacy. This policy
        outlines how we collect, use, and safeguard your data.
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">📌 What We Collect</h2>
        <ul className="list-disc pl-6 text-gray-600">
          <li>Your name, email address, and contact info</li>
          <li>Gift preferences and interactions</li>
          <li>Browsing activity on Tohfa4U</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">🔐 How We Use Your Data</h2>
        <ul className="list-disc pl-6 text-gray-600">
          <li>To personalize gift suggestions</li>
          <li>To improve website experience</li>
          <li>To send important notifications and offers</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">📤 Your Control</h2>
        <ul className="list-disc pl-6 text-gray-600">
          <li>You can update or delete your profile anytime</li>
          <li>Choose to opt-out of promotional messages</li>
          <li>Request complete data deletion by contacting us</li>
        </ul>
      </section>

      <p className="text-gray-600">
        For any concerns, email us at{" "}
        <span className="font-medium text-red-500">support@tohfa4u.com</span>
      </p>
    </div>
  );
}
