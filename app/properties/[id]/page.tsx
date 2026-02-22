import { notFound } from "next/navigation";
import { createUnitAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { requirePageSession } from "@/lib/page-auth";

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const user = await requirePageSession();
  const property = await prisma.property.findFirst({
    where: { id: params.id, landlordId: user.landlordId },
    include: { units: { orderBy: { createdAt: "desc" } } },
  });

  if (!property) notFound();

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">{property.name}</h1>
      <p className="text-sm text-slate-600">{property.address1}, {property.city}, {property.state} {property.postalCode}</p>

      <form action={createUnitAction} className="grid gap-2 rounded border bg-white p-4 md:grid-cols-3">
        <input type="hidden" name="propertyId" value={property.id} />
        <Input name="unitLabel" required placeholder="Unit label" />
        <Input name="bedrooms" type="number" min={0} required placeholder="Bedrooms" />
        <Input name="bathrooms" type="number" step="0.5" min={0} required placeholder="Bathrooms" />
        <Input name="rent" type="number" step="0.01" min={0} required placeholder="Rent" />
        <Button type="submit">Add unit</Button>
      </form>

      <div className="rounded border bg-white p-4">
        <h2 className="mb-2 text-lg font-medium">Units</h2>
        <ul className="space-y-2 text-sm">
          {property.units.map((u) => (
            <li key={u.id}>#{u.unitLabel} · {u.bedrooms}bd/{u.bathrooms.toString()}ba · ${u.rent.toString()}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
