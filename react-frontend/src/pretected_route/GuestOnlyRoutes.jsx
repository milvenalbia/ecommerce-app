import { Navigate, useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";

const GuestOnlyRoutes = ({ children }) => {
  const { user } = useAuthStore();

  if (user && user.role === "customer") {
    return <Navigate to="/" replace />;
  }

  if (user && user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default GuestOnlyRoutes;
