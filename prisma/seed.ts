import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const landlord = await prisma.landlord.upsert({
    where: { email: "landlord@example.com" },
    update: {},
    create: {
      name: "Sample Landlord",
      email: "landlord@example.com",
      users: {
        create: {
          name: "Sample Landlord",
          email: "landlord@example.com",
          passwordHash,
        },
      },
    },
  });

  const contact = await prisma.contact.create({
    data: {
      landlordId: landlord.id,
      type: "tenant",
      name: "Jane Tenant",
      email: "jane@example.com",
      phone: "555-111-2222",
      tags: ["vip"],
      status: "active",
      notes: "Always pays on time.",
    },
  });

  const property = await prisma.property.create({
    data: {
      landlordId: landlord.id,
      name: "Maple Apartments",
      address1: "123 Maple St",
      city: "Springfield",
      state: "IL",
      postalCode: "62701",
      country: "USA",
    },
  });

  const unit = await prisma.unit.create({
    data: {
      landlordId: landlord.id,
      propertyId: property.id,
      unitLabel: "1A",
      bedrooms: 2,
      bathrooms: "1.50",
      rent: "1200.00",
    },
  });

  await prisma.lease.create({
    data: {
      landlordId: landlord.id,
      unitId: unit.id,
      contactId: contact.id,
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
      rent: "1200.00",
      deposit: "1200.00",
      status: "active",
    },
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});
