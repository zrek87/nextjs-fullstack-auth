"use client";

import React from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function UserProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [data, setData] = React.useState<string>("nothing");

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error(error.message);
      } else {
        console.error("An unknown error occurred");
        toast.error("An unknown error occurred");
      }
    }
  };

  const getUserDetails = async () => {
    try {
      const res = await axios.get("/api/users/me");
      console.log(res.data);
      setData(res.data.data._id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error(error.message);
      } else {
        console.error("An unknown error occurred");
        toast.error("An unknown error occurred");
      }
    }
  };

  const resolveParams = async () => {
    const resolvedParams = await params; // Await the `params` Promise
    console.log(resolvedParams.id); // Use the `id` from params
    return resolvedParams.id;
  };

  React.useEffect(() => {
    resolveParams();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          User Profile
        </h1>

        {/* Conditional Link Rendering */}
        <h2 className="text-lg text-gray-700 mb-6 text-center">
          {data === "nothing" ? (
            "Nothing to show"
          ) : (
            <Link
              href={`/profile/${data}`}
              className="text-blue-500 hover:text-blue-600 underline transition duration-300"
            >
              View Profile: {data}
            </Link>
          )}
        </h2>

        <p className="text-gray-600 mb-8 text-center">
          Here is the user profile
        </p>
        <hr className="mb-8 border-gray-200" />

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mb-4"
        >
          Logout
        </button>

        {/* Get User Details Button */}
        <button
          onClick={getUserDetails}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Get User Details
        </button>
      </div>
    </div>
  );
}
