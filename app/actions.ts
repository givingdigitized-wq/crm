"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ensureNoActiveLease } from "@/lib/lease-rules";
import { requireLandlordSession, signIn, signOut } from "@/lib/auth";

export async function signupAction(formData: FormData) {
  const data = z
    .object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(8),
    })
    .parse(Object.fromEntries(formData.entries()));

  const passwordHash = await bcrypt.hash(data.password, 10);

  await prisma.$transaction(async (tx) => {
    const landlord = await tx.landlord.create({
      data: { name: data.name, email: data.email },
    });

    await tx.user.create({
      data: {
        landlordId: landlord.id,
        name: data.name,
        email: data.email,
        passwordHash,
      },
    });
  });

  await signIn("credentials", {
    email: data.email,
    password: data.password,
    redirect: false,
  });

  redirect("/dashboard");
}

export async function signinAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  });
}

export async function signoutAction() {
  await signOut({ redirectTo: "/signin" });
}

export async function createContactAction(formData: FormData) {
  const user = await requireLandlordSession();
  const data = z
    .object({
      type: z.enum(["tenant", "lead"]),
      name: z.string().min(1),
      email: z.string().email().optional().or(z.literal("")),
      phone: z.string().optional(),
      tags: z.string().optional(),
      status: z.string().min(1),
      notes: z.string().optional(),
    })
    .parse(Object.fromEntries(formData.entries()));

  await prisma.contact.create({
    data: {
      landlordId: user.landlordId,
      type: data.type,
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      status: data.status,
      notes: data.notes || null,
    },
  });

  revalidatePath("/contacts");
}

export async function createPropertyAction(formData: FormData) {
  const user = await requireLandlordSession();
  const data = z
    .object({
      name: z.string().min(1),
      address1: z.string().min(1),
      address2: z.string().optional(),
      city: z.string().min(1),
      state: z.string().min(1),
      postalCode: z.string().min(1),
      country: z.string().min(1),
    })
    .parse(Object.fromEntries(formData.entries()));

  await prisma.property.create({
    data: {
      landlordId: user.landlordId,
      ...data,
      address2: data.address2 || null,
    },
  });

  revalidatePath("/properties");
}

export async function createUnitAction(formData: FormData) {
  const user = await requireLandlordSession();
  const data = z
    .object({
      propertyId: z.string().min(1),
      unitLabel: z.string().min(1),
      bedrooms: z.coerce.number().int().min(0),
      bathrooms: z.coerce.number().min(0),
      rent: z.coerce.number().min(0),
    })
    .parse(Object.fromEntries(formData.entries()));

  const property = await prisma.property.findFirst({
    where: { id: data.propertyId, landlordId: user.landlordId },
    select: { id: true },
  });

  if (!property) throw new Error("Property not found");

  await prisma.unit.create({
    data: {
      landlordId: user.landlordId,
      propertyId: data.propertyId,
      unitLabel: data.unitLabel,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      rent: data.rent,
    },
  });

  revalidatePath(`/properties/${data.propertyId}`);
}

export async function createLeaseAction(formData: FormData) {
  const user = await requireLandlordSession();
  const data = z
    .object({
      unitId: z.string().min(1),
      contactId: z.string().min(1),
      startDate: z.string().min(1),
      endDate: z.string().min(1),
      rent: z.coerce.number().min(0),
      deposit: z.coerce.number().min(0),
      status: z.enum(["draft", "active", "ended"]),
    })
    .parse(Object.fromEntries(formData.entries()));

  const [unit, contact] = await Promise.all([
    prisma.unit.findFirst({ where: { id: data.unitId, landlordId: user.landlordId }, select: { id: true } }),
    prisma.contact.findFirst({ where: { id: data.contactId, landlordId: user.landlordId }, select: { id: true } }),
  ]);

  if (!unit || !contact) throw new Error("Invalid unit/contact selection");

  if (data.status === "active") {
    await ensureNoActiveLease(prisma, user.landlordId, data.unitId);
  }

  await prisma.lease.create({
    data: {
      landlordId: user.landlordId,
      unitId: data.unitId,
      contactId: data.contactId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      rent: data.rent,
      deposit: data.deposit,
      status: data.status,
    },
  });

  revalidatePath("/leases");
}
