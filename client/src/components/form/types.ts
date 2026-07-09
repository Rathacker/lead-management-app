export type FieldType = "text" | "email" | "tel" | "select" | "textarea";

export interface FieldOption {
  value: string;
  label: string;
}

export type FormValues = Record<string, string>;

export interface FieldSchema {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  /** Options for `select` fields. */
  options?: FieldOption[];
  /** Rows for `textarea` fields. */
  rows?: number;
  /** Grid span within the form's 2-column layout. Defaults to 2 (full width). */
  colSpan?: 1 | 2;
  /** Custom validator; return an error message or null. Runs after `required`. */
  validate?: (value: string, values: FormValues) => string | null;
}

export interface FormSchema {
  fields: FieldSchema[];
}

/** Props every registered field component receives. */
export interface FieldProps {
  field: FieldSchema;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}
