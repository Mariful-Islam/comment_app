// Example for FacebookInfo / InstagramInfo Card Content

"use client"

import React from "react";
import { Button } from "./ui/button";
import { Facebook, Settings } from "lucide-react";

function Con() {
  return (
    <div className="space-y-6 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
      {/* Card Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Facebook className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 leading-none">
              Facebook Page
            </h4>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">
              Primary Account
            </p>
          </div>
        </div>
        <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
          CONNECTED
        </span>
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
        <div className="relative">
          <img
            src={require('@/assets/E-solver logo-01.png')}
            className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-slate-800 truncate">Mariful</p>
          <p className="text-sm text-slate-500 truncate">Mariful@gmail.com</p>
        </div>
      </div>

      {/* Trial/Subscription Status Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-slate-400">Trial Period</span>
          <span className="text-orange-500">4 days left</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 rounded-full w-[60%]"></div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-100 rounded-xl font-bold">
          Manage Automation
        </Button>
        <Button
          variant="outline"
          className="px-3 border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default Con;
