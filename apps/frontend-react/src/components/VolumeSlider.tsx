import styles from "./VolumeSlider.module.css";

/** @returns A basic volume slider. */
export default function VolumeSlider() {
  return (
    <div className={styles.container}>
      <input
        className={styles.slider}
        type="range"
        min={0}
        max={100}
        value={75}
        onChange={() => {}}
      />
    </div>
  );
}
