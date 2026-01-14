import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CreditCard, ArrowRight, ShieldCheck } from "lucide-react";
import Checkout from "./Checkout";

interface MakePaymentProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

function MakePayment({ isOpen, onClose, data }: MakePaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isOpenCheckout, setIsOpenCheckout] = useState<boolean>(false)

  const paymentMethods = [
    { id: "bkash", name: "bKash", color: "bg-[#D12053]", lightBg: "bg-[#D12053]/10" },
    { id: "nagad", name: "Nagad", color: "bg-[#F7941D]", lightBg: "bg-[#F7941D]/10" },
    { id: "rocket", name: "Rocket", color: "bg-[#8C3494]", lightBg: "bg-[#8C3494]/10" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-112.5 p-0 overflow-hidden border-none shadow-2xl">
        {/* Header Section */}
        <DialogHeader className="p-8 bg-slate-50/50 border-b text-left">
          <div className="flex items-center gap-2 mb-2 text-blue-600">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Secure Checkout</span>
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Complete Payment
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-base">
            Choose your preferred mobile wallet to finalize the upgrade.
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 space-y-6">
          {/* Order Summary Summary (Optional but Premium) */}
          {data && (
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Total Amount</p>
                <p className="text-xl font-bold text-slate-900">৳ {data?.amount || "0.00"} </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase font-semibold">Plan</p>
                <p className="text-sm font-medium text-slate-700">{data?.planName || "Upgrade"}</p>
              </div>
            </div>
          )}

          {/* Payment Method Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Select Payment Method
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`relative flex items-center p-4 rounded-xl border-2 transition-all duration-200 group
                    ${selectedMethod === method.id 
                      ? "border-blue-500 bg-blue-50/30 shadow-md" 
                      : "border-slate-100 hover:border-slate-200 bg-white"}`}
                >
                  <div className={`w-12 h-12 rounded-lg ${method.color} flex items-center justify-center text-white font-bold text-xs shadow-inner transition-transform group-hover:scale-105`}>
                    {/* You can replace these with actual SVG logos later */}
                    {method.name.charAt(0)}
                  </div>
                  
                  <div className="ml-4 text-left">
                    <p className="font-bold text-slate-800 tracking-tight leading-none uppercase">
                      {method.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Instant mobile transfer</p>
                  </div>

                  {selectedMethod === method.id && (
                    <CheckCircle2 className="absolute right-4 w-6 h-6 text-blue-500 fill-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 bg-slate-50 border-t flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1">
                <CreditCard className="w-3 h-3" /> Encrypted
            </span>
            <div className="flex gap-3">
                <Button variant="ghost" onClick={onClose} className="text-slate-500">
                    Back
                </Button>
                <Button 
                    disabled={!selectedMethod}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 shadow-lg shadow-blue-200"
                    onClick={()=>setIsOpenCheckout(!isOpenCheckout)}
                >
                    Pay Now <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>


        {isOpenCheckout && (
          <Checkout
            isOpen={isOpenCheckout}
            onClose={()=>{
              setIsOpenCheckout(false)
              onClose()
            }}
            data={{...data, method: selectedMethod}}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default MakePayment;