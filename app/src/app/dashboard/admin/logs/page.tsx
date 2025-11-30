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
  
  return <div>Komponens kidolgozás alatt!</div>;
}
