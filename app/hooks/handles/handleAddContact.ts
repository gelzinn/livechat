import { firebase, db } from "app/services/firebase";

export const handleAddContact = async (userId: string, contactInfo: any) => {
  try {
    const userContactsRef = db.collection('users').doc(userId).collection('contacts');
    const contactSnapshot = await userContactsRef
      .where('username', '==', contactInfo)
      .get();

    if (!contactSnapshot.empty) {
      console.log('O contato já existe na lista de contatos.');
      return;
    }

    const userQuery = await db.collection('users')
      .where('id', '==', contactInfo)
      .get();

    let contactId = null;

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
      } else if (!emailQuery.empty) {
        contactId = emailQuery.docs[0].id;
      }
    }

    if (!contactId) {
      console.error('Contato não encontrado.');
      return;
    }

    console.log(contactId);

    await userContactsRef.doc(contactId).set({
      id: contactId,
      added_at: firebase.firestore.FieldValue.serverTimestamp(),
    });

    console.log('Contato adicionado com sucesso.');
  } catch (error) {
    console.error('Erro ao adicionar contato:', error);
  }
};
