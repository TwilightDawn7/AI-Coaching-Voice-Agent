import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Example logic — replace with your DB/Convex logic
  console.log("Creating profile for:", user.id, user.emailAddresses[0].emailAddress);

  return NextResponse.json({ message: "Profile created" });
}
