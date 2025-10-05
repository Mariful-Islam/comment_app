"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { withAuth } from "@/hoc/withAuth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Layout from "@/layout/Layout";
import { useUser } from "@/contexts/UserContext";

type UserType = {
  name: string;
  email: string;
  imageUrl?: string;
};

function Home() {
  const router = useRouter();
  const { user, loading } = useUser();
  



  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    await signOut(auth);
    router.refresh();
    router.replace("/login");
  };

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        {loading ? (
          
          <div className="animate-pulse flex flex-col gap-2 ">
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div className="h-6 w-32 bg-gray-300 rounded"></div>
            <div className="h-4 w-48 bg-gray-300 rounded"></div>
          </div>

          
        ) : user ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">

              <div >
                <div className=" text-lg">Hey ! {user.name}. Welcome...</div>
    
              </div>
            </div>

          </div>
        ) : (
          <p>No user data available.</p>
        )}
      </div>  
    </Layout>
  );
}

export default withAuth(Home);
