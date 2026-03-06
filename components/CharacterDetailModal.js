import { useState } from "react";
import styles from "../app/page.module.css";

export default function CharacterDetailModal({ character, onClose }) {

  const [buffed, setBuffed] = useState(false);

  const data = buffed
    ? character.versions?.buffed
    : character.versions?.normal;

  return (

    <div className={styles.modal} onClick={onClose}>

      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <div className={styles.detailHeader}>

          <h2>{character.name}</h2>

          <label className={styles.switch}>

            <input
              type="checkbox"
              checked={buffed}
              onChange={() => setBuffed(!buffed)}
            />

            <span className={styles.slider}></span>

          </label>

        </div>

        {/* IMAGE */}
        <div className={styles.detailBody}>

          <img
            src={character.image}
            className={styles.detailImage}
          />

          <div className={styles.stats}>

            <p>HP: {data?.hp}</p>
            <p>ATK: {data?.atk}</p>
            <p>DEF: {data?.def}</p>

            <p>{data?.description}</p>

          </div>

        </div>

        {/* CLOSE BUTTON */}
        <button className={styles.closeBtn} onClick={onClose}>
          Close
        </button>

      </div>

    </div>
  );
}