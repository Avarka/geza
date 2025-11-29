import { Booking } from "@/lib/db/schema";
import {
  Body,
  Html,
  pixelBasedPreset,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export function BookingStatusChangeEmailUser({
  booking,
  isPermitted,
  isDeclined,
}: {
  booking: Booking;
  isPermitted?: boolean;
  isDeclined?: boolean;
}) {
  return (
    <Html lang="hu">
      <Preview>
        {isPermitted
          ? `Foglalása engedélyezve lett - ${booking.course}!`
          : isDeclined
          ? `Foglalása el lett utasítva - ${booking.course}!`
          : `Foglalása módosítva lett - ${booking.course}!`}
      </Preview>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
        }}
      >
        <Body>
          {isPermitted && (
            <Text>
              A foglalása engedélyezve lett a következő időpontban:{" "}
              {booking.startTime.toISOString()} -{" "}
              {booking.endTime.toISOString()}
            </Text>
          )}
          {isDeclined && (
            <>
              <Text>
                A foglalása el lett utasítva a következő időpontra:{" "}
                {booking.startTime.toISOString()} -{" "}
                {booking.endTime.toISOString()}
              </Text>
              <Text>
                Kérjük vegye fel a kapcsolatot az üzemeltetővel további
                információkért.
              </Text>
            </>
          )}
          <Section>
            <Text>
              Kért szabály: {booking.customRequest ? "egyedi" : booking.ruleId}
            </Text>
            <Text>Érintett terem: {booking.classroom}</Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}
