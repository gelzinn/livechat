'use client'

import { Chat } from "@/components/Chat";
import chatData from "app/data/chatData.json";
import { getUserContacts } from "app/helpers/importers/getUsers";
import { useEffect, useState } from "react";

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  const handleSelectedChat = (chat: any) => {
    setSelectedChat(chat);
  }

  useEffect(() => {
    const test = async () => {
      const test = await getUserContacts('fvSJV04mvDZFrKzdQKQFakNu6nr1')

      console.log(test);
    };

    test();
  }, []);

  return (
    <main>
      <Chat.Root>
        <Chat.Aside
          chats={chatData}
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
