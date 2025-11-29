import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Rule } from "@/lib/db/schema";

export function RuleItem({ rule }: { rule: Rule }) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{rule.name}</ItemTitle>
        <ItemDescription>{rule.description}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
