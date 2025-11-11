import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminBookingsPage, BookingsPage, BookingsPageOperator } from "./bookings-page";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (session.user.role?.includes("admin")) {
    return <AdminBookingsPage userId={session.user.id} />;
  }

  if (session.user.role?.includes("operator")) {
    return <BookingsPageOperator userId={session.user.id} />;
  }

  return <BookingsPage userId={session.user.id} />;
}
