"use client";

import { useState, useEffect } from "react";
import styles from "../app/page.module.css";
import SmartImage from "@/components/SmartImage";

export default function CharacterDetailModal({ character, onClose }) {
  const [buffed, setBuffed] = useState(false);
  const [lang, setLang] = useState("vi");
  const [openSection, setOpenSection] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [hasBuffedVersion, setHasBuffedVersion] = useState(false);

  // Kiểm tra xem nhân vật có phiên bản buffed không
  useEffect(() => {
    if (character?.kits) {
      const buffedKit = character.kits.find(k => k.type === "buffed");
      setHasBuffedVersion(!!buffedKit);
    }
  }, [character]);

  if (!character) return null;

  const kit = character.kits?.find(k =>
    buffed ? k.type === "buffed" : k.type === "original"
  );
  const characterVersion = kit?.version || "Unknown";

  const skills = kit?.skills || {};
  const charId = character.id;
  const stats = character.stats || {};

  // Hàm xử lý xuống dòng cho text
  const formatDescription = (text) => {
    if (!text) return "No description.";
    if (Array.isArray(text)) {
      return text.map((line, i) => <p key={i}>{line}</p>);
    }
    // Chia text theo \n và tạo mảng các đoạn
    return text.split('\n').map((line, i) => (
      <p key={i} style={{ margin: '0 0 8px 0' }}>{line}</p>
    ));
  };

  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  const renderSkillVariants = (skillKey, skillData) => {
    if (!skillData?.variants) return null;

    return Object.entries(skillData.variants).map(([variantKey, variant]) => {
      return (
        <div key={`${skillKey}-${variantKey}`} className={styles.skillRow}>
          
          <div className={styles.skillImage}>
            <SmartImage
              basePath={`/skills/${skillKey}/${charId}`}
              name="default"
              alt={variant.name?.[lang]}
              className={styles.skillIcon}
            />
          </div>

          <div className={styles.skillInfo}>
            <h4>{variant.name?.[lang] || variantKey}</h4>
            {formatDescription(variant.description?.[lang])}
          </div>

        </div>
      );
    });
  };

  const renderSkillCategory = () => {
    return Object.entries(skills).map(([skillKey, skillData]) => {
      return (
        <div key={skillKey}>
          <h3 className={styles.skillCategory}>
            {skillKey.replace(/([A-Z])/g, " $1").toUpperCase()}
          </h3>
          {renderSkillVariants(skillKey, skillData)}
        </div>
      );
    });
  };

  const renderListSection = (folder, list, labelPrefix) => {
    if (!list) return null;

    return Object.entries(list).map(([key, data]) => {
      const fileName =
        folder === "eidolons"
          ? `${key}`
          : folder === "traces"
          ? `${key}`
          : key;
      
      return (
        <div key={key} className={styles.skillRow}>
          <div 
            className={styles.skillImage}
            onClick={() => folder === "eidolons" && setEnlargedImage({
              src: `/${folder}/${charId}/${fileName}.png`,
              name: data.name?.[lang] || `${labelPrefix} ${key}`,
              description: data.description?.[lang] || "No description."
            })}
            style={{ cursor: folder === "eidolons" ? 'pointer' : 'default' }}
          >
            <SmartImage
              basePath={`/${folder}/${charId}`}
              name={fileName}
              alt={data.name?.[lang]}
              className={styles.skillIcon}
            />
            {folder === "eidolons" && (
              <div className={styles.imageZoomHint}>🔍</div>
            )}
          </div>

          <div className={styles.skillInfo}>
            <h4>{data.name?.[lang] || `${labelPrefix} ${key}`}</h4>
            {formatDescription(data.description?.[lang])}
          </div>
        </div>
      );
    });
  };

  const getElementShadowColor = (element) => {
    const elementColors = {
      wind: 'rgba(16, 185, 129, 1)',      // Xanh lá - gió
      lightning: 'rgba(213, 110, 255, 1)', // Tím sáng - sấm sét (đã đồng bộ với badge)
      fire: 'rgba(239, 68, 68, 1)',        // Đỏ - lửa
      ice: 'rgba(59, 130, 246, 1)',        // Xanh dương - băng
      quantum: 'rgba(145, 145, 255, 1)',   // Tím xanh - lượng tử (đã đồng bộ với badge)
      imaginary: 'rgba(251, 191, 36, 1)',  // Vàng - ảo
      physical: 'rgba(255, 255, 255, 1)'   // Trắng - vật lý
    };
    return elementColors[element?.toLowerCase()] || 'rgba(96, 165, 250, 1)';
  };

  const shadowColor = getElementShadowColor(character.element);

  // Hiển thị thông báo nếu bật buffed nhưng không có
  const renderBuffedWarning = () => {
    if (buffed && !hasBuffedVersion) {
      return (
        <div className={styles.buffedWarning}>
          <p>⚠️ This character doesn't have a buffed version yet.</p>
        </div>
      );
    }
    return null;
  };

  // Hàm lấy giá trị năng lượng (có thể là energy hoặc special)
  const getEnergyValue = () => {
    if (stats.energy) return { value: stats.energy, label: "Energy" };
    if (stats.special) return { value: stats.special, label: "Special" };
    return { value: "N/A", label: "Energy" };
  };

  const energyData = getEnergyValue();

  return (
    <div className={styles.modal} onClick={onClose}>
      <div 
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          boxShadow: `0 20px 40px ${shadowColor}40`
        }}
      >

        {/* HEADER */}
        <div className={styles.detailHeaderSticky}>
          <h2>{character.name}</h2>
          
          <div className={styles.headerControls}>
            <button 
              className={styles.langBtn}
              onClick={() => setLang(lang === "en" ? "vi" : "en")}
            >
              {lang.toUpperCase()}
            </button>

            {hasBuffedVersion && (
              <div className={styles.buffToggle}>
                <label htmlFor="buff-toggle">Buffed</label>
                <label className={styles.switch}>
                  <input
                    id="buff-toggle"
                    type="checkbox"
                    checked={buffed}
                    onChange={() => setBuffed(!buffed)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            )}

            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* BODY - TWO COLUMNS */}
        <div className={styles.detailBody}>
          
          {/* LEFT COLUMN */}
          <div className={styles.leftColumn}>
            <div 
              className={styles.imageContainer}
              // style={{ 
              //   boxShadow: `0 25px 50px -12px ${shadowColor}, 0 0 30px ${shadowColor.replace('1)', '0.6)')}, inset 0 1px 2px rgba(255,255,255,0.1)`
              // }}
              style={{ 
                boxShadow: `0 0 0 3px ${shadowColor}, 0 0 30px ${shadowColor}, 0 20px 40px rgba(0,0,0,0.5)`,
                border: 'none' // Bỏ border gốc vì đã có shadow làm viền
              }}
            >
              <img
                src={character.image}
                className={styles.detailImageFull}
                alt={character.name}
              />
            </div>
            
            {/* BASIC STATS */}
            <div className={styles.basicStatsCard}>
              <h3>Base Stats</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>HP</span>
                  <span className={styles.statValue}>{stats.hp || "N/A"}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>ATK</span>
                  <span className={styles.statValue}>{stats.atk || "N/A"}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>DEF</span>
                  <span className={styles.statValue}>{stats.def || "N/A"}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>SPD</span>
                  <span className={styles.statValue}>{stats.speed || "N/A"}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>{energyData.label}</span>
                  <span className={`${styles.statValue} ${styles.energy}`}>
                    {energyData.value}
                  </span>
                </div>
              </div>
              
              {/* ELEMENT & PATH BADGES */}
              <div className={styles.badgeContainer}>
                {character.element && (
                  <div 
                    className={styles.elementBadge}
                    data-element={character.element.toLowerCase()}
                  >
                    <img 
                      src={`/elements/${character.element.toLowerCase()}.png`} 
                      className={styles.elementIcon} 
                      alt={character.element} 
                    />
                    <span>{character.element}</span>
                  </div>
                )}
                {character.path && (
                  <div className={styles.pathBadge}>
                    <img 
                      src={`/paths/${character.path.toLowerCase()}.png`} 
                      className={styles.pathIcon} 
                      alt={character.path} 
                    />
                    <span>{character.path}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className={styles.rightColumn}>
            
            {/* DESCRIPTION */}
            <div className={styles.descriptionCard}>
              <div className={styles.descriptionHeader}>
                <h3>Character Story</h3>
              </div>
              
              <div className={styles.descriptionContent}>
                <div className={styles.descriptionText}>
                  {formatDescription(character.info?.[lang])}
                </div>
              </div>
              
              <div className={styles.descriptionFooter}>
                <div className={styles.descriptionTag}>
                  <span>📅 Version - {characterVersion}</span>
                </div>
              </div>
            </div>

            {/* Buffed Warning */}
            {renderBuffedWarning()}

            {/* SKILLS */}
            {skills && Object.keys(skills).length > 0 && (
              <div className={styles.section}>
                <div
                  className={styles.sectionHeader}
                  onClick={() =>
                    setOpenSection(openSection === "skills" ? null : "skills")
                  }
                >
                  Skills
                  <span className={styles.arrow}>{openSection === "skills" ? "▼" : "▶"}</span>
                </div>

                {openSection === "skills" && (
                  <div className={styles.sectionContent}>
                    {renderSkillCategory()}
                  </div>
                )}
              </div>
            )}

            {/* TRACES */}
            {character.traces && Object.keys(character.traces).length > 0 && (
              <div className={styles.section}>
                <div
                  className={styles.sectionHeader}
                  onClick={() =>
                    setOpenSection(openSection === "traces" ? null : "traces")
                  }
                >
                  Traces
                  <span className={styles.arrow}>{openSection === "traces" ? "▼" : "▶"}</span>
                </div>

                {openSection === "traces" && (
                  <div className={styles.sectionContent}>
                    {renderListSection("traces", character.traces, "Trace")}
                  </div>
                )}
              </div>
            )}

            {/* EIDOLONS */}
            {character.eidolons && Object.keys(character.eidolons).length > 0 && (
              <div className={styles.section}>
                <div
                  className={styles.sectionHeader}
                  onClick={() =>
                    setOpenSection(openSection === "eidolons" ? null : "eidolons")
                  }
                >
                  Eidolons
                  <span className={styles.arrow}>{openSection === "eidolons" ? "▼" : "▶"}</span>
                </div>

                {openSection === "eidolons" && (
                  <div className={styles.sectionContent}>
                    {renderListSection("eidolons", character.eidolons, "Eidolon")}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* ENLARGED IMAGE MODAL */}
        {enlargedImage && (
          <div className={styles.enlargedImageModal} onClick={closeEnlargedImage}>
            <div className={styles.enlargedImageContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeEnlargedBtn} onClick={closeEnlargedImage}>✕</button>
              <img src={enlargedImage.src} alt={enlargedImage.name} />
              <div className={styles.enlargedImageInfo}>
                <h3>{enlargedImage.name}</h3>
                <div className={styles.enlargedImageDescription}>
                  {formatDescription(enlargedImage.description)}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}