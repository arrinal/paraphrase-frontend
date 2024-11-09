import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SUPPORTED_LANGUAGES } from "@/utils/constants"
import { Check } from "lucide-react"

interface MultiColumnSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  languages?: typeof SUPPORTED_LANGUAGES;
}

export function MultiColumnSelect({ 
  value, 
  onValueChange,
  languages = SUPPORTED_LANGUAGES 
}: MultiColumnSelectProps) {
  const ITEMS_PER_COLUMN = 9;
  const numColumns = Math.ceil(languages.length / ITEMS_PER_COLUMN);

  const selectedLabel = languages.find(lang => lang.value === value)?.label || "Select language";

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue>
          <span className="block truncate">{selectedLabel}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent 
        className="w-[var(--radix-select-trigger-width)] min-w-[600px] max-h-[400px]"
        align="start"
      >
        <div className="grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${numColumns}, minmax(150px, 1fr))`,
          padding: '8px'
        }}>
          {Array.from({ length: numColumns }).map((_, colIndex) => (
            <div key={colIndex} className="flex flex-col">
              {languages
                .slice(
                  colIndex * ITEMS_PER_COLUMN,
                  (colIndex + 1) * ITEMS_PER_COLUMN
                )
                .map((language) => (
                  <SelectItem
                    key={language.value}
                    value={language.value}
                    className="w-full px-4 py-2 flex items-center gap-2 relative"
                  >
                    <Check className="h-4 w-4 opacity-0 absolute left-2 group-data-[state=checked]:opacity-100" />
                    <span className="block truncate pl-6">{language.label}</span>
                  </SelectItem>
                ))}
            </div>
          ))}
        </div>
      </SelectContent>
    </Select>
  );
} 