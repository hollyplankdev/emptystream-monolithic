import styles from "./VolumeSlider.module.css"

export const VolumeSlider = () => {
    return (
        <div
            className={styles.container}
        >
            <input
                className={styles.slider}
                type="range"
                min={0}
                max={100}
                value={75}
            >
            </input>
        </div>
    );
}