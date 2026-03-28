import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import { categories } from "../data/categories";

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: ""
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/products/${id}`);

      const product = data.product;

      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || "",
        category: product.category || ""
      });

      setImagePreview(product.images?.[0]?.url || "");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to load product");
      navigate("/vendor-products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      await API.put(`/products/${id}`, {
        name: form.name,
        description: form.description,
        price: form.price,
        stock: form.stock,
        category: form.category
      });

      toast.success("Product updated successfully");
      navigate("/vendor-products");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

        {imagePreview && (
          <div className="mb-4">
            <img
              src={imagePreview}
              alt={form.name}
              className="w-32 h-32 object-cover rounded-lg border"
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <textarea
            name="description"
            placeholder="Product Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 min-h-32"
            required
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />

            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={updating}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg"
            >
              {updating ? "Updating Product..." : "Update Product"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/vendor-products")}
              className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;