"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { convex } from "@/lib/convexClient";
import AuthProvider from "./AuthProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'


export function Provider({ children }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AuthProvider>
    </ConvexProvider>
  ); 
}
