"use client";
import { DataTable } from "@/components/Table";
import { Button } from "@/components/ui/button";
import Layout from "@/layout/Layout";
import { ArrowLeft, Delete, Pen, Play, Square, Trash } from "lucide-react";
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



function CommentKeyword() {
  const {token: accessToken, user} = useFacebook()

  const router = useRouter();
  const pathname = usePathname();

  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpenCreateKeywordForm, setIsOpenCreateKeywordForm] =
    useState<boolean>(false);
  const [editKeyword, setEditKeyword] = useState<any>(null);
  const [deleteKeyword, setDeleteKeyword] = useState<any>(null);
  

  const fetchKeywords = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/keywords/users/${user?.id}`, {
        cache: "no-cache",
      });

      const data = await res.json();

      if (data) {
        setKeywords(data);
        setLoading(false);
      } else {
        console.error("Error in response:", data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchKeywords();
    }
  }, [accessToken, pathname]);

  const handleAddKeyword = async (e:any) => {
    e.preventDefault()
    setIsOpenCreateKeywordForm(!isOpenCreateKeywordForm);
  };


  const handleStart = async (e:any, row: any) => {
    e.preventDefault()

    const res = await fetch(`/api/keywords/${row.getValue('_id')}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({isActive: true})

    })
    const data = await res.json()
    fetchKeywords()


  }

  const handleStop = async (e: any, row: any) => {
    e.preventDefault()

    const res = await fetch(`/api/keywords/${row.getValue('_id')}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({isActive: false})
    })
    const data = await res.json()
    fetchKeywords()

  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "_id",
      header: "",
      cell: ({ row }: any) => {

        return(
          <>
            {/* {row?.getValue("postMessage")} */}
          </>
        )
      },
    },
    {
      accessorKey: "postMessage",
      header: "Post",
      cell: ({ row }: any) => {

        return(
          <div className="max-w-40 min-w-24 break-all text-wrap line-clamp-2">{row?.getValue("postMessage")}</div>
        )
      },
    },
    {
      accessorKey: "keyword",
      header: "Keyword",
      cell: ({ row }: any) => <div>{row?.getValue("keyword")}</div>,
    },
    {
      accessorKey: "comment",
      header: "Comment Reply",
      cell: ({ row }: any) => <div>{row?.getValue("comment")}</div>,
    },
    {
      accessorKey: "message",
      header: "Message Reply",
      cell: ({ row }: any) => (
        <div className=" line-clamp-1 max-w-[300px]">
          {row?.getValue("message")}
        </div>
      ),
    },
    {
      accessorKey: "userId",
      header: "",
      cell: ({ row }: any) => (
        <>
          {/* {row?.getValue("userId")} */}
        </>
      ),
    },

    {
      accessorKey: "createdAt",
      header: "Created Time",
      cell: ({ row }: any) => (
        <div>
          {moment(row?.getValue("createdAt")).format("h:mm:a DD-MMM-YYYY")}
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }: any) => (
        <div className=" line-clamp-1 max-w-[300px]">
          {row?.getValue("isActive") ? (
            <div onClick={(e)=>handleStop(e, row)} className="bg-gray-200 hover:bg-red-300 h-8 w-8 flex items-center justify-center rounded-sm duration-150">
              <Square className="text-red-500 h-4 w-4 " />
            </div>
          ) : (
            <div onClick={(e)=>handleStart(e, row)} className="bg-gray-200 hover:bg-green-300 h-8 w-8 flex items-center justify-center rounded-sm duration-150">
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
            onClick={() => setEditKeyword(row)}
          />
          <Trash
            className="h-4 w-4 hover:text-red-500"
            onClick={() => setDeleteKeyword(row)}
          />
        </div>
      ),
    },
  ];


  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto mt-5">
        <div
          className="flex items-center gap-2 mb-4"
          onClick={() => router.back()}
        >
          <span className="px-2 py-1 hover:bg-gray-200 rounded-lg duration-150">
            <ArrowLeft className="h-5 w-5 " />
          </span>
          <h1 className="text-xl font-bold">Posts</h1>
        </div>
        <h1 className="text-gray-500 mb-2 line-clamp-1 max-w-[200px]">
          {/* {decodeURIComponent(pageName)} */}
        </h1>

        <div className="flex justify-end my-6">
          <Button onClick={handleAddKeyword}>Add Keyword</Button>
        </div>

        {loading ? (
          <div className="flex justify-center w-full">
            <Spinner />
          </div>
        ) : (
          <DataTable columns={columns} data={keywords || []} searchColumn={""} />
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
      </div>
    </Layout>
  );
}

export default CommentKeyword;
