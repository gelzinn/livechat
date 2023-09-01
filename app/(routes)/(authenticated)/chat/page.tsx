'use client'

import { Chat } from "@/components/Chat";
import { getChatContent } from "app/helpers/importers/getChats";
import { getUserChats } from "app/helpers/importers/getUsers";
import { useAuth } from "app/hooks/useAuth";
import { useEffect, useState } from "react";

const ChatPage = () => {
  const { user } = useAuth();

  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState<any>([]);

  const handleSelectedChat = (chat: any) => setSelectedChat(chat);

  const getChats = async () => {
    const chatsId = await getUserChats(user.id);
    const chatsWithContent = await Promise.all(chatsId.map(async (chatId: string) => {
      const chatContent = await getChatContent(chatId);
      return {
        id: chatId,
        content: chatContent,
      };
    }));

    setChats(chatsWithContent);
  }

  useEffect(() => {
    if (!user) return;

    getChats();
  }, [user]);

  return (
    <main>
      <Chat.Root>
        <Chat.Aside
          chats={chats}
          onChatSelected={handleSelectedChat}
          selectedChat={selectedChat}
        />
        <Chat.Content
          chat={selectedChat}
          onChatSelected={handleSelectedChat}
          selectedChat={selectedChat}
        />
      </Chat.Root>
    </main>
  )
}

export default ChatPage;
