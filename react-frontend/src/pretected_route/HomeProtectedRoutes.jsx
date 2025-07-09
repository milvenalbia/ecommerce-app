import { Navigate } from "react-router";
import { useAuthStore } from "../store/authStore";

const HomeProtectedRoutes = () => {
  const { user } = useAuthStore();

  //Use this route if needed for future update
  if (user && user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default HomeProtectedRoutes;
