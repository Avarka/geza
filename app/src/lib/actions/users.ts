"use server";

import { db } from "@/lib/db/instances";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getUserIdByLdap(ldap: string) {
  const userRecord = await db
    .select()
    .from(user)
    .where(eq(user.name, ldap))
    .limit(1);
  return userRecord[0]?.id || null;
}

export async function getUserLdapById(id: string) {
  const userRecord = await db
    .select()
    .from(user)
    .where(eq(user.id, id))
    .limit(1);
  return userRecord[0]?.name || null;
}