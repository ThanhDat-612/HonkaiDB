"use client";
import { useState } from "react";
import styles from "../app/page.module.css";

export default function CharacterList({ characters }) {
  const [elementFilter, setElementFilter] = useState("all");
  const [pathFilter, setPathFilter] = useState("all");

  const filteredCharacters = characters.filter((c) => {
    const elementMatch = elementFilter === "all" || c.element.toLowerCase() === elementFilter;
    const pathMatch = pathFilter === "all" || c.path.toLowerCase() === pathFilter;
    return elementMatch && pathMatch;
  });

  return (
    <div className={styles.div3}>
      {/* PHẦN LỌC */}
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <span>ELEMENT</span>
          {/* Thêm sự kiện onClick để thay đổi filter */}
          {["fire", "ice", "lightning", "wind", "quantum", "imaginary", "physic"].map(el => (
            <img 
              key={el}
              src={`/elements/${el}.png`} 
              className={`${styles.filterIcon} ${elementFilter === el ? styles.active : ""}`}
              onClick={() => setElementFilter(el === elementFilter ? "all" : el)}
            />
          ))}
        </div>
        {/* Tương tự cho Path... */}
        <div className={styles.filterGroup}>
          <span>PATH</span>
            {["destruction","thehunt","erudition","harmony", "nihility","preservation","abundance","remembrance","elation"].map(path => (
                <img
                  key={path}
                  src={`/paths/${path}.png`}
                  className={`${styles.filterIcon} ${pathFilter === path ? styles.active : ""}`}
                  onClick={() => setPathFilter(path === pathFilter ? "all" : path)}
                />
              ))}
        </div>
      </div>

      {/* HIỂN THỊ DANH SÁCH */}
      <div className={styles.characterGrid}>
        {filteredCharacters.map((c) => (
          <div key={c._id} className={styles.card}>
            <div className={styles.cardImage}>
              <img src={c.image} alt={c.name} />
            </div>
            <div className={styles.cardInfo}>
              <h3>{c.name}</h3>
              <p className={styles.rarity}>{"⭐".repeat(c.rarity)}</p>
            </div>
            <div className={styles.iconRow}>
              <img 
                src={`/elements/${c.element.toLowerCase()}.png`}
                className={styles.icon}
              />
              <img 
                src={`/paths/${c.path.toLowerCase()}.png`}
                className={styles.icon}
              />  
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}