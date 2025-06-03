"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { convex } from "@/lib/convexClient";
import AuthProvider from "./AuthProvider";


export function Provider({ children }) {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ConvexProvider>
  ); 
}
