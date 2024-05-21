import { Howl } from "howler";
import { useEffect, useRef } from "react";
import { useStreamApiSocket } from "../../api/StreamAPI";

export interface TransmissionAudioProps {
  index: number;
}

export function TransmissionAudio({ index = -1 }: TransmissionAudioProps) {
  const { streamState } = useStreamApiSocket();
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
