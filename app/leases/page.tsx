import { createLeaseAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { requirePageSession } from "@/lib/page-auth";

export default async function LeasesPage() {
  const user = await requirePageSession();

  const [leases, contacts, units] = await Promise.all([
    prisma.lease.findMany({
      where: { landlordId: user.landlordId },
      include: { contact: true, unit: { include: { property: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.contact.findMany({ where: { landlordId: user.landlordId }, orderBy: { name: "asc" } }),
    prisma.unit.findMany({ where: { landlordId: user.landlordId }, include: { property: true }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <main className="space-y-8">
      <h1 className="text-2xl font-semibold">Leases</h1>

      <form action={createLeaseAction} className="grid gap-2 rounded border bg-white p-4 md:grid-cols-3">
        <select name="unitId" className="rounded border px-3 py-2 text-sm" required>
          <option value="">Select unit</option>
          {units.map((u) => <option key={u.id} value={u.id}>{u.property.name} - {u.unitLabel}</option>)}
        </select>
        <select name="contactId" className="rounded border px-3 py-2 text-sm" required>
          <option value="">Select tenant/lead</option>
          {contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select name="status" className="rounded border px-3 py-2 text-sm" defaultValue="draft">
          <option value="draft">Draft</option><option value="active">Active</option><option value="ended">Ended</option>
        </select>
        <Input name="startDate" type="date" required />
        <Input name="endDate" type="date" required />
        <Input name="rent" type="number" step="0.01" min={0} required placeholder="Rent" />
        <Input name="deposit" type="number" step="0.01" min={0} required placeholder="Deposit" />
        <Button type="submit">Create lease</Button>
      </form>

      <div className="rounded border bg-white">
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left"><th className="p-2">Unit</th><th>Contact</th><th>Status</th><th>Dates</th></tr></thead>
          <tbody>
            {leases.map((lease) => (
              <tr key={lease.id} className="border-b">
                <td className="p-2">{lease.unit.property.name} #{lease.unit.unitLabel}</td>
                <td>{lease.contact.name}</td>
                <td>{lease.status}</td>
                <td>{lease.startDate.toISOString().slice(0, 10)} - {lease.endDate.toISOString().slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
