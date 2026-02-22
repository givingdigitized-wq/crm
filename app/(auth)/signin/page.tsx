import Link from "next/link";
import { signinAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md rounded border bg-white p-6">
      <h1 className="mb-4 text-2xl font-semibold">Sign in</h1>
      <form action={signinAction} className="space-y-3">
        <Input name="email" type="email" required placeholder="Email" />
        <Input name="password" type="password" required placeholder="Password" />
        <Button type="submit">Sign in</Button>
      </form>
      <p className="mt-4 text-sm">No account? <Link href="/signup" className="underline">Sign up</Link></p>
    </div>
  );
}
