import type { ComponentType } from "react";
import type { FieldProps, FieldType } from "./types";
import { TextField } from "./fields/TextField";
import { SelectField } from "./fields/SelectField";
import { TextAreaField } from "./fields/TextAreaField";

/**
 * Maps a field `type` to its renderer. This is the plug-and-play seam:
 * support a new field type by writing a component and registering it here —
 * no changes to FormBuilder or any consuming form.
 */
export const FIELD_REGISTRY: Record<FieldType, ComponentType<FieldProps>> = {
  text: TextField,
  email: TextField,
  tel: TextField,
  select: SelectField,
  textarea: TextAreaField,
};
