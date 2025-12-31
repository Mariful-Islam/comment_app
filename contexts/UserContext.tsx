"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

type UserType = {
  _id: string;
  name: string;
  email: string;
  imageUrl?: string;
  createdAt: string;
  authProvider?: string;
};

type UserContextType = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  loading: boolean;
  fetchUser: () => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  fetchUser: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const fetchUser = async () => {
    const email = localStorage.getItem("email");
    if (!email) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/user?email=${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      });
      if (!res.ok) {
        toast.error("Failed to fetch user data.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      toast.error("Error fetching user.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFacebookConnection = async () => {
    const res = await fetch(`/api/facebook`)
  }

  useEffect(() => {
    if(!user){
      fetchUser();
    }
  }, [pathname]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
