import { describe, expect, it, vi } from "vitest";
import { ensureNoActiveLease } from "@/lib/lease-rules";

describe("ensureNoActiveLease", () => {
  it("throws when active lease exists", async () => {
    const prisma = {
      lease: {
        findFirst: vi.fn().mockResolvedValue({ id: "lease_1" }),
      },
    } as any;

    await expect(ensureNoActiveLease(prisma, "l1", "u1")).rejects.toThrow("Unit already has an active lease");
  });

  it("does not throw when no active lease exists", async () => {
    const prisma = {
      lease: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
    } as any;

    await expect(ensureNoActiveLease(prisma, "l1", "u1")).resolves.toBeUndefined();
  });
});
