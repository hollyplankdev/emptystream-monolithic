import styles from "./StreamImage.module.css";

/** @returns The image that `emptystream` is currently broadcasting. */
export default function StreamImage() {
  return (
    <div>
      <img className={styles.image} alt="" />
      <div className={styles.televisionOverlay} />
    </div>
  );
}
