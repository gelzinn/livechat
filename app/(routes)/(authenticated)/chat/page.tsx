'use client'

import { useEffect, useState } from "react";

import { Chat } from "@/components/Chat";

import { getUserChats, getUsers } from "app/helpers/importers/getUsers";
import { useAuth } from "app/hooks/useAuth";
import { realtimeDb } from "app/services/firebase";
import { RingLoading } from "@/components/Loading/Ring";

const ChatPage = () => {
  const { user } = useAuth();

  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const handleSelectedChat = (chat: any) => setSelectedChat(chat);

  const getChats = async () => {
    try {
      setLoading(true);

      const userChatsIds = await getUserChats(user.id);

      const chatDetailsPromises = userChatsIds.map(async (chatId: any) => {
        const chatRef = realtimeDb.ref(`chats/${chatId}`);
        const chatSnapshot = await chatRef.once('value');
        const chat = chatSnapshot.val();

        if (!chat) return null;

        const participants = chat.participants;
        const contact = participants.find((participant: any) => participant.id !== user.id);

        if (!contact) return null;

        const contactDetails = await getUsers({ id: contact.id });

        if (!contactDetails) return null;

        return {
          chat_info: chat,
          contact_info: contactDetails[0],
        };
      });

      const chat = await Promise.all(chatDetailsPromises);
      const chatListFiltered: any = chat.filter((chat: any) => chat !== null);

      setChats(chatListFiltered);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) getChats();
  }, [user]);

  return (
    <main
      className="flex flex-col flex-1 h-screen overflow-hidden bg-zinc-950"
    >
      {chats ? (
        chats.length > 0 ? (
          <Chat.Root>
            <Chat.Aside
              chats={chats}
              changeChats={setChats}
              onChatSelected={handleSelectedChat}
              selectedChat={selectedChat}
              loading={loading}
            />
            <Chat.Content
              chat={selectedChat}
              onChatSelected={handleSelectedChat}
              selectedChat={selectedChat}
            />
          </Chat.Root>
        ) : (
          <div className="flex flex-col items-center justify-center flex-grow">
            <p className="text-xl font-bold text-zinc-500">No chats found.</p>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow">
          <RingLoading />
        </div>
      )}
    </main>
  )
}

export default ChatPage;
