import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useInstagramLogin } from "@/hooks/useInstagramLogin";
import { useInstagram } from "@/contexts/InstagramContext";
import { signIn, signOut, useSession } from "next-auth/react";
import { getCookie } from "@/lib/utils";
import { Spinner } from "./ui/shadcn-io/spinner";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

function InstagramInfo() {
  const router = useRouter()
  const { login } = useInstagramLogin();
  const [isFreeTrialInstagram, setIsFreeTrialInstagram] = useState<boolean>(false)

  const handleInstagramLogin = () => {
    signIn("instagram");
  };

  const { user: instaUser, token, isSubscribed, checkSubscription, isLoading } = useInstagram();
  const { user } = useUser();


  const handleInstaDisconnect = () => {
    console.log("disconnect....");
    signOut();
  };

  const loginWithInstagram = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const loginUrl =
      `https://www.facebook.com/v19.0/dialog/oauth` +
      `?client_id=${process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(
        process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI || ""
      )}` +
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
        "instagram_business_manage_insights",
      ].join(","),
    });

    window.location.href = `https://api.instagram.com/oauth/authorize?${params}`;
  };



  const stopAutomation = async (e?:any) => {
    e.preventDefault()
    // e.stopPropagation()

    try {
      const res = await fetch(`/api/instagram/free-trial`, {method: "DELETE"})
      const data = await res.json()
      checkSubscription()

    } catch {
      throw Error("Stop Automation Failed !")
    }

  }

  const startAutomation = async (e:any) => {
    e.preventDefault()
    // e.stopPropagation()
    
    try {
      const res = await fetch(`/api/instagram/free-trial`, {method: "POST"})
      const data = await res.json()

      checkSubscription()

    } catch {
      throw new Error("Stop Automation Failed !")
    }

  }

  // const isFreeTrialInstagram = user?.isFreeTrial?.instagram?.startDate !== user?.isFreeTrial?.instagram?.endDate

  const checkFreeTrial = async () => {
    const res = await fetch(`/api/user?email=${user?.email}`)
    const data = await res.json()

    const startDate = data?.isFreeTrial?.instagram?.startDate
    const endDate = data?.isFreeTrial?.instagram?.endDate

    if(!startDate && !endDate){
      setIsFreeTrialInstagram(true)
    }

    if(new Date(endDate) <= new Date()){
      setIsFreeTrialInstagram(false)
      stopAutomation()
    }else{
      setIsFreeTrialInstagram(true)
    }
  }


  useEffect(()=>{
    checkFreeTrial()
  }, [router, user])


  return (
    <div>
      {instaUser ? (
        <div className="">
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
              <div>{instaUser?.username}</div>
            </div>

            <div className="text-sm text-gray-700 mt-4">**Free Trial for 7 days </div>

            <div className="mt-4">
              { isFreeTrialInstagram ?
                  isSubscribed ? (
                    <Button onClick={stopAutomation} variant={`destructive`}>{!isLoading ? "Stop Automation" : <Spinner variant={`circle`}/>  }</Button>
                  ) : (
                    <Button onClick={startAutomation} variant={`outline`} >{!isLoading ? "Start Automation" : <Spinner variant={`circle`}/>  }</Button>
                  )
                : (
                  <div className="text-sm text-red-400 ">
                    Your free trial is expired please choose a plan... <Link href={`/dashboard/package`} className="text-red-500 underline hover:no-underline">plan</Link>
                  </div>
              )
              }
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <Button
              onClick={handleInstaDisconnect}
              className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
            >
              Disconnect Instagram
            </Button>


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
