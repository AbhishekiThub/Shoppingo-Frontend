import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function VendorProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/vendor-dashboard/products");
      setProducts(data.products || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load vendor products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((product) => product._id !== id));
      toast.success("Product deleted");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <div className="max-w-7xl mx-auto p-6">Loading products...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Products</h1>

        <button
          onClick={() => navigate("/vendor/add-product")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-600">No products added yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.images?.[0]?.url || "https://via.placeholder.com/100"}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />

                <div>
                  <h2 className="font-semibold text-lg">{product.name}</h2>
                  <p className="text-gray-500 text-sm">{product.category}</p>
                  <p className="text-orange-600 font-bold">₹{product.price}</p>
                  <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/vendor/edit-product/${product._id}`)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 text-gray-800 
                  font-medium shadow-sm transition-all duration-300 hover:shadow-gray-400/50 hover:scale-105"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(product._id)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 via-red-600 to-red-700 
                  text-white font-medium shadow-md transition-all duration-300 hover:shadow-red-500/50 
                  hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VendorProducts;