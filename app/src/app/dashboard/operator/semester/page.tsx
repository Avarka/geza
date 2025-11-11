import { auth } from "@/lib/auth";
import { db } from "@/lib/db/instance";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { SemesterPage } from "./semester-page";
import { getSemesters } from "@/lib/actions/semester";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (!(await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permission: {
        semester: ["read", "create", "update", "delete"]
      }
    }
  }))) {
    toast.error("Nincs jogosultságod a félévkezelés oldal megtekintéséhez.");
    redirect("/dashboard");
  }

  const semesters = await getSemesters();

  const doUpdate = async () => {
    'use server';
    return await getSemesters();
  }

  return <SemesterPage semesters={semesters} doUpdate={doUpdate} />;
}