import { Select } from "@mantine/core";
import type { FieldProps } from "../types";

export function SelectField({ field, value, error, onChange }: FieldProps) {
  return (
    <Select
      label={field.label}
      required={field.required}
      withAsterisk={field.required}
      data={field.options ?? []}
      value={value}
      error={error}
      allowDeselect={false}
      onChange={(val) => onChange(val ?? "")}
    />
  );
}
