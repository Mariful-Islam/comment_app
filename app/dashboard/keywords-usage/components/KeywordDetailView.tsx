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
        <div className="p-4 space-y-4 mx-auto w-full max-w-md">
          <div>
            <h2 className="text-lg font-semibold">Keyword:</h2>
            <p>{data?.keyword?.text || "N/A"}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Target Name:</h2>
            <p>{data?.target?.name || "N/A"}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Post ID:</h2>
            <p>{data?.postId || "N/A"}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Date Used:</h2>
            <p>{new Date(data?.createdAt).toLocaleString() || "N/A"}</p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default KeywordDetailView;
