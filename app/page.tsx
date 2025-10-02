"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { withAuth } from "@/hoc/withAuth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";

type UserType = {
  name: string;
  email: string;
  imageUrl?: string;
};

function Home() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const email = localStorage.getItem("email");

      if (!email) return;

      try {
        const res = await fetch("/api/user" + `?email=${email}`);

        if (!res.ok) {
          console.error("Failed to fetch user");
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    await signOut(auth);
    router.refresh();
    router.replace("/login");
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-4">
      <div className="text-2xl font-bold">Dashboard</div>
      <div>Name: {user?.name || "Loading..."}</div>
      <div>Email: {user?.email || "Loading..."}</div>
      <div>
        <img
          src={
            user?.imageUrl ||
            "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
          }
          alt="Profile Picture"
          width={50}
          height={50}
          className="rounded-full"
        />
      </div>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}

export default withAuth(Home);
