import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

function OrderSuccess() {

  const navigate = useNavigate();

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-50 px-4">

      <div className="bg-white shadow-2xl rounded-3xl p-10 text-center max-w-md w-full animate-fade-in">

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-5 rounded-full animate-bounce">
            <FaCheckCircle className="text-green-600 text-5xl" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-green-600 mb-3">
          Payment Successful!
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mb-6">
          Your order has been placed successfully 🎉 <br />
          You can track it in your orders section.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">

          <button
            onClick={() => navigate("/orders")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition duration-300 shadow-md hover:shadow-lg"
          >
            View My Orders
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full border border-gray-300 hover:bg-gray-100 py-3 rounded-xl font-semibold transition"
          >
            Continue Shopping
          </button>

        </div>

      </div>

    </div>

  );

}

export default OrderSuccess;