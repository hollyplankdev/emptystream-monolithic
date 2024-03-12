import { ChannelTuning } from "emptystream-shared-ts";
import { createClient } from "redis";
import { StreamWebSocketHandler } from "../websocket.js";

export default async function setupTuningsUpdatedEvent(
  handler: StreamWebSocketHandler,
  redisClient: ReturnType<typeof createClient>,
) {
  // Whenever the the tunings are updated...
  await redisClient.subscribe("tuningsUpdated", async (tuningsJSON) => {
    const tunings: ChannelTuning[] = JSON.parse(tuningsJSON);

    // Message every connected session that tuning has changed, and give tuning updates.
    await Promise.allSettled(
      handler.getSessions().map((session) =>
        session.messageClient({
          event: "tuning_changed",
          tuningUpdates: tunings,
        }),
      ),
    );
  });
}
