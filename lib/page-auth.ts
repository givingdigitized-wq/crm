import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function requirePageSession() {
  const session = await auth();
  if (!session?.user?.landlordId) {
    redirect("/signin");
  }
  return session.user;
}
