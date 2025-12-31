"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useInstagram } from "@/contexts/InstagramContext";
import { useInstagramPost } from "@/contexts/InstagramPostContext";
import Layout from "@/layout/Layout";
import { ArrowLeft, RefreshCw } from "lucide-react";
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
  const router = useRouter();
  const pathname = usePathname();

  const {user} = useInstagram()

  const [keywordButtonClicked, setKeywordButtonClicked] = useState<any>(null);
  const [commentButtonClicked, setCommentButtonClicked] = useState<any>(null);

  const {posts, fetchPosts, loading} = useInstagramPost()

  return (
    <Layout>
      <div className="max-w-300 mx-auto mt-5">
        <div
          className="flex items-center justify-between gap-2 mb-4"
          // onClick={() => router.back()}
        >
          {/* <span className="px-2 py-1 hover:bg-gray-200 rounded-lg duration-150">
            <ArrowLeft className="h-5 w-5 " />
          </span> */}
          <h1 className="text-xl font-bold">Posts</h1>

          <Button variant={`outline`} onClick={fetchPosts} disabled={loading} className="animate-spin-slow">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <h1 className="text-gray-500 mb-2">
          {decodeURIComponent(user?.username)}
        </h1>

        {loading ? (
          <div className="mt-10 text-center flex justify-center w-full">
            <Spinner />
          </div>
        ) : posts?.length === 0 ? (
          <div className="mt-10 text-center text-gray-500">No posts found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-5">
            {posts.map((post: any, index:number) => (
              <div
                key={post.id}
                className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md relative h-93.5"
              >
                <img
                  src={post?.media_url}
                  alt="Post cover"
                  className="h-50 w-full object-cover rounded-t-xl"
                />
                <div className="p-4">

                  <div className="font-medium mb-2 line-clamp-3">
                    {post?.caption || "No content available"}
                  </div>

                  <div className="flex justify-between mt-8 absolute bottom-4 left-4 right-4">
                    {/* <Button
                      variant={"outline"}
                      onClick={() =>{
                        router.push(
                          `/dashboard/facebook-keywords/${post?.id}/${post?.message}/${accessToken}`
                        )
                        setKeywordButtonClicked(index);
                      }}
                    >
                      { keywordButtonClicked===index ? <Spinner/> :  'Keywords' }
                    </Button> */}
                    <Button
                      onClick={() => {
                        router.push(
                          `/dashboard/instagram/posts/${post?.id}/comments`
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

export default Posts;
