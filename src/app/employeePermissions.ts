/**
 * Shared permission model for Viblen employee accounts.
 *
 * This file only defines the client-side shape of permissions.
 * Authorization must also be enforced by the backend before this model
 * can be considered secure.
 */

export const employeePermissionKeys = [
  "products",
  "sales",
  "inventory",
  "invoices",
  "customers",
  "reports",
  "employees",
  "settings",
] as const;

export type EmployeePermissionKey =
  (typeof employeePermissionKeys)[number];

export type EmployeePermissions = Record<
  EmployeePermissionKey,
  boolean
>;

export const defaultEmployeePermissions: EmployeePermissions = {
  products: false,
  sales: false,
  inventory: false,
  invoices: false,
  customers: false,
  reports: false,
  employees: false,
  settings: false,
};

/**
 * Creates a complete permission object from untrusted or partial data.
 * Unknown keys are ignored, and missing or non-boolean values default to false.
 */
export function normalizeEmployeePermissions(
  value: unknown,
): EmployeePermissions {
  const normalized: EmployeePermissions = {
    ...defaultEmployeePermissions,
  };

  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return normalized;
  }

  const input = value as Record<string, unknown>;

  for (const key of employeePermissionKeys) {
    if (typeof input[key] === "boolean") {
      normalized[key] = input[key];
    }
  }

  return normalized;
  }
        
