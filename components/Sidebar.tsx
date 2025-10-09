"use client";
import React, { useContext } from "react";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";

import { IoSettingsOutline } from "react-icons/io5";
import { useClickOutside } from "@/lib/useClickOutside";
import { Tooltip } from "react-tooltip";
import { useMenuItems } from "@/constants/menuItems";
import { usePathname, useRouter } from "next/navigation";
import { GlobalContext } from "@/contexts/GlobalContext";
import Link from "next/link";

function Sidebar() {
  const menuItems = useMenuItems();
  const pathname = usePathname();
  const router = useRouter();

  const { openHeaderSidebar, toggleHeaderSidebar } = useContext(GlobalContext);

  const ref = useClickOutside(() => {
    if (openHeaderSidebar && window.innerWidth < 860) {
      toggleHeaderSidebar();
    }
  });

  return (
    <div className="text-[12px] fixed z-[60] h-screen" ref={ref as any}>
      <div
        className={`p-2 border-r border-slate-200 dark:border-slate-600 absolute  h-screen shadow-md mh:shadow-none  ${
          openHeaderSidebar
            ? "w-[250px] bg-white dark:bg-gray-800 "
            : "w-0 overflow-hidden opacity-0 mh:opacity-100 mh:overflow-visible mh:w-[55px] bg-white dark:bg-gray-800 z-50"
        } duration-200`}
      >
        {openHeaderSidebar ? (
          <GoSidebarExpand
            className=" duration-200 w-5 h-5 absolute -right-8 top-3 cursor-pointer hover:text-blue-500"
            onClick={toggleHeaderSidebar}
            data-tooltip-id={`sidebar-expand`}
            data-tooltip-content={`Sidebar Collapse`}
          />
        ) : (
          <GoSidebarCollapse
            className=" duration-200 w-5 h-5 absolute -right-8 top-3 cursor-pointer hover:text-blue-500"
            onClick={toggleHeaderSidebar}
            data-tooltip-id={`sidebar-collapse`}
            data-tooltip-content={`Sidebar Expand`}
          />
        )}

        <Tooltip
          id={`sidebar-expand`}
          place="right"
          style={{ fontSize: 12, fontWeight: "bold" }}
        />
        <Tooltip
          id={`sidebar-collapse`}
          place="right"
          style={{ fontSize: 12, fontWeight: "bold" }}
        />

        <div>
          <h1>S</h1>
        </div>
        <div className="mt-4">
          <nav className="">
            <ul className="list-none flex flex-col gap-0">
              {menuItems.map((item, index) => (
                <li key={index} className="relative">
                  <div
                    data-tooltip-id={`item-${index}`}
                    data-tooltip-content={item.name}
                    onClick={() => router.replace(`${item.href}`)}
                    className={`flex items-center gap-2 w-full cursor-pointer ${
                      openHeaderSidebar ? "px-4" : " justify-center px-2"
                    } ${
                      pathname === item.href ? "text-blue-500" : ""
                    } p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-blue-500 hover:text-blue-500 rounded-md font-bold duration-200 text-[14px]`}
                  >
                    {item.icon} {openHeaderSidebar && <>{item.name}</>}
                  </div>


                  {!openHeaderSidebar && (
                    <Tooltip
                      id={`item-${index}`}
                      place="right"
                      style={{ fontSize: 12, fontWeight: "bold" }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div
        className={`absolute bottom-2 p-2 mh:p-0 m-0 mh:m-2 overflow-hidden ${
          openHeaderSidebar
            ? "w-[233px] bg-white dark:bg-gray-800 "
            : "w-0 overflow-hidden opacity-0 mh:opacity-100 mh:overflow-visible mh:w-[40px] bg-white dark:bg-gray-800 z-50"
        }`}
      >
        <Link
          href={`/dashboard/settings`}
          className={`flex items-center gap-2 ${
            openHeaderSidebar ? "px-4" : " justify-center px-1"
          } ${
            pathname === "/dashboard/settings" ? "text-blue-500" : ""
          } py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-blue-500 hover:text-blue-500 rounded-md font-bold duration-200`}
          data-tooltip-id={`setting`}
          data-tooltip-content={`Setting`}
        >
          <IoSettingsOutline className="w-5 h-5" />{" "}
          {openHeaderSidebar && <>Settings</>}
        </Link>

        <Tooltip
          id={`setting`}
          place="right"
          style={{ fontSize: 12, fontWeight: "bold" }}
        />
      </div>
    </div>
  );
}

export default Sidebar;
