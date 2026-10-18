'use client';

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 py-6 mt-10 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">

        {/* Tohfa4U, Offers, and Categories in a row */}
        <div className="flex flex-wrap justify-between mb-6">
          
          {/* Tohfa4U Section */}
          <div className="w-full sm:w-1/3 lg:w-1/3 mb-6 lg:mb-0">
            <h3 className="font-bold text-xl mb-4">Tohfa4U</h3>
            <ul>
              <li><a href="/about" className="hover:text-black hover:underline">About Us</a></li>
              <li><a href="/team" className="hover:text-black hover:underline">Our Team</a></li>
              <li><a href="/careers" className="hover:text-black hover:underline">Careers</a></li>
              <li><a href="/services" className="hover:text-black hover:underline">Our Services</a></li>
              <li><a href="/feedback" className="hover:text-black hover:underline">Feedback </a></li>
              <li><a href="/blog" className="hover:text-black hover:underline">Blog</a></li>
            </ul>
          </div>

          {/* Offers Section */}
          <div className="w-full sm:w-1/3 lg:w-1/3 mb-6 lg:mb-0">
            <h3 className="font-bold text-xl mb-4">Offers & Support</h3>
            <ul>
              <li><a href="/offers" className="hover:text-black hover:underline">Current Offers</a></li>
              <li><a href="/seasonal-deals" className="hover:text-black hover:underline">Seasonal Deals</a></li>
              <li><a href="/exclusive-offers" className="hover:text-black hover:underline">Exclusive Offers</a></li>
              <li><a href="/faq" className="hover:text-black hover:underline">FAQs</a></li>
              <li><a href="/support" className="hover:text-black hover:underline">Customer Support</a></li>
            </ul>
          </div>

          {/* Categories Section */}
          <div className="w-full sm:w-1/3 lg:w-1/3 mb-6 lg:mb-0">
            <h3 className="font-bold text-xl mb-4">Gifting Categories</h3>
            <ul>
              <li><a href="/gifts/for-her" className="hover:text-black hover:underline">For Her</a></li>
              <li><a href="/gifts/for-him" className="hover:text-black hover:underline">For Him</a></li>
              <li><a href="/gifts/for-kids" className="hover:text-black hover:underline">For Kids</a></li>
              <li><a href="/gifts/anniversary" className="hover:text-black hover:underline">Anniversary Gifts</a></li>
            </ul>
          </div>

        </div>

        {/* Contact Us */}
        <div className="text-center py-4 mt-6">
          <p>Contact Us: <a href="mailto:contact@tohfa4u.com" className="underline hover:text-black">contact@tohfa4u.com</a></p>
          <p className="text-lg text-gray-700">
          Phone: +1234567890
        </p>
        <p className="text-lg text-gray-700">
          Address:4th floor krishna building ,ramghat road mathura
        </p>
          <p className="mt-2">Follow Us: 
            <a href="https://facebook.com/tohfa4u" className="mx-2 hover:text-black hover:underline">Facebook</a>
            <a href="https://twitter.com/tohfa4u" className="mx-2 hover:text-black hover:underline">Twitter</a>
            <a href="https://instagram.com/tohfa4u" className="mx-2 hover:text-black hover:underline">Instagram</a>
          </p>
          
        </div>

      </div>
      <div className="w-full border-t border-gray-300 my-4"></div>

{/* Copyright Section */}
     <div className="bg-white text-black-600 text-center py-6 w-full">
  <p className="text-sm">&copy; {new Date().getFullYear()} Tohfa4U. All rights reserved.</p>
</div>
    </footer>
  );
}
