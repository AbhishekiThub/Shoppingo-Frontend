import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaHeart } from "react-icons/fa";
import { memo, useState, useEffect } from "react";
import { addToWishlist, removeFromWishlist } from "../services/wishlistService";
import { toast } from "react-toastify";
import { addCartItem } from "../services/cartService";
import { useDispatch } from "react-redux";
import { syncCartFromBackend } from "../utils/syncCart";

const ProductCard = memo(({ product, wishlistIds }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      if (liked) {
        await removeFromWishlist(product._id);
        setLiked(false);
        toast.info("Removed from wishlist.");
      } else {
        await addToWishlist(product._id);
        setLiked(true);
        toast.success("Added to wishlist.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add to wishlist.");
    }
  };

  useEffect(() => {
    if (wishlistIds?.includes(product._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [wishlistIds, product._id]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to add items to cart");
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

  const renderStars = (rating) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStar key={i} className="opacity-50" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300" />);
      }
    }

    return stars;
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-xl hover:shadow-xl transition duration-300 overflow-hidden fade-up">
      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 text-xl transition
    ${liked ? "text-red-500 heart-pop" : "text-gray-400 hover:text-red-500"}`}
      >
        <FaHeart />
      </button>

      <Link to={`/product/${product._id}`}>
        <img
          src={product.images?.[0]?.url}
          alt={product.name}
          loading="lazy"
          className="w-full h-52 object-cover"
        />

        <div className="p-4">
          <h3 className="text-lg font-semibold">{product.name}</h3>

          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center gap-1 text-yellow-400 mt-2">
            {renderStars(product.averageRating || 0)}
          </div>

          <div className="flex justify-between items-center mt-4">
            <span className="text-xl font-bold text-orange-600">
              ₹{product.price}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition"
          >
            Add to Cart
          </button>
        </div>
      </Link>
    </div>
  );
});

export default ProductCard;