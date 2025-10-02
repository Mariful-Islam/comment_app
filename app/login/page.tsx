"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { toast } from "sonner";
import { FaGoogle } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { signInWithPopup } from "firebase/auth";
import { auth, facebookProvider, provider } from "@/lib/firebase";

function Login() {
  const [form, setForm] = React.useState({ email: "", password: "" });

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/"); // Redirect to home if already logged in
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading || isAuthenticated) return null; // prevent flicker

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  console.log("Form data:", form);

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
        toast.error("Login unsuccessful...");
      }
    } catch (error) {
      console.error("Error during signup:", error);
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

      console.log("Google user data:", userData);

      const isUserExist = await fetch("/api/user" + `?email=${userData.email}`);

      console.log("Is user exist:", isUserExist);

      if (!isUserExist) {

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
      }

      
      // Save token and email to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("email", userData.email);

      toast.success("Successfully logged in!");
      router.refresh();
      router.replace("/");
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      toast.error("Failed to sign in with Google. Please try again.");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result?.user;
      console.log("Facebook user:", user);
      // You can send the token to your backend here
    } catch (error) {
      console.error("Facebook login error:", error);
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
            <Input
              type="password"
              id="password"
              placeholder="Password"
              name="password"
              value={form?.password || ""}
              onChange={handleChange}
            />
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
          <FaGoogle />
          Sign Up with Google
        </Button>

        <Button
          type="button"
          className="border border-gray-300 bg-white  text-gray-500 p-2 rounded hover:bg-gray-200 flex items-center justify-center gap-2"
          onClick={handleFacebookLogin}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54v-2.89h2.54v-2.203c0-2.506 1.492-3.89 3.777-3.89  
1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.876h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"
              clipRule="evenodd"
            />
          </svg>
          Sign Up with Facebook
        </Button>

        <p className="text-sm text-gray-600 flex justify-center gap-3">
          Not an account ?
          <Link
            href="/signup"
            className="text-blue-500 hover:underline hover:text-blue-700"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
