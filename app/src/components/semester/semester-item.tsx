"use client";

import { semester } from "@/lib/db/schema";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import SemesterCreateEditDialog from "./semester-dialog";
import { useState } from "react";
import { Pen, Trash2 } from "lucide-react";
import { DeleteDialog } from "../delete-dialog";
import { deleteSemester } from "@/lib/actions/semester";

type Semester = typeof semester.$inferSelect;

export function SemesterItem({ semester, onEdit }: { semester: Semester, onEdit: () => void }) {
  const [isEditDialogOpen, setIsEditDialogOpen] =
    useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleDialogClose = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (open) return;
    onEdit();
  };

  const handleDelete = async () => {
    await deleteSemester(semester.name);
    onEdit();
  }

  return (
    <>
      <SemesterCreateEditDialog
        semester={semester}
        open={isEditDialogOpen}
        onOpenChange={handleDialogClose}
      />
      <DeleteDialog onDelete={handleDelete} open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} />
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>{semester.name}</ItemTitle>
          <ItemDescription>
            {semester.startDate.getFullYear()}.
            {(semester.startDate.getMonth() + 1).toString().padStart(2, "0")}.
            {semester.startDate.getDate().toString().padStart(2, "0")}. -{" "}
            {semester.endDate.getFullYear()}.
            {(semester.endDate.getMonth() + 1).toString().padStart(2, "0")}.
            {semester.endDate.getDate().toString().padStart(2, "0")}.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
            <Pen />
            Szerkesztés
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 />
            Törlés
          </Button>
        </ItemActions>
      </Item>
    </>
  );
}

export function SemesterItemSkeleton() {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
        <ItemDescription className="h-4 w-1/2 mt-2 bg-gray-200 rounded animate-pulse" />
      </ItemContent>
    </Item>
  )
}
