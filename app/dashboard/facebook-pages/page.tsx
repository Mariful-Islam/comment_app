"use client";
import Layout from "@/layout/Layout";
import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Pages() {
  const [pages, setPages] = useState<any[]>([])

  const pageList = [
    { id: 1, name: "Page 1" },
    { id: 2, name: "Page 2" },
    { id: 3, name: "Page 3" },
    { id: 3, name: "Page 4" },

    { id: 3, name: "Page 5" },

    { id: 3, name: "Page 6" },
  ];

  const router = useRouter();

  const getPages = async () => {
    const res = await fetch(`https://graph.facebook.com/v23.0/me/accounts?access_token=${process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN_TEST}`)
    const data = await res.json()
    setPages(data?.data)

    return data?.data
  };


  useEffect(()=>{
    getPages()
  }, [])

  return (
    <Layout>
      <div className=" mt-5">
        <h1 className="text-xl font-bold mb-4">Facebook Pages</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
          {pages?.map((page) => (
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
                  <div className="mb-2">
                    {page?.category}
                  </div>
            
                </div>

          
              </div>

              <div className="flex justify-end w-full">
                <Button
                  onClick={() =>
                    router.push(`/dashboard/facebook-posts/${page?.id}/${page?.name}/${page.access_token}`)
                  }
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Pages;
