import { useState } from "react";

function Filters({ setFilters }) {
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");

  const applyFilters = () => {
    setFilters({
      category,
      price,
      rating
    });
  };

  const clearFilters = () => {
    setCategory("");
    setPrice("");
    setRating("");

    setFilters({
      category: "",
      price: "",
      rating: ""
    });
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 h-fit w-64">
      <h2 className="text-lg font-semibold mb-4">
        Filters
      </h2>

      <div className="mb-4">
        <p className="font-medium mb-2">Category</p>

        <select
          className="w-full border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All</option>
          <option value="Electronics">Electronics</option>
          <option value="Male Fashion">Male Fashion</option>
          <option value="Female Fashion">Female Fashion</option>
          <option value="Mobiles">Mobiles</option>
          <option value="Appliances">Appliances</option>
          <option value="Books">Books</option>
          <option value="Beauty">Beauty</option>
          <option value="Toys">Toys</option>
          <option value="Grocery">Grocery</option>
          <option value="Furniture">Furniture</option>
          <option value="Sports">Sports</option>
          <option value="Home Decor">Home Decor</option>
          <option value="Automotive">Automotive</option>
          <option value="Utensils">Utensils</option>
          <option value="Stationery">Stationery</option>
          <option value="Kids Fashion">Kids Fashion</option>
        </select>
      </div>

      <div className="mb-4">
        <p className="font-medium mb-2">Price</p>

        <select
          className="w-full border p-2 rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        >
          <option value="">All</option>
          <option value="500">Under ₹500</option>
          <option value="1000">Under ₹1000</option>
          <option value="5000">Under ₹5000</option>
          <option value="10000">Under ₹10000</option>
        </select>
      </div>

      <div className="mb-4">
        <p className="font-medium mb-2">Rating</p>

        <select
          className="w-full border p-2 rounded"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value="">All</option>
          <option value="4">4★ & above</option>
          <option value="3">3★ & above</option>
          <option value="2">2★ & above</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          onClick={applyFilters}
          className="w-full bg-yellow-400 hover:bg-yellow-500 py-2 rounded font-semibold"
        >
          Apply Filters
        </button>

        <button
          onClick={clearFilters}
          className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded font-semibold"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default Filters;