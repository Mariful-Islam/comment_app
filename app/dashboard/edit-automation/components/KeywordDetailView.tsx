import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Minus, Plus } from "lucide-react";
import React from "react";

interface KeywordDetailViewProps {
  isOpen: boolean;
  onClose: VoidFunction;
  data: any;
}

function KeywordDetailView({ isOpen, onClose, data }: KeywordDetailViewProps) {

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="dark:bg-slate-700">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle></DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-6">
            <div className="mt-3 h-100">
              <div className="max-w-md border rounded-lg shadow-sm p-4 bg-white dark:bg-slate-800">
                {/* Header: Platform & Status */}
                <div className="flex justify-between items-center mb-3">
                  <span
                    className={`uppercase text-xs font-bold tracking-wider ${
                      data?.platform === "facebook"
                        ? "text-blue-600"
                        : "text-pink-500"
                    } `}
                  >
                    {data?.platform}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      data?.isActive
                        ? "bg-green-100 dark:bg-green-700 text-green-700 dark:text-slate-100"
                        : "bg-gray-100 dark:bg-gray-500 text-gray-500 dark:text-slate-100"
                    }`}
                  >
                    {data?.isActive ? "● Active" : "● Inactive"}
                  </span>
                </div>

                {/* Post Context */}
                <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded text-sm text-gray-600 dark:text-gray-100 mb-3 italic">
                  " {data?.post?.text.substring(0, 60)}... "
                </div>

                {/* The Actual Comment */}
                <div className="mb-4 text-sm sm:text-md">
               
                  <div className="text-gray-400 font-medium flex items-center justify-between">
                    Keyword: <span className="text-gray-800 dark:text-slate-100">{data?.keyword}</span>
                  </div>
                  <div className="text-gray-400 font-medium flex items-center justify-between border-t my-2 py-2">
                    Comment Reply: <span className="text-gray-800 dark:text-slate-100">{data?.comments?.map((cmt: string, i: number)=>(
                      <div key={i} className="">{i+1}. {cmt}</div>
                    ))}</span>
                  </div>
                  <div className="text-gray-400 font-medium flex items-center justify-between border-t my-2 py-2">
                    Message Reply: <span className="text-gray-800 dark:text-slate-100">{data?.messages?.map((msg: string, i:number)=>(
                      <div key={i}>{i+1}. {msg}</div>
                    ))}</span>
                  </div>
                  <div className="text-gray-400 font-medium flex items-center justify-between border-t my-2 py-2">
                    Reply Count: <span className="text-gray-800 dark:text-slate-100">{data?.count}</span>
                  </div>
                </div>

                {/* Footer: User & Time */}
                <div className="flex justify-between items-center border-t pt-3 text-xs text-gray-500 dark:text-slate-300">
                  <span>User: {data?.userId}</span>
                  <span>
                    {new Date(data?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default KeywordDetailView;
