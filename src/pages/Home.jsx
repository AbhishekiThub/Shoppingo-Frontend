import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import Filters from "../components/Filters";
import ProductCard from "../components/ProductCard";
import { getCart, addCartItem } from "../services/cartService";
import { setCart, clearCart } from "../features/cartSlice";
import { toast } from "react-toastify";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("");

  const keyword = searchParams.get("keyword") || "";
  const selectedCategory = searchParams.get("category") || "";

  const isSearching = keyword.trim().length > 0;
  const isCategorySelected = selectedCategory.trim().length > 0;

  const [page, setPage] = useState(1);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleCategorySelect = (category) => {
    const params = new URLSearchParams(searchParams);

    params.set("category", category.value);
    params.delete("keyword");

    setSearchParams(params);
  };

  const clearCategoryFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    setSearchParams(params);
  };

  useEffect(() => {
    setPage(1);
  }, [filters, sort, keyword, selectedCategory]);

  const getProducts = async (pageToFetch = 1, reset = false) => {
    try {
      setLoadingProducts(true);

      const params = new URLSearchParams();

      if (keyword) params.append("keyword", keyword);

      if (selectedCategory) {
        params.append("category", selectedCategory);
      } else if (filters.category) {
        params.append("category", filters.category);
      }

      if (filters.price) params.append("price[lte]", filters.price);

      if (filters.rating) {
        params.append("averageRating[gte]", filters.rating);
      }

      if (sort) params.append("sort", sort);

      params.append("page", pageToFetch);

      const query = `/products?${params.toString()}`;

      const { data } = await API.get(query);

      if (reset) {
        setProducts(data.products);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
      }

      setHasMore(data.products.length === 9);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingProducts(false);
    }
  };


  const getWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await API.get("/wishlist");

      const ids = data.wishlist
        .filter((item) => item.product)
        .map((item) => item.product._id);

      setWishlistIds(ids);
    } catch (error) {
      console.log(error);
    }
  };

  const syncCartFromBackend = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      dispatch(clearCart());
      return;
    }

    try {
      const { data } = await getCart();

      const normalizedItems = (data.cart?.items || []).map((item) => ({
        _id: item.product?._id,
        name: item.product?.name || "",
        price: item.product?.price || 0,
        image: item.product?.images?.[0]?.url || "",
        quantity: item.quantity || 1,
      }));

      dispatch(setCart(normalizedItems));
    } catch (error) {
      console.log(error);
      dispatch(clearCart());
    }
  };

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.info("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      await addCartItem(product._id, 1);
      await syncCartFromBackend();
      toast.success("Added to cart!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add item");
    }
  };

  useEffect(() => {
    getProducts(page, page === 1);
  }, [page, filters, sort, keyword, selectedCategory]);

  useEffect(() => {
    getWishlist();
  }, []);

  useEffect(() => {
    syncCartFromBackend();
  }, []);

  return (
    <div>
      {!isSearching && !isCategorySelected && (
        <>
          <Hero />
          <CategorySection onCategorySelect={handleCategorySelect} />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-4 gap-6">
        <div className="col-span-1">
          <Filters setFilters={setFilters} />
        </div>

        <div className="col-span-3">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">
                {isSearching
                  ? `Showing results for "${keyword}"`
                  : isCategorySelected
                    ? `${selectedCategory} Products`
                    : "Latest Products"}
              </h1>

              {isCategorySelected && (
                <button
                  onClick={clearCategoryFilter}
                  className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-medium"
                >
                  Clear Category
                </button>
              )}
            </div>

            <select
              className="border rounded-lg px-3 py-2"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort</option>
              <option value="-createdAt">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-averageRating">Top Rated</option>
            </select>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  wishlistIds={wishlistIds}
                  addToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
          {products.length > 0 && hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={loadingProducts}
                className="px-6 py-3 mt-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 font-semibold shadow"
              >
                {loadingProducts ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;