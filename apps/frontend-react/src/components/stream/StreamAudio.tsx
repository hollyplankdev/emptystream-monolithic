import { Howl } from "howler";
import { useEffect, useRef } from "react";
import { useStreamSocket } from "../../hooks/useStreamSocket";

export interface StreamAudioProps {
  /**
   * The stem in the stream state to play audio for. If this is >= 0, then it's the index in the
   * tunings array to use. If this is < 0, then nothing will play.
   */
  index: number;
}

/**
 * @returns Plays audio from a specific tuning on `emptystream`'s state. Cross fades between stems
 *   as the stream state updates.
 */
export function StreamAudio({ index }: StreamAudioProps) {
  const { streamState } = useStreamSocket();
  const transmissionId = useRef<string>("");
  const transmissionStem = useRef<string>("");
  const howl = useRef<Howl | null>(null);

  useEffect(() => {
    // Transition audio when tunings change
    const transmission = streamState.tunings.get(index)?.transmission;
    if (!transmission) return;

    // If we are already tuned to this...
    if (
      transmission.id === transmissionId.current &&
      transmission.stem === transmissionStem.current
    ) {
      return;
    }

    // Update our cache of what we are
    transmissionId.current = transmission.id;
    transmissionStem.current = transmission.stem;

    // Create the new howler object representing the audio for the transmission
    const audioPath = `transmission/${transmission.id}/${transmission.stem}`;
    console.log(`Loading ${audioPath}`);
    const newAudio = new Howl({ src: [audioPath], format: "mp3", loop: true });
    newAudio.volume(0);
    newAudio.play();

    const fadeTime = 1000 * 1;
    const oldHowl = howl.current;
    if (oldHowl) {
      oldHowl.fade(1, 0, fadeTime);
      oldHowl.once("fade", () => {
        oldHowl.unload();
      });
    }

    howl.current = newAudio;
    newAudio.fade(0, 1, fadeTime);
  });

  return <div />;
}
