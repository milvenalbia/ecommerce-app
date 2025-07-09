import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import Loading from "../components/Loading";
import { useAuthStore } from "../store/authStore";

const AdminProtectedRoute = ({ children }) => {
  //   const { user, token, isLoading } = useSelector((state) => state.auth);

  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
