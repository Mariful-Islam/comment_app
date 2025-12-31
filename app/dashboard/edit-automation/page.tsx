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
import { ColumnDef } from "@tanstack/react-table";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useFacebook } from "@/contexts/FacebookContext";
import CreateKeywordByUser from "./components/CreateKeywordByUser";
import EditKeywordFormByUser from "./components/EditKeywordFormByUser";
import DeleteKeywordByUser from "./components/DeleteKeywordByUser";
import { useFacebookPages } from "@/contexts/FacebookPageContext";
import { useUser } from "@/contexts/UserContext";
import { useKeyword } from "@/contexts/KeywordContext";
import KeywordDetailView from "./components/KeywordDetailView";
import { FaFacebook, FaInstagram } from "react-icons/fa6";

function CommentKeyword() {
  // const {token: accessToken, user: fbUser} = useFacebook()

  const { user } = useUser();

  const router = useRouter();
  const [isOpenCreateKeywordForm, setIsOpenCreateKeywordForm] =
    useState<boolean>(false);
  const [editKeyword, setEditKeyword] = useState<any>(null);
  const [deleteKeyword, setDeleteKeyword] = useState<any>(null);
  const [viewKeyword, setViewKeyword] = useState<any>(null);

  const { keywords, fetchKeywords, loading } = useKeyword();

  const handleAddKeyword = async (e: any) => {
    e.preventDefault();
    setIsOpenCreateKeywordForm(!isOpenCreateKeywordForm);
  };

  const handleStart = async (e: any, row: any) => {
    e.preventDefault();

    const res = await fetch(`/api/keywords/${row?._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive: true }),
    });
    const data = await res.json();
    fetchKeywords();
  };

  const handleStop = async (e: any, row: any) => {
    e.preventDefault();

    const res = await fetch(`/api/keywords/${row?._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive: false }),
    });
    const data = await res.json();
    fetchKeywords();
  };

  const columns: ColumnDef<any>[] = [
    // {
    //   accessorKey: "_id",
    //   header: "",
    //   cell: ({ row }: any) => {
    //     return <>{/* {row?.getValue("postMessage")} */}</>;
    //   },
    // },

    {
      accessorKey: "platform",
      header: "PF",
      cell: ({ row }: any) => (
        <div>
          {row?.getValue("platform") === "facebook" ? (
            <span className="text-blue-600 font-bold"><FaFacebook className="h-5 w-5" /></span>
          ) : (
            <span className="text-pink-500 font-bold"><FaInstagram className="h-5 w-5" /></span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "postMessage",
      header: "Post",
      cell: ({ row }: any) => {
        return (
          <div className="max-w-full min-w-12 break-all text-wrap line-clamp-2">
            {row?.getValue("postMessage")}
          </div>
        );
      },
    },
    {
      accessorKey: "keyword",
      header: "Keyword",
      cell: ({ row }: any) => <div>{row?.getValue('keyword')}</div>,
    },
    // {
    //   accessorKey: "comment",
    //   header: "",
    //   cell: ({ row }: any) => <div></div>,
    // },
    // {
    //   accessorKey: "message",
    //   header: "",
    //   cell: ({ row }: any) => (
    //     <>

    //     </>
    //   ),
    // },
    // {
    //   accessorKey: "userId",
    //   header: "",
    //   cell: ({ row }: any) => <>{/* {row?.getValue("userId")} */}</>,
    // },



    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }: any) => (
        <div className=" line-clamp-1 max-w-75">
          {row?.getValue("isActive") ? (
            <div
              onClick={(e) => handleStop(e, row.original)}
              className="bg-gray-200 hover:bg-red-300 h-8 w-8 flex items-center justify-center rounded-sm duration-150"
            >
              <Square className="text-red-500 h-4 w-4 " />
            </div>
          ) : (
            <div
              onClick={(e) => handleStart(e, row.original)}
              className="bg-gray-200 hover:bg-green-300 h-8 w-8 flex items-center justify-center rounded-sm duration-150"
            >
              <Play className="text-green-500 h-4 w-4" />
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "",
      header: "Action",
      cell: ({ row }: any) => (
        <div className="flex gap-4">
          <Pen
            className="h-4 w-4 hover:text-blue-500"
            onClick={() => setEditKeyword(row.original)}
          />
          <Trash
            className="h-4 w-4 hover:text-red-500"
            onClick={() => setDeleteKeyword(row.original)}
          />
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
          <h1 className="text-xl font-bold">Keyword</h1>

          <Button
            variant={`outline`}
            onClick={(e) => {
              e.preventDefault();
              fetchKeywords();
            }}
            disabled={loading}
            className="animate-spin-slow"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
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
          <DataTable
            columns={columns}
            data={keywords || []}
            searchColumn={""}
          />
        )}

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
            isOpen={editKeyword ? true : false}
            onClose={() => setEditKeyword(null)}
            data={editKeyword}
            refreshKeywords={fetchKeywords}
          />
        )}

        {deleteKeyword && (
          <DeleteKeywordByUser
            isOpen={deleteKeyword ? true : false}
            onClose={() => setDeleteKeyword(null)}
            keyword={deleteKeyword}
            refreshKeywords={fetchKeywords}
          />
        )}

        {viewKeyword && (
          <KeywordDetailView
            isOpen={viewKeyword ? true : false}
            onClose={() => setViewKeyword(null)}
            data={viewKeyword}
          />
        )}
      </div>
    </Layout>
  );
}

export default CommentKeyword;
