import { realtimeDb } from "app/services/firebase";

export const getChatContent = async (chatId: string, requestedContent?: string) => {
  try {
    const chatRef = realtimeDb.ref(`chats/${chatId}`);
    const chatSnapshot = await chatRef.once('value');
    const chatData = chatSnapshot.val();

    if (chatData) {
      if (requestedContent) {
        if (chatData[requestedContent]) {
          return chatData[requestedContent];
        } else {
          console.error(`Requested content "${requestedContent}" not found in the chat`);
          return null;
        }
      } else {
        return chatData;
      }
    } else {
      console.error('Chat not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching chat content:', error);
    return null;
  }
};
