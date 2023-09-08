'use client'

import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
import { format } from 'date-fns';

import Icon from "../Icon";
import { handleSendMessage } from "app/hooks/handles/handleSendMessage";
import { useAuth } from "app/hooks/useAuth";
import { handleRemoveContact } from "app/hooks/handles/handleRemoveContact";
import { realtimeDb } from "app/services/firebase";
import { useDocumentSize } from "app/hooks/useDocumentSize";
import { EmojiPicker } from "../Emoji/EmojiPicker";

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
  const { documentHeight } = useDocumentSize();

  const [messages, setMessages] = useState(chat ? chat.messages : []);
  const [typedMessage, setTypedMessage] = useState("");

  const [isOpenChatInfo, setIsOpenChatInfo] = useState<boolean>(false);
  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState<boolean>(false);
  const [isOpenReactToMessage, setIsOpenReactToMessage] = useState<any>(false);

  const messageContainerRef = useRef<HTMLDivElement>(null);
  const messageDivContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadElement>(null);
  const bottomOfListRef = useRef<HTMLLIElement>(null);
  const barActionRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const reactionsContainerRef = useRef<HTMLDivElement | null>(null);

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
      setIsOpenEmojiPicker(false);

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

  const handleReadMessage = (chat: any, chatId: string) => {
    if (!chat || !chat.messages) return;

    const messages = Object.values(chat.messages);

    if (messages.some((message: any) => !message.isReaded)) {
      const updatedMessages = messages.map((message: any) => {
        if (!message.isReaded && message.sender !== user.username) {
          return { ...message, isReaded: true };
        }
        return message;
      });

      realtimeDb.ref(`chats/${chatId}/messages`).update(updatedMessages);
    }
  };

  const handleReactToMessage = (message: any, reaction: string) => {
    if (!user || !message || !isOpenReactToMessage) return;

    const { sender, content, timestamp, isReaded } = message;

    const messageContent = {
      sender,
      content,
      timestamp,
      isReaded,
      reactions: [
        {
          type: reaction,
          reactedBy: [
            {
              id: user.id,
              username: user.username,
              timestamp: new Date().toISOString()
            }
          ]
        }
      ]
    };

    console.log(messageContent);

    alert(`Reacted to message with ${reaction}.`);
  }

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
    if (isOpenReactToMessage) return console.log(isOpenReactToMessage);
  }, [isOpenReactToMessage]);

  useEffect(() => {
    if (textareaRef.current) handleChangeTextAreaHeight(textareaRef.current);
  }, [typedMessage]);

  useEffect(() => {
    if (!selectedChat || !selectedChat.chat_info || !selectedChat.chat_info.id) return;

    const chat = selectedChat.chat_info;
    const chatId = chat.id;
    const messagesRef = realtimeDb.ref(`chats/${chatId}/messages`);

    setMessages([]);

    const handleNewMessage = (snapshot: any) => {
      if (!snapshot.exists()) return;

      const allMessages = Object.values(snapshot.val());

      const uniqueMessages = new Set(allMessages);

      const uniqueMessagesArray = Array.from(uniqueMessages);

      setMessages(uniqueMessagesArray);
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
    if (chat && messages) {
      handleScrollToRecentMessage();
      handleReadMessage(chat, chat.id);
    }
  }, [messages]);

  useEffect(() => {
    if (!emojiPickerRef.current || !isOpenEmojiPicker || !messageDivContainerRef.current) return;

    messageDivContainerRef.current.style.height = `${emojiPickerRef.current.clientHeight}px`;
  }, [emojiPickerRef, emojiPickerRef.current?.clientHeight, messageDivContainerRef, isOpenEmojiPicker]);

  useEffect(() => {
    if (!messages || !barActionRef.current || !textareaRef.current) return;

    messageContainerRef.current!.style.maxHeight = `calc(100% - (calc(${barActionRef.current.clientHeight}px + 1px)) - calc(${headerRef.current!.clientHeight}px + 1px))`;
  }, [messages, typedMessage, barActionRef.current?.clientHeight, textareaRef.current?.clientHeight, window.innerWidth]);

  useEffect(() => {
    if (!textareaRef.current) return;

    if (isOpenEmojiPicker) textareaRef.current.blur();

  }, [document.activeElement, textareaRef.current, isOpenEmojiPicker]);

  return (
    <>
      <div
        className="relative flex flex-col flex-grow w-full overflow-hidden scrollbar-hide"
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
                <span className="flex flex-col items-start justify-start text-left">
                  <h1 className="font-medium text-sm sm:text-lg">{contact.name}</h1>
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
          className="flex-1 bg-zinc-950 overflow-y-auto"
          ref={messageContainerRef}
        >
          {chat && user ? (
            messages && messages.length > 0 ? (
              <>
                <ul className="flex flex-1 flex-col w-full pl-2 py-2 overflow-x-hidden">
                  {messages.map((message: any, index: number) => {
                    const participants = chat.chat_info.participants;

                    const isUser = message.sender === user.username;
                    const isReaded = message.isReaded;

                    const containsLongWord = message.content.split(" ").some((word: string) => word.length > 20);

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
                    const messageWidth = message.content.length * 8;

                    const availableReactions = [
                      {
                        type: "like",
                        icon: "👍",
                        title: "Like"
                      },
                      {
                        type: "love",
                        icon: "❤️",
                        title: "Love"
                      },
                      {
                        type: "haha",
                        icon: "😂",
                        title: "Haha"
                      },
                      {
                        type: "wow",
                        icon: "😮",
                        title: "Wow"
                      },
                      {
                        type: "sad",
                        icon: "😢",
                        title: "Sad"
                      },
                      {
                        type: "angry",
                        icon: "😡",
                        title: "Angry"
                      }
                    ];

                    const hasUrl = (text: string) => {
                      const urlRegex = /((https?:\/\/[^\s<>"]+)|(www\.[^\s<>"]+)|(ftp:\/\/[^\s<>"]+)|([^\s<>"]+\.[^\s<>"]{2,}))/g;

                      const matches = text.match(urlRegex);

                      if (!matches) return text;

                      let lastIndex = 0;
                      const elements = [];

                      matches.forEach((match, index) => {
                        const startIndex = text.indexOf(match, lastIndex);
                        const nonUrlPart = text.substring(lastIndex, startIndex);

                        if (nonUrlPart) {
                          elements.push(nonUrlPart);
                        }

                        let fullUrl = match;

                        if (!/^https?:\/\//i.test(fullUrl) && !/^www\./i.test(fullUrl)) {
                          fullUrl = `http://${fullUrl}`;
                        }

                        elements.push(
                          <a
                            key={index}
                            href={fullUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-rose-400 hover:underline"
                          >
                            {match}
                          </a>
                        );

                        lastIndex = startIndex + match.length;
                      });

                      if (lastIndex < text.length) {
                        const remainingText = text.substring(lastIndex);
                        elements.push(remainingText);
                      }

                      return elements;
                    };

                    const handleOpenReactToMessage = (message: any) => {
                      if (!isUser && message !== isOpenReactToMessage) setIsOpenReactToMessage(message);
                    }

                    const messageItem = (
                      <li
                        key={index}
                        className={`group flex flex-col ${isUser ? "items-end" : "items-start"} gap-1 w-full ${!isSameAsPrevious && index !== 0 ? "mt-4" : "mt-1"}`}
                        onClick={(event: any) => {
                          if (
                            reactionsContainerRef.current &&
                            !reactionsContainerRef.current.contains(event.target)
                          ) setIsOpenReactToMessage(false);
                        }}
                      >
                        <div
                          className={`relative sm:flex flex-wrap items-center ${isUser ? "flex-row-reverse justify-end" : "flex-row justify-start"} max-w-3xl ${isUser ? "bg-rose-950" : "bg-zinc-900"} px-4 ${participants && participants.length > 2 && !isUser ? "pt-8 pb-3" : "py-3"} rounded-md ${isSameAsNext ? "mb-0" : "mb-2"}`}
                          style={{
                            direction: isUser ? "rtl" : "ltr"
                          }}
                        >
                          {availableReactions && isOpenReactToMessage && isOpenReactToMessage === message && (
                            <section className={`absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center w-full h-full z-10`}>
                              <div className={`absolute top-0 bottom-0 left-0 right-0 flex items-center justify-end w-full h-full bg-black bg-opacity-50 z-10`}>
                                <div
                                  className={`flex items-center justify-center gap-2 p-4 w-fit h-16 bg-zinc-1000 border border-zinc-800 rounded-md`}
                                  style={{
                                    transform: `${messageWidth > 100 ? `translateX(calc(50% + 25px))` : `translateX(70%)`} translateY(-90%)`
                                  }}
                                  ref={reactionsContainerRef}
                                >
                                  {availableReactions.length > 0 && availableReactions.map((reaction, index) => (
                                    <button
                                      key={index}
                                      className={`flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm`}
                                      onClick={() => {
                                        handleReactToMessage(message, reaction.type);
                                        setIsOpenReactToMessage(false);
                                      }}
                                      title={`Reacts with ${reaction.title}`}
                                    >
                                      {reaction.icon}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </section>
                          )}
                          <div className={`${isOpenReactToMessage === message ? "opacity-100" : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"} flex items-center justify-center gap-1 m-auto absolute translate-x-0 ${isUser ? "-left-10 -translate-x-full" : "-right-2 translate-x-full"} transition-all duration-300 mt-2 sm:mt-0`}>
                            {!isUser && (
                              <button
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm"
                                onClick={() => handleOpenReactToMessage(message)}
                              >
                                <Icon icon="Smiley" size={16} />
                              </button>
                            )}
                            <button
                              className="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto flex items-center justify-center w-8 h-8 rounded-full text-zinc-400 text-sm transition-all duration-300"
                              onClick={() => alert("Favorited this message.")}
                            >
                              <Icon icon="Star" size={16} />
                            </button>
                          </div>
                          {participants && participants.length > 2 && !isUser && (
                            <strong className="absolute top-3 text-xs text-zinc-400 font-medium mr-2">
                              {message.sender}
                            </strong>
                          )}
                          <p
                            className={`w-fit text-sm text-start whitespace-pre-wrap leading-6 text-white pr-3`}
                            style={{
                              overflowWrap: containsLongWord ? "normal" : "break-word",
                              wordBreak: containsLongWord ? "break-all" : "normal",
                              direction: "ltr",
                            }}
                          >
                            {hasUrl(message.content)}
                          </p>
                          <div className={`flex ${isUser ? "basis-8" : "basis-7"} items-center gap-2 w-fit h-full pointer-events-none select-none mt-2`}>
                            {isUser && (
                              <span className={`relative flex items-center justify-center rounded-full ${isReaded ? "text-green-600" : "text-zinc-400"} font-medium`}>
                                {isReaded ? (
                                  <>
                                    <Icon icon="Check" size={16} className={`mr-1`} />
                                    <Icon icon="Check" size={16} className={`absolute left-[5px] top-0 bottom-0`} />
                                  </>
                                ) : (
                                  <Icon icon="Check" size={16} />
                                )}
                              </span>
                            )}
                            <span
                              className={`text-xs text-zinc-400`}
                              title={format(new Date(message.timestamp), "dd/MM/yyyy HH:mm")}
                            >
                              {format(new Date(message.timestamp), "HH:mm")}
                            </span>
                          </div>
                          {!isSameAsNext && (
                            <div
                              className={`absolute ${isUser ? "right-0 rotate-180 rounded-br-0" : "left-0 -rotate-180 rounded-bl-0"} -bottom-2 -scale-x-100 w-4 h-4 ${isUser ? "bg-rose-950" : "bg-zinc-900"}`}
                              style={{
                                clipPath: `polygon(${isUser ? "100% 0%, 0% 100%, 100% 100%" : "0% 0%, 100% 100%, 0% 100%"})`,
                                backgroundColor: isUser ? "bg-zinc-900" : "bg-zinc-950"
                              }}
                            />
                          )}
                        </div>
                      </li>
                    );

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
                <section
                  className="w-full transition-all duration-500"
                  ref={messageDivContainerRef}
                  style={{ height: isOpenEmojiPicker && emojiPickerRef.current ? `calc(${emojiPickerRef.current.clientHeight}px + 0px)` : "0px" }}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full gap-4">
                <Icon icon="SmileyWink" weight="light" className="w-24 h-24 text-2xl text-zinc-400" />
                <p className="text-zinc-400 text-xl text-center px-4">Your messages will appear here.</p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full gap-4">
              <Icon icon="Chat" weight="light" className="w-24 h-24 text-2xl text-zinc-400" />
              <h1 className="text-zinc-400 text-xl text-center px-4">Select a chat to start messaging.</h1>
            </div>
          )}
        </main>
        {chat && (
          <footer
            className="fixed bottom-0 z-10 w-full h-fit"
            style={{ width: "-webkit-fill-available" }}
          >
            <EmojiPicker
              className={`absolute bottom-20 flex flex-col w-full h-fit max-h-[480px] gap-2 p-4 bg-zinc-1000 border-t border-zinc-800 ${isOpenEmojiPicker ? "" : " translate-y-full pointer-events-none"} transition-all duration-500`}
              removeDefaultStyles
              onEmojiSelect={({ character }: any) => setTypedMessage(typedMessage + character)}
              ref={emojiPickerRef}
            />
            <form
              className={`fixed bottom-0 flex items-center justify-between h-fit max-h-40 w-full px-2 sm:px-4 py-4 border-t border-zinc-800 bg-zinc-1000 z-50 overflow-hidden`}
              onSubmit={(e: FormEvent) => e.preventDefault()}
              onClick={() => textareaRef.current?.focus()}
              ref={barActionRef}
              style={{ width: "-webkit-fill-available" }}
            >
              <button
                className={`flex items-center justify-center border border-transparent ${isOpenEmojiPicker ? "w-12 h-12 rounded bg-zinc-900 border-zinc-800 text-base text-zinc-100 p-3" : "h-12 rounded text-zinc-100 font-medium w-12"}${typedMessage ? " mr-2 md:mr-4" : ""} transition duration-300`}
                onClick={() => setIsOpenEmojiPicker(!isOpenEmojiPicker)}
              >
                <Icon icon="Smiley" className="w-5 h-5" />
              </button>
              <button
                className={`flex items-center justify-center h-12 rounded text-zinc-100 font-medium ${typedMessage ? "invisible opacity-0 w-0 -translate-x-12" : "visible opacity-100 w-12 translate-x-0 mr-2 md:mr-4"} transition-all duration-300`}
                onClick={() => fileInputRef.current?.click()}
              >
                <Icon icon="Paperclip" className="w-5 h-5" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*, video/*, audio/*"
                  multiple
                  ref={fileInputRef}
                  onChange={(e) => {
                    const files = e.target.files;

                    if (!files || files.length === 0) return;

                    console.log(files);
                  }}
                />
              </button>
              <textarea
                className="flex-1 w-full bg-transparent text-zinc-100 placeholder-zinc-400 focus:outline-none h-[30px] resize-none disabled:opacity-50 disabled:cursor-not-allowed overflow-y-auto"
                ref={textareaRef}
                rows={1}
                placeholder="Type a message"
                onChange={(e) => {
                  setTypedMessage(e.target.value);
                  handleChangeTextAreaHeight(e.target);

                  if (isOpenEmojiPicker) setIsOpenEmojiPicker(false);
                }}
                onKeyDown={(e) => {
                  if (window.innerWidth > 768 && e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleWriteMessage();
                  }
                }}
                onFocus={() => {
                  if (isOpenEmojiPicker) setIsOpenEmojiPicker(false);
                }}
                disabled={!chat || !user}
                value={typedMessage}
                style={{ maxHeight: "8rem", width: "-webkit-fill-available" }}
              />
              <button
                type="submit"
                className={`flex items-center justify-center w-12 h-12 rounded text-zinc-100 font-medium ${!typedMessage ? "opacity-50" : "bg-rose-600 hover:bg-rose-700"} transition duration-300 ml-2 sm:ml-4`}
                onClick={handleWriteMessage}
              >
                <Icon icon="PaperPlane" className="w-5 h-5 rotate-90" />
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
                    Contact
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Delete contact</span>
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
