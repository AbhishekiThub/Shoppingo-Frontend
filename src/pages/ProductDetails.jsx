import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useDispatch } from "react-redux";
import { addToWishlist } from "../services/wishlistService";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import { addCartItem } from "../services/cartService";
import { syncCartFromBackend } from "../utils/syncCart";
import { getProductReviews } from "../services/reviewService";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const getProduct = async () => {
    try {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data.product);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load product");
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await getProductReviews(id);
      setReviews(data.reviews || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
    fetchReviews();
  }, [id]);

  const renderStars = (value = 0) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (value >= i) {
        stars.push(<FaStar key={i} />);
      } else if (value >= i - 0.5) {
        stars.push(<FaStar key={i} className="opacity-50" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300" />);
      }
    }

    return stars;
  };

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
      await addCartItem(product._id, quantity);
      await syncCartFromBackend(dispatch);
      toast.success("Added to cart!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add item");
    }
  };

  const handleBuyNow = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    try {
      await addCartItem(product._id, quantity);
      await syncCartFromBackend(dispatch);
      navigate("/cart");
    } catch (error) {
      console.log(error);
      toast.error("Failed to continue");
    }
  };

  const handleWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to add to wishlist");
      navigate("/login");
      return;
    }

    try {
      await addToWishlist(product._id);
      toast.success("Added to wishlist!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add to wishlist.");
    }
  };

  if (!product) return <h2 className="p-10">Loading...</h2>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid lg:grid-cols-3 gap-10 fade-in">
        <div className="bg-white rounded-xl shadow p-6 flex items-center justify-center">
          <img
            src={product.images?.[0]?.url || "https://via.placeholder.com/500"}
            alt={product.name}
            className="w-full max-h-[420px] object-contain"
          />
        </div>

        <div className="lg:col-span-1">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="mt-4 max-w-2xl"> 
            <p className="text-gray-600 leading-7 whitespace-pre-line">
              {expanded
                ? product.description
                : product.description.slice(0, 200) + "..."}
            </p>

            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 mt-2 font-medium hover:underline"
            >
              {expanded ? "Show Less" : "Read More"}
            </button>
          </div>

          <p className="mt-4 text-sm font-bold text-gray-700">
            Stock: {product.stock}
          </p>

          <div className="flex items-center gap-2 text-yellow-400 mt-3">
            <div className="flex gap-1">
              {renderStars(product.averageRating || 0)}
            </div>

            <span className="text-sm text-gray-600 font-medium">
              {(product.averageRating || 0).toFixed(1)} / 5
            </span>

            <span className="text-sm text-gray-400">
              ({product.numReviews || 0} reviews)
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-24">
          <h2 className="text-3xl font-bold text-orange-600">
            ₹{product.price}
          </h2>

          <p className="mt-2 font-medium text-green-600">
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          <div className="flex items-center gap-4 mt-6">
            <span>Quantity:</span>

            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                disabled={product.stock < 1}
              >
                -
              </button>

              <span className="px-4 py-1">{quantity}</span>

              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock || 1, q + 1))
                }
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                disabled={product.stock < 1}
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock < 1}
            className="mt-6 w-full bg-yellow-300 hover:bg-yellow-400 disabled:bg-gray-300 
            disabled:cursor-not-allowed text-black font-semibold py-3 rounded-lg transition"
          >
            Add To Cart
          </button>

          <button
            onClick={handleBuyNow}
            disabled={product.stock < 1}
            className="mt-3 w-full bg-orange-400 hover:bg-orange-500 disabled:bg-gray-300 
            disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
          >
            Buy Now
          </button>

          <button
            onClick={handleWishlist}
            className="mt-3 w-full border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg transition"
          >
            Add to Wishlist
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <p className="text-sm text-gray-500 mt-1">
              Reviews can be submitted from delivered orders.
            </p>
          </div>

          <button
            onClick={() => navigate("/orders")}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium transition"
          >
            Go to My Orders
          </button>
        </div>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {review.name || review.user?.name || "User"}
                    </h4>

                    <div className="flex items-center gap-1 text-yellow-400 mt-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mt-3">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;

