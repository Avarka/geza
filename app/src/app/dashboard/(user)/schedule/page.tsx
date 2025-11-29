import { auth } from "@/lib/auth";
import { SchedulePage } from "./schedule-page";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserSchedule } from "@/lib/actions/bir";
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

  const [userSchedule, rules] = await Promise.all([
    getUserSchedule(session.user.name),
    getRules(),
  ]);

  return (
    <SchedulePage
      classes={userSchedule}
      rules={rules}
      userLdap={session.user.name}
    />
  );
}
