import { useEffect, useState } from "react";
import API from "../services/api";

function VendorDashboard() {

  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {

    const fetchData = async () => {

      try {

        const dashboard = await API.get("/vendor-dashboard/dashboard");
        const productsRes = await API.get("/vendor-dashboard/products");
        const ordersRes = await API.get("/vendor-dashboard/orders");

        setStats(dashboard.data.data);
        setProducts(productsRes.data.products || productsRes.data.data?.products);
        setOrders(ordersRes.data.orders || ordersRes.data.data?.orders);

      } catch (error) {
        console.log(error);
      }

    };

    fetchData();

  }, []);

  if (!stats) return <p className="p-6">Loading...</p>;

  return (

    <div className="p-6 max-w-7xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">Vendor Dashboard</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-6 rounded-xl shadow">
          <p>Total Products</p>
          <h2 className="text-2xl font-bold">{stats.totalProducts}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p>Total Orders</p>
          <h2 className="text-2xl font-bold">{stats.totalOrders}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p>Revenue</p>
          <h2 className="text-2xl font-bold">₹{stats.revenue}</h2>
        </div>

      </div>

      {/* Products Table */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">

        <h2 className="text-xl font-bold mb-4">My Products</h2>

        <table className="w-full">

          <thead>
            <tr className="text-left border-b">
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>

          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-b">
                <td>{p.name}</td>
                <td>₹{p.price}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {/* Orders Table */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-bold mb-4">Orders</h2>

        <table className="w-full">

          <thead>
            <tr className="text-left border-b">
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(o => (
              <tr key={o._id} className="border-b">
                <td>{o.user?.name}</td>
                <td>₹{o.totalPrice}</td>
                <td>{o.orderStatus}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default VendorDashboard;