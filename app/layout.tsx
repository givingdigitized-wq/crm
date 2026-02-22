import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { signoutAction } from "@/app/actions";

export const metadata: Metadata = {
  title: "Landlord CRM",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <div className="mx-auto max-w-6xl p-6">
          <header className="mb-8 flex items-center justify-between">
            <Link href="/dashboard" className="text-lg font-semibold">Landlord CRM</Link>
            {session?.user ? (
              <div className="flex items-center gap-3 text-sm">
                <nav className="flex gap-3">
                  <Link href="/contacts">Contacts</Link>
                  <Link href="/properties">Properties</Link>
                  <Link href="/leases">Leases</Link>
                </nav>
                <form action={signoutAction}><button type="submit">Sign out</button></form>
              </div>
            ) : (
              <Link href="/signin">Sign in</Link>
            )}
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
