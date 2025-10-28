// src/App.js
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaEnvelope,
  FaTags,
  FaChartLine,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetails from "./pages/OrderDetails";
import ContactQueriesPage from "./pages/ContactQueriesPage";
import CategoriesPage from "./pages/CategoriesPage";
import UsersPage from "./pages/UsersPage";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const API = "http://127.0.0.1:5000/api";

export default function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // 🌙 toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <Router>
      <div
        className={`flex h-screen transition-colors duration-500 ${
          darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"
        }`}
      >
        {/* Sidebar */}
        <aside
          className={`w-64 flex flex-col shadow-md transition-colors duration-500 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="p-6 text-2xl font-bold text-blue-500 border-b border-gray-700">
            Buyzaar Admin
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <SidebarLink to="/" icon={<FaChartLine />} label="Dashboard" />
            <SidebarLink to="/products" icon={<FaBox />} label="Products" />
            <SidebarLink to="/orders" icon={<FaShoppingCart />} label="Orders" />
            <SidebarLink
              to="/contact-queries"
              icon={<FaEnvelope />}
              label="Contact Queries"
            />
            <SidebarLink to="/categories" icon={<FaTags />} label="Categories" />
            <SidebarLink to="/users" icon={<FaUsers />} label="Users" />
          </nav>
          <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
            © 2025 Buyzaar
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <header
            className={`flex items-center justify-between h-16 px-6 shadow-sm transition-colors duration-500 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>

            {/* 🌙 Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </header>

          <div className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard darkMode={darkMode} />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/contact-queries" element={<ContactQueriesPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/users" element={<UsersPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

/* ✅ Sidebar Link with Highlight */
function SidebarLink({ to, icon, label }) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 p-2 rounded-lg transition ${
        active
          ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold"
          : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

/* ✅ Dashboard Component */
function Dashboard({ darkMode }) {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    categories: 0,
    queries: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);

  const fetchStats = async () => {
    try {
      const [p, o, u, c, q] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/orders`),
        axios.get(`${API}/users`),
        axios.get(`${API}/categories`),
        axios.get(`${API}/contact-queries`),
      ]);

      const revenue = o.data.reduce(
        (sum, order) => sum + Number(order.total_amount || 0),
        0
      );

      setStats({
        products: p.data.length,
        orders: o.data.length,
        users: u.data.length,
        categories: c.data.length,
        queries: q.data.length,
        revenue,
      });

      setRecentOrders(o.data.slice(0, 5));
      setTopProducts(p.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
    setSalesData([
      { month: "Jan", sales: 2400 },
      { month: "Feb", sales: 3200 },
      { month: "Mar", sales: 4100 },
      { month: "Apr", sales: 5200 },
      { month: "May", sales: 4900 },
      { month: "Jun", sales: 5800 },
    ]);
  }, []);

  return (
    <div className="space-y-8 transition-colors duration-500">
      <h2 className="text-2xl font-semibold mb-4">📊 Dashboard Overview</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card title="Revenue" count={`$${stats.revenue}`} color="bg-green-100 dark:bg-green-900" />
        <Card title="Orders" count={stats.orders} color="bg-blue-100 dark:bg-blue-900" />
        <Card title="Products" count={stats.products} color="bg-purple-100 dark:bg-purple-900" />
        <Card title="Users" count={stats.users} color="bg-orange-100 dark:bg-orange-900" />
        <Card title="Categories" count={stats.categories} color="bg-amber-100 dark:bg-amber-900" />
        <Card title="Queries" count={stats.queries} color="bg-red-100 dark:bg-red-900" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="💰 Monthly Revenue Trend" darkMode={darkMode}>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#ddd"} />
              <XAxis dataKey="month" stroke={darkMode ? "#ccc" : "#333"} />
              <YAxis stroke={darkMode ? "#ccc" : "#333"} />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="📦 Orders Overview" darkMode={darkMode}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#ddd"} />
              <XAxis dataKey="month" stroke={darkMode ? "#ccc" : "#333"} />
              <YAxis stroke={darkMode ? "#ccc" : "#333"} />
              <Tooltip />
              <Bar dataKey="sales" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Lists */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ListCard title="🕒 Recent Orders" items={recentOrders} />
        <ListCard title="🏆 Top Products" items={topProducts} type="product" />
      </div>
    </div>
  );
}

/* ✅ Reusable Components */
function Card({ title, count, color }) {
  return (
    <div
      className={`${color} p-6 rounded-xl shadow hover:shadow-lg transition dark:text-gray-200`}
    >
      <h3 className="text-gray-600 dark:text-gray-400 text-sm">{title}</h3>
      <p className="text-3xl font-bold mt-2">{count}</p>
    </div>
  );
}

function ChartCard({ title, children, darkMode }) {
  return (
    <div
      className={`p-6 rounded-xl shadow transition ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function ListCard({ title, items, type }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {items.length === 0 ? (
        <p className="text-gray-500 italic">No data available.</p>
      ) : (
        <ul className="divide-y dark:divide-gray-700">
          {items.map((item) => (
            <li key={item.id} className="py-3 flex justify-between">
              <span className="font-medium">
                {type === "product" ? item.name : `#${item.id}`}
              </span>
              <span className="text-gray-500 text-sm">
                {type === "product"
                  ? item.is_active
                    ? "Active"
                    : "Inactive"
                  : `$${item.total_amount}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
