import { DbObject, ITransmission } from "@emptystream/shared";
import { Skeleton } from "@mantine/core";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";

export interface TransmissionStemPlayerProps {
  /**
   * OPTIONAL - The transmission containing the stem to play. If not provided, the component will
   * render as a skeleton.
   */
  transmission?: DbObject<ITransmission>;

  /** The name of the stem to present an audio player for. */
  stem: string;
}

/**
 * @returns An audio player configured to play specific stems from a Transmission. Supports being
 *   rendered as a skeleton.
 */
export default function TransmissionStemPlayer({
  transmission,
  stem,
}: TransmissionStemPlayerProps) {
  if (!transmission) return <Skeleton height={60} />;

  return (
    <AudioPlayer
      src={`transmission/${transmission._id}/${stem}`}
      showSkipControls={false}
      showJumpControls={false}
      autoPlayAfterSrcChange={false}
      layout="horizontal"
      timeFormat="mm:ss"
      customAdditionalControls={[]}
      customProgressBarSection={[RHAP_UI.CURRENT_TIME, RHAP_UI.PROGRESS_BAR]}
    />
  );
}
