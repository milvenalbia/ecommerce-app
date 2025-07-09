import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { setError } from "../../redux/slices/error.js";
import { login } from "../../redux/slices/authSlice.js";
import { toast } from "sonner";
import api from "../../api/axios.js";
import { useAuthStore } from "../../store/authStore.js";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.error);

  const { fetchUser } = useAuthStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   setIsSubmitting(true);
  //   try {
  //     const res = await api.post("/api/login", formData);

  //     const data = res.data;

  //     fetchUser(data.user);

  //     if (data.user.role === "admin") {
  //       useAuthStore.getState().logout();
  //       setIsSubmitting(false);
  //       toast.error("Only customer can login here.");
  //       setFormData({
  //         email: "",
  //         password: "",
  //       });
  //     } else {
  //       setIsSubmitting(false);
  //       navigate("/");
  //       toast.success(data.message || "Login successfully");
  //     }
  //   } catch (error) {
  //     setIsSubmitting(false);
  //     if (error.response) {
  //       const { status, data } = error.response;

  //       if (status === 422 && data.errors) {
  //         dispatch(setError(data.errors || data.message));
  //       } else if (status === 429) {
  //         const message =
  //           `${data.message} Try again in a moment.` || "Too many requests.";
  //         toast.error(message);
  //       } else {
  //         toast.error(data.message || "Something went wrong.");
  //       }
  //     } else {
  //       toast.error("Network error or server not responding.");
  //     }

  //     console.log("Login error:", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const res = await api.post("/api/register", formData);

      const data = await res.data;

      fetchUser(data.user);
      setIsSubmitting(false);
      navigate("/");
      toast.success(data.message || "Registered successfully!");
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
    <div className="w-dvw h-screen flex justify-center items-center bg-gray-100 py-5">
      <div className="w-xl bg-gray-50 py-10 px-16 rounded-2xl shadow-lg">
        <div className="flex flex-col gap-2">
          <h1 className="text-center text-3xl font-bold uppercase mb-10">
            Sign Up
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter you name"
                className="input-field"
                value={formData.name}
                onChange={handleChange}
              />
              {error.name && <span className="error">{error.name[0]}</span>}
            </div>
            <div className="flex flex-col gap-2 mt-4">
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
            <div className="flex flex-col gap-2 mt-4">
              <label htmlFor="password_confirmation">Confirm Password</label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                placeholder="Confirm your password"
                className="input-field"
                value={formData.password_confirmation}
                onChange={handleChange}
              />
            </div>
            <button className="primary-btn mt-8 w-full rounded-full py-3 text-lg cursor-pointer font-bold">
              {isSubmitting ? "Creating Account ..." : "Create Account"}
            </button>
          </form>
          <div className="flex items-center mt-10">
            <div className="h-0.5 w-full bg-gray-400"></div>
            <Link
              to={"/login"}
              className="w-full px-10 text-center text-gray-400 uppercase font-medium hover:text-gray-500 transition-all"
            >
              Or Login
            </Link>
            <div className="h-0.5 w-full bg-gray-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
