import { TextInput } from "@mantine/core";
import type { FieldProps } from "../types";

/** Renders text, email, and tel inputs. */
export function TextField({ field, value, error, onChange }: FieldProps) {
  return (
    <TextInput
      label={field.label}
      type={field.type}
      placeholder={field.placeholder}
      required={field.required}
      withAsterisk={field.required}
      value={value}
      error={error}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
}
