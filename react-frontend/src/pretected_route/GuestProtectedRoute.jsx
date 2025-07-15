import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router";

const GuestProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default GuestProtectedRoute;
