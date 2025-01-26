"use client";
import axios from "axios";
import { set } from "mongoose";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
    } catch (error: any) {
      setError(true);
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    console.log("Extracted Token:", urlToken); // Debugging
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Verify Email</h1>
        <h2 className="text-lg text-gray-600 mb-6">
          {token ? `${token}` : "No token"}
        </h2>

        {verified && (
          <div className="bg-green-100 p-4 rounded-lg mb-4">
            <h3 className="text-green-800 font-semibold mb-2">
              Email verified successfully
            </h3>
            <Link
              href="/login"
              className="text-blue-500 hover:underline text-sm font-medium"
            >
              Login
            </Link>
          </div>
        )}

        {error && (
          <div className="bg-red-100 p-4 rounded-lg">
            <h3 className="text-red-800 font-semibold">Error</h3>
          </div>
        )}
      </div>
    </div>
  );
}
