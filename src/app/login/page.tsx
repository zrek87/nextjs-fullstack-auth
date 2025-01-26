"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true); // Add this state

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      toast.success("Login success");
      router.push("/profile");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Login failed", error.message);
        toast.error(error.message);
      } else {
        console.log("Login failed", "An unknown error occurred");
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Enable/disable the login button based on input fields
    const isFormValid = user.email.length > 0 && user.password.length > 0;
    setButtonDisabled(!isFormValid); // Update buttonDisabled state
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h1>
        <hr className="mb-4" />
        <div className="mb-4"></div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 text-black"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter your password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 text-black"
          />
        </div>
        <button
          onClick={onLogin}
          disabled={buttonDisabled || loading} // Disable button if form is invalid or loading
          className={`w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-300 ${
            buttonDisabled || loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-indigo-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
