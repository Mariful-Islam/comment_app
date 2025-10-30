"use client";
import Layout from "@/layout/Layout";
import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { set } from "mongoose";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

function Pages() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewButtonClicked, setViewButtonClicked] = useState<any>(null);

  const router = useRouter();

  const getPages = async () => {
    setLoading(true);
    try {
      const token = process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN_TEST;
      if (!token) throw new Error("Facebook access token is not configured.");

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await fetch(
        `https://graph.facebook.com/v23.0/me/accounts?access_token=${encodeURIComponent(
          token
        )}`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);

      if (!res.ok) {
        const body = await res.text();
        console.error("Failed to fetch Facebook pages:", res.status, body);
        setPages([]);
        setLoading(false);
        return [];
      }

      const json = await res.json();
      const pagesData = Array.isArray(json?.data) ? json.data : [];
      setPages(pagesData);
      setLoading(false);
      return pagesData;
    } catch (err) {
      if ((err as any)?.name === "AbortError") {
        console.warn("Facebook pages request aborted (timeout).");
      } else {
        console.error("Error fetching Facebook pages:", err);
      }
      setPages([]);
      setLoading(false);
      return [];
    }
  };

  useEffect(() => {
    getPages();
  }, []);

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto mt-5">
        <h1 className="text-xl font-bold mb-4">Facebook Pages</h1>

        {loading ? (
          <div className="flex justify-center w-full mt-10">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
            {pages?.map((page, index) => (
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
                    <div className="mb-2">{page?.category}</div>
                  </div>
                </div>

                <div className="flex justify-end w-full">
                  <Button
                    onClick={() => {
                      router.push(
                        `/dashboard/facebook-posts/${page?.id}/${page?.name}/${page.access_token}`
                      )
                      setViewButtonClicked(index);
                    }
                    }
                  >
                    { viewButtonClicked === index ? <Spinner/> : 'View' }
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Pages;
