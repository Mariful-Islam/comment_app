"use client"
import React, { useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";

function FacebookToken() {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const {data: session}:any = useSession()

  const handleCopyToken = () => {

    if (session) {
      navigator.clipboard.writeText(session?.accessToken);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1000);

      toast.success("Facebook Access Token copied to clipboard!");
    } else {
      toast.error("No token found to copy.");
    }
  };

  if(!session){
    return null
  }



  return (
    <div className="mt-8 border border-gray-200 p-4 rounded-lg shadow-md">
      <h1 className="text-lg font-bold mb-4">Facebook Token</h1>

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          name="token"
          value={session?.accessToken || "No token found"}
          readOnly
          className="pr-[64px]"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-6 top-1/2 -translate-y-1/2 "
          onClick={handleCopyToken}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 "
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default FacebookToken;
