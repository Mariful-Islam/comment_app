import { useState, useEffect } from "react";

export function useFacebookLogin() {
  const [loading, setLoading] = useState(true);

  // Load Facebook SDK once
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("facebook-jssdk")) {
      setLoading(false);
      return;
    }

    window.fbAsyncInit = () => {
      FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID!,
        cookie: true,
        xfbml: true,
        version: "v23.0",
      });
      setLoading(false);
    };

    // Insert the SDK script
    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const login = async (): Promise<FBAuthResponse | null> => {
    return new Promise((resolve) => {
      FB.login(
        (response) => {
          if (response.status === "connected") {
            resolve(response.authResponse!);
          } else {
            resolve(null);
          }
        },
        {
          scope:
            "public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts,pages_manage_metadata,pages_manage_ads,pages_manage_engagement",
          return_scopes: true,
        }
      );
    });
  };

  return { login, loading };
}
