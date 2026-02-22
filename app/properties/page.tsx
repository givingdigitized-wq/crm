import Link from "next/link";
import { createPropertyAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { requirePageSession } from "@/lib/page-auth";

export default async function PropertiesPage() {
  const user = await requirePageSession();
  const properties = await prisma.property.findMany({
    where: { landlordId: user.landlordId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="space-y-8">
      <h1 className="text-2xl font-semibold">Properties</h1>

      <form action={createPropertyAction} className="grid gap-2 rounded border bg-white p-4 md:grid-cols-3">
        <Input name="name" required placeholder="Property name" />
        <Input name="address1" required placeholder="Address line 1" />
        <Input name="address2" placeholder="Address line 2" />
        <Input name="city" required placeholder="City" />
        <Input name="state" required placeholder="State" />
        <Input name="postalCode" required placeholder="Postal code" />
        <Input name="country" required defaultValue="USA" placeholder="Country" />
        <Button type="submit">Add property</Button>
      </form>

      <ul className="space-y-2">
        {properties.map((property) => (
          <li key={property.id} className="rounded border bg-white p-3">
            <Link href={`/properties/${property.id}`} className="font-medium underline">{property.name}</Link>
            <p className="text-sm text-slate-600">{property.address1}, {property.city}, {property.state}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
