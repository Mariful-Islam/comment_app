"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { withAuth } from "@/hoc/withAuth";
import { auth, facebookProvider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Layout from "@/layout/Layout";
import { useUser } from "@/contexts/UserContext";
import {
  getSession,
  signIn,
  useSession,
  signOut as NextSignOut,
} from "next-auth/react";
import Token from "@/components/Token";
import FacebookToken from "@/components/FacebookToken";
import FacebookInfo from "@/components/FacebookInfo";
import { useFacebookLogin } from "@/hooks/useFacebookLogin";


type UserType = {
  name: string;
  email: string;
  imageUrl?: string;
};

function Home() {
  const router = useRouter();
  const { user, loading, fetchUser } = useUser();
  const {login} = useFacebookLogin()

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    await signOut(auth);
    router.refresh();
    router.replace("/login");
  };

  const handleLogin = async () => {
    const auth = await login();
    if (auth) {
      console.log("Access token:", auth.accessToken);
      // send to backend API
    }
  };

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto mt-4">
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="animate-pulse flex flex-col gap-2 ">
              <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-32 bg-gray-300 rounded"></div>
              <div className="h-4 w-48 bg-gray-300 rounded"></div>
            </div>
          ) : user ? (
            <div className="flex flex-col gap-2 border border-gray-200 p-4 rounded-lg shadow-lg">
              <h1 className="text-lg font-bold">Dashboard</h1>

              <div className="flex items-center gap-4">
                <div>
                  <div className=" text-base text-gray-500">
                    Hey ! {user.name}. Welcome...
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>No user data available.</p>
          )}
        </div>

        {/* <div className="flex flex-col sm:flex-row gap-6 ">
          <div className="w-full sm:w-1/2">
            <Token />
          </div>
          <div className="w-full sm:w-1/2">
            
          </div>
        </div> */}

        <div className="flex flex-col sm:flex-row gap-6 ">
          <div className="w-full mt-8">
            <FacebookInfo />
          </div>
          {/* <div className="w-full sm:w-1/2">
            <FacebookToken />
          </div> */}
        </div>


        <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 mt-8">
          Logout
        </Button>


      </div>
    </Layout>
  );
}

export default withAuth(Home);
