export const TREATMENT_TYPES = [
  "haircut",
  "colour",
  "blow_dry",
  "nails",
  "other",
] as const;

export type TreatmentType = (typeof TREATMENT_TYPES)[number];

export const TREATMENT_LABELS: Record<TreatmentType, string> = {
  haircut: "Haircut",
  colour: "Colour",
  blow_dry: "Blow Dry",
  nails: "Nails",
  other: "Other",
};

export type IntakeStatus =
  | "pending"
  | "offered"
  | "claimed"
  | "expired"
  | "cancelled";

export type SlotStatus = "open" | "offered" | "filled" | "cancelled";

export type MatchStatus = "offered" | "claimed" | "expired" | "declined";
