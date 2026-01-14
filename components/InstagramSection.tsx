import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Instagram, 
  ExternalLink, 
  Settings, 
  Zap, 
  AlertCircle 
} from "lucide-react";

export default function InstagramInfoCard({ instaUser }: { instaUser: any }) {
  // Logic to calculate trial progress
  const trialDaysLeft = 4; // Example dynamic value
  const progressPercentage = (trialDaysLeft / 7) * 100;

  return (
    <div className="flex flex-col h-full  bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
      {/* 1. Header: Platform & Status */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-linear-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-xl shadow-sm">
            <Instagram className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 leading-none">Instagram</h4>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-extrabold">Connected</p>
          </div>
        </div>
        <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* 2. Profile Identity */}
      <div className="relative group p-4 rounded-2xl border border-slate-100 bg-slate-50/30 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-2 border-white shadow-md overflow-hidden bg-slate-200">
              {/* Fallback to initials if no image */}
              <div className="w-full h-full flex items-center justify-center bg-pink-100 text-pink-600 font-bold">
                {instaUser?.username?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 truncate flex items-center gap-1">
              @{instaUser?.username} 
              <ExternalLink className="w-3 h-3 text-slate-300" />
            </p>
            <p className="text-xs text-slate-500 font-medium">Media Creator Account</p>
          </div>
        </div>
      </div>

      {/* 3. Trial Status & Progress */}
      <div className="space-y-3 mb-8">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Current Plan</p>
            <p className="text-sm font-bold text-orange-500">7-Day Free Trial</p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
            {trialDaysLeft} days remaining
          </span>
        </div>
        
        <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-orange-500 rounded-full transition-all duration-1000"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="mt-auto flex flex-col gap-2">
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 rounded-xl shadow-lg shadow-orange-100 flex gap-2 group">
          <Zap className="w-4 h-4 fill-current group-hover:animate-pulse" />
          Start Automation
        </Button>
        <Button variant="ghost" className="w-full text-slate-400 hover:text-red-500 hover:bg-red-50 text-xs font-bold h-9">
          Disconnect Account
        </Button>
      </div>
    </div>
  );
}