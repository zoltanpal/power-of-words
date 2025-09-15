import * as React from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ClearableInputProps
  extends React.ComponentProps<typeof Input> {
  onClear?: () => void
}

export function ClearableInput({
  className,
  value,
  onChange,
  onClear,
  ...props
}: ClearableInputProps) {
  return (
    <div className="relative w-full">
      <Input
        value={value}
        onChange={onChange}
        className={cn("pr-8", className)}
        {...props}
      />
      {value && String(value).length > 0 && (
        <button
          type="button"
          onClick={() => {
            if (onClear) onClear()
            // if consumer uses onChange, mimic empty change event
            if (onChange) {
              const event = {
                target: { value: "" },
              } as React.ChangeEvent<HTMLInputElement>
              onChange(event)
            }
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
