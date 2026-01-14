
// instagramContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/utils";
import Cookies from "js-cookie";


const instagramContext = createContext<any | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const InstagramProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)

  // Optional: fetch token and user on mount

   const getSessionData = async () => {
      try {
        
        const instaAccessToken = getCookie('insta_access_token')

        if (instaAccessToken) {
          setIsLoading(true)

          // Optional: fetch user data from instagram Graph API
          const userRes = await fetch(
            `https://graph.instagram.com/v21.0/me?fields=id,username,account_type&access_token=${instaAccessToken}`
          );
          const userData: any = await userRes.json();
          
          Cookies.set("instaUserId", userData?.id)
          setUser(userData);
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Failed to fetch instagram session:", error);
        setIsLoading(false)

      }
    };

  useEffect(() => {
    if(!(user && token)){
      getSessionData();
      checkSubscription()
    }
  }, [router]);


  const checkSubscription = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/instagram/subscription`)
      const data = await res.json()

      console.log(data?.data?.isSubscribed, "llllllll")
      
      setIsSubscribed(data?.data?.isSubscribed)
      setIsLoading(false)

    } catch {
      setIsLoading(false)
      throw new Error("Error in checkSubscription !!")
    }
  }

  return (
    <instagramContext.Provider value={{ user, token, setUser, setToken, isSubscribed, checkSubscription, isLoading }}>
      {children}
    </instagramContext.Provider>
  );
};

// Custom hook for easier consumption
export const useInstagram = (): any => {
  const context = useContext(instagramContext);
  if (!context) {
    throw new Error("useinstagram must be used within a instagramProvider");
  }
  return context;
};
