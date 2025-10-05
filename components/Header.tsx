"use client";

import React, { useContext, useEffect, useState } from "react";

import { CiBellOn, CiMail, CiMenuFries, CiSearch } from "react-icons/ci";
import { GlobalContext } from "../contexts/GlobalContext";

import { IoSunnyOutline } from "react-icons/io5";
import { MdOutlineNightlight } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import Search from "./Search";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Header() {
  const router = useRouter();
  const { openHeaderSidebar, toggleHeaderSidebar } = useContext(GlobalContext);
  const pathname = usePathname();
  const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();

  const { user, loading } = useUser();

  const { handleLogout } = useContext(GlobalContext);

  useEffect(() => {
    if (window.innerWidth < 860) {
      toggleHeaderSidebar();
    }
  }, [pathname]);

  return (
    <div
      className={`sticky z-50 dark:bg-gray-800 bg-white top-0 right-0 border-b border-slate-200 dark:border-slate-600 ${
        openHeaderSidebar && " blur-md mh:blur-none"
      }`}
    >
      <div className="flex items-center gap-4 sm:gap-8 pr-4">
        <div
          className="flex mh:hidden flex-col gap-[6px] pl-6"
          role="button"
          onClick={toggleHeaderSidebar}
        >
          <CiMenuFries className=" rotate-180" />
        </div>
        <div className="flex gap-4 mh:gap-8 items-center w-full justify-end py-2 pr-4 pl-2 mh:pl-10">
          <button
            className="flex gap-2 items-center text-slate-500 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-700 p-1 rounded-full"
            onClick={() => setIsOpenSearch(true)}
            data-tooltip-id={`search`}
            data-tooltip-content={"Search"}
          >
            <CiSearch className="w-5 h-5" />{" "}
          </button>

          <Tooltip
            id={`search`}
            place="bottom"
            style={{ fontSize: 12, fontWeight: "bold" }}
          />

          {isOpenSearch && (
            <Search
            //   isOpen={isOpenSearch}
            //   onClose={() => setIsOpenSearch(!isOpenSearch)}
            />
          )}
        </div>

        <button>
          <div
            data-tooltip-id={`message`}
            data-tooltip-content={"Message"}
            className=" relative cursor-pointer p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-200 hover:dark:bg-gray-700 duration-200"
          >
            <CiMail className="h-5 w-5 " />

            <div className="bg-blue-500 text-white rounded-full w-[14px] h-[14px] absolute -top-0 -right-0 text-[8px] flex justify-center items-center">
              33
            </div>
          </div>
        </button>
        <Tooltip
          id={`message`}
          place="bottom"
          style={{ fontSize: 12, fontWeight: "bold" }}
        />

        <button>
          <div
            data-tooltip-id={`notification`}
            data-tooltip-content={"Notification"}
            className=" relative cursor-pointer p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-200 hover:dark:bg-gray-700 duration-200"
          >
            <CiBellOn className="h-5 w-5 " />
            <div className="bg-blue-500 text-white rounded-full w-[14px] h-[14px] absolute -top-0 -right-0 text-[8px] flex justify-center items-center">
              33
            </div>
          </div>
        </button>
        <Tooltip
          id={`notification`}
          place="bottom"
          style={{ fontSize: 12, fontWeight: "bold" }}
        />

        {/* <ThemeToggle /> */}
        <div
          data-tooltip-id={`dark-light`}
          data-tooltip-content={"Dark Light Switch"}
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-200 hover:dark:bg-gray-700 duration-200"
        >
          {theme === "light" ? (
            <IoSunnyOutline className="text-black w-5 h-5" />
          ) : (
            <MdOutlineNightlight className="text-white w-4 h-4" />
          )}
        </div>

        <Tooltip
          id={`dark-light`}
          place="bottom"
          style={{ fontSize: 12, fontWeight: "bold" }}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center hover:bg-gray-200 hover:dark:bg-gray-700 py-1 px-2 rounded-md cursor-pointer">
              {loading ? (
                <div className="animate-pulse flex gap-2 items-center">
                  <div className="bg-slate-400 rounded-full w-8 h-8 " />
                  <div className="text-base font-bold text-nowrap hidden sm:block bg-slate-400 rounded-md w-20 h-4">
                    &nbsp;
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <img
                    src={user?.imageUrl}
                    alt=""
                    className="bg-slate-400 rounded-full max-w-8 min-w-8 h-8 "
                  />
                  <div className="text-base font-bold text-nowrap hidden sm:block">
                    {user?.name}
                  </div>
                </div>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" sideOffset={12}>
            <DropdownMenuLabel className="font-bold">
              User Menu
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  router.replace("/dashboard/profile");

                }}
              >
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {      
                  // router.replace("/dashboard/profile");
                }}
              >
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  // router.push("/billing");
                }     
              }
              >
                Billing
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => {
                // handleLogout();
                handleLogout();
              }}
            >
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>    
        </DropdownMenu>
      </div>
    </div>
  );
}

export default Header;
