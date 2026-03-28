import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import { addCartItem } from "../services/cartService";
import { syncCartFromBackend } from "../utils/syncCart";

function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);

  const fetchWishlist = async () => {
    try {
      const { data } = await API.get("/wishlist");

      const products = data.wishlist
        .filter((item) => item.product)
        .map((item) => item.product);

      const ids = products.map((product) => product._id);

      setItems(products);
      setWishlistIds(ids);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load wishlist");
    }
  };

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.info("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      await addCartItem(product._id, 1);
      await syncCartFromBackend(dispatch);
      toast.success("Added to cart!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add item");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Your Wishlist
      </h1>

      {items.length === 0 ? (
        <p className="text-gray-500 text-lg">
          Your wishlist is empty ❤️
          <br />
          Try adding your favorite products so you can find them here later!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              wishlistIds={wishlistIds}
              addToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;