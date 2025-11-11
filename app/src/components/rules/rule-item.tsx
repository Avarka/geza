"use client";

import { rules } from "@/lib/db/schema";
import { useState } from "react";
import { Pen, Trash2 } from "lucide-react";
import { deleteRule } from "@/lib/actions/rules";
import RuleCreateEditDialog from "./rule-dialog";
import { DeleteDialog } from "../delete-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

type Rule = typeof rules.$inferSelect;

export function RuleItem({ rule, onEdit }: { rule: Rule; onEdit: () => void }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDialogClose = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (open) return;
    onEdit();
  };

  const handleDelete = async () => {
    await deleteRule(rule.name);
    onEdit();
  };

  return (
    <>
      <RuleCreateEditDialog
        //@ts-expect-error Expecting error until JSON schema is clarified
        rule={rule}
        open={isEditDialogOpen}
        onOpenChange={handleDialogClose}
      />
      <DeleteDialog
        onDelete={handleDelete}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />

      <AccordionItem value={rule.id.toString()}>
        <AccordionTrigger>{rule.name}</AccordionTrigger>
        <AccordionContent>
          {rule.description}
          <div className="flex gap-2 mt-4 mb-4 justify-end-safe">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Pen />
              Szerkesztés
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 />
              Törlés
            </Button>
          </div>

          <Separator className="my-4" />
          <pre>
            {JSON.stringify(JSON.parse(rule.action as string), null, 2)}
          </pre>
        </AccordionContent>
      </AccordionItem>
    </>
  );
}