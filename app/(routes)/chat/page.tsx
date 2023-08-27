'use client'

import { Chat } from "app/components/Chat";
import chatData from "app/data/chatData.json";
import { useState } from "react";

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  const handleSelectedChat = (chat: any) => {
    setSelectedChat(chat);
  }

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
