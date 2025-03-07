"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  Suspense,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Loader from "./loading";

const RouteChangeContext = createContext({
  isCompiling: false,
});

// This component will use the searchParams hook inside Suspense
function RouteChangeListener({ setIsCompiling }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleStart = () => setIsCompiling(true);

    const timeout = setTimeout(() => {
      setIsCompiling(false);
    }, 1000);

    handleStart();

    return () => clearTimeout(timeout);
  }, [pathname, searchParams, setIsCompiling]);

  return null;
}

export function RouteChangeProvider({ children }) {
  const [isCompiling, setIsCompiling] = useState(false);

  return (
    <RouteChangeContext.Provider value={{ isCompiling }}>
      {children}

      {isCompiling && <Loader />}

      <Suspense fallback={null}>
        <RouteChangeListener setIsCompiling={setIsCompiling} />
      </Suspense>
    </RouteChangeContext.Provider>
  );
}

export const useRouteChange = () => useContext(RouteChangeContext);
