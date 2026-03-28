import { useSelector } from "react-redux";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function Checkout() {
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);

  const savedAddress = JSON.parse(localStorage.getItem("shippingAddress")) || {};

  const shippingAddress = {
    address: savedAddress.address || "",
    city: savedAddress.city || "",
    postalCode: savedAddress.pincode || "",
    country: "India"
  };

  const total = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items]
  );

  const isAddressComplete =
    shippingAddress.address &&
    shippingAddress.city &&
    shippingAddress.postalCode &&
    shippingAddress.country;

  const handlePayment = async () => {
    if (items.length === 0) {
      toast.info("Your cart is empty");
      navigate("/cart");
      return;
    }

    if (!isAddressComplete) {
      toast.info("Please complete your shipping address first");
      navigate("/cart");
      return;
    }

    try {
      const { data } = await API.post("/payment/create-order", {
        amount: total
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.order.amount,
        currency: "INR",
        name: "Shoppingo",
        description: "Order Payment",
        order_id: data.order.id,

        handler: async function (response) {
          try {
            const verifyRes = await API.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingAddress
            });

            if (verifyRes.data.success) {
              toast.success("Payment successful!");
              navigate("/order-success");
            }
          } catch (error) {
            console.log("VERIFY ERROR:", error.response?.data || error);
            toast.error("Order creation failed");
          }
        },

        theme: {
          color: "#f97316"
        }
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.log(error);
      toast.error("Payment failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex justify-between border p-4 rounded-xl bg-white"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                </div>

                <span className="font-semibold">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>

          <div className="text-gray-700 space-y-1">
            <p><span className="font-medium">Name:</span> {savedAddress.name || "-"}</p>
            <p><span className="font-medium">Phone:</span> {savedAddress.phone || "-"}</p>
            <p><span className="font-medium">Address:</span> {shippingAddress.address || "-"}</p>
            <p><span className="font-medium">City:</span> {shippingAddress.city || "-"}</p>
            <p><span className="font-medium">Postal Code:</span> {shippingAddress.postalCode || "-"}</p>
            <p><span className="font-medium">Country:</span> {shippingAddress.country}</p>
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={handlePayment}
              className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Pay with Razorpay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;