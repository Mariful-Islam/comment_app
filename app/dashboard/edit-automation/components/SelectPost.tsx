import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";

interface SelectPostProps {
  isOpen: boolean;
  onClose: VoidFunction;
  onClosePageListModal: VoidFunction;
  selectedPage: any;
  handleSetPost: (post:any)=>void;
}

function SelectPost({ isOpen, onClose, onClosePageListModal, selectedPage, handleSetPost }: SelectPostProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        `https://graph.facebook.com/v23.0/${selectedPage?.id}/posts?access_token=${selectedPage?.access_token}`,
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
    if (selectedPage) {
      fetchPosts();
    }
  }, [selectedPage]);


  const handleSubmit = () => {
    handleSetPost(selectedPost)
    onClose()
    onClosePageListModal()
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent>
        {posts && (
          <div className="my-6">
            <div className="overflow-auto max-h-[70vh] ">
              {posts?.map((post: any, i: number) => (
                <div
                  key={i}
                  onClick={() => setSelectedPost(post)}
                  className={`p-3 border cursor-pointer hover:border-blue-500 rounded-md duration-150 mx-1 mt-3 ${post?.id===selectedPost?.id ? 'ring-blue-500 ring-2': ''}`}
                >
                  {post?.message}
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-end mt-4 border-t pt-4">
              <Button onClick={onClose} variant={`outline`}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className=""
                disabled={selectedPost ? false : true}
              >
                Select
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default SelectPost;
