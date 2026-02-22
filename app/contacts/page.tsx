import { createContactAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { requirePageSession } from "@/lib/page-auth";

export default async function ContactsPage() {
  const user = await requirePageSession();
  const contacts = await prisma.contact.findMany({
    where: { landlordId: user.landlordId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="space-y-8">
      <h1 className="text-2xl font-semibold">Contacts</h1>

      <form action={createContactAction} className="grid gap-2 rounded border bg-white p-4 md:grid-cols-3">
        <select name="type" className="rounded border px-3 py-2 text-sm">
          <option value="tenant">Tenant</option>
          <option value="lead">Lead</option>
        </select>
        <Input name="name" required placeholder="Name" />
        <Input name="email" type="email" placeholder="Email" />
        <Input name="phone" placeholder="Phone" />
        <Input name="tags" placeholder="Tags (comma-separated)" />
        <Input name="status" defaultValue="active" placeholder="Status" />
        <Input name="notes" className="md:col-span-2" placeholder="Notes" />
        <Button type="submit">Add contact</Button>
      </form>

      <div className="rounded border bg-white">
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left"><th className="p-2">Name</th><th>Type</th><th>Status</th><th>Tags</th></tr></thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="p-2">{c.name}</td><td>{c.type}</td><td>{c.status}</td><td>{c.tags.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
