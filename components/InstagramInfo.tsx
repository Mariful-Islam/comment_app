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
import { RefreshCw } from "lucide-react";

function InstagramInfo() {
  const router = useRouter()
  const { login } = useInstagramLogin();
  const [isFreeTrialInstagram, setIsFreeTrialInstagram] = useState<boolean>(false)

  const handleInstagramLogin = () => {
    signIn("instagram");
  };

  const { user: instaUser, token, isSubscribed, checkSubscription, isLoading } = useInstagram();
  const { user, fetchUser } = useUser();


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
    e?.preventDefault()
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
    e?.preventDefault()
    
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

  const [loading, setLoading] = useState(false)

  return (
    <div>
      {instaUser ? (
        <div className="">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Instagram</h1>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                fetchUser()
              }}
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              
            </Button>
            
          </div>

          <div className="flex gap-3 items-center mt-6">
              <div className="h-16 w-16 rounded-full bg-gray-500 "></div>
              <div> {instaUser.username}</div>
          </div>

          <div className="mt-4">
            {isFreeTrialInstagram ? (
              /* --- SCENARIO 1: FREE TRIAL IS AVAILABLE --- */
              <div className="space-y-2">
                <p className="text-xs text-blue-600 font-medium italic">Free Trial Active</p>
                {isSubscribed ? (
                  <Button onClick={stopAutomation} variant="destructive" disabled={isLoading}>
                    {!isLoading ? "Stop Free Automation" : <Spinner variant="circle" />}
                  </Button>
                ) : (
                  <Button onClick={startAutomation} variant="outline" disabled={isLoading}>
                    {!isLoading ? "Start Free Automation" : <Spinner variant="circle" />}
                  </Button>
                )}
              </div>
            ) : (
              /* --- SCENARIO 2: FREE TRIAL EXPIRED -> CHECK PAID SUBSCRIPTIONS --- */
              <>
                {/* Look for a running Instagram subscription */}
                {user?.subscriptions?.instagram?.some((sub) => sub.status === "running") ? (
                  <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                    <div className="text-sm text-green-600 font-bold">
                      <span className="text-gray-700 font-normal">Active Plan:</span>{" "}
                      {user.subscriptions.instagram.find((s) => s.status === "running")?.user.username}
                    </div>
                    <p className="text-xs text-green-500 mt-1">Automation is running via your paid plan.</p>
                  </div>
                ) : (
                  /* --- SCENARIO 3: NO TRIAL & NO SUBSCRIPTION --- */
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-sm text-red-500 font-medium">
                      Your free trial has expired and no active plan was found.
                    </p>
                    <Link 
                      href="/dashboard/package" 
                      className="text-sm text-red-600 font-bold underline hover:no-underline mt-2 inline-block"
                    >
                      View Pricing Plans →
                    </Link>
                  </div>
                )}
              </>
            )}
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
