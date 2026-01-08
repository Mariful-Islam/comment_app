// InstagramPostContext.tsx
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/utils";
import { useInstagram } from "./InstagramContext";
import { useUser } from "./UserContext";

const InstagramPostContext = createContext<any | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const InstagramPostProvider = ({ children }: Props) => {
  const [posts, setPosts] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const {user} = useUser();

  const router = useRouter();

  // Optional: fetch token and user on mount

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/instagram/posts`, {
        cache: "no-cache",
      });

      const data = await res.json();

      if (data?.data) {
        setPosts(data.data);
      } else {
        console.error("Error in response:", data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!posts && user) {
      fetchPosts();
    }
  }, [router, user]);

  return (
    <InstagramPostContext.Provider value={{ posts, fetchPosts, loading }}>
      {children}
    </InstagramPostContext.Provider>
  );
};

// Custom hook for easier consumption
export const useInstagramPost = (): any => {
  const context = useContext(InstagramPostContext);
  if (!context) {
    throw new Error(
      "useInstagramPost must be used within a InstagramPostProvider"
    );
  }
  return context;
};
