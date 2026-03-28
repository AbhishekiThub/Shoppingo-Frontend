import { useState, useEffect } from "react";
import deleteIcon from "../assets/delete.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { syncCartFromBackend } from "../utils/syncCart";
import {
  updateCartItem,
  removeCartItem,
} from "../services/cartService";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const items = useSelector((state) => state.cart.items);
  const [loading, setLoading] = useState(true);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const loadCart = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          navigate("/login");
          return;
        }

        await syncCartFromBackend(dispatch);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [dispatch, navigate]);

  const handleDecrease = async (item) => {
    try {
      const newQty = item.quantity - 1;
      if (newQty < 1) return;

      await updateCartItem(item._id, newQty);
      await syncCartFromBackend(dispatch);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update quantity");
    }
  };

  const handleIncrease = async (item) => {
    try {
      const newQty = item.quantity + 1;

      await updateCartItem(item._id, newQty);
      await syncCartFromBackend(dispatch);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeCartItem(itemId);
      await syncCartFromBackend(dispatch);
      toast.success("Item removed from cart");
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.info("Your cart is empty!");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (
      !address.name.trim() ||
      !address.phone.trim() ||
      !address.address.trim() ||
      !address.city.trim() ||
      !address.pincode.trim()
    ) {
      toast.info("Please enter your shipping address before proceeding.");
      return;
    }

    localStorage.setItem("shippingAddress", JSON.stringify(address));
    navigate("/checkout");
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto p-6">Loading cart...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600">Your cart is empty.</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 bg-white p-4 rounded-xl shadow"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />

              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-orange-600 font-bold">₹{item.price}</p>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => handleDecrease(item)}
                    className="px-2 bg-gray-200 rounded"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => handleIncrease(item)}
                    className="px-2 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold">₹{item.price * item.quantity}</p>

                <img
                  src={deleteIcon}
                  alt="delete"
                  onClick={() => handleRemove(item._id)}
                  className="w-6 h-6 mt-7 cursor-pointer transition hover:scale-110 hover:drop-shadow-[0_0_10px_red]"
                />
              </div>
            </div>
          ))
        )}

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Full Name"
              className="border p-2 rounded"
              value={address.name}
              onChange={(e) =>
                setAddress({ ...address, name: e.target.value })
              }
            />

            <input
              placeholder="Phone"
              className="border p-2 rounded"
              value={address.phone}
              onChange={(e) =>
                setAddress({ ...address, phone: e.target.value })
              }
            />

            <input
              placeholder="City"
              className="border p-2 rounded"
              value={address.city}
              onChange={(e) =>
                setAddress({ ...address, city: e.target.value })
              }
            />

            <input
              placeholder="Pincode"
              className="border p-2 rounded"
              value={address.pincode}
              onChange={(e) =>
                setAddress({ ...address, pincode: e.target.value })
              }
            />
          </div>

          <textarea
            placeholder="Full Address"
            className="border p-2 rounded w-full mt-4"
            value={address.address}
            onChange={(e) =>
              setAddress({ ...address, address: e.target.value })
            }
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow h-fit sticky top-24">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Delivery Charges</span>
          <span>Free</span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{subtotal}</span>
        </div>

        <button
          onClick={handleCheckout}
          className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;