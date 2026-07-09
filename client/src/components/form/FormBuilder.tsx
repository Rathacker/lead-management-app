import { useCallback, useState, type FormEvent } from "react";
import { Button, Grid, Group, Stack } from "@mantine/core";
import type { FormSchema, FormValues } from "./types";
import { FIELD_REGISTRY } from "./registry";

interface FormBuilderProps {
  schema: FormSchema;
  initialValues: FormValues;
  submitLabel: string;
  submitting?: boolean;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
}

function validateField(
  field: FormSchema["fields"][number],
  value: string,
  values: FormValues,
): string | null {
  if (field.required && !value.trim()) return `${field.label} is required.`;
  if (field.validate) return field.validate(value, values);
  return null;
}

/**
 * Renders and validates a form from a JSON schema. Field rendering is delegated
 * to FIELD_REGISTRY, so this component knows nothing about concrete input types —
 * it only orchestrates state, validation, and layout.
 */
export function FormBuilder({
  schema,
  initialValues,
  submitLabel,
  submitting,
  onSubmit,
  onCancel,
}: FormBuilderProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const nextErrors: Record<string, string> = {};
      for (const field of schema.fields) {
        const error = validateField(field, values[field.name] ?? "", values);
        if (error) nextErrors[field.name] = error;
      }
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        return;
      }
      onSubmit(values);
    },
    [schema.fields, values, onSubmit],
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stack gap="md">
        <Grid gap="md">
          {schema.fields.map((field) => {
            const FieldComponent = FIELD_REGISTRY[field.type];
            const span = (field.colSpan ?? 2) === 1 ? 6 : 12;
            return (
              <Grid.Col span={{ base: 12, sm: span }} key={field.name}>
                <FieldComponent
                  field={field}
                  value={values[field.name] ?? ""}
                  error={errors[field.name] || undefined}
                  onChange={(value) => setValue(field.name, value)}
                />
              </Grid.Col>
            );
          })}
        </Grid>

        <Group justify="flex-end" gap="sm" mt="xs">
          <Button variant="default" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
