import type { FormSchema } from "../components/form/types";
import { STATUS_OPTIONS } from "../constants/status";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Declarative definition of the Add/Edit Lead form consumed by FormBuilder. */
export const LEAD_FORM_SCHEMA: FormSchema = {
  fields: [
    { name: "name", label: "Name", type: "text", placeholder: "Full name", required: true, colSpan: 2 },
    { name: "company", label: "Company", type: "text", placeholder: "Company name", colSpan: 2 },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "name@company.com",
      colSpan: 1,
      validate: (value) => (value.trim() && !EMAIL_RE.test(value.trim()) ? "Enter a valid email." : null),
    },
    { name: "phone", label: "Phone", type: "tel", placeholder: "555-0100", colSpan: 1 },
    { name: "source", label: "Source", type: "text", placeholder: "e.g. Website Form", colSpan: 1 },
    { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, colSpan: 1 },
    {
      name: "notes",
      label: "Notes",
      type: "textarea",
      placeholder: "Add context, next steps, or reminders…",
      rows: 4,
      colSpan: 2,
    },
  ],
};
