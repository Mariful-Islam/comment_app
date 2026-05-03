"use client";
import { useFacebook } from "@/contexts/FacebookContext";
import { useInstagram } from "@/contexts/InstagramContext";
import { useUser } from "@/contexts/UserContext";
import { withAuth } from "@/hoc/withAuth";
import Layout from "@/layout/Layout";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsInstagram } from "react-icons/bs";
import { FaFacebook, FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

function Profile() {
  const { user, loading } = useUser();
  const { user: fbUser, token: fbToken } = useFacebook()
  const { user: instaUser } = useInstagram();
  
  return (
    <Layout>
      <div className="mt-5 border border-gray-200 rounded-xl shadow-sm p-6 mx-0 sm:mx-6 flex flex-col items-start transition hover:shadow-md">
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
              {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Profile Picture"
                className="w-24 h-24 rounded-full mb-4 object-cover"
                width={96}
                height={96}
                
                
              />) : (
                <div className="w-24 h-24 rounded-full mb-4 bg-gray-200 flex items-center justify-center">
                  <FaUser className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="text-base font-medium mb-2 ">
              {user.name || "N/A"}
            </div>
            <div className="text-[14px] mb-2 text-gray-500">
              {user.email || "N/A"}
            </div>
            <div className="text-[14px] mb-2 text-gray-500">
              <span className="font-medium text-gray-700">Joined:</span>{" "}
              {moment(user.createdAt).format('DD-MM-YYYY') || "N/A"}
            </div>
          </>
        ) : (
          <div>No user data available.</div>
        )}
      </div>

      <div className="mt-5 border border-gray-200 rounded-xl shadow-sm p-6 mx-0 sm:mx-6 flex flex-col items-start transition hover:shadow-md">
        <h1 className="text-xl font-bold mb-4">Connected Account</h1>
        <div className="text-base font-medium mb-2 flex items-center gap-8">
          {user?.authProvider === "google" ? (
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
              <MdEmail className="h-8 w-8" />
            </>
          ) : (
            "N/A"
          )}

          {fbUser && fbToken && (
            <FaFacebook />
          )}

          {instaUser && (
            <Link href={`https://www.instagram.com/${instaUser?.username}/`} target="_blank" className="text-sm">
              <BsInstagram className="h-7 w-7" />
            </Link>
          )}
          
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(Profile);
