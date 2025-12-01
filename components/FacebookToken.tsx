"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { useFacebook } from "@/contexts/FacebookContext";

function FacebookToken() {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user, token } = useFacebook();

  console.log("FacebookToken component - user:", user);
  console.log("FacebookToken component - token:", token);

  const handleCopyToken = () => {
    if (user && token) {
      navigator.clipboard.writeText(token);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1000);

      toast.success("Facebook Access Token copied to clipboard!");
    } else {
      toast.error("No token found to copy.");
    }
  };

  const getSessionData = async () => {
    try {
      const res = await fetch(`/api/auth/facebook/token`, {
        method: "GET",
      });

      const session: any = await res.json();

      console.log("Facebook session token:", session);

      if (session) {
        localStorage.setItem("facebookAccessToken", session?.fb_access_token);

        const res = await fetch(`/api/facebook`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: localStorage.getItem("email"),
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            // expires: session.expires,
            accessToken: session?.accessToken,
          }),
        });

        const data = await res.json();
        toast.success(data?.message);
      }
    } catch (error) {
      console.error("Facebook login error:", error);
      toast.error("Failed to sign in with Facebook. Please try again.");
    }
  };

  useEffect(() => {
    getSessionData();
  }, []);

  if (!token) {
    return null;
  }

  return (
    <div className="mt-8 border border-gray-200 p-4 rounded-lg shadow-md">
      <h1 className="text-lg font-bold mb-4">Facebook Token</h1>

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          name="token"
          value={token || "No token found"}
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
