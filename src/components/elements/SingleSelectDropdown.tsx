import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

type Option = {
    value: string;
    label: string;
};

type Props = {
    options: Option[];
    placeholder?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
};


export default function SingleSelectDropdown({
    options,
    placeholder = "Select...",
    defaultValue,
    onChange,
  }: Props) {
    return (
      <Select defaultValue={defaultValue} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }