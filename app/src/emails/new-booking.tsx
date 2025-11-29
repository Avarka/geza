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
import { NewBooking } from "@/lib/db/schema";
import { Container } from "lucide-react";

export function NewBookingEmailOperator({
  bookings,
  userName,
  ruleName,
}: {
  bookings: NewBooking[];
  userName: string;
  ruleName: string | undefined;
}) {
  const isCustom = ruleName === undefined;
  const oneBooking = bookings[0];

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
                Kért szabály: {isCustom ? "egyedi, részletek alább" : ruleName}
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

export function NewBookingEmailUser({
  bookings,
  ruleName,
}: {
  bookings: NewBooking[];
  ruleName: string | undefined;
}) {
  const isCustom = ruleName === undefined;
  return (
    <Html lang="hu">
      <Preview>
        {isCustom
          ? `Új egyedi foglalás rögzítve a rendszerben!`
          : `Új foglalás rögzítve a rendszerben!`}
      </Preview>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
        }}
      >
        <Body>
          <Text>
            Sikeresen rögzítettünk a rendszerben a(z){" "}
            {bookings.length.toString()} darab új foglalását!
          </Text>
          <Text>
            Kérjük vegye figyelembe, hogy a foglalások jóváhagyásra várnak a
            rendszergazda részéről. Amikor a foglalásai elbírálásra kerültek,
            újabb értesítést fog kapni.
          </Text>
          <Text className="font-bold">
            Az elbírálás igénybe vehet némi időt, kérjük legyen türelemmel.
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
            <Text>Kért szabály: {isCustom ? "egyedi" : ruleName}</Text>
            <Text>Érintett terem: {bookings[0].classroom}</Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}
