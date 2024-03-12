/** All possible values for a ChannelIndex. */
export const ALL_CHANNEL_INDEX = [0, 1, 2, 3] as const;

/** Allowed values for a transmission stem. */
export type ChannelIndex = (typeof ALL_CHANNEL_INDEX)[number];
