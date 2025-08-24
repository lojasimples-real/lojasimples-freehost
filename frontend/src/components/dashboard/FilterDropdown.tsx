import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FilterOption = "todos" | "atrasados";

interface FilterDropdownProps {
  onFilterChange?: (value: FilterOption) => void;
}

const FilterDropdown = ({ onFilterChange }: FilterDropdownProps) => {
  const [selected, setSelected] = useState<FilterOption>("todos");

  const handleValueChange = (value: FilterOption) => {
    setSelected(value);
    onFilterChange?.(value);
    console.log("Filter changed to:", value);
  };

  return (
    <Select value={selected} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px] bg-white border border-blue-100 hover:border-blue-200 transition-colors">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-white border border-blue-100">
        <SelectItem
          value="todos"
          className="hover:bg-blue-50 transition-colors cursor-pointer"
        >
          Todos
        </SelectItem>
        <SelectItem
          value="atrasados"
          className="hover:bg-blue-50 transition-colors cursor-pointer"
        >
          Atrasados
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default FilterDropdown;