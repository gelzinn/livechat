'use client'

import { AuthContext } from "app/contexts/AuthContext";
import { useContext } from "react";

export const useAuth = () => {
  const {
    user,
    signInWithProvider,
    signOut
  } = useContext(AuthContext);

  return {
    user,
    signInWithProvider,
    signOut
  };
}
