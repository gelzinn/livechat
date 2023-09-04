import { realtimeDb } from "app/services/firebase";

export const handleSendMessage = async (chatId: string, user: any, message: any) => {
  if (!chatId || !user || !message) throw new Error('Missing parameters');

  try {
    const chatRef = realtimeDb.ref(`chats/${chatId}/messages`);

    await chatRef.once('value', async (snapshot) => {
      let messages = snapshot.val();

      if (!messages) return;

      messages.push(message);

      await chatRef.set(messages);

      const metadata = {
        lastMessage: message.content,
        lastMessageAt: message.timestamp,
        lastMessageBy: user.username,
      };

      // chatRef.parent!.update({
      //   metadata
      // });
    })

    // await chatRef.push(message);

    // const metadata = {
    //   lastMessage: message.content,
    //   lastMessageAt: message.timestamp,
    //   lastMessageBy: user.username,
    // };

    // await chatRef.parent!.update({
    //   metadata
    // });
  } catch (error) {
    throw error;
  }
};
