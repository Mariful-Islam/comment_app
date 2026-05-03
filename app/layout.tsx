"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import GlobalProvider, { GlobalContext } from "@/contexts/GlobalContext";

import { UserProvider, useUser } from "@/contexts/UserContext";
import { SessionProvider } from "next-auth/react";
import { FacebookProvider } from "@/contexts/FacebookContext";
import { FacebookPageProvider } from "@/contexts/FacebookPageContext";
import { InstagramProvider } from "@/contexts/InstagramContext";
import { InstagramPostProvider } from "@/contexts/InstagramPostContext";
import { KeywordProvider } from "@/contexts/KeywordContext";
import { KeywordUsageProvider } from "@/contexts/KeywordUsageContext";
import { Metadata } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
// import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function FaviconSwitcher({ iconPath }: { iconPath: string }) {
  useEffect(() => {
    // 1. Find all possible icon links (some sites have multiple)
    const links = document.querySelectorAll("link[rel*='icon']");

    // 2. If no link exists, create one
    if (links.length === 0) {
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.href = `${iconPath}?v=${Date.now()}`; // Force bypass cache
      document.head.appendChild(newLink);
    } else {
      // 3. Update all existing links
      links.forEach((link) => {
        (link as HTMLLinkElement).href = `${iconPath}?v=${Date.now()}`;
      });
    }
  }, [iconPath]);

  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [hasNotification, setHasNotification] = useState(false);

  

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex gap-0 w-full text-black dark:text-white`}
      >
        <ThemeProvider>
          <GlobalProvider>
            <UserProvider>
              <SessionProvider>
                <FacebookProvider>
                  <FacebookPageProvider>
                    <InstagramProvider>
                      <InstagramPostProvider>
                        <KeywordProvider>
                          <KeywordUsageProvider>
                            <SubscriptionProvider>
                              <Head>
                                <link rel="icon" href="/assets/icon.png" />
                              </Head>
                              {children}

                              <Toaster />
                            </SubscriptionProvider>
                          </KeywordUsageProvider>
                        </KeywordProvider>
                      </InstagramPostProvider>
                    </InstagramProvider>
                  </FacebookPageProvider>
                </FacebookProvider>
              </SessionProvider>
            </UserProvider>
          </GlobalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
