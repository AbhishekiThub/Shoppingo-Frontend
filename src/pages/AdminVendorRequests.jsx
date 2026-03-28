import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function AdminVendorRequests() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVendorRequests = async () => {
    try {
      const { data } = await API.get("/vendor");
      setVendors(data.vendors || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load vendor requests");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.put(`/vendor/${id}`, { status });

      setVendors((prev) =>
        prev.map((vendor) =>
          vendor._id === id ? { ...vendor, status } : vendor
        )
      );

      toast.success(`Vendor ${status} successfully`);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchVendorRequests();
  }, []);

  if (loading) {
    return <div className="max-w-7xl mx-auto p-6">Loading vendor requests...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Vendor Requests</h1>

      {vendors.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-600">No vendor requests found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {vendors.map((vendor) => (
            <div
              key={vendor._id}
              className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h2 className="text-xl font-semibold">{vendor.businessName}</h2>
                <p className="text-gray-600">Owner: {vendor.user?.name}</p>
                <p className="text-gray-600">Email: {vendor.businessEmail}</p>
                <p className="text-gray-600">Phone: {vendor.phone}</p>
                <p className="text-gray-600">Address: {vendor.address}</p>
                {vendor.gstNumber && (
                  <p className="text-gray-600">GST: {vendor.gstNumber}</p>
                )}
                <p className="mt-2">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      vendor.status === "approved"
                        ? "text-green-600"
                        : vendor.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {vendor.status}
                  </span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleStatusUpdate(vendor._id, "approved")}
                  disabled={vendor.status === "approved"}
                  className="px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold 
                  transition duration-300 shadow-md hover:shadow-green-300/50 disabled:bg-gray-300 
                  disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleStatusUpdate(vendor._id, "rejected")}
                  disabled={vendor.status === "rejected"}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold 
                  transition duration-300 shadow-md hover:shadow-red-300/50 disabled:bg-gray-300 
                  disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminVendorRequests;