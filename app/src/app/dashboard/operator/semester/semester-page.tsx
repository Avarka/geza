"use client";

import SemesterCreateEditDialog from "@/components/semester/semester-dialog";
import {
  SemesterItem,
  SemesterItemSkeleton,
} from "@/components/semester/semester-item";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { semester } from "@/lib/db/schema";
import { PlusCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";

type Semester = typeof semester.$inferSelect;

export function SemesterPage({
  semesters,
  doUpdate,
}: {
  semesters: Semester[];
  doUpdate: () => Promise<Semester[]>;
}) {
  const [isSemesterCreateDialogOpen, setIsSemesterCreateDialogOpen] =
    useState(false);
  const [currentSemesters, setCurrentSemesters] = useState(semesters);
  const [isUpdating, startTransition] = useTransition();

  const handleDialogClose = async (open: boolean) => {
    setIsSemesterCreateDialogOpen(open);
    if (open) return;
    updateSemesters();
  };

  const updateSemesters = () => {
    startTransition(async () => {
      const updatedSemesters = await doUpdate();
      setCurrentSemesters(updatedSemesters);
    });
  }

  return (
    <>
      <SemesterCreateEditDialog
        open={isSemesterCreateDialogOpen}
        onOpenChange={handleDialogClose}
      />
      <div className="flex flex-col gap-4 justify-center mt-4 container mx-auto">
        <div className="flex items-center justify-between px-20">
          <Separator className="flex-1 mr-2" decorative />
          <Button
            variant="ghost"
            size="icon-lg"
            className="rounded-full"
            aria-label="Új félév hozzáadása"
            onClick={() => setIsSemesterCreateDialogOpen(true)}
          >
            <PlusCircleIcon />
          </Button>
          <Separator className="flex-1 ml-2" decorative />
        </div>

        {isUpdating ? (
          <SemesterItemSkeleton />
        ) : (
          currentSemesters.map(semester => (
            <SemesterItem key={semester.name} semester={semester} onEdit={updateSemesters} />
          ))
        )}
      </div>
    </>
  );
}
