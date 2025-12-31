
// instagramContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/utils";

const instagramContext = createContext<any | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const InstagramProvider = ({ children }: Props) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Optional: fetch token and user on mount

   const getSessionData = async () => {
      try {
        
        const instaAccessToken = getCookie('insta_access_token')

        if (instaAccessToken) {

          // Optional: fetch user data from instagram Graph API
          const userRes = await fetch(
            `https://graph.instagram.com/v21.0/me?fields=id,username,account_type&access_token=${instaAccessToken}`
          );
          const userData: any = await userRes.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch instagram session:", error);
      }
    };

  useEffect(() => {
    if(!(user && token)){
      getSessionData();
    }
  }, [router]);

  return (
    <instagramContext.Provider value={{ user, token, setUser, setToken }}>
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
