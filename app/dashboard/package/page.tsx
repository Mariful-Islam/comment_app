"use client";

import { Button } from "@/components/ui/button";
import Layout from "@/layout/Layout";
import React, { useState } from "react";
import SelectInstaPost from "../edit-automation/components/SelectInstaPost";
import { DataTable } from "@/components/Table";
import { ColumnDef } from "@tanstack/react-table";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import moment from "moment";
import { Eye, RefreshCw } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { ReusablePagination } from "@/components/Pagination";
import SubscriptionDetailView from "./components/SubscriptionDetailView";
import { useInstagram } from "@/contexts/InstagramContext";
import { useFacebookPages } from "@/contexts/FacebookPageContext";
import UpgradePlan from "./components/UpgradePlan";

function Package() {
  const [platform, setPlatform] = useState<"facebook" | "instagram" | null>(null);
  const [subscription, setSubscription] = useState<any>(null);

  const { subscriptions, fetchSubscriptions, loading } = useSubscription();
  const { pages } = useFacebookPages();
  const { user: instaUser } = useInstagram(); // Fixed destructuring
  const [isUpgrading, setIsUpgrading] = useState(false);


  // Table Column Definitions
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "platform",
      header: "PF",
      cell: ({ row }: any) => (
        <div>
          {row?.getValue("platform") === "facebook" ? (
            <span className="text-blue-600 font-bold">
              <FaFacebook className="h-5 w-5" />
            </span>
          ) : (
            <span className="text-pink-500 font-bold">
              <FaInstagram className="h-5 w-5" />
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "target.name",
      header: "Name",
      cell: ({ row }: any) => (
        <div className="max-w-full min-w-12 break-all text-wrap line-clamp-2">
          {row?.original?.target?.name || "No content available"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row?.original?.status;
        const statusStyles: any = {
          pending: "text-yellow-500 dark:text-yellow-100 bg-yellow-100 dark:bg-yellow-800",
          running: "text-green-500 dark:text-green-100 bg-green-100 dark:bg-green-800",
          expired: "text-red-500 dark:text-red-100 bg-red-100 dark:bg-red-800",
        };
        return (
          <div className={`${statusStyles[status] || "bg-gray-100"} text-center rounded-md py-1 px-2 font-medium uppercase text-[12px]`}>
            {status}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }: any) => (
        <div>{moment(row?.original?.createdAt).format("DD-MM-YYYY")}</div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }: any) => (
        <div className="flex gap-4">
          <Eye
            className="h-4 w-4 cursor-pointer hover:text-green-500"
            onClick={() => setSubscription(row.original)}
          />
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto mt-5 px-4">
        <h2 className="text-xl font-bold">Package & Billing</h2>
        
        <div className="mt-6 p-6 border rounded-lg bg-card dark:bg-slate-700">
          <h3 className="text-md font-medium text-gray-500 dark:text-gray-200">Current Plan</h3>
          <div className="flex justify-between items-end mt-2">
            <div>
              <div className="text-2xl font-bold text-primary">Basic Plan</div>
              <p className="text-sm text-muted-foreground mt-1 dark:text-gray-400">Manage up to 5 automated posts</p>
            </div>
            <Button variant="outline" size="sm" onClick={()=>setIsUpgrading(!isUpgrading)}>Upgrade Plan</Button>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Subscriptions Usage</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchSubscriptions()}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          <DataTable
            data={subscriptions?.data || []}
            columns={columns}
            searchColumn="target_name"
          />

          <div className="mt-4">
            <ReusablePagination
              totalPages={subscriptions?.meta?.totalPages || 1}
              currentPage={subscriptions?.meta?.currentPage || 1}
              onPageChange={(page: number) => fetchSubscriptions(page)}
            />
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="flex gap-4">
            <Button 
              variant="default" 
              className="bg-blue-600 hover:bg-blue-700 dark:text-white"
              onClick={() => setPlatform("facebook")}
            >
              <FaFacebook className="mr-2 dark:text-white" /> Configure Facebook
            </Button>
            <Button 
              variant="default" 
              className="bg-linear-to-r from-purple-500 to-pink-500 hover:opacity-90 dark:text-white"
              onClick={() => setPlatform("instagram")}
            >
              <FaInstagram className="mr-2 dark:text-white" /> Configure Instagram
            </Button>
          </div>
        </div>

        {/* Modals & Detail Views */}
        {subscription && (
          <SubscriptionDetailView
            isOpen={!!subscription}
            onClose={() => setSubscription(null)}
            data={subscription}
          />
        )}

        {platform === "instagram" && (
          <SelectInstaPost
            isOpen={platform === "instagram"}
            onClose={() => setPlatform(null)}
            handleSetPost={(post) => {
              setPlatform(null);
            }}
          />
        )}


        {isUpgrading && (
          <UpgradePlan
            isOpen={isUpgrading}
            onClose={()=>setIsUpgrading(false)}
          />
        )}
      </div>
    </Layout>
  );
}

export default Package;