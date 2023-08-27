'use client'

import { FormEvent, useEffect, useRef, useState } from "react";
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
  const [messages, setMessages] = useState(chat ? chat.messages : []);
  const [typedMessage, setTypedMessage] = useState("");

  const [isOpenChatInfo, setIsOpenChatInfo] = useState<boolean>(false);

  const messageContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadElement>(null);
  const bottomOfListRef = useRef<HTMLLIElement>(null);
  const barActionRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleUnselectChat = () => onChatSelected(null);

  const handleSendMessage = () => {
    if (!typedMessage) return;

    const newMessage = {
      sender: "user",
      content: typedMessage,
      timestamp: new Date().toISOString(),
      isReaded: false
    };

    setMessages((prevMessages: any) => [...prevMessages, newMessage]);

    setTypedMessage("");
    handleChangeTextAreaHeight(textareaRef.current!);

    setTimeout(() => {
      handleScrollToRecentMessage();
    }, 100);
  }

  const handleReadMessage = (updatedChat: any) => {
    if (updatedChat.messages.some((message: any) => !message.isReaded)) {
      const newMessages = updatedChat.messages.map((message: any) => {
        if (!message.isReaded && message.sender !== 'user') {
          return { ...message, isReaded: true };
        }
        return message;
      });

      setMessages(newMessages);
    }
  }

  const handleChangeTextAreaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;

    if (textareaRef.current) {
      const lineCount = textareaRef.current.value.split('\n').length;
      textareaRef.current.rows = lineCount;
    }
  }

  const handleScrollToRecentMessage = () => {
    if (!messageContainerRef.current) return;

    const scrollPosition = messageContainerRef.current.scrollHeight - messageContainerRef.current.clientHeight + 20;

    messageContainerRef.current!.scrollTo({
      top: scrollPosition,
      behavior: "smooth"
    });
  }

  useEffect(() => {
    if (messages && messages.length > 0) {
      handleScrollToRecentMessage();
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      handleChangeTextAreaHeight(textareaRef.current);
    }
  }, [typedMessage]);

  useEffect(() => {
    if (!selectedChat) return;

    setMessages(selectedChat.messages);
    handleReadMessage(selectedChat);
  }, [selectedChat]);

  useEffect(() => {
    if (selectedChat) handleReadMessage(selectedChat);
  }, []);

  return (
    <>
      <div
        className="flex flex-col flex-1 w-full"
        style={{
          height: "-webkit-fill-available"
        }}
      >
        {chat && (
          <header
            className="flex justify-between items-center text-2xl sm:p-4 px-2 py-4 h-20 sm:h-full max-h-24 border-b border-zinc-800 bg-zinc-950"
            ref={headerRef}
          >
            <div className="flex items-center h-full">
              <button
                className="lg:hidden flex items-center justify-center w-8 h-full rounded text-zinc-100 font-medium"
                onClick={handleUnselectChat}
              >
                <Icon icon="ArrowLeft" className="w-5 h-5" />
              </button>
              <button
                className="flex items-center gap-2"
                onClick={() => setIsOpenChatInfo(!isOpenChatInfo)}
              >
                <picture className="w-10 h-10 sm:w-12 sm:h-12 mx-2 flex items-center justify-center border border-zinc-800 rounded-full overflow-hidden">
                  <img
                    src={chat.contact.avatar ? chat.contact.avatar : `https://images.placeholders.dev/?width=320&height=320&text=${chat.contact.name[0]}&bgColor=%2318181b&textColor=%23fff&fontSize=120`}
                    className="pointer-events-none select-none"
                  />
                </picture>
                <h1 className="font-medium text-lg">{chat.contact.name}</h1>
              </button>
            </div>
            <div className="flex items-center">
              <button
                className="flex items-center justify-center w-12 h-12 rounded text-zinc-100 font-medium"
              >
                <Icon icon="MagnifyingGlass" className="w-5 h-5" />
              </button>
              <button
                className="sm:flex hidden items-center justify-center w-12 h-12 rounded text-zinc-100 font-medium"
                onClick={() => setIsOpenChatInfo(!isOpenChatInfo)}
              >
                <Icon icon="Info" className="w-5 h-5" />
              </button>
              <button
                className="flex items-center justify-center w-12 h-12 rounded text-zinc-100 font-medium"
              >
                <Icon icon="DotsThreeOutlineVertical" className="w-5 h-5" />
              </button>
            </div>
          </header>
        )}
        <main
          className="flex-1 overflow-y-auto bg-zinc-950"
          ref={messageContainerRef}
        >
          {chat && messages && messages.length > 0 ? (
            <>
              <div className="flex items-center justify-center w-full h-12 bg-zinc-950">
                <span className="text-zinc-400 text-xs">
                  {format(new Date(messages[0].timestamp), 'MMMM dd, yyyy')}
                </span>
              </div>
              <ul className="flex flex-col p-4">
                {messages.map((message: any, index: number) => {
                  const isUser = message.sender === 'user';
                  const isReaded = message.isReaded;

                  const prevMessage = index > 0 ? messages[index - 1] : null;
                  const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;

                  const isSameAsPrevious = index > 0 && prevMessage && prevMessage.sender === message.sender;
                  const isSameAsNext = nextMessage && nextMessage.sender === message.sender;

                  return (
                    <li
                      key={index}
                      className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"} ${!isSameAsPrevious && index != 0 ? "mt-4" : "mt-2"}`}
                    >
                      <div className={`relative flex flex-wrap ${isUser ? "items-end" : "items-start"} lg:justify-end w-auto ${isUser ? "bg-pink-950" : "bg-zinc-900"} px-4 py-3 rounded-md gap-2 ${isUser ? "flex-row" : "flex-row"} w-fit max-w-3xl`}>
                        {!isSameAsNext && (
                          <div
                            className={`absolute ${isUser ? "right-0 rotate-180 rounded-br-0" : "left-0 -rotate-180 rounded-bl-0"} -bottom-2 -scale-x-100 w-4 h-4 ${isUser ? "bg-pink-950" : "bg-zinc-900"} max-lg:hidden`}
                            style={{
                              clipPath: `polygon(${isUser ? "100% 0%, 0% 100%, 100% 100%" : "0% 0%, 100% 100%, 0% 100%"})`,
                              backgroundColor: isUser ? "bg-zinc-900" : "bg-zinc-950"
                            }}
                          />
                        )}
                        <div className={`flex flex-col w-fit z-10 overflow-hidden ${isUser ? "items-end" : "items-start"}`}>
                          <span className="text-zinc-200 text-sm whitespace-break-spaces w-fit leading-5">{message.content}</span>
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
                <li
                  ref={bottomOfListRef}
                  className="h-0"
                />
              </ul>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full gap-4">
              <Icon icon="Chat" weight="light" className="w-24 h-24 text-2xl text-zinc-400" />
              <h1 className="text-zinc-400 text-xl">Select a chat to start messaging.</h1>
            </div>
          )}
        </main>
        {chat && (
          <footer
            className="w-full h-fit max-h-40 z-10"
            ref={barActionRef}
          >
            <form
              className="flex items-center justify-between h-full max-h-40 px-4 py-4 gap-4 border-t border-zinc-800 bg-zinc-950"
              onSubmit={(e: FormEvent) => e.preventDefault()}
            >
              <textarea
                className="flex-1 w-full bg-transparent text-zinc-100 placeholder-zinc-400 focus:outline-none h-[30px] resize-none"
                ref={textareaRef}
                rows={1}
                placeholder="Type a message"
                onChange={(e) => {
                  setTypedMessage(e.target.value);
                  handleChangeTextAreaHeight(e.target);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                value={typedMessage}
                style={{
                  maxHeight: "8rem"
                }}
              />
              <button
                type="submit"
                className="flex items-center justify-center w-12 h-12 rounded-full text-zinc-100 font-medium"
                onClick={handleSendMessage}
              >
                <Icon icon="PaperPlane" className="w-5 h-5 rotate-45" />
              </button>
            </form>
          </footer>
        )}
      </div >
      {chat && chat.contact && (
        <aside
          className={`fixed inset-0 z-50 bg-black bg-opacity-80 ${isOpenChatInfo ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} duration-300`}
          onClick={() => setIsOpenChatInfo(false)}
        >
          <div
            className={`min-w-96 w-full lg:max-w-[420px] fixed top-0 right-0 z-50 h-full bg-zinc-950 border-l border-zinc-900 ${isOpenChatInfo ? "translate-x-0" : "translate-x-full"} duration-300`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between w-full h-20 sm:h-full max-h-24 px-4 py-4 border-b border-zinc-800">
              <h1 className="text-zinc-100 text-lg font-medium">Chat Info</h1>
              <button
                className="flex items-center justify-center w-8 h-8 rounded-full text-zinc-100 font-medium"
                onClick={() => setIsOpenChatInfo(false)}
              >
                <Icon icon="X" className="w-5 h-5" />
              </button>
            </div>
            <main className="flex flex-col flex-1 w-full h-full overflow-y-auto py-4">
              <div className="flex flex-col items-center justify-center gap-2 w-full h-40">
                <picture className="w-24 h-24 sm:w-32 sm:h-32 mx-2 flex items-center justify-center border border-zinc-800 rounded-full overflow-hidden">
                  <img
                    src={chat.contact.avatar ? chat.contact.avatar : `https://images.placeholders.dev/?width=320&height=320&text=${chat.contact.name[0]}&bgColor=%2318181b&textColor=%23fff&fontSize=120`}
                    className="pointer-events-none select-none"
                  />
                </picture>
                <h1 className="text-zinc-100 text-lg font-medium">{chat.contact.name}</h1>
              </div>
              <div className="flex flex-col gap-2 p-4">
                <div className="relative inline-flex items-center justify-center w-full">
                  <hr className="w-full h-px my-8 bg-zinc-800 border-0" />
                  <span className="absolute pr-3 text-zinc-400 -translate-x-100 bg-zinc-950 left-0">
                    Notifications
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Mute notifications</span>
                  <button
                    className="flex items-center justify-center w-8 h-8 rounded-full text-zinc-100 font-medium"
                  >
                    <Icon icon="Bell" className="w-5 h-5" />
                  </button>
                </div>
                <div className="relative inline-flex items-center justify-center w-full">
                  <hr className="w-full h-px my-8 bg-zinc-800 border-0" />
                  <span className="absolute pr-3 text-zinc-400 -translate-x-100 bg-zinc-950 left-0">
                    Privacy
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Media visibility</span>
                  <button
                    className="flex items-center justify-center w-8 h-8 rounded-full text-zinc-100 font-medium"
                  >
                    <Icon icon="Eye" className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Encryption</span>
                  <button
                    className="flex items-center justify-center w-8 h-8 rounded-full text-zinc-100 font-medium"
                  >
                    <Icon icon="Lock" className="w-5 h-5" />
                  </button>
                </div>
                <div className="relative inline-flex items-center justify-center w-full">
                  <hr className="w-full h-px my-8 bg-zinc-800 border-0" />
                  <span className="absolute pr-3 text-zinc-400 -translate-x-100 bg-zinc-950 left-0">
                    Chat
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Clear chat</span>
                  <button
                    className="flex items-center justify-center w-8 h-8 rounded-full text-zinc-100 font-medium"
                  >
                    <Icon icon="ChatCircle" className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Delete chat</span>
                  <button
                    className="flex items-center justify-center w-8 h-8 rounded-full text-zinc-100 font-medium"
                  >
                    <Icon icon="Trash" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </main>
          </div>
        </aside>
      )}
    </>
  );
}
