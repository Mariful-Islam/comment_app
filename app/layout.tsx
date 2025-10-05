import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import GlobalProvider, { GlobalContext } from "@/contexts/GlobalContext";

import { UserProvider } from "@/contexts/UserContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Comment Automation App",
  description: "Comment Automation App by Mariful Islam Saad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex gap-0 w-full text-black dark:text-white`}
      >
        <ThemeProvider>
          <GlobalProvider>
            <UserProvider>
              {children}

              <Toaster />
            </UserProvider>
          </GlobalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
