"use client"

import { useState } from "react"
import { register } from "../services/authService"

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    // Validate confirm password
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setApiError("")

    try {
      // Replace with your actual API endpoint
      const response = await register({
        username: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      })

      const data = response.data

      // Handle successful registration
      setSuccess(true)

      // You might want to store the token in localStorage or cookies
      if (data.token) {
        localStorage.setItem("token", data.token)
      }
    } catch (err) {
      setApiError(err.response.data.message)
      
      
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9fafb] p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-lg bg-white p-8 shadow-lg">
        {/* Decorative shape */}
        <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[#4f46e5]/10" />

        <div className="text-center mb-6">
          <h1 className="mb-2 text-2xl font-bold text-[#111827]">Create Account</h1>
          <p className="text-[#6b7280]">Join us to start managing your tasks</p>
        </div>

        {apiError && (
          <div className="text-center mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {apiError}
          </div>
        )}

        {success ? (
          <div className="text-center p-6 bg-green-50 border border-green-200 text-green-700 rounded-md mb-4">
            <h2 className="text-xl font-bold mb-2">Registration Successful!</h2>
            <p>Your account has been created successfully.</p>
            <a
              href="/login"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Proceed to Login
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-sm font-medium text-[#374151]">
                Full Name*
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full rounded-md border px-3 py-2 text-[#1f2937] placeholder-[#adaebc]
                  focus:border-[#4f46e5] focus:outline-none
                  ${errors.name ? "border-red-500" : "border-[#ced4da]"}`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-[#374151]">
                Email*
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-md border px-3 py-2 text-[#1f2937] placeholder-[#adaebc]
                  focus:border-[#4f46e5] focus:outline-none
                  ${errors.email ? "border-red-500" : "border-[#ced4da]"}`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-[#374151]">
                Password*
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full rounded-md border px-3 py-2 text-[#1f2937] placeholder-[#adaebc]
                  focus:border-[#4f46e5] focus:outline-none
                  ${errors.password ? "border-red-500" : "border-[#ced4da]"}`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-[#374151]">
                Confirm Password*
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                placeholder="Confirm your password"
                value={formData.password_confirmation}
                onChange={handleChange}
                className={`w-full rounded-md border px-3 py-2 text-[#1f2937] placeholder-[#adaebc]
                  focus:border-[#4f46e5] focus:outline-none
                  ${errors.password_confirmation ? "border-red-500" : "border-[#ced4da]"}`}
              />
              {errors.password_confirmation && (
                <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
              )}
            </div>
            {errors.terms && <p className="mt-1 text-sm text-red-600">{errors.terms}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer mt-2 w-full rounded-md bg-[#2563eb] py-2.5 text-center font-medium text-white
                hover:bg-[#2563eb]/90 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/50
                disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        )}

        {/* Already have account & social */}
        {!success && (
          <>
            <div className="mt-6 text-center text-sm text-[#6b7280]">
              Already have an account?{" "}
              <a href="/login" className="font-medium text-[#4f46e5] hover:underline">
                Log in
              </a>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e5e7eb]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-[#6b7280]">Or sign up with</span>
                </div>
              </div>

              <div className="mt-6 flex justify-center w-full">
              <a
                href="http://localhost:8000/auth/google/redirect"
                type="button"
                className="flex w-full items-center justify-center rounded-md border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#1f2937] hover:bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2"
              >
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
          </>
        )}
      </div>
    </div>
  )
}

