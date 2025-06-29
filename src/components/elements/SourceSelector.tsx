import { 
    Select, 
    SelectTrigger, 
    SelectValue, 
    SelectContent, 
    SelectItem } 
from "@/components/ui/select"

type Source = {
  label: string
  value: string
}

type Props = {
  value: string | undefined
  onChange: (value: string) => void
  options?: Source[]
}

const defaultOptions: Source[] = [
  { value: "1", label: "444.hu" },
  { value: "2", label: "telex.hu" },
  { value: "3", label: "24.hu" },
  { value: "4", label: "origo.hu" },
  { value: "5", label: "hirado.hu" },
  { value: "6", label: "magyarnemzet.hu" },
  { value: "7", label: "index.hu" },
]

export function SourceSelector({ value, onChange, options = defaultOptions }: Props) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sources" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }