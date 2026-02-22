import Link from "next/link";
import { signupAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-md rounded border bg-white p-6">
      <h1 className="mb-4 text-2xl font-semibold">Create landlord account</h1>
      <form action={signupAction} className="space-y-3">
        <Input name="name" required placeholder="Full name" />
        <Input name="email" type="email" required placeholder="Email" />
        <Input name="password" type="password" minLength={8} required placeholder="Password" />
        <Button type="submit">Sign up</Button>
      </form>
      <p className="mt-4 text-sm">Already have one? <Link href="/signin" className="underline">Sign in</Link></p>
    </div>
  );
}
