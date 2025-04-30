"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ClipLoader } from "react-spinners";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { login, loading, error, success, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      setTimeout(() => {
        navigate("/projects");
      }, 1000);
    }
  }, [isLoggedIn, navigate]);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    login({ email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9fafb] p-4 relative">
      <div className={`absolute ${loading ? 'top-full scale-100' : 'top-1/2 scale-50'} mt-2 left-1/2 transition-all ease-out duration-75 -translate-x-1/2 z-10`}>
          <ClipLoader loading={loading} />
        </div>
      <div className="relative w-full max-w-md overflow-hidden rounded-lg bg-white p-8 shadow-sm">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-[#2563eb]/10"></div>

        {error && (
          <div className="mb-4 p-3 text-center bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 text-center bg-green-50 border border-green-200 text-green-700 rounded-md">
            Login successful!
          </div>
        )}

        <div className="relative">
          <h1 className="mb-2 text-center text-3xl font-semibold text-[#111827]">
            Welcome Back
          </h1>
          <p className="mb-8 text-center text-[#4b5563]">
            Log in to your account
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#374151]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
                placeholder="Enter your email"
                className={`w-full rounded-md border px-3 py-2 text-[#1f2937] focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb] ${
                  errors.email ? "border-red-500" : "border-[#e5e7eb]"
                }`}
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#374151]"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }
                }}
                placeholder="Enter your password"
                className={`w-full rounded-md border px-3 py-2 text-[#1f2937] focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb] ${
                  errors.password ? "border-red-500" : "border-[#e5e7eb]"
                }`}
                required
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full rounded-md bg-[#2563eb] py-2 text-center font-medium text-white hover:bg-[#2563eb]/90 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-[#4b5563]">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-medium text-[#2563eb] hover:underline"
            >
              Sign up
            </a>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e5e7eb]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-[#6b7280]">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="http://localhost:8000/auth/google/redirect"
                type="button"
                className="flex w-full items-center justify-center rounded-md border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#1f2937] hover:bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2"
              >
                {/* Google SVG */}
                <svg
                  className="mr-2 h-5 w-5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
