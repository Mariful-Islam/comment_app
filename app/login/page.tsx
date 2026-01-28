"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import { Eye, EyeOff, Zap, Chrome, ShieldCheck, Command } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import Image from "next/image";
import icon from '@/assets/icon.png';

function Login() {
  const [form, setForm] = React.useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = React.useState(false);
  
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { fetchUser } = useUser();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading || isAuthenticated) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        const decodedData: any = jwtDecode(data.token);
        localStorage.setItem("token", data?.token);
        localStorage.setItem("email", form?.email || "");
        Cookies.set("userId", decodedData?.userId || "");
        setForm({ email: "", password: "" });
        toast.success("Welcome back!");
        router.refresh();
        router.replace("/");
      } else {
        toast.error(data?.error || "Login unsuccessful");
      }
    } catch (error) {
      toast.error("Error during Login");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    // ... logic remains exactly as your original code
        try {
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      const token = await user.getIdToken();

      const userData = {
        name: user.displayName || "",
        email: user.email || "",
        password: token, // Using token as password for backend auth
        imageUrl: user.photoURL || "",
        authProvider: "google",
      };

      const res = await fetch(`/api/user?email=${userData.email}`);
      const data = await res.json();

      if (data?.error === "User not found") {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Server responded with ${res.status}: ${errorText}`);
        }

        const responseData = await res.json(); // You can use this data as needed

        if(responseData){
          fetchUser();
        }


        localStorage.setItem("token", token);
        localStorage.setItem("email", userData.email);
        localStorage.setItem("userId", responseData?._id || "");
        Cookies.set("userId", responseData?._id || "");


        

        toast.success("Successfully logged in!");
        router.refresh();
        router.replace("/");
        
      }else {

        // Save token and email to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("email", userData.email);
        Cookies.set("userId", data?._id || "");

        toast.success("Successfully logged in!");
        router.refresh();
        router.replace("/");
      }
    } catch (error) {
      toast.error("Failed to sign in with Google. Please try again.");
    }
  };


  return (
    <div className="min-h-screen w-full flex flex-row-reverse bg-white font-sans antialiased text-slate-900">
      
      {/* --- LEFT SIDE: THE FORM --- */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 lg:px-24">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm space-y-10"
        >
          {/* Minimal Brand Mark */}
          <div className="space-y-2">
             <div className="w-10 h-10  rounded-full flex items-center justify-center mb-6">
                {/* <Command className="text-white w-5 h-5" /> */}
                <Image src={icon} alt="App Icon" width={40} height={40} className="absolute"/>
             </div>
             <h1 className="text-3xl font-medium tracking-tight">Sign in</h1>
             <p className="text-slate-500 text-sm">Use your email or Google to continue.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Email</Label>
              <Input
                type="email"
                placeholder="email@address.com"
                name="email"
                onChange={handleChange}
                className="border-0 border-b border-slate-200 rounded-none px-4 shadow-none focus-visible:ring-0 focus-visible:border-blue-600 transition-colors placeholder:text-slate-300 h-10"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <Label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Password</Label>
                <Link href="#" className="text-[11px] text-slate-400 hover:text-blue-600 underline-offset-4 hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  name="password"
                  onChange={handleChange}
                  className="border-0 border-b border-slate-200 rounded-none px-4 shadow-none focus-visible:ring-0 focus-visible:border-blue-600 transition-colors placeholder:text-slate-300 h-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white h-11 rounded-full text-sm font-medium transition-all"
            >
              {loading ? <Spinner className="w-4 h-4" /> : "Continue"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-300 font-medium">Or</span></div>
          </div>

          <Button
            variant="outline"
            className="w-full h-11 border-slate-200 rounded-full flex gap-3 text-sm font-medium hover:bg-slate-100 text-slate-700 hover:text-slate-600 transition-colors"
            onClick={handleSignIn}
          >
            <Chrome className="w-4 h-4 text-slate-600 hover:text-slate-700" />
            Sign in with Google
          </Button>

          <p className="text-center text-xs text-slate-400">
            Don't have an account? <Link href="/signup" className="text-blue-600 font-semibold hover:underline underline-offset-4">Sign up for free</Link>
          </p>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE: CLEAN ACCENT (HIDDEN ON MOBILE) --- */}
      <div className="hidden lg:flex flex-1 bg-slate-50 items-center justify-center p-12">
         <div className="max-w-md space-y-4">
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 animate-pulse">
               <div className="w-2 h-2 bg-emerald-500 rounded-full" />
               <p className="text-xs font-medium text-slate-600 uppercase tracking-widest">Automation Engine Active</p>
            </div>
            <h2 className="text-4xl font-medium tracking-tight leading-tight">
               Turn every comment <br /> 
               into a <span className="text-blue-600 italic">conversation.</span>
            </h2>
         </div>
      </div>
    </div>
  );
}

export default Login;