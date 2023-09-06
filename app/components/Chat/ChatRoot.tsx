'use client'

import { useDocumentSize } from "app/hooks/useDocumentSize";

interface ChatRootProps {
  children: React.ReactNode;
}

export const ChatRoot = ({ children }: ChatRootProps) => {
  const { documentHeight } = useDocumentSize();

  return (
    <section
      className="relative flex flex-grow h-full w-full overflow-hidden scrollbar-hide"
      style={{ height: documentHeight ? documentHeight : "100vh" }}
    >
      {children}
    </section>
  );
}
