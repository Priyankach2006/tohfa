import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href="/" className="hover:text-orange-400">
            Tohfa4U
          </Link>
        </h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="hover:text-orange-400">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-orange-400">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-orange-400">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/suggestions" className="hover:text-orange-400">
                Suggestions
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
