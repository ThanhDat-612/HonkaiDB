"use client";

import { useState } from "react";
import styles from "../app/page.module.css";
import SmartImage from "@/components/SmartImage";

export default function CharacterDetailModal({ character, onClose }) {
  const [buffed, setBuffed] = useState(false);
  const [lang, setLang] = useState("vi");
  const [openSection, setOpenSection] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);

  if (!character) return null;

  const kit = character.kits?.find(k =>
    buffed ? k.type === "buffed" : k.type === "original"
  );
  const characterVersion = kit?.version || "Unknown";

  const skills = kit?.skills || {};
  const charId = character.id;
  const stats = character.stats || {};

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

            {Array.isArray(variant.description?.[lang]) ? (
              variant.description[lang].map((line, i) => <p key={i}>{line}</p>)
            ) : (
              <p>{variant.description?.[lang] || "No description."}</p>
            )}
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
            <p>{data.description?.[lang] || "No description."}</p>
          </div>
        </div>
      );
    });
  };

  const getElementShadowColor = (element) => {
    const elementColors = {
      wind: '#10b981',
      lightning: '#8b5cf6',
      fire: '#ef4444',
      ice: '#3b82f6',
      quantum: '#a855f7',
      imaginary: '#fbbf24',
      physical: '#6b7280'
    };
    return elementColors[element?.toLowerCase()] || '#3b82f6';
  };

  const shadowColor = getElementShadowColor(character.element);

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

            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* BODY - TWO COLUMNS */}
        <div className={styles.detailBody}>
          
          {/* LEFT COLUMN */}
          <div className={styles.leftColumn}>
            <div 
              className={styles.imageContainer}
              style={{ borderColor: shadowColor }}
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
                  <span className={styles.statValue}>{stats.hp || 1241}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>ATK</span>
                  <span className={styles.statValue}>{stats.atk || 698}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>DEF</span>
                  <span className={styles.statValue}>{stats.def || 363}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>SPD</span>
                  <span className={styles.statValue}>{stats.speed || 102}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Energy</span>
                  <span className={`${styles.statValue} ${styles.energy}`}>
                    {stats.energy || 140}
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
            
            {/* DESCRIPTION - ĐÃ ĐƯỢC CẢI THIỆN */}
            <div className={styles.descriptionCard}>
              <div className={styles.descriptionHeader}>
                <h3>Character Story</h3>
              </div>
              
              <div className={styles.descriptionContent}>
                <p className={styles.descriptionText}>
                  {character.info?.[lang] || ""}
                </p>
                
                {/* Optional: Thêm quote nếu muốn */}
                <div className={styles.descriptionQuote}>
                </div>
              </div>
              
              {/* Optional: Thêm thông tin thêm về nhân vật */}
              <div className={styles.descriptionFooter}>
                <div className={styles.descriptionTag}>
                  <span>📅 Version  - {characterVersion}</span>
                </div>
              </div>
            </div>

            {/* SKILLS */}
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

            {/* TRACES */}
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

            {/* EIDOLONS */}
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
                <p>{enlargedImage.description}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}