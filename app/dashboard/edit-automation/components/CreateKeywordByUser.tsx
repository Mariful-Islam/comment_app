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
import { useUser } from "@/contexts/UserContext";
import { platform } from "os";
import { useInstagram } from "@/contexts/InstagramContext";
import SelectInstaPost from "./SelectInstaPost";

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
  const { user } = useUser();

  const [post, setPost] = useState<any>(null);

  const [form, setForm] = React.useState({
    userId: user?._id,
    post: { id: "", text: "" },
    platform: "",
    keyword: "",
    comments: [""],
    messages: [""],
  });

  const [error, setError] = useState<any>(null);
  const { user: fbUser } = useFacebook();
  const { user: instaUser } = useInstagram();

  useEffect(() => {
    if (post) {
      setForm((prev: any) => ({
        ...prev,
        post: { id: post?.id, text: post?.message || post?.caption },
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
          comments: [""],
          messages: [""],
          post: { id: "", text: "" },
          platform: "",
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
  const [isOpenInstaPostSelector, setIsOpenInstaPostSelector] =
    useState<boolean>(false);

  const handlePageSelect = (e: any) => {
    e.preventDefault();
    setIsOpenPageSelector(!isOpenPageSelector);
  };

  const removePost = (e: any) => {
    e.preventDefault();
    setPost(null);
  };

  // create options for platform selection if both fbUser and instaUser exist
  const platformOptions = [];
  if (fbUser) {
    platformOptions.push("facebook");
  }
  if (instaUser) {
    platformOptions.push("instagram");
  }

  useEffect(() => {
    if (form?.platform === "facebook") {
      setIsOpenPageSelector(true);
    }

    if (form?.platform === "instagram") {
      setIsOpenInstaPostSelector(true);
    }
  }, [form?.platform.length]);


  console.log("form", form);

  return (
    <Dialog open={isOpen} onOpenChange={onclose}>
      <DialogHeader>
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent className="z-70 max-h-screen overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4 z-auto">Create Keyword</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div>
              {platformOptions?.length > 0 && (
                <div className="mb-4">
                  <Label htmlFor="platform">Platform</Label>
                  <select
                    id="platform"
                    name="platform"
                    value={form.platform || ""}
                    onChange={(e) => {
                      e.preventDefault();
                      setForm((prev: any) => ({
                        ...prev,
                        platform: e.target.value,
                      }));
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 mt-4"
                  >
                    <option value="" disabled>
                      Select Platform
                    </option>
                    {platformOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {isOpenPageSelector && (
              <SelectPage
                isOpen={isOpenPageSelector}
                onClose={() => setIsOpenPageSelector(false)}
                handleSetPost={handleSetPost}
              />
            )}

            {isOpenInstaPostSelector && (
              <SelectInstaPost
                isOpen={isOpenInstaPostSelector}
                onClose={() => setIsOpenInstaPostSelector(false)}
                handleSetPost={handleSetPost}
              />
            )}

            {post && (
              <div className="mt-6">
                <div className="font-bold">Selected Post</div>
                <div className="flex justify-end">
                  <Button variant={`link`} onClick={removePost}>
                    <RxCross1 className="text-red-500" />
                  </Button>
                </div>
                <div className="p-4 border border-blue-500 rounded-md w-full ">
                  {form?.platform === "facebook"
                    ? post?.message
                    : post?.caption}
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
            <Label htmlFor="comment">Comments</Label>
  

            {form?.comments &&
              form.comments?.map((cmt: any, idx: number) => (
                <div key={idx} className="mt-2 p-2 bg-gray-100 rounded-md">
                  <Input
                    type="text"
                    placeholder={`Comment ${idx + 1}`}
                    value={cmt}
                    onChange={(e) => {
                      const newComments = [...form.comments];
                      newComments[idx] = e.target.value;
                      setForm((prev: any) => ({
                        ...prev,
                        comments: newComments,
                      }));
                    }}
                  />
                  <Button
                    variant="link"
                    className="text-red-500 mt-2"
                    onClick={(e) => {
                      e.preventDefault();
                      const newComments = form.comments.filter(
                        (_: any, index: number) => index !== idx
                      );
                      setForm((prev: any) => ({
                        ...prev,
                        comments: newComments,
                      }));
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}

            <Button
              variant="outline"
              className="mt-4"
              onClick={(e) => {
                e.preventDefault();
                setForm((prev: any) => ({
                  ...prev,
                  comments: [...prev.comments, ""],
                }));
              }}
            >
              Add Comment
            </Button>
          </div>
          <div className="flex flex-col gap-4 mt-6">
            <Label htmlFor="message">Messages</Label>


            {form?.messages &&
              form.messages?.map((msg: any, idx: number) => (
                <div key={idx} className="mt-2 p-2 bg-gray-100 rounded-md">
                  <Input
                    type="text"
                    placeholder={`Message ${idx + 1}`}
                    value={msg}
                    onChange={(e) => {
                      const newMessages = [...form.messages];
                      newMessages[idx] = e.target.value;
                      setForm((prev: any) => ({
                        ...prev,
                        messages: newMessages,
                      }));
                    }}
                  />
                  <Button
                    variant="link"
                    className="text-red-500 mt-2"
                    onClick={(e) => {
                      e.preventDefault();
                      const newMessages = form.messages.filter(
                        (_: any, index: number) => index !== idx
                      );
                      setForm((prev: any) => ({
                        ...prev,
                        messages: newMessages,
                      }));
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            <Button
              variant="outline"
              className="mt-4"
              onClick={(e) => {
                e.preventDefault();
                setForm((prev: any) => ({
                  ...prev,
                  messages: [...prev.messages, ""],
                }));
              }}
            >
              Add Message
            </Button>
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
