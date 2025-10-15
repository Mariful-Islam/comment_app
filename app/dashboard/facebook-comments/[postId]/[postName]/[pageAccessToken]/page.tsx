"use client";

import { DataTable } from "@/components/Table";
import Layout from "@/layout/Layout";
import { ColumnDef } from "@tanstack/react-table";
import { Menu } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import moment from 'moment'


function Comment() {
  const { postId, postName, pageAccessToken } = useParams();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();


  const serializeData = comments.map((comment)=>({
    ...comment,
    commentor_id: comment?.from?.id,
    name: comment?.from?.name,

  }))

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }: any) => <div>{row?.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: any) => <div>{row?.getValue("name")}</div>,
    },
    {
      accessorKey: "message",
      header: "Comment",
      cell: ({ row }: any) => <div>{row?.getValue("message")}</div>,
    },
    {
      accessorKey: "created_time",
      header: "Created Time",
      cell: ({ row }: any) => <div>{moment(row?.getValue("created_time")).format('h:mm:a DD-MMM-YYYY')}</div>,
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
    try {
      const res = await fetch(
        `https://graph.facebook.com/v23.0/${postId}/comments?access_token=${pageAccessToken}`,
        {
          cache: "no-cache",
        }
      );

      const data = await res.json();

      if (data?.data) {
        setComments(data.data);
      } else {
        console.error("Error in response:", data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId, pathname]);

  console.log(comments, "-----------");

  return (
    <Layout>
      <div className="mt-5">
        <h1 className="text-xl font-bold mb-2">
          Comment {decodeURIComponent(postName as any)}
        </h1>

        <div className="mt-5">
          <DataTable
            columns={columns}
            data={serializeData as any}
            searchColumn={"message" as any}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Comment;
