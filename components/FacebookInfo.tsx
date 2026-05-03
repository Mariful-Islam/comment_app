import { signIn, signOut as NextSignOut } from "next-auth/react";
import React, { use, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";
import { useFacebook } from "@/contexts/FacebookContext";
import { Spinner } from "./ui/shadcn-io/spinner";
import { useUser } from "@/contexts/UserContext";
import { RefreshCw } from "lucide-react";
import Link from "next/link";

function FacebookInfo() {
  const router = useRouter();
  const { user, token, setUser, setToken } = useFacebook();
  const [isStartingAutomation, setIsStartingAutomation] = React.useState(false);
  const { user: newUser, fetchUser } = useUser();
  const now = new Date();

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
          // id: ,
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
      process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID!,
    );
    fbAuthUrl.searchParams.set(
      "redirect_uri",
      process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI!,
    );
    fbAuthUrl.searchParams.set(
      "scope",
      "pages_show_list,pages_read_engagement,pages_manage_posts,public_profile,email,business_management,pages_manage_metadata,pages_read_user_content,pages_manage_ads,pages_manage_engagement",
    );
    fbAuthUrl.searchParams.set("response_type", "code");

    try {
      window.location.href = fbAuthUrl.toString();
    } catch (error) {
      console.error("Error redirecting to Facebook OAuth:", error);
    }
  };

  const handleFacebookDisconnect = async () => {
    await fetch("/api/auth/facebook/token", {
      method: "DELETE",
      cache: "no-cache",
    });

    setUser(null);
    setToken(null);

    toast.success("Disconnected from Facebook successfully!");

    router.refresh();
  };

  const startAutomationHandler = () => {
    setIsStartingAutomation(!isStartingAutomation);
  };

  console.log(newUser?.isFreeTrial?.facebook?.endDate, new Date());

  const [loading, setLoading] = useState(false);

  return (
    <div>
      {user && token ? (
        <div className="">
          <div className="flex justify-between">
            <h1 className="text-lg font-semibold">Facebook</h1>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                fetchUser();
              }}
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>

          <div className="my-4 text-base">
            <div>
              <img
                src={user?.picture?.data?.url}
                alt=""
                className="h-16 w-16 rounded-full"
              />
            </div>

            <div className="flex gap-4 mt-4">
              {/* <div className="text-gray-500 ">Name</div> */}
              <div>{user?.name}</div>
            </div>
            <div className="flex gap-4 mt-2">
              {/* <div className="text-gray-500 ">Email</div> */}
              <div>{user?.email}</div>
            </div>

            <div className="mt-8">
              <div>
                {(() => {
                  const now = new Date();

                  // 1. Get all 'running' subscriptions and sort them by endDate
                  // This ensures we look at the one expiring soonest first
                  const allRunningSubs =
                    newUser?.subscriptions?.facebook
                      ?.filter((sub) => sub.status === "running")
                      ?.sort(
                        (a, b) => +new Date(a.endDate) - +new Date(b.endDate),
                      ) || [];

                  // 2. Find the subscription that is CURRENTLY active (now is before endDate)
                  const activeSub = allRunningSubs.find(
                    (sub) => new Date(sub.endDate) > now,
                  );

                  console.log("Active Subscription:", activeSub);

                  if (activeSub) {
                    const endDate = new Date(activeSub.endDate);
                    const diffTime = +endDate - +now;
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24),
                    );
                    const isExpiringSoon = diffDays <= 5 && diffDays > 0;

                    // Check if there is another package waiting in the queue
                    const hasQueuedPackage = allRunningSubs.length > 1;

                    return (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">
                          <p>
                            Page Name:{" "}
                            <span className="font-bold">
                              {activeSub.page?.name}
                            </span>
                          </p>
                          <p>
                            Status:{" "}
                            <span className="text-green-500">Active</span>
                          </p>
                          <p>
                            Subscription Type:{" "}
                            <span className="text-blue-500">Paid</span>
                          </p>
                          <p>
                            Days Remaining:{" "}
                            <span className="text-blue-500">{diffDays}</span>
                          </p>
                        </div>

                        {/* If a second package exists, show a "Queued" badge */}
                        {hasQueuedPackage && (
                          <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded inline-block">
                            Next package queued automatically
                          </div>
                        )}

                        {/* Warning Message - Only show if NO queued package exists */}
                        {isExpiringSoon && !hasQueuedPackage && (
                          <div className="mt-3 p-3 bg-orange-50 border-l-4 border-orange-400 text-orange-700 text-sm">
                            <p className="font-bold">
                              Subscription Expiring Soon!
                            </p>
                            <p>
                              Your plan ends in {diffDays} days. Renew now to
                              stay active.
                            </p>
                            <Button
                              size="sm"
                              className="mt-2 bg-orange-500 hover:bg-orange-600 text-white"
                            >
                              Renew Now
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  }

                  // 3. Fallback to Free Trial (Only if no Paid Sub is active)
                  const trial = newUser?.isFreeTrial?.facebook;
                  if (trial?.endDate && new Date(trial.endDate) > now) {
                    const trialEndDate = new Date(trial.endDate);
                    const trialDiffDays = Math.ceil(
                      (+trialEndDate - +now) / (1000 * 60 * 60 * 24),
                    );

                    return (
                      <div className="space-y-2">
                        <span className="text-sm font-medium">
                          {trial.page?.name || "Facebook Page"} —
                          <span className="text-blue-500"> Free Trial</span>
                          <span className="text-xs text-gray-400 ml-1">
                            (Ends {trialEndDate.toLocaleDateString()})
                          </span>
                        </span>

                        {trialDiffDays <= 3 && (
                          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded">
                            Your trial ends in {trialDiffDays} days.{" "}
                            <b>Upgrade now</b>!
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <span className="text-sm text-gray-400">
                      No active plan <br/>
                      <Link href="/dashboard/package" className="text-blue-500 underline hover:no-underline" >Subscribe</Link>

                    </span>
                  );
                })()}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <Button
              onClick={handleFacebookDisconnect}
              className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
            >
              Disconnect Facebook
            </Button>
          </div>
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
