'use client'

interface ChatAsideProps {
  chats: any;
  onChatSelected: (chat: any) => void;
}

export const ChatAside = ({
  chats,
  onChatSelected
}: ChatAsideProps) => {
  if (!chats) throw new Error("Chats not found at Chat Root Component.");

  return (
    <aside
      className="flex flex-col min-w-96 w-full max-w-[420px] h-screen bg-zinc-950 border-r border-zinc-900"
    >
      <span className="flex justify-between items-center text-2xl px-4 py-8 h-full max-h-24 border-b border-zinc-800 bg-zinc-950">
        <h1 className="font-medium">Chat</h1>
        <span
          className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 font-medium"
        >
          {chats.length}
        </span>
      </span>
      <ul className="divide-y divide-zinc-800">
        {chats.map((chat: any, index: number) => {
          const lastMessage = chat.messages[chat.messages.length - 1].content;
          const isUnread = chat.messages.some((message: any) => !message.isReaded);

          return (
            <li
              key={index}
              className="flex items-center space-x-4 p-4 hover:bg-zinc-900 duration-75 cursor-pointer"
              onClick={() => onChatSelected(chat)}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-zinc-800">
                <picture className="w-12 h-12 flex items-center justify-center border border-zinc-800 rounded-full overflow-hidden">
                  <img
                    src={chat.contact.avatar ? chat.contact.avatar : `https://images.placeholders.dev/?width=320&height=320&text=${chat.contact.name[0]}&bgColor=%2318181b&textColor=%23fff&fontSize=120`}
                    alt={`${chat.contact.name} profile's picture`}
                    className="pointer-events-none select-none"
                  />
                </picture>
              </div>
              <div className="flex items-center justify-center overflow-hidden w-full gap-4">
                <div className="flex flex-col w-full overflow-hidden">
                  <strong className="text-zinc-200">{chat.contact.name}</strong>
                  <p className="text-zinc-400 truncate">{lastMessage}</p>
                </div>
                {isUnread && (
                  <span className="flex flex-shrink-0 items-center justify-center w-8 h-8 rounded-full bg-green-600 border border-zinc-100 text-sm text-zinc-100 font-medium">
                    {chat.messages.filter((message: any) => !message.isReaded).length}
                  </span>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
