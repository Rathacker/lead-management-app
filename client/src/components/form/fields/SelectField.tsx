import { Select } from "@mantine/core";
import type { FieldProps } from "../types";

export function SelectField({ field, value, error, onChange }: FieldProps) {
  return (
    <Select
      label={field.label}
      placeholder={field.placeholder}
      required={field.required}
      withAsterisk={field.required}
      data={field.options ?? []}
      value={value || null}
      error={error}
      allowDeselect={false}
      checkIconPosition="right"
      onChange={(val) => onChange(val ?? "")}
    />
  );
}
