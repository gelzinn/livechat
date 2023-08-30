'use client'

import { firebase } from "../services/firebase";
import { createContext, ReactNode, useEffect, useState } from "react";

type AuthContextType = {
  user: any;
  signInWithProvider: (provider: "google" | "github" | "email", email?: string, password?: string) => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<any>();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, email, metadata, uid } = user;

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
          email: email,
          metadata: metadata,
          admin: false,
        });
      }

      return () => {
        unsubscribe();
      };
    });
  }, []);

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
        const { displayName, photoURL, email, metadata, uid } = result.user;

        if (!displayName || !email || !metadata) {
          throw new Error("Missing information from Account.");
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
          email,
          metadata,
          admin: false,
        });
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, signInWithProvider }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
