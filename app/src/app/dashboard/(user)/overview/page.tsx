import { OverviewPage } from "@/app/dashboard/(user)/overview/overview-page";
import { getSetOfRooms as getSetOfRoomsFromBir } from "@/lib/actions/bir";
import { getAllBookings, getSetOfRooms as getSetOfRoomsFromBookings } from "@/lib/actions/bookings";
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

  const roomsFromBir = await getSetOfRoomsFromBir();
  const roomsFromBookings = await getSetOfRoomsFromBookings();

  const combinedRooms = Array.from(
    new Set([...roomsFromBir, ...roomsFromBookings])
  ).sort();

  const bookings = await getAllBookings();

  return <OverviewPage rooms={combinedRooms} bookings={bookings} />;
}
