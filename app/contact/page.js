import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simulate form submission (could be replaced with an actual API call)
    setFormStatus('Submitting...');

    // Simulate a successful submission after 2 seconds
    setTimeout(() => {
      setFormStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    }, 2000);
  };

  return (
    <div className="text-center py-20 px-4">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-orange-500 mb-6">Contact Us</h1>

      {/* Subheading */}
      <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
        Have questions or feedback? Reach out to us, and we'll get back to you
        as soon as possible.
      </p>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
        <div>
          <label htmlFor="name" className="block text-left text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-left text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Your Email"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-left text-gray-700 mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Your Message"
            rows="6"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-300"
          >
            Send Message
          </button>
        </div>
      </form>

      {/* Form Status Message */}
      {formStatus && (
        <div className="mt-6 text-lg text-gray-700">
          {formStatus}
        </div>
      )}
    </div>
  );
}
