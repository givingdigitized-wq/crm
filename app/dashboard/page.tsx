import { requirePageSession } from "@/lib/page-auth";

export default async function DashboardPage() {
  const user = await requirePageSession();

  return (
    <main>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-slate-600">Welcome, {user.name ?? user.email}. Milestone 1 modules are ready.</p>
    </main>
  );
}
