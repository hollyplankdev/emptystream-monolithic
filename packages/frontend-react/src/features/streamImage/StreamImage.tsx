import styles from "./StreamImage.module.css"

export const StreamImage = () => {
    return (
        <div>
            <img className={styles.image}>
            </img>
            <div className={styles.televisionOverlay}></div>
        </div>
    );
}