import { useMemo } from "react";
import { Drawer } from "@mantine/core";
import type { Lead, LeadInput, LeadStatus } from "../../types";
import type { FormValues } from "../form/types";
import { FormBuilder } from "../form/FormBuilder";
import { LEAD_FORM_SCHEMA } from "../../schemas/leadForm.schema";

interface LeadFormPanelProps {
  open: boolean;
  lead: Lead | null; // null => add mode
  submitting: boolean;
  onSubmit: (input: LeadInput) => void;
  onClose: () => void;
}

const BLANK: FormValues = { name: "", company: "", email: "", phone: "", source: "", status: "NEW", notes: "" };

function leadToValues(lead: Lead): FormValues {
  return {
    name: lead.name,
    company: lead.company ?? "",
    email: lead.email ?? "",
    phone: lead.phone ?? "",
    source: lead.source ?? "",
    status: lead.status,
    notes: lead.notes ?? "",
  };
}

function valuesToInput(values: FormValues): LeadInput {
  return {
    name: values.name.trim(),
    company: values.company.trim() || undefined,
    email: values.email.trim() || undefined,
    phone: values.phone.trim() || undefined,
    source: values.source.trim() || undefined,
    status: values.status as LeadStatus,
    notes: values.notes.trim() || undefined,
  };
}

export function LeadFormPanel({ open, lead, submitting, onSubmit, onClose }: LeadFormPanelProps) {
  const isEdit = !!lead;
  const initialValues = useMemo(() => (lead ? leadToValues(lead) : BLANK), [lead]);

  return (
    <Drawer
      opened={open}
      onClose={onClose}
      position="right"
      size={460}
      title={isEdit ? "Edit lead" : "Add lead"}
      overlayProps={{ backgroundOpacity: 0.4, blur: 1 }}
    >
      <FormBuilder
        key={lead ? lead.id : "new"}
        schema={LEAD_FORM_SCHEMA}
        initialValues={initialValues}
        submitLabel={isEdit ? "Save changes" : "Add lead"}
        submitting={submitting}
        onSubmit={(values) => onSubmit(valuesToInput(values))}
        onCancel={onClose}
      />
    </Drawer>
  );
}
