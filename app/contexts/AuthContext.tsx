'use client'

import { auth, githubAuthProvider, googleAuthProvider } from "app/services/firebase";
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
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                console.log(user)
            }

            return () => {
                unsubscribe();
            };
        })
    }, []);

    async function signInWithProvider(provider: "google" | "github" | "email", email?: string, password?: string) {
        try {
            let authProvider: any = null;

            if (provider === "google") {
                authProvider = googleAuthProvider;
            } else if (provider === "github") {
                authProvider = githubAuthProvider;
            }

            if (authProvider) {
                let result: any = null;

                if (provider === "email") {
                    result = await auth.signInWithEmailAndPassword(email!, password!);
                } else {
                    result = await auth.signInWithPopup(authProvider);
                }

                if (result.user) {
                    const { displayName, photoURL, email, metadata, uid } = result.user;

                    if (!displayName || !email || !metadata) {
                        throw new Error("Missing information from Google Account.");
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
