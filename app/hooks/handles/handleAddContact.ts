import { firebase, db, realtimeDb } from "app/services/firebase";
import { v4 as uuidv4 } from 'uuid';

export const handleAddContact = async (userId: string, contactInfo: any) => {
  try {
    const newId = uuidv4();

    const userContactsRef = db.collection('users').doc(userId).collection('contacts');
    const userChatsRef = db.collection('users').doc(userId).collection('chats');
    const contactSnapshot = await userContactsRef
      .where('username', '==', contactInfo)
      .get();

    if (!contactSnapshot.empty) throw new Error('The contact is already added.');

    const userQuery = await db.collection('users')
      .where('id', '==', contactInfo)
      .get();

    let contactId: string | null = null;
    let contactUsername: string | null = null;

    if (!userQuery.empty) {
      contactId = contactInfo;
    } else {
      const usernameQuery = await db.collection('users')
        .where('username', '==', contactInfo)
        .get();

      const emailQuery = await db.collection('users')
        .where('email', '==', contactInfo)
        .get();

      if (!usernameQuery.empty) {
        contactId = usernameQuery.docs[0].id;
        contactUsername = usernameQuery.docs[0].data().username;
      } else if (!emailQuery.empty) {
        contactId = emailQuery.docs[0].id;
        contactUsername = emailQuery.docs[0].data().username;
      }
    }

    db.collection('users').doc(userId).get().then(async (doc) => {
      if (!contactId) throw new Error('The contact does not exist.');

      if (doc.exists) {
        const user = doc.data();

        if (!user || user.id === contactId) return;

        const contactContactsRef = db.collection('users').doc(contactId).collection('contacts');
        const contactChatsRef = db.collection('users').doc(contactId).collection('chats');

        const timestamp = firebase.firestore.FieldValue.serverTimestamp();

        await realtimeDb.ref(`chats/${newId}`).set({
          id: newId,
          created_at: firebase.database.ServerValue.TIMESTAMP,
          description: "",
          picture: "",
          messages: [],
          media: [],
          participants: [
            {
              id: user.id,
              username: user.username,
              added_at: firebase.database.ServerValue.TIMESTAMP,
            },
            {
              id: contactId,
              username: contactUsername!,
              added_at: firebase.database.ServerValue.TIMESTAMP,
            },
          ],
        });

        await userContactsRef.doc(contactId).set({
          id: contactId!,
          username: contactUsername!,
          created_at: timestamp,
          chat_id: newId,
        });

        await contactContactsRef.doc(user.id).set({
          id: user.id,
          username: user.username,
          created_at: timestamp,
          chat_id: newId,
        });

        await userChatsRef.doc(newId).set({
          id: newId,
          created_at: timestamp,
          participants: [
            {
              id: user?.id,
              username: user.username,
            },
            {
              id: contactId,
              username: contactUsername!,
            },
          ],
        });

        await contactChatsRef.doc(newId).set({
          id: newId,
          created_at: timestamp,
          participants: [
            {
              id: user?.id,
              username: user.username,
            },
            {
              id: contactId,
              username: contactUsername!,
            },
          ],
        });

      }
    });
  } catch (error) {
    throw error;
  }
};

