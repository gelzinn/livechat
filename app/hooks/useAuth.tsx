'use client'

import { AuthContext } from "app/contexts/AuthContext";
import { useContext } from "react";

export const useAuth = () => {
    const { user, signInWithProvider } = useContext(AuthContext);

    return { user, signInWithProvider };
}