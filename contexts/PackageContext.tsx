import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/utils";
import { useUser } from "./UserContext";

const KeywordContext = createContext<any | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const KeywordProvider = ({ children }: Props) => {
  const router = useRouter();
  const { user } = useUser();

  const [keywords, setKeywords] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  // Optional: fetch token and user on mount

  const fetchKeywords = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/keywords/users/${user?._id}`, {
        cache: "no-cache",
      });

      const data = await res.json();

      if (data) {
        setKeywords(data);
        setLoading(false);
      } else {
        console.error("Error in response:", data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!keywords && user) {
      fetchKeywords();
    }
  }, [user]);

  return (
    <KeywordContext.Provider value={{ keywords, fetchKeywords, loading }}>
      {children}
    </KeywordContext.Provider>
  );
};

// Custom hook for easier consumption
export const useKeyword = (): any => {
  const context = useContext(KeywordContext);
  if (!context) {
    throw new Error("useKeyword must be used within a KeywordProvider");
  }
  return context;
};
