'use client'

import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
import { format } from 'date-fns';

import Icon from "../Icon";
import { handleSendMessage } from "app/hooks/handles/handleSendMessage";
import { useAuth } from "app/hooks/useAuth";
import { handleRemoveContact } from "app/hooks/handles/handleRemoveContact";
import { realtimeDb } from "app/services/firebase";

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
  const { user } = useAuth();

  const [documentHeight, setDocumentHeight] = useState<number>(window.innerHeight);

  const [messages, setMessages] = useState(chat ? chat.messages : []);
  const [typedMessage, setTypedMessage] = useState("");

  const [isOpenChatInfo, setIsOpenChatInfo] = useState<boolean>(false);

  const messageContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadElement>(null);
  const bottomOfListRef = useRef<HTMLLIElement>(null);
  const barActionRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const contact = chat ? chat.contact_info : null;

  const handleUnselectChat = () => onChatSelected(null);

  const handleWriteMessage = async () => {
    if (!user || !typedMessage) return;

    try {
      const messageContent = {
        sender: user.username,
        content: typedMessage.trim(),
        timestamp: new Date().toISOString(),
        isReaded: false
      };

      if (textareaRef.current) {
        handleChangeTextAreaHeight(textareaRef.current);
        textareaRef.current.disabled = true;
      }

      await handleSendMessage(chat.chat_info.id, user, messageContent);
      setTypedMessage("");

      setTimeout(() => {
        handleScrollToRecentMessage();

        if (textareaRef.current) {
          textareaRef.current.disabled = false;
          textareaRef.current.focus();
        }
      }, 100);

      setTypedMessage("");
    } catch (error) {
      throw error;
    }
  }

  // const handleReadMessage = (updatedChat: any) => {
  //   if (updatedChat.messages.some((message: any) => !message.isReaded)) {
  //     const newMessages = updatedChat.messages.map((message: any) => {
  //       if (!message.isReaded && message.sender !== 'user') {
  //         return { ...message, isReaded: true };
  //       }
  //       return message;
  //     });

  //     setMessages(newMessages);
  //   }
  // }

  const handleChangeTextAreaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;

    if (textareaRef.current) {
      const lineCount = textareaRef.current.value.split('\n').length;
      textareaRef.current.rows = lineCount;

      if (typedMessage === "") element.style.height = "auto";
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
    if (textareaRef.current) handleChangeTextAreaHeight(textareaRef.current);
  }, [typedMessage]);

  useEffect(() => {
    if (!selectedChat || !selectedChat.chat_info || !selectedChat.chat_info.id) return;

    const chatId = selectedChat.chat_info.id;
    const messagesRef = realtimeDb.ref(`chats/${chatId}/messages`);

    setMessages([]);

    const handleNewMessage = (snapshot: any) => {
      if (!snapshot.exists()) return;

      const allMessages = Object.values(snapshot.val());

      const uniqueMessages = new Set(allMessages);

      const uniqueMessagesArray = Array.from(uniqueMessages);

      setMessages((prevMessages: any) => [...prevMessages, ...uniqueMessagesArray]);
    };

    try {
      messagesRef.on('value', handleNewMessage);

      handleScrollToRecentMessage();
    } catch (error) {
      throw error;
    } finally {
      return () => {
        messagesRef.off('value', handleNewMessage);
      };
    }
  }, [selectedChat]);

  useEffect(() => {
    if (chat && messages) handleScrollToRecentMessage();
  }, [messages]);

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
    <>
      <div
        className="flex flex-col flex-grow w-full overflow-hidden"
        style={{ height: documentHeight ? documentHeight : "100vh" }}
      >
        {chat && (
          <header
            className="flex justify-between items-center text-2xl sm:p-4 px-2 py-4 h-20 sm:h-full max-h-24 border-b border-zinc-800 bg-zinc-1000"
            ref={headerRef}
          >
            <div className="flex items-center h-full w-full">
              <button
                className="md:hidden flex items-center justify-center w-8 h-full rounded text-zinc-100 font-medium"
                onClick={handleUnselectChat}
              >
                <Icon icon="ArrowLeft" className="w-5 h-5" />
              </button>
              <button
                className="flex items-center gap-2 h-full w-full md:w-fit"
                onClick={() => setIsOpenChatInfo(!isOpenChatInfo)}
              >
                <picture className="w-10 h-10 sm:w-12 sm:h-12 mx-2 flex items-center justify-center border-2 border-zinc-800 rounded-full overflow-hidden">
                  <img
                    src={contact.avatar ? contact.avatar : `https://images.placeholders.dev/?width=320&height=320&text=${contact.username[0]}&bgColor=%2318181b&textColor=%23fff&fontSize=120`}
                    alt={`${contact.name} profile's picture`}
                    className="pointer-events-none select-none"
                  />
                </picture>
                <span className="flex flex-col items-start justify-center">
                  <h1 className="font-medium text-lg">{contact.name}</h1>
                  <p className="text-zinc-400 text-sm">@{contact.username}</p>
                </span>
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
          {chat && user ? (
            messages && messages.length > 0 && (
              <ul className="flex flex-1 flex-col p-4 pt-0">
                {messages.map((message: any, index: number) => {
                  const isUser = message.sender === user.username;
                  const isReaded = message.isReaded;

                  const prevMessage = index > 0 ? messages[index - 1] : null;
                  const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;

                  const isSameAsPrevious = index > 0 && prevMessage && prevMessage.sender === message.sender;
                  const isSameAsNext = nextMessage && nextMessage.sender === message.sender;

                  const currentDate = new Date(message.timestamp);
                  const today = new Date();
                  const yesterday = new Date(today);
                  yesterday.setDate(today.getDate() - 1);

                  const currentDateString =
                    currentDate.toDateString() === today.toDateString()
                      ? 'Today'
                      : currentDate.toDateString() === yesterday.toDateString()
                        ? 'Yesterday'
                        : format(currentDate, 'MMMM dd, yyyy');

                  const prevDate = prevMessage && new Date(prevMessage.timestamp);
                  const prevDateString = prevDate
                    ? prevDate.toDateString() === today.toDateString()
                      ? 'Today'
                      : prevDate.toDateString() === yesterday.toDateString()
                        ? 'Yesterday'
                        : format(prevDate, 'MMMM dd, yyyy')
                    : null;

                  const showDateDivider = prevDateString !== currentDateString;

                  const hasUrl = (text: string) => {
                    return text.replace(/(https?:\/\/[^\s]+|www\.[^\s]+)/g, (url: string) => {
                      const fullUrl = url.startsWith("http") ? url : `http://${url}`;
                      return `<a
                        href="${fullUrl}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class='text-rose-400 hover:underline'
                      >${url}</a>`;
                    });
                  }

                  const messageItem = (
                    <li
                      key={index}
                      className={`flex flex-col ${isUser ? "items-end" : "items-start"} gap-1 w-full ${!isSameAsPrevious && index != 0 ? "mt-6" : "mt-2"}`}
                    >
                      <div className={`relative flex max-sm:flex-col sm:flex-wrap ${isUser ? "items-end max-md:justify-end" : "items-start"} ${isUser ? "bg-rose-950" : "bg-zinc-900"} px-4 py-3 rounded-md gap-2 ${isUser ? "flex-row" : "flex-row"} w-fit max-w-3xl`}>
                        {!isSameAsNext && (
                          <div
                            className={`absolute ${isUser ? "right-0 rotate-180 rounded-br-0" : "left-0 -rotate-180 rounded-bl-0"} -bottom-2 -scale-x-100 w-4 h-4 ${isUser ? "bg-rose-950" : "bg-zinc-900"}`}
                            style={{
                              clipPath: `polygon(${isUser ? "100% 0%, 0% 100%, 100% 100%" : "0% 0%, 100% 100%, 0% 100%"})`,
                              backgroundColor: isUser ? "bg-zinc-900" : "bg-zinc-950"
                            }}
                          />
                        )}
                        <div className={`flex flex-col w-auto z-10 overflow-hidden ${isUser ? "items-end" : "items-start"}`}>
                          <p className="text-zinc-200 text-sm break-words whitespace-pre-line w-auto leading-6"
                            dangerouslySetInnerHTML={{ __html: hasUrl(message.content) }}
                            style={{}}
                          />
                        </div>
                        <div className={`flex flex-1 items-center gap-2 ${isUser ? "flex-row max-md:flex-row" : "max-md:flex-row"} w-auto h-5`}>
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

                  return (
                    <Fragment
                      key={index}
                    >
                      {showDateDivider && (
                        <div className="flex items-center justify-center w-full py-4 bg-zinc-950">
                          <span className="text-zinc-400 text-xs">{currentDateString}</span>
                        </div>
                      )}
                      {messageItem}
                    </Fragment>
                  )
                })}
                <li
                  ref={bottomOfListRef}
                  className="h-0"
                />
              </ul>
            )
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
              className="flex items-center justify-between h-full max-h-40 px-4 py-4 gap-4 border-t border-zinc-800 bg-zinc-1000"
              onSubmit={(e: FormEvent) => e.preventDefault()}
            >
              <textarea
                className="flex-1 w-full bg-transparent text-zinc-100 placeholder-zinc-400 focus:outline-none h-[30px] resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                ref={textareaRef}
                rows={1}
                placeholder="Type a message"
                onChange={(e) => {
                  setTypedMessage(e.target.value);
                  handleChangeTextAreaHeight(e.target);
                }}
                onKeyDown={(e) => {
                  if (window.innerWidth > 768 && e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleWriteMessage();
                  }
                }}
                disabled={!chat || !user}
                value={typedMessage}
                style={{ maxHeight: "8rem" }}
              />
              <button
                type="submit"
                className="flex items-center justify-center w-12 h-12 rounded-full text-zinc-100 font-medium"
                onClick={handleWriteMessage}
              >
                <Icon icon="PaperPlane" className="w-5 h-5 rotate-45" />
              </button>
            </form>
          </footer>
        )}
      </div >

      {chat && contact && (
        <aside
          className={`flex flex-grow w-full overflow-hidden fixed inset-0 z-50 bg-black bg-opacity-80 ${isOpenChatInfo ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} duration-300`}
          onClick={() => setIsOpenChatInfo(false)}
          style={{ height: documentHeight ? documentHeight : "100vh" }}
        >
          <div
            className={`fixed top-0 right-0 z-50 min-w-96 w-full md:max-w-[420px] h-full bg-zinc-950 border-l border-transparent md:border-zinc-900 ${isOpenChatInfo ? "translate-x-0" : "translate-x-full"} duration-300 overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between w-full h-20 sm:h-full max-h-24 px-4 py-4 border-b border-zinc-800 bg-zinc-1000">
              <h1 className="text-zinc-100 text-lg font-medium">{contact.name}</h1>
              <button
                className="flex items-center justify-center w-8 h-8 rounded-full text-zinc-100 font-medium"
                onClick={() => setIsOpenChatInfo(false)}
              >
                <Icon icon="X" className="w-5 h-5" />
              </button>
            </div>
            <main className="flex flex-col flex-grow w-full h-full mt-4">
              <div className="flex flex-col items-center justify-center gap-2 w-full min-h-40">
                <picture className="w-24 h-24 sm:w-32 sm:h-32 mx-2 flex items-center justify-center border border-zinc-800 rounded-full pointer-events-none select-none overflow-hidden">
                  <img
                    src={contact.avatar ? contact.avatar : `https://images.placeholders.dev/?width=320&height=320&text=${contact.username[0]}&bgColor=%2318181b&textColor=%23fff&fontSize=120`}
                    alt={`${contact.name} profile's picture`}
                    className="pointer-events-none select-none w-24 h-24 sm:w-32 sm:h-32"
                  />
                </picture>
                <div className="flex flex-col items-center justify-center">
                  <h1 className="text-zinc-100 text-lg font-medium">{contact.name}</h1>
                  <p className="text-zinc-400 text-sm">@{contact.username}</p>
                </div>
              </div>
              <div className="flex flex-col flex-grow gap-2 p-4">
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
                    Chat
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Delete chat</span>
                  <button
                    className="flex items-center justify-center w-8 h-8 rounded-full text-zinc-100 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!user || !contact || !chat || !messages || !(messages.length > 0)}
                    onClick={() => {
                      confirm("Are you sure you want to delete this chat?") && handleRemoveContact(user.id, contact.id);
                    }}
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
