import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function ApplyVendor() {

  const [form, setForm] = useState({
    businessName: "",
    businessEmail: "",
    phone: "",
    address: "",
    gstNumber: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await API.post("/vendor/apply", form);

      toast.success("Application submitted!");

    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (

    <div className="max-w-xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-4">
        Become a Vendor
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-lg mx-auto space-y-6"
      >

        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Apply as a Seller
        </h2>

        {/* Business Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Business Name
          </label>
          <input
            placeholder="Enter your business name"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            onChange={e => setForm({ ...form, businessName: e.target.value })}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Business Email
          </label>
          <input
            placeholder="Enter your email"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            onChange={e => setForm({ ...form, businessEmail: e.target.value })}
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Phone Number
          </label>
          <input
            placeholder="Enter phone number"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Address
          </label>
          <input
            placeholder="Enter your address"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            onChange={e => setForm({ ...form, address: e.target.value })}
          />
        </div>

        {/* GST */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            GST Number (Optional)
          </label>
          <input
            placeholder="Enter GST number"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            onChange={e => setForm({ ...form, gstNumber: e.target.value })}
          />
        </div>

        {/* Button */}
        <button
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition duration-300 shadow-md hover:shadow-lg"
        >
          Apply Now
        </button>

      </form>

    </div>

  );
}

export default ApplyVendor;