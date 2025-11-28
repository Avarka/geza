import {
  Body,
  CodeBlock,
  Heading,
  Html,
  pixelBasedPreset,
  Preview,
  Section,
  Tailwind,
  Text,
  dracula,
} from "@react-email/components";
import * as React from "react";
import {
  bookings as bookingsType,
  user as userType,
  rules,
} from "@/lib/db/schema";
import { Container } from "lucide-react";

export default function NewBookingEmail({
  bookings,
  user,
  rule,
}: {
  bookings: (typeof bookingsType.$inferInsert)[];
  user: typeof userType.$inferSelect;
  rule: typeof rules.$inferSelect | undefined;
}) {
  const isCustom = rule === undefined;
  const oneBooking = bookings[0];
  const userName = user.displayName || user.fullname || user.name;

  console.log(oneBooking)
  console.log(oneBooking.customRequest)

  return (
    <Html lang="hu">
      <Preview>
        {isCustom
          ? `Új egyedi foglalás érkezett - Leadó: ${userName}!`
          : `Új foglalás érkezett - Leadó: ${userName}!`}
      </Preview>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
        }}
      >
        <Body>
          <Container>
            <Text>
              A rendszerben {bookings.length.toString()} darab új foglalást
              rögzített {userName}!
            </Text>
            <Section>
              <Heading as="h2">Részletek</Heading>
              <Text>Foglalási időpontok:</Text>
              <Text>
                <ul>
                  {bookings
                    .sort((a, b) => {
                      return a.startTime.getTime() - b.startTime.getTime();
                    })
                    .map(booking => (
                      <li key={booking.id}>
                        {booking.startTime.toISOString()} -{" "}
                        {booking.endTime.toISOString()}
                      </li>
                    ))}
                </ul>
              </Text>
              <Text>
                Kért szabály:{" "}
                {isCustom ? "egyedi, részletek alább" : rule!.name}
              </Text>
              {isCustom && (
                <CodeBlock
                  code={JSON.stringify(oneBooking.customRequest, null, 2)}
                  language="json"
                  theme={dracula}
                />
              )}
              <Text>Érintett terem: {oneBooking.classroom}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
