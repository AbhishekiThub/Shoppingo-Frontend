import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders");
      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingId(orderId);

      const { data } = await API.put(`/orders/${orderId}`, {
        status: "cancelled"
      });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? data.order : order
        )
      );

      toast.success("Order cancelled successfully");
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to cancel order"
      );
    } finally {
      setCancellingId(null);
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

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="max-w-7xl mx-auto p-6">Loading orders...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-600">No orders found.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow p-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div>
                  <p className="font-semibold break-all">
                    Order ID: {order._id}
                  </p>

                  <p className="text-gray-600">
                    User: {order.user?.name} ({order.user?.email})
                  </p>

                  <p className="text-gray-600">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                  <p className="text-gray-600">
                    Total: ₹{order.totalPrice}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold w-fit ${getStatusColor(order.orderStatus)}`}
                  >
                    {order.orderStatus}
                  </span>

                  {order.orderStatus !== "cancelled" &&
                    order.orderStatus !== "delivered" && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingId === order._id}
                        className={`px-5 py-2.5 rounded-lg font-semibold transition duration-300 ${
                          cancellingId === order._id
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-md hover:shadow-red-400/40"
                        }`}
                      >
                        {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                      </button>
                    )}
                </div>
              </div>

              <div className="space-y-3">
                {order.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 border-t pt-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />

                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>

                    <p className="font-bold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p>
                  Address: {order.shippingAddress?.address},{" "}
                  {order.shippingAddress?.city}
                </p>

                <p>
                  Postal Code: {order.shippingAddress?.postalCode}
                </p>

                <p>
                  Country: {order.shippingAddress?.country}
                </p>

                <p>
                  Payment Method: {order.paymentMethod || "-"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;