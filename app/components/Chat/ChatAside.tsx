'use client'

import { useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "app/hooks/useAuth";
import { handleAddContact } from "app/hooks/handles/handleAddContact";
import { getUsers } from "app/helpers/importers/getUsers";
import { getChatContent } from "app/helpers/importers/getChats";

import Icon from "../Icon";
import { useDocumentSize } from "app/hooks/useDocumentSize";
import { useUserAgent } from "app/hooks/useUserAgent";
import { getMediaType, isMedia } from "app/helpers/validators/isMedia";

interface ChatAsideProps {
  chats: any;
  changeChats: any;
  onChatSelected: (chat: any) => void;
  selectedChat: any;
  loading: boolean;
}

export const ChatAside = ({
  chats,
  onChatSelected,
  selectedChat,
  loading
}: ChatAsideProps) => {
  if (!chats)
    throw new Error("Chats not found at Chat Root Component.");

  const { user, signOut } = useAuth();
  const { documentHeight } = useDocumentSize();
  const { browser, operatingSystem } = useUserAgent();

  const router = useRouter();
  const pathname = usePathname();

  const [localChats, setLocalChats] = useState(chats);
  const [openedModal, setOpenedModal] = useState<null | string>(null);

  const firstName = user.name && user.name.split(" ")[0];

  const handleSignOut = async () =>
    confirm("Are you sure you want to sign out?") && await signOut();

  const handleAddContactAsync = async () => {
    const contactInfo = prompt("Enter the username, ID, or email of the user you want to start a conversation with:");

    if (contactInfo === null) return;

    if (!user || !user.id) return;

    try {
      await handleAddContact(user.id, contactInfo);

      const newChatList = [];

      for (const chat of localChats) {
        if (!chat || !chat.content) continue;

        const newParticipants = await Promise.all(
          chat.content.participants
            .filter((participant: any) => participant.id !== user.id)
            .map(async () => await getUsers({ id: user.id }))
        );

        newChatList.push({
          ...chat,
          content: {
            ...chat.content,
            participants: newParticipants[0],
          },
        });
      }

      setLocalChats(newChatList);

      if (newChatList.length > 0) {
        const newChat = await getChatContent(newChatList[newChatList.length - 1]?.id);

        if (!newChat) return;

        newChatList[newChatList.length - 1].content = newChat;
        setLocalChats(newChatList);
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (!openedModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenedModal(null);
    };

    const handleClickOutside = (event: any) => {
      if (!event.target) return;

      if (event.target.id !== "settings-modal" &&
        event.target.parentNode.id !== "settings-modal") setOpenedModal(null)
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    }
  }, [openedModal]);

  useEffect(() => {
    if (chats) setLocalChats(chats);
  }, [chats]);

  useEffect(() => {
    if (!selectedChat) return;

    const url = `${pathname}?id=${selectedChat.chat_info.id}`;
    if (pathname !== url) router.push(url);
  }, [selectedChat]);

  return (
    <aside
      className={`flex flex-col flex-grow min-w-96 w-full overflow-hidden md:max-w-[420px] bg-zinc-950 border-r border-zinc-900 ${selectedChat ? "max-md:-translate-x-full" : "max-md:translate-x-0"} max-md:absolute max-md:left-0 max-md:z-50`}
      style={{ height: documentHeight ? documentHeight : "100vh" }}
    >
      <header className="flex justify-between items-center p-4 gap-4 h-20 sm:h-full max-h-24 border-b border-zinc-800 bg-zinc-1000">
        <div className="flex items-center gap-4 h-full">
          <picture className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border border-zinc-800 rounded-full overflow-hidden">
            <img
              src={
                user && user.avatar
                  ? user.avatar
                  : `https://images.placeholders.dev/?width=320&height=320&text=${user?.username ? user.username[0] : ''
                  }&bgColor=%2318181b&textColor=%23fff&fontSize=120`
              }
              alt={`${user?.username || ''} profile's picture`}
              className="pointer-events-none select-none"
            />
          </picture>
          <div className="hidden xs:flex flex-col">
            <strong className="text-zinc-100">{firstName ? firstName : "User"}</strong>
            <span className="text-zinc-500">
              {user ? user.username : "Loading..."}
            </span>
          </div>
        </div>
        <div className="flex items-center h-full">
          <button
            className="flex items-center justify-center min-w-12 h-12 rounded text-base text-zinc-100 p-4"
            onClick={handleAddContactAsync}
          >
            <Icon icon="Plus" size={20} />
          </button>
          <button
            className="flex items-center justify-center min-w-12 h-12 rounded text-base text-zinc-100 p-4"
          >
            <Icon icon="Bell" size={20} />
          </button>
        </div>
      </header>
      <ul className="divide-y divide-zinc-800 overflow-y-auto h-full">
        <li
          className={`relative flex items-center gap-4 p-4 cursor-pointer bg-zinc-1000 w-full duration-75`}
        >
          <div className="flex-shrink-0 w-12 h-12">
            <picture className="w-12 h-12 flex items-center justify-center border border-zinc-800 rounded-full overflow-hidden">
              <Icon icon="LockSimple" className="w-5 h-5" />
            </picture>
          </div>
          <div className="flex items-center justify-start overflow-hidden w-full gap-4">
            <div className="flex flex-col items-start w-full overflow-hidden">
              <strong className="text-zinc-200">
                Personal Chat
              </strong>
              <p className="text-zinc-400 truncate">
                Your saved messages
              </p>
            </div>
          </div>
        </li>

        {loading ? (
          <li className="flex items-center justify-center p-4">
            <span className="text-zinc-400">Loading...</span>
          </li>
        ) : (
          chats && chats.length > 0 && localChats ? (
            localChats.map((chat: any, index: number) => {
              if (!chat || !chat.chat_info) return null;

              const {
                chat_info,
                contact_info
              } = chat;

              const chatMessages: any = chat_info.messages ? Object.values(chat_info.messages) : [];

              const lastMessage = {
                ...chatMessages[chatMessages.length - 1],
                message: chatMessages[chatMessages.length - 1]?.content,
                sender: chatMessages[chatMessages.length - 1]?.sender,
              }

              const lastMessageIsMedia = isMedia(lastMessage.message);
              const lastMessageMediaType = lastMessageIsMedia ? getMediaType(lastMessage.message) : null;

              const lastMessagePreview = (
                lastMessageIsMedia
                  ? lastMessageMediaType === "image"
                    ? "Sent an image."
                    : lastMessageMediaType === "video"
                      ? "Sent a video."
                      : lastMessageMediaType === "audio"
                        ? "Sent an audio."
                        : lastMessage.message
                  : lastMessage.message
              )

              const chatMessagesArray = chatMessages ? Object.values(chatMessages) : [];
              const isUnread = chatMessagesArray.some((message: any) => !message.isReaded);

              const contact = chat_info.participants.find((participant: any) => participant.id !== user.id);

              if (!contact) return null;

              return (
                <button
                  key={index}
                  className={`relative flex items-center w-full gap-4 p-4 cursor-pointer ${selectedChat === chat ? "bg-rose-950 bg-opacity-25 hover:bg-rose-900 hover:bg-opacity-30" : "bg-zinc-950 hover:bg-zinc-900"} duration-75`}
                  onClick={() => {
                    onChatSelected(chat);
                  }}
                >
                  {selectedChat === chat && (
                    <div className="absolute left-0 w-1 h-full bg-rose-900" />
                  )}
                  <div className="flex-shrink-0 w-12 h-12">
                    <picture className="w-12 h-12 flex items-center justify-center border border-zinc-800 rounded-full overflow-hidden">
                      <img
                        src={contact_info.avatar ? contact_info.avatar : `https://images.placeholders.dev/?width=320&height=320&text=${contact_info.username[0]}&bgColor=%2318181b&textColor=%23fff&fontSize=120`}
                        alt={`${contact_info.name} profile's picture`}
                        className="pointer-events-none select-none"
                      />
                    </picture>
                  </div>
                  <div className="flex items-center justify-center overflow-hidden w-full gap-4">
                    <div className="flex flex-col w-full text-left overflow-hidden">
                      <span className="text-zinc-200 =">{contact_info.name}</span>
                      <p className="text-zinc-400 truncate">
                        {selectedChat === chat ? (
                          `Chatting with ${contact_info.name}.`
                        ) : (
                          lastMessage.message
                            ? lastMessage.sender === user.username
                              ? `You: ${lastMessagePreview}`
                              : lastMessagePreview
                            : `Start a conversation with ${contact_info.name}.`
                        )}
                      </p>
                    </div>
                    {selectedChat === chat ? null : (
                      isUnread && chat.messages && (
                        <span className="flex flex-shrink-0 items-center justify-center w-8 h-8 rounded-full bg-rose-950 bg-opacity-25 border border-rose-950 text-sm text-zinc-100 font-medium">
                          {chat.messages.filter((message: any) => !message.isReaded).length}
                        </span>
                      ))}
                  </div>
                </button>
              )
            })
          ) : (
            <li className="flex items-center justify-center p-4">
              <span className="text-zinc-400">No chats found.</span>
            </li>
          )
        )}

      </ul>
      <footer className="flex justify-between items-center text-2xl p-4 h-20 sm:h-full max-h-[81px] border-t border-zinc-800 bg-zinc-1000">
        <div className="flex flex-col w-full items-start justify-center h-full text-sm text-zinc-500 pointer-events-none select-none">
          {!browser || !operatingSystem ? (
            <span>Loading...</span>
          ) : (
            <>
              <span>{`${browser.name}, ${browser.version}`}</span>
              <p>{`${operatingSystem.version}`}</p>
            </>
          )}
        </div>
        <a
          className="relative flex items-center justify-center w-12 h-12 rounded bg-zinc-900 border border-zinc-800 text-base text-zinc-100 p-4 cursor-pointer"
          onClick={() => {
            setOpenedModal(openedModal === "settings" ? null : "settings");
          }}
        >
          <section
            className={`group absolute right-0 top-0 w-fit h-fit rounded bg-zinc-900 border border-zinc-800 text-base text-zinc-100 transition-all duration-150 ${openedModal === "settings" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} divide-y divide-zinc-700 overflow-hidden`}
            style={{
              transform: `${openedModal === "settings" ? "translateY(calc(-100% - .5rem))" : "translateY(0%)"} translateX(1px)`,
            }}
            onClick={(e: any) => e.stopPropagation()}
            aria-modal="true"
            role="dialog"
            id="settings-modal"
          >
            <button
              className="flex items-center justify-start gap-2 w-full h-12 text-sm p-4 disabled:hover:bg-zinc-900 hover:bg-zinc-950 hover:border-zinc-700 transition-all duration-150 pointer-events-none group-hover:pointer-events-auto disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed"
              disabled
            >
              <Icon icon="Warning" size={16} className="pointer-events-none" />
              <p className="pointer-events-none">
                Report
              </p>
            </button>
            <button
              className="flex items-center justify-start gap-2 w-full h-12 text-sm p-4 disabled:hover:bg-zinc-900 hover:bg-zinc-950 hover:border-zinc-700 transition-all duration-150 pointer-events-none group-hover:pointer-events-auto disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed"
              disabled
            >
              <Icon icon="Gear" size={16} className="pointer-events-none" />
              <p className="pointer-events-none">
                Settings
              </p>
            </button>
            <button
              className="flex items-center justify-start gap-2 w-max h-12 text-sm p-4 disabled:hover:bg-zinc-900 hover:bg-zinc-950 hover:border-zinc-700 transition-all duration-150 pointer-events-none group-hover:pointer-events-auto disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed"
              onClick={handleSignOut}
            >
              <Icon icon="SignOut" size={16} className="pointer-events-none" />
              <p className="pointer-events-none">
                Sign Out
              </p>
            </button>
          </section>
          <Icon icon="Gear" size={16} />
        </a>
      </footer>
    </aside>
  )
}
