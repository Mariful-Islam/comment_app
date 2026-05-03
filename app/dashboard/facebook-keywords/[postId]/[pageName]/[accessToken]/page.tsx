"use client";
import { DataTable } from "@/components/Table";
import { Button } from "@/components/ui/button";
import Layout from "@/layout/Layout";
import { ArrowLeft, Delete, Pen, Trash } from "lucide-react";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useEffect, useState } from "react";
import CreateKeywordForm from "./components/CreateKeywordForm";
import { BsThreeDots } from "react-icons/bs";
import moment from "moment";
import { ColumnDef } from "@tanstack/react-table";
import EditKeywordForm from "./components/EditKeywordForm";
import DeleteKeyword from "./components/DeleteKeyword";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { withAuth } from "@/hoc/withAuth";

function CommentKeyword() {
  const { postId, pageName, accessToken }: any = useParams();
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
      const res = await fetch(`/api/keywords/${postId}`, {
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
    if (postId && accessToken) {
      fetchKeywords();
    }
  }, [postId, accessToken, pathname]);

  const handleAddKeyword = async () => {
    setIsOpenCreateKeywordForm(!isOpenCreateKeywordForm);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "_id",
      header: "ID",
      cell: ({ row }: any) => <div>{row?.getValue("_id")}</div>,
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
      accessorKey: "createdAt",
      header: "Created Time",
      cell: ({ row }: any) => (
        <div>
          {moment(row?.getValue("createdAt")).format("h:mm:a DD-MMM-YYYY")}
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
      <div className="max-w-300 mx-auto mt-5">
        <div
          className="flex items-center gap-2 mb-4"
          onClick={() => router.back()}
        >
          <span className="px-2 py-1 hover:bg-gray-200 rounded-lg duration-150">
            <ArrowLeft className="h-5 w-5 " />
          </span>
          <h1 className="text-xl font-bold">Posts</h1>


        </div>
        <h1 className="text-gray-500 mb-2 line-clamp-1 max-w-50">
          {decodeURIComponent(pageName)}
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
          <CreateKeywordForm
            postId={postId}
            isOpen={isOpenCreateKeywordForm}
            onclose={() => setIsOpenCreateKeywordForm(false)}
            refreshKeywords={fetchKeywords}
          />
        )}

        {editKeyword && (
          <EditKeywordForm
            postId={postId}
            isOpen={editKeyword ? true : false}
            onClose={() => setEditKeyword(null)}
            data={editKeyword}
            refreshKeywords={fetchKeywords}
          />
        )}

        {deleteKeyword && (
          <DeleteKeyword
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

export default withAuth(CommentKeyword);
