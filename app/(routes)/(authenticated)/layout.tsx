'use client'

import { useEffect } from "react";

import { useAuth } from "app/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AuthenticatedLayout({ children }: any) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/");
  }, [user]);

  if (!user) return null;

  return children;
}
