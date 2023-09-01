import { firebase, realtimeDb } from "app/services/firebase";

export const handleSendMessage = async (chatId: string, senderId: string, messageContent: string) => {
  try {
    const chatRef = realtimeDb.ref(`chats/${chatId}`);
    const newMessageRef = chatRef.child('messages').push();

    const newMessage = {
      senderId,
      content: messageContent,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    };

    await newMessageRef.set(newMessage);

    await chatRef.update({ lastMessageTime: firebase.database.ServerValue.TIMESTAMP });
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
