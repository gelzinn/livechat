import { realtimeDb } from "app/services/firebase";

export const handleSendMessage = async (chatId: string, user: any, message: any) => {
  if (!chatId || !user || !message) throw new Error('Missing parameters');

  if (!message.timestamp) throw new Error('Message timestamp is required');

  try {
    const chatRef = realtimeDb.ref(`chats/${chatId}/messages`);

    await chatRef.once('value', async () => {
      await chatRef.push({
        ...message,
      });

      const metadata = {
        lastMessage: message.content,
        lastMessageAt: message.timestamp,
        lastMessageBy: user.id,
      };

      chatRef.parent && await chatRef.parent.update({
        metadata
      });
    })
  } catch (error) {
    throw error;
  }
};
