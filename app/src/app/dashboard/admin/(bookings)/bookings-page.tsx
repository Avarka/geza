import { BookingsPage, BookingsPageProps } from "@/app/dashboard/(user)/bookings/bookings-page";
import { BookingsPageOperator } from "@/app/dashboard/operator/(bookings)/bookings-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rule } from "@/lib/db/schema";

export function AdminBookingsPage({ userId, rules }: BookingsPageProps & { rules: Rule[] }) {
  return (
    <>
      <Tabs defaultValue="user" className="m-4">
        <TabsList className="mx-auto">
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="operator">Operator</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <BookingsPage userId={userId} />
        </TabsContent>
        <TabsContent value="operator">
          <BookingsPageOperator userId={userId} rules={rules} />
        </TabsContent>
      </Tabs>
    </>
  );
}