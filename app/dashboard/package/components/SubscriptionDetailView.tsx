import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import moment from "moment";

import React from "react";

interface KeywordDetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

function SubscriptionDetailView({
  isOpen,
  onClose,
  data,
}: KeywordDetailViewProps) {

  
  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerHeader>
        <DrawerTitle></DrawerTitle>
        <DrawerDescription></DrawerDescription>
      </DrawerHeader>
      <DrawerContent>
        <div className="p-6 space-y-3 mx-auto min-w-100">
          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              Subscription ID
            </p>
            <p className="text-md font-medium text-gray-900 mt-1">
              {data?.target?.id}
            </p>
          </div>
          {data?.platform === "facebook" ? (
            <div className="border-b pb-4">
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Page Name
              </p>
              <p className="text-md font-medium text-gray-900 mt-1">
                {data?.target?.name}
              </p>
            </div>
          ) : (
            <div className="border-b pb-4">
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Username
              </p>
              <p className="text-md font-medium text-gray-900 mt-1">
                @{data?.target?.name}
              </p>
            </div>
          )}
          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              Subscribed Date
            </p>
            <p className="text-md font-medium text-gray-900 mt-1">
              {moment(data?.startDate).format("HH:MM:SS A, DD-MMMM-YYYY")}
            </p>
          </div>
          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              Subscription Expire Date
            </p>
            <p className="text-md font-medium text-gray-900 mt-1">
              {moment(data?.endDate).format("HH:MM:SS A, DD-MMMM-YYYY")}
            </p>
          </div>
          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              Is Paid
            </p>
            <p className="text-md font-medium text-gray-900 mt-1">
              {data?.isPaid ? (
                <div className="text-green-600 bg-green-50 rounded-md px-6 py-1.25 uppercase text-center">
                  Paid
                </div>
              ) : (
                <div className="text-red-600 bg-red-50 rounded-md px-6 py-1.25 uppercase text-center">
                  Unpaid
                </div>
              )}
            </p>
          </div>
          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              Payment Date
            </p>
            <p className="text-md font-medium text-gray-900 mt-1">
              {moment(data?.payment?.paidAt).format("HH:MM:SS A, DD-MMMM-YYYY")}
            </p>
          </div>
          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              Payment Method
            </p>
            <p className="text-md font-medium text-gray-900 mt-1">
              {data?.payment?.method}
            </p>
          </div>
          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              Amount
            </p>
            <p className="text-md font-medium text-gray-900 mt-1">
              {data?.payment?.amount} TK
            </p>
          </div>

           <div className="border-b pb-4">
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              TRX ID
            </p>
            <p className="text-md font-medium text-gray-900 mt-1">
              {data?.payment?.trxId}
            </p>
          </div>

        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default SubscriptionDetailView;
