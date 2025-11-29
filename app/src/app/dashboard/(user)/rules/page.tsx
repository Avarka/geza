import { RulesPage } from "@/app/dashboard/(user)/rules/rules-page";
import { getRules } from "@/lib/actions/rules";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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

  const rules = await getRules();

  return <RulesPage rules={rules} />;
}
