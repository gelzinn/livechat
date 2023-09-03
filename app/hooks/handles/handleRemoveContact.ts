import { db, realtimeDb } from "app/services/firebase";

export const handleRemoveContact = async (userId: string, contactId: string) => {
  try {
    const userContactsRef = db.collection('users').doc(userId).collection('contacts');
    await userContactsRef.doc(contactId).delete();

    const userChatsRef = db.collection('users').doc(userId).collection('chats');

    userChatsRef.get().then(async (querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        try {
          await userChatsRef.doc(doc.id).delete();
          await realtimeDb.ref(`chats/${doc.id}`).remove();

          alert('Contact removed successfully.');
        } catch (error) {
          throw error;
        }
      });
    })
  } catch (error) {
    throw error;
  }
};
