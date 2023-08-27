'use client'

import { FormEvent } from "react";
import { format } from 'date-fns';
import Icon from "../Icon";

interface ChatContentProps {
  chat: any;
  onChatSelected: (chat: any) => void;
  selectedChat: any;
}

export const ChatContent = ({
  chat,
  onChatSelected,
  selectedChat
}: ChatContentProps) => {
  const handleUnselectChat = () => onChatSelected(null);

  return (
    <div className="flex flex-col flex-1 w-full h-screen">
      {chat && (
        <span className="flex justify-between items-center text-2xl p-4 h-full max-h-24 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center space-x-4">
            <button
              className="flex items-center justify-center w-8 h-full rounded text-zinc-100 font-medium"
              onClick={handleUnselectChat}
            >
              <Icon icon="ArrowLeft" className="w-5 h-5" />
            </button>
            <picture className="w-12 h-12 flex items-center justify-center border border-zinc-800 rounded-full overflow-hidden">
              <img
                src={chat.contact.avatar ? chat.contact.avatar : `https://images.placeholders.dev/?width=320&height=320&text=${chat.contact.name[0]}&bgColor=%2318181b&textColor=%23fff&fontSize=120`}
                className="pointer-events-none select-none"
              />
            </picture>
            <h1 className="font-medium text-lg">{chat.contact.name}</h1>
          </div>
          <div className="flex items-center">
            <button
              className="flex items-center justify-center w-12 h-12 rounded text-zinc-100 font-medium"
            >
              <Icon icon="MagnifyingGlass" className="w-5 h-5" />
            </button>
            <button
              className="flex items-center justify-center w-12 h-12 rounded text-zinc-100 font-medium"
            >
              <Icon icon="Info" className="w-5 h-5" />
            </button>
            <button
              className="flex items-center justify-center w-12 h-12 rounded text-zinc-100 font-medium ml-4"
            >
              <Icon icon="DotsThreeOutlineVertical" className="w-5 h-5" />
            </button>
          </div>
        </span>
      )}
      <main className="flex-1 overflow-y-auto bg-zinc-950">
        {chat ? (
          <ul className="flex flex-col gap-2 p-4">
            {chat.messages.map((message: any, index: number) => {
              const isUser = message.sender === 'user';
              const isReaded = message.isReaded;

              const prevMessage = index > 0 ? chat.messages[index - 1] : null;
              const nextMessage = index < chat.messages.length - 1 ? chat.messages[index + 1] : null;

              const isSameAsPrevious = index > 0 && prevMessage && prevMessage.sender === message.sender;
              const isSameAsNext = nextMessage && nextMessage.sender === message.sender;

              return (
                <li
                  key={index}
                  className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"} ${!isSameAsPrevious && index != 0 ? "mt-4" : "mt-0"}`}
                >
                  <div className={`relative flex flex-col ${isUser ? "items-end" : "items-start"} justify-center w-auto  ${isUser ? "bg-pink-950" : "bg-zinc-900"} p-4 rounded-md gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                    {!isSameAsNext && (
                      <div
                        className={`absolute ${isUser ? "right-0 rotate-180" : "left-0 -rotate-180"} -bottom-2 -scale-x-100 w-4 h-4 ${isUser ? "bg-pink-950" : "bg-zinc-900"} max-lg:hidden`}
                        style={{
                          clipPath: `polygon(${isUser ? "100% 0%, 0% 100%, 100% 100%" : "0% 0%, 100% 100%, 0% 100%"})`,
                          backgroundColor: isUser ? "bg-zinc-900" : "bg-zinc-950"
                        }}
                      />
                    )}
                    <div className={`flex flex-col w-full z-10 overflow-hidden ${isUser ? "items-end" : "items-start"}`}>
                      <span className="text-zinc-200 text-sm">{message.content}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isUser ? "flex-row" : "flex-row-reverse"}`}>
                      <span
                        className="text-zinc-400 text-xs"
                        title={format(new Date(message.timestamp), 'dd/MM/yyyy HH:mm')}
                      >
                        {format(new Date(message.timestamp), 'HH:mm')}
                      </span>
                      <span className={`relative flex items-center justify-center rounded-full text-zinc-100 font-medium`}>
                        {isReaded ? (
                          <>
                            <Icon icon="Check" size={16} className={`mr-1 ${isReaded ? "text-green-600" : "text-zinc-400"}`} />
                            <Icon icon="Check" size={16} className={`absolute left-[5px] top-0 bottom-0 ${isReaded ? "text-green-600" : "text-zinc-400"}`} />
                          </>
                        ) : (
                          <Icon icon="Check" size={16} className={`${isReaded ? "text-green-600" : "text-zinc-400"}`} />
                        )}
                      </span>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full gap-4">
            <Icon icon="Chat" weight="light" className="w-24 h-24 text-2xl text-zinc-400" />
            <h1 className="text-zinc-400 text-xl">Select a chat to start messaging.</h1>
          </div>
        )}
      </main>
      {chat && (
        <footer>
          <form
            className="flex items-center justify-between px-4 py-4 border-t border-zinc-800 bg-zinc-950"
            onSubmit={(e: FormEvent) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Type a message"
              className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-400 focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-green-600 text-zinc-100 font-medium"
            >
              <Icon icon="PaperPlane" className="w-5 h-5 rotate-45" />
            </button>
          </form>
        </footer>
      )}
    </div >
  );
}
