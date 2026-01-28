import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, CheckCircle2, Info, Loader2 } from "lucide-react";

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    amount: number;
    method: "bkash" | "nagad" | "rocket";
    selectedFbPage: any;
    selectedInstaUser: any;
  };
}

function Checkout({ isOpen, onClose, data }: CheckoutProps) {
  const [trxId, setTrxId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinish = async () => {
    setIsSubmitting(true);
    // Simulate API Call
    const res = await fetch(`/api/subscriptions`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        payment: {
          method: data?.method,
          amount: data?.amount,
          trxId: trxId
        },
        instagram: data?.selectedInstaUser,
        facebook: data?.selectedFbPage
      })
    })
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 2000);
  };

  const methodColors = {
    bkash: "bg-[#D12053]",
    nagad: "bg-[#F7941D]",
    rocket: "bg-[#8C3494]",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-112.5 p-0 overflow-hidden border-none shadow-2xl ">
        {/* Header with Method Branding */}
        <DialogHeader className={`p-8 text-white ${data.method ? methodColors[data.method] : 'bg-slate-900'}`}>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-bold">Checkout</DialogTitle>
              <DialogDescription className="text-white/80 mt-1">
                Complete your payment via {data.method}
              </DialogDescription>
            </div>
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md uppercase font-bold text-xs tracking-widest">
              {data.method}
            </div>
          </div>
        </DialogHeader>

        <div className="p-8 space-y-6 bg-white dark:bg-slate-700">
          {/* Summary Card */}
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-dashed border-slate-200">
              <span className="text-slate-500 dark:text-slate-100 text-sm">Target Account</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 tracking-tight">
                {data.selectedInstaUser ? `@${data.selectedInstaUser.username}` : data.selectedFbPage?.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-200 text-sm">Total Payable</span>
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100">৳ {data.amount}</span>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-1 rounded">
                <Info className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xs text-slate-600 leading-relaxed">
                Please send <strong>৳ {data.amount}</strong> to our merchant number 
                <span className="mt-1 font-mono font-bold text-slate-800 text-sm flex items-center gap-2">
                  01XXXXXXXXX <Copy className="w-3 h-3 cursor-pointer hover:text-blue-500" />
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Input */}
          <div className="space-y-3">
            <Label htmlFor="trxId" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
              Transaction ID
            </Label>
            <Input 
              id="trxId"
              placeholder="Enter TrxID (e.g. 8N7A6D5E)" 
              className="h-12 border-slate-200 focus:ring-blue-500 focus:border-blue-500"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
            />
            <p className="text-[10px] text-slate-400 italic">
              * Found in your SMS or {data.method} app history after payment.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 dark:bg-slate-700 border-t flex flex-col gap-3">
          <Button 
            onClick={handleFinish}
            disabled={!trxId || isSubmitting}
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
              </>
            ) : (
              "Confirm Payment"
            )}
          </Button>
          <Button variant="ghost" onClick={onClose} className="text-slate-400 text-xs">
            Cancel and go back
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Checkout;