"use client";
import { Button } from "@/components/ui/button";
import Layout from "@/layout/Layout";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useEffect, useState } from "react";

function Posts() {
  const { pageId, pageName, accessToken }:any = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`https://graph.facebook.com/v23.0/${pageId}/posts?access_token=${accessToken}`,
        {
          cache: "no-cache",
        }
      );

      const data = await res.json();

      if (data?.data) {
        setPosts(data.data);
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
    if (pageId && accessToken) {
      fetchPosts();
    }
  }, [pageId, accessToken, pathname]);

  return (
    <Layout>
      <div className="px-6 mt-5">
        <h1 className="text-xl font-bold mb-2">
          {decodeURIComponent(pageName)}
        </h1>

        {loading ? (
          <div className="mt-10 text-center">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="mt-10 text-center text-gray-500">No posts found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-5">
            {posts.map((post: any) => (
              <div
                key={post.id}
                className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md"
              >
                <Image
                  src={require("@/assets/Untitled-design--32-.png")}
                  alt="Post cover"
                  className="h-[200px] w-full object-cover rounded-t-xl"
                />
                <div className="p-4">
                  <div className="font-medium mb-2 line-clamp-3">
                    {post.message || "No content available"}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() =>
                        router.push(`/dashboard/facebook-comments/${post?.id}/${post?.message}/${accessToken}`)
                      }
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Posts;
