import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@/lib/db/schema";
import * as birSchema from "@/lib/db/schema-bir";
import fs from "node:fs";

const mainConnection = await mysql.createConnection({
  uri: process.env.GEZA_DATABASE_URL!,
  ssl: process.env.GEZA_DATABASE_CA_CERT
    ? {
        verifyIdentity: true,
        ca: fs.readFileSync(process.env.GEZA_DATABASE_CA_CERT) || undefined,
        rejectUnauthorized: false
      }
    : undefined,
});

const birConnection = await mysql.createConnection({
  uri: process.env.BIR_DATABASE_URL!,
  ssl: process.env.BIR_DATABASE_CA_CERT
    ? {
        verifyIdentity: true,
        ca: fs.readFileSync(process.env.BIR_DATABASE_CA_CERT) || undefined,
        rejectUnauthorized: false
      }
    : undefined,
});

const db = drizzle(mainConnection, {
  schema,
  mode: "planetscale",
  logger: true,
});
const birDb = drizzle(birConnection, {
  schema: birSchema,
  mode: "planetscale",
  logger: true,
});

export { db, birDb };
