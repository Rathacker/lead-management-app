import { Textarea } from "@mantine/core";
import type { FieldProps } from "../types";

export function TextAreaField({ field, value, error, onChange }: FieldProps) {
  return (
    <Textarea
      label={field.label}
      placeholder={field.placeholder}
      required={field.required}
      withAsterisk={field.required}
      autosize
      minRows={field.rows ?? 4}
      value={value}
      error={error}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
}
