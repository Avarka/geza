import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminBookingsPage, BookingsPage, BookingsPageOperator } from "./bookings-page";
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
  if (session.user.role?.includes("admin")) {
    const rules = await getRules();
    return <AdminBookingsPage userId={session.user.id} rules={rules} />;
  }

  
  if (session.user.role?.includes("operator")) {
    const rules = await getRules();
    return <BookingsPageOperator userId={session.user.id} rules={rules} />;
  }

  return <BookingsPage userId={session.user.id} />;
}
