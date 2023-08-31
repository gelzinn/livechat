'use client'

import { db, firebase, realtimeDb } from "../services/firebase";
import { createContext, ReactNode, useEffect, useState } from "react";

import { v4 as uuidv4 } from 'uuid';

type AuthContextType = {
  user: any;
  signInWithProvider: (provider: "google" | "github" | "email", email?: string, password?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<any>();
  const [userUpdatedInDB, setUserUpdatedInDB] = useState(false);

  const newId = uuidv4();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const {
          uid,
          displayName,
          email,
          photoURL,
        } = user;

        setUser({
          id: uid,
          name: displayName,
          email: email,
          avatar: photoURL,
          admin: false,
        });

        db.collection("users").doc(uid).get().then(async (doc) => {
          if (doc.exists) {
            setUser((prevUser: any) => {
              return {
                ...prevUser,
                admin: doc.data()?.admin,
                username: doc.data()?.username,
              }
            })
          } else {
            if (!userUpdatedInDB) {
              createChat();
              setUserUpdatedInDB(true);
            }
          }

          if (!doc.exists && !userUpdatedInDB) {
            db.collection("users").doc(uid).set({
              id: uid,
              name: displayName,
              username: displayName?.toLowerCase().replace(/\s/g, ""),
              avatar: photoURL,
              email,
              admin: false,
            });

            setUserUpdatedInDB(true);
          }
        })
      }

      return () => {
        unsubscribe();
      };
    });
  }, [userUpdatedInDB]);

  async function signInWithProvider(provider: "google" | "github" | "email", email?: string, password?: string) {
    try {
      let authProvider: firebase.auth.AuthProvider | null = null;

      switch (provider) {
        case "google":
          authProvider = new firebase.auth.GoogleAuthProvider();
          break;
        case "github":
          authProvider = new firebase.auth.GithubAuthProvider();
          break;
        case "email":
          if (!email || !password) {
            throw new Error("Missing email or password.");
          } else {
            await firebase.auth().signInWithEmailAndPassword(email!, password!)
          }
          break;
        default:
          throw new Error("Invalid provider.");
      }

      if (!authProvider) return;

      let result: firebase.auth.UserCredential | null = null;

      result = await firebase.auth().signInWithPopup(authProvider);

      if (result && result.user) {
        const { displayName, photoURL, email, uid } = result.user;

        if (!displayName || !email || !uid)
          throw new Error("Missing information from Account.");

        const userRef = db.collection("users").doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
          let username = displayName.toLowerCase().replace(/\s/g, "");

          while (true) {
            const availableUsername = await firebase.firestore().collection("users")
              .where("username", "==", username)
              .get();

            if (availableUsername.empty) {
              await userDoc.ref.set({
                name: displayName,
                avatar: photoURL,
                email,
                admin: false,
                username: availableUsername,
              });
              break;
            } else {
              username = username + Math.floor(Math.random() * 1000)
            }
          }

          userDoc.ref.set({
            id: uid,
            name: displayName,
            username: displayName.toLowerCase().replace(/\s/g, ""),
            avatar: photoURL,
            email,
            admin: false,
          });
        }

        setUser({
          id: uid,
          name: displayName,
          username: userDoc.data()?.username,
          avatar: photoURL,
          email,
          admin: false,
        });
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  }

  async function signOut() {
    try {
      await firebase.auth().signOut();
      setUser(null);
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  }

  async function createChat() {
    try {
      const uid = firebase.auth().currentUser!.uid;

      const batch = db.batch();

      const chatDocRef = db.collection("users").doc(uid)
        .collection("chats")
        .doc(newId);

      const contactDocRef = db.collection("users").doc(uid)
        .collection("contacts")
        .doc("0sX8KqZMnURKhKalOARvyEITE6y1");

      batch.set(chatDocRef, {
        id: newId,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
      });

      realtimeDb.ref(`chats/${newId}`).set({
        id: newId,
        created_at: firebase.database.ServerValue.TIMESTAMP,
        description: "",
        picture: "",
        messages: [],
        media: [],
        participants: [
          {
            id: "0sX8KqZMnURKhKalOARvyEITE6y1",
            username: "gelzin",
            added_at: firebase.database.ServerValue.TIMESTAMP,
          },
        ],
      });

      batch.set(contactDocRef, {
        username: "gelzin",
        id: "0sX8KqZMnURKhKalOARvyEITE6y1",
        chat_id: newId,
        added_at: firebase.firestore.FieldValue.serverTimestamp(),
      });

      await batch.commit();
    } catch (error) {
      console.error("Error during creating chat:", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithProvider,
        signOut
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
