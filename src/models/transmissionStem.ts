/** All possible values for a TransmissionStem. */
export const ALL_TRANSMISSION_STEMS = ["source", "drums", "bass", "vocals", "other"] as const;

/** Allowed values for a transmission stem. */
export type TransmissionStem = (typeof ALL_TRANSMISSION_STEMS)[number];
