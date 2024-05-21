import { useEffect } from "react";
import { animated, useSpring, easings } from "@react-spring/web";
import styles from "./StreamTuner.module.css";
import { useStreamSocket } from "../streamSocket/useStreamSocket";
import hashString from "../../utils/hashString";

export interface StreamTunerProps {
  index: number;
  holographic?: boolean;
}

export function StreamTuner({ index = -1, holographic = false }: StreamTunerProps) {
  const socketURL = "/stream";
  const { streamState } = useStreamSocket({ websocketURL: socketURL });
  const [springStyles, springApi] = useSpring(() => ({
    from: { left: "0%" },
    config: { duration: 1000 * 4, easing: easings.easeInOutSine },
  }));

  // Tween the Tuner Visual
  useEffect(() => {
    let newTuning = 0;

    // If this tuner is assigned to a specific index, get the tuning for that index.
    if (index >= 0) {
      const transmissionId = streamState.tunings.get(index)?.transmission.id;
      newTuning = transmissionId ? hashString(transmissionId, 4000) % 1000 : 0;
    }
    // If this tuner is NOT assigned to a specific index, get the global tuning.
    else {
      newTuning = 0;
      streamState.tunings.forEach((tuning) => {
        newTuning += hashString(tuning.transmission.id, 1000);
      });
      newTuning %= 1000;
    }

    // Tween to the correct position
    const tuningPercentage = (newTuning / 1000) * 100;
    springApi.start({ to: { left: `${tuningPercentage}%` } });
  });

  return (
    <div className={styles.container}>
      <div className={`${styles.sliderTrack} ${holographic ? styles.holographic : ""}`}>
        <animated.div className={styles.sliderThumb} style={springStyles} />
      </div>
    </div>
  );
}
