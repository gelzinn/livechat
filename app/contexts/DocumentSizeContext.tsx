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

  const handleResize = useCallback(() => {
    setDocumentSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('resize', handleResize);
    window.addEventListener('DOMContentLoaded', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('DOMContentLoaded', handleResize);
    };
  }, [handleResize]);

  return (
    <DocumentSizeContext.Provider value={{ documentSize }} >
      {children}
    </DocumentSizeContext.Provider>
  );
}
