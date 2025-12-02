
import { signIn, signOut as NextSignOut } from "next-auth/react";
import React, { use, useEffect } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";
import { useFacebook } from "@/contexts/FacebookContext";

function FacebookInfo() {
  const router = useRouter();
  const { user, token, setUser, setToken } = useFacebook();

  useEffect(() => {
    if (user && token) {
      localStorage.setItem("facebookAccessToken", token);

      fetch(`/api/facebook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: localStorage.getItem("email"),
          name: user.name,
          email: user.email,
          image: user.picture?.data?.url,
          expires: 1800,
          accessToken: token,
        }),
      })
        .then((res) => {
          const data: any = res.json();
          toast.success("Connected with your facebook account !");
        })
        .catch(() => toast.error("Failed to save data !"));
    }
  }, [user && token]);


  const handleFacebookLogin = async () => {
    const fbAuthUrl = new URL("https://www.facebook.com/v23.0/dialog/oauth");

    fbAuthUrl.searchParams.set(
      "client_id",
      process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID!
    );
    fbAuthUrl.searchParams.set(
      "redirect_uri",
      process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI!
    );
    fbAuthUrl.searchParams.set(
      "scope",
      "pages_show_list,pages_read_engagement,pages_manage_posts,public_profile,email,business_management,pages_manage_metadata,pages_read_user_content,pages_manage_ads"
    );
    fbAuthUrl.searchParams.set("response_type", "code");

  


    try {
      window.location.href = fbAuthUrl.toString();

    } catch (error) {
      console.error("Error redirecting to Facebook OAuth:", error);
      toast.error("Failed to initiate Facebook login. Please try again.");
    }
  };

  const handleFacebookDisconnect = async () => {
    await fetch("/api/auth/facebook/token", {
      method: "DELETE",
      cache: "no-cache",
    });

    setUser(null)
    setToken(null)

    toast.success("Disconnected from Facebook successfully!");
    
    router.refresh();
  };

  return (
    <div>
      {(user && token) ? (
        <div className="border border-gray-200 p-4 rounded-lg shadow-md">
          <h1 className="text-lg font-semibold">Facebook Info</h1>

          <div className="my-4 text-base">
            <div>
              <img
                src={user?.picture?.data?.url}
                alt=""
                className="h-16 w-16 rounded-full"
              />
            </div>

            <div className="flex justify-between mt-4">
              <div className="text-gray-500 ">Name</div>
              <div>{user?.name}</div>
            </div>
            <div className="flex justify-between mt-2">
              <div className="text-gray-500 ">Email</div>
              <div>{user?.email}</div>
            </div>
          </div>
          <Button
            onClick={handleFacebookDisconnect}
            className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
          >
            Disconnect Facebook
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleFacebookLogin}
          variant={"outline"}
          className="bg-green-100 text-green-500 hover:bg-green-500 hover:text-white"
        >
          Connect Facebook{" "}
        </Button>
      )}
    </div>
  );
}

export default FacebookInfo;
