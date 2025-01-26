"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      console.log("User payload:", user);
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup success", response.data);
      toast.success("Signup successful!");
      router.push("/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Signup failed", error.response?.data || error.message);
        toast.error(
          error.response?.data?.error || "Signup failed. Please try again."
        );
      } else if (error instanceof Error) {
        console.error("Signup failed", error.message);
        toast.error(error.message);
      } else {
        console.error("Signup failed", "An unknown error occurred");
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.email.trim().length > 0 &&
      user.password.trim().length > 0 &&
      user.username.trim().length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {loading ? "Loading..." : "Sign Up"}
        </h1>
        <hr className="mb-4" />
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="Enter your username"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 text-black"
          />
        </div>
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
          onClick={onSignup}
          className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-300"
          disabled={buttonDisabled}
        >
          {buttonDisabled ? "Please fill all fields" : "Sign Up"}
        </button>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
