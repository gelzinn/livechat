import { db } from "app/services/firebase";

export const getUsers = async (filter: any = {}) => {
  try {
    let query: any = db.collection('users');

    if (filter.id) {
      query = query.where('id', '==', filter.id);
    }

    if (filter.username) {
      query = query.where('username', '==', filter.username);
    }

    const usersSnapshot = await query.get();
    const users: any = [];

    usersSnapshot.forEach((doc: any) => {
      users.push(doc.data());
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const getUserChats = async (userId: string) => {
  try {
    const userChatsRef = db.collection('users').doc(userId).collection('chats');
    const userChatsSnapshot = await userChatsRef.get();
    const userChats: any = [];

    userChatsSnapshot.forEach((doc) => {
      userChats.push(doc.id);
    });

    return userChats;
  } catch (error) {
    console.error('Error fetching user chats:', error);
    return [];
  }
};

export const getUserContacts = async (userId: string) => {
  try {
    const userContactsRef = db.collection('users').doc(userId).collection('contacts');
    const userContactsSnapshot = await userContactsRef.get();
    const userContacts: any = [];

    userContactsSnapshot.forEach((doc) => {
      userContacts.push(doc.data());
    });

    return userContacts;
  } catch (error) {
    console.error('Error fetching user contacts:', error);
    return [];
  }
};
