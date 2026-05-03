"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { withAuth } from "@/hoc/withAuth";
import Layout from "@/layout/Layout";
import { ArrowLeft } from "lucide-react";
import { set } from "mongoose";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useEffect, useState } from "react";

function Posts() {
  const { pageId, pageName, accessToken }: any = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keywordButtonClicked, setKeywordButtonClicked] = useState<any>(null);
  const [commentButtonClicked, setCommentButtonClicked] = useState<any>(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        `https://graph.facebook.com/v23.0/${pageId}/posts?access_token=${accessToken}`,
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
        <h1 className="text-gray-500 mb-2">
          {decodeURIComponent(pageName)}
        </h1>

        {loading ? (
          <div className="mt-10 text-center flex justify-center w-full">
            <Spinner />
          </div>
        ) : posts.length === 0 ? (
          <div className="mt-10 text-center text-gray-500">No posts found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-5">
            {posts.map((post: any, index:number) => (
              <div
                key={post.id}
                className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md relative h-[374px]"
              >
                <Image
                  src={require("@/assets/Untitled-design--32-.png")}
                  alt="Post cover"
                  className="h-50 w-full object-cover rounded-t-xl"
                />
                <div className="p-4">

                  <div className="font-medium mb-2 line-clamp-3">
                    {post.message || "No content available"}
                  </div>

                  <div className="flex justify-between mt-8 absolute bottom-4 left-4 right-4">
                    <Button
                      variant={"outline"}
                      onClick={() =>{
                        router.push(
                          `/dashboard/facebook-keywords/${post?.id}/${post?.message}/${accessToken}`
                        )
                        setKeywordButtonClicked(index);
                      }}
                    >
                      { keywordButtonClicked===index ? <Spinner/> :  'Keywords' }
                    </Button>
                    <Button
                      onClick={() => {
                        router.push(
                          `/dashboard/facebook-comments/${post?.id}/${post?.message}/${accessToken}`
                        )
                        setCommentButtonClicked(index);
                      }}
                    >
                      {commentButtonClicked === index ? <Spinner/> : "Comments"}
                      
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

export default withAuth(Posts);
