import { RuleItem } from "@/app/dashboard/(user)/rules/rule-item";
import { Rule } from "@/lib/db/schema";

export function RulesPage({ rules }: { rules: Rule[] }) {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rules.map((rule) => (
        <RuleItem key={rule.id} rule={rule} />
      ))}
    </div>
  )
}