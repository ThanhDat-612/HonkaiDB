import styles from "../app/page.module.css";

export default function CharacterCard({ character, onClick }) {

  return (
    <div className={styles.card} onClick={onClick}>

      {/* IMAGE */}
      <div className={styles.cardImage}>
        <img src={character.image} alt={character.name} />
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.rightContent}>

        <div className={styles.cardInfo}>
          <h3>{character.name}</h3>
          <p className={styles.rarity}>{"⭐".repeat(character.rarity)}</p>
        </div>

        <div className={styles.iconRow}>
          <img
            src={`/elements/${character.element.toLowerCase()}.png`}
            className={styles.icon}
          />

          <img
            src={`/paths/${character.path.toLowerCase()}.png`}
            className={styles.icon}
          />
        </div>

      </div>

    </div>
  );
}