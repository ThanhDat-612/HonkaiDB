"use client";
import { useState } from "react";
import styles from "../app/page.module.css";
import CharacterCard from "@/components/CharacterCard";
import CharacterDetailModal from "@/components/CharacterDetailModal";

export default function CharacterList({ characters }) {
  const [elementFilter, setElementFilter] = useState("all");
  const [pathFilter, setPathFilter] = useState("all");
  
  // State để lưu nhân vật đang được chọn để xem chi tiết
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const filteredCharacters = characters.filter((c) => {
    const elementMatch = elementFilter === "all" || c.element.toLowerCase() === elementFilter;
    const pathMatch = pathFilter === "all" || c.path.toLowerCase() === pathFilter;
    return elementMatch && pathMatch;
  });

  return (
    <div className={styles.div3}>
      {/* PHẦN LỌC (Giữ nguyên code cũ của bạn) */}
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <span>ELEMENT</span>
          {["fire", "ice", "lightning", "wind", "quantum", "imaginary", "physic"].map(el => (
            <img 
              key={el}
              src={`/elements/${el}.png`} 
              className={`${styles.filterIcon} ${elementFilter === el ? styles.active : ""}`}
              onClick={() => setElementFilter(el === elementFilter ? "all" : el)}
            />
          ))}
        </div>
        <div className={styles.filterGroup}>
          <span>PATH</span>
            {["destruction","hunt","erudition","harmony", "nihility","preservation","abundance","remembrance","elation"].map(path => (
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
          // Sử dụng Component CharacterCard và truyền sự kiện onClick
          <CharacterCard 
            key={c._id} 
            character={c} 
            onClick={() => setSelectedCharacter(c)} 
          />
        ))}
      </div>

      {/* MODAL CHI TIẾT: Chỉ hiển thị khi selectedCharacter khác null */}
      {selectedCharacter && (
        <CharacterDetailModal 
          character={selectedCharacter} 
          onClose={() => setSelectedCharacter(null)} 
        />
      )}
    </div>
  );
}