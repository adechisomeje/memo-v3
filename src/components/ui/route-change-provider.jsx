// components/RouteChangeProvider.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Loader from "./loading";

const RouteChangeContext = createContext({
  isCompiling: false,
});

export function RouteChangeProvider({ children }) {
  const [isCompiling, setIsCompiling] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleStart = () => setIsCompiling(true);

    const timeout = setTimeout(() => {
      setIsCompiling(false);
    }, 1000);

    handleStart();

    return () => clearTimeout(timeout);
  }, [pathname, searchParams]); // Dependencies for route change detection

  return (
    <RouteChangeContext.Provider value={{ isCompiling }}>
      {children}

      {isCompiling && <Loader />}
    </RouteChangeContext.Provider>
  );
}

export const useRouteChange = () => useContext(RouteChangeContext);
