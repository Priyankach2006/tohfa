import Header from '../components/Header';

import Footer from '../components/Footer';
import './globals.css';

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Tohfa4U</title>
      </head>
      <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
        {/* Header *}
        <Header />
        
        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>
        
        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
