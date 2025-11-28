"use client";

import RuleCreateEditDialog from "@/components/rules/rule-dialog";
import { RuleItem } from "@/components/rules/rule-item";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { rules } from "@/lib/db/schema";
import { PlusCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";

type Rule = typeof rules.$inferSelect;

export function RulesPage({
  rules,
  doUpdate,
}: {
  rules: Rule[];
  doUpdate: () => Promise<Rule[]>;
}) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentRules, setCurrentRules] = useState(rules);
  const [isUpdating, startTransition] = useTransition();

  const handleDialogClose = async (open: boolean) => {
    setIsCreateDialogOpen(open);
    if (open) return;
    updateRules();
  };

  const updateRules = () => {
    startTransition(async () => {
      const updatedRules = await doUpdate();
      setCurrentRules(updatedRules);
    });
  };

  return (
    <>
      <RuleCreateEditDialog
        open={isCreateDialogOpen}
        onOpenChange={handleDialogClose}
      />
      <div className="flex flex-col gap-4 justify-center mt-4 container mx-auto">
        <div className="flex items-center justify-between px-20">
          <Separator className="flex-1 mr-2" decorative />
          <Button
            variant="ghost"
            size="icon-lg"
            className="rounded-full"
            aria-label="Új szabály létrehozása"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <PlusCircleIcon />
          </Button>
          <Separator className="flex-1 ml-2" decorative />
        </div>

        {isUpdating ? (
          <div className="flex flex-col items-center gap-2"><Spinner className="size-10" /> Betöltés...</div>
        ) : (
          <Accordion type="single" collapsible>
            {currentRules.map(rule => (
              <RuleItem key={rule.name} rule={rule} onEdit={updateRules} />
            ))}
          </Accordion>
        )}
      </div>
    </>
  );
}
