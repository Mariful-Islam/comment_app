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

const KeywordUsageContext = createContext<any | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const KeywordUsageProvider = ({ children }: Props) => {
  const router = useRouter();
  const {user} = useUser()

    const [KeywordUsages, setKeywordUsages] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);
  // Optional: fetch token and user on mount

  const fetchKeywordUsages = async (page?:number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/keywords/usage?page=${page || 1}`, {credentials: 'include',});

      const data = await res.json();

      if (data) {
        setKeywordUsages(data);
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
    if (!KeywordUsages && user) {
      fetchKeywordUsages();
    }
  }, [user]);

  return (
    <KeywordUsageContext.Provider value={{ KeywordUsages, fetchKeywordUsages, loading }}>
      {children}
    </KeywordUsageContext.Provider>
  );
};

// Custom hook for easier consumption
export const useKeywordUsage = (): any => {
  const context = useContext(KeywordUsageContext);
  if (!context) {
    throw new Error("useKeywordUsage must be used within a KeywordUsageProvider");
  }
  return context;
};
