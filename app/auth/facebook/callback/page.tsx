"use client"

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function FacebookCallback() {
  const router = useRouter();
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    if (error) {
      setStatus(`Error: ${error}`);
      return;
    }

    if (code) {
      extendAndStoreToken(code);
    }
  }, []);

  const extendAndStoreToken = async (authCode:any) => {
    try {
      setStatus("Exchanging code for long-lived token...");

      // 1. Parameters for the Graph API call
      // Note: These should ideally be environment variables
      const clientId = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID!;
      const clientSecret = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET!;
      const redirectUri = process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI!;

      // 2. The API call to exchange code for a long-lived token (~60 days)
      const response = await fetch(
        `https://graph.facebook.com/v18.0/oauth/access_token?` +
          `client_id=${clientId}&` +
          `redirect_uri=${redirectUri}&` +
          `client_secret=${clientSecret}&` +
          `code=${authCode}`,
      );

      const data = await response.json();

      if (data.access_token) {
        // 3. Calculate expiration (60 days)
        const expiresSeconds = data.expires_in || 5184000;

        // 4. Set the cookie
        document.cookie =
          `fb_access_token=${data.access_token}; ` +
          `path=/; ` +
          `max-age=${expiresSeconds}; ` +
          `SameSite=Lax; Secure`;

        setStatus("Success! Redirecting...");

        // 5. Redirect to home
        setTimeout(() => {
          router.push("/")
        }, 1000);

        setTimeout(() => {
          router.refresh();
        }, 2000);
        
      } else {
        throw new Error(data.error?.message || "Failed to get access token");
      }
    } catch (err:any) {
      console.error("Auth Error:", err);
      setStatus(`Authentication failed: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Facebook Authentication</h2>
      <p>{status}</p>
    </div>
  );
}

export default FacebookCallback;
