import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInstagramPost } from "@/contexts/InstagramPostContext";
import React, { useEffect, useState } from "react";


interface SelectPostProps {
  isOpen: boolean;
  onClose: VoidFunction;
  handleSetPost: (post:any)=>void;
}


function SelectInstaPost({ isOpen, onClose, handleSetPost }: SelectPostProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const { posts, fetchPosts } = useInstagramPost()


  const handleSubmit = () => {
    handleSetPost(selectedPost);
    onClose();
  };

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
                  className={`p-3 border cursor-pointer hover:border-blue-500 rounded-md duration-150 mx-1 mt-3 ${
                    post?.id === selectedPost?.id ? "ring-blue-500 ring-2" : ""
                  }`}
                >
                  {post?.caption}
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

export default SelectInstaPost;
