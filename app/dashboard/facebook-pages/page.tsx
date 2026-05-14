"use client";
import Layout from "@/layout/Layout";
import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useFacebook } from "@/contexts/FacebookContext";
import { toast } from "sonner";
import { withAuth } from "@/hoc/withAuth";

function Pages() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewButtonClicked, setViewButtonClicked] = useState<any>(null);
  const [subscribedButtonClicked, setSubscribedButtonClicked] =
    useState<any>(null);

  const [subscribedStatus, setSubscribedStatus] = useState<
    Record<string, boolean>
  >({});

  const router = useRouter();

  const { user, token } = useFacebook();
  const [message, setMessage] = useState<any>(null);

  const getPages = async () => {
    setLoading(true);
    try {
      if (!token) throw new Error("Facebook access token is not configured.");

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await fetch(
        `https://graph.facebook.com/v23.0/me/accounts?access_token=${encodeURIComponent(
          token
        )}`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);

      if (!res.ok) {
        const body = await res.text();
        console.error("Failed to fetch Facebook pages:", res.status, body);
        setPages([]);
        setLoading(false);
        return [];
      }

      const json = await res.json();
      const pagesData = Array.isArray(json?.data) ? json.data : [];
      setPages(pagesData);
      setLoading(false);
      return pagesData;
    } catch (err) {
      if ((err as any)?.name === "AbortError") {
        console.warn("Facebook pages request aborted (timeout).");
      } else {
        console.error("Error fetching Facebook pages:", err);
      }
      setPages([]);
      setLoading(false);
      return [];
    }
  };

  // ✅ Function to check subscription status
  const isSubscribedPages = async (accessToken: string): Promise<boolean> => {
    if (!accessToken) {
      console.error("Facebook access token missing.");
      return false;
    }

    try {
      const response = await fetch(
        `https://graph.facebook.com/v23.0/me/subscribed_apps?access_token=${accessToken}`
      );
      const data = await response.json();

      const subscribed =
        data?.data[0]?.subscribed_fields?.includes("feed") ?? false;

      return subscribed;
    } catch (error) {
      console.error("Error checking subscribed apps:", error);
      return false;
    }
  };

  // ✅ Load subscription status for all pages
  useEffect(() => {
    const checkAll = async () => {
      const results: Record<string, boolean> = {};
      for (const page of pages) {
        const result = await isSubscribedPages(page?.access_token);
        results[page.id] = result;
      }
      setSubscribedStatus(results);
    };
    if (pages?.length) checkAll();
  }, [pages]);

  useEffect(() => {
    getPages();
  }, [token, router]);

  const addFeedSubscription = async (page: any) => {
    try {
      const checkTrialPageRes = await fetch(`/api/facebook/free-trial-page?page_id=${page?.id}`);
      const checkTrialPageData = await checkTrialPageRes.json();

      const activeScriptionsRes = await fetch(`/api/facebook/subscriptions`);
      const activeSubscriptionsData = await activeScriptionsRes.json();


      console.log("Check trial page data:", typeof page.id, activeSubscriptionsData);

      // Check if the current page has an active subscription
      const ac = activeSubscriptionsData?.subscriptions?.find((sub:any) => ((sub?.page?.id.toString() === page?.id) && (sub?.status === "running") && (sub?.isPaid === true)));

      console.log("Active subscription for this page:", ac);



      if (checkTrialPageData?.freeTrialFacebook?.status === "expired" && ac === false) {
        toast.error("Free trial is expired!");
      } 

      if(checkTrialPageData?.freeTrialFacebook?.status === "  " && ac === false){
        toast.error("No subscription found for this page !")
      }


      if(checkTrialPageData?.freeTrialFacebook?.status === "assigned" && ac === false){
        toast.error("Already assigned a page for free trial !")  
      }


      if(checkTrialPageData?.freeTrialFacebook?.status === "running" && ac === false){
        toast.error("Free trial is already running for this page !")  
      }



        
      if ((checkTrialPageData?.freeTrialFacebook?.status === "running" && checkTrialPageData?.freeTrialFacebook?.page?.id === page.id) || (ac?.page?.id.toString() === page?.id)) {

        console.log(",,,,,,,,,,,,,,,,,,,,,,,")


        const response = await fetch(
          `https://graph.facebook.com/v23.0/me/subscribed_apps`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              access_token: page?.access_token,
              subscribed_fields: ["feed"],
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          // Successfully subscribed
          // Update the subscribed status
          setSubscribedStatus((prev) => ({
            ...prev,
            [data.id]: false, // Now it's subscribed
          }));
          setSubscribedButtonClicked(null);
          getPages();
        }

      }

      
      
      if(checkTrialPageData?.freeTrialFacebook?.status === "pending"){
        const response = await fetch(
          `https://graph.facebook.com/v23.0/me/subscribed_apps`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              access_token: page?.access_token,
              subscribed_fields: ["feed"],
            }),
          }
        );

        const data = await response.json();

        const freeTrialPageRes = await fetch(`/api/facebook/free-trial-page`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pageId: page?.id,
            pageName: page?.name,
          }),
        });

        if (response.ok && freeTrialPageRes.ok) {
          // Successfully subscribed
          // Update the subscribed status
          setSubscribedStatus((prev) => ({
            ...prev,
            [data.id]: false, // Now it's subscribed
          }));
          setSubscribedButtonClicked(null);
          getPages();
        } else {
          // Handle errors
          console.error("Error subscribing to page feed:", data);
          setSubscribedButtonClicked(null);
        }
      }
    } catch (error) {
      console.error("Error subscribing to page feed:", error);
      setSubscribedButtonClicked(null);
    } finally {
      setSubscribedButtonClicked(null);
      setViewButtonClicked(null);
    }
  };

  const removeFeedSubscription = async (page: any) => {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v23.0/me/subscribed_apps`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: page?.access_token,
            subscribed_fields: ["feed"],
          }),
        }
      );

      const data = await response.json();



      if (response.ok) {
        getPages();
        setSubscribedStatus((prev) => ({
          ...prev,
          [data.id]: true, // Now it's unsubscribed
        }));
        setSubscribedButtonClicked(null);
      } else {
        // Handle errors
        console.error("Error unsubscribing from page feed:", data);
      }
    } catch (error) {
      console.error("Error unsubscribing from page feed:", error);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);

  return (
    <Layout>
      <div className="max-w-300 mx-auto mt-5">
        <h1 className="text-xl font-bold mb-4">Facebook Pages</h1>

        {loading ? (
          <div className="flex justify-center w-full mt-10">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
            {pages?.map((page, index) => (
              <div
                key={page.id}
                className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-400 rounded-xl shadow-sm p-6 flex flex-col items-start transition hover:shadow-md w-full"
              >
                <div className="flex justify-center items-center gap-2 mb-6">
                  <Image
                    src={require("@/assets/Untitled-design--32-.png")}
                    alt="Facebook Logo"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="font-medium">
                    {page.name}{" "}
                    {subscribedStatus[page.id] && (
                      <Badge className="bg-green-600 text-white ml-2">Subscribed</Badge>
                    )}{" "}
                  </div>
                </div>

                <div className="text-sm text-gray-500 dark:text-slate-300 space-y-1 mb-4 w-full">
                  <div className="flex justify-between flex-wrap">
                    <div className="mb-2">{page?.category}</div>
                  </div>
                </div>

                <div className="flex justify-between gap-3 w-full">
                  {!subscribedStatus[page.id] ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSubscribedButtonClicked(index);
                        addFeedSubscription(page);
                      }}
                    >
                      {subscribedButtonClicked === index ? (
                        <Spinner />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSubscribedButtonClicked(index);
                        removeFeedSubscription(page);
                      }}
                    >
                      {subscribedButtonClicked === index ? (
                        <Spinner />
                      ) : (
                        "Unsubscribed"
                      )}
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      router.push(
                        `/dashboard/facebook-posts/${page?.id}/${page?.name}/${page.access_token}`
                      );
                      setViewButtonClicked(index);
                    }}
                  >
                    {viewButtonClicked === index ? <Spinner /> : "View"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default withAuth(Pages);
