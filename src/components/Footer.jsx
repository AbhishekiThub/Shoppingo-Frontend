import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Shoppingo Logo" className="h-12 w-auto" />
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed">
            A modern multi-vendor marketplace built with MERN stack.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>Home</li>
            <li>Cart</li>
            <li>Wishlist</li>
            <li>Orders</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Categories</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>Electronics</li>
            <li>Fashion</li>
            <li>Books</li>
            <li>Furniture</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <p className="text-gray-400 text-sm">Faridabad, Haryana, India</p>
          <p className="text-gray-400 text-sm">decodingabhishek@gmail.com</p>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center text-gray-400 text-sm py-4">
        © 2026 Shoppingo. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;