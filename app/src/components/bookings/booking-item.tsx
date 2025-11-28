import { bookings } from "@/lib/db/schema";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import {
  Check,
  ClipboardCheck,
  ClipboardClock,
  ClipboardX,
  Pen,
  Trash2,
  X,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { useState, useTransition } from "react";
import BookingEditDialog from "./booking-edit-dialog";
import { DeleteDialog } from "../delete-dialog";
import {
  declineBooking,
  deleteBooking,
  permitBooking,
} from "@/lib/actions/bookings";
import { toast } from "sonner";
import clsx from "clsx";
import { Spinner } from "@/components/ui/spinner";

export function BookingItem({
  booking,
  isOperatorView = false,
}: {
  booking: typeof bookings.$inferSelect;
  isOperatorView?: boolean;
}) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [waitingOnOperation, startTransition] = useTransition();
  const [operation, setOperation] = useState<string | null>(null);

  const statusIcon = () => {
    switch (booking.status) {
      case "pending":
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <ClipboardClock />
            </TooltipTrigger>
            <TooltipContent>A foglalás elbírálásra vár.</TooltipContent>
          </Tooltip>
        );
      case "permitted":
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <ClipboardCheck />
            </TooltipTrigger>
            <TooltipContent>A foglalást elfogadták.</TooltipContent>
          </Tooltip>
        );
      case "declined":
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <ClipboardX />
            </TooltipTrigger>
            <TooltipContent>A foglalás elutasították.</TooltipContent>
          </Tooltip>
        );
    }
  };

  const handleDelete = async () => {
    startTransition(async () => {
      setOperation("delete");
      await deleteBooking(booking.id);
      toast.success("Foglalás törölve, frissítse az oldalt");
      setOperation(null);
    });
  };

  const handleApproveBooking = async () => {
    startTransition(async () => {
      setOperation("approve");
      await permitBooking(booking.id);
      toast.success("Foglalás engedélyezve!");
      setOperation(null);
      booking.status = "permitted";
    });
  };

  const handleDeclineBooking = async () => {
    startTransition(async () => {
      setOperation("decline");
      await declineBooking(booking.id);
      toast.success("Foglalás elutasítva!");
      setOperation(null);
      booking.status = "declined";
    });
  };

  return (
    <>
      <BookingEditDialog
        booking={booking}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDelete}
      />
      <Item
        variant="outline"
        className={clsx(
          "mb-4",
          booking.status === "declined" && "bg-yellow-100 dark:bg-yellow-900",
          booking.status === "permitted" && "bg-green-100 dark:bg-green-900"
        )}
      >
        <ItemMedia variant="icon">{statusIcon()}</ItemMedia>
        <ItemContent>
          <ItemTitle>
            {booking.course} - {booking.startTime.toDateString()}
          </ItemTitle>
          <ItemDescription>
            {booking.startTime.toISOString()} - {booking.endTime.toISOString()}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          {isOperatorView ? (
            <>
              <Button
                size="sm"
                onClick={handleApproveBooking}
                disabled={waitingOnOperation}
              >
                {operation === "approve" ? <Spinner /> : <Check />}
                Engedélyez
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDeclineBooking}
                disabled={waitingOnOperation}
              >
                {operation === "decline" ? <Spinner /> : <X />} Elutasít
              </Button>
            </>
          ) : (
            booking.status === "pending" && (
              <>
                <Button
                  size="sm"
                  onClick={() => setEditDialogOpen(true)}
                  disabled={waitingOnOperation}
                >
                  <Pen />
                  Szerkesztés
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={waitingOnOperation}
                >
                  {operation === "delete" ? <Spinner /> : <Trash2 />}
                  Törlés
                </Button>
              </>
            )
          )}
        </ItemActions>
      </Item>
    </>
  );
}
