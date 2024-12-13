
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthNavbar from "../components/AuthNavbar";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    control._disableForm(true);
    const loadingToast = toast.loading("Signing in...");
    try {
      const response = await api.post("/auth/login", values);
      toast.dismiss(loadingToast);
      toast.success("Successfully logged in!");
      login(response.data);
      navigate("/"); // Automatically navigate to the main screen after login
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage = error.response?.data?.message || error.message || "An error occurred";
      toast.error(errorMessage);
      setError("submit", { 
        type: "manual",
        message: errorMessage
      });
    }
    control._disableForm(false);
  };

  return (
    <div className='h-screen bg-dark-900 flex flex-col'>
      <AuthNavbar />
      <div className='flex-1 flex items-center justify-center'>
        <div className='p-2 w-full max-w-md'>
          <h1 className='text-3xl text-black font-bold mb-4'>Login</h1>
          <p className='text-dark-400 mb-8'>
            Welcome back, please enter your details
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div>
              <input
                type='email'
                placeholder='Email'
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full text-black p-4 py-2 rounded-lg border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <input
                type='password'
                placeholder='Password'
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full text-black p-4 py-2 rounded-lg border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              {errors.password && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type='submit'
              className='bg-black text-white px-4 py-2 rounded-lg w-full hover:bg-primary-700 transition-colors'
            >
              Login
            </button>
          </form>

          <p className='mt-10 text-center text-sm text-dark-400'>
            Don't have an account?{" "}
            <Link to='/signup' className='text-primary-600 font-bold'>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;