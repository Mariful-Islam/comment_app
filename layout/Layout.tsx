"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { GlobalContext } from "@/contexts/GlobalContext";
import { SessionProvider } from "next-auth/react";
import React, { useContext } from "react";

function Layout({ children, provider }: { children: React.ReactNode, provider?: any }) {
  const { openHeaderSidebar, toggleHeaderSidebar } = useContext(GlobalContext);

  return (
    // <SessionProvider>
      <div className="flex gap-0 w-full text-black dark:text-white ">
        <Sidebar />

        <div className="w-full">
          <Header />
          <div
            className={` p-3 px-6 overflow-auto ${
              openHeaderSidebar
                ? "ml-0 mh:ml-[250px] blur-md mh:blur-none"
                : "ml-0 mh:ml-12"
            } duration-200`}
          >
            {children}
          </div>
        </div>
      </div>
    // </SessionProvider>
  );
}

export default Layout;
