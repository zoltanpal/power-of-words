import { useMemo } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
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
  disabled?: boolean;
  placeholder?: string; // e.g. "Loading sources..."
  allLabel?: string;    // e.g. "All sources"
};

const defaultOptions: Source[] = [ { value: "1", label: "444.hu" }, { value: "2", label: "telex.hu" }, { value: "3", label: "24.hu" }, { value: "4", label: "origo.hu" }, { value: "5", label: "hirado.hu" }, { value: "6", label: "magyarnemzet.hu" }, { value: "7", label: "index.hu" }, ];

export function SourceSelectorMulti({
  value,
  onChange,
  options = defaultOptions,
  disabled = false,
  placeholder = "Select sources",
  allLabel = "All sources",
}: Props) {
  const toggleValue = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const buttonText = useMemo(() => {
    if (disabled) return placeholder;
    if (value.length === 0) return allLabel;
    return `${value.length} selected`;
  }, [disabled, placeholder, allLabel, value.length]);


  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-between"
          disabled={disabled}
        >
          <span className={value.length > 0 ? "font-bold" : "font-light"}>
            {buttonText}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandGroup>
            {/* Optional: quick "All sources" action */}
            <CommandItem
              onSelect={() => onChange([])}
              className="cursor-pointer"
            >
              <Check
                className={cn(
                  "mr-0 ml-0 h-4 w-4",
                  value.length === 0 ? "opacity-100" : "opacity-0"
                )}
              />
              {allLabel}
            </CommandItem>

            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => toggleValue(option.value)}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-0 ml-0 h-4 w-4",
                    value.includes(option.value) ? "opacity-100" : "opacity-0"
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
