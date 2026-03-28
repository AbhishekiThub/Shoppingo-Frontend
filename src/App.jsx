import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./index.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderSuccess from "./pages/OrderSuccess";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./pages/AdminDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ApplyVendor from "./pages/ApplyVendor";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { syncCartFromBackend } from "./utils/syncCart";
import AddProduct from "./pages/AddProduct";
import VendorProducts from "./pages/VendorProducts";
import EditProduct from "./pages/EditProduct";
import AdminVendorRequests from "./pages/AdminVendorRequests";
import AdminOrders from "./pages/AdminOrders";
import Footer from "./components/Footer";
import VendorOrders from "./pages/VendorOrders";


function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    syncCartFromBackend(dispatch);
  }, [dispatch]);

  return (
    <BrowserRouter>

      <ToastContainer position="bottom-right"
        autoClose={3000} hideProgressBar={false}
        newestOnTop={false} closeOnClick rtl={false}
        pauseOnFocusLoss draggable pauseOnHover theme="dark" />

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/order-success" element={<OrderSuccess />} />

        <Route path="/apply-vendor" element={<ApplyVendor />} />


        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor-dashboard"
          element={
            <ProtectedRoute role="vendor">
              <VendorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/add-product"
          element={
            <ProtectedRoute role="vendor">
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor-products"
          element={
            <ProtectedRoute role="vendor">
              <VendorProducts />
            </ProtectedRoute>
          }
        />

        <Route path="/vendor/edit-product/:id"
          element={
            <ProtectedRoute role="vendor">
              <EditProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/vendor-requests"
          element={
            <ProtectedRoute role="admin">
              <AdminVendorRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute role="admin">
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/orders"
          element={
            <ProtectedRoute role="vendor">
              <VendorOrders />
            </ProtectedRoute>
          }
        />


      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;