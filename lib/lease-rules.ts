import { PrismaClient } from "@prisma/client";

export async function ensureNoActiveLease(
  prisma: PrismaClient,
  landlordId: string,
  unitId: string,
) {
  const activeLease = await prisma.lease.findFirst({
    where: {
      landlordId,
      unitId,
      status: "active",
    },
    select: { id: true },
  });

  if (activeLease) {
    throw new Error("Unit already has an active lease");
  }
}
