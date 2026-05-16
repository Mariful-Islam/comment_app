import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
    ],
  },
  allowedDevOrigins: ['b1f1-103-106-238-209.ngrok-free.app']

  
};

export default nextConfig;
