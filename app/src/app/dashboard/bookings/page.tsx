import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminBookingsPage, BookingsPage, BookingsPageOperator } from "./bookings-page";

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
    return <AdminBookingsPage userId={session.user.id} />;
  }

  if (session.user.role?.includes("operator")) {
    return <BookingsPageOperator userId={session.user.id} />;
  }

  return <BookingsPage userId={session.user.id} />;
}
