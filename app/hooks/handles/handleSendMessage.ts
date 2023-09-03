import { realtimeDb } from "app/services/firebase";

export const handleSendMessage = async (chatId: string, user: any, message: any) => {
  if (!chatId || !user || !message) throw new Error('Missing parameters');

  try {
    const chatRef = realtimeDb.ref(`chats/${chatId}/messages`);
    const newMessageRef = chatRef.push();

    await newMessageRef.set(message);

    const metadata = {
      lastMessage: message.content,
      lastMessageAt: message.timestamp,
      lastMessageBy: user.username,
    };

    await chatRef.parent!.update({
      metadata
    });
  } catch (error) {
    throw error;
  }
};
