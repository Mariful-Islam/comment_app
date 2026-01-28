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
import { Eye, EyeOff, Command, Chrome, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import icon from '@/assets/icon.png';

function Signup() {
  const [form, setForm] = React.useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = React.useState(false);
  
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

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
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, name: form?.email?.split('@')[0] }),
      });

      const data = await res.json();

      if (res.ok) {
        setForm({ email: "", password: "" });
        localStorage.setItem("email", form?.email || "");
        toast.success("Account created successfully!");
        router.push("/login");
      } else {
        toast.error(data?.error || "Signup unsuccessful...");
      }
    } catch (error) {
      toast.error("Error during signup. Please try again.");
    } finally {
      setLoading(false);
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
             <div className="w-10 h-10 rounded-full flex items-center justify-center mb-6">
                {/* <Command className="text-white w-5 h-5" /> */}
                <Image src={icon} alt="App Icon" width={40} height={40} className="absolute"/>
                
             </div>
             <h1 className="text-3xl font-medium tracking-tight">Create Account</h1>
             <p className="text-slate-500 text-sm">Join the automation revolution today.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Email Address</Label>
              <Input
                type="email"
                placeholder="name@company.com"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="border-0 border-b border-slate-200 rounded-none px-4 shadow-none focus-visible:ring-0 focus-visible:border-blue-600 transition-colors placeholder:text-slate-300 h-10"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  name="password"
                  value={form.password}
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
              className="w-full bg-slate-900 hover:bg-blue-600 text-white h-11 rounded-full text-sm font-medium transition-all shadow-lg shadow-slate-200 hover:shadow-blue-200"
            >
              {loading ? <Spinner className="w-4 h-4" /> : "Get Started"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-300 font-medium">Or</span></div>
          </div>

          <Button
            variant="outline"
            type="button"
            className="w-full h-11 border-slate-200 rounded-full flex gap-3 text-sm font-medium hover:bg-slate-50 text-slate-600 hover:text-slate-700 transition-colors"
          >
            <Chrome className="w-4 h-4 text-slate-600" />
            Sign up with Google
          </Button>

          <p className="text-center text-xs text-slate-400">
            Already have an account? <Link href="/login" className="text-blue-600 font-semibold hover:underline underline-offset-4">Log in</Link>
          </p>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE: FEATURE ACCENT --- */}
      <div className="hidden lg:flex flex-1 bg-slate-50 items-center justify-center p-12">
         <div className="max-w-md space-y-6">
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
               <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-600" />
               </div>
               <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest">7-Day Free Trial Included</p>
            </div>
            <h2 className="text-4xl font-medium tracking-tight leading-tight">
               Build your <span className="text-blue-600 italic">community</span> <br /> 
               on autopilot.
            </h2>
            <p className="text-slate-500 leading-relaxed font-medium">
              Join 1,000+ businesses automating their social media engagement with Comment To DM.
            </p>
         </div>
      </div>
    </div>
  );
}

export default Signup;