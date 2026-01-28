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

import React from "react";

interface EditKeywordFormProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  data: any;
  refreshKeywords: () => void;
}

function EditKeywordFormByUser({
  postId,
  isOpen,
  onClose,
  data,
  refreshKeywords,
}: EditKeywordFormProps) {
  const [form, setForm] = React.useState({
    postId: postId,
    keyword: data?.keyword,
    comments: data?.comments,
    messages: data?.messages,
  });

  const [loading, setLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const id = data?._id;

    try {
      const res = await fetch(`/api/keywords/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // Handle success (e.g., show a success message, close the dialog, etc.)
        onClose();
        refreshKeywords();
        setLoading(false);
        setForm({
          keyword: "",
          comments: [""],
          messages: [""],
          postId: postId,
        });
      } else {
        // Handle error (e.g., show an error message)
        setLoading(false);
      }
    } catch (error) {
      // Handle network or other errors
      setLoading(false);
    }
  };


  console.log("Form Data:", form);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>

      <DialogContent className="z-70 max-h-screen overflow-y-auto bg-white dark:bg-slate-700">
        <h1 className="text-2xl font-bold mb-4">Edit Keyword</h1>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <Label htmlFor="email">Keyword</Label>
            <Input
              type="text"
              id="keyword"
              placeholder="Keyword"
              name="keyword"
              value={form?.keyword || ""}
              onChange={handleChange}
              className=""
            />
          </div>
          <div className="flex flex-col gap-4 mt-6">
            <Label htmlFor="comment">Comments</Label>
            {/* <Input
              type="text"
              id="comment"
              placeholder="comment"
              name="comment"
              value={form?.comment || ""}
              onChange={handleChange}
            /> */}
            {form?.comments &&
              form.comments?.map((cmt: any, idx: number) => (
                <div key={idx} className="mt-2 p-2 bg-gray-100 dark:bg-slate-800 rounded-md">
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
                    className=""
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
            {/* <Input
              type="text"
              id="message"
              placeholder="Message"
              name="message"
              value={form?.message || ""}
              onChange={handleChange}
            /> */}
            {form?.messages &&
              form.messages?.map((msg: any, idx: number) => (
                <div key={idx} className="mt-2 p-2 bg-gray-100 dark:bg-slate-800 rounded-md">
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
                    className=" "
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

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant={`outline`}
              onClick={onClose}
              className="mt-8"
            >
              Cancel
            </Button>

            <Button type="submit" className="mt-8">
              {loading ? <Spinner /> : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditKeywordFormByUser;
