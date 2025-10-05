"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

type UserType = {
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
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const email = localStorage.getItem("email");
      if (!email) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/user?email=${email}`);
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

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
