// FacebookPageContext.tsx
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { FacebookPageContextType } from "./type";
import { useRouter } from "next/navigation";

const FacebookPageContext = createContext<FacebookPageContextType | undefined>(
  undefined
);

interface Props {
  children: ReactNode;
}

export const FacebookPageProvider = ({ children }: Props) => {
  const [pages, setPages] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Optional: fetch token and page on mount

  const getPagesData = async () => {
    try {
      const res = await fetch("/api/auth/facebook/token");
      const session = await res.json();

      if (session?.fb_access_token) {
        setToken(session.fb_access_token);

        // Optional: fetch page data from Facebook Graph API
        const pageRes = await fetch(
          `https://graph.facebook.com/v23.0/me/accounts?access_token=${session.fb_access_token}`
        );
        const pageData: any = await pageRes.json();
        setPages(pageData);
      }
    } catch (error) {
      console.error("Failed to fetch Facebook session:", error);
    }
  };

  useEffect(() => {
    if(!pages){
      getPagesData();
    }
  }, [router, pages]);

  return (
    <FacebookPageContext.Provider value={{ pages, getPagesData }}>
      {children}
    </FacebookPageContext.Provider>
  );
};

// Custom hook for easier consumption
export const useFacebookPages = (): FacebookPageContextType => {
  const context = useContext(FacebookPageContext);
  if (!context) {
    throw new Error("useFacebook must be used within a FacebookPageProvider");
  }
  return context;
};
