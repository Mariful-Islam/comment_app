// context/GlobalContext.tsx

"use client"; // Important for App Router

import React, { createContext, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Cookies from "js-cookie";

export const GlobalContext = createContext<any>(null);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [openHeaderSidebar, setOpenHeaderSidebar] = useState(window.innerWidth > 500 ? true : false);
  const [filter, setFilter] = useState<boolean>(false);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isOpenUpdateForm, setIsOpenUpdateForm] = useState<boolean>(false);
  const [isOpenDeleteConsent, setIsOpenDeleteConsent] =
    useState<boolean>(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (window.innerWidth <= 860) {
      setOpenHeaderSidebar(false);
    }
  }, []);

  const toggleHeaderSidebar = () => {
    setOpenHeaderSidebar((prev) => !prev);
  };

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  const clearSearchParams = () => {
    router.push("?");
  };

  const handleFilter = () => {
    setFilter((prev) => !prev);
  };

  const handleCreate = () => {
    setIsCreateOpen((prev) => !prev);
  };

  const handleUpdate = () => {
    setIsOpenUpdateForm((prev) => !prev);
  };

  const handleDeleteConsent = (id?: number) => {
    setIsOpenDeleteConsent(!!id);
    return id;
  };

  const handleFormValidation = (formData: any, fields: string[]): boolean => {
    return fields.every((field) => {
      const value = formData?.[field];
      if (value === null || value === undefined) return false;

      if (typeof value === "string" && value.trim() === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0
      ) {
        return false;
      }

      return true;
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchParams("search", e.target.value);
  };

  const handleSelectItemPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSearchParams("pages", e.target.value);
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    Cookies.remove("userId");
    await signOut(auth);
    router.refresh();
    router.replace("/login");
  };

  return (
    <GlobalContext.Provider
      value={{
        openHeaderSidebar,
        toggleHeaderSidebar,
        handleFormValidation,
        filter,
        handleFilter,
        handleSearch,
        handleSelectItemPerPage,
        searchParams,
        handleCreate,
        isCreateOpen,
        handleUpdate,
        isOpenUpdateForm,
        handleDeleteConsent,
        isOpenDeleteConsent,
        clearSearchParams,
        handleLogout
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
