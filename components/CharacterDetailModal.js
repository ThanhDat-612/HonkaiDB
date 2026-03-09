"use client";

import { useState } from "react";
import styles from "../app/page.module.css";

/**
 * Component hiển thị Modal chi tiết thông tin nhân vật.
 */
export default function CharacterDetailModal({ character, onClose }) {
  const [buffed, setBuffed] = useState(false);
  const [lang, setLang] = useState("vi");
  const [openSection, setOpenSection] = useState(null);

  const currentKit = character.kits.find(k => 
    buffed ? k.type === "buffed" : k.type === "original"
  )?.skills || {};

  // --- LOGIC TỰ ĐỘNG HÓA ---
  
  // Chuyển tên nhân vật về dạng viết thường, không dấu cách để khớp với tên file ảnh
  // Ví dụ: "Kafka" -> "kafka", "Black Swan" -> "black_swan"
  const charId = character.name?.toLowerCase().replace(/\s+/g, '_');
  // Danh sách các loại kỹ năng để map
  const skillTypes = [
  { id: "basicAttack", folder: "basic-atk", file: "basic-atk" },
  { id: "skill", folder: "skill", file: "skill" },
  { id: "ultimate", folder: "ultimate", file: "ulti" },
  { id: "talent", folder: "talent", file: "talent" },
  { id: "technique", folder: "technique", file: "technique" }
];

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className={styles.detailHeaderSticky}>
          <div className={styles.headerLeft}>
            <h2>{character.name}</h2>
            <button onClick={() => setLang(lang === "en" ? "vi" : "en")}>
              Switch Language ({lang.toUpperCase()})
            </button>
            <span className={styles.rarity}>{"⭐".repeat(character.rarity)}</span>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.buffToggle}>
              <span>Buffed</span>
              <label className={styles.switch}>
                <input type="checkbox" checked={buffed} onChange={() => setBuffed(!buffed)} />
                <span className={styles.slider}></span>
              </label>
            </div>
            <button className={styles.closeBtnSmall} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* BODY: INFO & IMAGE */}
        <div className={styles.detailBodyTwoColumns}>
          <div className={styles.leftColumn}>
            <img src={character.image} className={styles.detailImageFull} alt={character.name} />
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.infoSection}>
              <h3>Stats {buffed ? "(Buffed)" : "(Normal)"}</h3>
              <div className={styles.statsGrid}>
                <p><strong>HP:</strong> {character.stats?.hp}</p>
                <p><strong>ATK:</strong> {character.stats?.atk}</p>
                <p><strong>DEF:</strong> {character.stats?.def}</p>
                <p><strong>SPD:</strong> {character.stats?.speed}</p>
              </div>
            </div>
            <div className={styles.infoSection}>
              <h3>Description</h3>
              <p className={styles.descText}>
                {character.description?.[lang] || "No description"}
              </p>
              <p className={styles.path}>
                {character.path } • {character.element}
              </p>
            </div>
          </div>
        </div>

        {/* --- ACCORDION SECTIONS --- */}

        {/* 1. SKILLS (Tự động lấy ảnh) */}
        <div className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => setOpenSection(openSection === "skills" ? null : "skills")}>
            <span>Skills</span>
            <span className={styles.arrow}>{openSection === "skills" ? "▼" : "▶"}</span>
          </div>

          {openSection === "skills" && (
            <div className={styles.sectionContent}>
              {skillTypes.map((skill) => {
                const skillData = currentKit?.[skill.id];
                if (!skillData) return null;
                 return (
                    <div key={skill.id} className={styles.skillRow}>
                      <div className={styles.skillImage}>
                        {/* Đường dẫn tự động: /skills/[loại]/[tên_nhân_vật].png */}
                        <img
                          src={`/skills/${skill.folder}/${charId}/${skill.file}_${charId}.png`}
                          alt={skill.id}
                        />
                      </div>
                      <div className={styles.skillInfo}>
                        <h4>{skillData.name?.[lang]}</h4>
                        {Array.isArray(skillData.description?.[lang]) ? (
                            skillData.description[lang].map((line, i) => (
                              <p key={i}>{line}</p>
                            ))
                          ) : (
                            <p>{skillData.description?.[lang]}</p>
                          )}
                      </div>
                    </div>
                 );
                })}
            </div>
          )}
        </div>

        {/* 2. TRACES (3 phần) */}
        <div className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => setOpenSection(openSection === "traces" ? null : "traces")}>
            <span>Traces</span>
            <span className={styles.arrow}>{openSection === "traces" ? "▼" : "▶"}</span>
          </div>

          {openSection === "traces" && (
            <div className={styles.sectionContent}>
              {character.traces?.map((trace,i) => (
                <div key={i} className={styles.skillRow}>
                  <div className={styles.skillImage}>
                    <img
                      src={`/traces/${charId}/trace_${i + 1}.png`}
                      alt={`Trace ${i + 1}`}
                    />
                  </div>
                  <div className={styles.skillInfo}>
                    <h4>Trace {i+1}</h4>
                    <p>{trace?.[lang]}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. EIDOLONS (6 phần) */}
        <div className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => setOpenSection(openSection === "eidolons" ? null : "eidolons")}>
            <span>Eidolons</span>
            <span className={styles.arrow}>{openSection === "eidolons" ? "▼" : "▶"}</span>
          </div>

          {openSection === "eidolons" && (
            <div className={styles.sectionContent}>
              {character.eidolons?.map((eidolon, i) => (
                <div key={i} className={styles.skillRow}>
                  <div className={styles.skillImage}>
                    <img
                      src={`/eidolons/${charId}/e${i + 1}.webp`}
                      alt={`Eidolon ${i + 1}`}
                    />
                  </div>
                  <div className={styles.skillInfo}>
                    <h4>Level {i + 1}</h4>
                    <p>{eidolon?.[lang]}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}