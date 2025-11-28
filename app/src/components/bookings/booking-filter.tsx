import { DateInput } from "@/components/date-input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MultiSelect, MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "@/components/ui/multi-select";

export function BookingFilter({
  nameFilter,
  onNameFilterChange,
  stateFilter,
  onStateFilterChange,
  dateFilter,
  onDateFilterChange,
}: {
  nameFilter: string;
  onNameFilterChange: (value: string) => void;
  stateFilter: string[];
  onStateFilterChange: (values: string[]) => void;
  dateFilter: Date;
  onDateFilterChange: (value: Date) => void;
}) {
  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onNameFilterChange(e.target.value);
  };

  const handleStateFilterChange = (values: string[]) => {
    onStateFilterChange(values);
  }

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateFilterChange(new Date(e.target.value));
  }

  return (
    <div className="w-full">
      <form>
        <FieldGroup className="flex flex-row">
          <Field>
            <FieldLabel htmlFor="courseCode">Kurzus kód</FieldLabel>
            <Input
              id="courseCode"
              placeholder="IB..."
              value={nameFilter}
              onChange={handleNameInputChange}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="state">Státusz</FieldLabel>
            <MultiSelect
              onValuesChange={handleStateFilterChange}
              values={stateFilter}
            >
              <MultiSelectTrigger className="w-full" id="state">
                <MultiSelectValue placeholder="Státusz" />
              </MultiSelectTrigger>
              <MultiSelectContent>
                <MultiSelectGroup>
                  <MultiSelectItem value="pending">Függőben lévő</MultiSelectItem>
                  <MultiSelectItem value="permitted">Engedélyezett</MultiSelectItem>
                  <MultiSelectItem value="declined">Elutasított</MultiSelectItem>
                </MultiSelectGroup>
              </MultiSelectContent>
            </MultiSelect>
          </Field>
          <Field>
            <DateInput
              label="Kezdődátum"
              date={dateFilter}
              onDateChange={onDateFilterChange}
            />
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
