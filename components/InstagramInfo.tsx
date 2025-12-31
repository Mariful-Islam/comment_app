import React from "react";
import { Button } from "./ui/button";
import { useInstagramLogin } from "@/hooks/useInstagramLogin";
import { useInstagram } from "@/contexts/InstagramContext";
import { signIn, signOut, useSession } from "next-auth/react";
import { getCookie } from "@/lib/utils";

function InstagramInfo() {
  const { login } = useInstagramLogin();

  const handleInstagramLogin = () => {
    signIn("instagram");
  };

  const { user, token } = useInstagram();

  const { data: session } = useSession();

  const handleInstaDisconnect = () => {
    console.log("disconnect....");
    signOut();
  };

  const instaToken = getCookie("insta_token");

  const { user: instaUser } = useInstagram();

  const loginWithInstagram = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    // const loginUrl = `https://api.instagram.com/oauth/authorize
    //                   ?client_id=${process.env.NEXT_PUBLIC_INSTA_CLIENT_ID},
    //                   &redirect_uri=${process.env.NEXT_PUBLIC_INSTA_CLIENT_SECRET},
    //                   &response_type=code,
    //                   &scope=pages_show_list,instagram_manage_insights,instagram_manage_comments,instagram_content_publish,instagram_basic,instagram_manage_messages,instagram_manage_relationships`;

    const loginUrl = `https://www.facebook.com/v19.0/dialog/oauth` +
  `?client_id=${process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI || "")}` +
  `&response_type=code` +
  `&scope=instagram_basic,instagram_manage_messages,instagram_manage_comments,instagram_content_publish,pages_show_list`;

    window.open(
      loginUrl,
      "InstagramLogin",
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };


  const loginWithInsta = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_INSTA_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI!,
      response_type: "code",
      scope: [
        "instagram_business_basic",
        "instagram_business_manage_messages",
        "instagram_business_manage_comments",
        "instagram_business_content_publish",
        "instagram_business_manage_insights"
      ].join(","),
    });

    window.location.href = `https://api.instagram.com/oauth/authorize?${params}`;
  };

  return (
    <div>
      <Button onClick={loginWithInsta}>Insta</Button>
      {user ? (
        <div className="border border-gray-200 p-4 rounded-lg shadow-md">
          <h1 className="text-lg font-semibold">Instagram Info</h1>

          <div className="my-4 text-base">
            <div>
              {/* <img
                src={user?.picture?.data?.url}
                alt=""
                className="h-16 w-16 rounded-full"
              /> */}
            </div>

            <div className="flex gap-4 mt-4">
              {/* <div className="text-gray-500 ">Name</div> */}
              <div>{user?.username}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <Button
              onClick={handleInstaDisconnect}
              className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
            >
              Disconnect Instagram
            </Button>

            {/* <Button
              onClick={startAutomationHandler}
              className="bg-green-500 hover:bg-green-700 text-white"
            >
              {isStartingAutomation ? (
                <div className="flex gap-3 items-center">
                  <div>Running</div>
                  <Spinner />
                </div>
              ) : (
                "Start Automation"
              )}
            </Button> */}
          </div>
        </div>
      ) : (
        <Button
          onClick={handleInstagramLogin}
          variant={"outline"}
          className="bg-pink-100 text-pink-500 hover:bg-pink-500 hover:text-white"
        >
          Connect Instagram{" "}
        </Button>
      )}
    </div>
  );
}

export default InstagramInfo;
