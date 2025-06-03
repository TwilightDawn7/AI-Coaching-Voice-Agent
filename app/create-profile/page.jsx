"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

async function createProfileRequest() {
  const response = await fetch("/api/create-profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
}

export default function CreateProfile() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: createProfileRequest,
    onSuccess: () => {
      router.push("/subscribe");
    },
    onError: (error) => {
      console.error("Error creating profile:", error);
    },
  });

  useEffect(() => {
    if (isLoaded && isSignedIn && !isPending) {
      mutate();
    }
  }, [isLoaded, isSignedIn, isPending, mutate]);

  return (
    <div className="flex h-screen items-center justify-center text-lg text-gray-700">
      Processing sign in...
    </div>
  );
}
