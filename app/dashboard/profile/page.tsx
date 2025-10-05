"use client";
import { useUser } from "@/contexts/UserContext";
import Layout from "@/layout/Layout";
import Image from "next/image";
import React from "react";
import { MdEmail } from "react-icons/md";

function Profile() {
  const { user, loading } = useUser();
  return (
    <Layout>
      <div className="mt-5 border border-gray-200 rounded-xl shadow-sm p-6 mx-6 flex flex-col items-start transition hover:shadow-md">
        {loading ? (
          // skeleton build with tailwindcss
          <div className="w-full animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
          </div>
        ) : user ? (
          <>
            <h1 className="text-xl font-bold mb-4">Profile</h1>
            <div>
              <img
                src={user.imageUrl || "https://via.placeholder.com/150"}
                alt="Profile Picture"
                className="w-24 h-24 rounded-full mb-4 object-cover"
              />
            </div>
            <div className="text-base font-medium mb-2 ">
              {user.name || "N/A"}
            </div>
            <div className="text-[14px] mb-2 text-gray-500">
              {user.email || "N/A"}
            </div>
            <div className="text-[14px] mb-2 text-gray-500">
              <span className="font-medium text-gray-700">Joined:</span>{" "}
              {new Date(user.createdAt).toLocaleDateString() || "N/A"}
            </div>
          </>
        ) : (
          <div>No user data available.</div>
        )}
      </div>

      <div className="mt-5 border border-gray-200 rounded-xl shadow-sm p-6 mx-6 flex flex-col items-start transition hover:shadow-md">
        <h1 className="text-xl font-bold mb-4">Connected Account</h1>
        <div className="text-base font-medium mb-2 flex items-center gap-8">
          {user?.authProvider
            ? user.authProvider === "google" && (
                  <Image
                    src={require("@/assets/google-logo.png")}
                    alt=""
                    className="h-10 w-10 object-cover"
                    
                  />
            ) : user?.authProvider === "facebook" ? (

                  <Image
                    src={require("@/assets/facebook.png")}
                    alt=""
                    className="h-10 w-10 object-cover"
                  />
            ) : user?.authProvider === "email" ? (
                <>
                  <MdEmail className="h-10 w-10" />
                </>
              )
            : "N/A"}
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
