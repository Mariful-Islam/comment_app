"use client";
import { useEffect, useRef } from "react";

export const useClickOutside = (handler: () => void) => {
    const ref = useRef<HTMLUListElement>(null);
  
    useEffect(() => {
      const listener = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          handler();
        }
      };
  
      document.addEventListener('mousedown', listener);
      return () => {
        document.removeEventListener('mousedown', listener);
      };
    }, [handler]);
  
    return ref;
  };
  