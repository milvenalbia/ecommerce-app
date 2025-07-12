import { BrowserRouter, Route, Routes } from "react-router";
import { useEffect } from "react";
import Home from "./pages/guest/Home";
import Login from "./pages/guest/Login";
import SignUp from "./pages/guest/SignUp";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminLoginRoute from "./pretected_route/AdminLoginRoute";
import AdminProtectedRoute from "./pretected_route/AdminProtectedRoute";
import GuestOnlyRoutes from "./pretected_route/GuestOnlyRoutes";
import Loading from "./components/Loading";
import { useAuthStore } from "./store/authStore";
import Product from "./pages/admin/Product";
import Category from "./pages/admin/Category";
import Orders from "./pages/admin/Orders";

function App() {
  const { user, fetchUser, isLoading } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Guest-only */}
        <Route
          path="/login"
          element={
            <GuestOnlyRoutes>
              <Login />
            </GuestOnlyRoutes>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestOnlyRoutes>
              <SignUp />
            </GuestOnlyRoutes>
          }
        />

        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={
            <AdminLoginRoute>
              <AdminLogin />
            </AdminLoginRoute>
          }
        />

        {/* Admin Protected */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Product />} />
          <Route path="categories" element={<Category />} />
          <Route path="orders" element={<Orders />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
