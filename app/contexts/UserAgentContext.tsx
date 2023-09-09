'use client';

import { UserAgent } from "app/@types/User";
import { ReactNode, createContext, useCallback, useEffect, useState } from "react";

type UserAgentProviderProps = {
  children: ReactNode;
};

export const UserAgentContext = createContext({} as any);

export function UserAgentContextProvider({ children }: UserAgentProviderProps) {
  const [userAgent, setUserAgent] = useState<UserAgent | null>(null);

  const handleGetAgent = useCallback(() => {
    const userAgent = navigator.userAgent;

    const browser = userAgent.match(/(Chrome|Firefox|Safari|Edge|IE|Opera)\/(\S+)/i);
    const operatingSystem = userAgent.match(/\(([^)]+)\)/);

    const info = {
      userAgent,
      browser: {
        name: browser ? browser[1] : undefined,
        version: browser ? browser[2] : undefined,
      },
      operatingSystem: {
        name: operatingSystem ? operatingSystem[1].split(" ")[0] : undefined,
        version: operatingSystem ? operatingSystem[1] : undefined,
      },
    };

    setUserAgent(info);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('DOMContentLoaded', handleGetAgent);

    handleGetAgent();

    return () => {
      window.removeEventListener('DOMContentLoaded', handleGetAgent);
    };
  }, [handleGetAgent]);

  return (
    <UserAgentContext.Provider value={{ userAgent }} >
      {children}
    </UserAgentContext.Provider>
  );
}
