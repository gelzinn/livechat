'use client'

import { db, firebase, realtimeDb } from "../services/firebase";
import { createContext, ReactNode, useEffect, useState } from "react";

import { v4 as uuidv4 } from 'uuid';

type AuthContextType = {
  user: any;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signInWithProvider: (provider: "google" | "github" | "email", email?: string, password?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<any>();
  const [userUpdatedInDB, setUserUpdatedInDB] = useState(false);

  const newId = uuidv4();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user: any) => {
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
            doc.ref.update({
              metadata: {
                created_at: user.metadata.creationTime,
                updated_at: user.metadata.creationTime,
                last_login: user.metadata.lastSignInTime,
              },
            });

            setUser((prevUser: any) => {
              return {
                ...prevUser,
                admin: doc.data()?.admin,
                username: doc.data()?.username,
              }
            })

            const fetchedUsername = doc.data()?.username;

            if (!userUpdatedInDB && !fetchedUsername && uid) {
              const username = await createUniqueUsername(email!);

              doc.ref.update({
                username,
                metadata: {
                  last_login: user.metadata.lastSignInTime,
                },
              });

              setUser((prevUser: any) => {
                return {
                  ...prevUser,
                  username,
                };
              });

              setUserUpdatedInDB(true);
            }
          } else {
            if (!userUpdatedInDB && !userUpdatedInDB && !doc.exists && user) {
              const uniqueUsername = await createUniqueUsername(displayName!);

              await db.collection("users").doc(uid).set({
                id: uid,
                name: displayName,
                username: uniqueUsername,
                avatar: photoURL,
                email,
                admin: false,
                metadata: {
                  created_at: firebase.firestore.FieldValue.serverTimestamp(),
                  updated_at: firebase.firestore.FieldValue.serverTimestamp(),
                  last_login: firebase.firestore.FieldValue.serverTimestamp(),
                },
              })
                .catch((error) => {
                  throw error;
                }).finally(() => {
                  setUserUpdatedInDB(true);
                });
            }
          }
        })
      }

      return () => {
        unsubscribe();
      };
    });
  }, [userUpdatedInDB]);

  async function signUp(username: string, email: string, password: string) {
    try {
      console.log(username, email, password);

      await firebase.auth().createUserWithEmailAndPassword(email, password);

      const user = firebase.auth().currentUser;

      if (!user) return;

      await db.collection("users").doc(user.uid).set({
        id: user.uid,
        username,
        email: user.email,
        admin: false,
        metadata: {
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
          last_login: firebase.firestore.FieldValue.serverTimestamp(),
        },
      });

      setUser({
        id: user.uid,
        username,
        email: user.email,
        admin: false,
      });
    } catch (error) {
      throw error;
    }
  }

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
      throw error;
    }
  }

  async function signOut() {
    try {
      await firebase.auth().signOut();
      setUser(null);
    } catch (error) {
      throw error;
    }
  }

  async function createChat(uid: any = null, username: string | null = null) {
    if (!uid || !username) return;

    try {
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
          {
            id: uid,
            username,
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
      throw error;
    }
  }

  async function createUniqueUsername(displayName: string): Promise<string> {
    const baseUsername = displayName.toLowerCase().replace(/\s/g, "");
    let username = baseUsername;
    let usernameExists = true;
    let counter = 1;

    while (usernameExists) {
      const usernameSnapshot = await db.collection("users")
        .where("username", "==", username)
        .get();

      if (usernameSnapshot.empty) {
        usernameExists = false;
      } else {
        username = `${baseUsername}${counter}`;
        counter++;
      }
    }

    return username;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signUp,
        signInWithProvider,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
