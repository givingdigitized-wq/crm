-- Enforce one active lease per unit atomically at the database level.
CREATE UNIQUE INDEX "Lease_active_unit_unique_idx"
ON "Lease" ("unitId")
WHERE "status" = 'active';
