interface ChatRootProps {
  children: React.ReactNode;
}

export const ChatRoot = ({ children }: ChatRootProps) => {
  return (
    <section className="relative flex flex-row w-full overflow-hidden"
      // @ts-ignore
      style={{ height: "100dvh", height: "100vh" }}
    >
      {children}
    </section>
  );
}
