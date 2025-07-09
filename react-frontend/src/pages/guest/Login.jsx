import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useState } from "react";
import { setError } from "../../redux/slices/error";
import { useAuthStore } from "../../store/authStore";
import api from "../../api/axios.js";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const { error } = useSelector((state) => state.error);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const res = await api.post("/api/login", formData);

      const data = res.data;

      fetchUser(data.user);

      if (data.user.role === "admin") {
        useAuthStore.getState().logout();
        setIsSubmitting(false);
        toast.error("Only customer can login here.");
        setFormData({
          email: "",
          password: "",
        });
      } else {
        setIsSubmitting(false);
        navigate("/");
        toast.success(data.message || "Login successfully");
      }
    } catch (error) {
      setIsSubmitting(false);
      if (error.response) {
        const { status, data } = error.response;

        if (status === 422 && data.errors) {
          dispatch(setError(data.errors || data.message));
        } else if (status === 429) {
          const message =
            `${data.message} Try again in a moment.` || "Too many requests.";
          toast.error(message);
        } else {
          toast.error(data.message || "Something went wrong.");
        }
      } else {
        toast.error("Network error or server not responding.");
      }

      console.log("Login error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-dvw h-screen flex justify-center items-center bg-gray-100">
      <div className="w-xl bg-gray-50 py-10 px-16 rounded-2xl shadow-lg">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1 mb-10">
            <h1 className="text-center text-3xl font-bold uppercase ">Login</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter you email address"
                className="input-field"
                value={formData.email}
                onChange={handleChange}
              />
              {error.email && <span className="error">{error.email[0]}</span>}
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter you password"
                className="input-field"
                value={formData.password}
                onChange={handleChange}
              />
              {error.password && (
                <span className="error">{error.password[0]}</span>
              )}
            </div>
            <button className="primary-btn mt-8 w-full rounded-full py-3 text-lg cursor-pointer font-bold">
              {isSubmitting ? "Signing In ..." : "Sign In"}
            </button>
          </form>
          <div className="flex items-center mt-10">
            <div className="h-0.5 w-full bg-gray-400"></div>
            <Link
              to={"/signup"}
              className="w-full px-10 text-center text-gray-400 uppercase font-medium hover:text-gray-500 transition-all"
            >
              Or Sign Up
            </Link>
            <div className="h-0.5 w-full bg-gray-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
