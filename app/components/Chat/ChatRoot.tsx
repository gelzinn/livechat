'use client'

import { useEffect, useState } from "react";

interface ChatRootProps {
  children: React.ReactNode;
}

export const ChatRoot = ({ children }: ChatRootProps) => {
  const [documentHeight, setDocumentHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setDocumentHeight(window.innerHeight);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [window.innerHeight, documentHeight]);

  return (
    <section
      className="relative flex flex-grow h-full w-full overflow-hidden"
      style={{ height: documentHeight ? documentHeight : "100vh" }}
    >
      {children}
    </section>
  );
}
