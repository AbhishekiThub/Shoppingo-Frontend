import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import cartIcon from "../assets/cart.PNG";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const cartItems = useSelector((state) => state.cart.items);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");

  useEffect(() => {
    const updateUser = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("userChanged", updateUser);

    return () => {
      window.removeEventListener("userChanged", updateUser);
    };
  }, []);

  useEffect(() => {
    setKeyword(searchParams.get("keyword") || "");
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedKeyword = keyword.trim();

      if (trimmedKeyword && location.pathname !== "/") {
        navigate(`/?keyword=${encodeURIComponent(trimmedKeyword)}`);
        return;
      }

      if (location.pathname === "/") {
        const params = new URLSearchParams(searchParams);

        if (trimmedKeyword) {
          params.set("keyword", trimmedKeyword);
        } else {
          params.delete("keyword");
        }

        setSearchParams(params);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword, location.pathname, navigate, searchParams, setSearchParams]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("userChanged"));
    setUser(null);
    navigate("/login");
  };

  const clearSearch = () => {
    setKeyword("");

    if (location.pathname === "/") {
      const params = new URLSearchParams(searchParams);
      params.delete("keyword");
      setSearchParams(params);
    }
  };

  return (
    <nav className="bg-black shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Shoppingo Logo"
              className="h-12 w-auto"
            />
          </Link>

          {/* Search */}
          <div className="flex-1 mx-10 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {keyword && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                ✕
              </button>
            )}
          </div>

          {/* ADMIN, VENDOR & USER DROPDOWN */}
          <div className="flex items-center space-x-6 text-white font-semibold">
            {user?.role === "admin" && (
              <div className="relative group">
                <button className="px-4 py-2 rounded-lg hover:bg-orange-100 hover:text-black transition">
                  Admin ▾
                </button>

                <div className="absolute left-0 top-full pt-2 w-52 bg-white shadow-xl rounded-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50">
                  <Link
                    to="/admin-dashboard"
                    className="block px-4 py-3 hover:bg-orange-50 rounded-t-xl text-gray-700"
                  >
                    Admin Panel
                  </Link>

                  <Link
                    to="/admin/vendor-requests"
                    className="block px-4 py-3 hover:bg-orange-50 text-gray-700"
                  >
                    Vendor Requests
                  </Link>

                  <Link
                    to="/admin/orders"
                    className="block px-4 py-3 hover:bg-orange-50 rounded-b-xl text-gray-700"
                  >
                    Manage Orders
                  </Link>

                </div>
              </div>
            )}

            {user?.role === "vendor" && (
              <div className="relative group">
                <button className="px-4 py-2 rounded-lg hover:bg-yellow-400 hover:text-black transition">
                  Vendor ▾
                </button>

                <div className="absolute left-0 top-full pt-2 w-52 bg-white shadow-xl rounded-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50">
                  <button
                    onClick={() => navigate("/vendor-dashboard")}
                    className="block w-full text-left px-4 py-3 hover:bg-orange-50 rounded-t-xl text-gray-700"
                  >
                    Vendor Panel
                  </button>

                  <button
                    onClick={() => navigate("/vendor-products")}
                    className="block w-full text-left px-4 py-3 hover:bg-orange-50 text-gray-700"
                  >
                    My Products
                  </button>

                  <button
                    onClick={() => navigate("/vendor/orders")}
                    className="block w-full text-left px-4 py-3 hover:bg-orange-50 text-gray-700"
                  >
                    Manage Orders
                  </button>

                  <button
                    onClick={() => navigate("/vendor/add-product")}
                    className="block w-full text-left px-4 py-3 hover:bg-orange-50 rounded-b-xl text-gray-700"
                  >
                    Add Product
                  </button>
                </div>
              </div>
            )}

            {user?.role === "user" && (
              <button onClick={() => navigate("/apply-vendor")}>
                Become Vendor
              </button>
            )}

            {user ? (
              <>
                <button onClick={() => navigate("/wishlist")}>Wishlist</button>
                <button onClick={() => navigate("/orders")}>My Orders</button>

                <button
                  onClick={handleLogout}
                  className="bg-gray-200 text-black px-3 py-1 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate("/login")}>Login</button>

                <button
                  onClick={() => navigate("/register")}
                  className="bg-yellow-400 text-black px-3 py-1 rounded"
                >
                  Register
                </button>
              </>
            )}

            <Link
              to="/cart"
              className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-lg"
            >
              <div className="relative">
                <img src={cartIcon} alt="cart" className="w-7 h-7" />

                {cartItems?.length > 0 && (
                  <span className="absolute bottom-2 left-2.5 text-xl font-bold">
                    {cartItems.length}
                  </span>
                )}
              </div>

              Cart
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;