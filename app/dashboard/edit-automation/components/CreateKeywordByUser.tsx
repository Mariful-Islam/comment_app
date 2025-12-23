import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useFacebook } from "@/contexts/FacebookContext";
import { useFacebookPages } from "@/contexts/FacebookPageContext";
import { RxCross1 } from "react-icons/rx";

import React, { useEffect, useState } from "react";
import SelectPage from "./SelectPage";

interface CreateKeywordFormProps {
  isOpen: boolean;
  onclose: () => void;
  refreshKeywords: () => void;
}

function CreateKeywordByUser({
  isOpen,
  onclose,
  refreshKeywords,
}: CreateKeywordFormProps) {
  const { user, token } = useFacebook();

  const [post, setPost] = useState<any>(null);

  const [form, setForm] = React.useState({
    userId: user?.id,
    postId: "",
    postMessage: "",
    keyword: "",
    comment: "",
    message: "",
  });

  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (post) {
      setForm((prev: any) => ({
        ...prev,
        postId: post?.id,
        postMessage: post?.message,
      }));
    }
  }, [post]);

  const [loading, setLoading] = React.useState(false);

  const handleSetPost = (post: any) => {
    setPost(post);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/keywords/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // Handle success (e.g., show a success message, close the dialog, etc.)
        onclose();
        refreshKeywords();
        setLoading(false);
        setForm({
          userId: "",
          keyword: "",
          comment: "",
          message: "",
          postId: post?.id,
          postMessage: "",
        });
      } else {
        // Handle error (e.g., show an error message)

        setError(data?.message);
        setLoading(false);
      }
    } catch (error: any) {
      // Handle network or other errors
      setLoading(false);
    }
  };

  const [isOpenPageSelector, setIsOpenPageSelector] = useState<boolean>(false);

  const handlePageSelect = (e: any) => {
    e.preventDefault();
    setIsOpenPageSelector(!isOpenPageSelector);
  };


  const removePost = (e:any) => {
    e.preventDefault()
    setPost(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onclose}>
      <DialogHeader>
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent className="z-[70]">
        <h1 className="text-2xl font-bold mb-4 z-auto">Create Keyword</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div>
              <Button variant={`secondary`} onClick={handlePageSelect}>
                Select Page
              </Button>
            </div>

            {isOpenPageSelector && (
              <SelectPage
                isOpen={isOpenPageSelector}
                onClose={() => setIsOpenPageSelector(false)}
                handleSetPost={handleSetPost}
              />
            )}

            {post && (
              <div className="mt-6">
                <div className="font-bold">Selected Post</div>
                <div className="flex justify-end">
                  <Button variant={`link`} onClick={removePost}><RxCross1 className="text-red-500"/></Button>
                </div>
                <div className="p-4 border border-blue-500 rounded-md w-full ">
                  {post?.message}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Label htmlFor="email">Keyword</Label>
            <Input
              type="text"
              id="keyword"
              placeholder="Keyword"
              name="keyword"
              value={form?.keyword || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-4 mt-6">
            <Label htmlFor="comment">Comment</Label>
            <Input
              type="text"
              id="comment"
              placeholder="comment"
              name="comment"
              value={form?.comment || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-4 mt-6">
            <Label htmlFor="message">Message</Label>
            <Input
              type="text"
              id="message"
              placeholder="Message"
              name="message"
              value={form?.message || ""}
              onChange={handleChange}
            />
          </div>

          {error && <div className="text-red-500 text-sm mt-12">{error}</div>}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant={`outline`}
              onClick={onclose}
              className="mt-8"
            >
              Cancel
            </Button>

            <Button type="submit" className="mt-8">
              {loading ? <Spinner /> : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateKeywordByUser;
