'use client';

import { ReactNode, createContext, useCallback, useEffect, useState } from "react";

type DocumentSizeProviderProps = {
  children: ReactNode;
};

export const DocumentSizeContext = createContext({} as any);

export function DocumentSizeContextProvider({ children }: DocumentSizeProviderProps) {
  const [documentSize, setDocumentSize] = useState({
    width: 0,
    height: 0,
  });
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = useCallback(() => {
    setDocumentSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  const handleIsMobile = useCallback(() => {
    const ua = navigator.userAgent;

    const isMobileDevice = /iPhone|iPad|iPod|Android|IEMobile|BlackBerry|BB10|Opera Mini|CriOS|Mobile Safari|Mobile Chrome/i.test(ua);

    setIsMobile(isMobileDevice);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('resize', handleResize);
    window.addEventListener('DOMContentLoaded', handleResize);

    handleResize();
    handleIsMobile();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('DOMContentLoaded', handleResize);
    };
  }, [handleResize, handleIsMobile]);

  return (
    <DocumentSizeContext.Provider
      value={{
        documentSize,
        isMobile,
      }}
    >
      {children}
    </DocumentSizeContext.Provider>
  );
}
