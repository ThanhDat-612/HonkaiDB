"use client";

import { useState } from "react";
import styles from "../app/page.module.css";
import CharacterCard from "@/components/CharacterCard";
import CharacterDetailModal from "@/components/CharacterDetailModal";

/**
 * Component hiển thị danh sách nhân vật với tính năng lọc theo Nguyên tố và Vận mệnh.
 *- Danh sách các nhân vật được truyền từ Server Component hoặc Parent.
 */
/**
 * @param {Object} props
 * @param {Array} props.characters - Danh sách nhân vật
 */
export default function CharacterList({ characters}) {
  // --- 1. STATE MANAGEMENT --- 
  const [elementFilter, setElementFilter] = useState("all");
  const [pathFilter, setPathFilter] = useState("all");
  
  // State lưu trữ nhân vật đang được chọn để hiển thị trong Modal
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // --- 2. LOGIC LỌC NHÂN VẬT ---
  const filteredCharacters = characters.filter((c) => {
    const elementMatch = elementFilter === "all" || c.element.toLowerCase() === elementFilter;
    const pathMatch = pathFilter === "all" || c.path.toLowerCase() === pathFilter;
    return elementMatch && pathMatch;
  });

  // Danh sách các giá trị để map (Giúp code gọn hơn và dễ sửa đổi)
  const elements = ["fire", "ice", "lightning", "wind", "quantum", "imaginary", "physical"];
  const paths = ["destruction", "hunt", "erudition", "harmony", "nihility", "preservation", "abundance", "remembrance", "elation"];

  return (
    <div className={styles.div3}>
      
      {/* --- PHẦN BỘ LỌC (FILTER SECTION) --- */}
      <div className={styles.filterSection}>
        
        {/* Lọc theo Nguyên tố (Element) */}
        <div className={styles.filterGroup}>
          <span>ELEMENT</span>
          {elements.map((el) => (
            <img 
              key={el}
              src={`/elements/${el}.webp`} 
              alt={el}
              className={`${styles.filterIcon} ${elementFilter === el ? styles.active : ""}`}
              // Nếu click vào icon đang active thì reset về "all"
              onClick={() => setElementFilter(el === elementFilter ? "all" : el)}
            />
          ))}
        </div>

        {/* Lọc theo Vận mệnh (Path) */}
        <div className={styles.filterGroup}>
          <span>PATH</span>
          {paths.map((path) => (
            <img
              key={path}
              src={`/paths/${path}.webp`}
              alt={path}
              className={`${styles.filterIcon} ${pathFilter === path ? styles.active : ""}`}
              onClick={() => setPathFilter(path === pathFilter ? "all" : path)}
            />
          ))}
        </div>
      </div>

      <hr className={styles.divider} /> {/* Ngăn cách giữa bộ lọc và danh sách (nếu cần) */}

      {/* --- DANH SÁCH NHÂN VẬT (CHARACTER GRID) --- */}
      <div className={styles.characterGrid}>
        {filteredCharacters.length > 0 ? (
          filteredCharacters.map((c) => (
            <CharacterCard 
              key={c._id} 
              character={c} 
              onClick={() => setSelectedCharacter(c)} 
            />
          ))
        ) : (
          <p className={styles.noResult}>Không tìm thấy nhân vật phù hợp.</p>
        )}
      </div>

      {/* --- MODAL CHI TIẾT (POPUP) --- */}
      {/* Chỉ render Modal khi có nhân vật được chọn (selectedCharacter !== null) */}
      {selectedCharacter && (
        <CharacterDetailModal 
          character={selectedCharacter} 
          onClose={() => setSelectedCharacter(null)} 
        />
      )}
    </div>
  );
}