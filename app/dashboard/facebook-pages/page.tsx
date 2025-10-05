"use client";
import { DataTableDemo } from "@/components/Table";
import Layout from "@/layout/Layout";
import React, { use } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Pages() {
  const pageList = [
    { id: 1, name: "Page 1" },
    { id: 2, name: "Page 2" },
    { id: 3, name: "Page 3" },
    { id: 3, name: "Page 4" },

    { id: 3, name: "Page 5" },

    { id: 3, name: "Page 6" },
  ];

  const router = useRouter();


  return (
    <Layout>
      <div className="px-6 mt-5">
        <h1 className="text-2xl font-bold mb-4">Facebook Pages</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {pageList.map((page) => (
            <div
              key={page.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col items-start transition hover:shadow-md w-full"
            >
              <div className="flex justify-center items-center gap-2 mb-6">
                <Image
                  src={require("@/assets/Untitled-design--32-.png")}
                  alt="Facebook Logo"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="font-medium">{page.name}</div>
              </div>

              <div className="text-sm text-gray-500 space-y-1 mb-4 w-full">
                
                <div className="flex justify-between flex-wrap">
                  <div>
                    <span className="font-medium text-gray-700">Likes:</span> 100k
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Followers:
                    </span>{" "}
                    500
                  </div>
                </div>


                <div>
                  <span className="font-medium text-gray-700">Posts:</span> 100
                </div>

              </div>

              <div className="flex justify-end w-full">
                <Button onClick={()=>router.replace(`/dashboard/facebook-posts/${page.id}`)}>View</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Pages;
