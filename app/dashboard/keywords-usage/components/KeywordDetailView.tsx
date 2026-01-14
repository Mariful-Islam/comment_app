import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import React from "react";

interface KeywordDetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

function KeywordDetailView({ isOpen, onClose, data }: KeywordDetailViewProps) {
  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent title="Keyword Usage Detail">
        <DrawerHeader>
          <DrawerTitle>
            <h2 className="text-xl font-semibold">Keyword Usage Detail</h2>
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-6 space-y-6 mx-auto min-w-100">
          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              Keyword
            </p>
            <p className="text-lg font-medium text-gray-900 mt-1">
              {data?.keyword?.text || "—"}
            </p>
          </div>
          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              Target
            </p>
            <p className="text-lg font-medium text-gray-900 mt-1">
              {data?.target?.name || "—"}
            </p>
          </div>
          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              Post ID
            </p>
            <p className="text-lg font-medium text-gray-900 mt-1">
              {data?.postId || "—"}
            </p>
          </div>
          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              Comment Reply
            </p>
            <p className="text-lg font-medium text-gray-900 mt-1">
              {data?.commentReply || "—"}
            </p>
          </div>
          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              Message Reply
            </p>
            <p className="text-lg font-medium text-gray-900 mt-1">
              {data?.messageReply || "—"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              Date Used
            </p>
            <p className="text-lg font-medium text-gray-900 mt-1">
              {data?.createdAt
                ? new Date(data.createdAt).toLocaleString()
                : "—"}
            </p>
          </div>

          <Button onClick={onClose} variant={`outline`} className="w-full">
            Close
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default KeywordDetailView;
