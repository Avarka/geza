import { auth } from "@/lib/auth";
import { SchedulePage } from "./schedule-page";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserSchedule } from "@/lib/actions/schedule";
import { classToEventTransformer } from "@/lib/helpers/classToEventTransformer";
import { getRules } from "@/lib/actions/rules";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const [userSchedule, rules] = await Promise.all([
    getUserSchedule(session.user.name),
    getRules(),
  ]);

  return <SchedulePage events={classToEventTransformer(userSchedule)} rules={rules} userLdap={session.user.name} />;
}
