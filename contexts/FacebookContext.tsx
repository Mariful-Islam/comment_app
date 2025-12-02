// FacebookContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { FacebookUser, FacebookContextType } from "./type";
import { useRouter } from "next/navigation";

const FacebookContext = createContext<FacebookContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const FacebookProvider = ({ children }: Props) => {
  const [user, setUser] = useState<FacebookUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Optional: fetch token and user on mount
  useEffect(() => {
    const getSessionData = async () => {
      try {
        const res = await fetch("/api/auth/facebook/token");
        const session = await res.json();


        if (session?.fb_access_token) {
          setToken(session.fb_access_token);

          // Optional: fetch user data from Facebook Graph API
          const userRes = await fetch(
            `https://graph.facebook.com/v21.0/me?fields=id,name,email,picture.width(200).height(200)&access_token=${session.fb_access_token}`
          );
          const userData: FacebookUser = await userRes.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch Facebook session:", error);
      }
    };

    getSessionData();
  }, [router]);

  return (
    <FacebookContext.Provider value={{ user, token, setUser, setToken }}>
      {children}
    </FacebookContext.Provider>
  );
};

// Custom hook for easier consumption
export const useFacebook = (): FacebookContextType => {
  const context = useContext(FacebookContext);
  if (!context) {
    throw new Error("useFacebook must be used within a FacebookProvider");
  }
  return context;
};
