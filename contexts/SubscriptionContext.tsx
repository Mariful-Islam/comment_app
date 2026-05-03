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

const SubscriptionContext = createContext<any | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const SubscriptionProvider = ({ children }: Props) => {
  const router = useRouter();
  const {user} = useUser()

    const [subscriptions, setSubscriptions] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);
  // Optional: fetch token and user on mount

  const fetchSubscriptions = async (page?:number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/subscriptions?page=${page || 1}`, {credentials: 'include', cache: 'no-cache'});

      const data = await res.json();

      if (data) {
        setSubscriptions(data);
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
    if (!subscriptions && user) {
      fetchSubscriptions();
    }
  }, [subscriptions, user]);

  return (
    <SubscriptionContext.Provider value={{ subscriptions, fetchSubscriptions, loading }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// Custom hook for easier consumption
export const useSubscription = (): any => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
