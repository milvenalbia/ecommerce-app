import { BrowserRouter, Route, Routes } from "react-router";
import { useEffect } from "react";
import Home from "./pages/guest/Home";
import Login from "./pages/guest/Login";
import SignUp from "./pages/guest/SignUp";
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
import ShoppingCart from "./pages/guest/ShoppingCart";
import GuestProtectedRoute from "./pretected_route/GuestProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import Shop from "./pages/guest/Shop";
import GuestLayout from "./layouts/GuestLayout";
import Payment from "./pages/admin/Payment";

function App() {
  const { user, fetchUser, isLoading } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shops" element={<Shop />} />
          <Route
            path="/carts"
            element={
              <GuestProtectedRoute>
                <ShoppingCart />
              </GuestProtectedRoute>
            }
          />
        </Route>

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
          <Route path="payments" element={<Payment />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
