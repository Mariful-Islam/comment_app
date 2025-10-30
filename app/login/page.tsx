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
import { auth, facebookProvider, provider } from "@/lib/firebase";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import Image from "next/image";


function Login() {
  const [form, setForm] = React.useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const { isAuthenticated, isLoading } = useAuth();

  const { fetchUser } = useUser();


  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/"); // Redirect to home if already logged in
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading || isAuthenticated) return null; // prevent flicker

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data?.token);
        localStorage.setItem("email", form?.email || "");

        setForm({ email: "", password: "" });

        toast.success("Successfully logged in...");
        router.refresh();
        router.replace("/");
      } else {
        toast.error(data?.error || "Login unsuccessful...");
      }
    } catch (error) {
      toast.error("Error during Login:");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
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
          await fetchUser();
        }


        localStorage.setItem("token", token);
        localStorage.setItem("email", userData.email);

        toast.success("Successfully logged in!");
        router.refresh();
        router.replace("/");
        
      }else {

        // Save token and email to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("email", userData.email);

        toast.success("Successfully logged in!");
        router.refresh();
        router.replace("/");
      }
    } catch (error) {
      toast.error("Failed to sign in with Google. Please try again.");
    }
  };





  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="flex flex-col gap-4 p-8 border rounded-lg shadow-lg">
        <h1 className="text-blue-500 font-bold text-center">
          Welcome to Comment Automation App
        </h1>
        <h1 className="text-2xl font-bold mb-4 text-center">Log In</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              name="email"
              value={form?.email || ""}
              onChange={handleChange}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="password">Password</Label>

            <div className="relative flex items-center">
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Password"
                name="password"
                value={form?.password || ""}
                onChange={handleChange}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2"
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

          <Button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            login
            {loading && <Spinner className="ml-2" variant="circle" />}
          </Button>
        </form>
        <div className="flex items-center gap-2">
          <div className="h-px bg-gray-300 flex-grow"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="h-px bg-gray-300 flex-grow"></div>
        </div>

        <Button
          type="button"
          className="border border-gray-300 bg-white  text-gray-500 p-2 rounded hover:bg-gray-200 flex items-center justify-center gap-2"
          onClick={handleSignIn}
        >
          <Image src={require('@/assets/google-logo.png')} alt="Google Logo" className="w-4 h-4" />

          Sign Up with Google
        </Button>



        <div className="text-sm text-gray-600 flex justify-center gap-3">
          Not an account ?
          <Link
            href="/signup"
            className="text-blue-500 hover:underline hover:text-blue-700"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
