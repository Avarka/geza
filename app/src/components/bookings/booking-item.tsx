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
import { useState } from "react";
import BookingEditDialog from "./booking-edit-dialog";
import { DeleteDialog } from "../delete-dialog";
import { declineBooking, deleteBooking, permitBooking } from "@/lib/actions/bookings";
import { toast } from "sonner";

export function BookingItem({
  booking,
  isOperatorView = false,
}: {
  booking: typeof bookings.$inferSelect;
  isOperatorView?: boolean;
}) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
    await deleteBooking(booking.id);
    toast.success("Foglalás törölve, frissítse az oldalt");
  }

  const handleApproveBooking = async () => {
    await permitBooking(booking.id);
    toast.success("Foglalás engedélyezve, frissítse az oldalt");
  }

  const handleDeclineBooking = async () => {
    await declineBooking(booking.id);
    toast.success("Foglalás elutasítva, frissítse az oldalt");
  }

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
      <Item variant="outline" className="mb-4">
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
              <Button size="sm" onClick={handleApproveBooking}>
                <Check /> Engedélyez
              </Button>
              <Button size="sm" variant="destructive" onClick={handleDeclineBooking}>
                <X /> Elutasít
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" onClick={() => setEditDialogOpen(true)}>
                <Pen /> Szerkesztés
              </Button>
              <Button size="sm" variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 />
                Törlés
              </Button>
            </>
          )}
        </ItemActions>
      </Item>
    </>
  );
}
