"use client";

import styles from "../app/page.module.css";

export function relicImg(relic) {
  return `/relics/${relic.rarity}/${relic.id}.webp`;
}

export function formatBonus(text) {
  if (!text) return null;
  return text.split(/(\[\[.*?\]\])/g).map((part, i) =>
    part.startsWith("[[") && part.endsWith("]]") ? (
      <span key={i} className={styles.relicHighlight}>{part.slice(2, -2)}</span>
    ) : part
  );
}

export default function RelicCard({ relic, lang = "vi", onClick }) {
  const isCavern = relic.type === "cavern";
  const nameStr  = relic.name?.[lang] || relic.name?.en || relic._id;

  return (
    <div
      className={`${styles.relicThumb} ${isCavern ? styles.relicCavern : styles.relicPlanar}`}
      onClick={onClick}
      title={nameStr}
    >
      <div className={styles.relicThumbImgWrapper}>
        <img
          src={relicImg(relic)}
          alt={nameStr}
          className={styles.relicThumbImg}
          loading="lazy"
          decoding="async"
          onError={(e) => { e.target.src = "/placeholder.webp"; }}
        />
        <div className={styles.relicGlow} />
      </div>
      <p className={styles.relicThumbName}>{nameStr}</p>
    </div>
  );
}