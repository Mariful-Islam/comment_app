"use client";

import { signIn, useSession, signOut as NextSignOut } from "next-auth/react";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function FacebookInfo() {
  const router = useRouter();
  const { data: session }: any = useSession();

  useEffect(() => {
    if (session) {
      console.log("User session after Facebook login:", session);

      localStorage.setItem("facebookAccessToken", session?.accessToken);

      fetch(`/api/facebook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: localStorage.getItem('email'),
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          expires: session.expires,
          accessToken: session?.accessToken,
        }),
      })
        .then((res) => {
          const data: any = res.json();
          toast.success('Connected with your facebook account !');
        })
        .catch(() => toast.error("Failed to save data !"));
    }
  }, [session]);

  const handleFacebookLogin = async () => {
    try {
      const result: any = await signIn("facebook");

      if (session) {
        localStorage.setItem("facebookAccessToken", session?.accessToken);

        const res = await fetch(`/api/facebook`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: localStorage.getItem("email"),
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            expires: session.expires,
            accessToken: session?.accessToken,
          }),
        });

        const data = await res.json();
        toast.success(data?.message);
      }
    } catch (error) {
      console.error("Facebook login error:", error);
      toast.error("Failed to sign in with Facebook. Please try again.");
    }
  };

  const handleFacebookDisconnect = async () => {
    await NextSignOut();
    localStorage.removeItem("facebookAccessToken");
    router.refresh();
  };

  return (
    <div>
      {session ? (
        <div className="border border-gray-200 p-4 rounded-lg shadow-md">
          <h1 className="text-lg font-semibold">Facebook Info</h1>

          <div className="my-4 text-base">
            <div>
              <img
                src={session?.user?.image}
                alt=""
                className="h-16 w-16 rounded-full"
              />
            </div>

            <div className="flex justify-between mt-4">
              <div className="text-gray-500 ">Name</div>
              <div>{session?.user?.name}</div>
            </div>
            <div className="flex justify-between mt-2">
              <div className="text-gray-500 ">Email</div>
              <div>{session?.user?.email}</div>
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
