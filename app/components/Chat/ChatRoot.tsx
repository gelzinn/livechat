interface ChatRootProps {
  children: React.ReactNode;
}

export const ChatRoot = ({ children }: ChatRootProps) => {
  return (
    <main className="flex flex-row w-full h-screen">
      {children}
    </main>
  );
}
