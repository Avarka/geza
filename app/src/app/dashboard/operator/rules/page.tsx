import { auth } from "@/lib/auth";
import { RulesPage } from "./rules-page";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { getRules } from "@/lib/actions/rules";

export default async function Page() {
  let session;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } finally {
    if (!session) {
      redirect("/login");
    }
  }

  if (
    !(await auth.api.userHasPermission({
      body: {
        userId: session.user.id,
        permission: {
          rules: ["read", "create", "update", "delete"],
        },
      },
    }))
  ) {
    toast.error("Nincs jogosultságod a szabálykezelés oldal megtekintéséhez.");
    redirect("/dashboard");
  }

  const rules = await getRules();

  const doUpdate = async () => {
    "use server";
    return await getRules();
  };

  return <RulesPage rules={rules} doUpdate={doUpdate} />;
}
