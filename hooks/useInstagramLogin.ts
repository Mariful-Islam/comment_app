import { useState } from "react";

interface InstagramAuthResponse {
  accessToken: string;
  userId: string;
}

export function useInstagramLogin() {
  const [loading, setLoading] = useState(false);

  const login = async (): Promise<InstagramAuthResponse | null> => {
    setLoading(true);

    try {
      const clientId = process.env.NEXT_PUBLIC_INSTA_CLIENT_ID;
      const redirectUri = encodeURIComponent(
        process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI!
      );
      const scope = encodeURIComponent("user_profile,user_media");
      const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;

      // Redirect the user to Instagram login page
      window.location.href = authUrl;

      // After login, the server should handle the code exchange to get the access token
      return null; // The actual access token will come from your backend after redirect
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}
