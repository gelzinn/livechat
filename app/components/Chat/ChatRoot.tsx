interface ChatRootProps {
  children: React.ReactNode;
}

export const ChatRoot = ({ children }: ChatRootProps) => {
  return (
    <main className="relative flex flex-row w-full h-screen overflow-hidden">
      {children}
    </main>
  );
}
