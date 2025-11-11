import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertDialogProps } from "@radix-ui/react-alert-dialog";

export function SemesterDeleteDialog({onDelete, ...props}: {onDelete: () => void} & AlertDialogProps) {
  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Biztos vagy benne?</AlertDialogTitle>
          <AlertDialogDescription>
            Ez a művelet nem visszavonható. A félév törlése minden hozzá kapcsolódó adatot is
            eltávolít.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Mégsem</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Folytatás</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
