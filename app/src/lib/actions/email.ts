"use server";

import { BookingStatusChangeEmailUser } from "@/emails/booking-status-change";
import {
  NewBookingEmailOperator,
  NewBookingEmailUser,
} from "@/emails/new-booking";
import { Booking, NewBooking } from "@/lib/db/schema";
import transporter from "@/lib/mailer";
import { render, toPlainText } from "@react-email/components";
import { Attachment } from "nodemailer/lib/mailer";

async function sendMail(
  to: string[],
  subject: string,
  html: string,
  attachments?: Attachment[]
) {
  await transporter.sendMail(
    {
      from: {
        name: process.env.SMTP_FROM_NAME || "",
        address: process.env.SMTP_FROM as string,
      },
      to,
      subject,
      html,
      text: toPlainText(html),
      attachments,
    },
    (error, info) => {
      if (error) {
        console.error(error);
      }
      console.log("Email sent: " + info.response);
    }
  );
}

export async function sendNewBulkBookingEmailOperator(
  to: string[],
  bookingInserts: NewBooking[],
  userName: string,
  ruleName: string | undefined,
  file?: Attachment
) {
  const emailHtml = await render(
    NewBookingEmailOperator({ bookings: bookingInserts, userName, ruleName, withFile: file !== undefined })
  );
  await sendMail(to, "Több új foglalást rögzítettek a rendszerben", emailHtml, file ? [file] : undefined);
}

export async function sendNewBookingEmailOperator(
  to: string[],
  bookingInsert: NewBooking,
  userName: string,
  ruleName: string | undefined,
  file?: Attachment
) {
  const emailHtml = await render(
    NewBookingEmailOperator({ bookings: [bookingInsert], userName, ruleName, withFile: file !== undefined })
  );
  await sendMail(to, "Új foglalást rögzítettek a rendszerben", emailHtml, file ? [file] : undefined);
}

export async function sendNewBookingEmailUser(
  to: string[],
  bookingInsert: NewBooking[],
  ruleName: string | undefined
) {
  const emailHtml = await render(
    NewBookingEmailUser({ bookings: bookingInsert, ruleName })
  );
  await sendMail(to, "Új foglalás rögzítve a rendszerben", emailHtml);
}

export async function sendBookingStatusChangeEmailUser(
  to: string[],
  booking: Booking,
  isPermitted?: boolean,
  isDeclined?: boolean
) {
  const emailHtml = await render(
    BookingStatusChangeEmailUser({ booking, isPermitted, isDeclined })
  );
  await sendMail(
    to,
    isPermitted
      ? `Foglalása engedélyezve lett - ${booking.course}!`
      : isDeclined
      ? `Foglalása el lett utasítva - ${booking.course}!`
      : `Foglalása módosítva lett - ${booking.course}!`,
    emailHtml
  );
}
