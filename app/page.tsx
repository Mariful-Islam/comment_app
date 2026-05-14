"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useUser } from "@/contexts/UserContext";
import { withAuth } from "@/hoc/withAuth";
import Layout from "@/layout/Layout";

// UI Components
import { Button } from "@/components/ui/button";
import FacebookInfo from "@/components/FacebookInfo";
import InstagramInfo from "@/components/InstagramInfo";
import UpgradePlan from "@/app/dashboard/package/components/UpgradePlan";

// Icons
import { 
  Sparkles, 
  Rocket, 
  ShieldCheck, 
  ArrowUpRight, 
  Zap, 
  LogOut, 
  Clock,
  MessageCircle,
  BarChart3,
  Calendar,
  Users
} from "lucide-react";
// import { useInstagram } from "@/contexts/InstagramContext";
import AnalyticsDashboard from "@/components/Analytics";
import { useFacebookPages } from "@/contexts/FacebookPageContext";
import { useFacebook } from "@/contexts/FacebookContext";
import { Spinner } from "@/components/ui/shadcn-io/spinner";



function Home() {
  const router = useRouter();
  const { user, loading } = useUser();
  // const {user: instaUser} = useInstagram()
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  
  const { pages } = useFacebookPages();
  const {user: fbUser} = useFacebook();
  const [isSyncLoading, setIsSyncLoading] = useState(false);




  const handleSync = async () => {
    setIsSyncLoading(true);

    const fbAccessToken = document.cookie.split("; ").find(row => row.startsWith("fb_access_token="))?.split("=")[1];

    try {
      const res = await fetch("/api/facebook/pages")
      const data = await res.json();


      if(data?.data?.length === 0) {
        const syncPromises = pages?.data?.map((page: any) => {
          console.log("Syncing page:", page);
        
          return fetch(`/api/facebook/pages/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: page?.name,
              id: page?.id,
              pageAccessToken: page?.access_token,
              ownerId: fbUser?.fbId || "unknown_owner",
              userId: user?._id,
              ownerAccessToken: fbAccessToken,
              ownerName: fbUser?.name || "Unknown User"
            }),
          })
          .then((res) => res.json())
          .then((data) => {
            console.log("Page sync response:");
          })
          .catch((err) => {
            console.error("Error syncing page:", err);
          });
        }) || [];

        await Promise.all(syncPromises);
      } else if (data?.data?.length > 0){
        // if all pages not exist in DB, sync them
        const existingPageIds = data.data.map((page: any) => page.id);
        const pagesToSync = pages?.data?.filter((page: any) => !existingPageIds.includes(page.id)) || [];

        if(pagesToSync.length > 0){
          const syncPromises = pagesToSync.map((page: any) => {
         

            return fetch(`/api/facebook/pages/create`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: page?.name,
                id: page?.id,
                pageAccessToken: page?.access_token,
                ownerId: fbUser?.fbId || "unknown_owner",
                userId: user?._id,
                ownerAccessToken: fbAccessToken,
                ownerName: fbUser?.name || "Unknown User"
              }),
            })
            .then((res) => res.json())
            .then((data) => {
              console.log("Page sync response:");
            })
            .catch((err) => {
              console.error("Error syncing page:", err);
            });
          });

          await Promise.all(syncPromises);
        }
      } else {
        console.log("Pages already exist in DB, skipping sync.");
      }

    } catch (error) {
      console.error("Failed to sync pages:", error);
    } finally {
      setIsSyncLoading(false);
    }
  }


  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse space-y-8">
          <div className="h-64 bg-gray-100 rounded-3xl" />
          <div className="grid grid-cols-3 gap-6">
            <div className="h-32 bg-gray-100 rounded-2xl" />
            <div className="h-32 bg-gray-100 rounded-2xl" />
            <div className="h-32 bg-gray-100 rounded-2xl" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        
        <AnalyticsDashboard/>


        
        <Button variant={`outline`} onClick={handleSync}>Sync {isSyncLoading && <Spinner variant={`circle`} />}</Button>



        {/* --- SECTION 4: ACCOUNT STATUS --- */}
        <div className="space-y-6 pt-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Connected Accounts <div className="h-1 w-1 bg-slate-300 rounded-full" />
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-600 rounded-3xl border border-slate-100 dark:border-slate-400 p-6 shadow-sm">
              <FacebookInfo />
            </div>
            <div className="bg-white dark:bg-slate-600 rounded-3xl border border-slate-100 dark:border-slate-400 p-6 shadow-sm">
              <InstagramInfo />
            </div>
          </div>
        </div>

        {/* UPGRADE DIALOG */}
        <UpgradePlan 
          isOpen={isUpgradeOpen} 
          onClose={() => setIsUpgradeOpen(false)} 
        />
      </div>
    </Layout>
  );
}

export default withAuth(Home);