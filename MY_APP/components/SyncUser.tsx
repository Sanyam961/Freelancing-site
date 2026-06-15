"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect } from "react";

export default function SyncUser() {
  const { user, isLoaded, isSignedIn } = useUser();
  const createUser = useMutation(api.users.createUser);

  const clerkId = user?.id;
  const email = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    if (isLoaded && isSignedIn && clerkId) {
      void createUser({
        clerkId,
        email: email || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clerkId, email, isLoaded, isSignedIn]);

  return null;
}