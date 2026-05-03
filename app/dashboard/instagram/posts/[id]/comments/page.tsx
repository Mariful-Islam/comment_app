"use client";

import { DataTable } from "@/components/Table";
import Layout from "@/layout/Layout";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, Menu } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import moment from "moment";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { withAuth } from "@/hoc/withAuth";

function Comment() {
  const { id } = useParams();

  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const serializeData = comments.map((comment) => ({
    ...comment,
    commentor_id: comment?.from?.id,
    name: comment?.from?.name,
  }));

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }: any) => <div>{row?.getValue("id")}</div>,
    },
    {
      accessorKey: "username",
      header: "Name",
      cell: ({ row }: any) => <div>{row?.getValue("username")}</div>,
    },
    {
      accessorKey: "text",
      header: "Comment",
      cell: ({ row }: any) => <div>{row?.getValue("text")}</div>,
    },
    {
      accessorKey: "created_time",
      header: "Created Time",
      cell: ({ row }: any) => (
        <div>
          {moment(row?.getValue("created_time")).format("h:mm:a DD-MMM-YYYY")}
        </div>
      ),
    },
    {
      accessorKey: "",
      header: "Action",
      cell: ({ row }: any) => (
        <div>
          <BsThreeDots />
        </div>
      ),
    },
  ];

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/instagram/posts/${id}/comments`,
        {
          cache: "no-cache",
        }
      );

      const data = await res.json();

      if (data?.data) {
        setComments(data.data);
        setLoading(false);
      } else {
        console.error("Error in response:", data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
      fetchComments();

  }, []);

  return (
    <Layout>
      <div className="mt-5 max-w-300 mx-auto">
        <div
          className="flex items-center gap-2 mb-4"
          onClick={() => router.back()}
        >
          <span className="px-2 py-1 hover:bg-gray-200 rounded-lg duration-150">
            <ArrowLeft className="h-5 w-5 " />
          </span>
          <h1 className="text-xl font-bold">Comment</h1>
        </div>

        <div className="text-gray-500">
          {/* {decodeURIComponent(postName as any)} */}
        </div>

        {loading ? (
          <div className="flex justify-center w-full mt-10">
            <Spinner />
          </div>
        ) : (
          <div className="mt-5">
            <DataTable
              columns={columns}
              data={serializeData as any}
              searchColumn={"text" as any}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default withAuth(Comment);
