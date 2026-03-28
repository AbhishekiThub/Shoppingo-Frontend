import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import {
  getProductReviews,
  addReview,
  deleteReview
} from "../services/reviewService";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openReviewFor, setOpenReviewFor] = useState(null);
  const [reviewForm, setReviewForm] = useState({});
  const [productReviewsMap, setProductReviewsMap] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders/my-orders");
      const fetchedOrders = data.orders || [];
      setOrders(fetchedOrders);

      const deliveredProductIds = [
        ...new Set(
          fetchedOrders
            .filter(order => order.orderStatus === "delivered")
            .flatMap(order =>
              order.orderItems.map(item =>
                typeof item.product === "object" ? item.product._id : item.product
              )
            )
            .filter(Boolean)
        )
      ];

      if (deliveredProductIds.length > 0) {
        await fetchReviewsForProducts(deliveredProductIds);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewsForProducts = async (productIds) => {
    try {
      const results = await Promise.all(
        productIds.map(async (productId) => {
          const { data } = await getProductReviews(productId);
          return [productId, data.reviews || []];
        })
      );

      const reviewMap = Object.fromEntries(results);
      setProductReviewsMap(reviewMap);
    } catch (error) {
      console.log(error);
    }
  };

  const renderStars = (rating = 0) => {
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

  const getMyExistingReview = (productId) => {
    const reviews = productReviewsMap[productId] || [];

    return reviews.find(
      (review) =>
        review.user?._id?.toString() === user?._id?.toString() ||
        review.user?.toString?.() === user?._id?.toString()
    );
  };

  const toggleReviewForm = (productId) => {
    if (openReviewFor === productId) {
      setOpenReviewFor(null);
      return;
    }

    const existingReview = getMyExistingReview(productId);

    setReviewForm((prev) => ({
      ...prev,
      [productId]: {
        rating: existingReview?.rating || 0,
        comment: existingReview?.comment || ""
      }
    }));

    setOpenReviewFor(productId);
  };

  const handleReviewChange = (productId, field, value) => {
    setReviewForm((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value
      }
    }));
  };

  const handleReviewSubmit = async (productId) => {
    const currentForm = reviewForm[productId] || {};
    const rating = Number(currentForm.rating || 0);
    const comment = currentForm.comment || "";

    if (!rating) {
      toast.info("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.info("Please write a comment");
      return;
    }

    try {
      await addReview(productId, { rating, comment });
      toast.success("Review submitted successfully");

      const { data } = await getProductReviews(productId);
      setProductReviewsMap((prev) => ({
        ...prev,
        [productId]: data.reviews || []
      }));

      setOpenReviewFor(null);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Failed to submit review"
      );
    }
  };

  const handleDeleteReview = async (productId) => {
    try {
      await deleteReview(productId);
      toast.success("Review deleted");

      const { data } = await getProductReviews(productId);
      setProductReviewsMap((prev) => ({
        ...prev,
        [productId]: data.reviews || []
      }));

      setReviewForm((prev) => ({
        ...prev,
        [productId]: {
          rating: 0,
          comment: ""
        }
      }));

      setOpenReviewFor(null);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete review");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getProgressWidth = (status) => {
    switch (status) {
      case "pending":
        return "25%";
      case "confirmed":
        return "50%";
      case "shipped":
        return "75%";
      case "delivered":
        return "100%";
      case "cancelled":
        return "100%";
      default:
        return "0%";
    }
  };

  const getProgressColor = (status) => {
    return status === "cancelled" ? "bg-red-500" : "bg-green-500";
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6">Loading orders...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white shadow rounded-xl p-6">
          <p className="text-gray-600">No orders yet.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow rounded-xl p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold break-all">{order._id}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-semibold">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}
                >
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {order.orderItems.map((item, index) => {
              const productId =
                typeof item.product === "object" ? item.product._id : item.product;

              const existingReview = getMyExistingReview(productId);
              const currentForm = reviewForm[productId] || {
                rating: 0,
                comment: ""
              };

              return (
                <div
                  key={`${productId}-${index}`}
                  className="border-t py-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />

                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold mb-2">
                        ₹{item.price * item.quantity}
                      </p>

                      {order.orderStatus === "delivered" && (
                        <button
                          onClick={() => toggleReviewForm(productId)}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold transition shadow-sm"
                        >
                          {existingReview ? "Edit Review" : "Write Review"}
                        </button>
                      )}
                    </div>
                  </div>

                  {order.orderStatus === "delivered" && openReviewFor === productId && (
                    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <h3 className="text-lg font-semibold mb-4">
                        {existingReview ? "Update Your Review" : "Write a Review"}
                      </h3>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating
                        </label>
                        <select
                          value={currentForm.rating}
                          onChange={(e) =>
                            handleReviewChange(productId, "rating", Number(e.target.value))
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        >
                          <option value={0}>Select rating</option>
                          <option value={1}>1 Star</option>
                          <option value={2}>2 Stars</option>
                          <option value={3}>3 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={5}>5 Stars</option>
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Comment
                        </label>
                        <textarea
                          rows="4"
                          value={currentForm.comment}
                          onChange={(e) =>
                            handleReviewChange(productId, "comment", e.target.value)
                          }
                          placeholder="Share your experience with this product..."
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleReviewSubmit(productId)}
                          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold transition duration-300 shadow-md hover:shadow-green-400/40"
                        >
                          {existingReview ? "Update Review" : "Submit Review"}
                        </button>

                        {existingReview && (
                          <button
                            onClick={() => handleDeleteReview(productId)}
                            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold transition duration-300 shadow-md hover:shadow-red-400/40"
                          >
                            Delete Review
                          </button>
                        )}

                        <button
                          onClick={() => setOpenReviewFor(null)}
                          className="px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {existingReview && order.orderStatus === "delivered" && openReviewFor !== productId && (
                    <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-1 text-yellow-400 mb-2">
                        {renderStars(existingReview.rating)}
                      </div>
                      <p className="text-gray-700">{existingReview.comment}</p>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Pending</span>
                <span>Confirmed</span>
                <span>Shipped</span>
                <span>Delivered</span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`${getProgressColor(order.orderStatus)} h-2 rounded-full transition-all duration-300`}
                  style={{ width: getProgressWidth(order.orderStatus) }}
                />
              </div>

              {order.orderStatus === "cancelled" && (
                <p className="text-red-600 text-sm mt-2 font-medium">
                  This order was cancelled.
                </p>
              )}
            </div>

            <div className="mt-4 border-t pt-4 text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Address:</span>{" "}
                {order.shippingAddress?.address || "-"}
              </p>
              <p>
                <span className="font-medium">City:</span>{" "}
                {order.shippingAddress?.city || "-"}
              </p>
              <p>
                <span className="font-medium">Postal Code:</span>{" "}
                {order.shippingAddress?.postalCode || "-"}
              </p>
              <p>
                <span className="font-medium">Country:</span>{" "}
                {order.shippingAddress?.country || "-"}
              </p>
              <p>
                <span className="font-medium">Payment Method:</span>{" "}
                {order.paymentMethod || "-"}
              </p>
            </div>

            <div className="flex justify-end mt-4 font-bold text-lg">
              Total: ₹{order.totalPrice}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;