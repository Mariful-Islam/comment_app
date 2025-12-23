import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFacebookPages } from "@/contexts/FacebookPageContext";
import React, { useEffect, useState } from "react";
import SelectPost from "./SelectPost";

interface SelectPageProps {
  isOpen: boolean;
  onClose: VoidFunction;
  handleSetPost: (post:any)=>void;
}

function SelectPage({ isOpen, onClose, handleSetPost }: SelectPageProps) {
  const [selectedPage, setSelectedPage] = useState<any>(null);

  const { pages, getPagesData } = useFacebookPages();

  const handleSelectPage = (page: any) => {
    setSelectedPage(page);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent>
        {pages && (
          <div className="grid grid-cols-2 gap-4 mt-8">
            {pages?.data?.map((page: any, i: number) => (
              <div
                key={i}
                onClick={() => handleSelectPage(page)}
                className={`p-4 rounded-md cursor-pointer duration-150 border hover:border-blue-500`}
              >
                {page?.name}
              </div>
            ))}
          </div>
        )}

        {selectedPage && (
          <SelectPost
            isOpen={selectedPage ? true : false}
            onClose={() => setSelectedPage(null)}
            onClosePageListModal={onClose}
            selectedPage={selectedPage}
            handleSetPost={handleSetPost}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default SelectPage;
