import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useFacebook } from "@/contexts/FacebookContext";
import { useFacebookPages } from "@/contexts/FacebookPageContext";
import { useInstagram } from "@/contexts/InstagramContext";
import { Facebook, Instagram, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MakePayment from "./MakePayment";

interface UpgradePlanProps {
  isOpen: boolean;
  onClose: VoidFunction;
}

function UpgradePlan({ isOpen, onClose }: UpgradePlanProps) {
  const { user: fbUser } = useFacebook();
  const { pages } = useFacebookPages();
  const { user: instaUser } = useInstagram();
  const [isSelected, setIsSelected] = useState<string | null>(null);
  const [selectedInstaUser, setSelectedInstaUser] = useState<any | null>(null)
  const [selectedFbPage, setSelectedFbPage] = useState<any | null>(null)
  const [isOpenPayment, setIsOpenPayment] = useState<boolean>(false)


  const platformOptions = [
    { id: "facebook", name: "Facebook", icon: <Facebook className="w-5 h-5 text-blue-600" />, enabled: !!fbUser },
    { id: "instagram", name: "Instagram", icon: <Instagram className="w-5 h-5 text-pink-600" />, enabled: !!instaUser },
  ].filter(p => p.enabled);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125 p-0 overflow-hidden border-none shadow-2xl dark:bg-slate-800">
        {/* Header Section with Gradient Background */}
        <DialogHeader className="p-8 bg-slate-50/50 border-b dark:bg-slate-700">
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">Upgrade Your Plan</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-300 text-base">
            Select the platform and account you want to boost today.
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 space-y-8">
          {/* Platform Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Step 1: Choose Platform</h3>
            <div className="grid grid-cols-2 gap-4">
              {platformOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setIsSelected(opt.id)}
                  className={`relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 group
                    ${isSelected === opt.id 
                      ? "border-blue-500 bg-blue-50/30 shadow-md" 
                      : "border-slate-100 hover:border-slate-200 bg-white dark:bg-slate-700 hover:dark:bg-slate-600"}`}
                >
                  <div className={`p-3 rounded-full mb-3 transition-transform group-hover:scale-110 ${isSelected === opt.id ? "bg-white dark:bg-slate-700 shadow-sm" : "bg-slate-50"}`}>
                    {opt.icon}
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-100 capitalize">{opt.name}</span>
                  {isSelected === opt.id && (
                    <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-blue-500 fill-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Account/Page Selection */}
          {isSelected && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Step 2: Select {isSelected === "facebook" ? "Page" : "Account"}
              </h3>
              
              <div className="space-y-2 max-h-50 overflow-y-auto pr-2 custom-scrollbar">
                {isSelected === "instagram" && instaUser && (
                  <div className={`flex items-center justify-between p-4 rounded-lg border border-slate-100 bg-slate-50 dark:bg-slate-700 ${instaUser?.id === selectedInstaUser?.id ? 'border-slate-400' : ''}`} onClick={()=>setSelectedInstaUser(instaUser)}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm" />
                      <span className="font-medium text-slate-700 dark:text-slate-50">@{instaUser.username}</span>
                    </div>
                    <div className={`h-4 w-4 rounded-full border-4 ${instaUser?.id === selectedInstaUser?.id ? 'border-blue-500' : 'border-slate-200' } `} />
                  </div>
                )}

                {isSelected === "facebook" && pages?.data?.map((page: any, i: number) => (
                  <div 
                    key={i} 
                    className={`${page?.id === selectedFbPage?.id ? 'border-slate-400' : ''} flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:bg-slate-50 dark:hover:bg-slate-600 cursor-pointer transition-colors`}
                    onClick={()=>setSelectedFbPage(page)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {page?.name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-700 dark:text-slate-100">{page?.name}</span>
                    </div>
                    <div className={`h-5 w-5 rounded-full border-2 ${page?.id === selectedFbPage?.id ? 'border-blue-500 border-4' : 'border-slate-200'}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800 border-t flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} className="text-slate-500">
            Cancel
          </Button>
          <Button 
            disabled={!isSelected || 
                      (isSelected === "facebook" && !selectedFbPage) || 
                      (isSelected === "instagram" && !selectedInstaUser)
                    }
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 transition-all hover:gap-3 gap-2"
            onClick={()=>setIsOpenPayment(!isOpenPayment)}
          >
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </div>


        {isOpenPayment && (
          <MakePayment
            isOpen={isOpenPayment}
            onClose={()=>{
              setIsOpenPayment(!isOpenPayment)
              onClose()
            }}
            data={{selectedFbPage, selectedInstaUser, amount: 299.00 }}
            
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default UpgradePlan;