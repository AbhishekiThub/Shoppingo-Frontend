import { useEffect, useState } from "react";
import API from "../services/api";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

function AdminDashboard() {

  const [stats, setStats] = useState(null);
  const [sales, setSales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {

    const fetchData = async () => {

      try {

        const dashboard = await API.get("/admin-dashboard/dashboard");
        const salesRes = await API.get("/admin-dashboard/sales");
        const topRes = await API.get("/admin-dashboard/top-products");

        setStats(dashboard.data.data);
        setSales(salesRes.data.salesData);
        setTopProducts(topRes.data.topProducts);

      } catch (err) {
        console.log(err);
      }

    };

    fetchData();

  }, []);

  if (!stats) return <p className="p-6">Loading...</p>;

  return (

    <div className="p-6 max-w-7xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-5 gap-4 mb-8">

        <Stat title="Users" value={stats.totalUsers} />
        <Stat title="Vendors" value={stats.totalVendors} />
        <Stat title="Products" value={stats.totalProducts} />
        <Stat title="Orders" value={stats.totalOrders} />
        <Stat title="Revenue" value={`₹${stats.totalRevenue}`} />

      </div>

      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">

        <h2 className="text-xl font-bold mb-4">Monthly Sales</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sales}>
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" />
          </LineChart>
        </ResponsiveContainer>

      </div>

      {/* Top Products */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-bold mb-4">Top Products</h2>

        {topProducts.map(p => (
          <div key={p._id._id} className="flex justify-between border-b py-2">
            <span>{p._id.name}</span>
            <span>Sold: {p.totalSold}</span>
          </div>
        ))}

      </div>

    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}

export default AdminDashboard;