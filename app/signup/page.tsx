"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { toast } from "sonner";
import { FaGoogle } from "react-icons/fa6";
import { useRouter } from "next/navigation";



function Signup() {
  const [form, setForm] = React.useState({ email: "", password: "" });

  const [loading, setLoading] = React.useState(false);
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setForm({ email: "", password: "" });
        localStorage.setItem("token", data?.token)

        toast.success("Account created successfully...")

        router.push('/login')

      } else {
        toast("Event has been created.");
        toast.error("Account created unsuccessful...")

      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("Error during signup:");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="flex flex-col gap-4 p-8 border rounded-lg shadow-lg">
        <h1 className="text-blue-500 font-bold text-center">
          Welcome to Comment Automation App
        </h1>
        <h1 className="text-2xl font-bold mb-4 text-center">Create Account</h1>
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
            <div></div>
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
            Sign Up
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
        >
          <FaGoogle />
          Sign Up with Google
        </Button>


        <p className="text-sm text-gray-600 flex justify-center gap-3">
          Already have an account ?
          <Link
            href="/login"
            className="text-blue-500 hover:underline hover:text-blue-700"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
