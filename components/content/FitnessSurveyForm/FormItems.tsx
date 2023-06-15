import { SelectContent } from "@radix-ui/react-select"
import { Control, Path } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ShortAnswerInputProps<T extends Record<string, any>> {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  description?: string
}

export function NumericalInput<T extends Record<string, any>>({
  control,
  name,
  label,
  placeholder,
  description,
}: ShortAnswerInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, ...field } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              onChange={(e) => {
                const justDigits = e.target.value
                  .split(".")[0]
                  .replace(/\D/g, "")
                if (justDigits.length === 0) onChange(0)
                else onChange(parseInt(justDigits))
              }}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function ShortAnswerInput<T extends Record<string, any>>({
  control,
  name,
  label,
  placeholder,
  description,
}: ShortAnswerInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

interface MultipleChoiceInputProps<T extends Record<string, any>> {
  control: Control<T>
  name: Path<T>
  label: string
  description?: string
  placeholder?: string
  options: {
    label: string
    value: string
  }[]
}

export function MultipleChoiceInput<T extends Record<string, any>>({
  control,
  name,
  label,
  description,
  placeholder,
  options,
}: MultipleChoiceInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem value={option.value} key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
