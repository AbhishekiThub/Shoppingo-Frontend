import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getVendorOrders,
  updateVendorOrderStatus
} from "../services/vendorService";

function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchVendorOrders = async () => {
    try {
      const { data } = await getVendorOrders();
      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load vendor orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      await updateVendorOrderStatus(orderId, status);
      toast.success("Order status updated");
      fetchVendorOrders();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        Loading vendor orders...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Vendor Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white shadow rounded-2xl p-6">
          <p className="text-gray-600">No orders found for your products.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow rounded-2xl p-6 mb-6 border border-gray-100"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
              <div>
                <p className="text-sm text-gray-500">Vendor Order ID</p>
                <p className="font-semibold break-all">{order._id}</p>
                {order.parentOrder && (
                  <>
                    <p className="text-sm text-gray-500 mt-2">Main Order ID</p>
                    <p className="font-medium break-all">{order.parentOrder}</p>
                  </>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-semibold">{order.customer?.name || "User"}</p>
                <p className="text-sm text-gray-500">
                  {order.customer?.email || ""}
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

            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border rounded-xl p-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                    <p className="text-gray-500 text-sm">Price: ₹{item.price}</p>
                  </div>

                  <div className="font-bold text-orange-600">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress?.address || "-"}
                </p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress?.city || "-"}
                </p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress?.postalCode || "-"}
                </p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress?.country || "-"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">Update Status</h3>

                <select
                  value={order.orderStatus}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  disabled={updatingId === order._id}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-100"
                >
                  <option value="pending">pending</option>
                  <option value="confirmed">confirmed</option>
                  <option value="shipped">shipped</option>
                  <option value="delivered">delivered</option>
                  <option value="cancelled">cancelled</option>
                </select>

                <p className="text-sm text-gray-500 mt-3">
                  Payment: {order.paymentMethod || "-"}
                </p>

                <p className="text-lg font-bold mt-3">
                  Subtotal: ₹{order.subtotal}
                </p>

                {order.deliveredAt && (
                  <p className="text-sm text-gray-500 mt-2">
                    Delivered on:{" "}
                    {new Date(order.deliveredAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default VendorOrders;

