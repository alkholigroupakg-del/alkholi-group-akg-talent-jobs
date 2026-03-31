import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "date" | "number" | "textarea" | "select" | "file";
  required?: boolean;
  value: string;
  onChange: (name: string, value: string) => void;
  options?: string[];
  placeholder?: string;
  accept?: string;
  onFileChange?: (name: string, file: File | null) => void;
}

const FormField = ({
  label,
  name,
  type = "text",
  required = false,
  value,
  onChange,
  options,
  placeholder,
  accept,
  onFileChange,
}: FormFieldProps) => {
  if (type === "textarea") {
    return (
      <div className="space-y-2">
        <Label htmlFor={name} className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive mr-1">*</span>}
        </Label>
        <Textarea
          id={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          className="min-h-[100px] bg-background border-input focus:ring-ring text-right"
          dir="rtl"
        />
      </div>
    );
  }

  if (type === "select" && options) {
    return (
      <div className="space-y-2">
        <Label htmlFor={name} className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive mr-1">*</span>}
        </Label>
        <Select value={value} onValueChange={(v) => onChange(name, v)}>
          <SelectTrigger className="bg-background border-input text-right" dir="rtl">
            <SelectValue placeholder={placeholder || "اختر..."} />
          </SelectTrigger>
          <SelectContent dir="rtl" className="max-h-[250px]">
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (type === "file") {
    return (
      <div className="space-y-2">
        <Label htmlFor={name} className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive mr-1">*</span>}
        </Label>
        <Input
          id={name}
          type="file"
          accept={accept}
          onChange={(e) => onFileChange?.(name, e.target.files?.[0] || null)}
          className="bg-background border-input file:ml-4 file:border-0 file:bg-accent file:text-accent-foreground file:rounded-md file:px-3 file:py-1 file:text-sm file:font-medium cursor-pointer"
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive mr-1">*</span>}
      </Label>
      <Input
        id={name}
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className="bg-background border-input focus:ring-ring text-right"
        dir="rtl"
      />
    </div>
  );
};

export default FormField;
