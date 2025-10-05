"use client";
import { Button } from "@/components/ui/button";
import Layout from "@/layout/Layout";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";

function Posts() {
  const { pageId } = useParams();

  const posts = [
    { id: 1, content: "Post 1" },
    { id: 2, content: "Post 2" },
    { id: 3, content: "Post 3" },
    { id: 4, content: "Post 4" },
    { id: 5, content: "Post 5" },
    { id: 6, content: "Post 6" },
    { id: 7, content: "Post 7" },
  ];

  return (
    <Layout>
      <div className="px-6 mt-5">
        <h1 className="text-2xl font-bold mb-2">Posts of {pageId}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8 ">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md"
            >
              <Image src={require('@/assets/Untitled-design--32-.png')}  alt="" className="h-[200px] w-full object-cover rounded-t-xl"/>
              <div className="p-4 ">
                <div className="font-medium">{post.content}</div>
                <div className="flex justify-end items-center mt-4">
                  <Button onClick={()=>null}>View</Button>
                </div>
                
              </div>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}

export default Posts;
