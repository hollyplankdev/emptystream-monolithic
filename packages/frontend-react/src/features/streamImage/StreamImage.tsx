import styles from "./StreamImage.module.css";

export default function StreamImage() {
  return (
    <div>
      <img className={styles.image} alt="" />
      <div className={styles.televisionOverlay} />
    </div>
  );
}
