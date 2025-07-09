import { Navigate } from "react-router";
import Loading from "../components/Loading";
import { useAuthStore } from "../store/authStore";

const AdminLoginRoute = ({ children }) => {
  const { user, isLoading } = useAuthStore();

  if (user && user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user && user.role === "customer") {
    return <Navigate to="/" replace />;
  }

  // ✅ Otherwise, show login page
  return children;
};

export default AdminLoginRoute;
