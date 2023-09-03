import { realtimeDb } from "app/services/firebase";
import { getUsers } from "./getUsers";

export const getChatContent = async (chatId: string, requestedContent?: string) => {
  try {
    const chatRef = realtimeDb.ref(`chats/${chatId}`);
    const chatSnapshot = await chatRef.once('value');
    const chatData = chatSnapshot.val();

    if (!chatData) throw new Error('Chat not found.');

    if (!requestedContent) return chatData;

    if (chatData[requestedContent]) {
      return chatData[requestedContent];
    } else {
      throw new Error('Chat content not found.');
    }
  } catch (error) {
    throw error;
  }
};

export const getChatParticipantsInfo = async (participants: any, currentUserID: any) => {
  const participantsWithInfo = await Promise.all(participants.map(async (participant: any) => {
    if (participant.id !== currentUserID) {
      const userInfo = await getUsers({ id: participant.id });
      return {
        ...participant,
        userInfo,
      };
    }
    return participant;
  }));
  return participantsWithInfo;
};
