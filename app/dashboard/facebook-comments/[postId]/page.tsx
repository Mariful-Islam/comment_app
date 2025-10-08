"use client";

import { DataTable } from "@/components/Table";
import Layout from "@/layout/Layout";
import { ColumnDef } from "@tanstack/react-table";
import { Menu } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { BsThreeDots } from "react-icons/bs";


function Comment() {
  const { postId } = useParams();

  type User = {
  id: string
  name: string
  email: string
}

const users: User[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
  { id: '3', name: 'Charlie', email: 'charlie@example.com' },
]

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }: any) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }: any) => <div>{row.getValue('email')}</div>,
  },
  {
    accessorKey: '',
    header: 'Action',
    cell: ({ row }: any) => (
      <div>
        <BsThreeDots />
      </div>
    ),
  
  }
]


  return (
    <Layout>
      <div className="mt-5">
        <h1 className="text-xl font-bold mb-2">Comment{postId}</h1>

        <div className="mt-5">
          <DataTable columns={columns} data={users} searchColumn={"name"} />
        </div>
      </div>
    </Layout>
  );
}

export default Comment;
