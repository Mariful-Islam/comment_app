"use client";
import { DataTable } from "@/components/Table";
import { Button } from "@/components/ui/button";
import Layout from "@/layout/Layout";
import {
  ArrowLeft,
  Delete,
  Eye,
  Pen,
  Play,
  RefreshCw,
  Square,
  Trash,
} from "lucide-react";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useUser } from "@/contexts/UserContext";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { useKeywordUsage } from "@/contexts/KeywordUsageContext";
import KeywordDetailView from "./components/KeywordDetailView";
import { ReusablePagination } from "@/components/Pagination";

function KeywordUsage() {
  const { user } = useUser();

  const router = useRouter();
  const [viewKeyword, setViewKeyword] = useState<any>(null);

  const { KeywordUsages, fetchKeywordUsages, loading } = useKeywordUsage();

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
      header: "Target Name",
      cell: ({ row }: any) => {
        return (
          <div className="max-w-full min-w-12 break-all text-wrap line-clamp-2">
            {row?.original?.target?.name || "No content available"}
          </div>
        );
      },
    },
    {
      accessorKey: "keyword?.text",
      header: "Keyword",
      cell: ({ row }: any) => <div>{row?.original?.keyword?.text}</div>,
    },
    {
      accessorKey: "commentReply",
      header: "Comment",
      cell: ({ row }: any) => {
        return (
          <div className="max-w-full min-w-12 break-all text-wrap line-clamp-2">
            {row?.original?.commentReply || "No content available"}
          </div>
        );
      },
    },

    {
      accessorKey: "messageReply",
      header: "Message",
      cell: ({ row }: any) => {
        return (
          <div className="max-w-full min-w-12 break-all text-wrap line-clamp-2">
            {row?.original?.messageReply || "No content available"}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }: any) => {
        const date = new Date(row?.original?.createdAt);
        return <div>{date.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "",
      header: "Action",
      cell: ({ row }: any) => (
        <div className="flex gap-4">
          <Eye
            className="h-4 w-4 hover:text-green-500"
            onClick={() => setViewKeyword(row.original)}
          />
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="max-w-300 mx-auto mt-5 text-sm sm:text-md">
        <div
          className="flex items-center justify-between gap-2 mb-4"
          onClick={() => router.back()}
        >
          {/* <span className="px-2 py-1 hover:bg-gray-200 rounded-lg duration-150">
            <ArrowLeft className="h-5 w-5 " />
          </span> */}
          <h1 className="text-xl font-bold">Keyword Usage</h1>

          <Button
            variant={`outline`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              fetchKeywordUsages();
            }}
            disabled={loading}
            className="animate-spin-slow"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center w-full">
            <Spinner />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={KeywordUsages?.data || []}
            searchColumn={""}
          />
        )}

        {viewKeyword && (
          <KeywordDetailView
            isOpen={viewKeyword ? true : false}
            onClose={() => setViewKeyword(null)}
            data={viewKeyword}
          />
        )}

        <ReusablePagination
          totalPages={KeywordUsages?.meta?.totalPages || 1}
          currentPage={KeywordUsages?.meta?.currentPage || 1}
          onPageChange={(page: number) => {
            fetchKeywordUsages(page);
          }}
        />
      </div>
    </Layout>
  );
}

export default KeywordUsage;
