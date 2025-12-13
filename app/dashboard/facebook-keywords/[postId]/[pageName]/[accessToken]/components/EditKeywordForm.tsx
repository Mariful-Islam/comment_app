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

function EditKeywordForm({postId, isOpen, onClose, data, refreshKeywords }: EditKeywordFormProps) {

  const [form, setForm] = React.useState({ postId: postId, keyword: data?.getValue('keyword'), comment: data?.getValue('comment'), message: data?.getValue('message') });

  const [loading, setLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const id = data?.getValue('_id');

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
        setForm({ keyword: "", comment: "", message: "", postId: postId });

      } else {
        // Handle error (e.g., show an error message)
        setLoading(false);
      }
    } catch (error) {
      // Handle network or other errors
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogHeader>
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent className="z-[70]">
        <h1 className="text-2xl font-bold mb-4">Edit Keyword</h1>

        <form onSubmit={handleSubmit} >
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

          <div className="flex justify-end gap-3">
            <Button type="button" variant={`outline`} onClick={onClose} className="mt-8">Cancel</Button>

            <Button type="submit" className="mt-8">{loading ? <Spinner/> : 'Update'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditKeywordForm;
