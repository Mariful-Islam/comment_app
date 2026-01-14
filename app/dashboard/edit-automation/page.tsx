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
import { BsThreeDots } from "react-icons/bs";
import moment from "moment";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import CreateKeywordByUser from "./components/CreateKeywordByUser";
import EditKeywordFormByUser from "./components/EditKeywordFormByUser";
import DeleteKeywordByUser from "./components/DeleteKeywordByUser";
import { useUser } from "@/contexts/UserContext";
import { useKeyword } from "@/contexts/KeywordContext";
import KeywordDetailView from "./components/KeywordDetailView";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { ReusablePagination } from "@/components/Pagination";
import { Checkbox } from "@/components/ui/checkbox";

function CommentKeyword() {
  const { user } = useUser();
  const router = useRouter();
  
  const [isOpenCreateKeywordForm, setIsOpenCreateKeywordForm] = useState<boolean>(false);
  const [editKeyword, setEditKeyword] = useState<any>(null);
  const [deleteKeyword, setDeleteKeyword] = useState<any>(null);
  const [viewKeyword, setViewKeyword] = useState<any>(null);
  const { keywords, fetchKeywords, loading } = useKeyword();




  const handleAddKeyword = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpenCreateKeywordForm(!isOpenCreateKeywordForm);
  };

  const handleStart = async (e: React.MouseEvent, row: any) => {
    e.preventDefault();
    await fetch(`/api/keywords/${row?._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: true }),
    });
    fetchKeywords();
  };

  const handleStop = async (e: React.MouseEvent, row: any) => {
    e.preventDefault();
    await fetch(`/api/keywords/${row?._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: false }),
    });
    fetchKeywords();
  };

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
      accessorKey: "postMessage",
      header: "Post",
      cell: ({ row }: any) => (
        <div className="max-w-full min-w-12 break-all text-wrap line-clamp-2">
          {row?.original?.post?.text || "No content available"}
        </div>
      ),
    },
    {
      accessorKey: "keyword",
      header: "Keyword",
      cell: ({ row }: any) => <div>{row?.getValue("keyword")}</div>,
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }: any) => (
        <div className="line-clamp-1 max-w-75">
          {row?.getValue("isActive") ? (
            <div
              onClick={(e) => handleStop(e, row.original)}
              className="bg-gray-200 hover:bg-red-300 h-8 w-8 flex items-center justify-center rounded-sm cursor-pointer duration-150"
            >
              <Square className="text-red-500 h-4 w-4 " />
            </div>
          ) : (
            <div
              onClick={(e) => handleStart(e, row.original)}
              className="bg-gray-200 hover:bg-green-300 h-8 w-8 flex items-center justify-center rounded-sm cursor-pointer duration-150"
            >
              <Play className="text-green-500 h-4 w-4" />
            </div>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }: any) => (
        <div className="flex gap-4">
          <Pen
            className="h-4 w-4 cursor-pointer hover:text-blue-500"
            onClick={() => setEditKeyword(row.original)}
          />
          <Trash
            className="h-4 w-4 cursor-pointer hover:text-red-500"
            onClick={() => setDeleteKeyword(row.original)}
          />
          <Eye
            className="h-4 w-4 cursor-pointer hover:text-green-500"
            onClick={() => setViewKeyword(row.original)}
          />
        </div>
      ),
    },
  ];

 

  return (
    <Layout>
      <div className="max-w-300 mx-auto mt-5 text-sm sm:text-md">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h1 className="text-xl font-bold">Keyword</h1>
          {/* <Button
            variant="outline"
            onClick={() => fetchKeywords()}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button> */}

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              fetchKeywords();
            }}
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>


          
        </div>

        <div className="flex justify-end my-6">
          <Button onClick={handleAddKeyword}>Add Keyword</Button>
        </div>

        {loading ? (
          <div className="flex justify-center w-full">
            <Spinner />
          </div>
        ) : (
          <div>
  
            {/* Note: Ensure your DataTable component supports rowSelection state if passed, 
                otherwise, passing 'table' instance might be required depending on your component props */}
            <DataTable
              columns={columns}
              data={keywords?.data || []}
              searchColumn={""}
              // If your DataTable is a custom wrapper around Shadcn, pass the state down
              // table={table} 
              
            />
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <ReusablePagination
            totalPages={keywords?.meta?.totalPages || 1}
            currentPage={keywords?.meta?.currentPage || 1}
            onPageChange={(page: number) => fetchKeywords(page)}
          />
        </div>

        {/* Modals */}
        {isOpenCreateKeywordForm && (
          <CreateKeywordByUser
            isOpen={isOpenCreateKeywordForm}
            onclose={() => setIsOpenCreateKeywordForm(false)}
            refreshKeywords={fetchKeywords}
          />
        )}

        {editKeyword && (
          <EditKeywordFormByUser
            postId={"1"}
            isOpen={!!editKeyword}
            onClose={() => setEditKeyword(null)}
            data={editKeyword}
            refreshKeywords={fetchKeywords}
          />
        )}

        {deleteKeyword && (
          <DeleteKeywordByUser
            isOpen={!!deleteKeyword}
            onClose={() => setDeleteKeyword(null)}
            keyword={deleteKeyword}
            refreshKeywords={fetchKeywords}
          />
        )}

        {viewKeyword && (
          <KeywordDetailView
            isOpen={!!viewKeyword}
            onClose={() => setViewKeyword(null)}
            data={viewKeyword}
          />
        )}
      </div>
    </Layout>
  );
}

export default CommentKeyword;