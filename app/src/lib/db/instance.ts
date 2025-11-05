import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@/lib/db/schema";

const connection = await mysql.createConnection({
  uri: process.env.DATABASE_URL!,
});

const db = drizzle(connection, { schema, mode: "default", logger: true });

export { db };
