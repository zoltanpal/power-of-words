import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Source = {
  value: string;
  label: string;
};

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
  options?: Source[];
};

const defaultOptions: Source[] = [
  { value: "1", label: "444.hu" },
  { value: "2", label: "telex.hu" },
  { value: "3", label: "24.hu" },
  { value: "4", label: "origo.hu" },
  { value: "5", label: "hirado.hu" },
  { value: "6", label: "magyarnemzet.hu" },
  { value: "7", label: "index.hu" },
];

export function SourceSelectorMulti({ value, onChange, options = defaultOptions }: Props) {
  const toggleValue = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <Popover>
        <PopoverTrigger asChild>
        <Button variant="outline" className="w-[180px] justify-between">
            <span className={value.length > 0 ? "font-bold" : "font-light"}>
            {value.length > 0 ? `${value.length} selected` : "Select sources"}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
        </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => toggleValue(option.value)}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-0 ml-0 h-4 w-4",
                    value.includes(option.value)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
