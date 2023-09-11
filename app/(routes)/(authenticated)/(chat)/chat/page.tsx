'use client'

import { useEffect, useState } from "react";

import { Chat } from "@/components/Chat";

import { getUserChats, getUsers } from "app/helpers/importers/getUsers";
import { useAuth } from "app/hooks/useAuth";
import { realtimeDb } from "app/services/firebase";
import { useDocumentSize } from "app/hooks/useDocumentSize";
import { useSearchParams } from "next/navigation";

const ChatPage = () => {
  const { user } = useAuth();

  const params = useSearchParams();
  const chatId = params.get('id');

  const [selectedChat, setSelectedChat] = useState(null);

  const handleSelectedChat = (chat: any) => setSelectedChat(chat);

  useEffect(() => {
    if (!chatId) return;
  
    const chatRef = realtimeDb.ref(`chats/${chatId}`);

    const getChatInfo = async () => {
      const chatSnapshot = await chatRef.once('value');
      const chat = chatSnapshot.val();

      if (!chat) return null;

      const participants = chat.participants;
      const contact = participants.find((participant: any) => participant.id !== user.id);

      if (!contact) return null;

      const contactDetails = await getUsers({ id: contact.id });

      if (!contactDetails) return null;

      const chatData: any = {
        chat_info: chat,
        contact_info: contactDetails[0],
      }

      setSelectedChat(chatData)
    }

    getChatInfo();
  }, [chatId]);

  return (
    <Chat.Root>
      <Chat.Content
        chat={selectedChat}
        onChatSelected={handleSelectedChat}
        selectedChat={selectedChat}
      />
    </Chat.Root>
  )
}

export default ChatPage;
