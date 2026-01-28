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
import FeatureSection from "@/components/FeatureSection";
import Con from "@/components/Con";
import InstagramInfoCard from "@/components/InstagramSection";
import { useInstagram } from "@/contexts/InstagramContext";
import AnalyticsDashboard from "@/components/Analytics";


function Home() {
  const router = useRouter();
  const { user, loading } = useUser();
  const {user: instaUser} = useInstagram()
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    await signOut(auth);
    router.refresh();
    router.replace("/login");
  };

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

        {/* <div className="grid grid-cols-2 gap-6 w-full">
          <Con/>
          <InstagramInfoCard instaUser={instaUser}/>
        </div> */}
        


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